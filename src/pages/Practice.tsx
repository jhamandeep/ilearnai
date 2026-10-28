import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { tracks, findTrack } from '../data/tracks'
import { levelInfo, levelOrder, type Level } from '../data/types'
import { paper, placementPaper, poolForTrack, recommendLevel, PAPERS_PER_TRACK, PAPER_MINUTES, type PoolQuestion } from '../lib/exams'
import { examResult, setExamResult, setPlacement, useProgressVersion } from '../lib/progress'
import { NotFound } from './NotFound'

export function Practice() {
  useProgressVersion()
  const sorted = [...tracks].sort((a, b) => a.order - b.order)
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Turn understanding into confidence</p>
        <h1>Practice papers</h1>
        <p className="lede">
          Timed papers built from the quiz questions in every lesson. Each paper has {PAPER_MINUTES} minutes and up to 20 questions. Every question links back to the lesson that teaches it. Results save to your account.
        </p>
      </header>
      <section>
        <div className="card" style={{ ['--card-accent' as string]: 'var(--primary)' }}>
          <div className="card-accent" />
          <h3>Placement test</h3>
          <p>Twenty questions, five from each level. Untimed. At the end you get the level to start at.</p>
          <div className="hero-actions"><Link className="btn btn-primary" to="/practice/placement">Start the placement test</Link></div>
        </div>
      </section>
      {levelOrder.map((lv) => {
        const group = sorted.filter((t) => t.level === lv)
        if (!group.length) return null
        return (
          <section key={lv} className="level-group">
            <div className="level-head"><h2><span className={`lvl lvl-${lv}`}>{levelInfo[lv].short}</span>{levelInfo[lv].label}</h2></div>
            {group.map((t) => {
              const pool = poolForTrack(t)
              return (
                <div key={t.slug} id={t.slug} className="module">
                  <h3><Link to={`/courses/${t.slug}`}>{t.title}</Link> <span className="meta">{pool.length} questions in the pool</span></h3>
                  <div className="paper-grid">
                    {Array.from({ length: PAPERS_PER_TRACK }, (_, i) => i + 1).map((n) => {
                      const id = `${t.slug}#${n}`
                      const r = examResult(id)
                      const size = paper(t, n).length
                      return (
                        <Link key={n} to={`/practice/${t.slug}/${n}`} className="card" style={{ ['--card-accent' as string]: t.accent }}>
                          <div className="card-accent" />
                          <h3>Paper {n}</h3>
                          <p>{size} questions · {PAPER_MINUTES} min</p>
                          <span className="meta">{r ? `Best: ${r.score}/${r.total} · ${new Date(r.at).toLocaleDateString()}` : 'Not taken yet'}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </>
  )
}

function Runner({ title, questions, minutes, id, onFinish, back }: { title: string; questions: PoolQuestion[]; minutes: number | null; id: string; onFinish?: (picked: number[]) => void; back: string }) {
  const [picked, setPicked] = useState<number[]>(() => questions.map(() => -1))
  const [submitted, setSubmitted] = useState(false)
  const [left, setLeft] = useState(minutes ? minutes * 60 : 0)
  useEffect(() => {
    if (!minutes || submitted) return
    const t = setInterval(() => setLeft((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [minutes, submitted])
  useEffect(() => {
    if (minutes && left === 0 && !submitted) submit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  const score = picked.filter((p, i) => p === questions[i].answer).length
  const answered = picked.filter((p) => p >= 0).length

  function submit() {
    setSubmitted(true)
    setExamResult(id, { score, total: questions.length, at: new Date().toISOString() })
    onFinish?.(picked)
  }

  const mm = Math.floor(left / 60).toString().padStart(2, '0')
  const ss = (left % 60).toString().padStart(2, '0')

  if (questions.length === 0) {
    return <p className="meta">No questions yet for this paper. Lessons in this track are still being written.</p>
  }

  return (
    <>
      <div className="exam-head">
        <strong>{title}</strong>
        <span className="meta">{answered}/{questions.length} answered</span>
        {minutes && !submitted && <span className={`timer ${left < 120 ? 'low' : ''}`}>{mm}:{ss}</span>}
        {!submitted ? (
          <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={submit}>Submit</button>
        ) : (
          <span style={{ marginLeft: 'auto' }}><strong>{score}/{questions.length}</strong> correct</span>
        )}
        <div className="exam-progress" role="progressbar" aria-label="Questions answered" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={questions.length}><span style={{ width: `${100 * answered / questions.length}%` }} /></div>
      </div>
      {submitted && (
        <section className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="result-big">{Math.round((100 * score) / questions.length)}%</div>
          <p>{score === questions.length ? 'Perfect. Move on to the next track.' : score / questions.length >= 0.8 ? 'Good. Review the questions you missed, then move on.' : score / questions.length >= 0.5 ? 'Halfway there. Reread the lessons linked under the questions you missed.' : 'Not yet. Work through the track lessons in order, then try the paper again.'}</p>
          <div className="hero-actions"><Link className="btn btn-ghost" to={back}>Back to practice</Link></div>
        </section>
      )}
      {questions.map((q, qi) => {
        const p = picked[qi]
        return (
          <div key={qi} className={`exam-q ${submitted ? (p === q.answer ? 'qz-right' : 'qz-wrong') : ''}`}>
            <h3>{qi + 1}. {q.text}</h3>
            <div className="qz-opts">
              {q.options.map((o, oi) => (
                <label key={oi} className={`qz-opt ${p === oi ? 'qz-pick' : ''} ${submitted && oi === q.answer ? 'qz-ans' : ''} ${submitted && p === oi && oi !== q.answer ? 'qz-miss' : ''}`}>
                  <input type="radio" name={`e-${id}-${qi}`} checked={p === oi} disabled={submitted} onChange={() => setPicked((a) => a.map((v, i) => (i === qi ? oi : v)))} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
            {submitted && (
              <>
                <p className="qz-why"><strong>{p === q.answer ? 'Correct.' : 'Not quite.'}</strong> {q.why}</p>
                <p className="exam-src">From <Link to={q.route}>{q.lessonTitle}</Link> · <span className={`lvl lvl-${q.level}`}>{levelInfo[q.level].short}</span></p>
              </>
            )}
          </div>
        )
      })}
      {!submitted && (
        <div className="hero-actions"><button className="btn btn-primary" onClick={submit}>Submit paper</button></div>
      )}
    </>
  )
}

export function PracticePaper() {
  const { track: slug, paper: n } = useParams()
  const track = slug ? findTrack(slug) : undefined
  const num = Number(n)
  const qs = useMemo(() => (track && num >= 1 && num <= PAPERS_PER_TRACK ? paper(track, num) : []), [track, num])
  if (!track || !(num >= 1 && num <= PAPERS_PER_TRACK)) return <NotFound />
  return (
    <>
      <nav className="crumbs"><Link to="/practice">Practice</Link> / {track.title} / Paper {num}</nav>
      <header className="page-head">
        <h1>{track.title}: Paper {num}</h1>
        <p className="lede">{qs.length} questions · {PAPER_MINUTES} minutes. The timer starts now. The paper submits itself when time runs out.</p>
      </header>
      <Runner key={`${track.slug}-${num}`} title={`Paper ${num}`} questions={qs} minutes={PAPER_MINUTES} id={`${track.slug}#${num}`} back="/practice" />
    </>
  )
}

export function Placement() {
  const qs = useMemo(() => placementPaper(), [])
  const [rec, setRec] = useState<Level | null>(null)
  function finish(picked: number[]) {
    const per = {} as Record<Level, { score: number; total: number }>
    for (const lv of levelOrder) per[lv] = { score: 0, total: 0 }
    qs.forEach((q, i) => { per[q.level].total++; if (picked[i] === q.answer) per[q.level].score++ })
    const r = recommendLevel(per)
    setRec(r)
    setPlacement(r)
  }
  return (
    <>
      <nav className="crumbs"><Link to="/practice">Practice</Link> / Placement test</nav>
      <header className="page-head">
        <h1>Placement test</h1>
        <p className="lede">Twenty questions, five from each level, from Level 0 to Level 3. There is no timer. Answer what you can, guess the rest, and submit.</p>
      </header>
      {rec && (
        <section className="card" style={{ marginBottom: '1.5rem', ['--card-accent' as string]: 'var(--primary)' }}>
          <div className="card-accent" />
          <h3>Start at <span className={`lvl lvl-${rec}`}>{levelInfo[rec].short}</span> {levelInfo[rec].label}</h3>
          <p>{levelInfo[rec].who}</p>
          <div className="hero-actions"><Link className="btn btn-primary" to={`/path#${rec}`}>Open your path</Link><Link className="btn btn-ghost" to={`/courses#${rec}`}>See the courses at this level</Link></div>
        </section>
      )}
      <Runner title="Placement" questions={qs} minutes={null} id="placement" onFinish={finish} back="/practice" />
    </>
  )
}
