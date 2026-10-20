import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { StaticRouter, Routes, Route } from 'react-router-dom'

const root = process.argv[2]
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { Layout } = await vite.ssrLoadModule('/src/components/Layout.tsx')
const pages = {
  '/': ['/src/pages/Home.tsx', 'Home'],
  '/courses': ['/src/pages/Courses.tsx', 'Courses'],
  '/courses/ai-research': ['/src/pages/Courses.tsx', 'TrackPage', { track: 'ai-research' }],
  '/courses/ai-research/transformers/why-attention': ['/src/pages/Lesson.tsx', 'LessonPage'],
  '/papers': ['/src/pages/Papers.tsx', 'Papers'],
  '/papers/flash-attention': ['/src/pages/Papers.tsx', 'PaperPage'],
  '/glossary': ['/src/pages/Glossary.tsx', 'Glossary'],
  '/glossary/kv-cache': ['/src/pages/Glossary.tsx', 'TermPage'],
  '/labs': ['/src/pages/Labs.tsx', 'Labs'],
  '/labs/kv-cache': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/agent-control-room': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/capacity': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/sampling': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/gradient-descent': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/attention': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/tokenizer': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/transformer-flow': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/pareto-router': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/timeout-architect': ['/src/pages/Labs.tsx', 'LabPage'],
  '/blog': ['/src/pages/Blog.tsx', 'Blog'],
  '/blog/__first__': ['/src/pages/Blog.tsx', 'BlogPost'],
  '/knowledge-graph': ['/src/pages/Topography.tsx', 'Topography'],
  '/hierarchy': ['/src/pages/Hierarchy.tsx', 'Hierarchy'],
  '/resources': ['/src/pages/Resources.tsx', 'Resources'],
  '/roadmaps': ['/src/pages/Roadmaps.tsx', 'Roadmaps'],
  '/videos': ['/src/pages/Videos.tsx', 'Videos'],
  '/style': ['/src/pages/StyleGuide.tsx', 'StyleGuide'],
  '/labs/ste-checker': ['/src/pages/Labs.tsx', 'LabPage'],
}
let fail = 0
const { posts } = await vite.ssrLoadModule('/src/data/blog.ts')
for (let [path, [file, name]] of Object.entries(pages)) {
  if (path === '/blog/__first__') path = '/blog/' + posts[0].slug
  try {
    const mod = await vite.ssrLoadModule(file)
    const Page = mod[name]
    const html = renderToString(
      createElement(StaticRouter, { location: path },
          createElement(Routes, null,
            createElement(Route, { element: createElement(Layout) },
              createElement(Route, { path: '/courses/:track/:module/:lesson', element: createElement(Page) }),
              createElement(Route, { path: '/courses/:track', element: createElement(Page) }),
              createElement(Route, { path: '/papers/:slug', element: createElement(Page) }),
              createElement(Route, { path: '/glossary/:slug', element: createElement(Page) }),
              createElement(Route, { path: '/labs/:slug', element: createElement(Page) }),
              createElement(Route, { path: '/blog/:slug', element: createElement(Page) }),
              createElement(Route, { path: '*', element: createElement(Page) }),
            )))
    )
    const notFound = html.includes('That page does not exist')
    const katex = html.includes('class="katex')
    const gate = false
    console.log(`${notFound ? 'FAIL' : 'ok  '} ${path}  (${html.length} chars${katex ? ', katex' : ''}${gate ? ', gated' : ''})`)
    if (notFound) fail++
  } catch (e) {
    fail++
    console.log(`FAIL ${path}: ${e.message.split('\n')[0]}`)
  }
}
// Link integrity: every roadmap item and graph edge must resolve.
const { roadmaps } = await vite.ssrLoadModule('/src/data/roadmaps.ts')
const { nodes, edges } = await vite.ssrLoadModule('/src/data/graph.ts')
const { tracks } = await vite.ssrLoadModule('/src/data/tracks.ts')
const { papers } = await vite.ssrLoadModule('/src/data/papers.ts')
const { labs } = await vite.ssrLoadModule('/src/data/labs.ts')
const { glossary } = await vite.ssrLoadModule('/src/data/glossary.ts')
const routes = new Set()
for (const t of tracks) for (const m of t.modules) for (const l of m.lessons) routes.add(`/courses/${t.slug}/${m.slug}/${l.slug}`)
for (const p of papers) routes.add(`/papers/${p.slug}`)
for (const l of labs) routes.add(`/labs/${l.slug}`)
for (const g of glossary) routes.add(`/glossary/${g.slug}`)
for (const p of posts) routes.add(`/blog/${p.slug}`)
let bad = 0
for (const r of roadmaps) for (const s of r.stages) for (const it of s.items) if (!routes.has(it.to)) { bad++; console.log(`BAD roadmap link ${it.to}`) }
for (const n of nodes) if (n.to && !routes.has(n.to)) { bad++; console.log(`BAD graph link ${n.id} -> ${n.to}`) }
const ids = new Set(nodes.map((n) => n.id))
for (const e of edges) if (!ids.has(e.source) || !ids.has(e.target)) { bad++; console.log(`BAD edge ${e.source} -> ${e.target}`) }
for (const p of papers) for (const q of p.prereqs ?? []) if (!papers.some((x) => x.slug === q)) { bad++; console.log(`BAD prereq ${p.slug} -> ${q}`) }
for (const g of glossary) for (const r of g.related) if (!glossary.some((x) => x.slug === r)) { bad++; console.log(`BAD related ${g.slug} -> ${r}`) }
console.log(bad ? `${bad} broken links` : 'all internal links resolve')
fail += bad
await vite.close()
process.exit(fail ? 1 : 0)
