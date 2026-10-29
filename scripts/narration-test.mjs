import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'vite'
import { collectNarration } from './export-narration.mjs'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
try {
  const entries = await collectNarration(vite)
  const manifest = JSON.parse(await readFile('src/data/narration.json'))
  const { narrationKey, animationTime } = await vite.ssrLoadModule('/src/lib/narration.ts')
  const { dedent } = await vite.ssrLoadModule('/src/components/rich/index.tsx')
  assert.deepEqual(new Set(Object.keys(manifest)), new Set(entries.map(entry => entry.key)), 'Every current explainer needs its own current recording')
  let seconds = 0, scenes = 0
  const urls = new Set()
  for (const entry of entries) {
    assert.equal(narrationKey(dedent(entry.source) + '\n'), entry.key, 'Markdown and authoring source keys must agree')
    const recording = manifest[entry.key]
    assert.ok(!manifest[narrationKey(entry.source + '\nstep: A changed explanation.')], 'A changed script must never reuse stale speech')
    assert.equal(recording.cues.length, entry.texts.length)
    assert.match(recording.audio, /^\/media\/narration\/[a-f0-9]+-[a-f0-9]+\.m4a$/)
    assert.ok(!urls.has(recording.audio), 'Different explainers must not share an unrelated recording'); urls.add(recording.audio)
    assert.ok((await stat(`public${recording.audio}`)).size > 1000, `${entry.title}: empty recording`)
    assert.equal(recording.cues[0].start, 0)
    assert.equal(recording.cues.at(-1).end, recording.duration)
    for (const [index, cue] of recording.cues.entries()) {
      assert.equal(cue.text, entry.texts[index], `${entry.title}: caption differs from its authored narration`)
      assert.ok(cue.start < cue.speechEnd && cue.speechEnd < cue.end, `${entry.title}: invalid speech timing`)
      if (index) assert.equal(recording.cues[index - 1].end, cue.start)
      // Long actions fit inside narration; short actions finish and hold. Reduced
      // motion shows the completed state without running a separate clock.
      assert.equal(animationTime(cue.start, cue, 5, 20, false), 5)
      assert.equal(animationTime(cue.speechEnd, cue, 5, 20, false), 20)
      assert.equal(animationTime(cue.start, cue, 5, 20, true), 20)
      scenes++
    }
    seconds += recording.duration
  }
  console.log(`PASS ${entries.length} current recordings; ${scenes} narrated scenes; ${(seconds / 60).toFixed(1)} minutes. All lesson/work/lab/style sources match their cue sheets and assets; no stale, missing, duplicate, or orphan recordings in the manifest.`)
} finally { await vite.close() }
