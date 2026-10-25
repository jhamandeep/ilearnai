// Learner progress. Today this is stored in the browser (localStorage) so the
// site needs no account and no server. The ProgressStore interface is the one
// seam to replace when the site gets accounts: implement it against a database
// (or sync localStorage to one) and every page keeps working unchanged.
//
// Keys:
//   done:<route>          "1" when the lesson at <route> is marked complete
//   quiz:<route>#<n>      "score/total" for quiz block n in that lesson
//   exam:<id>             JSON { score, total, at } for a practice paper
//   placement             JSON { level, at } from the placement test
import { useSyncExternalStore } from 'react'

export interface ProgressStore {
  get(key: string): string | null
  set(key: string, value: string): void
  remove(key: string): void
  keys(): string[]
}

const PREFIX = 'ilearnai:'

const memory = new Map<string, string>()

function hasLocalStorage() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

const browserStore: ProgressStore = {
  get(key) {
    try { return hasLocalStorage() ? window.localStorage.getItem(PREFIX + key) : memory.get(key) ?? null } catch { return memory.get(key) ?? null }
  },
  set(key, value) {
    memory.set(key, value)
    try { if (hasLocalStorage()) window.localStorage.setItem(PREFIX + key, value) } catch { /* private mode or quota: keep the in-memory copy */ }
  },
  remove(key) {
    memory.delete(key)
    try { if (hasLocalStorage()) window.localStorage.removeItem(PREFIX + key) } catch { /* ignore */ }
  },
  keys() {
    try {
      if (!hasLocalStorage()) return [...memory.keys()]
      const out: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i)
        if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length))
      }
      return out
    } catch { return [...memory.keys()] }
  },
}

let store: ProgressStore = browserStore
export function setProgressStore(s: ProgressStore) { store = s; emit() }

// ---- change notification so React re-renders ----
const listeners = new Set<() => void>()
let version = 0
function emit() { version++; for (const l of listeners) l() }
function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l) } }
export function useProgressVersion() { return useSyncExternalStore(subscribe, () => version, () => 0) }

// ---- lessons ----
export function lessonRoute(track: string, module: string, lesson: string) { return `/courses/${track}/${module}/${lesson}` }
export function isDone(route: string) { return store.get('done:' + route) === '1' }
export function setDone(route: string, done: boolean) { if (done) store.set('done:' + route, '1'); else store.remove('done:' + route); emit() }

// ---- quizzes inside lessons ----
export function quizScore(route: string, n: number): { score: number; total: number } | null {
  const v = store.get(`quiz:${route}#${n}`)
  if (!v) return null
  const [s, t] = v.split('/').map(Number)
  return Number.isFinite(s) && Number.isFinite(t) ? { score: s, total: t } : null
}
export function setQuizScore(route: string, n: number, score: number, total: number) { store.set(`quiz:${route}#${n}`, `${score}/${total}`); emit() }

// ---- practice papers ----
export interface ExamResult { score: number; total: number; at: string }
export function examResult(id: string): ExamResult | null {
  const v = store.get('exam:' + id)
  if (!v) return null
  try { return JSON.parse(v) as ExamResult } catch { return null }
}
export function setExamResult(id: string, r: ExamResult) { store.set('exam:' + id, JSON.stringify(r)); emit() }

export function placement(): { level: string; at: string } | null {
  const v = store.get('placement')
  if (!v) return null
  try { return JSON.parse(v) as { level: string; at: string } } catch { return null }
}
export function setPlacement(level: string) { store.set('placement', JSON.stringify({ level, at: new Date().toISOString() })); emit() }

export function resetProgress() { for (const k of store.keys()) store.remove(k); emit() }

export function doneCount(routes: string[]) { return routes.filter(isDone).length }
