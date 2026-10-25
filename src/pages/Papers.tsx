import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { papers, findPaper } from '../data/papers'
import { findTrack, tracks } from '../data/tracks'
import { levelInfo, levelOrder, type Level } from '../data/types'
import { paperLinks, models, datasets } from '../data/portals'
import { Markdown } from '../components/Markdown'
import { NotFound } from './NotFound'
import type { Paper } from '../data/types'

export function paperLevel(p: Paper): Level {
  return p.level ?? findTrack(p.track)?.level ?? 'intermediate'
}

export function Papers() {
  const [track, setTrack] = useState('all')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [q, setQ] = useState('')
  const sortedTracks = useMemo(() => [...tracks].sort((a, b) => a.order - b.order), [])
  const filtered = papers.filter((p) => (track === 'all' || p.track === track) && (level === 'all' || paperLevel(p) === level) && (p.title + p.authors + p.tldr + (p.tags ?? []).join(' ')).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <header className="page-head">
        <h1>Papers with reading notes</h1>
        <p className="lede">
          {papers.length} papers, each with notes on what it does, why it matters, how to read it and what came next. Grouped by the level you need to read them. Every paper page links to Hugging Face Papers, alphaXiv and Semantic Scholar, and to the models and data sets that go with it.
        </p>
        <p className="meta">New to papers? Read <Link to="/hub?tab=papers">how to read a paper as a beginner</Link> in the Hub, then start with the Level 1 list below.</p>
      </header>
      <div className="topo-controls">
        <input className="search" style={{ margin: 0 }} placeholder="Search title, author, tag" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={track} onChange={(e) => setTrack(e.target.value)}><option value="all">All tracks</option>{sortedTracks.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')}><option value="all">All levels</option>{levelOrder.map((l) => <option key={l} value={l}>{levelInfo[l].short} {levelInfo[l].label}</option>)}</select>
        <span className="meta">{filtered.length} of {papers.length}</span>
      </div>
      {levelOrder.map((lv) => {
        const group = filtered.filter((p) => paperLevel(p) === lv).sort((a, b) => a.day - b.day)
        if (!group.length) return null
        return (
          <section key={lv} className="level-group">
            <div className="level-head"><h2><span className={`lvl lvl-${lv}`}>{levelInfo[lv].short}</span>{levelInfo[lv].label}</h2><p>{group.length} papers</p></div>
            <ul className="paper-list">
              {group.map((p) => (
                <li key={p.slug}>
                  <span className="meta">Day {p.day} · {findTrack(p.track)?.title}</span>
                  <Link to={`/papers/${p.slug}`}><strong>{p.title}</strong></Link>
                  <p>{p.tldr}</p>
                  <span className="meta">{p.venue} {p.year}{p.prereqs?.length ? ` · read first: ${p.prereqs.map((s) => findPaper(s)?.title ?? s).join(', ')}` : ''}</span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}

export function PaperPage() {
  const { slug } = useParams()
  const paper = slug ? findPaper(slug) : undefined
  if (!paper) return <NotFound />
  const lv = paperLevel(paper)
  const links = paperLinks(paper.url)
  const relModels = models.filter((m) => m.paper && paper.url && (m.paper === paper.url || (m.paper.includes('arxiv') && paper.url.includes('arxiv') && m.paper.split('/abs/')[1]?.split('v')[0] === paper.url.split('/abs/')[1]?.split('v')[0])))
  const trackModels = models.filter((m) => m.tracks.includes(paper.track) && !relModels.includes(m)).slice(0, 4)
  const trackData = datasets.filter((d) => d.tracks.includes(paper.track)).slice(0, 4)
  const next = papers.filter((p) => p.prereqs?.includes(paper.slug))
  return (
    <article className="lesson-layout">
      <div className="lesson">
        <nav className="crumbs">
          <Link to="/papers">Papers</Link> / Day {paper.day}
        </nav>
        <header className="page-head">
          <span className="meta"><span className={`lvl lvl-${lv}`} style={{ marginRight: '0.4rem' }}>{levelInfo[lv].short} · {levelInfo[lv].label}</span>{findTrack(paper.track)?.title}</span>
          <h1>{paper.title}</h1>
          <p className="lede">{paper.tldr}</p>
          <span className="meta">
            {paper.authors} · {paper.venue} {paper.year} ·{' '}
            <a href={paper.url} target="_blank" rel="noreferrer">Read the paper</a>
          </span>
        </header>
        {paper.prereqs && paper.prereqs.length > 0 && (
          <div className="before">Read first: {paper.prereqs.map((s) => { const p = findPaper(s); return p ? <Link key={s} to={`/papers/${s}`}>{p.title}</Link> : null })}</div>
        )}
        <Markdown>{paper.notes}</Markdown>
        {next.length > 0 && (
          <nav className="pager" style={{ justifyContent: 'flex-start', gap: '0.5rem 1.5rem', flexWrap: 'wrap' }}>
            <span className="meta">Builds on this paper:</span>
            {next.map((p) => <Link key={p.slug} to={`/papers/${p.slug}`}>{p.title} →</Link>)}
          </nav>
        )}
      </div>
      <aside className="lesson-side">
        {links.length > 0 && (
          <div className="side-box">
            <h4>Read it elsewhere</h4>
            <ul className="links">{links.map((l) => <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer">{l.label}</a></li>)}</ul>
          </div>
        )}
        {(relModels.length > 0 || trackModels.length > 0) && (
          <div className="side-box">
            <h4>{relModels.length ? 'Models from this paper' : 'Related models'}</h4>
            <ul className="links">{(relModels.length ? relModels : trackModels).map((m) => <li key={m.name}><a href={m.url} target="_blank" rel="noreferrer">{m.name}</a> <span className="meta">{m.task}</span></li>)}</ul>
            <p className="meta" style={{ margin: '0.5rem 0 0' }}><Link to={`/hub?tab=models&track=${paper.track}`}>All models for this track</Link></p>
          </div>
        )}
        {trackData.length > 0 && (
          <div className="side-box">
            <h4>Data sets to try it on</h4>
            <ul className="links">{trackData.map((d) => <li key={d.url}><a href={d.url} target="_blank" rel="noreferrer">{d.name}</a> <span className="meta">{d.portal}</span></li>)}</ul>
          </div>
        )}
        {paper.tags && paper.tags.length > 0 && (
          <div className="side-box">
            <h4>Tags</h4>
            <ul className="terms">{paper.tags.map((t) => <li key={t}><span className="pill" style={{ marginLeft: 0 }}>{t}</span></li>)}</ul>
          </div>
        )}
      </aside>
    </article>
  )
}
