import type { ConceptEdge, ConceptNode } from './types'
import { tracks } from './tracks'
import { glossary } from './glossary'

const concept = (slug: string, label: string, track: string): ConceptNode => ({
  id: 'concept:' + slug,
  label,
  kind: 'concept',
  track,
})

const lesson = (track: string, module: string, slug: string, label: string): ConceptNode => ({
  id: 'lesson:' + track + '/' + module + '/' + slug,
  label,
  kind: 'lesson',
  track,
  to: '/courses/' + track + '/' + module + '/' + slug,
})

const paper = (slug: string, label: string, track: string): ConceptNode => ({
  id: 'paper:' + slug,
  label,
  kind: 'paper',
  track,
  to: '/papers/' + slug,
})

const lab = (slug: string, label: string, track: string): ConceptNode => ({
  id: 'lab:' + slug,
  label,
  kind: 'lab',
  track,
  to: '/labs/' + slug,
})

const term = (slug: string, label: string, track: string): ConceptNode => ({
  id: 'term:' + slug,
  label,
  kind: 'term',
  track,
  to: '/glossary/' + slug,
})

const handNodes: ConceptNode[] = [
  // ---- concepts ----
  concept('linear-algebra', 'Linear algebra', 'ml-math'),
  concept('probability', 'Probability', 'ml-math'),
  concept('svd', 'SVD and low rank', 'ml-math'),
  concept('gradient-descent', 'Gradient descent', 'ml-math'),
  concept('backpropagation', 'Backpropagation', 'ml-math'),
  concept('optimisers', 'Adaptive optimisers', 'ml-math'),
  concept('softmax', 'Softmax and cross-entropy', 'ml-math'),
  concept('sampling', 'Sampling and decoding', 'ml-math'),
  concept('attention', 'Attention', 'ai-research'),
  concept('positional-encoding', 'Positional encoding', 'ai-research'),
  concept('tokenization', 'Tokenization', 'ai-research'),
  concept('scaling-laws', 'Scaling laws', 'ai-research'),
  concept('in-context-learning', 'In-context learning', 'ai-research'),
  concept('rlhf', 'RLHF', 'ai-research'),
  concept('preference-optimisation', 'Preference optimisation', 'ai-research'),
  concept('reasoning', 'Reasoning models', 'ai-research'),
  concept('mixture-of-experts', 'Mixture of experts', 'ai-research'),
  concept('state-space-models', 'State-space models', 'ai-research'),
  concept('embeddings', 'Embeddings', 'ai-engineering'),
  concept('retrieval', 'Retrieval and RAG', 'ai-engineering'),
  concept('vector-search', 'Vector search', 'ai-engineering'),
  concept('agents', 'Agents', 'ai-engineering'),
  concept('tool-use', 'Tool use', 'ai-engineering'),
  concept('fine-tuning', 'Fine-tuning', 'ai-engineering'),
  concept('model-routing', 'Model routing', 'ai-engineering'),
  concept('kv-cache', 'KV cache', 'inference-engineering'),
  concept('memory-bandwidth', 'Memory bandwidth', 'inference-engineering'),
  concept('batching', 'Batching', 'inference-engineering'),
  concept('quantisation', 'Quantisation', 'inference-engineering'),
  concept('speculative-decoding', 'Speculative decoding', 'inference-engineering'),
  concept('parallelism', 'Parallelism', 'inference-engineering'),
  concept('capacity-estimation', 'Capacity estimation', 'system-design'),
  concept('tail-latency', 'Tail latency', 'system-design'),
  concept('consistency', 'Consistency', 'system-design'),
  concept('replication', 'Replication', 'system-design'),
  concept('consensus', 'Consensus', 'system-design'),
  concept('storage-engines', 'Storage engines', 'system-design'),
  concept('vla', 'Vision-language-action', 'open-robotics'),

  // ---- lessons (every lesson in tracks.ts) ----
  lesson('ai-research', 'transformers', 'why-attention', 'Why attention replaced recurrence'),
  lesson('ai-research', 'transformers', 'multi-head', 'Multi-head attention'),
  lesson('ai-research', 'transformers', 'positional-encodings', 'Positional encodings'),
  lesson('ai-research', 'scaling', 'kaplan-to-chinchilla', 'From Kaplan to Chinchilla'),
  lesson('ai-research', 'scaling', 'inference-aware-scaling', 'Inference-aware scaling'),
  lesson('ai-research', 'alignment', 'rlhf-pipeline', 'The RLHF pipeline'),
  lesson('ai-research', 'alignment', 'dpo-derivation', 'Deriving DPO'),
  lesson('ai-engineering', 'embeddings', 'what-is-an-embedding', 'What an embedding is'),
  lesson('ai-engineering', 'embeddings', 'hnsw', 'HNSW'),
  lesson('ai-engineering', 'rag', 'rag-baseline', 'A RAG baseline'),
  lesson('ai-engineering', 'rag', 'rag-evaluation', 'Evaluating RAG'),
  lesson('ai-engineering', 'agents', 'agent-loop', 'The agent loop'),
  lesson('ai-engineering', 'agents', 'agent-memory', 'Agent memory'),
  lesson('inference-engineering', 'memory', 'kv-cache', 'The KV cache, sized by hand'),
  lesson('inference-engineering', 'memory', 'weights-and-quantisation', 'Weights and quantisation'),
  lesson('inference-engineering', 'throughput', 'prefill-vs-decode', 'Prefill vs decode'),
  lesson('inference-engineering', 'throughput', 'speculative-decoding', 'Speculative decoding'),
  lesson('system-design', 'fundamentals', 'back-of-envelope', 'Back-of-the-envelope estimation'),
  lesson('system-design', 'fundamentals', 'consistency-models', 'Consistency models'),
  lesson('ml-math', 'linear-algebra', 'matrices-as-maps', 'Matrices as linear maps'),
  lesson('ml-math', 'linear-algebra', 'gradients', 'Gradients and the chain rule'),
  lesson('open-robotics', 'vla', 'what-is-a-vla', 'What a VLA model is'),

  // ---- papers ----
  paper('attention-is-all-you-need', 'Attention Is All You Need', 'ai-research'),
  paper('scaling-laws', 'Scaling Laws', 'ai-research'),
  paper('chinchilla', 'Chinchilla', 'ai-research'),
  paper('gpt-3', 'GPT-3', 'ai-research'),
  paper('instructgpt', 'InstructGPT', 'ai-research'),
  paper('dpo', 'DPO', 'ai-research'),
  paper('deepseek-r1', 'DeepSeek-R1', 'ai-research'),
  paper('switch-transformer', 'Switch Transformer', 'ai-research'),
  paper('react', 'ReAct', 'ai-engineering'),
  paper('dpr', 'Dense Passage Retrieval', 'ai-engineering'),
  paper('hnsw', 'HNSW', 'ai-engineering'),
  paper('lora', 'LoRA', 'ai-engineering'),
  paper('flash-attention', 'FlashAttention', 'inference-engineering'),
  paper('paged-attention', 'PagedAttention', 'inference-engineering'),
  paper('speculative-decoding', 'Speculative Decoding', 'inference-engineering'),
  paper('megatron-lm', 'Megatron-LM', 'inference-engineering'),
  paper('raft', 'Raft', 'system-design'),
  paper('spanner', 'Spanner', 'system-design'),
  paper('adam', 'Adam', 'ml-math'),

  // ---- labs ----
  lab('kv-cache', 'KV cache estimator', 'inference-engineering'),
  lab('agent-control-room', 'Agent Control Room', 'ai-engineering'),
  lab('capacity', 'Capacity calculator', 'system-design'),
  lab('sampling', 'Sampling playground', 'ml-math'),
  lab('gradient-descent', 'Gradient descent', 'ml-math'),
  lab('attention', 'Attention', 'ai-research'),
  lab('tokenizer', 'Tokenizer', 'ai-research'),
  lab('transformer-flow', 'Transformer flow', 'ai-research'),
  lab('pareto-router', 'Pareto router', 'ai-engineering'),
  lab('timeout-architect', 'Timeout architect', 'system-design'),

  // ---- glossary terms ----
  term('kv-cache', 'KV cache', 'inference-engineering'),
  term('continuous-batching', 'Continuous batching', 'inference-engineering'),
  term('arithmetic-intensity', 'Arithmetic intensity', 'inference-engineering'),
  term('rlhf', 'RLHF', 'ai-research'),
  term('mixture-of-experts', 'Mixture of experts', 'ai-research'),
  term('bm25', 'BM25', 'ai-engineering'),
  term('pareto-frontier', 'Pareto frontier', 'ai-engineering'),
  term('p99-latency', 'p99 latency', 'system-design'),
  term('linearizability', 'Linearizability', 'system-design'),
  term('svd', 'SVD', 'ml-math'),
  term('temperature', 'Temperature', 'ml-math'),
]

const requires = (source: string, target: string): ConceptEdge => ({
  source: 'concept:' + source,
  target: 'concept:' + target,
  relation: 'requires',
})
const explains = (source: string, target: string): ConceptEdge => ({
  source,
  target: 'concept:' + target,
  relation: 'explains',
})
const uses = (labSlug: string, target: string): ConceptEdge => ({
  source: 'lab:' + labSlug,
  target: 'concept:' + target,
  relation: 'uses',
})
const related = (termSlug: string, target: string): ConceptEdge => ({
  source: 'term:' + termSlug,
  target: 'concept:' + target,
  relation: 'related',
})

const handEdges: ConceptEdge[] = [
  // ---- requires: source concept depends on target concept ----
  requires('svd', 'linear-algebra'),
  requires('gradient-descent', 'linear-algebra'),
  requires('backpropagation', 'gradient-descent'),
  requires('optimisers', 'gradient-descent'),
  requires('softmax', 'probability'),
  requires('sampling', 'softmax'),
  requires('attention', 'linear-algebra'),
  requires('attention', 'softmax'),
  requires('positional-encoding', 'attention'),
  requires('tokenization', 'probability'),
  requires('scaling-laws', 'attention'),
  requires('scaling-laws', 'gradient-descent'),
  requires('in-context-learning', 'scaling-laws'),
  requires('rlhf', 'in-context-learning'),
  requires('rlhf', 'probability'),
  requires('preference-optimisation', 'rlhf'),
  requires('reasoning', 'rlhf'),
  requires('reasoning', 'in-context-learning'),
  requires('mixture-of-experts', 'attention'),
  requires('mixture-of-experts', 'scaling-laws'),
  requires('state-space-models', 'attention'),
  requires('embeddings', 'attention'),
  requires('embeddings', 'linear-algebra'),
  requires('vector-search', 'embeddings'),
  requires('retrieval', 'vector-search'),
  requires('agents', 'in-context-learning'),
  requires('agents', 'tool-use'),
  requires('tool-use', 'in-context-learning'),
  requires('agents', 'reasoning'),
  requires('fine-tuning', 'svd'),
  requires('fine-tuning', 'backpropagation'),
  requires('model-routing', 'tail-latency'),
  requires('kv-cache', 'attention'),
  requires('memory-bandwidth', 'kv-cache'),
  requires('batching', 'memory-bandwidth'),
  requires('quantisation', 'memory-bandwidth'),
  requires('speculative-decoding', 'memory-bandwidth'),
  requires('speculative-decoding', 'sampling'),
  requires('parallelism', 'attention'),
  requires('parallelism', 'optimisers'),
  requires('tail-latency', 'capacity-estimation'),
  requires('tail-latency', 'probability'),
  requires('replication', 'consistency'),
  requires('consensus', 'replication'),
  requires('storage-engines', 'replication'),
  requires('vla', 'attention'),
  requires('vla', 'fine-tuning'),

  // ---- explains: lessons ----
  explains('lesson:ai-research/transformers/why-attention', 'attention'),
  explains('lesson:ai-research/transformers/multi-head', 'attention'),
  explains('lesson:ai-research/transformers/positional-encodings', 'positional-encoding'),
  explains('lesson:ai-research/scaling/kaplan-to-chinchilla', 'scaling-laws'),
  explains('lesson:ai-research/scaling/inference-aware-scaling', 'scaling-laws'),
  explains('lesson:ai-research/scaling/inference-aware-scaling', 'memory-bandwidth'),
  explains('lesson:ai-research/alignment/rlhf-pipeline', 'rlhf'),
  explains('lesson:ai-research/alignment/dpo-derivation', 'preference-optimisation'),
  explains('lesson:ai-engineering/embeddings/what-is-an-embedding', 'embeddings'),
  explains('lesson:ai-engineering/embeddings/hnsw', 'vector-search'),
  explains('lesson:ai-engineering/rag/rag-baseline', 'retrieval'),
  explains('lesson:ai-engineering/rag/rag-evaluation', 'retrieval'),
  explains('lesson:ai-engineering/agents/agent-loop', 'agents'),
  explains('lesson:ai-engineering/agents/agent-loop', 'tool-use'),
  explains('lesson:ai-engineering/agents/agent-memory', 'agents'),
  explains('lesson:inference-engineering/memory/kv-cache', 'kv-cache'),
  explains('lesson:inference-engineering/memory/weights-and-quantisation', 'quantisation'),
  explains('lesson:inference-engineering/throughput/prefill-vs-decode', 'memory-bandwidth'),
  explains('lesson:inference-engineering/throughput/prefill-vs-decode', 'batching'),
  explains('lesson:inference-engineering/throughput/speculative-decoding', 'speculative-decoding'),
  explains('lesson:system-design/fundamentals/back-of-envelope', 'capacity-estimation'),
  explains('lesson:system-design/fundamentals/consistency-models', 'consistency'),
  explains('lesson:ml-math/linear-algebra/matrices-as-maps', 'linear-algebra'),
  explains('lesson:ml-math/linear-algebra/matrices-as-maps', 'svd'),
  explains('lesson:ml-math/linear-algebra/gradients', 'gradient-descent'),
  explains('lesson:ml-math/linear-algebra/gradients', 'backpropagation'),
  explains('lesson:open-robotics/vla/what-is-a-vla', 'vla'),

  // ---- explains: papers ----
  explains('paper:attention-is-all-you-need', 'attention'),
  explains('paper:attention-is-all-you-need', 'positional-encoding'),
  explains('paper:scaling-laws', 'scaling-laws'),
  explains('paper:chinchilla', 'scaling-laws'),
  explains('paper:gpt-3', 'in-context-learning'),
  explains('paper:instructgpt', 'rlhf'),
  explains('paper:dpo', 'preference-optimisation'),
  explains('paper:deepseek-r1', 'reasoning'),
  explains('paper:switch-transformer', 'mixture-of-experts'),
  explains('paper:react', 'agents'),
  explains('paper:react', 'tool-use'),
  explains('paper:dpr', 'embeddings'),
  explains('paper:dpr', 'retrieval'),
  explains('paper:hnsw', 'vector-search'),
  explains('paper:lora', 'fine-tuning'),
  explains('paper:lora', 'svd'),
  explains('paper:flash-attention', 'memory-bandwidth'),
  explains('paper:flash-attention', 'attention'),
  explains('paper:paged-attention', 'kv-cache'),
  explains('paper:paged-attention', 'batching'),
  explains('paper:speculative-decoding', 'speculative-decoding'),
  explains('paper:megatron-lm', 'parallelism'),
  explains('paper:raft', 'consensus'),
  explains('paper:raft', 'replication'),
  explains('paper:spanner', 'consistency'),
  explains('paper:spanner', 'consensus'),
  explains('paper:adam', 'optimisers'),

  // ---- uses: labs ----
  uses('kv-cache', 'kv-cache'),
  uses('kv-cache', 'memory-bandwidth'),
  uses('agent-control-room', 'agents'),
  uses('agent-control-room', 'probability'),
  uses('capacity', 'capacity-estimation'),
  uses('capacity', 'tail-latency'),
  uses('sampling', 'sampling'),
  uses('sampling', 'softmax'),
  uses('gradient-descent', 'gradient-descent'),
  uses('gradient-descent', 'optimisers'),
  uses('attention', 'attention'),
  uses('attention', 'linear-algebra'),
  uses('tokenizer', 'tokenization'),
  uses('transformer-flow', 'attention'),
  uses('transformer-flow', 'positional-encoding'),
  uses('transformer-flow', 'kv-cache'),
  uses('pareto-router', 'model-routing'),
  uses('timeout-architect', 'tail-latency'),
  uses('timeout-architect', 'agents'),

  // ---- related: glossary terms ----
  related('kv-cache', 'kv-cache'),
  related('kv-cache', 'memory-bandwidth'),
  related('continuous-batching', 'batching'),
  related('arithmetic-intensity', 'memory-bandwidth'),
  related('rlhf', 'rlhf'),
  related('rlhf', 'preference-optimisation'),
  related('mixture-of-experts', 'mixture-of-experts'),
  related('bm25', 'retrieval'),
  related('pareto-frontier', 'model-routing'),
  related('p99-latency', 'tail-latency'),
  related('linearizability', 'consistency'),
  related('svd', 'svd'),
  related('svd', 'fine-tuning'),
  related('temperature', 'sampling'),
]

// ---- Derived from the course data ----
// Every lesson becomes a node. Its key terms link it to concept and term nodes,
// so new lessons appear on the map without editing this file.
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const aliases: Record<string, string> = {
  'kv-cache': 'kv-cache', 'key-value-cache': 'kv-cache', 'grouped-query-attention': 'kv-cache', 'gqa': 'kv-cache',
  'self-attention': 'attention', 'multi-head-attention': 'attention', 'scaled-dot-product-attention': 'attention', 'flash-attention': 'attention', 'flashattention': 'attention',
  'rope': 'positional-encoding', 'rotary-position-embedding': 'positional-encoding', 'positional-encodings': 'positional-encoding',
  'tokenizer': 'tokenization', 'byte-pair-encoding': 'tokenization', 'bpe': 'tokenization', 'token': 'tokenization',
  'chinchilla': 'scaling-laws', 'chinchilla-optimal': 'scaling-laws', 'compute-optimal': 'scaling-laws', 'scaling-law': 'scaling-laws',
  'few-shot': 'in-context-learning', 'few-shot-prompting': 'in-context-learning', 'prompt': 'in-context-learning', 'prompting': 'in-context-learning',
  'reward-model': 'rlhf', 'ppo': 'rlhf', 'sft': 'rlhf', 'supervised-fine-tuning': 'rlhf', 'alignment': 'rlhf',
  'dpo': 'preference-optimisation', 'direct-preference-optimization': 'preference-optimisation', 'direct-preference-optimisation': 'preference-optimisation',
  'chain-of-thought': 'reasoning', 'process-reward-model': 'reasoning', 'test-time-compute': 'reasoning', 'verifiable-reward': 'reasoning',
  'moe': 'mixture-of-experts', 'expert': 'mixture-of-experts', 'router': 'mixture-of-experts',
  'mamba': 'state-space-models', 'ssm': 'state-space-models', 'state-space-model': 'state-space-models',
  'embedding': 'embeddings', 'cosine-similarity': 'embeddings', 'chunking': 'embeddings',
  'rag': 'retrieval', 'retrieval-augmented-generation': 'retrieval', 'reranking': 'retrieval', 'cross-encoder': 'retrieval', 'bm25': 'retrieval', 'reciprocal-rank-fusion': 'retrieval',
  'hnsw': 'vector-search', 'approximate-nearest-neighbour': 'vector-search', 'ann': 'vector-search', 'vector-database': 'vector-search',
  'agent': 'agents', 'agent-loop': 'agents', 'react': 'agents', 'memory': 'agents',
  'tool': 'tool-use', 'tool-call': 'tool-use', 'function-calling': 'tool-use', 'tool-schema': 'tool-use', 'json-schema': 'tool-use', 'structured-output': 'tool-use',
  'lora': 'fine-tuning', 'fine-tune': 'fine-tuning', 'adapter': 'fine-tuning',
  'model-router': 'model-routing', 'pareto-frontier': 'model-routing', 'routing': 'model-routing', 'cost': 'model-routing',
  'arithmetic-intensity': 'memory-bandwidth', 'hbm': 'memory-bandwidth', 'bandwidth': 'memory-bandwidth', 'memory-bound': 'memory-bandwidth', 'prefill': 'memory-bandwidth', 'decode': 'memory-bandwidth', 'roofline': 'memory-bandwidth',
  'continuous-batching': 'batching', 'paged-attention': 'batching', 'pagedattention': 'batching', 'batch': 'batching', 'scheduler': 'batching', 'prefix-caching': 'batching',
  'quantization': 'quantisation', 'int8': 'quantisation', 'int4': 'quantisation', 'fp8': 'quantisation', 'gptq': 'quantisation', 'awq': 'quantisation',
  'speculative': 'speculative-decoding', 'draft-model': 'speculative-decoding', 'medusa': 'speculative-decoding',
  'tensor-parallelism': 'parallelism', 'pipeline-parallelism': 'parallelism', 'data-parallelism': 'parallelism', 'zero': 'parallelism', 'fsdp': 'parallelism', 'tensor-parallel': 'parallelism', 'pipeline-parallel': 'parallelism',
  'back-of-the-envelope': 'capacity-estimation', 'qps': 'capacity-estimation', 'throughput': 'capacity-estimation', 'littles-law': 'capacity-estimation', 'little-s-law': 'capacity-estimation', 'latency': 'capacity-estimation', 'slo': 'capacity-estimation',
  'p99': 'tail-latency', 'p99-latency': 'tail-latency', 'timeout': 'tail-latency', 'retry': 'tail-latency', 'retries': 'tail-latency', 'circuit-breaker': 'tail-latency', 'load-shedding': 'tail-latency', 'back-pressure': 'tail-latency',
  'linearizability': 'consistency', 'cap-theorem': 'consistency', 'cap': 'consistency', 'consistency-model': 'consistency', 'eventual-consistency': 'consistency',
  'replica': 'replication', 'quorum': 'replication', 'leader': 'replication', 'follower': 'replication', 'leader-follower': 'replication',
  'raft': 'consensus', 'paxos': 'consensus', 'log-replication': 'consensus',
  'lsm-tree': 'storage-engines', 'b-tree': 'storage-engines', 'write-ahead-log': 'storage-engines', 'wal': 'storage-engines', 'index': 'storage-engines', 'sstable': 'storage-engines',
  'consistent-hashing': 'replication', 'partitioning': 'replication', 'sharding': 'replication', 'hot-key': 'replication',
  'cache': 'batching', 'kafka': 'storage-engines', 'queue': 'storage-engines',
  'matrix': 'linear-algebra', 'vector': 'linear-algebra', 'eigenvalue': 'linear-algebra', 'eigenvector': 'linear-algebra', 'projection': 'linear-algebra', 'dot-product': 'linear-algebra', 'linear-map': 'linear-algebra',
  'singular-value-decomposition': 'svd', 'low-rank': 'svd', 'rank': 'svd',
  'derivative': 'gradient-descent', 'gradient': 'gradient-descent', 'learning-rate': 'gradient-descent', 'jacobian': 'gradient-descent', 'chain-rule': 'backpropagation', 'backprop': 'backpropagation',
  'adam': 'optimisers', 'momentum': 'optimisers', 'convexity': 'optimisers', 'optimizer': 'optimisers', 'optimiser': 'optimisers',
  'cross-entropy': 'softmax', 'logits': 'softmax', 'logistic-regression': 'softmax', 'maximum-likelihood': 'softmax', 'mle': 'softmax', 'kl-divergence': 'softmax', 'entropy': 'softmax', 'perplexity': 'softmax',
  'temperature': 'sampling', 'top-p': 'sampling', 'top-k': 'sampling', 'beam-search': 'sampling', 'random-variable': 'probability', 'bayes': 'probability', 'expectation': 'probability', 'distribution': 'probability',
  'vision-language-action': 'vla', 'action-token': 'vla', 'imitation-learning': 'vla', 'sim-to-real': 'vla', 'kalman-filter': 'vla', 'pid': 'vla', 'pid-control': 'vla', 'state-estimation': 'vla', 'pinhole-camera': 'vla', 'depth': 'vla',
}
const conceptIds = new Set(handNodes.filter((n) => n.kind === 'concept').map((n) => n.id.slice('concept:'.length)))
const termIds = new Set(handNodes.filter((n) => n.kind === 'term').map((n) => n.id.slice('term:'.length)))
const glossarySlugs = new Set(glossary.map((g) => g.slug))

const derivedNodes: ConceptNode[] = []
const derivedEdges: ConceptEdge[] = []
const pending: { id: string; track: string; module: string }[] = []
const have = new Set(handNodes.map((n) => n.id))
const edgeKey = (e: ConceptEdge) => e.source + '>' + e.target
const haveEdge = new Set(handEdges.map(edgeKey))

for (const t of tracks) {
  for (const m of t.modules) {
    for (const l of m.lessons) {
      const id = 'lesson:' + t.slug + '/' + m.slug + '/' + l.slug
      if (!have.has(id)) {
        derivedNodes.push({ id, label: l.title, kind: 'lesson', track: t.slug, to: '/courses/' + t.slug + '/' + m.slug + '/' + l.slug })
        have.add(id)
      }
      const targets = new Set<string>()
      for (const k of l.keyTerms) {
        const s = slugify(k)
        const c = conceptIds.has(s) ? s : aliases[s]
        if (c && conceptIds.has(c)) targets.add('concept:' + c)
        if (termIds.has(s)) targets.add('term:' + s)
        else if (glossarySlugs.has(s) && !have.has('term:' + s)) {
          const g = glossary.find((x) => x.slug === s)!
          derivedNodes.push({ id: 'term:' + s, label: g.term, kind: 'term', track: t.slug, to: '/glossary/' + s })
          have.add('term:' + s)
          termIds.add(s)
          targets.add('term:' + s)
        } else if (have.has('term:' + s)) targets.add('term:' + s)
      }
      for (const target of targets) {
        const e: ConceptEdge = { source: id, target, relation: target.startsWith('concept:') ? 'explains' : 'related' }
        if (!haveEdge.has(edgeKey(e))) { derivedEdges.push(e); haveEdge.add(edgeKey(e)) }
      }
      if (![...targets].some((x) => x.startsWith('concept:'))) pending.push({ id, track: t.slug, module: m.slug })
    }
  }
}

// A lesson whose key terms match no concept joins the concept its module uses most,
// or failing that the first concept of its track, so nothing floats alone on the map.
for (const p of pending) {
  const prefix = 'lesson:' + p.track + '/' + p.module + '/'
  const counts = new Map<string, number>()
  for (const e of [...handEdges, ...derivedEdges]) if (e.source.startsWith(prefix) && e.target.startsWith('concept:')) counts.set(e.target, (counts.get(e.target) ?? 0) + 1)
  let target: string | undefined = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  if (!target) target = handNodes.find((n) => n.kind === 'concept' && n.track === p.track)?.id
  if (!target) continue
  const e: ConceptEdge = { source: p.id, target, relation: 'explains' }
  if (!haveEdge.has(edgeKey(e))) { derivedEdges.push(e); haveEdge.add(edgeKey(e)) }
}

export const nodes: ConceptNode[] = [...handNodes, ...derivedNodes]
export const edges: ConceptEdge[] = [...handEdges, ...derivedEdges]
