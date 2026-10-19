import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { StaticRouter, Routes, Route } from 'react-router-dom'

const root = process.argv[2]
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { AuthProvider } = await vite.ssrLoadModule('/src/lib/auth.tsx')
const { Layout } = await vite.ssrLoadModule('/src/components/Layout.tsx')
const pages = {
  '/': ['/src/pages/Home.tsx', 'Home'],
  '/courses': ['/src/pages/Courses.tsx', 'Courses'],
  '/courses/ai-research': ['/src/pages/Courses.tsx', 'TrackPage', { track: 'ai-research' }],
  '/courses/ai-research/transformers/why-attention': ['/src/pages/Lesson.tsx', 'LessonPage'],
  '/courses/ai-research/transformers/positional-encodings': ['/src/pages/Lesson.tsx', 'LessonPage'],
  '/papers': ['/src/pages/Papers.tsx', 'Papers'],
  '/papers/flash-attention': ['/src/pages/Papers.tsx', 'PaperPage'],
  '/glossary': ['/src/pages/Glossary.tsx', 'Glossary'],
  '/glossary/kv-cache': ['/src/pages/Glossary.tsx', 'TermPage'],
  '/labs': ['/src/pages/Labs.tsx', 'Labs'],
  '/labs/kv-cache': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/agent-control-room': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/capacity': ['/src/pages/Labs.tsx', 'LabPage'],
  '/labs/sampling': ['/src/pages/Labs.tsx', 'LabPage'],
  '/pricing': ['/src/pages/Pricing.tsx', 'Pricing'],
  '/signin': ['/src/pages/SignIn.tsx', 'SignIn'],
}
let fail = 0
for (const [path, [file, name]] of Object.entries(pages)) {
  try {
    const mod = await vite.ssrLoadModule(file)
    const Page = mod[name]
    const html = renderToString(
      createElement(AuthProvider, null,
        createElement(StaticRouter, { location: path },
          createElement(Routes, null,
            createElement(Route, { element: createElement(Layout) },
              createElement(Route, { path: '/courses/:track/:module/:lesson', element: createElement(Page) }),
              createElement(Route, { path: '/courses/:track', element: createElement(Page) }),
              createElement(Route, { path: '/papers/:slug', element: createElement(Page) }),
              createElement(Route, { path: '/glossary/:slug', element: createElement(Page) }),
              createElement(Route, { path: '/labs/:slug', element: createElement(Page) }),
              createElement(Route, { path: '*', element: createElement(Page) }),
            ))))
    )
    const notFound = html.includes('That page does not exist')
    const katex = html.includes('class="katex')
    const gate = html.includes('part of Pro')
    console.log(`${notFound ? 'FAIL' : 'ok  '} ${path}  (${html.length} chars${katex ? ', katex' : ''}${gate ? ', gated' : ''})`)
    if (notFound) fail++
  } catch (e) {
    fail++
    console.log(`FAIL ${path}: ${e.message.split('\n')[0]}`)
  }
}
await vite.close()
process.exit(fail ? 1 : 0)
