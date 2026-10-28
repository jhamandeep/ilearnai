import assert from 'node:assert/strict'
import { aggregateNews, normalizeItems, articleUrl, FEED_LIMIT } from '../server/news.mjs'

const now = Date.parse('2026-10-26T10:00:00Z')
const source = { id: 'example', name: 'Example AI', feed: 'https://example.com/rss', website: 'https://example.com/' }
const rss = `<?xml version="1.0"?><rss version="2.0"><channel><title>AI</title><item><title><![CDATA[Models &amp; <b>tools</b>]]></title><link>https://example.com/new?utm_source=rss</link><pubDate>Sun, 25 Oct 2026 12:00:00 GMT</pubDate></item></channel></rss>`
const atom = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>AI</title><entry><title>Research update</title><link href="https://example.com/research"/><id>https://example.com/research</id><updated>2026-10-24T12:00:00Z</updated></entry></feed>`
const xml = (body) => new Response(body, { headers: { 'content-type': 'application/rss+xml' } })
const fresh = await aggregateNews({ now, feedSources: [source], fetcher: async () => xml(rss) })
assert.equal(fresh.status, 'fresh')
assert.equal(fresh.items.length, 1)
assert.equal(fresh.items[0].url, 'https://example.com/new')
assert.ok(!fresh.items[0].title.includes('<b>'))
assert.equal(fresh.items[0].title, 'Models & tools')
const atomResult = await aggregateNews({ now, feedSources: [source], fetcher: async () => xml(atom) })
assert.equal(atomResult.items[0].title, 'Research update')
const cached = await aggregateNews({ now: now + 1000, feedSources: [source], previous: fresh, fetcher: async () => { throw new Error('offline') } })
assert.equal(cached.status, 'cached')
assert.equal(cached.updatedAt, fresh.updatedAt)
assert.deepEqual(cached.items, fresh.items)
const second = { ...source, id: 'second', name: 'Second AI', feed: 'https://example.com/second' }
const partial = await aggregateNews({ now, feedSources: [source, second], fetcher: async (url) => url === source.feed ? xml(rss) : new Response('down', { status: 503 }) })
assert.equal(partial.status, 'partial')
assert.equal(partial.items.length, 1)
const badXml = await aggregateNews({ now, feedSources: [source], fetcher: async () => xml('<!DOCTYPE rss [<!ENTITY external SYSTEM "file:///etc/passwd">]><rss/>') })
assert.equal(badXml.status, 'unavailable')
const oversized = await aggregateNews({ now, feedSources: [source], fetcher: async () => new Response(rss, { headers: { 'content-length': '999999999' } }) })
assert.equal(oversized.items.length, 0)
for (const bad of ['', 'javascript:alert(1)', 'http://example.com/a', 'https://evil.example/a', 'https://user:password@example.com/a']) assert.equal(articleUrl(bad, source), null)
const normalized = normalizeItems([
  { title: 'No date', link: 'https://example.com/no-date' },
  { title: 'Future', link: 'https://example.com/future', isoDate: '2030-01-01' },
  { title: 'Unsafe', link: 'javascript:alert(1)', isoDate: '2026-10-25' },
  ...Array.from({ length: 15 }, (_, i) => ({ title: `News ${i}`, link: `https://example.com/${i}`, isoDate: `2026-10-${String(25 - i).padStart(2, '0')}T12:00:00Z` })),
], source, now)
assert.equal(normalized.length, FEED_LIMIT)
assert.ok(normalized.every((item) => item.url.startsWith('https://example.com/')))
console.log('PASS RSS + Atom parsing, source isolation, cached fallback, safe URLs, size limits, dates, and headline limits')
