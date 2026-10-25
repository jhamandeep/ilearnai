import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findLesson, tracks } from '../data/tracks'
import { glossary } from '../data/glossary'
import { levelInfo } from '../data/types'
import { Markdown } from '../components/Markdown'
import { LessonContext, makeLessonCtx } from '../components/LessonContext'
import { isDone, setDone, useProgressVersion } from '../lib/progress'
import { quizzesIn } from '../lib/quiz'
import { practicals, datasets, models } from '../data/portals'
import { NotFound } from './NotFound'
import type { LessonLink } from '../data/types'

const kindLabel: Record<LessonLink['kind'], string> = { video: 'Video', paper: 'Paper', docs: 'Docs', article: 'Article', repo: 'Code', course: 'Course' }

function termLink(term: string) {
  const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const g = glossary.find((x) => x.slug === slug || x.term.toLowerCase() === term.toLowerCase())
  return g ? <Link to={`/glossary/${g.slug}`}>{g.term}</Link> : <span>{term}</span>
}

export function LessonPage() {
  const { track: t, module: m, lesson: l } = useParams()
  const found = t && m && l ? findLesson(t, m, l) : undefined
  useProgressVersion()
  const route = `/courses/${t}/${m}/${l}`
  const ctx = useMemo(() => makeLessonCtx(route), [route])
  if (!found) return <NotFound />
  const { track, module, lesson } = found
  const level = lesson.level ?? module.level
  const done = isDone(route)

  const flat = module.lessons
  const idx = flat.findIndex((x) => x.slug === lesson.slug)
  const prev = flat[idx - 1]
  const next = flat[idx + 1]
  const modIdx = track.modules.findIndex((x) => x.slug === module.slug)
  const nextModule = !next ? track.modules[modIdx + 1] : undefined
  const nextTrack = !next && !nextModule ? [...tracks].sort((a, b) => a.order - b.order).find((x) => x.order > track.order) : undefined
  const quizCount = quizzesIn(lesson.body).length
  const videoCount = (lesson.body.match(/^:::video/gm) ?? []).length
  const exerciseCount = (lesson.body.match(/^:::exercise/gm) ?? []).length

  return (
    <article className="lesson-layout">
      <div className="lesson">
        <nav className="crumbs">
          <Link to="/courses">Courses</Link> / <Link to={`/courses/${track.slug}`}>{track.title}</Link> / {module.title}
        </nav>
        <header className="page-head">
          <h1>{lesson.title}</h1>
          <p className="lede">{lesson.summary}</p>
          <span className="meta">
            <span className={`lvl lvl-${level}`} style={{ marginRight: '0.5rem' }}>{levelInfo[level].short} · {levelInfo[level].label}</span>
            {lesson.minutes} min · Lesson {idx + 1} of {flat.length} in {module.title}
            {quizCount ? ` · ${quizCount} quiz questions` : ''}{videoCount ? ` · ${videoCount} video${videoCount > 1 ? 's' : ''}` : ''}{exerciseCount ? ` · ${exerciseCount} exercise${exerciseCount > 1 ? 's' : ''}` : ''}
          </span>
        </header>
        {lesson.before && lesson.before.length > 0 && (
          <div className="before">
            Read first: {lesson.before.map((b) => <Link key={b.to} to={b.to}>{b.label}</Link>)}
          </div>
        )}
        {lesson.objectives.length > 0 && (
          <section className="objectives">
            <h2>After this lesson you can</h2>
            <ul>{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
          </section>
        )}
        <LessonContext.Provider value={ctx}>
          <Markdown>{lesson.body}</Markdown>
        </LessonContext.Provider>
        <div className="rich-bar" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: '2rem', padding: '0.8rem 1rem' }}>
          <button className={`btn done-btn ${done ? 'on' : ''}`} onClick={() => setDone(route, !done)}>{done ? '✓ Completed' : 'Mark as complete'}</button>
          <span className="rich-caption">Progress is saved in this browser only.</span>
        </div>
        <nav className="pager">
          {prev ? <Link to={`/courses/${track.slug}/${module.slug}/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next ? (
            <Link to={`/courses/${track.slug}/${module.slug}/${next.slug}`}>{next.title} →</Link>
          ) : nextModule ? (
            <Link to={`/courses/${track.slug}/${nextModule.slug}/${nextModule.lessons[0].slug}`}>Next module: {nextModule.title} →</Link>
          ) : nextTrack ? (
            <Link to={`/courses/${nextTrack.slug}`}>Next on your path: {nextTrack.title} →</Link>
          ) : (
            <Link to="/path">Back to the learning path →</Link>
          )}
        </nav>
      </div>
      <aside className="lesson-side">
        {lesson.keyTerms.length > 0 && (
          <div className="side-box">
            <h4>Key terms</h4>
            <ul className="terms">{lesson.keyTerms.map((k) => <li key={k}>{termLink(k)}</li>)}</ul>
          </div>
        )}
        {lesson.links.length > 0 && (
          <div className="side-box">
            <h4>Free resources</h4>
            <ul className="links">
              {lesson.links.map((lk) => (
                <li key={lk.url}><span className="pill" style={{ marginLeft: 0 }}>{kindLabel[lk.kind]}</span> <a href={lk.url} target="_blank" rel="noreferrer">{lk.label}</a></li>
              ))}
            </ul>
          </div>
        )}
        <div className="side-box">
          <h4>In this module</h4>
          <ol className="side-list">
            {flat.map((x, i) => {
              const r = `/courses/${track.slug}/${module.slug}/${x.slug}`
              return <li key={x.slug} className={x.slug === lesson.slug ? 'current' : ''}><Link to={r}>{isDone(r) ? '✓ ' : ''}{i + 1}. {x.title}</Link></li>
            })}
          </ol>
        </div>
        {(() => {
          const ps = practicals.filter((p) => p.tracks.includes(track.slug)).slice(0, 3)
          const ds = datasets.filter((d) => d.tracks.includes(track.slug)).slice(0, 3)
          const ms = models.filter((m) => m.tracks.includes(track.slug)).slice(0, 3)
          if (!ps.length && !ds.length && !ms.length) return null
          return (
            <div className="side-box">
              <h4>Run it for free</h4>
              {ps.length > 0 && <ul className="links">{ps.map((p) => <li key={p.url}><span className="pill" style={{ marginLeft: 0 }}>{p.portal}</span> <a href={p.url} target="_blank" rel="noreferrer">{p.title}</a></li>)}</ul>}
              {ds.length > 0 && <><h4 style={{ marginTop: '0.8rem' }}>Data sets</h4><ul className="links">{ds.map((d) => <li key={d.url}><span className="pill" style={{ marginLeft: 0 }}>{d.portal}</span> <a href={d.url} target="_blank" rel="noreferrer">{d.name}</a></li>)}</ul></>}
              {ms.length > 0 && <><h4 style={{ marginTop: '0.8rem' }}>Models</h4><ul className="links">{ms.map((m) => <li key={m.url}><a href={m.url} target="_blank" rel="noreferrer">{m.name}</a> <span className="meta">{m.task}</span></li>)}</ul></>}
              <p className="meta" style={{ margin: '0.6rem 0 0' }}><Link to={`/hub?tab=practicals&track=${track.slug}`}>Everything for this track in the Hub</Link></p>
            </div>
          )
        })()}
        <div className="side-box">
          <h4>Practice</h4>
          <p style={{ margin: 0 }}><Link to={`/practice#${track.slug}`}>Practice papers for {track.title}</Link></p>
        </div>
      </aside>
    </article>
  )
}
