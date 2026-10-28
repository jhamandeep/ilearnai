// Code checks: real Python/WASM execution plus DOM interactions. No browser renderer.
import assert from 'node:assert/strict'
import { loadPyodide } from 'pyodide'
import { createServer } from 'vite'
import { Window } from 'happy-dom'
import { createElement, act, useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

const vite = await createServer({ cacheDir: 'node_modules/.vite-workspace-test', server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
const window = new Window({ url: 'http://localhost/', settings: { disableIframePageLoading: true, enableJavaScriptEvaluation: false } })
let root
try {
  const { pythonExercises } = await vite.ssrLoadModule('/src/data/pythonExercises.ts')
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { openResources } = await vite.ssrLoadModule('/src/data/openResources.ts')
  const { resources, tools } = await vite.ssrLoadModule('/src/data/resources.ts')
  const { Resources } = await vite.ssrLoadModule('/src/pages/Resources.tsx')
  const { industries } = await vite.ssrLoadModule('/src/data/work/industries.ts')
  const { workQuestion } = await vite.ssrLoadModule('/src/data/work/questions.ts')
  const { WorkQuestions } = await vite.ssrLoadModule('/src/components/WorkQuestions.tsx')
  const { pythonSandboxDocument } = await vite.ssrLoadModule('/src/lib/pythonRuntime.ts')
  let stdout = []
  const py = await loadPyodide({ stdout: text => stdout.push(text) })
  let checks = 0
  for (const exercise of pythonExercises) {
    assert.ok(tracks.find(track => track.slug === exercise.track)?.modules.find(module => module.slug === exercise.module), `Missing chapter: ${exercise.id}`)
    assert.ok(exercise.task && exercise.hint && exercise.example && exercise.takeaway)
    const namespace = py.runPython('dict()')
    const check = expression => { try { return py.runPython(`bool(${expression})`, { globals: namespace }) === true } catch { return false } }
    try {
      await py.runPythonAsync(exercise.starter, { globals: namespace })
      assert.ok(exercise.checks.some(item => !check(item.expression)), `${exercise.id}: untouched starter must not pass`)
      namespace.clear(); stdout = []
      await py.runPythonAsync(exercise.solution, { globals: namespace })
      for (const item of exercise.checks) { assert.ok(check(item.expression), `${exercise.id}: ${item.label}`); checks++ }
      assert.ok(stdout.length, `${exercise.id}: worked solution needs visible output`)
    } finally { namespace.destroy() }
  }
  assert.equal(new Set(openResources.map(item => item.url)).size, openResources.length)
  for (const item of openResources) assert.equal([...resources, ...tools].filter(other => other.url === item.url).length, 1, `New resource duplicated: ${item.title}`)
  const renderResources = location => renderToString(createElement(StaticRouter, { location }, createElement(Resources)))
  const openHtml = renderResources('/resources?collection=open-source')
  for (const item of openResources) {
    assert.ok(item.firstTask && item.setup && item.openSource && item.checkedOn)
    assert.ok(tracks.some(track => track.slug === item.track))
    assert.ok(openHtml.includes(item.title.replaceAll('&', '&amp;')))
    assert.ok((item.repoUrl ?? item.url).startsWith('https://github.com/'))
  }
  const visualHtml = renderResources('/resources?kind=visualization')
  assert.equal((visualHtml.match(/data-resource-track=/g) ?? []).length, openResources.filter(item => item.kind === 'visualization').length)
  const sandbox = pythonSandboxDocument('test-token')
  assert.ok(sandbox.includes("worker-src data:"))
  assert.ok(!sandbox.includes('URL.createObjectURL'), 'Opaque-origin module workers must not use blob:null URLs')
  assert.ok(sandbox.includes("connect-src https://cdn.jsdelivr.net"))
  assert.ok(sandbox.includes("new Worker(url, {type:'module'})"))
  assert.ok(sandbox.includes('worker?.terminate()'))
  const source = sandbox.match(/<script>([\s\S]*)<\/script>/)[1]
  new Function(source) // Validate nested quoting without executing the frame script.

  for (const name of ['window', 'document', 'HTMLElement', 'Node', 'Event', 'MouseEvent', 'MessageEvent']) globalThis[name] = name === 'window' ? window : name === 'document' ? window.document : window[name]
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = await import('react-dom/client')
  const container = document.createElement('div'); document.body.append(container); root = createRoot(container)
  let decisions = 0
  for (const industry of industries) for (const item of industry.cases) {
    const caseKey = `${industry.slug}/${item.slug}`
    const question = workQuestion(caseKey)
    assert.ok(question && new Set(question.options).size === 3, caseKey)
    await act(() => root.render(createElement(WorkQuestions, { caseKey, item, key: caseKey })))
    const checkButton = () => [...container.querySelectorAll('button')].find(button => button.textContent === 'Check my answer')
    assert.equal(checkButton().disabled, true)
    const wrong = (question.correct + 1) % 3
    await act(() => container.querySelectorAll('input')[wrong].click())
    await act(() => checkButton().click())
    assert.equal(container.querySelector('[role="status"]').dataset.correct, 'false')
    assert.ok(container.textContent.includes(question.explanation))
    await act(() => container.querySelectorAll('input')[question.correct].click())
    assert.equal(container.querySelector('[role="status"]'), null, 'Old feedback must clear after changing an answer')
    await act(() => checkButton().click())
    assert.equal(container.querySelector('[role="status"]').dataset.correct, 'true')
    decisions++
  }

  const { usePythonRunner } = await vite.ssrLoadModule('/src/lib/usePythonRunner.ts')
  let runner, passCount = 0
  function Harness() { const value = usePythonRunner(); useEffect(() => { runner = value }); return createElement('div', null, value.status) }
  await act(() => root.render(createElement(Harness)))
  await act(() => runner.run('print(42)', [{ label: 'Example', expression: 'True' }], () => passCount++))
  const frame = document.querySelector('iframe')
  assert.equal(frame.getAttribute('sandbox'), 'allow-scripts', 'Execution frame must not share the app origin')
  const token = frame.srcdoc.match(/const token = "([^"]+)"/)[1]
  const message = (data, source = frame.contentWindow) => act(() => window.dispatchEvent(new window.MessageEvent('message', { source, data: { token, ...data } })))
  await message({ type: 'error', text: 'spoofed' }, window)
  assert.equal(runner.error, '', 'Reject messages from another source')
  await message({ type: 'running' })
  await message({ type: 'output', text: '42' })
  await message({ type: 'done', results: [{ passed: true }] })
  assert.equal(runner.output.trim(), '42'); assert.equal(passCount, 1); assert.equal(runner.busy, false)
  assert.equal(document.querySelector('iframe'), null, 'Completed execution must be torn down')
  await message({ type: 'error', text: 'late result' }, frame.contentWindow)
  assert.equal(runner.error, '')
  await act(() => runner.run('while True: pass', [], () => {}))
  await act(() => runner.stop())
  assert.equal(document.querySelector('iframe'), null, 'Stop must remove the execution frame')
  assert.equal(runner.busy, false)
  // Trigger the deadline callbacks without waiting a minute or running a browser.
  const originalTimeout = globalThis.setTimeout
  let expired
  try {
    globalThis.setTimeout = (callback, delay, ...args) => {
      if (delay === 60000 || delay === 10000) expired = { callback, delay }
      return originalTimeout(callback, delay, ...args)
    }
    await act(() => runner.run('while True: pass', [], () => {}))
    assert.equal(expired.delay, 60000)
    await act(() => expired.callback())
    assert.equal(runner.busy, false); assert.match(runner.error, /did not load/)
    await act(() => runner.run('while True: pass', [], () => {}))
    const timedFrame = document.querySelector('iframe')
    const timedToken = timedFrame.srcdoc.match(/const token = "([^"]+)"/)[1]
    await act(() => window.dispatchEvent(new window.MessageEvent('message', { source: timedFrame.contentWindow, data: { token: timedToken, type: 'running' } })))
    assert.equal(expired.delay, 10000)
    await act(() => expired.callback())
    assert.equal(runner.busy, false); assert.match(runner.error, /10 seconds/)
    assert.equal(document.querySelector('iframe'), null)
  } finally { globalThis.setTimeout = originalTimeout }
  await act(() => runner.run('print(1)', [], () => {}))
  await act(() => root.unmount()); root = null
  assert.equal(document.querySelector('iframe'), null, 'Navigation/unmount must cancel execution')
  console.log(`PASS: ${pythonExercises.length} Python solutions / ${checks} real WASM checks; starters fail meaningfully; ${decisions} decision questions reject wrong answers and explain correct ones; ${openResources.length} curated resources; library filters; isolated-runner message validation, completion, stop and navigation cleanup. Browser rendering/CSP execution not tested.`)
} finally {
  if (root) await act(() => root.unmount())
  await vite.close(); await window.happyDOM.close()
  delete globalThis.IS_REACT_ACT_ENVIRONMENT
}
