import { useEffect, useMemo, useState } from 'react'
import { parseBlock } from './parse'

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

const BW = 150
const BH = 44
const GX = 18
const LABEL_W = 96
const ROW_H = 74

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
  const hops = Math.max(0, flow.length - 1)
  useEffect(() => {
    if (!playing || hops === 0) return
    const id = setInterval(() => setStep((s) => (s + 1) % hops), 1500)
    return () => clearInterval(id)
  }, [playing, hops])

  if (layers.length === 0) return null
  const maxBoxes = Math.max(...layers.map((l) => l.boxes.length))
  const width = LABEL_W + maxBoxes * (BW + GX) + 10
  const height = layers.length * ROW_H + 10
  const pos = (name: string) => {
    for (let r = 0; r < layers.length; r++) {
      const c = layers[r].boxes.indexOf(name)
      if (c >= 0) return { x: LABEL_W + c * (BW + GX), y: 10 + r * ROW_H + (ROW_H - BH) / 2 }
    }
    return null
  }
  const from = hops ? flow[step] : ''
  const to = hops ? flow[step + 1] : ''
  const a = pos(from)
  const bpos = pos(to)
  const path = a && bpos ? `M ${a.x + BW / 2} ${a.y + BH / 2} L ${bpos.x + BW / 2} ${bpos.y + BH / 2}` : ''

  return (
    <figure className="rich rich-arch">
      {title && <figcaption>{title}</figcaption>}
      <div className="rich-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={title ?? 'Architecture diagram'}>
          {layers.map((l, r) => (
            <g key={l.name}>
              <rect x={4} y={10 + r * ROW_H} width={width - 8} height={ROW_H - 8} rx={10} fill={r % 2 ? 'var(--surface-2)' : 'transparent'} stroke="var(--border)" strokeDasharray="4 4" />
              <text x={14} y={10 + r * ROW_H + ROW_H / 2 + 1} fontSize="12" fontWeight={700} fill="var(--text-dim)" dominantBaseline="middle">{l.name}</text>
              {l.boxes.map((bx) => {
                const p = pos(bx)!
                const on = bx === from || bx === to
                return (
                  <g key={bx} transform={`translate(${p.x},${p.y})`} onClick={() => { setPlaying(false); const i = flow.indexOf(bx); if (i >= 0) setStep(Math.min(i, hops - 1)) }} style={{ cursor: hops ? 'pointer' : 'default' }}>
                    <rect width={BW} height={BH} rx={8} fill={on ? 'var(--primary)' : 'var(--surface)'} stroke={on ? 'var(--primary)' : 'var(--border)'} strokeWidth={1.5} className={on ? 'rf-on' : ''} />
                    <text x={BW / 2} y={BH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12.5" fontWeight={600} fill={on ? 'var(--primary-text)' : 'var(--text)'}>{bx.length > 21 ? bx.slice(0, 20) + '…' : bx}</text>
                  </g>
                )
              })}
            </g>
          ))}
          {path && (
            <>
              <path d={path} stroke="var(--primary)" strokeWidth={2} strokeDasharray="6 5" fill="none" opacity={0.7} />
              <circle r={6} fill="var(--accent-inference)" stroke="#fff" strokeWidth={2} key={step}>
                <animateMotion dur="1.3s" repeatCount="1" fill="freeze" path={path} />
              </circle>
            </>
          )}
        </svg>
      </div>
      {hops > 0 && (
        <div className="rich-bar">
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s - 1 + hops) % hops) }} aria-label="Previous step">←</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setStep((s) => (s + 1) % hops) }} aria-label="Next step">→</button>
          <span className="rich-caption"><strong>{step + 1}/{hops}</strong> {from} → {to}{notes[to] ? `: ${notes[to]}` : notes[from] ? `: ${notes[from]}` : ''}</span>
        </div>
      )}
    </figure>
  )
}
