import { tracks } from '../data/tracks'
import { levelOrder, type Level } from '../data/types'

export interface LibraryItem { level: Level; track: string; topic: string }

// Keep the full catalogue: each entry belongs to one level, track, and topic.
export function groupLibrary<T extends LibraryItem>(items: T[]) {
  return levelOrder.map((level) => ({
    level,
    count: items.filter((item) => item.level === level).length,
    tracks: tracks.map((track) => {
      const inTrack = items.filter((item) => item.level === level && item.track === track.slug)
      return {
        track,
        count: inTrack.length,
        topics: [...new Set(inTrack.map((item) => item.topic))].sort((a, b) => a.localeCompare(b)).map((topic) => ({ topic, items: inTrack.filter((item) => item.topic === topic) })),
      }
    }).filter((group) => group.count > 0),
  })).filter((group) => group.count > 0)
}
