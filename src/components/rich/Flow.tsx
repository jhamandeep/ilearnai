import { useId, useEffect, useMemo, useState } from 'react'
import { parseBlock, parseEdge } from './parse'
import { glyphFor } from './viz'
import { useTip } from './Tip'

interface Node { id: string; col: number; row: number }
interface Edge { from: string; to: string; label: string }
interface Pos { x: number; y: number; band: number; col: number }

const W = 164
const H = 54
const GX = 84
const GY = 30
const PAD = 14
const MAXC = 3 // columns per band; longer flows snake into the next band
const BAND_GAP = 52

export function Flow({ src }: { src: string }) {
  const svgId = 'rf-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const { title, nodes, edges, cols } = useMemo(() => {
    const b = parseBlock(src)
    const edges: Edge[] = []
    const order: string[] = []
    for (const l of b.lines) {
      const e = parseEdge(l)
      if (!e) { if (!order.includes(l)) order.push(l); continue }
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
  const [hover, setHover] = useState<string | null>(null)
  const tip = useTip()
  useEffect(() => {
    if (!playing || edges.length === 0) return
    const id = setInterval(() => setStep((s) => (s + 1) % edges.length), 1700)
    return () => clearInterval(id)
  }, [playing, edges.length])

  if (nodes.length === 0) return null
  // serpentine layout: band 0 runs left to right, band 1 right to left, and so on
  const bands = Math.ceil(cols / MAXC)
  const rowsInBand: number[] = []
  for (let b = 0; b < bands; b++) rowsInBand.push(Math.max(1, ...nodes.filter((n) => Math.floor(n.col / MAXC) === b).map((n) => n.row + 1)))
  const bandY: number[] = []
  let yAcc = PAD
  for (let b = 0; b < bands; b++) { bandY.push(yAcc); yAcc += rowsInBand[b] * (H + GY) - GY + BAND_GAP }
  const width = Math.min(cols, MAXC) * (W + GX) - GX + PAD * 2
  const height = yAcc - BAND_GAP + PAD
  const pos = (id: string): Pos => {
    const n = nodes.find((x) => x.id === id)!
    const band = Math.floor(n.col / MAXC)
    const k = n.col - band * MAXC
    const ci = band % 2 ? MAXC - 1 - k : k
    return { x: PAD + ci * (W + GX), y: bandY[band] + n.row * (H + GY), band, col: n.col }
  }
  const path = (e: Edge) => {
    const a = pos(e.from)
    const b = pos(e.to)
    const y1 = a.y + H / 2
    const y2 = b.y + H / 2
    if (a.col === b.col) {
      // same column: loop out to the side
      const xr = a.x + W + 30
      return `M ${a.x + W} ${y1} C ${xr} ${y1}, ${xr} ${y2}, ${b.x + W} ${y2}`
    }
    if (a.band !== b.band) {
      // band change: drop (or rise) from the middle of one box to the middle of the next
      const down = b.band > a.band
      const off = down ? -14 : 14 // keep a down edge and its return edge apart
      const x1 = a.x + W / 2 + off
      const x2 = b.x + W / 2 + off
      const ya = down ? a.y + H : a.y
      const yb = down ? b.y : b.y + H
      const my = (ya + yb) / 2
      return `M ${x1} ${ya} C ${x1} ${my}, ${x2} ${my}, ${x2} ${yb}`
    }
    if (b.col < a.col) {
      // backward edge inside a band: arc below the boxes so it never crosses the forward path
      const dip = Math.max(a.y, b.y) + H + 26
      return `M ${a.x + W / 2} ${a.y + H} C ${a.x + W / 2} ${dip}, ${b.x + W / 2} ${dip}, ${b.x + W / 2} ${b.y + H}`
    }
    // forward edge: leave the side that faces the next box
    const rightward = b.x > a.x
    const x1 = rightward ? a.x + W : a.x
    const x2 = rightward ? b.x : b.x + W
    const dx = Math.max(24, Math.abs(x2 - x1) / 2) * (rightward ? 1 : -1)
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
  }
  const mid = (e: Edge): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } => {
    const a = pos(e.from)
    const b = pos(e.to)
    if (a.col === b.col) return { x: a.x + W + 26, y: (a.y + b.y) / 2 + H / 2, anchor: 'middle' }
    if (a.band !== b.band) {
      const x = (a.x + b.x) / 2 + W / 2
      const down = b.band > a.band
      const y = ((down ? a.y + H : a.y) + (down ? b.y : b.y + H)) / 2 + (down ? -8 : 8)
      return x > width / 2 ? { x: x - 22, y, anchor: 'end' } : { x: x + 22, y, anchor: 'start' }
    }
    if (b.col < a.col) return { x: (a.x + b.x) / 2 + W / 2, y: Math.max(a.y, b.y) + H + 20, anchor: 'middle' }
    const x1 = Math.min(a.x, b.x) + W
    const x2 = Math.max(a.x, b.x)
    return { x: (x1 + x2) / 2, y: (a.y + b.y) / 2 + H / 2 - 10, anchor: 'middle' }
  }
  const active = edges[step]
  const visitedNodes = new Set(edges.slice(0, step + 1).flatMap((e) => [e.from, e.to]))
  const hoverEdge = (e: Edge) => hover !== null && (e.from === hover || e.to === hover)
  const hasBackward = edges.some((e) => { const a = pos(e.from); const b = pos(e.to); return a.band === b.band && b.col < a.col && a.band === bands - 1 })
  const fullHeight = height + (hasBackward ? 30 : 0)

  return (
    <figure className="rich rich-flow">
      {title && <figcaption><span className="rich-kind">Flow</span>{title}</figcaption>}
      <div className="rich-stage rich-scroll" ref={tip.host}>
        <svg viewBox={`-96 -24 ${width + 192} ${fullHeight + 64}`} width={width + 192} height={fullHeight + 64} style={{ width: '100%', maxWidth: (width + 192) * 1.25 }} role="img" aria-label={title ?? 'Flow diagram'} onPointerLeave={() => { setHover(null); tip.hide() }}>
          <defs>
            <marker id={`${svgId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="var(--text-dim)" opacity="0.6" /></marker>
            <marker id={`${svgId}-arrow-on`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="var(--primary)" /></marker>
            <filter id={`${svgId}-glow`} x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <pattern id={`${svgId}-grid`} width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.6" /></pattern>
          </defs>
          <rect x={0} y={0} width={width} height={fullHeight} fill={`url(#${svgId}-grid)`} />
          {edges.map((e, i) => {
            const on = i === step
            const cls = on ? 'ra-hop ra-hop-on' : i < step ? 'ra-hop ra-hop-done' : hoverEdge(e) ? 'ra-hop ra-hop-hov' : 'ra-hop'
            return <path key={i} d={path(e)} className={cls} markerEnd={on || i < step ? `url(#${svgId}-arrow-on)` : `url(#${svgId}-arrow)`} />
          })}
          {edges.map((e, i) => {
            if (!e.label) return null
            const m = mid(e)
            const on = i === step
            const short = e.label.length > 26 ? e.label.slice(0, 25) + '…' : e.label
            return (
              <text key={'l' + i} x={m.x} y={m.y} textAnchor={m.anchor} dominantBaseline="middle" className={on ? 'rf-elabel rf-elabel-on' : 'rf-elabel'}>{short}</text>
            )
          })}
          {nodes.map((n) => {
            const p = pos(n.id)
            const on = active && (active.from === n.id || active.to === n.id)
            const seen = visitedNodes.has(n.id)
            return (
              <g key={n.id} transform={`translate(${p.x},${p.y})`} className={`ra-box ${on ? 'ra-on' : ''} ${seen ? 'ra-seen' : ''} ${hover === n.id ? 'ra-hov' : ''}`}
                onClick={() => { setPlaying(false); const i = edges.findIndex((e) => e.from === n.id); if (i >= 0) setStep(i) }}
                onPointerEnter={(e) => { setHover(n.id); const outs = edges.filter((x) => x.from === n.id); if (outs.length) tip.show(e, <><strong>{n.id}</strong><span>{outs.map((o) => `→ ${o.to}${o.label ? ': ' + o.label : ''}`).join('\n')}</span></>) }}
                onPointerLeave={() => { setHover(null); tip.hide() }}
                style={{ cursor: 'pointer' }}>
                <rect width={W} height={H} rx={10} className="ra-box-bg" filter={on ? `url(#${svgId}-glow)` : undefined} />
                <rect x={0} y={0} width={4} height={H} rx={2} className="ra-box-tab" />
                <svg x={12} y={(H - 22) / 2} width={22} height={22} viewBox="0 0 24 24" className="ra-glyph"><path d={glyphFor(n.id)} /></svg>
                <text x={42} y={H / 2} dominantBaseline="middle" className="ra-label">{n.id.length > 17 ? n.id.slice(0, 16) + '…' : n.id}</text>
                <title>{n.id}</title>
              </g>
            )
          })}
          {active && (
            <g key={step}>
              <circle r={4} className="ra-packet ra-packet-trail"><animateMotion dur="1.4s" begin="0.12s" repeatCount="1" fill="freeze" path={path(active)} /></circle>
              <circle r={3} className="ra-packet ra-packet-trail2"><animateMotion dur="1.4s" begin="0.24s" repeatCount="1" fill="freeze" path={path(active)} /></circle>
              <circle r={6.5} className="ra-packet"><animateMotion dur="1.4s" repeatCount="1" fill="freeze" path={path(active)} /></circle>
            </g>
          )}
        </svg>
        {tip.el}
      </div>
      {edges.length > 0 && (
        <div className="rich-bar">
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s - 1 + edges.length) % edges.length) }} aria-label="Previous step">←</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s + 1) % edges.length) }} aria-label="Next step">→</button>
          <span className="rich-dots" aria-label="Flow steps">{edges.map((_, i) => <button key={i} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => { setPlaying(false); setStep(i) }} aria-label={`Step ${i + 1}`} />)}</span>
          <span className="rich-caption"><strong>{step + 1}/{edges.length}</strong> {active?.from} → {active?.to}{active?.label ? <span className="rich-note"> · {active.label}</span> : null}</span>
        </div>
      )}
      <details className="diagram-outline"><summary>Explore all {edges.length} connections</summary><ol>{edges.map((edge, i) => <li key={i}><button type="button" onClick={() => { setPlaying(false); setStep(i) }} aria-current={i === step ? 'step' : undefined}><span>{edge.from} → {edge.to}</span>{edge.label && <span className="meta">{edge.label}</span>}</button></li>)}</ol></details>
    </figure>
  )
}
