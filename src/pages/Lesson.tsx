import { Link, useParams } from 'react-router-dom'
import { findLesson } from '../data/tracks'
import { Markdown } from '../components/Markdown'
import { ProGate } from '../components/ProGate'
import { NotFound } from './NotFound'

export function LessonPage() {
  const { track: t, module: m, lesson: l } = useParams()
  const found = t && m && l ? findLesson(t, m, l) : undefined
  if (!found) return <NotFound />
  const { track, module, lesson } = found

  const flat = module.lessons
  const idx = flat.findIndex((x) => x.slug === lesson.slug)
  const prev = flat[idx - 1]
  const next = flat[idx + 1]

  return (
    <article className="lesson">
      <nav className="crumbs">
        <Link to="/courses">Courses</Link> / <Link to={`/courses/${track.slug}`}>{track.title}</Link> / {module.title}
      </nav>
      <header className="page-head">
        <h1>{lesson.title}</h1>
        <p className="lede">{lesson.summary}</p>
        <span className="meta">
          {lesson.minutes} min read · {lesson.tier === 'pro' ? 'Pro' : 'Free'}
        </span>
      </header>
      <ProGate tier={lesson.tier}>
        <Markdown>{lesson.body}</Markdown>
      </ProGate>
      <nav className="pager">
        {prev ? <Link to={`/courses/${track.slug}/${module.slug}/${prev.slug}`}>← {prev.title}</Link> : <span />}
        {next ? <Link to={`/courses/${track.slug}/${module.slug}/${next.slug}`}>{next.title} →</Link> : <span />}
      </nav>
    </article>
  )
}
