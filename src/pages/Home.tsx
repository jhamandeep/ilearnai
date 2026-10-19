import { Link } from 'react-router-dom'
import { tracks, lessonCount } from '../data/tracks'
import { papers } from '../data/papers'
import { labs } from '../data/labs'

export function Home() {
  const latest = papers[papers.length - 1]
  return (
    <>
      <section className="hero">
        <p className="eyebrow">The everything learning app for engineers</p>
        <h1>Learn how frontier AI systems actually work.</h1>
        <p className="lede">
          Guided tracks through the research, the engineering, and the mathematics. Daily papers with reading notes. Labs that
          run entirely in your browser.
        </p>
        <div className="hero-actions">
          <Link to="/courses" className="btn btn-primary">
            Browse courses
          </Link>
          <Link to="/labs" className="btn btn-ghost">
            Try a lab
          </Link>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Tracks</h2>
          <Link to="/courses">All courses</Link>
        </div>
        <div className="grid">
          {tracks.map((t) => (
            <Link key={t.slug} to={`/courses/${t.slug}`} className="card" style={{ ['--card-accent' as string]: t.accent }}>
              <div className="card-accent" />
              <h3>
                {t.title}
                {t.status === 'preview' && <span className="pill">Preview</span>}
              </h3>
              <p>{t.tagline}</p>
              <span className="meta">
                {t.modules.length} modules · {lessonCount(t)} lessons
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="two-col">
        <div>
          <div className="section-head">
            <h2>Paper of the day</h2>
            <Link to="/papers">All papers</Link>
          </div>
          <Link to={`/papers/${latest.slug}`} className="card">
            <span className="meta">Day {latest.day}</span>
            <h3>{latest.title}</h3>
            <p>{latest.tldr}</p>
            <span className="meta">
              {latest.authors.split(',')[0]} et al. · {latest.year}
            </span>
          </Link>
        </div>
        <div>
          <div className="section-head">
            <h2>Labs</h2>
            <Link to="/labs">All labs</Link>
          </div>
          <ul className="list">
            {labs.map((l) => (
              <li key={l.slug}>
                <Link to={`/labs/${l.slug}`}>{l.title}</Link>
                <span className="meta">{l.category}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
