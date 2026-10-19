import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { ReactNode } from 'react'

export function ProGate({ tier, children }: { tier: 'free' | 'pro'; children: ReactNode }) {
  const { isPro } = useAuth()
  if (tier === 'free' || isPro) return <>{children}</>
  return (
    <div className="gate">
      <h3>This lesson is part of Pro</h3>
      <p>Intro lessons in every module are free. Pro unlocks the full catalogue, all labs, and new modules as they ship.</p>
      <Link to="/pricing" className="btn btn-primary">
        See plans
      </Link>
    </div>
  )
}
