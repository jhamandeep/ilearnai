// Execute eligible, self-contained reference solutions in real Python/WASM.
// This establishes runtime compatibility, not that an exercise is auto-graded.
import { createServer } from 'vite'
import { loadPyodide } from 'pyodide'
import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const refresh = process.argv.includes('--refresh')
const vite = await createServer({ cacheDir: 'node_modules/.vite-lesson-python', server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
try {
  const { tracks } = await vite.ssrLoadModule('/src/data/curriculum.ts')
  const { lessonActivities } = await vite.ssrLoadModule('/src/lib/activities.ts')
  const { parseExercise, exerciseFingerprint } = await vite.ssrLoadModule('/src/lib/exercise.ts')
  const path = new URL('../src/data/lessonPythonSupport.json', import.meta.url)
  const existing = JSON.parse(await readFile(path, 'utf8')), supported = {}, coverage = {}, skipped = []
  let output = []
  const py = await loadPyodide({ stdout: line => { if (output.join('').length > 16000) throw Error('Output limit'); output.push(line) }, stderr: () => {} })
  py.runPython(`
import ast, sys, time
allowed = {'math','random','statistics','collections','itertools','functools','fractions','decimal','json','csv','io','datetime','re','string'}
def compatible(source):
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.Import) and any(alias.name.split('.')[0] not in allowed for alias in node.names):
            return False
        if isinstance(node, ast.ImportFrom) and (not node.module or node.module.split('.')[0] not in allowed):
            return False
        if isinstance(node, ast.Name) and node.id in {'input','open','eval','exec','compile','__import__','globals','locals','getattr'}:
            return False
        if isinstance(node, ast.Attribute) and node.attr.startswith('__'):
            return False
    return True
def run_reference(source):
    deadline = time.monotonic() + 2
    def budget(frame, event, arg):
        if time.monotonic() > deadline:
            raise RuntimeError('Reference exceeds two-second audit budget')
        return budget
    sys.settrace(budget)
    try:
        exec(source, {})
    finally:
        sys.settrace(None)
`)
  for (const track of tracks) for (const module of track.modules) for (const lesson of module.lessons) {
    const route = `/courses/${track.slug}/${module.slug}/${lesson.slug}`
    for (const activity of lessonActivities(lesson, route).filter(item => item.kind === 'exercise')) {
      const parsed = parseExercise(activity.body.replace(/^:::exercise\s*\n/, '').replace(/\n:::\s*$/, ''))
      if (parsed.lang !== 'python') continue
      const key = `${route}/${activity.id}`
      if (!refresh && !existing[key]) continue
      try {
        py.globals.set('candidate', parsed.solution)
        if (!py.runPython('compatible(candidate)')) throw Error('Requires project dependencies or external input')
        output = []
        await py.runPythonAsync('run_reference(candidate)')
        if (!output.length) throw Error('Reference produces no visible output')
        supported[key] = exerciseFingerprint(parsed.solution)
        coverage[track.slug] = (coverage[track.slug] ?? 0) + 1
      } catch (error) { skipped.push({ key, reason: String(error).split('\n').slice(-3).join(' ') }) }
    }
  }
  if (refresh) await writeFile(path, JSON.stringify(supported, null, 2) + '\n')
  else assert.deepEqual(supported, existing, `A reference changed or failed: ${JSON.stringify(skipped)}`)
  console.log(JSON.stringify({ supported: Object.keys(supported).length, coverage, skipped: skipped.length }))
  if (refresh) await writeFile(new URL('../output/lesson-python-skipped.json', import.meta.url), JSON.stringify(skipped, null, 2))
} finally { await vite.close() }
