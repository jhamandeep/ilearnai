import type { Track } from './types'
import { track as StartHere } from './tracks/start-here'
import { track as MathFromZero } from './tracks/math-from-zero'
import { track as AiFoundations } from './tracks/ai-foundations'
import { track as BuildAiEcosystem } from './tracks/build-ai-ecosystem'
import { track as MlMath } from './tracks/ml-math'
import { track as AiEngineering } from './tracks/ai-engineering'
import { track as SystemDesign } from './tracks/system-design'
import { track as InferenceEngineering } from './tracks/inference-engineering'
import { track as AiResearch } from './tracks/ai-research'
import { track as OpenRobotics } from './tracks/open-robotics'

// Ordered along the zero-to-ecosystem path (Track.order).
export const tracks: Track[] = [
  StartHere,
  MathFromZero,
  AiFoundations,
  BuildAiEcosystem,
  MlMath,
  AiEngineering,
  SystemDesign,
  InferenceEngineering,
  AiResearch,
  OpenRobotics,
].sort((a, b) => a.order - b.order)

export function findTrack(slug: string) {
  return tracks.find((t) => t.slug === slug)
}

export function findLesson(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const track = findTrack(trackSlug)
  const module = track?.modules.find((m) => m.slug === moduleSlug)
  const lesson = module?.lessons.find((l) => l.slug === lessonSlug)
  if (!track || !module || !lesson) return undefined
  return { track, module, lesson }
}

export function lessonRoutes(track: Track) {
  return track.modules.flatMap((m) => m.lessons.map((l) => `/courses/${track.slug}/${m.slug}/${l.slug}`))
}

export function lessonCount(track: Track) {
  return track.modules.reduce((n, m) => n + m.lessons.length, 0)
}

export function allLessons() {
  return tracks.flatMap((t) =>
    t.modules.flatMap((m) => m.lessons.map((l) => ({ track: t, module: m, lesson: l }))),
  )
}
