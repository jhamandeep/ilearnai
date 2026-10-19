import { Link, useParams } from 'react-router-dom'
import { tracks, findTrack, lessonCount } from '../data/tracks'
import { NotFound } from './NotFound'

export function Courses() {
  return (
    <>
      <header className="page-head">
        <h1>Courses</h1>
        <p className="lede">Six tracks. Intro lessons in every module are free.</p>
      </header>
      <div className="grid">
        {tracks.map((t) => (
          <Link key={t.slug} to={`/courses/${t.slug}`} className="card" style={{ ['--card-accent' as string]: t.accent }}>
            <div className="card-accent" />
            <h3>
              {t.title}
              {t.status === 'preview' && <span className="pill">Preview</span>}
            </h3>
            <p>{t.description}</p>
            <span className="meta">
              {t.modules.length} modules · {lessonCount(t)} lessons
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}

export function TrackPage() {
  const { track: slug } = useParams()
  const track = slug ? findTrack(slug) : undefined
  if (!track) return <NotFound />
  return (
    <>
      <nav className="crumbs">
        <Link to="/courses">Courses</Link> / {track.title}
      </nav>
      <header className="page-head" style={{ ['--card-accent' as string]: track.accent }}>
        <h1>{track.title}</h1>
        <p className="lede">{track.description}</p>
      </header>
      {track.modules.map((m, i) => (
        <section key={m.slug} className="module">
          <h2>
            <span className="meta">Module {i + 1}</span> {m.title}
          </h2>
          <p>{m.description}</p>
          <ol className="lesson-list">
            {m.lessons.map((l) => (
              <li key={l.slug}>
                <Link to={`/courses/${track.slug}/${m.slug}/${l.slug}`}>{l.title}</Link>
                <span className="meta">
                  {l.minutes} min {l.tier === 'pro' ? <span className="pill pill-pro">Pro</span> : <span className="pill">Free</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  )
}
