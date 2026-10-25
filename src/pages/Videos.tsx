import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { videos, thumb, embedUrl } from '../data/videos'
import { tracks } from '../data/tracks'
import { levelInfo, levelOrder, type Level, type Video } from '../data/types'

const kinds: Video['kind'][] = ['video', 'playlist', 'channel']

export function Videos() {
  const [track, setTrack] = useState('all')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [kind, setKind] = useState<Video['kind'] | 'all'>('all')
  const [q, setQ] = useState('')
  const [playing, setPlaying] = useState<Video | null>(null)
  const sortedTracks = useMemo(() => [...tracks].sort((a, b) => a.order - b.order), [])

  const filtered = useMemo(
    () => videos.filter((x) => (track === 'all' || x.track === track) && (level === 'all' || x.level === level) && (kind === 'all' || x.kind === kind) && (x.title + x.channel + x.topic + x.why).toLowerCase().includes(q.toLowerCase())),
    [track, level, kind, q],
  )

  const stanford = videos.filter((v) => /stanford/i.test(v.channel) || /stanford/i.test(v.title))

  return (
    <>
      <header className="page-head">
        <h1>Free video lectures and courses</h1>
        <p className="lede">
          {videos.length} videos, playlists and channels, all free, grouped by level and then by topic. Every id was verified. Videos with a play button open in a player here; a few university lectures open on YouTube because their owner disabled embedding.
        </p>
        <p className="meta">Full university courses: {stanford.length} Stanford lectures and playlists (CS229, CS224N, CS230, CS231n, CS25, CS234, CS336, CS224W, CS330, EE364A, CS109) plus MIT 6.824 and Harvard CS50. Filter by level to find where to start.</p>
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
        <select value={track} onChange={(e) => setTrack(e.target.value)}><option value="all">All tracks</option>{sortedTracks.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')}><option value="all">All levels</option>{levelOrder.map((l) => <option key={l} value={l}>{levelInfo[l].short} {levelInfo[l].label}</option>)}</select>
        <select value={kind} onChange={(e) => setKind(e.target.value as Video['kind'] | 'all')}><option value="all">Videos, playlists, channels</option>{kinds.map((k) => <option key={k} value={k}>{k}</option>)}</select>
        <span className="meta">{filtered.length} of {videos.length}</span>
      </div>
      {levelOrder.map((lv) => {
        const group = filtered.filter((x) => x.level === lv)
        if (!group.length) return null
        const topics = [...new Set(group.map((x) => x.topic))].sort()
        return (
          <section key={lv} className="level-group">
            <div className="level-head"><h2><span className={`lvl lvl-${lv}`}>{levelInfo[lv].short}</span>{levelInfo[lv].label}</h2><p>{levelInfo[lv].who}</p></div>
            {topics.map((topic) => (
              <div key={topic} className="module">
                <h3>{topic} <span className="meta">{group.filter((x) => x.topic === topic).length}</span></h3>
                <div className="video-grid">
                  {group.filter((x) => x.topic === topic).map((x) => (
                    <article key={x.url} className="video">
                      {x.id && x.embeddable !== false ? (
                        <button className="thumb-btn" onClick={() => { setPlaying(x); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label={`Play ${x.title}`}>
                          <img className="thumb" src={thumb(x)} alt="" loading="lazy" />
                          <span className="play">▶</span>
                        </button>
                      ) : x.id ? (
                        <a className="thumb-btn" href={x.url} target="_blank" rel="noreferrer" aria-label={`Open ${x.title} on YouTube`}>
                          <img className="thumb" src={thumb(x)} alt="" loading="lazy" />
                          <span className="play">↗</span>
                        </a>
                      ) : (
                        <a className="thumb thumb-text" href={x.url} target="_blank" rel="noreferrer">{x.kind === 'playlist' ? 'Playlist' : 'Channel'}</a>
                      )}
                      <div className="body">
                        <span className="meta">{x.channel} · <Link to={`/courses/${x.track}`}>{tracks.find((t) => t.slug === x.track)?.title}</Link>{x.minutes ? ` · ${x.minutes} min` : ''}</span>
                        <h3><a href={x.url} target="_blank" rel="noreferrer">{x.title}</a></h3>
                        <p>{x.why}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )
      })}
      {filtered.length === 0 && <p className="meta">Nothing matches.</p>}
    </>
  )
}
