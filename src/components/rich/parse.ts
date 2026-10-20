// Shared parsing helpers for the inline visual blocks used in lesson text.

export interface Block { title?: string; unit?: string; lines: string[] }

export function parseBlock(src: string): Block {
  const out: Block = { lines: [] }
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const m = /^(title|unit)\s*:\s*(.*)$/.exec(line)
    if (m) {
      if (m[1] === 'title') out.title = m[2]
      else out.unit = m[2]
      continue
    }
    out.lines.push(line)
  }
  return out
}

// "A -> B : label" or "A -> B: label" or "A -> B"
export function parseEdge(line: string): { from: string; to: string; label: string } | null {
  const m = /^(.+?)\s*(?:->|→)\s*([^:]+?)\s*(?::\s*(.*))?$/.exec(line)
  if (!m) return null
  return { from: m[1].trim(), to: m[2].trim(), label: (m[3] ?? '').trim() }
}

export function parseNumber(s: string): number {
  const n = parseFloat(s.replace(/[, ]/g, ''))
  return Number.isFinite(n) ? n : 0
}
