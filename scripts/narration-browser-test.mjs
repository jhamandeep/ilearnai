import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const manifest = JSON.parse(await readFile('src/data/narration.json'))
const entries = JSON.parse(await readFile('output/narration/scripts.json'))
const output = 'output/reviews/sitewide-narration'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true })
const errors = []
const urlFor = entry => entry.routes[0] + (entry.routes[0].startsWith('/courses/') ? '/animation-1' : '')
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base + urlFor(entries[0]))
  let previousAudio = false, scenes = 0
  for (const [index, entry] of (process.env.NARRATION_CONTROLS_ONLY ? [] : entries).entries()) {
    if (index) await page.evaluate(path => { history.pushState(null, '', path); dispatchEvent(new PopStateEvent('popstate')) }, urlFor(entry))
    const figure = page.locator(`[data-narration-key="${entry.key}"]`).first()
    await figure.waitFor()
    if (previousAudio) assert.ok(await page.evaluate(() => window.__previousNarration.paused), 'Route changes must stop the previous recording')
    const player = figure.locator('[data-narrated]')
    await player.scrollIntoViewIfNeeded()
    const audio = player.locator('audio')
    await audio.evaluate(media => new Promise((resolve, reject) => {
      if (media.readyState >= 1) return resolve()
      media.addEventListener('loadedmetadata', resolve, { once: true })
      media.addEventListener('error', () => reject(new Error(media.currentSrc)), { once: true })
    }))
    const recording = manifest[entry.key]
    const metadata = await audio.evaluate(media => ({ duration: media.duration, paused: media.paused, time: media.currentTime }))
    assert.ok(metadata.paused && metadata.time === 0, `${entry.title}: no autoplay`)
    assert.ok(Math.abs(metadata.duration - recording.duration) < .25, `${entry.title}: duration mismatch`)
    const slider = player.getByRole('slider', { name: 'Explainer timeline' })
    // Check every scene on every route, including a backwards jump.
    for (const i of [...recording.cues.keys(), 0]) {
      const cue = recording.cues[i]
      await slider.fill(String(Math.round((cue.start + (cue.speechEnd - cue.start) * .7) * 100) / 100))
      await page.waitForFunction(({ key, i }) => document.querySelector(`[data-narration-key="${key}"] [data-narrated]`)?.dataset.scene === String(i), { key: entry.key, i })
      assert.equal(await player.locator('.explainer-captions').innerText(), cue.text)
      assert.equal(await player.locator('.an-svg').getAttribute('data-visual-scene'), String(i))
      const bad = await player.locator('.an-svg').evaluate(svg => [svg, ...svg.querySelectorAll('*')].some(element => [...element.attributes].some(attribute => /^(?:x\d?|y\d?|c[xy]|r[xy]?|width|height|d|points|transform|style|viewBox)$/.test(attribute.name) && /NaN|Infinity/.test(attribute.value))))
      assert.ok(!bad, `${entry.title}: invalid SVG geometry`)
      scenes++
    }
    // Decode and play the end of every recording. Playback must stop by itself.
    await slider.fill(String(Math.floor((recording.duration - .2) * 100) / 100))
    await player.getByRole('button', { name: 'Play explainer', exact: true }).click()
    await player.getByRole('button', { name: 'Replay explainer', exact: true }).waitFor()
    assert.ok(await audio.evaluate(media => media.paused))
    await audio.evaluate(media => { window.__previousNarration = media }); previousAudio = true
    if ((index + 1) % 25 === 0) console.log(`Verified ${index + 1}/${entries.length} explainers`)
  }

  // Shared controls, accurate pause/resume, exclusivity, visibility, and recovery.
  await page.goto(base + '/style')
  const players = page.locator('[data-narrated]')
  const first = players.nth(0), second = players.nth(1)
  await first.scrollIntoViewIfNeeded()
  await first.getByRole('button', { name: 'Play narrated explainer', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[data-narrated] audio').currentTime > .5)
  await first.getByRole('button', { name: 'Pause explainer', exact: true }).click()
  const paused = await first.locator('audio').evaluate(a => a.currentTime)
  await page.waitForTimeout(150); assert.equal(await first.locator('audio').evaluate(a => a.currentTime), paused)
  await first.getByRole('button', { name: 'Mute narration', exact: true }).click()
  assert.ok(await first.locator('audio').evaluate(a => a.muted))
  await first.getByRole('combobox', { name: 'Explainer playback speed' }).selectOption('1.25')
  assert.equal(await first.locator('audio').evaluate(a => a.playbackRate), 1.25)
  await first.getByRole('button', { name: 'Hide captions', exact: true }).click()
  assert.equal(await first.locator('.explainer-captions').getAttribute('aria-hidden'), 'true')
  await first.getByRole('button', { name: 'Show captions', exact: true }).click()
  await first.getByRole('button', { name: 'Enter full screen', exact: true }).click()
  await page.waitForFunction(() => !!document.fullscreenElement)
  await first.getByRole('button', { name: 'Exit full screen', exact: true }).click()
  await first.getByRole('button', { name: 'Enlarge diagram' }).click()
  assert.match(await first.getAttribute('class'), /is-enlarged/)
  await first.getByRole('button', { name: 'Fit scene' }).click()
  await first.getByRole('slider', { name: 'Explainer timeline' }).fill('6')
  await first.focus(); await page.keyboard.press('ArrowLeft')
  assert.ok(Math.abs(await first.locator('audio').evaluate(a => a.currentTime) - 1) < .1)
  // Direct media starts also enforce exclusivity, even if both are in view.
  await first.locator('audio').evaluate(a => a.play())
  await second.locator('audio').evaluate(a => a.play())
  assert.ok(await first.locator('audio').evaluate(a => a.paused))
  await second.locator('audio').evaluate(a => a.pause())

  const samples = [entries[0], entries.find(e => e.group === 'ml-math'), entries.find(e => e.group === 'for-work'), entries.find(e => e.routes.includes('/labs/gradient-descent'))]
  for (const width of [1440, 390, 320]) for (const entry of samples) {
    const mobile = await context.newPage(); await mobile.setViewportSize({ width, height: 1000 })
    mobile.on('pageerror', error => errors.push(error.message))
    await mobile.goto(base + urlFor(entry))
    const player = mobile.locator(`[data-narration-key="${entry.key}"] [data-narrated]`).first()
    await player.scrollIntoViewIfNeeded()
    const cue = manifest[entry.key].cues[1]
    await player.getByRole('slider', { name: 'Explainer timeline' }).fill(String(Math.round((cue.start + 1) * 100) / 100))
    await mobile.waitForTimeout(100)
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth), width, `${entry.title}: overflow at ${width}`)
    const size = await player.evaluate(el => ({ width: el.getBoundingClientRect().width, scroll: el.scrollWidth }))
    assert.ok(size.scroll <= size.width + 1, `${entry.title}: player overflow at ${width}: ${size.scroll} > ${size.width}`)
    await mobile.screenshot({ path: `${output}/${entry.group}-${width}.png` })
    await mobile.emulateMedia({ reducedMotion: 'reduce' })
    assert.ok(await player.locator('audio').evaluate(a => a.paused))
    const beforePlay = await player.locator('audio').evaluate(a => a.currentTime)
    await player.getByRole('button', { name: 'Play explainer', exact: true }).click()
    await mobile.waitForFunction(time => { const player = document.querySelector('[data-narrated]'); const audio = player.querySelector('audio'); return !audio.paused && audio.currentTime > time + .05 && player.dataset.playing === 'true' }, beforePlay)
    assert.equal(await player.getAttribute('data-playing'), 'true', 'Reduced motion must still allow explicit narration playback')
    await mobile.close()
  }
  const failed = await browser.newContext()
  const failedAudio = manifest[entries[0].key].audio
  await failed.route(`**${failedAudio}`, route => route.abort())
  const p = await failed.newPage(); await p.goto(base + urlFor(entries[0]))
  await p.getByRole('alert').filter({ hasText: 'recording could not load' }).waitFor()
  await failed.unroute(`**${failedAudio}`)
  await p.getByRole('button', { name: 'Retry audio' }).click()
  await p.getByRole('button', { name: 'Play narrated explainer', exact: true }).click()
  await p.waitForFunction(() => document.querySelector('[data-narrated] audio').currentTime > .1)
  assert.deepEqual(errors, [])
  const report = { browser: browser.version(), explainers: process.env.NARRATION_CONTROLS_ONLY ? 0 : entries.length, sceneChecks: scenes, errors, coverage: process.env.NARRATION_CONTROLS_ONLY ? 'Shared controls, exclusivity, 1440/390/320 layouts, reduced motion, blocked-audio recovery' : 'All routes and cue captions, SVG synchronization, AAC end playback, navigation cleanup, shared controls, exclusivity, 1440/390/320 layouts, reduced motion, blocked-audio recovery' }
  await writeFile(`${output}/${process.env.NARRATION_CONTROLS_ONLY ? 'controls-report' : 'report'}.json`, JSON.stringify(report, null, 2))
  console.log('PASS', JSON.stringify(report))
} finally { await browser.close() }
