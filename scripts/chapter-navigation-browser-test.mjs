import assert from 'node:assert/strict'
import { readFile, writeFile, stat, mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { chromium } from 'playwright-core'

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const output = 'output/reviews/interactive-home-map'
await mkdir(output, { recursive: true })
const catalogPath = 'src/data/tracks-catalog.json'
const original = await readFile(catalogPath, 'utf8')
const tracks = JSON.parse(original)
const browser = await chromium.launch({ channel: 'chrome', headless: true })
let chapters = 0, lessons = 0
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.on('pageerror', error => errors.push(error.message))
  let documents = 0
  page.on('request', request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++ })
  const first = tracks[0].modules[0].lessons[0]
  await page.goto(`${base}/courses/${tracks[0].slug}/${tracks[0].modules[0].slug}/${first.slug}/reading`)
  await page.waitForFunction(() => document.querySelector('.activity-content-reading .prose')?.textContent.length > 200)
  await page.getByRole('button', { name: 'Mark complete', exact: true }).click()
  await page.getByRole('tab', { name: 'Notes', exact: true }).click()
  await page.getByRole('textbox', { name: 'Your notes for this lesson' }).fill('Keep this note through a curriculum update.')
  if (!process.env.SKIP_HMR_CHECK) {
    const before = await stat(catalogPath)
    execFileSync('node', ['scripts/build-curriculum.mjs'], { stdio: 'ignore' })
    assert.equal((await stat(catalogPath)).mtimeMs, before.mtimeMs, 'Unchanged builds must not invalidate the public catalogue')
    // Reproduce the original bug: Vite hot-updates the outline-only catalogue.
    let release
    const held = new Promise(resolve => { release = resolve })
    let received
    const requested = new Promise(resolve => { received = resolve })
    await page.route('**/api/curriculum', async route => { received(); await held; await route.continue() })
    try {
      await writeFile(catalogPath, original + '\n')
      await Promise.race([requested, new Promise((_, reject) => setTimeout(() => reject(new Error('Catalogue update did not revalidate the curriculum')), 10000))])
      assert.ok((await page.locator('.activity-content-reading .prose').innerText()).length > 200, 'Keep loaded reading visible during revalidation')
      const response = page.waitForResponse('**/api/curriculum')
      release(); await response
      await page.waitForFunction(() => document.querySelector('.activity-content-reading .prose')?.textContent.length > 200)
      assert.ok(await page.getByRole('button', { name: 'Mark incomplete', exact: true }).isVisible(), 'Revalidation must preserve progress')
      assert.equal(await page.getByRole('textbox', { name: 'Your notes for this lesson' }).inputValue(), 'Keep this note through a curriculum update.')
    } finally { release(); await page.unroute('**/api/curriculum'); await writeFile(catalogPath, original) }
  }
  await page.locator('.activity-breadcrumb a[href="/courses"]').click()
  for (const track of tracks) {
    await page.locator(`.track-card[href="/courses/${track.slug}"]`).click()
    for (let moduleIndex = 0; moduleIndex < track.modules.length; moduleIndex++) {
      const module = track.modules[moduleIndex]
      await page.locator('.course-workspace').waitFor()
      // Switch chapters from a deep scroll, where old content appeared to disappear.
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
      await page.getByRole('navigation', { name: 'Course chapters' }).getByRole('button').nth(moduleIndex + 1).click()
      await page.waitForFunction(slug => document.querySelector('[data-course-chapter]')?.getAttribute('data-course-chapter') === slug && document.querySelectorAll('[data-course-chapter]').length === 1, module.slug)
      await page.waitForFunction(() => { const top = document.querySelector('.course-workspace-content')?.getBoundingClientRect().top; return top >= 70 && top <= 150 })
      await page.locator('[data-course-action="read"]').first().click()
      for (let index = 0; index < module.lessons.length; index++) {
        const lesson = module.lessons[index]
        if (index > 0) {
          const drawer = page.locator('.study-outline-drawer')
          if (!await drawer.evaluate(element => element.open)) await drawer.locator('summary').click()
          await drawer.locator(`a[href="/courses/${track.slug}/${module.slug}/${lesson.slug}"]`).click()
          await page.waitForURL(`**/courses/${track.slug}/${module.slug}/${lesson.slug}`)
          await page.getByRole('navigation', { name: 'Study formats' }).getByRole('link', { name: 'Reading', exact: false }).click()
          await page.waitForURL(`**/courses/${track.slug}/${module.slug}/${lesson.slug}/reading`)
        }
        await page.waitForFunction(title => document.querySelector('.activity-heading h1')?.textContent === title && document.querySelector('.activity-content-reading .prose')?.textContent.length > 200, lesson.title)
        lessons++
      }
      chapters++
      await page.locator(`.activity-breadcrumb a[href="/courses/${track.slug}"]`).click()
    }
    await page.locator('.crumbs a[href="/courses"]').first().click()
    console.log(`${track.title}: chapter navigation and readings passed`)
  }
  assert.equal(documents, 1, 'All chapters must open through client navigation without reloading the document')
  assert.deepEqual(errors, [])
  await writeFile(`${output}/chapter-navigation.json`, JSON.stringify({ chapters, lessons, documents, errors }, null, 2))
  console.log(`PASS: ${chapters} chapters and ${lessons} readings without page reloads; catalogue revalidation retains reading, notes, and progress.`)
} finally {
  if ((await readFile(catalogPath, 'utf8')) !== original) await writeFile(catalogPath, original)
  await browser.close()
}
