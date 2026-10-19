import { useNavigate } from 'react-router-dom'
import { useAuth, type Plan } from '../lib/auth'

const plans: { id: Plan; name: string; price: string; period: string; note: string }[] = [
  { id: 'monthly', name: 'Monthly', price: '$19', period: '/ month', note: 'Cancel any time.' },
  { id: 'quarterly', name: 'Quarterly', price: '$49', period: '/ 3 months', note: 'Save 14%.' },
  { id: 'annual', name: 'Annual', price: '$149', period: '/ year', note: 'Save 35%.' },
  { id: 'lifetime', name: 'Lifetime', price: '$399', period: 'once', note: 'Limited seats.' },
]

export function Pricing() {
  const { upgrade, session } = useAuth()
  const navigate = useNavigate()
  const choose = (plan: Plan) => {
    // Stand-in for Stripe checkout. Real flow: create checkout session server-side,
    // redirect, and set entitlement from the webhook.
    upgrade(plan)
    navigate('/courses')
  }
  return (
    <>
      <header className="page-head">
        <h1>Pro</h1>
        <p className="lede">Every lesson, every lab, every new module. Prices shown are placeholders; the real site loads them per region.</p>
      </header>
      <div className="grid">
        {plans.map((p) => (
          <div key={p.id} className={`card ${session?.plan === p.id ? 'card-selected' : ''}`}>
            <h3>{p.name}</h3>
            <div className="price">
              {p.price} <span className="meta">{p.period}</span>
            </div>
            <p>{p.note}</p>
            <button className="btn btn-primary" onClick={() => choose(p.id)} disabled={session?.plan === p.id}>
              {session?.plan === p.id ? 'Current plan' : 'Choose'}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
