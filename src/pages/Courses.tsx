import { ChapterVideos } from '../components/ChapterVideos'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { tracks, findTrack, lessonCount } from '../data/tracks'
import { labs } from '../data/labs'
import { levelInfo, levelOrder, type Track } from '../data/types'
import { isActivityDone, useProgressVersion } from '../lib/progress'
import { lessonActivities, trackActivities, activityLabels, activitySymbols } from '../lib/activities'
import { NotFound } from './NotFound'
import { CourseArtwork } from '../components/CourseArtwork'
import { useAuth } from '../lib/auth'
import { LearningResources } from '../components/LearningResources'

export function courseMinutes(track: Track) { return track.modules.flatMap(module => module.lessons).reduce((sum, lesson) => sum + lesson.minutes, 0) }
export function formatDuration(minutes: number) { return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}` }

export function TrackCard({ t }: { t: Track }) {
  const activities = trackActivities(t)
  const done = activities.filter(activity => isActivityDone(activity.route, activity.id)).length
  return <Link to={`/courses/${t.slug}`} className="card track-card" data-catalogue-kind="course" data-catalogue-level={t.level}>
    <CourseArtwork seed={t.order} />
    <span className="card-type">Course <span>↗</span></span>
    <h3>{t.title}{t.status === 'preview' && <span className="pill">Preview</span>}</h3>
    <p>{t.tagline}</p>
    <span className="catalogue-card-meta">{levelInfo[t.level].label} <span>·</span> {formatDuration(courseMinutes(t))}</span>
    <span className="meta">{t.modules.length} modules · {lessonCount(t)} lessons</span>
    {done > 0 && <div className="progress-row"><div className="progress" role="progressbar" aria-label={`${t.title} activity progress`} aria-valuenow={done} aria-valuemin={0} aria-valuemax={activities.length}><span style={{ width: `${100 * done / activities.length}%` }} /></div>{done}/{activities.length}</div>}
    <span className="journey-action">{done ? 'Continue learning' : 'Explore course'} <span aria-hidden="true">→</span></span>
  </Link>
}

export function Courses() {
  useProgressVersion()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const level = levelOrder.includes(params.get('level') as typeof levelOrder[number]) ? params.get('level')! : 'all'
  const format = ['course', 'lab'].includes(params.get('format') ?? '') ? params.get('format')! : 'all'
  const duration = ['short', 'long'].includes(params.get('duration') ?? '') ? params.get('duration')! : 'all'
  const sort = ['title', 'duration'].includes(params.get('sort') ?? '') ? params.get('sort')! : 'recommended'
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const matches = (text: string) => words.every(word => text.toLowerCase().includes(word))
  const visible = tracks.filter(track => format !== 'lab' && (level === 'all' || track.level === level) && (duration === 'all' || (duration === 'short' ? courseMinutes(track) < 300 : courseMinutes(track) >= 300)) && matches([track.title, track.tagline, track.description, ...track.modules.flatMap(module => module.lessons.map(lesson => `${lesson.title} ${lesson.summary}`))].join(' '))).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'duration' ? courseMinutes(a) - courseMinutes(b) : a.order - b.order)
  const visibleLabs = labs.filter(lab => format !== 'course' && level === 'all' && duration === 'all' && matches(`${lab.title} ${lab.blurb} ${lab.category}`))
  const filtered = query || level !== 'all' || format !== 'all' || duration !== 'all'
  function update(key: string, value: string) { setParams(previous => { const next = new URLSearchParams(previous); if (!value || value === 'all' || value === 'recommended') next.delete(key); else next.set(key, value); return next }, { replace: true }) }
  return <>
    <div className="work-route-banner"><div><strong>Start with the work you do.</strong><span>Visual walkthroughs, decision questions, and practical guides for your industry and role.</span></div><Link to="/for-work">AI for your work →</Link></div>
    <header className="catalogue-intro"><div><p className="eyebrow">The learning catalogue</p><h1>Explore training<br />your way.</h1><p>Find your first course, go deeper into a topic, or put an idea to work in a hands-on lab. Learn at your own pace.</p></div><div className="catalogue-intro-art"><CourseArtwork seed={7} /></div></header>
    <div className="resource-shortcuts"><Link to="/code">Write and run Python →</Link><Link to="/resources?collection=open-source">Open-source tools ↗</Link><Link to="/resources?kind=visualization">Learn with visualizations ↗</Link></div><div className="catalogue-search"><label className="sr-only" htmlFor="catalogue-query">Search catalogue</label><span aria-hidden="true">⌕</span><input id="catalogue-query" type="search" value={query} placeholder="Search topics, courses, or lessons" onChange={event => update('q', event.target.value)} />{query && <button type="button" aria-label="Clear search" onClick={() => update('q', '')}>×</button>}</div>
    <div className="catalogue-filters" aria-label="Filter catalogue">
      <label>Format<select value={format} onChange={event => update('format', event.target.value)}><option value="all">All learning</option><option value="course">Courses</option><option value="lab">Labs</option></select></label>
      <label>Level<select value={level} onChange={event => update('level', event.target.value)}><option value="all">All levels</option>{levelOrder.map(item => <option key={item} value={item}>{levelInfo[item].label}</option>)}</select></label>
      <label>Course duration<select value={duration} onChange={event => update('duration', event.target.value)}><option value="all">Any duration</option><option value="short">Under 5 hours</option><option value="long">5 hours or more</option></select></label>
      <label>Sort by<select value={sort} onChange={event => update('sort', event.target.value)}><option value="recommended">Learning order</option><option value="title">Course title</option><option value="duration">Shortest course</option></select></label>
      {filtered && <button className="catalogue-clear" type="button" onClick={() => setParams({})}>Clear filters</button>}
    </div>
    <div className="catalogue-results-heading"><p role="status">{visible.length + visibleLabs.length} results{query ? ` for “${query}”` : ''}</p><Link to="/ask">Help me choose ↗</Link></div>
    {!visible.length && !visibleLabs.length && <section className="catalogue-empty"><h2>No matches yet.</h2><p>Try a broader topic or clear a filter. Labs are self-paced and do not use course-level or duration filters.</p><button className="btn btn-primary" onClick={() => setParams({})}>Show all learning</button></section>}
    <div className="skills-catalogue-grid">{visible.map(track => <TrackCard key={track.slug} t={track} />)}{visibleLabs.map((lab) => <Link className="card track-card catalogue-lab" key={lab.slug} to={`/labs/${lab.slug}`} data-catalogue-kind="lab"><CourseArtwork topic={lab.category === 'math' ? 'optimization' : lab.category === 'agents' ? 'ai-agents' : lab.category === 'inference' ? 'inference' : lab.category === 'writing' ? 'research' : 'ai-systems'} /><span className="card-type">Interactive lab <span>◇</span></span><h3>{lab.title}</h3><p>{lab.blurb}</p><span className="catalogue-card-meta">{lab.category} · Self-paced</span><span className="journey-action">Open lab →</span></Link>)}</div>
  </>
}

export function TrackPage() {
  const { user, preview } = useAuth()
  const canLearn = !!user || preview
  const { track: slug } = useParams()
  const track = slug ? findTrack(slug) : undefined
  useProgressVersion()
  if (!track) return <NotFound />
  const activities = trackActivities(track)
  const complete = activities.filter(activity => isActivityDone(activity.route, activity.id)).length
  const next = activities.find(activity => !isActivityDone(activity.route, activity.id))
  const destination = next ? `${next.route}/${next.id}` : '/dashboard'
  const prerequisites = track.prerequisites.map(findTrack).filter(Boolean) as Track[]
  return <>
    <nav className="crumbs"><Link to="/courses">Catalogue</Link><span aria-hidden="true"> / </span>{track.title}</nav>
    <header className="skills-course-hero"><div className="skills-course-top"><div><span className="skills-type-chip">▤ Course</span><h1>{track.title}</h1><div className="skills-course-facts"><span>◷ {formatDuration(courseMinutes(track))}</span><span>{levelInfo[track.level].label}</span><span>{track.modules.length} modules</span></div></div><CourseArtwork seed={track.order} /></div><div className="skills-course-start"><Link className="btn" to={canLearn ? destination : `/signup?next=${encodeURIComponent(destination)}`}>{canLearn ? complete === activities.length ? 'View my learning' : complete ? 'Resume course' : 'Start learning' : 'Sign in or join'} <span aria-hidden="true">→</span></Link><div className="skills-course-progress"><div><span>{complete === activities.length ? 'Course complete' : 'Your course progress'}</span><strong>{Math.round(100 * complete / activities.length)}%</strong></div><div className="progress" role="progressbar" aria-label="Course activity progress" aria-valuenow={complete} aria-valuemin={0} aria-valuemax={activities.length}><span style={{ width: `${100 * complete / activities.length}%` }} /></div><p>{complete} of {activities.length} activities completed</p></div></div></header>
    <nav className="course-section-nav" aria-label="Course sections"><a href="#course-overview">Overview</a><a href="#course-activities">Activities</a><Link to={`/videos?track=${track.slug}`}>Videos</Link><Link to={`/resources?track=${track.slug}`}>Resources</Link></nav>
    <section id="course-overview" className="skills-course-about"><h2>About this course</h2><p>{track.description}</p><div className="course-outcomes"><div><h3>Who this is for</h3><p>{track.audience}</p></div><div><h3>What you’ll build</h3><p>{track.outcome}</p></div></div>{prerequisites.length > 0 && <p className="meta">Recommended first: {prerequisites.map((item, i) => <span key={item.slug}>{i > 0 ? ', ' : ''}<Link to={`/courses/${item.slug}`}>{item.title}</Link></span>)}</p>}</section>
    <section id="course-activities"><div className="skills-section-title"><div><h2>Course activities</h2><p>{lessonCount(track)} lessons. Read, watch, explore, and put your understanding into practice.</p></div><Link to={`/practice#${track.slug}`}>Practice papers ↗</Link></div>{track.modules.map((module, i) => <details className="skills-module" key={module.slug} id={module.slug} open={i === 0}><summary><span className="module-step">{String(i + 1).padStart(2, '0')}</span><span><strong>{module.title}</strong><small>{module.lessons.length} lessons · {levelInfo[module.level].label}</small></span><span className="module-chevron" aria-hidden="true">⌄</span></summary><div className="skills-module-content"><p>{module.description}</p><ChapterVideos track={track.slug} module={module.slug} compact />{module.lessons.map(lesson => { const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`; const list = lessonActivities(lesson, route); const done = list.filter(activity => isActivityDone(route, activity.id)).length; return <details className="skills-lesson-group" key={lesson.slug}><summary><span className={`lesson-state ${done === list.length ? 'is-complete' : ''}`} aria-hidden="true">{done === list.length ? '✓' : '▷'}</span><span><strong>{lesson.title}</strong><small>{lesson.minutes} min · {list.length} activities{done ? ` · ${done} complete` : ''}</small></span><span aria-hidden="true">+</span></summary><div className="activity-card-grid">{list.map(activity => <Link className="activity-card" key={activity.id} to={`${route}/${activity.id}`}><span className={`activity-icon kind-${activity.kind}`} aria-hidden="true">{activitySymbols[activity.kind]}</span><span><small>{activityLabels[activity.kind]}</small><strong>{activity.title}</strong></span><span className="activity-card-status" aria-label={isActivityDone(route, activity.id) ? 'Completed' : 'Open activity'}>{isActivityDone(route, activity.id) ? '✓' : '→'}</span></Link>)}</div></details> })}</div></details>)}</section>
    <div className="course-completion-note"><span aria-hidden="true">✧</span><div><h3>{complete === activities.length ? 'You completed this course.' : 'Build your skills, one activity at a time.'}</h3><p>Complete the activities to finish each lesson. {user ? 'Your progress follows your account.' : 'Your progress saves in this browser.'}</p></div><Link to="/dashboard">My learning →</Link></div>
    {canLearn && <LearningResources track={track.slug} />}
  </>
}
