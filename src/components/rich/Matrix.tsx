import { useMemo, useState } from 'react'
import { parseBlock, parseNumber } from './parse'
import { fmt } from './viz'
import { useTip } from './Tip'

// :::matrix
// title: Similarity between four words
// cols: cat, dog, car, bus
// cat: 1.0, 0.8, 0.1, 0.1
// :::
// Values from 0 up use one hue (light to dark). If any value is negative the
// grid becomes diverging: negative in the warm accent, positive in the primary
// hue, grey at zero.
const CW = 58
const CH = 40
const GAP = 3

export function Matrix({ src }: { src: string }) {
  const { title, cols, rows } = useMemo(() => {
    const b = parseBlock(src)
    let cols: string[] = []
    const rows: { label: string; values: number[] }[] = []
    for (const l of b.lines) {
      const cm = /^cols?\s*:\s*(.*)$/.exec(l)
      if (cm) { cols = cm[1].split(',').map((s) => s.trim()); continue }
      const rm = /^(.+?)\s*:\s*(.*)$/.exec(l)
      if (rm) rows.push({ label: rm[1].trim(), values: rm[2].split(',').map((s) => parseNumber(s.trim())) })
    }
    return { title: b.title, cols, rows }
  }, [src])
  const [hov, setHov] = useState<{ i: number; j: number } | null>(null)
  const tip = useTip()
  if (rows.length === 0) return null
  const all = rows.flatMap((r) => r.values)
  const min = Math.min(...all)
  const max = Math.max(...all)
  const diverging = min < 0
  const absMax = Math.max(1e-9, Math.abs(min), Math.abs(max))
  const n = Math.max(cols.length, ...rows.map((r) => r.values.length))
  const rowLabelW = Math.min(170, Math.max(50, Math.max(...rows.map((r) => r.label.length)) * 7.2 + 14))
  const colHeadH = 26
  const width = rowLabelW + n * (CW + GAP) + 6
  const height = colHeadH + rows.length * (CH + GAP) + 6
  const fillFor = (v: number) => {
    if (diverging) {
      const w = Math.min(1, Math.abs(v) / absMax)
      const hue = v < 0 ? 'var(--accent-inference)' : 'var(--primary)'
      return `color-mix(in oklab, ${hue} ${Math.round(12 + w * 78)}%, var(--surface-2))`
    }
    const w = (v - Math.min(0, min)) / ((max - Math.min(0, min)) || 1)
    return `color-mix(in oklab, var(--primary) ${Math.round(w * 88)}%, var(--surface-2))`
  }
  const strong = (v: number) => (diverging ? Math.abs(v) / absMax : (v - Math.min(0, min)) / ((max - Math.min(0, min)) || 1)) > 0.55

  return (
    <figure className="rich rich-matrix">
      {title && <figcaption><span className="rich-kind">Grid</span>{title}</figcaption>}
      <div className="rich-stage rich-scroll" ref={tip.host}>
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={title ?? 'Heat map'} onPointerLeave={() => { setHov(null); tip.hide() }}>
          {Array.from({ length: n }, (_, j) => (
            <text key={'c' + j} x={rowLabelW + j * (CW + GAP) + CW / 2} y={colHeadH - 9} textAnchor="middle" className={`mx-head ${hov?.j === j ? 'mx-head-on' : ''}`}>{(cols[j] ?? '').length > 8 ? (cols[j] ?? '').slice(0, 7) + '…' : cols[j] ?? ''}</text>
          ))}
          {rows.map((r, i) => (
            <g key={i}>
              <text x={rowLabelW - 8} y={colHeadH + i * (CH + GAP) + CH / 2} textAnchor="end" dominantBaseline="middle" className={`mx-head ${hov?.i === i ? 'mx-head-on' : ''}`}>{r.label.length > 22 ? r.label.slice(0, 21) + '…' : r.label}</text>
              {Array.from({ length: n }, (_, j) => {
                const v = r.values[j] ?? 0
                const x = rowLabelW + j * (CW + GAP)
                const y = colHeadH + i * (CH + GAP)
                const on = hov?.i === i && hov?.j === j
                const dim = hov && !on && hov.i !== i && hov.j !== j
                const body = <><strong>{fmt(v)}</strong><span>{r.label} × {cols[j] ?? j + 1}</span></>
                return (
                  <g key={j} className={`mx-cell ${on ? 'mx-on' : ''} ${dim ? 'mx-dim' : ''}`} style={{ animationDelay: `${(i + j) * 45}ms` }}
                    onPointerEnter={(e) => { setHov({ i, j }); tip.show(e, body) }} onPointerMove={(e) => tip.show(e, body)}>
                    <rect x={x} y={y} width={CW} height={CH} rx={6} style={{ fill: fillFor(v) }} className="mx-rect" />
                    <text x={x + CW / 2} y={y + CH / 2} textAnchor="middle" dominantBaseline="middle" className={strong(v) ? 'mx-val mx-val-strong' : 'mx-val'}>{Number.isInteger(v) ? v : fmt(v, 2)}</text>
                  </g>
                )
              })}
            </g>
          ))}
        </svg>
        {tip.el}
      </div>
      <div className="rich-bar rich-legend">
        <span className="mx-ramp" style={{ background: diverging ? 'linear-gradient(90deg, color-mix(in oklab, var(--accent-inference) 90%, var(--surface-2)), var(--surface-2), color-mix(in oklab, var(--primary) 88%, var(--surface-2)))' : 'linear-gradient(90deg, var(--surface-2), color-mix(in oklab, var(--primary) 88%, var(--surface-2)))' }} />
        <span className="rich-caption">{diverging ? `${fmt(-absMax)} to ${fmt(absMax)}` : `${fmt(Math.min(0, min))} to ${fmt(max)}`} · darker is larger · hover a cell for its value</span>
      </div>
    </figure>
  )
}
