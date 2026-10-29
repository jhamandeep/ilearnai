import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'
const base = process.env.APP_URL ?? 'http://127.0.0.1:5178'
const output = 'output/reviews/guides-chat'
await mkdir(output,{recursive:true})
const browser = await chromium.launch({channel:'chrome',headless:true})
let checks=0
const errors=[]
try {
  const context=await browser.newContext({viewport:{width:1440,height:1050},colorScheme:'light'})
  const page=await context.newPage()
  page.on('pageerror',e=>errors.push(e.message))
  const waitCards = n => page.waitForFunction(count => document.querySelectorAll('[data-certification]').length === count, n)
  const questionRequests=[]
  page.on('request',r=>{if(r.method()==='POST')questionRequests.push(r.url())})
  await page.goto(base+'/certifications')
  await page.getByRole('heading',{name:/Choose a certification/}).waitFor()
  assert.equal(await page.locator('[data-certification]').count(),8);checks++
  await page.getByRole('combobox',{name:'Choose your focus'}).selectOption('business')
  await waitCards(4)
  assert.equal(await page.locator('[data-certification]').count(),4)
  assert.match(page.url(),/role=business/);checks+=2
  await page.getByRole('searchbox',{name:'Search certifications'}).fill('Microsoft')
  await waitCards(1)
  assert.equal(await page.locator('[data-certification]').count(),1);checks++
  await page.reload();await waitCards(1);assert.equal(await page.locator('[data-certification]').count(),1);checks++
  await page.getByRole('searchbox',{name:'Search certifications'}).fill('no-such-provider')
  await page.getByRole('heading',{name:'No matching pathways'}).waitFor()
  await page.getByRole('button',{name:'Show all certifications'}).click()
  await waitCards(8)
  assert.equal(await page.locator('[data-certification]').count(),8);checks++
  await page.screenshot({path:output+'/certifications-desktop.png',fullPage:true})
  await page.evaluate(()=>window.scrollTo(0,0))
  await page.screenshot({path:output+'/certifications-top.png'})
  await page.goto(base+'/ai-infrastructure')
  await page.getByRole('heading',{name:/What does AI/}).waitFor()
  const workload=page.getByRole('group',{name:'AI workload'})
  for(const button of await workload.getByRole('button').all()){
    await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true')
    assert.equal(await workload.locator('[aria-pressed=true]').count(),1);checks+=2
  }
  await page.getByRole('button',{name:'Run a local model',exact:true}).click()
  assert.match(await page.locator('.system-recommendation').innerText(),/VRAM/)
  await page.getByRole('combobox',{name:'Model size'}).selectOption('70')
  await page.getByRole('combobox',{name:'Bits per parameter'}).selectOption('4')
  assert.match(await page.locator('.memory-result').innerText(),/35 GB/);checks+=2
  await page.getByRole('combobox',{name:'Bits per parameter'}).selectOption('16')
  assert.match(await page.locator('.memory-result').innerText(),/140 GB/)
  assert.match(await page.locator('.memory-estimator').innerText(),/lower bound/);checks+=2
  for(let i=0;i<5;i++){
    const button=page.locator('.request-flow button').nth(i);await button.click()
    assert.equal(await button.getAttribute('aria-current'),'step')
    assert.match(await page.locator('.request-detail').innerText(),new RegExp('Step '+(i+1),'i'));checks+=2
  }
  await page.getByRole('button',{name:'Start again'}).click()
  assert.equal(await page.locator('.request-flow button').first().getAttribute('aria-current'),'step');checks++
  await page.screenshot({path:output+'/infrastructure-desktop.png',fullPage:true})
  const open=page.getByRole('button',{name:'Open Ask me'})
  await open.click()
  const dialog=page.getByRole('dialog',{name:'Ask me',exact:true})
  await dialog.getByRole('textbox',{name:'Ask me a question'}).waitFor()
  await dialog.getByRole('button',{name:'Choose a certification',exact:true}).click()
  await dialog.getByRole('heading',{name:'Choose an AI certification'}).waitFor();checks++
  assert.equal(questionRequests.length,0,'Built-in answers must not send a POST');checks++
  await dialog.getByRole('link',{name:/Compare certification pathways/}).click()
  await page.getByRole('heading',{name:/Choose a certification/}).waitFor()
  assert.equal(await dialog.count(),0,'Navigation closes the modal');checks++
  await open.click();assert.equal(await dialog.locator('.askme-exchange').count(),1);checks++
  await page.keyboard.press('Escape')
  assert.equal(await open.evaluate(el=>el===document.activeElement),true);checks++
  await open.click()
  await dialog.getByRole('textbox').fill('<script>alert("test")</script>')
  await dialog.getByRole('button',{name:'Send question'}).click()
  assert.equal(await dialog.locator('script').count(),0);checks++
  await dialog.getByRole('button',{name:'Clear conversation'}).click()
  assert.equal(await dialog.locator('.askme-exchange').count(),0);checks++
  await dialog.getByRole('button',{name:'What computer do I need?',exact:true}).click()
  await dialog.getByRole('heading',{name:'Choose a computer for AI'}).waitFor();checks++
  for(let i=0;i<14;i++){
    await dialog.getByRole('textbox').fill('What is RAG?')
    await dialog.getByRole('button',{name:'Send question'}).click()
  }
  assert.equal(await dialog.locator('.askme-exchange').count(),12);checks++
  for(let i=0;i<20;i++){
    await page.keyboard.press('Tab')
    assert.equal(await dialog.evaluate(el=>el.contains(document.activeElement)),true);checks++
  }
  await dialog.getByRole('button',{name:'Close Ask me'}).click()
  await page.goto(base+'/courses/start-here/how-a-computer-works/input-process-store-output/animation-1')
  await page.locator('[data-narrated]').waitFor()
  await open.click()
  await dialog.getByRole('button',{name:'Explain this lesson',exact:true}).click()
  assert.equal(await dialog.getByRole('link',{name:/Explore this lesson/}).count(),1);checks++
  await page.keyboard.press('Escape')
  for(const width of [1440,720,390,320]){
    await page.setViewportSize({width,height:950})
    for(const route of ['/','/certifications','/ai-infrastructure']){
      await page.goto(base+route)
      await page.locator('h1').first().waitFor()
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`${route} overflow at ${width}`);checks++
      if(route==='/'){
        assert.equal(await page.locator('.gd-lab,.gd-canvas').count(),0)
        assert.equal(await page.locator('.home-lab-links a').count(),3);checks+=2
      }
    }
    await open.click();await dialog.getByRole('textbox').waitFor()
    const bounds=await dialog.boundingBox()
    assert.ok(bounds.x>=0 && bounds.x+bounds.width<=width+1 && bounds.y>=0 && bounds.y+bounds.height<=950);checks++
    await dialog.getByRole('button',{name:'What computer do I need?',exact:true}).click()
    const send=await dialog.getByRole('button',{name:'Send question'}).boundingBox()
    assert.ok(send.y+send.height<=950 && send.x+send.width<=width);checks++
    await page.screenshot({path:`${output}/askme-${width}.png`})
    await page.keyboard.press('Escape')
    if(width<=390) await page.screenshot({path:`${output}/infrastructure-${width}.png`,fullPage:true})
  }
  await page.setViewportSize({width:1440,height:1050})
  await page.goto(base+'/')
  await page.locator('.brand-symbol').first().waitFor()
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.waitForFunction(()=>document.querySelector('.brand-symbol')?.dataset.motion==='off')
  assert.equal(await page.locator('.brand-signal').first().evaluate(el=>getComputedStyle(el).animationName),'none');checks++
  const ids=await page.locator('linearGradient[id^=brand-]').evaluateAll(els=>els.map(el=>el.id))
  assert.equal(new Set(ids).size,ids.length);checks++
  await page.emulateMedia({reducedMotion:'no-preference'})
  await page.getByRole('button',{name:'Pause visual motion'}).click()
  assert.equal(await page.locator('.brand-signal').first().evaluate(el=>getComputedStyle(el).animationPlayState),'paused');checks++
  await page.getByRole('button',{name:'Play visual motion'}).click()
  assert.equal(await page.locator('.brand-signal').first().evaluate(el=>getComputedStyle(el).animationPlayState),'running');checks++
  await page.goto(base+'/ask')
  assert.equal(await open.count(),0);checks++
  await page.goto(base+'/certifications');await page.emulateMedia({colorScheme:'dark'})
  await open.click();await dialog.getByRole('textbox').waitFor()
  await page.screenshot({path:output+'/dark-chat.png'})
  assert.deepEqual(errors,[])
  await writeFile(output+'/report.json',JSON.stringify({checks,errors,questionRequests},null,2))
  console.log(`PASS ${checks} guide, static-chat, responsive, accessibility and brand-motion checks.`)
} finally {await browser.close()}
