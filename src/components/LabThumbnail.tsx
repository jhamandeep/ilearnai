import { useContext, useEffect, useId, useRef, useState } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'

/** Small visual invitations to the real labs, never presented as computed results. */
export function LabThumbnail({ slug }: { slug: string }) {
  const motion = useContext(ArtworkMotionContext)
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    if (!host.current) return
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)))
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  let shape
  switch (slug) {
    case 'kv-cache': shape = <>{[0,1,2,3].map(i => <g key={i} transform={`translate(${70+i*45} ${65+i*13})`}><rect width="110" height="62" rx="10" /><path d="M16 18H88M16 30H64M16 42H75" /></g>)}</>; break
    case 'attention': shape = <>{Array.from({length:36},(_,i)=><rect key={i} x={103+i%6*25} y={40+Math.floor(i/6)*25} width="20" height="20" rx="4" style={{opacity:.2+(i*7%11)/14}} />)}</>; break
    case 'gradient-descent': shape = <>{[1,2,3,4].map(i=><ellipse key={i} cx="180" cy="115" rx={i*32} ry={i*18} transform="rotate(-25 180 115)" fill="none" />)}<path d="M80 63L130 78L120 110L165 103L160 120L180 115" className="lab-preview-trace" /></>; break
    case 'sampling': shape = <>{[28,62,105,130,75,42,20].map((h,i)=><rect key={i} x={70+i*33} y={180-h} width="23" height={h} rx="7" className="lab-preview-bar" style={{animationDelay:`-${i*.4}s`}} />)}</>; break
    case 'tokenizer': shape = <>{['AI','makes','ideas','use','ful'].map((s,i)=><g key={s} transform={`translate(${i<3?45+i*95:90+(i-3)*95} ${i<3?70:135})`}><rect width="80" height="42" rx="10" /><text x="40" y="27" textAnchor="middle">{s}</text></g>)}</>; break
    case 'pareto-router': shape = <><path d="M65 40V185H300M80 170Q130 70 285 55" fill="none" />{[0,1,2,3,4,5,6,7].map(i=><circle key={i} cx={85+i*27} cy={65+((i*43)%90)} r="7" />)}</>; break
    case 'ste-checker': shape = <><rect x="100" y="30" width="155" height="170" rx="16" /><path d="M125 65H225M125 90H200M125 115H215M125 140H175" /><path d="m180 166 15 14 35-40" className="lab-preview-trace" /></>; break
    case 'capacity': shape = <>{[0,1,2].map(i=><g key={i} transform={`translate(${64+i*85} ${50+(i%2)*24})`}><rect width="68" height="120" rx="10" />{[0,1,2,3].map(j=><path key={j} d={`M14 ${22+j*24}H52`} />)}</g>)}</>; break
    case 'agent-control-room': shape = <>{[[80,65],[280,65],[80,170],[280,170]].map(([x,y])=><g key={`${x}-${y}`}><path d={`M180 115L${x} ${y}`} /><circle cx={x} cy={y} r="23" /></g>)}<rect x="145" y="80" width="70" height="70" rx="20" /><path d="M165 115H195M180 100V130" /></>; break
    case 'timeout-architect': shape = <>{[0,1,2].map(i=><g key={i}><circle cx={85+i*95} cy="110" r="32" /><path d={`M${85+i*95} 90V110L${100+i*95} 120`} /></g>)}<path d="M118 110H147M213 110H242" /></>; break
    default: shape = <>{[0,1,2,3].map(i=><g key={i} transform={`translate(${48+i*75} ${i%2?105:65})`}><rect width="48" height="65" rx="12" /><path d="M14 22H34M14 33H34M14 44H26" /></g>)}<path d="M72 155H145V80H220V155H298" fill="none" className="lab-preview-trace" /></>
  }
  return <div ref={host} className={`lab-thumbnail lab-thumbnail-${slug}`} data-motion={motion.playing && visible ? 'on' : 'off'} aria-hidden="true"><svg viewBox="0 0 360 230" focusable="false"><defs><linearGradient id={id} x2="1" y2="1"><stop stopColor="#8197ff" /><stop offset="1" stopColor="#2947dc" /></linearGradient></defs><g fill={`url(#${id})`} stroke="#a9baff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{shape}</g></svg></div>
}
