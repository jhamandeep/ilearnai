import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching } from '@codemirror/language'
import { python } from '@codemirror/lang-python'

export function PythonEditor({ initialCode, onChange }: { initialCode: string; onChange: (code: string) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const change = useRef(onChange)
  useEffect(() => { change.current = onChange }, [onChange])
  useEffect(() => {
    if (!host.current) return
    const editor = new EditorView({ parent: host.current, state: EditorState.create({ doc: initialCode, extensions: [
      lineNumbers(), history(), drawSelection(), highlightActiveLine(), indentOnInput(), bracketMatching(), python(), syntaxHighlighting(defaultHighlightStyle),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.contentAttributes.of({ 'aria-label': 'Python code editor', 'aria-describedby': 'python-keyboard-help', spellcheck: 'false' }),
      EditorView.updateListener.of(update => { if (update.docChanged) change.current(update.state.doc.toString()) }),
      EditorView.theme({ '&': { backgroundColor: '#fff', color: '#202124', fontSize: '14px' }, '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', minHeight: '300px', padding: '16px 0' }, '.cm-scroller': { overflow: 'auto' }, '.cm-gutters': { background: '#f5f6f8', color: '#68707c', border: 'none' }, '.cm-activeLine': { background: '#f3f6fb' }, '&.cm-focused': { outline: '2px solid #1a73e8', outlineOffset: '-2px' }, '.cm-cursor': { borderLeftColor: '#202124' } }),
    ] }) })
    return () => editor.destroy()
  }, [initialCode])
  return <div ref={host} className="python-editor" />
}
