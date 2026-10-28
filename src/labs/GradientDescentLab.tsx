import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RangeField, SelectField, Stat } from '../components/Field'
import { LossTrace } from '../components/LossTrace'
import { useLabMotion } from '../lib/useLabMotion'

type Surface = 'bowl' | 'rosenbrock' | 'saddle'
type Optimiser = 'sgd' | 'momentum' | 'adam'
const surfaces: Record<Surface, { f: (x: number, y: number) => number; grad: (x: number, y: number) => [number, number]; start: [number, number]; minima: [number, number][]; range: number; minimum: number }> = {
  bowl: { f: (x, y) => 0.5 * x * x + 2 * y * y, grad: (x, y) => [x, 4 * y], start: [-2.2, 1.6], minima: [[0, 0]], range: 2.5, minimum: 0 },
  rosenbrock: { f: (x, y) => (1 - x) ** 2 + 5 * (y - x * x) ** 2, grad: (x, y) => [-2 * (1 - x) - 20 * x * (y - x * x), 10 * (y - x * x)], start: [-1.5, 2], minima: [[1, 1]], range: 2.5, minimum: 0 },
  saddle: { f: (x, y) => x * x - y * y + 0.05 * y ** 4, grad: (x, y) => [2 * x, -2 * y + 0.2 * y ** 3], start: [1.8, 0.08], minima: [[0, Math.sqrt(10)], [0, -Math.sqrt(10)]], range: 4, minimum: -5 },
}
const labels = { bowl: 'Elongated bowl', rosenbrock: 'Curved valley', saddle: 'Saddle point' }
const emptyState = () => ({ v: [0, 0] as [number, number], m: [0, 0] as [number, number], s: [0, 0] as [number, number], t: 0 })

export function GradientDescentLab({ active = true }: { active?: boolean }) {
  const [surface, setSurface] = useState<Surface>('rosenbrock')
  const [opt, setOpt] = useState<Optimiser>('sgd')
  const [lr, setLr] = useState(0.02)
  const [beta, setBeta] = useState(0.9)
  const [running, setRunning] = useState(() => typeof matchMedia !== 'function' || !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [manualPlayback, setManualPlayback] = useState(false)
  const [diverged, setDiverged] = useState(false)
  const [latest, setLatest] = useState<{ pos: [number, number]; steps: number; losses: number[] }>({ pos: surfaces.rosenbrock.start, steps: 0, losses: [surfaces.rosenbrock.f(...surfaces.rosenbrock.start)] })
  const motionRef = useRef<HTMLDivElement>(null)
  const motionActive = useLabMotion(motionRef, running && active, manualPlayback)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const path = useRef<[number, number][]>([surfaces.rosenbrock.start])
  const state = useRef(emptyState())
  const S = surfaces[surface]

  function resetFor(surf: Surface) {
    path.current = [surfaces[surf].start]
    state.current = emptyState()
    setDiverged(false)
    setLatest({ pos: surfaces[surf].start, steps: 0, losses: [surfaces[surf].f(...surfaces[surf].start)] })
  }
  const reset = () => resetFor(surface)
  const changeSurface = (v: Surface) => { setSurface(v); resetFor(v) }
  const changeOpt = (v: Optimiser) => { setOpt(v); reset() }

  const contour = useMemo(() => {
    const size = 480
    const img = new Uint8ClampedArray(size * size * 4)
    const vals: number[] = []
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const x = ((i / size) * 2 - 1) * S.range
      const y = (1 - (j / size) * 2) * S.range
      // Shift by the true minimum so the saddle's negative losses remain visible.
      vals.push(Math.log1p(Math.max(0, S.f(x, y) - S.minimum)))
    }
    let max = 1
    for (const v of vals) if (v > max) max = v
    const stops = [[63, 85, 155], [164, 179, 224], [242, 221, 225], [224, 138, 125]]
    for (let k = 0; k < vals.length; k++) {
      const v = vals[k] / max
      const band = Math.floor(v * 18) % 2 === 0 ? 1 : 0.95
      const n = Math.min(2, Math.floor(v * 3))
      const mix = v * 3 - n
      for (let c = 0; c < 3; c++) img[k * 4 + c] = (stops[n][c] * (1 - mix) + stops[n + 1][c] * mix) * band
      img[k * 4 + 3] = 255
    }
    return { size, img }
  }, [S])

  const advance = useCallback(() => {
    const [x, y] = path.current[path.current.length - 1]
    const [gx, gy] = S.grad(x, y)
    const st = state.current
    let nx = x - lr * gx
    let ny = y - lr * gy
    if (opt === 'momentum') {
      st.v = [beta * st.v[0] - lr * gx, beta * st.v[1] - lr * gy]
      nx = x + st.v[0]; ny = y + st.v[1]
    } else if (opt === 'adam') {
      st.t++
      st.m = [beta * st.m[0] + (1 - beta) * gx, beta * st.m[1] + (1 - beta) * gy]
      st.s = [0.999 * st.s[0] + 0.001 * gx * gx, 0.999 * st.s[1] + 0.001 * gy * gy]
      const mh = st.m.map(v => v / (1 - beta ** st.t))
      const sh = st.s.map(v => v / (1 - 0.999 ** st.t))
      nx = x - lr * mh[0] / (Math.sqrt(sh[0]) + 1e-8)
      ny = y - lr * mh[1] / (Math.sqrt(sh[1]) + 1e-8)
    }
    if (!Number.isFinite(nx) || !Number.isFinite(ny) || Math.abs(nx) > 50 || Math.abs(ny) > 50) {
      setRunning(false); setDiverged(true); return
    }
    path.current.push([nx, ny])
    if (path.current.length > 600) path.current.shift()
    setLatest(l => ({ pos: [nx, ny], steps: l.steps + 1, losses: [...l.losses.slice(-99), S.f(nx, ny)] }))
  }, [S, opt, lr, beta])

  useEffect(() => {
    if (!motionActive || diverged) return
    const id = setInterval(advance, 80)
    return () => clearInterval(id)
  }, [motionActive, diverged, advance])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { size, img } = contour
    ctx.putImageData(new ImageData(img, size, size), 0, 0)
    const toPx = (x: number, y: number) => [((x / S.range + 1) / 2) * size, ((1 - y / S.range) / 2) * size]
    ctx.strokeStyle = '#ffffff40'; ctx.lineWidth = 1; ctx.setLineDash([4, 6])
    ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke(); ctx.setLineDash([])
    for (const minimum of S.minima) {
      const [px, py] = toPx(...minimum)
      ctx.fillStyle = '#ffce9d'; ctx.strokeStyle = '#344674'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(px, py - 9); ctx.lineTo(px + 9, py); ctx.lineTo(px, py + 9); ctx.lineTo(px - 9, py); ctx.closePath(); ctx.fill(); ctx.stroke()
    }
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'; ctx.beginPath()
    path.current.forEach(([x, y], i) => { const [px, py] = toPx(x, y); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py) })
    ctx.stroke()
    const [sx, sy] = toPx(...S.start)
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(sx - 5, sy - 5, 10, 10)
    const [px, py] = toPx(...latest.pos)
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#344674'; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  }, [latest, contour, S])

  const [cx, cy] = latest.pos
  const loss = S.f(cx, cy)
  const outside = Math.abs(cx) > S.range || Math.abs(cy) > S.range
  const status = diverged ? 'Stopped: steps grew too large' : motionActive ? 'Running' : 'Paused'
  return <div className="lab lab-stack gd-lab" ref={motionRef}>
    <div className="gd-intro"><div><p className="eyebrow">A model learns one step at a time</p><h3>Follow the path to a smaller error.</h3><p>The dot is a model’s current settings. Each step follows the slope toward lower loss — a smaller error on its training examples.</p></div><span className={`gd-status${motionActive ? ' is-running' : ''}`}>{status}</span></div>
    <div className="gd-workspace">
      <figure className="gd-surface">
        <figcaption><strong>{labels[surface]}</strong><span>Blue: lower loss · Coral: higher loss</span></figcaption>
        <div className="gd-plot-wrap"><div className="gd-y-label">Parameter y ↑</div><canvas ref={canvasRef} width={480} height={480} className="gd-canvas" role="img" aria-label={`Optimization path on the ${labels[surface]} loss surface. Current position x ${cx.toFixed(2)}, y ${cy.toFixed(2)}. Both axes range from minus ${S.range} to ${S.range}.`} /><div className="gd-axis"><span>−{S.range}</span><span>0</span><span>{S.range}</span></div><div className="gd-x-label">Parameter x →</div></div>
        <div className="gd-legend"><span><i className="gd-marker-start" />Start</span><span><i className="gd-marker-current" />Current settings</span><span><i className="gd-marker-target" />Minimum</span></div>
        <div className="gd-stats"><Stat label="Step" value={latest.steps} /><Stat label="Loss" value={loss.toExponential(2)} /><Stat label="Position (x, y)" value={`${cx.toFixed(2)}, ${cy.toFixed(2)}`} /></div>
      </figure>
      <div className="lab-controls gd-controls">
        <div><p className="eyebrow">Try it yourself</p><h4>Change one thing. Watch the path.</h4></div>
        <SelectField label="Surface" value={surface} onChange={changeSurface} options={[{ value: 'bowl', label: 'Elongated bowl — start here' }, { value: 'rosenbrock', label: 'Curved valley (Rosenbrock)' }, { value: 'saddle', label: 'Saddle point — two minima' }]} />
        <SelectField label="Optimiser" value={opt} onChange={changeOpt} options={[{ value: 'sgd', label: 'Gradient descent' }, { value: 'momentum', label: 'Momentum' }, { value: 'adam', label: 'Adam' }]} />
        <RangeField label="Learning rate" value={lr} min={0.001} max={0.2} step={0.001} onChange={setLr} display={v => v.toFixed(3)} />
        <p className="gd-control-hint">This controls the step size. Larger steps can move faster, but may overshoot.</p>
        {opt !== 'sgd' && <RangeField label="Momentum (β)" value={beta} min={0} max={0.99} step={0.01} onChange={setBeta} display={v => v.toFixed(2)} />}
        <div className="gd-actions"><button className="btn btn-primary" disabled={diverged} onClick={() => { setManualPlayback(true); setRunning(r => !r) }}>{running ? 'Pause' : 'Play'}</button><button className="btn btn-ghost" disabled={diverged} onClick={() => { setRunning(false); advance() }}>One step</button><button className="btn btn-ghost" onClick={reset}>Reset</button></div>
        {(diverged || outside) && <p className="gd-warning" role="status">{diverged ? 'The steps became unstable, so the animation stopped.' : 'The point moved beyond the visible area.'} Lower the learning rate, then reset.</p>}
        <div className="gd-tip"><strong>What to look for</strong><p>Does the path settle down or jump around? Pause and use <b>One step</b> to compare the loss before and after each move.</p><p>Changing the surface or optimiser starts a fresh path. Compare methods at the same step count.</p></div>
      </div>
      <LossTrace values={latest.losses} step={latest.steps} compact />
    </div>
  </div>
}
