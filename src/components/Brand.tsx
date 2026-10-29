import { useContext, useId } from 'react'
import { ArtworkMotionContext } from '../lib/artworkMotion'

/** An original neural-network mark: connected inputs converge into an AI spark. */
export function BrandMark({ className = '' }: { className?: string }) {
  const id = 'brand-' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const { playing } = useContext(ArtworkMotionContext)
  return <svg className={`brand-symbol ${className}`} data-motion={playing ? 'on' : 'off'} viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" focusable="false">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#45308c" /><stop offset=".6" stopColor="#7250cd" /><stop offset="1" stopColor="#3979e6" /></linearGradient></defs>
    <rect x="1" y="1" width="62" height="62" rx="19" fill={`url(#${id})`} />
    <path className="brand-circuit" d="M15 18 28 28M15 46 28 36M36 28 49 18M36 36 49 46" fill="none" stroke="#c8bdff" strokeWidth="2" strokeLinecap="round" />
    <path className="brand-signal" d="M15 18 28 28M15 46 28 36M36 28 49 18M36 36 49 46" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <g fill="#d7e5ff"><circle className="brand-node" cx="15" cy="18" r="3.5" /><circle className="brand-node" cx="49" cy="18" r="3.5" /><circle className="brand-node" cx="15" cy="46" r="3.5" /><circle className="brand-node" cx="49" cy="46" r="3.5" /></g>
    <path className="brand-spark" d="m32 18 4.5 9.5L46 32l-9.5 4.5L32 46l-4.5-9.5L18 32l9.5-4.5Z" fill="#fff" />
    <circle cx="32" cy="32" r="3" fill="#6d4ac6" />
  </svg>
}

export function BrandLogo() {
  return <><BrandMark /><span className="brand-wordmark">ilearn<span>ai</span></span></>
}
