import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY, type SimulationNodeDatum, type SimulationLinkDatum } from 'd3-force'
import { select, zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3'
import { nodes as allNodes, edges as allEdges } from '../data/graph'
import { tracks } from '../data/tracks'
import type { ConceptKind, ConceptNode } from '../data/types'
import '../knowledge-map.css'

interface MapNode extends SimulationNodeDatum, ConceptNode { x: number; y: number }
interface MapLink extends SimulationLinkDatum<MapNode> { relation: string }
const kinds: ConceptKind[] = ['concept', 'lesson', 'paper', 'lab', 'term']
const colors: Record<ConceptKind, string> = { concept: '#7651b5', lesson: '#477dc5', paper: '#b44f85', lab: '#16808b', term: '#a77726' }
const names: Record<ConceptKind, string> = { concept: 'Concepts', lesson: 'Lessons', paper: 'Papers', lab: 'Labs', term: 'Terms' }
const radii: Record<ConceptKind, number> = { concept: 10, lesson: 5, paper: 7, lab: 8, term: 5 }
const presets = [['concept:attention', 'Attention'], ['concept:retrieval', 'Retrieval & RAG'], ['concept:agents', 'AI agents']]

function layout(track: string, visible: Set<ConceptKind>) {
  const nodes = allNodes.filter(node => (track === 'all' || node.track === track) && visible.has(node.kind)).map(node => ({ ...node })) as MapNode[]
  const ids = new Set(nodes.map(node => node.id))
  const edges = allEdges.filter(edge => ids.has(edge.source) && ids.has(edge.target))
  const links: MapLink[] = edges.map(edge => ({ ...edge }))
  // Settle once so the map stays still while reading. Dragging moves nodes directly.
  forceSimulation(nodes).stop()
    .force('link', forceLink<MapNode, MapLink>(links).id(node => node.id).distance(link => link.relation === 'requires' ? 110 : 60).strength(.5))
    .force('charge', forceManyBody().strength(-150))
    .force('center', forceCenter(450, 300))
    .force('x', forceX<MapNode>(450).strength(.03))
    .force('y', forceY<MapNode>(300).strength(.06))
    .force('collide', forceCollide<MapNode>().radius(node => radii[node.kind] + 10)).tick(180)
  return { nodes, links, edges }
}

function fitted(nodes: MapNode[], width: number, height: number): ZoomTransform {
  if (!nodes.length) return zoomIdentity
  const minX = Math.min(...nodes.map(node => node.x)), maxX = Math.max(...nodes.map(node => node.x))
  const minY = Math.min(...nodes.map(node => node.y)), maxY = Math.max(...nodes.map(node => node.y))
  const scale = Math.max(.03, Math.min(2, (width - 90) / Math.max(100, maxX - minX), (height - 90) / Math.max(100, maxY - minY)))
  return zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-(minX + maxX) / 2, -(minY + maxY) / 2)
}

export default function KnowledgeMap({ selected, onSelect, expandedHref }: { selected: string | null; onSelect: (id: string | null) => void; expandedHref?: string }) {
  const [track, setTrack] = useState('all')
  const [visibleKinds, setVisibleKinds] = useState(new Set(kinds))
  const [query, setQuery] = useState('')
  const [size, setSize] = useState({ width: 900, height: 540 })
  const [camera, setCamera] = useState(zoomIdentity)
  const [revision, setRevision] = useState(0)
  const id = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const selectedRef = useRef(selected)
  const gesture = useRef<{ pointer: number; node: MapNode; x: number; y: number; offsetX: number; offsetY: number; moved: boolean } | null>(null)
  const { nodes, links, edges } = useMemo(() => layout(track, visibleKinds), [track, visibleKinds])
  const current = nodes.find(node => node.id === selected)
  const neighbours = useMemo(() => new Set(edges.flatMap(edge => edge.source === selected ? [edge.target] : edge.target === selected ? [edge.source] : [])), [edges, selected])
  const connected = nodes.filter(node => neighbours.has(node.id)).sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || a.label.localeCompare(b.label))
  const matches = query.trim() ? nodes.filter(node => node.label.toLowerCase().includes(query.trim().toLowerCase())) : []

  useEffect(() => { selectedRef.current = selected }, [selected])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.max(200, entry.contentRect.width), height: entry.contentRect.height }))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const element = svgRef.current
    if (!element) return
    const surface = select<SVGSVGElement, unknown>(element)
    const behavior = zoom<SVGSVGElement, unknown>().extent([[0, 0], [size.width, size.height]]).scaleExtent([.03, 5])
      .filter(event => {
        // A second finger turns a node drag into a pinch anywhere on the map.
        if (event.type === 'touchstart' && event.touches.length > 1) {
          const active = gesture.current
          gesture.current = null
          if (active && element.hasPointerCapture(active.pointer)) element.releasePointerCapture(active.pointer)
          return true
        }
        return !event.target.closest('[data-node-id]') && (event.type === 'wheel' ? event.ctrlKey || event.metaKey : !event.button)
      })
      .on('zoom', event => setCamera(event.transform))
    zoomRef.current = behavior
    surface.call(behavior).on('dblclick.zoom', null)
    const initial = nodes.find(node => node.id === selectedRef.current)
    const group = initial ? nodes.filter(node => node.id === initial.id || edges.some(edge => (edge.source === initial.id && edge.target === node.id) || (edge.target === initial.id && edge.source === node.id))) : nodes
    surface.call(behavior.transform, fitted(group, size.width, size.height))
    return () => { surface.on('.zoom', null); zoomRef.current = null; gesture.current = null }
  }, [nodes, edges, size])

  function transform(next: ZoomTransform) { if (svgRef.current && zoomRef.current) select<SVGSVGElement, unknown>(svgRef.current).call(zoomRef.current.transform, next) }
  function fit() { transform(fitted(nodes, size.width, size.height)) }
  function changeZoom(factor: number) { if (svgRef.current && zoomRef.current) select<SVGSVGElement, unknown>(svgRef.current).call(zoomRef.current.scaleBy, factor) }
  function choose(node: MapNode, focus = true) {
    onSelect(node.id)
    if (focus) {
      const group = nodes.filter(item => item.id === node.id || edges.some(edge => (edge.source === node.id && edge.target === item.id) || (edge.target === node.id && edge.source === item.id)))
      transform(fitted(group, size.width, size.height))
    }
  }
  function point(event: PointerEvent<SVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect()
    return camera.invert([(event.clientX - rect.left) * size.width / rect.width, (event.clientY - rect.top) * size.height / rect.height])
  }
  function startDrag(event: PointerEvent<SVGGElement>, node: MapNode) {
    if (event.button !== 0 || gesture.current) return
    event.stopPropagation()
    const [x, y] = point(event)
    gesture.current = { pointer: event.pointerId, node, x: event.clientX, y: event.clientY, offsetX: node.x - x, offsetY: node.y - y, moved: false }
    svgRef.current?.setPointerCapture(event.pointerId)
  }
  function moveDrag(event: PointerEvent<SVGSVGElement>) {
    const active = gesture.current
    if (!active || active.pointer !== event.pointerId) return
    if (Math.hypot(event.clientX - active.x, event.clientY - active.y) < 4 && !active.moved) return
    active.moved = true
    const [x, y] = point(event)
    active.node.x = x + active.offsetX; active.node.y = y + active.offsetY
    setRevision(value => value + 1)
  }
  function endDrag(event: PointerEvent<SVGSVGElement>, cancelled = false) {
    const active = gesture.current
    if (!active || active.pointer !== event.pointerId) return
    gesture.current = null
    if (svgRef.current?.hasPointerCapture(event.pointerId)) svgRef.current.releasePointerCapture(event.pointerId)
    if (!cancelled) choose(active.node, false)
  }
  const labels: { node: MapNode; x: number; y: number; text: string; width: number }[] = []
  // Labels keep their screen size and skip collisions when zoomed out.
  for (const node of [...nodes].sort((a, b) => Number(b.id === selected) - Number(a.id === selected) || Number(neighbours.has(b.id)) - Number(neighbours.has(a.id)))) {
    if (node.id !== selected && !neighbours.has(node.id) && node.kind !== 'concept') continue
    const text = node.label.length > 30 ? node.label.slice(0, 28) + '…' : node.label
    const width = Math.min(size.width - 24, text.length * 7.2)
    const [px, py] = camera.apply([node.x, node.y])
    if (px < 0 || px > size.width || py < 12 || py > size.height - 12) continue
    const x = Math.min(size.width - width - 10, Math.max(10, px + 12)), y = py + 4
    if (labels.some(label => x < label.x + label.width + 7 && x + width + 7 > label.x && Math.abs(y - label.y) < 22)) continue
    labels.push({ node, x, y, text, width })
  }

  return <div className="knowledge-map" data-node-count={nodes.length} data-edge-count={links.length}>
    <div className="map-filters">
      <div className="map-search"><label htmlFor={`${id}-search`}>Find an idea</label><input ref={searchRef} id={`${id}-search`} type="search" value={query} maxLength={200} placeholder="Try attention, Python, or agents" autoComplete="off" onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setQuery('') }} />{query.trim() && <div className="map-search-results"><p role="status">{matches.length ? `${matches.length} matching ideas` : 'No matching ideas. Try another word or clear the filters.'}</p><ul aria-label="Matching ideas">{matches.map(node => <li key={node.id}><button type="button" onClick={() => { choose(node); setQuery(''); searchRef.current?.focus() }}><span>{node.label}</span><small>{node.kind}</small></button></li>)}</ul></div>}</div>
      <label className="map-course-filter">Course<select aria-label="Filter knowledge map by course" value={track} onChange={event => { setTrack(event.target.value); onSelect(null); setQuery('') }}><option value="all">All courses</option>{tracks.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
      <fieldset className="map-kind-filters"><legend>Show on the map</legend>{kinds.map(kind => <label key={kind}><input type="checkbox" checked={visibleKinds.has(kind)} onChange={() => { setVisibleKinds(previous => { const next = new Set(previous); if (next.has(kind)) next.delete(kind); else next.add(kind); return next }); if (current?.kind === kind) onSelect(null) }} /><span style={{ background: colors[kind] }} />{names[kind]}</label>)}</fieldset>
    </div>
    <div className="map-workspace"><div className="map-visual">
      <div className="map-toolbar"><span className="map-count" role="status">{nodes.length} ideas · {links.length} connections</span><div><button type="button" aria-label="Zoom out" onClick={() => changeZoom(1 / 1.35)}>−</button><output aria-label="Map zoom">{Math.round(camera.k * 100)}%</output><button type="button" aria-label="Zoom in" onClick={() => changeZoom(1.35)}>+</button><button type="button" onClick={fit}>Fit map</button></div></div>
      <div className="map-stage" ref={stageRef}><svg ref={svgRef} viewBox={`0 0 ${size.width} ${size.height}`} className="topo-svg" role="group" aria-label="Interactive knowledge map" aria-describedby={`${id}-instructions`} tabIndex={0} data-revision={revision} onPointerMove={moveDrag} onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)} onLostPointerCapture={() => { gesture.current = null }} onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (['+', '=', '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) {
          event.preventDefault()
          if (event.key === '+' || event.key === '=') changeZoom(1.35)
          else if (event.key === '-') changeZoom(1 / 1.35)
          else if (event.key === 'Home') fit()
          else transform(zoomIdentity.translate(camera.x + (event.key === 'ArrowLeft' ? 50 : event.key === 'ArrowRight' ? -50 : 0), camera.y + (event.key === 'ArrowUp' ? 50 : event.key === 'ArrowDown' ? -50 : 0)).scale(camera.k))
        }
      }}><g className="map-network" transform={camera.toString()}>
        {links.map((link, index) => { const source = link.source as MapNode, target = link.target as MapNode; const highlighted = source.id === selected || target.id === selected; return <line key={index} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={highlighted ? '#8e74ba' : '#c4cfdf'} strokeWidth={highlighted ? 2 : 1} vectorEffect="non-scaling-stroke" opacity={current && !highlighted ? .12 : .8} /> })}
        {nodes.map((node, index) => <g key={node.id} data-node-id={node.id} data-node-kind={node.kind} transform={`translate(${node.x},${node.y})`} role="button" aria-label={`${node.label}, ${node.kind}`} aria-pressed={node.id === selected} tabIndex={node.id === selected || (!current && index === 0) ? 0 : -1} opacity={current && node.id !== selected && !neighbours.has(node.id) ? .2 : 1} onPointerDown={event => startDrag(event, node)} onClick={event => { if (event.detail === 0) choose(node) }} onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); choose(node) }
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); const next = nodes[(index + (event.key === 'ArrowRight' ? 1 : -1) + nodes.length) % nodes.length]; choose(next); svgRef.current?.querySelector<SVGGElement>(`[data-node-id="${CSS.escape(next.id)}"]`)?.focus({ preventScroll: true }) }
        }}><title>{node.label} · {node.kind}</title><circle r={Math.max(12 / camera.k, radii[node.kind] / Math.sqrt(camera.k))} fill="transparent" /><circle className="map-node-dot" r={radii[node.kind] / Math.sqrt(camera.k)} fill={colors[node.kind]} stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />{node.id === selected && <circle r={(radii[node.kind] + 6) / Math.sqrt(camera.k)} fill="none" stroke={colors[node.kind]} strokeWidth={2} vectorEffect="non-scaling-stroke" />}</g>)}
      </g><g className="map-labels" aria-hidden="true">{labels.map(label => <text key={label.node.id} x={label.x} y={label.y} className={label.node.id === selected ? 'is-selected' : ''}>{label.text}</text>)}</g></svg>
      {!nodes.length && <div className="map-empty"><strong>No ideas are visible.</strong><p>Choose another course or restore the content types.</p><button type="button" onClick={() => { setTrack('all'); setVisibleKinds(new Set(kinds)); setQuery(''); onSelect(null) }}>Reset filters</button></div>}</div>
      <p id={`${id}-instructions`} className="map-instructions">Select a dot to explore. Drag dots or the background to move them. Use + / − to zoom, or pinch on a touch screen. With the map focused, arrow keys move the view and Home fits the map.</p>
    </div><aside className="topo-panel map-detail" aria-label="Selected idea and connections">
      {current ? <><div className="map-detail-top"><span className="map-type" style={{ color: colors[current.kind] }}>{current.kind}</span><button type="button" onClick={() => onSelect(null)} aria-label="Clear selected idea">×</button></div><h3>{current.label}</h3><p className="map-track-name">{tracks.find(item => item.slug === current.track)?.title}</p>{current.to && <Link to={current.to} className="btn btn-primary">Open {current.kind} →</Link>}<h4>Connected ideas <span>{connected.length}</span></h4>{connected.length ? <ul className="list map-connections">{connected.map(node => <li key={node.id}><button type="button" onClick={() => choose(node)}><span style={{ background: colors[node.kind] }} /><strong>{node.label}</strong><small>{node.kind}</small></button></li>)}</ul> : <p>No connections match these filters. Turn on more content types or choose All courses.</p>}</> : <><p className="map-overline">Follow your curiosity</p><h3>How to read it</h3><p>Every dot is an idea or a learning resource. Select one to highlight its connections and open a lesson, paper, lab, or definition.</p><h4>Start with an idea</h4><div className="map-starters">{presets.map(([key, label]) => { const node = nodes.find(item => item.id === key); return node ? <button type="button" key={key} onClick={() => choose(node)}>{label} →</button> : null })}</div><ul className="map-legend">{kinds.map(kind => <li key={kind}><span style={{ background: colors[kind] }} />{names[kind]}<strong>{nodes.filter(node => node.kind === kind).length}</strong></li>)}</ul></>}
      {expandedHref && <Link className="map-expand" to={expandedHref}>Open the full map page ↗</Link>}
    </aside></div>
  </div>
}
