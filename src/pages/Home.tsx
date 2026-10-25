import { Link } from 'react-router-dom'
import { tracks, lessonCount, lessonRoutes } from '../data/tracks'
import { papers } from '../data/papers'
import { labs } from '../data/labs'
import { posts } from '../data/blog'
import { videos } from '../data/videos'
import { glossary } from '../data/glossary'
import { levelInfo, levelOrder } from '../data/types'
import { HeroNetwork } from '../components/HeroNetwork'
import { CountUp } from '../components/CountUp'
import { TrackCard } from './Courses'
import { quizzesIn } from '../lib/quiz'
import { doneCount, isDone, placement, useProgressVersion } from '../lib/progress'

export function Home() {
  useProgressVersion()
  const latest = [...papers].sort((a, b) => b.day - a.day)[0]
  const sorted = [...tracks].sort((a, b) => a.order - b.order)
  const totalLessons = tracks.reduce((n, t) => n + lessonCount(t), 0)
  const totalQuiz = tracks.reduce((n, t) => n + t.modules.reduce((k, m) => k + m.lessons.reduce((j, l) => j + quizzesIn(l.body).length, 0), 0), 0)
  const rec = placement()
  // Where to continue: first unfinished lesson on the path.
  const next = sorted.flatMap((t) => t.modules.flatMap((m) => m.lessons.map((l) => ({ t, m, l, r: `/courses/${t.slug}/${m.slug}/${l.slug}` })))).find((x) => !isDone(x.r))
  const done = sorted.reduce((n, t) => n + doneCount(lessonRoutes(t)), 0)
  return (
    <>
      <section className="hero">
        <HeroNetwork />
        <p className="eyebrow">Free · No account · Written in Simplified Technical English</p>
        <h1>Learn AI from zero, until you can build the whole system.</h1>
        <p className="lede">
          Start with what a computer is. Finish with a model you trained, a retrieval system over your own documents, an agent with tools, and a
          service you deployed. Every lesson has animated diagrams, free video lectures, code you can copy, exercises and a quiz.
        </p>
        <div className="hero-actions">
          {next && done > 0 ? (
            <Link to={next.r} className="btn btn-primary">Continue: {next.l.title}</Link>
          ) : (
            <Link to="/courses/start-here" className="btn btn-primary">Start at Level 0</Link>
          )}
          <Link to="/practice/placement" className="btn btn-ghost">{rec ? 'Retake placement test' : 'Not a beginner? Take the placement test'}</Link>
          <Link to="/path" className="btn btn-ghost">See the full path</Link>
        </div>
        <div className="counters">
          <div><strong><CountUp to={totalLessons} /></strong><span className="meta">lessons</span></div>
          <div><strong><CountUp to={totalQuiz} /></strong><span className="meta">quiz questions</span></div>
          <div><strong><CountUp to={videos.length} /></strong><span className="meta">videos and courses</span></div>
          <div><strong><CountUp to={papers.length} /></strong><span className="meta">papers</span></div>
          <div><strong><CountUp to={labs.length} /></strong><span className="meta">labs</span></div>
          <div><strong><CountUp to={glossary.length} /></strong><span className="meta">glossary terms</span></div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Where are you starting from?</h2>
          <Link to="/path">The full path</Link>
        </div>
        <div className="ladder">
          {levelOrder.map((lv) => {
            const group = sorted.filter((t) => t.level === lv)
            return (
              <Link key={lv} to={`/courses#${lv}`}>
                <span className={`lvl lvl-${lv}`} style={{ justifySelf: 'start' }}>{levelInfo[lv].short}</span>
                <strong>{levelInfo[lv].label}</strong>
                <p>{levelInfo[lv].who}</p>
                <span className="meta">{group.map((t) => t.title).join(' · ')}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>The learning path, in order</h2>
          <Link to="/courses">All courses</Link>
        </div>
        <div className="grid">
          {sorted.map((t) => <TrackCard key={t.slug} t={t} />)}
        </div>
      </section>

      <section className="two-col">
        <div>
          <div className="section-head">
            <h2>Practice papers</h2>
            <Link to="/practice">All papers</Link>
          </div>
          <Link to="/practice" className="card">
            <h3>Timed papers for every track</h3>
            <p>Built from the quiz in every lesson. Each question links back to the lesson that teaches it. Plus a placement test that tells you which level to start at.</p>
          </Link>
        </div>
        <div>
          <div className="section-head">
            <h2>Start watching</h2>
            <Link to="/videos">All videos</Link>
          </div>
          <ul className="list">
            {videos.filter((x) => x.id && x.level === 'foundations').slice(0, 4).map((x) => (
              <li key={x.url}><a href={x.url} target="_blank" rel="noreferrer">{x.title}</a><span className="meta">{x.channel}{x.minutes ? ` · ${x.minutes} min` : ''}</span></li>
            ))}
          </ul>
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
            <span className="meta">{latest.authors.split(',')[0]} et al. · {latest.year}</span>
          </Link>
        </div>
        <div>
          <div className="section-head">
            <h2>Labs</h2>
            <Link to="/labs">All labs</Link>
          </div>
          <ul className="list">
            {labs.slice(0, 6).map((l) => (
              <li key={l.slug}>
                <Link to={`/labs/${l.slug}`}>{l.title}</Link>
                <span className="meta">{l.category}</span>
              </li>
            ))}
          </ul>
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
            <h2>Roadmaps</h2>
            <Link to="/roadmaps">All roadmaps</Link>
          </div>
          <Link to="/roadmaps" className="card">
            <h3>Week-by-week routes</h3>
            <p>Each track has a staged plan linking lessons, papers and labs in the order to take them.</p>
          </Link>
        </div>
      </section>
    </>
  )
}
