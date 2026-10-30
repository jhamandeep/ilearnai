import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const output = 'output/reviews/lusion-redesign'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
const routes = ['/courses', '/dashboard', '/for-work', '/for-work/banking', '/path', '/labs', '/labs/gradient-descent', '/code', '/practice', '/certifications', '/ai-infrastructure', '/videos', '/resources', '/papers', '/glossary', '/hub', '/knowledge-graph', '/roadmaps', '/blog', '/ask', '/courses/start-here', '/courses/start-here/first-python/install-and-run/reading']
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } })
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    window.heroDraws = 0
    const draw = WebGL2RenderingContext.prototype.drawElements
    WebGL2RenderingContext.prototype.drawElements = function (...args) { window.heroDraws++; return draw.apply(this, args) }
  })
  const noOverflow = async (label, target = page) => {
    const dimensions = await target.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }))
    assert.ok(dimensions.scroll <= dimensions.width + 1, `${label}: overflow ${JSON.stringify(dimensions)}`)
  }
  await page.goto(base)
  await page.locator('.intelligence-canvas[data-ready="true"] canvas').waitFor()
  const draws = await page.evaluate(() => window.heroDraws)
  await page.waitForFunction(value => window.heroDraws > value, draws)
  await page.getByRole('button', { name: 'Pause visual motion', exact: true }).click()
  await page.waitForTimeout(200)
  const pausedDraws = await page.evaluate(() => window.heroDraws)
  await page.waitForTimeout(250)
  assert.equal(await page.evaluate(() => window.heroDraws), pausedDraws, 'Global pause must stop WebGL rendering')
  for (const [name, href] of [['Explore', '/labs'], ['Build', '/courses/build-ai-ecosystem'], ['Connect', '/knowledge-graph']]) {
    await page.locator('.formation-controls').getByRole('button', { name: new RegExp(name) }).click()
    assert.equal(await page.locator('.scene-destination').getAttribute('href'), href)
    await page.waitForTimeout(120)
    const settled = await page.evaluate(() => window.heroDraws)
    await page.waitForTimeout(120)
    assert.equal(await page.evaluate(() => window.heroDraws), settled, 'Changing formation while paused must render once, then stop')
  }
  await page.getByRole('button', { name: 'Play visual motion', exact: true }).click()
  await page.evaluate(() => { window.heroContext = document.querySelector('.intelligence-canvas canvas').getContext('webgl2').getExtension('WEBGL_lose_context'); window.heroContext.loseContext() })
  await page.locator('.intelligence-canvas[data-ready="false"]').waitFor()
  assert.ok(await page.locator('.intelligence-poster').isVisible(), 'Context loss must reveal the fallback')
  await page.waitForTimeout(150)
  await page.evaluate(() => window.heroContext.restoreContext())
  await page.locator('.intelligence-canvas[data-ready="true"]').waitFor()
  await page.screenshot({ path: `${output}/home-desktop.png` })
  await page.locator('.map-stage').scrollIntoViewIfNeeded()
  const map = page.locator('.knowledge-map')
  await map.getByRole('button', { name: '2D view', exact: true }).click()
  await map.getByRole('button', { name: 'Play showcase', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('.knowledge-map')?.dataset.showcase === 'playing')
  const dot = map.locator('[data-node-id]').first()
  const position = await dot.getAttribute('transform')
  await page.waitForFunction(value => document.querySelector('[data-node-id]')?.getAttribute('transform') !== value, position)
  assert.ok(await map.locator('.map-signal').count() > 0)
  await page.waitForTimeout(200)
  const offscreenDraws = await page.evaluate(() => window.heroDraws)
  await page.waitForTimeout(250)
  assert.equal(await page.evaluate(() => window.heroDraws), offscreenDraws, 'Hero must stop rendering offscreen')
  await map.getByRole('button', { name: 'Pause showcase', exact: true }).click()
  const frozen = await dot.getAttribute('transform')
  await page.waitForTimeout(250)
  assert.equal(await dot.getAttribute('transform'), frozen)
  await map.getByRole('button', { name: 'Play showcase', exact: true }).click()
  await page.waitForFunction(value => document.querySelector('[data-node-id]')?.getAttribute('transform') !== value, frozen)
  await map.getByRole('searchbox', { name: 'Find an idea' }).fill('attention')
  assert.equal(await map.getAttribute('data-showcase'), 'paused', 'Search must pause moving targets')
  await map.getByRole('list', { name: 'Matching ideas' }).getByRole('button', { name: /^Attention concept$/ }).click()
  assert.equal(await map.locator('.map-detail h3').textContent(), 'Attention')
  await map.getByRole('button', { name: 'Play showcase', exact: true }).click()
  await page.getByRole('button', { name: 'Pause visual motion', exact: true }).click()
  assert.equal(await map.getAttribute('data-showcase'), 'paused')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.ok(await map.getByRole('button', { name: 'Motion off', exact: true }).isDisabled())
  await page.screenshot({ path: `${output}/knowledge-map.png` })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('button', { name: 'Play visual motion', exact: true }).click()

  // The original composition and navigation remain usable without a GPU.
  const fallback = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' })
  fallback.on('pageerror', error => errors.push(error.message))
  await fallback.addInitScript(() => { const context = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (type, ...args) { return type === 'webgl2' ? null : context.call(this, type, ...args) } })
  await fallback.goto(base)
  await fallback.locator('.intelligence-poster').waitFor()
  assert.ok(await fallback.locator('.intelligence-poster').isVisible())
  await fallback.locator('.formation-controls').getByRole('button', { name: /Build/ }).click()
  await fallback.locator('.scene-destination').click()
  await fallback.waitForURL('**/courses/build-ai-ecosystem')
  await fallback.locator('.course-workspace').waitFor()
  await fallback.close()

  for (const width of [1440, 1100, 800, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(base)
    await page.locator('.intelligence-canvas[data-ready="true"]').waitFor()
    await noOverflow(`Homepage ${width}`)
    if (width <= 800) {
      await page.getByRole('button', { name: 'Open menu', exact: true }).click()
      assert.ok(await page.getByRole('navigation', { name: 'Primary', exact: true }).isVisible())
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'false')
    }
    if (width === 390) await page.screenshot({ path: `${output}/home-mobile.png` })
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1050 })
    for (const route of routes) {
      await page.goto(base + route)
      await page.locator('main h1').first().waitFor()
      await page.locator('main').evaluate(element => Promise.allSettled(element.getAnimations().map(animation => animation.finished)))
      await noOverflow(`${route} ${width}`)
      assert.ok((await page.locator('main').innerText()).length > 100, `${route}: empty content`)
      if (['/courses', '/labs', '/dashboard', '/courses/start-here', '/courses/start-here/first-python/install-and-run/reading'].includes(route)) await page.screenshot({ path: `${output}/${route.replaceAll('/', '-').slice(1)}-${width}.png` })
    }
  }
  await page.setViewportSize({ width: 1440, height: 1050 })
  await page.goto(base + '/courses/start-here')
  for (const name of ['Video series', 'Practice', 'Resources', 'Lessons']) {
    const tab = page.getByRole('navigation', { name: 'Course formats' }).getByRole('button', { name, exact: true })
    await tab.click(); await page.waitForFunction(label => [...document.querySelectorAll('.course-format-nav button')].some(button => button.textContent === label && button.getAttribute('aria-pressed') === 'true'), name)
    assert.ok((await page.locator('.course-workspace-content').innerText()).length > 200)
    await noOverflow(`Course tab ${name}`)
  }
  await page.goto(base + '/courses/start-here/first-python/install-and-run/reading')
  for (const name of ['Summary', 'Resources', 'Papers', 'Videos', 'Tools', 'Flashcards', 'Notes', 'Ask']) {
    const tab = page.getByRole('tab', { name, exact: true })
    await tab.click(); await page.waitForFunction(label => [...document.querySelectorAll('[role="tab"]')].some(button => button.textContent === label && button.getAttribute('aria-selected') === 'true'), name)
    assert.ok((await page.getByRole('tabpanel').innerText()).length > 15)
    await noOverflow(`Study tab ${name}`)
  }
  assert.deepEqual(errors, [])
  console.log(`PASS: interactive 3D formations; pause/offscreen/reduced-motion/GPU fallback; moving full map and interaction pause; mobile navigation; 22 page types at desktop and phone widths; all 4 course tabs and 8 study tabs.`)
} finally { await browser.close() }
