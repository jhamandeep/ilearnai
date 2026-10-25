import { useMemo, useState } from 'react'

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
  const { title, task, hint, lang, solution } = useMemo(() => {
    const lines = src.replace(/\n$/, '').split('\n')
    let title = ''
    let lang = 'text'
    const task: string[] = []
    const hint: string[] = []
    let mode: 'task' | 'hint' | 'none' = 'none'
    let solution = ''
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i]
      const line = raw.trim()
      if (/^solution\s*:\s*$/.test(line)) { solution = lines.slice(i + 1).join('\n'); break }
      let m = /^title\s*:\s*(.*)$/.exec(line)
      if (m) { title = m[1]; mode = 'none'; continue }
      m = /^lang\s*:\s*(.*)$/.exec(line)
      if (m) { lang = m[1].trim(); mode = 'none'; continue }
      m = /^task\s*:\s*(.*)$/.exec(line)
      if (m) { task.push(m[1]); mode = 'task'; continue }
      m = /^hint\s*:\s*(.*)$/.exec(line)
      if (m) { hint.push(m[1]); mode = 'hint'; continue }
      if (mode === 'task') task.push(line)
      else if (mode === 'hint') hint.push(line)
    }
    return { title, task: task.join(' ').trim(), hint: hint.join(' ').trim(), lang, solution }
  }, [src])
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
      <div className="rich-bar">
        {hint && !showHint && <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)}>Show hint</button>}
        {solution && <button className="btn btn-ghost btn-sm" onClick={() => setShowSol((s) => !s)}>{showSol ? 'Hide solution' : 'Show solution'}</button>}
        <span className="rich-caption">Try it yourself first. Then compare.</span>
      </div>
    </figure>
  )
}
