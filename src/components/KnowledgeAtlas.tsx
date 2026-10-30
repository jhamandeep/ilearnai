import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { ConceptNode } from '../data/types'
import { atlasItem, knowledgeAreas, kindNames, type AtlasData } from '../lib/knowledgeAtlasModel'
import type { AtlasScene, AtlasState } from '../lib/knowledgeAtlasScene'
import type { SpatialEdge, SpatialGraphHandle } from '../lib/spatialGraphScene'
import '../knowledge-atlas.css'

type Props = {
  nodes: ConceptNode[]; edges: SpatialEdge[]; selected: string | null; playing: boolean; motion: boolean
  onSelect: (id: string | null) => void; onInteract: () => void; onZoom: (value: number) => void; onUnavailable: () => void
}

export const KnowledgeAtlas = forwardRef<SpatialGraphHandle, Props>(function KnowledgeAtlas(props, ref) {
  const [areaId, setAreaId] = useState<string | null>(null)
  const [page, setPage] = useState({ key: '', index: 0 })
  const [visible, setVisible] = useState(false), [started, setStarted] = useState(false), [status, setStatus] = useState('loading')
  const host = useRef<HTMLDivElement>(null), labels = useRef<HTMLDivElement>(null), scene = useRef<AtlasScene | null>(null)
  const groups = useMemo(() => knowledgeAreas(props.nodes), [props.nodes])
  const selected = props.nodes.find(node => node.id === props.selected)
  const area = selected ? groups.find(group => group.members.some(node => node.id === selected.id)) : groups.find(group => group.id === areaId)
  const connected = useMemo(() => {
    const ids = new Set(props.edges.flatMap(edge => edge.source === props.selected ? [edge.target] : edge.target === props.selected ? [edge.source] : []))
    const order = props.nodes.find(node => node.id === props.selected)?.kind === 'concept' ? ['lesson', 'lab', 'paper', 'concept', 'term'] : ['concept', 'lesson', 'lab', 'paper', 'term']
    return props.nodes.filter(node => ids.has(node.id)).sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.label.localeCompare(b.label))
  }, [props.nodes, props.edges, props.selected])
  const candidates = useMemo(() => area ? (selected && !area.topics.some(node => node.id === selected.id) ? [selected, ...area.topics] : area.topics).map(atlasItem) : groups, [selected, area, groups])
  const key = selected?.id ?? area?.id ?? 'overview'
  const selectedPage = Math.max(0, Math.floor(candidates.findIndex(item => item.id === selected?.id) / 6))
  const count = Math.max(1, Math.ceil(candidates.length / 6)), currentPage = page.key === key ? Math.min(page.index, count - 1) : selectedPage
  const data = useMemo<AtlasData>(() => ({ key, root: selected ? atlasItem(selected) : area ?? null, items: candidates.slice(currentPage * 6, currentPage * 6 + 6), totalNodes: props.nodes.length, totalEdges: props.edges.length, nodes: props.nodes, edges: props.edges, groups, areaId: area?.id ?? null, selected: selected?.id ?? null }), [key, selected, area, currentPage, props.nodes, props.edges, candidates, groups])
  const state: AtlasState = { playing: props.playing, motion: props.motion, visible }
  const latest = useRef({ props, data, state })
  useEffect(() => { latest.current = { props, data, state }; scene.current?.update(state) })
  useEffect(() => { scene.current?.data(data) }, [data])
  useImperativeHandle(ref, () => ({ fit: () => scene.current?.fit(), zoom: factor => scene.current?.zoom(factor), rotate: (x, y) => scene.current?.rotate(x, y) }), [])
  useEffect(() => {
    if (!host.current) return
    const observer = new IntersectionObserver(entries => { const active = entries.some(entry => entry.isIntersecting); setVisible(active); if (active) setStarted(true) }, { threshold: .05 })
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    let cancelled = false, engine: AtlasScene | null = null
    const unavailable = () => { if (!cancelled) { setStatus('fallback'); latest.current.props.onUnavailable() } }
    import('../lib/knowledgeAtlasScene').then(({ createKnowledgeAtlas }) => {
      if (cancelled || !host.current || !labels.current) return
      engine = createKnowledgeAtlas(host.current, labels.current, latest.current.state, {
        select: id => { if (id.startsWith('area:')) { setAreaId(id); latest.current.props.onSelect(null) } else latest.current.props.onSelect(id) },
        interact: () => latest.current.props.onInteract(), zoom: value => latest.current.props.onZoom(value), unavailable,
      })
      if (!engine) { unavailable(); return }
      scene.current = engine; engine.data(latest.current.data); setStatus('ready')
    }).catch(unavailable)
    return () => { cancelled = true; scene.current = null; engine?.dispose() }
  }, [started])
  function allTopics() { setAreaId(null); props.onSelect(null); setPage({ key: 'overview', index: 0 }) }
  return <div className="knowledge-atlas spatial-graph" data-appearance="light" data-presentation="constellation" data-atlas-level={selected ? 'idea' : area ? 'area' : 'overview'} data-spatial-status={status} data-playing={props.playing && visible} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); if (selected) { setAreaId(area?.id ?? null); props.onSelect(null) } else allTopics() } }}>
    <div className="atlas-navigation" aria-label="Knowledge map location">
      {area || selected ? <button type="button" data-atlas-area onClick={allTopics}>← All topics</button> : <span>Explore AI</span>}
      {area && <>{selected ? <button type="button" data-atlas-area onClick={() => { setAreaId(area.id); props.onSelect(null) }}>{area.label}</button> : <strong>{area.label}</strong>}</>}
      {selected && <span className="atlas-current" title={selected.label}>{selected.label}</span>}
    </div>
    <div className="atlas-canvas-space"><div className="atlas-nebula" aria-hidden="true" /><div className="spatial-renderer" ref={host} /><div className="spatial-label-layer" ref={labels} />{status === 'loading' && <div className="spatial-loading" role="status">Opening the knowledge constellation…</div>}</div>
    <div className="atlas-bottom">
      {count > 1 && <div className="atlas-pagination" aria-label="Map topic pages"><button type="button" data-atlas-area disabled={!currentPage} onClick={() => setPage({ key, index: currentPage - 1 })}>← Previous</button><span aria-live="polite">{currentPage + 1} / {count}</span><button type="button" data-atlas-area disabled={currentPage >= count - 1} onClick={() => setPage({ key, index: currentPage + 1 })}>More ideas →</button></div>}
      <nav className="atlas-areas" aria-label="Learning areas">{groups.map((group, index) => <button key={group.id} type="button" data-atlas-area aria-pressed={area?.id === group.id} aria-label={`Go to ${group.label}`} onClick={() => { setAreaId(group.id); props.onSelect(null); setPage({ key: group.id, index: 0 }) }}><small>{String(index + 1).padStart(2, '0')}</small><strong>{group.label}</strong><span>{group.members.length} resources ↗</span></button>)}</nav>
      {area && <details key={area.id} className="atlas-library"><summary>Browse all {area.members.length} resources in {area.label}</summary><ul aria-label={`${area.label} resources`}>{area.members.map(node => <li key={node.id}><button type="button" data-resource-id={node.id} onClick={() => props.onSelect(node.id)}><span>{node.label}</span><small>{kindNames[node.kind]}</small></button></li>)}</ul></details>}
      {selected && !connected.length && <p className="atlas-no-connections">No connected ideas match the current filters.</p>}
    </div>
  </div>
})
