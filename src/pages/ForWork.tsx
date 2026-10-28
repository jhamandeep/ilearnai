import { useState, type CSSProperties } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { industries, findIndustry, workCaseCount } from '../data/work/industries'
import { workRoles, findWorkRole } from '../data/work/roles'
import type { Industry, WorkCase, WorkRole } from '../data/work/types'
import { CourseArtwork } from '../components/CourseArtwork'
import { BriefDownload, CapacityEstimate, WorkFlow } from '../components/WorkTools'
import { roleActions } from '../lib/workLearning'
import { isWorkReviewed, setWorkReviewed, useProgressVersion } from '../lib/progress'
import { useAuth } from '../lib/auth'
import { NotFound } from './NotFound'

function useRole() {
  const [params, setParams] = useSearchParams()
  const role = findWorkRole(params.get('role'))
  return { role, params, setParams, choose: (id: string) => setParams(previous => { const next = new URLSearchParams(previous); next.set('role', id); return next }) }
}
const roleQuery = (role: WorkRole) => `?role=${role.id}`
function RoleSelector({ selected, choose }: { selected: WorkRole; choose: (id: string) => void }) {
  return <fieldset className="work-role-picker"><legend>What is your role?</legend><div>{workRoles.map(role => <button key={role.id} type="button" aria-pressed={selected.id === role.id} onClick={() => choose(role.id)}>{role.name}</button>)}</div></fieldset>
}
function SourceNote({ industry }: { industry: Industry }) {
  return <aside className="work-source"><p className="eyebrow">Industry evidence</p><p>{industry.evidence} <a href={industry.source.url} target="_blank" rel="noreferrer">{industry.source.title} ↗</a></p><small>{industry.source.context} · Reviewed 26 October 2026.</small></aside>
}
function CaseCard({ industry, item, role }: { industry: Industry; item: WorkCase; role: WorkRole }) {
  return <Link className="work-case-card" to={`/for-work/${industry.slug}/${item.slug}${roleQuery(role)}`} data-work-case={item.slug}><span className="work-case-kind">{item.approach}<span>{isWorkReviewed(industry.slug, item.slug) ? '✓ Reviewed' : 'Practical guide'}</span></span><h3>{item.title}</h3><p>{item.benefit}</p><div><small>What stays with people</small><p>{item.human}</p></div><span className="work-card-action">Walkthrough · Questions · Implementation →</span></Link>
}
function CompareIndustries({ initial = 'banking' }: { initial?: string }) {
  const [left, setLeft] = useState(initial)
  const [right, setRight] = useState(initial === 'retail' ? 'banking' : 'retail')
  const first = findIndustry(left)!, second = findIndustry(right)!
  return <section className="work-comparison" id="compare"><div className="work-section-heading"><div><p className="eyebrow">Different work. Different requirements.</p><h2>Why the same AI needs a different plan.</h2><p>A useful idea can transfer between fields. Its data, review process, and measures of success often cannot.</p></div></div><div className="work-comparison-pickers"><label>First industry<select value={left} onChange={event => setLeft(event.target.value)}>{industries.map(industry => <option key={industry.slug} value={industry.slug}>{industry.name}</option>)}</select></label><span aria-hidden="true">↔</span><label>Compare with<select value={right} onChange={event => setRight(event.target.value)}>{industries.map(industry => <option key={industry.slug} value={industry.slug}>{industry.name}</option>)}</select></label></div>{left === right ? <p className="work-empty" role="status">Choose two different industries to compare their needs.</p> : <div className="work-table-scroll"><table><caption>{first.name} compared with {second.name}</caption><thead><tr><th scope="col">What changes</th><th scope="col">{first.name}</th><th scope="col">{second.name}</th></tr></thead><tbody>{([['Information used', 'data'], ['What an error can affect', 'stakes'], ['Evidence to collect', 'proof'], ['Accountable owner', 'owner']] as const).map(([label, key]) => <tr key={key}><th scope="row">{label}</th><td>{first[key]}</td><td>{second[key]}</td></tr>)}</tbody></table></div>}</section>
}

function FeaturedWork({ role }: { role: WorkRole }) {
  const [selected, setSelected] = useState('banking')
  const industry = findIndustry(selected)!
  const item = industry.cases[0]
  return <section className="featured-work" id="start-with-example"><header><p className="eyebrow">A five-minute starting point · no technical background needed</p><h2>See a useful task, from start to finish.</h2><p>Choose a field, play the visual walkthrough, then try the decision question. The full guides adapt the next steps to your role.</p></header><div className="workspace-pills" aria-label="Example industry">{['banking', 'retail', 'manufacturing', 'education'].map(slug => <button type="button" key={slug} aria-pressed={selected === slug} onClick={() => setSelected(slug)}>{findIndustry(slug)!.name}</button>)}</div><div className="featured-work-title"><h3>{item.title}</h3><Link to={`/for-work/${industry.slug}/${item.slug}${roleQuery(role)}#implementation`}>Plan this in your role →</Link></div><p>{item.benefit}</p><WorkFlow key={selected} item={item} industrySlug={selected} /></section>
}

export function ForWork() {
  const { role, choose, params, setParams } = useRole()
  useProgressVersion()
  const query = params.get('q') ?? ''
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const visible = industries.filter(industry => words.every(word => `${industry.name} ${industry.summary} ${industry.cases.map(item => `${item.title} ${item.benefit}`).join(' ')}`.toLowerCase().includes(word)))
  return <div className="work-page"><header className="work-hero"><div><p className="eyebrow">AI for your work · No coding required</p><h1>Start with your world.<br />See what AI can change.</h1><p>Understand the benefit, explore a real work problem, and plan a useful first step. Choose your field and your role.</p><div className="hero-actions"><a href="#start-with-example" className="btn btn-primary">Try a visual example ↓</a><a href="#industries" className="text-cta">Find your industry ↓</a><a href="#compare" className="text-cta">Compare fields ↗</a></div><span className="work-hero-meta">{industries.length} industries · {workCaseCount} use cases · {workRoles.length} role perspectives</span></div><div className="work-hero-art"><CourseArtwork topic="ai-agents" /><div><span>01 Understand the opportunity</span><span>02 See the workflow</span><span>03 Plan a small pilot</span></div></div></header>
    <FeaturedWork role={role} />
    <RoleSelector selected={role} choose={choose} /><section className="work-role-intro"><div><p className="eyebrow">For {role.name.toLowerCase()}</p><h2>{role.question}</h2></div><div><p>{role.focus} {role.action}</p><strong>Leave with: {role.deliverable}</strong></div></section>
    <section id="industries"><div className="work-section-heading"><div><p className="eyebrow">Find your context</p><h2>What does AI mean in your field?</h2></div><label className="work-search"><span className="sr-only">Find an industry or work problem</span><input type="search" value={query} placeholder="Search a field or work problem" onChange={event => setParams(previous => { const next = new URLSearchParams(previous); if (event.target.value) next.set('q', event.target.value); else next.delete('q'); return next }, { replace: true })} /></label></div><p className="work-results" role="status">{visible.length} industries{query ? ` matching “${query}”` : ' to explore'}</p><div className="work-industry-grid">{visible.map(industry => <Link key={industry.slug} to={`/for-work/${industry.slug}${roleQuery(role)}`} className="work-industry-card" style={{ '--industry-color': industry.color } as CSSProperties} data-industry={industry.slug}><span className="work-industry-icon" aria-hidden="true">{industry.icon}</span><h3>{industry.name}</h3><p>{industry.tagline}</p><small>{industry.cases.map(item => item.title).join(' · ')}</small><span className="work-card-action">Explore {industry.cases.length} use cases →</span></Link>)}</div>{!visible.length && <div className="work-empty"><h3>No matching field yet</h3><p>Try a broader term, or explore a similar workflow in another field.</p><button type="button" className="btn btn-ghost" onClick={() => setParams({ role: role.id })}>Show all industries</button></div>}</section>
    <CompareIndustries /><CapacityEstimate /><section className="work-next"><h2>Learn enough to make a better decision.</h2><p>Start with one work problem. You can explore the technical courses whenever you want to understand the tools more deeply.</p><Link className="btn btn-primary" to="/ask?q=How%20can%20AI%20help%20in%20my%20work%3F">Ask for guidance →</Link><Link className="text-cta" to="/courses">Explore technical courses ↗</Link></section>
  </div>
}

export function IndustryPage() {
  const { industry: slug } = useParams()
  const industry = findIndustry(slug)
  const { role, choose } = useRole()
  useProgressVersion()
  if (!industry) return <NotFound />
  const reviewed = industry.cases.filter(item => isWorkReviewed(industry.slug, item.slug)).length
  return <div className="work-page"><nav className="crumbs"><Link to={`/for-work${roleQuery(role)}`}>AI for your work</Link><span>/</span><span>{industry.name}</span></nav><header className="work-industry-hero" style={{ '--industry-color': industry.color } as CSSProperties}><div><p className="eyebrow">AI in {industry.name.toLowerCase()}</p><h1>{industry.tagline}</h1><p>{industry.summary}</p><span className="work-hero-meta">No technical prerequisites · {industry.cases.length} practical guides · {reviewed} reviewed</span></div><CourseArtwork topic={industry.artwork} /></header><RoleSelector selected={role} choose={choose} /><section className="work-role-intro"><div><p className="eyebrow">Your perspective</p><h2>{industry.roles[role.id]}</h2></div><div><h3>{role.question}</h3><p>{role.action}</p><strong>Your output: {role.deliverable}</strong></div></section>
    <section><div className="work-section-heading"><div><p className="eyebrow">From opportunity to implementation</p><h2>Choose a work problem.</h2><p>These are illustrative pilot designs, not claims of proven results. Each explains the benefit, inputs, review, and measures to test.</p></div></div><div className="work-case-grid">{industry.cases.map(item => <CaseCard key={item.slug} industry={industry} item={item} role={role} />)}</div></section>
    <section className="work-evolution"><p className="eyebrow">How the possibilities are changing</p><h2>From fixed rules to assistance in the workflow.</h2><p>These approaches can coexist. More automation is a choice to justify, not a required destination.</p><div>{industry.evolution.map((text, i) => <article key={text}><span>0{i + 1}</span><h3>{['Rules and structured tools', 'Prediction and useful assistance', 'Connected work with clear authority'][i]}</h3><p>{text}</p></article>)}</div></section><SourceNote industry={industry} /><CompareIndustries key={industry.slug} initial={industry.slug} /><section className="work-next"><h2>Explore another perspective.</h2><p>Use the role selector to see what leaders, managers, team members, architects, delivery, risk, and operations each need to do.</p><Link className="btn btn-primary" to={`/for-work${roleQuery(role)}`}>All industries →</Link><Link className="text-cta" to={`/ask?q=${encodeURIComponent(`How can AI help in ${industry.name}?`)}`}>Ask about this field ↗</Link></section></div>
}

export function WorkCasePage() {
  const { industry: slug, useCase: caseSlug } = useParams()
  const { role, choose } = useRole()
  const industry = findIndustry(slug)
  const item = industry?.cases.find(item => item.slug === caseSlug)
  const { loading, preview, user, syncStatus } = useAuth()
  useProgressVersion()
  const [stage, setStage] = useState(0)
  if (!industry || !item) return <NotFound />
  const reviewed = isWorkReviewed(industry.slug, item.slug)
  const stages = [
    { title: 'Define the work', owner: 'Business owner + team members', text: `Observe the current process: ${item.before} Record a baseline using: ${item.metric}`, output: 'A problem statement, baseline, and named owner.' },
    { title: 'Prepare and connect', owner: 'Architect + data owner + risk reviewer', text: `Approve the inputs: ${item.inputs.join('; ')}. Map the connections: ${item.systems.join(' → ')}. Start with read-only access and retain the source evidence.`, output: 'Approved sample data, an access map, and a working fallback.' },
    { title: 'Run a bounded pilot', owner: 'Delivery team + manager + reviewers', text: `${item.pilot} Include difficult and failing examples. Count review and correction time as part of the work.`, output: 'Results compared with the baseline and feedback from the people doing the task.' },
    { title: 'Decide, operate, and review', owner: 'Sponsor + process owner + operations', text: `Decide whether to expand, revise, or stop using the agreed evidence. ${item.stop} Assign source updates, support, incident response, and a review date.`, output: 'A recorded release decision and a support runbook; a pilot is not automatic permission to scale.' },
  ]
  return <div className="work-page work-detail"><nav className="crumbs"><Link to={`/for-work${roleQuery(role)}`}>AI for your work</Link><span>/</span><Link to={`/for-work/${industry.slug}${roleQuery(role)}`}>{industry.name}</Link><span>/</span><span>{item.title}</span></nav><header className="work-case-hero"><p className="eyebrow">{industry.name} · {item.approach} · Practical guide</p><h1>{item.title}</h1><p>{item.benefit}</p><span className="work-example-label">Illustrative pilot · no coding required</span></header><RoleSelector selected={role} choose={choose} />
    <nav className="workspace-pills work-section-links" aria-label="Guide sections"><a href="#walkthrough">Visual walkthrough</a><a href="#questions">Questions &amp; answers</a><a href="#implementation">Implementation</a><a href="#estimate">Estimate the benefit</a></nav><section className="work-before-after"><article><span>Today</span><h2>The work you recognise</h2><p>{item.before}</p></article><article><span>With AI assistance</span><h2>A different way to prepare</h2><p>{item.ai}</p></article><article><span>People stay accountable</span><h2>The decision remains clear</h2><p>{item.human}</p></article></section><WorkFlow key={`${industry.slug}/${item.slug}`} item={item} industrySlug={industry.slug} />
    <section className="work-role-action"><div><p className="eyebrow">Your role in this use case</p><h2>{industry.roles[role.id]}</h2><p>{role.focus}</p></div><div><ol>{roleActions(industry, item, role).map(action => <li key={action}>{action}</li>)}</ol><p><strong>Bring to the team:</strong> {role.deliverable}</p></div></section>
    <section className="work-implementation" id="implementation"><p className="eyebrow">What implementation involves</p><h2>A tool is one part of the change.</h2><p>People, approved information, system connections, and a way to measure results all need an owner.</p><div className="work-system-map">{item.systems.map((system, i) => <div key={system}><small>0{i + 1}</small><strong>{system}</strong></div>)}</div><div className="work-stage-picker" aria-label="Implementation stages">{stages.map((item, i) => <button type="button" key={item.title} aria-pressed={i === stage} onClick={() => setStage(i)}>{i + 1}. {item.title}</button>)}</div><article className="work-stage-detail"><span>{stages[stage].owner}</span><h3>{stages[stage].title}</h3><p>{stages[stage].text}</p><strong>Leave this stage with: {stages[stage].output}</strong></article></section>
    <section className="work-evidence-grid"><article><span>Define success before the pilot</span><h2>Measure the whole task.</h2><p>{item.metric}</p><p>Use comparable cases. Record the quality of the outcome as well as the time spent creating, checking, and correcting it.</p></article><article><span>Agree the pause point</span><h2>Make it easy to stop.</h2><p>{item.stop}</p><p>Name the person who receives the issue, and keep the existing process available.</p></article></section><CapacityEstimate /><BriefDownload industry={industry} item={item} role={role} /><SourceNote industry={industry} />
    <section className="work-complete"><div><h2>{reviewed ? 'You’ve reviewed this use case.' : 'Ready to discuss this with your team?'}</h2><p>Marking this guide reviewed tracks your learning. It does not approve a real deployment.</p><small>{syncStatus !== 'saved' ? preview && !user ? 'Progress is kept for this visit while browser storage is unavailable.' : 'Progress is waiting to save.' : preview && !user ? 'Saved in this browser.' : user ? 'Saved to your account.' : 'Progress is available for this visit.'}</small></div><button type="button" className="btn btn-primary" disabled={loading} onClick={() => setWorkReviewed(industry.slug, item.slug, !reviewed)}>{reviewed ? 'Mark as not reviewed' : 'Mark guide reviewed'}</button></section><div className="work-back-links"><Link to={`/for-work/${industry.slug}${roleQuery(role)}`}>← More {industry.name.toLowerCase()} use cases</Link><Link to="/dashboard">My learning →</Link></div>
  </div>
}
