"""Pronunciation for authored teaching text. Captions always keep the original.

Numbers are expanded from strings, never floats, so small learning rates and
trailing decimal places survive. Keep explicit pronunciation overrides here.
"""
import re
from num2words import num2words

VERSION = 'teaching-v2'
NAMES = {
    'PyTorch': 'Pie Torch', 'PyPI': 'Pie Pie', 'NumPy': 'Num Pie', 'numpy': 'num pie',
    'Kubernetes': 'koo ber net ease', 'NVIDIA': 'en vidia', 'CUDA': 'coo da',
    'GitHub': 'Git Hub', 'OpenAI': 'Open A I', 'OpenCV': 'Open C V',
    'FastAPI': 'Fast A P I', 'JavaScript': 'Java Script', 'MiniLM': 'Mini L M',
    'NVLink': 'N V Link', 'LoRA': 'low rah', 'ReLU': 'ray loo', 'GeLU': 'gel loo',
    'GloVe': 'glove', 'DAgger': 'dagger', 'Bayes': 'bays',
    'KeyError': 'Key Error', 'ModuleNotFoundError': 'Module Not Found Error',
    'DictReader': 'Dict Reader', 'ChatRequest': 'Chat Request', 'RequestVote': 'Request Vote',
}
ACRONYMS = ('AI API APIs CPU CPUs GPU GPUs KV MSE DNS IP URL URLs SDK MCP SLO TTFT TPOT '
            'MHA MQA GQA KL RRF BGR RGB HTTP HTTPS VAE LLM LLMs PID SGD CNN RNN NLP').split()


def number(value):
    value = value.replace(',', '')
    sign = 'minus ' if value.startswith('-') else ''
    value = value.lstrip('+-')
    if '.' in value:
        whole, fraction = value.split('.', 1)
        return sign + num2words(int(whole or '0')) + ' point ' + ' '.join(num2words(int(c)) for c in fraction)
    return sign + num2words(int(value))


def spoken(text):
    text = text.replace('−', '-').replace('’', "'")
    # IP addresses and software versions are not decimal fractions.
    text = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', lambda m: ' dot '.join(number(p) for p in m[0].split('.')), text)
    text = re.sub(r'\b(Python\s+|python:|version\s+)(\d+(?:\.\d+)+)', lambda m: m[1] + ' point '.join(number(p) for p in m[2].split('.')), text, flags=re.I)
    text = re.sub(r'(?<![\w.])(-?\d+(?:\.\d+)?)[eE]([+-]?\d+)\b', lambda m: number(m[1]) + ' times ten to the power of ' + number(m[2]), text)
    text = re.sub(r'\b\d+(?:\.\d+)?\s*[BMK]\b', lambda m: number(m[0][:-1].strip()) + {'B':' billion', 'M':' million', 'K':' thousand'}[m[0][-1]], text)
    text = re.sub(r'\b(\d+)(st|nd|rd|th)\b', lambda m: num2words(int(m[1]), to='ordinal'), text)
    text = re.sub(r'(?<=\d)[–](?=\d)', ' to ', text)
    text = re.sub(r'(?<=\d)[-](?=\d)', ' minus ', text)
    text = re.sub(r'\$(\d[\d,]*(?:\.\d+)?)', lambda m: number(m[1]) + ' dollars', text)
    text = re.sub(r'(-?\d+(?:\.\d+)?)\s*°\s*C\b', r'\1 degrees Celsius', text)
    text = text.replace('°', ' degrees ').replace('%', ' percent')
    # Names first; otherwise acronym expansion would break compound tool names.
    for name, pronunciation in NAMES.items():
        text = re.sub(r'\b' + re.escape(name) + r'\b', pronunciation, text)
    units = {'TB/s':'terabytes per second','GB':'gigabytes','MB':'megabytes','KB':'kilobytes','TB':'terabytes', 'MiB':'mebibytes','ms':'milliseconds','USD':'US dollars','EUR':'euros','GBP':'pounds','QPS':'queries per second','TFLOPS':'tera flops','FLOPS':'flops','FLOPs':'flops'}
    for unit, expansion in units.items():
        text = re.sub(r'(?<![A-Za-z])' + re.escape(unit) + r'(?![A-Za-z])', ' ' + expansion, text)
    for acronym, phrase in {'GPUs':'graphics processors', 'CPUs':'central processors', 'APIs':'application programming interfaces', 'LLMs':'large language models'}.items():
        text = re.sub(r'\b' + acronym + r'\b', phrase, text)
    for acronym in ACRONYMS:
        text = re.sub(r'\b' + acronym + r'\b', ' '.join(acronym.rstrip('s')) + ('s' if acronym.endswith('s') else ''), text)
    replacements = {'→':' to ', '×':' times ', '²':' squared ', '³':' cubed ', '∇':'gradient ', 'α':'alpha', 'β':'beta', 'η':'eta', '≤':' less than or equal to ', '≥':' greater than or equal to ', '≈':' approximately ', '≠':' is not equal to ', '==':' equals ', '=':' equals ', '+':' plus ', ' || ':' compared with '}
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r'\^2\b', ' squared', text)
    text = re.sub(r'\^3\b', ' cubed', text)
    text = re.sub(r'\^(-?\d+)', r' to the power of \1', text)
    text = text.replace(' - ', ' minus ')
    text = re.sub(r'(?<=\d)/(?=\d)', ' divided by ', text)
    # Read numeric literals independently of adjacent algebra variables.
    text = re.sub(r'(?<![\w.])-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?!\d|\.\d)', lambda m: number(m[0]) + (' ' if m.end() < len(text) and text[m.end()].isalpha() else ''), text)
    text = re.sub(r'(?<=\w)_(?=\w)', ' ', text)
    text = re.sub(r'(?<=[a-z])(?=[A-Z][a-z])', ' ', text)
    # A sentence boundary gives the teacher room to introduce a new thought.
    text = text.replace('; ', '. ').replace(' — ', '. ').replace(' – ', ', ')
    text = text.replace('`','').replace('“','"').replace('”','"')
    return re.sub(r'\s+', ' ', text).strip()


def speaker_for(index):
    # Two-scene teaching turns allow a thought and its example to stay together.
    return 'female' if (index // 2) % 2 == 0 else 'male'
