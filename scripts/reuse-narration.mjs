// Geometry-only edits can reuse the approved audio, but never changed speech.
// Run after narration:export. All entries must match before anything is written.
import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const entries = JSON.parse(await readFile('output/narration/scripts.json'))
const existing = JSON.parse(await readFile('src/data/narration.json'))
const bySpeech = new Map()
for (const recording of Object.values(existing)) {
  const signature = JSON.stringify(recording.cues.map(c => c.text))
  const matches = bySpeech.get(signature) ?? []
  matches.push(recording)
  bySpeech.set(signature, matches)
}
const next = {}, files = new Set()
let rekeyed = 0
for (const entry of entries) {
  const signature = JSON.stringify(entry.texts)
  const exact = existing[entry.key]
  const matches = bySpeech.get(signature) ?? []
  const recording = exact && JSON.stringify(exact.cues.map(c => c.text)) === signature ? exact : matches.length === 1 ? matches[0] : null
  assert.ok(recording, `${entry.title}: speech changed or ambiguous; rebuild narration first`)
  assert.ok(!files.has(recording.audio), `${entry.title}: reused audio would duplicate another explainer`)
  await readFile(`public${recording.audio}`)
  files.add(recording.audio)
  next[entry.key] = recording
  if (!exact) rekeyed++
}
await writeFile('src/data/narration.json', JSON.stringify(next) + '\n')
console.log(`Reused ${entries.length} verified recordings; updated ${rekeyed} geometry keys. No audio regenerated.`)
