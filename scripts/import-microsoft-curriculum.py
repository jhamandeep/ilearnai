"""Import a pinned, MIT-licensed reading snapshot; no network use at app runtime.

Image URLs retain their original repository location and nearby image credits.
Notebook links remain external because their framework runtimes are not bundled.
Run explicitly to refresh after reviewing an upstream revision.
"""
from pathlib import Path
import json
import re
import html
import posixpath
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'scripts/microsoft-curriculum-sources.json').read_text())
commit = manifest['commit']
SOURCE = ROOT / 'output/microsoft-curriculum-cache' / commit
SOURCE.mkdir(parents=True, exist_ok=True)
raw_root = f'https://raw.githubusercontent.com/microsoft/AI-For-Beginners/{commit}/'
git_root = f'https://github.com/microsoft/AI-For-Beginners/blob/{commit}/'
rows = manifest['lessons']

def convert(row):
    cached = SOURCE / f'{row["number"]:02}.md'
    if not cached.exists():
        cached.write_text(urllib.request.urlopen(raw_root + row['path'], timeout=30).read().decode())
    text = cached.read_text()
    def absolute(url, image=False):
        if re.match(r'^(https?:|mailto:|#|data:)', url):
            return url
        path = posixpath.normpath(posixpath.join(posixpath.dirname(row['path']), urllib.parse.unquote(url)))
        return (raw_root if image else git_root) + urllib.parse.quote(path, safe='/#?=&:')
    def image(match):
        attrs = dict(re.findall(r'([\w-]+)\s*=\s*["\']([^"\']*)["\']', match[0]))
        if not attrs.get('src'): return ''
        alt = html.unescape(attrs.get('alt', 'Diagram from the Microsoft curriculum')).replace('[', '').replace(']', '')
        return f'![{alt}]({absolute(attrs["src"], True)})'
    text = re.sub(r'<img\b[^>]*>', image, text, flags=re.I)
    text = re.sub(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', lambda m: f'[{m[2]}]({absolute(m[1])})', text, flags=re.S | re.I)
    text = re.sub(r'</?(?:sup|sub)\b[^>]*>', '', text)
    # Local pre/post quizzes replace the upstream quiz links, some of which are stale.
    text = re.sub(r'^## \[(?:Pre|Post)-lecture quiz\][^\n]*\n?', '', text, flags=re.M)
    text = re.sub(r'^(#{1,5}) ', r'#\1 ', text, flags=re.M)
    text = re.sub(r'(!?\[[^\]\n]*\])\(([^\s)]+)\)', lambda m: f'{m[1]}({absolute(m[2], m[1].startswith("!"))})', text)
    # Native rich code preserves the portal's code presentation and copy control.
    text = re.sub(r'^```([^\n]*)\n([\s\S]*?)^```\s*$', lambda m: f':::code\nlang: {m[1].strip() or "text"}\n{m[2].rstrip()}\n:::', text, flags=re.M)
    text = text.replace('`', '').replace('${', '$ {')
    text = text.replace('cv2.INTER_LANCZOS)', 'cv2.INTER_LANCZOS4)')
    text = text.replace('fit(g)<fit(', 'fit(g) &lt; fit(')
    links = []
    for label, target in re.findall(r'(?<!!)\[([^\]]+)\]\(([^\s)]+)\)', text):
        if target.startswith('https://') and ('.ipynb' in target or '/lab/' in target or 'assignment' in target.lower()):
            entry = {'label': re.sub(r'[*_]', '', label), 'url': target, 'kind': 'repo' if '.ipynb' in target else 'article'}
            if not any(link['url'] == target for link in links): links.append(entry)
    return {'number': row['number'], 'title': row['title'], 'sourceUrl': git_root + row['path'], 'body': text.strip(), 'links': links}

destination = ROOT / 'src/data/third-party'
destination.mkdir(parents=True, exist_ok=True)
(destination / 'microsoft-ai-readings.json').write_text(json.dumps({'repository': manifest['repository'], 'commit': commit, 'license': 'MIT', 'copyright': 'Copyright (c) Microsoft Corporation.', 'lessons': [convert(row) for row in rows]}, ensure_ascii=False, indent=2) + '\n')
license_text = urllib.request.urlopen(raw_root + 'LICENSE', timeout=20).read().decode()
licenses = ROOT / 'public/licenses'
licenses.mkdir(parents=True, exist_ok=True)
(licenses / 'microsoft-ai-for-beginners.txt').write_text(license_text)
print(f'Imported {len(rows)} full readings at {commit}; retained attribution and notebook links.')
