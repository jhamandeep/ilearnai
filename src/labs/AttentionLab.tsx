import { useEffect, useMemo, useState } from 'react'
import { RangeField, Stat } from '../components/Field'

// Deterministic pseudo-embeddings so the same word always gets the same vector.
function hashVec(word: string, dim: number): number[] {
  let h = 2166136261
  for (const c of word.toLowerCase()) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const v: number[] = []
  let x = h >>> 0 || 1
  for (let i = 0; i < dim; i++) {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    v.push(((x >>> 0) % 2000) / 1000 - 1)
  }
  return v
}

function softmax(xs: number[]) {
  const m = Math.max(...xs)
  const e = xs.map((x) => Math.exp(x - m))
  const s = e.reduce((a, b) => a + b, 0)
  return e.map((x) => x / s)
}

export function AttentionLab() {
  const [text, setText] = useState('the cat sat on the mat because it was tired')
  const [scale, setScale] = useState(1)
  const [causal, setCausal] = useState(true)
  const [row, setRow] = useState(0)
  const [playing, setPlaying] = useState(true)

  const tokens = useMemo(() => text.trim().split(/\s+/).filter(Boolean).slice(0, 14), [text])
  const dim = 16

  const { scores, weights } = useMemo(() => {
    const q = tokens.map((t) => hashVec('q' + t, dim))
    const k = tokens.map((t, i) => hashVec('k' + t, dim).map((v, d) => v + 0.3 * Math.sin((i + 1) * (d + 1)))) // position-ish signal
    const scores = q.map((qi) => k.map((kj) => (qi.reduce((a, v, d) => a + v * kj[d], 0) / Math.sqrt(dim)) * scale))
    const weights = scores.map((rowScores, i) => {
      const masked = rowScores.map((s, j) => (causal && j > i ? -Infinity : s))
      return softmax(masked)
    })
    return { scores, weights }
  }, [tokens, scale, causal])

  useEffect(() => {
    if (!playing || tokens.length === 0) return
    const id = setInterval(() => setRow((r) => (r + 1) % tokens.length), 700)
    return () => clearInterval(id)
  }, [playing, tokens.length])

  const entropy = (w: number[]) => -w.reduce((a, p) => (p > 0 ? a + p * Math.log2(p) : a), 0)
  const current = weights[Math.min(row, weights.length - 1)] ?? []

  return (
    <div className="lab lab-stack">
      <div className="lab-controls">
        <label className="field">
          <span className="field-label">Sentence (up to 14 tokens)</span>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="text-input" />
        </label>
        <RangeField label="Score scale (sharpness)" value={scale} min={0.1} max={6} step={0.1} onChange={setScale} display={(v) => v.toFixed(1)} />
        <label className="field-inline">
          <input type="checkbox" checked={causal} onChange={(e) => setCausal(e.target.checked)} /> Causal mask (decoder style)
        </label>
        <div className="hero-actions">
          <button className="btn btn-ghost" onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Pause scan' : 'Play scan'}
          </button>
        </div>
        <div className="note">
          Embeddings here are deterministic hashes, not learned, so the pattern is illustrative: what matters is how the 1/√d scaling and
          the softmax turn raw dot products into a sharp or flat distribution, and how the causal mask zeroes the upper triangle.
        </div>
      </div>
      <div className="heatmap-wrap">
        <div className="heatmap" style={{ gridTemplateColumns: `80px repeat(${tokens.length}, 1fr)` }}>
          <div />
          {tokens.map((t, j) => (
            <div key={j} className="hm-head">
              {t}
            </div>
          ))}
          {weights.map((w, i) => (
            <div key={i} className="hm-row" style={{ display: 'contents' }}>
              <div className={`hm-head ${i === row ? 'hm-active' : ''}`} onMouseEnter={() => { setPlaying(false); setRow(i) }}>
                {tokens[i]}
              </div>
              {w.map((p, j) => (
                <div
                  key={j}
                  className={`hm-cell ${i === row ? 'hm-active' : ''}`}
                  title={`${tokens[i]} → ${tokens[j]}: score ${scores[i][j].toFixed(2)}, weight ${(p * 100).toFixed(1)}%`}
                  style={{ ['--w' as string]: Number.isFinite(p) ? p : 0 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="lab-results">
        <Stat label="Query token" value={tokens[row] ?? '—'} sub={`row ${row + 1} of ${tokens.length}`} />
        <Stat label="Attends most to" value={tokens[current.indexOf(Math.max(...current))] ?? '—'} sub={`${(Math.max(...current) * 100).toFixed(0)}% of mass`} />
        <Stat label="Row entropy" value={`${entropy(current).toFixed(2)} bits`} sub={`max ${Math.log2(Math.max(1, causal ? row + 1 : tokens.length)).toFixed(2)}`} />
      </div>
    </div>
  )
}
