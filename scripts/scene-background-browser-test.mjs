import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const output = 'output/reviews/light-only-scenes'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } })
  page.on('pageerror', error => errors.push(error.message))
  // Old saved preferences must never bring back a dark scene or a switch.
  await page.addInitScript(() => {
    localStorage.setItem('ilearnai:scene-background:playground', 'dark')
    localStorage.setItem('ilearnai:scene-background:map', 'dark')
  })
  const hero = page.locator('.intelligence-hero'), map = page.locator('.knowledge-map')
  const readyMap = async () => { await map.locator('.map-stage').scrollIntoViewIfNeeded(); await map.locator('[data-spatial-status="ready"]').waitFor() }
  const clean = async () => {
    assert.equal(await page.getByRole('button', { name: /^(Light|Dark)$/ }).count(), 0)
    assert.equal(await map.getByText('How to read it', { exact: true }).count(), 0)
    assert.equal(await map.getByText('Follow your curiosity', { exact: true }).count(), 0)
    assert.equal(await map.locator('.map-instructions,.map-live-caption,.map-legend').count(), 0)
    assert.equal(await map.getAttribute('data-appearance'), 'light')
  }
  await page.goto(base)
  await hero.locator('[data-ready="true"]').waitFor()
  assert.equal(await hero.getAttribute('data-appearance'), 'light')
  await hero.getByText('ILEARNAI / PLAYGROUND 001', { exact: true }).waitFor()
  for (const [name, title, route] of [
    ['Connect', 'Ideas become connections.', '/knowledge-graph'],
    ['Explore', 'Curiosity becomes understanding.', '/labs'],
    ['Build', 'Understanding becomes possibility.', '/courses/build-ai-ecosystem'],
  ]) {
    await hero.locator('.formation-controls').getByRole('button', { name: new RegExp(name) }).click()
    assert.equal(await hero.locator('.intelligence-caption > p').textContent(), title)
    assert.equal(await hero.locator('.scene-destination').getAttribute('href'), route)
  }
  await hero.locator('.formation-controls').getByRole('button', { name: /Connect/ }).click()
  await page.waitForTimeout(1500)
  await hero.screenshot({ path: `${output}/original-playground-light.png` })
  await readyMap(); await clean()
  assert.equal(await map.locator('.spatial-renderer').getAttribute('data-rendered-appearance'), 'light')
  assert.equal(await map.locator('.spatial-renderer').getAttribute('data-total-nodes'), '849')
  assert.equal(await map.locator('.map-detail').count(), 0)
  const fullWidth = await map.locator('.map-stage').evaluate(el => el.clientWidth)
  assert.ok(fullWidth > 1200, 'The map should use the empty sidebar space')
  await map.getByRole('button', { name: 'Pause showcase', exact: true }).click()
  await page.waitForTimeout(1600)
  await map.locator('.map-visual').screenshot({ path: `${output}/map-unselected.png` })
  await map.getByRole('button', { name: 'Attention →', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('.map-detail h3')?.textContent === 'Attention')
  assert.ok(await map.locator('.map-connections button').count() > 3)
  await map.locator('.map-stage').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1600)
  await map.screenshot({ path: `${output}/map-selected.png` })
  await map.getByRole('button', { name: 'Clear selected idea', exact: true }).click()
  assert.equal(await map.locator('.map-detail').count(), 0)
  assert.equal(await map.locator('.map-stage').evaluate(el => el.clientWidth), fullWidth)
  await map.getByRole('searchbox', { name: 'Find an idea' }).fill('Why attention replaced')
  await map.getByRole('list', { name: 'Matching ideas' }).getByRole('button').first().click()
  assert.equal(await map.getByRole('link', { name: 'Open lesson →', exact: true }).getAttribute('href'), '/courses/ai-research/transformers/why-attention')
  await map.locator('.map-expand').click()
  await page.waitForURL('**/knowledge-graph?node=*')
  await page.getByRole('heading', { name: 'Knowledge map', exact: true, level: 1 }).waitFor()
  await readyMap(); await clean()
  assert.equal(await map.locator('.map-detail h3').textContent(), 'Why attention replaced recurrence')
  await page.reload(); await readyMap(); await clean()
  for (const width of [1440, 800, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(base)
    await hero.locator('[data-ready="true"]').waitFor()
    assert.equal(await hero.getAttribute('data-appearance'), 'light')
    if (width === 390) await hero.screenshot({ path: `${output}/playground-mobile.png` })
    await readyMap(); await clean()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: horizontal overflow`)
    await map.getByRole('button', { name: 'AI agents →', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.map-detail h3')?.textContent === 'Agents')
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: selected map overflow`)
    if (width === 390) await map.locator('.map-visual').screenshot({ path: `${output}/map-mobile.png` })
    await map.getByRole('button', { name: 'Clear selected idea', exact: true }).click()
    await map.getByRole('button', { name: '2D view', exact: true }).click()
    await map.locator('.topo-svg').waitFor()
    await map.getByRole('button', { name: 'Attention →', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.map-detail h3')?.textContent === 'Attention')
  }
  const fallback = await browser.newPage({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' })
  fallback.on('pageerror', error => errors.push(error.message))
  await fallback.addInitScript(() => {
    const context = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type === 'webgl2' ? null : context.call(this, type, ...args) }
  })
  await fallback.goto(base)
  assert.ok(await fallback.locator('.intelligence-poster').isVisible())
  await fallback.locator('.map-stage').scrollIntoViewIfNeeded()
  await fallback.locator('.topo-svg').waitFor()
  assert.equal(await fallback.getByRole('button', { name: /^(Light|Dark)$/ }).count(), 0)
  await fallback.getByRole('button', { name: 'Attention →', exact: true }).click()
  await fallback.waitForFunction(() => document.querySelector('.map-detail h3')?.textContent === 'Attention')
  await fallback.close()
  assert.deepEqual(errors, [])
  await writeFile(`${output}/results.json`, JSON.stringify({ fixedLight: true, originalPlayground: true, oldDarkPreferencesIgnored: true, contextPanel: 'selection only', widths: [1440,800,390,320], errors }, null, 2))
  console.log('PASS: original Playground 001 formations/copy, fixed light scenes despite old dark settings, no background switches or map help panel; full-width map, selected details, search, deep links, reload, 2D fallback and 320–1440px layouts.')
} finally { await browser.close() }
