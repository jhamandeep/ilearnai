import { useMemo, useState } from 'react'
import { parseBlock, parseNumber } from './parse'
import { fmt, niceTicks } from './viz'
import { useTip } from './Tip'

// :::bars
// title: Time to read 1 GB
// unit: seconds
// highlight: SSD        (optional: one row drawn in the accent colour)
// sort: desc            (optional: asc | desc)
// RAM: 0.1
// SSD: 2
// :::
interface Row { label: string; value: number; note: string }

const ROW = 32
const BAR = 18
const PAD_T = 10
const PAD_B = 30
const PAD_R = 70

export function Bars({ src }: { src: string }) {
  const { title, unit, rows, highlight } = useMemo(() => {
    const b = parseBlock(src)
    let highlight = ''
    let sort = ''
    const rows: Row[] = []
    for (const l of b.lines) {
      let m = /^highlight\s*:\s*(.*)$/i.exec(l)
      if (m) { highlight = m[1].trim(); continue }
      m = /^sort\s*:\s*(asc|desc)/i.exec(l)
      if (m) { sort = m[1].toLowerCase(); continue }
      m = /^(.+?)\s*:\s*([-\d.,]+)\s*(.*)$/.exec(l)
      if (m) rows.push({ label: m[1].trim(), value: parseNumber(m[2]), note: m[3].trim() })
    }
    if (sort === 'asc') rows.sort((a, b) => a.value - b.value)
    if (sort === 'desc') rows.sort((a, b) => b.value - a.value)
    return { title: b.title, unit: b.unit ?? '', rows, highlight }
  }, [src])
  const [hov, setHov] = useState<number | null>(null)
  const tip = useTip()
  if (rows.length === 0) return null

  const labelW = Math.min(200, Math.max(70, Math.max(...rows.map((r) => r.label.length)) * 7.2 + 12))
  const plotW = 420
  // reserve room on the right for the longest value label so it is never clipped
  const valueW = Math.max(...rows.map((r) => (fmt(r.value) + (unit ? ' ' + unit : '')).length)) * 6.6 + 14
  const width = labelW + plotW + Math.max(PAD_R, valueW)
  const height = PAD_T + rows.length * ROW + PAD_B
  const min = Math.min(0, ...rows.map((r) => r.value))
  const max = Math.max(0, ...rows.map((r) => r.value))
  const ticks = niceTicks(min, max === min ? min + 1 : max, 4)
  const lo = Math.min(min, ticks[0])
  const hi = Math.max(max, ticks[ticks.length - 1])
  const x = (v: number) => labelW + ((v - lo) / (hi - lo || 1)) * plotW
  const x0 = x(0)
  // a bar: square at the baseline, 4px rounded at the data end
  const barPath = (v: number, y: number) => {
    const xe = x(v)
    const r = 4
    if (xe >= x0) {
      const w = Math.max(0, xe - x0)
      const rr = Math.min(r, w)
      return `M ${x0} ${y} H ${xe - rr} a ${rr} ${rr} 0 0 1 ${rr} ${rr} V ${y + BAR - rr} a ${rr} ${rr} 0 0 1 -${rr} ${rr} H ${x0} Z`
    }
    const w = Math.max(0, x0 - xe)
    const rr = Math.min(r, w)
    return `M ${x0} ${y} H ${xe + rr} a ${rr} ${rr} 0 0 0 -${rr} ${rr} V ${y + BAR - rr} a ${rr} ${rr} 0 0 0 ${rr} ${rr} H ${x0} Z`
  }

  return (
    <figure className="rich rich-bars">
      {title && <figcaption><span className="rich-kind">Compare</span>{title}{unit ? <span className="rich-unit">{unit}</span> : null}</figcaption>}
      <div className="rich-stage rich-scroll" ref={tip.host}>
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={title ?? 'Bar chart'}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={PAD_T} y2={height - PAD_B + 6} className="rb-grid" />
              <text x={x(t)} y={height - PAD_B + 20} textAnchor="middle" className="rb-tick">{fmt(t)}</text>
            </g>
          ))}
          {min < 0 && <line x1={x0} x2={x0} y1={PAD_T} y2={height - PAD_B + 6} className="rb-zero" />}
          {rows.map((r, i) => {
            const y = PAD_T + i * ROW + (ROW - BAR) / 2
            const hl = highlight && r.label === highlight
            const on = hov === i
            const body = <><strong>{fmt(r.value)}{unit ? ` ${unit}` : ''}</strong><span>{r.label}{r.note ? ` · ${r.note}` : ''}</span></>
            return (
              <g key={r.label + i} className={`rb-row ${on ? 'rb-hov' : ''} ${hl ? 'rb-hl' : ''}`} style={{ animationDelay: `${i * 70}ms` }}
                onPointerEnter={(e) => { setHov(i); tip.show(e, body) }} onPointerMove={(e) => tip.show(e, body)} onPointerLeave={() => { setHov(null); tip.hide() }}>
                <rect x={0} y={PAD_T + i * ROW} width={width} height={ROW} className="rb-hit" />
                <text x={labelW - 10} y={y + BAR / 2} textAnchor="end" dominantBaseline="middle" className="rb-label"><title>{r.label}</title>{r.label.length > 26 ? r.label.slice(0, 25) + '…' : r.label}</text>
                <path d={barPath(r.value, y)} className="rb-bar" style={{ transformOrigin: `${x0}px ${y}px`, animationDelay: `${i * 70}ms` }} />
                <text x={r.value >= 0 ? x(r.value) + 8 : x(r.value) - 8} y={y + BAR / 2} textAnchor={r.value >= 0 ? 'start' : 'end'} dominantBaseline="middle" className="rb-value" style={{ animationDelay: `${i * 70 + 350}ms` }}>{fmt(r.value)}{unit ? ` ${unit}` : ''}</text>
              </g>
            )
          })}
        </svg>
        {tip.el}
      </div>
    </figure>
  )
}
