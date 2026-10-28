import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { createElement, act } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, MemoryRouter } from 'react-router-dom'
import { Window } from 'happy-dom'
const vite = await createServer({ cacheDir: 'node_modules/.vite-course-workspace', server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
let root, window
try {
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { replaceTracks } = await vite.ssrLoadModule('/src/data/tracks.ts')
  replaceTracks(tracks)
  const { CourseWorkspace } = await vite.ssrLoadModule('/src/components/CourseWorkspace.tsx')
  const { CodePractice } = await vite.ssrLoadModule('/src/pages/CodePractice.tsx')
  const { LessonPreview } = await vite.ssrLoadModule('/src/components/LessonGuidance.tsx')
  const { lessonPythonExercises, lessonPythonUrl } = await vite.ssrLoadModule('/src/lib/lessonPython.ts')
  const { lessonActivities } = await vite.ssrLoadModule('/src/lib/activities.ts')
  const { chapterVideoGuide } = await vite.ssrLoadModule('/src/data/learning/chapterVideos.ts')
  const support = (await vite.ssrLoadModule('/src/data/lessonPythonSupport.json')).default
  const render = (component, path, props = {}) => renderToString(createElement(StaticRouter, { location: path }, createElement(component, props)))
  let lessons = 0, chapters = 0, playable = 0, practice = 0, sources = 0
  const perTrack = []
  for (const track of tracks) {
    const path = `/courses/${track.slug}`
    const all = render(CourseWorkspace, path, { track })
    const count = track.modules.reduce((sum, module) => sum + module.lessons.length, 0)
    assert.equal((all.match(/data-course-lesson=/g) ?? []).length, count, `${track.slug}: every lesson must be visible without expanding a nested group`)
    assert.equal((all.match(/data-course-chapter=/g) ?? []).length, track.modules.length)
    assert.ok(!all.includes('<details'), 'Do not hide lessons in nested accordions')
    const videoHtml = render(CourseWorkspace, `${path}?view=videos`, { track })
    const picks = track.modules.reduce((sum, module) => sum + chapterVideoGuide(track.slug, module.slug).picks.length, 0)
    assert.equal((videoHtml.match(/class="video-thumbnail"/g) ?? []).length, picks)
    assert.ok(!videoHtml.includes('<iframe'), 'Videos load only after selection')
    const practiceHtml = render(CourseWorkspace, `${path}?view=practice`, { track })
    assert.equal((practiceHtml.match(/data-course-practice=/g) ?? []).length, count, `${track.slug}: every lesson needs practice access`)
    const sourceHtml = render(CourseWorkspace, `${path}?view=resources`, { track })
    const links = new Set(track.modules.flatMap(module => module.lessons.flatMap(lesson => lesson.links.map(link => link.url))))
    for (const url of links) assert.ok(sourceHtml.includes(`href="${url.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`), `${track.slug}: missing source ${url}`)
    sources += links.size
    let coding = 0
    for (const module of track.modules) {
      const selected = render(CourseWorkspace, `${path}?chapter=${module.slug}`, { track })
      assert.equal((selected.match(/data-course-lesson=/g) ?? []).length, module.lessons.length)
      assert.equal((selected.match(/data-course-chapter=/g) ?? []).length, 1)
      for (const lesson of module.lessons) {
        const route = `${path}/${module.slug}/${lesson.slug}`
        const introduction = render(LessonPreview, route, { lesson, route })
        assert.ok(introduction.includes('Why this idea matters') && introduction.includes('An example from this lesson'))
        const animations = lessonActivities(lesson, route).filter(activity => activity.kind === 'animation')
        assert.ok(animations.every(activity => all.includes(`href="${route}/${activity.id}"`)))
        for (const exercise of lessonPythonExercises(lesson, route)) {
          const url = lessonPythonUrl(exercise)
          assert.ok(practiceHtml.includes(`href="${url.replaceAll('&', '&amp;')}"`))
          const html = render(CodePractice, url)
          assert.ok(html.includes('This lesson exercise has no automatic grading.'), url)
          assert.ok(html.includes(`href="${route}/${exercise.activityId}"`), 'Return to the exact task')
          assert.ok(html.includes(exercise.task.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')), 'Workspace needs the exact task')
          playable++; coding++
        }
        lessons++; practice++
      }
      chapters++
    }
    perTrack.push({ track: track.slug, lessons: count, chapters: track.modules.length, runnableLessonExercises: coding })
  }
  assert.equal(playable, Object.keys(support).length, 'Every verified exercise needs a working workspace link')
  const sampleTrack = tracks[0], sampleModule = sampleTrack.modules[1], sampleLesson = sampleModule.lessons[1]
  const sampleRoute = `/courses/${sampleTrack.slug}/${sampleModule.slug}/${sampleLesson.slug}`
  const initial = lessonPythonExercises(sampleLesson, sampleRoute)
  assert.ok(initial.length)
  const changed = { ...sampleLesson, body: sampleLesson.body.replace(initial[0].solution, `${initial[0].solution}\nprint('changed reference')`) }
  assert.ok(!lessonPythonExercises(changed, sampleRoute).some(item => item.activityId === initial[0].activityId), 'Changed references must be audited again before exposing a Run shortcut')
  assert.ok(render(CodePractice, '/code?lesson=/courses/missing/chapter/lesson&activity=exercise-1').includes('not available in the browser runner'))
  assert.equal((render(CourseWorkspace, '/courses/start-here?chapter=missing&view=unknown', { track: tracks[0] }).match(/data-course-lesson=/g) ?? []).length, 24)

  window = new Window({ url: 'http://localhost/', settings: { disableIframePageLoading: true, enableJavaScriptEvaluation: false } })
  for (const name of ['window', 'document', 'HTMLElement', 'Node', 'Event', 'MouseEvent']) globalThis[name] = name === 'window' ? window : name === 'document' ? window.document : window[name]
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = await import('react-dom/client')
  const container = document.createElement('div'); document.body.append(container); root = createRoot(container)
  await act(() => root.render(createElement(MemoryRouter, { initialEntries: ['/courses/start-here'] }, createElement(CourseWorkspace, { track: tracks[0] }))))
  const click = item => act(() => { assert.ok(item); item.click() })
  await click([...container.querySelectorAll('.course-format-nav button')].find(item => item.textContent === 'Video series'))
  const chaptersWithVideos = container.querySelectorAll('[data-chapter-videos]')
  await click(chaptersWithVideos[0].querySelector('.thumb-btn[aria-label^="Play "]'))
  assert.equal(container.querySelectorAll('iframe').length, 1)
  await click(chaptersWithVideos[1].querySelector('.thumb-btn[aria-label^="Play "]'))
  assert.equal(container.querySelectorAll('iframe').length, 1, 'Selecting another chapter stops the previous player')
  assert.equal(chaptersWithVideos[0].querySelector('iframe'), null)
  await click([...container.querySelectorAll('.course-chapter-nav button')].find(item => item.textContent.includes('Your first Python')))
  assert.equal(container.querySelectorAll('iframe').length, 0, 'Changing chapter filters stops playback')
  assert.equal(container.querySelectorAll('[data-course-chapter]').length, 1)
  assert.equal(container.querySelectorAll('.video-thumbnail').length, chapterVideoGuide('start-here', 'first-python').picks.length)
  await click([...container.querySelectorAll('.course-format-nav button')].find(item => item.textContent === 'Lessons'))
  assert.equal(container.querySelectorAll('[data-course-lesson]').length, 6, 'Changing format preserves chapter selection')
  await click([...container.querySelectorAll('.course-chapter-nav button')].find(item => item.textContent.includes('All chapters')))
  assert.equal(container.querySelectorAll('[data-course-lesson]').length, 24, 'All chapters restores the whole course')
  await click([...container.querySelectorAll('.course-format-nav button')].find(item => item.textContent === 'Video series'))
  assert.equal(container.querySelectorAll('iframe').length, 0, 'Returning to videos does not restart a recording')
  console.log(JSON.stringify({ tracks: perTrack, lessons, chapters, practice, runnableLessonExercises: playable, courseSources: sources }))
  console.log('PASS: every course exposes every chapter, lesson, video preview, exercise and attributed source; Python links open the exact task; chapter/format filtering and invalid queries work. No browser rendering or external playback.')
} finally { if (root) await act(() => root.unmount()); await vite.close(); await window?.happyDOM.close(); delete globalThis.IS_REACT_ACT_ENVIRONMENT }
