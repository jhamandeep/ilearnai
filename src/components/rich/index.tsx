import { lazy, Suspense } from 'react'

const Flow = lazy(() => import('./Flow').then((m) => ({ default: m.Flow })))
const Timeline = lazy(() => import('./Timeline').then((m) => ({ default: m.Timeline })))
const Scenario = lazy(() => import('./Scenario').then((m) => ({ default: m.Scenario })))
const Bars = lazy(() => import('./Bars').then((m) => ({ default: m.Bars })))
const Matrix = lazy(() => import('./Matrix').then((m) => ({ default: m.Matrix })))

export const richKinds = ['flow', 'timeline', 'scenario', 'bars', 'matrix'] as const
export type RichKind = (typeof richKinds)[number]

export function RichBlock({ kind, src }: { kind: RichKind; src: string }) {
  const el =
    kind === 'flow' ? <Flow src={src} /> :
    kind === 'timeline' ? <Timeline src={src} /> :
    kind === 'scenario' ? <Scenario src={src} /> :
    kind === 'bars' ? <Bars src={src} /> :
    <Matrix src={src} />
  return <Suspense fallback={<div className="rich rich-loading">Loading diagram…</div>}>{el}</Suspense>
}

// Lesson text uses ":::kind ... :::" containers, which avoids backticks inside
// template literals. Convert them to fenced code blocks for the Markdown parser.
export function preprocessRich(markdown: string): string {
  return markdown.replace(/^[ \t]*:::(flow|timeline|scenario|bars|matrix)[ \t]*\n([\s\S]*?)^[ \t]*:::[ \t]*$/gm, (_m, kind: string, body: string) => '\n```' + kind + '\n' + body.replace(/^[ \t]+/gm, '') + '```\n')
}
