import type { Lesson } from '../data/types'
import { glossary } from '../data/glossary'

// Keep the author's example with an animation opened outside its reading page.
// Only prose is copied: interactive blocks stay in their original activities.
export function firstSectionParagraph(body: string, heading: string) {
  const section = body.split(`## ${heading}`)[1]?.split(/^## /m)[0] ?? ''
  const prose = section.replace(/^[ \t]*:::\w+[ \t]*\n[\s\S]*?^[ \t]*:::[ \t]*$/gm, '')
  const paragraphs = prose.trim().split(/\n\s*\n/).filter(paragraph => paragraph.trim() && !/^\s*(?:\||#|\d+\.)/.test(paragraph))
  const introduction: string[] = []
  for (const paragraph of paragraphs.slice(0, 4)) {
    introduction.push(paragraph.trim())
    // “Take this matrix:” needs both the equation and the explanation after it.
    if (introduction.join(' ').length >= 90 && !paragraph.trim().startsWith('$$') && !paragraph.trim().endsWith(':')) break
  }
  return introduction.join('\n\n')
}

export function lessonTerms(lesson: Lesson) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const keys = new Set(lesson.keyTerms.map(normalize))
  return glossary.filter(term => keys.has(term.slug) || keys.has(normalize(term.term)))
}
