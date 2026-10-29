import { useContext, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'
const key = 'ilearnai:course-artwork-paused'
function readPaused() { try { return localStorage.getItem(key) === 'true' } catch { return false } }
function subscribeMotion(notify: () => void) {
  const query = matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}
function subscribeVisibility(notify: () => void) {
  document.addEventListener('visibilitychange', notify)
  return () => document.removeEventListener('visibilitychange', notify)
}
export function ArtworkMotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(readPaused)
  const reduced = useSyncExternalStore(subscribeMotion, () => matchMedia('(prefers-reduced-motion: reduce)').matches, () => false)
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState !== 'hidden', () => true)
  function toggle() { setPaused(value => { try { localStorage.setItem(key, String(!value)) } catch { /* The control still works for this visit. */ } return !value }) }
  return <ArtworkMotionContext.Provider value={{ playing: !paused && !reduced && visible, paused, reduced, toggle }}>{children}</ArtworkMotionContext.Provider>
}
export function ArtworkMotionControl() {
  const { paused, reduced, toggle } = useContext(ArtworkMotionContext)
  return <button className="artwork-motion-control" type="button" onClick={toggle} disabled={reduced} aria-pressed={paused || reduced} aria-label={reduced ? 'Visual motion is off because of your reduced-motion preference' : paused ? 'Play visual motion' : 'Pause visual motion'} title={reduced ? 'Respects your reduced-motion preference' : paused ? 'Play visual motion' : 'Pause visual motion'}><span aria-hidden="true">{paused || reduced ? '▷' : 'Ⅱ'}</span><span>{reduced ? 'Motion off' : paused ? 'Play motion' : 'Pause motion'}</span></button>
}
