// A small ASD-STE100 style checker. It flags the rules a machine can check.
// It cannot check the approved dictionary in full, so it checks a short list of
// common unapproved words and gives the approved alternative.

export interface Issue {
  rule: string
  severity: 'error' | 'warn'
  message: string
  sentence: string
  start: number
  end: number
}

export const unapproved: Record<string, string> = {
  utilize: 'use',
  utilise: 'use',
  leverage: 'use',
  facilitate: 'help, make easier',
  commence: 'start',
  terminate: 'stop, end',
  prior: 'before',
  subsequent: 'after, next',
  additionally: 'also',
  furthermore: 'also',
  however: 'but',
  nevertheless: 'but',
  approximately: 'about',
  numerous: 'many',
  sufficient: 'enough',
  insufficient: 'not enough',
  demonstrate: 'show',
  indicate: 'show',
  obtain: 'get',
  perform: 'do',
  implement: 'install, do, build',
  'in order to': 'to',
  'due to': 'because of',
  'a number of': 'some, many',
  'as well as': 'and',
  'it turns out': '(remove)',
  'under the hood': 'internally',
  'boils down to': 'is',
  'the trick is': '(remove)',
  basically: '(remove)',
  essentially: '(remove)',
  'very': '(remove or give the number)',
  'quite': '(remove)',
  'really': '(remove)',
  'should': 'must (if required) or can (if optional)',
  'might': 'can',
  'may': 'can',
  'could': 'can',
  'whilst': 'while',
  'amongst': 'among',
  'in terms of': '(rewrite)',
  'with respect to': 'for, about',
  'in the event of': 'if',
}

const passiveRe = /\b(is|are|was|were|be|been|being)\s+(\w+ed|\w+en|built|done|made|put|set|read|run|sent|shown|given|known|seen|taken|written|chosen|kept|held|led|found|left|lost|met|paid|said|sold|told|thought|understood|won)\b/gi
const abbrevRe = /\b[A-Z]{2,6}\b/g

export function splitSentences(text: string): { text: string; start: number }[] {
  const out: { text: string; start: number }[] = []
  const re = /[^.!?\n]+[.!?]?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const t = m[0].trim()
    if (t.length > 1) out.push({ text: t, start: m.index + (m[0].length - m[0].trimStart().length) })
  }
  return out
}

export function wordCount(s: string) {
  return s.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length
}

export function checkSte(text: string, opts: { procedural?: boolean } = {}): Issue[] {
  const issues: Issue[] = []
  const limit = opts.procedural ? 20 : 25
  const sentences = splitSentences(text)
  const seenAbbrev = new Set<string>()

  for (const s of sentences) {
    const wc = wordCount(s.text)
    const end = s.start + s.text.length
    if (wc > limit) issues.push({ rule: 'Sentence length', severity: 'error', message: `${wc} words. Limit is ${limit}. Split the sentence.`, sentence: s.text, start: s.start, end })
    const lower = s.text.toLowerCase()
    for (const [bad, good] of Object.entries(unapproved)) {
      const idx = lower.search(new RegExp(`\\b${bad.replace(/ /g, '\\s+')}\\b`))
      if (idx >= 0) issues.push({ rule: 'Unapproved word', severity: 'warn', message: `"${bad}" → use "${good}".`, sentence: s.text, start: s.start + idx, end: s.start + idx + bad.length })
    }
    passiveRe.lastIndex = 0
    const pm = passiveRe.exec(s.text)
    if (pm) issues.push({ rule: 'Passive voice', severity: 'warn', message: `"${pm[0]}" looks passive. Say who does the action.`, sentence: s.text, start: s.start + pm.index, end: s.start + pm.index + pm[0].length })
    if (/\?\s*$/.test(s.text)) issues.push({ rule: 'Question', severity: 'warn', message: 'Avoid rhetorical questions in descriptive text. State the fact.', sentence: s.text, start: s.start, end })
    const ing = s.text.match(/\b(\w+ing)\b/g)?.filter((w) => !/^(thing|string|ring|king|during|bring|spring|nothing|something|anything|everything|morning|evening|training|embedding|batching|caching|sampling|scaling|routing|streaming|learning|serving)$/i.test(w))
    if (ing && ing.length >= 3) issues.push({ rule: '-ing forms', severity: 'warn', message: `${ing.length} -ing words (${ing.slice(0, 3).join(', ')}). Prefer simple verb forms.`, sentence: s.text, start: s.start, end })
    abbrevRe.lastIndex = 0
    let am: RegExpExecArray | null
    while ((am = abbrevRe.exec(s.text))) {
      const a = am[0]
      if (seenAbbrev.has(a)) continue
      seenAbbrev.add(a)
      const defined = new RegExp(`\\(${a}\\)`).test(text) || new RegExp(`${a}\\s*\\(`).test(text)
      if (!defined) issues.push({ rule: 'Abbreviation', severity: 'warn', message: `"${a}" is not spelled out on first use. Write the full term followed by (${a}).`, sentence: s.text, start: s.start + am.index, end: s.start + am.index + a.length })
    }
  }

  // Paragraph length
  const paras = text.split(/\n\s*\n/)
  let cursor = 0
  for (const p of paras) {
    const n = splitSentences(p).length
    if (n > 6) issues.push({ rule: 'Paragraph length', severity: 'error', message: `${n} sentences in one paragraph. Limit is 6. Split by topic.`, sentence: p.slice(0, 80) + '…', start: cursor, end: cursor + p.length })
    cursor += p.length + 2
  }
  return issues.sort((a, b) => a.start - b.start)
}

export function steStats(text: string) {
  const sentences = splitSentences(text)
  const counts = sentences.map((s) => wordCount(s.text))
  const avg = counts.length ? counts.reduce((a, b) => a + b, 0) / counts.length : 0
  return { sentences: sentences.length, words: wordCount(text), avg, longest: Math.max(0, ...counts) }
}
