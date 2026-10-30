import { useContext, useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, forceX, forceY, type SimulationNodeDatum, type SimulationLinkDatum } from 'd3-force'
import { select, zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3'
import { nodes as allNodes, edges as allEdges } from '../data/graph'
import { tracks } from '../data/tracks'
import type { ConceptKind, ConceptNode } from '../data/types'
import { ArtworkMotionContext } from '../lib/artworkMotion'
import { SpatialGraphView } from './SpatialGraphView'
import type { SpatialGraphHandle } from '../lib/spatialGraphScene'
import { spatialGraphLightPalette } from '../lib/spatialGraphPalette'
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
  // Establish a stable layout; the showcase adds bounded drift, not an endless force simulation.
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
  const [view, setView] = useState<'3d' | '2d'>('3d')
  const swatches = view === '3d' ? spatialGraphLightPalette : colors
  const [unavailable, setUnavailable] = useState(false)
  const [spatialZoom, setSpatialZoom] = useState(100)
  const spatial = useRef<SpatialGraphHandle>(null)
  const [visibleKinds, setVisibleKinds] = useState(new Set(kinds))
  const [query, setQuery] = useState('')
  const [size, setSize] = useState({ width: 900, height: 540 })
  const [camera, setCamera] = useState(zoomIdentity)
  const [revision, setRevision] = useState(0)
  const [showcase, setShowcase] = useState(true)
  const [inView, setInView] = useState(false)
  const motion = useContext(ArtworkMotionContext)
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
  const showcasing = showcase && motion.playing && inView && !selected && !query && nodes.length > 0

  useEffect(() => { selectedRef.current = selected }, [selected])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.max(200, entry.contentRect.width), height: entry.contentRect.height }))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!stageRef.current) return
    const observer = new IntersectionObserver(entries => setInView(entries.some(entry => entry.isIntersecting)), { threshold: .1 })
    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !showcasing || view !== '2d') return
    // Update SVG coordinates directly at 24 fps, without rerendering 849 React nodes per frame.
    const dots = [...svg.querySelectorAll<SVGGElement>('[data-node-id]')]
    const lines = [...svg.querySelectorAll<SVGLineElement>('.map-network > line')]
    const texts = [...svg.querySelectorAll<SVGTextElement>('.map-labels > text')].map(element => ({ element, index: nodes.findIndex(node => node.id === element.dataset.labelId), x: Number(element.getAttribute('x')), y: Number(element.getAttribute('y')) }))
    const signals = [...svg.querySelectorAll<SVGCircleElement>('.map-signal')]
    const beacons = [...svg.querySelectorAll<SVGCircleElement>('.map-beacon')].map(element => ({ element, node: nodes.find(node => node.id === element.dataset.idea) }))
    const origins = nodes.map(node => ({ x: node.x, y: node.y }))
    const amplitude = Math.min(36, 5 / camera.k)
    let frame = 0, start = 0, previous = 0
    function tick(now: number) {
      frame = requestAnimationFrame(tick)
      if (now - previous < 1000 / 24) return
      previous = now
      if (!start) start = now
      const time = (now - start) / 1000
      nodes.forEach((node, i) => {
        const phase = i * 1.618
        node.x = origins[i].x + (Math.sin(time * .32 + phase) - Math.sin(phase)) * amplitude
        node.y = origins[i].y + (Math.cos(time * .27 + phase) - Math.cos(phase)) * amplitude
        dots[i]?.setAttribute('transform', `translate(${node.x},${node.y})`)
      })
      links.forEach((link, i) => {
        const source = link.source as MapNode, target = link.target as MapNode, line = lines[i]
        line?.setAttribute('x1', String(source.x)); line?.setAttribute('y1', String(source.y))
        line?.setAttribute('x2', String(target.x)); line?.setAttribute('y2', String(target.y))
      })
      texts.forEach(({ element, index, x, y }) => {
        if (index < 0) return
        element.setAttribute('x', String(x + (nodes[index].x - origins[index].x) * camera.k))
        element.setAttribute('y', String(y + (nodes[index].y - origins[index].y) * camera.k))
      })
      signals.forEach((element, i) => {
        const link = links[(i * 97) % links.length]
        if (!link) return
        const source = link.source as MapNode, target = link.target as MapNode, progress = (time / 5 + i * .17) % 1
        element.setAttribute('cx', String(source.x + (target.x - source.x) * progress))
        element.setAttribute('cy', String(source.y + (target.y - source.y) * progress))
        element.setAttribute('opacity', String(Math.sin(progress * Math.PI) * .9))
      })
      beacons.forEach(({ element, node }, i) => {
        if (!node) return
        const wave = (time / 6 + i * .3) % 1
        element.setAttribute('cx', String(node.x)); element.setAttribute('cy', String(node.y))
        element.setAttribute('r', String((9 + wave * 24) / camera.k))
        element.setAttribute('opacity', String((1 - wave) * .45))
      })
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame) }
  }, [showcasing, nodes, links, camera, view])
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
      .on('start', event => { if (event.sourceEvent) setShowcase(false) })
    zoomRef.current = behavior
    surface.call(behavior).on('dblclick.zoom', null)
    const initial = nodes.find(node => node.id === selectedRef.current)
    const group = initial ? nodes.filter(node => node.id === initial.id || edges.some(edge => (edge.source === initial.id && edge.target === node.id) || (edge.target === initial.id && edge.source === node.id))) : nodes
    surface.call(behavior.transform, fitted(group, size.width, size.height))
    return () => { surface.on('.zoom', null); zoomRef.current = null; gesture.current = null }
  }, [nodes, edges, size, view])

  function transform(next: ZoomTransform) { if (svgRef.current && zoomRef.current) select<SVGSVGElement, unknown>(svgRef.current).call(zoomRef.current.transform, next) }
  function fit() { if (view === '3d') spatial.current?.fit(); else transform(fitted(nodes, size.width, size.height)) }
  function changeZoom(factor: number) { if (view === '3d') { spatial.current?.zoom(factor); return } if (svgRef.current && zoomRef.current) select<SVGSVGElement, unknown>(svgRef.current).call(zoomRef.current.scaleBy, factor) }
  function choose(node: MapNode, focus = true) {
    setShowcase(false)
    onSelect(node.id)
    if (focus && view === '2d') {
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
    const gap = showcasing ? 27 : 7
    if (labels.some(label => x < label.x + label.width + gap && x + width + gap > label.x && Math.abs(y - label.y) < (showcasing ? 44 : 22))) continue
    labels.push({ node, x, y, text, width })
  }

  return <div className="knowledge-map" data-view={view} data-appearance="light" data-has-selection={!!current} data-node-count={nodes.length} data-edge-count={links.length} data-showcase={showcasing ? 'playing' : 'paused'} onPointerDownCapture={event => { if (!(event.target as Element).closest('[data-map-playback]')) setShowcase(false) }} onFocusCapture={event => { if (!(event.target as Element).closest('[data-map-playback]')) setShowcase(false) }}>
    <div className="map-filters">
      <div className="map-search"><label htmlFor={`${id}-search`}>Find an idea</label><input ref={searchRef} id={`${id}-search`} type="search" value={query} maxLength={200} placeholder="Try attention, Python, or agents" autoComplete="off" onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setQuery('') }} />{query.trim() && <div className="map-search-results"><p role="status">{matches.length ? `${matches.length} matching ideas` : 'No matching ideas. Try another word or clear the filters.'}</p><ul aria-label="Matching ideas">{matches.map(node => <li key={node.id}><button type="button" onClick={() => { choose(node); setQuery(''); searchRef.current?.focus() }}><span>{node.label}</span><small>{node.kind}</small></button></li>)}</ul></div>}</div>
      <label className="map-course-filter">Course<select aria-label="Filter knowledge map by course" value={track} onChange={event => { setTrack(event.target.value); onSelect(null); setQuery('') }}><option value="all">All courses</option>{tracks.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
      <fieldset className="map-kind-filters"><legend>Show on the map</legend>{kinds.map(kind => <label key={kind}><input type="checkbox" checked={visibleKinds.has(kind)} onChange={() => { setVisibleKinds(previous => { const next = new Set(previous); if (next.has(kind)) next.delete(kind); else next.add(kind); return next }); if (current?.kind === kind) onSelect(null) }} /><span style={{ background: swatches[kind] }} />{names[kind]}</label>)}</fieldset>
    </div>
    <div className="map-workspace"><div className="map-visual">
      <div className="map-view-picker"><strong>AI knowledge map</strong><div className="map-dimension-toggle" role="group" aria-label="Map view"><button type="button" aria-pressed={view === '3d'} disabled={unavailable} onClick={() => { setView('3d'); setShowcase(true) }}>3D view</button><button type="button" aria-pressed={view === '2d'} onClick={() => setView('2d')}>2D view</button></div></div>{unavailable && <p className="map-fallback-note" role="status">Showing the 2D map on this device. Search and all learning links are available.</p>}
      <div className="map-toolbar"><span className="map-count" role="status">{nodes.length} ideas · {links.length} connections</span><div><button type="button" className="map-showcase-toggle" data-map-playback aria-pressed={showcase && !selected && !query} disabled={!motion.playing} title={!motion.playing ? 'Enable visual motion in the header to play the showcase' : 'Motion pauses when you explore the map'} onClick={() => { if (showcase && !selected && !query) setShowcase(false); else { onSelect(null); setQuery(''); fit(); setShowcase(true) } }}><i aria-hidden="true" />{!motion.playing ? 'Motion off' : showcase && !selected && !query ? 'Pause showcase' : 'Play showcase'}</button><button type="button" aria-label="Zoom out" onClick={() => changeZoom(1 / 1.35)}>−</button><output aria-label="Map zoom">{view === '3d' ? spatialZoom : Math.round(camera.k * 100)}%</output><button type="button" aria-label="Zoom in" onClick={() => changeZoom(1.35)}>+</button><button type="button" onClick={fit}>Fit map</button></div></div>
      <div className="map-stage" ref={stageRef}>{view === '3d' ? <SpatialGraphView ref={spatial} appearance="light" nodes={nodes} edges={edges} selected={selected} playing={showcasing} motion={motion.playing} onSelect={id => { const node = nodes.find(node => node.id === id); if (node) choose(node) }} onInteract={() => setShowcase(false)} onZoom={setSpatialZoom} onUnavailable={() => { setUnavailable(true); setView('2d') }} /> : <svg ref={svgRef} viewBox={`0 0 ${size.width} ${size.height}`} className="topo-svg" role="group" aria-label="Interactive knowledge map" aria-describedby={`${id}-instructions`} tabIndex={0} data-revision={revision} onPointerMove={moveDrag} onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)} onLostPointerCapture={() => { gesture.current = null }} onKeyDown={event => {
        if (event.target !== event.currentTarget) return
        if (['+', '=', '-', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) {
          event.preventDefault()
          if (event.key === '+' || event.key === '=') changeZoom(1.35)
          else if (event.key === '-') changeZoom(1 / 1.35)
          else if (event.key === 'Home') fit()
          else transform(zoomIdentity.translate(camera.x + (event.key === 'ArrowLeft' ? 50 : event.key === 'ArrowRight' ? -50 : 0), camera.y + (event.key === 'ArrowUp' ? 50 : event.key === 'ArrowDown' ? -50 : 0)).scale(camera.k))
        }
      }}><g className="map-network" transform={camera.toString()}>
        {links.map((link, index) => { const source = link.source as MapNode, target = link.target as MapNode; const highlighted = source.id === selected || target.id === selected; return <line key={index} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={highlighted ? '#5968b1' : '#b0bdd5'} strokeWidth={highlighted ? 2 : 1} vectorEffect="non-scaling-stroke" opacity={current && !highlighted ? .12 : .8} /> })}
        <g className="map-signals" aria-hidden="true" pointerEvents="none">{links.slice(0, 18).map((_, index) => <circle key={index} className="map-signal" r={3 / camera.k} fill={index % 2 ? '#7488ff' : '#334cf2'} opacity={0} />)}{presets.map(([key]) => <circle key={key} data-idea={key} className="map-beacon" fill="none" stroke="#667ff1" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity={0} />)}</g>
        {nodes.map((node, index) => <g key={node.id} data-node-id={node.id} data-node-kind={node.kind} transform={`translate(${node.x},${node.y})`} role="button" aria-label={`${node.label}, ${node.kind}`} aria-pressed={node.id === selected} tabIndex={node.id === selected || (!current && index === 0) ? 0 : -1} opacity={current && node.id !== selected && !neighbours.has(node.id) ? .2 : 1} onPointerDown={event => startDrag(event, node)} onClick={event => { if (event.detail === 0) choose(node) }} onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); choose(node) }
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); const next = nodes[(index + (event.key === 'ArrowRight' ? 1 : -1) + nodes.length) % nodes.length]; choose(next); svgRef.current?.querySelector<SVGGElement>(`[data-node-id="${CSS.escape(next.id)}"]`)?.focus({ preventScroll: true }) }
        }}><title>{node.label} · {node.kind}</title><circle r={Math.max(12 / camera.k, radii[node.kind] / Math.sqrt(camera.k))} fill="transparent" /><circle className="map-node-dot" r={radii[node.kind] / Math.sqrt(camera.k)} fill={swatches[node.kind]} stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />{node.id === selected && <circle r={(radii[node.kind] + 6) / Math.sqrt(camera.k)} fill="none" stroke={swatches[node.kind]} strokeWidth={2} vectorEffect="non-scaling-stroke" />}</g>)}
      </g><g className="map-labels" aria-hidden="true">{labels.map(label => <text key={label.node.id} data-label-id={label.node.id} x={label.x} y={label.y} className={label.node.id === selected ? 'is-selected' : ''}>{label.text}</text>)}</g></svg>}

      {!nodes.length && <div className="map-empty"><strong>No ideas are visible.</strong><p>Choose another course or restore the content types.</p><button type="button" onClick={() => { setTrack('all'); setVisibleKinds(new Set(kinds)); setQuery(''); onSelect(null) }}>Reset filters</button></div>}</div>
      <p id={`${id}-instructions`} className="sr-only">{view === '3d' ? 'Drag to orbit in 3D. Select a sphere or label to explore its real connections. Use + / − or pinch to zoom; Ctrl/Command + wheel also zooms. Arrow keys rotate and Home fits the map.' : 'Select a dot, drag to move, or use + / − to zoom. Pinch on a touch screen. Arrow keys move the view and Home fits the map.'} Showcase motion pauses while you explore.</p>
    </div>{current && <aside className="topo-panel map-detail" aria-label="Selected idea and connections">
      <div className="map-detail-top"><span className="map-type" style={{ color: colors[current.kind] }}>{current.kind}</span><button type="button" onClick={() => onSelect(null)} aria-label="Clear selected idea">×</button></div><h3>{current.label}</h3><p className="map-track-name">{tracks.find(item => item.slug === current.track)?.title}</p>{current.to && <Link to={current.to} className="btn btn-primary">Open {current.kind} →</Link>}<h4>Connected ideas <span>{connected.length}</span></h4>{connected.length ? <ul className="list map-connections">{connected.map(node => <li key={node.id}><button type="button" onClick={() => choose(node)}><span style={{ background: swatches[node.kind] }} /><strong>{node.label}</strong><small>{node.kind}</small></button></li>)}</ul> : <p>No connections match these filters.</p>}
    </aside>}</div>
    <div className="map-footer"><div className="map-starters" aria-label="AI topics">{presets.map(([key, label]) => { const node = nodes.find(item => item.id === key); return node ? <button type="button" key={key} onClick={() => choose(node)}>{label} →</button> : null })}</div>{expandedHref && <Link className="map-expand" to={expandedHref}>Open the full map ↗</Link>}</div>
  </div>
}
