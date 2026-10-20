// Validates the visual blocks in every lesson and reports per-track coverage.
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
const only = process.argv[2] // optional track slug
const vite = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { tracks } = await vite.ssrLoadModule('/src/data/tracks.ts')
const comps = {}
for (const n of ['Flow', 'Timeline', 'Scenario', 'Bars', 'Matrix']) comps[n.toLowerCase()] = (await vite.ssrLoadModule(`/src/components/rich/${n}.tsx`))[n]
let problems = 0
for (const t of tracks) {
  if (only && t.slug !== only) continue
  let withDiagram = 0, withScenario = 0, withTable = 0, withBars = 0, total = 0, blocks = 0
  for (const m of t.modules) for (const l of m.lessons) {
    total++
    const body = l.body
    const path = `${t.slug}/${m.slug}/${l.slug}`
    if (/`/.test(body)) { problems++; console.log(`PROBLEM ${path}: backtick in body`) }
    const opens = (body.match(/^:::(flow|timeline|scenario|bars|matrix)[ \t]*$/gm) || []).length
    const closes = (body.match(/^:::[ \t]*$/gm) || []).length
    const badOpens = (body.match(/^:::\w+/gm) || []).length - opens
    if (badOpens > 0) { problems++; console.log(`PROBLEM ${path}: unknown block kind`) }
    if (opens !== closes) { problems++; console.log(`PROBLEM ${path}: ${opens} opens vs ${closes} closes`) }
    const kinds = new Set()
    const re = /^:::(flow|timeline|scenario|bars|matrix)[ \t]*\n([\s\S]*?)^:::[ \t]*$/gm
    let mm
    while ((mm = re.exec(body))) {
      blocks++
      const kind = mm[1]; const src = mm[2]
      kinds.add(kind)
      let html = ''
      try { html = renderToString(createElement(comps[kind], { src })) } catch (e) { problems++; console.log(`PROBLEM ${path}: ${kind} throws: ${e.message.split('\n')[0]}`); continue }
      if (!html.includes('<figure')) { problems++; console.log(`PROBLEM ${path}: ${kind} block renders nothing (check syntax)`) }
      if (kind === 'scenario' && (src.match(/^step\s*:/gm) || []).length < 3) { problems++; console.log(`PROBLEM ${path}: scenario has fewer than 3 steps`) }
      if (kind === 'flow' && (src.match(/->/g) || []).length < 3) { problems++; console.log(`PROBLEM ${path}: flow has fewer than 3 edges`) }
      if (/\$|\*\*|`/.test(src)) { problems++; console.log(`PROBLEM ${path}: ${kind} block contains Markdown or LaTeX`) }
    }
    const hasTable = /^\|.*\|\s*\n\|\s*-+/m.test(body)
    if (kinds.has('flow') || kinds.has('timeline') || kinds.has('matrix')) withDiagram++
    if (kinds.has('scenario')) withScenario++
    if (kinds.has('bars')) withBars++
    if (hasTable) withTable++
    const missing = []
    if (!(kinds.has('flow') || kinds.has('timeline') || kinds.has('matrix'))) missing.push('diagram')
    if (!kinds.has('scenario')) missing.push('scenario')
    if (!hasTable) missing.push('table')
    if (missing.length && only) console.log(`MISSING ${path}: ${missing.join(', ')}`)
  }
  console.log(`${t.slug}: ${total} lessons · diagram ${withDiagram} · scenario ${withScenario} · table ${withTable} · bars ${withBars} · blocks ${blocks}`)
}
console.log(problems ? `${problems} problems` : 'no problems')
await vite.close()
process.exit(problems ? 1 : 0)
