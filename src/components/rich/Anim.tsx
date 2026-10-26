import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { parseAnim, colorOf, defaultDur, holdFor, STAGE_W, STAGE_H, type Obj, type Scene } from './anim-parse'
import { glyphFor, fmt, niceTicks } from './viz'

gsap.registerPlugin(MotionPathPlugin)

const BG = '#13172a'
const GRID = '#262c48'
const AXIS = '#7d849c'
const TEXT = '#ECECEC'

// ---------- geometry ----------
type XY = [number, number]
function axesOf(scene: Scene, id: string | undefined): Obj | undefined {
  return id ? scene.objects.find((o) => o.id === id && o.kind === 'axes') : undefined
}
function toStage(scene: Scene, o: Obj | undefined, p: XY): XY {
  const ax = axesOf(scene, o?.on)
  if (!ax) return p
  return axToStage(ax, p)
}
function axToStage(ax: Obj, p: XY): XY {
  const [x0, x1] = ax.xr!
  const [y0, y1] = ax.yr!
  return [ax.x + ((p[0] - x0) / (x1 - x0 || 1)) * ax.w, ax.y + ax.h - ((p[1] - y0) / (y1 - y0 || 1)) * ax.h]
}
function halfSize(o: Obj): XY {
  switch (o.kind) {
    case 'box': case 'rect': return [o.w / 2, o.h / 2]
    case 'dot': return [o.w / 2, o.w / 2]
    case 'text': return [Math.max(20, (o.label.length * (o.size ?? 20) * 0.28)), (o.size ?? 20) * 0.7]
    case 'num': return [Math.max(24, (String(o.value ?? 0).length + (o.prefix?.length ?? 0) + (o.suffix?.length ?? 0)) * (o.size ?? 30) * 0.3), (o.size ?? 30) * 0.7]
    case 'axes': return [o.w / 2, o.h / 2]
    default: return [16, 16]
  }
}
function centerOf(scene: Scene, o: Obj, pos: XY): XY {
  if (o.kind === 'axes') return [pos[0] + o.w / 2, pos[1] + o.h / 2]
  if (o.kind === 'vector' || o.kind === 'line') { const a = toStage(scene, o, o.from!); const b = toStage(scene, o, o.to!); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] }
  return pos
}
interface Obstacle { x: number; y: number; hw: number; hh: number }
function connector(a: Obj, ac: XY, b: Obj, bc: XY, off = 0, obstacles: Obstacle[] = []) {
  const [ahw, ahh] = halfSize(a)
  const [bhw, bhh] = halfSize(b)
  const dx = bc[0] - ac[0]
  const dy = bc[1] - ac[1]
  const horizontal = Math.abs(dx) >= Math.abs(dy)
  let p1: XY, p2: XY, d: string, angle: number, lx: number, ly: number, anchor: 'start' | 'middle' | 'end'
  if (horizontal) {
    const s = Math.sign(dx) || 1
    p1 = [ac[0] + s * ahw, ac[1] + s * off]
    p2 = [bc[0] - s * bhw, bc[1] + s * off]
    const mx = (p1[0] + p2[0]) / 2
    d = Math.abs(dy) < 2 ? `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}` : `M ${p1[0]} ${p1[1]} C ${mx} ${p1[1]}, ${mx} ${p2[1]}, ${p2[0]} ${p2[1]}`
    angle = s > 0 ? 0 : 180
    lx = mx; ly = (p1[1] + p2[1]) / 2 + (off && s > 0 ? 17 : -12); anchor = 'middle'
  } else {
    const s = Math.sign(dy) || 1
    p1 = [ac[0] - s * off, ac[1] + s * ahh]
    p2 = [bc[0] - s * off, bc[1] - s * bhh]
    const my = (p1[1] + p2[1]) / 2
    d = Math.abs(dx) < 2 ? `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}` : `M ${p1[0]} ${p1[1]} C ${p1[0]} ${my}, ${p2[0]} ${my}, ${p2[0]} ${p2[1]}`
    angle = s > 0 ? 90 : -90
    const left = off !== 0 && s > 0
    lx = (p1[0] + p2[0]) / 2 + (left ? -12 : 12); ly = my; anchor = left ? 'end' : 'start'
  }
  // if a box sits in the way, bow the connector around it
  const lo = (i: number) => Math.min(p1[i], p2[i])
  const hi = (i: number) => Math.max(p1[i], p2[i])
  const hit = obstacles.find((o) => o.x + o.hw > lo(0) + 4 && o.x - o.hw < hi(0) - 4 && o.y + o.hh > lo(1) + 4 && o.y - o.hh < hi(1) - 4)
  if (hit) {
    const mx = (p1[0] + p2[0]) / 2
    const my = (p1[1] + p2[1]) / 2
    if (horizontal) {
      const up = hit.y >= my // obstacle below or level: go above
      const reach = hit.hh + 40
      const cy = my + (up ? -1 : 1) * reach * 2
      d = `M ${p1[0]} ${p1[1]} Q ${mx} ${cy}, ${p2[0]} ${p2[1]}`
      angle = (Math.atan2(p2[1] - cy, p2[0] - mx) * 180) / Math.PI
      ly = my + (up ? -1 : 1) * reach - (up ? 10 : -18)
    } else {
      const leftSide = hit.x >= mx
      const reach = hit.hw + 40
      const cx = mx + (leftSide ? -1 : 1) * reach * 2
      d = `M ${p1[0]} ${p1[1]} Q ${cx} ${my}, ${p2[0]} ${p2[1]}`
      angle = (Math.atan2(p2[1] - my, p2[0] - cx) * 180) / Math.PI
      lx = mx + (leftSide ? -1 : 1) * reach + (leftSide ? -8 : 8); anchor = leftSide ? 'end' : 'start'
    }
  }
  return { d, p2, angle, lx, ly, anchor }
}
function curvePoints(scene: Scene, c: Obj): XY[] {
  const ax = axesOf(scene, c.on)!
  const [x0, x1] = ax.xr!
  const [y0, y1] = ax.yr!
  const span = y1 - y0
  const pts: XY[] = []
  for (let i = 0; i <= 200; i++) {
    const x = x0 + ((x1 - x0) * i) / 200
    const y = c.f!(x)
    if (!Number.isFinite(y) || y < y0 - span || y > y1 + span) { pts.push([NaN, NaN]); continue }
    pts.push(axToStage(ax, [x, y]))
  }
  return pts
}
function pathFrom(pts: XY[]): string {
  let d = ''
  let pen = false
  for (const p of pts) {
    if (!Number.isFinite(p[0])) { pen = false; continue }
    d += (pen ? ' L ' : ' M ') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)
    pen = true
  }
  return d
}
function slopeAt(f: (x: number) => number, x: number, h: number) { return (f(x + h) - f(x - h)) / (2 * h) }
function tangentGeom(scene: Scene, t: Obj, x0: number) {
  const c = scene.objects.find((o) => o.id === t.curve)!
  const ax = axesOf(scene, c.on)!
  const h = (ax.xr![1] - ax.xr![0]) / 2000
  const m = slopeAt(c.f!, x0, h)
  const y0 = c.f!(x0)
  const L = t.len ?? 1.5
  const a = axToStage(ax, [x0 - L, y0 - m * L])
  const b = axToStage(ax, [x0 + L, y0 + m * L])
  const p = axToStage(ax, [x0, y0])
  return { a, b, p, m }
}

const esc = (id: string) => id.replace(/["\\]/g, '\\$&')

// ---------- component ----------
export function Anim({ src }: { src: string }) {
  const scene = useMemo(() => parseAnim(src), [src])
  const fig = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const scrub = useRef<HTMLInputElement>(null)
  const clock = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const starts = useRef<number[]>([])
  const ends = useRef<number[]>([])
  const userPaused = useRef(false)
  const reduced = useRef(false)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const [speed, setSpeed] = useState(1)

  // count how many label changes each object gets, so the extra text nodes exist for scrubbing
  const labelVariants = useMemo(() => {
    const m = new Map<string, string[]>()
    for (const s of scene.steps) for (const a of s.actions) if (a.op === 'label') m.set(a.ids[0], [...(m.get(a.ids[0]) ?? []), a.text ?? ''])
    return m
  }, [scene])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || scene.errors.length) return
    reduced.current = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    const q = (id: string) => svg.querySelector(`[data-id="${esc(id)}"]`) as SVGGraphicsElement | null
    const qs = (ids: string[]) => ids.map(q).filter((e): e is SVGGraphicsElement => !!e)
    const objs = new Map(scene.objects.map((o) => [o.id, o]))
    const pos = new Map<string, XY>() // current stage position of movable objects
    for (const o of scene.objects) pos.set(o.id, o.kind === 'axes' ? [o.x, o.y] : toStage(scene, o, [o.x, o.y]))
    const meas = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    meas.setAttribute('fill', 'none')
    meas.setAttribute('stroke', 'none')
    meas.setAttribute('visibility', 'hidden')
    svg.appendChild(meas)
    const lengthOf = (d: string) => { meas.setAttribute('d', d); return meas.getTotalLength() }
    const labelIndex = new Map<string, number>()
    const drawn = new Set<string>()
    const numVal = new Map<string, number>()
    const tanAt = new Map<string, number>()
    const vecTo = new Map<string, XY>()
    const cam = svg.querySelector('[data-camera]') as SVGGElement

    // reset everything to the declared initial state (the effect can run twice in dev)
    gsap.set(cam, { x: 0, y: 0, scale: 1, transformOrigin: '0 0' })
    for (const o of scene.objects) {
      const el = q(o.id)
      if (!el) continue
      const p = pos.get(o.id)!
      if (['box', 'rect', 'text', 'num', 'dot', 'axes'].includes(o.kind)) gsap.set(el, { x: p[0], y: p[1], scale: 1, opacity: 0 })
      else gsap.set(el, { opacity: 0 })
      if (o.kind === 'curve') gsap.set(el, { strokeDashoffset: 1 })
    }
    for (const el of svg.querySelectorAll('[data-packet], [data-head], [data-variant]')) gsap.set(el, { opacity: 0 })

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } })
    tlRef.current = tl
    const S: number[] = []
    const E: number[] = []
    scene.steps.forEach((st, i) => {
      tl.addLabel('s' + i)
      S.push(tl.duration())
      for (const a of st.actions) {
        const at = a.parallel ? '<' : '>'
        const dur = a.dur ?? defaultDur(a.op)
        switch (a.op) {
          case 'show': case 'draw': {
            const strokes = qs(a.ids.filter((id) => ['curve', 'vector', 'line', 'tangent', 'arrow'].includes(objs.get(id)?.kind ?? '')))
            const solids = qs(a.ids.filter((id) => !['curve', 'vector', 'line', 'tangent', 'arrow'].includes(objs.get(id)?.kind ?? '')))
            let first = true
            if (solids.length) {
              tl.fromTo(solids, { opacity: 0, scale: 0.86, transformOrigin: 'center' }, { opacity: 1, scale: 1, duration: dur, ease: 'back.out(1.7)', stagger: 0.14, immediateRender: false }, at)
              first = false
            }
            for (const el of strokes) {
              const o = objs.get(el.getAttribute('data-id')!)!
              const p = first ? at : '<+0.1'
              first = false
              if (o.kind === 'curve') {
                tl.set(el, { opacity: 1 }, p)
                tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, ease: 'power1.inOut', immediateRender: false }, '<')
                const lab = q(o.id + '#label')
                if (lab) tl.fromTo(lab, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, '>-0.2')
              } else if (o.kind === 'vector' || o.kind === 'line') {
                const from = toStage(scene, o, o.from!)
                const to = toStage(scene, o, o.to!)
                const line = el.querySelector('line')!
                const head = el.querySelector('[data-head]')
                const prox = { t: 0 }
                tl.set(el, { opacity: 1 }, p)
                tl.fromTo(prox, { t: 0 }, { t: 1, duration: dur, ease: 'power2.out', immediateRender: false, onUpdate: () => {
                  const x = from[0] + (to[0] - from[0]) * prox.t
                  const y = from[1] + (to[1] - from[1]) * prox.t
                  line.setAttribute('x2', String(x)); line.setAttribute('y2', String(y))
                  if (head) head.setAttribute('transform', `translate(${x},${y}) rotate(${(Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI})`)
                } }, '<')
                if (head) tl.fromTo(head, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, '<+0.15')
              } else if (o.kind === 'arrow') {
                drawArrow(o, dur, p, false)
              } else {
                tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur, immediateRender: false }, p)
              }
            }
            break
          }
          case 'hide': {
            const els = qs(a.ids)
            if (els.length) tl.to(els, { opacity: 0, duration: dur, stagger: 0.06 }, at)
            break
          }
          case 'arrow': case 'send': {
            const o = objs.get(a.ids[0])
            if (o) drawArrow(o, dur, at, a.op === 'send')
            break
          }
          case 'move': {
            const o = objs.get(a.ids[0])
            const el = q(a.ids[0])
            if (!o || !el) break
            const p = toStage(scene, o, a.to!)
            tl.to(el, { x: p[0], y: p[1], duration: dur }, at)
            pos.set(o.id, p)
            break
          }
          case 'walk': {
            const o = objs.get(a.ids[0])
            const c = objs.get(a.along!)
            const el = q(a.ids[0])
            if (!o || !c || !el || !c.f) break
            const ax = axesOf(scene, c.on)!
            const prox = { x: a.from! }
            const place = (x: number) => { const p = axToStage(ax, [x, c.f!(x)]); gsap.set(el, { x: p[0], y: p[1] }) }
            const p0 = axToStage(ax, [a.from!, c.f(a.from!)])
            tl.set(el, { x: p0[0], y: p0[1] }, at)
            tl.fromTo(prox, { x: a.from! }, { x: a.until!, duration: dur, ease: 'power1.inOut', immediateRender: false, onUpdate: () => place(prox.x) }, '<')
            pos.set(o.id, axToStage(ax, [a.until!, c.f(a.until!)]))
            break
          }
          case 'vector': {
            const o = objs.get(a.ids[0])
            const el = q(a.ids[0])
            if (!o || !el) break
            const from = toStage(scene, o, o.from!)
            const start = toStage(scene, o, vecTo.get(o.id) ?? o.to!)
            const end = toStage(scene, o, a.to!)
            const line = el.querySelector('line')!
            const head = el.querySelector('[data-head]')
            const labs = el.querySelectorAll('text')
            const prox = { t: 0 }
            tl.fromTo(prox, { t: 0 }, { t: 1, duration: dur, immediateRender: false, onUpdate: () => {
              const x = start[0] + (end[0] - start[0]) * prox.t
              const y = start[1] + (end[1] - start[1]) * prox.t
              line.setAttribute('x2', String(x)); line.setAttribute('y2', String(y))
              const ang = (Math.atan2(y - from[1], x - from[0]) * 180) / Math.PI
              if (head) head.setAttribute('transform', `translate(${x},${y}) rotate(${ang})`)
              for (const lab of labs) { lab.setAttribute('x', String(x + 10)); lab.setAttribute('y', String(y - 10)) }
            } }, at)
            vecTo.set(o.id, a.to!)
            break
          }
          case 'tangent': {
            const o = objs.get(a.ids[0])
            const el = q(a.ids[0])
            if (!o || !el || o.kind !== 'tangent') break
            const line = el.querySelector('line')!
            const dot = el.querySelector('circle')
            const lab = el.querySelector('text')
            const x0 = tanAt.get(o.id) ?? o.at!
            const prox = { x: x0 }
            tl.fromTo(prox, { x: x0 }, { x: a.value!, duration: dur, immediateRender: false, onUpdate: () => {
              const g = tangentGeom(scene, o, prox.x)
              line.setAttribute('x1', String(g.a[0])); line.setAttribute('y1', String(g.a[1]))
              line.setAttribute('x2', String(g.b[0])); line.setAttribute('y2', String(g.b[1]))
              if (dot) { dot.setAttribute('cx', String(g.p[0])); dot.setAttribute('cy', String(g.p[1])) }
              if (lab) { lab.setAttribute('x', String(g.p[0] + 12)); lab.setAttribute('y', String(g.p[1] - 12)); if (o.label === 'slope') lab.textContent = `slope = ${fmt(g.m, 2)}` }
            } }, at)
            tanAt.set(o.id, a.value!)
            break
          }
          case 'count': {
            const o = objs.get(a.ids[0])
            const el = q(a.ids[0])
            if (!o || !el) break
            const text = el.querySelector('text') ?? el
            const prox = { v: numVal.get(o.id) ?? o.value ?? 0 }
            const digits = o.digits ?? 0
            tl.to(prox, { v: a.value!, duration: dur, ease: 'power1.out', onUpdate: () => { text.textContent = `${o.prefix ?? ''}${digits ? prox.v.toFixed(digits) : Math.round(prox.v).toLocaleString()}${o.suffix ?? ''}` } }, at)
            numVal.set(o.id, a.value!)
            break
          }
          case 'label': {
            const id = a.ids[0]
            const k = labelIndex.get(id) ?? 0
            labelIndex.set(id, k + 1)
            const prev = k === 0 ? q(id + '#label') : q(`${id}#label#${k - 1}`)
            const next = q(`${id}#label#${k}`)
            if (prev) tl.to(prev, { opacity: 0, duration: dur / 2 }, at)
            if (next) tl.fromTo(next, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: dur / 2, immediateRender: false }, prev ? '>' : at)
            break
          }
          case 'color': case 'highlight': case 'restore': {
            for (const [i, id] of a.ids.entries()) {
              const o = objs.get(id)
              const el = q(id)
              if (!o || !el) continue
              const c = a.op === 'highlight' ? colorOf('yellow', '') : a.op === 'restore' ? baseColor(o) : colorOf(a.color, baseColor(o))
              const p = i === 0 ? at : '<'
              if (o.kind === 'text') tl.to(el.querySelectorAll('text'), { fill: c, duration: dur }, p)
              else if (o.kind === 'num' || o.kind === 'dot') tl.to(el.querySelectorAll('[data-shape]'), { fill: c, duration: dur }, p)
              else if (o.kind === 'box' || o.kind === 'rect') tl.to(el.querySelectorAll('[data-shape]'), { stroke: c, fill: fillFor(c), strokeWidth: a.op === 'highlight' ? 3.5 : 2, duration: dur }, p)
              else tl.to(el.querySelectorAll('line, path, polygon, circle'), { stroke: c, fill: (_i: number, t: Element) => (t.tagName === 'polygon' || t.tagName === 'circle' ? c : 'none'), duration: dur }, p)
              if (a.op === 'restore') tl.to(el, { opacity: 1, duration: dur }, '<')
            }
            break
          }
          case 'dim': {
            const els = qs(a.ids)
            if (els.length) tl.to(els, { opacity: 0.28, duration: dur }, at)
            break
          }
          case 'pulse': {
            const els = qs(a.ids)
            if (els.length) tl.to(els, { scale: 1.12, transformOrigin: 'center', duration: dur / 2, yoyo: true, repeat: 1, ease: 'power1.inOut', stagger: 0.1 }, at)
            break
          }
          case 'wait': {
            tl.to({}, { duration: dur }, at)
            break
          }
          case 'zoom': {
            const s = a.value ?? 1
            const c = a.to ?? [STAGE_W / 2, STAGE_H / 2]
            tl.to(cam, { x: (1 - s) * c[0], y: (1 - s) * c[1], scale: s, transformOrigin: '0 0', duration: dur }, at)
            break
          }
        }
      }
      E.push(tl.duration())
      tl.to({}, { duration: st.hold ?? holdFor(st.text) })
    })
    starts.current = S
    ends.current = E

    function drawArrow(o: Obj, dur: number, at: string, packetOnly: boolean) {
      const el = q(o.id)
      const A = objs.get(o.a!)
      const B = objs.get(o.b!)
      if (!el || !A || !B) return
      const twoWay = scene.objects.some((x) => x.kind === 'arrow' && x.a === o.b && x.b === o.a)
      const obstacles: Obstacle[] = scene.objects.filter((x) => (x.kind === 'box' || x.kind === 'rect') && x.id !== A.id && x.id !== B.id).map((x) => { const c = centerOf(scene, x, pos.get(x.id)!); return { x: c[0], y: c[1], hw: x.w / 2, hh: x.h / 2 } })
      const g = connector(A, centerOf(scene, A, pos.get(A.id)!), B, centerOf(scene, B, pos.get(B.id)!), twoWay ? 11 : 0, obstacles)
      const path = el.querySelector('path')!
      const head = el.querySelector('[data-head]')!
      const lab = el.querySelector('text')
      const packet = svg!.querySelector(`[data-packet="${esc(o.id)}"]`)
      const len = lengthOf(g.d)
      if (!packetOnly || !drawn.has(o.id)) {
        tl.set(el, { opacity: 1 }, at)
        tl.set(path, { attr: { d: g.d }, strokeDasharray: len, strokeDashoffset: len }, '<')
        tl.set(head, { attr: { transform: `translate(${g.p2[0]},${g.p2[1]}) rotate(${g.angle})` }, opacity: 0 }, '<')
        if (lab) tl.set(lab, { attr: { x: g.lx, y: g.ly, 'text-anchor': g.anchor }, opacity: 0 }, '<')
        tl.to(path, { strokeDashoffset: 0, duration: packetOnly ? 0.3 : dur * 0.55, ease: 'power2.inOut' }, '<')
        tl.to(head, { opacity: 1, duration: 0.15 }, '>-0.05')
        if (lab) tl.to(lab, { opacity: 1, duration: 0.3 }, '<')
        drawn.add(o.id)
      }
      if (packet) {
        tl.set(packet, { opacity: 1 }, packetOnly ? at : '>')
        tl.to(packet, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: packetOnly ? dur : dur * 0.45, ease: 'power1.inOut' }, '<')
        tl.to(packet, { opacity: 0, duration: 0.15 }, '>')
        const target = q(B.id)
        if (target && ['box', 'rect', 'dot', 'text', 'num'].includes(B.kind)) tl.to(target, { scale: 1.08, transformOrigin: 'center', duration: 0.18, yoyo: true, repeat: 1 }, '<-0.1')
      }
    }

    const ui = () => {
      const t = tl.time()
      if (scrub.current) { scrub.current.max = String(tl.duration()); scrub.current.value = String(t) }
      if (clock.current) clock.current.textContent = `${t.toFixed(1)}s / ${tl.duration().toFixed(0)}s`
      let i = 0
      for (let k = 0; k < S.length; k++) if (S[k] <= t + 0.001) i = k
      setStep((s) => (s === i ? s : i))
    }
    tl.eventCallback('onUpdate', ui)
    tl.eventCallback('onComplete', () => { setPlaying(false); setDone(true) })
    tl.eventCallback('onStart', () => setDone(false))
    ui()

    if (reduced.current) { tl.seek(E[0] ?? 0); ui() }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          if (!reduced.current && !userPaused.current && tl.progress() < 1) { tl.play(); setPlaying(true) }
        } else if (tl.isActive()) { tl.pause(); setPlaying(false) }
      }
    }, { threshold: [0, 0.35, 0.6] })
    const figEl = fig.current
    if (figEl) io.observe(figEl)

    const onSeek = (e: Event) => { const t = (e as CustomEvent<number>).detail; tl.pause(); userPaused.current = true; setPlaying(false); tl.time(Math.max(0, Math.min(tl.duration(), t))); ui() }
    figEl?.addEventListener('animseek', onSeek)
    return () => {
      io.disconnect()
      figEl?.removeEventListener('animseek', onSeek)
      tl.kill()
      meas.remove()
    }
  }, [scene])

  useEffect(() => { tlRef.current?.timeScale(speed) }, [speed])

  const play = () => {
    const tl = tlRef.current
    if (!tl) return
    if (tl.progress() >= 1) tl.restart()
    else tl.play()
    userPaused.current = false
    setPlaying(true); setDone(false)
  }
  const pause = () => { tlRef.current?.pause(); userPaused.current = true; setPlaying(false) }
  const goto = (i: number, andPlay: boolean) => {
    const tl = tlRef.current
    if (!tl) return
    const k = Math.max(0, Math.min(scene.steps.length - 1, i))
    if (reduced.current || !andPlay) { tl.pause(); tl.time(ends.current[k] ?? 0); setPlaying(false); userPaused.current = true }
    else { tl.time(starts.current[k] ?? 0); tl.play(); setPlaying(true); userPaused.current = false }
    setDone(false)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); if (playing) pause(); else play() }
    if (e.key === 'ArrowRight') { e.preventDefault(); goto(step + 1, !reduced.current) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goto(step - 1, !reduced.current) }
  }

  if (scene.errors.length) {
    return (
      <figure className="rich rich-anim rich-error">
        <figcaption><span className="rich-kind">Animation</span>{scene.title ?? 'Scene'}</figcaption>
        <ul className="rich-errors">{scene.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
      </figure>
    )
  }

  const cur = scene.steps[step]
  return (
    <figure className="rich rich-anim" ref={fig} tabIndex={0} onKeyDown={onKey} aria-label={scene.title ?? 'Animation'}>
      {scene.title && <figcaption><span className="rich-kind">Animation</span>{scene.title}<span className="rich-unit">{scene.steps.length} scenes</span></figcaption>}
      <div className="an-stage">
        <svg ref={svgRef} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} role="img" aria-label={scene.title ?? 'Animation'} className="an-svg">
          <defs>
            <filter id="an-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <radialGradient id="an-vignette" cx="50%" cy="45%" r="75%"><stop offset="0" stopColor="#1a1f3a" /><stop offset="1" stopColor={BG} /></radialGradient>
            {scene.objects.filter((o) => o.kind === 'axes').map((ax) => (
              <clipPath key={ax.id} id={`an-clip-${ax.id}`}><rect x={-4} y={-4} width={ax.w + 8} height={ax.h + 8} /></clipPath>
            ))}
            {scene.objects.filter((o) => o.kind === 'axes').map((ax) => (
              <clipPath key={'s' + ax.id} id={`an-clip-stage-${ax.id}`}><rect x={ax.x - 6} y={ax.y - 6} width={ax.w + 12} height={ax.h + 12} /></clipPath>
            ))}
          </defs>
          <rect width={STAGE_W} height={STAGE_H} fill="url(#an-vignette)" />
          <g data-camera="1">
            {scene.objects.map((o) => <SceneObject key={o.id} o={o} scene={scene} variants={labelVariants.get(o.id) ?? []} />)}
            {scene.objects.filter((o) => o.kind === 'arrow').map((o) => (
              <circle key={'p' + o.id} data-packet={o.id} r={7} fill={colorOf(o.color, PALETTE_YELLOW)} stroke={BG} strokeWidth={2} filter="url(#an-glow)" style={{ opacity: 0 }} />
            ))}
          </g>
        </svg>
      </div>
      <div className="an-caption" aria-live="polite">
        <span className="an-step-no">{step + 1}</span>
        <p>{cur?.text}</p>
      </div>
      <div className="rich-bar an-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => goto(step - 1, !reduced.current)} aria-label="Previous scene" disabled={step === 0}>←</button>
        <button className="btn btn-primary btn-sm an-play" onClick={() => (playing ? pause() : play())}>{playing ? 'Pause' : done ? 'Replay' : 'Play'}</button>
        <button className="btn btn-ghost btn-sm" onClick={() => goto(step + 1, !reduced.current)} aria-label="Next scene" disabled={step >= scene.steps.length - 1}>→</button>
        <input ref={scrub} type="range" className="rich-scrub" min={0} max={tlRef.current?.duration() ?? 1} step={0.02} defaultValue={0} aria-label="Scrub"
          onPointerDown={() => { tlRef.current?.pause(); userPaused.current = true; setPlaying(false) }}
          onInput={(e) => { const tl = tlRef.current; if (!tl) return; tl.time(parseFloat((e.target as HTMLInputElement).value)) }} />
        <span className="an-clock" ref={clock} />
        <button className="btn btn-ghost btn-sm" onClick={() => setSpeed(speed === 1 ? 0.5 : speed === 0.5 ? 1.5 : 1)} aria-label="Speed">{speed}×</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { const f = fig.current; if (!f) return; if (document.fullscreenElement) document.exitFullscreen(); else f.requestFullscreen?.() }} aria-label="Full screen" title="Full screen">⛶</button>
        <span className="rich-dots" aria-hidden="true">{scene.steps.map((_, i) => <button key={i} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => goto(i, !reduced.current)} aria-label={`Scene ${i + 1}`} />)}</span>
      </div>
    </figure>
  )
}

const PALETTE_YELLOW = '#F5D33D'
function baseColor(o: Obj): string {
  const d = o.kind === 'dot' || o.kind === 'vector' || o.kind === 'num' ? 'yellow' : o.kind === 'curve' ? 'blue' : o.kind === 'text' ? 'white' : o.kind === 'tangent' ? 'orange' : o.kind === 'arrow' ? 'grey' : 'blue'
  return colorOf(o.color, colorOf(d, '#58C4DD'))
}
function fillFor(stroke: string) { return stroke + '22' }

function Lines({ text, size, anchor, x = 0, y = 0, cls, fill }: { text: string; size: number; anchor: 'start' | 'middle' | 'end'; x?: number; y?: number; cls?: string; fill?: string }) {
  const parts = text.split('|').map((s) => s.trim())
  const lh = size * 1.25
  const y0 = y - ((parts.length - 1) * lh) / 2
  return (
    <text x={x} y={y0} textAnchor={anchor} dominantBaseline="middle" fontSize={size} className={cls} fill={fill}>
      {parts.map((p, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : lh}>{p}</tspan>)}
    </text>
  )
}

function SceneObject({ o, scene, variants }: { o: Obj; scene: Scene; variants: string[] }) {
  const color = baseColor(o)
  const p: XY = o.kind === 'axes' ? [o.x, o.y] : toStage(scene, o, [o.x, o.y])
  const tf = `translate(${p[0]},${p[1]})`
  const hidden = { opacity: 0 } as const
  switch (o.kind) {
    case 'box': {
      const hasIcon = o.icon !== 'none'
      const textW = o.label.length * (o.size ?? 17) * 0.56
      const total = (hasIcon ? 34 : 0) + textW
      const start = -total / 2
      return (
        <g data-id={o.id} transform={tf} style={hidden} className="an-obj">
          <rect data-shape="1" x={-o.w / 2} y={-o.h / 2} width={o.w} height={o.h} rx={12} fill={fillFor(color)} stroke={color} strokeWidth={2} />
          {hasIcon && <svg x={start} y={-13} width={26} height={26} viewBox="0 0 24 24" className="an-glyph" style={{ stroke: color }}><path d={glyphFor(o.icon ?? o.label)} /></svg>}
          <g data-id={o.id + '#label'}><Lines text={o.label} size={o.size ?? 17} anchor="start" x={start + (hasIcon ? 34 : 0)} cls="an-label" fill={TEXT} /></g>
          {variants.map((v, k) => <g key={k} data-id={`${o.id}#label#${k}`} data-variant="1"><Lines text={v} size={o.size ?? 17} anchor="start" x={start + (hasIcon ? 34 : 0)} cls="an-label" fill={TEXT} /></g>)}
        </g>
      )
    }
    case 'rect':
      return (
        <g data-id={o.id} transform={tf} style={hidden} className="an-obj">
          <rect data-shape="1" x={-o.w / 2} y={-o.h / 2} width={o.w} height={o.h} rx={10} fill={fillFor(color)} stroke={color} strokeWidth={2} />
          <g data-id={o.id + '#label'}>{o.label && <Lines text={o.label} size={o.size ?? 17} anchor="middle" cls="an-label" fill={TEXT} />}</g>
          {variants.map((v, k) => <g key={k} data-id={`${o.id}#label#${k}`} data-variant="1"><Lines text={v} size={o.size ?? 17} anchor="middle" cls="an-label" fill={TEXT} /></g>)}
        </g>
      )
    case 'text':
      return (
        <g data-id={o.id} transform={tf} style={hidden} className="an-obj">
          <g data-id={o.id + '#label'}><Lines text={o.label} size={o.size ?? 20} anchor={o.anchor ?? 'middle'} cls="an-text" fill={color} /></g>
          {variants.map((v, k) => <g key={k} data-id={`${o.id}#label#${k}`} data-variant="1"><Lines text={v} size={o.size ?? 20} anchor={o.anchor ?? 'middle'} cls="an-text" fill={color} /></g>)}
        </g>
      )
    case 'num': {
      const d = o.digits ?? 0
      const s = `${o.prefix ?? ''}${d ? (o.value ?? 0).toFixed(d) : Math.round(o.value ?? 0).toLocaleString()}${o.suffix ?? ''}`
      return (
        <g data-id={o.id} transform={tf} style={hidden} className="an-obj">
          <text data-shape="1" textAnchor={o.anchor ?? 'middle'} dominantBaseline="middle" fontSize={o.size ?? 30} className="an-num" fill={color}>{s}</text>
        </g>
      )
    }
    case 'dot':
      return (
        <g data-id={o.id} transform={tf} style={hidden} className="an-obj">
          <circle data-shape="1" r={o.w / 2} fill={color} stroke={BG} strokeWidth={2} />
          {o.label && <text x={o.w / 2 + 7} y={-o.w / 2 - 4} fontSize={15} fill={color} className="an-dot-label">{o.label}</text>}
        </g>
      )
    case 'axes': {
      const xt = niceTicks(o.xr![0], o.xr![1], 6)
      const yt = niceTicks(o.yr![0], o.yr![1], 5)
      const sx = (x: number) => ((x - o.xr![0]) / (o.xr![1] - o.xr![0] || 1)) * o.w
      const sy = (y: number) => o.h - ((y - o.yr![0]) / (o.yr![1] - o.yr![0] || 1)) * o.h
      const x0 = o.xr![0] <= 0 && o.xr![1] >= 0 ? sx(0) : 0
      const y0 = o.yr![0] <= 0 && o.yr![1] >= 0 ? sy(0) : o.h
      return (
        <g data-id={o.id} transform={tf} style={hidden} className="an-axes">
          {xt.map((t) => <line key={'x' + t} x1={sx(t)} x2={sx(t)} y1={0} y2={o.h} stroke={GRID} strokeWidth={1} />)}
          {yt.map((t) => <line key={'y' + t} x1={0} x2={o.w} y1={sy(t)} y2={sy(t)} stroke={GRID} strokeWidth={1} />)}
          <line x1={0} x2={o.w} y1={y0} y2={y0} stroke={AXIS} strokeWidth={1.5} />
          <line x1={x0} x2={x0} y1={0} y2={o.h} stroke={AXIS} strokeWidth={1.5} />
          {xt.map((t) => <text key={'xl' + t} x={sx(t)} y={Math.min(o.h, y0) + 18} textAnchor="middle" fontSize={13} fill={AXIS}>{fmt(t)}</text>)}
          {yt.map((t) => <text key={'yl' + t} x={Math.max(0, x0) - 8} y={sy(t)} textAnchor="end" dominantBaseline="middle" fontSize={13} fill={AXIS}>{fmt(t)}</text>)}
          {o.xlabel && <text x={o.w / 2} y={o.h + 38} textAnchor="middle" fontSize={15} fill={TEXT}>{o.xlabel}</text>}
          {o.ylabel && <text x={-44} y={o.h / 2} textAnchor="middle" fontSize={15} fill={TEXT} transform={`rotate(-90 -44 ${o.h / 2})`}>{o.ylabel}</text>}
        </g>
      )
    }
    case 'curve': {
      const pts = curvePoints(scene, o)
      const ax = axesOf(scene, o.on)!
      // label near the last point that is inside the plot, kept clear of the edges
      const inside = pts.filter((q) => Number.isFinite(q[0]) && q[1] > ax.y + 24 && q[1] < ax.y + ax.h - 8)
      const last = inside[inside.length - 1]
      const lx = last ? Math.min(last[0] + 8, ax.x + ax.w - 8) : 0
      const anchor = last && last[0] + 8 > ax.x + ax.w - 70 ? 'end' : 'start'
      return (
        <>
          <g clipPath={`url(#an-clip-${ax.id})`} transform={`translate(${ax.x},${ax.y})`}>
            <g transform={`translate(${-ax.x},${-ax.y})`}>
              <path data-id={o.id} d={pathFrom(pts)} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={o.dashed ? '0.03 0.02' : 1} strokeDashoffset={1} style={hidden} />
            </g>
          </g>
          {o.label && last && <text data-id={o.id + '#label'} x={lx} y={last[1] - 12} fontSize={15} fill={color} textAnchor={anchor} style={hidden} className="an-curve-label">{o.label}</text>}
        </>
      )
    }
    case 'vector': case 'line': {
      const a = toStage(scene, o, o.from!)
      const b = toStage(scene, o, o.to!)
      const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
      return (
        <g data-id={o.id} style={hidden} className="an-obj" clipPath={o.on ? `url(#an-clip-stage-${o.on})` : undefined}>
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={o.kind === 'vector' ? 3.5 : 2.5} strokeLinecap="round" strokeDasharray={o.dashed ? '8 6' : undefined} />
          {o.kind === 'vector' && <polygon data-head="1" points="2,0 -12,-6 -12,6" fill={color} transform={`translate(${b[0]},${b[1]}) rotate(${ang})`} />}
          {o.label && <text data-id={o.id + '#label'} x={b[0] + 10} y={b[1] - 10} fontSize={16} fill={color} fontStyle="italic" className="an-curve-label">{o.label}</text>}
          {variants.map((v, k) => <text key={k} data-id={`${o.id}#label#${k}`} data-variant="1" x={b[0] + 10} y={b[1] - 10} fontSize={16} fill={color} fontStyle="italic" className="an-curve-label">{v}</text>)}
        </g>
      )
    }
    case 'tangent': {
      const g = tangentGeom(scene, o, o.at!)
      return (
        <g data-id={o.id} style={hidden} className="an-obj">
          <g clipPath={o.on ? `url(#an-clip-stage-${o.on})` : undefined}>
            <line x1={g.a[0]} y1={g.a[1]} x2={g.b[0]} y2={g.b[1]} stroke={color} strokeWidth={2.5} strokeDasharray="8 6" strokeLinecap="round" />
          </g>
          <circle cx={g.p[0]} cy={g.p[1]} r={6} fill={color} stroke={BG} strokeWidth={2} />
          {o.label && <text x={g.p[0] + 12} y={g.p[1] - 12} fontSize={15} fill={color} className="an-curve-label">{o.label === 'slope' ? `slope = ${fmt(g.m, 2)}` : o.label}</text>}
        </g>
      )
    }
    case 'arrow':
      return (
        <g data-id={o.id} style={hidden} className="an-arrow">
          <path d="M0 0" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={o.dashed ? '8 6' : undefined} />
          <polygon data-head="1" points="2,0 -12,-6 -12,6" fill={color} style={hidden} />
          {o.label && <text fontSize={14} fill={TEXT} className="an-arrow-label" style={hidden}>{o.label}</text>}
        </g>
      )
  }
}
