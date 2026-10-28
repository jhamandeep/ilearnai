import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import snapshot from '../data/news-snapshot.json'
import feedSources from '../data/news-sources.json'

interface Headline { title: string; url: string; sourceId: string; source: string; publishedAt: string }
interface News { updatedAt: string | null; status: string; items: Headline[]; sources: { id: string; name: string; feed: string; website: string; status?: string }[] }

function validNews(value: unknown): value is News {
  if (!value || typeof value !== 'object') return false
  const data = value as News
  return typeof data.updatedAt === 'string' && Number.isFinite(Date.parse(data.updatedAt)) && Array.isArray(data.items) && data.items.length > 0 && data.items.every((item) => typeof item.title === 'string' && typeof item.url === 'string' && item.url.startsWith('https://') && typeof item.source === 'string' && Number.isFinite(Date.parse(item.publishedAt)))
}

export function NewsTicker() {
  const panelId = 'news-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [news, setNews] = useState<News>(snapshot as News)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [source, setSource] = useState('all')
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    let disposed = false
    let controller: AbortController | undefined
    const refresh = async () => {
      if (document.hidden) return
      controller?.abort()
      const current = new AbortController()
      controller = current
      for (const url of ['/api/ai-news', '/ai-news.json']) {
        try {
          const response = await fetch(url, { signal: current.signal, headers: { Accept: 'application/json' }, cache: 'no-cache' })
          if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) continue
          const data: unknown = await response.json()
          if (validNews(data)) { if (!disposed) setNews((previous) => !previous.items.length || Date.parse(data.updatedAt!) >= Date.parse(previous.updatedAt ?? '') ? data : previous); return }
        } catch { if (current.signal.aborted) return }
      }
    }
    const visibility = () => setHidden(document.hidden)
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const motion = () => setReducedMotion(query.matches)
    motion(); visibility(); void refresh()
    const timer = window.setInterval(refresh, 15 * 60 * 1000)
    document.addEventListener('visibilitychange', visibility)
    query.addEventListener('change', motion)
    return () => { disposed = true; controller?.abort(); clearInterval(timer); document.removeEventListener('visibilitychange', visibility); query.removeEventListener('change', motion) }
  }, [])
  useEffect(() => {
    if (!expanded) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setExpanded(false); toggle.current?.focus() } }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [expanded])
  const items = source === 'all' ? news.items : news.items.filter((item) => item.sourceId === source)
  const stopped = paused || reducedMotion || expanded || hidden || !items.length
  const headlines = (copy = false) => <ul className="news-headlines" aria-hidden={copy ? true : undefined} inert={copy ? true : undefined}>{items.map((item) => <li key={item.url}><span>{item.source}</span><a href={item.url} target="_blank" rel="noreferrer" tabIndex={copy ? -1 : undefined}>{item.title} <span aria-hidden="true">↗</span></a></li>)}</ul>
  const updated = news.updatedAt ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(news.updatedAt)) + ' UTC' : null
  return (
    <aside className="news-ticker" aria-label="AI news from RSS feeds" data-paused={stopped}>
      {expanded && <section id={panelId} className="news-panel" aria-label="AI headlines and sources"><header><div><h2>AI updates</h2><p>{updated ? `Last refreshed ${updated}${news.status === 'cached' ? ' · Cached headlines' : ''}` : 'Headlines are temporarily unavailable. Explore the original feeds below.'}</p></div><button type="button" className="btn btn-ghost btn-sm" onClick={() => { setExpanded(false); toggle.current?.focus() }}>Close</button></header><label className="news-source-filter">Source <select value={source} onChange={(event) => setSource(event.target.value)}><option value="all">All sources</option>{feedSources.map((feed) => <option value={feed.id} key={feed.id}>{feed.name}</option>)}</select></label><ol className="news-reading-list">{items.map((item) => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title} ↗</a><span>{item.source} · <time dateTime={item.publishedAt}>{new Date(item.publishedAt).toISOString().slice(0, 10)}</time></span></li>)}</ol>{!items.length && <p>No headlines available for this source right now.</p>}<div className="news-feeds"><span>RSS sources</span>{feedSources.map((feed) => <a key={feed.id} href={feed.feed} target="_blank" rel="noreferrer">{feed.name} ↗</a>)}</div></section>}
      <div className="news-label"><span className="news-dot" aria-hidden="true" /><strong>AI updates</strong><span>RSS</span></div>
      <div className={`news-window${reducedMotion ? ' is-reduced' : ''}`}><div className="news-track" style={{ '--news-duration': `${Math.max(60, items.length * 12)}s` } as CSSProperties}>{items.length ? <>{headlines()}{!reducedMotion && headlines(true)}</> : <p>AI headlines are temporarily unavailable. Open sources to explore their feeds.</p>}</div></div>
      <div className="news-controls">{!reducedMotion && <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? 'Resume news scrolling' : 'Pause news scrolling'}>{paused ? 'Play' : 'Pause'}</button>}<button type="button" ref={toggle} aria-expanded={expanded} aria-controls={expanded ? panelId : undefined} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Hide' : 'Headlines'}</button></div>
    </aside>
  )
}
