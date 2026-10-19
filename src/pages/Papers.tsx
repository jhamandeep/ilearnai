import { Link, useParams } from 'react-router-dom'
import { papers, findPaper } from '../data/papers'
import { findTrack } from '../data/tracks'
import { Markdown } from '../components/Markdown'
import { NotFound } from './NotFound'

export function Papers() {
  const sorted = [...papers].sort((a, b) => b.day - a.day)
  return (
    <>
      <header className="page-head">
        <h1>Daily papers</h1>
        <p className="lede">One foundational paper a day, with notes on why it matters and what to look for.</p>
      </header>
      <ul className="paper-list">
        {sorted.map((p) => (
          <li key={p.slug}>
            <span className="meta">Day {p.day}</span>
            <Link to={`/papers/${p.slug}`}>
              <strong>{p.title}</strong>
            </Link>
            <p>{p.tldr}</p>
            <span className="meta">
              {p.venue} {p.year} · {findTrack(p.track)?.title}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export function PaperPage() {
  const { slug } = useParams()
  const paper = slug ? findPaper(slug) : undefined
  if (!paper) return <NotFound />
  return (
    <article className="lesson">
      <nav className="crumbs">
        <Link to="/papers">Papers</Link> / Day {paper.day}
      </nav>
      <header className="page-head">
        <h1>{paper.title}</h1>
        <p className="lede">{paper.tldr}</p>
        <span className="meta">
          {paper.authors} · {paper.venue} {paper.year} ·{' '}
          <a href={paper.url} target="_blank" rel="noreferrer">
            Read the paper
          </a>
        </span>
      </header>
      <Markdown>{paper.notes}</Markdown>
    </article>
  )
}
