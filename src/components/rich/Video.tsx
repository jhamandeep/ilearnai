import { useMemo, useState } from 'react'
import { parseBlock } from './parse'
import { videos } from '../../data/videos'
import { VideoThumbnail } from '../VideoThumbnail'

// :::video
// id: aircAruvnKk          (must be an id listed in src/data/videos.ts)
// start: 90                (optional, seconds)
// why: One sentence on what to watch for.
// :::
export function Video({ src }: { src: string }) {
  const v = useMemo(() => {
    const b = parseBlock(src)
    const kv: Record<string, string> = {}
    for (const l of b.lines) {
      const m = /^(\w+)\s*:\s*(.*)$/.exec(l)
      if (m) kv[m[1]] = m[2]
    }
    const known = videos.find((x) => x.id && x.id === kv.id)
    return { id: kv.id, start: Number(kv.start) || 0, why: kv.why ?? b.title ?? '', title: kv.title ?? known?.title ?? 'Video', channel: kv.channel ?? known?.channel ?? '', minutes: known?.minutes, embeddable: known ? known.embeddable !== false : false, url: known?.url ?? `https://www.youtube.com/watch?v=${kv.id}` }
  }, [src])
  const [play, setPlay] = useState(false)
  if (!v.id) return null
  return (
    <figure className="rich rich-video">
      <figcaption>
        Watch · {v.title}{v.channel ? ` · ${v.channel}` : ''}{v.minutes ? ` · ${v.minutes} min` : ''}
      </figcaption>
      {play && v.embeddable ? (
        <div className="player" style={{ margin: 0, borderRadius: 0, border: 0 }}>
          <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1${v.start ? `&start=${v.start}` : ''}`} title={v.title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      ) : v.embeddable ? (
        <button className="thumb-btn" onClick={() => setPlay(true)} aria-label={`Play ${v.title}`}>
          <VideoThumbnail id={v.id} title={v.title} />
        </button>
      ) : (
        <a className="thumb-btn" href={v.url} target="_blank" rel="noreferrer" aria-label={`Open ${v.title} on YouTube`}>
          <VideoThumbnail id={v.id} title={v.title} external />
        </a>
      )}
      <div className="rich-bar">
        <span className="rich-caption" style={{ marginLeft: 0 }}>{v.why}</span>
        <a className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} href={v.url} target="_blank" rel="noreferrer">Open on YouTube</a>
      </div>
    </figure>
  )
}
