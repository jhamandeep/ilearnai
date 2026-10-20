import { useEffect, useState } from 'react'

const stages = [
  { id: 'embed', label: 'Token + position embedding', detail: 'Each token id becomes a d_model vector; position information is added or rotated in.' },
  { id: 'ln1', label: 'LayerNorm', detail: 'Normalise each token vector so the next block sees a stable scale.' },
  { id: 'attn', label: 'Multi-head self-attention', detail: 'Every token mixes information from every earlier token. This is the only place tokens talk to each other.' },
  { id: 'res1', label: 'Residual add', detail: 'Add the attention output back onto the stream so gradients have a direct path.' },
  { id: 'ln2', label: 'LayerNorm', detail: 'Normalise again before the feed-forward block.' },
  { id: 'mlp', label: 'Feed-forward (MLP)', detail: 'A per-token two-layer network, usually 4× wider than d_model. Most parameters live here.' },
  { id: 'res2', label: 'Residual add', detail: 'Add the MLP output to the residual stream. Repeat the block L times.' },
  { id: 'head', label: 'Unembed + softmax', detail: 'Project the final vector onto the vocabulary and sample the next token.' },
]

export function TransformerFlowLab() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setStep((s) => (s + 1) % stages.length), 1400)
    return () => clearInterval(id)
  }, [playing])

  const H = 60
  const top = 30
  const x = 220
  const w = 300
  const y = (i: number) => top + i * (H + 18)
  const totalH = y(stages.length - 1) + H + 30

  return (
    <div className="lab">
      <div className="lab-controls">
        <h3>{stages[step].label}</h3>
        <p className="meta">{stages[step].detail}</p>
        <div className="hero-actions">
          <button className="btn btn-ghost" onClick={() => { setPlaying(false); setStep((s) => (s - 1 + stages.length) % stages.length) }}>
            ← Back
          </button>
          <button className="btn btn-primary" onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button className="btn btn-ghost" onClick={() => { setPlaying(false); setStep((s) => (s + 1) % stages.length) }}>
            Next →
          </button>
        </div>
        <div className="note">
          The residual stream on the right runs straight from embedding to output. Every block only reads from it and adds to it, which is
          why depth scales: nothing has to pass "through" a layer.
        </div>
      </div>
      <div className="lab-results">
        <svg viewBox={`0 0 ${x + w + 140} ${totalH}`} className="flow" style={{ gridColumn: '1 / -1' }} role="img" aria-label="Transformer block data flow">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--text-dim)" />
            </marker>
          </defs>
          {/* residual stream */}
          <line x1={x + w + 80} y1={y(0) + H / 2} x2={x + w + 80} y2={y(stages.length - 1) + H / 2} stroke="var(--border)" strokeWidth={6} strokeLinecap="round" />
          <text x={x + w + 80} y={y(0) - 10} textAnchor="middle" fill="var(--text-dim)" fontSize="12">residual stream</text>
          {stages.map((s, i) => {
            const active = i === step
            const isRes = s.id.startsWith('res')
            return (
              <g key={s.id} onClick={() => { setPlaying(false); setStep(i) }} style={{ cursor: 'pointer' }}>
                {i > 0 && <line x1={x + w / 2} y1={y(i - 1) + H} x2={x + w / 2} y2={y(i) - 2} stroke="var(--text-dim)" strokeWidth={1.5} markerEnd="url(#arrow)" />}
                <rect x={x} y={y(i)} width={w} height={H} rx={10} fill={active ? 'var(--primary)' : 'var(--surface)'} stroke={active ? 'var(--primary)' : 'var(--border)'} strokeWidth={1.5} className={active ? 'flow-active' : ''} />
                <text x={x + w / 2} y={y(i) + H / 2 + 5} textAnchor="middle" fontSize="15" fontWeight={600} fill={active ? 'var(--primary-text)' : 'var(--text)'}>
                  {s.label}
                </text>
                {isRes && (
                  <path d={`M ${x + w + 80} ${y(i) + H / 2} C ${x + w + 40} ${y(i) + H / 2}, ${x + w + 40} ${y(i) + H / 2}, ${x + w} ${y(i) + H / 2}`} fill="none" stroke={active ? 'var(--primary)' : 'var(--text-dim)'} strokeWidth={2} strokeDasharray="4 3" />
                )}
                {(s.id === 'attn' || s.id === 'mlp') && (
                  <text x={x - 12} y={y(i) + H / 2 + 5} textAnchor="end" fontSize="12" fill="var(--text-dim)">
                    {s.id === 'attn' ? 'tokens mix here' : 'per token, no mixing'}
                  </text>
                )}
              </g>
            )
          })}
          {/* travelling packet */}
          <circle r={7} fill="var(--accent-inference)" stroke="#fff" strokeWidth={2}>
            <animateMotion dur={`${stages.length * 1.4}s`} repeatCount="indefinite" path={`M ${x + w / 2} ${y(0) + H / 2} ${stages.map((_, i) => `L ${x + w / 2} ${y(i) + H / 2}`).join(' ')}`} />
          </circle>
        </svg>
      </div>
    </div>
  )
}
