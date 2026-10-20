import { Link } from 'react-router-dom'
import { tracks, lessonCount } from '../data/tracks'
import { papers } from '../data/papers'
import { labs } from '../data/labs'
import { posts } from '../data/blog'
import { videos } from '../data/videos'
import { glossary } from '../data/glossary'
import { HeroNetwork } from '../components/HeroNetwork'
import { CountUp } from '../components/CountUp'

export function Home() {
  const latest = [...papers].sort((a, b) => b.day - a.day)[0]
  const totalLessons = tracks.reduce((n, t) => n + lessonCount(t), 0)
  return (
    <>
      <section className="hero">
        <HeroNetwork />
        <p className="eyebrow">Free, complete, written in Simplified Technical English</p>
        <h1>Learn how frontier AI systems actually work.</h1>
        <p className="lede">
          Full lessons with worked examples. Free video lectures, papers and links for every topic. Labs that run in your browser.
          No account, no paywall.
        </p>
        <div className="hero-actions">
          <Link to="/courses" className="btn btn-primary">
            Browse courses
          </Link>
          <Link to="/labs" className="btn btn-ghost">
            Try a lab
          </Link>
          <Link to="/knowledge-graph" className="btn btn-ghost">
            Explore the map
          </Link>
        </div>
        <div className="counters">
          <div><strong><CountUp to={totalLessons} /></strong><span className="meta">lessons</span></div>
          <div><strong><CountUp to={papers.length} /></strong><span className="meta">papers</span></div>
          <div><strong><CountUp to={labs.length} /></strong><span className="meta">labs</span></div>
          <div><strong><CountUp to={glossary.length} /></strong><span className="meta">terms</span></div>
          <div><strong><CountUp to={posts.length} /></strong><span className="meta">notes</span></div>
          <div><strong><CountUp to={videos.length} /></strong><span className="meta">videos</span></div>
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

      <section>
        <div className="section-head">
          <h2>Start watching</h2>
          <Link to="/videos">All videos</Link>
        </div>
        <div className="grid">
          {videos.filter((x) => x.id).slice(0, 3).map((x) => (
            <a key={x.url} href={x.url} target="_blank" rel="noreferrer" className="card">
              <span className="meta">{x.channel}{x.minutes ? ` · ${x.minutes} min` : ''}</span>
              <h3>{x.title}</h3>
              <p>{x.why}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="two-col">
        <div>
          <div className="section-head">
            <h2>Latest note</h2>
            <Link to="/blog">All notes</Link>
          </div>
          <Link to={`/blog/${posts[0].slug}`} className="card">
            <span className="meta">{posts[0].date}</span>
            <h3>{posts[0].title}</h3>
            <p>{posts[0].summary}</p>
          </Link>
        </div>
        <div>
          <div className="section-head">
            <h2>Start with a roadmap</h2>
            <Link to="/roadmaps">All roadmaps</Link>
          </div>
          <Link to="/roadmaps" className="card">
            <h3>Week-by-week routes</h3>
            <p>Each track has a staged plan linking lessons, papers and labs in the order to take them.</p>
          </Link>
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
