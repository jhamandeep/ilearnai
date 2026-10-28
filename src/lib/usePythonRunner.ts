import { useEffect, useRef, useState } from 'react'
import { pythonSandboxDocument } from './pythonRuntime'
import type { PythonCheck } from '../data/pythonExercises'

export interface PythonResult { label: string; passed: boolean }
export function usePythonRunner() {
  const [status, setStatus] = useState('Ready to run')
  const [busy, setBusy] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [errorStage, setErrorStage] = useState<'startup' | 'execution' | null>(null)
  const [results, setResults] = useState<PythonResult[]>([])
  const cleanup = useRef<(() => void) | null>(null)
  useEffect(() => () => cleanup.current?.(), [])
  function stop() { cleanup.current?.(); setBusy(false); setStatus('Stopped. You can edit and run again.'); setResults([]) }
  function clear() { setResults([]); setError(''); setErrorStage(null); setOutput(''); setStatus('Ready to run') }
  function run(code: string, checks: PythonCheck[], onPass: () => void) {
    cleanup.current?.()
    setOutput(''); setError(''); setErrorStage(null); setResults([])
    if (code.length > 100000) { setBusy(false); setErrorStage('execution'); setError('Keep this exercise under 100,000 characters.'); return }
    setBusy(true); setStatus('Loading Python… The first run needs an internet connection.')
    const token = crypto.randomUUID()
    const frame = document.createElement('iframe')
    frame.hidden = true; frame.title = 'Isolated Python execution'; frame.setAttribute('sandbox', 'allow-scripts')
    frame.srcdoc = pythonSandboxDocument(token)
    let timer: ReturnType<typeof setTimeout>
    let totalOutput = 0
    let phase: 'loading' | 'running' | 'finished' = 'loading'
    function finish() {
      phase = 'finished'; clearTimeout(timer)
      window.removeEventListener('message', receive)
      frame.contentWindow?.postMessage({ type: 'stop', token }, '*')
      frame.remove(); cleanup.current = null
    }
    function deadline(ms: number, message: string) {
      clearTimeout(timer)
      timer = setTimeout(() => { setErrorStage(phase === 'loading' ? 'startup' : 'execution'); finish(); setBusy(false); setError(message); setStatus('Run ended') }, ms)
    }
    function receive(event: MessageEvent) {
      if (event.source !== frame.contentWindow || event.data?.token !== token || phase === 'finished') return
      const data = event.data
      if (data.type === 'ready' && phase === 'loading') frame.contentWindow?.postMessage({ type: 'run', token, code, checks }, '*')
      if (data.type === 'running' && phase === 'loading') { phase = 'running'; setStatus('Running your code…'); deadline(10000, 'Stopped after 10 seconds. Check for a loop that never ends, or use a smaller input.') }
      if (data.type === 'output' && typeof data.text === 'string') {
        const text = data.text.slice(0, Math.max(0, 16000 - totalOutput)); totalOutput += text.length
        if (text) setOutput(previous => previous + text + '\n')
      }
      if (data.type === 'error') { const stage = phase === 'loading' || data.stage === 'startup' ? 'startup' : 'execution'; finish(); setBusy(false); setErrorStage(stage); setError(String(data.text).slice(-5000)); setStatus(stage === 'startup' ? 'Python did not load. Your code has not run.' : 'Check the error below, then try again.') }
      if (data.type === 'done' && phase === 'running' && Array.isArray(data.results)) {
        const checked = checks.map((check, index) => ({ label: check.label, passed: data.results[index]?.passed === true }))
        finish(); setBusy(false); setResults(checked); setStatus('Run complete')
        if (checked.length && checked.every(check => check.passed)) onPass()
      }
    }
    cleanup.current = finish
    window.addEventListener('message', receive)
    deadline(60000, 'Python did not load within a minute. Check your connection, allow the runtime download, and retry.')
    document.body.append(frame)
  }
  return { status, busy, output, error, errorStage, results, run, stop, clear }
}
