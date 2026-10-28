"""Record the review sample locally with Kokoro and measure its scene timings.

See README.md for the isolated Python environment and model downloads.
Only the finished AAC recording ships to the browser. No speech service,
model, or learner text is called from the learning portal.
"""
import hashlib
import json
import pathlib
import shutil
import subprocess

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

root = pathlib.Path(__file__).resolve().parent.parent
models = root / 'output/neural-voice'
work = root / 'output/explainer-audio/neural'
work.mkdir(parents=True, exist_ok=True)
if not shutil.which('afconvert'):
    raise SystemExit('AAC encoding needs macOS afconvert. The checked-in recording works on other platforms.')
for name, expected in {
    'kokoro-v1.0.onnx': '7d5df8ecf7d4b1878015a32686053fd0eebe2bc377234608764cc0ef3636a6c5',
    'voices-v1.0.bin': 'bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d',
}.items():
    path = models / name
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise SystemExit(f'Missing or unexpected {name}. Use the pinned model downloads in README.md.')

voice = 'af_heart'
model = Kokoro(str(models / 'kokoro-v1.0.onnx'), str(models / 'voices-v1.0.bin'))
# Write for the ear: contractions, a concrete question, and pauses at idea boundaries.
# Pauses are seconds after each recording; cues include that breathing room.
scenes = [
    ('intro', 'Your documents. A useful answer.', "Ever wondered how an AI assistant can answer questions about your own documents?", .22),
    ('question', 'Start with a real question.', "Let's say you ask, \"What's our refund policy?\"", .24),
    ('retrieve', 'Find the relevant passages.', 'First, it searches your documents and pulls out the passages that seem most relevant.', .18),
    ('context', 'Give the model evidence.', 'It sends those passages, along with your question, to a language model.', .18),
    ('answer', 'Draft an answer with a source.', 'The model uses that context to draft an answer, with a source you can check.', .24),
    ('review', 'Review before you act.', 'You review the source before deciding what to do.', .30),
    ('connect', 'Retrieval + generation = RAG.', 'That approach is called retrieval-augmented generation, or RAG.', .32),
    ('limits', 'Helpful context. Still worth checking.', 'It makes answers easier to check. But the documents, or the answer itself, can still be wrong.', .45),
]
rate = 24000
parts, cues = [], []
frame_count = 0
for key, title, text, pause in scenes:
    sound, generated_rate = model.create(text, voice=voice, speed=1.0, lang='en-us')
    if generated_rate != rate or not len(sound) or not np.isfinite(sound).all():
        raise RuntimeError(f'Invalid recording for {key}')
    # Tiny fades prevent clicks at clip joins without changing the spoken timing.
    fade = min(int(rate * .005), len(sound) // 2)
    sound[:fade] *= np.linspace(0, 1, fade)
    sound[-fade:] *= np.linspace(1, 0, fade)
    sf.write(work / f'{key}.wav', sound, rate, subtype='PCM_16')
    start = frame_count / rate
    silence = np.zeros(round(rate * pause), dtype=np.float32)
    parts.extend([sound, silence])
    frame_count += len(sound) + len(silence)
    cues.append(dict(id=key, title=title, text=text, start=round(start, 3), end=round(frame_count / rate, 3)))
    print(f'{key}: {len(sound) / rate:.2f}s + {pause:.2f}s pause', flush=True)

recording = np.concatenate(parts)
peak = float(np.max(np.abs(recording)))
if peak < .01:
    raise RuntimeError('Recording is unexpectedly quiet')
# One gain for the whole recording preserves natural emphasis, with 2 dB headroom.
recording *= 10 ** (-2 / 20) / peak
joined = work / 'rag-sample.wav'
sf.write(joined, recording, rate, subtype='PCM_16')
encoded = work / 'rag-sample.m4a'
subprocess.run(['afconvert', str(joined), str(encoded), '-f', 'm4af', '-d', 'aac ', '-b', '64000'], check=True)
# Content-addressed URL prevents a browser from replaying a cached older voice.
fingerprint = hashlib.sha256(encoded.read_bytes()).hexdigest()[:12]
asset = root / f'public/media/explainers/rag-sample-heart-{fingerprint}.m4a'
asset.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(encoded, asset)
data = {
    'title': 'How AI answers from your documents',
    'audio': '/' + asset.relative_to(root / 'public').as_posix(),
    'duration': round(frame_count / rate, 3),
    'voice': 'Kokoro-82M v1.0 / af_heart (synthetic neural voice)',
    'cues': cues,
}
(root / 'src/data/explainers/rag-sample.json').write_text(json.dumps(data, indent=2) + '\n')
print(f'Recorded {len(cues)} scenes, {data["duration"]:.1f}s, {asset.stat().st_size:,} bytes')
