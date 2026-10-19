import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Plan = 'monthly' | 'quarterly' | 'annual' | 'lifetime'

export interface Session {
  email: string
  plan: Plan | null
}

interface AuthContextValue {
  session: Session | null
  signIn: (email: string) => void
  signOut: () => void
  upgrade: (plan: Plan) => void
  isPro: boolean
}

const STORAGE_KEY = 'replica-fan.session'
const AuthContext = createContext<AuthContextValue | null>(null)

function load(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function save(session: Session | null) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable: session lives in memory only */
  }
}

// This is a client-side stand-in for the magic-link + bearer-token flow on the
// real site. Entitlement checks must move server-side before Pro content is real.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(load)

  useEffect(() => save(session), [session])

  const signIn = useCallback((email: string) => setSession({ email, plan: null }), [])
  const signOut = useCallback(() => setSession(null), [])
  const upgrade = useCallback(
    (plan: Plan) => setSession((s) => (s ? { ...s, plan } : { email: 'guest@example.com', plan })),
    [],
  )

  const value = useMemo(
    () => ({ session, signIn, signOut, upgrade, isPro: session?.plan != null }),
    [session, signIn, signOut, upgrade],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
