import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'
const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const entries = JSON.parse(await readFile('output/narration/scripts.json'))
const recordings = JSON.parse(await readFile('src/data/narration.json'))
const output = 'output/reviews/readable'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const errors = [], report = []
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
 page.on('pageerror', error => errors.push(error.message))
 const samples = ['One row becomes', 'The token sat asks', 'Three PID steps', entries.find(e => e.group === 'system-design').title, entries.find(e => e.group === 'for-work').title, entries.find(e => e.routes.includes('/labs/gradient-descent')).title, 'The operating system follows', 'Four checks before the house file', 'From Dockerfile to image']
 for (const width of [1440, 720, 390, 320]) {
  await page.setViewportSize({width,height:1100})
  for (const title of samples) {
   const entry = entries.find(e => e.title.startsWith(title)), recording = recordings[entry.key]
   await page.goto(base + entry.routes[0] + (entry.routes[0].startsWith('/courses/') ? '/animation-1' : ''))
   const player = page.locator(`[data-narration-key="${entry.key}"] [data-narrated]`).first()
   await player.waitFor()
   await page.evaluate(() => document.fonts.ready)
   const slider = player.getByRole('slider', {name:'Explainer timeline'})
   for (const [index,cue] of recording.cues.entries()) {
    await slider.fill(String(Math.round((cue.speechEnd - .02) * 100)/100))
    await page.waitForFunction(({key,index}) => document.querySelector(`[data-narration-key="${key}"] .an-svg`)?.dataset.visualScene === String(index), {key:entry.key,index})
    if (title.startsWith('Three PID') && index === 1) assert.match(await player.locator('[data-id="ncmd"]').textContent(), /45\.9 V/)
    const result = await player.locator('.an-svg').evaluate(svg => {
     const r = svg.getBoundingClientRect(), v = svg.viewBox.baseVal
     const fonts = [...svg.querySelectorAll('text')].flatMap(text => {
      let n=text
      while(n && n!==svg) {const s=getComputedStyle(n);if(Number(s.opacity)<.05 || s.display==='none') return [];n=n.parentElement}
      const box=text.getBoundingClientRect(), region=svg.parentElement.getBoundingClientRect()
      if(box.right<region.left || box.left>region.right || box.bottom<region.top || box.top>region.bottom) return []
      return [parseFloat(getComputedStyle(text).fontSize)*Math.hypot(text.getScreenCTM().a,text.getScreenCTM().b)]
     })
     return {minimum:Math.min(...fonts),view:[v.x,v.y,v.width,v.height],width:r.width}
    })
    assert.ok(result.minimum >= 13.7, `${entry.title} scene ${index+1} @ ${width}: ${result.minimum}px`)
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width, `${entry.title}: page overflow @ ${width}`)
    if (width === 1440) {
      const clipped = await player.locator('.an-svg').evaluate(svg => [...svg.querySelectorAll('.an-obj')].flatMap(object => {
        if (Number(getComputedStyle(object).opacity) < .99) return []
        const rect = object.querySelector('rect[data-shape]')
        if (!rect) return []
        const box = rect.getBoundingClientRect()
        return [...object.querySelectorAll('text')].flatMap(text => {
          let n = text
          while (n && n !== object) { if (Number(getComputedStyle(n).opacity) < .99) return []; n = n.parentElement }
          const b = text.getBoundingClientRect()
          return b.left < box.left-4 || b.right > box.right+4 || b.top < box.top-4 || b.bottom > box.bottom+4 ? [`${object.dataset.id}: ${text.textContent}`] : []
        })
      }))
      assert.deepEqual(clipped, [], `${entry.title} scene ${index+1}: text outside its node`)
    }
    if (width === 1440 && (samples.indexOf(title) < 3 || title.startsWith("The operating system follows"))) {
      const collisions = await player.locator('.an-svg').evaluate(svg => {
        const labels = [...svg.querySelectorAll('text')].filter(text => {
          let n = text
          while (n && n !== svg) { if (Number(getComputedStyle(n).opacity) < .05 || getComputedStyle(n).display === 'none') return false; n = n.parentElement }
          return text.textContent.trim()
        }).map(text => ({text:text.textContent, box:text.getBoundingClientRect()}))
        return labels.flatMap((a,i) => labels.slice(i+1).filter(b => Math.min(a.box.right,b.box.right)-Math.max(a.box.left,b.box.left)>3 && Math.min(a.box.bottom,b.box.bottom)-Math.max(a.box.top,b.box.top)>3).map(b => `${a.text} / ${b.text}`))
      })
      assert.deepEqual(collisions, [], `${entry.title} scene ${index+1}: colliding labels`)
    }
    report.push({title:entry.title,width,scene:index+1,...result})
   }
   assert.ok(await player.evaluate(el=>el.scrollWidth <= el.clientWidth+1), `${entry.title}: clipped controls at ${width}`)
   // Text colour must come from the light surface, including lazy stylesheet loads.
   const colour = await player.locator('.explainer-captions').evaluate(el => getComputedStyle(el).color)
   assert.ok(!['rgb(240, 242, 250)','rgb(255, 255, 255)'].includes(colour), `Low-contrast light captions: ${colour}`)
   if (width===1440 || width===390) {
    await player.scrollIntoViewIfNeeded()
    // Avoid capturing a sticky toolbar over the top of a tall player.
    await page.evaluate(()=>document.querySelector('.learning-toolbar')?.style.setProperty('visibility','hidden'))
    await player.screenshot({path:`${output}/${entry.key}-${width}.png`})
   }
  }
 }
 // A real transfer has an intermediate position, changes the shape, and restores
 // the original cell when seeking backwards (also under React StrictMode).
 const dataset = entries.find(e=>e.title.startsWith('One row becomes'))
 await page.setViewportSize({width:1440,height:1100})
 await page.goto(base+dataset.routes[0]+'/animation-1')
 const player = page.locator('[data-narrated]').first(), slider=player.getByRole('slider',{name:'Explainer timeline'})
 await player.waitFor()
 const cue=recordings[dataset.key].cues[1], previous=recordings[dataset.key].cues[0]
 const state=()=>player.locator('[data-id="c_size"]').evaluate(el=>({transform:el.getAttribute('transform'),opacity:Number(getComputedStyle(el).opacity),width:Number(el.querySelector('rect').getAttribute('width'))}))
 await slider.fill(String(Math.round((previous.speechEnd-.02)*100)/100));const before=await state()
 await slider.fill(String(Math.round((cue.start+(cue.speechEnd-cue.start)*.45)*100)/100));const during=await state()
 await slider.fill(String(Math.round((cue.speechEnd-.02)*100)/100));const after=await state()
 assert.notEqual(during.transform,before.transform,'Cell must travel during a transformation')
 assert.equal(after.opacity,0,'Source cell is consumed by the result')
 assert.equal(await player.locator('[data-id="f_size"]').evaluate(el=>Number(getComputedStyle(el).opacity)),1)
 await slider.fill(String(Math.round((previous.speechEnd-.02)*100)/100));const restored=await state()
 assert.deepEqual(restored,before,'Reverse seek restores the original cell and shape')
 // Compact marketing and learning headers; keyboard and navigation close menu.
 for (const width of [320,390,720,1000]) {
  await page.setViewportSize({width,height:1000});await page.goto(base+'/')
  await page.getByRole('button',{name:'Open menu',exact:true}).waitFor()
  const nav=page.getByRole('navigation',{name:'Primary',exact:true})
  assert.equal(await nav.isVisible(),false)
  assert.ok((await page.locator('.topbar').boundingBox()).height<=80)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width)
  await page.getByRole('button',{name:'Open menu',exact:true}).click()
  assert.ok(await nav.isVisible())
  await nav.locator('.nav-group summary').filter({hasText:'Learn'}).click()
  assert.ok(await nav.getByRole('link',{name:'All courses Ten tracks, four levels'}).isVisible())
  await page.keyboard.press('Escape');assert.equal(await nav.isVisible(),false)
  assert.ok(await page.getByRole('button',{name:'Open menu',exact:true}).evaluate(el=>el===document.activeElement))
  await page.getByRole('button',{name:'Open menu',exact:true}).click()
  await nav.getByRole('link',{name:'Labs',exact:true}).click()
  await page.waitForURL('**/labs')
  assert.ok((await page.locator('.learning-toolbar').boundingBox()).height<=80)
  await page.goBack();await page.getByRole('button',{name:'Open menu',exact:true}).waitFor()
  assert.equal(await page.getByRole('navigation',{name:'Primary',exact:true}).isVisible(),false)
 }
 await page.goto(base+'/login')
 await page.getByRole('link',{name:'ilearnai home',exact:true}).first().click()
 await page.getByRole('button',{name:'Open menu',exact:true}).click()
 await page.goBack();await page.waitForURL('**/login')
 await page.goForward();await page.waitForURL(base+'/')
 assert.equal(await page.getByRole('navigation',{name:'Primary',exact:true}).isVisible(),false,'Browser history must not reopen an old menu')
 // Reduced motion still reveals the completed transformation with readable text.
 const reduced=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'})
 await reduced.goto(base+dataset.routes[0]+'/animation-1')
 await reduced.getByRole('slider',{name:'Explainer timeline'}).fill(String(Math.round((cue.start+.1)*100)/100))
 await reduced.waitForFunction(()=>Number(getComputedStyle(document.querySelector('[data-id="f_size"]')).opacity)===1)
 assert.equal(await reduced.locator('[data-id="c_size"]').evaluate(el=>Number(getComputedStyle(el).opacity)),0)
 assert.deepEqual(errors,[])
 await writeFile(`${output}/report.json`,JSON.stringify({checks:report.length,errors,report},null,2))
 console.log(`PASS ${report.length} scene/viewport readability checks; transformation/reverse seek; compact menus at four widths; reduced motion.`)
} finally {await browser.close()}
