import type { Roadmap } from './types'

export const roadmaps: Roadmap[] = [
  {
    track: 'ai-research',
    title: 'AI Research roadmap',
    summary: 'From the attention equation to reading frontier model reports critically, in about four months of evenings.',
    stages: [
      {
        title: 'The architecture',
        weeks: 3,
        goal: 'Derive multi-head attention and positional encodings by hand and implement a small decoder.',
        items: [
          { label: 'Why attention replaced recurrence', to: '/courses/ai-research/transformers/why-attention' },
          { label: 'Multi-head attention', to: '/courses/ai-research/transformers/multi-head' },
          { label: 'Positional encodings: sinusoids to RoPE', to: '/courses/ai-research/transformers/positional-encodings' },
          { label: 'Paper: Attention Is All You Need', to: '/papers/attention-is-all-you-need' },
          { label: 'Lab: Attention', to: '/labs/attention' },
        ],
      },
      {
        title: 'Scale and data',
        weeks: 3,
        goal: 'Explain why a 70B model beat a 280B one and compute a training budget from a token count.',
        items: [
          { label: 'From Kaplan to Chinchilla', to: '/courses/ai-research/scaling/kaplan-to-chinchilla' },
          { label: 'Inference-aware scaling', to: '/courses/ai-research/scaling/inference-aware-scaling' },
          { label: 'Paper: Scaling Laws', to: '/papers/scaling-laws' },
          { label: 'Paper: Chinchilla', to: '/papers/chinchilla' },
          { label: 'Paper: GPT-3', to: '/papers/gpt-3' },
        ],
      },
      {
        title: 'Post-training',
        weeks: 4,
        goal: 'Reproduce the DPO derivation and explain each stage of the RLHF pipeline and what can go wrong in it.',
        items: [
          { label: 'The RLHF pipeline', to: '/courses/ai-research/alignment/rlhf-pipeline' },
          { label: 'Deriving DPO', to: '/courses/ai-research/alignment/dpo-derivation' },
          { label: 'Paper: InstructGPT', to: '/papers/instructgpt' },
          { label: 'Paper: DPO', to: '/papers/dpo' },
          { label: 'Paper: Constitutional AI', to: '/papers/constitutional-ai' },
        ],
      },
      {
        title: 'Reasoning and architecture variants',
        weeks: 3,
        goal: 'Read a 2025 reasoning paper and an MoE paper and say what each actually changed.',
        items: [
          { label: "Paper: Let's Verify Step by Step", to: '/papers/lets-verify-step-by-step' },
          { label: 'Paper: DeepSeek-R1', to: '/papers/deepseek-r1' },
          { label: 'Paper: Switch Transformer', to: '/papers/switch-transformer' },
          { label: 'Paper: Mamba', to: '/papers/mamba' },
          { label: 'Glossary: mixture of experts', to: '/glossary/mixture-of-experts' },
        ],
      },
      {
        title: 'Reading a frontier report',
        weeks: 2,
        goal: 'Work through the Llama 3 report and map every section to something earlier in this roadmap.',
        items: [
          { label: 'Paper: The Llama 3 Herd of Models', to: '/papers/llama-3' },
          { label: 'Paper: RoFormer', to: '/papers/roformer' },
          { label: 'Lab: Transformer flow', to: '/labs/transformer-flow' },
        ],
      },
    ],
  },
  {
    track: 'ai-engineering',
    title: 'AI Engineering roadmap',
    summary: 'Build retrieval that is measured, agents whose reliability you can compute, and a routing layer that spends money on purpose.',
    stages: [
      {
        title: 'Embeddings and search',
        weeks: 2,
        goal: 'Explain what an embedding encodes and tune an HNSW index along its recall-latency curve.',
        items: [
          { label: 'What an embedding actually is', to: '/courses/ai-engineering/embeddings/what-is-an-embedding' },
          { label: 'HNSW and approximate nearest neighbours', to: '/courses/ai-engineering/embeddings/hnsw' },
          { label: 'Paper: Dense Passage Retrieval', to: '/papers/dpr' },
          { label: 'Paper: HNSW', to: '/papers/hnsw' },
          { label: 'Glossary: BM25', to: '/glossary/bm25' },
        ],
      },
      {
        title: 'RAG that is evaluated',
        weeks: 3,
        goal: 'Ship hybrid retrieval with a reranker and an eval set that reports retriever and generator numbers separately.',
        items: [
          { label: 'A RAG baseline that is actually good', to: '/courses/ai-engineering/rag/rag-baseline' },
          { label: 'Evaluating RAG end to end', to: '/courses/ai-engineering/rag/rag-evaluation' },
          { label: 'Glossary: chunking', to: '/glossary/chunking' },
          { label: 'Glossary: reciprocal rank fusion', to: '/glossary/reciprocal-rank-fusion' },
          { label: 'Lab: Tokenizer', to: '/labs/tokenizer' },
        ],
      },
      {
        title: 'Agents',
        weeks: 3,
        goal: 'Implement the ReAct loop, then compute the task success rate from per-step rates and fix the worst step.',
        items: [
          { label: 'The agent loop', to: '/courses/ai-engineering/agents/agent-loop' },
          { label: 'Memory and context management', to: '/courses/ai-engineering/agents/agent-memory' },
          { label: 'Paper: ReAct', to: '/papers/react' },
          { label: 'Paper: Chain of Thought', to: '/papers/chain-of-thought' },
          { label: 'Lab: Agent Control Room', to: '/labs/agent-control-room' },
        ],
      },
      {
        title: 'Adapting and routing models',
        weeks: 2,
        goal: 'Fine-tune with LoRA for one task and build a cost-quality router over two or more models.',
        items: [
          { label: 'Paper: LoRA', to: '/papers/lora' },
          { label: 'Glossary: Pareto frontier', to: '/glossary/pareto-frontier' },
          { label: 'Lab: Pareto router', to: '/labs/pareto-router' },
          { label: 'Lab: Timeout architect', to: '/labs/timeout-architect' },
        ],
      },
    ],
  },
  {
    track: 'inference-engineering',
    title: 'Inference Engineering roadmap',
    summary: 'Size memory by hand, understand the two regimes of a forward pass, and then read the serving papers with the numbers already in your head.',
    stages: [
      {
        title: 'Memory arithmetic',
        weeks: 2,
        goal: 'Compute weight and KV cache memory for any model and say how many sequences fit on a given GPU.',
        items: [
          { label: 'The KV cache, sized by hand', to: '/courses/inference-engineering/memory/kv-cache' },
          { label: 'Weight memory and quantisation', to: '/courses/inference-engineering/memory/weights-and-quantisation' },
          { label: 'Lab: KV cache estimator', to: '/labs/kv-cache' },
          { label: 'Glossary: arithmetic intensity', to: '/glossary/arithmetic-intensity' },
        ],
      },
      {
        title: 'The two regimes',
        weeks: 2,
        goal: 'Explain why prefill is compute-bound and decode is memory-bound, with the roofline numbers for one GPU.',
        items: [
          { label: 'Prefill vs decode', to: '/courses/inference-engineering/throughput/prefill-vs-decode' },
          { label: 'Paper: FlashAttention', to: '/papers/flash-attention' },
          { label: 'Paper: GQA', to: '/papers/gqa' },
          { label: 'Glossary: continuous batching', to: '/glossary/continuous-batching' },
        ],
      },
      {
        title: 'Serving systems',
        weeks: 3,
        goal: 'Read the vLLM paper and the speculative decoding papers and predict their speedups for your workload before measuring.',
        items: [
          { label: 'Speculative decoding', to: '/courses/inference-engineering/throughput/speculative-decoding' },
          { label: 'Paper: PagedAttention', to: '/papers/paged-attention' },
          { label: 'Paper: Speculative Decoding', to: '/papers/speculative-decoding' },
          { label: 'Paper: Medusa', to: '/papers/medusa' },
          { label: 'Lab: Sampling playground', to: '/labs/sampling' },
        ],
      },
      {
        title: 'Training-scale parallelism',
        weeks: 3,
        goal: 'Lay out a 70B model across a node with tensor parallelism and explain where ZeRO and pipeline parallelism fit.',
        items: [
          { label: 'Paper: Megatron-LM', to: '/papers/megatron-lm' },
          { label: 'Paper: ZeRO', to: '/papers/zero' },
          { label: 'Glossary: tensor parallelism', to: '/glossary/tensor-parallelism' },
          { label: 'Glossary: pipeline parallelism', to: '/glossary/pipeline-parallelism' },
        ],
      },
    ],
  },
  {
    track: 'system-design',
    title: 'System Design roadmap',
    summary: 'Estimate before you build, pick a consistency model on purpose, and read the three storage papers that every database descends from.',
    stages: [
      {
        title: 'Estimation',
        weeks: 2,
        goal: 'Turn users and request sizes into QPS, bandwidth, and storage within a factor of two.',
        items: [
          { label: 'Back-of-the-envelope estimation', to: '/courses/system-design/fundamentals/back-of-envelope' },
          { label: 'Lab: Capacity calculator', to: '/labs/capacity' },
          { label: 'Glossary: p99 latency', to: '/glossary/p99-latency' },
        ],
      },
      {
        title: 'Consistency',
        weeks: 3,
        goal: 'Define linearizability precisely and say what CAP does and does not force you to give up.',
        items: [
          { label: 'Consistency models', to: '/courses/system-design/fundamentals/consistency-models' },
          { label: 'Glossary: linearizability', to: '/glossary/linearizability' },
          { label: 'Glossary: CAP theorem', to: '/glossary/cap-theorem' },
          { label: 'Paper: Raft', to: '/papers/raft' },
        ],
      },
      {
        title: 'The storage papers',
        weeks: 3,
        goal: 'Compare Dynamo and Spanner on the same workload and defend a choice between them.',
        items: [
          { label: 'Paper: Dynamo', to: '/papers/dynamo' },
          { label: 'Paper: Spanner', to: '/papers/spanner' },
          { label: 'Paper: The LSM-Tree', to: '/papers/lsm-tree' },
          { label: 'Glossary: LSM tree', to: '/glossary/lsm-tree' },
        ],
      },
      {
        title: 'Reliability under load',
        weeks: 2,
        goal: 'Design timeouts, retries, and back-pressure for a fan-out service so that overload degrades instead of collapsing.',
        items: [
          { label: 'Glossary: back-pressure', to: '/glossary/back-pressure' },
          { label: 'Lab: Timeout architect', to: '/labs/timeout-architect' },
          { label: 'Lab: Agent Control Room', to: '/labs/agent-control-room' },
        ],
      },
    ],
  },
  {
    track: 'ml-math',
    title: 'ML Mathematics roadmap',
    summary: 'Enough linear algebra, calculus, and probability to read a method section without skipping the equations.',
    stages: [
      {
        title: 'Matrices as maps',
        weeks: 3,
        goal: 'See a matrix as a transformation, factor one with the SVD, and explain what rank means for a weight update.',
        items: [
          { label: 'Matrices as linear maps', to: '/courses/ml-math/linear-algebra/matrices-as-maps' },
          { label: 'Glossary: SVD', to: '/glossary/svd' },
          { label: 'Paper: LoRA', to: '/papers/lora' },
          { label: 'Lab: Attention', to: '/labs/attention' },
        ],
      },
      {
        title: 'Gradients',
        weeks: 3,
        goal: 'Derive the gradient of a two-layer network by hand and watch gradient descent move on a loss surface.',
        items: [
          { label: 'Gradients and the chain rule at scale', to: '/courses/ml-math/linear-algebra/gradients' },
          { label: 'Glossary: gradient descent', to: '/glossary/gradient-descent' },
          { label: 'Lab: Gradient descent', to: '/labs/gradient-descent' },
        ],
      },
      {
        title: 'Optimisation in practice',
        weeks: 2,
        goal: 'Explain why Adam works per-parameter and what dropout is an approximation of.',
        items: [
          { label: 'Paper: Adam', to: '/papers/adam' },
          { label: 'Paper: Dropout', to: '/papers/dropout' },
          { label: 'Glossary: Adam', to: '/glossary/adam' },
        ],
      },
      {
        title: 'Probability and sampling',
        weeks: 2,
        goal: 'Connect cross-entropy, perplexity, softmax, and the sampling knobs into one picture of a language model output.',
        items: [
          { label: 'Glossary: softmax', to: '/glossary/softmax' },
          { label: 'Glossary: perplexity', to: '/glossary/perplexity' },
          { label: 'Glossary: KL divergence', to: '/glossary/kl-divergence' },
          { label: 'Lab: Sampling playground', to: '/labs/sampling' },
        ],
      },
    ],
  },
]

export function findRoadmap(track: string) {
  return roadmaps.find((r) => r.track === track)
}
