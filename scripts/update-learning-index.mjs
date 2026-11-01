// Keep the GitHub learning hub aligned with the checked-in course catalog.
import { readFile, writeFile, access } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const catalog = JSON.parse(await readFile(new URL('src/data/tracks-catalog.json', root), 'utf8'))
const target = new URL('docs/learning-paths.md', root)
const exists = async path => access(new URL(path, root)).then(() => true, () => false)
const cell = value => value.replaceAll('|', '\\|').replaceAll('\n', ' ')
const chapters = catalog.flatMap(track => track.modules)
const lessons = chapters.flatMap(chapter => chapter.lessons)
const lines = [
  `**${catalog.length} tracks · ${chapters.length} chapters · ${lessons.length} lessons**`,
]
for (const track of catalog) {
  const trackPath = `src/data/tracks/${track.slug}.ts`
  if (!await exists(trackPath)) throw new Error(`Missing source: ${trackPath}`)
  lines.push(
    '',
    `<a id="${track.slug}"></a>`,
    '',
    `### ${track.title}`,
    '',
    `**Level:** ${track.level}. **Outcome:** ${track.outcome}`,
    '',
    `[Track source](../${trackPath}) · Local app route: \`/courses/${track.slug}\``,
    '',
    '| Chapter | Lessons |',
    '| --- | --- |',
  )
  for (const chapter of track.modules) {
    const chapterPath = `src/data/tracks/${track.slug}/${chapter.slug}.ts`
    const source = await exists(chapterPath) ? chapterPath : trackPath
    lines.push(`| [${cell(chapter.title)}](../${source}) | ${chapter.lessons.length} |`)
  }
}
const original = await readFile(target, 'utf8')
const start = '<!-- curriculum:start -->'
const end = '<!-- curriculum:end -->'
const startIndex = original.indexOf(start)
const endIndex = original.indexOf(end)
if (startIndex < 0 || endIndex <= startIndex) throw new Error('Curriculum markers are missing or out of order.')
const updated = original.slice(0, startIndex + start.length) + '\n\n' + lines.join('\n') + '\n\n' + original.slice(endIndex)
if (process.argv.includes('--check')) {
  if (updated !== original) throw new Error('Chapter index is stale. Run node scripts/update-learning-index.mjs')
  console.log(`Learning index verified: ${catalog.length} tracks, ${chapters.length} chapters, ${lessons.length} lessons.`)
} else {
  await writeFile(target, updated)
  console.log('Updated docs/learning-paths.md from the course catalog.')
}
