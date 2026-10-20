import { useMemo } from 'react'
import { parseBlock, parseNumber } from './parse'

export function Matrix({ src }: { src: string }) {
  const { title, cols, rows } = useMemo(() => {
    const b = parseBlock(src)
    let cols: string[] = []
    const rows: { label: string; values: number[] }[] = []
    for (const l of b.lines) {
      const cm = /^cols?\s*:\s*(.*)$/.exec(l)
      if (cm) { cols = cm[1].split(',').map((s) => s.trim()); continue }
      const rm = /^(.+?)\s*:\s*(.*)$/.exec(l)
      if (rm) rows.push({ label: rm[1].trim(), values: rm[2].split(',').map((s) => parseNumber(s.trim())) })
    }
    return { title: b.title, cols, rows }
  }, [src])
  const all = rows.flatMap((r) => r.values)
  const min = Math.min(0, ...all)
  const max = Math.max(min + 1e-9, ...all)
  const n = Math.max(cols.length, ...rows.map((r) => r.values.length))
  if (rows.length === 0) return null
  return (
    <figure className="rich rich-matrix">
      {title && <figcaption>{title}</figcaption>}
      <div className="rich-scroll">
        <div className="mx" style={{ gridTemplateColumns: `auto repeat(${n}, minmax(44px, 1fr))` }}>
          <div />
          {Array.from({ length: n }, (_, j) => <div key={j} className="mx-head">{cols[j] ?? ''}</div>)}
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className="mx-head mx-row">{r.label}</div>
              {Array.from({ length: n }, (_, j) => {
                const v = r.values[j] ?? 0
                const w = (v - min) / (max - min)
                return <div key={j} className="mx-cell" style={{ ['--w' as string]: w, animationDelay: `${(i * n + j) * 25}ms` }} title={`${r.label} × ${cols[j] ?? j}: ${v}`}>{Number.isInteger(v) ? v : v.toFixed(2)}</div>
              })}
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}
