import { useMemo, useState } from 'react'
import { NumberField, RangeField, Stat } from '../components/Field'
import { pct } from '../lib/format'

interface Hop { name: string; p50: number; p99: number; timeout: number; retries: number }

const initial: Hop[] = [
  { name: 'Gateway', p50: 5, p99: 20, timeout: 100, retries: 0 },
  { name: 'Retrieval', p50: 40, p99: 180, timeout: 300, retries: 1 },
  { name: 'Reranker', p50: 60, p99: 250, timeout: 400, retries: 0 },
  { name: 'LLM first token', p50: 350, p99: 1200, timeout: 2000, retries: 1 },
]

// Log-normal latency with the given p50 and p99.
function sampler(p50: number, p99: number, rand: () => number) {
  const mu = Math.log(p50)
  const sigma = (Math.log(p99) - mu) / 2.326
  return () => {
    const u = Math.max(rand(), 1e-9)
    const v = rand()
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    return Math.exp(mu + sigma * z)
  }
}

export function TimeoutArchitectLab() {
  const [hops, setHops] = useState<Hop[]>(initial)
  const [budget, setBudget] = useState(2500)
  const [runs, setRuns] = useState(5000)
  const [seed, setSeed] = useState(7)

  const update = (i: number, patch: Partial<Hop>) => setHops((hs) => hs.map((h, j) => (j === i ? { ...h, ...patch } : h)))

  const result = useMemo(() => {
    const rng = { x: seed >>> 0 || 1 }
    const rand = () => { rng.x ^= rng.x << 13; rng.x ^= rng.x >>> 17; rng.x ^= rng.x << 5; return ((rng.x >>> 0) % 1_000_000) / 1_000_000 }
    const samplers = hops.map((h) => sampler(h.p50, h.p99, rand))
    const totals: number[] = []
    let failures = 0
    let retriesUsed = 0
    const perHop = hops.map(() => 0)
    for (let r = 0; r < runs; r++) {
      let t = 0
      let ok = true
      for (let i = 0; i < hops.length; i++) {
        const h = hops[i]
        let done = false
        for (let a = 0; a <= h.retries && !done; a++) {
          const lat = samplers[i]()
          if (lat <= h.timeout) { t += lat; done = true } else { t += h.timeout; if (a < h.retries) retriesUsed++ }
        }
        perHop[i] += t
        if (!done) { ok = false; break }
      }
      if (ok) totals.push(t)
      else failures++
    }
    totals.sort((a, b) => a - b)
    const q = (p: number) => totals[Math.min(totals.length - 1, Math.floor(p * totals.length))] ?? 0
    const withinBudget = totals.filter((v) => v <= budget).length / runs
    return { p50: q(0.5), p95: q(0.95), p99: q(0.99), failRate: failures / runs, withinBudget, retriesPerReq: retriesUsed / runs, perHop: perHop.map((v) => v / runs) }
  }, [hops, runs, seed, budget])

  const sumTimeouts = hops.reduce((a, h) => a + h.timeout * (1 + h.retries), 0)
  const maxScale = Math.max(sumTimeouts, result.p99, budget) || 1

  return (
    <div className="lab lab-stack">
      <div className="steps-wrap">
        <table className="steps">
          <thead>
            <tr><th>Hop</th><th>p50 (ms)</th><th>p99 (ms)</th><th>Timeout (ms)</th><th>Retries</th><th>Mean spent</th></tr>
          </thead>
          <tbody>
            {hops.map((h, i) => (
              <tr key={i}>
                <td><input value={h.name} onChange={(e) => update(i, { name: e.target.value })} /></td>
                <td><input type="number" min={1} value={h.p50} onChange={(e) => update(i, { p50: Number(e.target.value) })} /></td>
                <td><input type="number" min={1} value={h.p99} onChange={(e) => update(i, { p99: Number(e.target.value) })} /></td>
                <td><input type="number" min={1} value={h.timeout} onChange={(e) => update(i, { timeout: Number(e.target.value) })} /></td>
                <td><input type="number" min={0} max={3} value={h.retries} onChange={(e) => update(i, { retries: Number(e.target.value) })} /></td>
                <td>{result.perHop[i].toFixed(0)} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="waterfall">
        {hops.map((h, i) => (
          <div key={i} className="wf-row">
            <span className="wf-label">{h.name}</span>
            <span className="wf-track">
              <span className="wf-bar wf-timeout" style={{ width: `${((h.timeout * (1 + h.retries)) / maxScale) * 100}%` }} />
              <span className="wf-bar wf-p99" style={{ width: `${(h.p99 / maxScale) * 100}%` }} />
              <span className="wf-bar wf-p50" style={{ width: `${(h.p50 / maxScale) * 100}%` }} />
            </span>
          </div>
        ))}
        <div className="wf-row">
          <span className="wf-label"><strong>End to end</strong></span>
          <span className="wf-track">
            <span className="wf-bar wf-budget" style={{ width: `${(budget / maxScale) * 100}%` }} />
            <span className="wf-bar wf-p99" style={{ width: `${(result.p99 / maxScale) * 100}%` }} />
            <span className="wf-bar wf-p50" style={{ width: `${(result.p50 / maxScale) * 100}%` }} />
          </span>
        </div>
        <div className="meta wf-legend"><span className="sw wf-p50" /> p50 <span className="sw wf-p99" /> p99 <span className="sw wf-timeout" /> worst case (timeout × attempts) <span className="sw wf-budget" /> budget</div>
      </div>
      <div className="lab-controls">
        <NumberField label="End-to-end budget (ms)" value={budget} min={1} step={100} onChange={setBudget} />
        <RangeField label="Simulated requests" value={runs} min={1000} max={50000} step={1000} onChange={setRuns} display={(v) => v.toLocaleString()} />
        <NumberField label="Seed" value={seed} onChange={setSeed} />
      </div>
      <div className="lab-results">
        <Stat label="End-to-end p50" value={`${result.p50.toFixed(0)} ms`} />
        <Stat label="End-to-end p99" value={`${result.p99.toFixed(0)} ms`} sub={`p95 ${result.p95.toFixed(0)} ms`} />
        <Stat label="Within budget" value={pct(result.withinBudget)} />
        <Stat label="Hard failures" value={pct(result.failRate, 2)} sub="all attempts timed out" />
        <Stat label="Worst-case path" value={`${sumTimeouts} ms`} sub={sumTimeouts > budget ? 'exceeds budget: timeouts too loose' : 'fits inside budget'} />
        <Stat label="Retries per request" value={result.retriesPerReq.toFixed(3)} />
        <div className="note">
          Timeouts should be set from the downstream p99, not the mean, and the sum of (timeout × attempts) along the chain must fit the budget,
          or a bad day turns into a retry storm. Latencies are log-normal samples from the p50 and p99 you give each hop.
        </div>
      </div>
    </div>
  )
}
