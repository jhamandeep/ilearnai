import { Link, useParams } from 'react-router-dom'
import { labs } from '../data/labs'
import { KvCacheLab } from '../labs/KvCacheLab'
import { AgentControlRoom } from '../labs/AgentControlRoom'
import { CapacityLab } from '../labs/CapacityLab'
import { SamplingLab } from '../labs/SamplingLab'
import { NotFound } from './NotFound'
import type { ComponentType } from 'react'

const registry: Record<string, ComponentType> = {
  'kv-cache': KvCacheLab,
  'agent-control-room': AgentControlRoom,
  capacity: CapacityLab,
  sampling: SamplingLab,
}

export function Labs() {
  return (
    <>
      <header className="page-head">
        <h1>Labs</h1>
        <p className="lede">Browser-local calculators and simulations. Inputs never leave your machine.</p>
      </header>
      <div className="grid">
        {labs.map((l) => (
          <Link key={l.slug} to={`/labs/${l.slug}`} className="card">
            <span className="meta">{l.category}</span>
            <h3>{l.title}</h3>
            <p>{l.blurb}</p>
          </Link>
        ))}
      </div>
    </>
  )
}

export function LabPage() {
  const { slug } = useParams()
  const lab = labs.find((l) => l.slug === slug)
  const Component = slug ? registry[slug] : undefined
  if (!lab || !Component) return <NotFound />
  return (
    <>
      <nav className="crumbs">
        <Link to="/labs">Labs</Link> / {lab.title}
      </nav>
      <header className="page-head">
        <h1>{lab.title}</h1>
        <p className="lede">{lab.blurb}</p>
      </header>
      <Component />
    </>
  )
}
