import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { models, datasets, practicals, paperPortals, type ModelTask, type Access } from '../data/portals'
import { tracks } from '../data/tracks'
import { levelInfo, levelOrder, type Level } from '../data/types'

type Tab = 'models' | 'datasets' | 'practicals' | 'papers'
const tabs: { id: Tab; label: string }[] = [
  { id: 'models', label: 'Models' },
  { id: 'datasets', label: 'Datasets' },
  { id: 'practicals', label: 'Run it' },
  { id: 'papers', label: 'Paper portals' },
]
const modelTasks: ModelTask[] = ['chat', 'reasoning', 'code', 'embedding', 'reranker', 'classic NLP', 'vision', 'speech', 'image generation', 'robotics']

function Lvl({ l }: { l: Level }) { return <span className={`lvl lvl-${l}`}>{levelInfo[l].short}</span> }

export function Hub() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'models'
  const [track, setTrack] = useState(params.get('track') ?? 'all')
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [task, setTask] = useState<ModelTask | 'all'>('all')
  const [access, setAccess] = useState<Access | 'all'>('all')
  const [q, setQ] = useState('')
  const sortedTracks = useMemo(() => [...tracks].sort((a, b) => a.order - b.order), [])
  const lc = q.toLowerCase()

  const ms = models.filter((m) => (track === 'all' || m.tracks.includes(track)) && (level === 'all' || m.level === level) && (task === 'all' || m.task === task) && (access === 'all' || m.access === access) && (m.name + m.org + m.bestFor + m.task).toLowerCase().includes(lc))
  const ds = datasets.filter((d) => (track === 'all' || d.tracks.includes(track)) && (level === 'all' || d.level === level) && (d.name + d.portal + d.task + d.use).toLowerCase().includes(lc))
  const ps = practicals.filter((p) => (track === 'all' || p.tracks.includes(track)) && (level === 'all' || p.level === level) && (p.title + p.portal + p.what).toLowerCase().includes(lc))

  return (
    <>
      <header className="page-head">
        <h1>Hub: models, datasets, notebooks and papers</h1>
        <p className="lede">
          The site teaches; these portals let you do. Pick a model for your project, fetch a data set, run a notebook on Kaggle or Colab for free, and read the paper behind each one on Hugging Face Papers or arXiv.
        </p>
      </header>
      <div className="tabs">
        {tabs.map((t) => <button key={t.id} className={`tab ${tab === t.id ? 'tab-on' : ''}`} onClick={() => setParams({ tab: t.id })}>{t.label}</button>)}
      </div>
      {tab !== 'papers' && (
        <div className="topo-controls">
          <input className="search" style={{ margin: 0 }} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={track} onChange={(e) => setTrack(e.target.value)}><option value="all">All tracks</option>{sortedTracks.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}</select>
          <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')}><option value="all">All levels</option>{levelOrder.map((l) => <option key={l} value={l}>{levelInfo[l].short} {levelInfo[l].label}</option>)}</select>
          {tab === 'models' && <select value={task} onChange={(e) => setTask(e.target.value as ModelTask | 'all')}><option value="all">All tasks</option>{modelTasks.map((t) => <option key={t} value={t}>{t}</option>)}</select>}
          {tab === 'models' && <select value={access} onChange={(e) => setAccess(e.target.value as Access | 'all')}><option value="all">Open and API</option><option value="open weights">Open weights</option><option value="API only">API only</option></select>}
        </div>
      )}

      {tab === 'models' && (
        <>
          <p className="meta">{ms.length} of {models.length} models. Open-weights models have a Hugging Face page you can download from; API models run on the provider's servers.</p>
          {modelTasks.filter((t) => ms.some((m) => m.task === t)).map((t) => (
            <section key={t} className="module">
              <h2 style={{ textTransform: 'capitalize' }}>{t}</h2>
              <div className="prose" style={{ overflowX: 'auto' }}>
                <table>
                  <thead><tr><th>Model</th><th>Access</th><th>Size</th><th>Context</th><th>Licence</th><th>Runs on</th><th>Best for</th><th>Links</th></tr></thead>
                  <tbody>
                    {ms.filter((m) => m.task === t).map((m) => (
                      <tr key={m.name}>
                        <td><strong>{m.name}</strong><br /><span className="meta">{m.org} · <Lvl l={m.level} /></span></td>
                        <td>{m.access}</td>
                        <td>{m.size}</td>
                        <td>{m.context}</td>
                        <td>{m.licence}</td>
                        <td>{m.runOn}</td>
                        <td>{m.bestFor}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <a href={m.url} target="_blank" rel="noreferrer">{m.hf ? 'Hugging Face' : 'Docs'}</a>
                          {m.paper && <><br /><a href={m.paper} target="_blank" rel="noreferrer">Paper</a></>}
                          {m.hf && <><br /><a href={`https://ollama.com/search?q=${encodeURIComponent(m.name.split(' ')[0])}`} target="_blank" rel="noreferrer">Ollama</a></>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </>
      )}

      {tab === 'datasets' && (
        <>
          <p className="meta">{ds.length} of {datasets.length} data sets. Hugging Face data sets load with one line of the datasets library; Kaggle data sets open in a free Kaggle notebook.</p>
          <ul className="res-list">
            {ds.map((d) => (
              <li key={d.url} className="res">
                <a href={d.url} target="_blank" rel="noreferrer"><strong>{d.name}</strong></a>
                <span className="meta"><span className="pill" style={{ marginLeft: 0 }}>{d.portal}</span> <span className="pill">{d.task}</span> <Lvl l={d.level} /> · {d.size} · {d.licence}</span>
                <p>{d.use}</p>
                <span className="meta">Used in: {d.tracks.map((t, i) => { const tr = tracks.find((x) => x.slug === t); return tr ? <span key={t}>{i > 0 ? ', ' : ''}<Link to={`/courses/${t}`}>{tr.title}</Link></span> : null })}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'practicals' && (
        <>
          <p className="meta">{ps.length} of {practicals.length} places to run code for free. Start with Colab or Kaggle; both give you a browser notebook and a GPU without installing anything.</p>
          <ul className="res-list">
            {ps.map((p) => (
              <li key={p.url} className="res">
                <a href={p.url} target="_blank" rel="noreferrer"><strong>{p.title}</strong></a>
                <span className="meta"><span className="pill" style={{ marginLeft: 0 }}>{p.portal}</span> <Lvl l={p.level} /> · about {p.minutes} min</span>
                <p>{p.what}</p>
                <span className="meta">Pairs with: {p.tracks.map((t, i) => { const tr = tracks.find((x) => x.slug === t); return tr ? <span key={t}>{i > 0 ? ', ' : ''}<Link to={`/courses/${t}`}>{tr.title}</Link></span> : null })}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'papers' && (
        <>
          <p className="meta">Every paper on this site has reading notes at <Link to="/papers">Papers</Link>, and each paper page links to its Hugging Face Papers, alphaXiv and Semantic Scholar pages. These portals are where you find the next paper.</p>
          <ul className="res-list">
            {paperPortals.map((p) => (
              <li key={p.url} className="res">
                <a href={p.url} target="_blank" rel="noreferrer"><strong>{p.title}</strong></a>
                <p>{p.what}</p>
              </li>
            ))}
          </ul>
          <section className="module">
            <h2>How to read a paper as a beginner</h2>
            <ol>
              <li>Read the title, abstract and figure 1. Write one sentence on what the paper claims.</li>
              <li>Open the same paper on Hugging Face Papers or alphaXiv and read the discussion for context.</li>
              <li>Find the linked model or data set and run the smallest example that exists.</li>
              <li>Read the introduction and the results table. Skip the method section on the first pass.</li>
              <li>Come back to the method after the lesson on this site that covers it. The research track has a lesson on reading papers.</li>
            </ol>
          </section>
        </>
      )}
    </>
  )
}
