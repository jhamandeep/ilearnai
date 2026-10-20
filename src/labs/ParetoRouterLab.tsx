import { useMemo, useState } from 'react'
import { scaleLinear, scaleLog } from 'd3-scale'
import { RangeField, Stat } from '../components/Field'

interface Model { name: string; quality: number; cost: number; latency: number }

// Illustrative numbers: cost in $ per million output tokens, quality as a 0-100 composite, latency in ms per token.
const models: Model[] = [
  { name: 'Frontier XL', quality: 92, cost: 60, latency: 45 },
  { name: 'Frontier', quality: 88, cost: 15, latency: 30 },
  { name: 'Mid', quality: 80, cost: 3, latency: 18 },
  { name: 'Small', quality: 68, cost: 0.6, latency: 9 },
  { name: 'Tiny', quality: 52, cost: 0.15, latency: 5 },
  { name: 'Open 70B', quality: 82, cost: 2.5, latency: 22 },
  { name: 'Open 8B', quality: 64, cost: 0.4, latency: 8 },
  { name: 'Legacy', quality: 70, cost: 8, latency: 25 },
  { name: 'Reasoning', quality: 94, cost: 90, latency: 120 },
]

function pareto(ms: Model[]) {
  return ms.filter((m) => !ms.some((o) => o !== m && o.quality >= m.quality && o.cost <= m.cost && (o.quality > m.quality || o.cost < m.cost)))
}

export function ParetoRouterLab() {
  const [minQuality, setMinQuality] = useState(75)
  const [maxLatency, setMaxLatency] = useState(60)
  const [easyShare, setEasyShare] = useState(0.6)

  const frontier = useMemo(() => pareto(models), [])
  const eligible = models.filter((m) => m.quality >= minQuality && m.latency <= maxLatency)
  const chosen = eligible.length ? eligible.reduce((a, b) => (b.cost < a.cost ? b : a)) : null
  const cheapestAny = models.reduce((a, b) => (b.cost < a.cost ? b : a))
  // Two-tier router: easy requests to the cheapest model that clears a lower bar, the rest to `chosen`.
  const easyModel = models.filter((m) => m.quality >= minQuality - 15 && m.latency <= maxLatency).reduce<Model | null>((a, b) => (!a || b.cost < a.cost ? b : a), null)
  const routedCost = chosen && easyModel ? easyShare * easyModel.cost + (1 - easyShare) * chosen.cost : chosen?.cost ?? 0
  const routedQuality = chosen && easyModel ? easyShare * easyModel.quality + (1 - easyShare) * chosen.quality : chosen?.quality ?? 0

  const W = 560
  const H = 340
  const pad = { l: 50, r: 20, t: 20, b: 40 }
  const xs = scaleLog().domain([0.1, 120]).range([pad.l, W - pad.r])
  const ys = scaleLinear().domain([45, 100]).range([H - pad.b, pad.t])
  const sorted = [...frontier].sort((a, b) => a.cost - b.cost)

  return (
    <div className="lab">
      <div className="lab-controls">
        <RangeField label="Minimum quality" value={minQuality} min={50} max={95} onChange={setMinQuality} />
        <RangeField label="Max latency (ms/token)" value={maxLatency} min={5} max={130} onChange={setMaxLatency} />
        <RangeField label="Share of easy requests" value={easyShare} min={0} max={1} step={0.05} onChange={setEasyShare} display={(v) => `${Math.round(v * 100)}%`} />
        <div className="note">
          Models on the Pareto frontier (filled) are the only ones worth considering: every other model is beaten on both quality and cost by
          something else. A router sends easy requests to a cheaper model and keeps the strong one for the rest. The numbers are illustrative.
        </div>
      </div>
      <div className="lab-results">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" style={{ gridColumn: '1 / -1' }} role="img" aria-label="Quality versus cost scatter">
          {[0.1, 1, 10, 100].map((c) => (
            <g key={c}>
              <line x1={xs(c)} x2={xs(c)} y1={pad.t} y2={H - pad.b} stroke="var(--border)" />
              <text x={xs(c)} y={H - pad.b + 16} textAnchor="middle" fontSize="11" fill="var(--text-dim)">${c}</text>
            </g>
          ))}
          {[50, 60, 70, 80, 90, 100].map((q) => (
            <g key={q}>
              <line x1={pad.l} x2={W - pad.r} y1={ys(q)} y2={ys(q)} stroke="var(--border)" />
              <text x={pad.l - 6} y={ys(q) + 4} textAnchor="end" fontSize="11" fill="var(--text-dim)">{q}</text>
            </g>
          ))}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="var(--text-dim)">cost per 1M output tokens (log)</text>
          <rect x={pad.l} y={pad.t} width={W - pad.l - pad.r} height={ys(minQuality) - pad.t} fill="var(--primary)" opacity={0.06} />
          <line x1={pad.l} x2={W - pad.r} y1={ys(minQuality)} y2={ys(minQuality)} stroke="var(--primary)" strokeDasharray="4 3" />
          <path d={sorted.map((m, i) => `${i ? 'L' : 'M'} ${xs(m.cost)} ${ys(m.quality)}`).join(' ')} fill="none" stroke="var(--text-dim)" strokeWidth={1.5} className="draw" />
          {models.map((m) => {
            const onF = frontier.includes(m)
            const isChosen = chosen === m
            const isEasy = easyModel === m && easyModel !== chosen
            return (
              <g key={m.name} className="dot">
                <circle cx={xs(m.cost)} cy={ys(m.quality)} r={isChosen || isEasy ? 9 : 6} fill={onF ? (isChosen ? 'var(--primary)' : isEasy ? 'var(--accent-engineering)' : 'var(--text)') : 'var(--surface)'} stroke={onF ? 'none' : 'var(--text-dim)'} strokeWidth={1.5} />
                <text x={xs(m.cost) + 10} y={ys(m.quality) - 8} fontSize="11" fill="var(--text)">{m.name}</text>
              </g>
            )
          })}
        </svg>
        <Stat label="Hard requests →" value={chosen?.name ?? 'none fits'} sub={chosen ? `$${chosen.cost}/M · q${chosen.quality} · ${chosen.latency} ms` : 'relax a constraint'} />
        <Stat label="Easy requests →" value={easyModel?.name ?? '—'} sub={easyModel ? `$${easyModel.cost}/M · q${easyModel.quality}` : ''} />
        <Stat label="Blended cost" value={`$${routedCost.toFixed(2)}/M`} sub={chosen ? `${Math.round((1 - routedCost / chosen.cost) * 100)}% below single-model` : ''} />
        <Stat label="Blended quality" value={routedQuality.toFixed(1)} sub={`floor is ${cheapestAny.name} at q${cheapestAny.quality}`} />
      </div>
    </div>
  )
}
