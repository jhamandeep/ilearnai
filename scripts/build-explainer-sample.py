"""Rebuild the RAG review sample with the shared two-teacher voice pipeline."""
import asyncio
import json
import importlib.util
import pathlib
source = pathlib.Path(__file__).with_name('build-course-narration.py')
spec = importlib.util.spec_from_file_location('course_narration', source)
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)
ROOT, CACHE = pipeline.ROOT, pipeline.CACHE
generate, assemble, atomic_json = pipeline.generate, pipeline.assemble, pipeline.atomic_json

sample_path = ROOT / 'src/data/explainers/rag-sample.json'
sample = json.loads(sample_path.read_text())
entry = {'key': 'rag-sample-teaching', 'texts': [cue['text'] for cue in sample['cues']]}
CACHE.mkdir(parents=True, exist_ok=True)
asyncio.run(generate([entry]))
recording = assemble(entry, 'explainers')
recording['title'] = sample['title']
for new, old in zip(recording['cues'], sample['cues']):
    new.update(id=old['id'], title=old['title'])
atomic_json(sample_path, recording)
print(f'Recorded {len(recording["cues"])} scenes, {recording["duration"]:.1f}s')
