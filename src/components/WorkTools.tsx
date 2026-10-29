import { useState } from 'react'
import type { Industry, WorkCase, WorkRole } from '../data/work/types'
import { buildWorkBrief, estimateCapacity, type CapacityInputs } from '../lib/workLearning'
import { Anim } from './rich/Anim'
import { workExplainerScene } from '../lib/explainerScenes'
import { WorkQuestions } from './WorkQuestions'
import { workExamples } from '../data/work/examples'

export function WorkFlow({ item, industrySlug }: { item: WorkCase; industrySlug: string }) {
  const example = workExamples[`${industrySlug}/${item.slug}`]
  return <div className="work-flow" id="walkthrough" data-work-flow="true">
    <div className="work-section-heading"><div><p className="eyebrow">Follow a concrete example</p><h2>Where AI fits. Where you fit.</h2><p>Press play to follow the information, the proposed output, and the human decision.</p></div></div>
    <Anim src={workExplainerScene(industrySlug, item)} />
    {example && <div className="work-example-explanation"><p><strong>The lesson:</strong> {example.lesson}</p><details><summary>Read the whole example without animation</summary><dl>{[['What comes in', example.input], ['A possible AI output', example.draft], ['What the reviewer does', example.review], ['What happens next', example.outcome]].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl></details><p><strong>Try it in your own field:</strong> Describe one input, the output you need, the person who checks it, and one reason to reject it.</p></div>}
    <WorkQuestions key={`${industrySlug}/${item.slug}`} caseKey={`${industrySlug}/${item.slug}`} item={item} />
    <p className="work-caption">Fictional teaching example. No live AI or real customer records. Select any scene; playback stops at the end.</p>
  </div>
}

const inputFields: { key: keyof CapacityInputs; label: string; max: number; suffix: string }[] = [
  { key: 'volume', label: 'Tasks each month', max: 1000000, suffix: 'tasks' },
  { key: 'eligible', label: 'Tasks suitable for this tool', max: 100, suffix: '%' },
  { key: 'before', label: 'Current time per task', max: 480, suffix: 'minutes' },
  { key: 'draft', label: 'Time using the tool', max: 480, suffix: 'minutes' },
  { key: 'review', label: 'Checking and correction time', max: 480, suffix: 'minutes' },
  { key: 'oversight', label: 'Extra monthly support and training', max: 10000, suffix: 'hours' },
]
export function CapacityEstimate() {
  const [values, setValues] = useState({ volume: '600', eligible: '60', before: '12', draft: '2', review: '4', oversight: '8' })
  const input = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim() === '' ? NaN : Number(value)])) as unknown as CapacityInputs
  const result = estimateCapacity(input)
  const format = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 1 })
  const largest = result ? Math.max(result.baselineHours, result.proposedHours, 1) : 1
  return <section className="work-estimator" id="estimate"><div><p className="eyebrow">Try the business case</p><h2>Would this actually free up time?</h2><p>For a repetitive task, include checking, corrections, and ongoing support. Change these illustrative assumptions to see the trade-off.</p><p className="work-caption">A capacity estimate, not a savings promise. Released time is not cash savings. Quality, service outcomes, software costs, and implementation effort also matter.</p></div><div className="work-estimator-form">{inputFields.map(field => <label key={field.key} htmlFor={`capacity-${field.key}`}><span>{field.label}</span><div><input id={`capacity-${field.key}`} type="number" min={0} max={field.max} step="any" value={values[field.key]} onChange={event => setValues(previous => ({ ...previous, [field.key]: event.target.value }))} /><small>{field.suffix}</small></div></label>)}</div><div className="work-estimate-result" aria-live="polite">{result ? <><strong>{format(Math.abs(result.netHours))} hours</strong><span>{result.netHours >= 0 ? 'potentially released each month' : 'of extra work each month'}</span><div className="work-time-bars"><div><span>Current work · {format(result.baselineHours)}h</span><i style={{ width: `${result.baselineHours / largest * 100}%` }} /></div><div><span>With assistance · {format(result.proposedHours)}h</span><i style={{ width: `${result.proposedHours / largest * 100}%` }} /></div></div><p>{format(result.affected)} suitable tasks × (current − tool − review minutes) ÷ 60 − support hours.</p></> : <p>Enter a valid non-negative value in every field. The suitable share must be 0–100%.</p>}</div></section>
}

export function BriefDownload({ industry, item, role }: { industry: Industry; item: WorkCase; role: WorkRole }) {
  const [message, setMessage] = useState('')
  function download() {
    try {
      const url = URL.createObjectURL(new Blob([buildWorkBrief(industry, item, role)], { type: 'text/plain;charset=utf-8' }))
      const link = document.createElement('a'); link.href = url; link.download = `ilearnai-${industry.slug}-${item.slug}-${role.id}.txt`; document.body.appendChild(link); link.click(); link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Your pilot brief is ready to download.')
    } catch { setMessage('Download is unavailable. You can copy the brief below.') }
  }
  return <section className="work-brief"><div><p className="eyebrow">Take this into your next conversation</p><h2>Your pilot brief</h2><p>A practical starting point for {industry.roles[role.id].toLowerCase()}: the outcome, the inputs, the person who checks the result, and the evidence to collect.</p></div><button className="btn btn-primary" type="button" onClick={download}>Download your brief ↓</button><span role="status">{message}</span><details><summary>Read or copy the brief</summary><pre>{buildWorkBrief(industry, item, role)}</pre></details></section>
}
