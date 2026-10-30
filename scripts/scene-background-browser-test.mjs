import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const output = 'output/reviews/scene-backgrounds'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } })
  const page = await context.newPage()
  page.on('pageerror', e => errors.push(e.message))
  const hero = page.locator('.intelligence-hero'), map = page.locator('.knowledge-map')
  const choose = async (surface, name, value) => surface.getByRole('group', { name: `${name} background`, exact: true }).getByRole('button', { name: value, exact: true }).click()
  const readyMap = async () => { await map.locator('.map-stage').scrollIntoViewIfNeeded(); await map.locator('[data-spatial-status="ready"]').waitFor() }
  const contrast = async button => button.evaluate(element => {
    const style = getComputedStyle(element)
    const luminance = color => { const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(n => { const v = n / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }); return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2] }
    const a = luminance(style.color), b = luminance(style.backgroundColor)
    return (Math.max(a,b) + .05) / (Math.min(a,b) + .05)
  })
  await page.goto(base)
  await hero.locator('[data-ready="true"]').waitFor()
  assert.equal(await hero.getAttribute('data-appearance'), 'dark')
  await hero.screenshot({ path: `${output}/playground-dark.png` })
  await page.getByRole('button', { name: 'Pause visual motion', exact: true }).click()
  await hero.locator('canvas').evaluate(canvas => { window.originalHeroCanvas = canvas })
  await choose(hero, 'Playground', 'Light')
  assert.equal(await hero.getAttribute('data-appearance'), 'light')
  await page.waitForFunction(() => document.querySelector('.intelligence-canvas')?.dataset.renderedAppearance === 'light')
  assert.ok(await hero.locator('canvas').evaluate(canvas => canvas === window.originalHeroCanvas), 'Theme must update the existing sculpture')
  assert.ok(await contrast(hero.getByRole('button', { name: 'Light', exact: true })) >= 4.5)
  await hero.screenshot({ path: `${output}/playground-light.png` })
  await readyMap()
  assert.equal(await map.getAttribute('data-appearance'), 'light')
  assert.equal(await map.locator('.spatial-renderer').getAttribute('data-rendered-appearance'), 'light')
  assert.equal(await map.locator('.spatial-renderer').getAttribute('data-rendered-nodes'), '849')
  await map.screenshot({ path: `${output}/map-light.png` })
  await map.getByRole('button', { name: 'Attention →', exact: true }).click()
  await map.locator('.map-stage').scrollIntoViewIfNeeded()
  await map.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await page.waitForTimeout(200)
  const zoom = await map.locator('.map-toolbar output').textContent()
  await map.locator('canvas').evaluate(canvas => { window.originalMapCanvas = canvas })
  await choose(map, 'Knowledge map', 'Dark')
  await page.waitForFunction(() => document.querySelector('.knowledge-map .spatial-renderer')?.dataset.renderedAppearance === 'dark')
  assert.equal(await map.locator('.map-detail h3').textContent(), 'Attention')
  assert.equal(await map.locator('.map-toolbar output').textContent(), zoom, 'Theme must retain map zoom and selection')
  assert.ok(await map.locator('canvas').evaluate(canvas => canvas === window.originalMapCanvas), 'Theme must not recreate the graph')
  assert.ok(await contrast(map.getByRole('button', { name: 'Dark', exact: true })) >= 4.5)
  await map.locator('.map-stage').scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  const frame = await map.locator('.spatial-renderer').getAttribute('data-frame')
  await page.waitForTimeout(300)
  assert.equal(await map.locator('.spatial-renderer').getAttribute('data-frame'), frame, 'Changing background must not restart paused motion')
  await map.screenshot({ path: `${output}/map-dark.png` })
  await page.reload()
  await readyMap()
  assert.equal(await hero.getAttribute('data-appearance'), 'light', 'Playground preference must survive reload')
  assert.equal(await map.getAttribute('data-appearance'), 'dark', 'Map preference is separate and must survive reload')
  await map.locator('.map-expand').click()
  await readyMap()
  assert.equal(await map.getAttribute('data-appearance'), 'dark', 'Full map must share its homepage preference')
  await map.getByRole('button', { name: '2D view', exact: true }).click()
  await map.locator('.topo-svg').waitFor()
  assert.equal(await map.locator('.map-labels text').first().evaluate(el => getComputedStyle(el).fill), 'rgb(215, 227, 255)')
  await choose(map, 'Knowledge map', 'Light')
  assert.ok(await contrast(map.getByRole('button', { name: 'Light', exact: true })) >= 4.5)

  const second = await context.newPage()
  await second.goto(base + '/knowledge-graph')
  await second.locator('.knowledge-map').waitFor()
  await choose(map, 'Knowledge map', 'Dark')
  await second.waitForFunction(() => document.querySelector('.knowledge-map')?.dataset.appearance === 'dark')
  await second.close()

  for (const width of [1440, 800, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(base)
    await hero.locator('[data-ready="true"]').waitFor()
    for (const appearance of ['Light', 'Dark']) {
      await choose(hero, 'Playground', appearance)
      const contained = await hero.evaluate(el => { const box = el.getBoundingClientRect(); return [...el.querySelectorAll('.scene-background-options button')].every(button => { const b = button.getBoundingClientRect(); return b.left >= box.left && b.right <= box.right && b.top >= box.top && b.bottom <= box.bottom }) })
      assert.ok(contained, `${width}: background choices outside the playground`)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: playground overflow`)
      if (width === 390) await hero.screenshot({ path: `${output}/playground-${appearance.toLowerCase()}-mobile.png` })
    }
    await readyMap()
    for (const appearance of ['Light', 'Dark']) {
      await choose(map, 'Knowledge map', appearance)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: map overflow`)
      assert.ok(await map.getByRole('button', { name: appearance, exact: true }).isVisible())
      if (width === 390) await map.screenshot({ path: `${output}/map-${appearance.toLowerCase()}-mobile.png` })
    }
  }
  await page.getByRole('button', { name: 'Play visual motion', exact: true }).click()
  if (await map.getByRole('button', { name: 'Play showcase', exact: true }).count()) await map.getByRole('button', { name: 'Play showcase', exact: true }).click()
  await choose(map, 'Knowledge map', 'Light')
  await map.locator('.map-stage').scrollIntoViewIfNeeded()
  await page.waitForFunction(() => document.querySelector('.knowledge-map')?.dataset.showcase === 'playing')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await choose(map, 'Knowledge map', 'Light')
  assert.ok(await map.getByRole('button', { name: 'Motion off', exact: true }).isDisabled())

  const blocked = await browser.newPage({ viewport: { width: 390, height: 1000 } })
  blocked.on('pageerror', e => errors.push(e.message))
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked') }
    Storage.prototype.setItem = () => { throw new Error('Storage blocked') }
    const get = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type === 'webgl2' ? null : get.call(this, type, ...args) }
  })
  await blocked.goto(base)
  const blockedHero = blocked.locator('.intelligence-hero'), blockedMap = blocked.locator('.knowledge-map')
  await choose(blockedHero, 'Playground', 'Light')
  assert.ok(await blockedHero.locator('.intelligence-poster').isVisible())
  await blockedMap.locator('.map-stage').scrollIntoViewIfNeeded()
  await blockedMap.locator('.topo-svg').waitFor()
  await choose(blockedMap, 'Knowledge map', 'Dark')
  assert.equal(await blockedMap.getAttribute('data-appearance'), 'dark')
  await blockedMap.locator('.map-expand').click()
  assert.equal(await blockedMap.getAttribute('data-appearance'), 'dark', 'Storage failure must still retain the choice during navigation')
  await blockedMap.getByRole('button', { name: 'Attention →', exact: true }).click()
  await blocked.waitForFunction(() => document.querySelector('.map-detail h3')?.textContent === 'Attention')
  await blocked.close()
  assert.deepEqual(errors, [])
  await writeFile(`${output}/results.json`, JSON.stringify({ backgrounds: ['playground:dark default', 'map:light default'], widths: [1440,800,390,320], persistence: 'reload, navigation and other tabs', gpu: 'updates existing materials/canvases', fallback: 'blocked storage and WebGL', errors }, null, 2))
  console.log('PASS: independent Light/Dark backgrounds, persistent/cross-tab choices, unchanged map selection/zoom, live GPU material updates, paused/reduced motion, button contrast, 320–1440px layouts, blocked storage and WebGL fallback.')
} finally { await browser.close() }
