// Parser for the ":::quiz" block used in lesson text, shared by the inline
// Quiz component and the practice-paper builder.
//
// Grammar (one item per line):
//   title: optional caption
//   q: the question text
//   - a wrong option
//   * the correct option
//   why: one or two sentences that explain the correct answer
//
// A block holds several q: groups. Each question needs exactly one * option.

export interface QuizQuestion {
  text: string
  options: string[]
  answer: number // index into options
  why: string
}

export interface QuizBlock {
  title?: string
  questions: QuizQuestion[]
}

export function parseQuiz(src: string): QuizBlock {
  const out: QuizBlock = { questions: [] }
  let cur: QuizQuestion | null = null
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    let m = /^title\s*:\s*(.*)$/.exec(line)
    if (m) { out.title = m[1]; continue }
    m = /^q\s*:\s*(.*)$/.exec(line)
    if (m) {
      cur = { text: m[1], options: [], answer: -1, why: '' }
      out.questions.push(cur)
      continue
    }
    if (!cur) continue
    m = /^why\s*:\s*(.*)$/.exec(line)
    if (m) { cur.why = m[1]; continue }
    m = /^([-*])\s+(.*)$/.exec(line)
    if (m) {
      if (m[1] === '*') cur.answer = cur.options.length
      cur.options.push(m[2])
      continue
    }
    // continuation of the question text
    cur.text += ' ' + line
  }
  out.questions = out.questions.filter((q) => q.options.length >= 2 && q.answer >= 0)
  return out
}

// Pull every quiz question out of a Markdown lesson body.
export function quizzesIn(body: string): QuizQuestion[] {
  const re = /^[ \t]*:::quiz[ \t]*\n([\s\S]*?)^[ \t]*:::[ \t]*$/gm
  const qs: QuizQuestion[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(body))) qs.push(...parseQuiz(m[1]).questions)
  return qs
}

// Small deterministic generator so a practice paper with a given seed always
// holds the same questions.
export function seeded(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13; s >>>= 0
    s ^= s >>> 17
    s ^= s << 5; s >>>= 0
    return s / 4294967296
  }
}

export function sample<T>(items: T[], n: number, seed: number): T[] {
  const rnd = seeded(seed)
  const a = items.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, Math.min(n, a.length))
}
