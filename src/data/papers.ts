import type { Paper } from './types'

export const papers: Paper[] = [
  {
    slug: 'attention-is-all-you-need',
    day: 1,
    title: 'Attention Is All You Need',
    authors: 'Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin',
    year: 2017,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/1706.03762',
    track: 'ai-research',
    tldr: 'Replaces recurrence with self-attention and sets the template for every model since.',
    notes: `
## Why it matters

Before this paper, sequence models were recurrent or convolutional. Both struggled with long-range dependencies. The Transformer makes every position attend to every other in a single layer, and because it is embarrassingly parallel across the sequence, it trains far faster on accelerators.

## What to pay attention to

- Section 3.2.1: the $\\sqrt{d_k}$ scaling and the one-sentence justification for it.
- Table 1: path length comparison. This table is the whole argument.
- The positional encoding choice, which the field later revised.

## Reading time

About 40 minutes if you work through the equations.
`,
  },
  {
    slug: 'scaling-laws',
    day: 2,
    title: 'Scaling Laws for Neural Language Models',
    authors: 'Kaplan, McCandlish, Henighan, Brown, Chess, Child, Gray, Radford, Wu, Amodei',
    year: 2020,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/2001.08361',
    track: 'ai-research',
    tldr: 'Loss is a smooth power law in model size, data, and compute across seven orders of magnitude.',
    notes: `
## Why it matters

This is the paper that turned "bigger is better" into an equation and justified the compute budgets of the following five years.

## Caveat

The conclusion that model size should grow faster than data was later overturned by Chinchilla. Read them together.
`,
  },
  {
    slug: 'chinchilla',
    day: 3,
    title: 'Training Compute-Optimal Large Language Models',
    authors: 'Hoffmann et al.',
    year: 2022,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2203.15556',
    track: 'ai-research',
    tldr: 'For a fixed budget, scale parameters and tokens together: about 20 tokens per parameter.',
    notes: `
## Why it matters

Chinchilla, a 70B model trained on 1.4T tokens, beat Gopher, a 280B model trained on 300B tokens, with the same compute. The implication: most large models of 2021 were badly undertrained.

## The fit

$L(N, D) = E + A/N^{\\alpha} + B/D^{\\beta}$. Three methods of fitting agree on the result, which is what makes it convincing.
`,
  },
  {
    slug: 'instructgpt',
    day: 4,
    title: 'Training language models to follow instructions with human feedback',
    authors: 'Ouyang et al.',
    year: 2022,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2203.02155',
    track: 'ai-research',
    tldr: 'The SFT, reward model, PPO recipe that turned GPT-3 into an assistant.',
    notes: `
## Why it matters

A 1.3B InstructGPT model was preferred by labelers over the 175B base GPT-3. Alignment training is worth more than two orders of magnitude of parameters for usefulness.

## Pay attention to

The KL penalty in the RL objective, and the "alignment tax" discussion in Section 4.
`,
  },
  {
    slug: 'flash-attention',
    day: 5,
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: 'Dao, Fu, Ermon, Rudra, Ré',
    year: 2022,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2205.14135',
    track: 'inference-engineering',
    tldr: 'Attention is bottlenecked by memory traffic, not FLOPs. Tiling fixes it without approximation.',
    notes: `
## Why it matters

Standard attention materialises the $T \\times T$ score matrix in HBM. FlashAttention computes it in SRAM tiles with online softmax and never writes the full matrix. Same output, 2 to 4x faster, and memory linear in sequence length.

## The idea to internalise

Count bytes moved, not FLOPs. This is the lens for the entire Inference Engineering track.
`,
  },
  {
    slug: 'paged-attention',
    day: 6,
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
    authors: 'Kwon et al.',
    year: 2023,
    venue: 'SOSP',
    url: 'https://arxiv.org/abs/2309.06180',
    track: 'inference-engineering',
    tldr: 'Treat the KV cache like virtual memory: fixed-size blocks, no fragmentation. This is vLLM.',
    notes: `
## Why it matters

Pre-allocating a maximum-length KV cache per request wastes 60 to 80 percent of memory. Paging it in blocks lets the server batch 2 to 4x more sequences.
`,
  },
  {
    slug: 'dpo',
    day: 7,
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    authors: 'Rafailov, Sharma, Mitchell, Ermon, Manning, Finn',
    year: 2023,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2305.18290',
    track: 'ai-research',
    tldr: 'Skips the reward model and PPO: train on preference pairs with a simple classification loss.',
    notes: `
## Why it matters

Removes the least stable part of RLHF. The derivation is short and worth reproducing by hand; the Alignment module on the research track walks through it.
`,
  },
  {
    slug: 'lets-verify-step-by-step',
    day: 8,
    title: "Let's Verify Step by Step",
    authors: 'Lightman et al.',
    year: 2023,
    venue: 'ICLR',
    url: 'https://arxiv.org/abs/2305.20050',
    track: 'ai-research',
    tldr: 'Process reward models that grade each reasoning step beat outcome reward models on MATH.',
    notes: `
## Why it matters

Grading the final answer alone rewards lucky reasoning. Grading each step gives a denser signal, and the paper releases the PRM800K dataset of step-level labels. This line of work leads directly to reasoning models trained with RL on verifiable tasks.
`,
  },
]

export function findPaper(slug: string) {
  return papers.find((p) => p.slug === slug)
}
