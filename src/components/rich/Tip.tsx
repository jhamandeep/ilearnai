import { useCallback, useRef, useState, type ReactNode } from 'react'

// A small hover tooltip anchored inside a `.rich-stage` (position: relative).
export function useTip() {
  const [tip, setTip] = useState<{ x: number; y: number; body: ReactNode } | null>(null)
  const host = useRef<HTMLDivElement>(null)
  const show = useCallback((e: { clientX: number; clientY: number }, body: ReactNode) => {
    const r = host.current?.getBoundingClientRect()
    if (!r) return
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, body })
  }, [])
  const hide = useCallback(() => setTip(null), [])
  const el = tip ? (
    <div className="rich-tip" role="status" style={{ left: tip.x, top: tip.y }}>
      {tip.body}
    </div>
  ) : null
  return { host, show, hide, el }
}
