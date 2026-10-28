export function LossTrace({ values, step }: { values: number[]; step: number }) {
  const low = Math.min(0, ...values)
  const high = Math.max(0, ...values)
  const span = high - low || 1
  const point = (value: number, i: number) => [55 + i / Math.max(1, values.length - 1) * 465, 135 - (value - low) / span * 95]
  const points = values.map((value, i) => point(value, i).join(',')).join(' ')
  const last = point(values.at(-1) ?? 0, Math.max(0, values.length - 1))
  const label = (value: number) => Math.abs(value) >= 10000 ? value.toExponential(1) : value.toFixed(2)
  return <figure className="lab-loss-trace" data-lab-visual="loss"><figcaption><strong>Loss over recent steps</strong><span>Live optimization trace</span></figcaption><svg viewBox="0 0 560 180" role="img" aria-label={`Loss trace across ${values.length} recent optimization steps. Current loss ${label(values.at(-1) ?? 0)}.`}>{[low, low + span / 2, high].map((value, i) => <g key={i}><line x1={55} x2={520} y1={point(value, 0)[1]} y2={point(value, 0)[1]} stroke="var(--border)" /><text x={45} y={point(value, 0)[1] + 4} textAnchor="end">{label(value)}</text></g>)}<polyline points={points} fill="none" stroke="#4285f4" strokeWidth={3} strokeLinejoin="round" /><circle cx={last[0]} cy={last[1]} r={5} fill="#188038" /><text x={55} y={161}>Step {Math.max(0, step - values.length + 1)}</text><text x={520} y={161} textAnchor="end">Step {step}</text><text x={55} y={21}>Loss</text></svg></figure>
}
