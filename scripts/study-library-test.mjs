import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright-core'

const output = 'output/reviews/study-library'
await mkdir(output, { recursive: true })
const vite = await createServer({ cacheDir: 'node_modules/.vite-study-library-test', server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
let lessonCount = 0, sourceCount = 0
try {
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { studyLibrary, sourceKey } = await vite.ssrLoadModule('/src/lib/studyLibrary.ts')
  const { lessonActivities } = await vite.ssrLoadModule('/src/lib/activities.ts')
  const { nodes, edges } = await vite.ssrLoadModule('/src/data/graph.ts')
  for (const track of tracks) for (const module of track.modules) for (const lesson of module.lessons) {
    const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`
    const library = studyLibrary(lesson, route)
    const classified = [...library.readings, ...library.videos, ...library.repositories, ...library.references.map(item => item.link)]
    const expected = new Set(lesson.links.map(link => sourceKey(link.url)))
    assert.deepEqual(new Set(classified.map(link => sourceKey(link.url))), expected, `${route}: a lesson reference disappeared`)
    assert.equal(classified.length, expected.size, `${route}: duplicate references`)
    const activities = lessonActivities(lesson, route)
    for (const exercise of library.exercises) assert.ok(activities.some(activity => activity.id === exercise.activityId && activity.kind === 'exercise'))
    assert.ok(library.chapterVideos.length + library.videos.length > 0, `${route}: missing chapter viewing guide`)
    assert.ok(nodes.some(node => node.id === `lesson:${route.slice('/courses/'.length)}`), `${route}: map shortcut has no destination`)
    lessonCount++; sourceCount += expected.size
  }
  const sample = tracks[0].modules[0].lessons[0]
  const variants = studyLibrary({ ...sample, links: [
    { label: 'PDF', kind: 'paper', url: 'https://arxiv.org/pdf/1706.03762v7.pdf' },
    { label: 'Abstract', kind: 'article', url: 'https://arxiv.org/abs/1706.03762' },
  ] }, '/courses/ai-research/transformers/why-attention')
  assert.equal(variants.references.length, 1)
  assert.equal(variants.references[0].paper.slug, 'attention-is-all-you-need')
  assert.notEqual(sourceKey('https://example.com/guide#inputs'), sourceKey('https://example.com/guide#outputs'), 'Keep distinct documentation sections')
  for (const id of ['attention', 'retrieval', 'agents']) {
    const connected = new Set(edges.flatMap(edge => edge.source === `concept:${id}` ? [edge.target] : edge.target === `concept:${id}` ? [edge.source] : []))
    assert.ok(nodes.filter(node => connected.has(node.id)).length >= 3, `Homepage preview ${id} needs real connections`)
  }
} finally { await vite.close() }

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = [], measurements = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'no-preference' })
  page.on('pageerror', error => errors.push(error.message))
  const noOverflow = async label => {
    const size = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }))
    assert.ok(size.scroll <= size.width + 1, `${label}: horizontal overflow ${JSON.stringify(size)}`)
  }
  await page.goto(base)
  const preview = page.locator('.home-knowledge-map')
  await preview.waitFor(); await preview.scrollIntoViewIfNeeded(); await preview.getByRole('button', { name: '2D view', exact: true }).click(); await preview.locator('.topo-svg').waitFor()
  await page.waitForFunction(() => document.querySelector('.brand-symbol')?.dataset.motion === 'on')
  const logo = page.locator('.topbar .brand-orbit')
  const before = await logo.evaluate(element => getComputedStyle(element).transform)
  await page.waitForFunction(value => getComputedStyle(document.querySelector('.topbar .brand-orbit')).transform !== value, before)
  await page.getByRole('button', { name: 'Pause visual motion', exact: true }).click()
  for (const selector of ['.topbar .brand-orbit', '.topbar .brand-signal']) {
    assert.equal(await page.locator(selector).evaluate(element => getComputedStyle(element).animationPlayState), 'paused')
  }
  await page.getByRole('button', { name: 'Play visual motion', exact: true }).click()
  for (const [name, label] of [['Attention', 'Attention'], ['Retrieval & RAG', 'Retrieval and RAG'], ['AI agents', 'Agents']]) {
    await preview.locator('.map-starters').getByRole('button', { name: name + ' →', exact: true }).click()
    await page.waitForFunction(text => document.querySelector('.home-knowledge-map .map-detail h3')?.textContent === text, label)
    assert.ok(await preview.locator('.map-connections button').count() > 0)
    await preview.locator('.map-expand').click()
    await page.waitForURL('**/knowledge-graph?node=*')
    await page.getByRole('heading', { name: 'Knowledge map', exact: true, level: 1 }).waitFor()
    await page.locator('.topo-panel h3').waitFor()
    assert.equal(await page.locator('.topo-panel h3').innerText(), label)
    await page.goBack()
    await preview.waitFor(); await preview.scrollIntoViewIfNeeded(); await preview.getByRole('button', { name: '2D view', exact: true }).click(); await preview.locator('.topo-svg').waitFor()
  }
  await preview.scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${output}/homepage-desktop.png` })
  await page.goto(base + '/courses')
  await page.locator('#learning-navigation').waitFor()
  const navigation = await page.locator('.navigation-home,.navigation-group > a').evaluateAll(elements => elements.map(element => ({ text: element.textContent.trim(), font: getComputedStyle(element).fontSize, weight: getComputedStyle(element).fontWeight })))
  assert.ok(navigation.length > 10)
  assert.ok(navigation.every(item => parseFloat(item.font) >= 18 && Number(item.weight) >= 650))

  const route = '/courses/ai-research/transformers/why-attention'
  await page.goto(base + route + '/reading')
  const study = page.getByRole('complementary', { name: 'Lesson study tools', exact: true })
  await study.waitFor()
  assert.equal(await study.getByRole('tab').count(), 8)
  await study.getByRole('tab', { name: 'Notes', exact: true }).click()
  await study.getByRole('textbox', { name: 'Your notes for this lesson' }).fill('Attention connects relevant words.')
  for (const tab of ['Resources', 'Papers', 'Videos', 'Tools']) {
    await study.getByRole('tab', { name: tab, exact: true }).click()
    await study.locator(`[data-library-tab="${tab}"]`).waitFor()
    assert.ok(await study.locator('.study-library a').count() > 0, `${tab}: no usable links`)
    const contrast = await study.locator('[role="tab"][aria-selected="true"]').evaluate(element => {
      const luminance = value => value.match(/\d+/g).slice(0, 3).map(Number).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0)
      const style = getComputedStyle(element), a = luminance(style.color), b = luminance(style.backgroundColor)
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
    })
    assert.ok(contrast >= 4.5, `${tab}: selected tab text needs sufficient contrast`)
    for (const link of await study.locator('a[target="_blank"]').all()) assert.match(await link.getAttribute('rel'), /noreferrer/)
    assert.equal(await study.locator('.study-tool-panel').evaluate(element => element.scrollTop), 0)
    assert.equal(await study.locator('iframe').count(), 0, 'The video guide must not start playback')
  }
  await study.getByRole('tab', { name: 'Notes', exact: true }).click()
  assert.equal(await study.getByRole('textbox').inputValue(), 'Attention connects relevant words.')
  await study.getByRole('tab', { name: 'Notes', exact: true }).focus()
  await page.keyboard.press('End')
  assert.equal(await study.getByRole('tab', { name: 'Ask', exact: true }).getAttribute('aria-selected'), 'true')
  await page.keyboard.press('Home')
  await page.keyboard.press('ArrowRight')
  assert.equal(await study.getByRole('tab', { name: 'Resources', exact: true }).evaluate(element => element === document.activeElement), true)
  await study.getByRole('tab', { name: 'Papers', exact: true }).click()
  await study.getByRole('heading', { name: 'Attention Is All You Need', exact: true }).waitFor()
  await page.screenshot({ path: `${output}/lesson-desktop.png` })
  const paperLink = study.getByRole('link', { name: 'Reading notes →', exact: true }).first()
  assert.equal(await paperLink.getAttribute('href'), '/papers/attention-is-all-you-need')
  await study.locator('.study-map-link').click()
  await page.locator('.topo-panel h3').waitFor()
  assert.equal(await page.locator('.topo-panel .btn-primary').getAttribute('href'), route)
  await page.setViewportSize({ width: 390, height: 1050 })
  await page.locator('.topo-panel .list button').first().scrollIntoViewIfNeeded()
  const scroll = await page.evaluate(() => scrollY)
  await page.locator('.topo-panel .list button').first().click()
  await page.waitForFunction(expected => new URLSearchParams(location.search).get('node') !== expected, `lesson:${route.slice('/courses/'.length)}`)
  const position = await page.evaluate(() => ({ scroll: scrollY, maximum: document.documentElement.scrollHeight - innerHeight }))
  // A shorter details panel can clamp the scroll at the document's new bottom.
  assert.ok(Math.abs(position.scroll - Math.min(scroll, position.maximum)) < 2, 'Selecting a connected idea must not jump to the page header')
  await page.goto(base + '/knowledge-graph?node=not-a-real-node')
  await page.getByRole('heading', { name: 'How to read it', exact: true }).waitFor()

  for (const width of [1920, 1601, 1440, 1150, 900, 600, 390, 320]) {
    await page.setViewportSize({ width, height: 1050 })
    await page.goto(base + route + '/reading')
    await study.waitFor()
    await study.getByRole('tab', { name: 'Resources', exact: true }).click()
    await study.locator('[data-library-tab="Resources"]').waitFor()
    await noOverflow(`lesson at ${width}`)
    const box = await study.boundingBox()
    measurements.push({ viewport: width, studyWidth: box.width })
    assert.ok(box.width >= (width > 1150 ? 380 : width - 50))
    if (width === 390) {
      await page.locator('.study-space-jump').click()
      await study.getByRole('tab', { name: 'Videos', exact: true }).click()
      await study.locator('.study-video-preview').first().waitFor()
      await page.screenshot({ path: `${output}/lesson-mobile.png` })
    }
    if (width <= 900) {
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
      await page.locator('#learning-navigation').waitFor()
      await noOverflow(`navigation at ${width}`)
      if (width === 390) await page.screenshot({ path: `${output}/navigation-mobile.png` })
      await page.keyboard.press('Escape')
    }
    await page.goto(base)
    await preview.waitFor(); await preview.scrollIntoViewIfNeeded(); await preview.getByRole('button', { name: '2D view', exact: true }).click(); await preview.locator('.topo-svg').waitFor()
    await noOverflow(`homepage at ${width}`)
    if (width === 390 || width === 320) {
      await preview.scrollIntoViewIfNeeded()
      await preview.screenshot({ path: `${output}/map-${width}.png` })
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.brand-orbit')).animationName === 'none')
  assert.equal(await page.locator('.map-network').evaluate(element => getComputedStyle(element).animationName), 'none')
  assert.deepEqual(errors, [])
  await writeFile(`${output}/results.json`, JSON.stringify({ lessonCount, sourceCount, navigation, measurements, errors }, null, 2))
  console.log(`PASS: ${lessonCount} lessons, ${sourceCount} categorized references, paper deduplication, chapter videos, exact lesson exercises and map targets; all 8 study tabs, notes, keyboard, map deep links, logo motion/pause/reduced motion, and 8 viewport sizes.`)
} finally { await browser.close() }
