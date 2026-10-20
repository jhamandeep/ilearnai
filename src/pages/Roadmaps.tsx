import { useState } from 'react'
import { Link } from 'react-router-dom'
import { roadmaps } from '../data/roadmaps'
import { findTrack } from '../data/tracks'

export function Roadmaps() {
  const [active, setActive] = useState(roadmaps[0]?.track ?? '')
  const rm = roadmaps.find((r) => r.track === active)
  const track = rm ? findTrack(rm.track) : undefined
  const total = rm?.stages.reduce((a, s) => a + s.weeks, 0) ?? 0
  return (
    <>
      <header className="page-head">
        <h1>Roadmaps</h1>
        <p className="lede">A week-by-week route through each track, linking lessons, papers and labs in the order to take them.</p>
      </header>
      <div className="tabs">
        {roadmaps.map((r) => <button key={r.track} className={`tab ${r.track === active ? 'tab-on' : ''}`} onClick={() => setActive(r.track)}>{r.title}</button>)}
      </div>
      {rm && (
        <div key={rm.track} className="roadmap" style={{ ['--card-accent' as string]: track?.accent }}>
          <p className="lede">{rm.summary} <span className="meta">About {total} weeks.</span></p>
          <ol className="stages">
            {rm.stages.map((s, i) => (
              <li key={i} className="stage" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="stage-dot" />
                <div className="stage-body">
                  <span className="meta">Stage {i + 1} · {s.weeks} {s.weeks === 1 ? 'week' : 'weeks'}</span>
                  <h3>{s.title}</h3>
                  <p>{s.goal}</p>
                  <ul className="list">{s.items.map((it) => <li key={it.to}><Link to={it.to}>{it.label}</Link><span className="meta">{it.to.split('/')[1]}</span></li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  )
}
