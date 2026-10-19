import { useMemo, useState } from 'react'
import { NumberField, RangeField, Stat } from '../components/Field'
import { pct } from '../lib/format'

type Risk = 'read' | 'write' | 'external'
const riskWeight: Record<Risk, number> = { read: 1, write: 3, external: 5 }

interface Step {
  name: string
  p: number
  retries: number
  fallback: number
  risk: Risk
}

const initial: Step[] = [
  { name: 'Parse task', p: 0.98, retries: 0, fallback: 0, risk: 'read' },
  { name: 'Search docs', p: 0.9, retries: 2, fallback: 0.5, risk: 'read' },
  { name: 'Write patch', p: 0.85, retries: 1, fallback: 0, risk: 'write' },
  { name: 'Run tests', p: 0.92, retries: 1, fallback: 0, risk: 'write' },
  { name: 'Open PR', p: 0.97, retries: 1, fallback: 0, risk: 'external' },
]

// Probability a step eventually succeeds given retries and a fallback path.
function stepSuccess(s: Step) {
  const failAll = Math.pow(1 - s.p, 1 + s.retries)
  return 1 - failAll * (1 - s.fallback)
}

export function AgentControlRoom() {
  const [steps, setSteps] = useState<Step[]>(initial)
  const [runs, setRuns] = useState(10000)
  const [seed, setSeed] = useState(42)

  const update = (i: number, patch: Partial<Step>) => setSteps((ss) => ss.map((s, j) => (j === i ? { ...s, ...patch } : s)))
  const add = () => setSteps((ss) => [...ss, { name: `Step ${ss.length + 1}`, p: 0.9, retries: 0, fallback: 0, risk: 'read' }])
  const remove = (i: number) => setSteps((ss) => ss.filter((_, j) => j !== i))

  const analytic = steps.reduce((acc, s) => acc * stepSuccess(s), 1)
  const naive = steps.reduce((acc, s) => acc * s.p, 1)
  const expectedCalls = steps.reduce((acc, s) => {
    // expected attempts for a geometric-with-cap process
    let e = 0
    let alive = 1
    for (let k = 0; k <= s.retries; k++) {
      e += alive
      alive *= 1 - s.p
    }
    return acc + e
  }, 0)
  const riskScore = steps.reduce((acc, s) => acc + riskWeight[s.risk] * (1 + s.retries), 0)

  // Seeded Monte Carlo so the number is reproducible.
  const simulated = useMemo(() => {
    let x = seed >>> 0 || 1
    const rand = () => {
      x ^= x << 13
      x ^= x >>> 17
      x ^= x << 5
      return ((x >>> 0) % 1_000_000) / 1_000_000
    }
    let ok = 0
    for (let r = 0; r < runs; r++) {
      let alive = true
      for (const s of steps) {
        let passed = false
        for (let k = 0; k <= s.retries && !passed; k++) passed = rand() < s.p
        if (!passed && rand() < s.fallback) passed = true
        if (!passed) {
          alive = false
          break
        }
      }
      if (alive) ok++
    }
    return ok / runs
  }, [steps, runs, seed])

  return (
    <div className="lab lab-stack">
      <div className="steps-wrap"><table className="steps">
        <thead>
          <tr>
            <th>Step</th>
            <th>Success rate</th>
            <th>Retries</th>
            <th>Fallback</th>
            <th>Permission</th>
            <th>Effective</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {steps.map((s, i) => (
            <tr key={i}>
              <td>
                <input value={s.name} onChange={(e) => update(i, { name: e.target.value })} />
              </td>
              <td>
                <input type="range" min={0.5} max={1} step={0.01} value={s.p} onChange={(e) => update(i, { p: Number(e.target.value) })} />
                <span className="meta">{pct(s.p, 0)}</span>
              </td>
              <td>
                <input type="number" min={0} max={5} value={s.retries} onChange={(e) => update(i, { retries: Number(e.target.value) })} />
              </td>
              <td>
                <input type="range" min={0} max={1} step={0.05} value={s.fallback} onChange={(e) => update(i, { fallback: Number(e.target.value) })} />
                <span className="meta">{pct(s.fallback, 0)}</span>
              </td>
              <td>
                <select value={s.risk} onChange={(e) => update(i, { risk: e.target.value as Risk })}>
                  <option value="read">read</option>
                  <option value="write">write</option>
                  <option value="external">external</option>
                </select>
              </td>
              <td>{pct(stepSuccess(s))}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => remove(i)} aria-label={`Remove ${s.name}`}>
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      <button className="btn btn-ghost" onClick={add}>
        Add step
      </button>
      <div className="lab-controls">
        <RangeField label="Simulation runs" value={runs} min={1000} max={100000} step={1000} onChange={setRuns} display={(v) => v.toLocaleString()} />
        <NumberField label="Seed" value={seed} onChange={setSeed} />
      </div>
      <div className="lab-results">
        <Stat label="Naive success" value={pct(naive)} sub="product of raw rates, no retries" />
        <Stat label="With retries and fallbacks" value={pct(analytic)} sub="closed form" />
        <Stat label="Simulated" value={pct(simulated)} sub={`${runs.toLocaleString()} seeded runs`} />
        <Stat label="Expected model calls" value={expectedCalls.toFixed(2)} sub="per task, counting retries" />
        <Stat label="Permission risk" value={riskScore} sub="Σ weight × (1 + retries); read 1, write 3, external 5" />
      </div>
    </div>
  )
}
