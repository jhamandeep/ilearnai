import type { Lesson } from '../data/types'
import type { PythonExercise } from '../data/pythonExercises'
import { lessonActivities } from './activities'
import { parseExercise, exerciseFingerprint } from './exercise'
import support from '../data/lessonPythonSupport.json'
import { firstSectionParagraph } from './lessonGuidance'

export function lessonPythonExercises(lesson: Lesson, route: string): PythonExercise[] {
  const [, , track, module] = route.split('/')
  return lessonActivities(lesson, route).filter(activity => activity.kind === 'exercise').flatMap(activity => {
    const parsed = parseExercise(activity.body.replace(/^:::exercise\s*\n/, '').replace(/\n:::\s*$/, ''))
    const key = `${route}/${activity.id}`
    if (parsed.lang !== 'python' || (support as Record<string, string>)[key] !== exerciseFingerprint(parsed.solution)) return []
    return [{ id: key, title: parsed.title || activity.title, topic: lesson.title, minutes: 10, track, module,
      context: lesson.summary, task: parsed.task, hint: parsed.hint, solution: parsed.solution,
      starter: `# ${parsed.title || lesson.title}\n# Write your solution below. Print the result to inspect it.\n`,
      example: firstSectionParagraph(lesson.body, 'The idea with an example'),
      takeaway: 'Change one input and explain the result. Compare your work with the task and the worked solution; running successfully does not prove correctness.',
      checks: [], lessonRoute: route, activityId: activity.id,
    }]
  })
}

export function lessonPythonUrl(exercise: PythonExercise) {
  return exercise.lessonRoute ? `/code?lesson=${encodeURIComponent(exercise.lessonRoute)}&activity=${exercise.activityId}` : `/code?exercise=${exercise.id}`
}
