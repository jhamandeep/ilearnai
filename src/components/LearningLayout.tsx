import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AccountMenu } from './AccountMenu'
import { NewsTicker } from './NewsTicker'
import { BrandLogo } from './Brand'
import { ArtworkMotionControl } from './ArtworkMotion'

const navigation = [
  ['Your learning', [['/dashboard', 'My learning', '◫'], ['/for-work', 'AI for your work', '✧'], ['/courses', 'Learning spaces', '▤'], ['/path', 'Learning paths', '⌁'], ['/labs', 'Hands-on labs', '◇'], ['/code', 'Python workspace', '</>'], ['/practice', 'Practice', '✓']]],
  ['Explore', [['/videos', 'Videos', '▷'], ['/resources', 'Tools & resources', '↗'], ['/papers', 'Research papers', '▧'], ['/glossary', 'Glossary', 'Aa'], ['/hub', 'AI hub', '⌘'], ['/knowledge-graph', 'Knowledge map', '◉'], ['/roadmaps', 'Roadmaps', '↝'], ['/blog', 'Field notes', '☰']]],
] as const

export function LearningLayout() {
  const { pathname, hash, key } = useLocation()
  const navigate = useNavigate()
  const course = /^\/courses\/[^/]+/.test(pathname)
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1100)
  const [browseOpen, setBrowseOpen] = useState(true)
  const [openedLocation, setOpenedLocation] = useState<string | null>(null)
  const overlay = course || !desktop
  // A course opens with its own navigation. The main menu is a temporary
  // drawer tied to this history entry, so a lesson change closes it immediately.
  const open = overlay ? openedLocation === key : browseOpen
  const setOpen = useCallback((value: boolean) => {
    if (overlay) setOpenedLocation(value ? key : null)
    else setBrowseOpen(value)
  }, [overlay, key])
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => { setOpenedLocation(null) }, [key])
  useEffect(() => {
    const query = matchMedia('(min-width:1100px)')
    const resize = () => { setDesktop(query.matches); setOpenedLocation(null) }
    query.addEventListener('change', resize)
    return () => query.removeEventListener('change', resize)
  }, [])
  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>('.learning-toolbar .user-menu').forEach(item => { item.open = false })
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    const scroll = () => { let id = hash.slice(1); try { id = decodeURIComponent(id) } catch { /* Safe fallback for malformed links. */ } const target = document.getElementById(id); target?.scrollIntoView(); return !!target }
    if (scroll()) return
    const observer = new MutationObserver(() => { if (scroll()) observer.disconnect() })
    const main = document.getElementById('main-content')
    if (main) observer.observe(main, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname, hash])
  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open, setOpen])
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = String(new FormData(event.currentTarget).get('q') ?? '').trim()
    navigate(`/courses${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }
  return <div className={`learning-shell ${course ? 'course-focus' : ''} ${overlay ? 'navigation-overlay' : ''} ${open ? 'navigation-open' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="learning-toolbar">
      <button ref={toggle} className="navigation-toggle" type="button" aria-expanded={open} aria-controls={open ? 'learning-navigation' : undefined} aria-label={open ? 'Close navigation' : 'Open navigation'} title={course ? 'Open the main menu; course contents stay in the workspace' : undefined} onClick={() => setOpen(!open)}><span aria-hidden="true">☰</span></button>
      <Link className="brand" to="/" aria-label="ilearnai home"><BrandLogo /></Link>
      <form className="toolbar-search" role="search" onSubmit={search}><label className="sr-only" htmlFor="course-search-global">Search courses and lessons</label><span aria-hidden="true">⌕</span><input id="course-search-global" type="search" name="q" placeholder="What do you want to learn?" /><button type="submit" aria-label="Search courses">→</button></form>
      <ArtworkMotionControl /><Link className="toolbar-ask" to="/ask" aria-label="Ask ilearnai"><span className="toolbar-ask-label">Ask ilearnai</span><span aria-hidden="true">?</span></Link><AccountMenu />
    </header>
    {open && <><button className="navigation-scrim" type="button" tabIndex={-1} aria-label="Close navigation" onClick={() => setOpen(false)} /><aside id="learning-navigation" className="learning-navigation" aria-label="Learning navigation" onClickCapture={event => { if ((event.target as Element).closest('a[href]')) setOpenedLocation(null) }}><Link className="navigation-home" to="/">⌂ <span>Home</span></Link>{navigation.map(([group, links]) => <div className="navigation-group" key={group}><p>{group}</p>{links.map(([to, label, symbol]) => <NavLink key={to} to={to} end={to === '/courses'}><span aria-hidden="true">{symbol}</span>{label}</NavLink>)}</div>)}<Link className="navigation-help" to="/ask"><strong>Need a hand?</strong><span>Find answers and your next step ↗</span></Link></aside></>}
    <div className="learning-body"><main className="learning-main" id="main-content" tabIndex={-1}><Outlet /></main><footer className="learning-footer"><Link className="brand" to="/" aria-label="ilearnai home"><BrandLogo /></Link><span>Learn it. Try it. Make it useful.</span><Link to="/ask">Help and navigation</Link><Link to="/style">Writing standard</Link></footer></div>
    <NewsTicker />
  </div>
}
