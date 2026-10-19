import type { GlossaryTerm } from './types'

export const glossary: GlossaryTerm[] = [
  {
    term: 'KV cache',
    slug: 'kv-cache',
    short: 'Stored keys and values for previous tokens so decoding does not recompute them.',
    long: 'During autoregressive generation each new token must attend to all prior tokens. Caching their key and value projections per layer turns a quadratic recomputation into a linear one, at the cost of memory proportional to layers × KV heads × head dimension × tokens.',
    related: ['grouped-query-attention', 'paged-attention'],
  },
  {
    term: 'Grouped-query attention',
    slug: 'grouped-query-attention',
    short: 'Several query heads share one KV head, shrinking the KV cache.',
    long: 'GQA sits between multi-head attention (one KV head per query head) and multi-query attention (one KV head total). Llama 3 70B uses 64 query heads and 8 KV heads, an 8x reduction in cache size with negligible quality loss.',
    related: ['kv-cache'],
  },
  {
    term: 'PagedAttention',
    slug: 'paged-attention',
    short: 'KV cache stored in fixed-size blocks, like virtual memory pages.',
    long: 'Introduced by vLLM. Avoids reserving max-length memory per request, which eliminates internal fragmentation and lets a server batch more sequences.',
    related: ['kv-cache', 'continuous-batching'],
  },
  {
    term: 'Continuous batching',
    slug: 'continuous-batching',
    short: 'New requests join a running batch as old ones finish, instead of waiting for the whole batch.',
    long: 'Static batching waits for the longest sequence in a batch. Continuous (or in-flight) batching schedules at the iteration level, keeping the GPU busy and cutting tail latency.',
    related: ['paged-attention'],
  },
  {
    term: 'RLHF',
    slug: 'rlhf',
    short: 'Reinforcement learning from human feedback: fit a reward model to preferences, then optimise the policy against it.',
    long: 'The InstructGPT recipe. Supervised fine-tuning, a reward model trained with the Bradley-Terry loss on pairwise comparisons, then PPO with a KL penalty to the SFT model.',
    related: ['dpo', 'kl-divergence'],
  },
  {
    term: 'DPO',
    slug: 'dpo',
    short: 'Direct preference optimisation: train on preference pairs without a separate reward model.',
    long: 'Derived from the closed-form optimum of the KL-regularised RLHF objective. The loss is a logistic regression on the difference of log-ratios between the policy and a reference model.',
    related: ['rlhf'],
  },
  {
    term: 'KL divergence',
    slug: 'kl-divergence',
    short: 'A measure of how one distribution differs from another; asymmetric and non-negative.',
    long: 'KL(P‖Q) = Σ P(x) log(P(x)/Q(x)). Used in RLHF as a penalty that keeps the policy near the reference model, and in variational inference as the gap between an approximation and the true posterior.',
    related: ['rlhf'],
  },
  {
    term: 'Speculative decoding',
    slug: 'speculative-decoding',
    short: 'A small draft model proposes tokens, the large model verifies them in one pass.',
    long: 'Rejection sampling makes the output distribution identical to the large model alone. Speed-up depends on acceptance rate and the size ratio between draft and target.',
    related: ['kv-cache'],
  },
  {
    term: 'Reciprocal rank fusion',
    slug: 'reciprocal-rank-fusion',
    short: 'Merges ranked lists by summing 1/(k + rank) per document.',
    long: 'A score-free way to combine BM25 and dense retrieval results. k is usually 60. Robust because it ignores the incomparable raw scores of different retrievers.',
    related: ['hnsw'],
  },
  {
    term: 'HNSW',
    slug: 'hnsw',
    short: 'Hierarchical navigable small world graph for approximate nearest-neighbour search.',
    long: 'A layered proximity graph. Search starts at a sparse top layer and descends, greedy-walking toward the query. Logarithmic in corpus size in practice. Tuned with M, efConstruction, and efSearch.',
    related: ['reciprocal-rank-fusion'],
  },
  {
    term: 'Chinchilla optimal',
    slug: 'chinchilla-optimal',
    short: 'Training tokens roughly 20x parameters for a fixed compute budget.',
    long: 'From Hoffmann et al. 2022. Ignores inference cost, so production models are deliberately trained well past this point.',
    related: [],
  },
  {
    term: 'Arithmetic intensity',
    slug: 'arithmetic-intensity',
    short: 'FLOPs performed per byte moved from memory.',
    long: 'If a kernel\'s arithmetic intensity is below the hardware\'s ratio of peak FLOPS to bandwidth, it is memory-bound. Single-sequence decode is deeply memory-bound, which is why batching helps.',
    related: ['kv-cache', 'continuous-batching'],
  },
]

export function findTerm(slug: string) {
  return glossary.find((g) => g.slug === slug)
}
