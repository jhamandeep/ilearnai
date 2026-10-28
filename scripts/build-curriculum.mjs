import { createServer } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
try {
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { lessonActivities } = await vite.ssrLoadModule('/src/lib/activities.ts')
  const catalog = tracks.map((track) => ({ ...track, modules: track.modules.map((module) => ({ ...module, lessons: module.lessons.map((lesson) => ({ ...lesson, body: '', activities: lessonActivities(lesson, `/courses/${track.slug}/${module.slug}/${lesson.slug}`).map(({ id, kind, title }) => ({ id, kind, title })) })) })) }))
  await mkdir(new URL('../server/content/', import.meta.url), { recursive: true })
  await writeFile(new URL('../server/content/curriculum.json', import.meta.url), JSON.stringify(tracks))
  await writeFile(new URL('../src/data/tracks-catalog.json', import.meta.url), JSON.stringify(catalog, null, 2) + '\n')
  console.log(`Curriculum prepared: ${tracks.length} public course outlines; lesson bodies remain server-side.`)
} finally { await vite.close() }
