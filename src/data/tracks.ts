import type { Track } from './types'
import catalog from './tracks-catalog.json'

// Preserve loaded bodies across development updates. The public catalogue contains
// empty bodies and must never replace an active learner's in-memory curriculum.
let publicCatalog = catalog as Track[]
export const tracks: Track[] = import.meta.hot?.data.tracks ?? structuredClone(publicCatalog)

if (import.meta.hot) {
  import.meta.hot.dispose(data => { data.tracks = tracks })
  import.meta.hot.accept('./tracks-catalog.json', next => {
    if (!next) return
    publicCatalog = next.default as Track[]
    window.dispatchEvent(new Event('ilearnai:curriculum-changed'))
  })
}

export function replaceTracks(next: Track[]) { tracks.splice(0, tracks.length, ...next) }
export function resetTracks() { replaceTracks(structuredClone(publicCatalog)) }

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
