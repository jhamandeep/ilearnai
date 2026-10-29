import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement, Fragment } from 'react'
import assert from 'node:assert/strict'
const vite = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const samples = {
  Flow: `title: Request path through a RAG system
Client -> Gateway: HTTP request
Gateway -> Retriever: query
Retriever -> Vector DB: top-k search
Vector DB -> Retriever: 50 chunks
Retriever -> Reranker: 50 chunks
Reranker -> LLM: 5 chunks + prompt
LLM -> Client: answer with citations`,
  Timeline: `title: Synchronous replication to one follower
unit: ms
lane Leader
lane Follower
Leader: write to disk @0-1
Leader -> Follower: send record @1-1.5
Follower: apply @1.5-2
Follower -> Leader: ack @2-2.5
Leader: reply to client @2.5-3`,
  Scenario: `title: Quorum read with N=3, W=2, R=2
state: A=v1, B=v1, C=v1
step: Client writes v2 to all three replicas and waits for 2 confirmations.
state: A=v2, B=v2
step: A and B confirm. C is slow. The write returns success.
step: Client reads from B and C and gets v2 and v1.
state: read=v2 (highest version)
step: Client keeps the highest version, v2.`,
  Bars: `title: KV cache per sequence at 8k context
unit: GB
Llama 3 8B: 1.07
Llama 3 70B: 2.68
70B without GQA: 21.5 (64 KV heads)`,
  Matrix: `title: Causal attention weights
cols: the, cat, sat
the: 1.0, 0, 0
cat: 0.6, 0.4, 0
sat: 0.2, 0.5, 0.3`,
  Anim: `title: Follow a point down a loss curve
axes ax @ 150,100 size: 600x300 x: -3,3 y: 0,10
curve loss on ax = x*x color: blue
dot point @ -2,4 on ax color: green
tangent slope on loss at -2 len: 0.5
num value = 4 @ 480,470 prefix: "Loss: " color: blue
step: Start at x equals negative two, where the loss is four.
  show ax, loss, point, value
step: Draw the tangent to see the direction of the slope.
  show slope
step: Move towards the minimum at zero.
  walk point along loss from -2 to 0
  & tangent slope -> 0
step: The loss falls to zero at the minimum.
  count value -> 0`,
}
let fail = 0
for (const [name, src] of Object.entries(samples)) {
  const mod = await vite.ssrLoadModule(`/src/components/rich/${name}.tsx`)
  const html = renderToString(createElement(mod[name], { src }))
  const ok = html.includes('<figure') && html.length > 300
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name} (${html.length} chars)`)
  if (!ok) { fail++; console.log(html.slice(0, 300)) }
}
// SVG definitions must remain local when multiple explainers share a page.
// A duplicate clip ID can silently crop the wrong scene in the browser.
const { Anim } = await vite.ssrLoadModule('/src/components/rich/Anim.tsx')
const two = renderToString(createElement(Fragment, null,
  createElement(Anim, { src: samples.Anim }), createElement(Anim, { src: samples.Anim })))
const ids = [...two.matchAll(/<(?:filter|radialGradient|clipPath)[^>]*id="([^"]+)"/g)].map((m) => m[1])
assert.equal(ids.length, 8)
assert.equal(new Set(ids).size, ids.length, 'Animation SVG definitions collide')
for (const [, ref] of two.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(ref), `Missing local SVG definition: ${ref}`)
assert.ok(two.includes('Narration is being updated'), 'An unrecorded authoring draft must not play unrelated audio')
assert.ok(two.includes('Start at x equals negative two'), 'Unrecorded drafts retain their readable steps')
assert.ok(!/aria-hidden="true"[^>]*><button/.test(two), 'Interactive buttons are hidden from assistive technology')
console.log('ok   independent animation SVGs, accessible controls, and transcripts')
// Markdown integration: ::: containers become figures via the preprocess step
const { preprocessRich } = await vite.ssrLoadModule('/src/components/rich/index.tsx')
const md = 'Intro.\n\n:::bars\ntitle: t\nA: 1\nB: 2\n:::\n\nAfter.'
const out = preprocessRich(md)
console.log(out.includes('```bars') ? 'ok   preprocess' : 'FAIL preprocess: ' + out)
if (!out.includes('```bars')) fail++
await vite.close()
process.exit(fail)
