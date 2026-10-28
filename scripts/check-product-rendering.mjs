// Await lazy blocks, unlike renderToString, then check the complete lesson page.
import assert from 'node:assert/strict'
import { Writable } from 'node:stream'
import { createElement } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter, Routes, Route } from 'react-router-dom'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
const render = (element) => new Promise((resolve, reject) => {
  const chunks = []
  const output = new Writable({ write(chunk, _encoding, next) { chunks.push(chunk); next() } })
  output.on('error', reject)
  output.on('finish', () => resolve(Buffer.concat(chunks).toString()))
  const stream = renderToPipeableStream(element, { onAllReady() { stream.pipe(output) }, onError: reject })
})
const preview = process.argv.includes('--preview')
let authContext, accessGate
const page = (Component, path, route = '*') => render(createElement(StaticRouter, { location: path }, createElement(Routes, null, createElement(Route, { path: route, element: authContext ? createElement(authContext.Provider, { value: { preview, user: preview ? null : { id: 'audit', name: 'Learner', email: 'audit@example.test' }, loading: false, syncStatus: 'saved', serviceError: '' } }, createElement(accessGate, null, createElement(Component))) : createElement(Component) }))))

const { tracks: fullTracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
const { replaceTracks } = await vite.ssrLoadModule('/src/data/tracks.ts')
replaceTracks(fullTracks)
try {
  const { tracks } = await vite.ssrLoadModule('/src/data/tracks.ts')
  const auth = await vite.ssrLoadModule('/src/lib/auth.tsx')
  authContext = auth.AuthContext; accessGate = auth.RequireAuth
  const { LessonPage } = await vite.ssrLoadModule('/src/pages/Lesson.tsx')
  const { lessonActivities } = await vite.ssrLoadModule('/src/lib/activities.ts')
  const { Videos } = await vite.ssrLoadModule('/src/pages/Videos.tsx')
  const { Resources } = await vite.ssrLoadModule('/src/pages/Resources.tsx')
  const { Home } = await vite.ssrLoadModule('/src/pages/Home.tsx')
  const { LabPage } = await vite.ssrLoadModule('/src/pages/Labs.tsx')
  const { labs } = await vite.ssrLoadModule('/src/data/labs.ts')
  const { NewsTicker } = await vite.ssrLoadModule('/src/components/NewsTicker.tsx')
  const { videos } = await vite.ssrLoadModule('/src/data/videos.ts')
  const { resources, tools } = await vite.ssrLoadModule('/src/data/resources.ts')
  const { groupLibrary } = await vite.ssrLoadModule('/src/lib/library.ts')
  const { levelOrder } = await vite.ssrLoadModule('/src/data/types.ts')
  let lessons = 0, blocks = 0, activityPages = 0
  const kinds = ['flow', 'arch', 'timeline', 'scenario', 'bars', 'matrix', 'code', 'exercise', 'quiz', 'video', 'graph', 'anim']
  for (const track of tracks) {
    for (const module of track.modules) for (const lesson of module.lessons) {
      const url = `/courses/${track.slug}/${module.slug}/${lesson.slug}`
      const overview = await page(LessonPage, url, '/courses/:track/:module/:lesson')
      assert.ok(overview.includes('lesson-study-tools') && overview.includes('Why this idea matters') && overview.includes('An example from this lesson'), `${url}: missing shared lesson experience`)
      const list = lessonActivities(lesson, url)
      const rendered = []
      for (const activity of list) {
        const activityUrl = `${url}/${activity.id}`
        assert.ok(overview.includes(`href="${activityUrl}"`), `${url}: missing activity link ${activity.id}`)
        const content = await page(LessonPage, activityUrl, '/courses/:track/:module/:lesson/:activity')
        assert.ok(!content.includes('That page does not exist'), `${activityUrl}: missing activity page`)
        assert.ok(content.includes('lesson-study-tools'), `${activityUrl}: missing study tools`)
        if (activity.kind === 'animation') assert.ok(content.includes('Watch with this goal') && content.includes('What to avoid concluding'), `${activityUrl}: missing animation guidance`)
        const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
        assert.equal(ids.length, new Set(ids).size, `${activityUrl}: duplicate SVG/DOM ids`)
        for (const [, id] of content.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(id), `${activityUrl}: unresolved SVG reference ${id}`)
        for (const [, pending] of content.matchAll(/<template id="(B:[^"]+)"/g)) assert.ok(content.includes(`id="${pending.replace(/^B:/, 'S:')}"`), `${activityUrl}: unresolved lazy boundary ${pending}`)
        rendered.push(content)
        activityPages++
      }
      const html = rendered.join('\n')
      for (const kind of kinds) {
        const expected = [...lesson.body.matchAll(new RegExp(`^[ \\t]*:::${kind}[ \\t]*$`, 'gm'))].length
        const actual = [...html.matchAll(new RegExp(`<figure class="rich rich-${kind}(?:[ "])(?![a-z])`, 'g'))].length
        assert.ok(actual >= expected, `${url}: ${kind} rendered ${actual}/${expected}`)
        blocks += expected
      }
      // React's streamed output can retain a fallback plus its replacement.
      // Verify that every pending boundary has its completed replacement.
      for (const [, pending] of html.matchAll(/<template id="(B:[^"]+)"/g)) assert.ok(html.includes(`id="${pending.replace(/^B:/, 'S:')}"`), `${url}: unresolved lazy boundary ${pending}`)
      assert.ok(html.includes('id="further-learning"'), `${url}: missing categorized lesson sources`)
      for (const link of lesson.links) {
        const escaped = link.url.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
        assert.ok(html.includes(`href="${escaped}"`), `${url}: missing source ${link.url}`)
      }
      for (const [, diagram] of html.matchAll(/<figure class="rich rich-(?:flow|arch)"[\s\S]*?>([\s\S]*?)<\/figure>/g)) {
        const [, box] = diagram.match(/viewBox="([^"]+)"/) ?? []
        assert.ok(box, `${url}: diagram has no viewBox`)
        const [left, top, width, height] = box.split(/\s+/).map(Number)
        const nodes = [...diagram.matchAll(/<g[^>]*transform="translate\(([-\d.]+),([-\d.]+)\)"[^>]*class="ra-box[^>]*>\s*<rect width="([\d.]+)" height="([\d.]+)"/g)]
        assert.ok(nodes.length, `${url}: diagram contains no visible boxes`)
        for (const [, sx, sy, sw, sh] of nodes) {
          const [x, y, w, h] = [sx, sy, sw, sh].map(Number)
          assert.ok(x >= left && y >= top && x + w <= left + width && y + h <= top + height, `${url}: flow/architecture block is cropped outside its viewBox`)
        }
      }
      lessons++
    }
    console.log(`ok   ${track.slug}: every lesson block, SVG reference, and source link renders`)
  }
  for (const [Component, url, items] of [[Videos, '/videos', videos], [Resources, '/resources', [...resources, ...tools]]]) {
    const flattened = groupLibrary(items).flatMap((group) => group.tracks.flatMap((track) => track.topics.flatMap((topic) => topic.items)))
    assert.equal(flattened.length, items.length, `${url}: catalogue entries lost during categorization`)
    assert.deepEqual(new Set(flattened), new Set(items), `${url}: catalogue membership changed`)
    for (const track of ['all', ...tracks.map((item) => item.slug)]) {
      for (const level of ['all', ...levelOrder]) {
        const expected = items.filter((item) => (track === 'all' || item.track === track) && (level === 'all' || item.level === level))
        const html = await page(Component, `${url}?track=${track}&level=${level}`)
        const matches = [...html.matchAll(/data-resource-track="([^"]+)" data-resource-level="([^"]+)"/g)]
        assert.equal(matches.length, expected.length, `${url}: wrong result count for ${track}/${level}`)
        for (const [, resultTrack, resultLevel] of matches) {
          assert.ok(track === 'all' || track === resultTrack)
          assert.ok(level === 'all' || level === resultLevel)
        }
      }
    }
    for (const kind of new Set(items.map((item) => item.kind))) {
      const html = await page(Component, `${url}?kind=${kind}`)
      assert.equal((html.match(/data-resource-track=/g) ?? []).length, items.filter((item) => item.kind === kind).length, `${url}: broken ${kind} filter`)
    }
    console.log(`ok   ${url}: ${items.length} entries; all track, level, and type filters preserve membership`)
  }
  const home = await page(Home, '/')
  assert.ok(home.includes('Rosenbrock valley') && home.includes('Optimiser') && home.includes('<canvas'), 'Home must embed the actual gradient descent lab')
  assert.ok(!home.includes('Gradient descent, in motion'), 'Home still uses the simplified replacement')
  for (const lab of labs) {
    const html = await page(LabPage, `/labs/${lab.slug}`, '/labs/:slug')
    assert.ok(html.includes('data-lab-visual='), `${lab.slug}: missing interactive result visual`)
    assert.ok(!/NaN|Infinity/.test(html), `${lab.slug}: invalid numeric result`)
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
    assert.equal(ids.length, new Set(ids).size, `${lab.slug}: duplicate element IDs`)
    for (const [, id] of html.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(id), `${lab.slug}: missing SVG reference ${id}`)
  }
  const ticker = await render(createElement(NewsTicker))
  assert.ok(ticker.includes('AI news from RSS feeds'))
  assert.ok(ticker.includes('Pause news scrolling'))
  assert.ok(ticker.includes('aria-hidden="true" inert=""'), 'Repeated ticker copy must be hidden from focus and assistive technology')
  console.log(`PASS ${preview ? 'signed-out preview: ' : ''}${lessons} lessons, ${activityPages} activity pages, ${blocks} lesson blocks, complete catalogues, ${labs.length} visual labs, homepage lab, and accessible RSS ticker`)
} finally { await vite.close() }
