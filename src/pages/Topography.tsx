import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type SimulationNodeDatum, type SimulationLinkDatum } from 'd3-force'
import { nodes as allNodes, edges as allEdges } from '../data/graph'
import { tracks } from '../data/tracks'
import type { ConceptKind, ConceptNode } from '../data/types'

interface SimNode extends SimulationNodeDatum, ConceptNode {}
interface SimLink extends SimulationLinkDatum<SimNode> { relation: string }

const kindColor: Record<ConceptKind, string> = {
  concept: 'var(--primary)',
  lesson: 'var(--accent-engineering)',
  paper: 'var(--accent-research)',
  lab: 'var(--accent-inference)',
  term: 'var(--accent-math)',
}
const kindRadius: Record<ConceptKind, number> = { concept: 9, lesson: 5, paper: 6, lab: 6, term: 4 }

export function Topography() {
  const [track, setTrack] = useState<string>('all')
  const [kinds, setKinds] = useState<Set<ConceptKind>>(new Set(['concept', 'lesson', 'paper', 'lab', 'term']))
  const [selected, setSelected] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const navigate = useNavigate()
  const W = 900
  const H = 600

  const { nodes, links } = useMemo(() => {
    const keep = allNodes.filter((n) => (track === 'all' || n.track === track) && kinds.has(n.kind))
    const ids = new Set(keep.map((n) => n.id))
    const nodes: SimNode[] = keep.map((n) => ({ ...n }))
    const links: SimLink[] = allEdges.filter((e) => ids.has(e.source) && ids.has(e.target)).map((e) => ({ source: e.source, target: e.target, relation: e.relation }))
    return { nodes, links }
  }, [track, kinds])

  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null)
  useEffect(() => {
    const sim = forceSimulation<SimNode>(nodes)
      .force('link', forceLink<SimNode, SimLink>(links).id((d) => d.id).distance((l) => (l.relation === 'requires' ? 70 : 40)).strength(0.6))
      .force('charge', forceManyBody().strength(-120))
      .force('center', forceCenter(W / 2, H / 2))
      .force('collide', forceCollide<SimNode>().radius((d) => kindRadius[d.kind] + 6))
      .alphaDecay(0.03)
      .on('tick', () => setTick((t) => t + 1))
    simRef.current = sim
    return () => { sim.stop() }
  }, [nodes, links])

  const sel = nodes.find((n) => n.id === selected)
  const neighbours = useMemo(() => {
    if (!selected) return new Set<string>()
    const s = new Set<string>([selected])
    for (const l of links) {
      const a = typeof l.source === 'object' ? l.source.id : String(l.source)
      const b = typeof l.target === 'object' ? l.target.id : String(l.target)
      if (a === selected) s.add(b)
      if (b === selected) s.add(a)
    }
    return s
  }, [selected, links])

  const toggleKind = (k: ConceptKind) => setKinds((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n })

  return (
    <>
      <header className="page-head">
        <h1>Knowledge Topography</h1>
        <p className="lede">Every concept across the tracks, linked to the lessons that explain it, the papers that introduced it, and the labs that use it. Drag to explore, click to open.</p>
      </header>
      <div className="topo-controls">
        <select value={track} onChange={(e) => { setTrack(e.target.value); setSelected(null) }}>
          <option value="all">All tracks</option>
          {tracks.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
        </select>
        {(Object.keys(kindColor) as ConceptKind[]).map((k) => (
          <label key={k} className={`chip ${kinds.has(k) ? 'chip-on' : ''}`} style={{ ['--chip' as string]: kindColor[k] }}>
            <input type="checkbox" checked={kinds.has(k)} onChange={() => toggleKind(k)} /> {k}
          </label>
        ))}
        <span className="meta">{nodes.length} nodes · {links.length} edges</span>
      </div>
      <div className="topo">
        <svg viewBox={`0 0 ${W} ${H}`} className="topo-svg" data-tick={tick} onClick={() => setSelected(null)}>
          {links.map((l, i) => {
            const s = l.source as SimNode
            const t = l.target as SimNode
            if (typeof s !== 'object' || typeof t !== 'object') return null
            const dim = selected && !(neighbours.has(s.id) && neighbours.has(t.id))
            return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={l.relation === 'requires' ? 'var(--text-dim)' : 'var(--border)'} strokeWidth={l.relation === 'requires' ? 1.5 : 1} opacity={dim ? 0.15 : 0.8} />
          })}
          {nodes.map((n) => {
            const dim = selected && !neighbours.has(n.id)
            return (
              <g key={n.id} transform={`translate(${n.x ?? 0},${n.y ?? 0})`} opacity={dim ? 0.25 : 1} style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setSelected(n.id) }}
                onDoubleClick={() => n.to && navigate(n.to)}
                onPointerDown={(e) => {
                  const svg = (e.currentTarget.ownerSVGElement as SVGSVGElement)
                  const pt = (ev: PointerEvent) => { const r = svg.getBoundingClientRect(); return [((ev.clientX - r.left) / r.width) * W, ((ev.clientY - r.top) / r.height) * H] }
                  const move = (ev: PointerEvent) => { const [x, y] = pt(ev); n.fx = x; n.fy = y; simRef.current?.alpha(0.3).restart() }
                  const up = () => { n.fx = null; n.fy = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
                  window.addEventListener('pointermove', move)
                  window.addEventListener('pointerup', up)
                }}>
                <circle r={kindRadius[n.kind]} fill={kindColor[n.kind]} stroke="var(--bg)" strokeWidth={1.5} className={selected === n.id ? 'pulse' : ''} />
                {(n.kind === 'concept' || selected === n.id || neighbours.has(n.id)) && (
                  <text x={kindRadius[n.kind] + 4} y={4} fontSize={n.kind === 'concept' ? 12 : 10} fill="var(--text)" style={{ pointerEvents: 'none' }}>{n.label}</text>
                )}
              </g>
            )
          })}
        </svg>
        <aside className="topo-panel">
          {sel ? (
            <>
              <span className="pill" style={{ marginLeft: 0, background: kindColor[sel.kind], color: '#fff' }}>{sel.kind}</span>
              <h3>{sel.label}</h3>
              <p className="meta">{tracks.find((t) => t.slug === sel.track)?.title}</p>
              {sel.to && <Link to={sel.to} className="btn btn-primary">Open</Link>}
              <h4>Connected</h4>
              <ul className="list">
                {[...neighbours].filter((id) => id !== sel.id).map((id) => {
                  const n = nodes.find((x) => x.id === id)
                  return n ? <li key={id}><a href="#" onClick={(e) => { e.preventDefault(); setSelected(id) }}>{n.label}</a><span className="meta">{n.kind}</span></li> : null
                })}
              </ul>
            </>
          ) : (
            <>
              <h3>How to read it</h3>
              <p className="meta">Large blue nodes are concepts. Grey edges are prerequisites between concepts. Click a node to see what it connects to; double-click to open its page.</p>
              <ul className="list">
                {(Object.keys(kindColor) as ConceptKind[]).map((k) => <li key={k}><span><span className="sw" style={{ background: kindColor[k] }} /> {k}</span><span className="meta">{allNodes.filter((n) => n.kind === k).length}</span></li>)}
              </ul>
            </>
          )}
        </aside>
      </div>
    </>
  )
}
