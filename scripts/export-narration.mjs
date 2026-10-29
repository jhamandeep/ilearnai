import { createServer } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'

export async function collectNarration(vite) {
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { parseAnim } = await vite.ssrLoadModule('/src/components/rich/anim-parse.ts')
  const { narrationKey } = await vite.ssrLoadModule('/src/lib/narration.ts')
  const { workExplainerScene, labExplainerScene } = await vite.ssrLoadModule('/src/lib/explainerScenes.ts')
  const { industries } = await vite.ssrLoadModule('/src/data/work/industries.ts')
  const { labs } = await vite.ssrLoadModule('/src/data/labs.ts')
  const entries = new Map()
  const add = (src, route, group) => {
    const scene = parseAnim(src), key = narrationKey(src)
    assert.deepEqual(scene.errors, [], `${route}: invalid animation`)
    assert.ok(scene.steps.length, `${route}: empty animation`)
    if (entries.has(key)) { assert.equal(entries.get(key).source.trim(), src.trim(), 'Source hash collision'); entries.get(key).routes.push(route); return }
    entries.set(key, { key, title: scene.title, group, routes: [route], source: src, texts: scene.steps.map(step => step.explanation ? `${step.text.replace(/[.!?]$/, '')}. ${step.explanation}` : step.text) })
  }
  for (const track of tracks) for (const module of track.modules) for (const lesson of module.lessons) {
    const blocks = [...lesson.body.matchAll(/^[ \t]*:::anim[ \t]*\n([\s\S]*?)^[ \t]*:::[ \t]*$/gm)]
    assert.ok(blocks.length, `Missing lesson animation: ${lesson.slug}`)
    for (const [, src] of blocks) add(src, `/courses/${track.slug}/${module.slug}/${lesson.slug}`, track.slug)
  }
  for (const industry of industries) for (const item of industry.cases) add(workExplainerScene(industry.slug, item), `/for-work/${industry.slug}/${item.slug}`, 'for-work')
  for (const lab of labs) add(labExplainerScene(lab.slug, lab.title), `/labs/${lab.slug}`, 'labs')
  const style = await readFile(new URL('../src/pages/StyleGuide.tsx', import.meta.url), 'utf8')
  for (const [, src] of style.matchAll(/:::anim\n([\s\S]*?)\n:::/g)) add(src, '/style', 'style')
  return [...entries.values()]
}

if (process.argv[1]?.endsWith('export-narration.mjs')) {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
  try {
    const entries = await collectNarration(vite)
    await mkdir('output/narration', { recursive: true })
    await writeFile('output/narration/scripts.json', JSON.stringify(entries, null, 2) + '\n')
    console.log(`${entries.length} unique explainers; ${entries.reduce((n, entry) => n + entry.texts.length, 0)} spoken scenes.`)
    console.log(Object.fromEntries([...new Set(entries.map(e => e.group))].map(group => [group, entries.filter(e => e.group === group).length])))
  } finally { await vite.close() }
}
