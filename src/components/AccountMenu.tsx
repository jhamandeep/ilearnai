import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function AccountMenu() {
  const { preview, user, loading, signOut } = useAuth()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (loading) return <span className="account-session-loading">Checking session…</span>
  if (preview && !user) return <Link className="account-signin" to="/dashboard">My learning</Link>
  if (!user) return <div className="account-actions"><Link to="/login" className="account-signin">Sign in</Link><Link to="/signup" className="btn btn-primary topbar-cta">Join for free ↗</Link></div>
  return <details className="user-menu"><summary><span className="user-avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span><span>{user.name.split(' ')[0]}</span><span aria-hidden="true">⌄</span></summary><div className="user-menu-panel"><strong>{user.name}</strong><span>{user.email}</span><Link to="/dashboard">My learning dashboard</Link><Link to="/courses">Course catalogue</Link><button type="button" disabled={busy} onClick={async () => { setBusy(true); setError(''); try { await signOut() } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not sign out.') } finally { setBusy(false) } }}>{busy ? 'Signing out…' : 'Sign out'}</button>{error && <p role="alert">{error}</p>}</div></details>
}
