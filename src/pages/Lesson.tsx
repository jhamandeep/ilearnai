import { Link, useParams } from 'react-router-dom'
import { findLesson } from '../data/tracks'
import { glossary } from '../data/glossary'
import { Markdown } from '../components/Markdown'
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
  if (!found) return <NotFound />
  const { track, module, lesson } = found

  const flat = module.lessons
  const idx = flat.findIndex((x) => x.slug === lesson.slug)
  const prev = flat[idx - 1]
  const next = flat[idx + 1]
  const modIdx = track.modules.findIndex((x) => x.slug === module.slug)
  const nextModule = !next ? track.modules[modIdx + 1] : undefined

  return (
    <article className="lesson-layout">
      <div className="lesson">
        <nav className="crumbs">
          <Link to="/courses">Courses</Link> / <Link to={`/courses/${track.slug}`}>{track.title}</Link> / {module.title}
        </nav>
        <header className="page-head">
          <h1>{lesson.title}</h1>
          <p className="lede">{lesson.summary}</p>
          <span className="meta">{lesson.minutes} min read · Lesson {idx + 1} of {flat.length} in {module.title}</span>
        </header>
        {lesson.objectives.length > 0 && (
          <section className="objectives">
            <h2>After this lesson you can</h2>
            <ul>{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
          </section>
        )}
        <Markdown>{lesson.body}</Markdown>
        <nav className="pager">
          {prev ? <Link to={`/courses/${track.slug}/${module.slug}/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next ? <Link to={`/courses/${track.slug}/${module.slug}/${next.slug}`}>{next.title} →</Link> : nextModule ? <Link to={`/courses/${track.slug}/${nextModule.slug}/${nextModule.lessons[0].slug}`}>Next module: {nextModule.title} →</Link> : <Link to={`/courses/${track.slug}`}>Back to {track.title} →</Link>}
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
            {flat.map((x, i) => <li key={x.slug} className={x.slug === lesson.slug ? 'current' : ''}><Link to={`/courses/${track.slug}/${module.slug}/${x.slug}`}>{i + 1}. {x.title}</Link></li>)}
          </ol>
        </div>
      </aside>
    </article>
  )
}
