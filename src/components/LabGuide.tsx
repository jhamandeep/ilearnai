import { labGuides } from '../data/learning/labGuides'

export function LabGuide({ slug, after = false }: { slug: string; after?: boolean }) {
  const guide = labGuides[slug]
  if (!guide) return null
  if (after) return <section className="learning-guide lab-debrief"><h2>Make sense of the result</h2><p>{guide.meaning}</p><details><summary>A worked example</summary><p>{guide.example}</p></details><details><summary>Check your understanding: {guide.question}</summary><p>{guide.answer}</p></details><p className="guide-limit"><strong>What this lab does not show:</strong> {guide.limit}</p></section>
  return <section className="learning-guide lab-introduction"><p className="eyebrow">Understand it before you change it</p><h2>The idea in everyday terms</h2><p>{guide.idea}</p><p>{guide.relate}</p><div className="guide-watch"><strong>What you are looking at</strong><p>{guide.watch}</p></div><details><summary>Try this guided experiment</summary><ol>{guide.steps.map(step => <li key={step}>{step}</li>)}</ol><p>Change one setting at a time. Compare the result before changing another setting.</p></details></section>
}
