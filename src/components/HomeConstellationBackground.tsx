import { useContext } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'
import '../home-constellation.css'

/** A decorative vector layer: no second WebGL scene, graph UI, or pointer targets. */
export function HomeConstellationBackground() {
  const motion = useContext(ArtworkMotionContext)
  return <div className="home-constellation-background" aria-hidden="true" data-motion={motion.playing ? 'on' : 'off'}>
    <img src="/images/knowledge-constellation-background.svg" alt="" width="1600" height="1000" decoding="async" draggable="false" />
  </div>
}
