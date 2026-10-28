import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import sample from '../data/explainers/rag-sample.json'
import './narrated-explainer.css'

const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value))
const clock = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`
const sceneAt = (time: number) => Math.max(0, sample.cues.findLastIndex(cue => time >= cue.start))
const ramp = (time: number, start: number, duration = .7) => clamp((time - start) / duration)

export function NarratedExplainer() {
  const audio = useRef<HTMLAudioElement>(null)
  const player = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(sample.duration)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captions, setCaptions] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [reduced, setReduced] = useState(() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  const scene = sceneAt(time)
  const cue = sample.cues[scene]
  const ended = time >= duration - .05

  useEffect(() => {
    const media = audio.current
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const motion = () => setReduced(preference.matches)
    const visibility = () => { if (document.hidden) media?.pause() }
    const full = () => setFullscreen(document.fullscreenElement === player.current)
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width <= 560))
    if (player.current) observer.observe(player.current)
    preference.addEventListener('change', motion)
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('fullscreenchange', full)
    return () => { media?.pause(); observer.disconnect(); preference.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); document.removeEventListener('fullscreenchange', full) }
  }, [])
  useEffect(() => {
    if (!playing) return
    let frame = 0
    const tick = () => { if (audio.current) setTime(audio.current.currentTime); frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  async function toggle() {
    const media = audio.current
    if (!media) return
    if (!media.paused) { media.pause(); return }
    if (ended) { media.currentTime = 0; setTime(0) }
    setError('')
    try { await media.play() } catch { setError('The recording could not play. Select Retry audio, then press Play again.') }
  }
  function seek(value: number) {
    const next = clamp(value, 0, duration)
    if (audio.current) audio.current.currentTime = next
    setTime(next)
  }
  function rate(value: number) { if (audio.current) audio.current.playbackRate = value; setSpeed(value) }
  function mute() { if (audio.current) { audio.current.muted = !audio.current.muted; setMuted(audio.current.muted) } }
  async function full() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.current?.requestFullscreen() }
    catch { setError('Full screen is unavailable here. The player still works in this page.') }
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key === ' ' || event.key.toLowerCase() === 'k') { event.preventDefault(); void toggle() }
    if (event.key === 'ArrowRight') { event.preventDefault(); seek(time + 5) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); seek(time - 5) }
    if (event.key.toLowerCase() === 'm') mute()
    if (event.key.toLowerCase() === 'f') void full()
  }
  const accessibleTitle = `${sample.title}. ${cue.title}`
  return <section className="explainer-sample" aria-label="Narrated diagram sample">
    <div className="explainer-player" ref={player} tabIndex={0} onKeyDown={keyboard} aria-label="Explainer video player. Space plays or pauses. Left and right arrows seek five seconds." data-playing={playing} data-scene={cue.id}>
      <audio ref={audio} src={sample.audio} preload="metadata" onLoadedMetadata={event => { if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration) }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onEnded={() => { setPlaying(false); setTime(duration) }} onWaiting={() => setWaiting(true)} onPlaying={() => setWaiting(false)} onCanPlay={() => setWaiting(false)} onError={() => { setPlaying(false); setWaiting(false); setError('The recording could not load. Retry audio to load it again; the transcript is available below.') }} />
      <div className="explainer-stage" aria-label={accessibleTitle}>
        <h2 className="explainer-mobile-title">{cue.title}</h2>
        <RagScene time={time} reduced={reduced} compact={compact} />
        {!playing && <button className={`explainer-overlay-play${time > 0 && !ended ? ' is-paused' : ''}`} type="button" onClick={() => void toggle()} aria-label={ended ? 'Replay explainer' : time > 0 ? 'Resume explainer' : 'Play narrated explainer'}><span aria-hidden="true">{ended ? '↻' : '▶'}</span><strong>{ended ? 'Watch again' : time > 0 ? 'Resume' : 'Play with narration'}</strong></button>}
        {waiting && playing && <span className="explainer-buffer" role="status">Loading audio…</span>}
      </div>
      <div className={`explainer-captions${captions ? '' : ' captions-off'}`} aria-hidden={!captions}><span>{captions ? cue.text : 'Captions off'}</span></div>
      <div className="explainer-controls">
        <div className="explainer-timeline"><label className="sr-only" htmlFor="explainer-seek">Explainer timeline</label><input id="explainer-seek" aria-label="Explainer timeline" type="range" min={0} max={duration} step={.05} value={time} onChange={event => seek(Number(event.target.value))} style={{ background: `linear-gradient(to right, #a9b8f5 ${100*time/duration}%, #ffffff23 ${100*time/duration}%)` }} /><div className="explainer-cue-ticks" aria-hidden="true">{sample.cues.slice(1).map(cue => <i key={cue.id} style={{ left:`${100*cue.start/duration}%` }} />)}</div></div>
        <div className="explainer-control-row"><div className="explainer-transport"><button type="button" onClick={() => void toggle()} aria-label={playing ? 'Pause explainer' : 'Play explainer'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button><button type="button" onClick={() => seek(time-5)} aria-label="Back five seconds"><span aria-hidden="true">↶</span><small>5</small></button><button type="button" onClick={() => { seek(0); audio.current?.pause() }} aria-label="Restart explainer"><span aria-hidden="true">↺</span></button><span className="explainer-clock">{clock(time)} <i>/</i> {clock(duration)}</span></div><div className="explainer-settings"><button type="button" onClick={mute} aria-label={muted ? 'Unmute narration' : 'Mute narration'} aria-pressed={muted}>{muted ? <MutedIcon /> : <VolumeIcon />}</button><button type="button" className="explainer-cc" onClick={() => setCaptions(value => !value)} aria-label={captions ? 'Hide captions' : 'Show captions'} aria-pressed={captions}>CC</button><label className="sr-only" htmlFor="explainer-speed">Playback speed</label><select id="explainer-speed" value={speed} aria-label="Explainer playback speed" onChange={event => rate(Number(event.target.value))}>{[.75,1,1.25,1.5].map(rate => <option key={rate} value={rate}>{rate}×</option>)}</select><button type="button" onClick={() => void full()} aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'}>⛶</button></div></div>
      </div>
      {error && <div className="explainer-error" role="alert"><span>{error}</span><button type="button" onClick={() => { audio.current?.load(); setTime(0); setError('') }}>Retry audio</button></div>}
    </div>
    <nav className="explainer-scenes" aria-label="Jump to an explainer scene">{sample.cues.filter(cue=>!['intro','connect'].includes(cue.id)).map(cue => <button type="button" key={cue.id} aria-current={sample.cues[scene].id===cue.id ? 'step' : undefined} onClick={() => seek(cue.start)}><small>{clock(cue.start)}</small><span>{cue.title}</span></button>)}</nav>
    <details className="explainer-transcript"><summary>Read the full transcript <span>{sample.cues.length} scenes</span></summary><ol>{sample.cues.map(cue => <li key={cue.id}><button type="button" onClick={() => seek(cue.start)} aria-label={`Jump to ${cue.title}`}>{clock(cue.start)}</button><p>{cue.text}</p></li>)}</ol></details>
  </section>
}

function VolumeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14" /></svg> }
function MutedIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6" /></svg> }

function RagScene({ time, reduced, compact }: { time: number; reduced: boolean; compact: boolean }) {
  const id = useId().replace(/:/g,'')
  const scene = sceneAt(time)
  const cue = sample.cues[scene]
  const start = (index: number) => sample.cues[index].start
  const show = (index: number, delay = 0) => reduced ? Number(time >= start(index)+delay) : ramp(time,start(index)+delay)
  const reveal = (index: number, delay = 0) => ({ opacity: show(index,delay), transform:`translateY(${reduced ? 0 : 12*(1-show(index,delay))}px)` })
  const intro = 1-show(1)
  const cameras = [[120,165,740,555],[-20,140,480,360],[250,110,480,360],[530,125,440,330],[540,250,440,330],[0,255,440,330],[530,155,440,330],[0,255,440,330]]
  const pan = reduced ? 1 : ramp(time, cue.start, .7)
  const camera = cameras[scene].map((value, i) => (cameras[Math.max(0,scene-1)][i] * (1-pan) + value * pan).toFixed(2)).join(' ')
  function route(path: string, index: number, delay=0) {
    const progress = show(index,delay)
    return <path d={path} fill="none" stroke="#92a6d4" strokeWidth="2.5" strokeDasharray="1" strokeDashoffset={1-progress} pathLength={1} opacity={progress} markerEnd={progress===1?`url(#${id}-arrow)`:undefined} />
  }
  return <svg className="explainer-canvas" viewBox={compact ? camera : '0 0 960 550'} role="img" aria-label={`${cue.title} A diagram connects a question, documents, a language model, a cited answer, and human review.`}>
    <defs><linearGradient id={`${id}-wash`} x2="1" y2="1"><stop stopColor="#f7f8ff" /><stop offset="1" stopColor="#eaf0ff" /></linearGradient><radialGradient id={`${id}-halo`}><stop stopColor="#b8b0ec" stopOpacity=".3" /><stop offset="1" stopColor="#dfe5ff" stopOpacity="0" /></radialGradient><pattern id={`${id}-dots`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#aebbd3" opacity=".35" /></pattern><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1l7 4-7 4" fill="none" stroke="#92a6d4" strokeWidth="1.5" /></marker></defs>
    <rect width="960" height="550" fill={`url(#${id}-wash)`} /><rect width="960" height="550" fill={`url(#${id}-dots)`} /><ellipse cx="700" cy="190" rx="350" ry="270" fill={`url(#${id}-halo)`} />
    <text x="48" y="42" className="explainer-kicker">ILEARNAI / IDEAS IN MOTION</text><text x="912" y="42" textAnchor="end" className="explainer-scene-no">{String(scene+1).padStart(2,'0')} / 08</text>
    <text x="48" y="92" className="explainer-scene-title">{cue.title}</text>
    <g opacity={intro}>
      <rect x="155" y="202" width="170" height="164" rx="22" fill="white" stroke="#d1dbee" />
      <path d="M190 238h80M190 260h100M190 282h90M190 304h65" stroke="#bcc9e0" strokeWidth="8" strokeLinecap="round" />
      <path d="M350 280H565" stroke="#9eaed0" strokeWidth="3" strokeDasharray="8 8" markerEnd={`url(#${id}-arrow)`} />
      <rect x="595" y="210" width="210" height="145" rx="24" fill="#5b619c" /><text x="700" y="267" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="600">A useful answer</text><text x="700" y="302" textAnchor="middle" fill="#d8dff6" fontSize="16">with a source you can check</text>
      <text x="480" y="414" textAnchor="middle" fill="#7b89a6" fontSize="18">Watch the question become an answer, one connection at a time.</text>
    </g>
    <g style={reveal(1)}><Card x={48} y={183} w={220} h={126} label="01  /  QUESTION" accent="#647fbd" /><text x="68" y="248" className="explainer-card-copy">What is our</text><text x="68" y="276" className="explainer-card-copy">refund policy?</text><circle cx="239" cy="210" r="5" fill="#9eb1d9" /></g>
    {route('M270 246C313 246 310 214 350 214',2,.05)}
    <g style={reveal(2,.2)}><Card x={350} y={145} w={222} h={150} label="02  /  RETRIEVE" accent="#8d77b4" /><text x="371" y="210" className="explainer-card-copy" style={{fontSize:18}}>Search the documents</text>{[0,1,2].map(i=><g key={i} opacity={show(2,.6+i*.3)}><rect x={371+i*59} y={232} width={47} height={40} rx="7" fill={i===0?'#e5ddf6':'#f2eff8'} stroke="#dcd3ea" /><path d={`M${382+i*59} 243h25M${382+i*59} 252h19M${382+i*59} 261h22`} stroke="#b2a1cb" strokeWidth="2" /></g>)}</g>
    {route('M461 296V331',2,1.2)}
    <g style={reveal(2,1.6)}><rect x="350" y="333" width="222" height="80" rx="15" fill="#f3eefb" stroke="#d2c5e7" /><text x="370" y="360" fontSize="11" fill="#907aa9" letterSpacing="1">RELEVANT PASSAGE</text><text x="370" y="388" fontSize="17" fill="#68527e">“Returns: 30 days…”</text></g>
    {route('M572 373C618 373 610 246 652 246',3,.2)}
    <g style={reveal(3,.55)}><Card x={652} y={183} w={260} h={126} label="03  /  GENERATE" accent="#6377aa" /><text x="672" y="248" className="explainer-card-copy">Language model</text><text x="672" y="278" fontSize="15" fill="#8290ac">Question + relevant passages</text></g>
    {route('M782 310V353',4,.15)}
    <g style={reveal(4,.5)}><Card x={652} y={355} w={260} h={126} label="04  /  ANSWER" accent="#7286ba" /><text x="672" y="415" fontSize="18" fill="#455879">Returns are accepted</text><text x="672" y="441" fontSize="18" fill="#455879">within 30 days.</text><rect x="838" y="440" width="51" height="24" rx="6" fill="#e9edf9" /><text x="863" y="456" textAnchor="middle" fontSize="12" fill="#6379ae">[1]</text></g>
    {route('M651 442H275',5,.1)}
    <g style={reveal(5,.5)}><Card x={48} y={355} w={226} h={126} label="05  /  REVIEW" accent="#b48d70" /><text x="68" y="415" className="explainer-card-copy">Check the source.</text><text x="68" y="443" fontSize="15" fill="#8a7a71">Then decide what to do.</text><path d="M238 384l7 7 14-17" stroke="#b5987a" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
    <g style={reveal(6)}><text x="480" y="527" textAnchor="middle" fontSize="15" fill="#667aa4">{scene===7?'Relevant context helps. It does not guarantee a correct answer.':'Retrieve evidence → generate an answer → verify the source'}</text></g>
    {scene>=1&&scene<6&&<text x="48" y="527" fontSize="12" fill="#8d99b0">Illustrative policy and workflow · No live customer data</text>}
  </svg>
}
function Card({ x,y,w,h,label,accent }: { x:number;y:number;w:number;h:number;label:string;accent:string }) { return <g><rect x={x} y={y+5} width={w} height={h} rx="18" fill="#30487508" /><rect x={x} y={y} width={w} height={h} rx="18" fill="#fff" stroke="#d6dfef" /><rect x={x+20} y={y+22} width="4" height="13" rx="2" fill={accent} /><text x={x+32} y={y+33} fontSize="11" letterSpacing="1" fill={accent}>{label}</text></g> }
