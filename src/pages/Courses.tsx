import { Link, useParams } from 'react-router-dom'
import { tracks, findTrack, lessonCount, lessonRoutes } from '../data/tracks'
import { levelInfo, levelOrder } from '../data/types'
import { doneCount, isDone, useProgressVersion } from '../lib/progress'
import { NotFound } from './NotFound'
import type { Track } from '../data/types'

const levelColor: Record<string, string> = { foundations: 'var(--accent-engineering)', beginner: 'var(--primary)', intermediate: 'var(--accent-inference)', advanced: 'var(--accent-research)' }

export function TrackCard({ t }: { t: Track }) {
  const routes = lessonRoutes(t)
  const done = doneCount(routes)
  return (
    <Link to={`/courses/${t.slug}`} className="card" style={{ ['--card-accent' as string]: t.accent }}>
      <div className="card-accent" />
      <span className="meta"><span className={`lvl lvl-${t.level}`} style={{ marginRight: '0.4rem' }}>{levelInfo[t.level].short}</span>Step {t.order} on the path</span>
      <h3>
        {t.title}
        {t.status === 'preview' && <span className="pill">Preview</span>}
      </h3>
      <p>{t.tagline}</p>
      <span className="meta">{t.modules.length} modules · {lessonCount(t)} lessons</span>
      {done > 0 && (
        <div className="progress-row"><div className="progress"><span style={{ width: `${(100 * done) / routes.length}%` }} /></div>{done}/{routes.length}</div>
      )}
    </Link>
  )
}

export function Courses() {
  useProgressVersion()
  const sorted = [...tracks].sort((a, b) => a.order - b.order)
  return (
    <>
      <header className="page-head">
        <h1>Courses</h1>
        <p className="lede">Ten tracks in four levels, from your first line of code to frontier research. Every lesson is free, has animated diagrams, videos, a quiz, and is written in Simplified Technical English.</p>
        <p className="meta">Not sure where to start? <Link to="/practice/placement">Take the 20-question placement test</Link> or <Link to="/path">follow the learning path</Link>.</p>
      </header>
      {levelOrder.map((lv) => {
        const group = sorted.filter((t) => t.level === lv)
        if (group.length === 0) return null
        return (
          <section key={lv} className="level-group" id={lv}>
            <div className="level-head" style={{ ['--lvl-color' as string]: levelColor[lv] }}>
              <h2><span className={`lvl lvl-${lv}`}>{levelInfo[lv].short}</span>{levelInfo[lv].label}</h2>
              <p>{levelInfo[lv].who}</p>
            </div>
            <div className="grid">{group.map((t) => <TrackCard key={t.slug} t={t} />)}</div>
          </section>
        )
      })}
    </>
  )
}

export function TrackPage() {
  const { track: slug } = useParams()
  const track = slug ? findTrack(slug) : undefined
  useProgressVersion()
  if (!track) return <NotFound />
  const routes = lessonRoutes(track)
  const done = doneCount(routes)
  const prereqs = track.prerequisites.map((p) => findTrack(p)).filter(Boolean) as Track[]
  const firstUndone = track.modules.flatMap((m) => m.lessons.map((l) => ({ m, l }))).find(({ m, l }) => !isDone(`/courses/${track.slug}/${m.slug}/${l.slug}`))
  return (
    <>
      <nav className="crumbs">
        <Link to="/courses">Courses</Link> / {track.title}
      </nav>
      <header className="page-head" style={{ ['--card-accent' as string]: track.accent }}>
        <span className="meta"><span className={`lvl lvl-${track.level}`} style={{ marginRight: '0.4rem' }}>{levelInfo[track.level].short} · {levelInfo[track.level].label}</span>Step {track.order} on the learning path</span>
        <h1>{track.title}</h1>
        <p className="lede">{track.description}</p>
        <p><strong>Who it is for.</strong> {track.audience}</p>
        <p><strong>What you can do at the end.</strong> {track.outcome}</p>
        {prereqs.length > 0 && (
          <p className="meta">Finish first: {prereqs.map((p, i) => <span key={p.slug}>{i > 0 ? ', ' : ''}<Link to={`/courses/${p.slug}`}>{p.title}</Link></span>)}</p>
        )}
        <div className="progress-row" style={{ maxWidth: 480 }}>
          <div className="progress"><span style={{ width: `${(100 * done) / routes.length}%` }} /></div>
          {done}/{routes.length} lessons
        </div>
        <div className="hero-actions">
          {firstUndone ? (
            <Link className="btn btn-primary" to={`/courses/${track.slug}/${firstUndone.m.slug}/${firstUndone.l.slug}`}>{done ? 'Continue' : 'Start'}: {firstUndone.l.title}</Link>
          ) : (
            <Link className="btn btn-primary" to="/path">Track complete. Back to the path</Link>
          )}
          <Link className="btn btn-ghost" to={`/practice#${track.slug}`}>Practice papers</Link>
        </div>
      </header>
      {track.modules.map((m, i) => (
        <section key={m.slug} className="module" id={m.slug}>
          <h2>
            <span className="meta">Module {i + 1}</span> {m.title} <span className={`lvl lvl-${m.level}`}>{levelInfo[m.level].short}</span>
          </h2>
          <p>{m.description}</p>
          <ol className="lesson-list">
            {m.lessons.map((l) => {
              const r = `/courses/${track.slug}/${m.slug}/${l.slug}`
              return (
                <li key={l.slug}>
                  <Link to={r}>{isDone(r) ? '✓ ' : ''}{l.title}</Link>
                  <span className="meta">{l.minutes} min</span>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </>
  )
}
