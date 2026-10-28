import { useContext, useEffect, useRef, useState } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'

const artwork = [
  { topic: 'foundations', label: 'From a line of code to a result', color: '#7d9fcf' },
  { topic: 'mathematics', label: 'Follow how an input changes an output', color: '#ba659a' },
  { topic: 'neural-networks', label: 'Examples become learned patterns', color: '#8e79bd' },
  { topic: 'ai-agents', label: 'Connect knowledge, tools, and an app', color: '#d89a68' },
  { topic: 'optimization', label: 'Take smaller steps toward lower loss', color: '#637abd' },
  { topic: 'ai-learning', label: 'Find evidence, then build an answer', color: '#789ccc' },
  { topic: 'ai-systems', label: 'Share requests across reliable services', color: '#6f98ae' },
  { topic: 'inference', label: 'Batch tokens and serve a response', color: '#d89a71' },
  { topic: 'research', label: 'Turn a question into an experiment', color: '#a28aba' },
  { topic: 'robotics', label: 'Sense the world and plan a movement', color: '#7d91b3' },
  { topic: 'complete-ai', label: 'Connect vision, language, and reasoning', color: '#8e9aca' },
]
const backgrounds = ['#edf4ff', '#faf1f6', '#f3efff', '#fff3e9', '#eef1fd', '#f0f5ff', '#edf5f8', '#fff2ec', '#f5f0fa', '#f0f3f9', '#f0f2fc']
function Packet({ path, color, delay = '0s', duration = '6s', radius = 8 }: { path: string; color: string; delay?: string; duration?: string; radius?: number }) {
  return <g><circle r={radius + 6} fill={color} opacity=".16" /><circle r={radius} fill={color} stroke="white" strokeWidth="2" /><animateMotion path={path} dur={duration} begin={`-${delay}`} repeatCount="indefinite" /></g>
}
function CourseMotion({ topic, color }: { topic: string; color: string }) {
  switch (topic) {
    case 'foundations': return <><Packet color={color} path="M180 230H390H493H548V272H640" /><rect x="390" y="212" width="9" height="24" fill="#b6cdf4"><animate attributeName="opacity" values="1;1;0;0;1" dur="2s" repeatCount="indefinite" /></rect></>
    case 'mathematics': return <Packet color={color} path="M190 170Q400 500 620 170" duration="7s" radius={10} />
    case 'neural-networks': return <><Packet color="#b39bd8" path="M220 150L400 250L580 205" duration="4s" /><Packet color="#9382c3" path="M220 350L400 330L580 295" delay="1.6s" duration="4s" />{[170,250,330].map((y,i)=><circle key={y} cx="400" cy={y} r="37" stroke="#b9a4db" strokeWidth="4" fill="none"><animate attributeName="opacity" values=".1;.8;.1" dur="3s" begin={`${i*.6}s`} repeatCount="indefinite" /></circle>)}</>
    case 'ai-agents': return <><Packet color={color} path="M170 255H300V155H382H470V255H546H670" duration="8s" /><Packet color="#a897c9" path="M300 255V355H382H470V255H546" delay="3s" duration="8s" /></>
    case 'optimization': return <><Packet color={color} path="M215 145L273 237L344 230L375 292L420 281L444 306L467 300" duration="8s" radius={9} /><circle cx="467" cy="300" r="16" fill="none" stroke="#8195c7" strokeWidth="2"><animate attributeName="r" values="12;26;12" dur="4s" repeatCount="indefinite" /><animate attributeName="opacity" values=".8;.1;.8" dur="4s" repeatCount="indefinite" /></circle></>
    case 'ai-learning': return <><rect x="303" y="241" width="174" height="40" rx="9" fill="none" stroke={color} strokeWidth="3"><animate attributeName="opacity" values=".15;.9;.15" dur="5s" repeatCount="indefinite" /></rect><Packet color={color} path="M180 238H282L390 261H498L554 238L600 291" duration="6s" /></>
    case 'ai-systems': return <>{['M164 250H388H520V150H640','M164 250H388H640','M164 250H388H520V350H640'].map((path,i)=><Packet key={path} color={color} path={path} delay={`${i*1.5}s`} duration="5s" />)}</>
    case 'inference': return <>{[0,1,2].map(i=><g key={i}><rect x="-7" y="-7" width="14" height="14" rx="4" fill={['#e0a77e','#b99acb','#91a9cf'][i]} stroke="white" strokeWidth="2" /><animateMotion path={`M180 ${221+i*32}H253L330 259H479L555 259L${600+i*15} ${277-i*15}`} dur="5.4s" begin={`${-i*.5}s`} repeatCount="indefinite" /></g>)}</>
    case 'research': return <><Packet color="#7894c3" path="M450 324C487 314 516 282 550 286S609 234 654 243" duration="8s" radius={6} /><line x1="445" y1="195" x2="445" y2="340" stroke="#bba5cf" strokeWidth="2" strokeDasharray="4 7"><animateTransform attributeName="transform" type="translate" values="0 0;210 0;0 0" dur="12s" repeatCount="indefinite" /></line></>
    case 'robotics': return <g><path d="M425 210L562 235" fill="none" stroke="#9cacc5" strokeWidth="27" strokeLinecap="round" /><path d="M425 210L562 235" fill="none" stroke="#e5ebf4" strokeWidth="16" strokeLinecap="round" /><circle cx="562" cy="235" r="13" fill="#607798" /><path d="M562 246V268M562 268L545 281M562 268L579 281" fill="none" stroke="#607798" strokeWidth="8" strokeLinecap="round" /><animateTransform attributeName="transform" type="rotate" values="-12 425 210;17 425 210;17 425 210;-12 425 210" keyTimes="0;.4;.6;1" dur="8s" repeatCount="indefinite" /></g>
    default: return <><Packet color="#8c9dce" path="M225 144L400 250L590 148" duration="6s" /><Packet color="#baa1cd" path="M207 355L400 250L616 349" delay="2s" duration="6s" /><circle cx="400" cy="250" r="76" fill="none" stroke="#9fadd6" strokeWidth="2"><animate attributeName="r" values="70;85;70" dur="6s" repeatCount="indefinite" /><animate attributeName="opacity" values=".7;.15;.7" dur="6s" repeatCount="indefinite" /></circle></>
  }
}

export function CourseArtwork({ seed, topic }: { seed?: number; topic?: string }) {
  const item = artwork.find(item => item.topic === topic) ?? artwork[(((seed ?? 1) - 1) % artwork.length + artwork.length) % artwork.length]
  const motion = useContext(ArtworkMotionContext)
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)
  const playing = seed !== undefined && motion.playing && visible
  useEffect(() => {
    if (!host.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)))
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => { if (playing) scene.current?.unpauseAnimations?.(); else scene.current?.pauseAnimations?.() }, [playing])
  return <div ref={host} className={`course-artwork course-illustration artwork-${item.topic}`} style={{ background: backgrounds[artwork.indexOf(item)] }} data-artwork={item.topic} data-playing={playing} aria-hidden="true">
    <img src={`/images/courses/${item.topic}.svg`} alt="" width={800} height={500} loading="lazy" />
    <svg ref={scene} className="course-live-layer" viewBox="0 0 800 500" focusable="false"><CourseMotion topic={item.topic} color={item.color} /></svg>
    {seed !== undefined && <span className="course-art-caption"><i style={{ background: item.color }} />{item.label}</span>}
  </div>
}
