import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { videos, embedUrl } from '../data/videos'
import { levelInfo, type Video } from '../data/types'
import { VideoThumbnail } from '../components/VideoThumbnail'
import { LibraryFilters } from '../components/LibraryFilters'
import { groupLibrary } from '../lib/library'
import { useLibraryFilters } from '../lib/useLibraryFilters'

const kinds = ['video', 'playlist', 'channel'] as const

export function Videos() {
  const filters = useLibraryFilters(kinds)
  const [playing, setPlaying] = useState<Video | null>(null)
  const player = useRef<HTMLElement>(null)
  const query = filters.q.trim().toLowerCase()
  const filtered = videos.filter((video) => (filters.track === 'all' || video.track === filters.track) && (filters.level === 'all' || video.level === filters.level) && (filters.kind === 'all' || video.kind === filters.kind) && `${video.title} ${video.channel} ${video.topic} ${video.why}`.toLowerCase().includes(query))
  const groups = groupLibrary(filtered)
  function play(video: Video) {
    setPlaying(video)
    requestAnimationFrame(() => {
      player.current?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      player.current?.focus({ preventScroll: true })
    })
  }
  return (
    <>
      <header className="page-head"><p className="eyebrow">Watch and learn</p><h1>Free video lectures and courses</h1><p className="lede">Explore every video, playlist, and channel, organized by level, learning track, and topic. Play supported videos here, or open the original source.</p><div className="hero-actions"><Link to="/resources" className="text-cta">Browse other resources ↗</Link></div></header>
      {playing && <section className="library-player" ref={player} tabIndex={-1} aria-label={`Now playing: ${playing.title}`}><div className="player"><iframe key={playing.id} src={`${embedUrl(playing)}?autoplay=1`} title={playing.title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div><div className="section-head"><h2>{playing.title}</h2><button type="button" className="btn btn-ghost" onClick={() => setPlaying(null)}>Close player</button></div><p className="meta">{playing.channel} · <a href={playing.url} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></p></section>}
      <LibraryFilters filters={filters} kinds={kinds} count={filtered.length} total={videos.length} label="videos, playlists, and channels" />
      {groups.map((group) => <section className="level-group" key={group.level} id={`videos-${group.level}`}><div className="level-head"><h2><span className={`lvl lvl-${group.level}`}>{levelInfo[group.level].short}</span>{levelInfo[group.level].label}</h2><p>{levelInfo[group.level].who}</p><span className="meta">{group.count} resources</span></div>{group.tracks.map(({ track, count, topics }) => <section className="library-track" key={track.slug}><div className="library-track-head"><h3><Link to={`/courses/${track.slug}`}>{track.title}</Link></h3><span className="meta">{count} resources</span></div>{topics.map(({ topic, items }) => <div className="module library-topic" key={topic}><h4>{topic} <span className="meta">{items.length}</span></h4><div className="video-grid">{items.map((video, index) => <article className="video" key={`${video.url}-${index}`} data-resource-track={video.track} data-resource-level={video.level}>
        {video.id && video.embeddable !== false ? <button type="button" className="thumb-btn" onClick={() => play(video)} aria-label={`Play ${video.title}`}><VideoThumbnail id={video.id} title={video.title} /></button> : <a className="thumb-btn" href={video.url} target="_blank" rel="noreferrer" aria-label={`Open ${video.title} on YouTube`}><VideoThumbnail id={video.id} title={video.title} kind={video.kind} external /></a>}
        <div className="body"><span className="meta">{video.channel}{video.minutes ? ` · ${video.minutes} min` : ''} · {video.kind}</span><h3><a href={video.url} target="_blank" rel="noreferrer">{video.title}</a></h3><p>{video.why}</p><a className="video-source" href={video.url} target="_blank" rel="noreferrer">{video.embeddable === false ? 'Watch on YouTube' : video.kind === 'playlist' ? 'Open playlist' : video.kind === 'channel' ? 'Explore channel' : 'Open on YouTube'} ↗</a></div>
      </article>)}</div></div>)}</section>)}</section>)}
      {!filtered.length && <div className="library-empty"><h2>No matching videos</h2><p>Try another track, level, or search term.</p><button type="button" className="btn" onClick={filters.clearFilters}>Show all videos</button></div>}
    </>
  )
}
