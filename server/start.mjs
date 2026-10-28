import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { newsHandler } from './news.mjs'
import { createAccountHandler } from './accounts.mjs'

const root = fileURLToPath(new URL('../dist/', import.meta.url))
let curriculum
const accounts = createAccountHandler({ allowGuestContent: process.env.REQUIRE_LOGIN !== '1', loadCurriculum: async () => curriculum ??= JSON.parse(await readFile(new URL('./content/curriculum.json', import.meta.url), 'utf8')) })
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.m4a': 'audio/mp4' }
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
  if (pathname === '/api/ai-news') { await newsHandler(request, response); return }
  if (await accounts.handle(request, response)) return
  if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405); response.end(); return }
  try {
    const decoded = decodeURIComponent(pathname)
    const candidate = resolve(root, '.' + decoded)
    if (relative(root, candidate).startsWith('..') || decoded.includes('\0')) { response.writeHead(403); response.end(); return }
    let file = candidate
    try { if (!(await stat(file)).isFile()) file = resolve(root, 'index.html') } catch {
      if (extname(pathname) || pathname.startsWith('/api/')) { response.writeHead(404); response.end('Not found'); return }
      file = resolve(root, 'index.html')
    }
    const body = await readFile(file)
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': extname(file) === '.html' ? 'no-cache' : pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=60' })
    response.end(request.method === 'HEAD' ? undefined : body)
  } catch { response.writeHead(404); response.end('Not found. Run npm run build first.') }
})
const port = Number(process.env.PORT ?? 4173)
const host = process.env.HOST ?? '127.0.0.1'
server.listen(port, host, () => console.log(`ilearnai: http://${host}:${port} (RSS endpoint enabled)`))
process.on('SIGTERM', () => server.close(() => accounts.close()))
