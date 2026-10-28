import { useRef, useEffect, useMemo, useState } from 'react'
import { RangeField, Stat } from '../components/Field'
import { LabVisual } from '../components/LabVisual'
import { useLabMotion } from '../lib/useLabMotion'

// Minimal byte-pair encoding trained in the browser on the text you give it.
function trainBpe(text: string, merges: number) {
  const words = text.split(/(\s+)/).filter(Boolean)
  let seqs = words.map((w) => Array.from(w))
  const history: { pair: [string, string]; count: number }[] = []
  for (let m = 0; m < merges; m++) {
    const counts = new Map<string, number>()
    for (const s of seqs) for (let i = 0; i < s.length - 1; i++) counts.set(s[i] + '\u0000' + s[i + 1], (counts.get(s[i] + '\u0000' + s[i + 1]) ?? 0) + 1)
    let best: string | null = null
    let bestCount = 1
    for (const [k, c] of counts) if (c > bestCount) { best = k; bestCount = c }
    if (!best) break
    const [a, b] = best.split('\u0000') as [string, string]
    history.push({ pair: [a, b], count: bestCount })
    seqs = seqs.map((s) => {
      const out: string[] = []
      for (let i = 0; i < s.length; i++) {
        if (i < s.length - 1 && s[i] === a && s[i + 1] === b) { out.push(a + b); i++ } else out.push(s[i])
      }
      return out
    })
  }
  return { tokens: seqs.flat(), history }
}

const sample =
  'Transformers process tokens, not words. The tokenizer decides what a token is, and that decision shapes everything downstream: context length, cost, and even arithmetic ability. Byte-pair encoding starts from bytes and repeatedly merges the most frequent adjacent pair.'

export function TokenizerLab() {
  const [text, setText] = useState(sample)
  const [merges, setMerges] = useState(40)
  const [shown, setShown] = useState(0)
  const [playing, setPlaying] = useState(true)
  const motionRef = useRef<HTMLDivElement>(null)
  const motionActive = useLabMotion(motionRef, playing)

  const full = useMemo(() => trainBpe(text, merges), [text, merges])
  const view = useMemo(() => trainBpe(text, shown), [text, shown])

  useEffect(() => {
    if (!motionActive) return
    const id = setInterval(() => setShown((s) => (s >= merges ? 0 : s + 1)), 350)
    return () => clearInterval(id)
  }, [motionActive, merges])

  const chars = Array.from(text).length
  const palette = ['#6c4bd8', '#1f8f6a', '#d9622b', '#1f5eff', '#b8266a', '#8a7a3a']

  return (
    <div className="lab lab-stack" ref={motionRef}>
      <div className="lab-controls">
        <label className="field">
          <span className="field-label">Text</span>
          <textarea value={text} rows={4} onChange={(e) => setText(e.target.value)} className="text-input" />
        </label>
        <RangeField label="Merges to learn" value={merges} min={0} max={120} onChange={(v) => { setMerges(v); setShown(Math.min(shown, v)) }} />
        <RangeField label="Merges applied (animation)" value={shown} min={0} max={merges} onChange={(v) => { setPlaying(false); setShown(v) }} />
        <div className="hero-actions">
          <button className="btn btn-ghost" onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
      <div className="tokens">
        {view.tokens.map((t, i) => (
          <span key={i} className="token" style={{ background: palette[i % palette.length] + '22', borderColor: palette[i % palette.length] }}>
            {t.replace(/ /g, '␣').replace(/\n/g, '⏎')}
          </span>
        ))}
      </div>
      <div className="lab-results">
        <LabVisual title="From characters to reusable tokens" mode="pipeline" caption="Follow the current byte-pair encoding steps. The counts update with your text and merge slider." items={[{ label: 'Input characters', value: chars, display: String(chars) }, { label: 'Merges applied', value: shown, display: String(shown) }, { label: 'Current tokens', value: view.tokens.length, display: String(view.tokens.length), detail: view.history.length ? `Most recent pair: ${view.history[view.history.length - 1].pair.join(' + ')}.` : 'No learned pair has been applied yet.' }, { label: 'Full vocabulary', value: full.tokens.length, display: `${full.tokens.length} tokens` }]} />
        <Stat label="Characters" value={chars} />
        <Stat label="Tokens now" value={view.tokens.length} sub={`${shown} merges applied`} />
        <Stat label="Tokens at full vocab" value={full.tokens.length} sub={`${(chars / Math.max(1, full.tokens.length)).toFixed(2)} chars per token`} />
        <Stat label="Last merge" value={view.history.length ? view.history[view.history.length - 1].pair.join('+').replace(/ /g, '␣') : '—'} sub={view.history.length ? `seen ${view.history[view.history.length - 1].count}×` : 'none yet'} />
        <div className="note">
          Real tokenizers train on terabytes and have 32k to 256k merges, but the algorithm is this one. Notice that common words become single
          tokens early while rare words stay fragmented, which is why "strawberry" has three r's the model can't easily count.
        </div>
      </div>
    </div>
  )
}
