import type { Track } from '../types'
import { mod as HowAComputerWorks } from './start-here/how-a-computer-works'
import { mod as FirstPython } from './start-here/first-python'
import { mod as PythonForData } from './start-here/python-for-data'
import { mod as BuildersTools } from './start-here/builders-tools'
import { mod as DataTheRawMaterial } from './start-here/data-the-raw-material'

export const track: Track = {
  slug: 'start-here',
  title: 'Start Here: Computers, Code and Data from Zero',
  tagline: 'No coding and no AI background needed. Learn how a computer works, write your first Python, and meet data.',
  description:
    'Level 0, step 1. Five modules take you from what a computer does to the tools every builder uses: how a computer works, your first Python, Python for data, the builder tools (terminal, Git, APIs, secrets, Docker), and data as the raw material of AI. Every lesson has an everyday analogy, a worked example with real numbers, a short exercise and a quiz.',
  accent: 'var(--accent-start)',
  status: 'live',
  level: 'foundations',
  order: 1,
  audience: 'A person who has never written code and never studied AI. Nothing is assumed, not even what a file is.',
  outcome: 'Write and run small Python programs, read and clean a data table with pandas, use the terminal, Git, APIs and Docker, and explain what data is.',
  prerequisites: [],
  modules: [HowAComputerWorks, FirstPython, PythonForData, BuildersTools, DataTheRawMaterial],
}
