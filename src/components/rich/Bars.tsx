import { useMemo } from 'react'
import { parseBlock, parseNumber } from './parse'

export function Bars({ src }: { src: string }) {
  const { title, unit, rows } = useMemo(() => {
    const b = parseBlock(src)
    const rows = b.lines.map((l) => { const m = /^(.+?)\s*:\s*([-\d.,]+)\s*(.*)$/.exec(l); return m ? { label: m[1].trim(), value: parseNumber(m[2]), note: m[3].trim() } : null }).filter((x): x is { label: string; value: number; note: string } => !!x)
    return { title: b.title, unit: b.unit ?? '', rows }
  }, [src])
  const max = Math.max(1e-9, ...rows.map((r) => Math.abs(r.value)))
  if (rows.length === 0) return null
  return (
    <figure className="rich rich-bars">
      {title && <figcaption>{title}</figcaption>}
      <ul className="rb-list">
        {rows.map((r, i) => (
          <li key={r.label + i} style={{ animationDelay: `${i * 90}ms` }}>
            <span className="rb-label" title={r.label}>{r.label}</span>
            <span className="rb-track"><span className="rb-bar" style={{ width: `${(Math.abs(r.value) / max) * 100}%`, animationDelay: `${i * 90}ms` }} /></span>
            <span className="rb-value">{r.value.toLocaleString(undefined, { maximumFractionDigits: 3 })}{unit ? ` ${unit}` : ''}{r.note ? <span className="meta"> {r.note}</span> : null}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
