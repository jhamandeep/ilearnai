import { DatabaseSync } from 'node:sqlite'
import { randomBytes, randomUUID, scrypt, createHash, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

const derive = promisify(scrypt)
const SESSION_MS = 7 * 86400000
const COOKIE = 'ilearnai_session'
const cost = { N: 65536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 }
const digest = (value) => createHash('sha256').update(value).digest('hex')
const fail = (status, message) => Object.assign(new Error(message), { status })

async function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  const hash = await derive(password, salt, 64, cost)
  return `${salt}:${hash.toString('hex')}`
}
async function passwordMatches(password, stored) {
  const [salt, hash] = stored.split(':')
  const actual = await derive(password, salt, 64, cost)
  const expected = Buffer.from(hash, 'hex')
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
async function jsonBody(request, limit = 512 * 1024) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw fail(415, 'Send JSON content.')
  const chunks = []
  let size = 0
  for await (const chunk of request) { size += chunk.length; if (size > limit) throw fail(413, 'Request is too large.'); chunks.push(chunk) }
  try { const value = JSON.parse(Buffer.concat(chunks).toString()); if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(); return value } catch { throw fail(400, 'Invalid JSON request.') }
}
function sameOrigin(request) {
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  if (!request.headers.origin) return true
  try { return new URL(request.headers.origin).host === request.headers.host } catch { return false }
}
function cookieToken(request) {
  return request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1) ?? ''
}
function sessionCookie(request, token, maxAge = SESSION_MS / 1000) {
  const secure = request.socket.encrypted || (process.env.TRUST_PROXY === '1' && request.headers['x-forwarded-proto'] === 'https')
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`
}

export function createAccountHandler({ dbPath = process.env.AUTH_DB_PATH ?? resolve('data/ilearnai.sqlite'), loadCurriculum, allowGuestContent = false }) {
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true, mode: 0o700 })
  const db = new DatabaseSync(dbPath)
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, csrf_token TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS user_progress (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, data TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);`)
  const attempts = new Map()
  const userView = (row) => ({ id: row.id, name: row.name, email: row.email, createdAt: row.created_at })
  const progressFor = (id) => JSON.parse(db.prepare('SELECT data FROM user_progress WHERE user_id = ?').get(id)?.data ?? '{}')
  const sessionFor = (request) => {
    const raw = cookieToken(request)
    if (!raw || raw.length > 200) return null
    return db.prepare('SELECT users.*, sessions.csrf_token, sessions.token_hash FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?').get(digest(raw), Date.now()) ?? null
  }
  function establish(request, response, user) {
    const token = randomBytes(32).toString('base64url')
    const csrfToken = randomBytes(24).toString('base64url')
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now())
    const previous = cookieToken(request)
    if (previous) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(previous))
    db.prepare('INSERT INTO sessions (token_hash, user_id, csrf_token, expires_at) VALUES (?, ?, ?, ?)').run(digest(token), user.id, csrfToken, Date.now() + SESSION_MS)
    response.setHeader('Set-Cookie', sessionCookie(request, token))
    return { user: userView(user), csrfToken, progress: progressFor(user.id), preview: allowGuestContent }
  }
  function rateLimit(request) {
    const key = request.socket.remoteAddress ?? 'local'
    const now = Date.now()
    const record = attempts.get(key)
    if (record && now - record.start < 15 * 60000) {
      if (record.count >= 20) throw fail(429, 'Too many attempts. Try again in 15 minutes.')
      record.count++
    } else attempts.set(key, { start: now, count: 1 })
    if (attempts.size > 1000) for (const [address, item] of attempts) if (now - item.start > 15 * 60000) attempts.delete(address)
  }
  async function handle(request, response) {
    const path = new URL(request.url ?? '/', 'http://localhost').pathname
    if (!path.startsWith('/api/auth/') && path !== '/api/progress' && path !== '/api/curriculum') return false
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    const send = (status, data) => {
      response.statusCode = status
      const body = JSON.stringify(data)
      if (body.length > 1024 && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '')) { response.setHeader('Content-Encoding', 'gzip'); response.setHeader('Vary', 'Accept-Encoding'); response.end(gzipSync(body)) }
      else response.end(body)
    }
    try {
      if (request.method !== 'GET' && !sameOrigin(request)) throw fail(403, 'This request must come from this site.')
      if ((path === '/api/auth/register' || path === '/api/auth/login') && request.method === 'POST') {
        rateLimit(request)
        const data = await jsonBody(request, 16000)
        const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
        const password = typeof data.password === 'string' ? data.password : ''
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 10 || password.length > 128) throw fail(400, 'Use a valid email and a password of 10–128 characters.')
        let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
        if (path.endsWith('/register')) {
          const name = typeof data.name === 'string' ? data.name.trim() : ''
          if (!name || name.length > 80) throw fail(400, 'Enter a name of 1–80 characters.')
          if (user) throw fail(409, 'An account with this email already exists. Sign in instead.')
          const hash = await passwordHash(password)
          const id = randomUUID()
          try { db.prepare('INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)').run(id, email, name, hash, new Date().toISOString()) } catch { throw fail(409, 'An account with this email already exists.') }
          user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
        } else {
          const stored = user?.password_hash ?? '00000000000000000000000000000000:' + '00'.repeat(64)
          if (!(await passwordMatches(password, stored)) || !user) throw fail(401, 'Email or password is incorrect.')
        }
        if (path.endsWith('/login')) attempts.delete(request.socket.remoteAddress ?? 'local')
        send(200, establish(request, response, user)); return true
      }
      const session = sessionFor(request)
      if (path === '/api/auth/session' && request.method === 'GET') {
        send(200, session ? { user: userView(session), csrfToken: session.csrf_token, progress: progressFor(session.id), preview: allowGuestContent } : { user: null, csrfToken: null, progress: {}, preview: allowGuestContent }); return true
      }
      if (path === '/api/curriculum' && request.method === 'GET' && (session || allowGuestContent)) { send(200, { tracks: await loadCurriculum() }); return true }
      if (!session) throw fail(401, 'Sign in to continue learning.')
      if (request.method !== 'GET' && request.headers['x-csrf-token'] !== session.csrf_token) throw fail(403, 'Your session changed. Reload and try again.')
      if (path === '/api/auth/logout' && request.method === 'POST') {
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(session.token_hash)
        response.setHeader('Set-Cookie', sessionCookie(request, '', 0))
        send(200, { ok: true }); return true
      }
      if (path === '/api/progress' && request.method === 'GET') { send(200, { progress: progressFor(session.id) }); return true }
      if (path === '/api/progress' && (request.method === 'PUT' || request.method === 'PATCH')) {
        const data = await jsonBody(request)
        const progress = request.method === 'PATCH' ? data.changes : data.progress
        if (!progress || typeof progress !== 'object' || Array.isArray(progress) || Object.keys(progress).length > 6000) throw fail(400, 'Invalid progress data.')
        for (const [key, value] of Object.entries(progress)) if (!/^(done:\/courses\/|activity:\/courses\/|work:[a-z0-9-]+\/[a-z0-9-]+$|quiz:\/courses\/|exam:|placement$|last-lesson$)/.test(key) || key.length > 400 || !(typeof value === 'string' || (request.method === 'PATCH' && value === null)) || (typeof value === 'string' && value.length > 16000)) throw fail(400, 'Invalid progress entry.')
        const merged = request.method === 'PATCH' ? progressFor(session.id) : {}
        for (const [key, value] of Object.entries(progress)) { if (value === null) delete merged[key]; else merged[key] = value }
        const at = new Date().toISOString()
        db.prepare('INSERT INTO user_progress (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at').run(session.id, JSON.stringify(merged), at)
        send(200, { ok: true, savedAt: at }); return true
      }
      send(404, { error: 'Unknown account endpoint.' }); return true
    } catch (error) {
      send(error.status ?? 500, { error: error.status ? error.message : 'The account service is unavailable. Try again.' }); return true
    }
  }
  return { handle, close: () => db.close() }
}
