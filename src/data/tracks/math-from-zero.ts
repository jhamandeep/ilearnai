import type { Track } from '../types'
import { mod as NumbersAndFunctions } from './math-from-zero/numbers-and-functions'
import { mod as VectorsAndMatrices } from './math-from-zero/vectors-and-matrices'
import { mod as ChangeAndGradients } from './math-from-zero/change-and-gradients'
import { mod as Chance } from './math-from-zero/chance'

export const track: Track = {
  slug: 'math-from-zero',
  title: 'Mathematics for AI from Zero',
  tagline: 'The numbers, vectors, slopes and chances behind every model, built up from school level with hand-computed examples.',
  description:
    'Level 0, step 2. Four modules: numbers and functions, vectors and matrices, change (derivatives and gradients), and chance (probability and statistics). Every formula is also written in words, and every idea is computed on small numbers first.',
  accent: 'var(--accent-mathzero)',
  status: 'live',
  level: 'foundations',
  order: 2,
  audience: 'A person who last did mathematics at school and wants the ideas behind AI without being lost in symbols.',
  outcome: 'Compute a dot product, a matrix product, a derivative, one gradient-descent step and a probability by hand, and read the formulas in Level 1 lessons.',
  prerequisites: [],
  modules: [NumbersAndFunctions, VectorsAndMatrices, ChangeAndGradients, Chance],
}
