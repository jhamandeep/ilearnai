export interface LessonLink {
  label: string
  url: string
  kind: 'video' | 'paper' | 'docs' | 'article' | 'repo' | 'course'
}

// Lesson bodies follow ASD-STE100 Simplified Technical English: short sentences,
// active voice, one instruction per sentence, consistent terms.
export interface Lesson {
  slug: string
  title: string
  summary: string
  minutes: number
  level?: Level // overrides the module level when set
  before?: { label: string; to: string }[] // internal links to read first
  objectives: string[] // what the reader can do after the lesson
  keyTerms: string[] // glossary slugs or plain terms used in the lesson
  body: string // markdown, supports $math$
  links: LessonLink[] // free external resources: videos, papers, docs
}

export interface Module {
  slug: string
  title: string
  description: string
  level: Level
  lessons: Lesson[]
}

export interface Track {
  slug: string
  title: string
  tagline: string
  description: string
  accent: string
  status: 'live' | 'preview'
  level: Level // the level most of the track sits at
  order: number // position on the zero-to-ecosystem learning path
  audience: string // who the track is for, in one sentence
  outcome: string // what the reader can build or do at the end
  prerequisites: string[] // track slugs to finish first
  modules: Module[]
}

export interface Video {
  id: string // YouTube video id, or '' when only a playlist/channel url is known
  embeddable?: boolean // false when the owner disabled embedding; the site then links out
  url: string // canonical YouTube url (video, playlist or channel)
  title: string
  channel: string
  track: string
  topic: string
  level: Level
  minutes?: number
  why: string
  kind: 'video' | 'playlist' | 'channel'
}

export interface Paper {
  slug: string
  day: number
  title: string
  authors: string
  year: number
  venue: string
  url: string
  track: string
  level?: Level // how much background the paper needs; defaults to the track level
  tldr: string
  notes: string // markdown
  prereqs?: string[] // paper slugs to read first; defines the reading-order hierarchy
  tags?: string[]
}

export interface GlossaryTerm {
  term: string
  slug: string
  short: string
  long: string
  related: string[]
}

export interface Lab {
  slug: string
  title: string
  blurb: string
  category: 'inference' | 'agents' | 'systems' | 'math' | 'writing'
}

export interface BlogPost {
  slug: string
  title: string
  date: string // ISO yyyy-mm-dd
  track: string // track slug
  summary: string
  minutes: number
  body: string // markdown, supports $math$
}

export type ResourceKind = 'course' | 'book' | 'lecture' | 'repo' | 'blog' | 'tool' | 'paper-list'
export type Level = 'foundations' | 'beginner' | 'intermediate' | 'advanced'

export const levelOrder: Level[] = ['foundations', 'beginner', 'intermediate', 'advanced']

export const levelInfo: Record<Level, { label: string; short: string; who: string }> = {
  foundations: { label: 'Foundations', short: 'Level 0', who: 'You have never written code and never studied AI. Start here.' },
  beginner: { label: 'Beginner', short: 'Level 1', who: 'You can run a Python file and know what a model is. You want to build your first AI programs.' },
  intermediate: { label: 'Intermediate', short: 'Level 2', who: 'You have built a small AI program. You want to understand how the parts work inside.' },
  advanced: { label: 'Advanced', short: 'Level 3', who: 'You read papers and run experiments. You want depth on training, serving and research.' },
}

export interface Resource {
  title: string
  url: string
  kind: ResourceKind
  level: Level
  track: string // track slug
  topic: string // short topic label, e.g. "Attention", "Consistency"
  why: string // one sentence on why it is worth the time
}

export interface RoadmapStage {
  title: string
  weeks: number
  goal: string
  items: { label: string; to: string }[] // internal links: /courses/..., /papers/..., /labs/...
}

export interface Roadmap {
  track: string
  title: string
  summary: string
  stages: RoadmapStage[]
}

export type ConceptKind = 'concept' | 'lesson' | 'paper' | 'lab' | 'term'

export interface ConceptNode {
  id: string
  label: string
  kind: ConceptKind
  track: string
  to?: string // internal route
}

export interface ConceptEdge {
  source: string
  target: string
  relation: 'requires' | 'explains' | 'uses' | 'related'
}
