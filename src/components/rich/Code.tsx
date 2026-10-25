import { useMemo, useState } from 'react'

// :::code
// lang: python
// file: hello.py        (optional)
// print("hello")
// :::
// Lines after the header lines are the code, indentation preserved.
export function Code({ src }: { src: string }) {
  const { lang, file, code } = useMemo(() => {
    const lines = src.replace(/\n$/, '').split('\n')
    let lang = 'text'
    let file = ''
    let i = 0
    for (; i < lines.length; i++) {
      const m = /^(lang|file)\s*:\s*(.*)$/.exec(lines[i].trim())
      if (!m) break
      if (m[1] === 'lang') lang = m[2].trim()
      else file = m[2].trim()
    }
    return { lang, file, code: lines.slice(i).join('\n') }
  }, [src])
  const [copied, setCopied] = useState(false)
  function copy() {
    try {
      void navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch { /* clipboard not available */ }
  }
  const label = lang === 'bash' || lang === 'sh' || lang === 'shell' ? 'Terminal' : lang === 'text' ? 'Output' : lang
  return (
    <figure className="rich rich-code">
      <figcaption className="code-head">
        <span className="code-lang">{label}</span>
        {file && <span className="code-file">{file}</span>}
        <button className="btn btn-ghost btn-sm" onClick={copy} style={{ marginLeft: 'auto' }}>{copied ? 'Copied' : 'Copy'}</button>
      </figcaption>
      <pre className={`code-pre lang-${lang}`}><code>{code}</code></pre>
    </figure>
  )
}
