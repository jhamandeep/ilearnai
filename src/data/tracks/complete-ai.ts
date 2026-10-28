import type { Track, Lesson, LessonLink } from '../types'
import { completeAiGuides } from '../learning/completeAiGuides'
import source from '../third-party/microsoft-ai-readings.json'

const modules = [
  ['ideas-and-reasoning', 'Ideas, history, and symbolic reasoning', 'Choose between explicit rules and learned patterns; trace facts through an expert system.'],
  ['neural-networks', 'Neural networks and frameworks', 'From one decision boundary to backpropagation, PyTorch, TensorFlow, and evaluation.'],
  ['computer-vision', 'Computer vision from pixels to regions', 'OpenCV, CNNs, transfer learning, autoencoders, GANs, detection, and segmentation.'],
  ['language-and-representation', 'Language, representations, and generation', 'Text baselines, embeddings, recurrent models, Transformers, NER, and LLMs.'],
  ['search-and-agents', 'Search, reinforcement learning, and agents', 'Explore candidate solutions, learn from interaction, and coordinate multiple decision makers.'],
  ['responsible-practice', 'Responsible AI in practice', 'Connect principles to evidence, affected people, review, and accountability.'],
  ['multimodal-extension', 'Extension: image and language together', 'Compare image-text matching with image generation and evaluate their different outputs.'],
]

function diagramLabel(label: string) {
  const lines = ['']
  for (const word of label.replaceAll('"', '').split(/\s+/)) {
    const last = lines.length - 1
    if (lines[last] && lines[last].length + word.length > 18) lines.push(word)
    else lines[last] += `${lines[last] ? ' ' : ''}${word}`
  }
  return lines.join('|')
}

export const track: Track = {
  slug: 'complete-ai', title: 'AI from first principles', tagline: 'The whole foundation: reasoning, vision, language, agents, and responsible practice.',
  description: 'Follow the 24 core topics of Microsoft’s AI for Beginners curriculum, plus its multimodal extension, inside ilearnai. Full attributed readings are paired with original worked examples, animated walkthroughs, practical tasks, and explained quizzes. Framework notebooks remain available with their original setup instructions.',
  accent: '#5166b0', status: 'live', level: 'beginner', order: 11,
  audience: 'Learners who want a broad AI foundation, with plain-language examples before technical detail.',
  outcome: 'Explain the main AI approaches, inspect their computations, compare their limits, and plan a relevant experiment.',
  prerequisites: ['start-here', 'math-from-zero'],
  modules: modules.map(([slug, title, description]) => ({ slug, title, description, level: 'beginner', lessons: completeAiGuides.filter(guide => guide.module === slug).map(guide => {
    const reading = source.lessons.find(item => item.number === guide.number)!
    const objects = guide.steps.map(([label], i) => `box s${i} "${diagramLabel(label)}" @ ${120 + i * 240},260 size: 205x90 color: ${['blue', 'purple', 'orange', 'blue'][i]} icon: none`).join('\n')
    const animation = guide.steps.map(([label, explanation], i) => `step: ${label}\nexplain: ${explanation}\n  show s${i}\n${i ? `  arrow s${i - 1} -> s${i}\n  send s${i - 1} -> s${i}\n` : ''}  highlight s${i}`).join('\n')
    const quiz = guide.checks.map(([question, correct, wrongA, wrongB, why], i) => {
      const choices = [`* ${correct}`, `- ${wrongA}`, `- ${wrongB}`]
      const shift = (guide.number + i) % 3
      return `q: ${question}\n${[...choices.slice(shift), ...choices.slice(0, shift)].join('\n')}\nwhy: ${why}`
    }).join('\n')
    const codeNote = guide.number === 6 ? '\n\nOpenCV note: this adaptation uses INTER_LANCZOS4, the documented interpolation constant. Read an image successfully before converting its channels.' : guide.number === 22 ? '\n\nRuntime note: the source includes historical OpenAI Gym examples. New projects can use [Gymnasium’s migration guide](https://gymnasium.farama.org/introduction/migration_guide/) for reset/step return values and the distinction between termination and truncation.' : ''
    return {
      slug: guide.slug, title: guide.title, summary: guide.summary, minutes: Math.max(20, Math.ceil(reading.body.split(/\s+/).length / 180) + 15),
      objectives: [guide.summary, `Work through the example: ${guide.steps[guide.steps.length - 1][0].toLowerCase()}.`, 'Explain the stated limitation and complete the practice task with evidence.'],
      keyTerms: [guide.term[0]],
      body: `## What this lesson covers\n\n${guide.summary}\n\n## Why it matters\n\n${guide.application}\n\n## The idea with an example\n\n${guide.example}\n\n:::anim\ntitle: ${guide.title}\ncontext: ${guide.example}\nfocus: Follow each labelled stage and compare it with the worked example.\ntakeaway: ${guide.limitation}\n${objects}\n${animation}\n:::\n\n## How it works\n\n${guide.steps.map(([label, explanation], index) => `${index + 1}. **${label}.** ${explanation}`).join('\n')}\n\n### Read the complete foundation\n\nThe following reading is adapted from [Microsoft AI for Beginners](${reading.sourceUrl}), under the [MIT license](/licenses/microsoft-ai-for-beginners.txt). Copyright (c) Microsoft Corporation. Original image credits are retained. This is an independent ilearnai learning experience. Foundational readings include historical models; framework notebooks use their own environment setup.${codeNote}\n\n${reading.body}\n\n## Try it\n\n:::exercise\ntitle: Apply ${guide.title.toLowerCase()}\ntask: ${guide.task}\nhint: ${guide.hint}\nlang: text\nsolution:\n${guide.solution}\n:::\n\n## Common mistakes\n\n${guide.limitation}\n\n## Check your understanding\n\n:::quiz\ntitle: Decide and explain\n${quiz}\n:::\n\n## Go further\n\nOpen the linked notebooks for a framework implementation. Use the setup instructions before running them; the browser Python workspace supports smaller standard-library exercises. Return to the worked example and explain how the same idea changes in your own field.\n`,
      links: [{ label: 'Microsoft source lesson and attribution', url: reading.sourceUrl, kind: 'course' }, { label: 'Notebook environment setup', url: `https://github.com/microsoft/AI-For-Beginners/blob/${source.commit}/lessons/0-course-setup/how-to-run.md`, kind: 'docs' }, ...reading.links] as LessonLink[],
    } satisfies Lesson
  }) })),
}
