import { useId, useEffect, useMemo, useState, type PointerEvent } from 'react'
import { parseBlock } from './parse'
import { compileExpr, fmt, niceTicks } from './viz'
import { useTip } from './Tip'

// :::graph
// title: Gradient descent on (x - 3)^2
// x: -1, 7                       (x range, required)
// y: 0, 16                       (y range, optional: computed from the data)
// xlabel: x
// ylabel: f(x)
// f: loss = (x-3)^2              (up to 3 curves; "name = expression" or just the expression)
// points: steps | 0 9, 0.6 5.76, 1.08 3.69, 1.464 2.36   (point series, "name | x y, x y")
// tangent: 0                     (draw the tangent of the first curve at x = 0)
// vline: 3 = minimum             (vertical guide with a label)
// :::
interface Curve { name: string; f: (x: number) => number }
interface Series { name: string; pts: { x: number; y: number }[] }

const W = 560
const H = 320
const ML = 54
const MR = 20
const MT = 16
const MB = 44
const PW = W - ML - MR
const PH = H - MT - MB
const SAMPLES = 240
const COLORS = ['var(--primary)', 'var(--accent-inference)', 'var(--accent-engineering)']

export function Graph({ src }: { src: string }) {
  const svgId = 'graph-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const g = useMemo(() => {
    const b = parseBlock(src)
    let xr: [number, number] = [-5, 5]
    let yr: [number, number] | null = null
    let xlabel = 'x'
    let ylabel = 'y'
    const curves: Curve[] = []
    const series: Series[] = []
    let tangent: number | null = null
    const vlines: { x: number; label: string }[] = []
    for (const l of b.lines) {
      let m = /^x\s*:\s*([-\d.e]+)\s*,\s*([-\d.e]+)/i.exec(l)
      if (m) { xr = [parseFloat(m[1]), parseFloat(m[2])]; continue }
      m = /^y\s*:\s*([-\d.e]+)\s*,\s*([-\d.e]+)/i.exec(l)
      if (m) { yr = [parseFloat(m[1]), parseFloat(m[2])]; continue }
      m = /^xlabel\s*:\s*(.*)$/i.exec(l)
      if (m) { xlabel = m[1].trim(); continue }
      m = /^ylabel\s*:\s*(.*)$/i.exec(l)
      if (m) { ylabel = m[1].trim(); continue }
      m = /^f\s*:\s*(.*)$/i.exec(l)
      if (m) {
        const eq = /^([^=]+)=(.*)$/.exec(m[1])
        const name = eq ? eq[1].trim() : m[1].trim()
        const expr = eq ? eq[2].trim() : m[1].trim()
        const f = compileExpr(expr)
        if (f && curves.length < 3) curves.push({ name, f })
        continue
      }
      m = /^points\s*:\s*(.*)$/i.exec(l)
      if (m) {
        const bar = /^([^|]+)\|(.*)$/.exec(m[1])
        const name = bar ? bar[1].trim() : `points ${series.length + 1}`
        const list = bar ? bar[2] : m[1]
        const pts = list.split(',').map((p) => p.trim().split(/\s+/).map(parseFloat)).filter((a) => a.length >= 2 && a.every(Number.isFinite)).map(([x, y]) => ({ x, y }))
        if (pts.length) series.push({ name, pts })
        continue
      }
      m = /^tangent\s*:\s*([-\d.e]+)/i.exec(l)
      if (m) { tangent = parseFloat(m[1]); continue }
      m = /^vline\s*:\s*([-\d.e]+)\s*(?:=\s*(.*))?$/i.exec(l)
      if (m) { vlines.push({ x: parseFloat(m[1]), label: (m[2] ?? '').trim() }); continue }
    }
    // sample curves
    const sampled = curves.map((c) => {
      const pts: { x: number; y: number }[] = []
      for (let i = 0; i <= SAMPLES; i++) {
        const x = xr[0] + ((xr[1] - xr[0]) * i) / SAMPLES
        const y = c.f(x)
        pts.push({ x, y: Number.isFinite(y) ? y : NaN })
      }
      return { ...c, pts }
    })
    if (!yr) {
      const ys = [...sampled.flatMap((c) => c.pts.map((p) => p.y)), ...series.flatMap((s) => s.pts.map((p) => p.y))].filter(Number.isFinite)
      if (ys.length) {
        let lo = Math.min(...ys)
        let hi = Math.max(...ys)
        // clip wild asymptotes to a sane window around the data
        const q = ys.slice().sort((a, b) => a - b)
        const p5 = q[Math.floor(q.length * 0.03)]
        const p95 = q[Math.floor(q.length * 0.97)]
        if (hi - lo > 8 * (p95 - p5 || 1)) { lo = p5; hi = p95 }
        const pad = (hi - lo || 1) * 0.08
        yr = [Math.min(0, lo - pad), hi + pad]
        if (lo >= 0 && lo - pad < 0) yr = [0, hi + pad]
      } else yr = [-1, 1]
    }
    return { title: b.title, xr, yr, xlabel, ylabel, curves: sampled, series, tangent, vlines }
  }, [src])

  const [run, setRun] = useState(0)
  const [cursor, setCursor] = useState<number | null>(null)
  const [shown, setShown] = useState(0) // how many points of the point series are revealed
  const tip = useTip()
  const maxPts = Math.max(0, ...g.series.map((s) => s.pts.length))
  useEffect(() => {
    if (maxPts === 0) return
    let k = 0
    const id = setInterval(() => { k++; setShown(k); if (k >= maxPts) clearInterval(id) }, 650)
    return () => clearInterval(id)
  }, [maxPts, run])

  const { xr, yr } = g
  const sx = (x: number) => ML + ((x - xr[0]) / (xr[1] - xr[0] || 1)) * PW
  const sy = (y: number) => MT + PH - ((y - yr[0]) / (yr[1] - yr[0] || 1)) * PH
  const xt = niceTicks(xr[0], xr[1], 6)
  const yt = niceTicks(yr[0], yr[1], 5)
  const pathOf = (pts: { x: number; y: number }[]) => {
    let d = ''
    let pen = false
    for (const p of pts) {
      const inside = Number.isFinite(p.y) && p.y >= yr[0] - (yr[1] - yr[0]) && p.y <= yr[1] + (yr[1] - yr[0])
      if (!inside) { pen = false; continue }
      const X = sx(p.x)
      const Y = Math.max(MT - 40, Math.min(MT + PH + 40, sy(p.y)))
      d += (pen ? ' L ' : ' M ') + X.toFixed(1) + ' ' + Y.toFixed(1)
      pen = true
    }
    return d
  }
  const tangentLine = (() => {
    if (g.tangent === null || !g.curves[0]) return null
    const f = g.curves[0].f
    const x0 = g.tangent
    const h = (xr[1] - xr[0]) / 2000
    const slope = (f(x0 + h) - f(x0 - h)) / (2 * h)
    const y0 = f(x0)
    const span = (xr[1] - xr[0]) * 0.22
    return { x0, y0, slope, x1: x0 - span, y1: y0 - slope * span, x2: x0 + span, y2: y0 + slope * span }
  })()
  const hasLegend = g.curves.length + g.series.length > 1
  const seriesColor = (k: number) => COLORS[(g.curves.length + k) % COLORS.length]

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const x = xr[0] + ((px - ML) / PW) * (xr[1] - xr[0])
    if (x < xr[0] || x > xr[1]) { setCursor(null); tip.hide(); return }
    setCursor(x)
    const rows = g.curves.map((c, k) => ({ name: c.name, color: COLORS[k % COLORS.length], v: c.f(x) }))
    tip.show(e, <><strong>{g.xlabel} = {fmt(x, 2)}</strong>{rows.map((rw) => <span key={rw.name}><i style={{ background: rw.color }} />{rw.name} = {fmt(rw.v, 3)}</span>)}</>)
  }

  return (
    <figure className="rich rich-graph">
      {g.title && <figcaption><span className="rich-kind">Graph</span>{g.title}</figcaption>}
      <div className="rich-stage" ref={tip.host}>
        <svg key={run} viewBox={`0 0 ${W} ${H}`} className="gr-svg" role="img" aria-label={g.title ?? 'Graph'} onPointerMove={onMove} onPointerLeave={() => { setCursor(null); tip.hide() }}>
          <defs>
            <clipPath id={`${svgId}-clip-${run}`}><rect x={ML} y={MT - 2} width={PW} height={PH + 4} /></clipPath>
          </defs>
          {yt.map((t) => <line key={'y' + t} x1={ML} x2={ML + PW} y1={sy(t)} y2={sy(t)} className="gr-grid" />)}
          {xt.map((t) => <line key={'x' + t} x1={sx(t)} x2={sx(t)} y1={MT} y2={MT + PH} className="gr-grid" />)}
          {yr[0] < 0 && yr[1] > 0 && <line x1={ML} x2={ML + PW} y1={sy(0)} y2={sy(0)} className="gr-axis" />}
          {xr[0] < 0 && xr[1] > 0 && <line x1={sx(0)} x2={sx(0)} y1={MT} y2={MT + PH} className="gr-axis" />}
          {yt.map((t) => <text key={'yl' + t} x={ML - 8} y={sy(t)} textAnchor="end" dominantBaseline="middle" className="gr-tick">{fmt(t)}</text>)}
          {xt.map((t) => <text key={'xl' + t} x={sx(t)} y={MT + PH + 16} textAnchor="middle" className="gr-tick">{fmt(t)}</text>)}
          <text x={ML + PW / 2} y={H - 6} textAnchor="middle" className="gr-axis-label">{g.xlabel}</text>
          <text x={14} y={MT + PH / 2} textAnchor="middle" transform={`rotate(-90 14 ${MT + PH / 2})`} className="gr-axis-label">{g.ylabel}</text>
          {g.vlines.map((v, i) => (
            <g key={'v' + i}>
              <line x1={sx(v.x)} x2={sx(v.x)} y1={MT} y2={MT + PH} className="gr-vline" />
              {v.label && <text x={sx(v.x) + 5} y={MT + 12} className="gr-vlabel">{v.label}</text>}
            </g>
          ))}
          <g clipPath={`url(#${svgId}-clip-${run})`}>
            {g.curves.map((c, k) => (
              <path key={c.name + k} d={pathOf(c.pts)} className="gr-line" style={{ stroke: COLORS[k % COLORS.length], animationDelay: `${k * 250}ms` }} pathLength={1} />
            ))}
            {tangentLine && (
              <g className="gr-tangent">
                <line x1={sx(tangentLine.x1)} y1={sy(tangentLine.y1)} x2={sx(tangentLine.x2)} y2={sy(tangentLine.y2)} />
                <circle cx={sx(tangentLine.x0)} cy={sy(tangentLine.y0)} r={5} />
                {sx(tangentLine.x0) > ML + 96
                  ? <text x={sx(tangentLine.x0) - 10} y={sy(tangentLine.y0) - 8} textAnchor="end" className="gr-vlabel">slope {fmt(tangentLine.slope, 2)}</text>
                  : <text x={sx(tangentLine.x0) + 10} y={sy(tangentLine.y0) + 18} className="gr-vlabel">slope {fmt(tangentLine.slope, 2)}</text>}
              </g>
            )}
            {g.series.map((s, k) => (
              <g key={s.name + k}>
                {s.pts.length > 1 && <polyline points={s.pts.slice(0, shown).map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')} className="gr-steps" style={{ stroke: seriesColor(k) }} />}
                {s.pts.slice(0, shown).map((p, i) => (
                  <g key={i} className="gr-dot" style={{ animationDelay: '0ms' }}
                    onPointerEnter={(e) => { e.stopPropagation(); tip.show(e, <><strong>({fmt(p.x, 3)}, {fmt(p.y, 3)})</strong><span>{s.name} · point {i + 1}</span></>) }}>
                    <circle cx={sx(p.x)} cy={sy(p.y)} r={12} className="gr-hit" />
                    <circle cx={sx(p.x)} cy={sy(p.y)} r={5} style={{ fill: seriesColor(k) }} className="gr-dot-mark" />
                    {(i === 0 || i === s.pts.length - 1) && <text x={sx(p.x) + 9} y={sy(p.y) - 9} className="gr-dot-label">{fmt(p.y, 2)}</text>}
                  </g>
                ))}
              </g>
            ))}
          </g>
          {cursor !== null && (
            <g className="gr-cursor">
              <line x1={sx(cursor)} x2={sx(cursor)} y1={MT} y2={MT + PH} />
              {g.curves.map((c, k) => { const y = c.f(cursor); return Number.isFinite(y) && y >= yr[0] && y <= yr[1] ? <circle key={k} cx={sx(cursor)} cy={sy(y)} r={5} style={{ fill: COLORS[k % COLORS.length] }} /> : null })}
            </g>
          )}
        </svg>
        {tip.el}
      </div>
      <div className="rich-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => { setShown(0); setRun((r) => r + 1) }}>Replay</button>
        {hasLegend && (
          <span className="gr-legend">
            {g.curves.map((c, k) => <span key={'c' + k}><i className="gr-key-line" style={{ background: COLORS[k % COLORS.length] }} />{c.name}</span>)}
            {g.series.map((s, k) => <span key={'s' + k}><i className="gr-key-dot" style={{ background: seriesColor(k) }} />{s.name}</span>)}
          </span>
        )}
        <span className="rich-caption">Move the pointer over the plot to read values.</span>
      </div>
    </figure>
  )
}
