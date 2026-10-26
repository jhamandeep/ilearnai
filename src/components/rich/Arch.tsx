import { useEffect, useMemo, useState } from 'react'
import { parseBlock } from './parse'
import { glyphFor } from './viz'
import { useTip } from './Tip'

// Layered architecture diagram with an animated request path.
//
// :::arch
// title: A chat app with retrieval
// layer: Users | Browser, Mobile app
// layer: Service | API server, Prompt builder
// layer: Models | LLM API
// layer: Data | Vector database, Postgres
// flow: Browser -> API server -> Vector database -> API server -> LLM API -> API server -> Browser
// note: Browser = What the user sees
// :::
interface Layer { name: string; boxes: string[] }

const BW = 164
const BH = 54
const GX = 22
const LABEL_W = 104
const ROW_H = 92
const PAD = 12

export function Arch({ src }: { src: string }) {
  const { title, layers, flow, notes } = useMemo(() => {
    const b = parseBlock(src)
    const layers: Layer[] = []
    let flow: string[] = []
    const notes: Record<string, string> = {}
    for (const l of b.lines) {
      let m = /^layer\s*:\s*([^|]+)\|(.*)$/.exec(l)
      if (m) { layers.push({ name: m[1].trim(), boxes: m[2].split(',').map((s) => s.trim()).filter(Boolean) }); continue }
      m = /^flow\s*:\s*(.*)$/.exec(l)
      if (m) { flow = m[1].split(/\s*(?:->|→)\s*/).map((s) => s.trim()).filter(Boolean); continue }
      m = /^note\s*:\s*([^=]+)=(.*)$/.exec(l)
      if (m) { notes[m[1].trim()] = m[2].trim(); continue }
    }
    return { title: b.title, layers, flow, notes }
  }, [src])

  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hover, setHover] = useState<string | null>(null)
  const tip = useTip()
  const hops = Math.max(0, flow.length - 1)
  useEffect(() => {
    if (!playing || hops === 0) return
    const id = setInterval(() => setStep((s) => (s + 1) % hops), 1700)
    return () => clearInterval(id)
  }, [playing, hops])

  if (layers.length === 0) return null
  const maxBoxes = Math.max(...layers.map((l) => l.boxes.length))
  const width = LABEL_W + maxBoxes * (BW + GX) - GX + PAD * 2
  const height = layers.length * ROW_H + PAD * 2
  const pos = (name: string) => {
    for (let r = 0; r < layers.length; r++) {
      const c = layers[r].boxes.indexOf(name)
      if (c >= 0) return { x: LABEL_W + PAD + c * (BW + GX), y: PAD + r * ROW_H + (ROW_H - BH) / 2 }
    }
    return null
  }
  const center = (name: string) => { const p = pos(name); return p ? { x: p.x + BW / 2, y: p.y + BH / 2 } : null }
  // One path per hop. Hops between boxes in the same row bow upward so they do
  // not run through boxes in between; vertical hops curve gently.
  const hopPath = (i: number) => {
    const a = center(flow[i])
    const b = center(flow[i + 1])
    if (!a || !b) return ''
    if (Math.abs(a.y - b.y) < 1) {
      const lift = Math.min(40, 18 + Math.abs(b.x - a.x) / 8)
      return `M ${a.x} ${a.y - BH / 2} C ${a.x} ${a.y - BH / 2 - lift}, ${b.x} ${b.y - BH / 2 - lift}, ${b.x} ${b.y - BH / 2}`
    }
    const down = b.y > a.y
    const y1 = down ? a.y + BH / 2 : a.y - BH / 2
    const y2 = down ? b.y - BH / 2 : b.y + BH / 2
    const my = (y1 + y2) / 2
    return `M ${a.x} ${y1} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${y2}`
  }
  const from = hops ? flow[step] : ''
  const to = hops ? flow[step + 1] : ''
  const visited = new Set(flow.slice(0, step + 1))
  const activePath = hops ? hopPath(step) : ''
  const note = notes[to] ?? notes[from] ?? ''

  return (
    <figure className="rich rich-arch">
      {title && <figcaption><span className="rich-kind">Architecture</span>{title}</figcaption>}
      <div className="rich-stage rich-scroll" ref={tip.host}>
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ width: "100%", maxWidth: width * 1.25 }} role="img" aria-label={title ?? 'Architecture diagram'} onPointerLeave={() => { setHover(null); tip.hide() }}>
          <defs>
            <marker id="ra-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="var(--primary)" /></marker>
            <marker id="ra-arrow-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="var(--text-dim)" opacity="0.5" /></marker>
            <linearGradient id="ra-box" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--surface)" /><stop offset="1" stopColor="var(--surface-2)" /></linearGradient>
            <filter id="ra-glow" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <pattern id="ra-grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.6" /></pattern>
          </defs>
          <rect x={0} y={0} width={width} height={height} fill="url(#ra-grid)" />
          {layers.map((l, r) => (
            <g key={l.name}>
              <rect x={PAD / 2} y={PAD + r * ROW_H + 4} width={width - PAD} height={ROW_H - 8} rx={12} className={r % 2 ? 'ra-band ra-band-alt' : 'ra-band'} />
              <text x={PAD + 8} y={PAD + r * ROW_H + ROW_H / 2} className="ra-layer" dominantBaseline="middle">{l.name.toUpperCase()}</text>
            </g>
          ))}
          {/* dim outline of every hop, so the whole route is visible before it animates */}
          {flow.slice(0, hops).map((_, i) => (
            <path key={'d' + i} d={hopPath(i)} className={i < step ? 'ra-hop ra-hop-done' : i === step ? 'ra-hop ra-hop-on' : 'ra-hop'} markerEnd={i <= step ? 'url(#ra-arrow)' : 'url(#ra-arrow-dim)'} />
          ))}
          {layers.map((l) => l.boxes.map((bx) => {
            const p = pos(bx)!
            const on = bx === from || bx === to
            const seen = visited.has(bx)
            const hov = hover === bx
            return (
              <g key={bx} transform={`translate(${p.x},${p.y})`} className={`ra-box ${on ? 'ra-on' : ''} ${seen ? 'ra-seen' : ''} ${hov ? 'ra-hov' : ''}`}
                onClick={() => { setPlaying(false); const i = flow.indexOf(bx); if (i >= 0) setStep(Math.min(i, hops - 1)) }}
                onPointerEnter={(e) => { setHover(bx); if (notes[bx]) tip.show(e, <><strong>{bx}</strong><span>{notes[bx]}</span></>) }}
                onPointerMove={(e) => { if (notes[bx]) tip.show(e, <><strong>{bx}</strong><span>{notes[bx]}</span></>) }}
                onPointerLeave={() => { setHover(null); tip.hide() }}
                style={{ cursor: hops ? 'pointer' : 'default' }}>
                <rect width={BW} height={BH} rx={10} className="ra-box-bg" filter={on ? 'url(#ra-glow)' : undefined} />
                <rect x={0} y={0} width={4} height={BH} rx={2} className="ra-box-tab" />
                <svg x={12} y={(BH - 22) / 2} width={22} height={22} viewBox="0 0 24 24" className="ra-glyph"><path d={glyphFor(bx)} /></svg>
                <text x={42} y={BH / 2} dominantBaseline="middle" className="ra-label">{bx.length > 17 ? bx.slice(0, 16) + '…' : bx}</text>
                <title>{notes[bx] ? `${bx} — ${notes[bx]}` : bx}</title>
              </g>
            )
          }))}
          {activePath && (
            <g key={step}>
              <circle r={4} className="ra-packet ra-packet-trail"><animateMotion dur="1.4s" begin="0.12s" repeatCount="1" fill="freeze" path={activePath} /></circle>
              <circle r={3} className="ra-packet ra-packet-trail2"><animateMotion dur="1.4s" begin="0.24s" repeatCount="1" fill="freeze" path={activePath} /></circle>
              <circle r={6.5} className="ra-packet"><animateMotion dur="1.4s" repeatCount="1" fill="freeze" path={activePath} /></circle>
            </g>
          )}
        </svg>
        {tip.el}
      </div>
      {hops > 0 && (
        <div className="rich-bar">
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s - 1 + hops) % hops) }} aria-label="Previous hop">←</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s + 1) % hops) }} aria-label="Next hop">→</button>
          <span className="rich-dots" aria-hidden="true">{flow.slice(0, hops).map((_, i) => <button key={i} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => { setPlaying(false); setStep(i) }} aria-label={`Hop ${i + 1}`} />)}</span>
          <span className="rich-caption"><strong>{step + 1}/{hops}</strong> {from} → {to}{note ? <span className="rich-note"> · {note}</span> : null}</span>
        </div>
      )}
    </figure>
  )
}
