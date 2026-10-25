import type { Track } from '../types'
import { mod as WhatAiIs } from './ai-foundations/what-ai-is'
import { mod as FirstModels } from './ai-foundations/first-models'
import { mod as NeuralNetworks } from './ai-foundations/neural-networks'
import { mod as LanguageAsNumbers } from './ai-foundations/language-as-numbers'
import { mod as UsingModels } from './ai-foundations/using-models'

export const track: Track = {
  slug: 'ai-foundations',
  title: 'AI Foundations: How Machines Learn',
  tagline: 'From the learning loop to your first trained models, neural networks and language models, with every step computed by hand first.',
  description:
    'Level 1, step 3. Five modules: what AI is, your first models, neural networks, language as numbers, and using models. The same house-price table and the same tiny network run through the modules so each new idea lands on a known example.',
  accent: 'var(--accent-foundations)',
  status: 'live',
  level: 'beginner',
  order: 3,
  audience: 'A person who can run a Python file and has the Level 0 mathematics. No machine learning yet.',
  outcome: 'Train and evaluate first models with scikit-learn and PyTorch, explain how a language model predicts the next token, and use a model well through prompts and sampling.',
  prerequisites: ['start-here', 'math-from-zero'],
  modules: [WhatAiIs, FirstModels, NeuralNetworks, LanguageAsNumbers, UsingModels],
}
