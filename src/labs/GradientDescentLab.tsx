import { useEffect, useMemo, useRef, useState } from 'react'
import { RangeField, SelectField, Stat } from '../components/Field'
import { LossTrace } from '../components/LossTrace'
import { useLabMotion } from '../lib/useLabMotion'

type Surface = 'bowl' | 'rosenbrock' | 'saddle'
type Optimiser = 'sgd' | 'momentum' | 'adam'

const surfaces: Record<Surface, { f: (x: number, y: number) => number; grad: (x: number, y: number) => [number, number]; start: [number, number]; range: number }> = {
  bowl: {
    f: (x, y) => 0.5 * x * x + 2 * y * y,
    grad: (x, y) => [x, 4 * y],
    start: [-2.2, 1.6],
    range: 2.5,
  },
  rosenbrock: {
    f: (x, y) => (1 - x) ** 2 + 5 * (y - x * x) ** 2,
    grad: (x, y) => [-2 * (1 - x) - 20 * x * (y - x * x), 10 * (y - x * x)],
    start: [-1.5, 2],
    range: 2.5,
  },
  saddle: {
    f: (x, y) => x * x - y * y + 0.05 * y ** 4,
    grad: (x, y) => [2 * x, -2 * y + 0.2 * y ** 3],
    start: [1.8, 0.08],
    range: 2.5,
  },
}

export function GradientDescentLab({ active = true }: { active?: boolean }) {
  const [surface, setSurface] = useState<Surface>('rosenbrock')
  const [opt, setOpt] = useState<Optimiser>('sgd')
  const [lr, setLr] = useState(0.02)
  const [beta, setBeta] = useState(0.9)
  const [running, setRunning] = useState(true)
  const [tick, setTick] = useState(0)
  const [latest, setLatest] = useState<{ pos: [number, number]; steps: number; losses: number[] }>({ pos: surfaces.rosenbrock.start, steps: 0, losses: [surfaces.rosenbrock.f(...surfaces.rosenbrock.start)] })
  const motionRef = useRef<HTMLDivElement>(null)
  const motionActive = useLabMotion(motionRef, running && active)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const path = useRef<[number, number][]>([surfaces.rosenbrock.start])
  const state = useRef({ v: [0, 0] as [number, number], m: [0, 0] as [number, number], s: [0, 0] as [number, number], t: 0 })

  const S = surfaces[surface]

  const resetFor = (surf: Surface) => {
    path.current = [surfaces[surf].start]
    state.current = { v: [0, 0], m: [0, 0], s: [0, 0], t: 0 }
    setLatest({ pos: surfaces[surf].start, steps: 0, losses: [surfaces[surf].f(...surfaces[surf].start)] })
    setTick((t) => t + 1)
  }
  const reset = () => resetFor(surface)
  const changeSurface = (v: Surface) => { setSurface(v); resetFor(v) }
  const changeOpt = (v: Optimiser) => { setOpt(v); reset() }

  // Background contour image, computed once per surface.
  const contour = useMemo(() => {
    const size = 360
    const img = new Uint8ClampedArray(size * size * 4)
    const vals: number[] = []
    for (let j = 0; j < size; j++)
      for (let i = 0; i < size; i++) {
        const x = ((i / size) * 2 - 1) * S.range
        const y = (1 - (j / size) * 2) * S.range
        vals.push(Math.log1p(Math.max(0, S.f(x, y))))
      }
    let max = 0
    for (const v of vals) if (v > max) max = v
    if (max === 0) max = 1
    for (let k = 0; k < vals.length; k++) {
      const v = vals[k] / max
      const band = Math.floor(v * 14) % 2 === 0 ? 1 : 0.92
      img[k * 4] = (40 + 200 * v) * band
      img[k * 4 + 1] = (70 + 120 * (1 - v)) * band
      img[k * 4 + 2] = (160 - 60 * v) * band
      img[k * 4 + 3] = 255
    }
    return { size, img }
  }, [S])

  useEffect(() => {
    if (!motionActive) return
    const id = setInterval(() => {
      const [x, y] = path.current[path.current.length - 1]
      const [gx, gy] = S.grad(x, y)
      const st = state.current
      let nx = x
      let ny = y
      if (opt === 'sgd') {
        nx = x - lr * gx
        ny = y - lr * gy
      } else if (opt === 'momentum') {
        st.v = [beta * st.v[0] - lr * gx, beta * st.v[1] - lr * gy]
        nx = x + st.v[0]
        ny = y + st.v[1]
      } else {
        st.t++
        const b1 = beta
        const b2 = 0.999
        st.m = [b1 * st.m[0] + (1 - b1) * gx, b1 * st.m[1] + (1 - b1) * gy]
        st.s = [b2 * st.s[0] + (1 - b2) * gx * gx, b2 * st.s[1] + (1 - b2) * gy * gy]
        const mh = st.m.map((v) => v / (1 - b1 ** st.t))
        const sh = st.s.map((v) => v / (1 - b2 ** st.t))
        nx = x - (lr * 10 * mh[0]) / (Math.sqrt(sh[0]) + 1e-8)
        ny = y - (lr * 10 * mh[1]) / (Math.sqrt(sh[1]) + 1e-8)
      }
      if (!Number.isFinite(nx) || !Number.isFinite(ny) || Math.abs(nx) > 50 || Math.abs(ny) > 50) {
        setRunning(false)
        return
      }
      path.current.push([nx, ny])
      if (path.current.length > 600) path.current.shift()
      setLatest((l) => ({ pos: [nx, ny], steps: l.steps + 1, losses: [...l.losses.slice(-99), S.f(nx, ny)] }))
      setTick((t) => t + 1)
    }, 40)
    return () => clearInterval(id)
  }, [motionActive, S, opt, lr, beta])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { size, img } = contour
    ctx.putImageData(new ImageData(img, size, size), 0, 0)
    const toPx = (x: number, y: number) => [((x / S.range + 1) / 2) * size, ((1 - y / S.range) / 2) * size]
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    path.current.forEach(([x, y], i) => {
      const [px, py] = toPx(x, y)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    })
    ctx.stroke()
    const [lx, ly] = path.current[path.current.length - 1]
    const [px, py] = toPx(lx, ly)
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(px, py, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#1d1c19'
    ctx.stroke()
  }, [tick, contour, S])

  const [cx, cy] = latest.pos
  const loss = S.f(cx, cy)

  return (
    <div className="lab" ref={motionRef}>
      <div className="lab-controls">
        <SelectField
          label="Surface"
          value={surface}
          onChange={changeSurface}
          options={[
            { value: 'bowl', label: 'Elongated bowl (ill-conditioned)' },
            { value: 'rosenbrock', label: 'Rosenbrock valley' },
            { value: 'saddle', label: 'Saddle point' },
          ]}
        />
        <SelectField
          label="Optimiser"
          value={opt}
          onChange={changeOpt}
          options={[
            { value: 'sgd', label: 'Gradient descent' },
            { value: 'momentum', label: 'Momentum' },
            { value: 'adam', label: 'Adam' },
          ]}
        />
        <RangeField label="Learning rate" value={lr} min={0.001} max={0.2} step={0.001} onChange={setLr} display={(v) => v.toFixed(3)} />
        {opt !== 'sgd' && <RangeField label="β (momentum)" value={beta} min={0} max={0.99} step={0.01} onChange={setBeta} display={(v) => v.toFixed(2)} />}
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
            {running ? 'Pause' : 'Play'}
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            Reset
          </button>
        </div>
        <div className="note">
          The point shows the current parameters; the trail shows earlier values. Compare loss at the same step count.
          Try a larger learning rate on the Rosenbrock valley to see how updates can overshoot. The bowl is stable across this slider’s range with plain gradient descent.
        </div>
      </div>
      <div className="lab-results">
        <canvas ref={canvasRef} width={360} height={360} className="canvas" style={{ gridColumn: '1 / -1' }} role="img" aria-label={`Optimization path on the ${surface} loss surface`} />
        <LossTrace values={latest.losses} step={latest.steps} />
        <Stat label="Step" value={latest.steps} />
        <Stat label="Loss" value={loss.toExponential(2)} />
        <Stat label="Position" value={`${cx.toFixed(2)}, ${cy.toFixed(2)}`} />
      </div>
    </div>
  )
}
