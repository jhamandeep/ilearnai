import type { Track } from '../types'
import { mod as SetUpYourWorkshop } from './build-ai-ecosystem/set-up-your-workshop'
import { mod as ChatApplication } from './build-ai-ecosystem/chat-application'
import { mod as RetrievalRag } from './build-ai-ecosystem/retrieval-rag'
import { mod as AgentsAndTools } from './build-ai-ecosystem/agents-and-tools'
import { mod as TrainYourOwn } from './build-ai-ecosystem/train-your-own'
import { mod as ShipIt } from './build-ai-ecosystem/ship-it'

export const track: Track = {
  slug: 'build-ai-ecosystem',
  title: 'Build the AI Ecosystem: Project Track',
  tagline: 'One repository, six modules: a chat app, retrieval over your documents, an agent with tools, a fine-tuned model, and a deployed service.',
  description:
    'Level 1, step 4. Six modules build one project in order: set up your workshop, chat application, retrieval over your own documents (RAG), agents and tools, train and fine-tune your own model, and ship it. Each lesson adds one working piece and ends with a commit.',
  accent: 'var(--accent-build)',
  status: 'live',
  level: 'beginner',
  order: 4,
  audience: 'A person who finished AI Foundations and wants to build a complete, deployed AI system step by step.',
  outcome: 'Ship a working AI system: a streaming chat app with a web UI, retrieval with citations, a tool-using agent with guardrails, a LoRA fine-tuned model, and a monitored, cost-controlled deployment.',
  prerequisites: ['ai-foundations'],
  modules: [SetUpYourWorkshop, ChatApplication, RetrievalRag, AgentsAndTools, TrainYourOwn, ShipIt],
}
