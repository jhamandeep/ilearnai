import { lazy, Suspense } from 'react'

const Flow = lazy(() => import('./Flow').then((m) => ({ default: m.Flow })))
const Timeline = lazy(() => import('./Timeline').then((m) => ({ default: m.Timeline })))
const Scenario = lazy(() => import('./Scenario').then((m) => ({ default: m.Scenario })))
const Bars = lazy(() => import('./Bars').then((m) => ({ default: m.Bars })))
const Matrix = lazy(() => import('./Matrix').then((m) => ({ default: m.Matrix })))
const Quiz = lazy(() => import('./Quiz').then((m) => ({ default: m.Quiz })))
const Video = lazy(() => import('./Video').then((m) => ({ default: m.Video })))
const Code = lazy(() => import('./Code').then((m) => ({ default: m.Code })))
const Arch = lazy(() => import('./Arch').then((m) => ({ default: m.Arch })))
const Exercise = lazy(() => import('./Exercise').then((m) => ({ default: m.Exercise })))
const Graph = lazy(() => import('./Graph').then((m) => ({ default: m.Graph })))
const Anim = lazy(() => import('./Anim').then((m) => ({ default: m.Anim })))

export const richKinds = ['flow', 'timeline', 'scenario', 'bars', 'matrix', 'quiz', 'video', 'code', 'arch', 'exercise', 'graph', 'anim'] as const
export type RichKind = (typeof richKinds)[number]

export function RichBlock({ kind, src }: { kind: RichKind; src: string }) {
  const el =
    kind === 'flow' ? <Flow src={src} /> :
    kind === 'timeline' ? <Timeline src={src} /> :
    kind === 'scenario' ? <Scenario src={src} /> :
    kind === 'bars' ? <Bars src={src} /> :
    kind === 'matrix' ? <Matrix src={src} /> :
    kind === 'quiz' ? <Quiz src={src} /> :
    kind === 'video' ? <Video src={src} /> :
    kind === 'code' ? <Code src={src} /> :
    kind === 'arch' ? <Arch src={src} /> :
    kind === 'graph' ? <Graph src={src} /> :
    kind === 'anim' ? <Anim src={src} /> :
    <Exercise src={src} />
  return <Suspense fallback={<div className="rich rich-loading">Loading…</div>}>{el}</Suspense>
}

const kindRe = richKinds.join('|')
const blockRe = new RegExp('^[ \\t]*:::(' + kindRe + ')[ \\t]*\\n([\\s\\S]*?)^[ \\t]*:::[ \\t]*$', 'gm')

// Remove only the indentation the whole block shares, so Python code inside a
// code or exercise block keeps its relative indentation.
export function dedent(body: string): string {
  const lines = body.split('\n')
  let min = Infinity
  for (const l of lines) {
    if (!l.trim()) continue
    const n = /^[ \t]*/.exec(l)![0].length
    if (n < min) min = n
  }
  if (!Number.isFinite(min) || min === 0) return body
  return lines.map((l) => l.slice(Math.min(min, /^[ \t]*/.exec(l)![0].length))).join('\n')
}

// Lesson text uses ":::kind ... :::" containers, which avoids backticks inside
// template literals. Convert them to fenced code blocks for the Markdown parser.
export function preprocessRich(markdown: string): string {
  return markdown.replace(blockRe, (_m, kind: string, body: string) => '\n```' + kind + '\n' + dedent(body) + (body.endsWith('\n') ? '' : '\n') + '```\n')
}
