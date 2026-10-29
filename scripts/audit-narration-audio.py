"""Decode final AAC assets and check their measured cues, not just file existence."""
import hashlib
import json
import pathlib
import subprocess
import tempfile
import numpy as np
import soundfile as sf

root = pathlib.Path(__file__).resolve().parent.parent
recordings = list(json.loads((root / 'src/data/narration.json').read_text()).values())
recordings.append(json.loads((root / 'src/data/explainers/rag-sample.json').read_text()))
scenes = 0
highest_peak = 0
with tempfile.TemporaryDirectory(prefix='ilearnai-audio-audit-') as work:
    for i, recording in enumerate(recordings):
        asset = root / 'public' / recording['audio'].lstrip('/')
        fingerprint = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
        assert asset.stem.endswith(fingerprint), f'Content hash mismatch: {asset}'
        wav = pathlib.Path(work) / 'decoded.wav'
        subprocess.run(['afconvert', str(asset), str(wav), '-f', 'WAVE', '-d', 'LEF32'], check=True, capture_output=True)
        sound, rate = sf.read(wav, dtype='float32')
        assert rate == 24000 and sound.ndim == 1 and np.isfinite(sound).all(), asset
        assert abs(len(sound) / rate - recording['duration']) < .25, asset
        assert set(cue['speaker'] for cue in recording['cues']) == {'female','male'}, asset
        peak = float(np.max(np.abs(sound)))
        highest_peak = max(highest_peak, peak)
        assert peak < 1, f'Clipped recording: {asset}'
        for cue in recording['cues']:
            speech = sound[round(cue['start'] * rate):round(cue['speechEnd'] * rate)]
            assert len(speech) > rate * .2, (asset,cue)
            assert float(np.sqrt(np.mean(speech ** 2))) > .005, f'Silent cue: {asset} {cue["text"]}'
            scenes += 1
        if (i + 1) % 50 == 0:
            print(f'Decoded {i + 1}/{len(recordings)}', flush=True)
report = {'recordings':len(recordings), 'scenes':scenes, 'highestDecodedPeak':round(highest_peak,4), 'valid':True}
(root / 'output/narration/audio-audit.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
