import { newsHandler } from './news.mjs'
import { createAccountHandler } from './accounts.mjs'
import { readFile } from 'node:fs/promises'

export function newsPlugin() {
  const attach = (server) => {
    let accounts
    server.httpServer?.once('close', () => accounts?.close())
    server.middlewares.use(async (request, response, next) => {
      const path = new URL(request.url ?? '/', 'http://localhost').pathname
      if (path.startsWith('/api/auth/') || path === '/api/progress' || path === '/api/curriculum') {
        try {
        accounts ??= createAccountHandler({ allowGuestContent: process.env.REQUIRE_LOGIN !== '1', loadCurriculum: async () => typeof server.ssrLoadModule === 'function' ? (await server.ssrLoadModule('/src/data/curriculum.ts')).tracks : JSON.parse(await readFile(new URL('./content/curriculum.json', import.meta.url), 'utf8')) })
        await accounts.handle(request, response)
        } catch { response.writeHead(503, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: 'The account service is unavailable. Try again.' })) }
        return
      }
      if (new URL(request.url ?? '/', 'http://localhost').pathname === '/api/ai-news') {
        newsHandler(request, response)
        return
      }
      next()
    })
  }
  return { name: 'ilearnai-services', configureServer: attach, configurePreviewServer: attach }
}
