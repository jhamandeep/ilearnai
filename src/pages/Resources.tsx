import { Link, useSearchParams } from 'react-router-dom'
import { resources, tools } from '../data/resources'
import { levelInfo } from '../data/types'
import { LibraryFilters } from '../components/LibraryFilters'
import { groupLibrary } from '../lib/library'
import { useLibraryFilters } from '../lib/useLibraryFilters'

const kinds = ['course', 'book', 'lecture', 'repo', 'blog', 'paper-list', 'tool', 'visualization'] as const
const all = [...resources, ...tools]

export function Resources() {
  const filters = useLibraryFilters(kinds)
  const [params] = useSearchParams()
  const openOnly = params.get('collection') === 'open-source'
  const query = filters.q.trim().toLowerCase()
  const filtered = all.filter((resource) => (!openOnly || resource.openSource) && (filters.track === 'all' || resource.track === filters.track) && (filters.level === 'all' || resource.level === filters.level) && (filters.kind === 'all' || resource.kind === filters.kind) && `${resource.title} ${resource.topic} ${resource.why}`.toLowerCase().includes(query))
  const groups = groupLibrary(filtered)
  return (
    <>
      <header className="page-head"><p className="eyebrow">Your learning library</p><h1>Resources</h1><p className="lede">Courses, books, lectures, repositories, reading lists, and tools, organized by level, learning track, and topic. Find something to read, inspect, or build. Open-source libraries are labelled; hosted services and books may have separate costs.</p><div className="hero-actions"><Link to="/videos" className="text-cta">Browse videos and playlists ↗</Link><Link to="/hub" className="text-cta">Explore models and datasets ↗</Link></div></header>
      <nav className="resource-shortcuts" aria-label="Resource collections"><Link to="/certifications">Certification pathways ↗</Link><Link to="/ai-infrastructure">AI infrastructure ↗</Link><Link to="/resources?kind=repo">GitHub &amp; repositories ↗</Link><Link to="/resources?kind=visualization">Interactive visualizations ↗</Link><Link to="/resources?collection=open-source">Open-source projects ↗</Link><Link to="/code">Practice Python here →</Link></nav>
      <LibraryFilters filters={filters} kinds={kinds} count={filtered.length} total={all.length} label="resources" />
      {openOnly && <p className="meta">Open-source collection · <Link to="/resources">Show all resources</Link></p>}
      {groups.map((group) => <section className="level-group" key={group.level} id={`resources-${group.level}`}><div className="level-head"><h2><span className={`lvl lvl-${group.level}`}>{levelInfo[group.level].short}</span>{levelInfo[group.level].label}</h2><p>{levelInfo[group.level].who}</p><span className="meta">{group.count} resources</span></div>{group.tracks.map(({ track, count, topics }) => <section className="library-track" key={track.slug}><div className="library-track-head"><h3><Link to={`/courses/${track.slug}`}>{track.title}</Link></h3><span className="meta">{count} resources</span></div>{topics.map(({ topic, items }) => <div className="module library-topic" key={topic}><h4>{topic} <span className="meta">{items.length}</span></h4><ul className="res-list">{items.map((resource, index) => <li className="res" key={`${resource.url}-${index}`} data-resource-track={resource.track} data-resource-level={resource.level}><span className="resource-type">{resource.kind === 'paper-list' ? 'Reading list' : resource.kind === 'repo' ? 'Repository' : resource.kind}</span><a href={resource.url} target="_blank" rel="noreferrer"><strong>{resource.title}</strong></a><p>{resource.why}</p>{resource.setup && <p className="resource-setup">{resource.setup}</p>}{resource.firstTask && <div className="resource-first-task"><strong>Try this first</strong><p>{resource.firstTask}</p></div>}{resource.openSource && <span className="resource-open">Open-source project</span>}<a href={resource.url} target="_blank" rel="noreferrer" className="video-source">Open resource ↗</a>{resource.repoUrl && <a className="video-source resource-repo" href={resource.repoUrl} target="_blank" rel="noreferrer">GitHub source ↗</a>}</li>)}</ul></div>)}</section>)}</section>)}
      {!filtered.length && <div className="library-empty"><h2>No matching resources</h2><p>Try another track, level, or search term.</p><button type="button" className="btn" onClick={filters.clearFilters}>Show all resources</button></div>}
    </>
  )
}
