export function LossTrace({ values, step, compact = false }: { values: number[]; step: number; compact?: boolean }) {
  const low = Math.min(0, ...values)
  const high = Math.max(0, ...values) || (low === 0 ? 1 : 0)
  const span = high - low || 1
  const width = compact ? 360 : 560
  const right = width - 24
  const point = (value: number, i: number) => [55 + i / Math.max(1, values.length - 1) * (right - 55), 135 - (value - low) / span * 95]
  const points = values.map((value, i) => point(value, i).join(',')).join(' ')
  const last = point(values.at(-1) ?? 0, Math.max(0, values.length - 1))
  const label = (value: number) => Math.abs(value) >= 10000 || (value !== 0 && Math.abs(value) < 0.01) ? value.toExponential(1) : value.toFixed(2)
  return <figure className="lab-loss-trace" data-lab-visual="loss"><figcaption><strong>Loss over recent steps</strong><span>Watch how the error changes</span></figcaption><svg viewBox={`0 0 ${width} 180`} role="img" aria-label={`Loss trace across ${values.length} recent optimization steps. Current loss ${label(values.at(-1) ?? 0)}.`}>{[low, low + span / 2, high].map((value, i) => <g key={i}><line x1={55} x2={right} y1={point(value, 0)[1]} y2={point(value, 0)[1]} stroke="var(--border)" /><text x={45} y={point(value, 0)[1] + 4} textAnchor="end">{label(value)}</text></g>)}<polyline points={points} fill="none" stroke="#5476bc" strokeWidth={3} strokeLinejoin="round" /><circle cx={last[0]} cy={last[1]} r={5} fill="#405b9a" /><text x={55} y={161}>Step {Math.max(0, step - values.length + 1)}</text><text x={right} y={161} textAnchor="end">Step {step}</text><text x={55} y={21}>Loss</text></svg></figure>
}
