import { useContext, useId } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'

/** An AI processor with travelling signals and an orbit of connected inputs. */
export function BrandMark({ className = '' }: { className?: string }) {
  const id = 'brand-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const { playing } = useContext(ArtworkMotionContext)
  return <svg className={`brand-symbol ${className}`} data-motion={playing ? 'on' : 'off'} viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" focusable="false">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#45308c" /><stop offset=".6" stopColor="#7250cd" /><stop offset="1" stopColor="#3979e6" /></linearGradient></defs>
    <rect x="1" y="1" width="62" height="62" rx="19" fill={`url(#${id})`} />
    <circle cx="32" cy="32" r="24" fill="none" stroke="#d7e5ff" strokeOpacity=".22" />
    <path className="brand-circuit" d="M10 23H17L22 28M10 41H17L22 36M54 23H47L42 28M54 41H47L42 36M26 10V20M38 10V20M26 54V44M38 54V44" fill="none" stroke="#c8bdff" strokeWidth="2" strokeLinecap="round" />
    <path className="brand-signal" d="M10 23H17L22 28M10 41H17L22 36M54 23H47L42 28M54 41H47L42 36M26 10V20M38 54V44" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <g fill="#d7e5ff"><circle className="brand-node" cx="10" cy="23" r="2.5" /><circle className="brand-node" cx="54" cy="41" r="2.5" /><circle className="brand-node" cx="10" cy="41" r="2.5" /><circle className="brand-node" cx="54" cy="23" r="2.5" /></g>
    <g className="brand-chip"><rect x="19" y="19" width="26" height="26" rx="7" fill="#f6f2ff" /><path d="m23.5 37 4-10 4 10m-6.5-3h5M36 27h4m-2 0v10m-2 0h4" fill="none" stroke="#56389d" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></g>
    <g className="brand-orbit" fill="#fff"><circle cx="32" cy="8" r="2.7" /><circle cx="32" cy="56" r="2" opacity=".75" /></g>
  </svg>
}

export function BrandLogo() {
  return <><BrandMark /><span className="brand-wordmark">ilearn<span>ai</span></span></>
}
