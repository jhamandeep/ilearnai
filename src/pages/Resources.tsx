import { useMemo, useState } from 'react'
import { resources, tools } from '../data/resources'
import { tracks } from '../data/tracks'
import type { Level, ResourceKind } from '../data/types'

const kinds: ResourceKind[] = ['course', 'book', 'lecture', 'repo', 'blog', 'paper-list', 'tool']
const levels: Level[] = ['beginner', 'intermediate', 'advanced']

export function Resources() {
  const [track, setTrack] = useState('all')
  const [kind, setKind] = useState<ResourceKind | 'all'>('all')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [q, setQ] = useState('')
  const all = useMemo(() => [...resources, ...tools], [])
  const filtered = all.filter((r) => (track === 'all' || r.track === track) && (kind === 'all' || r.kind === kind) && (level === 'all' || r.level === level) && (r.title + r.topic + r.why).toLowerCase().includes(q.toLowerCase()))
  const byTopic = useMemo(() => { const m = new Map<string, typeof filtered>(); filtered.forEach((r) => m.set(r.topic, [...(m.get(r.topic) ?? []), r])); return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])) }, [filtered])
  return (
    <>
      <header className="page-head">
        <h1>Resources</h1>
        <p className="lede">Courses, books, lectures, repositories, blogs and tools worth your time, grouped by topic and level.</p>
      </header>
      <div className="topo-controls">
        <input className="search" style={{ margin: 0 }} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={track} onChange={(e) => setTrack(e.target.value)}><option value="all">All tracks</option>{tracks.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}</select>
        <select value={kind} onChange={(e) => setKind(e.target.value as ResourceKind | 'all')}><option value="all">All kinds</option>{kinds.map((k) => <option key={k} value={k}>{k}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')}><option value="all">All levels</option>{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select>
        <span className="meta">{filtered.length} of {all.length}</span>
      </div>
      {byTopic.map(([topic, items]) => (
        <section key={topic} className="module">
          <h2>{topic}</h2>
          <ul className="res-list">
            {items.map((r) => (
              <li key={r.url} className="res">
                <a href={r.url} target="_blank" rel="noreferrer"><strong>{r.title}</strong></a>
                <span className="meta"><span className="pill" style={{ marginLeft: 0 }}>{r.kind}</span> <span className="pill">{r.level}</span> {tracks.find((t) => t.slug === r.track)?.title}</span>
                <p>{r.why}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {filtered.length === 0 && <p className="meta">Nothing matches.</p>}
    </>
  )
}
