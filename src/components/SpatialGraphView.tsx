import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { SpatialNode, SpatialEdge, SpatialState, SpatialGraphScene, SpatialGraphHandle } from '../lib/spatialGraphScene'
import type { SceneAppearance } from '../lib/spatialGraphPalette'

type Props = {
  nodes: SpatialNode[]; edges: SpatialEdge[]; selected: string | null; playing: boolean; motion: boolean
  appearance?: SceneAppearance
  onSelect: (id: string) => void; onInteract: () => void; onZoom?: (value: number) => void; onUnavailable?: () => void
}

export const SpatialGraphView = forwardRef<SpatialGraphHandle, Props>(function SpatialGraphView(props, ref) {
  const host = useRef<HTMLDivElement>(null), labels = useRef<HTMLDivElement>(null), scene = useRef<SpatialGraphScene | null>(null)
  const latest = useRef(props)
  const [status, setStatus] = useState('loading'), [visible, setVisible] = useState(false), [started, setStarted] = useState(false)
  const state: SpatialState = { selected: props.selected, playing: props.playing, motion: props.motion, visible, appearance: props.appearance ?? 'dark' }
  const latestState = useRef(state)
  useEffect(() => { latest.current = props; latestState.current = state; scene.current?.update(state) })
  useEffect(() => { scene.current?.data(props.nodes, props.edges) }, [props.nodes, props.edges])
  useImperativeHandle(ref, () => ({ fit: () => scene.current?.fit(), zoom: factor => scene.current?.zoom(factor), rotate: (x, y) => scene.current?.rotate(x, y) }), [])
  useEffect(() => {
    if (!host.current) return
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => { const active = entries.some(entry => entry.isIntersecting); setVisible(active); if (active) setStarted(true) }, { threshold: .05 })
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    let cancelled = false, engine: SpatialGraphScene | null = null
    const unavailable = () => { if (!cancelled) { setStatus('fallback'); latest.current.onUnavailable?.() } }
    import('../lib/spatialGraphScene').then(({ createSpatialGraph }) => {
      if (cancelled || !host.current || !labels.current) return
      engine = createSpatialGraph(host.current, labels.current, latestState.current, { select: id => latest.current.onSelect(id), interact: () => latest.current.onInteract(), zoom: value => latest.current.onZoom?.(value), unavailable })
      if (!engine) { unavailable(); return }
      scene.current = engine; engine.data(latest.current.nodes, latest.current.edges); setStatus('ready')
    }).catch(unavailable)
    return () => { cancelled = true; scene.current = null; engine?.dispose() }
  }, [started])
  return <div className="spatial-graph" data-appearance={props.appearance ?? 'dark'} data-spatial-status={status} data-playing={props.playing && visible}>
    <div className="spatial-renderer" ref={host} />
    <div className="spatial-label-layer" ref={labels} />
    {status === 'loading' && <div className="spatial-loading" role="status"><span aria-hidden="true">✧</span>Opening your connected world…</div>}
    {status === 'fallback' && <div className="spatial-fallback"><svg viewBox="0 0 500 240" aria-hidden="true"><path d="M60 150Q160 20 250 120T440 85" fill="none" stroke="#738bff" strokeWidth="3" />{[60,150,250,350,440].map((x, i) => <circle key={x} cx={x} cy={[150,90,120,140,85][i]} r="17" fill="#6078ee" stroke="#c5d2ff" strokeWidth="3" />)}</svg><p>Explore the connected ideas below.</p></div>}
  </div>
})
