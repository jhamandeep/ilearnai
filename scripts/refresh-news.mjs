import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { aggregateNews } from '../server/news.mjs'

const sourceFile = new URL('../src/data/news-snapshot.json', import.meta.url)
let previous
try { previous = JSON.parse(await readFile(sourceFile, 'utf8')) } catch { previous = { items: [], sources: [], updatedAt: null } }
const payload = await aggregateNews({ previous })
if (!payload.items.length || payload.status === 'cached') {
  if (process.argv.includes('--offline-ok') && previous.items.length) { console.log('RSS: keeping the last successful snapshot.'); process.exit(0) }
  throw new Error('No RSS source refreshed. Existing snapshot was kept.')
}
const json = JSON.stringify(payload, null, 2) + '\n'
await mkdir(new URL('../public/', import.meta.url), { recursive: true })
await writeFile(sourceFile, json)
await writeFile(new URL('../public/ai-news.json', import.meta.url), json)
console.log(`RSS: ${payload.items.length} headlines; ${payload.sources.filter((source) => source.status === 'fresh').length}/${payload.sources.length} sources refreshed.`)
for (const source of payload.sources) console.log(`${source.name}: ${source.status}`)
