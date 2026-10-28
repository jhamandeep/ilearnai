import { useState } from 'react'

export function VideoThumbnail({ id, title, kind = 'video', external = false }: { id: string; title: string; kind?: string; external?: boolean }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="video-thumbnail">
      {id && !failed ? <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" width={480} height={270} onError={() => setFailed(true)} /> : <span className="thumbnail-fallback"><span>{kind === 'playlist' ? 'Playlist' : kind === 'channel' ? 'Channel' : 'Video'}</span><strong>{title}</strong></span>}
      <span className="thumbnail-action" aria-hidden="true">{external ? '↗' : '▷'}</span>
    </span>
  )
}
