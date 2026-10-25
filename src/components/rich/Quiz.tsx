import { useContext, useMemo, useRef, useState } from 'react'
import { parseQuiz } from '../../lib/quiz'
import { setQuizScore, quizScore, useProgressVersion } from '../../lib/progress'
import { LessonContext } from '../LessonContext'

export function Quiz({ src }: { src: string }) {
  const { title, questions } = useMemo(() => parseQuiz(src), [src])
  const ctx = useContext(LessonContext)
  // Take a block number once, on mount, so re-renders do not shift it.
  const idx = useRef<number | null>(null)
  if (idx.current === null) idx.current = ctx ? ctx.nextQuizIndex() : 0
  const n = idx.current
  const route = ctx?.route ?? ''
  useProgressVersion()
  const best = route ? quizScore(route, n) : null

  const [picked, setPicked] = useState<number[]>(() => questions.map(() => -1))
  const [checked, setChecked] = useState(false)

  if (questions.length === 0) return null
  const score = picked.filter((p, i) => p === questions[i].answer).length
  const allAnswered = picked.every((p) => p >= 0)

  function check() {
    setChecked(true)
    if (route) setQuizScore(route, n, score, questions.length)
  }
  function reset() {
    setPicked(questions.map(() => -1))
    setChecked(false)
  }

  return (
    <figure className="rich rich-quiz">
      <figcaption>{title ?? 'Quiz'} · {questions.length} questions{best ? ` · best ${best.score}/${best.total}` : ''}</figcaption>
      <ol className="qz-list">
        {questions.map((q, qi) => {
          const p = picked[qi]
          const right = checked && p === q.answer
          const wrong = checked && p >= 0 && p !== q.answer
          return (
            <li key={qi} className={right ? 'qz-right' : wrong ? 'qz-wrong' : ''}>
              <p className="qz-q">{q.text}</p>
              <div className="qz-opts" role="radiogroup" aria-label={`Question ${qi + 1}`}>
                {q.options.map((o, oi) => {
                  const isPick = p === oi
                  const isAns = checked && oi === q.answer
                  return (
                    <label key={oi} className={`qz-opt ${isPick ? 'qz-pick' : ''} ${isAns ? 'qz-ans' : ''} ${checked && isPick && !isAns ? 'qz-miss' : ''}`}>
                      <input type="radio" name={`q-${route}-${n}-${qi}`} checked={isPick} disabled={checked} onChange={() => setPicked((arr) => arr.map((v, i) => (i === qi ? oi : v)))} />
                      <span>{o}</span>
                    </label>
                  )
                })}
              </div>
              {checked && (
                <p className="qz-why">
                  <strong>{right ? 'Correct.' : 'Not quite.'}</strong> {q.why}
                </p>
              )}
            </li>
          )
        })}
      </ol>
      <div className="rich-bar">
        {!checked ? (
          <button className="btn btn-primary btn-sm" onClick={check} disabled={!allAnswered}>Check answers</button>
        ) : (
          <>
            <strong className={score === questions.length ? 'qz-score qz-full' : 'qz-score'}>{score} / {questions.length}</strong>
            <button className="btn btn-ghost btn-sm" onClick={reset}>Try again</button>
          </>
        )}
        {!checked && !allAnswered && <span className="rich-caption">Answer every question, then check.</span>}
      </div>
    </figure>
  )
}
