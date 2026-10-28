import type { ProgressStore } from './progress'

export type SyncStatus = 'saved' | 'saving' | 'offline'
export function createAccountProgress(userId: string, initial: Record<string, string>, csrfToken: string, report: (status: SyncStatus) => void) {
  const entries = new Map(Object.entries(initial))
  const pending = new Map<string, string | null>()
  const cacheKey = `ilearnai:pending:${userId}`
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? '{}') as Record<string, string | null>
    for (const [key, value] of Object.entries(cached)) if (/^(done:|activity:|work:|quiz:|exam:|placement$|last-lesson$)/.test(key) && (typeof value === 'string' || value === null)) pending.set(key, value)
    for (const [key, value] of pending) { if (value === null) entries.delete(key); else entries.set(key, value) }
  } catch { /* Server state remains available if browser storage is blocked. */ }
  let timer: ReturnType<typeof setTimeout> | undefined
  let saving: Promise<void> | undefined
  let disposed = false
  let inFlight: Record<string, string | null> = {}
  const persist = () => { try { if (pending.size || Object.keys(inFlight).length) localStorage.setItem(cacheKey, JSON.stringify({ ...inFlight, ...Object.fromEntries(pending) })); else localStorage.removeItem(cacheKey) } catch { /* Keep unsaved changes in memory. */ } }
  const flush = async (): Promise<void> => {
    if (saving) { await saving; if (pending.size) return flush(); return }
    if (disposed || !pending.size) return
    const batch = Object.fromEntries(pending)
    pending.clear()
    inFlight = batch
    persist()
    report('saving')
    saving = (async () => {
      try {
        const response = await fetch('/api/progress', { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken }, body: JSON.stringify({ changes: batch }) })
        if (!response.ok) throw new Error('Progress could not sync.')
        inFlight = {}
        persist()
        if (!disposed) report(pending.size ? 'saving' : 'saved')
      } catch (error) {
        for (const [key, value] of Object.entries(batch)) if (!pending.has(key)) pending.set(key, value)
        inFlight = {}
        persist()
        if (!disposed) report('offline')
        throw error
      } finally { saving = undefined }
    })()
    await saving
    if (pending.size && !disposed) return flush()
  }
  const queue = (key: string, value: string | null) => {
    pending.set(key, value)
    persist()
    report('saving')
    clearTimeout(timer)
    timer = setTimeout(() => { void flush().catch(() => {}) }, 600)
  }
  const store: ProgressStore = {
    get: (key) => entries.get(key) ?? null,
    set: (key, value) => { entries.set(key, value); queue(key, value) },
    remove: (key) => { entries.delete(key); queue(key, null) },
    keys: () => [...entries.keys()],
  }
  if (pending.size) timer = setTimeout(() => { void flush().catch(() => {}) }, 600)
  return { store, flush, dispose: () => { disposed = true; clearTimeout(timer); persist() } }
}

export function guestProgress(): ProgressStore {
  const values = new Map<string, string>()
  return { get: (key) => values.get(key) ?? null, set: (key, value) => { values.set(key, value) }, remove: (key) => { values.delete(key) }, keys: () => [...values.keys()] }
}

// Draft progress is local to this browser and never enters an account's queue.
export function createPreviewProgress(report: (status: SyncStatus) => void) {
  const cacheKey = 'ilearnai:preview-progress:v1'
  const entries = new Map<string, string>()
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? '{}') as Record<string, unknown>
    for (const [key, value] of Object.entries(cached)) if (/^(done:|activity:|work:|quiz:|exam:|placement$|last-lesson$)/.test(key) && typeof value === 'string') entries.set(key, value)
    report('saved')
  } catch { report('offline') }
  const persist = () => {
    try { localStorage.setItem(cacheKey, JSON.stringify(Object.fromEntries(entries))); report('saved'); return true }
    catch { report('offline'); return false }
  }
  const store: ProgressStore = {
    get: key => entries.get(key) ?? null,
    set: (key, value) => { entries.set(key, value); persist() },
    remove: key => { entries.delete(key); persist() },
    keys: () => [...entries.keys()],
  }
  return { store, flush: async () => { if (!persist()) throw new Error('Browser storage is unavailable.') }, dispose: () => {} }
}
