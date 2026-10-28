import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { chapterVideoGuide, chapterVideo } from '../data/learning/chapterVideos'
import { levelInfo } from '../data/types'
import { VideoThumbnail } from './VideoThumbnail'

interface ChapterVideosProps { track: string; module: string; compact?: boolean }
const PlaybackContext = createContext<{ selected: string | null; setSelected: (value: string | null) => void } | null>(null)

export function ChapterVideoGroup({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null)
  return <PlaybackContext.Provider value={{ selected, setSelected }}>{children}</PlaybackContext.Provider>
}

function ChapterVideoSequence({ track, module, compact = false }: ChapterVideosProps) {
  const guide = chapterVideoGuide(track, module)
  const titleId = useId()
  const group = useContext(PlaybackContext)
  const [localSelected, setLocalSelected] = useState<string | null>(null)
  const selected = group ? group.selected : localSelected
  const setSelected = group ? group.setSelected : setLocalSelected
  if (!guide) return null

  const content = <section className="chapter-videos" aria-labelledby={titleId} data-chapter-videos={`${track}/${module}`}>
    <p className="eyebrow">Go beyond the quick introduction</p>
    <h2 id={titleId}>Watch this chapter as a sequence</h2>
    <p>{guide.goal}</p>
    <p>Choose a preview to watch here. Each video stays in its own card; select the next one when you are ready. Full courses and advanced lectures are labelled.</p>
    <ol className="chapter-video-list">{guide.picks.map((item, index) => {
      const video = chapterVideo(item.ref)
      if (!video) return null
      // Include the chapter in the selection so navigation never reuses an old player.
      const key = `${track}/${module}/${item.ref}`
      const active = selected === key
      const canPlay = Boolean(video.id && video.embeddable !== false)
      const playerId = `${titleId}-video-${index}`
      return <li key={key} className={active ? 'chapter-video-card is-selected' : 'chapter-video-card'} data-video-ref={item.ref}>
        <div className="chapter-video-preview" id={playerId}>
          {active && canPlay ? <div className="player">
            <iframe key={key} src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`} title={video.title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div> : <button type="button" className="thumb-btn" aria-label={`${canPlay ? 'Play' : 'Preview'} ${video.title}${canPlay ? ' here' : ''}`} aria-expanded={active} onClick={() => setSelected(key)}>
            <VideoThumbnail id={video.id} title={video.title} kind={video.kind} external={!canPlay} />
            <span className="chapter-video-preview-label">{canPlay ? 'Play here' : video.kind === 'playlist' ? 'Full series · view details' : 'YouTube video · view details'}</span>
          </button>}
          {active && !canPlay && <p className="chapter-video-external" role="status">{video.kind === 'playlist' ? 'This is a full course playlist. Use the separate link below to choose a lecture on YouTube.' : 'Embedded playback is unavailable or unverified for this recording. Use the separate YouTube link below to watch it.'}</p>}
        </div>
        <div className="chapter-video-info">
          <div className="chapter-video-meta"><span className="chapter-video-number">{String(index + 1).padStart(2, '0')}</span><small>{video.channel} · {levelInfo[video.level].label}{video.kind === 'playlist' ? ' · Full series' : video.minutes ? ` · ${video.minutes} min` : ' · Full lecture'}</small></div>
          <h3><button type="button" className="chapter-video-title" aria-controls={playerId} aria-expanded={active} onClick={() => setSelected(key)}>{video.title}</button></h3>
          <p><strong>Watch for:</strong> {item.focus}</p>
          <div className="chapter-video-actions">
            {active ? <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>Close {canPlay ? 'video' : 'details'}</button> : canPlay && <button type="button" className="btn btn-ghost btn-sm" aria-controls={playerId} onClick={() => setSelected(key)}>Play here <span aria-hidden="true">▷</span></button>}
            <a href={video.url} target="_blank" rel="noreferrer">{video.kind === 'playlist' ? 'Open the full series' : 'Open on YouTube'} ↗</a>
            {video.sourceUrl && <a href={video.sourceUrl} target="_blank" rel="noreferrer">Publisher’s course materials ↗</a>}
          </div>
        </div>
      </li>
    })}</ol>
    <p className="chapter-practice"><strong>After watching, make it useful</strong>{guide.practice}</p>
  </section>
  return compact ? <details className="chapter-videos-compact" onToggle={event => { if (!event.currentTarget.open) setSelected(null) }}><summary>Chapter video sequence · {guide.picks.length} videos or series</summary>{content}</details> : content
}

export function ChapterVideos(props: ChapterVideosProps) {
  return <ChapterVideoSequence key={`${props.track}/${props.module}`} {...props} />
}
