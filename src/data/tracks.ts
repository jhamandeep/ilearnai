import type { Track } from './types'
import { track as AiResearch } from './tracks/ai-research'
import { track as AiEngineering } from './tracks/ai-engineering'
import { track as InferenceEngineering } from './tracks/inference-engineering'
import { track as SystemDesign } from './tracks/system-design'
import { track as MlMath } from './tracks/ml-math'
import { track as OpenRobotics } from './tracks/open-robotics'

export const tracks: Track[] = [AiResearch, AiEngineering, InferenceEngineering, SystemDesign, MlMath, OpenRobotics]

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

export function lessonCount(track: Track) {
  return track.modules.reduce((n, m) => n + m.lessons.length, 0)
}

export function allLessons() {
  return tracks.flatMap((t) =>
    t.modules.flatMap((m) => m.lessons.map((l) => ({ track: t, module: m, lesson: l }))),
  )
}
