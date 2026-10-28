/** Original ilearnai mark: an open book, an upward page, and the seed of an idea. */
export function BrandMark({ className = '' }: { className?: string }) {
  return <svg className={`brand-symbol ${className}`} viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="18" fill="#163e38" />
    <path d="M13 24c7-2 13 0 18 5v20c-5-5-11-7-18-6V24Z" fill="#faf6eb" />
    <path d="M35 27c4-7 10-11 16-12v23c-7 1-12 5-16 11V27Z" fill="#bde5cc" />
    <circle cx="21" cy="14" r="4.5" fill="#ff997e" />
  </svg>
}

/** The enclosing home link supplies the accessible name once. */
export function BrandLogo() {
  return <><BrandMark /><span className="brand-wordmark">ilearn<span>ai</span></span></>
}
