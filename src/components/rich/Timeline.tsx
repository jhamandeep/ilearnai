import { useMemo, useState } from 'react'
import { parseBlock, parseNumber } from './parse'

interface Bar { lane: string; label: string; start: number; end: number }
interface Msg { from: string; to: string; label: string; at: number; end: number }

export function Timeline({ src }: { src: string }) {
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

  const [run, setRun] = useState(0)
  const LW = 110
  const PW = 560
  const RH = 44
  const width = LW + PW + 20
  const height = lanes.length * RH + 34
  const x = (t: number) => LW + (t / max) * PW
  const y = (lane: string) => 8 + lanes.indexOf(lane) * RH
  const ticks = 5
  if (lanes.length === 0) return null

  return (
    <figure className="rich rich-timeline" key={run}>
      {title && <figcaption>{title}</figcaption>}
      <div className="rich-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={title ?? 'Timing diagram'}>
          <defs><marker id="rt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent-inference)" /></marker></defs>
          {Array.from({ length: ticks + 1 }, (_, i) => (max * i) / ticks).map((t, i) => (
            <g key={i}>
              <line x1={x(t)} x2={x(t)} y1={4} y2={height - 26} stroke="var(--border)" />
              <text x={x(t)} y={height - 10} textAnchor="middle" fontSize="11" fill="var(--text-dim)">{+t.toFixed(2)}{unit && i === ticks ? ` ${unit}` : ''}</text>
            </g>
          ))}
          {lanes.map((l) => (
            <g key={l}>
              <text x={LW - 10} y={y(l) + RH / 2 + 1} textAnchor="end" fontSize="12" fontWeight={600} fill="var(--text)">{l}</text>
              <line x1={LW} x2={LW + PW} y1={y(l) + RH - 6} y2={y(l) + RH - 6} stroke="var(--border)" />
            </g>
          ))}
          {bars.map((b, i) => (
            <g key={i} className="rt-bar" style={{ animationDelay: `${(b.start / max) * 2.4}s`, animationDuration: `${Math.max(0.15, ((b.end - b.start) / max) * 2.4)}s` }}>
              <rect x={x(b.start)} y={y(b.lane) + 6} width={Math.max(2, x(b.end) - x(b.start))} height={RH - 18} rx={5} fill="var(--primary)" opacity={0.85} />
              <text x={x(b.start) + 6} y={y(b.lane) + RH / 2 + 1} fontSize="11" fill="var(--primary-text)">{b.label}</text>
            </g>
          ))}
          {msgs.map((m, i) => {
            const y1 = y(m.from) + RH / 2 - 3
            const y2 = y(m.to) + RH / 2 - 3
            return (
              <g key={'m' + i} className="rt-msg" style={{ animationDelay: `${(m.at / max) * 2.4}s` }}>
                <line x1={x(m.at)} y1={y1} x2={x(m.end)} y2={y2} stroke="var(--accent-inference)" strokeWidth={2} markerEnd="url(#rt-arrow)" />
                <text x={(x(m.at) + x(m.end)) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" fontSize="11" fill="var(--text)">{m.label}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="rich-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => setRun((r) => r + 1)}>Replay</button>
        <span className="rich-caption">Bars are work on one lane. Arrows are messages between lanes. Time runs left to right{unit ? ` in ${unit}` : ''}.</span>
      </div>
    </figure>
  )
}
