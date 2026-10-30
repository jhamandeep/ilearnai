import { useContext, useEffect, useId, useRef, useState } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'

/** Each learning format has its own short visual story, separate from authored explainers. */
export function LearningMotionGlyph({ variant, className = '' }: { variant: string; className?: string }) {
  const motion = useContext(ArtworkMotionContext), id = useId().replace(/:/g, '')
  const root = useRef<HTMLDivElement>(null), [visible, setVisible] = useState(false)
  const name = variant.toLowerCase()
  useEffect(() => {
    if (!root.current) return
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)))
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  let content
  if (['video','videos'].includes(name)) content = <><g className="format-float"><rect x="63" y="38" width="170" height="103" rx="16" /><path d="m132 65 41 25-41 25Z" fill="#fff" stroke="none" /></g><path d="M70 157H233" className="format-track" /><circle cx="82" cy="157" r="7" className="format-scrubber" /></>
  else if (['exercise','practice','tools'].includes(name)) content = <><rect x="48" y="30" width="204" height="125" rx="17" /><g className="format-code"><path d="m112 67-27 23 27 23m76-46 27 23-27 23m-26-56-20 66" /></g><circle cx="237" cy="144" r="20" fill="#bdcffc" /><path d="m228 144 6 6 12-13" stroke="#3048b3" className="format-tick" /></>
  else if (['quiz','flashcards'].includes(name)) content = <><g className="format-cards"><rect x="81" y="29" width="145" height="121" rx="15" transform="rotate(9 150 90)" fill="#a1b8f5" /><rect x="65" y="35" width="145" height="121" rx="15" /><path d="M88 63H180M88 82H159" /><circle cx="136" cy="117" r="20" fill="#e7edff" /><path d="m125 117 8 8 15-18" stroke="#3552c0" className="format-tick" /></g></>
  else if (name === 'resources') content = <><g className="format-float"><path d="M45 58Q45 43 60 43H122L143 61H239Q254 61 254 76V143Q254 157 239 157H60Q45 157 45 142Z" /><path d="M73 94H224M73 116H173" /><circle cx="217" cy="140" r="29" fill="#d9e5ff" /><path d="M203 140H231m-12-12 12 12-12 12" stroke="#354fb9" /></g></>
  else if (name === 'papers') content = <>{[0,1,2].map(i => <g className="format-sheet" key={i} style={{animationDelay:`-${i*.6}s`}} transform={`translate(${i*12} ${-i*9})`}><rect x="77" y="56" width="129" height="109" rx="12" /><path d="M98 81H182M98 100H164M98 119H175M98 138H150" /></g>)}</>
  else if (['ask'].includes(name)) content = <><g className="format-float"><path d="M68 42H223Q238 42 238 57V116Q238 130 223 130H137L106 153V130H68Q53 130 53 116V57Q53 42 68 42Z" />{[105,145,185].map((x,i) => <circle key={x} cx={x} cy="85" r="7" fill="#fff" stroke="none" className="format-think" style={{animationDelay:`${i*.25}s`}} />)}</g></>
  else if (['animation','lab','overview','summary'].includes(name)) content = <><g className="format-orbit"><ellipse cx="150" cy="96" rx="91" ry="43" transform="rotate(-28 150 96)" fill="none" /><ellipse cx="150" cy="96" rx="91" ry="43" transform="rotate(36 150 96)" fill="none" /><circle cx="150" cy="96" r="33" /><circle cx="69" cy="130" r="12" fill="#a5c6ff" /><circle cx="235" cy="122" r="9" fill="#a5c6ff" /></g></>
  else content = <><rect x="78" y="24" width="146" height="144" rx="16" /><g className="format-writing"><path d="M102 56H193M102 79H185M102 102H195M102 125H166" /></g><path d="m190 146 28-43 13 9-28 43-17 9Z" fill="#c4d4ff" stroke="#e8eeff" className="format-pen" /></>
  return <div ref={root} className={`learning-motion-glyph ${className}`} data-format-motion={name} data-motion={motion.playing && visible ? 'on' : 'off'} aria-hidden="true"><svg viewBox="0 0 300 190" focusable="false"><defs><linearGradient id={id} x2=".8" y2="1"><stop stopColor="#a6b9ff" /><stop offset=".35" stopColor="#5d7be7" /><stop offset="1" stopColor="#304ab6" /></linearGradient></defs><g fill={`url(#${id})`} stroke="#d2e0ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{content}</g></svg></div>
}
