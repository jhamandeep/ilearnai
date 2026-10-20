import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'

const nav = [
  { to: '/courses', label: 'Courses' },
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/videos', label: 'Videos' },
  { to: '/papers', label: 'Papers' },
  { to: '/labs', label: 'Labs' },
  { to: '/knowledge-graph', label: 'Topography' },
  { to: '/blog', label: 'Notes' },
  { to: '/resources', label: 'Resources' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/style', label: 'STE guide' },
]

export function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          ilearn<span className="brand-dim">ai</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="account">
          <span className="pill">All free</span>
        </div>
      </header>
      <main className="main page-enter" key={pathname}>
        <Outlet />
      </main>
      <footer className="footer">
        <span>Free for everyone. Labs run in your browser; nothing is sent anywhere. Text follows ASD-STE100 Simplified Technical English.</span>
      </footer>
    </div>
  )
}
