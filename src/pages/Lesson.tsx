import { lazy, Suspense, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findLesson, lessonRoutes } from '../data/tracks'
import { levelInfo } from '../data/types'
import { Markdown } from '../components/Markdown'
import { LessonContext, makeLessonCtx } from '../components/LessonContext'
import { isDone, isActivityDone, setActivityDone, useProgressVersion, recordLessonVisit, doneCount, quizScore } from '../lib/progress'
import { lessonActivities, activityLabels, activitySymbols } from '../lib/activities'
import { NotFound } from './NotFound'
import { useAuth } from '../lib/auth'
import { LearningResources } from '../components/LearningResources'
import { AnimationContext, LessonTerms, LessonPreview } from '../components/LessonGuidance'
import { pythonForChapter } from '../data/pythonExercises'
import { StudyTools } from '../components/StudyTools'
import { ChapterVideos } from '../components/ChapterVideos'
const LabContent = lazy(() => import('./Labs').then(module => ({ default: module.LabContent })))

export function LessonPage() {
  const { track: t, module: m, lesson: l, activity: activityId } = useParams()
  const found = t && m && l ? findLesson(t, m, l) : undefined
  const { user, preview, syncStatus } = useAuth()
  useProgressVersion()
  const route = `/courses/${t}/${m}/${l}`
  const activities = found ? lessonActivities(found.lesson, route) : []
  const active = activities.find(activity => activity.id === activityId)
  const quizIndex = active?.quizIndex
  const ctx = useMemo(() => ({ ...makeLessonCtx(route), quizIndex }), [route, quizIndex])
  const lessonTitle = found?.lesson.title
  useEffect(() => { if ((user || preview) && lessonTitle) recordLessonVisit(route, lessonTitle) }, [user, preview, route, lessonTitle])
  if (!found || (activityId && !active)) return <NotFound />
  const { track, module, lesson } = found
  const completed = activities.filter(activity => isActivityDone(route, activity.id)).length
  const index = active ? activities.indexOf(active) : -1
  const firstIncomplete = activities.find(activity => !isActivityDone(route, activity.id)) ?? activities[0]
  const allLessons = track.modules.flatMap(item => item.lessons.map(entry => ({ module: item, lesson: entry })))
  const lessonIndex = allLessons.findIndex(item => item.lesson === lesson)
  const nextLesson = allLessons[lessonIndex + 1]
  const nextRoute = activities[index + 1] ? `${route}/${activities[index + 1].id}` : nextLesson ? `/courses/${track.slug}/${nextLesson.module.slug}/${nextLesson.lesson.slug}` : `/courses/${track.slug}`
  const currentDone = active ? isActivityDone(route, active.id) : false
  const quizSubmitted = active?.kind !== 'quiz' || !!quizScore(route, active.quizIndex ?? 0)
  return <div className="activity-workspace">
    <nav className="activity-breadcrumb crumbs"><Link to="/courses">Catalogue</Link><span>/</span><Link to={`/courses/${track.slug}`}>{track.title}</Link><span>/</span><Link to={route}>{lesson.title}</Link></nav>
    <a className="study-space-jump" href="#lesson-study-tools">Open your study space <span>Resources, papers, videos & notes ↓</span></a>
    <details className="study-outline-drawer"><summary>Chapter contents · {module.title}</summary><nav aria-label="Chapter lessons">{module.lessons.map(item => <Link key={item.slug} to={`/courses/${track.slug}/${module.slug}/${item.slug}`} aria-current={item.slug === lesson.slug ? 'page' : undefined}>{item.title}</Link>)}</nav></details>
    <div className="study-lesson-progress"><span>{completed}/{activities.length} activities complete</span><progress value={completed} max={activities.length} aria-label="Lesson activity progress" /></div>
    <div className="activity-workspace-grid study-workspace-grid">
      <aside className="activity-outline"><Link className="activity-course-back" to={`/courses/${track.slug}`}>← Course overview</Link><h2>{module.title}</h2><div className="activity-outline-progress"><span>{completed}/{activities.length} activities complete</span><progress value={completed} max={activities.length} aria-label="Lesson activity progress" /></div><nav aria-label="Lesson activities"><Link className={!active ? 'current' : ''} to={route} aria-current={!active ? 'page' : undefined}><span aria-hidden="true">▤</span><span>Lesson overview</span></Link>{activities.map(activity => <Link to={`${route}/${activity.id}`} key={activity.id} className={activity.id === active?.id ? 'current' : ''} aria-current={activity.id === active?.id ? 'page' : undefined}><span className={`activity-outline-icon ${isActivityDone(route, activity.id) ? 'is-complete' : ''}`} aria-hidden="true">{isActivityDone(route, activity.id) ? '✓' : activitySymbols[activity.kind]}</span><span><small>{activityLabels[activity.kind]}</small>{activity.title}</span></Link>)}</nav><details className="other-lessons"><summary>Other lessons in this module</summary>{module.lessons.filter(item => item.slug !== lesson.slug).map(item => { const path = `/courses/${track.slug}/${module.slug}/${item.slug}`; return <Link key={path} to={path}>{isDone(path) ? '✓ ' : ''}{item.title}</Link> })}</details><div className="activity-course-total"><span>Course progress</span><progress aria-label="Completed lessons in course" value={doneCount(lessonRoutes(track))} max={lessonRoutes(track).length} /><small>{doneCount(lessonRoutes(track))}/{lessonRoutes(track).length} lessons</small></div><Link className="activity-help" to={`/ask?q=${encodeURIComponent(lesson.title)}`}>Ask about this topic ↗</Link></aside>
      <div className="study-reading-column"><nav className="study-activity-tabs" aria-label="Study formats"><Link to={route} aria-current={!active ? 'page' : undefined}>Overview</Link>{activities.map(item => <Link key={item.id} to={`${route}/${item.id}`} data-kind={item.kind} aria-current={active?.id === item.id ? 'page' : undefined}><span aria-hidden="true">{activitySymbols[item.kind]}</span>{item.kind === 'quiz' && activities.filter(a => a.kind === 'quiz').length > 1 ? item.title : activityLabels[item.kind]}</Link>)}</nav><article className="activity-main" data-activity-kind={active?.kind ?? 'overview'} key={`${route}/${active?.id ?? 'overview'}`}>
        <header className="activity-heading"><div className="activity-heading-meta"><span>{active ? activityLabels[active.kind] : 'Lesson overview'}</span><span>{levelInfo[lesson.level ?? module.level].label}</span><span>{lesson.minutes} min lesson</span></div><h1>{active ? active.kind === 'reading' ? lesson.title : active.title : lesson.title}</h1>{(!active || active.kind === 'reading') && <p className="lede">{lesson.summary}</p>}{active && <div className="activity-position"><span>Activity {index + 1} of {activities.length}</span><Link to={index > 0 ? `${route}/${activities[index - 1].id}` : route}>← Previous</Link><Link to={nextRoute}>Next →</Link></div>}</header>
        {(!active || active.kind === 'exercise') && pythonForChapter(track.slug, module.slug).length > 0 && <section className="lesson-python-links"><p className="eyebrow">Make the idea work</p><h2>Practice this chapter in Python</h2><p>Open a guided exercise with an editor, output, hints, and checks.</p><div className="resource-shortcuts">{pythonForChapter(track.slug, module.slug).map(item => <Link key={item.id} to={`/code?exercise=${item.id}`}>{item.title} →</Link>)}</div></section>}
        {active?.kind === 'animation'  && <AnimationContext lesson={lesson} route={route} />}
        {(!active || active.kind === 'reading') && <LessonTerms lesson={lesson} />}
        {!active && <LessonPreview lesson={lesson} route={route} />}
        {(!active || active.kind === 'video' || active.kind === 'resources') && <ChapterVideos key={`${track.slug}/${module.slug}/${active?.id ?? 'overview'}`} track={track.slug} module={module.slug} compact={!active} />}
        {!active ? <><section className="lesson-overview-objectives"><h2>What you’ll learn</h2><ul>{lesson.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul></section>{lesson.before?.length ? <div className="before">Recommended first: {lesson.before.map(item => <Link key={item.to} to={item.to}>{item.label}</Link>)}</div> : null}<div className="lesson-overview-start"><Link className="btn btn-primary" to={`${route}/${firstIncomplete.id}`}>{completed === activities.length ? 'Review lesson' : completed ? 'Resume lesson' : 'Start lesson'} →</Link><span>{completed}/{activities.length} complete</span></div><h2>Your activities</h2><div className="activity-card-grid lesson-activity-cards">{activities.map(activity => <Link className="activity-card" data-kind={activity.kind} to={`${route}/${activity.id}`} key={activity.id}><span className={`activity-icon kind-${activity.kind}`} aria-hidden="true">{activitySymbols[activity.kind]}</span><span><small>{activityLabels[activity.kind]}</small><strong>{activity.title}</strong></span><span className="activity-card-status">{isActivityDone(route, activity.id) ? '✓' : '→'}</span></Link>)}</div></> : <>
          <div className={`activity-content activity-content-${active.kind}`}><LessonContext.Provider value={ctx}>{active.kind === 'resources' ? <LearningResources track={track.slug} links={lesson.links} /> : active.kind === 'lab' ? <Suspense fallback={<p role="status">Opening the lab…</p>}><LabContent slug={active.labSlug!} /></Suspense> : <Markdown>{active.body}</Markdown>}</LessonContext.Provider></div>
          <div className="activity-completion"><div><strong>{currentDone ? '✓ Activity completed' : active.kind === 'quiz' && !quizSubmitted ? 'Check your answers to finish this activity' : 'Ready for the next step?'}</strong><span role="status">{syncStatus === 'saved' ? preview && !user ? 'Progress saved in this browser' : 'Progress saved to your account' : syncStatus === 'saving' ? 'Saving progress…' : preview && !user ? 'Progress kept for this visit. Browser storage is unavailable.' : 'Progress waiting to sync. Retry from your dashboard.'}</span></div><button type="button" className={`btn ${currentDone ? 'btn-ghost' : 'btn-primary'}`} disabled={!currentDone && !quizSubmitted} onClick={() => setActivityDone(route, active.id, !currentDone, activities.map(activity => activity.id))}>{currentDone ? 'Mark incomplete' : 'Mark complete'}</button><Link className="btn btn-ghost" to={nextRoute}>{index === activities.length - 1 ? nextLesson ? 'Next lesson' : 'Course overview' : 'Continue'} →</Link></div>
        </>}
      </article></div><StudyTools key={`${route}/${user?.id ?? 'guest'}`} lesson={lesson} route={route} />
    </div>
  </div>
}
