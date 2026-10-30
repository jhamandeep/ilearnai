import { Link } from 'react-router-dom'
import '../knowledge-map.css'

export function HomeKnowledgeMap() {
  return <section id="knowledge-map" className="home-knowledge-map home-map-entry" aria-labelledby="home-map-heading">
    <div><p className="eyebrow">Your knowledge map</p><h2 id="home-map-heading">See how the ideas connect.</h2><p>Explore the connections between AI concepts, lessons, research, and labs.</p></div>
    <Link className="text-cta home-map-open" to="/knowledge-graph">Open the knowledge map <span aria-hidden="true">↗</span></Link>
  </section>
}
