import { useRef, useEffect, useState, type CSSProperties } from 'react'
import { useLabMotion } from '../lib/useLabMotion'

export interface LabVisualItem { label: string; value: number; display: string; detail?: string }
const colors = ['#4285f4', '#188038', '#9334e6', '#c26401', '#d93025', '#007b83']

// Animate inspection of the lab's real calculated results, never simulated KPIs.
export function LabVisual({ title, caption, items, mode = 'bars', maximum }: { title: string; caption: string; items: LabVisualItem[]; mode?: 'bars' | 'segments' | 'pipeline'; maximum?: number }) {
  const [playing, setPlaying] = useState(true)
  const [selected, setSelected] = useState(0)
  const motionRef = useRef<HTMLDivElement>(null)
  const motionActive = useLabMotion(motionRef, playing)
  const index = Math.min(selected, Math.max(0, items.length - 1))
  const current = items[index]
  const magnitude = (value: number) => Number.isFinite(value) ? Math.abs(value) : 0
  const ceiling = Math.max(1e-12, maximum !== undefined && Number.isFinite(maximum) ? maximum : Math.max(0, ...items.map((item) => magnitude(item.value))))
  const total = items.reduce((sum, item) => sum + Math.max(0, Number.isFinite(item.value) ? item.value : 0), 0) || 1
  useEffect(() => {
    if (!motionActive || items.length < 2) return
    const timer = window.setInterval(() => setSelected((value) => (value + 1) % items.length), 1600)
    return () => window.clearInterval(timer)
  }, [motionActive, items.length])
  const choose = (value: number) => { setPlaying(false); setSelected(value) }
  return (
    <div className="lab-visual" ref={motionRef} data-lab-visual={mode}>
      <header><div><span className="eyebrow">Explore the result</span><h3>{title}</h3></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? 'Pause tour' : 'Play tour'}</button></header>
      <p className="lab-visual-caption">{caption}</p>
      {mode === 'segments' && <div className="lab-probability-strip" aria-hidden="true">{items.map((item, i) => <span key={i} style={{ width: `${100 * Math.max(0, Number.isFinite(item.value) ? item.value : 0) / total}%`, background: colors[i % colors.length], opacity: index === i ? 1 : .55 }} />)}</div>}
      <div className={`lab-visual-items lab-visual-${mode}`}>
        {items.map((item, i) => <button type="button" key={i} className={index === i ? 'is-selected' : ''} onClick={() => choose(i)} aria-pressed={index === i} style={{ '--lab-color': colors[i % colors.length] } as CSSProperties}><span className="lab-visual-name">{item.label}</span>{mode === 'bars' && <span className="lab-visual-track"><span style={{ width: `${Math.min(100, 100 * magnitude(item.value) / ceiling)}%` }} /></span>}<strong>{item.display}</strong>{mode === 'pipeline' && i < items.length - 1 && <span className="lab-visual-arrow" aria-hidden="true">→</span>}</button>)}
      </div>
      {current ? <div className="lab-visual-detail" aria-live={playing ? 'off' : 'polite'}><span style={{ background: colors[index % colors.length] }} aria-hidden="true" /><p><strong>{current.label}: {current.display}.</strong> {current.detail ?? 'Change the controls to see this result update.'}</p></div> : <p className="lab-visual-detail">Add input to explore the result.</p>}
    </div>
  )
}
