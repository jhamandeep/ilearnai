import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const nav = [
  { to: '/courses', label: 'Courses' },
  { to: '/papers', label: 'Papers' },
  { to: '/labs', label: 'Labs' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/pricing', label: 'Pricing' },
]

export function Layout() {
  const { session, isPro, signOut } = useAuth()
  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          fanout<span className="brand-dim">.replica</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="account">
          {session ? (
            <>
              <span className={`pill ${isPro ? 'pill-pro' : ''}`}>{isPro ? 'Pro' : 'Free'}</span>
              <button className="btn btn-ghost" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/signin" className="btn btn-ghost">
              Sign in
            </Link>
          )}
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span>Built as a study replica. Labs run in your browser; nothing is sent anywhere.</span>
      </footer>
    </div>
  )
}
