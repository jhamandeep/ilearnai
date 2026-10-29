import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../knowledge-map.css'

const KnowledgeMap = lazy(() => import('./KnowledgeMap'))

export function HomeKnowledgeMap() {
  const [selected, setSelected] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!section.current) return
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect() } }, { rootMargin: '300px' })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])
  const loading = <div className="home-map-loading"><p role="status">Opening the interactive knowledge map…</p><Link to="/knowledge-graph">Open the map page →</Link></div>
  return <section ref={section} id="knowledge-map" className="home-knowledge-map" aria-labelledby="home-map-heading"><header className="home-map-heading"><div><p className="eyebrow">Your knowledge map</p><h2 id="home-map-heading">Explore how AI connects.</h2></div><p>The whole map, right here. Find a topic, follow its connections, and open the lesson, research, or lab that helps it make sense.</p></header>{ready ? <Suspense fallback={loading}><KnowledgeMap selected={selected} onSelect={setSelected} expandedHref={`/knowledge-graph${selected ? `?node=${encodeURIComponent(selected)}` : ''}`} /></Suspense> : loading}</section>
}
