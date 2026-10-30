import { useSyncExternalStore } from 'react'

export type SceneAppearance = 'light' | 'dark'
type Scene = 'playground' | 'map'
const defaults: Record<Scene, SceneAppearance> = { playground: 'dark', map: 'light' }
const prefix = 'ilearnai:scene-background:'
const changedEvent = 'ilearnai:scene-background-change'
const sessionChoices = new Map<Scene, SceneAppearance>()

function read(scene: Scene): SceneAppearance {
  if (sessionChoices.has(scene)) return sessionChoices.get(scene)!
  try {
    const saved = window.localStorage.getItem(prefix + scene)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* Preferences still work for this session when storage is blocked. */ }
  return defaults[scene]
}

function subscribe(notify: () => void) {
  function storage(event: StorageEvent) {
    if (event.key && !event.key.startsWith(prefix)) return
    sessionChoices.clear()
    notify()
  }
  window.addEventListener(changedEvent, notify)
  window.addEventListener('storage', storage)
  return () => { window.removeEventListener(changedEvent, notify); window.removeEventListener('storage', storage) }
}

export function useSceneAppearance(scene: Scene) {
  const appearance = useSyncExternalStore(subscribe, () => read(scene), () => defaults[scene])
  function setAppearance(next: SceneAppearance) {
    sessionChoices.set(scene, next)
    try { window.localStorage.setItem(prefix + scene, next) } catch { /* Use the session choice. */ }
    window.dispatchEvent(new Event(changedEvent))
  }
  return [appearance, setAppearance] as const
}
