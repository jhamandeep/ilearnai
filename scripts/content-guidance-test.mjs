import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { StaticRouter } from 'react-router-dom'
import { readFile } from 'node:fs/promises'

const vite = await createServer({ cacheDir: 'node_modules/.vite-content-check', server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
try {
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { chapterVideoGuides, chapterVideo } = await vite.ssrLoadModule('/src/data/learning/chapterVideos.ts')
  const { ChapterVideos } = await vite.ssrLoadModule('/src/components/ChapterVideos.tsx')
  const { AnimationContext } = await vite.ssrLoadModule('/src/components/LessonGuidance.tsx')
  const { parseAnim } = await vite.ssrLoadModule('/src/components/rich/anim-parse.ts')
  const { firstSectionParagraph, lessonTerms } = await vite.ssrLoadModule('/src/lib/lessonGuidance.ts')
  const { labGuides } = await vite.ssrLoadModule('/src/data/learning/labGuides.ts')
  const { LabContent } = await vite.ssrLoadModule('/src/pages/Labs.tsx')
  const { labs } = await vite.ssrLoadModule('/src/data/labs.ts')
  const { industries } = await vite.ssrLoadModule('/src/data/work/industries.ts')
  const { workExamples } = await vite.ssrLoadModule('/src/data/work/examples.ts')
  const { WorkFlow } = await vite.ssrLoadModule('/src/components/WorkTools.tsx')
  let chapters = 0, lessons = 0, animations = 0, picks = 0, guidedScenes = 0
  const render = (Component, props) => renderToString(createElement(StaticRouter, { location: '/' }, createElement(Component, props)))
  for (const track of tracks) for (const module of track.modules) {
    const key = `${track.slug}/${module.slug}`
    const guide = chapterVideoGuides[key]
    assert.ok(guide, `Missing chapter watch guide: ${key}`)
    assert.ok(guide.picks.length >= 3, `${key}: needs a sequence, not one overview`)
    assert.equal(new Set(guide.picks.map(pick => pick.ref)).size, guide.picks.length, `${key}: duplicate videos`)
    const html = render(ChapterVideos, { track: track.slug, module: module.slug })
    assert.ok(!html.includes('<iframe'), 'Do not load third-party video players before a user chooses one')
    assert.equal((html.match(/class="video-thumbnail"/g) ?? []).length, guide.picks.length, `${key}: every sequence entry needs a visible preview`)
    for (const item of guide.picks) {
      const video = chapterVideo(item.ref)
      assert.ok(video, `${key}: unknown video ${item.ref}`)
      assert.ok(video.kind !== 'channel', `${key}: link a specific video or series`)
      assert.ok(!(video.minutes && video.minutes < 5), `${key}: short orientation is not the chapter sequence`)
      assert.ok(item.focus.length >= 40, `${key}: explain what to watch for`)
      assert.ok(html.includes(video.url.replaceAll('&', '&amp;')), `${key}: missing video link`)
      if (video.id) assert.ok(html.includes(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`), `${key}: thumbnail must match the selected recording`)
      if (video.id && video.embeddable !== false) assert.ok(html.includes(`aria-label="Play ${video.title.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')} here"`), `${key}: preview must play here rather than navigate away`)
      if (video.embeddable === false) assert.ok(html.includes('Open on YouTube'))
      picks++
    }
    assert.ok(html.includes(guide.practice.replaceAll('&', '&amp;').replaceAll('’', '’')))
    chapters++
    for (const lesson of module.lessons) {
      const example = firstSectionParagraph(lesson.body, 'The idea with an example')
      assert.ok(example.length > 25, `${key}/${lesson.slug}: missing concrete context`)
      assert.ok(!example.includes(':::'), `${key}/${lesson.slug}: context must not duplicate activity blocks`)
      assert.ok(lessonTerms(lesson).length, `${key}/${lesson.slug}: no readable term definitions`)
      const context = render(AnimationContext, { lesson, route: `/courses/${key}/${lesson.slug}` })
      assert.ok(context.includes('Read the full explanation'))
      for (const [, src] of lesson.body.matchAll(/^\s*:::anim\s*\n([\s\S]*?)^\s*:::\s*$/gm)) {
        const scene = parseAnim(src)
        assert.deepEqual(scene.errors, [], `${key}/${lesson.slug}: invalid explainer`)
        if (scene.context) { assert.ok(scene.focus && scene.takeaway); guidedScenes++ }
        animations++
      }
      lessons++
    }
  }
  assert.equal(chapters, Object.keys(chapterVideoGuides).length, 'No orphan chapter guides')
  for (const lab of labs) {
    const guide = labGuides[lab.slug]
    assert.ok(guide, `${lab.slug}: missing guided experiment`)
    assert.equal(guide.steps.length, 3)
    for (const field of ['idea', 'relate', 'watch', 'example', 'meaning', 'limit', 'question', 'answer']) assert.ok(guide[field].length > 30, `${lab.slug}: missing ${field}`)
    const html = render(LabContent, { slug: lab.slug })
    assert.ok(html.includes('What you are looking at') && html.includes('Make sense of the result'), `${lab.slug}: guidance missing at a lab entry point`)
  }
  let cases = 0
  for (const industry of industries) for (const item of industry.cases) {
    const key = `${industry.slug}/${item.slug}`
    const example = workExamples[key]
    assert.ok(example, `${key}: missing worked example`)
    for (const field of ['input', 'draft', 'review', 'outcome', 'lesson', 'question', 'answer']) assert.ok(example[field].length > 25, `${key}: incomplete ${field}`)
    const html = render(WorkFlow, { industrySlug: industry.slug, item })
    for (const text of Object.values(example)) assert.ok(html.includes(text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')), `${key}: example unavailable in static walkthrough`)
    assert.ok(html.includes('Play with narration'), `${key}: start with reader-controlled playback`)
    cases++
  }
  assert.equal(cases, Object.keys(workExamples).length)
  const sample = parseAnim('title: Example\ncontext: A useful task.\nfocus: Watch the value.\ntakeaway: Check the result.\nnum value = 0 @ 120,120\nstep: Show the value.\nexplain: This is the starting point.\n show value\nstep: Change the value.\n count value -> 2')
  assert.deepEqual(sample.errors, [])
  assert.equal(sample.steps[0].explanation, 'This is the starting point.')
  assert.equal(sample.steps[1].explanation, undefined, 'Explanation must not leak to the next scene')
  const added = JSON.parse(await readFile(new URL('../src/data/chapterSourceVideos.json', import.meta.url)))
  assert.equal(new Set(added.map(video => video.id)).size, added.length)
  assert.ok(added.every(video => video.sourceUrl && video.verifiedOn && /^[\w-]{11}$/.test(video.id)))
  console.log(`PASS: ${lessons} lesson contexts, ${animations} explainers (${guidedScenes} with authored focus/takeaway), ${chapters} chapter sequences with ${picks} picks, ${added.length} added videos, ${labs.length} lab guides, ${cases} concrete work examples.`)
} finally { await vite.close() }
