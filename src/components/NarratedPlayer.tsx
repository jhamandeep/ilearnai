import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { narrationScene, type NarrationRecording } from '../lib/narration'
import './narrated-explainer.css'

const clamp = (value: number, maximum: number) => Math.max(0, Math.min(maximum, value))
const clock = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`
export interface NarratedFrame { time: number; scene: number; reduced: boolean; compact: boolean; poster: boolean }

export function NarratedPlayer({ recording, title, labels, children, canEnlarge = false }: {
  recording: NarrationRecording; title: string; labels?: string[]; canEnlarge?: boolean;
  children: (frame: NarratedFrame) => ReactNode;
}) {
  const id = useId()
  const audio = useRef<HTMLAudioElement>(null)
  const player = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captions, setCaptions] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [enlarged, setEnlarged] = useState(false)
  const [reduced, setReduced] = useState(false)
  const scene = narrationScene(time, recording)
  const cue = recording.cues[scene]
  const ended = time >= recording.duration - .04

  useEffect(() => {
    const media = audio.current
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const motion = () => setReduced(preference.matches)
    motion()
    const visibility = () => { if (document.hidden) media?.pause() }
    const full = () => setFullscreen(document.fullscreenElement === player.current)
    const exclusive = (event: Event) => { if ((event as CustomEvent).detail !== media) media?.pause() }
    // A cached/network failure can arrive before React attaches its media handler.
    // Listen natively as well and inspect errors that already happened on mount.
    const failed = () => { setPlaying(false); setWaiting(false); setError('The recording could not load. Retry audio, or read the transcript below.') }
    media?.addEventListener('error', failed)
    if (media?.error) failed()
    const resize = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width <= 560))
    const visible = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) media?.pause() }, { threshold: 0 })
    if (player.current) { resize.observe(player.current); visible.observe(player.current) }
    preference.addEventListener('change', motion)
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('fullscreenchange', full)
    window.addEventListener('ilearnai:narration-play', exclusive)
    return () => {
      media?.pause(); resize.disconnect(); visible.disconnect()
      preference.removeEventListener('change', motion)
      document.removeEventListener('visibilitychange', visibility)
      document.removeEventListener('fullscreenchange', full)
      window.removeEventListener('ilearnai:narration-play', exclusive)
      media?.removeEventListener('error', failed)
    }
  }, [])
  useEffect(() => {
    if (!playing) return
    let frame = 0
    const tick = () => { if (audio.current) setTime(clamp(audio.current.currentTime, recording.duration)); frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, recording.duration])

  async function toggle() {
    const media = audio.current
    if (!media) return
    if (!media.paused) { media.pause(); return }
    if (ended) seek(0)
    setError('')
    try { await media.play() }
    catch { setWaiting(false); setError('The recording could not play. Retry audio, then press Play again. You can also read the transcript below.') }
  }
  function seek(value: number) {
    const next = clamp(value, recording.duration)
    if (audio.current) audio.current.currentTime = next
    setTime(next)
  }
  function mute() { if (audio.current) { audio.current.muted = !audio.current.muted; setMuted(audio.current.muted) } }
  async function full() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.current?.requestFullscreen() }
    catch { setNotice('Full screen is unavailable here. You can keep using the player in this page.') }
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key === ' ' || event.key.toLowerCase() === 'k') { event.preventDefault(); void toggle() }
    if (event.key === 'ArrowRight') { event.preventDefault(); seek(time + 5) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); seek(time - 5) }
    if (event.key.toLowerCase() === 'm') mute()
    if (event.key.toLowerCase() === 'f') void full()
  }
  return <div className="narrated-explainer">
    <div className={`explainer-player course-explainer${enlarged ? ' is-enlarged' : ''}`} ref={player} tabIndex={0} onKeyDown={keyboard} aria-label={`${title}. Space plays or pauses. Left and right arrows seek five seconds.`} data-playing={playing} data-scene={scene} data-narrated="true">
      <audio ref={audio} src={recording.audio} preload="metadata" onPlay={() => { window.dispatchEvent(new CustomEvent('ilearnai:narration-play', { detail: audio.current })); setPlaying(true) }} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(clamp(event.currentTarget.currentTime, recording.duration))} onEnded={() => { setPlaying(false); setTime(recording.duration) }} onWaiting={() => setWaiting(true)} onPlaying={() => setWaiting(false)} onCanPlay={() => setWaiting(false)} onError={() => { setPlaying(false); setWaiting(false); setError('The recording could not load. Retry audio, or read the transcript below.') }} />
      <div className="explainer-stage" tabIndex={canEnlarge ? 0 : undefined} role={canEnlarge ? "region" : undefined} aria-label={canEnlarge ? "Diagram. Scroll horizontally for wide scenes." : undefined}>
        {children({ time, scene, reduced, compact, poster: time === 0 && !playing })}

        {waiting && <span className="explainer-buffer" role="status">Loading audio…</span>}
      </div>
      <div className="explainer-start-row"><span>Scene {scene + 1} of {recording.cues.length}{cue.speaker && <small className="explainer-speaker">{cue.speaker === 'female' ? 'Ava' : 'Andrew'} · teaching voice</small>}</span>{!playing && <button className={`explainer-overlay-play${time > 0 && !ended ? ' is-paused' : ''}`} type="button" onClick={() => void toggle()} aria-label={ended ? 'Replay explainer' : time > 0 ? 'Resume explainer' : 'Play narrated explainer'}><span aria-hidden="true">{ended ? '↻' : '▶'}</span><strong>{ended ? 'Watch again' : time > 0 ? 'Resume' : 'Play with narration'}</strong></button>}{playing && <span className="explainer-playing-label">Playing narration</span>}</div>
      <div className={`explainer-captions${captions ? '' : ' captions-off'}`} aria-hidden={!captions}><span>{captions ? cue.text : 'Captions off'}</span></div>
      <div className="explainer-controls">
        <div className="explainer-timeline"><label className="sr-only" htmlFor={`${id}-seek`}>Explainer timeline</label><input id={`${id}-seek`} aria-label="Explainer timeline" type="range" min={0} max={recording.duration} step={.01} value={time} onChange={event => seek(Number(event.target.value))} style={{ background: `linear-gradient(to right, var(--player-accent, #a9b8f5) ${100 * time / recording.duration}%, var(--player-line, #ffffff23) ${100 * time / recording.duration}%)` }} /><div className="explainer-cue-ticks" aria-hidden="true">{recording.cues.slice(1).map(cue => <i key={cue.start} style={{ left: `${100 * cue.start / recording.duration}%` }} />)}</div></div>
        <div className="explainer-control-row">
          <div className="explainer-transport">
            <button type="button" onClick={() => seek(recording.cues[Math.max(0, scene - 1)].start)} aria-label="Previous scene" disabled={scene === 0}>‹</button>
            <button type="button" onClick={() => void toggle()} aria-label={playing ? 'Pause explainer' : 'Play explainer'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button>
            <button type="button" onClick={() => seek(recording.cues[Math.min(recording.cues.length - 1, scene + 1)].start)} aria-label="Next scene" disabled={scene === recording.cues.length - 1}>›</button>
            <button type="button" onClick={() => seek(time - 5)} aria-label="Back five seconds"><span aria-hidden="true">↶</span><small>5</small></button>
            <button type="button" onClick={() => { seek(0); audio.current?.pause() }} aria-label="Restart explainer">↺</button>
            <span className="explainer-clock">{clock(time)} <i>/</i> {clock(recording.duration)}</span>
          </div>
          <div className="explainer-settings">
            <button type="button" onClick={mute} aria-label={muted ? 'Unmute narration' : 'Mute narration'} aria-pressed={muted}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={muted ? 'M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6' : 'M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14'} /></svg></button>
            <button type="button" className="explainer-cc" onClick={() => setCaptions(value => !value)} aria-label={captions ? 'Hide captions' : 'Show captions'} aria-pressed={captions}>CC</button>
            <select value={speed} aria-label="Explainer playback speed" onChange={event => { const rate = Number(event.target.value); if (audio.current) audio.current.playbackRate = rate; setSpeed(rate) }}>{[.75, 1, 1.25, 1.5].map(rate => <option key={rate} value={rate}>{rate}×</option>)}</select>
            {canEnlarge && <button type="button" className="explainer-enlarge" onClick={() => setEnlarged(value => !value)} aria-pressed={enlarged} aria-label={enlarged ? 'Fit scene' : 'Enlarge diagram'}>{enlarged ? 'Fit' : '+'}</button>}
            <button type="button" onClick={() => void full()} aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'}>⛶</button>
          </div>
        </div>
      </div>
      {error && <div className="explainer-error" role="alert"><span>{error}</span><button type="button" onClick={() => { audio.current?.load(); setTime(0); setError('') }}>Retry audio</button></div>}
      {notice && <div className="explainer-error" role="status">{notice}</div>}
    </div>
    {canEnlarge && <p className="explainer-fit-hint">Labels stay readable. Swipe or scroll wide diagrams, use + for the full view, or jump to a scene in the transcript.</p>}
    <details className="explainer-transcript"><summary>Read the full transcript <span>{recording.cues.length} scenes · {recording.voice ? 'Two synthetic teaching voices' : 'Voice and captions'}</span></summary><ol>{recording.cues.map((cue, index) => <li key={cue.start}><button type="button" onClick={() => seek(cue.start)} aria-label={`Jump to scene ${index + 1}`} aria-current={scene === index ? 'step' : undefined}>{clock(cue.start)}</button><div>{labels && <strong>{labels[index]}</strong>}<p>{cue.text}</p></div></li>)}</ol></details>
  </div>
}
