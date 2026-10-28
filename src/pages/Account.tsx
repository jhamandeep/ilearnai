import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { BrandLogo } from '../components/Brand'

function nextPath(value: string | null) {
  if (!value?.startsWith('/') || value.startsWith('//') || value.includes('\\') || Array.from(value).some(character => character.charCodeAt(0) < 32) || /^\/(login|signup)(?:[/?#]|$)/.test(value)) return '/dashboard'
  return value
}

export function Account({ register = false }: { register?: boolean }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = nextPath(params.get('next'))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (auth.user && !auth.loading) return <Navigate to={next} replace />
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    try { await auth.signIn({ name, email, password }, register); navigate(next, { replace: true }) }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  return <section className="account-page"><div className="account-story"><p className="eyebrow">Your AI learning journey</p><h1>Build skills.<br />Make progress.<br />Create what’s next.</h1><p>One account for your lessons, hands-on labs, quizzes, and learning progress.</p><img className="account-art" src="/images/ai-learning.jpg" alt="Sculptural blue neural connections representing AI learning" width={1200} height={675} /><span className="account-promise">10 learning tracks · 220 lessons · Always free</span></div><div className="account-form-panel"><Link className="brand" to="/" aria-label="ilearnai home"><BrandLogo /></Link><h2>{register ? 'Create your account' : 'Welcome back'}</h2><p>{register ? 'Start learning and save your progress as you go.' : 'Sign in to continue your learning journey.'}</p><form onSubmit={submit}>{register && <label>Your name<input name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required disabled={busy} /></label>}<label>Email address<input type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required disabled={busy} /></label><label>Password<input type="password" name="password" autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={10} maxLength={128} required disabled={busy} /></label>{register && <span className="account-hint">Use at least 10 characters.</span>}{(error || auth.serviceError) && <p className="account-error" role="alert">{error || auth.serviceError}</p>}<button type="submit" className="btn btn-primary" disabled={busy || auth.loading}>{busy ? 'Opening your workspace…' : auth.loading ? 'Checking your session…' : register ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span></button></form><p className="account-switch">{register ? 'Already have an account?' : 'New to ilearnai?'} <Link to={`${register ? '/login' : '/signup'}?next=${encodeURIComponent(next)}`}>{register ? 'Sign in' : 'Create an account'}</Link></p><Link className="account-back" to="/courses">Explore the course catalogue ↗</Link></div></section>
}
