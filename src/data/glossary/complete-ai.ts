import type { GlossaryTerm } from '../types'
import { completeAiGuides } from '../learning/completeAiGuides'

export const terms: GlossaryTerm[] = completeAiGuides.map(guide => ({
  slug: guide.term[0], term: guide.term[0].replaceAll('-', ' '), short: guide.term[1],
  long: `${guide.term[1]}\n\n${guide.example}\n\n${guide.limitation}\n\n[Explore the full lesson](/courses/complete-ai/${guide.module}/${guide.slug}).`, related: [],
}))
