// Practice papers are built from the quiz questions inside lessons, so every
// paper grows automatically as lessons are added, and every question links
// back to the lesson that teaches it.
import { tracks } from '../data/tracks'
import { quizzesIn, sample, type QuizQuestion } from './quiz'
import type { Level, Track } from '../data/types'

export interface PoolQuestion extends QuizQuestion {
  track: string
  lessonTitle: string
  route: string
  level: Level
}

const cache = new Map<string, PoolQuestion[]>()

export function poolForTrack(track: Track): PoolQuestion[] {
  const hit = cache.get(track.slug)
  if (hit) return hit
  const out: PoolQuestion[] = []
  for (const m of track.modules) for (const l of m.lessons) {
    const route = `/courses/${track.slug}/${m.slug}/${l.slug}`
    for (const q of quizzesIn(l.body)) out.push({ ...q, track: track.slug, lessonTitle: l.title, route, level: l.level ?? m.level })
  }
  cache.set(track.slug, out)
  return out
}

export function poolForLevel(level: Level): PoolQuestion[] {
  return tracks.flatMap((t) => poolForTrack(t).filter((q) => q.level === level))
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export const PAPERS_PER_TRACK = 3
export const PAPER_SIZE = 20
export const PAPER_MINUTES = 25

export function paper(track: Track, n: number): PoolQuestion[] {
  return sample(poolForTrack(track), PAPER_SIZE, hash(`${track.slug}#${n}`))
}

export const PLACEMENT_PER_LEVEL = 5
export function placementPaper(): PoolQuestion[] {
  const levels: Level[] = ['foundations', 'beginner', 'intermediate', 'advanced']
  return levels.flatMap((lv) => sample(poolForLevel(lv), PLACEMENT_PER_LEVEL, hash('placement:' + lv)))
}

// Pick the level to start at from a placement result. A level counts as
// passed at 4 of 5 or better; the recommended level is the first not passed.
export function recommendLevel(perLevel: Record<Level, { score: number; total: number }>): Level {
  const levels: Level[] = ['foundations', 'beginner', 'intermediate', 'advanced']
  for (const lv of levels) {
    const r = perLevel[lv]
    if (!r || r.total === 0) return lv
    if (r.score / r.total < 0.8) return lv
  }
  return 'advanced'
}
