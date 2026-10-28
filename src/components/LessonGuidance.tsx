import { Link } from 'react-router-dom'
import type { Lesson } from '../data/types'
import { firstSectionParagraph, lessonTerms } from '../lib/lessonGuidance'
import { Markdown } from './Markdown'

export function LessonTerms({ lesson }: { lesson: Lesson }) {
  const terms = lessonTerms(lesson)
  if (!terms.length) return null
  return <details className="learning-guide lesson-terms"><summary>Words you’ll meet · {terms.length} plain-language definitions</summary><dl>{terms.map(term => <div key={term.slug}><dt><Link to={`/glossary/${term.slug}`}>{term.term} ↗</Link></dt><dd>{term.short}</dd></div>)}</dl></details>
}

export function AnimationContext({ lesson, route }: { lesson: Lesson; route: string }) {
  const example = firstSectionParagraph(lesson.body, 'The idea with an example')
  const reason = firstSectionParagraph(lesson.body, 'Why it matters')
  const mistakes = firstSectionParagraph(lesson.body, 'Common mistakes')
  return <section className="learning-guide animation-lesson-context"><p className="eyebrow">Connect the picture to the idea</p><p>{lesson.summary}</p><div className="animation-watch-focus"><strong>Watch with this goal</strong><p>{lesson.objectives[0]}</p></div>{example && <details open><summary>An example to keep in mind</summary><Markdown>{example}</Markdown></details>}{reason && <details><summary>Where this is useful</summary><Markdown>{reason}</Markdown></details>}{mistakes && <details><summary>What to avoid concluding</summary><Markdown>{mistakes}</Markdown></details>}<LessonTerms lesson={lesson} /><Link className="text-cta" to={`${route}/reading`}>Read the full explanation →</Link></section>
}

export function LessonPreview({ lesson, route }: { lesson: Lesson; route: string }) {
  const example = firstSectionParagraph(lesson.body, 'The idea with an example')
  const application = firstSectionParagraph(lesson.body, 'Why it matters')
  return <section className="lesson-context-preview" aria-label="Understand this lesson"><div><p className="eyebrow">Connect it to a useful task</p><h2>Why this idea matters</h2><Markdown>{application}</Markdown></div><div><p className="eyebrow">Start with a concrete picture</p><h2>An example from this lesson</h2><Markdown>{example}</Markdown><Link to={`${route}/reading`}>Follow the complete worked example →</Link></div></section>
}
