import type { ConceptKind, ConceptNode } from '../data/types'
import type { SpatialEdge } from './spatialGraphScene'

export type AtlasItem = { id: string; label: string; subtitle: string; shape: number; area?: boolean }
export type AtlasData = { key: string; root: AtlasItem | null; items: AtlasItem[]; totalNodes: number; totalEdges: number; nodes: ConceptNode[]; edges: SpatialEdge[]; groups: KnowledgeArea[]; areaId: string | null; selected: string | null }
export type KnowledgeArea = AtlasItem & { tracks: string[]; members: ConceptNode[]; topics: ConceptNode[] }
const definitions = [
  { id: 'foundations', label: 'Start with AI', subtitle: 'Ideas & everyday uses', tracks: ['start-here', 'ai-foundations', 'complete-ai'], shape: 0 },
  { id: 'math', label: 'Mathematics', subtitle: 'The ideas underneath', tracks: ['math-from-zero', 'ml-math'], shape: 1 },
  { id: 'generative', label: 'Generative AI', subtitle: 'Language & reasoning', tracks: ['ai-research'], shape: 2 },
  { id: 'building', label: 'Build with AI', subtitle: 'From tools to applications', tracks: ['build-ai-ecosystem', 'ai-engineering'], shape: 3 },
  { id: 'systems', label: 'AI infrastructure', subtitle: 'Serve, scale & evaluate', tracks: ['system-design', 'inference-engineering'], shape: 4 },
  { id: 'robotics', label: 'Robotics', subtitle: 'AI meets the physical world', tracks: ['open-robotics'], shape: 5 },
]
const preferred = ['concept:attention', 'concept:agents', 'concept:linear-algebra', 'concept:kv-cache', 'concept:vla', 'concept:tokenization', 'concept:retrieval', 'concept:probability', 'concept:capacity-estimation', 'concept:reasoning', 'concept:embeddings', 'concept:gradient-descent']
export const kindNames: Record<ConceptKind, string> = { concept: 'Concept', lesson: 'Lesson', paper: 'Research paper', lab: 'Interactive lab', term: 'Key term' }
export const conceptDescriptions: Record<string, string> = {
  'concept:attention': 'How a model decides which words matter to each other. Explore the idea in a lesson, the original research, and a practical experiment.',
  'concept:agents': 'How AI can use tools and take steps toward a goal. Explore the decisions, memory, and safeguards that make an agent useful.',
  'concept:retrieval': 'Give AI relevant information before it answers. Explore how search and generation work together.',
  'concept:kv-cache': 'Why saving a model’s previous work can make its next answer faster. Connect the idea to memory and serving systems.',
  'concept:gradient-descent': 'How a model improves by making small changes in the right direction. Explore the idea through lessons and experiments.',
  'concept:vla': 'How robots connect what they see, what you ask, and how they move.',
}
const shapes: Record<ConceptKind, number> = { concept: 2, lesson: 0, paper: 1, lab: 3, term: 5 }
export function atlasItem(node: ConceptNode): AtlasItem { return { id: node.id, label: node.label, subtitle: kindNames[node.kind], shape: shapes[node.kind] } }

/** Navigation groups contain existing resources; they never create graph edges. */
export function knowledgeAreas(nodes: ConceptNode[]): KnowledgeArea[] {
  const known = new Set(definitions.flatMap(area => area.tracks))
  const other = [...new Set(nodes.flatMap(node => node.track && !known.has(node.track) ? [node.track] : []))]
  const groups = other.length || nodes.some(node => !node.track) ? [...definitions, { id: 'more', label: 'More to explore', subtitle: 'Connected learning resources', tracks: other, shape: 0 }] : definitions
  return groups.flatMap(area => {
    const members = nodes.filter(node => area.tracks.includes(node.track ?? '') || area.id === 'more' && !node.track)
    if (!members.length) return []
    const concepts = members.filter(node => node.kind === 'concept')
    const priority = (node: ConceptNode) => { const rank = preferred.indexOf(node.id); return rank < 0 ? 100 : rank }
    concepts.sort((a, b) => priority(a) - priority(b) || a.label.localeCompare(b.label))
    const lessons = members.filter(node => node.kind === 'lesson')
    const starters = area.tracks.flatMap(track => { const node = lessons.find(node => node.track === track); return node ? [node] : [] })
    const topics = concepts.length ? concepts : [...new Map([...starters, ...lessons, ...members].map(node => [node.id, node])).values()]
    return [{ ...area, id: `area:${area.id}`, area: true, members, topics }]
  })
}
