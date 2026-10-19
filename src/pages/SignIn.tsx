import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function SignIn() {
  const [email, setEmail] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    // Stand-in for a magic-link email. The real site emails a link and exchanges
    // it for a bearer token.
    signIn(email)
    navigate('/courses')
  }
  return (
    <div className="narrow">
      <header className="page-head">
        <h1>Sign in</h1>
        <p className="lede">Enter your email and we will send a magic link. In this replica the link is skipped and you are signed in immediately.</p>
      </header>
      <form onSubmit={submit} className="form">
        <label className="field">
          <span className="field-label">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <button className="btn btn-primary" type="submit">
          Send magic link
        </button>
      </form>
    </div>
  )
}
