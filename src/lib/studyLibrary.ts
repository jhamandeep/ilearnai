import type { Lesson, LessonLink } from '../data/types'
import { papers } from '../data/papers'
import { openResources } from '../data/openResources'
import { resourcesForTrack } from '../data/resources'
import { chapterVideo, chapterVideoGuide } from '../data/learning/chapterVideos'
import { lessonActivities } from './activities'
import { lessonPythonExercises } from './lessonPython'

// Match an arXiv abstract, versioned PDF and catalogue entry to the same paper.
export function sourceKey(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'arxiv.org' || parsed.hostname === 'www.arxiv.org') {
      return `arxiv:${parsed.pathname.replace(/^\/(abs|pdf)\//, '').replace(/\.pdf$/, '').replace(/v\d+$/, '')}`
    }
    // Documentation anchors can point to different sections of the same page.
    return parsed.href.replace(/\/$/, '')
  } catch { return url }
}

export function studyLibrary(lesson: Lesson, route: string) {
  const [, , track, module] = route.split('/')
  const seen = new Set<string>()
  const links = lesson.links.filter(link => { const key = sourceKey(link.url); if (seen.has(key)) return false; seen.add(key); return true })
  const paperFor = (link: LessonLink) => papers.find(paper => sourceKey(paper.url) === sourceKey(link.url))
  const references = links.filter(link => link.kind === 'paper' || paperFor(link)).map(link => ({ link, paper: paperFor(link) }))
  const referenceKeys = new Set(references.map(({ link }) => sourceKey(link.url)))
  const guide = chapterVideoGuide(track, module)
  const chapterVideos = (guide?.picks ?? []).flatMap(pick => {
    const video = chapterVideo(pick.ref)
    return video ? [{ ...video, focus: pick.focus }] : []
  })
  const courseResources = [...openResources.filter(resource => resource.track === track), ...resourcesForTrack(track)]
  const uniqueResources = courseResources.filter((resource, index) => !seen.has(sourceKey(resource.url)) && courseResources.findIndex(other => sourceKey(other.url) === sourceKey(resource.url)) === index)
  return {
    references,
    readings: links.filter(link => !referenceKeys.has(sourceKey(link.url)) && ['docs', 'article', 'course'].includes(link.kind)),
    videos: links.filter(link => link.kind === 'video' && !referenceKeys.has(sourceKey(link.url))),
    repositories: links.filter(link => link.kind === 'repo' && !referenceKeys.has(sourceKey(link.url))),
    courseReadings: uniqueResources.filter(resource => ['course', 'book', 'blog', 'paper-list'].includes(resource.kind)).slice(0, 4),
    courseTools: uniqueResources.filter(resource => ['repo', 'tool', 'visualization'].includes(resource.kind)).slice(0, 4),
    coursePapers: papers.filter(paper => paper.track === track && !referenceKeys.has(sourceKey(paper.url))).slice(0, 3),
    chapterVideos: chapterVideos.filter(video => !links.some(link => link.kind === 'video' && sourceKey(link.url) === sourceKey(video.url))),
    guide,
    exercises: lessonPythonExercises(lesson, route),
    labs: lessonActivities(lesson, route).filter(activity => activity.kind === 'lab' && activity.labSlug),
    track,
  }
}
