"""Render all approved-voice explainers. Run export-narration.mjs first.

Resumable: unchanged spoken segments are reused from ignored output/narration.
The browser receives AAC recordings and cue sheets, never the neural model.
"""
import concurrent.futures
import hashlib
import json
import pathlib
import re
import subprocess
import sys

import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
WORK = ROOT / 'output/narration'
CACHE = WORK / 'segments'
RATE = 24000
VOICE = 'af_heart'
MODEL = None


def spoken(text):
    # Expand notation for the ear while retaining the original labels in the diagram.
    replacements = {'→': ' to ', '×': ' times ', '²': ' squared ', '³': ' cubed ', '∇': 'gradient ', 'α': 'alpha', 'β': 'beta', 'η': 'eta', '≤': ' less than or equal to ', '≥': ' greater than or equal to ', '≈': ' approximately ', '≠': ' is not equal to '}
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r'\$(\d[\d.,]*)', r'\1 dollars', text)
    text = re.sub(r'\^2\b', ' squared', text)
    text = re.sub(r'\^3\b', ' cubed', text)
    text = text.replace('=', ' equals ').replace(' + ', ' plus ').replace(' - ', ' minus ').replace(' || ', ' compared with ')
    units = {'GB': 'gigabytes', 'MB': 'megabytes', 'KB': 'kilobytes', 'TB/s': 'terabytes per second', 'MiB': 'mebibytes', 'ms': 'milliseconds', 'USD': 'US dollars', 'QPS': 'queries per second', 'TFLOPS': 'tera flops', 'FLOPS': 'flops'}
    for old, new in units.items():
        text = re.sub(r'(?<!\w)' + re.escape(old) + r'(?!\w)', new, text)
    # A space separates acronym letters without changing ordinary words (RAG/JSON).
    for acronym in ['API', 'CPU', 'GPU', 'GPUs', 'KV', 'MSE', 'DNS', 'IP', 'URL', 'SDK', 'MCP', 'SLO', 'TTFT', 'TPOT', 'MHA', 'MQA', 'GQA', 'KL', 'RRF', 'BGR', 'RGB']:
        letters = ' '.join(acronym.rstrip('s')) + ('s' if acronym.endswith('s') else '')
        text = re.sub(r'\b' + acronym + r'\b', letters, text)
    text = re.sub(r'(?<=\w)_(?=\w)', ' ', text)
    text = text.replace('`', '').replace('“', '"').replace('”', '"')
    return re.sub(r'\s+', ' ', text).strip()


def segment_key(text):
    return hashlib.sha256(('kokoro-v1.0/af_heart/1.0/normalize-v1/' + text).encode()).hexdigest()[:24]


def initialize():
    global MODEL
    import onnxruntime as rt
    from kokoro_onnx import Kokoro
    options = rt.SessionOptions()
    options.intra_op_num_threads = 2
    options.inter_op_num_threads = 1
    session = rt.InferenceSession(str(ROOT / 'output/neural-voice/kokoro-v1.0.onnx'), sess_options=options, providers=['CPUExecutionProvider'])
    MODEL = Kokoro.from_session(session, str(ROOT / 'output/neural-voice/voices-v1.0.bin'))


def record(text):
    key = segment_key(text)
    path = CACHE / f'{key}.wav'
    if path.exists():
        return key
    sound, rate = MODEL.create(text, voice=VOICE, speed=1.0, lang='en-us')
    if rate != RATE or not np.isfinite(sound).all() or len(sound) < RATE * .25 or np.max(np.abs(sound)) < .01:
        raise RuntimeError(f'Invalid recording: {text}')
    fade = min(int(RATE * .005), len(sound) // 2)
    sound[:fade] *= np.linspace(0, 1, fade)
    sound[-fade:] *= np.linspace(1, 0, fade)
    temporary = path.with_suffix('.tmp.wav')
    sf.write(temporary, sound, RATE, subtype='PCM_16')
    temporary.replace(path)
    return key


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    entries = json.loads((WORK / 'scripts.json').read_text())
    partial = '--assemble-available' in sys.argv
    if partial:
        entries = [entry for entry in entries if all((CACHE / f'{segment_key(spoken(text))}.wav').exists() for text in entry['texts'])]
    texts = list(dict.fromkeys(spoken(text) for entry in entries for text in entry['texts']))
    pending = [text for text in texts if not (CACHE / f'{segment_key(text)}.wav').exists()]
    print(f'{len(entries)} explainers; {len(texts)} unique spoken scenes; {len(pending)} to record.', flush=True)
    if pending:
        with concurrent.futures.ProcessPoolExecutor(max_workers=4, initializer=initialize) as pool:
            for index, _ in enumerate(pool.map(record, pending), 1):
                if index % 25 == 0 or index == len(pending):
                    print(f'Recorded {index}/{len(pending)} new scenes', flush=True)
    manifest = {}
    assets = ROOT / 'public/media/narration'
    assets.mkdir(parents=True, exist_ok=True)
    for entry in entries:
        parts, cues, count = [], [], 0
        for index, original in enumerate(entry['texts']):
            text = spoken(original)
            sound, rate = sf.read(CACHE / f'{segment_key(text)}.wav', dtype='float32')
            assert rate == RATE
            pause = .4 if index == len(entry['texts']) - 1 else [.22, .24, .18, .28][index % 4]
            silence = np.zeros(round(RATE * pause), dtype=np.float32)
            cues.append({'text': original, 'start': round(count / RATE, 3), 'speechEnd': round((count + len(sound)) / RATE, 3), 'end': round((count + len(sound) + len(silence)) / RATE, 3)})
            count += len(sound) + len(silence)
            parts.extend([sound, silence])
        joined = np.concatenate(parts)
        joined *= 10 ** (-2 / 20) / float(np.max(np.abs(joined)))
        wav = WORK / f'{entry["key"]}.wav'
        encoded = WORK / f'{entry["key"]}.m4a'
        sf.write(wav, joined, RATE, subtype='PCM_16')
        subprocess.run(['afconvert', str(wav), str(encoded), '-f', 'm4af', '-d', 'aac ', '-b', '64000'], check=True)
        fingerprint = hashlib.sha256(encoded.read_bytes()).hexdigest()[:12]
        asset = assets / f'{entry["key"]}-{fingerprint}.m4a'
        asset.write_bytes(encoded.read_bytes())
        manifest[entry['key']] = {'audio': '/' + asset.relative_to(ROOT / 'public').as_posix(), 'duration': round(count / RATE, 3), 'cues': cues}
    destination = ROOT / 'src/data/narration.json'
    destination.write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')) + '\n')
    report = {'voice': 'Kokoro-82M v1.0 / af_heart', 'recordings': len(manifest), 'scenes': sum(len(item['cues']) for item in manifest.values()), 'seconds': round(sum(item['duration'] for item in manifest.values())), 'bytes': sum((ROOT / 'public' / item['audio'].lstrip('/')).stat().st_size for item in manifest.values())}
    (WORK / ('partial-report.json' if partial else 'report.json')).write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report), flush=True)


if __name__ == '__main__':
    main()
