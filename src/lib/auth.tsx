import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { replaceTracks, resetTracks } from '../data/tracks'
import type { Track } from '../data/types'
import { setProgressStore } from './progress'
import { createAccountProgress, createPreviewProgress, guestProgress, type SyncStatus } from './accountProgress'

export interface User { id: string; name: string; email: string; createdAt: string }
interface Session { preview?: boolean; user: User | null; csrfToken: string | null; progress: Record<string, string> }
export interface AuthState {
  preview: boolean
  user: User | null
  loading: boolean
  syncStatus: SyncStatus
  serviceError: string
  curriculumVersion: number
  signIn: (values: { name?: string; email: string; password: string }, register: boolean) => Promise<void>
  signOut: () => Promise<void>
  retrySync: () => Promise<void>
}
export const AuthContext = createContext<AuthState>({ preview: false, user: null, loading: false, syncStatus: 'saved', serviceError: '', curriculumVersion: 0, signIn: async () => { throw new Error('Account service is unavailable.') }, signOut: async () => {}, retrySync: async () => {} })
export const useAuth = () => useContext(AuthContext)

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...options })
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The account server is unavailable. Please try again.')
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? 'The request could not be completed.')
  return data
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [preview, setPreview] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('saved')
  const [serviceError, setServiceError] = useState('')
  const [curriculumVersion, setCurriculumVersion] = useState(0)
  const session = useRef<Session | null>(null)
  const progress = useRef<ReturnType<typeof createAccountProgress> | null>(null)
  const activate = async (data: Session, signal?: AbortSignal) => {
    const openPreview = data.preview === true
    setPreview(openPreview)
    if ((data.user && data.csrfToken) || openPreview) {
      const curriculum = await api('/api/curriculum', { signal }) as { tracks: Track[] }
      if (signal?.aborted) return
      replaceTracks(curriculum.tracks)
      setCurriculumVersion(value => value + 1)
      progress.current?.dispose()
      setSyncStatus('saved')
      const next = data.user && data.csrfToken ? createAccountProgress(data.user.id, data.progress, data.csrfToken, setSyncStatus) : createPreviewProgress(setSyncStatus)
      progress.current = next
      setProgressStore(next.store)
    } else {
      progress.current?.dispose(); progress.current = null
      resetTracks(); setProgressStore(guestProgress()); setSyncStatus('saved')
    }
    session.current = data
    setUser(data.user)
    setServiceError('')
  }
  useEffect(() => {
    const controller = new AbortController()
    void api('/api/auth/session', { signal: controller.signal }).then((data: Session) => activate(data, controller.signal)).catch((error: Error) => {
      if (!controller.signal.aborted) { setServiceError(error.message); setProgressStore(guestProgress()) }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => { controller.abort(); progress.current?.dispose() }
  }, [])
  useEffect(() => {
    let pending: AbortController | null = null
    const refresh = () => {
      if (!session.current?.preview && !session.current?.user) return
      const activeSession = session.current
      pending?.abort()
      const controller = new AbortController()
      pending = controller
      void api('/api/curriculum', { signal: controller.signal }).then((curriculum: { tracks: Track[] }) => {
        if (controller.signal.aborted || session.current !== activeSession) return
        replaceTracks(curriculum.tracks)
        setCurriculumVersion(value => value + 1)
      }).catch(() => { /* Keep the last loaded content if a development refresh fails. */ })
    }
    window.addEventListener('ilearnai:curriculum-changed', refresh)
    return () => { pending?.abort(); window.removeEventListener('ilearnai:curriculum-changed', refresh) }
  }, [])
  const signIn: AuthState['signIn'] = async (values, register) => {
    const data = await api(register ? '/api/auth/register' : '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }) as Session
    await activate(data)
    setLoading(false)
  }
  const signOut = async () => {
    await progress.current?.flush().catch(() => {})
    await api('/api/auth/logout', { method: 'POST', headers: { 'X-CSRF-Token': session.current?.csrfToken ?? '' } })
    await activate({ user: null, csrfToken: null, progress: {}, preview })
  }
  return <AuthContext.Provider value={{ preview, user, loading, syncStatus, serviceError, curriculumVersion, signIn, signOut, retrySync: async () => { await progress.current?.flush() } }}>{children}</AuthContext.Provider>
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { preview, user, loading, serviceError } = useAuth()
  const location = useLocation()
  if (loading) return <div className="account-loading" role="status">Opening your learning workspace…</div>
  if (preview && serviceError) return <section className="account-unavailable"><h1>Could not load the learning content</h1><p>{serviceError}</p><button className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button></section>
  if (preview) return <>{children}</>
  if (!user && serviceError) return <section className="account-unavailable"><h1>Sign in to keep learning</h1><p>{serviceError}</p><Link className="btn btn-primary" to={`/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`}>Open sign in</Link></section>
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`} replace />
  return <>{children}</>
}
