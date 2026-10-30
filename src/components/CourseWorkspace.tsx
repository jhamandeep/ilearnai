import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Track, LessonLink } from '../data/types'
import { lessonActivities } from '../lib/activities'
import { isActivityDone } from '../lib/progress'
import { parseExercise } from '../lib/exercise'
import { lessonPythonExercises, lessonPythonUrl } from '../lib/lessonPython'
import { pythonForChapter } from '../data/pythonExercises'
import { ChapterVideos, ChapterVideoGroup } from './ChapterVideos'
import { LearningResources } from './LearningResources'
import { ChapterJourney } from './ChapterJourney'
import { LearningMotionGlyph } from './LearningMotionGlyph'

const views = [['lessons', 'Lessons'], ['videos', 'Video series'], ['practice', 'Practice'], ['resources', 'Resources']] as const

export function CourseWorkspace({ track }: { track: Track }) {
  const [params, setParams] = useSearchParams()
  const view = views.some(([key]) => key === params.get('view')) ? params.get('view')! : 'lessons'
  const chapter = track.modules.some(module => module.slug === params.get('chapter')) ? params.get('chapter')! : 'all'
  const content = useRef<HTMLDivElement>(null)
  const previousSelection = useRef(`${track.slug}/${chapter}/${view}`)
  useEffect(() => {
    const next = `${track.slug}/${chapter}/${view}`
    if (previousSelection.current !== next) content.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    previousSelection.current = next
  }, [track.slug, chapter, view])
  const modules = chapter === 'all' ? track.modules : track.modules.filter(module => module.slug === chapter)
  const entries = modules.flatMap(module => module.lessons.map(lesson => {
    const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`
    return { module, lesson, route, activities: lessonActivities(lesson, route), python: lessonPythonExercises(lesson, route) }
  }))
  const sources = new Map<string, LessonLink>()
  entries.forEach(({ lesson }) => lesson.links.forEach(link => { if (!sources.has(link.url)) sources.set(link.url, link) }))
  function select(key: string, value: string) {
    setParams(previous => { const next = new URLSearchParams(previous); if (value === 'all' || value === 'lessons') next.delete(key); else next.set(key, value); return next })
  }
  return <section className="course-workspace" id="course-activities" aria-label={`${track.title} study workspace`}>
    <header className="course-workspace-heading"><div><p className="eyebrow">Your whole course, in one place</p><h2>Choose what to learn next.</h2><p>{track.modules.length} chapters · {track.modules.reduce((sum, module) => sum + module.lessons.length, 0)} lessons. Every chapter has readings, visual explanations, practice, and questions.</p></div><Link className="text-cta" to={`/practice#${track.slug}`}>Practice papers ↗</Link></header>
    <div className="course-workspace-layout">
      <nav className="course-chapter-nav" aria-label="Course chapters"><h3>Course contents</h3><button type="button" aria-pressed={chapter === 'all'} onClick={() => select('chapter', 'all')}><span>All chapters</span><small>{track.modules.length} chapters</small></button>{track.modules.map((module, index) => {
        const items = module.lessons.flatMap(lesson => { const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`; return lessonActivities(lesson, route).map(activity => ({ ...activity, route })) })
        const done = items.filter(activity => isActivityDone(activity.route, activity.id)).length
        return <button type="button" key={module.slug} aria-pressed={chapter === module.slug} onClick={() => select('chapter', module.slug)}><span><b>{String(index + 1).padStart(2, '0')}</b>{module.title}</span><small>{module.lessons.length} lessons · {Math.round(100 * done / items.length)}%</small><progress value={done} max={items.length} aria-label={`${module.title} activity progress`} /></button>
      })}</nav>
      <div className="course-workspace-content" ref={content}><nav className="course-format-nav" aria-label="Course formats">{views.map(([key, label]) => <button type="button" key={key} data-kind={key} aria-pressed={view === key} onClick={() => select('view', key)}><LearningMotionGlyph variant={key} className="course-tab-glyph" />{label}</button>)}</nav>
        <p className="course-workspace-status" role="status">{chapter === 'all' ? 'Showing every chapter' : modules[0].title} · {entries.length} lessons</p>
        <ChapterJourney key={`${track.slug}/${chapter}/${view}`} track={track} module={chapter === 'all' ? undefined : modules[0]} mode={view} />
        {view === 'lessons' && modules.map(module => <section className="course-chapter-section" key={module.slug} id={module.slug} data-course-chapter={module.slug}><header><span className="eyebrow">Chapter {track.modules.indexOf(module) + 1}</span><h3>{module.title}</h3><p>{module.description}</p></header><div className="course-lesson-list">{entries.filter(entry => entry.module === module).map(({ lesson, route, activities, python }, index) => {
          const done = activities.filter(activity => isActivityDone(route, activity.id)).length
          const next = activities.find(activity => !isActivityDone(route, activity.id)) ?? activities[0]
          const animation = activities.find(activity => activity.kind === 'animation')
          const quiz = activities.find(activity => activity.kind === 'quiz')
          return <article className="course-lesson-card" data-course-lesson={lesson.slug} key={route}><div className="course-lesson-number" aria-hidden="true">{done === activities.length ? '✓' : String(index + 1).padStart(2, '0')}</div><div><div className="course-lesson-meta"><span>{lesson.minutes} min</span><span>{done}/{activities.length} activities complete</span></div><h4><Link to={`${route}/${next.id}`}>{lesson.title}</Link></h4><p>{lesson.summary}</p><div className="course-lesson-actions"><Link data-course-action="read" to={`${route}/reading`}>Read lesson →</Link>{animation && <Link data-course-action="animation" to={`${route}/${animation.id}`}>See the animation</Link>}{quiz && <Link data-course-action="quiz" to={`${route}/${quiz.id}`}>Check understanding</Link>}{python[0] && <Link data-course-action="python" to={lessonPythonUrl(python[0])}>Try in Python</Link>}</div><progress value={done} max={activities.length} aria-label={`${lesson.title} activity progress`} /></div></article>
        })}</div></section>)}
        {view === 'videos' && <ChapterVideoGroup key={chapter}>{modules.map(module => <section className="course-chapter-section" key={module.slug} data-course-chapter={module.slug}><header><span className="eyebrow">Chapter {track.modules.indexOf(module) + 1}</span><h3>{module.title}</h3><p>{module.description}</p></header><ChapterVideos track={track.slug} module={module.slug} /></section>)}</ChapterVideoGroup>}
        {view === 'practice' && modules.map(module => <section className="course-chapter-section" key={module.slug} data-course-chapter={module.slug}><header><span className="eyebrow">Chapter {track.modules.indexOf(module) + 1}</span><h3>{module.title}</h3><p>Choose a lesson task. Use its hint, compare your solution, then check your understanding.</p></header>{pythonForChapter(track.slug, module.slug).length > 0 && <div className="course-python-picks"><h4>Guided Python with checks</h4>{pythonForChapter(track.slug, module.slug).map(exercise => <Link key={exercise.id} to={lessonPythonUrl(exercise)}>{exercise.title} →</Link>)}</div>}<div className="course-practice-list">{entries.filter(entry => entry.module === module).map(({ lesson, route, activities, python }) => <article key={route} data-course-practice={lesson.slug}><span className="eyebrow">{lesson.title}</span>{activities.filter(activity => activity.kind === 'exercise').map(activity => {
          const task = parseExercise(activity.body.replace(/^:::exercise\s*\n/, '').replace(/\n:::\s*$/, ''))
          const runnable = python.find(item => item.activityId === activity.id)
          return <div className="course-practice-task" key={activity.id}><h4>{activity.title}</h4><p>{task.task || lesson.summary}</p><div className="course-lesson-actions"><Link to={`${route}/${activity.id}`}>Open task and hint →</Link>{runnable && <Link data-course-action="python" to={lessonPythonUrl(runnable)}>Write and run Python →</Link>}</div>{task.lang === 'python' && !runnable && <small>Use the lesson’s setup and instructions for this task.</small>}</div>
        })}<Link className="course-check-link" to={`${route}/${activities.find(activity => activity.kind === 'quiz')?.id ?? 'reading'}`}>Lesson questions and explanations →</Link></article>)}</div></section>)}
        {view === 'resources' && <LearningResources track={track.slug} links={[...sources.values()]} />}
      </div>
    </div>
  </section>
}
