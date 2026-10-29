import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { NewsTicker } from './NewsTicker'
import { AccountMenu } from './AccountMenu'
import { useAuth } from '../lib/auth'
import { LearningLayout } from './LearningLayout'
import { BrandLogo } from './Brand'
import { ArtworkMotionProvider, ArtworkMotionControl } from './ArtworkMotion'

const groups = [
  { label: 'Learn', links: [{ to: '/for-work', label: 'AI for your work', detail: 'Industry use cases and role-based guidance' }, { to: '/path', label: 'Your learning path', detail: 'Start from zero or find your level' }, { to: '/courses', label: 'All courses', detail: 'Ten tracks, four levels' }, { to: '/roadmaps', label: 'Roadmaps', detail: 'A plan for each track' }] },
  { label: 'Library', links: [{ to: '/papers', label: 'Papers', detail: 'Research with reading notes' }, { to: '/videos', label: 'Videos', detail: 'Free lectures and courses' }, { to: '/glossary', label: 'Glossary', detail: 'Understand the terminology' }, { to: '/resources', label: 'Resources', detail: 'Useful links for every track' }] },
  { label: 'Explore', links: [{ to: '/hub', label: 'AI hub', detail: 'Models, datasets, and notebooks' }, { to: '/knowledge-graph', label: 'Knowledge map', detail: 'See how concepts connect' }, { to: '/hierarchy', label: 'Paper hierarchy', detail: 'Find your reading order' }, { to: '/blog', label: 'Field notes', detail: 'Ideas from research and engineering' }] },
]

export function Layout() {
  const { pathname } = useLocation()
  return <ArtworkMotionProvider>{['/', '/login', '/signup'].includes(pathname) ? <MarketingLayout /> : <LearningLayout />}</ArtworkMotionProvider>
}

function MarketingLayout() {
  const { preview, user } = useAuth()
  const { pathname, hash, key } = useLocation()
  const header = useRef<HTMLElement>(null)
  const menuToggle = useRef<HTMLButtonElement>(null)
  const [menuLocation, setMenuLocation] = useState<string | null>(null)
  const mobileOpen = menuLocation === key
  useEffect(() => {
    header.current?.querySelectorAll('details').forEach((d) => { d.open = false })
    if (hash) {
      // Lazy routes can mount after navigation. Wait for their anchor to exist.
      const scrollToAnchor = () => {
        let anchor = hash.slice(1)
        try { anchor = decodeURIComponent(anchor) } catch { /* keep malformed fragments harmless */ }
        const target = document.getElementById(anchor)
        target?.scrollIntoView({ block: 'start' })
        return !!target
      }
      if (scrollToAnchor()) return
      const observer = new MutationObserver(() => { if (scrollToAnchor()) observer.disconnect() })
      const main = document.getElementById('main-content')
      if (main) observer.observe(main, { childList: true, subtree: true })
      return () => observer.disconnect()
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  useEffect(() => {
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== 'Escape') return
      if (event instanceof PointerEvent && header.current?.contains(event.target as Node)) return
      setMenuLocation(null)
      const mobile = header.current?.classList.contains('mobile-menu-open')
      const open = header.current?.querySelector<HTMLDetailsElement>('details[open]')
      if (event instanceof KeyboardEvent) { if (mobile) menuToggle.current?.focus(); else open?.querySelector('summary')?.focus() }
      header.current?.querySelectorAll('details').forEach((d) => { d.open = false })
    }
    const historyChanged = () => setMenuLocation(null)
    window.addEventListener('popstate', historyChanged)
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => { window.removeEventListener('popstate', historyChanged); document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close) }
  }, [])
  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 1000px)')
    const close = () => setMenuLocation(null)
    breakpoint.addEventListener('change', close)
    return () => breakpoint.removeEventListener('change', close)
  }, [])
  const menu = (group: (typeof groups)[number]) => (
    <details className="nav-group" key={group.label} onToggle={(e) => {
      if (e.currentTarget.open) header.current?.querySelectorAll('details').forEach((d) => { if (d !== e.currentTarget) d.open = false })
    }}>
      <summary className={group.links.some((link) => pathname === link.to || pathname.startsWith(link.to + '/')) ? 'active' : ''}>{group.label}<span aria-hidden="true">⌄</span></summary>
      <div className="nav-menu">
        {group.links.map((link) => <NavLink key={link.to} to={link.to} onClick={() => { header.current?.querySelectorAll('details').forEach((d) => { d.open = false }) }}><strong>{link.label}</strong><span>{link.detail}</span></NavLink>)}
      </div>
    </details>
  )
  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`topbar${mobileOpen ? ' mobile-menu-open' : ''}`} ref={header}>
        <div className="topbar-inner">
        <Link to="/" className="brand" aria-label="ilearnai home"><BrandLogo /></Link>
        <button ref={menuToggle} type="button" className="marketing-menu-toggle" aria-expanded={mobileOpen} aria-controls="marketing-navigation" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuLocation(mobileOpen ? null : key)}>{mobileOpen ? '✕' : '☰'}</button>
        <nav id="marketing-navigation" className="nav" aria-label="Primary" onClickCapture={event => { if ((event.target as Element).closest('a[href]')) setMenuLocation(null) }}>
          {menu(groups[0])}
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/labs">Labs</NavLink>
          {menu(groups[1])}
          {menu(groups[2])}
          <NavLink to="/ask">Ask</NavLink>
        </nav>
        <div className="account">
          <ArtworkMotionControl />
          <AccountMenu />
        </div>
        </div>
      </header>
      <main id="main-content" className="main page-enter" key={pathname} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner"><Link to="/" className="brand" aria-label="ilearnai home"><BrandLogo /></Link><span>Learn the concept. Watch it work. Try it yourself.</span><Link to="/style">Our writing standard ↗</Link></div>
        <p>Free to learn. {preview && !user ? 'Your progress saves in this browser; lab calculations run here too.' : 'Your lesson progress saves to your account; lab calculations run in your browser.'}</p>
      </footer>
      <NewsTicker />
    </div>
  )
}
