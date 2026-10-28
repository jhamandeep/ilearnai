// Learner progress uses the current account store and syncs to the server.
// Browser storage retains only pending changes for the same user.
//
// Keys:
//   done:<route>          "1" when the lesson at <route> is marked complete
//   activity:<route>#id  "1" when an activity is complete
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

// Guests start with an empty store. AuthProvider installs the signed-in user's store.
const memory = new Map<string, string>()
let store: ProgressStore = {
  get: key => memory.get(key) ?? null,
  set: (key, value) => { memory.set(key, value) },
  remove: key => { memory.delete(key) },
  keys: () => [...memory.keys()],
}
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

export function isActivityDone(route: string, id: string) {
  return isDone(route) || store.get(`activity:${route}#${id}`) === '1'
}
export function setActivityDone(route: string, id: string, done: boolean, allIds: string[]) {
  // Preserve previously completed lessons when a learner reopens one activity.
  if (isDone(route)) for (const activityId of allIds) store.set(`activity:${route}#${activityId}`, '1')
  if (done) store.set(`activity:${route}#${id}`, '1')
  else store.remove(`activity:${route}#${id}`)
  if (allIds.length > 0 && allIds.every(activityId => store.get(`activity:${route}#${activityId}`) === '1')) store.set(`done:${route}`, '1')
  else store.remove(`done:${route}`)
  emit()
}

export function recordLessonVisit(route: string, title: string) {
  store.set('last-lesson', JSON.stringify({ route, title, at: new Date().toISOString() })); emit()
}
export function lastLesson(): { route: string; title: string; at: string } | null {
  try {
    const value = JSON.parse(store.get('last-lesson') ?? 'null')
    return value && typeof value.route === 'string' && value.route.startsWith('/courses/') && typeof value.title === 'string' ? value : null
  } catch { return null }
}

export function isWorkReviewed(industry: string, useCase: string) { return store.get(`work:${industry}/${useCase}`) === '1' }
export function setWorkReviewed(industry: string, useCase: string, reviewed: boolean) {
  const key = `work:${industry}/${useCase}`
  if (reviewed) store.set(key, '1'); else store.remove(key)
  emit()
}
