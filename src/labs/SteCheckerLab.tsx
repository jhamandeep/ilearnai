import { useMemo, useState } from 'react'
import { Stat } from '../components/Field'
import { checkSte, steStats } from '../lib/ste'

const sample = `The KV cache is utilized by the model in order to avoid recomputation of the keys and values for every previous token at each decoding step, which would otherwise be quadratic in the sequence length and is the reason inference engines keep it in GPU memory. It turns out that GQA shrinks it. Should you need more memory, you might want to consider quantizing it.`

export function SteCheckerLab() {
  const [text, setText] = useState(sample)
  const [procedural, setProcedural] = useState(false)
  const issues = useMemo(() => checkSte(text, { procedural }), [text, procedural])
  const stats = useMemo(() => steStats(text), [text])
  const errors = issues.filter((i) => i.severity === 'error').length

  // Build highlighted view
  const marks: { start: number; end: number; sev: string; msg: string }[] = []
  for (const i of issues) if (!marks.some((m) => m.start === i.start && m.end === i.end)) marks.push({ start: i.start, end: i.end, sev: i.severity, msg: `${i.rule}: ${i.message}` })
  const pieces: { t: string; m?: (typeof marks)[number] }[] = []
  let cur = 0
  for (const m of marks.sort((a, b) => a.start - b.start)) {
    if (m.start < cur) continue
    if (m.start > cur) pieces.push({ t: text.slice(cur, m.start) })
    pieces.push({ t: text.slice(m.start, m.end), m })
    cur = m.end
  }
  if (cur < text.length) pieces.push({ t: text.slice(cur) })

  return (
    <div className="lab lab-stack">
      <div className="lab-controls">
        <label className="field">
          <span className="field-label">Text to check</span>
          <textarea className="text-input" rows={7} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <label className="field-inline"><input type="checkbox" checked={procedural} onChange={(e) => setProcedural(e.target.checked)} /> Procedural text (20-word limit instead of 25)</label>
        <div className="note">
          The checker applies the rules a machine can test: sentence length, paragraph length, passive voice patterns, rhetorical questions,
          undefined abbreviations, a list of common unapproved words, and heavy use of -ing forms. It cannot check the full STE dictionary or
          whether a term keeps one meaning. Read the <a href="/style">STE guide</a> for the complete rule set.
        </div>
      </div>
      <div className="ste-preview">
        {pieces.map((p, i) => p.m ? <mark key={i} className={`ste-${p.m.sev}`} title={p.m.msg}>{p.t}</mark> : <span key={i}>{p.t}</span>)}
      </div>
      <div className="lab-results">
        <Stat label="Sentences" value={stats.sentences} sub={`${stats.words} words`} />
        <Stat label="Average length" value={stats.avg.toFixed(1)} sub="words per sentence" />
        <Stat label="Longest sentence" value={stats.longest} sub={`limit ${procedural ? 20 : 25}`} />
        <Stat label="Issues" value={issues.length} sub={`${errors} errors · ${issues.length - errors} warnings`} />
      </div>
      <ul className="issues">
        {issues.map((i, k) => (
          <li key={k} className={`issue ste-${i.severity}`}>
            <strong>{i.rule}</strong> <span>{i.message}</span>
            <span className="meta">“{i.sentence.length > 110 ? i.sentence.slice(0, 110) + '…' : i.sentence}”</span>
          </li>
        ))}
        {issues.length === 0 && <li className="meta">No issues found by the automatic rules.</li>}
      </ul>
    </div>
  )
}
