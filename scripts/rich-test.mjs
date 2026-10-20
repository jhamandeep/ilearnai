import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
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
}
let fail = 0
for (const [name, src] of Object.entries(samples)) {
  const mod = await vite.ssrLoadModule(`/src/components/rich/${name}.tsx`)
  const html = renderToString(createElement(mod[name], { src }))
  const ok = html.includes('<figure') && html.length > 300
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name} (${html.length} chars)`)
  if (!ok) { fail++; console.log(html.slice(0, 300)) }
}
// Markdown integration: ::: containers become figures via the preprocess step
const { preprocessRich } = await vite.ssrLoadModule('/src/components/rich/index.tsx')
const md = 'Intro.\n\n:::bars\ntitle: t\nA: 1\nB: 2\n:::\n\nAfter.'
const out = preprocessRich(md)
console.log(out.includes('```bars') ? 'ok   preprocess' : 'FAIL preprocess: ' + out)
await vite.close()
process.exit(fail)
