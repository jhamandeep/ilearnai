import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { pythonExercises, type PythonExercise } from '../data/pythonExercises'
import { PythonEditor } from '../components/PythonEditor'
import { usePythonRunner } from '../lib/usePythonRunner'
import { findLesson } from '../data/tracks'
import { lessonPythonExercises } from '../lib/lessonPython'
import { Markdown } from '../components/Markdown'

const draftKey = (id: string) => `ilearnai:python:draft:${id}`
const passKey = (id: string) => `ilearnai:python:passed:${id}`
function read(key: string) { try { return localStorage.getItem(key) } catch { return null } }
function write(key: string, value: string) { try { localStorage.setItem(key, value); return true } catch { return false } }

export function CodePractice() {
  const [params, setParams] = useSearchParams()
  const lessonRoute = params.get('lesson')
  const parts = lessonRoute?.split('/') ?? []
  const found = lessonRoute ? findLesson(parts[2], parts[3], parts[4]) : undefined
  const linked = found && lessonRoute ? lessonPythonExercises(found.lesson, lessonRoute).find(item => item.activityId === params.get('activity')) : undefined
  const exercise = linked ?? pythonExercises.find(item => item.id === params.get('exercise')) ?? pythonExercises[0]
  const [version, setVersion] = useState(0)
  const complete = pythonExercises.filter(item => read(passKey(item.id)) === 'true').length
  if (lessonRoute && !linked) return <section className="page-head"><h1>Open the lesson’s practice task.</h1><p>This task needs its lesson setup or is not available in the browser runner.</p><Link to={found ? `/courses/${found.track.slug}/${found.module.slug}/${found.lesson.slug}` : '/courses'}>Return to learning →</Link></section>
  return <div className="coding-page" data-progress-version={version}>
    <header className="page-head">{linked && <Link className="coding-back" to={`${linked.lessonRoute}/${linked.activityId}`}>← Back to {linked.topic}</Link>}<p className="eyebrow">Read it. Change it. Run it.</p><h1>Your Python workspace.</h1><p className="lede">{linked ? "Practise the exact task from your lesson. Write Python, inspect its output, and compare your approach with the worked solution." : "Small, useful problems with instructions, real Python execution, and explained checks. Start with a worked example, then make the code your own."}</p><div className="coding-progress"><span>{complete}/{pythonExercises.length} guided exercises passed in this browser</span><progress value={complete} max={pythonExercises.length} aria-label="Python practice progress" /></div></header>
    <details className="coding-guided-picker" open={!linked}><summary>Guided exercises with automatic checks</summary><nav className="coding-exercise-picker" aria-label="Python exercises">{pythonExercises.map((item, index) => <button type="button" key={item.id} aria-current={item.id === exercise.id ? 'step' : undefined} onClick={() => setParams({ exercise: item.id })}><span>{read(passKey(item.id)) === 'true' ? '✓' : String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.topic}</small></button>)}</nav></details>
    <ExerciseWorkspace key={exercise.id} exercise={exercise} onPass={() => setVersion(value => value + 1)} />
    <section className="coding-next"><h2>Keep building</h2><p>These exercises use Python’s standard library. For larger projects and packages such as PyTorch or OpenCV, follow the project’s notebook setup.</p><div className="resource-shortcuts"><Link to="/resources?kind=repo">GitHub projects ↗</Link><Link to="/resources?kind=visualization">Explore visually ↗</Link><Link to="/labs/gradient-descent">Gradient Descent lab →</Link></div></section>
  </div>
}

function ExerciseWorkspace({ exercise, onPass }: { exercise: PythonExercise; onPass: () => void }) {
  const [initialCode, setInitialCode] = useState(() => read(draftKey(exercise.id)) ?? exercise.starter)
  const [code, setCode] = useState(initialCode)
  const [editorVersion, setEditorVersion] = useState(0)
  const [saved, setSaved] = useState('Draft stays in this browser when storage is available.')
  const [tab, setTab] = useState<'task' | 'help'>('task')
  const [solution, setSolution] = useState(false)
  const runner = usePythonRunner()
  function change(next: string) { setCode(next); runner.clear(); setSaved(write(draftKey(exercise.id), next) ? 'Draft saved in this browser.' : 'Storage is unavailable. Download your code to keep it.') }
  function replace(next: string) { runner.stop(); change(next); setInitialCode(next); setEditorVersion(value => value + 1) }
  function download() {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/x-python;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = `${exercise.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.py`; document.body.append(link); link.click(); link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="coding-workspace">
    <section className="coding-instructions" aria-label="Exercise instructions"><p className="eyebrow">{exercise.topic} · About {exercise.minutes} min</p><h2>{exercise.title}</h2><div className="workspace-pills" aria-label="Instruction view"><button type="button" aria-pressed={tab === 'task'} onClick={() => setTab('task')}>Your task</button><button type="button" aria-pressed={tab === 'help'} onClick={() => setTab('help')}>Hint &amp; explanation</button></div>{tab === 'task' ? <><h3>A situation you can picture</h3><p>{exercise.context}</p><div className="coding-worked-example"><h3>See one example</h3><Markdown>{exercise.example}</Markdown></div><h3>Now try it</h3><p>{exercise.task}</p>{exercise.checks.length > 0 ? <><h3>What the checks look for</h3><ul>{exercise.checks.map(check => <li key={check.label}>{check.label}</li>)}</ul></> : <div className="coding-reference-note"><h3>Inspect your result</h3><p>This lesson exercise has no automatic grading. Compare the output with the task and worked solution, then change one input and predict what happens.</p></div>}</> : <><h3>A nudge</h3><p>{exercise.hint}</p><h3>Why it matters</h3><p>{exercise.takeaway}</p><button className="btn btn-ghost btn-sm" type="button" onClick={() => setSolution(value => !value)}>{solution ? 'Hide worked solution' : 'Show worked solution'}</button>{solution && <><pre className="python-solution"><code>{exercise.solution}</code></pre><button className="btn btn-ghost btn-sm" type="button" onClick={() => replace(exercise.solution)}>Use solution in editor</button><p>Run it, change an input, and explain the result in your own words.</p></>}</>}<Link className="coding-back" to={exercise.lessonRoute ? `${exercise.lessonRoute}/${exercise.activityId}` : `/courses/${exercise.track}`}>{exercise.lessonRoute ? 'Return to the lesson task' : 'Read the related course'} ↗</Link></section>
    <section className="coding-execution" aria-label="Code and results"><div className="coding-editor-bar"><span>practice.py <small>Python</small></span><div><button type="button" disabled={runner.busy} onClick={download}>Download</button><button type="button" disabled={runner.busy} onClick={() => replace(exercise.starter)}>Reset</button></div></div><div inert={runner.busy}><PythonEditor key={editorVersion} initialCode={initialCode} onChange={change} /></div><div className="coding-run-bar"><button type="button" className="btn btn-primary" disabled={runner.busy} onClick={() => runner.run(code, exercise.checks, () => { const stored = write(passKey(exercise.id), 'true'); if (!stored) setSaved('Checks passed. Progress could not be saved; download your code to keep it.'); onPass() })}>{runner.busy ? 'Running…' : exercise.checks.length ? 'Run code & check →' : 'Run Python →'}</button><button type="button" className="btn btn-ghost" disabled={!runner.busy} onClick={runner.stop}>Stop</button></div><p className="coding-storage">{saved}</p><p className="coding-keyboard" id="python-keyboard-help">Tab moves to the next control. Use spaces to indent your code. Python loads on your first run; code executes in your browser.</p>
      <div className="coding-output" role="region" aria-label="Python output" tabIndex={0}><h3>Output</h3><p role="status">{runner.status}</p><pre>{runner.output || 'Your printed results will appear here.'}</pre>{runner.error && <div className="coding-error" role="alert"><h4>{runner.errorStage === 'startup' ? 'Python could not load' : 'Something to fix'}</h4><pre>{runner.error}</pre><p>{runner.errorStage === 'startup' ? 'Your code has not run. Your draft is still here. Select Run to retry the runtime download; if it remains blocked, check access to cdn.jsdelivr.net.' : 'Check the last line for the error type. Then check spelling, indentation, and variable names. You can use the hint or reset the exercise.'}</p></div>}</div>
      {runner.results.length > 0 && <section className="coding-checks" aria-label="Exercise checks" aria-live="polite"><h3>{runner.results.every(check => check.passed) ? 'All checks passed' : 'Keep going — inspect these checks'}</h3><ul>{runner.results.map(check => <li key={check.label}><span aria-hidden="true">{check.passed ? '✓' : '○'}</span><span>{check.passed ? 'Passed' : 'Try again'}: {check.label}</span></li>)}</ul><p>{exercise.takeaway}</p><small>These checks support practice; they do not certify mastery.</small></section>}
    </section>
  </div>
}
