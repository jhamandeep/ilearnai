import { useMemo, useState } from 'react'
import { videos, thumb, embedUrl } from '../data/videos'
import { tracks } from '../data/tracks'
import type { Level, Video } from '../data/types'

const levels: Level[] = ['beginner', 'intermediate', 'advanced']
const kinds: Video['kind'][] = ['video', 'playlist', 'channel']

export function Videos() {
  const [track, setTrack] = useState('all')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [kind, setKind] = useState<Video['kind'] | 'all'>('all')
  const [q, setQ] = useState('')
  const [playing, setPlaying] = useState<Video | null>(null)

  const filtered = useMemo(
    () => videos.filter((x) => (track === 'all' || x.track === track) && (level === 'all' || x.level === level) && (kind === 'all' || x.kind === kind) && (x.title + x.channel + x.topic + x.why).toLowerCase().includes(q.toLowerCase())),
    [track, level, kind, q],
  )

  return (
    <>
      <header className="page-head">
        <h1>Free video lectures</h1>
        <p className="lede">Lectures, full university courses and channels on YouTube. Everything here is free to watch. Videos with a play button open in a player on this page.</p>
      </header>
      {playing && (
        <section>
          <div className="player">
            <iframe src={`${embedUrl(playing)}?autoplay=1`} title={playing.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div className="section-head">
            <h2>{playing.title}</h2>
            <button className="btn btn-ghost" onClick={() => setPlaying(null)}>Close</button>
          </div>
          <p className="meta">{playing.channel} · <a href={playing.url} target="_blank" rel="noreferrer">Open on YouTube</a></p>
        </section>
      )}
      <div className="topo-controls">
        <input className="search" style={{ margin: 0 }} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={track} onChange={(e) => setTrack(e.target.value)}><option value="all">All tracks</option>{tracks.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')}><option value="all">All levels</option>{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select>
        <select value={kind} onChange={(e) => setKind(e.target.value as Video['kind'] | 'all')}><option value="all">Videos, playlists, channels</option>{kinds.map((k) => <option key={k} value={k}>{k}</option>)}</select>
        <span className="meta">{filtered.length} of {videos.length}</span>
      </div>
      <div className="video-grid">
        {filtered.map((x) => (
          <article key={x.url} className="video">
            {x.id ? (
              <button className="thumb-btn" onClick={() => { setPlaying(x); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label={`Play ${x.title}`}>
                <img className="thumb" src={thumb(x)} alt="" loading="lazy" />
                <span className="play">▶</span>
              </button>
            ) : (
              <a className="thumb thumb-text" href={x.url} target="_blank" rel="noreferrer">{x.kind === 'playlist' ? 'Playlist' : 'Channel'}</a>
            )}
            <div className="body">
              <span className="meta">{x.channel} · {tracks.find((t) => t.slug === x.track)?.title}</span>
              <h3><a href={x.url} target="_blank" rel="noreferrer">{x.title}</a></h3>
              <p>{x.why}</p>
              <span className="meta"><span className="pill" style={{ marginLeft: 0 }}>{x.level}</span> <span className="pill">{x.topic}</span>{x.minutes ? ` ${x.minutes} min` : ''}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
