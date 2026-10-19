import { useMemo, useState } from 'react'
import { RangeField } from '../components/Field'
import { pct } from '../lib/format'

const vocab = ['the', 'a', 'cat', 'dog', 'sat', 'on', 'mat', 'ran', 'quickly', 'blue', 'is', 'very']
const baseLogits = [3.2, 2.9, 2.4, 2.3, 1.8, 1.5, 1.2, 0.9, 0.4, 0.1, -0.3, -0.8]

function softmax(xs: number[]) {
  const m = Math.max(...xs)
  const e = xs.map((x) => Math.exp(x - m))
  const s = e.reduce((a, b) => a + b, 0)
  return e.map((x) => x / s)
}

export function SamplingLab() {
  const [temp, setTemp] = useState(1)
  const [topK, setTopK] = useState(12)
  const [topP, setTopP] = useState(1)

  const result = useMemo(() => {
    const scaled = baseLogits.map((l) => l / Math.max(temp, 0.01))
    let probs = softmax(scaled)
    const order = probs.map((p, i) => [p, i] as const).sort((a, b) => b[0] - a[0])
    const keep = new Set<number>()
    let cum = 0
    order.forEach(([p, i], rank) => {
      if (rank >= topK) return
      if (cum >= topP && keep.size > 0) return
      keep.add(i)
      cum += p
    })
    const masked = probs.map((p, i) => (keep.has(i) ? p : 0))
    const z = masked.reduce((a, b) => a + b, 0)
    probs = masked.map((p) => p / z)
    const entropy = -probs.reduce((a, p) => (p > 0 ? a + p * Math.log2(p) : a), 0)
    return { probs, keep, entropy }
  }, [temp, topK, topP])

  const max = Math.max(...result.probs)

  return (
    <div className="lab">
      <div className="lab-controls">
        <RangeField label="Temperature" value={temp} min={0.05} max={2.5} step={0.05} onChange={setTemp} display={(v) => v.toFixed(2)} />
        <RangeField label="Top-k" value={topK} min={1} max={vocab.length} onChange={setTopK} />
        <RangeField label="Top-p" value={topP} min={0.05} max={1} step={0.05} onChange={setTopP} display={(v) => v.toFixed(2)} />
        <div className="note">
          Logits are divided by temperature, then softmaxed. Top-k keeps the k highest; top-p keeps the smallest set whose cumulative mass
          reaches p. The survivors are renormalised. Entropy: <strong>{result.entropy.toFixed(2)} bits</strong>.
        </div>
      </div>
      <div className="lab-results">
        <ul className="bars">
          {vocab.map((w, i) => (
            <li key={w} className={result.keep.has(i) ? '' : 'cut'}>
              <span className="bar-label">{w}</span>
              <span className="bar" style={{ width: `${(result.probs[i] / max) * 100}%` }} />
              <span className="meta">{pct(result.probs[i])}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
