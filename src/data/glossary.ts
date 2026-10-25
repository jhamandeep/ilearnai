import type { GlossaryTerm } from './types'
import { terms as core } from './glossary/core'

// Every file in ./glossary/*.ts exports `terms`. Each module of lessons adds its
// own file (see CONTENT_SPEC.md section 6) so writers never edit the same file.
// Terms are merged here; the first definition of a slug wins, so core terms
// take precedence over module terms.
const files = import.meta.glob<{ terms: GlossaryTerm[] }>('./glossary/*.ts', { eager: true })
const sources: GlossaryTerm[][] = [core, ...Object.entries(files).filter(([p]) => !p.endsWith('/core.ts')).map(([, m]) => m.terms)]

const seen = new Set<string>()
export const glossary: GlossaryTerm[] = sources.flat().filter((t) => {
  if (seen.has(t.slug)) return false
  seen.add(t.slug)
  return true
}).sort((a, b) => a.term.localeCompare(b.term))

export function findTerm(slug: string) {
  return glossary.find((g) => g.slug === slug)
}
