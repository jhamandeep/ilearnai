import { Link } from 'react-router-dom'
import { papers } from '../data/papers'
import { tracks } from '../data/tracks'
import type { Paper } from '../data/types'

// Longest-path layering: a paper sits one column right of its deepest prerequisite.
function layer(p: Paper, memo = new Map<string, number>()): number {
  if (memo.has(p.slug)) return memo.get(p.slug)!
  const depth = (p.prereqs ?? []).reduce((d, s) => { const q = papers.find((x) => x.slug === s); return q ? Math.max(d, layer(q, memo) + 1) : d }, 0)
  memo.set(p.slug, depth)
  return depth
}

export function Hierarchy() {
  const memo = new Map<string, number>()
  const byTrack = tracks.map((t) => ({ track: t, items: papers.filter((p) => p.track === t.slug) })).filter((g) => g.items.length)
  return (
    <>
      <header className="page-head">
        <h1>Paper hierarchy</h1>
        <p className="lede">Foundational papers per track in reading order. A paper sits to the right of everything it assumes you have read.</p>
      </header>
      {byTrack.map(({ track, items }) => {
        const cols = Math.max(...items.map((p) => layer(p, memo))) + 1
        const colW = 220
        const rowH = 64
        const columns: Paper[][] = Array.from({ length: cols }, () => [])
        items.forEach((p) => columns[layer(p, memo)].push(p))
        const pos = new Map<string, { x: number; y: number }>()
        columns.forEach((col, c) => col.sort((a, b) => a.day - b.day).forEach((p, r) => pos.set(p.slug, { x: c * colW + 10, y: r * rowH + 10 })))
        const H = Math.max(...columns.map((c) => c.length)) * rowH + 20
        const W = cols * colW
        return (
          <section key={track.slug} className="hier">
            <h2 style={{ borderLeft: `4px solid ${track.accent}`, paddingLeft: '0.6rem' }}>{track.title}</h2>
            <div className="hier-scroll">
              <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="hier-svg">
                <defs><marker id={`arr-${track.slug}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--text-dim)" /></marker></defs>
                {items.flatMap((p) => (p.prereqs ?? []).map((s) => {
                  const a = pos.get(s); const b = pos.get(p.slug)
                  if (!a || !b) return null
                  const x1 = a.x + 190, y1 = a.y + 24, x2 = b.x, y2 = b.y + 24
                  return <path key={s + p.slug} d={`M ${x1} ${y1} C ${x1 + 30} ${y1}, ${x2 - 30} ${y2}, ${x2} ${y2}`} fill="none" stroke="var(--text-dim)" strokeWidth={1.2} markerEnd={`url(#arr-${track.slug})`} className="draw" />
                }))}
                {items.map((p) => { const q = pos.get(p.slug)!; return (
                  <foreignObject key={p.slug} x={q.x} y={q.y} width={190} height={rowH - 12}>
                    <Link to={`/papers/${p.slug}`} className="hier-node"><span className="meta">Day {p.day} · {p.year}</span><strong>{p.title}</strong></Link>
                  </foreignObject>
                ) })}
              </svg>
            </div>
          </section>
        )
      })}
    </>
  )
}
