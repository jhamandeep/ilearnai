import { Link } from 'react-router-dom'
import { videosForTrack } from '../data/videos'
import { resourcesForTrack } from '../data/resources'
import { openResources } from '../data/openResources'
import type { LessonLink } from '../data/types'

const categories: { kind: LessonLink['kind']; label: string }[] = [
  { kind: 'video', label: 'Videos and lectures' },
  { kind: 'course', label: 'Courses' },
  { kind: 'docs', label: 'Documentation' },
  { kind: 'repo', label: 'Code and repositories' },
  { kind: 'paper', label: 'Research papers' },
  { kind: 'article', label: 'Articles and guides' },
]

export function LearningResources({ track, links = [] }: { track: string; links?: LessonLink[] }) {
  const videoCount = videosForTrack(track).length
  const resourceCount = resourcesForTrack(track).length
  return (
    <section id="further-learning" className="learning-resources">
      <header><p className="eyebrow">Go further</p><h2>Videos and resources</h2><p>Explore the sources for this lesson, or browse everything for this track.</p></header>
      {links.length > 0 && <div className="lesson-resource-groups">{categories.map(({ kind, label }) => {
        const items = links.filter((link) => link.kind === kind)
        return items.length ? <div className="lesson-resource-group" key={kind}><h3>{label} <span className="meta">{items.length}</span></h3><ul>{items.map((link, i) => <li key={`${link.url}-${i}`}><a href={link.url} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a></li>)}</ul></div> : null
      })}</div>}
      <div className="related-open-resources">{openResources.filter(item => item.track === track).slice(0, 3).map(item => <article key={item.url}><span className="eyebrow">{item.kind === 'visualization' ? 'Interactive visualization' : 'Open-source project'}</span><h3><a href={item.url} target="_blank" rel="noreferrer">{item.title} ↗</a></h3><p>{item.why}</p><p><strong>Try it:</strong> {item.firstTask}</p><small>{item.setup}</small>{item.repoUrl && <a href={item.repoUrl} target="_blank" rel="noreferrer">GitHub source ↗</a>}</article>)}</div>
      <div className="track-library-links"><Link to={`/videos?track=${track}`}><span>Video library</span><strong>{videoCount} videos, playlists, and channels</strong><span>Browse by level and topic ↗</span></Link><Link to={`/resources?track=${track}`}><span>Resource library</span><strong>{resourceCount} courses, books, and tools</strong><span>Browse by level and topic ↗</span></Link><Link to={`/hub?tab=practicals&track=${track}`}><span>Put it into practice</span><strong>Notebooks, models, and datasets</strong><span>Open this track in the AI hub ↗</span></Link></div>
    </section>
  )
}
