import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Module, Track } from '../data/types'
import { lessonActivities } from '../lib/activities'
import { ArtworkMotionContext } from '../lib/artworkMotion'
import { SpatialGraphView } from './SpatialGraphView'
import type { SpatialGraphHandle } from '../lib/spatialGraphScene'

const modeNames: Record<string, string> = { lessons: 'Read & understand', videos: 'Watch the ideas unfold', practice: 'Put the idea to work', resources: 'Follow the evidence' }
export function ChapterJourney({ track, module, mode = 'lessons', activeLesson, compact = false }: { track: Track; module?: Module; mode?: string; activeLesson?: string; compact?: boolean }) {
  const motion = useContext(ArtworkMotionContext)
  const stage = useRef<SpatialGraphHandle>(null), root = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false), [paused, setPaused] = useState(false), [tour, setTour] = useState(false)
  const entries = useMemo(() => module ? module.lessons.map(lesson => {
    const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`
    const activities = lessonActivities(lesson, route)
    const activity = mode === 'videos' ? activities.find(item => item.kind === 'video') ?? activities.find(item => item.kind === 'resources') : mode === 'practice' ? activities.find(item => item.kind === 'exercise' || item.kind === 'quiz') : mode === 'resources' ? activities.find(item => item.kind === 'resources') : activities.find(item => item.kind === 'reading')
    return { id: lesson.slug, title: lesson.title, description: lesson.summary, objective: lesson.objectives[0], to: `${route}/${activity?.id ?? 'reading'}`, action: mode === 'videos' ? activity?.kind === 'video' ? 'Watch lesson' : 'Watch chapter series' : mode === 'practice' ? 'Open practice' : mode === 'resources' ? 'Explore resources' : 'Read lesson' }
  }) : track.modules.map(item => ({ id: item.slug, title: item.title, description: item.description, objective: `${item.lessons.length} lessons in this chapter`, to: `/courses/${track.slug}?chapter=${item.slug}&view=${mode}`, action: 'Explore chapter' })), [track, module, mode])
  const [selected, setSelected] = useState<string | null>(activeLesson ?? null)
  const index = Math.max(0, entries.findIndex(item => item.id === selected)), current = entries[index]
  const nodes = useMemo(() => entries.map(item => ({ id: item.id, label: item.title, kind: 'lesson' as const, track: track.slug })), [entries, track.slug])
  const edges = useMemo(() => entries.slice(1).map((item, i) => ({ source: entries[i].id, target: item.id })), [entries])
  const playing = motion.playing && visible && !paused
  useEffect(() => {
    if (!root.current) return
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(items => setVisible(items.some(item => item.isIntersecting)), { threshold: .1 })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!tour || !playing || entries.length < 2) return
    const timer = window.setInterval(() => setSelected(value => entries[(Math.max(0, entries.findIndex(item => item.id === value)) + 1) % entries.length].id), 7000)
    return () => clearInterval(timer)
  }, [tour, playing, entries])
  function choose(id: string) { setSelected(id); setTour(false); setPaused(true) }
  if (!current) return null
  return <section ref={root} className={`chapter-journey${compact ? ' is-compact' : ''}`} data-chapter-journey={module?.slug ?? 'all'} data-journey-mode={mode} data-motion={playing ? 'on' : 'off'} aria-label={module ? `${module.title} animated learning journey` : 'Animated course journey'}>
    <header><div><p>{module ? 'THIS CHAPTER, CONNECTED' : 'YOUR COURSE, CONNECTED'}</p><h3>{module?.title ?? 'One idea leads to the next.'}</h3></div><div className="chapter-scene-controls"><button type="button" disabled={!motion.playing} aria-pressed={tour} onClick={() => { setTour(value => !value); setPaused(false) }}>{tour ? 'Stop tour' : 'Play chapter tour'}</button><button type="button" disabled={!motion.playing} aria-pressed={paused || !motion.playing} onClick={() => { setPaused(value => !value); setTour(false) }}>{!motion.playing ? 'Motion off' : paused ? 'Play scene' : 'Pause scene'}</button></div></header>
    <div className="chapter-journey-body"><div className="chapter-spatial-stage"><SpatialGraphView ref={stage} nodes={nodes} edges={edges} selected={selected} playing={playing} motion={motion.playing} onSelect={choose} onInteract={() => { setPaused(true); setTour(false) }} /><div className="chapter-scene-hint">Drag to rotate · select a {module ? 'lesson' : 'chapter'} <button type="button" onClick={() => stage.current?.fit()}>Fit view</button></div></div>
      <div className="chapter-journey-detail" aria-live={tour ? 'off' : 'polite'}><span className="chapter-journey-count">{String(index + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')} <span>{modeNames[mode]}</span></span><h4 key={current.id}>{current.title}</h4><p>{current.description}</p>{current.objective && <div className="chapter-journey-outcome"><span>Take away</span>{current.objective}</div>}<Link to={current.to}>{current.action} <span aria-hidden="true">↗</span></Link><div className="chapter-journey-steps" role="group" aria-label={module ? 'Preview a lesson' : 'Preview a chapter'}>{entries.map((item, i) => <button key={item.id} type="button" aria-pressed={index === i} aria-label={item.title} title={item.title} onClick={() => choose(item.id)}>{i + 1}</button>)}</div></div>
    </div>
    <p className="chapter-journey-note">{module ? 'Connections show the lesson order in this chapter.' : 'Connections show the recommended chapter order.'} Use the tour to preview the next step; progress changes only when you complete an activity.</p>
  </section>
}
