// Parser for the :::anim block: a narrated, continuous animation scene.
// The grammar is documented in CONTENT_SPEC.md (section "anim"). The parser
// is pure (no DOM) so the validator can run it under SSR.
import { compileExpr } from './viz'

export const STAGE_W = 960
export const STAGE_H = 540

export const PALETTE: Record<string, string> = {
  blue: '#4285f4', yellow: '#c58b00', green: '#188038', red: '#d93025', purple: '#9334e6',
  orange: '#c26401', teal: '#007b83', pink: '#b9367b', white: 'var(--anim-ink, #202124)', grey: 'var(--anim-axis, #747775)', gray: 'var(--anim-axis, #747775)',
}
export function colorOf(c: string | undefined, fallback: string): string {
  if (!c) return fallback
  if (PALETTE[c]) return PALETTE[c]
  if (/^#[0-9a-f]{3,8}$/i.test(c)) return c
  return fallback
}

export type ObjKind = 'box' | 'text' | 'dot' | 'num' | 'rect' | 'axes' | 'curve' | 'vector' | 'line' | 'tangent' | 'arrow'

export interface Obj {
  kind: ObjKind
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  icon?: string
  color?: string
  size?: number
  anchor?: 'start' | 'middle' | 'end'
  on?: string // axes id for objects placed in axes coordinates
  expr?: string
  f?: (x: number) => number
  from?: [number, number]
  to?: [number, number]
  value?: number
  prefix?: string
  suffix?: string
  digits?: number
  at?: number // tangent point
  len?: number // tangent half-length in axes units
  dashed?: boolean
  xr?: [number, number]
  yr?: [number, number]
  xlabel?: string
  ylabel?: string
  curve?: string // tangent: curve id
  a?: string // arrow: from id
  b?: string // arrow: to id
}

export interface Action {
  op: 'show' | 'hide' | 'draw' | 'arrow' | 'send' | 'move' | 'morph' | 'walk' | 'vector' | 'tangent' | 'count' | 'label' | 'color' | 'highlight' | 'dim' | 'restore' | 'pulse' | 'wait' | 'zoom'
  ids: string[]
  to?: [number, number]
  from?: number
  until?: number
  along?: string
  value?: number
  text?: string
  color?: string
  dur?: number
  parallel: boolean
}

export interface Step { text: string; explanation?: string; hold?: number; actions: Action[] }

export interface Scene {
  title?: string
  context?: string
  focus?: string
  takeaway?: string
  objects: Obj[]
  steps: Step[]
  errors: string[]
}

const NUM = '-?\\d+(?:\\.\\d+)?(?:e-?\\d+)?'
const PAIR = new RegExp(`^(${NUM})\\s*,\\s*(${NUM})$`)

function tokens(line: string): string[] {
  const out: string[] = []
  const re = /"([^"]*)"|(\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) out.push(m[1] !== undefined ? '"' + m[1] : m[2])
  return out
}
const isQuoted = (t: string) => t.startsWith('"')
const unq = (t: string) => (isQuoted(t) ? t.slice(1) : t)

function pair(s: string | undefined): [number, number] | null {
  if (!s) return null
  const m = PAIR.exec(s.trim())
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : null
}
function size(s: string | undefined): [number, number] | null {
  if (!s) return null
  const m = /^(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)$/i.exec(s.trim())
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : null
}

// Joins "@ 120, 300" and "x: -1, 7" style fragments so one token holds a pair.
function normalise(line: string): string {
  // only the parts outside double quotes are rewritten; labels keep their exact text
  return line.split('"').map((part, i) => (i % 2 === 1 ? part : part
    .replace(/@\s*/g, '@ ')
    .replace(new RegExp(`(${NUM})\\s*,\\s*(?=${NUM})`, 'g'), '$1,')
    .replace(/(\w)\s*:\s+/g, '$1: ')
    .replace(/\s*->\s*/g, ' -> ')
    .replace(/\s*=\s*/g, ' = '))).join('"')
}

const DEFAULT_DUR: Record<Action['op'], number> = {
  show: 0.6, hide: 0.4, draw: 1.2, arrow: 1.4, send: 1.0, move: 1.0, morph: 1.4, walk: 1.6, vector: 1.0, tangent: 1.0,
  count: 1.2, label: 0.5, color: 0.4, highlight: 0.4, dim: 0.4, restore: 0.4, pulse: 0.7, wait: 1, zoom: 1.0,
}

export function parseAnim(src: string): Scene {
  const objects: Obj[] = []
  const steps: Step[] = []
  const errors: string[] = []
  let title: string | undefined
  const guidance: { context?: string; focus?: string; takeaway?: string } = {}
  const byId = new Map<string, Obj>()
  const add = (o: Obj) => {
    if (byId.has(o.id)) errors.push(`duplicate id "${o.id}"`)
    byId.set(o.id, o)
    objects.push(o)
  }
  const need = (id: string, where: string) => {
    if (!byId.has(id)) errors.push(`${where}: unknown object "${id}"`)
    return byId.get(id)
  }
  // options are "key: value" pairs anywhere in the token list
  const opts = (tk: string[]) => {
    const o: Record<string, string> = {}
    const rest: string[] = []
    for (let i = 0; i < tk.length; i++) {
      const t = tk[i]
      if (!isQuoted(t) && /^[a-z]+:$/i.test(t) && i + 1 < tk.length) { o[t.slice(0, -1).toLowerCase()] = unq(tk[i + 1]); i++; continue }
      rest.push(t)
    }
    return { o, rest }
  }
  const at = (rest: string[], where: string): [number, number] | null => {
    const i = rest.indexOf('@')
    if (i < 0) return null
    const p = pair(rest[i + 1])
    if (!p) errors.push(`${where}: "@" must be followed by x,y`)
    rest.splice(i, 2)
    return p
  }
  const onAxes = (rest: string[], o: Record<string, string>, where: string): string | undefined => {
    let ax = o.on
    const i = rest.indexOf('on')
    if (i >= 0) { ax = rest[i + 1]; rest.splice(i, 2) }
    if (ax !== undefined) {
      const a = byId.get(ax)
      if (!a || a.kind !== 'axes') errors.push(`${where}: "on ${ax}" is not an axes object`)
    }
    return ax
  }
  const asNum = (s: string | undefined, d: number) => { const n = parseFloat(s ?? ''); return Number.isFinite(n) ? n : d }

  let cur: Step | null = null
  let lineNo = 0
  for (const raw of src.split('\n')) {
    lineNo++
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const where = `line ${lineNo}`
    const tm = /^title\s*:\s*(.*)$/.exec(line)
    if (tm && !cur) { title = tm[1].trim(); continue }
    const guide = /^(context|focus|takeaway)\s*:\s*(.+)$/.exec(line)
    if (guide && !cur) { guidance[guide[1] as keyof typeof guidance] = guide[2].trim(); continue }
    const explanation = /^explain\s*:\s*(.+)$/.exec(line)
    if (explanation && cur) { cur.explanation = explanation[1].trim(); continue }
    const sm = /^(?:step|say)\s*:\s*(.*)$/.exec(line)
    if (sm) {
      let text = sm[1].trim()
      let hold: number | undefined
      const hm = /\[(\d+(?:\.\d+)?)s\]\s*$/.exec(text)
      if (hm) { hold = parseFloat(hm[1]); text = text.slice(0, hm.index).trim() }
      cur = { text, hold, actions: [] }
      steps.push(cur)
      continue
    }
    const tk = tokens(normalise(line))
    if (tk.length === 0) continue
    if (!cur) {
      // ---- object declarations ----
      const kind = tk[0].toLowerCase()
      const id = tk[1]
      if (!id || isQuoted(id)) { errors.push(`${where}: "${kind}" needs an id`); continue }
      const { o, rest } = opts(tk.slice(2))
      const color = o.color
      switch (kind) {
        case 'box':
        case 'rect':
        case 'text':
        case 'num': {
          const on = onAxes(rest, o, where)
          let label = ''
          let value: number | undefined
          if (kind === 'num') {
            const eq = rest.indexOf('=')
            if (eq >= 0) { value = asNum(rest[eq + 1], 0); rest.splice(eq, 2) } else value = 0
          }
          const q = rest.find(isQuoted)
          if (q) { label = unq(q); rest.splice(rest.indexOf(q), 1) }
          const p = at(rest, where)
          if (!p) { errors.push(`${where}: ${kind} "${id}" needs "@ x,y"`); continue }
          const sz = size(o.size)
          const fontSize = kind === 'num' ? asNum(o.size, 30) : asNum(o.size, kind === 'text' ? 20 : 17)
          const w = sz ? sz[0] : kind === 'box' ? Math.min(340, Math.max(150, label.length * 10 + 80)) : kind === 'rect' ? 120 : 0
          const h = sz ? sz[1] : kind === 'box' ? 64 : kind === 'rect' ? 60 : 0
          add({ kind: kind as ObjKind, id, x: p[0], y: p[1], w, h, label, value, on, color, icon: o.icon, size: sz ? undefined : fontSize,
            anchor: (o.anchor as Obj['anchor']) ?? 'middle', prefix: o.prefix ?? '', suffix: o.suffix ?? '', digits: asNum(o.digits, Number.isInteger(value ?? 0) ? 0 : 2) })
          if (sz && kind === 'text') byId.get(id)!.size = fontSize
          break
        }
        case 'dot': {
          const on = onAxes(rest, o, where)
          const p = at(rest, where)
          if (!p) { errors.push(`${where}: dot "${id}" needs "@ x,y"`); continue }
          add({ kind: 'dot', id, x: p[0], y: p[1], w: asNum(o.r, 7) * 2, h: 0, label: o.label ?? '', on, color })
          break
        }
        case 'axes': {
          const p = at(rest, where)
          const sz = size(o.size)
          const xr = pair(o.x) ?? [-5, 5]
          const yr = pair(o.y) ?? [-5, 5]
          if (!p || !sz) { errors.push(`${where}: axes "${id}" needs "@ x,y" and "size: WxH"`); continue }
          add({ kind: 'axes', id, x: p[0], y: p[1], w: sz[0], h: sz[1], label: '', xr, yr, xlabel: o.xlabel, ylabel: o.ylabel, color })
          break
        }
        case 'curve': {
          const on = onAxes(rest, o, where)
          if (!on) { errors.push(`${where}: curve "${id}" needs "on AXES"`); continue }
          const eq = rest.indexOf('=')
          const exprTokens = eq >= 0 ? rest.slice(eq + 1) : []
          const dashed = rest.slice(0, Math.max(0, eq)).includes('dashed') || exprTokens[exprTokens.length - 1] === 'dashed'
          if (exprTokens[exprTokens.length - 1] === 'dashed') exprTokens.pop()
          const expr = exprTokens.join(' ')
          const f = compileExpr(expr)
          if (!f) { errors.push(`${where}: curve "${id}" has no valid expression (${expr || 'empty'})`); continue }
          add({ kind: 'curve', id, x: 0, y: 0, w: 0, h: 0, label: o.label ?? '', on, expr, f, color, dashed })
          break
        }
        case 'vector':
        case 'line': {
          const on = onAxes(rest, o, where)
          const fi = rest.indexOf('from')
          const ti = rest.indexOf('to')
          const from = fi >= 0 ? pair(rest[fi + 1]) : null
          const to = ti >= 0 ? pair(rest[ti + 1]) : null
          if (!from || !to) { errors.push(`${where}: ${kind} "${id}" needs "from x,y to x,y"`); continue }
          add({ kind: kind as ObjKind, id, x: from[0], y: from[1], w: 0, h: 0, label: o.label ?? '', on, from, to, color, dashed: rest.includes('dashed') })
          break
        }
        case 'tangent': {
          const on = onAxes(rest, o, where)
          const c = on ? byId.get(on) : undefined
          // "tangent t on CURVE at X0": here "on" names a curve, not axes; tolerate both spellings
          const curveId = c && c.kind === 'curve' ? on! : o.curve ?? ''
          const cv = byId.get(curveId)
          if (!cv || cv.kind !== 'curve') { errors.push(`${where}: tangent "${id}" needs "on CURVE"`); continue }
          // drop the error onAxes may have pushed for a curve id
          const idx = errors.findIndex((e) => e.startsWith(where) && e.includes('is not an axes object'))
          if (idx >= 0) errors.splice(idx, 1)
          const ai = rest.indexOf('at')
          const x0 = ai >= 0 ? asNum(rest[ai + 1], 0) : 0
          add({ kind: 'tangent', id, x: x0, y: 0, w: 0, h: 0, label: o.label ?? '', on: cv.on, curve: curveId, at: x0, len: asNum(o.len, 1.5), color, dashed: true })
          break
        }
        case 'arrow': {
          const fi = rest.indexOf('from')
          const ti = rest.indexOf('to')
          const a = fi >= 0 ? rest[fi + 1] : undefined
          const b = ti >= 0 ? rest[ti + 1] : undefined
          if (!a || !b) { errors.push(`${where}: arrow "${id}" needs "from A to B"`); continue }
          need(a, where); need(b, where)
          const q = rest.find(isQuoted)
          add({ kind: 'arrow', id, x: 0, y: 0, w: 0, h: 0, label: q ? unq(q) : o.label ?? '', a, b, color, dashed: rest.includes('dashed') })
          break
        }
        default:
          errors.push(`${where}: unknown object kind "${kind}" (objects go before the first step)`)
      }
      continue
    }
    // ---- actions ----
    let parallel = false
    let t = tk.slice()
    if (t[0] === '&') { parallel = true; t = t.slice(1) }
    else if (t[0].startsWith('&')) { parallel = true; t[0] = t[0].slice(1) }
    let dur: number | undefined
    const last = t[t.length - 1]
    const dm = /^\((\d+(?:\.\d+)?)s\)$/.exec(last ?? '')
    if (dm) { dur = parseFloat(dm[1]); t.pop() }
    const op = t[0].toLowerCase() as Action['op']
    const args = t.slice(1)
    const idList = (s: string[]) => s.join(' ').split(/[\s,]+/).filter(Boolean)
    const push = (a: Omit<Action, 'parallel'>) => cur!.actions.push({ ...a, parallel, dur: dur ?? a.dur })
    switch (op) {
      case 'show': case 'hide': case 'draw': case 'highlight': case 'dim': case 'restore': case 'pulse': {
        const ids = idList(args)
        if (ids.length === 0) { errors.push(`${where}: ${op} needs at least one id`); break }
        for (const id of ids) need(id, where)
        push({ op, ids })
        break
      }
      case 'arrow': case 'send': {
        // arrow A -> B [: label]   |   arrow ID = A -> B [: label]
        let s = args.join(' ')
        let id: string | undefined
        const em = /^(\S+)\s*=\s*(.*)$/.exec(s)
        if (em) { id = em[1]; s = em[2] }
        const m = /^(\S+)\s*->\s*(\S+?)\s*(?::\s*(.*))?$/.exec(s)
        if (!m) { errors.push(`${where}: ${op} needs "A -> B"`); break }
        const a = m[1], b = m[2]
        need(a, where); need(b, where)
        const label = (m[3] ?? '').replace(/^"|"$/g, '').trim()
        const aid = id ?? `${a}->${b}`
        if (!byId.has(aid)) add({ kind: 'arrow', id: aid, x: 0, y: 0, w: 0, h: 0, label, a, b })
        else if (label && !byId.get(aid)!.label) byId.get(aid)!.label = label
        push({ op, ids: [aid], text: label })
        break
      }
      case 'morph': {
        const m = /^(\S+)\s*->\s*(\S+)$/.exec(args.join(' '))
        if (!m || m[1] === m[2]) { errors.push(`${where}: morph needs two different objects: "SOURCE -> TARGET"`); break }
        for (const id of [m[1], m[2]]) {
          const object = need(id, where)
          if (object && !['box', 'rect', 'text', 'num', 'dot'].includes(object.kind)) errors.push(`${where}: morph supports boxes, text, numbers and dots`)
        }
        push({ op, ids: [m[1], m[2]] })
        break
      }
      case 'move': case 'vector': {
        const m = /^(\S+)\s*->\s*(.*)$/.exec(args.join(' '))
        const p = m ? pair(m[2]) : null
        if (!m || !p) { errors.push(`${where}: ${op} needs "ID -> x,y"`); break }
        const o = need(m[1], where)
        if (op === 'vector' && o && o.kind !== 'vector' && o.kind !== 'line') errors.push(`${where}: "${m[1]}" is not a vector`)
        push({ op, ids: [m[1]], to: p })
        break
      }
      case 'walk': {
        const m = /^(\S+)\s+along\s+(\S+)\s+from\s+(\S+)\s+to\s+(\S+)$/.exec(args.join(' '))
        if (!m) { errors.push(`${where}: walk needs "ID along CURVE from x0 to x1"`); break }
        need(m[1], where)
        const c = need(m[2], where)
        if (c && c.kind !== 'curve') errors.push(`${where}: "${m[2]}" is not a curve`)
        push({ op, ids: [m[1]], along: m[2], from: parseFloat(m[3]), until: parseFloat(m[4]) })
        break
      }
      case 'tangent': case 'count': {
        const m = /^(\S+)\s*->\s*(\S+)$/.exec(args.join(' '))
        if (!m) { errors.push(`${where}: ${op} needs "ID -> value"`); break }
        need(m[1], where)
        push({ op, ids: [m[1]], value: parseFloat(m[2]) })
        break
      }
      case 'label': {
        const id = args[0]
        const text = args.slice(1).map(unq).join(' ')
        if (!id) { errors.push(`${where}: label needs an id and text`); break }
        need(id, where)
        push({ op, ids: [id], text })
        break
      }
      case 'color': {
        const c = args[args.length - 1]
        const ids = idList(args.slice(0, -1))
        if (ids.length === 0 || !c) { errors.push(`${where}: color needs ids and a colour`); break }
        for (const id of ids) need(id, where)
        push({ op, ids, color: c })
        break
      }
      case 'wait': {
        const s = parseFloat((args[0] ?? '1').replace(/s$/, ''))
        push({ op, ids: [], dur: Number.isFinite(s) ? s : 1 })
        break
      }
      case 'zoom': {
        // zoom x,y scale   |   zoom reset
        if (args[0] === 'reset') { push({ op, ids: [], value: 1 }); break }
        const p = pair(args[0])
        const s = parseFloat(args[1] ?? '1.6')
        if (!p) { errors.push(`${where}: zoom needs "x,y scale" or "reset"`); break }
        push({ op, ids: [], to: p, value: Number.isFinite(s) ? s : 1.6 })
        break
      }
      default:
        errors.push(`${where}: unknown action "${t[0]}"`)
    }
  }
  if (steps.length === 0) errors.push('no steps (add "step: ..." lines)')
  if (objects.length === 0) errors.push('no objects declared')
  return { title, ...guidance, objects, steps, errors }
}

export function defaultDur(op: Action['op']): number { return DEFAULT_DUR[op] }

// Reading time for a narration line, in seconds.
export function holdFor(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.min(6, Math.max(1.4, words * 0.3))
}
