import type { SpatialNode, SpatialEdge } from './spatialGraphScene'

type Point = [number, number, number]
export type KnowledgeRegion = { id: string; title: string; center: Point; heading: Point; members: number[]; anchors: number[] }
const areas = [
  { id: 'foundations', title: 'Start with AI', tracks: ['start-here', 'ai-foundations', 'complete-ai'] },
  { id: 'math', title: 'Mathematics', tracks: ['math-from-zero', 'ml-math'] },
  { id: 'generative', title: 'Generative AI', tracks: ['ai-research'] },
  { id: 'building', title: 'Build with AI', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { id: 'systems', title: 'AI infrastructure', tracks: ['system-design', 'inference-engineering'] },
  { id: 'robotics', title: 'Robotics', tracks: ['open-robotics'] },
]
const landmarks = ['concept:attention', 'concept:agents', 'concept:linear-algebra', 'concept:kv-cache', 'concept:vla', 'concept:gradient-descent', 'concept:retrieval', 'concept:tokenization', 'concept:capacity-estimation', 'concept:probability', 'concept:embeddings', 'concept:reasoning']
function hash(value: string) { let n = 0; for (const c of value) n = (n * 31 + c.charCodeAt(0)) >>> 0; return (n % 10007) / 10007 }

/** Keep every real node, but give the overview a stable, meaningful geography.
 * Satellites are assigned by actual graph connections, within their learning area.
 * The 2D force layout and the smaller chapter sequences remain independent. */
export function layoutKnowledgeGraph(nodes: SpatialNode[], edges: SpatialEdge[], compact: boolean) {
  const positions: Point[] = nodes.map(() => [0, 0, 0])
  const lookup = new Map(nodes.map((node, i) => [node.id, i]))
  const adjacent = nodes.map(() => [] as number[])
  for (const edge of edges) {
    const a = lookup.get(edge.source), b = lookup.get(edge.target)
    if (a !== undefined && b !== undefined) { adjacent[a].push(b); adjacent[b].push(a) }
  }
  const populated = areas.map(area => ({ ...area, members: nodes.flatMap((node, i) => area.tracks.includes(node.track ?? '') ? [i] : []) })).filter(area => area.members.length)
  // Unknown future tracks still remain visible and searchable.
  const assigned = new Set(populated.flatMap(area => area.members))
  const other = nodes.flatMap((_, i) => assigned.has(i) ? [] : [i])
  if (other.length) populated.push({ id: 'more', title: 'More to explore', tracks: [], members: other })
  const columns = Math.min(compact ? 2 : 3, populated.length), rows = Math.ceil(populated.length / columns)
  const regions: KnowledgeRegion[] = populated.map((area, regionIndex) => {
    const row = Math.floor(regionIndex / columns), col = regionIndex % columns
    const countInRow = Math.min(columns, populated.length - row * columns)
    const center: Point = [(col - (countInRow - 1) / 2) * (compact ? 7 : 7.8), ((rows - 1) / 2 - row) * (compact ? 9 : 7), (regionIndex % 3 - 1) * .35]
    const memberSet = new Set(area.members)
    let anchors = area.members.filter(i => nodes[i].kind === 'concept')
    anchors.sort((a, b) => {
      const priority = (i: number) => { const rank = landmarks.indexOf(nodes[i].id); return rank < 0 ? 100 : rank }
      return priority(a) - priority(b) || nodes[a].id.localeCompare(nodes[b].id)
    })
    if (!anchors.length) {
      const lessons = area.members.filter(i => nodes[i].kind === 'lesson')
      const firstByTrack = area.tracks.flatMap(track => { const i = lessons.find(i => nodes[i].track === track); return i === undefined ? [] : [i] })
      anchors = [...new Set([...firstByTrack, ...lessons, ...area.members])].slice(0, 5)
    }
    const owner = new Map(anchors.map(i => [i, i])), queue = [...anchors]
    for (let q = 0; q < queue.length; q++) {
      const i = queue[q]
      for (const next of adjacent[i]) if (memberSet.has(next) && !owner.has(next)) { owner.set(next, owner.get(i)!); queue.push(next) }
    }
    anchors.forEach((i, rank) => {
      const angle = (compact ? Math.PI / 2 : -Math.PI / 2) + rank * Math.PI * 2 / anchors.length
      const radius = anchors.length === 1 ? 0 : 1
      positions[i] = [center[0] + Math.cos(angle) * 2.05 * radius, center[1] - Math.sin(angle) * 1.45 * radius, center[2] + Math.sin(angle * 2 + .5) * .65]
    })
    const satellites = anchors.map(() => [] as number[])
    for (const i of area.members) if (!anchors.includes(i)) {
      const anchor = owner.get(i) ?? anchors[Math.floor(hash(nodes[i].id) * anchors.length)]
      satellites[anchors.indexOf(anchor)].push(i)
    }
    satellites.forEach((indices, rank) => indices.forEach((i, order) => {
      const origin = positions[anchors[rank]], angle = order * 2.3999632297 + rank
      const spread = .35 + Math.sqrt((order + .5) / indices.length) * (anchors.length > 8 ? .7 : 1)
      positions[i] = [origin[0] + Math.cos(angle) * spread, origin[1] + Math.sin(angle) * spread * .67, origin[2] + (hash(nodes[i].id) - .5) * 1.5]
    }))
    return { id: area.id, title: area.title, center, heading: [center[0], center[1] + (compact ? 3.25 : 3.15), center[2]], members: area.members, anchors }
  })
  return { positions, regions }
}
