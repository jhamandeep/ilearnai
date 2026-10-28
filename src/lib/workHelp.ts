import { industries } from '../data/work/industries'
import { workRoles } from '../data/work/roles'
import type { HelpAnswer } from './siteHelp'
const industryTerms: Record<string, string[]> = {
  banking: ['bank', 'banking', 'banks', 'lending'], insurance: ['insurance', 'insurer'], healthcare: ['healthcare', 'health care', 'hospital', 'clinic', 'patient'], retail: ['retail', 'commerce', 'shop', 'store', 'ecommerce'], manufacturing: ['manufacturing', 'factory', 'plant', 'production line'], education: ['education', 'teacher', 'teaching', 'school'], 'public-services': ['public services', 'public sector', 'government', 'civil service'], 'professional-services': ['professional services', 'consulting', 'consultant', 'hr', 'human resources', 'marketing', 'accounting', 'legal operations'], technology: ['technology', 'software delivery', 'it support', 'software team'], logistics: ['logistics', 'transport', 'shipping', 'supply chain', 'warehouse'], energy: ['energy', 'utilities', 'utility', 'electricity'], agriculture: ['agriculture', 'farming', 'farmer', 'food', 'crop'],
}
const roleTerms = { leadership: ['leadership', 'leader', 'executive', 'ceo', 'strategy'], managers: ['manager', 'managers', 'management'], 'team-members': ['team member', 'employee', 'staff', 'practitioner'], architects: ['architect', 'architects', 'architecture'], delivery: ['delivery', 'project', 'implementation'], risk: ['risk', 'compliance', 'governance'], operations: ['operations', 'support', 'operate'] }
const matches = (query: string, phrase: string) => ` ${query} `.includes(` ${phrase} `)
export function answerWorkQuestion(question: string): HelpAnswer | null {
  const query = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
  const selected = industries.filter(industry => industryTerms[industry.slug].some(term => matches(query, term)))
  const role = workRoles.find(item => roleTerms[item.id].some(term => matches(query, term)))
  const suffix = role ? `?role=${role.id}` : ''
  if (selected.length > 1) return { kind: 'help', title: 'The field changes the implementation', text: selected.slice(0, 2).map(industry => `${industry.name}: ${industry.stakes} ${industry.proof}`).join(' '), links: [{ title: 'Compare industry requirements', to: '/for-work#compare' }, ...selected.slice(0, 2).map(industry => ({ title: `AI in ${industry.name}`, to: `/for-work/${industry.slug}${suffix}` }))] }
  if (selected.length === 1) {
    const industry = selected[0]
    return { kind: 'help', title: `AI for ${industry.name.toLowerCase()}${role ? `: ${role.name.toLowerCase()}` : ''}`, text: `${industry.summary}${role ? ` For ${industry.roles[role.id].toLowerCase()}: ${role.focus}` : ''}`, links: [{ title: `${industry.name}: benefits and implementation`, to: `/for-work/${industry.slug}${suffix}` }, ...industry.cases.slice(0, 3).map(item => ({ title: item.title, to: `/for-work/${industry.slug}/${item.slug}${suffix}`, detail: item.benefit }))] }
  }
  const workIntent = /\b(industry|industries|business|workplace|non technical|nontechnical|my work|my role|my field|use cases|benefit|benefits|pilot)\b/.test(query)
  if (workIntent || role && /\b(ai|adopt|apply|use|implementation|role)\b/.test(query)) return { kind: 'help', title: role ? `AI for ${role.name.toLowerCase()}` : 'Start with AI for your work', text: role ? `${role.focus} ${role.action}` : 'Choose your industry and role to explore practical benefits, use cases, human review, system connections, and a small pilot. The guides cover 12 industries and do not require coding.', links: [{ title: 'Explore AI for your work', to: `/for-work${suffix}` }, { title: 'Compare industries', to: '/for-work#compare' }, { title: 'Try a capacity estimate', to: '/for-work#estimate' }] }
  return null
}
