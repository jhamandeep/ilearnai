import type { ActivityKind, ActivityOutline, Lesson, Track } from '../data/types'
import { labs } from '../data/labs'

export interface LessonActivity extends ActivityOutline { body: string; quizIndex?: number; labSlug?: string }
export const activityLabels: Record<ActivityKind, string> = { reading: 'Reading', animation: 'Animation', video: 'Video', quiz: 'Quiz', exercise: 'Practice', lab: 'Lab', resources: 'Resources' }
export const activitySymbols: Record<ActivityKind, string> = { reading: '☰', animation: '◉', video: '▷', quiz: '✓', exercise: '⌘', lab: '◇', resources: '↗' }
const cache = new WeakMap<Lesson, Map<string, LessonActivity[]>>()

// Keep the authored text and diagrams in the reading. Move interactive blocks
// into addressable activities and leave a link exactly where each block lived.
export function lessonActivities(lesson: Lesson, route: string): LessonActivity[] {
  const hit = cache.get(lesson)?.get(route)
  if (hit) return hit
  if (!lesson.body) return (lesson.activities ?? [{ id: 'reading', kind: 'reading', title: 'Read the lesson' }]).map(item => ({ ...item, body: '' }))
  const activities: LessonActivity[] = []
  const counts: Record<string, number> = {}
  let quizIndex = 0
  const reading = lesson.body.replace(/^[ \t]*:::(anim|video|quiz|exercise)[ \t]*\n([\s\S]*?)^[ \t]*:::[ \t]*$/gm, (block: string, type: string, source: string) => {
    const kind = (type === 'anim' ? 'animation' : type) as ActivityKind
    counts[kind] = (counts[kind] ?? 0) + 1
    const id = `${kind}-${counts[kind]}`
    const caption = source.match(/^\s*title\s*:\s*(.+)$/m)?.[1]?.trim()
    const title = caption || `${activityLabels[kind]} ${counts[kind]}`
    activities.push({ id, kind, title, body: block, ...(kind === 'quiz' ? { quizIndex: quizIndex++ } : {}) })
    return `\n\n[${activityLabels[kind]}: ${title.replace(/[[\]]/g, '')}](${route}/${id})\n\n`
  })
  const linkedLabs = new Set([...lesson.body.matchAll(/\]\(\/labs\/([a-z0-9-]+)(?:#[^)]*)?\)/g)].map(match => match[1]))
  for (const slug of linkedLabs) {
    const lab = labs.find(item => item.slug === slug)
    if (lab) activities.push({ id: `lab-${slug}`, kind: 'lab', title: lab.title, body: '', labSlug: slug })
  }
  const result: LessonActivity[] = [{ id: 'reading', kind: 'reading', title: 'Read the lesson', body: reading }, ...activities, { id: 'resources', kind: 'resources', title: 'Explore videos and resources', body: '' }]
  const entries = cache.get(lesson) ?? new Map<string, LessonActivity[]>()
  entries.set(route, result); cache.set(lesson, entries)
  return result
}

export function trackActivities(track: Track) {
  return track.modules.flatMap(module => module.lessons.flatMap(lesson => {
    const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`
    return lessonActivities(lesson, route).map(activity => ({ ...activity, route, lesson, module }))
  }))
}
