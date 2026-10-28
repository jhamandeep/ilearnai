import { useContext, useEffect, useState, type ReactNode } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'
const key = 'ilearnai:course-artwork-paused'
function readPaused() { try { return localStorage.getItem(key) === 'true' } catch { return false } }
export function ArtworkMotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(readPaused)
  const [reduced, setReduced] = useState(() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || document.visibilityState !== 'hidden')
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduced(preference.matches)
    const updateVisibility = () => setVisible(document.visibilityState !== 'hidden')
    preference.addEventListener('change', updateMotion); document.addEventListener('visibilitychange', updateVisibility)
    return () => { preference.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility) }
  }, [])
  function toggle() { setPaused(value => { try { localStorage.setItem(key, String(!value)) } catch { /* The control still works for this visit. */ } return !value }) }
  return <ArtworkMotionContext.Provider value={{ playing: !paused && !reduced && visible, paused, reduced, toggle }}>{children}</ArtworkMotionContext.Provider>
}
export function ArtworkMotionControl() {
  const { paused, reduced, toggle } = useContext(ArtworkMotionContext)
  return <button className="artwork-motion-control" type="button" onClick={toggle} disabled={reduced} aria-pressed={paused || reduced} aria-label={reduced ? 'Course artwork motion is off because of your reduced-motion preference' : paused ? 'Play course artwork' : 'Pause course artwork'} title={reduced ? 'Respects your reduced-motion preference' : paused ? 'Play course artwork' : 'Pause course artwork'}><span aria-hidden="true">{paused || reduced ? '▷' : 'Ⅱ'}</span><span>{reduced ? 'Motion off' : paused ? 'Play covers' : 'Pause covers'}</span></button>
}
