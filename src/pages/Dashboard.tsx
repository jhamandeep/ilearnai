import { industries, workCaseCount } from '../data/work/industries'
import { Link } from 'react-router-dom'
import { tracks, lessonRoutes } from '../data/tracks'
import { levelInfo } from '../data/types'
import { useAuth } from '../lib/auth'
import { doneCount, isActivityDone, isWorkReviewed, lastLesson, quizScore, useProgressVersion } from '../lib/progress'
import { trackActivities } from '../lib/activities'
import { CourseArtwork } from '../components/CourseArtwork'

export function Dashboard() {
  const { user, preview, syncStatus, retrySync } = useAuth()
  useProgressVersion()
  const courses = tracks.map(track => {
    const activities = trackActivities(track)
    return { track, activities, completed: activities.filter(activity => isActivityDone(activity.route, activity.id)).length }
  })
  const activities = courses.flatMap(course => course.activities)
  const routes = tracks.flatMap(lessonRoutes)
  const done = doneCount(routes)
  const completed = courses.reduce((total, course) => total + course.completed, 0)
  const workReviewed = industries.reduce((total, industry) => total + industry.cases.filter(item => isWorkReviewed(industry.slug, item.slug)).length, 0)
  const nextWork = industries.flatMap(industry => industry.cases.map(item => ({ industry, item }))).find(({ industry, item }) => !isWorkReviewed(industry.slug, item.slug))
  const percent = activities.length ? Math.round(completed / activities.length * 100) : 0
  const recent = lastLesson()
  const next = activities.find(activity => activity.route === recent?.route && !isActivityDone(activity.route, activity.id)) ?? activities.find(activity => !isActivityDone(activity.route, activity.id))
  const continueRoute = next ? `${next.route}/${next.id}` : '/path'
  const completedTracks = courses.filter(course => course.activities.length > 0 && course.completed === course.activities.length).length
  const quizzes = activities.filter(activity => activity.kind === 'quiz' && quizScore(activity.route, activity.quizIndex ?? 0)).length
  return <div className="dashboard-layout"><div className="dashboard-content">
    <header className="dashboard-header"><div><p className="eyebrow">My learning</p><h1>Welcome back, {user?.name.split(' ')[0] ?? 'learner'}.</h1><p>Keep building your AI skills, one activity at a time.</p></div><div className={`sync-status sync-${syncStatus}`} role="status">{syncStatus === 'saved' ? preview && !user ? 'Progress saved in this browser' : 'Progress saved to your account' : syncStatus === 'saving' ? 'Saving progress…' : <><span>{preview && !user ? 'Progress kept for this visit; browser storage unavailable' : 'Progress waiting to sync'}</span><button type="button" onClick={() => { void retrySync().catch(() => {}) }}>Retry</button></>}</div></header>
    <section className="work-dashboard-card"><div><p className="eyebrow">Apply AI in your field</p><h2>AI for your work</h2><p>Industry use cases and practical guidance for your role.</p><progress value={workReviewed} max={workCaseCount} aria-label="Work guides reviewed" /><span>{workReviewed} of {workCaseCount} guides reviewed</span></div><div><Link className="btn btn-primary" to="/for-work">Choose your field →</Link>{workReviewed > 0 && nextWork && <Link className="text-cta" to={`/for-work/${nextWork.industry.slug}/${nextWork.item.slug}`}>Next guide: {nextWork.item.title} →</Link>}</div></section>
    <section className="dashboard-overview"><div className="dashboard-progress"><div className="dashboard-progress-heading"><span>Your learning journey</span><strong>{percent}%</strong></div><div className="progress" role="progressbar" aria-label="Overall learning progress" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={activities.length}><span style={{ width: `${percent}%` }} /></div><p>{completed} of {activities.length} activities · {done} of {routes.length} lessons completed</p></div><div className="dashboard-stat"><strong>{completedTracks}</strong><span>Courses completed</span></div><div className="dashboard-stat"><strong>{quizzes}</strong><span>Quizzes attempted</span></div></section>
    <section className="continue-learning"><div><p className="eyebrow">Your next step</p><h2>{next?.lesson.title ?? 'Explore your learning path'}</h2><p>{next ? `${next.title}. ${completed || recent ? 'Pick up where you left off.' : 'Start from the foundations and build from there.'}` : 'All activities are complete. Revisit a course or try another lab.'}</p><Link className="btn btn-primary" to={continueRoute}>{completed || recent ? 'Continue learning' : 'Start learning'} →</Link></div><img src="/images/ai-systems.jpg" alt="Connected glass modules representing AI systems" width={1672} height={941} /></section>
    <section className="dashboard-tracks"><div className="section-head"><h2>Your courses</h2><Link to="/path">View the full path ↗</Link></div><div className="dashboard-course-grid">{courses.map(({ track, activities: list, completed: complete }) => { const progress = list.length ? complete / list.length * 100 : 0; return <Link className="dashboard-course" key={track.slug} to={`/courses/${track.slug}`}><CourseArtwork seed={track.order} /><div><span className="meta">{levelInfo[track.level].label} · {track.modules.length} modules</span><h3>{track.title}</h3><div className="progress" role="progressbar" aria-label={`${track.title} progress`} aria-valuenow={complete} aria-valuemin={0} aria-valuemax={list.length}><span style={{ width: `${progress}%` }} /></div><span className="meta">{complete}/{list.length} activities · {progress === 100 ? 'Completed' : complete ? 'In progress' : 'Ready to start'}</span></div></Link> })}</div></section>
  </div></div>
}
