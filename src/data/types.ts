export type Tier = 'free' | 'pro'

export interface Lesson {
  slug: string
  title: string
  summary: string
  tier: Tier
  minutes: number
  body: string // markdown, supports $math$
}

export interface Module {
  slug: string
  title: string
  description: string
  lessons: Lesson[]
}

export interface Track {
  slug: string
  title: string
  tagline: string
  description: string
  accent: string
  status: 'live' | 'preview'
  modules: Module[]
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
  tldr: string
  notes: string // markdown
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
  category: 'inference' | 'agents' | 'systems' | 'math'
}
