import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
const oldFetch = globalThis.fetch
try {
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { lessonActivities } = await vite.ssrLoadModule('/src/lib/activities.ts')
  const catalog = JSON.parse(await readFile(new URL('../src/data/tracks-catalog.json', import.meta.url), 'utf8'))
  let activityCount = 0
  for (const track of tracks) for (const module of track.modules) for (const lesson of module.lessons) {
    const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`
    const list = lessonActivities(lesson, route)
    const outline = catalog.find(t => t.slug === track.slug).modules.find(m => m.slug === module.slug).lessons.find(l => l.slug === lesson.slug)
    assert.equal(outline.body, '', 'Public catalogue must not contain lesson content')
    assert.deepEqual(list.map(({ id, kind, title }) => ({ id, kind, title })), outline.activities, `${route}: public outline differs from activities`)
    assert.equal(new Set(list.map(a => a.id)).size, list.length, `${route}: duplicate activity IDs`)
    // Reconstitute the original authored reading and all moved interactive blocks.
    let restored = list[0].body
    for (const activity of list.filter(a => ['animation', 'video', 'quiz', 'exercise'].includes(a.kind))) {
      const escaped = `${route}/${activity.id}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      restored = restored.replace(new RegExp(`\\n\\n\\[[^\\n]*\\]\\(${escaped}\\)\\n\\n`), () => activity.body)
    }
    assert.equal(restored, lesson.body, `${route}: original content was altered or lost`)
    assert.deepEqual(list.filter(a => a.kind === 'quiz').map(a => a.quizIndex), list.filter(a => a.kind === 'quiz').map((_, i) => i), `${route}: changed quiz score keys`)
    activityCount += list.length
  }
  const p = await vite.ssrLoadModule('/src/lib/progress.ts')
  const memory = new Map()
  p.setProgressStore({ get: key => memory.get(key) ?? null, set: (key, value) => memory.set(key, value), remove: key => memory.delete(key), keys: () => [...memory.keys()] })
  const route = '/courses/test/module/lesson', ids = ['reading', 'animation-1', 'quiz-1', 'resources']
  p.setActivityDone(route, ids[0], true, ids)
  assert.equal(p.isActivityDone(route, ids[0]), true)
  assert.equal(p.isDone(route), false, 'A partial lesson must remain incomplete')
  ids.slice(1).forEach(id => p.setActivityDone(route, id, true, ids))
  assert.equal(p.isDone(route), true)
  p.setDone('/courses/other/module/lesson', true)
  p.setActivityDone(route, 'quiz-1', false, ids)
  assert.equal(p.isDone(route), false)
  assert.equal(p.isActivityDone(route, 'reading'), true)
  assert.equal(p.isDone('/courses/other/module/lesson'), true)
  memory.clear(); p.setDone(route, true)
  assert.ok(ids.every(id => p.isActivityDone(route, id)), 'Preserve legacy completed lessons')
  p.setActivityDone(route, 'reading', true, ids)
  assert.equal(p.isDone(route), true, 'Marking an already-complete legacy activity must be idempotent')
  p.setActivityDone(route, 'reading', false, ids)
  assert.equal(p.isDone(route), false)
  assert.ok(ids.slice(1).every(id => p.isActivityDone(route, id)), 'Reopening a legacy activity must preserve the others')
  memory.clear()

  const { answerSiteQuestion } = await vite.ssrLoadModule('/src/lib/siteHelp.ts')
  const { glossary } = await vite.ssrLoadModule('/src/data/glossary.ts')
  const { labs } = await vite.ssrLoadModule('/src/data/labs.ts')
  const valid = new Set(['/certifications', '/ai-infrastructure', '/ai-infrastructure#choose-system', '/code', '/for-work', '/for-work#compare', '/for-work#estimate', '/courses', '/path', '/practice', '/practice/placement', '/dashboard', '/signup', '/login', '/videos', '/labs', '/resources', '/papers', '/hub', '/glossary'])
  const { industries } = await vite.ssrLoadModule('/src/data/work/industries.ts')
  industries.forEach(industry => { valid.add(`/for-work/${industry.slug}`); industry.cases.forEach(item => valid.add(`/for-work/${industry.slug}/${item.slug}`)) })
  tracks.forEach(t => { valid.add(`/courses/${t.slug}`); t.modules.forEach(m => m.lessons.forEach(l => valid.add(`/courses/${t.slug}/${m.slug}/${l.slug}`))) })
  glossary.forEach(t => valid.add(`/glossary/${t.slug}`)); labs.forEach(l => valid.add(`/labs/${l.slug}`))
  globalThis.fetch = () => { throw new Error('Static Ask must not call a service') }
  for (const [question, kind, link] of [
    ['Where should I start?', 'help', '/courses/start-here'],
    ['Which certification suits a banking manager?', 'help', '/certifications'],
    ['What computer do I need?', 'help', '/ai-infrastructure#choose-system'],
    ['Explain AI infrastructure', 'help', '/ai-infrastructure'],
    ['How is my progress saved?', 'help', '/dashboard'],
    ['What is attention?', 'topic', '/glossary/attention'],
    ['Where can I find videos?', 'help', '/videos'],
    ['How do I complete a lesson?', 'help', '/courses'],
    ['What is RAG?', 'topic', '/glossary/rag'],
    ['What is an LLM?', 'topic', '/glossary/large-language-model'],
    ['How do I reset my password?', 'help', '/login'],
    ['Where is the tokenizer lab?', 'topic', '/labs/tokenizer'],
    ['What is the weather in Tokyo?', 'fallback', '/courses'],
    ['How does Ask ilearnai work?', 'help', '/glossary'],
  ]) {
    const answer = answerSiteQuestion(question)
    assert.equal(answer.kind, kind, question)
    assert.ok(answer.links.some(item => item.to === link), `${question}: missing ${link}`)
    assert.ok(answer.links.every(item => valid.has(item.to.split('?')[0])), `${question}: broken answer link`)
  }
  assert.notEqual(answerSiteQuestion('What is computer vision?').title, 'Choose a computer for AI')
  assert.ok(answerSiteQuestion('What is RAG?').links.every(link => !link.to.includes('math-from-zero')), 'RAG must not match fragments inside unrelated words')
  for (const question of [...glossary.map(t => `What is ${t.term}?`), ...tracks.map(t => t.title), ...labs.map(l => l.title)]) assert.ok(answerSiteQuestion(question).links.every(link => valid.has(link.to.split('?')[0])), `Broken help link: ${question}`)
  globalThis.fetch = oldFetch

  const { Courses, courseMinutes } = await vite.ssrLoadModule('/src/pages/Courses.tsx')
  const { Ask } = await vite.ssrLoadModule('/src/pages/Ask.tsx')
  const { CourseArtwork } = await vite.ssrLoadModule('/src/components/CourseArtwork.tsx')
  const render = (Component, url, props) => renderToString(createElement(StaticRouter, { location: url }, createElement(Component, props)))
  const count = (html, kind) => [...html.matchAll(new RegExp(`data-catalogue-kind="${kind}"`, 'g'))].length
  const first = tracks[0], firstModule = first.modules[0], firstLesson = firstModule.lessons[0]
  const firstRoute = `/courses/${first.slug}/${firstModule.slug}/${firstLesson.slug}`
  p.setActivityDone(firstRoute, 'reading', true, lessonActivities(firstLesson, firstRoute).map(a => a.id))
  const partial = render(Courses, '/courses')
  assert.match(partial, /activity progress/); assert.match(partial, /Continue learning/)
  memory.clear()
  const all = render(Courses, '/courses')
  assert.equal(count(all, 'course'), tracks.length); assert.equal(count(all, 'lab'), labs.length)
  assert.equal(count(render(Courses, '/courses?format=lab'), 'course'), 0)
  assert.equal(count(render(Courses, '/courses?format=course'), 'lab'), 0)
  for (const level of new Set(tracks.map(t => t.level))) assert.equal(count(render(Courses, `/courses?level=${level}`), 'course'), tracks.filter(t => t.level === level).length)
  for (const duration of ['short', 'long']) assert.equal(count(render(Courses, `/courses?duration=${duration}`), 'course'), tracks.filter(t => duration === 'short' ? courseMinutes(t) < 300 : courseMinutes(t) >= 300).length)
  assert.match(render(Courses, '/courses?q=zzzznomatch'), /No matches yet/)
  assert.match(render(Ask, '/ask?q=What%20is%20attention%3F'), /From the glossary/)
  const unsafe = render(Ask, '/ask?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E')
  assert.ok(!unsafe.includes('<script>alert(1)</script>'), 'Questions must render as escaped text')
  const artwork = new Set()
  for (const track of tracks) {
    const html = render(CourseArtwork, '/', { seed: track.order })
    const source = html.match(/<img[^>]*src="([^"]+)"/)[1]
    artwork.add(source)
    await access(new URL(`../public${source}`, import.meta.url))
  }
  assert.equal(artwork.size, tracks.length, 'Each course needs distinct artwork')
  console.log(`Learning flow passed: ${activityCount} lossless activities, matching public outlines, stable quiz keys, completion migration, static Ask answers and links, catalogue filters, and ${artwork.size} distinct course images.`)
} finally { globalThis.fetch = oldFetch; await vite.close() }
