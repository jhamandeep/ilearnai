import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'
const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const output = 'output/reviews/course-artwork-20261028'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true })
const errors = []
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}/courses`)
  const covers = page.locator('[data-catalogue-kind="course"] .course-artwork')
  await covers.first().waitFor()
  assert.equal(await covers.count(), 11)
  const topics = new Set(), motions = new Set(), sources = new Set()
  for (const cover of await covers.all()) {
    await cover.scrollIntoViewIfNeeded()
    await page.waitForFunction(el => el.dataset.playing === 'true' && !el.querySelector('svg').animationsPaused() && el.querySelector('img').complete && el.querySelector('img').naturalWidth > 0, await cover.elementHandle())
    const result = await cover.evaluate(el => ({topic:el.dataset.artwork, source:el.querySelector('img').getAttribute('src'), motion:el.querySelector('svg').innerHTML, time:el.querySelector('svg').getCurrentTime()}))
    topics.add(result.topic); sources.add(result.source); motions.add(result.motion)
    // Actual SVG clock advancement, not just a CSS class.
    await page.waitForFunction(({el,time}) => el.querySelector('svg').getCurrentTime() > time + .05, {el:await cover.elementHandle(),time:result.time})
  }
  assert.equal(topics.size,11); assert.equal(sources.size,11); assert.equal(motions.size,11)
  await page.getByRole('button',{name:'Pause course artwork',exact:true}).click()
  assert.ok(await covers.evaluateAll(els=>els.every(el=>el.querySelector('svg').animationsPaused())))
  await page.reload()
  await page.getByRole('button',{name:'Play course artwork',exact:true}).waitFor()
  assert.ok(await covers.evaluateAll(els=>els.every(el=>el.querySelector('svg').animationsPaused())))
  await page.getByRole('button',{name:'Play course artwork',exact:true}).click()
  await covers.first().scrollIntoViewIfNeeded()
  await page.waitForFunction(()=>document.querySelector('[data-catalogue-kind="course"] .course-artwork').dataset.playing==='true')
  await page.screenshot({path:`${output}/catalogue-final-desktop.png`})
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.waitForFunction(()=>[...document.querySelectorAll('.course-live-layer')].every(el=>el.animationsPaused()))
  assert.ok(await page.getByRole('button',{name:'Course artwork motion is off because of your reduced-motion preference'}).isDisabled())
  await page.emulateMedia({reducedMotion:'no-preference'})
  await covers.last().scrollIntoViewIfNeeded()
  await page.waitForFunction(()=>document.querySelector('[data-catalogue-kind="course"] .course-artwork').dataset.playing==='false')
  assert.equal(await covers.first().getAttribute('data-playing'),'false')

  // Reduced motion keeps the lab still; manual steps remain usable.
  const labContext = await browser.newContext({ reducedMotion:'reduce', viewport:{width:1440,height:1000} })
  const labPage = await labContext.newPage()
  labPage.on('pageerror', error => errors.push(error.message))
  await labPage.goto(`${base}/labs/gradient-descent`)
  const lab = labPage.locator('.gd-lab')
  await lab.waitFor()
  const stepCount = async () => Number(await lab.locator('.stat-value').nth(0).innerText())
  const position = async () => (await lab.locator('.stat-value').nth(2).innerText()).split(',').map(Number)
  const singleStep = () => lab.getByRole('button',{name:'One step',exact:true}).click()
  assert.equal(await stepCount(),0)
  const starts = {bowl:[-2.2,1.6],rosenbrock:[-1.5,2],saddle:[1.8,.08]}
  const gradient = (s,x,y) => s==='bowl'?[x,4*y]:s==='rosenbrock'?[-2*(1-x)-20*x*(y-x*x),10*(y-x*x)]:[2*x,-2*y+.2*y**3]
  for(const surface of Object.keys(starts)) for(const optimiser of ['sgd','momentum','adam']) {
    await lab.getByRole('combobox',{name:/Surface/}).selectOption(surface)
    await lab.getByRole('combobox',{name:/Optimiser/}).selectOption(optimiser)
    assert.equal(await stepCount(),0)
    await singleStep()
    assert.equal(await stepCount(),1)
    const grad=gradient(surface,...starts[surface])
    const expected=starts[surface].map((v,i)=>v-.02*(optimiser==='adam'?grad[i]/(Math.abs(grad[i])+1e-8):grad[i]))
    const actual=await position()
    actual.forEach((v,i)=>assert.ok(Math.abs(v-expected[i])<.006,`${surface}/${optimiser}: ${actual} vs ${expected}`))
  }
  await lab.getByRole('button',{name:'Reset',exact:true}).click()
  assert.equal(await stepCount(),0)
  // Invalid steps must produce a recovery path, never NaN values.
  await lab.getByRole('combobox',{name:/Surface/}).selectOption('rosenbrock')
  await lab.getByRole('combobox',{name:/Optimiser/}).selectOption('sgd')
  await lab.locator('input[type=range]').first().fill('0.2')
  for(let i=0;i<8 && !await lab.getByRole('button',{name:'One step',exact:true}).isDisabled();i++) await singleStep()
  assert.match(await lab.locator('.gd-warning').innerText(),/steps became unstable/)
  assert.ok(!(await lab.locator('.gd-stats').innerText()).includes('NaN'))
  await lab.locator('input[type=range]').first().fill('0.02')
  await lab.getByRole('button',{name:'Reset',exact:true}).click()
  assert.equal(await lab.locator('.gd-warning').count(),0)
  await singleStep(); assert.equal(await stepCount(),1)

  for(const width of [1440,900,390,320]) for(const route of ['/labs/gradient-descent','/']) {
    await labPage.setViewportSize({width,height:1000})
    await labPage.goto(`${base}${route}`)
    if(route==='/') await labPage.locator('#try-a-lab').scrollIntoViewIfNeeded()
    await lab.waitFor()
    await labPage.evaluate(()=>window.scrollTo(0,document.querySelector('.gd-lab').getBoundingClientRect().top+scrollY-90))
    const layout=await lab.evaluate(el=>{
      const b=el.getBoundingClientRect(), plot=el.querySelector('.gd-surface').getBoundingClientRect(), controls=el.querySelector('.gd-controls').getBoundingClientRect()
      return {viewport:innerWidth,document:document.documentElement.scrollWidth,left:b.left,right:b.right,overlap:!(plot.right<=controls.left||controls.right<=plot.left||plot.bottom<=controls.top||controls.bottom<=plot.top),overflow:[...el.querySelectorAll('.gd-stats,.gd-controls,.gd-surface,select')].some(e=>e.scrollWidth>e.clientWidth+1)}
    })
    assert.equal(layout.document,layout.viewport,`${route} at ${width}: page overflow`)
    assert.ok(layout.left>=0&&layout.right<=width)
    assert.equal(layout.overlap,false); assert.equal(layout.overflow,false)
    await labPage.screenshot({path:`${output}/${route==='/'?'home':'lab'}-final-${width}.png`})
  }
  await labPage.setViewportSize({width:1440,height:1000})
  await labPage.emulateMedia({reducedMotion:'no-preference'})
  await labPage.goto(`${base}/labs/gradient-descent`)
  await lab.waitFor(); await lab.scrollIntoViewIfNeeded()
  await labPage.waitForFunction(()=>Number(document.querySelector('.gd-stats .stat-value').textContent)>2)
  await lab.getByRole('button',{name:'Pause',exact:true}).click()
  const paused=await stepCount()
  await labPage.waitForTimeout(200)
  assert.equal(await stepCount(),paused)
  await lab.getByRole('button',{name:'Play',exact:true}).click()
  await labPage.waitForFunction(n=>Number(document.querySelector('.gd-stats .stat-value').textContent)>n,paused)
  // Leaving the live demonstration offscreen suspends its updates.
  await labPage.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight))
  await labPage.waitForFunction(()=>document.querySelector('.gd-status').textContent==='Paused')
  const offscreen=await stepCount(); await labPage.waitForTimeout(200); assert.equal(await stepCount(),offscreen)
  assert.deepEqual(errors,[])
  await page.goto(`${base}/`)
  const homeCover=page.locator('.course-artwork[data-playing]').first()
  await homeCover.scrollIntoViewIfNeeded()
  await page.waitForFunction(el=>el.dataset.playing==='true',await homeCover.elementHandle())
  await page.getByRole('button',{name:'Pause course artwork',exact:true}).click()
  await page.waitForFunction(el=>el.querySelector('svg').animationsPaused(),await homeCover.elementHandle())
  console.log(`PASS Chrome ${browser.version()}: 11 distinct loaded illustrations and live SVG scenes; pause, resume, persistence, reduced motion and offscreen suspension; nine numerical optimiser/surface cases; unstable-step recovery; desktop/mobile homepage and full-lab layout at 1440, 900, 390 and 320px; lab play/pause and visibility cleanup.`)
} finally { await browser.close() }
