import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'

const nav = [
  { to: '/path', label: 'Start here' },
  { to: '/courses', label: 'Courses' },
  { to: '/practice', label: 'Practice' },
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/videos', label: 'Videos' },
  { to: '/papers', label: 'Papers' },
  { to: '/hub', label: 'Hub' },
  { to: '/labs', label: 'Labs' },
  { to: '/knowledge-graph', label: 'Topography' },
  { to: '/blog', label: 'Notes' },
  { to: '/resources', label: 'Resources' },
  { to: '/glossary', label: 'Glossary' },
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
        <span>Free for everyone. Labs, quizzes and progress run in your browser; nothing is sent anywhere. Text follows <Link to="/style">ASD-STE100 Simplified Technical English</Link>.</span>
      </footer>
    </div>
  )
}
