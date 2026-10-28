import { Link, useParams } from 'react-router-dom'
import { labs } from '../data/labs'
import { KvCacheLab } from '../labs/KvCacheLab'
import { AgentControlRoom } from '../labs/AgentControlRoom'
import { CapacityLab } from '../labs/CapacityLab'
import { SamplingLab } from '../labs/SamplingLab'
import { GradientDescentLab } from '../labs/GradientDescentLab'
import { AttentionLab } from '../labs/AttentionLab'
import { TokenizerLab } from '../labs/TokenizerLab'
import { TransformerFlowLab } from '../labs/TransformerFlowLab'
import { ParetoRouterLab } from '../labs/ParetoRouterLab'
import { TimeoutArchitectLab } from '../labs/TimeoutArchitectLab'
import { SteCheckerLab } from '../labs/SteCheckerLab'
import { NotFound } from './NotFound'
import type { ComponentType } from 'react'
import { LabGuide } from '../components/LabGuide'

const registry: Record<string, ComponentType> = {
  'kv-cache': KvCacheLab,
  'agent-control-room': AgentControlRoom,
  capacity: CapacityLab,
  sampling: SamplingLab,
  'gradient-descent': GradientDescentLab,
  attention: AttentionLab,
  tokenizer: TokenizerLab,
  'transformer-flow': TransformerFlowLab,
  'pareto-router': ParetoRouterLab,
  'timeout-architect': TimeoutArchitectLab,
  'ste-checker': SteCheckerLab,
}

export function LabContent({ slug }: { slug: string }) {
  const Component = registry[slug]
  if (slug === 'gradient-descent' && Component) return <><Component /><LabGuide slug={slug} /><LabGuide slug={slug} after /></>
  return Component ? <><LabGuide slug={slug} /><Component /><LabGuide slug={slug} after /></> : <NotFound />
}

export function Labs() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Learn by doing</p>
        <h1>Labs</h1>
        <p className="lede">Browser-local calculators, animations and simulations. Inputs never leave your machine. All free.</p>
      </header>
      <div className="grid">
        {labs.map((l) => (
          <Link key={l.slug} to={`/labs/${l.slug}`} className="card lab-card">
            <span className="meta">{l.category}</span>
            <h3>{l.title}</h3>
            <p>{l.blurb}</p>
            <span className="journey-action">Open the lab <span aria-hidden="true">→</span></span>
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
      <LabContent slug={lab.slug} />
    </>
  )
}
