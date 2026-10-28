import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, rm, readFile, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createAccountHandler } from '../server/accounts.mjs'
const directory = await mkdtemp(join(tmpdir(), 'ilearnai-accounts-'))
const dbPath = join(directory, 'test.sqlite')
const curriculum = [{ slug: 'test', modules: [{ lessons: [{ body: 'private-lesson-sentinel' }] }] }]
let accounts = createAccountHandler({ dbPath, loadCurriculum: async () => curriculum })
const server = createServer((req, res) => { void accounts.handle(req, res) })
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
async function request(path, { cookie, csrf, method = 'GET', body, origin } = {}) {
 const response = await fetch(base + path, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(csrf ? { 'X-CSRF-Token': csrf } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(origin ? { Origin: origin } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) })
 return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie') }
}
try {
 assert.equal((await request('/api/curriculum')).status, 401)
 assert.equal((await request('/api/auth/register', {method:'POST', body:null})).status,400)
 assert.equal((await request('/api/auth/register', {method:'POST', origin:'https://other.example',body:{}})).status,403)
 const one = await request('/api/auth/register', {method:'POST',body:{name:'Test One',email:'one@example.test',password:'long-test-password-1'}})
 assert.equal(one.status,200); assert.match(one.cookie,/HttpOnly/); assert.match(one.cookie,/SameSite=Lax/)
 const cookie = one.cookie.split(';')[0], csrf = one.data.csrfToken
 assert.equal((await request('/api/curriculum',{cookie})).data.tracks[0].modules[0].lessons[0].body,'private-lesson-sentinel')
 const change = { 'done:/courses/test/module/lesson': '1', 'activity:/courses/test/module/lesson#reading': '1', 'work:banking/service-assistant': '1' }
 assert.equal((await request('/api/progress',{cookie,method:'PATCH',body:{changes:change}})).status,403)
 assert.equal((await request('/api/progress',{cookie,csrf,method:'PATCH',body:{changes:change}})).status,200)
 assert.deepEqual((await request('/api/progress',{cookie})).data.progress,change)
 const two = await request('/api/auth/register', {method:'POST',body:{name:'Test Two',email:'two@example.test',password:'long-test-password-2'}})
 assert.deepEqual(two.data.progress,{})
 assert.deepEqual((await request('/api/progress',{cookie:two.cookie.split(';')[0]})).data.progress,{})
 accounts.close(); accounts = createAccountHandler({dbPath,loadCurriculum:async()=>curriculum})
 assert.deepEqual((await request('/api/progress',{cookie})).data.progress,change)
 assert.equal((await request('/api/auth/login',{method:'POST',body:{email:'one@example.test',password:'incorrect-password'}})).status,401)
 assert.equal((await request('/api/auth/logout',{cookie,csrf,method:'POST'})).status,200)
 assert.equal((await request('/api/curriculum',{cookie})).status,401)
 const login = await request('/api/auth/login',{method:'POST',body:{email:'one@example.test',password:'long-test-password-1'}})
 assert.equal(login.status,200); assert.deepEqual(login.data.progress,change)
 const metadata = JSON.parse(await readFile(new URL('../src/data/tracks-catalog.json',import.meta.url),'utf8'))
 assert.ok(metadata.every(t=>t.modules.every(m=>m.lessons.every(l=>l.body===''))))
 const full = JSON.parse(await readFile(new URL('../server/content/curriculum.json',import.meta.url),'utf8'))
 const assets = (await readdir(new URL('../dist/assets/',import.meta.url))).filter(f=>f.endsWith('.js'))
 const browserCode = (await Promise.all(assets.map(f=>readFile(new URL('../dist/assets/'+f,import.meta.url),'utf8')))).join('\n')
 for (const t of full) for (const m of t.modules) for (const l of m.lessons) assert.ok(!browserCode.includes(l.body.slice(0,180)),`Lesson body leaked: ${l.slug}`)
 accounts.close(); accounts = createAccountHandler({dbPath,loadCurriculum:async()=>curriculum,allowGuestContent:true})
 assert.equal((await request('/api/auth/session')).data.preview,true)
 assert.equal((await request('/api/curriculum')).data.tracks[0].modules[0].lessons[0].body,'private-lesson-sentinel')
 assert.equal((await request('/api/progress')).status,401,'Open content must not expose account progress')
 assert.equal((await request('/api/progress',{method:'PATCH',body:{changes:change}})).status,401)
 accounts.close(); accounts = createAccountHandler({dbPath,loadCurriculum:async()=>curriculum,allowGuestContent:false})
 assert.equal((await request('/api/auth/session')).data.preview,false)
 assert.equal((await request('/api/curriculum')).status,401,'Production switch must restore the content gate')
 console.log('Accounts passed: preview access and production switch, protected curriculum, hashed-password login, CSRF/origin checks, isolated progress, SQLite restart persistence, logout, and private lesson build boundary.')
} finally { await new Promise(resolve=>server.close(resolve)); accounts.close(); await rm(directory,{recursive:true,force:true}) }
