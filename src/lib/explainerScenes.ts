import type { WorkCase } from '../data/work/types'
import { workExamples } from '../data/work/examples'
import { labGuides } from '../data/learning/labGuides'

const quote = (value: string) => '"' + value.replace(/["“”]/g, "'").replace(/\n/g, ' ') + '"'
function wrap(value: string, width = 55, lines = 3) {
  const words = value.split(/\s+/), result = ['']
  for (const word of words) {
    if (result.at(-1)!.length + word.length > width && result.at(-1)) result.push('')
    result[result.length - 1] += (result.at(-1) ? ' ' : '') + word
  }
  if (result.length > lines) return [...result.slice(0, lines - 1), result[lines - 1] + '…'].join('|')
  return result.join('|')
}

// Four connected stages build progressively. The full explanation is spoken
// and captioned; concise labels keep the diagram readable at smaller sizes.
function flowScene(title: string, labels: string[], narration: string[], details: string[], context: string) {
  const colors = ['blue', 'purple', 'orange', 'teal']
  const positions = [[250, 145], [710, 145], [710, 300], [250, 300]]
  const lines = [`title: ${title}`, `context: ${context}`, 'focus: Follow the highlighted stage, then check the example below.', 'text heading ' + quote(wrap(title, 62, 2)) + ' @ 480,50 size: 24 color: white']
  labels.forEach((label, i) => lines.push(`box node${i} ${quote(wrap(label, 22, 2))} @ ${positions[i]} size: 300x85 color: ${colors[i]}`))
  lines.push('rect detail @ 480,445 size: 820x110 color: blue', 'text detailText "" @ 480,445 size: 19 color: white')
  narration.forEach((text, i) => {
    lines.push(`step: ${text}`)
    if (i === 0) lines.push('show heading, node0, detail, detailText')
    else lines.push(`restore node${i - 1}`, `show node${i}`, `arrow node${i - 1} -> node${i}`)
    lines.push(`highlight node${i}`, `label detailText ${quote(wrap(details[i]))}`)
  })
  return lines.join('\n')
}

export function workExplainerScene(industry: string, item: WorkCase) {
  const example = workExamples[`${industry}/${item.slug}`]
  const texts = example ? [example.input, example.draft, example.review, example.outcome] : [item.inputs.join('. '), item.ai, item.human, item.pilot]
  const narration = [
    `Let's follow an example. ${texts[0]}`,
    `Here's what the AI prepares. ${texts[1]}`,
    `Now a person checks the work. ${texts[2]}`,
    `${texts[3]} ${example?.lesson ?? item.benefit}`,
  ]
  return flowScene(item.title, ['Approved information', 'AI prepares a draft', 'A person checks', 'The next action'], narration, texts, 'A fictional teaching example. Follow the information, the proposed output, and the human decision.')
}

const labLabels: Record<string, string[]> = {
  'gradient-descent': ['Choose parameters', 'Measure the slope', 'Take a small step', 'Check the new loss'],
  sampling: ['Score next tokens', 'Adjust temperature', 'Filter candidates', 'Choose a token'],
  attention: ['Choose a query', 'Compare with keys', 'Weight the values', 'Build a representation'],
  tokenizer: ['Start with text', 'Count adjacent pairs', 'Merge a frequent pair', 'Inspect the tokens'],
  'transformer-flow': ['Token vectors', 'Attention mixes context', 'Feed-forward transform', 'Next layer or output'],
  'kv-cache': ['Tokens in context', 'Keys and values', 'Memory per request', 'Concurrent requests'],
  'agent-control-room': ['Request and plan', 'Use an allowed tool', 'Check the result', 'Finish or ask for help'],
  capacity: ['Incoming requests', 'Work per request', 'Available resources', 'Capacity estimate'],
  'pareto-router': ['Candidate models', 'Quality and cost', 'Latency requirement', 'Choose a trade-off'],
  'timeout-architect': ['Request starts', 'Services take time', 'Time budget runs out', 'Retry or stop'],
  'ste-checker': ['Write a sentence', 'Inspect the language', 'Review each flag', 'Revise for the reader'],
}

export function labExplainerScene(slug: string, title: string) {
  const guide = labGuides[slug]
  if (!guide || !labLabels[slug]) return ''
  return flowScene(title, labLabels[slug], [guide.idea, guide.watch, guide.example, `${guide.meaning} ${guide.limit}`], [guide.relate, guide.watch, guide.example, guide.meaning], 'Watch the idea, then change the controls in the live lab. This recording explains a fixed teaching example.')
}
