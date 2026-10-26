import { useEffect, useMemo, useState } from 'react'
import { parseBlock } from './parse'

interface Step { text: string; state: Record<string, string> }

// A numeric value gets a small meter next to it so change is visible at a glance.
function Value({ v, prev, maxAbs }: { v: string; prev?: string; maxAbs: number }) {
  const n = parseFloat(v.replace(/,/g, ''))
  const numeric = Number.isFinite(n) && /^-?[\d.,]+$/.test(v.trim())
  const changed = prev !== undefined && prev !== v
  return (
    <dd key={v} className={changed ? 'sc-val sc-val-changed' : 'sc-val'}>
      {numeric && maxAbs > 0 && <span className="sc-meter"><span style={{ width: `${Math.min(100, (Math.abs(n) / maxAbs) * 100)}%` }} className={n < 0 ? 'neg' : ''} /></span>}
      {changed && prev !== undefined && <span className="sc-prev">{prev}</span>}
      <span className="sc-cur">{v}</span>
    </dd>
  )
}

export function Scenario({ src }: { src: string }) {
  const { title, steps } = useMemo(() => {
    const b = parseBlock(src)
    const steps: Step[] = []
    let state: Record<string, string> = {}
    let pending: Record<string, string> | null = null
    for (const line of b.lines) {
      const sm = /^state\s*:\s*(.*)$/.exec(line)
      if (sm) {
        for (const kv of sm[1].split(',')) {
          const [k, ...rest] = kv.split('=')
          if (k && rest.length) state = { ...state, [k.trim()]: rest.join('=').trim() }
        }
        if (steps.length) steps[steps.length - 1].state = { ...state }
        else pending = { ...state }
        continue
      }
      const tm = /^(?:step\s*:\s*|\d+[.)]\s+)(.*)$/.exec(line)
      const text = tm ? tm[1] : line
      steps.push({ text, state: { ...(pending ?? state) } })
      pending = null
    }
    return { title: b.title, steps }
  }, [src])

  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setI((k) => { if (k + 1 >= steps.length) { setPlaying(false); return k } return k + 1 }), 2600)
    return () => clearInterval(id)
  }, [playing, steps.length])

  if (steps.length === 0) return null
  const cur = steps[Math.min(i, steps.length - 1)]
  const prev = steps[i - 1]?.state ?? {}
  const keys = Object.keys(cur.state)
  // scale for the meters: the largest absolute numeric value of each key across all steps
  const maxAbs: Record<string, number> = {}
  for (const s of steps) for (const [k, v] of Object.entries(s.state)) { const n = parseFloat(v.replace(/,/g, '')); if (Number.isFinite(n) && /^-?[\d.,]+$/.test(v.trim())) maxAbs[k] = Math.max(maxAbs[k] ?? 0, Math.abs(n)) }

  return (
    <figure className="rich rich-scenario">
      {title && <figcaption><span className="rich-kind">Step by step</span>{title}</figcaption>}
      <div className="sc-progress" aria-hidden="true"><span style={{ width: `${((i + 1) / steps.length) * 100}%` }} /></div>
      <div className="sc-body">
        <ol className="sc-steps">
          {steps.map((s, k) => (
            <li key={k} className={k === i ? 'sc-on' : k < i ? 'sc-done' : ''} onClick={() => { setPlaying(false); setI(k) }}>
              <span className="sc-num">{k < i ? '✓' : k + 1}</span>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
        {keys.length > 0 && (
          <div className="sc-state" aria-live="polite">
            <div className="sc-state-title">State after step {i + 1}</div>
            <dl>
              {keys.map((k) => (
                <div key={k} className={i > 0 && prev[k] !== cur.state[k] ? 'sc-changed' : ''}>
                  <dt>{k}</dt>
                  <Value v={cur.state[k]} prev={i > 0 ? prev[k] : undefined} maxAbs={maxAbs[k] ?? 0} />
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
      <div className="rich-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setI((k) => Math.max(0, k - 1)) }} disabled={i === 0}>← Back</button>
        <button className="btn btn-primary btn-sm" onClick={() => { if (i >= steps.length - 1) { setI(0); setPlaying(true) } else setPlaying((p) => !p) }}>{playing ? 'Pause' : i >= steps.length - 1 ? 'Replay' : 'Play'}</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setPlaying(false); setI((k) => Math.min(steps.length - 1, k + 1)) }} disabled={i >= steps.length - 1}>Next →</button>
        <span className="rich-caption">Step {i + 1} of {steps.length}</span>
      </div>
    </figure>
  )
}
