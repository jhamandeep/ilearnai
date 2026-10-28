import { useEffect, useRef } from 'react'

export function CountUp({ to, duration = 900, suffix = '' }: { to: number; duration?: number; suffix?: string }) {
  const value = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const element = value.current
    if (!element) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    const finish = () => { cancelAnimationFrame(raf); element.textContent = to.toLocaleString() }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { finish(); return }
      observer.disconnect()
      if (motion.matches || duration <= 0) { finish(); return }
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        element.textContent = Math.round(to * eased).toLocaleString()
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    })
    const onMotionChange = () => { if (motion.matches) finish() }
    const onVisibility = () => { if (document.hidden) finish() }
    observer.observe(element)
    motion.addEventListener('change', onMotionChange)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
      motion.removeEventListener('change', onMotionChange)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [to, duration])
  return <><span ref={value} aria-hidden="true">{to.toLocaleString()}</span><span className="sr-only">{to.toLocaleString()}</span>{suffix}</>
}
