import { useEffect, useState, type RefObject } from 'react'

export function useLabMotion(ref: RefObject<HTMLDivElement | null>, playing: boolean, allowReducedMotion = false) {
  const [visible, setVisible] = useState(false)
  const [foreground, setForeground] = useState(true)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 })
    if (ref.current) observer.observe(ref.current)
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => { setForeground(!document.hidden); setReduced(query.matches) }
    sync()
    query.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); query.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync) }
  }, [ref])
  return playing && visible && foreground && (!reduced || allowReducedMotion)
}
