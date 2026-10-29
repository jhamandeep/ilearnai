"""Generate two-teacher recordings, then publish complete cue sheets atomically.

Build-time only: edge-tts uses online neural voices. Learners download finished
AAC files; no text, speech-service credentials or model is sent by the portal.
Install scripts/requirements-narration.txt in an isolated environment. Resume
by rerunning: cache keys include voice, rate, pronunciation version and text.
"""
import asyncio
import hashlib
import json
import pathlib
import subprocess
import sys
import numpy as np
import soundfile as sf
import edge_tts
from narration_speech import spoken, speaker_for, VERSION

ROOT = pathlib.Path(__file__).resolve().parent.parent
WORK = ROOT / 'output/narration'
CACHE = WORK / 'teaching-segments'
RATE = 24000
VOICES = {'female': 'en-US-AvaMultilingualNeural', 'male': 'en-US-AndrewMultilingualNeural'}
SPEED = '-3%'


def segment_key(text, speaker):
    return hashlib.sha256(f'edge/{VOICES[speaker]}/{SPEED}/{VERSION}/{text}'.encode()).hexdigest()[:24]


async def record(text, speaker):
    path = CACHE / f'{segment_key(text, speaker)}.wav'
    if path.exists():
        return
    mp3 = path.with_suffix('.mp3')
    for attempt in range(4):
        try:
            await asyncio.wait_for(edge_tts.Communicate(text, VOICES[speaker], rate=SPEED).save(str(mp3)), 50)
            sound, rate = sf.read(mp3, dtype='float32')
            if rate != RATE or sound.ndim != 1 or not np.isfinite(sound).all() or len(sound) < RATE * .25 or np.max(np.abs(sound)) < .01:
                raise RuntimeError(f'Invalid recording for {speaker}: {text}')
            # Remove service padding, keep audible breaths and a short lead-in.
            active = np.flatnonzero(np.abs(sound) > .003)
            sound = sound[max(0, active[0] - int(RATE * .06)):min(len(sound), active[-1] + int(RATE * .12))]
            fade = min(int(RATE * .005), len(sound) // 2)
            sound[:fade] *= np.linspace(0, 1, fade)
            sound[-fade:] *= np.linspace(1, 0, fade)
            temporary = path.with_suffix('.tmp.wav')
            sf.write(temporary, sound, RATE, subtype='PCM_16')
            temporary.replace(path)
            mp3.unlink(missing_ok=True)
            return
        except Exception:
            if attempt == 3:
                raise
            await asyncio.sleep(2 ** (attempt + 1))


async def generate(entries):
    tasks = list(dict.fromkeys((spoken(text), speaker_for(i)) for entry in entries for i, text in enumerate(entry['texts'])))
    pending = [(text, speaker) for text, speaker in tasks if not (CACHE / f'{segment_key(text, speaker)}.wav').exists()]
    print(f'{len(entries)} explainers; {len(tasks)} unique voice segments; {len(pending)} to record.', flush=True)
    semaphore = asyncio.Semaphore(10)
    completed = 0
    async def one(text, speaker):
        nonlocal completed
        async with semaphore:
            await record(text, speaker)
        completed += 1
        if completed % 25 == 0 or completed == len(pending):
            print(f'Recorded {completed}/{len(pending)} scenes', flush=True)
    await asyncio.gather(*(one(text, speaker) for text, speaker in pending))


def assemble(entry, directory='narration'):
    parts, cues, count = [], [], 0
    for index, original in enumerate(entry['texts']):
        speaker = speaker_for(index)
        text = spoken(original)
        sound, rate = sf.read(CACHE / f'{segment_key(text, speaker)}.wav', dtype='float32')
        assert rate == RATE and np.isfinite(sound).all()
        # Small RMS correction between teachers; preserve emphasis inside a turn.
        voiced = sound[np.abs(sound) > .012]
        rms = float(np.sqrt(np.mean(voiced ** 2)))
        gain = min(1.6, .12 / max(.01, rms), .85 / float(np.max(np.abs(sound))))
        sound *= gain
        next_speaker = speaker_for(index + 1)
        pause = .5 if index == len(entry['texts']) - 1 else .38 if speaker != next_speaker else .23
        silence = np.zeros(round(RATE * pause), dtype=np.float32)
        cues.append({'text': original, 'speaker': speaker, 'start': round(count / RATE, 3), 'speechEnd': round((count + len(sound)) / RATE, 3), 'end': round((count + len(sound) + len(silence)) / RATE, 3)})
        count += len(sound) + len(silence)
        parts.extend([sound, silence])
    joined = np.concatenate(parts)
    if np.max(np.abs(joined)) > .99:
        raise RuntimeError('Audio would clip')
    wav = WORK / f'{entry["key"]}-teaching.wav'
    encoded = wav.with_suffix('.m4a')
    sf.write(wav, joined, RATE, subtype='PCM_16')
    subprocess.run(['afconvert', str(wav), str(encoded), '-f', 'm4af', '-d', 'aac ', '-b', '64000'], check=True)
    fingerprint = hashlib.sha256(encoded.read_bytes()).hexdigest()[:12]
    asset = ROOT / f'public/media/{directory}/{entry["key"]}-{fingerprint}.m4a'
    asset.parent.mkdir(parents=True, exist_ok=True)
    asset.write_bytes(encoded.read_bytes())
    return {'audio': '/' + asset.relative_to(ROOT / 'public').as_posix(), 'duration': round(count / RATE, 3), 'voice': 'Ava and Andrew · synthetic teaching voices', 'cues': cues}


def atomic_json(path, data):
    temporary = path.with_suffix('.tmp.json')
    temporary.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    temporary.replace(path)


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    entries = json.loads((WORK / 'scripts.json').read_text())
    sample_path = ROOT / 'src/data/explainers/rag-sample.json'
    sample = json.loads(sample_path.read_text())
    preview = {'key': 'rag-sample-teaching', 'texts': [cue['text'] for cue in sample['cues']]}
    asyncio.run(generate([*entries, preview]))
    if '--record-only' in sys.argv:
        return
    manifest = {entry['key']: assemble(entry) for entry in entries}
    # No partial manifest: all assets must exist before either current sheet changes.
    updated_sample = assemble(preview, 'explainers')
    updated_sample['title'] = sample['title']
    for new, old in zip(updated_sample['cues'], sample['cues']):
        new.update(id=old['id'], title=old['title'])
    atomic_json(ROOT / 'src/data/narration.json', manifest)
    atomic_json(sample_path, updated_sample)
    report = {'voices': VOICES, 'normalization': VERSION, 'recordings': len(manifest), 'scenes': sum(len(item['cues']) for item in manifest.values()), 'seconds': round(sum(item['duration'] for item in manifest.values())), 'bytes': sum((ROOT / 'public' / item['audio'].lstrip('/')).stat().st_size for item in manifest.values())}
    atomic_json(WORK / 'teaching-report.json', report)
    print(json.dumps(report), flush=True)


if __name__ == '__main__':
    main()
