import { tracks } from '../data/tracks'
import { levelInfo, levelOrder } from '../data/types'
import type { useLibraryFilters } from '../lib/useLibraryFilters'

export function LibraryFilters({ filters, kinds, count, total, label }: { filters: ReturnType<typeof useLibraryFilters>; kinds: readonly string[]; count: number; total: number; label: string }) {
  return (
    <div className="library-browser">
      <div className="library-levels" aria-label="Browse by level">
        <button type="button" aria-pressed={filters.level === 'all'} onClick={() => filters.setFilter('level', 'all')}>All levels</button>
        {levelOrder.map((level) => <button type="button" key={level} aria-pressed={filters.level === level} onClick={() => filters.setFilter('level', level)}>{levelInfo[level].short} · {levelInfo[level].label}</button>)}
      </div>
      <div className="library-filters">
        <label className="library-search"><span>Search {label}</span><input type="search" className="search" placeholder="Search titles, topics, or descriptions" value={filters.q} onChange={(event) => filters.setFilter('q', event.target.value)} /></label>
        <label><span>Learning track</span><select value={filters.track} onChange={(event) => filters.setFilter('track', event.target.value)}><option value="all">All tracks</option>{tracks.map((track) => <option key={track.slug} value={track.slug}>{track.title}</option>)}</select></label>
        <label><span>Resource type</span><select value={filters.kind} onChange={(event) => filters.setFilter('kind', event.target.value)}><option value="all">All types</option>{kinds.map((kind) => <option key={kind} value={kind}>{kind === 'paper-list' ? 'Reading list' : kind === 'repo' ? 'GitHub & repositories' : kind === 'visualization' ? 'Interactive visualizations' : kind.charAt(0).toUpperCase() + kind.slice(1)}</option>)}</select></label>
      </div>
      <div className="library-results"><span className="meta" role="status">Showing {count} of {total} {label}</span>{filters.active && <button type="button" className="btn btn-ghost btn-sm" onClick={filters.clearFilters}>Clear filters</button>}</div>
    </div>
  )
}
