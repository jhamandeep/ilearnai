import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, Routes, Route } from 'react-router-dom'
import { createServer } from 'vite'
const vite = await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'})
const originalFetch = globalThis.fetch
try {
  const { industries, workCaseCount } = await vite.ssrLoadModule('/src/data/work/industries.ts')
  const { workRoles } = await vite.ssrLoadModule('/src/data/work/roles.ts')
  const { ForWork, IndustryPage, WorkCasePage } = await vite.ssrLoadModule('/src/pages/ForWork.tsx')
  const { AuthContext } = await vite.ssrLoadModule('/src/lib/auth.tsx')
  const { roleActions, buildWorkBrief, estimateCapacity } = await vite.ssrLoadModule('/src/lib/workLearning.ts')
  const { answerSiteQuestion } = await vite.ssrLoadModule('/src/lib/siteHelp.ts')
  const { featuredVideos, featuredVideoIds } = await vite.ssrLoadModule('/src/data/featuredVideos.ts')
  const { Home } = await vite.ssrLoadModule('/src/pages/Home.tsx')
  const { Dashboard } = await vite.ssrLoadModule('/src/pages/Dashboard.tsx')
  const progress = await vite.ssrLoadModule('/src/lib/progress.ts')
  const memory = new Map()
  progress.setProgressStore({get:key=>memory.get(key)??null,set:(key,value)=>memory.set(key,value),remove:key=>memory.delete(key),keys:()=>[...memory.keys()]})
  const render = (Component, url, route='*') => renderToString(createElement(StaticRouter,{location:url},createElement(AuthContext.Provider,{value:{preview:true,user:null,loading:false,syncStatus:'saved',serviceError:''}},createElement(Routes,null,createElement(Route,{path:route,element:createElement(Component)})))))
  const text = html => html.replaceAll('<!-- -->','').replaceAll('&#x27;',"'").replaceAll('&amp;','&')
  const valid = new Set(['/for-work','/dashboard','/courses','/ask'])
  industries.forEach(industry=>{valid.add(`/for-work/${industry.slug}`);industry.cases.forEach(item=>valid.add(`/for-work/${industry.slug}/${item.slug}`))})
  assert.equal(industries.length,12);assert.equal(workCaseCount,36);assert.equal(workRoles.length,7)
  assert.equal(new Set(industries.map(i=>i.slug)).size,industries.length)
  const hub = render(ForWork,'/for-work')
  assert.equal((hub.match(/data-industry=/g)??[]).length,12)
  assert.match(hub,/No coding required/)
  const filtered = render(ForWork,'/for-work?q=healthcare&role=managers')
  assert.equal((filtered.match(/data-industry=/g)??[]).length,1)
  assert.match(filtered,/href="\/for-work\/healthcare\?role=managers"/)
  assert.match(render(ForWork,'/for-work?q=zzznomatch'),/No matching field yet/)
  assert.match(render(ForWork,'/for-work?role=invalid'),/For <!-- -->leadership/)
  assert.match(render(IndustryPage,'/for-work/missing','/for-work/:industry'),/That page does not exist/)
  assert.match(render(WorkCasePage,'/for-work/banking/missing','/for-work/:industry/:useCase'),/That page does not exist/)
  let views = 0
  for (const industry of industries) {
    assert.ok(industry.source.url.startsWith('https://'))
    assert.equal(new Set(industry.cases.map(item=>item.slug)).size,industry.cases.length)
    assert.deepEqual(new Set(Object.keys(industry.roles)),new Set(workRoles.map(role=>role.id)))
    const overview = render(IndustryPage,`/for-work/${industry.slug}`,'/for-work/:industry')
    assert.equal((overview.match(/data-work-case=/g)??[]).length,industry.cases.length)
    assert.ok(overview.includes(industry.source.url.replaceAll('&','&amp;')))
    assert.match(overview,/How the possibilities are changing/)
    const source = overview.match(/<img[^>]*src="([^"]+)"/)[1]
    await access(new URL(`../public${source}`,import.meta.url))
    for (const item of industry.cases) {
      const roleOutputs = new Set()
      for (const role of workRoles) {
        const url = `/for-work/${industry.slug}/${item.slug}?role=${role.id}`
        const html = render(WorkCasePage,url,'/for-work/:industry/:useCase')
        assert.ok(!html.includes('That page does not exist'),url)
        assert.ok(text(html).includes(industry.roles[role.id]),`${url}: role context missing`)
        assert.match(html,/data-work-flow="true"/)
        assert.match(html,/Download your brief/)
        assert.match(html,/Mark guide reviewed/)
        assert.ok(!html.includes('Sign in to'),`${url}: sign-in barrier returned`)
        const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,new Set(ids).size,`${url}: duplicate ids`)
        const brief=buildWorkBrief(industry,item,role)
        for (const required of [item.title,item.metric,item.stop,item.pilot,industry.source.url,role.deliverable]) assert.ok(brief.includes(required),`${url}: incomplete brief`)
        roleOutputs.add(JSON.stringify(roleActions(industry,item,role)))
        for(const [,href] of html.matchAll(/href="(\/[^"]+)"/g)) assert.ok(valid.has(href.split(/[?#]/)[0]),`${url}: broken link ${href}`)
        views++
      }
      assert.equal(roleOutputs.size,workRoles.length,'Role changes must change practical actions')
    }
  }
  // Review progress stays separate from technical lesson completion.
  progress.setWorkReviewed('banking','service-assistant',true)
  assert.equal(progress.isWorkReviewed('banking','service-assistant'),true)
  assert.equal(progress.isWorkReviewed('healthcare','service-information'),false)
  assert.match(render(WorkCasePage,'/for-work/banking/service-assistant','/for-work/:industry/:useCase'),/Mark as not reviewed/)
  assert.match(text(render(Dashboard,'/dashboard')),/1 of 36 guides reviewed/)
  assert.match(text(render(Dashboard,'/dashboard')),/0 of 220 lessons completed/)
  progress.setWorkReviewed('banking','service-assistant',false)
  assert.equal(progress.isWorkReviewed('banking','service-assistant'),false)

  assert.deepEqual(estimateCapacity({volume:600,eligible:60,before:12,draft:2,review:4,oversight:8}),{affected:360,baselineHours:120,proposedHours:92,netHours:28})
  assert.equal(estimateCapacity({volume:600,eligible:100,before:5,draft:3,review:8,oversight:0}).netHours,-60)
  assert.equal(estimateCapacity({volume:0,eligible:0,before:0,draft:0,review:0,oversight:0}).netHours,0)
  for(const invalid of [NaN,Infinity,-1,101]) assert.equal(estimateCapacity({volume:600,eligible:invalid,before:12,draft:2,review:4,oversight:8}),null)
  globalThis.fetch = () => {throw new Error('Work help must remain static')}
  for(const industry of industries) {
    const answer=answerSiteQuestion(`AI use cases in ${industry.name}`,{preview:true})
    assert.ok(answer.links.some(link=>link.to.startsWith(`/for-work/${industry.slug}`)),`${industry.name}: Ask missed this industry`)
  }
  assert.ok(answerSiteQuestion('AI for a banking manager').links.some(link=>link.to.includes('role=managers')))
  assert.ok(answerSiteQuestion('Compare banking and retail').links.some(link=>link.to==='/for-work#compare'))
  assert.ok(answerSiteQuestion('How can AI help in my work?').links.some(link=>link.to==='/for-work'))
  globalThis.fetch = originalFetch
  const home=render(Home,'/')
  assert.ok(!home.includes('Featured introductory videos'))
  assert.match(home,/Top picks: talks and deep dives/)
  assert.equal(featuredVideos.length,3);assert.equal(new Set(featuredVideoIds).size,3)
  for(const video of featuredVideos){assert.ok(video.level!=='foundations');assert.ok(home.includes(video.url.replaceAll('&','&amp;')))}
  assert.ok(!home.includes('mCq8-xTH7jA'),'Keep exploring must not show the original basic-computers selection')
  console.log(`AI for work passed: 12 industries, 36 complete guides, ${views} role views, source and internal links, role-specific briefs, independent progress, capacity scenarios, static Ask, and 3 curated featured videos.`)
}finally{globalThis.fetch=originalFetch;await vite.close()}
