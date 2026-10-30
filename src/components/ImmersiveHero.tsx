import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArtworkMotionContext } from '../lib/artworkMotion'
import type { IntelligenceScene } from '../lib/intelligenceScene'
import { useSceneAppearance } from '../lib/sceneAppearance'
import { SceneBackgroundToggle } from './SceneBackgroundToggle'

const formations = [
  { name: 'Connect', title: 'Ideas become connections.', detail: 'Follow a thread. Find the bigger picture.', link: '/knowledge-graph', action: 'Explore the knowledge map' },
  { name: 'Explore', title: 'Curiosity becomes understanding.', detail: 'See an idea move. Change something. See what happens.', link: '/labs', action: 'Step into a lab' },
  { name: 'Build', title: 'Understanding becomes possibility.', detail: 'Bring the pieces together in a project of your own.', link: '/courses/build-ai-ecosystem', action: 'Build something with AI' },
]

/** The page and all its links work before the optional 3D engine arrives. */
export function ImmersiveHero() {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<IntelligenceScene | null>(null)
  const motion = useContext(ArtworkMotionContext)
  const [appearance, setAppearance] = useSceneAppearance('playground')
  const [formation, setFormation] = useState(0)
  const [ready, setReady] = useState(false)
  const latest = useRef({ playing: motion.playing, formation, appearance })
  useEffect(() => {
    latest.current = { playing: motion.playing, formation, appearance }
    controller.current?.update(latest.current)
  }, [motion.playing, formation, appearance])
  useEffect(() => {
    let cancelled = false
    let scene: IntelligenceScene | undefined
    import('../lib/intelligenceScene').then(({ createIntelligenceScene }) => {
      if (cancelled || !host.current) return
      scene = createIntelligenceScene(host.current, latest.current, setReady)
      controller.current = scene
    }).catch(() => { /* The original SVG composition remains visible without WebGL. */ })
    return () => { cancelled = true; scene?.dispose(); controller.current = null }
  }, [])
  const current = formations[formation]
  return <section className="intelligence-hero" aria-label="Explore AI through connections, experiments, and projects" data-appearance={appearance} data-motion={motion.playing ? 'on' : 'off'} data-formation={formation}>
    <div ref={host} className="intelligence-canvas" aria-hidden="true" data-ready={ready}>
      <img className="intelligence-poster" src="/images/intelligence-sculpture.svg" alt="" width="1440" height="720" fetchPriority="high" />
    </div>
    <div className="intelligence-topline"><span><i /> A WORLD OF CONNECTED IDEAS</span><div className="intelligence-scene-settings"><span>ILEARNAI / PLAYGROUND 001</span><SceneBackgroundToggle appearance={appearance} onChange={setAppearance} label="Playground" /></div></div>
    <div className="intelligence-caption" aria-live="polite" aria-atomic="true"><p>{current.title}</p><span>{current.detail}</span></div>
    <div className="intelligence-bottom"><div className="formation-controls" role="group" aria-label="Change the AI sculpture">{formations.map((item, i) => <button type="button" key={item.name} aria-pressed={formation === i} onClick={() => setFormation(i)}><span>0{i + 1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div><Link className="scene-destination" to={current.link}><span>{current.action}</span><b aria-hidden="true">↗</b></Link></div>
  </section>
}
