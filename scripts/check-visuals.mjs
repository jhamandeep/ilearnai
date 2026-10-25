// Validates the visual and interactive blocks in every lesson and reports
// per-track coverage. Usage:
//   node scripts/check-visuals.mjs                 all tracks
//   node scripts/check-visuals.mjs <track-slug>    one track, lists missing pieces
//   node scripts/check-visuals.mjs --file <path>   one module file (export const mod)
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'

const args = process.argv.slice(2)
const fileIdx = args.indexOf('--file')
const file = fileIdx >= 0 ? args[fileIdx + 1] : null
const only = fileIdx < 0 ? args[0] : null

const vite = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const comps = {}
for (const n of ['Flow', 'Timeline', 'Scenario', 'Bars', 'Matrix', 'Quiz', 'Video', 'Code', 'Arch', 'Exercise']) comps[n.toLowerCase()] = (await vite.ssrLoadModule(`/src/components/rich/${n}.tsx`))[n]
const { videos } = await vite.ssrLoadModule('/src/data/videos.ts')
const videoIds = new Set(videos.filter((v) => v.id).map((v) => v.id))
const { parseQuiz } = await vite.ssrLoadModule('/src/lib/quiz.ts')
const { dedent } = await vite.ssrLoadModule('/src/components/rich/index.tsx')

const KINDS = 'flow|timeline|scenario|bars|matrix|quiz|video|code|arch|exercise'
const HEADINGS = ['## What this lesson covers', '## Why it matters', '## The idea with an example', '## How it works', '## Try it', '## Common mistakes', '## Check your understanding', '## Go further']

let problems = 0
function problem(path, msg) { problems++; console.log(`PROBLEM ${path}: ${msg}`) }

function checkLesson(path, l, strict) {
  const body = l.body
  if (/`/.test(body)) problem(path, 'backtick in body')
  if (/\$\{/.test(body)) problem(path, '"${" in body')
  const opens = (body.match(new RegExp(`^[ \\t]*:::(${KINDS})[ \\t]*$`, 'gm')) || []).length
  const closes = (body.match(/^[ \t]*:::[ \t]*$/gm) || []).length
  const badOpens = (body.match(/^[ \t]*:::\w+/gm) || []).length - opens
  if (badOpens > 0) problem(path, 'unknown block kind')
  if (opens !== closes) problem(path, `${opens} opens vs ${closes} closes`)
  const kinds = new Set()
  let quizQuestions = 0
  const re = new RegExp(`^[ \\t]*:::(${KINDS})[ \\t]*\\n([\\s\\S]*?)^[ \\t]*:::[ \\t]*$`, 'gm')
  let mm
  let blocks = 0
  while ((mm = re.exec(body))) {
    blocks++
    const kind = mm[1]
    const src = dedent(mm[2])
    kinds.add(kind)
    let html = ''
    try { html = renderToString(createElement(comps[kind], { src })) } catch (e) { problem(path, `${kind} throws: ${e.message.split('\n')[0]}`); continue }
    if (!html.includes('<figure')) problem(path, `${kind} block renders nothing (check syntax)`)
    if (kind === 'scenario' && (src.match(/^step\s*:/gm) || []).length < 3) problem(path, 'scenario has fewer than 3 steps')
    if (kind === 'flow' && (src.match(/->/g) || []).length < 3) problem(path, 'flow has fewer than 3 edges')
    if (kind === 'arch') {
      if (!/^layer\s*:/m.test(src)) problem(path, 'arch has no layer: lines')
      const boxes = new Set([...src.matchAll(/^layer\s*:[^|]*\|(.*)$/gm)].flatMap((m) => m[1].split(',').map((s) => s.trim())))
      const fl = /^flow\s*:\s*(.*)$/m.exec(src)
      if (fl) for (const b of fl[1].split(/\s*(?:->|→)\s*/)) if (b && !boxes.has(b.trim())) problem(path, `arch flow names unknown box "${b.trim()}"`)
    }
    if (kind === 'quiz') {
      const q = parseQuiz(src)
      const rawQ = (src.match(/^q\s*:/gm) || []).length
      if (q.questions.length !== rawQ) problem(path, `quiz: ${rawQ - q.questions.length} question(s) have no * answer or fewer than 2 options`)
      if (q.questions.length < 3) problem(path, 'quiz has fewer than 3 questions')
      for (const qq of q.questions) {
        if (!qq.why) problem(path, `quiz question lacks why: "${qq.text.slice(0, 50)}"`)
        if (qq.options.length > 5) problem(path, 'quiz question has more than 5 options')
      }
      const stars = [...src.matchAll(/^q\s*:[\s\S]*?(?=^q\s*:|$(?![\r\n]))/gm)]
      void stars
      quizQuestions += q.questions.length
    }
    if (kind === 'video') {
      const id = /^id\s*:\s*(\S+)/m.exec(src)?.[1]
      if (!id) problem(path, 'video has no id')
      else if (!videoIds.has(id)) problem(path, `video id ${id} is not in src/data/videos.ts`)
      if (!/^why\s*:/m.test(src)) problem(path, 'video has no why:')
    }
    if (kind === 'code' && !/^lang\s*:/m.test(src)) problem(path, 'code block has no lang:')
    if (kind === 'exercise') {
      if (!/^task\s*:/m.test(src)) problem(path, 'exercise has no task:')
      if (!/^solution\s*:\s*$/m.test(src)) problem(path, 'exercise has no solution:')
    }
    if (kind !== 'code' && kind !== 'exercise' && kind !== 'quiz' && /\$|\*\*|`/.test(src)) problem(path, `${kind} block contains Markdown or LaTeX`)
  }
  const hasTable = /^\|.*\|\s*\n\|\s*-+/m.test(body)
  const missing = []
  if (!(kinds.has('flow') || kinds.has('timeline') || kinds.has('matrix') || kinds.has('arch'))) missing.push('diagram')
  if (!kinds.has('scenario')) missing.push('scenario')
  if (!hasTable) missing.push('table')
  if (!kinds.has('quiz')) missing.push('quiz')
  if (strict) {
    if (!kinds.has('exercise')) missing.push('exercise')
    for (const h of HEADINGS) if (!body.includes(h)) missing.push(`heading "${h}"`)
    const words = body.replace(new RegExp(`^[ \\t]*:::(${KINDS})[ \\t]*\\n[\\s\\S]*?^[ \\t]*:::[ \\t]*$`, 'gm'), '').split(/\s+/).filter(Boolean).length
    if (words < 900) missing.push(`only ${words} words of prose (target 1400+)`)
    if (!l.objectives || l.objectives.length < 3) missing.push('fewer than 3 objectives')
    if (!l.keyTerms || l.keyTerms.length < 3) missing.push('fewer than 3 key terms')
    if (!l.links || l.links.length < 2) missing.push('fewer than 2 links')
    if (quizQuestions < 4) missing.push(`quiz has ${quizQuestions} questions (need 4+)`)
    for (const m of missing) problem(path, m)
  } else if (missing.length && (only || file)) console.log(`MISSING ${path}: ${missing.join(', ')}`)
  return { kinds, hasTable, blocks, quizQuestions }
}

if (file) {
  const mod = (await vite.ssrLoadModule('/' + file.replace(/^\.?\//, ''))).mod
  if (!mod) { console.log(`PROBLEM ${file}: does not export "mod"`); process.exit(1) }
  const slugs = new Set()
  for (const l of mod.lessons) {
    if (slugs.has(l.slug)) problem(`${mod.slug}/${l.slug}`, 'duplicate lesson slug')
    slugs.add(l.slug)
    checkLesson(`${mod.slug}/${l.slug}`, l, true)
  }
  // glossary coverage: every key term must exist in some file under src/data/glossary/
  const { readdirSync } = await import('node:fs')
  const all = []
  for (const f of readdirSync('src/data/glossary')) if (f.endsWith('.ts')) { try { all.push(...(await vite.ssrLoadModule('/src/data/glossary/' + f)).terms) } catch (e) { problem(f, 'glossary file fails to load: ' + e.message.split('\n')[0]) } }
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const have = new Set(all.map((t) => t.slug))
  for (const t of all) for (const r of t.related ?? []) if (!have.has(r)) console.log(`GLOSSARY ${t.slug}: related "${r}" does not exist in any glossary file`)
  for (const l of mod.lessons) for (const k of l.keyTerms ?? []) if (!have.has(norm(k)) && !all.some((t) => t.term.toLowerCase() === k.toLowerCase())) problem(`${mod.slug}/${l.slug}`, `key term "${k}" has no glossary entry`)
  console.log(`${mod.slug}: ${mod.lessons.length} lessons checked`)
} else {
  const { tracks } = await vite.ssrLoadModule('/src/data/tracks.ts')
  for (const t of tracks) {
    if (only && t.slug !== only) continue
    let withDiagram = 0, withScenario = 0, withTable = 0, withQuiz = 0, withVideo = 0, withCode = 0, withExercise = 0, total = 0, blocks = 0, questions = 0
    for (const m of t.modules) for (const l of m.lessons) {
      total++
      const r = checkLesson(`${t.slug}/${m.slug}/${l.slug}`, l, false)
      blocks += r.blocks; questions += r.quizQuestions
      if (r.kinds.has('flow') || r.kinds.has('timeline') || r.kinds.has('matrix') || r.kinds.has('arch')) withDiagram++
      if (r.kinds.has('scenario')) withScenario++
      if (r.kinds.has('quiz')) withQuiz++
      if (r.kinds.has('video')) withVideo++
      if (r.kinds.has('code')) withCode++
      if (r.kinds.has('exercise')) withExercise++
      if (r.hasTable) withTable++
    }
    console.log(`${t.slug}: ${total} lessons · diagram ${withDiagram} · scenario ${withScenario} · table ${withTable} · quiz ${withQuiz} (${questions} q) · video ${withVideo} · code ${withCode} · exercise ${withExercise} · blocks ${blocks}`)
  }
}
console.log(problems ? `${problems} problems` : 'no problems')
await vite.close()
process.exit(problems ? 1 : 0)
