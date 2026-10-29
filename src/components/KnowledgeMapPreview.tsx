import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { nodes, edges } from '../data/graph'
import { ArtworkMotionContext } from '../lib/artworkMotion'

const topics = [
  { id: 'attention', title: 'Attention', question: 'How does AI connect the words in a sentence?' },
  { id: 'retrieval', title: 'Retrieval & RAG', question: 'How can an AI answer using your documents?' },
  { id: 'agents', title: 'AI agents', question: 'How does AI use tools to carry out a task?' },
]
const kindLabel = { concept: 'Related idea', lesson: 'Understand it', paper: 'Read the research', lab: 'Try it yourself', term: 'Learn the term' }

export function KnowledgeMapPreview() {
  const [topic, setTopic] = useState(topics[0])
  const { playing } = useContext(ArtworkMotionContext)
  const id = `concept:${topic.id}`
  const connectedIds = new Set(edges.flatMap(edge => edge.source === id ? [edge.target] : edge.target === id ? [edge.source] : []))
  const connected = nodes.filter(node => connectedIds.has(node.id))
  // Use real connections from the full map; show one destination of each kind.
  const destinations = (['lesson', 'paper', 'lab', 'concept', 'term'] as const).flatMap(kind => {
    const node = connected.find(item => item.kind === kind)
    return node ? [node] : []
  }).slice(0, 3)
  return <section id="knowledge-map" className="home-knowledge-map" aria-labelledby="home-map-heading" data-motion={playing ? 'on' : 'off'}>
    <div className="home-map-copy"><p className="eyebrow">Your knowledge map</p><h2 id="home-map-heading">See how AI<br />fits together.</h2><p>Start with one question. Follow the connections to a clear explanation, the original research, and a chance to try the idea.</p><Link className="btn btn-primary" to={`/knowledge-graph?node=${encodeURIComponent(id)}`}>Explore the knowledge map →</Link></div>
    <div className="home-map-preview"><div className="home-map-topics" role="group" aria-label="Choose a knowledge map preview">{topics.map(item => <button type="button" key={item.id} aria-pressed={topic.id === item.id} onClick={() => setTopic(item)}>{item.title}</button>)}</div><p className="home-map-question" aria-live="polite">{topic.question}</p><div className="home-map-connections">
      <svg className="home-map-lines" viewBox="0 0 500 340" preserveAspectRatio="none" aria-hidden="true"><path d="M130 170H185Q200 170 200 150V65Q200 50 220 50H340M130 170H340M130 170H185Q200 170 200 190V275Q200 290 220 290H340" /><path className="home-map-signal" d="M130 170H185Q200 170 200 150V65Q200 50 220 50H340M130 170H340M130 170H185Q200 170 200 190V275Q200 290 220 290H340" /></svg>
      <div className="home-map-concept"><span aria-hidden="true">◎</span><strong>{topic.title}</strong><small>One idea.<br />Many connections.</small></div>
      <ul className="home-map-destinations">{destinations.map(node => <li key={node.id}><Link to={node.to ?? `/knowledge-graph?node=${encodeURIComponent(node.id)}`} data-map-kind={node.kind}><small>{kindLabel[node.kind]}</small><strong>{node.label}</strong><span aria-hidden="true">↗</span></Link></li>)}</ul>
    </div><p className="home-map-caption">A few connections to get you started. Open the full map to keep exploring.</p></div>
  </section>
}
