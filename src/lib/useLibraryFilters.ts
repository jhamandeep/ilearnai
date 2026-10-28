import { useSearchParams } from 'react-router-dom'
import { tracks } from '../data/tracks'
import { levelOrder, type Level } from '../data/types'

export function useLibraryFilters(kinds: readonly string[]) {
  const [params, setParams] = useSearchParams()
  const requestedTrack = params.get('track') ?? 'all'
  const requestedLevel = params.get('level') ?? 'all'
  const requestedKind = params.get('kind') ?? 'all'
  const track = tracks.some((item) => item.slug === requestedTrack) ? requestedTrack : 'all'
  const level = levelOrder.includes(requestedLevel as Level) ? requestedLevel as Level : 'all'
  const kind = kinds.includes(requestedKind) ? requestedKind : 'all'
  const q = params.get('q') ?? ''
  const setFilter = (name: 'track' | 'level' | 'kind' | 'q', value: string) => setParams((previous) => {
    const next = new URLSearchParams(previous)
    if (!value || value === 'all') next.delete(name)
    else next.set(name, value)
    return next
  }, { replace: name === 'q', preventScrollReset: true })
  return { track, level, kind, q, setFilter, clearFilters: () => setParams({}, { preventScrollReset: true }), active: track !== 'all' || level !== 'all' || kind !== 'all' || !!q }
}
