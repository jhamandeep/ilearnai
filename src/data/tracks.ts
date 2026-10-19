import type { Track } from './types'

export const tracks: Track[] = [
  {
    slug: 'ai-research',
    title: 'AI Research',
    tagline: 'Read the papers that matter, in the order they matter.',
    description:
      'A guided path through the foundational literature of modern deep learning: from attention and scaling laws to RLHF, mixture of experts, and reasoning models.',
    accent: 'var(--accent-research)',
    status: 'live',
    modules: [
      {
        slug: 'transformers',
        title: 'Transformers from first principles',
        description: 'The architecture behind every frontier model, derived piece by piece.',
        lessons: [
          {
            slug: 'why-attention',
            title: 'Why attention replaced recurrence',
            summary: 'The bottleneck in RNNs and the idea that fixed it.',
            tier: 'free',
            minutes: 12,
            body: `
Recurrent networks process a sequence one token at a time. Each step folds the entire past into a single hidden vector $h_t$, so information about token 3 has to survive hundreds of multiplications before it can influence token 400. Gradients through that chain either vanish or explode, and the model forgets.

Attention removes the chain. Every position looks directly at every other position in one step:

$$\\mathrm{Attention}(Q, K, V) = \\mathrm{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right) V$$

Three things happen here.

1. **Queries meet keys.** $QK^\\top$ scores how relevant each position is to each other position. The result is a $T \\times T$ matrix.
2. **Scaling.** Dividing by $\\sqrt{d_k}$ keeps dot products from growing with dimension, which would push the softmax into a regime where gradients are nearly zero.
3. **Weighted sum.** Softmax turns scores into a distribution, and that distribution mixes the value vectors.

The cost is quadratic in sequence length, which is why most inference engineering is about taming that $T^2$ term. But the benefit is a path length of one between any two tokens, and that is what made scale work.

## What to read next

- *Attention Is All You Need* (Vaswani et al., 2017) in the papers series.
- The next lesson derives multi-head attention and shows why heads specialise.
`,
          },
          {
            slug: 'multi-head',
            title: 'Multi-head attention and why heads specialise',
            summary: 'Splitting the model dimension into subspaces.',
            tier: 'free',
            minutes: 10,
            body: `
A single attention head computes one similarity structure over the sequence. Language has many: syntax, coreference, position, copying. Multi-head attention runs $h$ attention operations in parallel, each in a subspace of dimension $d_k = d_{\\text{model}} / h$, then concatenates:

$$\\mathrm{MultiHead}(X) = \\mathrm{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$

Because the heads are cheap individually, the total compute is the same as one full-width head. What changes is capacity: each head can learn a different attention pattern.

## Empirical specialisation

Probing studies find heads that attend to the previous token, heads that track the subject of a clause, and so-called induction heads that copy from earlier occurrences of the current token. Many heads can be pruned with little loss, which is the observation behind grouped-query and multi-query attention in the Inference Engineering track.
`,
          },
          {
            slug: 'positional-encodings',
            title: 'Positional encodings: sinusoids to RoPE',
            summary: 'How a permutation-invariant operation learns word order.',
            tier: 'pro',
            minutes: 18,
            body: `
Attention is a set operation. Without a positional signal, "dog bites man" and "man bites dog" produce identical representations. The original Transformer adds fixed sinusoids; modern models rotate query and key vectors with RoPE so that the dot product depends only on relative offset:

$$\\langle R_m q, R_n k \\rangle = \\langle q, R_{n-m} k \\rangle$$

This lesson covers sinusoidal, learned, ALiBi, and rotary encodings, the long-context extrapolation problem, and NTK-aware and YaRN scaling.
`,
          },
        ],
      },
      {
        slug: 'scaling',
        title: 'Scaling laws and compute-optimal training',
        description: 'Kaplan, Chinchilla, and what they imply for budgets.',
        lessons: [
          {
            slug: 'kaplan-to-chinchilla',
            title: 'From Kaplan to Chinchilla',
            summary: 'Loss as a power law in parameters, data, and compute.',
            tier: 'free',
            minutes: 15,
            body: `
Kaplan et al. (2020) fit test loss as a power law in model size $N$, dataset size $D$, and compute $C$, and concluded that, for a fixed compute budget, you should grow the model faster than the data.

Hoffmann et al. (2022), the Chinchilla paper, re-ran the experiment with learning-rate schedules tuned per run and found the opposite: parameters and tokens should scale roughly equally. Their fitted form is

$$L(N, D) = E + \\frac{A}{N^{\\alpha}} + \\frac{B}{D^{\\beta}}$$

with $\\alpha \\approx 0.34$ and $\\beta \\approx 0.28$. The practical rule that fell out is about 20 training tokens per parameter.

## Why it matters for you

The rule tells you how to spend a fixed budget on training. It says nothing about inference cost, and that is why production models are now trained far past the Chinchilla point: a smaller model trained on more data is cheaper to serve forever.
`,
          },
          {
            slug: 'inference-aware-scaling',
            title: 'Inference-aware scaling',
            summary: 'Overtraining small models on purpose.',
            tier: 'pro',
            minutes: 14,
            body: `
When serving cost dominates, the optimal training point shifts. This lesson works through the Sardana and Frankle formulation that adds expected inference tokens to the budget, and reproduces the Llama 3 decision to train an 8B model on 15T tokens.
`,
          },
        ],
      },
      {
        slug: 'alignment',
        title: 'Alignment: SFT, RLHF, DPO',
        description: 'How a base model becomes an assistant.',
        lessons: [
          {
            slug: 'rlhf-pipeline',
            title: 'The RLHF pipeline',
            summary: 'Supervised fine-tuning, reward models, and PPO.',
            tier: 'free',
            minutes: 16,
            body: `
InstructGPT established the three-stage recipe.

1. **Supervised fine-tuning.** Train on demonstrations written by labelers.
2. **Reward modelling.** Collect pairwise preferences and fit $r_\\phi(x, y)$ with the Bradley-Terry loss $-\\log \\sigma(r(x, y_w) - r(x, y_l))$.
3. **RL.** Optimise the policy against the reward with a KL penalty to the SFT model so it does not drift into reward hacking:

$$\\max_\\pi \\; \\mathbb{E}_{y \\sim \\pi}[r(x, y)] - \\beta\\, \\mathrm{KL}(\\pi \\,\\|\\, \\pi_{\\text{SFT}})$$

DPO later showed that this objective has a closed-form optimum, so you can skip the reward model and train on preferences directly. The next lesson derives that.
`,
          },
          {
            slug: 'dpo-derivation',
            title: 'Deriving DPO',
            summary: 'Reward model elimination step by step.',
            tier: 'pro',
            minutes: 20,
            body: `
Starting from the KL-regularised objective, the optimal policy is $\\pi^*(y|x) \\propto \\pi_{\\text{ref}}(y|x) \\exp(r(x,y)/\\beta)$. Inverting gives the reward in terms of the policy, and substituting into Bradley-Terry yields the DPO loss. Full derivation, with a note on why the partition function cancels.
`,
          },
        ],
      },
    ],
  },
  {
    slug: 'ai-engineering',
    title: 'AI Engineering',
    tagline: 'Embeddings, retrieval, agents, and evaluation that survive production.',
    description:
      'The practical track. Build retrieval pipelines, agent loops, and evaluation harnesses, and learn where each one breaks.',
    accent: 'var(--accent-engineering)',
    status: 'live',
    modules: [
      {
        slug: 'embeddings',
        title: 'Embeddings and vector search',
        description: 'Representing text as geometry and searching it fast.',
        lessons: [
          {
            slug: 'what-is-an-embedding',
            title: 'What an embedding actually is',
            summary: 'Dense vectors, cosine similarity, and what they miss.',
            tier: 'free',
            minutes: 10,
            body: `
An embedding model maps text to a vector in $\\mathbb{R}^d$ such that semantically similar texts land close together. Similarity is usually cosine:

$$\\cos(u, v) = \\frac{u \\cdot v}{\\|u\\| \\, \\|v\\|}$$

Three practical facts that trip people up.

- **Embeddings are not symmetric across tasks.** A question and its answer should be close, but questions are also close to other questions. Retrieval models are trained with query and passage prefixes for this reason.
- **Chunking is a modelling decision.** A 2,000-token chunk averages too many ideas into one point. A 50-token chunk loses context. Most pipelines settle between 200 and 500 tokens with overlap.
- **Dimensionality is a cost knob.** Matryoshka-trained models let you truncate to 256 dimensions with small quality loss and a 6x storage win.
`,
          },
          {
            slug: 'hnsw',
            title: 'HNSW and approximate nearest neighbours',
            summary: 'Why exact search dies at a million vectors.',
            tier: 'pro',
            minutes: 15,
            body: `
Brute-force search is $O(Nd)$ per query. HNSW builds a multi-layer skip-list graph so that search is roughly $O(\\log N)$. This lesson covers the construction parameters M and efConstruction, the recall and latency trade-off set by efSearch, and when to prefer IVF-PQ.
`,
          },
        ],
      },
      {
        slug: 'rag',
        title: 'Retrieval-augmented generation',
        description: 'Grounding a model in your data without fine-tuning it.',
        lessons: [
          {
            slug: 'rag-baseline',
            title: 'A RAG baseline that is actually good',
            summary: 'Hybrid retrieval, reranking, and citing sources.',
            tier: 'free',
            minutes: 14,
            body: `
The naive pipeline is embed, top-k, stuff into prompt. It works on demos and fails on real corpora. The baseline that holds up adds three stages.

1. **Hybrid retrieval.** Run BM25 and dense search in parallel and merge with reciprocal rank fusion. Keyword search catches product codes and names that embeddings blur.
2. **Reranking.** Take the top 50 and score each one against the query with a cross-encoder. This is where most of the quality comes from.
3. **Citations.** Number the chunks in the prompt and ask the model to cite by number. Then verify every citation points at a chunk that actually contains the claim.

Measure recall@k on a labelled set before touching the generator. If retrieval cannot find the answer, no prompt will.
`,
          },
          {
            slug: 'rag-evaluation',
            title: 'Evaluating RAG end to end',
            summary: 'Faithfulness, answer relevance, context precision.',
            tier: 'pro',
            minutes: 18,
            body: `
Separate retrieval metrics from generation metrics. Build a golden set, compute context precision and recall, then score faithfulness with an LLM judge calibrated against human labels. Includes a judge prompt template and the failure modes of judges.
`,
          },
        ],
      },
      {
        slug: 'agents',
        title: 'Agents and tool use',
        description: 'Loops, tools, and the reliability math nobody shows you.',
        lessons: [
          {
            slug: 'agent-loop',
            title: 'The agent loop',
            summary: 'Observe, think, act, repeat, and when to stop.',
            tier: 'free',
            minutes: 12,
            body: `
An agent is a model in a loop with tools. The loop is simple to write and hard to make reliable.

\`\`\`
while not done:
    response = model(messages, tools)
    if response.tool_calls:
        results = run(response.tool_calls)
        messages.append(results)
    else:
        done = True
\`\`\`

The reliability problem is multiplicative. If each step succeeds with probability $p$, an $n$-step task succeeds with probability $p^n$. At 95 percent per step, a 20-step task succeeds about 36 percent of the time. The Agent Control Room lab lets you play with retries and fallbacks to see what moves that number.

## Three rules

- Give tools narrow, typed schemas. Vague tools produce vague calls.
- Return errors as observations, not exceptions. The model can recover from "file not found"; it cannot recover from a crash.
- Budget steps. Every loop needs a maximum and a reason to stop early.
`,
          },
          {
            slug: 'agent-memory',
            title: 'Memory and context management for agents',
            summary: 'Summarisation, scratchpads, and retrieval over history.',
            tier: 'pro',
            minutes: 16,
            body: `
Context windows fill fast. This lesson compares rolling summaries, structured scratchpads, and retrieval over past turns, with latency and cost numbers for each.
`,
          },
        ],
      },
    ],
  },
  {
    slug: 'inference-engineering',
    title: 'Inference Engineering',
    tagline: 'Serve large models fast and cheap.',
    description:
      'KV caches, batching, quantisation, speculative decoding, and the memory arithmetic that decides what fits on a GPU.',
    accent: 'var(--accent-inference)',
    status: 'live',
    modules: [
      {
        slug: 'memory',
        title: 'Memory arithmetic',
        description: 'Weights, activations, and the KV cache.',
        lessons: [
          {
            slug: 'kv-cache',
            title: 'The KV cache, sized by hand',
            summary: 'Where the memory goes during decoding.',
            tier: 'free',
            minutes: 12,
            body: `
During autoregressive decoding, each new token attends to every previous token. Recomputing keys and values for the whole prefix at every step would be quadratic, so inference engines cache them. The cache size per sequence is

$$\\text{bytes} = 2 \\times L \\times H_{kv} \\times d_{\\text{head}} \\times T \\times b$$

where the 2 covers keys and values, $L$ is layers, $H_{kv}$ is the number of KV heads, $d_{\\text{head}}$ is head dimension, $T$ is tokens, and $b$ is bytes per element.

For Llama 3 70B at 8k context in FP16: $2 \\times 80 \\times 8 \\times 128 \\times 8192 \\times 2 \\approx 2.7$ GB per sequence. With 16 GB of free memory after weights, that is 6 concurrent sequences. Grouped-query attention is why $H_{kv}$ is 8 and not 64; without it the number would be 21 GB.

Open the KV cache lab to size your own configuration.
`,
          },
          {
            slug: 'weights-and-quantisation',
            title: 'Weight memory and quantisation',
            summary: 'FP16, INT8, INT4, and what you give up.',
            tier: 'pro',
            minutes: 14,
            body: `
Weight memory is parameters times bytes per parameter. This lesson covers per-channel and group-wise quantisation, GPTQ and AWQ, and when INT4 weights with FP16 activations are a free win versus when they are not.
`,
          },
        ],
      },
      {
        slug: 'throughput',
        title: 'Batching and throughput',
        description: 'Continuous batching, paged attention, speculative decoding.',
        lessons: [
          {
            slug: 'prefill-vs-decode',
            title: 'Prefill is compute-bound, decode is memory-bound',
            summary: 'The two phases and why they want different hardware.',
            tier: 'free',
            minutes: 11,
            body: `
Prefill processes the whole prompt in one forward pass. It multiplies large matrices and saturates the GPU's arithmetic units. Decode produces one token per step, which means reading every weight from HBM to do a tiny amount of math. Arithmetic intensity collapses.

The ratio that matters is FLOPs per byte moved. An H100 does about 990 TFLOPS in FP16 against 3.35 TB/s of bandwidth, so it needs about 300 FLOPs per byte to stay busy. Single-sequence decode delivers about 2. Batching is how you climb back up: each extra sequence reuses the same weight read.

That is the whole motivation for continuous batching and paged attention, which the next lessons cover.
`,
          },
          {
            slug: 'speculative-decoding',
            title: 'Speculative decoding',
            summary: 'Draft small, verify big, keep the distribution exact.',
            tier: 'pro',
            minutes: 15,
            body: `
A small draft model proposes $k$ tokens; the large model verifies all of them in one forward pass and accepts a prefix using rejection sampling that preserves the target distribution exactly. Expected speed-up as a function of acceptance rate, with the arithmetic for when it is worth it.
`,
          },
        ],
      },
    ],
  },
  {
    slug: 'system-design',
    title: 'System Design',
    tagline: 'Distributed systems for people who will be paged.',
    description: 'Consistency, replication, queues, caches, and the capacity planning behind them.',
    accent: 'var(--accent-systems)',
    status: 'live',
    modules: [
      {
        slug: 'fundamentals',
        title: 'Fundamentals',
        description: 'Latency, throughput, and back-of-the-envelope estimation.',
        lessons: [
          {
            slug: 'back-of-envelope',
            title: 'Back-of-the-envelope estimation',
            summary: 'The numbers every engineer should know.',
            tier: 'free',
            minutes: 10,
            body: `
Capacity planning starts with a few numbers and a lot of multiplication.

| Operation | Approximate time |
|---|---|
| L1 cache reference | 1 ns |
| Main memory reference | 100 ns |
| SSD random read | 100 µs |
| Round trip within a datacenter | 500 µs |
| Disk seek | 10 ms |
| Round trip across continents | 150 ms |

A worked example: 10 million daily active users, each making 20 requests, is 200 million requests per day, or about 2,300 per second on average and perhaps 7,000 at peak. If each request reads 10 KB, peak read bandwidth is 70 MB/s, which one machine handles comfortably. The capacity lab does this arithmetic for you.
`,
          },
          {
            slug: 'consistency-models',
            title: 'Consistency models',
            summary: 'Linearizable, sequential, causal, eventual.',
            tier: 'pro',
            minutes: 17,
            body: `
What each model guarantees, what it costs, and which real databases provide which. Includes the Jepsen anomalies that distinguish them.
`,
          },
        ],
      },
    ],
  },
  {
    slug: 'ml-math',
    title: 'ML Mathematics',
    tagline: 'The linear algebra, probability, and calculus behind the models.',
    description: 'Enough mathematics to read any paper on the research track without skipping the equations.',
    accent: 'var(--accent-math)',
    status: 'live',
    modules: [
      {
        slug: 'linear-algebra',
        title: 'Linear algebra',
        description: 'Vectors, matrices, and decompositions.',
        lessons: [
          {
            slug: 'matrices-as-maps',
            title: 'Matrices as linear maps',
            summary: 'Stop thinking of matrices as grids of numbers.',
            tier: 'free',
            minutes: 12,
            body: `
A matrix $W \\in \\mathbb{R}^{m \\times n}$ is a function from $\\mathbb{R}^n$ to $\\mathbb{R}^m$. The columns are where the basis vectors land. Every linear layer in a network is one of these maps followed by a nonlinearity.

The singular value decomposition $W = U \\Sigma V^\\top$ says every linear map is a rotation, a scaling along orthogonal axes, and another rotation. The singular values in $\\Sigma$ tell you how much the map stretches each direction, which is why LoRA can approximate a fine-tuning update with a rank-8 matrix: most of the update's energy lives in a few directions.
`,
          },
          {
            slug: 'gradients',
            title: 'Gradients and the chain rule at scale',
            summary: 'Backpropagation as reverse-mode differentiation.',
            tier: 'pro',
            minutes: 15,
            body: `
Forward-mode versus reverse-mode automatic differentiation, why reverse mode is the right choice when outputs are few and inputs are many, and a hand-traced backward pass through a two-layer network.
`,
          },
        ],
      },
    ],
  },
  {
    slug: 'open-robotics',
    title: 'Open Robotics',
    tagline: 'Preview. Vision-language-action models and the sim-to-real gap.',
    description: 'A preview track on embodied AI. Content is being added weekly.',
    accent: 'var(--accent-robotics)',
    status: 'preview',
    modules: [
      {
        slug: 'vla',
        title: 'Vision-language-action models',
        description: 'From web-scale pretraining to motor commands.',
        lessons: [
          {
            slug: 'what-is-a-vla',
            title: 'What a VLA model is',
            summary: 'Tokenising actions like text.',
            tier: 'free',
            minutes: 9,
            body: `
A vision-language-action model takes camera frames and an instruction and emits a sequence of action tokens, usually discretised joint deltas. RT-2 showed that a VLM fine-tuned this way inherits semantic generalisation from web data: it can "move the cup to the picture of a dog" without ever having seen that pairing in robot data.
`,
          },
        ],
      },
    ],
  },
]

export function findTrack(slug: string) {
  return tracks.find((t) => t.slug === slug)
}

export function findLesson(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const track = findTrack(trackSlug)
  const module = track?.modules.find((m) => m.slug === moduleSlug)
  const lesson = module?.lessons.find((l) => l.slug === lessonSlug)
  if (!track || !module || !lesson) return undefined
  return { track, module, lesson }
}

export function lessonCount(track: Track) {
  return track.modules.reduce((n, m) => n + m.lessons.length, 0)
}

export function allLessons() {
  return tracks.flatMap((t) =>
    t.modules.flatMap((m) => m.lessons.map((l) => ({ track: t, module: m, lesson: l }))),
  )
}
