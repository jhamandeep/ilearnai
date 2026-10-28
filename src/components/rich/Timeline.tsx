import { useId, useEffect, useMemo, useRef, useState } from 'react'
import { parseBlock, parseNumber } from './parse'
import { fmt, niceTicks } from './viz'
import { useTip } from './Tip'

interface Bar { lane: string; label: string; start: number; end: number }
interface Msg { from: string; to: string; label: string; at: number; end: number }

const LW = 118
const PW = 560
const RH = 48
const PAD_B = 30
const DUR = 4200 // ms for one full sweep

export function Timeline({ src }: { src: string }) {
  const svgId = 'rt-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const { title, unit, lanes, bars, msgs, max } = useMemo(() => {
    const b = parseBlock(src)
    const lanes: string[] = []
    const bars: Bar[] = []
    const msgs: Msg[] = []
    const ensure = (l: string) => { if (!lanes.includes(l)) lanes.push(l) }
    for (const line of b.lines) {
      const lm = /^lane\s+(.+)$/.exec(line)
      if (lm) { ensure(lm[1].trim()); continue }
      const tm = /@\s*([\d.,]+)\s*(?:-\s*([\d.,]+))?\s*$/.exec(line)
      if (!tm) continue
      const start = parseNumber(tm[1])
      const end = tm[2] ? parseNumber(tm[2]) : start
      const body = line.slice(0, tm.index).trim()
      const mm = /^(.+?)\s*(?:->|→)\s*([^:]+?)\s*:\s*(.*)$/.exec(body)
      if (mm) { ensure(mm[1].trim()); ensure(mm[2].trim()); msgs.push({ from: mm[1].trim(), to: mm[2].trim(), label: mm[3].trim(), at: start, end }); continue }
      const bm = /^([^:]+?)\s*:\s*(.*)$/.exec(body)
      if (bm) { ensure(bm[1].trim()); bars.push({ lane: bm[1].trim(), label: bm[2].trim(), start, end }) }
    }
    const max = Math.max(1, ...bars.map((x) => x.end), ...msgs.map((x) => x.end))
    return { title: b.title, unit: b.unit ?? '', lanes, bars, msgs, max }
  }, [src])

  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const raf = useRef(0)
  const tip = useTip()
  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      setT((v) => {
        const nv = v + (dt / DUR) * max
        if (nv >= max) { setPlaying(false); return max }
        return nv
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [playing, max])

  if (lanes.length === 0) return null
  const width = LW + PW + 24
  const height = lanes.length * RH + PAD_B + 8
  const x = (v: number) => LW + (v / max) * PW
  const y = (lane: string) => 8 + lanes.indexOf(lane) * RH
  const ticks = niceTicks(0, max, 6)
  const msgPath = (m: Msg) => {
    const x1 = x(m.at)
    const x2 = x(m.end)
    const y1 = y(m.from) + RH / 2
    const y2 = y(m.to) + RH / 2
    if (Math.abs(x2 - x1) < 2) return `M ${x1} ${y1} L ${x2} ${y2}`
    const cx = (x1 + x2) / 2
    return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`
  }
  const activeMsg = msgs.filter((m) => m.at <= t && t <= Math.max(m.end, m.at + max * 0.04))
  const replay = () => { setT(0); setPlaying(true) }

  return (
    <figure className="rich rich-timeline">
      {title && <figcaption><span className="rich-kind">Timing</span>{title}{unit ? <span className="rich-unit">{unit}</span> : null}</figcaption>}
      <div className="rich-stage rich-scroll" ref={tip.host}>
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={title ?? 'Timing diagram'} onPointerLeave={tip.hide}>
          <defs>
            <marker id={`${svgId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="var(--accent-inference)" /></marker>
            <linearGradient id={`${svgId}-barfill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity="0.95" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0.7" /></linearGradient>
          </defs>
          {lanes.map((l, i) => (
            <g key={l}>
              <rect x={4} y={y(l)} width={width - 8} height={RH - 4} rx={8} className={i % 2 ? 'rt-lane rt-lane-alt' : 'rt-lane'} />
              <text x={LW - 12} y={y(l) + RH / 2 - 2} textAnchor="end" dominantBaseline="middle" className="rt-lane-label">{l.length > 15 ? l.slice(0, 14) + '…' : l}</text>
            </g>
          ))}
          {ticks.map((tk) => (
            <g key={tk}>
              <line x1={x(tk)} x2={x(tk)} y1={6} y2={height - PAD_B + 4} className="rb-grid" />
              <text x={x(tk)} y={height - PAD_B + 18} textAnchor="middle" className="rb-tick">{fmt(tk)}{unit && tk === ticks[ticks.length - 1] ? ` ${unit}` : ''}</text>
            </g>
          ))}
          {bars.map((b, i) => {
            if (b.start > t) return null
            const x1 = x(b.start)
            const x2 = x(Math.min(b.end, t))
            const w = Math.max(2, x2 - x1)
            const full = b.end <= t
            const body = <><strong>{fmt(b.start)} to {fmt(b.end)}{unit ? ` ${unit}` : ''}</strong><span>{b.lane}: {b.label}</span></>
            return (
              <g key={i} className={full ? 'rt-bar rt-bar-done' : 'rt-bar'} onPointerEnter={(e) => tip.show(e, body)} onPointerMove={(e) => tip.show(e, body)}>
                <rect x={x1} y={y(b.lane) + 9} width={w} height={RH - 22} rx={5} fill={`url(#${svgId}-barfill)`} />
                {w > 34 && <text x={x1 + 7} y={y(b.lane) + RH / 2 - 2} dominantBaseline="middle" className="rt-bar-label" clipPath={undefined}>{b.label.length > Math.floor(w / 6.5) ? b.label.slice(0, Math.max(1, Math.floor(w / 6.5) - 1)) + '…' : b.label}</text>}
              </g>
            )
          })}
          {msgs.map((m, i) => {
            if (m.at > t) return null
            const on = activeMsg.includes(m)
            const mx = (x(m.at) + x(m.end)) / 2
            const my = (y(m.from) + y(m.to)) / 2 + RH / 2 - 2
            const body = <><strong>{fmt(m.at)}{m.end !== m.at ? ` to ${fmt(m.end)}` : ''}{unit ? ` ${unit}` : ''}</strong><span>{m.from} → {m.to}: {m.label}</span></>
            return (
              <g key={'m' + i} className={on ? 'rt-msg rt-msg-on' : 'rt-msg'} onPointerEnter={(e) => tip.show(e, body)} onPointerMove={(e) => tip.show(e, body)}>
                <path d={msgPath(m)} markerEnd={`url(#${svgId}-arrow)`} />
                <text x={mx} y={my - 7} textAnchor="middle" className="rt-msg-label">{m.label.length > 22 ? m.label.slice(0, 21) + '…' : m.label}</text>
              </g>
            )
          })}
          <g className="rt-head">
            <line x1={x(t)} x2={x(t)} y1={4} y2={height - PAD_B + 6} />
            <rect x={x(t) - 22} y={height - PAD_B + 6} width={44} height={16} rx={8} />
            <text x={x(t)} y={height - PAD_B + 14} textAnchor="middle" dominantBaseline="middle">{fmt(t, 1)}</text>
          </g>
        </svg>
        {tip.el}
      </div>
      <div className="rich-bar">
        <button className="btn btn-primary btn-sm" onClick={() => (t >= max ? replay() : setPlaying((p) => !p))}>{t >= max ? 'Replay' : playing ? 'Pause' : 'Play'}</button>
        <input type="range" className="rich-scrub" min={0} max={max} step={max / 400} value={t} onChange={(e) => { setPlaying(false); setT(parseFloat(e.target.value)) }} aria-label="Time" />
        <span className="rich-caption"><strong>{fmt(t, 1)}</strong> / {fmt(max)}{unit ? ` ${unit}` : ''} · bars are work on a lane, arrows are messages</span>
      </div>
    </figure>
  )
}
