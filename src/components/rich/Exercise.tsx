import { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { parseExercise } from '../../lib/exercise'
import { lessonPythonExercises, lessonPythonUrl } from '../../lib/lessonPython'
import { findLesson } from '../../data/tracks'
import { LessonContext } from '../LessonContext'

// :::exercise
// title: Write your first function
// task: Write a function add that returns the sum of two numbers.
// hint: Use the def keyword and return.
// lang: python
// solution:
// def add(a, b):
//     return a + b
// :::
// task: and hint: may run over several lines. Everything after solution: is code.
export function Exercise({ src }: { src: string }) {
  const { title, task, hint, lang, solution } = useMemo(() => parseExercise(src), [src])
  const context = useContext(LessonContext)
  const parts = context?.route.split('/') ?? []
  const found = context ? findLesson(parts[2], parts[3], parts[4]) : undefined
  const runnable = found && context ? lessonPythonExercises(found.lesson, context.route).find(exercise => exercise.solution.trim() === solution.trim()) : undefined
  const [showHint, setShowHint] = useState(false)
  const [showSol, setShowSol] = useState(false)
  if (!task) return null
  return (
    <figure className="rich rich-exercise">
      <figcaption>Exercise{title ? ` · ${title}` : ''}</figcaption>
      <div className="ex-body">
        <p className="ex-task">{task}</p>
        {showHint && hint && <p className="ex-hint"><strong>Hint.</strong> {hint}</p>}
        {showSol && solution && (
          <div>
            <div className="code-head"><span className="code-lang">{lang === 'text' ? 'Solution' : lang}</span></div>
            <pre className="code-pre"><code>{solution}</code></pre>
          </div>
        )}
      </div>
      {runnable && <div className="exercise-run-link"><Link className="btn btn-primary btn-sm" to={lessonPythonUrl(runnable)}>Write and run this in Python →</Link><p>Use the lesson task in an editable workspace. Your draft stays in this browser.</p></div>}
      <div className="rich-bar">
        {hint && !showHint && <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)}>Show hint</button>}
        {solution && <button className="btn btn-ghost btn-sm" onClick={() => setShowSol((s) => !s)}>{showSol ? 'Hide solution' : 'Show solution'}</button>}
        <span className="rich-caption">Try it yourself first. Then compare.</span>
      </div>
    </figure>
  )
}
