import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { pythonExercises, type PythonExercise } from '../data/pythonExercises'
import { PythonEditor } from '../components/PythonEditor'
import { usePythonRunner } from '../lib/usePythonRunner'

const draftKey = (id: string) => `ilearnai:python:draft:${id}`
const passKey = (id: string) => `ilearnai:python:passed:${id}`
function read(key: string) { try { return localStorage.getItem(key) } catch { return null } }
function write(key: string, value: string) { try { localStorage.setItem(key, value); return true } catch { return false } }

export function CodePractice() {
  const [params, setParams] = useSearchParams()
  const exercise = pythonExercises.find(item => item.id === params.get('exercise')) ?? pythonExercises[0]
  const [version, setVersion] = useState(0)
  const complete = pythonExercises.filter(item => read(passKey(item.id)) === 'true').length
  return <div className="coding-page" data-progress-version={version}>
    <header className="page-head"><p className="eyebrow">Read it. Change it. Run it.</p><h1>Your Python workspace.</h1><p className="lede">Small, useful problems with instructions, real Python execution, and explained checks. Start with a worked example, then make the code your own.</p><div className="coding-progress"><span>{complete}/{pythonExercises.length} exercises passed in this browser</span><progress value={complete} max={pythonExercises.length} aria-label="Python practice progress" /></div></header>
    <nav className="coding-exercise-picker" aria-label="Python exercises">{pythonExercises.map((item, index) => <button type="button" key={item.id} aria-current={item.id === exercise.id ? 'step' : undefined} onClick={() => setParams({ exercise: item.id })}><span>{read(passKey(item.id)) === 'true' ? '✓' : String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.topic}</small></button>)}</nav>
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
    const link = document.createElement('a'); link.href = url; link.download = `${exercise.id}.py`; document.body.append(link); link.click(); link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="coding-workspace">
    <section className="coding-instructions" aria-label="Exercise instructions"><p className="eyebrow">{exercise.topic} · About {exercise.minutes} min</p><h2>{exercise.title}</h2><div className="workspace-pills" aria-label="Instruction view"><button type="button" aria-pressed={tab === 'task'} onClick={() => setTab('task')}>Your task</button><button type="button" aria-pressed={tab === 'help'} onClick={() => setTab('help')}>Hint &amp; explanation</button></div>{tab === 'task' ? <><h3>A situation you can picture</h3><p>{exercise.context}</p><div className="coding-worked-example"><h3>See one example</h3><p>{exercise.example}</p></div><h3>Now try it</h3><p>{exercise.task}</p><h3>What the checks look for</h3><ul>{exercise.checks.map(check => <li key={check.label}>{check.label}</li>)}</ul></> : <><h3>A nudge</h3><p>{exercise.hint}</p><h3>Why it matters</h3><p>{exercise.takeaway}</p><button className="btn btn-ghost btn-sm" type="button" onClick={() => setSolution(value => !value)}>{solution ? 'Hide worked solution' : 'Show worked solution'}</button>{solution && <><pre className="python-solution"><code>{exercise.solution}</code></pre><button className="btn btn-ghost btn-sm" type="button" onClick={() => replace(exercise.solution)}>Use solution in editor</button><p>Run it, change an input, and explain the result in your own words.</p></>}</>}<Link className="coding-back" to={`/courses/${exercise.track}`}>Read the related course ↗</Link></section>
    <section className="coding-execution" aria-label="Code and results"><div className="coding-editor-bar"><span>practice.py <small>Python</small></span><div><button type="button" disabled={runner.busy} onClick={download}>Download</button><button type="button" disabled={runner.busy} onClick={() => replace(exercise.starter)}>Reset</button></div></div><div inert={runner.busy}><PythonEditor key={editorVersion} initialCode={initialCode} onChange={change} /></div><div className="coding-run-bar"><button type="button" className="btn btn-primary" disabled={runner.busy} onClick={() => runner.run(code, exercise.checks, () => { const stored = write(passKey(exercise.id), 'true'); if (!stored) setSaved('Checks passed. Progress could not be saved; download your code to keep it.'); onPass() })}>{runner.busy ? 'Running…' : 'Run code & check →'}</button><button type="button" className="btn btn-ghost" disabled={!runner.busy} onClick={runner.stop}>Stop</button></div><p className="coding-storage">{saved}</p><p className="coding-keyboard" id="python-keyboard-help">Tab moves to the next control. Use spaces to indent your code. Python loads on your first run; code executes in your browser.</p>
      <div className="coding-output" role="region" aria-label="Python output" tabIndex={0}><h3>Output</h3><p role="status">{runner.status}</p><pre>{runner.output || 'Your printed results will appear here.'}</pre>{runner.error && <div className="coding-error" role="alert"><h4>Something to fix</h4><pre>{runner.error}</pre><p>Check the last line for the error type. Then check spelling, indentation, and variable names. You can use the hint or reset the exercise.</p></div>}</div>
      {runner.results.length > 0 && <section className="coding-checks" aria-label="Exercise checks" aria-live="polite"><h3>{runner.results.every(check => check.passed) ? 'All checks passed' : 'Keep going — inspect these checks'}</h3><ul>{runner.results.map(check => <li key={check.label}><span aria-hidden="true">{check.passed ? '✓' : '○'}</span><span>{check.passed ? 'Passed' : 'Try again'}: {check.label}</span></li>)}</ul><p>{exercise.takeaway}</p><small>These checks support practice; they do not certify mastery.</small></section>}
    </section>
  </div>
}
