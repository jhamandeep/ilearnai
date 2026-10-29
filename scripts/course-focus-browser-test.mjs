import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const tracks = JSON.parse(await readFile('src/data/tracks-catalog.json'))
const output = 'output/reviews/course-focus'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true })
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base + '/courses')
  await page.locator('#learning-navigation').waitFor()
  await page.locator('.track-card[href="/courses/start-here"]').click()
  await page.locator('.course-workspace').waitFor()
  assert.equal(await page.locator('#learning-navigation').count(), 0, 'Entering a course must hide the global navigation')
  assert.ok(await page.getByRole('navigation', { name: 'Course chapters' }).isVisible())
  const width = await page.locator('.learning-body').evaluate(el => el.getBoundingClientRect().width)
  assert.equal(width, 1440, 'The content must reclaim the sidebar space')
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page.locator('#learning-navigation').waitFor()
  assert.equal(await page.locator('.learning-body').evaluate(el => el.getBoundingClientRect().width), width, 'Reopening the main menu must overlay, not shrink, a course')
  assert.ok(await page.locator('.navigation-scrim').isVisible())
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('#learning-navigation').count(), 0)
  assert.ok(await page.getByRole('button', { name: 'Open navigation', exact: true }).evaluate(el => el === document.activeElement))
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page.locator('.navigation-scrim').click({ position: { x: 600, y: 100 } })
  assert.equal(await page.locator('#learning-navigation').count(), 0)
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page.locator('#learning-navigation').getByRole('link', { name: 'My learning', exact: false }).click()
  await page.waitForURL('**/dashboard')
  await page.locator('.dashboard-header').waitFor()
  assert.ok(await page.locator('#learning-navigation').isVisible(), 'Desktop browsing retains its normal menu')
  await page.goBack(); await page.locator('.course-workspace').waitFor()
  assert.equal(await page.locator('#learning-navigation').count(), 0, 'Back must not resurrect an old open course drawer')

  for (const track of tracks) {
    await page.goto(`${base}/courses/${track.slug}`)
    await page.locator('.course-workspace').waitFor()
    assert.equal(await page.locator('#learning-navigation').count(), 0, `${track.slug}: global rail returned`)
    assert.ok(await page.getByRole('navigation', { name: 'Course chapters' }).isVisible())
  }
  const lesson = '/courses/start-here/first-python/install-and-run'
  await page.goto(base + lesson + '/reading')
  await page.locator('.activity-content-reading').waitFor()
  assert.equal(await page.locator('#learning-navigation').count(), 0)
  assert.ok(await page.locator('h2[data-learning-tone="idea"]').count() > 0)
  assert.ok(await page.locator('h2[data-learning-tone="example"]').count() > 0)
  assert.ok(await page.locator('h2[data-learning-tone="caution"]').count() > 0)
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  // A real route change closes the drawer before it can reserve content width.
  await page.locator(`.study-activity-tabs a[href="${lesson}/animation-1"]`).evaluate(link => link.click())
  const player = page.locator('[data-narrated]')
  await player.waitFor(); assert.equal(await page.locator('#learning-navigation').count(), 0)
  await player.getByRole('button', { name: 'Play narrated explainer', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[data-narrated] audio').currentTime > .1)
  await player.getByRole('button', { name: 'Pause explainer', exact: true }).click()

  for (const viewport of [1920, 1100, 900, 390, 320]) {
    const p = await browser.newPage({ viewport: { width: viewport, height: 1000 } })
    p.on('pageerror', error => errors.push(error.message))
    for (const [name, route, anchor] of [['course', '/courses/start-here', '.course-workspace'], ['lesson', lesson, '.activity-heading'], ['reading', lesson + '/reading', 'h2[data-learning-tone="example"]']]) {
      await p.goto(base + route); await p.locator(anchor).first().waitFor(); await p.locator(anchor).first().scrollIntoViewIfNeeded()
      assert.equal(await p.locator('#learning-navigation').count(), 0)
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), viewport, `${name}: overflow at ${viewport}`)
      await p.screenshot({ path: `${output}/${name}-${viewport}.png` })
    }
    await p.getByRole('button', { name: 'Open navigation', exact: true }).click()
    await p.setViewportSize({ width: viewport >= 1100 ? 900 : 1440, height: 1000 })
    await p.locator('#learning-navigation').waitFor({ state: 'detached' })
    await p.close()
  }
  assert.deepEqual(errors, [])
  console.log(`PASS Chrome ${browser.version()}: all ${tracks.length} courses hide the global rail; course navigation stays accessible; drawer/escape/back/route-change behaviour; full content width; 1920/1100/900/390/320 layouts; semantic highlights; narration still plays.`)
} finally { await browser.close() }
