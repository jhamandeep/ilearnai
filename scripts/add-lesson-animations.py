"""Transcribe existing worked scenarios into authored animation blocks.

Only lessons without an anim block are updated. Existing examples supply all
state values and narration; this script does not invent calculations. Run with
--write to apply; otherwise it reports coverage without touching files.
"""
import argparse
import pathlib
import re
import textwrap


def quoted(value):
    return '"' + value.replace('"', "'").replace('`', "'").replace('${', '').replace('\\', '').strip() + '"'


def wrapped(value, width=25, lines=3):
    parts = textwrap.wrap(value, width=width, break_long_words=True, break_on_hyphens=False) or ['—']
    if len(parts) > lines:
        parts = parts[:lines]
        parts[-1] = parts[-1][:-1] + '…'
    return '|'.join(parts)


def parse_scenario(source):
    title = re.search(r'^title:\s*(.*)', source, re.M)[1]
    state, initial, steps = {}, {}, []
    for line in source.splitlines():
        line = line.strip()
        if line.startswith('state:'):
            changed = {}
            for item in line[6:].split(','):
                if '=' in item:
                    key, value = item.split('=', 1)
                    changed[key.strip()] = value.strip()
            state.update(changed)
            if steps:
                steps[-1]['state'] = dict(state)
                steps[-1]['changed'].update(changed)
            else:
                initial = dict(state)
        elif line.startswith('step:'):
            # Keep a complete first sentence and leave the full explanation in
            # the original scenario block directly below the animation.
            sentence = re.split(r'[.!?](?!\d)\s+', line[5:].strip())[0].rstrip('.') + '.'
            replacements = {
                'The server writes the key, the URL, the creation date, and the expiry to the store and returns the short URL.': 'The server stores the key, URL, creation date, and expiry, then returns the short URL.',
                'At 100,000 writes per second the last follower sees the post after 8 minutes, and the queue blocks every other post.': 'At 100,000 writes per second, the last follower falls eight minutes behind and blocks other posts.',
            }
            sentence = replacements.get(sentence, sentence)
            if len(sentence.split()) > 20:
                raise ValueError('Narration needs editing: ' + sentence)
            steps.append({'text': sentence, 'state': dict(state), 'changed': {}})
    return title, initial, steps


def animation(source):
    title, initial, steps = parse_scenario(source)
    states = [{'text': "Start with the example's initial values.", 'state': initial, 'changed': initial}] + steps
    slots = min(6, max(len(s['state']) for s in states))
    if not slots:
        raise ValueError('Scenario has no state values: ' + title)
    out = [':::anim', 'title: ' + title,
           '# Worked values and narration follow the scenario in this lesson.',
           'text heading ' + quoted(wrapped(title, 62, 2)) + ' @ 480,48 size: 23 color: white',
           'text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey',
           'num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey',
           'dot cursor @ 100,145 r: 8 color: blue']
    for i in range(len(states)):
        x = round(100 + i * 600 / max(1, len(states) - 1))
        out += [f'dot mark{i} @ {x},145 r: 3 color: grey']
    for i in range(slots):
        x = [180, 480, 780][i % 3]
        y = 260 if slots <= 3 else 255 + (i // 3) * 150
        out += [f'rect card{i} @ {x},{y} size: 260x120 color: blue',
                f'text key{i} "" @ {x},{y-33} size: 16 color: grey',
                f'text value{i} "" @ {x},{y+12} size: 20 color: white']
    visible_keys = list(initial)[:slots]
    previous_values = {}
    for index, step in enumerate(states):
        # New and changed variables take priority, then retain context. This
        # keeps late outputs visible even when a scenario has many variables.
        priority = list(step['changed']) + visible_keys + list(step['state'])
        visible_keys = list(dict.fromkeys(priority))[:slots]
        x = round(100 + index * 600 / max(1, len(states) - 1))
        out += ['', 'step: ' + step['text']]
        if index == 0:
            ids = ['heading', 'legend', 'scene', 'cursor'] + [f'mark{i}' for i in range(len(states))]
            ids += [f'{prefix}{i}' for i in range(slots) for prefix in ['card', 'key', 'value']]
            out += ['  show ' + ', '.join(ids)]
        else:
            out += ['  restore ' + ', '.join(f'card{i}' for i in range(slots)),
                    f'  move cursor -> {x},145 (0.6s)',
                    f'  & count scene -> {index+1} (0.6s)']
        for i, key in enumerate(visible_keys):
            value = step['state'].get(key, '—')
            out += [f'  label key{i} ' + quoted(wrapped(key, 24, 2)),
                    f'  & label value{i} ' + quoted(wrapped(value))]
            if key in step['changed'] and previous_values.get(key) != value:
                out += [f'  & highlight card{i}']
        previous_values = dict(step['state'])
    out += [':::', '']
    return '\n'.join(out)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    total, existing, added = 0, 0, 0
    for path in sorted(pathlib.Path('src/data/tracks').rglob('*.ts')):
        source = path.read_text()
        replacements = []
        for match in re.finditer(r'body:\s*`([^`]*)`', source):
            total += 1
            body = match[1]
            if re.search(r'^:::anim\s*$', body, re.M):
                existing += 1
                continue
            scenario = re.search(r':::scenario\s*\n(.*?)\n:::', body, re.S)
            if not scenario:
                raise ValueError(f'No worked scenario in {path}')
            block = animation(scenario[1])
            anchor = re.search(r'^## How it works\s*\n', body, re.M)
            if not anchor:
                raise ValueError(f'No mechanism section in {path}')
            insert_at = match.start(1) + anchor.end()
            replacements.append((insert_at, '\n' + block + '\n'))
            added += 1
        if args.write and replacements:
            for position, block in reversed(replacements):
                source = source[:position] + block + source[position:]
            path.write_text(source)
        if replacements:
            print(f'{path}: {len(replacements)} worked animations ' + ('added' if args.write else 'ready'))
    print(f'{total} lessons; {existing} existing animations; {added} ' + ('added' if args.write else 'ready'))


if __name__ == '__main__':
    main()
