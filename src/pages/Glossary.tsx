import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { glossary, findTerm } from '../data/glossary'
import { NotFound } from './NotFound'

export function Glossary() {
  const [q, setQ] = useState('')
  const filtered = glossary
    .filter((g) => g.term.toLowerCase().includes(q.toLowerCase()) || g.short.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term))
  return (
    <>
      <header className="page-head">
        <h1>Glossary</h1>
        <p className="lede">Short definitions with links to the lessons that go deeper.</p>
      </header>
      <input className="search" placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} />
      <dl className="glossary">
        {filtered.map((g) => (
          <div key={g.slug}>
            <dt>
              <Link to={`/glossary/${g.slug}`}>{g.term}</Link>
            </dt>
            <dd>{g.short}</dd>
          </div>
        ))}
        {filtered.length === 0 && <p className="meta">No terms match.</p>}
      </dl>
    </>
  )
}

export function TermPage() {
  const { slug } = useParams()
  const term = slug ? findTerm(slug) : undefined
  if (!term) return <NotFound />
  return (
    <article className="lesson">
      <nav className="crumbs">
        <Link to="/glossary">Glossary</Link> / {term.term}
      </nav>
      <header className="page-head">
        <h1>{term.term}</h1>
        <p className="lede">{term.short}</p>
      </header>
      <div className="prose">
        <p>{term.long}</p>
      </div>
      {term.related.length > 0 && (
        <>
          <h3>Related</h3>
          <ul className="list">
            {term.related.map((r) => {
              const t = findTerm(r)
              return t ? (
                <li key={r}>
                  <Link to={`/glossary/${r}`}>{t.term}</Link>
                </li>
              ) : null
            })}
          </ul>
        </>
      )}
    </article>
  )
}
