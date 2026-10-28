import type { Industry, WorkCase, WorkRole } from '../data/work/types'

export function roleActions(industry: Industry, item: WorkCase, role: WorkRole) {
  switch (role.id) {
    case 'leadership': return [`Test the business benefit: ${item.benefit}`, `Agree evidence for investment: ${item.metric}`, `Name the accountable owner: ${industry.owner}`]
    case 'managers': return [`Map today’s work: ${item.before}`, `Make the review responsibility explicit: ${item.human}`, `Train the team to report this failure: ${item.stop}`]
    case 'team-members': return [`Try the assistance on approved examples: ${item.ai}`, `Keep your judgement in the workflow: ${item.human}`, 'Compare with the source, record corrections, and escalate uncertain results.']
    case 'architects': return [`Map the connections: ${item.systems.join(' → ')}.`, `Control access to these inputs: ${item.inputs.join('; ')}.`, 'Show source evidence, keep a record of changes, and provide a working fallback.']
    case 'delivery': return [`Bound the pilot: ${item.pilot}`, `Turn the success measures into acceptance tests: ${item.metric}`, `Rehearse the stop condition: ${item.stop}`]
    case 'risk': return [`Consider who is affected: ${industry.stakes}`, `Require suitable evidence: ${industry.proof}`, `Agree an escalation and pause rule: ${item.stop}`]
    case 'operations': return [`Keep these sources current: ${item.inputs.join('; ')}.`, `Monitor service quality: ${item.metric}`, 'Assign support ownership and test returning to the current process when the tool fails.']
  }
}

export function buildWorkBrief(industry: Industry, item: WorkCase, role: WorkRole) {
  return [
    'ILEARNAI — AI FOR YOUR WORK', `${industry.name}: ${item.title}`, `Your role: ${role.name} (${industry.roles[role.id]})`, '',
    'Planning example — adapt with your team; no guaranteed benefit or ready-made production approval.', '',
    'OUTCOME TO TEST', item.benefit, '', 'CURRENT WORK', item.before, '', 'AI ASSISTANCE', item.ai, '', 'PERSON RESPONSIBLE', item.human, '',
    'INFORMATION NEEDED', ...item.inputs.map(input => `- ${input}`), '', 'SYSTEM CONNECTIONS', item.systems.join(' → '), '',
    'MY NEXT ACTIONS', ...roleActions(industry, item, role).map(action => `- ${action}`), '', 'MY DELIVERABLE', role.deliverable, '',
    'BOUNDED PILOT', item.pilot, '', 'MEASURE AGAINST TODAY', item.metric, '', 'WHEN TO PAUSE', item.stop, '',
    'BEFORE LAUNCH', 'Name the owner, approve the inputs, test representative cases, train reviewers, and rehearse the fallback.', '',
    'INDUSTRY READING', industry.source.title, industry.source.url, industry.source.context, '',
    'NEXT TEAM DECISION', 'Proceed / revise / stop: __________', 'Owner: __________', 'Review date: __________',
  ].join('\n')
}

export interface CapacityInputs { volume: number; eligible: number; before: number; draft: number; review: number; oversight: number }
export function estimateCapacity(input: CapacityInputs) {
  const { volume, eligible, before, draft, review, oversight } = input
  if (![volume, eligible, before, draft, review, oversight].every(Number.isFinite) || volume < 0 || volume > 1000000 || eligible < 0 || eligible > 100 || before < 0 || before > 480 || draft < 0 || draft > 480 || review < 0 || review > 480 || oversight < 0 || oversight > 10000) return null
  const affected = volume * eligible / 100
  const baselineHours = volume * before / 60
  const netHours = affected * (before - draft - review) / 60 - oversight
  return { affected, baselineHours, proposedHours: baselineHours - netHours, netHours }
}
