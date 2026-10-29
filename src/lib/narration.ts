export interface NarrationCue { text: string; speaker?: string; start: number; end: number; speechEnd: number }
export interface NarrationRecording { audio: string; voice?: string; duration: number; cues: NarrationCue[] }

// Same canonical source in the authoring exporter and Markdown renderer. A source
// edit invalidates the recording rather than playing narration for an older scene.
export function narrationKey(source: string) {
  let hash = 14695981039346656037n
  for (const character of source.replace(/\r\n/g, '\n').trim()) {
    hash ^= BigInt(character.codePointAt(0)!)
    hash = BigInt.asUintN(64, hash * 1099511628211n)
  }
  return hash.toString(16).padStart(16, '0')
}

export function narrationScene(time: number, recording: NarrationRecording) {
  return Math.max(0, recording.cues.findLastIndex(cue => cue.start <= time))
}

export function animationTime(time: number, cue: NarrationCue, start: number, end: number, reduced: boolean) {
  if (reduced) return end
  const span = Math.max(.1, Math.min(end - start, (cue.speechEnd - cue.start) * .85))
  return start + (end - start) * Math.max(0, Math.min(1, (time - cue.start) / span))
}
