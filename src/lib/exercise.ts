export interface ParsedExercise { title: string; task: string; hint: string; lang: string; solution: string }

export function parseExercise(src: string): ParsedExercise {
  const lines = src.replace(/\n$/, '').split('\n')
  let title = '', lang = 'text', solution = ''
  const task: string[] = [], hint: string[] = []
  let mode: 'task' | 'hint' | 'none' = 'none'
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (/^solution\s*:\s*$/.test(line)) { solution = lines.slice(i + 1).join('\n'); break }
    const match = /^(title|lang|task|hint)\s*:\s*(.*)$/.exec(line)
    if (match) {
      if (match[1] === 'title') { title = match[2]; mode = 'none' }
      if (match[1] === 'lang') { lang = match[2]; mode = 'none' }
      if (match[1] === 'task') { task.push(match[2]); mode = 'task' }
      if (match[1] === 'hint') { hint.push(match[2]); mode = 'hint' }
    } else if (mode === 'task') task.push(line)
    else if (mode === 'hint') hint.push(line)
  }
  return { title, lang, task: task.join(' ').trim(), hint: hint.join(' ').trim(), solution }
}

// A content fingerprint invalidates a tested capability when its source changes.
// This is a cache key, not a security boundary. Python still runs in the sandbox.
export function exerciseFingerprint(source: string) {
  let hash = 2166136261
  for (const character of source.trim()) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619)
  return (hash >>> 0).toString(16)
}
