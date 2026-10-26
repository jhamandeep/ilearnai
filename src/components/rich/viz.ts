// Shared helpers for the visual blocks: glyph lookup, number formatting,
// axis ticks, and a tiny safe expression evaluator for :::graph.

// ---- glyphs: 24x24 stroke paths, chosen by keywords in a box or node name ----
const GLYPHS: [RegExp, string][] = [
  [/\b(you|user|users|person|people|reader|human|customer|learner|student)\b/i, 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-7 8-7s8 3 8 7'],
  [/\b(browser|web ?ui|web ?page|page|frontend|screen|mobile|app|ui|html|client)\b/i, 'M3 5h18v11H3zM8 20h8M12 16v4'],
  [/\b(database|postgres|sql|sqlite|store|disk|storage|table|rows|db)\b/i, 'M12 3c5 0 8 1.3 8 3s-3 3-8 3-8-1.3-8-3 3-3 8-3zM4 6v12c0 1.7 3 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3 3 8 3s8-1.3 8-3'],
  [/\b(vector|embedding|embeddings|index|chroma|faiss|hnsw|similarity|retriev\w*)\b/i, 'M5 5h3v3H5zM10.5 5h3v3h-3zM16 5h3v3h-3zM5 10.5h3v3H5zM10.5 10.5h3v3h-3zM16 10.5h3v3h-3zM5 16h3v3H5zM10.5 16h3v3h-3zM16 16h3v3h-3z'],
  [/\b(gpu|cpu|chip|accelerator|tpu|hardware|kernel|memory|ram)\b/i, 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4'],
  [/\b(llm|model|models|claude|gpt|network|neural|transformer|neuron|brain|ai|encoder|decoder|judge)\b/i, 'M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4zM5 17l.9 2.1L8 20l-2.1.9L5 23l-.9-2.1L2 20l2.1-.9zM19 15l.7 1.6 1.6.7-1.6.7L19 19.6l-.7-1.6-1.6-.7 1.6-.7z'],
  [/\b(cache|redis|memcache|fast path|hot)\b/i, 'M13 2L5 13h6l-1 9 9-12h-6z'],
  [/\b(queue|kafka|log|stream|topic|buffer|bus|events?)\b/i, 'M3 7h18M3 12h18M3 17h18M7 4v16M12 4v16M17 4v16'],
  [/\b(monitor\w*|metrics|dashboard|observab\w*|alert\w*|tracing|evaluat\w*|eval|grafana|prometheus)\b/i, 'M3 20h18M6 17V11M11 17V6M16 17v-4M21 17V9'],
  [/\b(tools?|function|functions|calculator|search tool|wrench|utility)\b/i, 'M14.5 6.5a4 4 0 0 0 5 5L10 21l-3-3 9.5-9.5a4 4 0 0 0-2-2zM3 21l3-3'],
  [/\b(documents?|docs?|file|files|pdf|text|chunks?|data ?set|dataset|csv|json|notes|corpus|raw|record)\b/i, 'M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7'],
  [/\b(guard\w*|permission\w*|auth\w*|filter|safety|policy|check\w*|validat\w*|approval)\b/i, 'M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6zM9 12l2 2 4-4'],
  [/\b(cloud|internet|dns|router|network|cdn|wifi|isp|provider)\b/i, 'M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11a3.5 3.5 0 0 0 1 7z'],
  [/\b(keys?|secret\w*|env|\.env|token|password|credential\w*)\b/i, 'M14 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM14 7v2M4 20l6.5-6.5M6 18l2 2M8 16l2 2'],
  [/\b(schedul\w*|worker|loop|process\w*|pipeline|orchestrat\w*|runner|job|cron|batch\w*)\b/i, 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2'],
  [/\b(terminal|shell|script|python|code|program|cli|command|notebook|colab|bash)\b/i, 'M3 5h18v14H3zM7 9l3 3-3 3M12 15h5'],
  [/\b(email|mail|message|messages|chat|prompt|reply|response|request|inbox)\b/i, 'M3 6h18v12H3zM3 7l9 6 9-6'],
  [/\b(agent|planner|controller|robot|arm)\b/i, 'M6 9h12v9H6zM9 13h.01M15 13h.01M12 5v4M9 18v2M15 18v2M3 12h3M18 12h3'],
  [/\b(server|api|service|gateway|backend|endpoint|fastapi|vllm|ollama|host|serving|proxy|load ?balancer)\b/i, 'M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01M11 7h6M11 17h6'],
  [/\b(camera|image|images|vision|photo|picture|pixel)\b/i, 'M4 7h4l2-2h4l2 2h4v12H4zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z'],
  [/\b(money|cost|price|budget|bill\w*|dollar)\b/i, 'M12 3v18M16 7.5c0-1.9-1.8-3-4-3s-4 1.1-4 3 1.8 2.5 4 3 4 1.1 4 3-1.8 3-4 3-4-1.1-4-3'],
  [/\b(training|train|trainer|fine-?tun\w*|lora|optimi[sz]er|gradient)\b/i, 'M4 18l5-6 4 3 7-9M15 6h5v5'],
  [/\b(box|container|docker|image|package|pip|deploy\w*|k8s|kubernetes|pod)\b/i, 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5'],
]
const CUBE = 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5'
export function glyphFor(name: string): string {
  for (const [re, d] of GLYPHS) if (re.test(name)) return d
  return CUBE
}

// ---- numbers ----
export function fmt(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return '–'
  const a = Math.abs(n)
  if (a >= 1e9) return (n / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'B'
  if (a >= 1e6) return (n / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'M'
  if (a >= 1e4) return (n / 1e3).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'K'
  return n.toLocaleString(undefined, { maximumFractionDigits: digits })
}

// "Nice" axis ticks: clean steps (1, 2, 2.5, 5 × 10^k) that cover [min, max].
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!(max > min)) return [min]
  const raw = (max - min) / Math.max(1, count)
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const cand = [1, 2, 2.5, 5, 10].map((m) => m * pow)
  const step = cand.find((c) => c >= raw) ?? cand[cand.length - 1]
  const out: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) out.push(+v.toFixed(10))
  return out
}

// ---- a safe arithmetic evaluator: numbers, x, e, pi, + - * / ^, functions ----
type Fn = (x: number) => number
const FUNCS: Record<string, (...a: number[]) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, exp: Math.exp, log: Math.log, ln: Math.log, log2: Math.log2, log10: Math.log10,
  sqrt: Math.sqrt, abs: Math.abs, tanh: Math.tanh, floor: Math.floor, ceil: Math.ceil, round: Math.round,
  max: Math.max, min: Math.min, sign: Math.sign,
  relu: (v) => Math.max(0, v), sigmoid: (v) => 1 / (1 + Math.exp(-v)), step: (v) => (v >= 0 ? 1 : 0),
}
const CONSTS: Record<string, number> = { e: Math.E, pi: Math.PI }

export function compileExpr(src: string): Fn | null {
  const s = src.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
  let i = 0
  const peek = () => s[i]
  const eat = (c: string) => { if (s[i] === c) { i++; return true } return false }
  type Node = (x: number) => number
  function expr(): Node {
    let left = term()
    for (;;) {
      if (eat('+')) { const r = term(); const l = left; left = (x) => l(x) + r(x) }
      else if (eat('-')) { const r = term(); const l = left; left = (x) => l(x) - r(x) }
      else return left
    }
  }
  function term(): Node {
    let left = unary()
    for (;;) {
      if (eat('*')) { const r = unary(); const l = left; left = (x) => l(x) * r(x) }
      else if (eat('/')) { const r = unary(); const l = left; left = (x) => l(x) / r(x) }
      else return left
    }
  }
  function unary(): Node {
    if (eat('-')) { const r = unary(); return (x) => -r(x) }
    if (eat('+')) return unary()
    return power()
  }
  function power(): Node {
    const base = atom()
    if (eat('^')) { const ex = unary(); return (x) => Math.pow(base(x), ex(x)) }
    return base
  }
  function atom(): Node {
    if (eat('(')) { const e = expr(); if (!eat(')')) throw new Error(')'); return implicit(e) }
    const num = /^(\d+\.?\d*|\.\d+)(e-?\d+)?/i.exec(s.slice(i))
    if (num) { i += num[0].length; const v = parseFloat(num[0]); return implicit(() => v) }
    const id = /^[a-z_][a-z0-9_]*/i.exec(s.slice(i))
    if (!id) throw new Error('token')
    i += id[0].length
    const name = id[0].toLowerCase()
    if (name === 'x') return implicit((x) => x)
    if (name in CONSTS) return implicit(() => CONSTS[name])
    if (name in FUNCS) {
      if (!eat('(')) throw new Error('(')
      const args: Node[] = [expr()]
      while (eat(',')) args.push(expr())
      if (!eat(')')) throw new Error(')')
      const f = FUNCS[name]
      return implicit((x) => f(...args.map((a) => a(x))))
    }
    throw new Error('unknown ' + name)
  }
  // implicit multiplication: 2x, 3(x+1), x(x-1)
  function implicit(left: Node): Node {
    const c = peek()
    if (c === '(' || (c !== undefined && /[a-z]/i.test(c))) {
      const r = atom()
      return (x) => left(x) * r(x)
    }
    return left
  }
  try {
    const f = expr()
    if (i !== s.length) return null
    return f
  } catch {
    return null
  }
}
