import { Link } from 'react-router-dom'
import { tracks, lessonRoutes } from '../data/tracks'
import { levelInfo, levelOrder, type Level } from '../data/types'
import { doneCount, isDone, placement, useProgressVersion } from '../lib/progress'

const levelColor: Record<string, string> = { foundations: 'var(--accent-engineering)', beginner: 'var(--primary)', intermediate: 'var(--accent-inference)', advanced: 'var(--accent-research)' }

const stages: Record<Level, string> = {
  foundations: 'You learn what a computer, a program, a number list and a probability are. You write and run Python. Nothing is assumed.',
  beginner: 'You learn what a model is and how it learns, then you build real things: a chatbot, a search over your own documents, an agent, and a deployed service.',
  intermediate: 'You open the box. Retrieval, agents and evaluation at production quality, the mathematics of training, and the design of systems that stay up.',
  advanced: 'You read and reproduce research: transformers from first principles, scaling laws, alignment, inference engineering and robotics.',
}

export function Path() {
  useProgressVersion()
  const sorted = [...tracks].sort((a, b) => a.order - b.order)
  const rec = placement()
  const total = sorted.reduce((n, t) => n + lessonRoutes(t).length, 0)
  const done = sorted.reduce((n, t) => n + doneCount(lessonRoutes(t)), 0)
  return (
    <>
      <div className="work-route-banner"><div><strong>Want to apply AI in your field?</strong><span>Explore benefits and practical implementation for your industry and role. No coding required.</span></div><Link to="/for-work">AI for your work →</Link></div>
      <header className="page-head">
        <p className="eyebrow">One path, four levels, ten tracks</p>
        <h1>From zero to building a complete AI system</h1>
        <p className="lede">
          Follow the steps in order. Each track tells you what to finish first and what you can build at the end. If you already know some of it,
          take the placement test and start where it tells you.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/practice/placement">{rec ? 'Retake the placement test' : 'Take the placement test'}</Link>
          <Link className="btn btn-ghost" to="/courses/start-here">Start at Level 0</Link>
        </div>
        {rec && (
          <p className="meta" style={{ marginTop: '0.8rem' }}>
            Your placement result: start at <strong>{levelInfo[rec.level as Level]?.label ?? rec.level}</strong>. <a href={`#${rec.level}`}>Jump there.</a>
          </p>
        )}
        <div className="progress-row" style={{ maxWidth: 520, marginTop: '1rem' }}>
          <div className="progress"><span style={{ width: `${total ? (100 * done) / total : 0}%` }} /></div>
          {done}/{total} lessons complete
        </div>
      </header>

      {levelOrder.map((lv) => {
        const group = sorted.filter((t) => t.level === lv)
        if (group.length === 0) return null
        return (
          <section key={lv} className="level-group" id={lv}>
            <div className="level-head" style={{ ['--lvl-color' as string]: levelColor[lv] }}>
              <h2><span className={`lvl lvl-${lv}`}>{levelInfo[lv].short}</span>{levelInfo[lv].label}</h2>
              <p><strong>Who.</strong> {levelInfo[lv].who}</p>
              <p><strong>What happens here.</strong> {stages[lv]}</p>
            </div>
            <ol className="path">
              {group.map((t) => {
                const routes = lessonRoutes(t)
                const d = doneCount(routes)
                const complete = d === routes.length && routes.length > 0
                return (
                  <li key={t.slug} className={`path-step ${complete ? 'path-done' : ''}`} style={{ ['--card-accent' as string]: t.accent }}>
                    <div className="path-dot">{complete ? '✓' : t.order}</div>
                    <div className="path-body">
                      <h3><Link to={`/courses/${t.slug}`}>{t.title}</Link>{t.status === 'preview' && <span className="pill">Preview</span>}</h3>
                      <p>{t.description}</p>
                      <p><strong>At the end you can:</strong> {t.outcome}</p>
                      {t.prerequisites.length > 0 && (
                        <p className="meta">Finish first: {t.prerequisites.map((p, i) => { const pt = tracks.find((x) => x.slug === p); return pt ? <span key={p}>{i > 0 ? ', ' : ''}<Link to={`/courses/${p}`}>{pt.title}</Link></span> : null })}</p>
                      )}
                      <div className="progress-row"><div className="progress"><span style={{ width: `${routes.length ? (100 * d) / routes.length : 0}%` }} /></div>{d}/{routes.length} lessons</div>
                      <div className="path-modules">
                        {t.modules.map((m) => {
                          const mr = m.lessons.map((l) => `/courses/${t.slug}/${m.slug}/${l.slug}`)
                          const md = mr.every(isDone)
                          return <Link key={m.slug} to={`/courses/${t.slug}#${m.slug}`} className={md ? 'done' : ''}>{md ? '✓ ' : ''}{m.title}</Link>
                        })}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}
    </>
  )
}
