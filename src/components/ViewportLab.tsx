import { useEffect, useRef, useState, type ReactNode } from 'react'

// Keep the actual lab mounted, but suspend its timer outside the viewport.
export function ViewportLab({ children }: { children: (active: boolean) => ReactNode }) {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [foreground, setForeground] = useState(true)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 })
    if (host.current) observer.observe(host.current)
    const visibility = () => setForeground(!document.hidden)
    visibility()
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  return <div className="homepage-gradient" ref={host}>{children(visible && foreground)}</div>
}
