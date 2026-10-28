import Parser from 'rss-parser'
import { readFile } from 'node:fs/promises'
import sources from '../src/data/news-sources.json' with { type: 'json' }

export const CACHE_MS = 15 * 60 * 1000
export const FEED_LIMIT = 6
const MAX_FEED_BYTES = 2 * 1024 * 1024
const parser = new Parser({ timeout: 10000 })

function plainTitle(value) {
  if (typeof value !== 'string') return ''
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' }
  const decoded = value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, key) => {
    if (key[0] !== '#') return named[key.toLowerCase()] ?? match
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10)
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ''
  })
  return decoded.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 300)
}

export function articleUrl(raw, source) {
  if (typeof raw !== 'string' || !raw.trim()) return null
  try {
    const url = new URL(raw, source.website)
    const host = new URL(source.website).hostname
    if (url.protocol !== 'https:' || url.username || url.password || !(url.hostname === host || url.hostname.endsWith('.' + host))) return null
    url.hash = ''
    for (const key of [...url.searchParams.keys()]) if (key.startsWith('utm_') || key === 'gclid') url.searchParams.delete(key)
    return url.href
  } catch { return null }
}

export function normalizeItems(items, source, now = Date.now()) {
  const found = new Set()
  return items.flatMap((item) => {
    const title = plainTitle(item.title)
    const url = typeof item.link === 'string' && articleUrl(item.link, source)
    const date = Date.parse(item.isoDate ?? item.pubDate ?? '')
    if (!title || !url || !Number.isFinite(date) || date > now + 86400000 || found.has(url)) return []
    found.add(url)
    return [{ title, url, sourceId: source.id, source: source.name, publishedAt: new Date(date).toISOString() }]
  }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, FEED_LIMIT)
}

async function readFeed(response) {
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  if (Number(response.headers.get('content-length')) > MAX_FEED_BYTES) throw new Error('Feed exceeds size limit')
  const reader = response.body?.getReader()
  if (!reader) throw new Error('Empty response')
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.length
      if (size > MAX_FEED_BYTES) throw new Error('Feed exceeds size limit')
      chunks.push(Buffer.from(value))
    }
  } finally { await reader.cancel().catch(() => {}) }
  return Buffer.concat(chunks).toString('utf8')
}

export async function aggregateNews({ fetcher = fetch, feedSources = sources, previous = { items: [], sources: [], updatedAt: null }, now = Date.now() } = {}) {
  const results = await Promise.all(feedSources.map(async (source) => {
    try {
      const response = await fetcher(source.feed, { signal: AbortSignal.timeout(10000), headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml', 'User-Agent': 'ilearnai-RSS/1.0' } })
      const xml = await readFeed(response)
      // External entities/DTDs are unnecessary for RSS and are not processed.
      if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Unsupported XML declaration')
      const parsed = await parser.parseString(xml)
      const items = normalizeItems(parsed.items ?? [], source, now)
      if (!items.length) throw new Error('No usable dated headlines')
      return { source: { ...source, status: 'fresh', updatedAt: new Date(now).toISOString() }, items }
    } catch {
      const items = (previous.items ?? []).filter((item) => item.sourceId === source.id)
      const last = (previous.sources ?? []).find((item) => item.id === source.id)
      return { source: { ...source, status: items.length ? 'cached' : 'unavailable', updatedAt: last?.updatedAt ?? null }, items }
    }
  }))
  const unique = new Map()
  for (const result of results) for (const item of result.items) if (!unique.has(item.url)) unique.set(item.url, item)
  const items = [...unique.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  const fresh = results.filter((result) => result.source.status === 'fresh').length
  return {
    updatedAt: fresh ? new Date(now).toISOString() : previous.updatedAt,
    status: fresh === feedSources.length ? 'fresh' : fresh ? 'partial' : items.length ? 'cached' : 'unavailable',
    items,
    sources: results.map((result) => result.source),
  }
}

let cached
let checkedAt = 0
let pending
export async function getNews() {
  if (!cached) {
    try { cached = JSON.parse(await readFile(new URL('../src/data/news-snapshot.json', import.meta.url), 'utf8')) } catch { cached = { items: [], sources: [], updatedAt: null } }
    if (cached.updatedAt) checkedAt = Date.parse(cached.updatedAt)
  }
  if (Date.now() - checkedAt < CACHE_MS) return cached
  if (!pending) pending = aggregateNews({ previous: cached }).then((payload) => {
    cached = payload
    checkedAt = Date.now()
    return payload
  }).finally(() => { pending = undefined })
  return pending
}

export async function newsHandler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return
  }
  try {
    const payload = await getNews()
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=60, stale-while-revalidate=900', 'X-Content-Type-Options': 'nosniff' })
    response.end(request.method === 'HEAD' ? undefined : JSON.stringify(payload))
  } catch {
    response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ updatedAt: null, status: 'unavailable', items: [], sources }))
  }
}
