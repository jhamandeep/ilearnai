import { useEffect, useMemo, useState } from 'react'
import { parseBlock, parseEdge } from './parse'

interface Node { id: string; col: number; row: number }
interface Edge { from: string; to: string; label: string }

const W = 150
const H = 46
const GX = 70
const GY = 26

export function Flow({ src }: { src: string }) {
  const { title, nodes, edges, cols } = useMemo(() => {
    const b = parseBlock(src)
    const edges: Edge[] = []
    const order: string[] = []
    for (const l of b.lines) {
      const e = parseEdge(l)
      if (!e) {
        if (!order.includes(l)) order.push(l)
        continue
      }
      edges.push(e)
      for (const id of [e.from, e.to]) if (!order.includes(id)) order.push(id)
    }
    const col = new Map<string, number>()
    for (const id of order) col.set(id, 0)
    for (let iter = 0; iter < order.length; iter++) {
      for (const e of edges) {
        if (order.indexOf(e.to) > order.indexOf(e.from)) col.set(e.to, Math.max(col.get(e.to)!, col.get(e.from)! + 1))
      }
    }
    const rowsPerCol = new Map<number, number>()
    const nodes: Node[] = order.map((id) => {
      const c = col.get(id)!
      const r = rowsPerCol.get(c) ?? 0
      rowsPerCol.set(c, r + 1)
      return { id, col: c, row: r }
    })
    const cols = nodes.length ? Math.max(...nodes.map((n) => n.col)) + 1 : 1
    return { title: b.title, nodes, edges, cols }
  }, [src])

  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  useEffect(() => {
    if (!playing || edges.length === 0) return
    const id = setInterval(() => setStep((s) => (s + 1) % edges.length), 1600)
    return () => clearInterval(id)
  }, [playing, edges.length])

  if (nodes.length === 0) return null
  const maxRows = Math.max(...nodes.map((n) => n.row)) + 1
  const width = cols * (W + GX) - GX + 20
  const height = maxRows * (H + GY) - GY + 20
  const pos = (id: string) => {
    const n = nodes.find((x) => x.id === id)!
    return { x: 10 + n.col * (W + GX), y: 10 + n.row * (H + GY) }
  }
  const path = (e: Edge) => {
    const a = pos(e.from)
    const b = pos(e.to)
    const y1 = a.y + H / 2
    const y2 = b.y + H / 2
    if (a.x === b.x) {
      const xr = a.x + W + 22
      return `M ${a.x + W} ${y1} C ${xr} ${y1}, ${xr} ${y2}, ${b.x + W} ${y2}`
    }
    const forward = b.x > a.x
    const x1 = forward ? a.x + W : a.x
    const x2 = forward ? b.x : b.x + W
    const dx = Math.abs(x2 - x1) / 2
    return `M ${x1} ${y1} C ${x1 + (forward ? dx : -dx)} ${y1}, ${x2 - (forward ? dx : -dx)} ${y2}, ${x2} ${y2}`
  }
  const active = edges[step]

  return (
    <figure className="rich rich-flow">
      {title && <figcaption>{title}</figcaption>}
      <div className="rich-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={title ?? 'Flow diagram'}>
          <defs>
            <marker id="rf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-dim)" /></marker>
            <marker id="rf-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--primary)" /></marker>
          </defs>
          {edges.map((e, i) => {
            const on = i === step
            return <path key={i} d={path(e)} fill="none" stroke={on ? 'var(--primary)' : 'var(--border)'} strokeWidth={on ? 2.5 : 1.5} markerEnd={on ? 'url(#rf-arrow-on)' : 'url(#rf-arrow)'} className="rf-edge" />
          })}
          {nodes.map((n) => {
            const p = pos(n.id)
            const on = active && (active.from === n.id || active.to === n.id)
            return (
              <g key={n.id} transform={`translate(${p.x},${p.y})`} onClick={() => { setPlaying(false); const i = edges.findIndex((e) => e.from === n.id); if (i >= 0) setStep(i) }} style={{ cursor: 'pointer' }}>
                <rect width={W} height={H} rx={9} fill={on ? 'var(--primary)' : 'var(--surface)'} stroke={on ? 'var(--primary)' : 'var(--border)'} strokeWidth={1.5} className={on ? 'rf-on' : ''} />
                <text x={W / 2} y={H / 2 + 5} textAnchor="middle" fontSize="13" fontWeight={600} fill={on ? 'var(--primary-text)' : 'var(--text)'}>{n.id.length > 20 ? n.id.slice(0, 19) + '…' : n.id}</text>
              </g>
            )
          })}
          {active && (
            <circle r={6} fill="var(--accent-inference)" stroke="#fff" strokeWidth={2} key={step}>
              <animateMotion dur="1.4s" repeatCount="1" fill="freeze" path={path(active)} />
            </circle>
          )}
        </svg>
      </div>
      {edges.length > 0 && (
        <div className="rich-bar">
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s - 1 + edges.length) % edges.length) }} aria-label="Previous step">←</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s + 1) % edges.length) }} aria-label="Next step">→</button>
          <span className="rich-caption"><strong>{step + 1}/{edges.length}</strong> {active?.from} → {active?.to}{active?.label ? `: ${active.label}` : ''}</span>
        </div>
      )}
    </figure>
  )
}
