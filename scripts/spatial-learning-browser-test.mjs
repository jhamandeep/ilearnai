import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const output = 'output/reviews/spatial-learning'
await mkdir(output, { recursive: true })
const tracks = JSON.parse(await readFile('src/data/tracks-catalog.json', 'utf8'))
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = [], checks = []
let chapters = 0, courseTabs = 0, studyTabs = 0
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } })
  page.on('pageerror', error => errors.push(error.message))
  const map = page.locator('.knowledge-map'), renderer = map.locator('.spatial-renderer')
  const noOverflow = async label => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: horizontal overflow`)
  const waitReady = async parent => {
    await parent.locator('.spatial-graph').scrollIntoViewIfNeeded()
    await parent.locator('.spatial-graph[data-spatial-status="ready"] canvas').waitFor()
  }
  const settled = async locator => {
    await page.waitForTimeout(1700)
    const frame = await locator.getAttribute('data-frame')
    await page.waitForTimeout(300)
    assert.equal(await locator.getAttribute('data-frame'), frame, 'Paused/offscreen renderer must stop drawing')
  }
  if (!process.env.SKIP_SPATIAL_MAP) {
  await page.goto(base + '/#knowledge-map')
  await waitReady(map)
  assert.equal(await renderer.getAttribute('data-rendered-nodes'), '849')
  assert.equal(await renderer.getAttribute('data-rendered-edges'), '1366')
  const camera = await renderer.getAttribute('data-camera')
  await page.waitForFunction(before => document.querySelector('.knowledge-map .spatial-renderer')?.dataset.camera !== before, camera)
  await page.waitForTimeout(1400)
  await map.locator('.map-stage').screenshot({ path: `${output}/map-3d-desktop.png` })
  await map.getByRole('button', { name: 'Pause showcase', exact: true }).click()
  await settled(renderer)
  const canvas = renderer.locator('canvas')
  await canvas.focus()
  const beforeKey = await renderer.getAttribute('data-camera')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(before => document.querySelector('.knowledge-map .spatial-renderer')?.dataset.camera !== before, beforeKey)
  const beforeZoom = Number.parseInt(await map.locator('.map-toolbar output').textContent())
  await map.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await page.waitForFunction(before => Number.parseInt(document.querySelector('.map-toolbar output').textContent) > before, beforeZoom)
  await canvas.scrollIntoViewIfNeeded()
  const box = await canvas.boundingBox(), beforeDrag = await renderer.getAttribute('data-camera')
  await page.mouse.move(box.x + 25, box.y + 70); await page.mouse.down(); await page.mouse.move(box.x + 140, box.y + 110, { steps: 8 }); await page.mouse.up()
  await page.waitForFunction(before => document.querySelector('.knowledge-map .spatial-renderer')?.dataset.camera !== before, beforeDrag)
  await map.getByRole('button', { name: 'Fit map', exact: true }).click()
  await settled(renderer)
  const label = map.locator('.spatial-node-label:visible').first()
  const labelName = await label.textContent()
  await label.focus(); await page.keyboard.press('Enter')
  await page.waitForFunction(name => document.querySelector('.map-detail h3')?.textContent === name, labelName)
  await page.waitForFunction(() => document.activeElement?.classList.contains('spatial-node-label'))
  await map.getByRole('searchbox', { name: 'Find an idea' }).fill('Why attention replaced')
  await map.getByRole('list', { name: 'Matching ideas' }).getByRole('button').first().click()
  assert.equal(await map.getByRole('link', { name: 'Open lesson →', exact: true }).getAttribute('href'), '/courses/ai-research/transformers/why-attention')
  await map.locator('.map-stage').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${output}/map-3d-selected.png` })
  await map.locator('.map-expand').click()
  await page.waitForURL('**/knowledge-graph?node=*')
  await waitReady(map)
  assert.equal(await map.locator('.map-detail h3').textContent(), 'Why attention replaced recurrence')
  await map.getByRole('combobox', { name: 'Filter knowledge map by course' }).selectOption('ai-research')
  await page.waitForFunction(() => Number(document.querySelector('.knowledge-map .spatial-renderer')?.dataset.renderedNodes) < 849)
  for (const name of ['Concepts', 'Lessons', 'Papers', 'Labs', 'Terms']) await map.getByRole('checkbox', { name, exact: true }).uncheck()
  await map.getByText('No ideas are visible.', { exact: true }).waitFor()
  assert.equal(await renderer.getAttribute('data-rendered-nodes'), '0')
  await map.getByRole('button', { name: 'Reset filters', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('.knowledge-map .spatial-renderer')?.dataset.renderedNodes === '849')
  await map.getByRole('button', { name: 'Play showcase', exact: true }).click()
  await page.setViewportSize({ width: 1440, height: 360 })
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForFunction(() => document.querySelector('.knowledge-map .spatial-graph')?.dataset.playing === 'false')
  await settled(renderer)
  await page.setViewportSize({ width: 1440, height: 1080 })
  await waitReady(map)
  await page.getByRole('button', { name: 'Pause visual motion', exact: true }).click()
  await settled(renderer)
  await page.getByRole('button', { name: 'Play visual motion', exact: true }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await settled(renderer)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  checks.push('849 nodes/1366 actual connections; auto orbit, keyboard, drag, zoom, fit, focused selection, search, deep links, filters, global pause, reduced motion and offscreen pause')

  for (const width of [1440, 1100, 800, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(base + '/#knowledge-map')
    await waitReady(map); await noOverflow(`3D map ${width}`)
    if (width === 390) { await page.waitForTimeout(1600); await map.locator('.map-stage').screenshot({ path: `${output}/map-3d-mobile.png` }) }
    await page.goto(base + '/courses/ai-research?chapter=transformers')
    const journey = page.locator('.chapter-journey')
    await waitReady(journey); await noOverflow(`Chapter journey ${width}`)
    if ([1440, 390].includes(width)) { await page.waitForTimeout(1400); await journey.screenshot({ path: `${output}/chapter-${width}.png` }) }
    await page.goto(base + '/courses/ai-research/transformers/why-attention/reading')
    await page.locator('.activity-content-reading .prose').waitFor()
    await page.locator('.lesson-chapter-scene > summary').click()
    await waitReady(page.locator('.chapter-journey')); await noOverflow(`Expanded lesson ${width}`)
    await page.getByRole('tab', { name: 'Resources', exact: true }).click()
    await page.locator('[data-library-tab="Resources"]').waitFor()
    await page.locator('.study-tab-scene').scrollIntoViewIfNeeded()
    await noOverflow(`Study resources ${width}`)
    if (width === 390) await page.screenshot({ path: `${output}/study-mobile.png` })
  }
  checks.push('Map, course journey, expanded lesson scene and study resources fit 320–1440px')

  const mobile = await browser.newContext({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true })
  const touchPage = await mobile.newPage()
  await touchPage.goto(base + '/#knowledge-map')
  await touchPage.locator('.map-stage').scrollIntoViewIfNeeded()
  await touchPage.locator('.spatial-graph[data-spatial-status="ready"] canvas').waitFor()
  await touchPage.getByRole('button', { name: 'Pause showcase', exact: true }).click()
  await touchPage.locator('.map-stage').scrollIntoViewIfNeeded(); await touchPage.waitForTimeout(1700)
  const touchBox = await touchPage.locator('.map-stage').boundingBox(), cdp = await mobile.newCDPSession(touchPage)
  const x = Math.round(touchBox.x + touchBox.width / 2), y = Math.round(touchBox.y + touchBox.height / 2)
  const initialZoom = Number.parseInt(await touchPage.locator('.map-toolbar output').textContent())
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x - 40, y, id: 1 }, { x: x + 40, y, id: 2 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 75, y, id: 1 }, { x: x + 75, y, id: 2 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await touchPage.waitForFunction(before => Number.parseInt(document.querySelector('.map-toolbar output').textContent) > before, initialZoom)
  await mobile.close()

  await page.setViewportSize({ width: 1440, height: 1080 })
  await page.goto(base + '/knowledge-graph?node=concept:attention')
  await waitReady(map)
  await renderer.locator('canvas').evaluate(canvas => canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext())
  await map.locator('.topo-svg').waitFor()
  assert.equal(await map.locator('.map-detail h3').textContent(), 'Attention')
  const fallback = await browser.newPage()
  fallback.on('pageerror', error => errors.push(error.message))
  await fallback.addInitScript(() => { const get = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type === 'webgl2' ? null : get.call(this, type, ...args) } })
  await fallback.goto(base + '/knowledge-graph')
  await fallback.locator('.map-stage').scrollIntoViewIfNeeded()
  await fallback.locator('.topo-svg').waitFor()
  await fallback.getByRole('button', { name: 'Attention →', exact: true }).click()
  assert.equal(await fallback.locator('.map-detail h3').textContent(), 'Attention')
  await fallback.goto(base + '/courses/ai-research?chapter=transformers')
  await fallback.locator('.chapter-journey').scrollIntoViewIfNeeded()
  await fallback.locator('.spatial-fallback').waitFor()
  await fallback.locator('.chapter-journey-steps button').nth(1).click()
  assert.ok((await fallback.locator('.chapter-journey-detail > a').getAttribute('href')).includes('/transformers/'))
  await fallback.close()
  checks.push('Real touch pinch zoom; GPU context loss and unsupported WebGL preserve map and chapter navigation')
  console.log('PASS: 3D map interactions, responsive layouts and fallbacks')

  }

  // Every chapter, all four course formats and all eight study tabs. Actual
  // chapter data and destinations must change; animation alone is not enough.
  for (const track of tracks) {
    await page.goto(`${base}/courses/${track.slug}`)
    for (let index = 0; index < track.modules.length; index++) {
      const module = track.modules[index]
      await page.getByRole('navigation', { name: 'Course chapters' }).getByRole('button').nth(index + 1).click()
      for (const [mode, name] of [['lessons', 'Lessons'], ['videos', 'Video series'], ['practice', 'Practice'], ['resources', 'Resources']]) {
        await page.getByRole('navigation', { name: 'Course formats' }).getByRole('button', { name, exact: true }).click()
        const journey = page.locator(`[data-chapter-journey="${module.slug}"][data-journey-mode="${mode}"]`)
        await waitReady(journey)
        assert.equal(Number(await journey.locator('.spatial-renderer').getAttribute('data-rendered-nodes')), module.lessons.length)
        assert.equal(await journey.locator('.chapter-journey-steps button').count(), module.lessons.length)
        const last = module.lessons.at(-1)
        await journey.locator('.chapter-journey-steps button').last().click()
        assert.equal(await journey.locator('h4').textContent(), last.title)
        assert.ok((await journey.locator('.chapter-journey-detail > a').getAttribute('href')).startsWith(`/courses/${track.slug}/${module.slug}/${last.slug}/`))
        if (mode === 'videos') assert.ok(!(await journey.locator('.chapter-journey-detail > a').getAttribute('href')).endsWith('/reading'), 'A video destination must open a video or chapter series')
        courseTabs++
      }
      const first = module.lessons[0]
      await page.goto(`${base}/courses/${track.slug}/${module.slug}/${first.slug}/reading`)
      await page.locator('.activity-content-reading .prose').waitFor()
      const study = page.getByRole('complementary', { name: 'Lesson study tools', exact: true })
      const pictures = new Set()
      for (const tab of ['Summary', 'Resources', 'Papers', 'Videos', 'Tools', 'Flashcards', 'Notes', 'Ask']) {
        await study.getByRole('tab', { name: tab, exact: true }).click()
        const art = study.locator(`.study-tab-scene[data-format-motion="${tab.toLowerCase()}"]`)
        await art.waitFor(); await art.scrollIntoViewIfNeeded()
        if (['Resources', 'Papers', 'Videos', 'Tools'].includes(tab)) await study.locator(`[data-library-tab="${tab}"]`).waitFor()
        const shape = await art.locator('svg > g').innerHTML()
        pictures.add(shape)
        assert.ok((await study.getByRole('tabpanel').innerText()).trim().length > 20, `${track.slug}/${module.slug}: empty ${tab}`)
        studyTabs++
      }
      assert.equal(pictures.size, 8, `${module.slug}: study formats must have distinct visuals`)
      chapters++
      await page.locator(`.activity-breadcrumb a[href="/courses/${track.slug}"]`).click()
    }
    console.log(`${track.title}: ${track.modules.length} chapter journeys, four formats and eight study tabs passed`)
  }
  // Tour previews actual lessons, pauses and never silently completes work.
  await page.goto(base + '/courses/ai-research?chapter=transformers')
  const journey = page.locator('.chapter-journey')
  await waitReady(journey)
  await journey.getByRole('button', { name: 'Play chapter tour', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('.chapter-journey-steps button[aria-pressed="true"]')?.textContent === '2', null, { timeout: 18000 })
  await journey.getByRole('button', { name: 'Pause scene', exact: true }).click()
  await settled(journey.locator('.spatial-renderer'))
  assert.ok((await page.getByRole('navigation', { name: 'Course chapters' }).innerText()).includes('0%'))
  assert.deepEqual(errors, [])
  await writeFile(`${output}/${process.env.SKIP_SPATIAL_MAP ? 'chapter-results' : 'results'}.json`, JSON.stringify({ chapters, courseTabs, studyTabs, checks, errors }, null, 2))
  console.log(`PASS: ${chapters} actual chapter journeys, ${courseTabs} course format views, ${studyTabs} study tabs, tour/pause${process.env.SKIP_SPATIAL_MAP ? '' : ', real 3D map and fallbacks'}; no browser exceptions.`)
} finally { await browser.close() }
