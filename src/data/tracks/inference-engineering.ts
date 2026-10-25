import type { Track } from '../types'

export const track: Track = {
    slug: 'inference-engineering',
    title: 'Inference Engineering',
    tagline: 'Serve large models fast and cheap.',
    description:
      'KV caches, batching, quantisation, speculative decoding, attention kernels, parallelism, the serving stack, and the measurements that decide what fits on a GPU.',
    accent: 'var(--accent-inference)',
    status: 'live',
    level: 'advanced',
    order: 8,
    audience: 'Engineers who serve models and need to make them faster and cheaper on real hardware.',
    outcome: 'Size a GPU fleet, tune a serving stack, and explain every millisecond of latency.',
    prerequisites: ['ai-engineering', 'ml-math'],
    modules: [
      {
        slug: 'memory',
        title: 'Memory arithmetic',
        description: 'Count the bytes for weights, the KV cache, and activations before you buy a GPU.',
        level: 'advanced',
        lessons: [
          {
            slug: 'kv-cache',
            title: 'The KV cache, sized by hand',
            summary: 'Compute the memory that one sequence needs for its key-value cache during decoding.',
            minutes: 14,
            objectives: [
              'Explain why an inference engine stores keys and values instead of recomputing them.',
              'Compute the key-value cache size for a given model and context length.',
              'Estimate how many concurrent sequences fit in a given amount of free memory.',
              'Explain how grouped-query attention reduces the cache by a factor of 8.',
            ],
            keyTerms: ['kv-cache', 'grouped-query-attention', 'attention head', 'context length', 'bytes per element'],
            links: [
              { label: 'Efficiently scaling transformer inference (Pope et al.)', url: 'https://arxiv.org/abs/2211.05102', kind: 'paper' },
              { label: 'GQA: training generalized multi-query transformer models', url: 'https://arxiv.org/abs/2305.13245', kind: 'paper' },
              { label: 'Efficient memory management with PagedAttention (vLLM)', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
              { label: 'Large transformer model inference optimization (Lilian Weng)', url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/', kind: 'article' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
            ],
            body: `
## What this lesson covers

This lesson explains the key-value (KV) cache. You compute its size by hand. You then estimate how many sequences one graphics processing unit (GPU) can serve at the same time.

## Why it matters

Weights are a fixed cost. The KV cache grows with every token in every active sequence. On a busy server the cache is often larger than the weights. If you size the cache wrong, the server refuses requests or runs out of memory.

:::video
id: kCc8FmEb1nY
why: Watch the self-attention chapter, about 20 minutes. Every token produces one key and one value vector. Those vectors are exactly what the cache stores.
:::

## The idea with an example

A transformer generates text one token at a time. To produce the next token, each attention layer compares the new token with every earlier token. For that comparison the layer needs the key vector and the value vector of each earlier token.

Without a cache, the engine recomputes all keys and values at every step. With a cache, the engine computes each key and value once and stores it.

The diagram shows how one decode step uses the cache.

:::flow
title: One decode step with the KV cache
New token -> Attention layer: query vector
Attention layer -> KV cache: new key and value, stored once
KV cache -> Attention layer: all earlier keys and values
Attention layer -> Next token: attention output
:::

Take a 70B model with these settings:

| Symbol | Meaning | Value |
| --- | --- | --- |
| $L$ | number of layers | 80 |
| $H_{kv}$ | number of key-value heads | 8 |
| $d_{head}$ | size of one head | 128 |
| $T$ | tokens in the sequence | 8192 |
| $b$ | bytes per element (FP16) | 2 |

Multiply the values in this order:

1. Elements per token per layer for keys: $8 \\times 128 = 1024$.
2. Keys and values together: $2 \\times 1024 = 2048$ elements.
3. All layers: $2048 \\times 80 = 163{,}840$ elements per token.
4. Bytes per token: $163{,}840 \\times 2 = 327{,}680$ bytes, about 0.33 MB.
5. Whole sequence: $327{,}680 \\times 8192 = 2{,}684{,}354{,}560$ bytes, about 2.68 GB.

One 8k-token sequence needs 2.68 GB of cache. If the GPU has 16 GB free after the weights, then $16 / 2.68 = 5.97$. The server can hold 5 full-length sequences at once.

Press Next to admit sequences until the free memory runs out.

:::scenario
title: Admit 8k-token sequences into 16 GB of free memory
state: free=16 GB, sequences=0, waiting=0
step: The weights are loaded. The GPU has 16 GB free for the cache. Each full-length sequence needs 2.68 GB.
step: The scheduler admits sequence 1 and reserves 2.68 GB.
state: free=13.32 GB, sequences=1
step: The scheduler admits sequence 2.
state: free=10.64 GB, sequences=2
step: The scheduler admits sequence 3.
state: free=7.96 GB, sequences=3
step: The scheduler admits sequence 4.
state: free=5.28 GB, sequences=4
step: The scheduler admits sequence 5.
state: free=2.6 GB, sequences=5
step: Sequence 6 needs 2.68 GB but only 2.6 GB is free. The scheduler makes it wait.
state: waiting=1
:::

Now remove grouped-query attention. The model then has 64 key-value heads instead of 8. The cache grows by a factor of 8 to 21.5 GB per sequence. Not one full-length sequence fits in 16 GB.

The bars compare the cache per sequence for three models.

:::bars
title: KV cache per 8k-token sequence in FP16
unit: GB
70B with GQA, 8 KV heads: 2.68
70B without GQA, 64 KV heads: 21.5
8B with GQA, 8 KV heads: 1.07
:::

## How it works

The cache size per sequence is:

$$\\text{bytes} = 2 \\times L \\times H_{kv} \\times d_{head} \\times T \\times b$$

The factor 2 counts keys and values. $L$ is the number of layers. $H_{kv}$ is the number of key-value heads. $d_{head}$ is the number of elements in one head. $T$ is the number of tokens in the sequence. $b$ is the number of bytes per element.

Grouped-query attention (GQA) lets several query heads share one key-value head. The model keeps 64 query heads but only 8 key-value heads. Only $H_{kv}$ enters the formula, so the cache shrinks by a factor of 8. Multi-query attention (MQA) is the extreme case with $H_{kv} = 1$.

The cache grows with $T$. This table shows the cache for the same 70B model at different context lengths:

| Context length (tokens) | Cache per sequence |
| --- | --- |
| 1,024 | 0.34 GB |
| 4,096 | 1.34 GB |
| 8,192 | 2.68 GB |
| 32,768 | 10.7 GB |
| 131,072 | 42.9 GB |

The bars show the same growth with context length.

:::bars
title: Cache per sequence for the 70B model by context length
unit: GB
1,024 tokens: 0.34
4,096 tokens: 1.34
8,192 tokens: 2.68
32,768 tokens: 10.7
131,072 tokens: 42.9
:::

To size a server, use this procedure:

1. Compute the bytes per token: $2 \\times L \\times H_{kv} \\times d_{head} \\times b$.
2. Multiply by the longest context length you accept.
3. Subtract the weight memory and the engine overhead from the GPU memory.
4. Divide the remaining memory by the per-sequence cache size.
5. Round down. The result is the number of full-length sequences.

Note: most sequences are shorter than the maximum, so a real engine holds more sequences than this worst case.


This script computes the numbers from the example. Change the settings to match your own model.

:::code
lang: python
file: kv_cache.py
def kv_cache_bytes(layers, kv_heads, head_dim, tokens, bytes_per_elem=2):
    return 2 * layers * kv_heads * head_dim * tokens * bytes_per_elem

GB = 1e9
per_token = kv_cache_bytes(80, 8, 128, 1)
per_seq = kv_cache_bytes(80, 8, 128, 8192)
print("bytes per token:", per_token)
print("cache per 8k sequence:", round(per_seq / GB, 2), "GB")
print("full sequences in 16 GB:", int(16 * GB // per_seq))
:::

:::code
lang: text
bytes per token: 327680
cache per 8k sequence: 2.68 GB
full sequences in 16 GB: 5
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Size the cache for an 8B model
task: Use the kv_cache_bytes function from above for an 8B model with 32 layers, 8 key-value heads and a head size of 128 in FP16. Print the cache per 8,192-token sequence and per 32,768-token sequence. Then print how many full sequences of each length fit in 16 GB of free memory.
hint: Only the layer count changes from the 70B example. The 32k case is 4 times the 8k case.
lang: python
solution:
def kv_cache_bytes(layers, kv_heads, head_dim, tokens, bytes_per_elem=2):
    return 2 * layers * kv_heads * head_dim * tokens * bytes_per_elem

GB = 1e9
for tokens in (8192, 32768):
    per_seq = kv_cache_bytes(32, 8, 128, tokens)
    print(tokens, "tokens:", round(per_seq / GB, 2), "GB,",
          int(16 * GB // per_seq), "sequences in 16 GB")
# 8192 tokens: 1.07 GB, 14 sequences
# 32768 tokens: 4.29 GB, 3 sequences
:::

## Common mistakes

- Mistake: use the number of query heads in the formula. Fix: use the number of key-value heads, which GQA makes much smaller.
- Mistake: forget the factor of 2 for keys and values. Fix: write the formula down and check every factor.
- Mistake: size the cache for the average prompt only. Fix: size for the longest context you accept, then let the scheduler fill the rest.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: the KV cache
q: What is the cache per token for a model with 32 layers, 8 key-value heads and a head size of 128 in FP16?
- 65,536 bytes
* 131,072 bytes
- 262,144 bytes
- 327,680 bytes
why: Multiply 2 (keys and values) by 32 layers, 8 heads, 128 elements and 2 bytes to get 131,072 bytes.
q: A model has 32 query heads and 4 key-value heads. Which number enters the cache formula?
- 32, the number of query heads
* 4, the number of key-value heads
- 8, the ratio of the two
- 36, the sum of the two
why: Only keys and values are cached, so only the key-value head count matters.
q: A GPU has 8 GB free and each sequence needs 1.34 GB of cache. How many full sequences fit?
- 4
* 5
- 6
- 8
why: 8 divided by 1.34 is 5.97, and the scheduler rounds down to 5.
q: Why does the engine store keys and values instead of recomputing them at every decode step?
* Each step needs the keys and values of every earlier token, so recomputation would cost a full prefill per token.
- The keys and values change at every step and must be saved to stay in sync.
- Storing them lets the engine skip the attention layers for old tokens.
- The weights are too large to read twice.
why: Attention compares the new token with all earlier tokens, so without a cache every step repeats all earlier work.
q: You switch the cache from FP16 to FP8 and keep everything else the same. What happens to the cache per sequence?
- It stays the same
* It halves
- It drops by a factor of 4
- It doubles
why: Bytes per element falls from 2 to 1, and the cache size is proportional to that factor.
:::

## Go further

Open the KV cache estimator at /labs/kv-cache and type your own model settings. The paper by Pope and colleagues gives the full memory analysis for inference at scale. The GQA paper shows how to convert a model to fewer key-value heads. The vLLM paper and documentation explain how the engine stores the cache in blocks. Lilian Weng's article gives a wide overview of inference optimisation.
`,
          },
          {
            slug: 'weights-and-quantisation',
            title: 'Weight memory and quantisation',
            summary: 'Compute weight memory at FP16, INT8 and INT4 and learn what quantisation gives up.',
            minutes: 15,
            objectives: [
              'Compute the weight memory of a model from its size and its bytes per weight.',
              'Quantise a small group of values to INT4 with a scale by hand.',
              'Compare per-channel and group-wise quantisation.',
              'Choose when weight-only INT4 is safe and when it costs quality.',
            ],
            keyTerms: ['quantisation', 'scale', 'zero point', 'group size', 'outlier', 'weight-only quantisation'],
            links: [
              { label: 'GPTQ: accurate post-training quantization', url: 'https://arxiv.org/abs/2210.17323', kind: 'paper' },
              { label: 'AWQ: activation-aware weight quantization', url: 'https://arxiv.org/abs/2306.00978', kind: 'paper' },
              { label: 'SmoothQuant: W8A8 quantization', url: 'https://arxiv.org/abs/2211.10438', kind: 'paper' },
              { label: 'LLM.int8(): 8-bit matrix multiplication', url: 'https://arxiv.org/abs/2208.07339', kind: 'paper' },
              { label: 'AutoGPTQ repository', url: 'https://github.com/AutoGPTQ/AutoGPTQ', kind: 'repo' },
              { label: 'bitsandbytes repository', url: 'https://github.com/bitsandbytes-foundation/bitsandbytes', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson explains how much memory the weights of a model need. You quantise four values to 4-bit integers by hand and learn where quantisation fails.

## Why it matters

Quantisation stores each weight in fewer bits. A 70B model needs 140 GB in 16-bit floating point (FP16), which needs two 80 GB graphics processing units (GPUs). In 4-bit integer (INT4) form it needs 35 GB and fits on one GPU. That change halves the hardware bill.

:::video
id: WxYC9-hBM_g
why: Watch the part where Ollama pulls a model, about 5 minutes in. The file sizes on screen are INT4 weights, about 0.5 to 0.6 bytes per weight including the scales.
:::

## The idea with an example

Weight memory is a product of two numbers:

$$\\text{bytes} = N \\times b$$

$N$ is the number of weights. $b$ is the number of bytes per weight. FP16 uses 2 bytes. 8-bit integer (INT8) uses 1 byte. INT4 uses 0.5 bytes.

| Model | FP16 | INT8 | INT4 |
| --- | --- | --- | --- |
| 7B | 14 GB | 7 GB | 3.5 GB |
| 13B | 26 GB | 13 GB | 6.5 GB |
| 70B | 140 GB | 70 GB | 35 GB |

The bars compare the three formats for the 70B model.

:::bars
title: Weight memory of a 70B model
unit: GB
FP16, 2 bytes per weight: 140
INT8, 1 byte per weight: 70
INT4, 0.5 bytes per weight: 35
:::

Now quantise four weights by hand. The values are 0.8, -1.2, 0.3 and 2.1. INT4 holds integers from -8 to 7. Use a symmetric scheme with one scale and no zero point.

1. Find the largest absolute value: 2.1.
2. Compute the scale: $s = 2.1 / 7 = 0.3$.
3. Divide each value by the scale and round to the nearest integer.
4. Store the four integers and the scale 0.3.

Press Next to quantise the four weights one at a time.

:::scenario
title: Quantise 0.8, -1.2, 0.3 and 2.1 to INT4
state: largest=none, scale=none, stored=none, restored=none
step: Find the largest absolute value among the four weights. It is 2.1.
state: largest=2.1
step: Divide 2.1 by 7, the largest INT4 value. The scale is 0.3.
state: scale=0.3
step: Divide 0.8 by 0.3 and round. 2.67 rounds to 3.
state: stored=3
step: Divide -1.2 by 0.3 and round. -4.0 stays -4.
state: stored=3 -4
step: Divide 0.3 and 2.1 by the scale and round. The results are 1 and 7.
state: stored=3 -4 1 7
step: Multiply each integer by 0.3 to restore the weights. The first value is now 0.9 instead of 0.8.
state: restored=0.9 -1.2 0.3 2.1, error on first weight=0.1
:::

| Weight | Divided by 0.3 | Stored integer | Restored value |
| --- | --- | --- | --- |
| 0.8 | 2.67 | 3 | 0.9 |
| -1.2 | -4.0 | -4 | -1.2 |
| 0.3 | 1.0 | 1 | 0.3 |
| 2.1 | 7.0 | 7 | 2.1 |

The first value moved from 0.8 to 0.9. That is the quantisation error. The scale is one FP16 number shared by four weights, so its storage cost is small.

## How it works

The general formula for a quantised weight is:

$$w \\approx s \\times (q - z)$$

$w$ is the original weight. $s$ is the scale. $q$ is the stored integer. $z$ is the zero point, an integer offset for values that are not centred on zero.

The scale defines the error. One large weight forces a large scale, and then every small weight in the same group loses precision. Two schemes limit this problem:

- Per-channel quantisation uses one scale for each output row of a weight matrix. A row of a 70B model has 8,192 weights.
- Group-wise quantisation uses one scale for every group of 128 weights in a row. The scales cost more memory, about 2 bits per weight extra at INT4, but each outlier only damages 127 neighbours.

GPTQ quantises one column at a time and adjusts the remaining columns to cancel the error. AWQ scales up the weights that matter most to the activations before it quantises them.

Weight-only quantisation stores INT4 weights and computes in FP16. The engine reads 0.5 bytes per weight, then converts each weight to FP16 before the multiply. This helps when decode is limited by memory bandwidth, which is the common case.

The diagram shows the path of the weights in a weight-only INT4 multiply.

:::flow
title: Weight-only INT4 matrix multiply
HBM -> Dequantise: INT4 weights, 0.5 bytes each
Scales -> Dequantise: one FP16 scale per group of 128
Dequantise -> Multiply: FP16 weights
Activations -> Multiply: FP16 activations
Multiply -> Output: FP16 result
:::

Activation quantisation stores the activations in INT8 as well. The scheme W8A8 means 8-bit weights and 8-bit activations. SmoothQuant moves the activation outliers into the weights, which are easier to quantise. W8A8 uses the faster integer arithmetic units, so it helps during prefill.

Quality drops in three situations:

- Small models. A 1B model has few redundant weights, so each error matters more.
- Outlier channels. Some channels hold values 100 times larger than the rest.
- Long reasoning tasks. Small errors compound over many generated tokens.

Caution: a quantised model can pass a perplexity test and still fail your task. Run your own evaluation before you ship.


This script quantises the four weights from the example and prints the error on each one.

:::code
lang: python
file: int4.py
def quantise_int4(values):
    scale = max(abs(v) for v in values) / 7
    stored = [max(-8, min(7, round(v / scale))) for v in values]
    restored = [q * scale for q in stored]
    return scale, stored, restored

weights = [0.8, -1.2, 0.3, 2.1]
scale, stored, restored = quantise_int4(weights)
print("scale:", round(scale, 3))
print("stored:", stored)
for w, r in zip(weights, restored):
    print(w, "->", round(r, 2), " error", round(abs(w - r), 2))

for params_b in (7, 13, 70):
    print(params_b, "B weights:", params_b * 2, "GB FP16,", params_b, "GB INT8,", params_b * 0.5, "GB INT4")
:::

:::code
lang: text
scale: 0.3
stored: [3, -4, 1, 7]
0.8 -> 0.9  error 0.1
-1.2 -> -1.2  error 0.0
0.3 -> 0.3  error 0.0
2.1 -> 2.1  error 0.0
7 B weights: 14 GB FP16, 7 GB INT8, 3.5 GB INT4
13 B weights: 26 GB FP16, 13 GB INT8, 6.5 GB INT4
70 B weights: 140 GB FP16, 70 GB INT8, 35.0 GB INT4
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Watch an outlier destroy a group
task: Use quantise_int4 on the group [10.0, 0.05, 0.05, 0.05]. Print the stored integers and the restored values. Then quantise the three small values alone as their own group and print the result again. Explain in one sentence why group-wise quantisation helps.
hint: The scale comes from the largest absolute value. A scale of 1.43 rounds every value below 0.71 to zero.
lang: python
solution:
def quantise_int4(values):
    scale = max(abs(v) for v in values) / 7
    stored = [max(-8, min(7, round(v / scale))) for v in values]
    return scale, stored, [q * scale for q in stored]

print(quantise_int4([10.0, 0.05, 0.05, 0.05]))
# scale 1.43, stored [7, 0, 0, 0]: the three small weights become 0
print(quantise_int4([0.05, 0.05, 0.05]))
# scale 0.007, stored [7, 7, 7]: the small weights keep their value
# A smaller group means one outlier damages fewer neighbours.
:::

## Common mistakes

- Mistake: quantise a 1B model to INT4 and expect the same quality as a 70B at INT4. Fix: keep small models at INT8 or FP16.
- Mistake: count only the weights and ignore the scales. Fix: add about 10 percent to the INT4 estimate for group size 128.
- Mistake: expect INT4 to speed up prefill. Fix: expect a speed-up in decode only; use W8A8 for prefill.
- Mistake: measure quality with perplexity only. Fix: run your task evaluation on the quantised model.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: weight memory and quantisation
q: How much memory do the weights of a 13B model need in INT8?
- 6.5 GB
* 13 GB
- 26 GB
- 52 GB
why: INT8 stores 1 byte per weight, so 13 billion weights need 13 GB.
q: The largest absolute value in a group is 1.4. What is the symmetric INT4 scale?
- 0.1
* 0.2
- 0.7
- 1.4
why: The scale is the largest absolute value divided by 7, the largest INT4 integer, so 1.4 / 7 = 0.2.
q: A group of 128 weights holds one value of 10 and 127 values below 0.1. What goes wrong?
- The large value overflows and becomes -8
* The scale becomes 1.43 and the 127 small values all round to zero
- The scale becomes too small and the large value is clipped
- Nothing; INT4 holds all 128 values exactly
why: One outlier sets a large scale, and every value below half the scale rounds to zero.
q: Why does weight-only INT4 speed up decode but not prefill?
* Decode reads every weight for each token, so fewer bytes help; prefill is limited by arithmetic, which INT4 does not reduce.
- Prefill does not use the weight matrices.
- INT4 arithmetic is slower than FP16 arithmetic on every GPU.
- Decode runs on the CPU, where INT4 is faster.
why: Weight-only INT4 cuts bytes read, which is the decode limit, but the multiply still runs in FP16.
q: You quantise a 1B model to INT4 and quality drops a lot more than for a 70B model. Why?
- The 1B model has more outlier channels
* A small model has few redundant weights, so each rounding error matters more
- INT4 only works for models above 30B weights
- The scales take more memory in a small model
why: Large models have redundancy that absorbs rounding error; small models do not.
:::

## Go further

Read the GPTQ and AWQ papers to see the two main post-training methods. SmoothQuant explains how to quantise activations as well as weights. The LLM.int8() paper describes the outlier problem in detail. The AutoGPTQ and bitsandbytes repositories let you quantise a model in a few lines.
`,
          },
          {
            slug: 'fitting-a-model-on-a-gpu',
            title: 'Fitting a model on a GPU',
            summary: 'Add weights, cache, activations and overhead to decide what one GPU can serve.',
            minutes: 15,
            objectives: [
              'List the four parts of the memory budget of an inference server.',
              'Compute the number of concurrent sequences a GPU can serve.',
              'Explain what the memory utilisation fraction of an engine controls.',
              'Choose between one quantised GPU and two full-precision GPUs.',
            ],
            keyTerms: ['kv-cache', 'quantisation', 'memory budget', 'activation memory', 'workspace', 'tensor-parallelism'],
            links: [
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'Efficient memory management with PagedAttention (vLLM)', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
              { label: 'FlexGen: high-throughput inference with a single GPU', url: 'https://arxiv.org/abs/2303.06865', kind: 'paper' },
              { label: 'The Llama 3 herd of models', url: 'https://arxiv.org/abs/2407.21783', kind: 'paper' },
              { label: 'Text Generation Inference documentation', url: 'https://huggingface.co/docs/text-generation-inference', kind: 'docs' },
            ],
            body: `
## What this lesson covers

This lesson joins the two earlier calculations into one budget. You add the weights, the key-value (KV) cache, the activation workspace and the engine overhead. You then decide how many sequences a graphics processing unit (GPU) can serve.

## Why it matters

An inference engine fails in one of two ways when memory is short. It raises an out-of-memory error at startup, or it serves two sequences and the GPU sits idle. A ten-minute budget on paper prevents both.

:::video
id: WxYC9-hBM_g
why: Watch the part where a model loads and the memory use appears, about 8 minutes in. Compare the number on screen with the weight memory you compute in this lesson.
:::

## The idea with an example

Take a 70B model in 4-bit integer (INT4) form on an 80 GB GPU. The budget has four parts:

| Part | Size | Note |
| --- | --- | --- |
| Weights | 35 GB | 70B weights at 0.5 bytes each |
| Engine overhead | 3 GB | CUDA context, kernels, buffers |
| Activation workspace | 2 GB | depends on batch size and prompt length |
| KV cache | the rest | 80 - 35 - 3 - 2 = 40 GB |

The bars compare the four parts of the budget.

:::bars
title: Budget parts on an 80 GB GPU
unit: GB
KV cache: 40
Weights, INT4: 35
Engine overhead: 3
Activation workspace: 2
:::

Each 8k-token sequence needs 2.68 GB of cache. Divide: $40 / 2.68 = 14.9$. The GPU can hold 14 full-length sequences at once.

Most engines do not use all 80 GB. vLLM has a setting named gpu-memory-utilization with a default of 0.9. That reserves 10 percent for the driver and for memory fragmentation. With 0.9, the engine sees 72 GB. The cache budget then drops to $72 - 35 - 3 - 2 = 32$ GB, which holds 11 full-length sequences.

Press Next to build the budget one part at a time.

:::scenario
title: Memory budget for a 70B INT4 model on an 80 GB GPU
state: remaining=80 GB, full sequences=none
step: Multiply 80 GB by the utilisation fraction 0.9. The engine sees 72 GB.
state: remaining=72 GB
step: Subtract the INT4 weights, 35 GB.
state: remaining=37 GB, weights=35 GB
step: Subtract the engine overhead, 3 GB.
state: remaining=34 GB, overhead=3 GB
step: Subtract the activation workspace, 2 GB. What remains is the cache budget.
state: remaining=32 GB, workspace=2 GB
step: Divide 32 GB by 2.68 GB per 8k-token sequence. Round 11.9 down to 11.
state: full sequences=11
step: If the average sequence has 2,000 tokens, each one needs 0.67 GB. The same 32 GB holds about 47 sequences.
state: average sequences=47
:::

Note: real requests are shorter than the maximum. If the average sequence has 2,000 tokens, each one needs 0.67 GB and 32 GB holds about 47 sequences.

## How it works

Follow this procedure for any model and GPU:

1. Compute the weight memory: number of weights times bytes per weight.
2. Add the engine overhead. Use 2 to 4 GB for a single GPU.
3. Add the activation workspace. Use 1 to 4 GB for prompts up to 8k tokens.
4. Multiply the GPU memory by the utilisation fraction.
5. Subtract steps 1 to 3 from step 4. The result is the cache budget.
6. Divide the cache budget by the cache per sequence at your longest context.
7. Round down. If the result is below 4, the GPU will serve few requests and idle.

The diagram shows the path from GPU memory to a sequence count.

:::flow
title: From GPU memory to a sequence count
GPU memory -> Usable memory: multiply by 0.9
Usable memory -> After weights: subtract the weights
After weights -> Cache budget: subtract overhead and workspace
Cache budget -> Sequence count: divide by cache per sequence
:::

The activation workspace holds the intermediate tensors of one forward pass. Its size scales with batch size times prompt length times hidden size. A chunked prefill limits the number of prompt tokens per step, which caps this tensor.

When one GPU does not fit, you have three options:

| Option | Memory per GPU | Cache budget | Trade-off |
| --- | --- | --- | --- |
| 1 GPU, 70B INT4 | 80 GB | 32 GB | lowest cost, small quality loss |
| 2 GPUs, 70B FP8 | 80 GB each | 2 x 32 GB | full quality, two GPUs |
| 2 GPUs, 70B FP16 | 80 GB each | 2 x 0 GB | does not fit |

The FP16 row shows a common failure. The usable total is 2 x 0.9 x 80 = 144 GB. The weights take 140 GB. After overhead on each GPU nothing remains for the cache. A 70B FP16 model needs four 80 GB GPUs for a useful cache.

The bars compare the total cache budget of the three options.

:::bars
title: Total cache budget by option
unit: GB
1 GPU, 70B INT4: 32
2 GPUs, 70B FP8: 64
2 GPUs, 70B FP16: 0 (does not fit)
:::

Tensor parallelism splits every weight matrix across the GPUs. Each GPU holds one slice of the weights and one slice of the cache for every sequence.

Caution: a mixture-of-experts (MoE) model counts all experts in its weight memory, not only the active ones. Mixtral 8x7B has 47B weights and needs 94 GB in FP16.


This script runs the budget procedure for the example. Change the first line to your own GPU.

:::code
lang: python
file: budget.py
def cache_budget_gb(gpu_gb, weights_gb, overhead_gb, workspace_gb, util=0.9):
    return gpu_gb * util - weights_gb - overhead_gb - workspace_gb

budget = cache_budget_gb(80, 35, 3, 2)
per_seq_8k = 2.68
print("cache budget:", round(budget, 1), "GB")
print("full 8k sequences:", int(budget // per_seq_8k))
print("average 2k sequences:", int(budget // (per_seq_8k / 4)))

for name, weights in (("1 GPU, 70B INT4", 35), ("2 GPUs, 70B FP8", 70), ("2 GPUs, 70B FP16", 140)):
    gpus = 2 if "2 GPUs" in name else 1
    total = sum(cache_budget_gb(80, weights / gpus, 3, 2) for _ in range(gpus))
    print(name, "cache budget:", max(0, round(total)), "GB")
:::

:::code
lang: text
cache budget: 32.0 GB
full 8k sequences: 11
average 2k sequences: 47
1 GPU, 70B INT4 cache budget: 32 GB
2 GPUs, 70B FP8 cache budget: 64 GB
2 GPUs, 70B FP16 cache budget: 0 GB
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Budget a 24 GB GPU
task: A 24 GB GPU runs a 7B model. Use cache_budget_gb with 3 GB overhead, 1 GB workspace and utilisation 0.9. Compute the cache budget for the INT4 weights (3.5 GB) and for the FP16 weights (14 GB). Each 4k-token sequence needs 0.5 GB of cache. Print how many sequences fit in each case.
hint: 24 times 0.9 is 21.6 GB. Subtract the three parts, then divide by 0.5 and round down.
lang: python
solution:
def cache_budget_gb(gpu_gb, weights_gb, overhead_gb, workspace_gb, util=0.9):
    return gpu_gb * util - weights_gb - overhead_gb - workspace_gb

for name, weights in (("INT4", 3.5), ("FP16", 14)):
    budget = cache_budget_gb(24, weights, 3, 1)
    print(name, "budget", round(budget, 1), "GB,", int(budget // 0.5), "sequences")
# INT4 budget 14.1 GB, 28 sequences
# FP16 budget 3.6 GB, 7 sequences
:::

## Common mistakes

- Mistake: subtract the weights from the full GPU memory. Fix: multiply by the utilisation fraction first.
- Mistake: forget the engine overhead. Fix: reserve 2 to 4 GB per GPU before you count the cache.
- Mistake: buy two GPUs for a FP16 70B model. Fix: compute the cache budget first; two GPUs leave no room.
- Mistake: count only active experts for an MoE model. Fix: count every expert, because all of them stay in memory.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: the memory budget
q: A 24 GB GPU runs a 7B INT4 model with 3 GB overhead and 1 GB workspace at utilisation 0.9. What is the cache budget?
- 16.5 GB
* 14.1 GB
- 20.5 GB
- 11.7 GB
why: 0.9 times 24 is 21.6; subtract 3.5, 3 and 1 to get 14.1 GB.
q: That model needs 0.5 GB of cache per 4k sequence. How many fit in the 14.1 GB budget?
- 14
- 24
* 28
- 29
why: 14.1 divided by 0.5 is 28.2, which rounds down to 28.
q: Why does a 70B FP16 model not fit on two 80 GB GPUs?
- Tensor parallelism cannot split 70B weights across two GPUs
* The weights take 140 GB of a usable 144 GB, which leaves nothing for overhead and cache
- FP16 is not supported on two GPUs at once
- The activation workspace needs 80 GB on its own
why: After the utilisation fraction the two GPUs offer 144 GB, and 140 GB of weights leaves no room for the cache.
q: What does the gpu-memory-utilization setting of vLLM control?
- The fraction of time the GPU must stay busy
* The fraction of GPU memory the engine may use for weights, cache and workspace
- The fraction of the cache that each sequence may take
- The clock speed of the GPU memory
why: The setting caps the memory the engine claims, and the rest stays free for the driver and fragmentation.
q: Mixtral 8x7B activates 2 experts per token. How much weight memory does it need in FP16?
- 14 GB, for the 2 active experts
- 28 GB
* 94 GB, for all 47B weights
- 112 GB
why: Every expert stays in GPU memory, so the budget counts all 47B weights at 2 bytes each.
:::

## Go further

The vLLM documentation describes the gpu-memory-utilization setting and the related limits. The vLLM paper shows how block allocation lets short sequences share the budget. FlexGen explores offload of parts of the budget to CPU memory. The Llama 3 paper lists the layer counts and head counts you need. The Text Generation Inference documentation shows the same settings in a second engine.
`,
          },
        ],
      },
      {
        slug: 'throughput',
        title: 'Batching and throughput',
        description: 'Keep the GPU busy with batching, speculative decoding, and separate prefill and decode pools.',
        level: 'advanced',
        lessons: [
          {
            slug: 'prefill-vs-decode',
            title: 'Prefill is compute-bound, decode is memory-bound',
            summary: 'Compare the two phases of generation with arithmetic intensity and find the latency floor of decode.',
            minutes: 14,
            objectives: [
              'Explain the difference between the prefill phase and the decode phase.',
              'Compute the arithmetic intensity of a decode step for a given batch size.',
              'Compute the ridge point of a GPU from its peak FLOPS and its bandwidth.',
              'Estimate the lowest possible time per token for a model on a GPU.',
            ],
            keyTerms: ['arithmetic-intensity', 'prefill', 'decode', 'memory bandwidth', 'ridge point', 'kv-cache'],
            links: [
              { label: 'Efficiently scaling transformer inference (Pope et al.)', url: 'https://arxiv.org/abs/2211.05102', kind: 'paper' },
              { label: 'Large transformer model inference optimization (Lilian Weng)', url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/', kind: 'article' },
              { label: 'The Illustrated Transformer (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-transformer/', kind: 'article' },
              { label: 'Andrej Karpathy on YouTube', url: 'https://www.youtube.com/@AndrejKarpathy', kind: 'video' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
            ],
            body: `
## What this lesson covers

This lesson splits text generation into two phases: prefill and decode. You learn why the graphics processing unit (GPU) is busy during one phase and idle during the other. You then compute the time floor of a decode step and see how batching raises the use of the GPU.

## Why it matters

Decode is where a server spends most of its time. A server that decodes one sequence at a time uses less than 1 percent of the arithmetic units of the GPU. The cost per token is then 50 to 100 times higher than it needs to be. Every throughput technique in this track exists to fix this one problem.

:::video
id: SQ3fZ1sAqXI
why: Watch the part of the overview on efficiency and resource accounting. The course counts FLOPs and bytes in the same way this lesson does, and lists the systems topics that follow.
:::

## The idea with an example

Prefill processes the whole prompt in one forward pass. For a 1,000-token prompt the GPU multiplies a 1,000-row matrix by every weight matrix. It reads each weight once and uses it 1,000 times. The arithmetic units saturate. Prefill is compute-bound.

Decode produces one token per step. For each step the GPU reads every weight again and uses it once. The arithmetic units wait for memory. Decode is memory-bound.

The timeline shows one request with a 141 ms prefill step and three 42 ms decode steps on an H100.

:::timeline
title: One request at batch size 1: prefill, then decode
unit: ms
lane Arithmetic units
lane Memory reads
Arithmetic units: prefill, 1,000 tokens, 140 TFLOPs @0-141
Memory reads: weights once, 140 GB @0-42
Memory reads: weights, 140 GB @141-183
Arithmetic units: token 1 @141-143
Memory reads: weights, 140 GB @183-225
Arithmetic units: token 2 @183-185
Memory reads: weights, 140 GB @225-267
Arithmetic units: token 3 @225-227
:::

The measure that separates the two cases is arithmetic intensity:

$$I = \\frac{\\text{FLOPs}}{\\text{bytes moved}}$$

$I$ is the arithmetic intensity. FLOPs is the number of floating-point operations. Bytes moved is the number of bytes read from GPU memory.

Now compute the ridge point of an H100 GPU. It performs about 990 TFLOPS in 16-bit floating point (FP16). Its memory delivers 3.35 TB per second. Divide: $990 / 3.35 = 295$ FLOPs per byte. Below 295 the GPU waits for memory. Above 295 it waits for arithmetic.

A 70B model in FP16 has 140 GB of weights. One decode step for one sequence does about 2 FLOPs per weight, so 140 GFLOPs. It reads all 140 GB. The intensity is $2$ FLOPs per byte, far below 295. The step time is set by the memory read: $140 / 3350 = 0.042$ seconds, or 42 ms per token. No kernel can beat this number on one GPU.

Press Next to compute the ridge point and the decode floor step by step.

:::scenario
title: Ridge point and decode floor for a 70B model on an H100
state: peak FLOPS=990 T, bandwidth=3.35 TB/s, ridge point=none
step: Divide the peak FLOPS by the bandwidth. The ridge point is 295 FLOPs per byte.
state: ridge point=295 FLOPs per byte
step: One decode step at batch size 1 does 2 FLOPs per weight. That is 140 GFLOPs.
state: FLOPs per step=140 G
step: The step reads all 140 GB of weights.
state: bytes per step=140 GB
step: Divide FLOPs by bytes. The intensity is 2 FLOPs per byte, far below 295. The step is memory-bound.
state: intensity=2 FLOPs per byte, bound=memory
step: Divide 140 GB by 3.35 TB/s. The step takes 42 ms. No kernel beats this floor at batch size 1.
state: step time=42 ms
step: Batch 32 sequences. The GPU reads the weights once and does 32 times the arithmetic. The intensity rises to 64.
state: intensity=64 FLOPs per byte, tokens per step=32
:::

## How it works

Batching fixes the intensity. If 32 sequences decode together, the GPU reads the weights once and does 32 times the arithmetic. The intensity rises to $2 \\times 32 = 64$ FLOPs per byte. The step still takes about 42 ms, but it produces 32 tokens.

| Batch size | FLOPs per byte | Tokens per 42 ms step | Tokens per second |
| --- | --- | --- | --- |
| 1 | 2 | 1 | 24 |
| 8 | 16 | 8 | 190 |
| 32 | 64 | 32 | 760 |
| 128 | 256 | 128 | 3,050 |
| 256 | 512 | 256 | 3,900 (now compute-bound) |

The bars compare the tokens per second at each batch size.

:::bars
title: Decode tokens per second by batch size
unit: tokens/s
Batch 1: 24
Batch 8: 190
Batch 32: 760
Batch 128: 3050
Batch 256: 3900 (compute-bound)
:::

Above batch 148 the intensity crosses the ridge point. The step time then grows with the batch, and throughput stops growing in proportion.

Note: the key-value (KV) cache read also grows with the batch. At batch 128 with 4k-token sequences the cache read is $128 \\times 1.34 = 172$ GB, larger than the weights. The real ridge arrives sooner than the table shows.

To estimate the decode floor for any model and GPU:

1. Compute the weight bytes: number of weights times bytes per weight.
2. Divide by the memory bandwidth of the GPU in bytes per second.
3. The result is the shortest time per decode step at batch size 1.
4. Multiply the batch size by 2 FLOPs per weight to get the intensity.
5. Compare it with the ridge point to find whether the batch is memory-bound or compute-bound.

Prefill needs the opposite treatment. A 1,000-token prompt already has intensity $2 \\times 1000 = 2000$. Larger batches do not help prefill, and they delay the decode steps of other sequences. A later lesson on disaggregation handles this conflict.


This script computes the ridge point, the decode floor and the batch size where decode becomes compute-bound.

:::code
lang: python
file: ridge.py
peak_tflops = 990
bandwidth_tbs = 3.35
weights_gb = 140

ridge = peak_tflops / bandwidth_tbs
floor_ms = weights_gb / (bandwidth_tbs * 1000) * 1000
print("ridge point:", int(ridge), "FLOPs per byte")
print("decode floor at batch 1:", round(floor_ms, 1), "ms")
print("batch where decode becomes compute-bound:", round(ridge / 2))

for batch in (1, 8, 32, 128, 256):
    intensity = 2 * batch
    bound = "memory-bound" if intensity < ridge else "compute-bound"
    tokens_per_s = batch / (floor_ms / 1000)
    print("batch", batch, "intensity", intensity, bound, "about", round(tokens_per_s), "tokens/s")
:::

:::code
lang: text
ridge point: 295 FLOPs per byte
decode floor at batch 1: 41.8 ms
batch where decode becomes compute-bound: 148
batch 1 intensity 2 memory-bound about 24 tokens/s
batch 8 intensity 16 memory-bound about 191 tokens/s
batch 32 intensity 64 memory-bound about 766 tokens/s
batch 128 intensity 256 memory-bound about 3063 tokens/s
batch 256 intensity 512 compute-bound about 6126 tokens/s
:::

Note: the last line overstates the tokens per second at batch 256. Above the ridge point the step time grows with the batch, so the real number is closer to 3,900.

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Find the floor of a smaller GPU
task: A GPU performs 400 TFLOPS in FP16 and moves 2 TB per second. It serves a 7B model in FP16. Change the three settings in ridge.py and print the ridge point, the decode floor at batch 1, and the batch size at which decode becomes compute-bound.
hint: The 7B model has 14 GB of weights. The floor is 14 GB divided by 2,000 GB per second.
lang: python
solution:
peak_tflops = 400
bandwidth_tbs = 2.0
weights_gb = 14
ridge = peak_tflops / bandwidth_tbs
floor_ms = weights_gb / (bandwidth_tbs * 1000) * 1000
print("ridge point:", round(ridge), "FLOPs per byte")       # 200
print("decode floor at batch 1:", round(floor_ms, 1), "ms")  # 7.0
print("compute-bound above batch", round(ridge / 2))          # 100
:::

## Common mistakes

- Mistake: measure tokens per second at batch size 1 and call it the server capacity. Fix: measure at the batch size you plan to run.
- Mistake: buy a GPU for its FLOPS when you serve decode. Fix: compare memory bandwidth, because decode reads weights.
- Mistake: expect a faster kernel to cut decode time below the memory floor. Fix: compute the floor first; then reduce bytes with quantisation.
- Mistake: ignore the KV cache in the bytes moved. Fix: add the cache read for every sequence in the batch.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: prefill and decode
q: A GPU does 400 TFLOPS and moves 2 TB per second. What is its ridge point?
- 100 FLOPs per byte
* 200 FLOPs per byte
- 400 FLOPs per byte
- 800 FLOPs per byte
why: The ridge point is peak FLOPS divided by bandwidth, so 400 / 2 = 200.
q: A 7B FP16 model decodes on that GPU at batch size 1. What is the shortest possible step time?
- 3.5 ms
* 7 ms
- 14 ms
- 28 ms
why: The step reads 14 GB of weights at 2,000 GB per second, which takes 7 ms.
q: At what batch size does that model cross the ridge point?
- 50
* 100
- 200
- 400
why: Each sequence adds 2 FLOPs per byte, so the intensity reaches 200 at batch 100.
q: You serve decode and must pick one GPU specification to compare. Which one?
- Peak FLOPS
* Memory bandwidth
- Number of streaming multiprocessors
- Clock speed
why: Decode reads all the weights per token and is memory-bound, so bandwidth sets the step time.
q: A 1,000-token prompt runs prefill at batch size 1. What is its arithmetic intensity and which limit applies?
- 2 FLOPs per byte, memory-bound
- 1,000 FLOPs per byte, memory-bound
* 2,000 FLOPs per byte, compute-bound
- 295 FLOPs per byte, at the ridge
why: Each weight is read once and used 1,000 times at 2 FLOPs each, which is far above the ridge point.
:::

## Go further

The paper by Pope and colleagues derives these limits in full and shows them on real hardware. Lilian Weng's article surveys every technique that follows from this analysis. Jay Alammar's illustrated guide shows the matrix shapes inside one forward pass. Andrej Karpathy's channel walks through the same arithmetic in code. The vLLM documentation lists the batch settings you tune in practice.
`,
          },
          {
            slug: 'continuous-batching',
            title: 'Continuous batching',
            summary: 'Admit and retire sequences at every decode step instead of waiting for the longest one.',
            minutes: 15,
            objectives: [
              'Explain why static batching wastes GPU steps.',
              'Compute the number of wasted slots for a static batch of mixed lengths.',
              'Describe how the scheduler admits, preempts and retires sequences each step.',
              'Choose a maximum sequence count and a chunked prefill size for a server.',
            ],
            keyTerms: ['continuous-batching', 'static batching', 'scheduler', 'preemption', 'chunked prefill', 'kv-cache'],
            links: [
              { label: 'Efficient memory management with PagedAttention (vLLM)', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
              { label: 'Sarathi-Serve: taming throughput-latency tradeoff', url: 'https://arxiv.org/abs/2403.02310', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'vLLM repository', url: 'https://github.com/vllm-project/vllm', kind: 'repo' },
              { label: 'Text Generation Inference repository', url: 'https://github.com/huggingface/text-generation-inference', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson explains continuous batching, the scheduling method that every modern inference engine uses. You compare it with static batching on four requests of different lengths. You then learn how the scheduler admits, preempts and chunks requests.

## Why it matters

Requests do not arrive together and they do not finish together. A scheduler that waits for the longest request leaves the graphics processing unit (GPU) half empty. Continuous batching raises throughput by 2 to 10 times with no change to the model.

## The idea with an example

Four requests arrive at the same moment. They need 10, 50, 100 and 200 output tokens. The GPU can run 4 sequences per step.

With static batching the engine starts all four together. It runs 200 decode steps, one for the longest request. At each step it has 4 slots. The total number of slots is $4 \\times 200 = 800$. The useful slots are $10 + 50 + 100 + 200 = 360$. The engine wastes $800 - 360 = 440$ slots, or 55 percent of its work.

Press Next to count the slots step by step.

:::scenario
title: Four requests of 10, 50, 100 and 200 tokens in 4 slots
state: active=A B C D, empty slots=0, wasted slots=0
step: Static batching starts all four requests together. Every step has 4 slots.
step: At step 10 request A finishes. Its slot stays empty for the remaining 190 steps.
state: active=B C D, empty slots=1, wasted slots=190
step: At step 50 request B finishes. Its slot wastes 150 more steps.
state: active=C D, empty slots=2, wasted slots=340
step: At step 100 request C finishes. Its slot wastes 100 more steps.
state: active=D, empty slots=3, wasted slots=440
step: At step 200 request D finishes. The engine used 800 slots and wasted 440, or 55 percent.
state: active=none, waste=55 percent
step: With continuous batching and a full queue, request E takes the slot of A at step 11. The same happens at steps 51 and 101. The waste falls to 0 percent.
state: waste=0 percent
:::

With continuous batching the engine checks the batch after every step. When the 10-token request finishes at step 10, its slot is free. A waiting request takes the slot at step 11. The same happens at steps 50 and 100. If the queue has enough work, every slot in every step does useful work. Waste falls from 55 percent to near zero.

The timeline shows the four slots over 200 steps with a full queue.

:::timeline
title: Continuous batching with a full queue
unit: steps
lane Slot 1
lane Slot 2
lane Slot 3
lane Slot 4
Slot 1: request A, 10 tokens @0-10
Slot 2: request B, 50 tokens @0-50
Slot 3: request C, 100 tokens @0-100
Slot 4: request D, 200 tokens @0-200
Slot 1: request E takes the slot @10-200
Slot 2: request F takes the slot @50-200
Slot 3: request G takes the slot @100-200
:::

| Method | Steps | Slots used | Useful slots | Waste |
| --- | --- | --- | --- | --- |
| Static | 200 | 800 | 360 | 55 % |
| Continuous, empty queue | 200 | 800 | 360 | 55 % |
| Continuous, full queue | 200 | 800 | 800 | 0 % |

The bars compare the useful slots of the three cases.

:::bars
title: Useful slots out of 800
unit: slots
Static: 360
Continuous, empty queue: 360
Continuous, full queue: 800
:::

Note: with an empty queue, continuous batching does not help. The gain comes from refilling the freed slots.

## How it works

The scheduler runs a loop. Each pass of the loop produces one decode step for every active sequence:

1. Remove every sequence that produced an end token or hit its length limit.
2. Count the free key-value (KV) cache blocks.
3. While a request waits and the cache has room, admit it.
4. If a new request has a prompt, run its prefill in this step or split it into chunks.
5. Run one forward pass for all active sequences.
6. Return the new tokens to the clients and go to step 1.

Two limits bound the loop. The first is the maximum number of sequences, named max_num_seqs in vLLM. The second is the KV cache budget. A sequence grows by one block every few tokens. When no block is free, the scheduler preempts a sequence. It drops the cache of the youngest sequence and recomputes it later, or it swaps the cache to CPU memory.

Caution: frequent preemption costs more than it saves. If the engine logs preemptions every second, lower max_num_seqs or add cache memory.

Prefill creates a second problem. A 4,000-token prompt takes about 300 ms of compute on one GPU. If the scheduler runs it in one step, every decode sequence waits 300 ms for its next token. Chunked prefill splits the prompt into pieces of 512 tokens. Each step runs one chunk plus the normal decode work. The decode sequences see a small delay at each step instead of one long stall. Sarathi-Serve introduced this method and showed that it keeps time per output token stable under load.

| Chunk size | Prefill steps for 4,000 tokens | Delay per decode step |
| --- | --- | --- |
| 4,000 | 1 | 300 ms once |
| 1,024 | 4 | about 75 ms, 4 times |
| 512 | 8 | about 40 ms, 8 times |

A smaller chunk gives smoother decode and a slower prefill. Choose the chunk size from your target for time per output token.

The bars compare the delay that one chunk adds to a decode step.

:::bars
title: Delay per decode step by chunk size
unit: ms
Chunk 4,000 tokens: 300 (once)
Chunk 1,024 tokens: 75 (4 times)
Chunk 512 tokens: 40 (8 times)
:::


This script counts the slots for the four requests under static and continuous batching.

:::code
lang: python
file: slots.py
def static_batch(lengths):
    steps = max(lengths)
    slots = len(lengths) * steps
    useful = sum(lengths)
    return slots, useful, slots - useful

def continuous_batch(lengths, queue):
    steps = max(lengths)
    useful = 0
    for used in lengths:
        useful += used
        while used < steps and queue:
            take = min(queue.pop(0), steps - used)
            useful += take
            used += take
    return len(lengths) * steps, useful

lengths = [10, 50, 100, 200]
print("static: slots, useful, wasted =", static_batch(lengths))
print("continuous, empty queue:", continuous_batch(lengths, []))
print("continuous, full queue:", continuous_batch(lengths, [300, 300, 300]))
:::

:::code
lang: text
static: slots, useful, wasted = (800, 360, 440)
continuous, empty queue: (800, 360)
continuous, full queue: (800, 800)
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Count the waste for three requests
task: Three requests need 20, 40 and 100 output tokens and the batch has 3 slots. Use the two functions from slots.py to print the wasted slots under static batching, and the useful slots under continuous batching with a queue of two 100-token requests. Then compute the chunked prefill steps for a 2,000-token prompt with a chunk size of 512.
hint: Static batching runs 100 steps with 3 slots. A 2,000-token prompt needs 2000 / 512 = 3.9 chunks, so round up.
lang: python
solution:
lengths = [20, 40, 100]
print(static_batch(lengths))                        # (300, 160, 140)
print(continuous_batch(lengths, [100, 100]))        # (300, 300)
import math
print("prefill steps:", math.ceil(2000 / 512))      # 4
:::

## Common mistakes

- Mistake: set max_num_seqs far above the cache budget. Fix: compute the sequences that fit, then set the limit a little above that number.
- Mistake: benchmark with requests of equal length. Fix: use a length mix from production logs, because equal lengths hide the gain.
- Mistake: leave chunked prefill off and then see time per token spike. Fix: enable it and set a chunk size near 512 tokens.
- Mistake: treat preemption as free. Fix: watch the preemption counter and add memory before it rises.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: continuous batching
q: Three requests need 20, 40 and 100 tokens and the batch has 3 slots. How many slots does static batching waste?
- 60
- 100
* 140
- 160
why: Static batching uses 3 times 100 = 300 slots, and only 160 do useful work.
q: What event frees a slot in continuous batching?
- The scheduler reaches the end of a fixed batch window
* A sequence produces its end token or reaches its length limit
- The KV cache fills up
- A new request arrives in the queue
why: The scheduler checks after every step, and a finished sequence frees its slot at once.
q: Why does chunked prefill lower the delay for decode sequences?
- It skips the prefill for short prompts
* It spreads the prompt work over many steps instead of one long step
- It runs the prefill on a second GPU
- It reduces the number of prompt tokens
why: A 4,000-token prompt in chunks of 512 adds about 40 ms to 8 steps instead of 300 ms to one.
q: When does continuous batching give no gain over static batching?
- When requests have different lengths
- When the batch size is above 32
* When the queue is empty, so freed slots stay empty
- When chunked prefill is enabled
why: The gain comes from refilling freed slots, which needs waiting requests.
q: The engine logs several preemptions every second. What is the right response?
- Raise max_num_seqs so more sequences run at once
* Lower max_num_seqs or add cache memory, because the cache pool is too small for the load
- Disable chunked prefill
- Shorten the chunk size
why: Preemption means the scheduler admitted more sequences than the cache can hold, and recomputation wastes GPU time.
:::

## Go further

The vLLM paper describes the scheduler and the block allocator together, because the two depend on each other. The Sarathi-Serve paper measures chunked prefill against stall-and-wait scheduling. The vLLM documentation lists max_num_seqs and the chunked prefill settings. The vLLM and Text Generation Inference repositories both contain a readable scheduler file.
`,
          },
          {
            slug: 'speculative-decoding',
            title: 'Speculative decoding',
            summary: 'Let a small draft model propose tokens and let the large model verify them in one pass.',
            minutes: 16,
            objectives: [
              'Explain why verification of k tokens costs about the same as one decode step.',
              'State the acceptance rule that keeps the output distribution exact.',
              'Compute the expected number of accepted tokens per step from the acceptance rate.',
              'Choose when speculative decoding helps and when it slows a server.',
            ],
            keyTerms: ['speculative-decoding', 'draft model', 'target model', 'rejection sampling', 'acceptance rate', 'arithmetic-intensity'],
            links: [
              { label: 'Fast inference from transformers via speculative decoding (Leviathan et al.)', url: 'https://arxiv.org/abs/2211.17192', kind: 'paper' },
              { label: 'Accelerating LLM decoding with speculative sampling (Chen et al.)', url: 'https://arxiv.org/abs/2302.01318', kind: 'paper' },
              { label: 'Medusa: multiple decoding heads', url: 'https://arxiv.org/abs/2401.10774', kind: 'paper' },
              { label: 'EAGLE: speculative sampling with feature extrapolation', url: 'https://arxiv.org/abs/2401.15077', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'Yannic Kilcher on YouTube', url: 'https://www.youtube.com/@YannicKilcher', kind: 'video' },
            ],
            body: `
## What this lesson covers

This lesson explains speculative decoding. A small draft model guesses several tokens. The large target model checks all of them in one forward pass. You compute how many tokens each step accepts on average and when the method pays off.

## Why it matters

Decode at low batch size is memory-bound. The graphics processing unit (GPU) reads all the weights to produce one token. Speculative decoding reads the weights once and produces 2 to 4 tokens. For a chat service with few concurrent users, this cuts latency per token by half or more with no change to the output distribution.

## The idea with an example

The target model is a 70B model. The draft model is a 1B model with the same tokenizer. Set $k = 4$ draft tokens per step.

1. The draft model generates 4 tokens one by one: "the", "cat", "sat", "down". Each draft step is cheap because the draft model is small.
2. The target model runs one forward pass on the prompt plus the 4 draft tokens. This pass returns the target probability for every position at once.
3. For each draft token in order, the engine compares the target probability $p$ with the draft probability $q$. It accepts the token with probability $\\min(1, p / q)$.
4. At the first rejected token, the engine samples a replacement from an adjusted target distribution and stops.
5. If all 4 tokens pass, the engine takes one extra token from the last target position for free.

The diagram shows the path of one step from draft to accepted tokens.

:::flow
title: One speculative decoding step
Prompt -> Draft model: context
Draft model -> Target model: 4 draft tokens
Target model -> Verifier: probabilities for 5 positions
Verifier -> Output: accepted tokens plus one sample
Output -> Draft model: new context for the next step
:::

Suppose the first three tokens pass and "down" fails. The engine replaces "down" with a sample from the target model, "on". The step produced 4 tokens: "the", "cat", "sat", "on". A plain decode step produces 1 token for the same weight read.

Press Next to follow one speculative step.

:::scenario
title: One speculative step with k = 4
state: draft=none, accepted=none, rejected=none, output=none
step: The 1B draft model proposes four tokens one by one: the, cat, sat, down.
state: draft=the cat sat down
step: The 70B target model runs one forward pass over the prompt plus the four draft tokens. It returns a probability for every position.
state: target passes=1
step: Position 1: the target gives p = 0.9 and the draft gave q = 0.8. The ratio is above 1, so the engine accepts the.
state: accepted=the
step: Position 2: p = 0.6 and q = 0.5. The ratio is above 1, so the engine accepts cat.
state: accepted=the cat
step: Position 3: p = 0.4 and q = 0.5. The engine accepts sat with probability 0.8. The draw passes.
state: accepted=the cat sat
step: Position 4: p = 0.1 and q = 0.6. The acceptance probability is 0.17. The draw fails, so the engine rejects down.
state: rejected=down
step: The engine samples a replacement from the adjusted target distribution and gets on. The step produced 4 tokens for one weight read.
state: output=the cat sat on, tokens this step=4
:::

## How it works

The acceptance rule keeps the output exact. Let $p(x)$ be the target probability of token $x$ and $q(x)$ the draft probability. Accept with probability $\\min(1, p(x)/q(x))$. If the token is rejected, sample from the adjusted distribution:

$$p'(x) = \\frac{\\max(0, p(x) - q(x))}{\\sum_y \\max(0, p(y) - q(y))}$$

$p'(x)$ is the probability of the replacement token. The numerator keeps only the mass where the target exceeds the draft. The denominator normalises it. The combined procedure samples from $p$ exactly, so the text has the same distribution as plain decoding.

Let $\\alpha$ be the average acceptance rate of one draft token. The expected number of tokens per step is:

$$E[\\text{tokens}] = \\frac{1 - \\alpha^{k+1}}{1 - \\alpha}$$

$k$ is the number of draft tokens. With $\\alpha = 0.8$ and $k = 4$ the result is $(1 - 0.328) / 0.2 = 3.36$ tokens per step.

The cost of one step is $k$ draft forward passes plus one target forward pass. If the draft model is 70 times smaller, 4 draft passes cost about 6 percent of a target pass. The step costs about 1.06 target passes and yields 3.36 tokens. The speed-up is $3.36 / 1.06 = 3.2$ times.

| Acceptance rate | Tokens per step (k = 4) | Speed-up |
| --- | --- | --- |
| 0.5 | 1.94 | 1.8 x |
| 0.7 | 2.76 | 2.6 x |
| 0.8 | 3.36 | 3.2 x |
| 0.9 | 4.10 | 3.9 x |

The bars compare the speed-up at each acceptance rate.

:::bars
title: Speed-up with k = 4 draft tokens
unit: x
Acceptance 0.5: 1.8
Acceptance 0.7: 2.6
Acceptance 0.8: 3.2
Acceptance 0.9: 3.9
:::

The method loses in two cases. At high batch size the target model is already compute-bound, so the verification pass costs $k$ times more and the gain vanishes. At low acceptance rate, below about 0.5, the draft work exceeds the saved work.

Two variants remove the separate draft model. Medusa adds extra output heads to the target model, and each head predicts one future token. EAGLE predicts the next hidden state of the target model with a small head and decodes drafts from it, which gives higher acceptance.


This script computes the expected tokens per step and the speed-up from the acceptance rate. It also applies the acceptance rule to one draft token.

:::code
lang: python
file: speculative.py
import random

def expected_tokens(alpha, k):
    return (1 - alpha ** (k + 1)) / (1 - alpha)

def speedup(alpha, k, draft_cost=0.015):
    return expected_tokens(alpha, k) / (1 + k * draft_cost)

def accept(p_target, q_draft):
    return random.random() < min(1.0, p_target / q_draft)

for alpha in (0.5, 0.7, 0.8, 0.9):
    print("alpha", alpha, "tokens per step", round(expected_tokens(alpha, 4), 2),
          "speed-up", round(speedup(alpha, 4), 1), "x")

random.seed(1)
trials = 10000
rate = sum(accept(0.4, 0.5) for _ in range(trials)) / trials
print("accept rate for p=0.4, q=0.5 over", trials, "draws:", round(rate, 2))
:::

:::code
lang: text
alpha 0.5 tokens per step 1.94 speed-up 1.8 x
alpha 0.7 tokens per step 2.77 speed-up 2.6 x
alpha 0.8 tokens per step 3.36 speed-up 3.2 x
alpha 0.9 tokens per step 4.1 speed-up 3.9 x
accept rate for p=0.4, q=0.5 over 10000 draws: 0.8
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Find where more draft tokens stop helping
task: Use expected_tokens with alpha = 0.8 and print the result for k from 1 to 10. Then print the speed-up for the same k values with the 1.5 percent draft cost. Find the k after which each extra draft token adds less than 0.1 to the speed-up.
hint: Each extra draft token adds alpha to the power of k, which shrinks fast, while the draft cost grows in a straight line.
lang: python
solution:
for k in range(1, 11):
    e = expected_tokens(0.8, k)
    print(k, round(e, 2), round(speedup(0.8, k), 2))
# tokens per step: 1.8, 2.44, 2.95, 3.36, 3.69, 3.95, 4.16, 4.33, 4.46, 4.57
# speed-up: 1.77, 2.37, 2.82, 3.17, 3.43, 3.63, 3.77, 3.87, 3.93, 3.97
# after k = 7 each extra token adds less than 0.1, so k of 4 to 6 is the usual choice
:::

## Common mistakes

- Mistake: pick a draft model with a different tokenizer. Fix: use a draft that shares the exact vocabulary of the target.
- Mistake: enable speculative decoding on a server at batch size 128. Fix: use it for latency at low batch, not for throughput at high batch.
- Mistake: accept all draft tokens to save time. Fix: keep the rejection rule, or the output distribution changes.
- Mistake: set $k$ to 10 and expect 10 tokens per step. Fix: compute the expected tokens from $\\alpha$; past $k = 5$ the gain is small.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: speculative decoding
q: What is the expected number of tokens per step with an acceptance rate of 0.6 and k = 3?
- 1.80
* 2.18
- 2.40
- 3.00
why: (1 - 0.6 to the power 4) / (1 - 0.6) = (1 - 0.1296) / 0.4 = 2.18.
q: A draft token has q = 0.5 and the target gives p = 0.2. What is the acceptance probability?
- 0.2
* 0.4
- 0.5
- 1.0
why: The rule accepts with probability min(1, p / q) = 0.2 / 0.5 = 0.4.
q: Why does the gain vanish at high batch size?
- The draft model runs out of memory
* The target pass is already compute-bound, so verifying k tokens costs k times more
- The acceptance rate drops with batch size
- The KV cache cannot hold draft tokens
why: Speculative decoding wins only while the target pass is memory-bound and extra tokens are nearly free.
q: Which draft model is a valid choice for a 70B target?
- Any model smaller than 7B
- A model trained on the same data but with a larger vocabulary
* A small model that shares the exact tokenizer and vocabulary of the target
- The same 70B model in INT4
why: Verification compares probabilities per token id, so both models must use the same token ids.
q: An engineer accepts every draft token to save the verification step. What happens?
- Nothing; the draft model is accurate enough
- The output is identical but slower
* The output now follows the draft distribution instead of the target distribution
- The step produces fewer tokens
why: The rejection rule is what makes the combined procedure sample from the target model exactly.
:::

## Go further

The Leviathan paper and the Chen paper introduce the method and prove that the output distribution is exact. Medusa and EAGLE show how to draft without a second model. The vLLM documentation explains how to turn speculative decoding on and how to pick the number of draft tokens. Yannic Kilcher's channel has paper walkthroughs that cover this family of methods.
`,
          },
          {
            slug: 'disaggregated-prefill-and-decode',
            title: 'Disaggregated prefill and decode',
            summary: 'Run prefill and decode on separate GPU pools so that long prompts do not stall token streams.',
            minutes: 15,
            objectives: [
              'Explain how a long prefill raises the time per output token for other sequences.',
              'Compute the delay a prefill adds to co-scheduled decode streams.',
              'Compute the cost to move a KV cache between two GPUs.',
              'Size a prefill pool and a decode pool from the ratio of their work.',
            ],
            keyTerms: ['prefill', 'decode', 'kv-cache', 'disaggregation', 'time per output token', 'NVLink'],
            links: [
              { label: 'DistServe: disaggregating prefill and decoding', url: 'https://arxiv.org/abs/2401.09670', kind: 'paper' },
              { label: 'Splitwise: efficient generative LLM inference using phase splitting', url: 'https://arxiv.org/abs/2311.18677', kind: 'paper' },
              { label: 'Sarathi-Serve: taming throughput-latency tradeoff', url: 'https://arxiv.org/abs/2403.02310', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'SGLang repository', url: 'https://github.com/sgl-project/sglang', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson explains disaggregated serving. One pool of graphics processing units (GPUs) runs prefill. A second pool runs decode. You compute the stall that a long prompt causes in a shared engine, and the cost to move a key-value (KV) cache between pools.

## Why it matters

Users judge a chat service by two numbers. Time to first token (TTFT) measures the wait before the answer starts. Time per output token (TPOT) measures the pace of the stream. A shared engine trades one against the other. Disaggregation lets you tune each pool for its own number.

## The idea with an example

A server runs 32 decode streams at 30 ms per token. A 4,000-token prompt arrives. Its prefill needs about 300 ms of compute on one GPU.

In a shared engine the scheduler has two choices. It can run the prefill as one step. Then all 32 streams wait 300 ms for their next token, and TPOT spikes from 30 ms to 330 ms. Or it can chunk the prefill over 8 steps. Then TPOT rises to about 70 ms for 8 steps and the prompt waits 560 ms for its first token.

Press Next to compare the three ways to handle the prompt.

:::scenario
title: A 4,000-token prompt meets 32 decode streams
state: TPOT=30 ms, prompt TTFT=none, streams=32
step: The 32 streams decode at 30 ms per token. A 4,000-token prompt arrives and needs 300 ms of prefill.
step: Choice 1: the shared engine runs the prefill in one step. All 32 streams wait 300 ms for their next token.
state: TPOT=330 ms for one step, prompt TTFT=300 ms
step: Choice 2: the shared engine chunks the prefill over 8 steps. Each step carries 500 prompt tokens plus 32 decode tokens.
state: TPOT=about 70 ms for 8 steps, prompt TTFT=560 ms
step: Choice 3: the prefill GPU takes the prompt. The decode GPU never sees it.
state: TPOT=30 ms, prompt TTFT=300 ms
step: The engine copies the 1.3 GB cache to the decode GPU over NVLink in 3 ms. The new stream joins the batch.
state: prompt TTFT=303 ms, streams=33
:::

With disaggregation the prefill pool handles the prompt. The decode pool never sees it. The 32 streams keep their 30 ms pace. When the prefill finishes, the engine copies the KV cache of the prompt to a decode GPU and the stream starts.

The timeline shows the prompt on the prefill GPU, the cache copy, and the decode streams that keep their pace.

:::timeline
title: Disaggregated serving of one 4,000-token prompt
unit: ms
lane Prefill GPU
lane Decode GPU
Prefill GPU: prefill, 4,000 tokens @0-300
Decode GPU: 32 streams at 30 ms per token @0-300
Prefill GPU -> Decode GPU: copy 1.3 GB cache over NVLink @300-303
Decode GPU: 33 streams at 30 ms per token @303-600
Prefill GPU: next prompt @303-600
:::

Compute the copy cost. A 70B model with grouped-query attention stores about 0.33 MB of cache per token. The prompt has 4,000 tokens: $4000 \\times 0.33 = 1{,}320$ MB, about 1.3 GB. Over an NVLink connection at 400 GB per second, the copy takes $1.3 / 400 = 0.0033$ seconds, about 3 ms. Over a 100 Gb per second network, it takes about 105 ms.

| Link | Bandwidth | Copy time for 1.3 GB |
| --- | --- | --- |
| NVLink | 400 GB/s | 3 ms |
| PCIe 5 x16 | 64 GB/s | 20 ms |
| 400 Gb Ethernet | 50 GB/s | 26 ms |
| 100 Gb Ethernet | 12.5 GB/s | 105 ms |

The bars compare the copy time over each link.

:::bars
title: Time to copy a 1.3 GB cache
unit: ms
NVLink, 400 GB/s: 3
PCIe 5 x16, 64 GB/s: 20
400 Gb Ethernet, 50 GB/s: 26
100 Gb Ethernet, 12.5 GB/s: 105
:::

Within one node the copy is cheap compared with a 300 ms prefill.

## How it works

The request path has five stages:

1. The router sends the prompt to a prefill GPU.
2. The prefill GPU runs one forward pass, produces the first token, and writes the KV cache.
3. The engine copies the cache to a decode GPU over the fastest available link.
4. The decode GPU adds the sequence to its batch and streams tokens.
5. The prefill GPU frees the cache and takes the next prompt.

The diagram shows the path of one request through the two pools.

:::flow
title: Request path in a disaggregated engine
Client -> Router: prompt
Router -> Prefill GPU: prompt
Prefill GPU -> Decode GPU: KV cache and first token
Decode GPU -> Client: token stream
Prefill GPU -> Router: ready for the next prompt
:::

The two pools want different settings. The prefill pool is compute-bound, so it benefits from large chunks and high tensor parallelism. The decode pool is memory-bound, so it benefits from large batches and a large cache budget.

Size the pools from the ratio of work. Take a request with a 2,000-token prompt and a 300-token answer. Suppose one prefill GPU sustains 20,000 prompt tokens per second and one decode GPU sustains 2,000 output tokens per second. Then:

$$\\frac{N_p}{N_d} = \\frac{2000 / 20000}{300 / 2000} = \\frac{0.1}{0.15} = 0.67$$

$N_p$ is the number of prefill GPUs and $N_d$ the number of decode GPUs. For every 3 decode GPUs you need 2 prefill GPUs. Measure the two rates on your own hardware before you set the ratio.

Note: DistServe and Splitwise both report 2 to 4 times more requests per GPU than a shared engine at the same latency targets.


This script computes the cache copy time over each link and the ratio of prefill to decode GPUs.

:::code
lang: python
file: disaggregate.py
def copy_ms(tokens, mb_per_token, link_gb_per_s):
    gb = tokens * mb_per_token / 1000
    return gb / link_gb_per_s * 1000

links = (("NVLink", 400), ("PCIe 5 x16", 64), ("400 Gb Ethernet", 50), ("100 Gb Ethernet", 12.5))
for name, bandwidth in links:
    print(name, round(copy_ms(4000, 0.33, bandwidth), 1), "ms")

def pool_ratio(prompt_tokens, answer_tokens, prefill_rate, decode_rate):
    return (prompt_tokens / prefill_rate) / (answer_tokens / decode_rate)

ratio = pool_ratio(2000, 300, 20000, 2000)
print("prefill GPUs per decode GPU:", round(ratio, 2))
print("for 12 decode GPUs you need", round(12 * ratio), "prefill GPUs")
:::

:::code
lang: text
NVLink 3.3 ms
PCIe 5 x16 20.6 ms
400 Gb Ethernet 26.4 ms
100 Gb Ethernet 105.6 ms
prefill GPUs per decode GPU: 0.67
for 12 decode GPUs you need 8 prefill GPUs
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Size the pools for your own traffic
task: Requests have a 1,000-token prompt and a 100-token answer. A prefill GPU sustains 10,000 prompt tokens per second and a decode GPU sustains 1,000 output tokens per second. Compute the GPU ratio. Then compute the copy time for a 10,000-token prompt at 0.13 MB per token over NVLink and over 100 Gb Ethernet. Decide whether disaggregation across the Ethernet link is acceptable when prefill takes 750 ms.
hint: Use pool_ratio and copy_ms from above. Compare each copy time with the 750 ms prefill.
lang: python
solution:
print(pool_ratio(1000, 100, 10000, 1000))            # 1.0, one prefill GPU per decode GPU
print(round(copy_ms(10000, 0.13, 400), 1), "ms")      # 3.2 ms over NVLink
print(round(copy_ms(10000, 0.13, 12.5), 1), "ms")     # 104 ms over 100 Gb Ethernet
# 104 ms is 14 percent of the 750 ms prefill: usable but not free.
:::

## Common mistakes

- Mistake: disaggregate across a 10 Gb network. Fix: keep the two pools inside one node or on a fast fabric.
- Mistake: size both pools equal. Fix: compute the ratio from measured prefill and decode rates.
- Mistake: tune both pools with the same tensor parallel degree. Fix: give the prefill pool more parallelism and the decode pool more cache.
- Mistake: adopt disaggregation for a server with short prompts. Fix: use chunked prefill first; disaggregation pays off with long prompts.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: disaggregated serving
q: A prompt has 10,000 tokens at 0.13 MB of cache per token. How long does the cache copy take at 400 GB per second?
- 0.3 ms
* about 3 ms
- about 30 ms
- about 300 ms
why: The cache is 1.3 GB, and 1.3 divided by 400 is 0.00325 seconds.
q: Why does a single long prefill step hurt the other sequences in a shared engine?
- The prefill evicts their cache blocks
* All sequences share one step, so every stream waits for the prefill to finish
- The prefill lowers the GPU clock
- The sampler runs once per prompt token
why: One forward pass covers all sequences in the batch, so a 300 ms prefill delays every decode token by 300 ms.
q: A decode GPU sustains 1,000 tokens per second and a prefill GPU 10,000. Requests have 1,000 prompt tokens and 100 answer tokens. What is the ratio of prefill to decode GPUs?
- 0.1
- 0.5
* 1
- 10
why: (1000 / 10000) / (100 / 1000) = 0.1 / 0.1 = 1, so the pools are equal.
q: Which pool benefits from a larger batch and a larger cache budget?
- The prefill pool, because it is compute-bound
* The decode pool, because it is memory-bound
- Both pools equally
- Neither; batch size only matters in a shared engine
why: Decode reads the weights once per step, so more sequences per step raise its intensity.
q: A server handles chat turns with 200-token prompts. Which change should come first?
* Enable chunked prefill in the shared engine
- Disaggregate across two nodes over 10 Gb Ethernet
- Double the prefill pool
- Lower the decode batch size
why: Disaggregation pays off with long prompts; short prompts stall decode little, and chunking is enough.
:::

## Go further

DistServe gives the full model for the ratio of pools and the placement of the cache copy. Splitwise measures the same design on real clusters and adds a power analysis. Sarathi-Serve is the shared-engine alternative with chunked prefill, and you should read both before you choose. The vLLM documentation and the SGLang repository both include disaggregated serving modes you can try.
`,
          },
        ],
      },
      {
        slug: 'attention-kernels',
        title: 'Attention kernels',
        description: 'The three kernel ideas that make attention fit in memory and run fast.',
        level: 'advanced',
        lessons: [
          {
            slug: 'flash-attention',
            title: 'FlashAttention: exact attention without the score matrix',
            summary: 'FlashAttention tiles the attention computation so the score matrix never reaches slow memory.',
            minutes: 16,
            objectives: [
              'Compute the memory that standard attention uses for the score matrix.',
              'Explain how the online softmax update works on a small example.',
              'Explain why FlashAttention is exact and not an approximation.',
              'Choose the PyTorch entry point that selects a fused attention kernel.',
            ],
            keyTerms: ['flash-attention', 'softmax', 'kv-cache', 'high-bandwidth memory', 'SRAM', 'tiling'],
            links: [
              { label: 'FlashAttention paper', url: 'https://arxiv.org/abs/2205.14135', kind: 'paper' },
              { label: 'FlashAttention-2 paper', url: 'https://arxiv.org/abs/2307.08691', kind: 'paper' },
              { label: 'FlashAttention-3 paper', url: 'https://arxiv.org/abs/2407.08608', kind: 'paper' },
              { label: 'flash-attention repository', url: 'https://github.com/Dao-AILab/flash-attention', kind: 'repo' },
              { label: 'PyTorch scaled_dot_product_attention', url: 'https://pytorch.org/docs/stable/generated/torch.nn.functional.scaled_dot_product_attention.html', kind: 'docs' },
              { label: 'Umar Jamil (YouTube)', url: 'https://www.youtube.com/@umarjamilai', kind: 'video' },
            ],
            body: `
## What this lesson covers

This lesson explains why standard attention runs out of memory on long sequences. It then shows how FlashAttention computes the same result in blocks. You will work through the online softmax update by hand on four scores.

## Why it matters

Attention compares every token with every other token. For a sequence of $T$ tokens, that comparison produces a score matrix with $T \\times T$ entries. At 8,192 tokens, one head needs 134 MB for that matrix in FP16 (16-bit floating point). A model with 64 heads needs 8.6 GB for one layer. The matrix also moves between the graphics processing unit (GPU) and its high-bandwidth memory (HBM) several times. HBM is large but slow compared with the on-chip static random-access memory (SRAM). FlashAttention removes the matrix and most of the HBM traffic.

:::video
id: l8pRSuU81PU
why: Use the chapter list to find the flash attention section, about 90 minutes in. Watch the switch to scaled_dot_product_attention and the speed-up it gives for the same output.
:::

## The idea with an example

Attention for one query is a softmax over its scores, followed by a weighted sum of the values. The softmax of a vector $s$ is:

$$p_i = \\frac{e^{s_i - m}}{\\sum_j e^{s_j - m}}$$

Here $s_i$ is the score for key $i$, $m$ is the maximum score, and $p_i$ is the attention weight. The problem is that $m$ and the sum need all scores before any weight is final.

FlashAttention solves this with an online softmax. It processes the scores in blocks and keeps two running numbers: the running maximum $m$ and the running sum $\\ell$. Take the scores [1, 3, 2, 4] in two blocks of two.

1. Block 1 has scores [1, 3]. The block maximum is 3. The block sum is $e^{1-3} + e^{3-3} = 0.135 + 1 = 1.135$. Set $m = 3$ and $\\ell = 1.135$.
2. Block 2 has scores [2, 4]. The new maximum is $\\max(3, 4) = 4$.
3. Rescale the old sum to the new maximum: $\\ell = 1.135 \\times e^{3-4} = 1.135 \\times 0.368 = 0.418$.
4. Add the new block: $\\ell = 0.418 + e^{2-4} + e^{4-4} = 0.418 + 0.135 + 1 = 1.553$.

Check against the direct method. The direct sum is $e^{-3} + e^{-1} + e^{-2} + e^{0} = 0.050 + 0.368 + 0.135 + 1 = 1.553$. The two methods agree. The kernel applies the same rescale factor to the running weighted sum of values. So the output is exact at the end of the last block.

Press Next to run the online softmax over the two blocks.

:::scenario
title: Online softmax over the scores 1, 3, 2, 4 in two blocks
state: running max=none, running sum=0, direct sum=none
step: Block 1 arrives with scores 1 and 3. The block maximum is 3.
state: running max=3
step: Sum the exponentials of 1 - 3 and 3 - 3. The sum is 0.135 + 1 = 1.135.
state: running sum=1.135
step: Block 2 arrives with scores 2 and 4. The new maximum is 4.
state: running max=4
step: Rescale the old sum by the exponential of 3 - 4, which is 0.368. The sum becomes 0.418.
state: running sum=0.418
step: Add the exponentials of 2 - 4 and 4 - 4. The sum becomes 0.418 + 0.135 + 1 = 1.553.
state: running sum=1.553
step: The direct sum over all four scores is also 1.553. The two methods agree, so the result is exact.
state: direct sum=1.553, match=yes
:::

## How it works

The kernel splits the query, key, and value matrices into blocks. A block is small enough to fit in SRAM. The procedure for one block of queries is:

1. Load the query block into SRAM once.
2. Load one key block and one value block.
3. Compute the block of scores in SRAM.
4. Update the running maximum, the running sum, and the running output with the rescale step above.
5. Repeat from step 2 for the next key block.
6. Divide the running output by the running sum and write the final output to HBM.

The diagram shows the data that moves between HBM and SRAM for one query block.

:::flow
title: FlashAttention data movement for one query block
HBM -> SRAM: query block, loaded once
HBM -> SRAM: key block and value block, one pair at a time
SRAM -> Scores: block of scores, stays on chip
Scores -> Running output: rescale and add
Running output -> HBM: final output, written once
:::

The score matrix never exists in HBM. So memory grows linearly with $T$ instead of quadratically. The table shows the score-matrix memory for one layer with 64 heads in FP16.

| Sequence length T | Standard attention | FlashAttention extra memory |
|---|---|---|
| 2,048 | 537 MB | a few MB |
| 8,192 | 8.6 GB | a few MB |
| 32,768 | 137 GB | a few MB |

The bars compare the score-matrix memory of standard attention at three lengths.

:::bars
title: Score matrix for one layer with 64 heads in FP16
unit: GB
T = 2,048: 0.54
T = 8,192: 8.6
T = 32,768: 137
:::

Note: FlashAttention changes the order of the arithmetic, not the result. The output matches standard attention up to floating-point rounding.

FlashAttention-2 reorders the loops and the work split across GPU threads, and about doubles the speed. FlashAttention-3 uses the asynchronous memory and FP8 features of the Hopper GPUs for another large gain. In PyTorch, call torch.nn.functional.scaled_dot_product_attention and the library selects a fused kernel when the shapes allow it.


This script runs the online softmax over the four scores in two blocks and checks the result against the direct sum.

:::code
lang: python
file: online_softmax.py
import math

def online_softmax_sum(scores, block=2):
    m = -math.inf
    total = 0.0
    for i in range(0, len(scores), block):
        chunk = scores[i:i + block]
        new_m = max(m, max(chunk))
        total = total * math.exp(m - new_m) + sum(math.exp(s - new_m) for s in chunk)
        m = new_m
        print("after block", i // block + 1, "max", m, "sum", round(total, 3))
    return m, total

scores = [1, 3, 2, 4]
m, total = online_softmax_sum(scores)
direct = sum(math.exp(s - max(scores)) for s in scores)
print("online sum", round(total, 3), " direct sum", round(direct, 3))

T, heads = 8192, 64
print("score matrix for one layer in FP16:", round(T * T * heads * 2 / 1e9, 1), "GB")
:::

:::code
lang: text
after block 1 max 3 sum 1.135
after block 2 max 4 sum 1.553
online sum 1.553  direct sum 1.553
score matrix for one layer in FP16: 8.6 GB
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Carry the running output as well
task: Extend online_softmax_sum so it also keeps a running weighted sum of values. Use the scores [1, 3, 2, 4] and the values [10, 20, 30, 40]. Rescale the running output with the same factor as the running sum. At the end divide the output by the sum and compare with the direct attention output.
hint: The rescale factor exp(old max - new max) applies to both running numbers. The direct answer is the sum of weight times value divided by the sum of weights.
lang: python
solution:
import math

def online_attention(scores, values, block=2):
    m, total, out = -math.inf, 0.0, 0.0
    for i in range(0, len(scores), block):
        s, v = scores[i:i + block], values[i:i + block]
        new_m = max(m, max(s))
        scale = math.exp(m - new_m)
        total = total * scale + sum(math.exp(x - new_m) for x in s)
        out = out * scale + sum(math.exp(x - new_m) * y for x, y in zip(s, v))
        m = new_m
    return out / total

scores, values = [1, 3, 2, 4], [10, 20, 30, 40]
weights = [math.exp(x - 4) for x in scores]
direct = sum(w * y for w, y in zip(weights, values)) / sum(weights)
print(round(online_attention(scores, values), 4), round(direct, 4))   # both 33.4291
:::

## Common mistakes

- Mistake: you call FlashAttention an approximation. Fix: it is exact; the online softmax rescale makes the result identical in exact arithmetic.
- Mistake: you write your own attention with explicit matrix multiplication and softmax. Fix: use the fused entry point so the score matrix stays in SRAM.
- Mistake: you measure memory at short context and expect the same at long context. Fix: the standard score matrix grows with $T^2$, so test at the longest context you serve.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: FlashAttention
q: How many bytes does the score matrix for one head use at T = 4,096 in FP16?
- 8.4 MB
- 16.8 MB
* 33.5 MB
- 67 MB
why: 4,096 squared is 16.8 million entries, and each entry takes 2 bytes.
q: Which two running values does the online softmax keep between blocks?
- The running mean and the running variance
* The running maximum and the running sum of exponentials
- The first score and the last score
- The block count and the block size
why: Both values are enough to rescale earlier work when a later block raises the maximum.
q: Why does the kernel rescale the old sum when a new block arrives?
- To keep the sum below 1
* Because the maximum can rise, and all old exponentials must use the new maximum
- To convert the sum from FP16 to FP32
- Because the new block has a different length
why: The exponentials were computed relative to the old maximum, so a factor exp(old max - new max) corrects them.
q: After block 1 the running sum is 1.135 with maximum 3. Block 2 raises the maximum to 4. What is the rescaled old sum before the new block is added?
- 1.135
* 0.418
- 3.085
- 0.135
why: Multiply 1.135 by exp(3 - 4) = 0.368 to get 0.418.
q: Is FlashAttention an approximation of standard attention?
- Yes, it drops the smallest scores in each block
- Yes, it rounds the softmax to FP8
* No, it changes the order of the arithmetic and gives the same result up to rounding
- No, but only for sequences under 2,048 tokens
why: The online softmax is exact in exact arithmetic; the gain comes from avoiding HBM traffic, not from dropping work.
:::

## Go further

Read the original FlashAttention paper for the full algorithm and the HBM traffic analysis. The FlashAttention-2 and FlashAttention-3 papers show how the same idea maps to newer GPUs. The flash-attention repository holds the kernels that vLLM and other engines call. The PyTorch documentation for scaled_dot_product_attention lists the conditions under which the fused kernel runs. Umar Jamil has a long video that derives FlashAttention line by line.
`,
          },
          {
            slug: 'paged-attention',
            title: 'Paged attention: a block table for the KV cache',
            summary: 'Paged attention stores the KV cache in fixed-size blocks so that memory waste stays small.',
            minutes: 15,
            objectives: [
              'Compute the memory waste of contiguous and paged allocation for a given sequence.',
              'Explain the difference between internal and external fragmentation.',
              'Explain how copy-on-write shares a prefix between sequences.',
              'Describe how the attention kernel finds a block through the block table.',
            ],
            keyTerms: ['paged-attention', 'kv-cache', 'block table', 'fragmentation', 'copy-on-write', 'continuous-batching'],
            links: [
              { label: 'vLLM paper (PagedAttention)', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'vLLM repository', url: 'https://github.com/vllm-project/vllm', kind: 'repo' },
              { label: 'SGLang repository', url: 'https://github.com/sgl-project/sglang', kind: 'repo' },
              { label: 'Lilian Weng: inference optimization', url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/', kind: 'article' },
            ],
            body: `
## What this lesson covers

This lesson explains how an inference engine stores the key-value (KV) cache in small blocks. It shows the memory waste of the old contiguous layout with numbers. It then covers the block table, copy-on-write, and eviction.

## Why it matters

The KV cache holds the keys and values of every previous token in a sequence. On a busy server the cache uses more memory than the weights. Early engines reserved one contiguous region per sequence for the maximum possible length. Most of that region stayed empty. The vLLM paper measured that only 20 to 40 percent of the reserved cache held real data. Paged attention raises that number above 90 percent. More useful cache means more sequences per batch and more throughput.

## The idea with an example

Paged attention borrows the idea of virtual memory from operating systems. The engine divides the cache into fixed-size blocks. Each block holds the keys and values for a fixed number of tokens, for example 16. A sequence owns a list of blocks. That list is the block table. The blocks do not need to be next to each other in memory.

Take a sequence with 70 tokens and a block size of 16.

1. The sequence needs $\\lceil 70 / 16 \\rceil = 5$ blocks.
2. Five blocks hold $5 \\times 16 = 80$ token slots.
3. The sequence uses 70 slots, so 10 slots sit empty.
4. The waste is $10 / 80 = 12.5$ percent, and only in the last block.

Now compare the contiguous layout with a maximum length of 2,048 tokens.

1. The engine reserves 2,048 slots at the start.
2. The sequence uses 70 slots.
3. The waste is $2048 - 70 = 1978$ slots, or $1978 / 2048 = 96.6$ percent.

| Layout | Slots reserved | Slots used | Waste |
|---|---|---|---|
| Contiguous, max 2,048 | 2,048 | 70 | 96.6 % |
| Paged, block 16 | 80 | 70 | 12.5 % |

The bars compare the waste of the two layouts.

:::bars
title: Waste for a 70-token sequence
unit: percent
Contiguous, max 2,048: 96.6
Paged, block 16: 12.5
:::

The paged layout also grows with the sequence. When token 81 arrives, the engine allocates one more block.

Press Next to allocate blocks as the sequence grows.

:::scenario
title: Block allocation for one sequence with block size 16
state: tokens=0, blocks=0, empty slots=0, block table=empty
step: The prompt arrives with 70 tokens. The engine needs 70 / 16 = 4.375, so 5 blocks.
state: tokens=70, blocks=5, empty slots=10
step: The block table lists five physical blocks, for example 17 3 42 8 25. They are not next to each other in memory.
state: block table=17 3 42 8 25
step: Decode adds tokens 71 to 80. They fill the empty slots of block 25.
state: tokens=80, empty slots=0
step: Token 81 arrives. The engine takes one free block, number 61, and appends it to the table.
state: tokens=81, blocks=6, empty slots=15, block table=17 3 42 8 25 61
step: The sequence finishes at 90 tokens. The engine frees all six blocks. Any sequence can use them, because every block has the same size.
state: tokens=90, blocks=0, empty slots=0, block table=empty, free blocks returned=6
:::

## How it works

Two kinds of waste exist. Internal fragmentation is empty space inside a reserved region. The contiguous layout had 1,978 slots of internal fragmentation. External fragmentation is free memory split into pieces too small to use. The contiguous layout suffers from it when sequences of different lengths finish in a random order. Paged attention limits internal fragmentation to less than one block per sequence. It removes external fragmentation because every free block has the same size and fits any request.

The attention kernel reads the block table during the computation. For query token $t$ and key position $j$, the kernel computes the block index $\\lfloor j / B \\rfloor$ and the offset $j \\bmod B$. Here $B$ is the block size. It looks up the physical block address in the table and reads the key and value from that address. The extra lookup costs a little time, so engines tune $B$ between 8 and 32 tokens.

The diagram shows how the kernel finds the key at position 37 with a block size of 16.

:::flow
title: Lookup of key position 37 through the block table
Kernel -> Block index: 37 / 16 = 2, offset 37 mod 16 = 5
Block index -> Block table: read entry 2
Block table -> Physical block: address of block 42
Physical block -> Kernel: key and value at offset 5
:::

The block table also enables sharing. Several sequences can point at the same physical block. Parallel sampling produces many answers from one prompt, and beam search keeps many candidates with a common prefix. All of them share the prompt blocks. The engine keeps a reference count on each block. When one sequence wants to write into a shared block, the engine copies that block first and then writes into the copy. This is copy-on-write.

When memory runs out, the engine evicts. The scheduler picks a sequence, frees all of its blocks, and marks it as preempted. Later it recomputes the cache from the prompt. The procedure to size a cache pool is:

1. Compute the bytes per token with $2 \\times L \\times H_{kv} \\times d_{\\text{head}} \\times b$. Here $L$ is the layer count, $H_{kv}$ the KV heads, $d_{\\text{head}}$ the head dimension, and $b$ the bytes per element.
2. Multiply by the block size $B$ to get bytes per block.
3. Divide the free GPU memory after weights by bytes per block to get the block count.


This script allocates blocks for the 70-token sequence, looks up position 37 through the block table, and compares the waste of the two layouts.

:::code
lang: python
file: block_table.py
BLOCK = 16

def blocks_needed(tokens):
    return -(-tokens // BLOCK)

def lookup(block_table, position):
    index, offset = divmod(position, BLOCK)
    return block_table[index], offset

tokens = 70
table = [17, 3, 42, 8, 25]
slots = blocks_needed(tokens) * BLOCK
print("blocks:", blocks_needed(tokens), " empty slots:", slots - tokens)
physical, offset = lookup(table, 37)
print("key 37 lives in physical block", physical, "at offset", offset)

waste_contiguous = (2048 - tokens) / 2048 * 100
waste_paged = (slots - tokens) / slots * 100
print("waste contiguous:", round(waste_contiguous, 1), "%  paged:", round(waste_paged, 1), "%")

bytes_per_token = 2 * 80 * 8 * 128 * 2
print("bytes per block for the 70B model:", bytes_per_token * BLOCK)
print("blocks in 40 GB:", int(40e9 // (bytes_per_token * BLOCK)))
:::

:::code
lang: text
blocks: 5  empty slots: 10
key 37 lives in physical block 42 at offset 5
waste contiguous: 96.6 %  paged: 12.5 %
bytes per block for the 70B model: 5242880
blocks in 40 GB: 7629
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Grow a sequence block by block
task: Start with a 100-token prompt and a free list of physical blocks [9, 4, 31, 12, 50, 7, 22, 61, 2]. Allocate blocks from the free list as the sequence grows one token at a time to 130 tokens. Print the block table and the number of empty slots after the prompt and again at 130 tokens.
hint: A new block is needed whenever the token count passes a multiple of 16. Take blocks from the front of the free list.
lang: python
solution:
BLOCK = 16
free = [9, 4, 31, 12, 50, 7, 22, 61, 2]
table = []
tokens = 0
for tokens in range(1, 131):
    if tokens > len(table) * BLOCK:
        table.append(free.pop(0))
    if tokens in (100, 130):
        print(tokens, "tokens, table", table, "empty slots", len(table) * BLOCK - tokens)
# 100 tokens: 7 blocks, 12 empty slots
# 130 tokens: 9 blocks, 14 empty slots
:::

## Common mistakes

- Mistake: you set a very small block size to reduce waste. Fix: tiny blocks increase table lookups and kernel overhead; 16 is a good default.
- Mistake: you reserve the cache for the maximum context length per request. Fix: let the engine allocate blocks on demand.
- Mistake: you ignore preemption in load tests. Fix: watch the preemption counter; frequent preemption means the cache pool is too small.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: paged attention
q: How many blocks of size 16 does a 100-token sequence need, and how many slots stay empty?
- 6 blocks, 4 empty slots
* 7 blocks, 12 empty slots
- 7 blocks, 4 empty slots
- 8 blocks, 28 empty slots
why: 100 / 16 = 6.25 rounds up to 7 blocks, which hold 112 slots, and 112 - 100 = 12.
q: Which kind of fragmentation does paged attention remove completely?
- Internal fragmentation
* External fragmentation
- Both kinds
- Neither kind
why: Every free block has the same size and fits any request, so free memory never splits into useless pieces.
q: When does copy-on-write copy a block?
- When a sequence reads a block that another sequence owns
* When a sequence writes into a block that other sequences still share
- When the block table grows past 32 entries
- When the engine evicts a sequence
why: Shared prompt blocks stay shared for reads; the first write by one sequence triggers a private copy.
q: With a block size of 16, where does the kernel find key position 37 in the block table [17, 3, 42, 8, 25]?
- Block 3, offset 7
- Block 17, offset 5
* Block 42, offset 5
- Block 8, offset 5
why: 37 divided by 16 is 2 with remainder 5, and entry 2 of the table is physical block 42.
q: An engineer sets the block size to 1 to remove all internal fragmentation. What goes wrong?
- Sequences can no longer share a prefix
* The kernel performs one table lookup per token, and the overhead slows every step
- The cache no longer fits in memory
- Copy-on-write stops working
why: Tiny blocks multiply the lookups and the kernel overhead, which is why engines use 8 to 32 tokens per block.
:::

## Go further

The vLLM paper introduces paged attention and reports the memory measurements in this lesson. The vLLM documentation explains block size, preemption, and swap settings. The vLLM and SGLang repositories hold the kernels and the block managers. Lilian Weng's inference optimization post places paged attention next to the other memory techniques.
`,
          },
          {
            slug: 'gqa-and-mqa',
            title: 'Grouped-query and multi-query attention',
            summary: 'Fewer key-value heads shrink the KV cache and the bytes read per decoded token.',
            minutes: 14,
            objectives: [
              'Compute the KV cache size for multi-head, grouped-query, and multi-query attention.',
              'Explain why the number of KV heads sets the decode bandwidth.',
              'Compare the quality trade-off between the three attention layouts.',
              'Describe how to convert a multi-head checkpoint to grouped-query attention.',
            ],
            keyTerms: ['grouped-query-attention', 'multi-query attention', 'kv-cache', 'attention head', 'memory bandwidth', 'arithmetic-intensity'],
            links: [
              { label: 'GQA paper', url: 'https://arxiv.org/abs/2305.13245', kind: 'paper' },
              { label: 'Multi-query attention paper', url: 'https://arxiv.org/abs/1911.02150', kind: 'paper' },
              { label: 'Efficiently scaling transformer inference', url: 'https://arxiv.org/abs/2211.05102', kind: 'paper' },
              { label: 'Llama 3 paper', url: 'https://arxiv.org/abs/2407.21783', kind: 'paper' },
              { label: 'Hugging Face Transformers docs', url: 'https://huggingface.co/docs/transformers', kind: 'docs' },
            ],
            body: `
## What this lesson covers

This lesson compares three ways to lay out the attention heads. It computes the key-value (KV) cache size for each layout on a 70B-class model. It then explains the bandwidth effect during decode and the quality trade-off.

## Why it matters

During decode the model produces one token per step. For each step it reads the full KV cache from high-bandwidth memory (HBM). The cache size therefore sets both the memory you need and the time each step takes. Multi-head attention (MHA) stores one key and one value vector per head per token. Grouped-query attention (GQA) and multi-query attention (MQA) store far fewer.

:::video
id: kCc8FmEb1nY
why: Watch the multi-head attention chapter. Every head gets its own key and value projection, which is the MHA layout. This lesson removes most of those key and value heads.
:::

## The idea with an example

An attention layer has $H$ query heads. Each query head needs a key head and a value head to attend to.

- MHA gives each query head its own key and value head. The number of KV heads is $H$.
- MQA gives all query heads one shared key head and one shared value head. The number of KV heads is 1.
- GQA puts the query heads into $G$ groups. Each group shares one key head and one value head. The number of KV heads is $G$.

The diagram shows a small GQA layout with 8 query heads in 2 groups.

:::flow
title: GQA with 8 query heads and 2 KV heads
Query heads 1 to 4 -> KV head 1: share one key and one value head
Query heads 5 to 8 -> KV head 2: share one key and one value head
KV head 1 -> KV cache: 1 key and 1 value per token
KV head 2 -> KV cache: 1 key and 1 value per token
:::

The cache size per sequence is:

$$\\text{bytes} = 2 \\times L \\times H_{kv} \\times d_{\\text{head}} \\times T \\times b$$

The factor 2 covers keys and values. $L$ is the number of layers, $H_{kv}$ is the number of KV heads, and $d_{\\text{head}}$ is the head dimension. $T$ is the number of tokens, and $b$ is the bytes per element. Take a 70B-class model with $H = 64$, $d_{\\text{head}} = 128$, and $L = 80$. Use $T = 8192$ and $b = 2$ for FP16 (16-bit floating point).

1. MHA: $H_{kv} = 64$. Bytes $= 2 \\times 80 \\times 64 \\times 128 \\times 8192 \\times 2 = 21.5$ GB.
2. GQA with 8 groups: $H_{kv} = 8$. Bytes $= 21.5 / 8 = 2.7$ GB.
3. MQA: $H_{kv} = 1$. Bytes $= 21.5 / 64 = 0.34$ GB.

Press Next to compute the cache for each layout.

:::scenario
title: KV cache at 8,192 tokens for a 70B-class model
state: layers=80, head size=128, tokens=8192, bytes per element=2, MHA=none, GQA=none, MQA=none
step: Start from the formula: 2 times layers times KV heads times head size times tokens times bytes.
step: MHA has 64 KV heads. The cache is 2 x 80 x 64 x 128 x 8192 x 2 bytes, which is 21.5 GB.
state: MHA=21.5 GB
step: GQA with 8 groups has 8 KV heads. Only the KV head count changes, so divide 21.5 GB by 8.
state: GQA=2.7 GB
step: MQA has 1 KV head. Divide 21.5 GB by 64.
state: MQA=0.34 GB
step: With 40 GB free, MHA fits 1 sequence, GQA fits 14 and MQA fits 119.
state: sequences in 40 GB=1 vs 14 vs 119
:::

| Layout | KV heads | Cache at 8,192 tokens | Sequences in 40 GB of free memory |
|---|---|---|---|
| MHA | 64 | 21.5 GB | 1 |
| GQA (8 groups) | 8 | 2.7 GB | 14 |
| MQA | 1 | 0.34 GB | 119 |

The bars compare the cache of the three layouts.

:::bars
title: KV cache per sequence at 8,192 tokens
unit: GB
MHA, 64 KV heads: 21.5
GQA, 8 KV heads: 2.7
MQA, 1 KV head: 0.34
:::

## How it works

The cache size also sets the bytes read per decoded token. For one new token the kernel reads the keys and values of every previous token. For MHA at 8,192 tokens that is 21.5 GB per sequence per step. A GPU with 3.35 TB/s of HBM bandwidth needs 6.4 ms for that read alone. With GQA the read falls to 0.8 ms. With MQA it falls to 0.1 ms. The compute for attention is the same in all three cases, so GQA and MQA raise the arithmetic intensity of the step. Arithmetic intensity is the number of floating-point operations per byte moved.

The bars compare the time to read the cache for one token.

:::bars
title: Cache read time per decode step at 8,192 tokens and 3.35 TB/s
unit: ms
MHA: 6.4
GQA, 8 groups: 0.8
MQA: 0.1
:::

Quality follows the number of KV heads. The GQA paper shows that 8 groups match MHA quality within noise on summarisation and translation. MQA loses a small but measurable amount of quality and trains less stably. Most teams pick $G = 8$ because it also matches the 8 GPUs in a tensor-parallel node, so each GPU holds one KV head.

You do not have to train a GQA model from scratch. The procedure to convert an MHA checkpoint is:

1. Group the $H$ key heads into $G$ groups of $H / G$ heads.
2. Replace each group with the mean of its key projection weights.
3. Do the same for the value heads.
4. Continue training on a small fraction of the original data, about 5 percent, so the model adapts.

The GQA paper calls this uptraining, and it recovers nearly all of the quality.


This script computes the cache, the read time per step and the sequence count for the three layouts.

:::code
lang: python
file: layouts.py
def kv_cache_gb(layers, kv_heads, head_dim, tokens, bytes_per_elem=2):
    return 2 * layers * kv_heads * head_dim * tokens * bytes_per_elem / 1e9

bandwidth_gb_per_s = 3350
free_gb = 40
for name, kv_heads in (("MHA", 64), ("GQA, 8 groups", 8), ("MQA", 1)):
    gb = kv_cache_gb(80, kv_heads, 128, 8192)
    read_ms = gb / bandwidth_gb_per_s * 1000
    print(name + ":", round(gb, 2), "GB per sequence,", round(read_ms, 1), "ms read per step,",
          int(free_gb // gb), "sequences in 40 GB")
:::

:::code
lang: text
MHA: 21.47 GB per sequence, 6.4 ms read per step, 1 sequences in 40 GB
GQA, 8 groups: 2.68 GB per sequence, 0.8 ms read per step, 14 sequences in 40 GB
MQA: 0.34 GB per sequence, 0.1 ms read per step, 119 sequences in 40 GB
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Compare layouts for an 8B model
task: An 8B model has 32 layers, 32 query heads and a head size of 128. Use kv_cache_gb to compute the cache per 8,192-token sequence in FP16 for MHA (32 KV heads), GQA with 8 groups and GQA with 4 groups. Print the factor by which each layout shrinks the cache compared with MHA.
hint: Only the KV head count changes. The factor is the query head count divided by the KV head count.
lang: python
solution:
for name, kv_heads in (("MHA", 32), ("GQA 8", 8), ("GQA 4", 4)):
    gb = kv_cache_gb(32, kv_heads, 128, 8192)
    print(name, round(gb, 2), "GB, factor", 32 // kv_heads)
# MHA 4.29 GB factor 1; GQA 8 1.07 GB factor 4; GQA 4 0.54 GB factor 8
:::

## Common mistakes

- Mistake: you size the cache with the number of query heads. Fix: use the number of KV heads from the model configuration file.
- Mistake: you assume MQA is always the right choice because the cache is smallest. Fix: measure the quality loss on your task; GQA with 8 groups is usually the safer choice.
- Mistake: you set tensor parallelism larger than the number of KV heads. Fix: the engine must then copy KV heads across GPUs, which wastes memory.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: GQA and MQA
q: A model has 32 query heads and 4 KV heads. By what factor is its cache smaller than with MHA?
- 4 times
* 8 times
- 28 times
- 32 times
why: MHA would use 32 KV heads; 32 divided by 4 is 8.
q: Why does GQA speed up decode even though the attention compute is the same?
- GQA skips half of the attention layers
* The step reads fewer bytes from HBM, and decode is bandwidth-bound
- GQA uses a smaller head size
- GQA lowers the number of query heads
why: Each decode step reads the whole cache, so a smaller cache means a shorter memory read.
q: How does uptraining build the GQA key heads from an MHA checkpoint?
- It keeps the first key head of each group and deletes the rest
* It takes the mean of the key projection weights within each group
- It trains new key heads from random values
- It copies the query heads into the key heads
why: The GQA paper averages the projections in each group and then continues training briefly.
q: A 70B-class model with MHA has a 21.5 GB cache at 8,192 tokens. The read takes 6.4 ms at 3.35 TB per second. What is the read time with 8 KV heads?
- 6.4 ms
- 3.2 ms
* 0.8 ms
- 0.1 ms
why: 8 KV heads cut the cache by 64 / 8 = 8 times, so 6.4 / 8 = 0.8 ms.
q: An engineer sets tensor parallelism to 16 on a model with 8 KV heads. What happens?
- The engine refuses to start
* The engine copies KV heads across GPUs, so the cache per GPU stops shrinking
- The cache per GPU shrinks by 16 times
- The query heads are merged into 8 groups
why: With fewer KV heads than GPUs, each head must be duplicated, which wastes cache memory.
:::

## Go further

The GQA paper gives the uptraining procedure and the quality curves against the number of groups. The multi-query attention paper is the original argument that the cache read dominates decode time. The Google paper on efficiently scaling transformer inference derives the bandwidth arithmetic in this lesson for large models. The Llama 3 paper documents a production GQA configuration with 8 KV heads. The Hugging Face Transformers documentation shows where the number of KV heads appears in a model configuration.
`,
          },
        ],
      },
      {
        slug: 'parallelism',
        title: 'Parallelism',
        description: 'How to split a model and its work across many GPUs.',
        level: 'advanced',
        lessons: [
          {
            slug: 'tensor-parallelism',
            title: 'Tensor parallelism',
            summary: 'Tensor parallelism splits each weight matrix across GPUs and joins the results with all-reduce.',
            minutes: 16,
            objectives: [
              'Compute the memory per GPU when a model is split with tensor parallelism.',
              'Explain where the two all-reduce steps in each transformer layer come from.',
              'Compute the communication volume per decode step.',
              'Explain why tensor parallelism needs fast links inside one node.',
            ],
            keyTerms: ['tensor-parallelism', 'all-reduce', 'NVLink', 'weights', 'decode latency', 'kv-cache'],
            links: [
              { label: 'Megatron-LM paper', url: 'https://arxiv.org/abs/1909.08053', kind: 'paper' },
              { label: 'Efficiently scaling transformer inference', url: 'https://arxiv.org/abs/2211.05102', kind: 'paper' },
              { label: 'Megatron-LM repository', url: 'https://github.com/NVIDIA/Megatron-LM', kind: 'repo' },
              { label: 'NCCL repository', url: 'https://github.com/NVIDIA/nccl', kind: 'repo' },
              { label: 'PyTorch distributed docs', url: 'https://pytorch.org/docs/stable/distributed.html', kind: 'docs' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
            ],
            body: `
## What this lesson covers

This lesson explains how tensor parallelism (TP) cuts one weight matrix into pieces and gives each piece to a different graphics processing unit (GPU). It computes the memory per GPU and the communication per layer for a 70B model. It then explains why the technique needs the fast links inside one server.

## Why it matters

A 70B model in FP16 (16-bit floating point) has 140 GB of weights. No single GPU holds that. Tensor parallelism is the standard way to serve such a model on 2, 4, or 8 GPUs with low latency. The cost is communication inside every layer, and that communication sets a floor on the decode step time.

## The idea with an example

A transformer layer has an attention block and a multilayer perceptron (MLP) block. The MLP computes $Y = \\text{GeLU}(X A) B$. $X$ is the input with one row per token, $A$ is the first weight matrix, and $B$ is the second. GeLU is the activation function applied to each element.

Split $A$ by columns across 4 GPUs: $A = [A_1, A_2, A_3, A_4]$. GPU $i$ computes $\\text{GeLU}(X A_i)$ with its own column block. The activation function is applied per element, so no communication is needed. Now split $B$ by rows: $B = [B_1; B_2; B_3; B_4]$. GPU $i$ computes the partial product $\\text{GeLU}(X A_i) B_i$. The full output is the sum of the four partial products. An all-reduce sums the partial products on every GPU, so one all-reduce completes the MLP.

The diagram shows the same MLP split across 2 GPUs with one all-reduce at the end.

:::flow
title: MLP block on 2 GPUs with one all-reduce
Input X -> GPU 0: full X
Input X -> GPU 1: full X
GPU 0 -> GPU 0 partial: GeLU(X A1) B1
GPU 1 -> GPU 1 partial: GeLU(X A2) B2
GPU 0 partial -> All-reduce: partial sum
GPU 1 partial -> All-reduce: partial sum
All-reduce -> Output Y: full sum on both GPUs
:::

Attention splits by head. A model with 64 heads places 16 heads on each of 4 GPUs. Each GPU computes attention for its heads. The output projection is row-split like $B$, so it ends with one more all-reduce. Each layer therefore performs two all-reduce steps.

The memory arithmetic for a 70B model in FP16 on 4 GPUs is:

1. Weights: $140 / 4 = 35$ GB per GPU.
2. The key-value (KV) cache also splits by head, so each GPU holds a quarter of the cache.
3. Each GPU has 80 GB, so $80 - 35 = 45$ GB remains for the cache and activations.

The bars compare the weight memory per GPU at each TP degree.

:::bars
title: Weights per GPU for a 70B FP16 model
unit: GB
TP 1: 140 (does not fit)
TP 2: 70
TP 4: 35
TP 8: 17.5
:::

## How it works

The communication volume per all-reduce is the size of the activation tensor. Each all-reduce moves about $2 \\times N \\times d \\times b$ bytes per GPU. $N$ is the number of tokens in the batch, $d$ is the hidden size, and $b$ is the bytes per element. The factor 2 comes from the reduce-scatter and the all-gather phases of a ring all-reduce. Take a decode step with 32 sequences, so $N = 32$, $d = 8192$, and $b = 2$:

$$2 \\times 32 \\times 8192 \\times 2 = 1{,}048{,}576 \\text{ bytes} \\approx 1 \\text{ MB per all-reduce}$$

An 80-layer model performs 160 all-reduce steps per token. That is about 160 MB per decode step. The volume is small, but each all-reduce has a fixed latency of 10 to 30 microseconds on NVLink. So communication adds 2 to 5 ms per decode step before any bytes move. The table compares the two link types in a typical server.

| Link | Bandwidth per GPU | All-reduce latency | 160 all-reduce steps |
|---|---|---|---|
| NVLink inside a node | 900 GB/s | about 20 us | about 3 ms |
| Ethernet between nodes | 50 GB/s | about 200 us | about 32 ms |

The bars compare the communication time of 160 all-reduce steps on each link.

:::bars
title: Communication time per decode step for 160 all-reduce steps
unit: ms
NVLink inside a node: 3
Ethernet between nodes: 32
:::

This is why engines keep tensor parallelism inside one node. Across nodes the latency per layer grows ten times.

Press Next to follow one decode step through one layer at TP = 4.

:::scenario
title: One decode step through one layer at TP = 4 with batch 32
state: all-reduce count=0, bytes moved per GPU=0 MB, added latency=0 ms
step: Each GPU holds 16 of the 64 attention heads and a quarter of the KV cache. Each GPU computes attention for its own heads.
step: The output projection is row-split. Each GPU holds a partial sum. The first all-reduce adds the four partial sums.
state: all-reduce count=1, bytes moved per GPU=1 MB
step: Each GPU multiplies X by its column block of A and applies GeLU. No communication is needed.
step: Each GPU multiplies by its row block of B. The second all-reduce adds the four partial products.
state: all-reduce count=2, bytes moved per GPU=2 MB
step: The layer is done. Repeat for 80 layers: 160 all-reduce steps and about 160 MB per GPU per token.
state: all-reduce count=160 per token, bytes moved per GPU=160 MB
step: Each all-reduce has a fixed latency of about 20 us on NVLink. The 160 steps add about 3 ms to the decode step.
state: added latency=about 3 ms
:::

The procedure to set tensor parallelism in a serving engine is:

1. Compute weight bytes: weight count times bytes per element.
2. Divide by the GPU memory to get the smallest TP degree that fits with room for the cache.
3. Round up to a divisor of the number of attention heads and the number of KV heads.
4. Confirm that all GPUs in the group sit on the same NVLink fabric.

Caution: a TP degree that does not divide the number of KV heads forces the engine to copy KV heads. The cache per GPU then stops shrinking.


This script runs the column and row split on the CPU with PyTorch. The sum of the four partial products equals the full result, which is what the all-reduce computes across GPUs.

:::code
lang: python
file: tp_mlp.py
import torch
gelu = torch.nn.functional.gelu
torch.manual_seed(0)

X = torch.randn(32, 64)     # 32 tokens, hidden size 64
A = torch.randn(64, 256)    # first MLP matrix
B = torch.randn(256, 64)    # second MLP matrix
full = gelu(X @ A) @ B

tp = 4
A_cols = A.chunk(tp, dim=1)  # column split: each GPU gets 64 of 256 columns
B_rows = B.chunk(tp, dim=0)  # row split: each GPU gets 64 of 256 rows
partials = [gelu(X @ A_cols[i]) @ B_rows[i] for i in range(tp)]
all_reduce = sum(partials)   # the sum NCCL computes across the 4 GPUs

print("max difference:", (full - all_reduce).abs().max().item())
print("bytes per all-reduce at d=8192, batch 32, FP16:", 2 * 32 * 8192 * 2)
print("all-reduce steps per token for 80 layers:", 2 * 80)
:::

The first line prints a number near 1e-5. That is floating-point rounding, not a real difference.

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Pick the TP degree for a model
task: Write a function tp_degree(weights_gb, gpu_gb, kv_heads) that returns the smallest TP degree from (1, 2, 4, 8) that leaves at least a third of each GPU free and divides the KV head count. Test it for a 70B FP16 model (140 GB) with 8 KV heads on 80 GB GPUs, and for a 7B FP16 model (14 GB) with 32 KV heads on 24 GB GPUs. Then print the all-reduce latency floor for 160 steps at 20 microseconds each.
hint: Weights per GPU must be at most two thirds of the GPU memory, so at most 53.3 GB on an 80 GB GPU.
lang: python
solution:
def tp_degree(weights_gb, gpu_gb, kv_heads):
    for tp in (1, 2, 4, 8):
        if weights_gb / tp <= gpu_gb * 2 / 3 and kv_heads % tp == 0:
            return tp
    return None

print(tp_degree(140, 80, 8))    # 4: 35 GB per GPU
print(tp_degree(14, 24, 32))    # 1: 14 GB fits with 10 GB free
print("latency floor:", 160 * 20 / 1000, "ms")   # 3.2 ms
:::

## Common mistakes

- Mistake: you run tensor parallelism across two servers over Ethernet. Fix: keep TP inside a node and use pipeline parallelism across nodes.
- Mistake: you pick TP = 3 for a model with 32 heads. Fix: pick a divisor of the head count, such as 2, 4, or 8.
- Mistake: you expect the step time to fall by the TP factor. Fix: the fixed all-reduce latency does not shrink, so the gain flattens.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: tensor parallelism
q: How much weight memory does each GPU hold for a 70B FP16 model at TP = 8?
- 8.75 GB
* 17.5 GB
- 35 GB
- 70 GB
why: 140 GB of weights divided by 8 GPUs is 17.5 GB per GPU.
q: How many all-reduce steps happen per token in a 32-layer model?
- 32
* 64
- 128
- 2
why: Each layer performs two all-reduce steps, one after attention and one after the MLP.
q: Why does the MLP block need only one all-reduce?
- Because GeLU is applied after the all-reduce
* Because the column split of the first matrix needs no communication, and the row split of the second needs one sum
- Because the MLP has only one weight matrix
- Because the all-reduce is merged with the attention one
why: The activation function works per element on each column block, so only the final partial sums must be added.
q: A decode step has batch 32, hidden size 8,192 and FP16 elements. About how many bytes does one all-reduce move per GPU?
- 0.5 MB
* 1 MB
- 8 MB
- 160 MB
why: 2 phases times 32 tokens times 8,192 elements times 2 bytes is about 1 MB.
q: An engineer runs TP = 8 across two servers connected by Ethernet. What is the main cost?
- The weights no longer fit
* Each of the 160 all-reduce steps pays about 200 microseconds of latency instead of 20, so the step time grows by tens of milliseconds
- The KV cache must be copied to every GPU
- GeLU cannot run across servers
why: The all-reduce count does not change, but the latency per step grows about ten times on Ethernet.
:::

## Go further

The Megatron-LM paper introduces the column and row split in this lesson. The Google paper on efficiently scaling transformer inference extends the arithmetic to very large models. The Megatron-LM repository contains the reference implementation. The NCCL repository is the library that performs the all-reduce on NVIDIA GPUs. The PyTorch distributed documentation explains the collective operations. The vLLM documentation shows the tensor-parallel settings.
`,
          },
          {
            slug: 'pipeline-parallelism',
            title: 'Pipeline parallelism',
            summary: 'Pipeline parallelism assigns consecutive layers to different GPUs and keeps them busy with micro-batches.',
            minutes: 15,
            objectives: [
              'Explain how a model is split into pipeline stages.',
              'Compute the pipeline bubble fraction for a given number of stages and micro-batches.',
              'Compare the GPipe and one-forward-one-backward schedules.',
              'Choose when to combine pipeline parallelism with tensor parallelism for serving.',
            ],
            keyTerms: ['pipeline-parallelism', 'pipeline stage', 'micro-batch', 'pipeline bubble', 'tensor-parallelism', 'activation'],
            links: [
              { label: 'GPipe paper', url: 'https://arxiv.org/abs/1811.06965', kind: 'paper' },
              { label: 'PipeDream paper', url: 'https://arxiv.org/abs/1806.03377', kind: 'paper' },
              { label: 'Megatron-LM: efficient large-scale training', url: 'https://arxiv.org/abs/2104.04473', kind: 'paper' },
              { label: 'DeepSpeed repository', url: 'https://github.com/microsoft/DeepSpeed', kind: 'repo' },
              { label: 'PyTorch tutorials', url: 'https://pytorch.org/tutorials/', kind: 'docs' },
            ],
            body: `
## What this lesson covers

This lesson explains pipeline parallelism (PP). It shows how to split a model into stages, why idle time appears, and how micro-batches reduce it. It computes the bubble fraction for two configurations and ends with the serving layout that combines PP with tensor parallelism.

## Why it matters

Tensor parallelism needs the fast links inside one server. When a model does not fit in one server, you must split it across servers. Pipeline parallelism sends only the activations between graphics processing units (GPUs). Activations are small compared with weights, so the slow links between servers are enough. Serving engines use it to spread very large models across nodes.

## The idea with an example

Take an 80-layer model and 4 GPUs. Assign the layers in consecutive groups.

| Stage | GPU | Layers |
|---|---|---|
| 1 | GPU 0 | 1 to 20 |
| 2 | GPU 1 | 21 to 40 |
| 3 | GPU 2 | 41 to 60 |
| 4 | GPU 3 | 61 to 80 |

A batch enters stage 1. Stage 1 runs its 20 layers and sends the activation tensor to stage 2. For 32 tokens and a hidden size of 8,192 in FP16 (16-bit floating point), the tensor is $32 \\times 8192 \\times 2 = 524$ KB. The weights of a stage are 35 GB, so the link carries almost nothing by comparison.

The problem is idle time. While stage 2 works, stages 1, 3, and 4 wait. With one batch, only one GPU is busy at any moment. The fix is to cut the batch into $M$ micro-batches. Stage 1 finishes micro-batch 1, sends it on, and starts micro-batch 2 at once. After a short ramp-up, all stages work at the same time. The ramp-up and the ramp-down at the end are the pipeline bubble.

The timeline shows 4 stages and 4 micro-batches over 7 steps, with the bubble as empty space on each lane.

:::timeline
title: Forward pass with 4 stages and 4 micro-batches
unit: steps
lane Stage 1
lane Stage 2
lane Stage 3
lane Stage 4
Stage 1: mb 1 @0-1
Stage 1: mb 2 @1-2
Stage 2: mb 1 @1-2
Stage 1: mb 3 @2-3
Stage 2: mb 2 @2-3
Stage 3: mb 1 @2-3
Stage 1: mb 4 @3-4
Stage 2: mb 3 @3-4
Stage 3: mb 2 @3-4
Stage 4: mb 1 @3-4
Stage 2: mb 4 @4-5
Stage 3: mb 3 @4-5
Stage 4: mb 2 @4-5
Stage 3: mb 4 @5-6
Stage 4: mb 3 @5-6
Stage 4: mb 4 @6-7
:::

## How it works

With $S$ stages and $M$ micro-batches, each stage spends $M$ time units on useful work. The ramp-up and ramp-down add $S - 1$ idle units. The bubble fraction is:

$$\\text{bubble} = \\frac{S - 1}{M + S - 1}$$

$S$ is the number of stages, and $M$ is the number of micro-batches in one batch. Work through two cases with $S = 4$.

1. $M = 8$: bubble $= 3 / (8 + 3) = 3 / 11 = 27$ percent of the time is idle.
2. $M = 32$: bubble $= 3 / (32 + 3) = 3 / 35 = 8.6$ percent of the time is idle.

Press Next to follow one batch of 8 micro-batches through the 4 stages.

:::scenario
title: Bubble for 4 stages and 8 micro-batches
state: step=0, busy stages=0, idle units per stage=0, bubble=none
step: Micro-batch 1 enters stage 1. Stages 2, 3 and 4 wait.
state: step=1, busy stages=1
step: Micro-batch 1 moves to stage 2 and micro-batch 2 enters stage 1.
state: step=2, busy stages=2
step: After two more steps all four stages are busy. Stage 4 waited 3 steps during the ramp-up.
state: step=4, busy stages=4, idle units per stage=3
step: The pipeline stays full until micro-batch 8 leaves stage 1 at step 8.
state: step=8
step: The last three steps drain the pipeline. Stage 1, then stage 2, then stage 3 go idle. Stage 1 waits 3 steps at the end.
state: step=11, busy stages=0
step: Each stage worked 8 units out of 11. The bubble is 3 / 11 = 27 percent.
state: bubble=27 percent
:::

The bars compare the bubble fraction for three micro-batch counts.

:::bars
title: Bubble fraction with 4 stages
unit: percent
4 micro-batches: 43
8 micro-batches: 27
32 micro-batches: 8.6
:::

More micro-batches shrink the bubble. But each micro-batch must be large enough to keep a GPU efficient, so $M$ has a practical limit.

Two schedules are common. GPipe runs all $M$ forward passes, then all $M$ backward passes. It is simple, but it stores the activations of all $M$ micro-batches until the backward passes start. The one-forward-one-backward (1F1B) schedule from PipeDream starts the backward pass of micro-batch 1 as soon as it is ready. Each stage then holds the activations of at most $S$ micro-batches. The bubble fraction is the same, but the memory is much lower.

For serving there is no backward pass. The engine fills the pipeline with different requests instead of micro-batches of one batch. The common layout places tensor parallelism inside each node and pipeline parallelism across nodes. A model with 2 nodes of 8 GPUs runs with TP = 8 and PP = 2. The procedure to set it up is:

1. Divide the layers into $S$ groups with equal compute per group.
2. Give the first and last stage fewer layers if they also hold the embedding and output matrices.
3. Set the number of in-flight requests to at least $S$ so every stage stays busy.
4. Measure the time per stage and move layers until the stages balance.

Note: the latency of one request is the sum of the stage times plus the transfer times. Pipeline parallelism raises throughput but does not cut the latency of a single request.


This script computes the bubble fraction and prints the schedule for 4 stages and 4 micro-batches.

:::code
lang: python
file: pipeline.py
def bubble(stages, micro_batches):
    return (stages - 1) / (micro_batches + stages - 1)

for m in (4, 8, 32):
    print("4 stages,", m, "micro-batches:", round(bubble(4, m) * 100, 1), "% idle")

def schedule(stages, micro_batches):
    for step in range(stages + micro_batches - 1):
        row = []
        for s in range(stages):
            mb = step - s + 1
            row.append("mb" + str(mb) if 1 <= mb <= micro_batches else "---")
        print("step", step + 1, " ".join(row))

schedule(4, 4)
:::

:::code
lang: text
4 stages, 4 micro-batches: 42.9 % idle
4 stages, 8 micro-batches: 27.3 % idle
4 stages, 32 micro-batches: 8.6 % idle
step 1 mb1 --- --- ---
step 2 mb2 mb1 --- ---
step 3 mb3 mb2 mb1 ---
step 4 mb4 mb3 mb2 mb1
step 5 --- mb4 mb3 mb2
step 6 --- --- mb4 mb3
step 7 --- --- --- mb4
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Find the micro-batch count for a target bubble
task: Use the bubble function to compute the idle fraction for 8 stages and 56 micro-batches. Then find the smallest number of micro-batches that brings the bubble below 5 percent for 4 stages, and again for 8 stages. Print the schedule for 2 stages and 3 micro-batches and count the idle cells.
hint: Loop over micro-batch counts from 1 upward and stop at the first value below 0.05.
lang: python
solution:
print(round(bubble(8, 56) * 100, 1), "%")            # 11.1 %
for stages in (4, 8):
    m = 1
    while bubble(stages, m) >= 0.05:
        m += 1
    print(stages, "stages need", m, "micro-batches")  # 58 and 134
schedule(2, 3)                                        # 4 steps, 2 idle cells
:::

## Common mistakes

- Mistake: you use one micro-batch and see a 75 percent idle rate on 4 stages. Fix: raise the number of micro-batches until the bubble is below 10 percent.
- Mistake: you split the layers into equal counts and ignore the embedding matrix. Fix: balance by measured stage time, not by layer count.
- Mistake: you use pipeline parallelism inside a node to lower latency. Fix: use tensor parallelism inside a node; pipeline parallelism adds latency.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: pipeline parallelism
q: What is the bubble fraction for 8 stages and 56 micro-batches?
- 7 percent
* 11 percent
- 14 percent
- 25 percent
why: (8 - 1) / (56 + 8 - 1) = 7 / 63 = 0.111.
q: What crosses the link between two pipeline stages?
- The weights of the next stage
* The activation tensor of one micro-batch
- The gradients of all micro-batches
- The KV cache of every sequence
why: Each stage holds its own weights; only the activations of a micro-batch travel to the next stage.
q: Why does 1F1B use less memory than GPipe?
- It uses fewer micro-batches
* It frees the activations of each micro-batch as soon as its backward pass is done
- It stores activations in FP8
- It skips the backward pass for the first stage
why: GPipe keeps all M micro-batch activations until the backward passes start; 1F1B holds at most S.
q: A 4-stage pipeline runs with one micro-batch. What fraction of the time is each GPU idle?
- 25 percent
- 50 percent
* 75 percent
- 0 percent
why: Only one stage works at any moment, so each of the 4 GPUs is busy a quarter of the time.
q: Which statement about latency and pipeline parallelism is correct?
- Pipeline parallelism cuts the latency of one request by the stage count
* Pipeline parallelism raises throughput but does not cut the latency of a single request
- Pipeline parallelism cuts latency only when combined with tensor parallelism
- Latency falls because each stage holds fewer layers
why: One request still passes through every layer in order, plus the transfers, so its latency does not fall.
:::

## Go further

The GPipe paper introduces micro-batches and the bubble analysis. The PipeDream paper introduces the 1F1B schedule. The Megatron-LM paper on efficient large-scale training combines pipeline, tensor, and data parallelism and reports the interleaved schedule. The DeepSpeed repository contains a pipeline engine you can run on a small cluster. The PyTorch tutorials include a pipeline parallelism walkthrough.
`,
          },
          {
            slug: 'data-parallel-and-zero',
            title: 'Data parallelism and ZeRO',
            summary: 'Data parallelism copies the model to every GPU, and ZeRO shards the copies to save memory.',
            minutes: 17,
            objectives: [
              'Compute the memory per weight for mixed-precision training with Adam.',
              'Explain what each ZeRO stage shards and what memory it saves.',
              'Compute the memory per GPU for a 7B model at each ZeRO stage on 8 GPUs.',
              'Describe what data parallelism means for a serving system.',
            ],
            keyTerms: ['data parallelism', 'zero', 'adam', 'optimizer state', 'all-gather', 'FSDP'],
            links: [
              { label: 'ZeRO paper', url: 'https://arxiv.org/abs/1910.02054', kind: 'paper' },
              { label: 'ZeRO-Offload paper', url: 'https://arxiv.org/abs/2101.06840', kind: 'paper' },
              { label: 'ZeRO-Infinity paper', url: 'https://arxiv.org/abs/2104.07857', kind: 'paper' },
              { label: 'PyTorch FSDP docs', url: 'https://pytorch.org/docs/stable/fsdp.html', kind: 'docs' },
              { label: 'DeepSpeed repository', url: 'https://github.com/microsoft/DeepSpeed', kind: 'repo' },
              { label: 'Hugging Face Accelerate docs', url: 'https://huggingface.co/docs/accelerate', kind: 'docs' },
            ],
            body: `
## What this lesson covers

This lesson explains data parallelism (DP), the simplest way to use many graphics processing units (GPUs). It counts the bytes per weight that training needs. It then shows how the three ZeRO stages shard that memory across GPUs, with numbers for a 7B model on 8 GPUs.

## Why it matters

Data parallelism gives every GPU a full copy of the model. Each copy processes different data, and the GPUs average their gradients. But a full copy of the training state is large. A 7B model needs 112 GB per copy with a standard optimizer, which does not fit in an 80 GB GPU. ZeRO (Zero Redundancy Optimizer) removes the duplication and makes data parallelism work at that size.

:::video
id: PziYflu8cB8
why: Watch all 100 seconds. Serving with data parallelism means replicas behind a load balancer, and Kubernetes is the tool that starts, counts and replaces those replicas.
:::

## The idea with an example

Mixed-precision training with the Adam optimizer keeps five tensors per weight.

| Tensor | Precision | Bytes per weight |
|---|---|---|
| Weight copy used in the forward pass | FP16 | 2 |
| Gradient | FP16 | 2 |
| Master weight | FP32 | 4 |
| Adam first moment $m$ | FP32 | 4 |
| Adam second moment $v$ | FP32 | 4 |
| Total | | 16 |

FP16 is 16-bit floating point, and FP32 is 32-bit floating point. The master weight and the two Adam moments are the optimizer state, 12 bytes per weight. A 7B model therefore needs $7 \\times 10^9 \\times 16 = 112$ GB per data-parallel copy. With plain data parallelism on 8 GPUs, all 8 GPUs hold the same 112 GB.

ZeRO shards the state across the $N$ data-parallel GPUs in three stages. Work through $N = 8$ for the 7B model.

1. Stage 1 shards the optimizer state. Each GPU keeps the full FP16 weights and gradients, 4 bytes per weight, plus $12 / 8 = 1.5$ bytes of optimizer state. Memory $= 7 \\times (4 + 1.5) = 38.5$ GB.
2. Stage 2 also shards the gradients. Each GPU keeps 2 bytes of weights, $2 / 8 = 0.25$ bytes of gradients, and 1.5 bytes of optimizer state. Memory $= 7 \\times (2 + 0.25 + 1.5) = 26.25$ GB.
3. Stage 3 also shards the weights. Each GPU keeps $16 / 8 = 2$ bytes per weight. Memory $= 112 / 8 = 14$ GB.

Press Next to shard the training state one stage at a time.

:::scenario
title: Shard the 16 bytes per weight across 8 GPUs
state: weights=2 B, gradients=2 B, optimizer state=12 B, per GPU=16 B, 7B model=112 GB, communication=1 x plain
step: Plain data parallelism keeps all 16 bytes per weight on every GPU.
step: Stage 1 shards the optimizer state. Each GPU keeps 12 / 8 = 1.5 bytes of it.
state: optimizer state=1.5 B, per GPU=5.5 B, 7B model=38.5 GB
step: Stage 2 also shards the gradients. Each GPU keeps 2 / 8 = 0.25 bytes.
state: gradients=0.25 B, per GPU=3.75 B, 7B model=26.25 GB
step: Stage 3 also shards the weights. Each GPU keeps 2 / 8 = 0.25 bytes.
state: weights=0.25 B, per GPU=2 B, 7B model=14 GB
step: Before a layer runs, the GPUs all-gather its weights, use them, and drop them. The communication rises to about 1.5 times plain data parallelism.
state: communication=1.5 x plain
:::

| Configuration | Bytes per weight per GPU | 7B model, 8 GPUs |
|---|---|---|
| Plain data parallelism | 16 | 112 GB |
| ZeRO stage 1 | $4 + 12/N$ | 38.5 GB |
| ZeRO stage 2 | $2 + 14/N$ | 26.25 GB |
| ZeRO stage 3 | $16/N$ | 14 GB |

The bars compare the memory per GPU for the 7B model on 8 GPUs.

:::bars
title: Memory per GPU for a 7B model on 8 GPUs
unit: GB
Plain data parallelism: 112
ZeRO stage 1: 38.5
ZeRO stage 2: 26.25
ZeRO stage 3: 14
:::

## How it works

In the table, $N$ is the number of data-parallel GPUs. Each stage adds communication. Stages 1 and 2 cost the same as plain data parallelism. Each step does one reduce-scatter of the gradients and one all-gather of the updated weights. Stage 3 adds more. Before each layer runs, the GPUs all-gather the weights of that layer, use them, and then drop them. This happens in the forward pass and again in the backward pass. The total traffic is about 1.5 times that of plain data parallelism.

The diagram shows one layer of a stage 3 training step on one GPU.

:::flow
title: ZeRO stage 3 for one layer on one GPU
Weight shards -> All-gather: 1/8 of the layer from each GPU
All-gather -> Forward pass: full layer weights
Forward pass -> Drop weights: keep only the activations
Drop weights -> Backward pass: all-gather the weights again
Backward pass -> Reduce-scatter: gradients
Reduce-scatter -> Optimizer shard: 1/8 of the gradients
:::

PyTorch implements the same idea as Fully Sharded Data Parallel (FSDP). FSDP shards the weights, gradients, and optimizer state of each layer and gathers them on demand. DeepSpeed implements the three stages and adds offload to central processor (CPU) memory and disk.

For serving, data parallelism means independent replicas. Each replica is a full engine with its own weights and key-value (KV) cache. A load balancer in front sends each request to one replica. The procedure to scale serving is:

1. Tune one replica until its throughput stops rising with batch size.
2. Measure its throughput at the target latency.
3. Divide the required load by that throughput to get the replica count.


This script computes the bytes per weight and the memory per GPU for each ZeRO stage.

:::code
lang: python
file: zero.py
def bytes_per_weight(stage, n_gpus):
    weights, grads, optim = 2.0, 2.0, 12.0
    if stage >= 1:
        optim = optim / n_gpus
    if stage >= 2:
        grads = grads / n_gpus
    if stage >= 3:
        weights = weights / n_gpus
    return weights + grads + optim

params = 7e9
for stage in (0, 1, 2, 3):
    b = bytes_per_weight(stage, 8)
    name = "plain DP" if stage == 0 else "ZeRO stage " + str(stage)
    print(name + ":", round(b, 2), "bytes per weight,", round(params * b / 1e9, 2), "GB per GPU")
:::

:::code
lang: text
plain DP: 16.0 bytes per weight, 112.0 GB per GPU
ZeRO stage 1: 5.5 bytes per weight, 38.5 GB per GPU
ZeRO stage 2: 3.75 bytes per weight, 26.25 GB per GPU
ZeRO stage 3: 2.0 bytes per weight, 14.0 GB per GPU
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Find the GPU count for a 70B training run
task: Use bytes_per_weight to compute the memory per GPU for a 70B model at ZeRO stage 3 on 16, 32 and 64 GPUs. Then find the smallest GPU count at which stage 3 fits under 60 GB per GPU, which leaves room for activations on an 80 GB GPU.
hint: At stage 3 the bytes per weight are 16 divided by the GPU count. The model has 70 billion weights.
lang: python
solution:
params = 70e9
for n in (16, 32, 64):
    print(n, "GPUs:", params * bytes_per_weight(3, n) / 1e9, "GB per GPU")
# 70, 35 and 17.5 GB
n = 1
while params * bytes_per_weight(3, n) / 1e9 > 60:
    n += 1
print("smallest GPU count under 60 GB:", n)   # 19
:::

## Common mistakes

- Mistake: you count only the 2 bytes of FP16 weights when you size training. Fix: count all 16 bytes, including the optimizer state.
- Mistake: you choose stage 3 on Ethernet and wonder why the step time doubled. Fix: use stage 2 inside a node, or add faster links.
- Mistake: you keep a sharded checkpoint and try to load it on a different GPU count. Fix: save a consolidated checkpoint, or use a loader that reshards.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: data parallelism and ZeRO
q: How many bytes per weight does ZeRO stage 3 need on 16 GPUs?
- 0.5 bytes
* 1 byte
- 2 bytes
- 4 bytes
why: Stage 3 shards all 16 bytes across the GPUs, so 16 / 16 = 1 byte per weight.
q: Which tensor does stage 2 shard that stage 1 does not?
- The FP16 weights
* The gradients
- The Adam moments
- The activations
why: Stage 1 shards the optimizer state only; stage 2 adds the gradients; stage 3 adds the weights.
q: Why does stage 3 cost more communication than stages 1 and 2?
- It sends the optimizer state to every GPU each step
* It all-gathers the weights of every layer in both the forward and the backward pass
- It uses FP32 for the all-reduce
- It runs an extra reduce-scatter per micro-batch
why: Each GPU holds only a shard of each layer, so it must gather the full layer before it can use it, twice per step.
q: A 7B model trains with mixed precision and Adam on plain data parallelism. How much memory does each GPU need for the training state?
- 14 GB
- 28 GB
- 56 GB
* 112 GB
why: Each weight needs 16 bytes: 2 for the FP16 copy, 2 for the gradient and 12 for the optimizer state.
q: For a serving system, what does data parallelism mean?
- Each GPU holds a shard of the KV cache
* Independent replicas of the whole engine behind a load balancer
- Each GPU holds a slice of every weight matrix
- Consecutive layers on different GPUs
why: A serving replica is a full engine, and a load balancer sends each request to one of them.
:::

## Go further

The ZeRO paper is the source of the three stages and the memory table. ZeRO-Offload and ZeRO-Infinity extend the idea to CPU memory and disk. The PyTorch FSDP documentation explains the same sharding in native PyTorch. The DeepSpeed repository contains configuration examples for each stage. The Hugging Face Accelerate documentation shows how to launch a training script with either FSDP or DeepSpeed.
`,
          },
          {
            slug: 'combining-parallelism',
            title: 'Combining tensor, pipeline, and data parallelism',
            summary: 'A recipe for choosing the parallel layout that fits a model and meets the throughput target.',
            minutes: 16,
            objectives: [
              'Choose a tensor and pipeline layout that fits a model on a given cluster.',
              'Compute the memory per GPU and the memory left for the KV cache for a layout.',
              'Compare three layouts for a 405B-class model by memory, communication, and latency.',
              'Explain expert parallelism for mixture-of-experts models.',
            ],
            keyTerms: ['tensor-parallelism', 'pipeline-parallelism', 'data parallelism', 'mixture-of-experts', 'kv-cache', 'quantisation'],
            links: [
              { label: 'Megatron-LM: efficient large-scale training', url: 'https://arxiv.org/abs/2104.04473', kind: 'paper' },
              { label: 'Efficiently scaling transformer inference', url: 'https://arxiv.org/abs/2211.05102', kind: 'paper' },
              { label: 'Alpa paper', url: 'https://arxiv.org/abs/2201.12023', kind: 'paper' },
              { label: 'Mixtral paper', url: 'https://arxiv.org/abs/2401.04088', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'SGLang repository', url: 'https://github.com/sgl-project/sglang', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson combines the three techniques from the previous lessons into one recipe. You will size a 405B-class model on servers with eight 80 GB graphics processing units (GPUs). You will compare three layouts by memory, communication type, and latency.

## Why it matters

Tensor parallelism (TP) fits a model inside a node with low latency. Pipeline parallelism (PP) spans nodes when one node is not enough. Data parallelism (DP) adds throughput with independent replicas. Real deployments use all three at once. The wrong combination either does not fit, or wastes most of the cluster on communication.

## The idea with an example

A 405B model in FP16 (16-bit floating point) has $405 \\times 10^9 \\times 2 = 810$ GB of weights. One node has $8 \\times 80 = 640$ GB. Follow the recipe.

1. Try TP = 8 on one node. Weights per GPU $= 810 / 8 = 101$ GB. That exceeds 80 GB, so it does not fit.
2. Add PP = 2 across two nodes. Total memory $= 1280$ GB. Weights per GPU $= 810 / 16 = 51$ GB. The remaining $1280 - 810 = 470$ GB holds the key-value (KV) cache and activations.
3. Alternative: quantise the weights to FP8 (8-bit floating point). Weights $= 405$ GB. With TP = 8 on one node, each GPU holds 51 GB and $640 - 405 = 235$ GB remains.

Press Next to try each layout for the 405B model.

:::scenario
title: Fit a 405B model on nodes of eight 80 GB GPUs
state: weights=810 GB in FP16, layout=none, per GPU=none, fits=none, free for cache=none
step: Try TP = 8 on one node. Divide 810 GB by 8.
state: layout=FP16 TP 8, per GPU=101 GB, fits=no
step: 101 GB exceeds 80 GB. Add PP = 2 across two nodes and divide by 16 GPUs.
state: layout=FP16 TP 8 PP 2, per GPU=51 GB, fits=yes, free for cache=470 GB
step: Alternative: quantise to FP8. The weights drop to 405 GB.
state: weights=405 GB in FP8
step: Try TP = 8 on one node again. Divide 405 GB by 8.
state: layout=FP8 TP 8 PP 1, per GPU=51 GB, fits=yes, free for cache=235 GB
step: Add PP = 2 to the FP8 layout for the largest cache pool.
state: layout=FP8 TP 8 PP 2, per GPU=25 GB, free for cache=875 GB
step: Pick by goal. FP8 TP 8 on one node gives the lowest latency. FP8 TP 8 PP 2 gives the highest throughput. FP16 avoids quantisation loss.
state: choice=depends on the goal
:::

| Layout | Nodes | Weights per GPU | Free for cache | Communication | Latency note |
|---|---|---|---|---|---|
| FP16, TP 8, PP 2 | 2 | 51 GB | 470 GB | NVLink all-reduce plus one cross-node hop | sum of two stage times |
| FP8, TP 8, PP 1 | 1 | 51 GB | 235 GB | NVLink all-reduce only | lowest per token |
| FP8, TP 8, PP 2 | 2 | 25 GB | 875 GB | NVLink all-reduce plus one hop | highest throughput |

The bars compare the memory left for the cache in each layout.

:::bars
title: Memory free for the KV cache and activations
unit: GB
FP16, TP 8, PP 2: 470
FP8, TP 8, PP 1: 235
FP8, TP 8, PP 2: 875
:::

The second layout gives the lowest latency because no request crosses a node. The third gives the highest throughput because the large cache pool holds the most concurrent sequences. The first is the choice when you cannot accept any quantisation loss.

## How it works

The general recipe has four steps.

1. Fit the model. Choose the precision, then raise TP inside a node until the weights fit with at least a third of the memory left. Cap TP at the GPU count in a node and at the number of KV heads.
2. Span nodes only if step 1 fails. Add PP stages across nodes.
3. Add replicas. Each TP times PP group is one replica. Divide the required throughput by the throughput of one replica to get the DP count.
4. Check the links. Compute the bytes per step on each link and divide by the link bandwidth. If that time is a large fraction of the step time, reduce the degree on that link.

The diagram shows two replicas, each with TP = 8 over NVLink inside a node and PP = 2 across two nodes.

:::flow
title: Two replicas of TP 8 x PP 2 behind one load balancer
Load balancer -> Replica 1 node 1: request
Replica 1 node 1 -> Replica 1 node 2: activations after layers 1 to 63
Replica 1 node 2 -> Load balancer: tokens
Load balancer -> Replica 2 node 1: next request
Replica 2 node 1 -> Replica 2 node 2: activations after layers 1 to 63
Replica 2 node 2 -> Load balancer: tokens
:::

Take a TP group with $L$ layers, $N$ tokens per step, hidden size $d$, and $b$ bytes per element. The all-reduce traffic per step is about:

$$\\text{bytes per step} = 2 \\times L \\times 2 \\times N \\times d \\times b$$

The first 2 counts the two all-reduce steps per layer, and the second 2 counts the two phases of each all-reduce. With $L = 126$, $N = 64$, $d = 16384$, and $b = 2$ this is 1.06 GB per step. That takes about 1.2 ms at 900 GB/s. Over Ethernet at 50 GB/s it is 21 ms, which is why TP stays on NVLink.

The bars compare the time for 1.06 GB of all-reduce traffic on each link.

:::bars
title: All-reduce time per step for 1.06 GB
unit: ms
NVLink, 900 GB/s: 1.2
Ethernet, 50 GB/s: 21
:::

Mixture-of-experts (MoE) models add expert parallelism (EP). An MoE layer has many expert MLPs, and each token visits only a few of them. Expert parallelism places different experts on different GPUs and routes each token to the GPU that holds its expert with an all-to-all exchange.


This script searches for the smallest layout that fits a model with a third of each GPU free.

:::code
lang: python
file: layout.py
def layout(params_b, bytes_per_weight, gpu_gb=80, min_free=1 / 3):
    weights = params_b * bytes_per_weight
    for pp in (1, 2, 4):
        for tp in (1, 2, 4, 8):
            per_gpu = weights / (tp * pp)
            if per_gpu <= gpu_gb * (1 - min_free):
                free = tp * pp * gpu_gb - weights
                return {"tp": tp, "pp": pp, "per_gpu_gb": round(per_gpu, 1), "free_gb": round(free, 1)}
    return None

print("405B FP16:", layout(405, 2))
print("405B FP8: ", layout(405, 1))
print("70B FP16: ", layout(70, 2))

L_, N, d, b = 126, 64, 16384, 2
traffic_gb = 2 * L_ * 2 * N * d * b / 1e9
print("all-reduce traffic per step:", round(traffic_gb, 2), "GB")
print("NVLink:", round(traffic_gb / 900 * 1000, 1), "ms  Ethernet:", round(traffic_gb / 50 * 1000, 1), "ms")
:::

:::code
lang: text
405B FP16: {'tp': 8, 'pp': 2, 'per_gpu_gb': 50.6, 'free_gb': 470}
405B FP8:  {'tp': 8, 'pp': 1, 'per_gpu_gb': 50.6, 'free_gb': 235}
70B FP16:  {'tp': 4, 'pp': 1, 'per_gpu_gb': 35.0, 'free_gb': 180}
all-reduce traffic per step: 1.06 GB
NVLink: 1.2 ms  Ethernet: 21.1 ms
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Lay out a 70B model three ways
task: Use the layout function for a 70B model in FP8 (1 byte per weight) and in INT4 (0.5 bytes per weight) on 80 GB GPUs. Then run the FP16 case again on 40 GB GPUs. For each result print the TP and PP degrees and the memory free for the cache. Decide which result crosses a node boundary.
hint: Call layout with gpu_gb=40 for the third case. A layout with pp above 1 crosses nodes.
lang: python
solution:
print(layout(70, 1))            # tp 2, pp 1, 35 GB per GPU, 90 GB free
print(layout(70, 0.5))          # tp 1, pp 1, 35 GB per GPU, 45 GB free
print(layout(70, 2, gpu_gb=40)) # tp 8, pp 1, 17.5 GB per GPU, 180 GB free
# None of the three needs PP, so none crosses a node.
:::

## Common mistakes

- Mistake: you raise TP across nodes because PP looks harder to configure. Fix: cross-node TP multiplies the per-layer latency; use PP across nodes.
- Mistake: you fit the weights exactly and leave 5 GB for the cache. Fix: leave at least a third of the memory for the cache and activations.
- Mistake: you apply tensor parallelism to an MoE layer and copy every expert to every GPU. Fix: use expert parallelism so each GPU holds a subset of experts.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: combining parallelism
q: A 70B FP16 model runs on 80 GB GPUs. What is the smallest TP degree that leaves a third of each GPU free?
- TP = 2
* TP = 4
- TP = 8
- TP = 16
why: TP = 4 puts 35 GB of weights on each GPU and leaves 45 GB, while TP = 2 leaves only 10 GB.
q: Which layout gives the lowest latency for the 405B example?
- FP16 with TP = 8 and PP = 2
* FP8 with TP = 8 on one node
- FP8 with TP = 8 and PP = 2
- FP16 with TP = 16 across two nodes
why: No request crosses a node, and all communication is NVLink all-reduce.
q: What communication pattern does expert parallelism use?
- An all-reduce after every expert
- A ring all-gather of the expert weights
* An all-to-all exchange of tokens between GPUs
- A broadcast of the router weights
why: Each token travels to the GPU that holds its expert and the result travels back.
q: A TP group has 126 layers, 64 tokens per step, hidden size 16,384 and FP16 elements. About how much all-reduce traffic moves per step?
- 0.26 GB
- 0.53 GB
* 1.06 GB
- 4.2 GB
why: 2 all-reduce steps per layer times 2 phases times 126 times 64 times 16,384 times 2 bytes is about 1.06 GB.
q: A team runs TP = 16 across two nodes over Ethernet because PP looked harder to configure. What is the cost?
- The weights no longer fit
* Every layer pays Ethernet latency twice, so the per-token latency rises about ten times
- The KV cache doubles
- Expert parallelism stops working
why: Tensor parallelism communicates inside every layer, so a slow link multiplies the step time.
:::

## Go further

The Megatron-LM paper on efficient large-scale training is the standard reference for combining the three techniques and for the throughput arithmetic. The Google paper on efficiently scaling transformer inference analyses the same trade-offs for serving. The Alpa paper automates the layout search. The Mixtral paper describes a production MoE model. The vLLM documentation and the SGLang repository show how to set TP, PP, DP, and EP for serving.
`,
          },
        ],
      },
      {
        slug: 'serving-stack',
        title: 'The serving stack',
        description: 'The layers of an inference engine, from the HTTP server to the sampler, and how the scheduler fills each step.',
        level: 'advanced',
        lessons: [
          {
            slug: 'engine-architecture-and-scheduler',
            title: 'Engine architecture and the scheduler',
            summary: 'An inference engine is a short chain of layers, and the scheduler decides what runs in each step.',
            minutes: 16,
            objectives: [
              'Name the layers of an inference engine in order',
              'Trace one request from the HTTP server to the detokenizer',
              'Build one scheduler step by hand with a fixed token budget',
              'Explain the difference between preemption by recompute and preemption by swap',
            ],
            keyTerms: ['continuous-batching', 'kv-cache', 'paged-attention', 'scheduler', 'token budget', 'preemption'],
            links: [
              { label: 'vLLM paper: efficient memory management with PagedAttention', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
              { label: 'SGLang paper: RadixAttention and the frontend language', url: 'https://arxiv.org/abs/2312.07104', kind: 'paper' },
              { label: 'Sarathi-Serve: chunked prefill and stall-free scheduling', url: 'https://arxiv.org/abs/2403.02310', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'vLLM source repository', url: 'https://github.com/vllm-project/vllm', kind: 'repo' },
              { label: 'SGLang source repository', url: 'https://github.com/sgl-project/sglang', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson describes the layers of an inference engine such as vLLM or SGLang. It follows one request from the HTTP server to the last token. It then shows how the scheduler builds one batch per step from a fixed token budget.

## Why it matters

Every serving system makes the same decisions each step: which requests to admit, how many tokens to process, and which requests to pause. The scheduler makes these decisions. If you know the layers, you can read engine logs, tune the token budget, and explain why a request waits.

:::video
id: Gjnup-PuquQ
why: Watch all 100 seconds. The engines in this lesson ship as container images, and the commands below start one with Docker.
:::

## The idea with an example

An engine runs a loop. Each pass through the loop is one step. In each step the engine runs one forward pass of the model for one batch of tokens.

Consider three requests at the start of a step:

| Request | State | Tokens needed this step |
|---|---|---|
| A | New, prompt of 500 tokens | 500 (prefill) |
| B | Mid-decode, 40 tokens generated | 1 (decode) |
| C | Mid-decode, 12 tokens generated | 1 (decode) |

The bars compare the tokens that each request adds to the step.

:::bars
title: Tokens per request in this step
unit: tokens
A, prefill: 500
B, decode: 1
C, decode: 1
:::

The scheduler has a token budget of 2,048 tokens per step. The engine calls this limit max_num_batched_tokens. The scheduler counts: 500 + 1 + 1 = 502 tokens. The total is below 2,048, so all three requests fit in one batch.

The key-value (KV) cache stores the keys and values of every token already processed. The cache is split into blocks of 16 tokens. Request A needs 500 / 16 = 31.25, so 32 blocks. Requests B and C each need one more token, so each one may need one new block. The block manager checks that 34 free blocks exist. If they do, the scheduler admits A.

The model runner then executes one forward pass over 502 tokens. The sampler picks one new token for A, one for B, and one for C. The detokenizer turns each token into text. The scheduler appends the new tokens and moves A into the decode state. The next step starts.

Press Next to build the step by hand.

:::scenario
title: One scheduler step with a budget of 2,048 tokens
state: budget left=2048, free blocks=40, batch=empty, tokens produced=0
step: Free the blocks of sequences that finished in the last step. None finished, so 40 blocks stay free.
step: Add one decode token for request B. B may need one new block.
state: budget left=2047, free blocks=39, batch=B
step: Add one decode token for request C.
state: budget left=2046, free blocks=38, batch=B C
step: Request A waits with a 500-token prompt. It needs 32 blocks and 500 tokens of budget. Both are available, so admit A.
state: budget left=1546, free blocks=6, batch=B C A
step: Run one forward pass over 502 tokens. The sampler returns one token for each request.
state: tokens produced=3
step: Append the tokens. Move A to the decode state. Start the next step.
state: A=decode, B=decode, C=decode
:::

Note: a step with a long prefill makes every decode request in the same batch wait. Chunked prefill splits A into chunks of, for example, 512 tokens, so each step stays short.

## How it works

The layers, in the order a request passes through them, are:

    API server      accepts an HTTP request in the OpenAI format
    Tokenizer       turns the prompt text into token ids
    Scheduler       picks the requests and tokens for this step
    Block manager   allocates KV cache blocks for the picked tokens
    Model runner    runs one forward pass on the GPU
    Sampler         picks one token per sequence from the logits
    Detokenizer     turns new token ids back into text
    API server      streams the text back to the client

The diagram shows the path of one request through these layers.

:::flow
title: Path of one request through the engine
API server -> Tokenizer: prompt text
Tokenizer -> Scheduler: token ids
Scheduler -> Block manager: tokens picked for this step
Block manager -> Model runner: KV cache blocks
Model runner -> Sampler: logits
Sampler -> Detokenizer: one token id per sequence
Detokenizer -> API server: text to stream
:::

The model runner uses CUDA graphs for decode steps. A CUDA graph records a fixed sequence of GPU kernels once and replays it. The replay removes the launch cost of the many small kernels in a decode step.

The scheduler loop runs this procedure each step:

1. Free the blocks of every sequence that finished in the last step.
2. Admit waiting requests while free blocks and token budget remain.
3. Add one token for each running decode sequence.
4. Add prefill chunks until the token budget is full.
5. Run the forward pass and the sampler.
6. Append each new token to its sequence.

When free blocks run out, the scheduler preempts a running sequence. There are two methods. Preemption by recompute drops the blocks of the sequence and later runs prefill again. Preemption by swap copies the blocks to CPU memory and later copies them back. Recompute costs GPU time. Swap costs PCIe bandwidth. vLLM uses recompute by default.

SGLang adds RadixAttention, which stores the KV cache in a radix tree so that many requests share a prefix. SGLang also offers a frontend language for programs with many model calls, such as branching and parallel generation.


These commands start a vLLM engine with the scheduler limits from this lesson and send one request. The first command needs a GPU with the NVIDIA container toolkit.

:::code
lang: bash
docker run --gpus all -p 8000:8000 vllm/vllm-openai:latest \\
  --model Qwen/Qwen2.5-0.5B-Instruct \\
  --max-num-seqs 64 --max-num-batched-tokens 2048 \\
  --enable-chunked-prefill --gpu-memory-utilization 0.9

curl http://localhost:8000/v1/completions -H "Content-Type: application/json" \\
  -d '{"model": "Qwen/Qwen2.5-0.5B-Instruct", "prompt": "The KV cache", "max_tokens": 16}'

curl http://localhost:8000/metrics | grep -E "num_requests_(running|waiting)|preemptions"
:::

The last command reads the engine metrics. The running and waiting counts show the scheduler state, and the preemption counter shows cache pressure.

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Build one scheduler step by hand
task: Write a function schedule_step(running, waiting, budget, free_blocks, block=16) that follows the scheduler loop. Each running sequence takes 1 token and may need 1 block. Admit waiting prompts in order while both the budget and the blocks allow. Return the list of admitted prompts and the budget left. Test it with two running sequences, waiting prompts of 500, 1,200 and 300 tokens, a budget of 2,048 tokens and 40 free blocks.
hint: A prompt of n tokens needs n of budget and ceil(n / 16) blocks. Decode tokens come first.
lang: python
solution:
import math

def schedule_step(running, waiting, budget, free_blocks, block=16):
    budget -= len(running)
    free_blocks -= len(running)
    admitted = []
    for prompt in waiting:
        need = math.ceil(prompt / block)
        if prompt <= budget and need <= free_blocks:
            admitted.append(prompt)
            budget -= prompt
            free_blocks -= need
    return admitted, budget, free_blocks

print(schedule_step(["B", "C"], [500, 1200, 300], 2048, 40))
# ([500], 1546, 6): the 1,200-token prompt needs 75 blocks and 300 needs 19, so both wait
:::

## Common mistakes

- Mistake: setting the token budget to the context length. Fix: set it to a few thousand tokens so decode requests do not wait for one long prefill.
- Mistake: reading the number of running requests as throughput. Fix: measure tokens per second at the sampler.
- Mistake: giving the engine 99 percent of GPU memory. Fix: leave room for activations, or the model runner fails on a large batch.
- Mistake: ignoring preemption counts in the logs. Fix: treat a rising preemption count as a sign that the cache is too small for the load.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: the engine and the scheduler
q: What does the scheduler check before it admits a new request?
- That the request has fewer tokens than the longest running sequence
* That enough free KV cache blocks and enough token budget remain for this step
- That the tokenizer has finished for all running requests
- That the client supports streaming
why: Both limits bound the step: the token budget caps the forward pass and the blocks cap the cache.
q: In the example, why does request A need 32 blocks?
- Because the token budget is 2,048 and 2048 / 64 = 32
* Because 500 tokens divided by a block size of 16 is 31.25, which rounds up to 32
- Because the engine reserves 32 blocks for every new request
- Because A will generate 32 tokens
why: The cache allocates whole blocks, so a partial block counts as one more block.
q: What does preemption by recompute cost?
- PCIe bandwidth to copy the blocks to CPU memory
* GPU time to run the prefill again for the preempted sequence
- Nothing; the blocks stay in place
- One extra all-reduce per layer
why: The engine drops the blocks and must rebuild the cache from the prompt later.
q: The scheduler has a budget of 2,048 tokens, 2 running decode sequences and a waiting prompt of 2,100 tokens. Chunked prefill is on with chunks of 512. What runs this step?
- Nothing; the prompt is larger than the budget
- The two decode tokens only
* The two decode tokens and one 512-token chunk of the prompt
- The two decode tokens and the full 2,100-token prompt
why: Chunked prefill adds one chunk per step, and 2 + 512 is within the budget.
q: Why does the model runner use CUDA graphs for decode steps?
- To store the KV cache on the CPU
* To replay a recorded sequence of kernels and remove the launch cost of many small kernels
- To compress the weights
- To skip the sampler
why: A decode step launches many tiny kernels, and the launch overhead can dominate without a recorded graph.
:::

## Go further

Read the vLLM paper for the design of the block manager and the scheduler. Read the SGLang paper for RadixAttention and the frontend language. The Sarathi-Serve paper explains chunked prefill and why it keeps decode steps short. The vLLM documentation lists the scheduler settings, and the two repositories contain the scheduler code.
`,
          },
          {
            slug: 'prefix-caching',
            title: 'Prefix caching',
            summary: 'Prefix caching reuses the key-value cache of a shared prompt prefix so each new request runs less prefill.',
            minutes: 14,
            objectives: [
              'Explain how an engine finds a cached prefix by block hashes',
              'Compute the prefill saving for a shared system prompt',
              'Estimate the cache hit rate for a day of traffic',
              'Order the parts of a prompt to keep the cache hit rate high',
            ],
            keyTerms: ['kv-cache', 'paged-attention', 'prefix caching', 'block hash', 'radix tree', 'eviction'],
            links: [
              { label: 'vLLM paper: PagedAttention and block sharing', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
              { label: 'SGLang paper: RadixAttention', url: 'https://arxiv.org/abs/2312.07104', kind: 'paper' },
              { label: 'Prompt Cache: modular attention reuse', url: 'https://arxiv.org/abs/2311.04934', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'SGLang documentation', url: 'https://docs.sglang.ai/', kind: 'docs' },
            ],
            body: `
## What this lesson covers

Many requests to a model start with the same tokens. This lesson explains how an engine keeps the key-value (KV) cache of a finished request. The next request with the same prefix reuses that cache. The lesson shows the saving with numbers and explains how to order a prompt to keep the cache useful.

## Why it matters

A system prompt, a set of few-shot examples, or the earlier turns of a chat can be thousands of tokens. Without prefix caching the engine runs prefill over all of them for every request. This costs GPU time and raises the time to first token. With prefix caching the engine runs prefill only on the new part of the prompt.

:::video
id: G1rOthIU-uo
why: Watch all 100 seconds. Note the key lookup and the eviction of old entries. The prefix cache uses the same two ideas with block hashes as keys.
:::

## The idea with an example

A product has a system prompt of 1,200 tokens. Every user message adds about 200 tokens. The KV cache uses blocks of 16 tokens.

The system prompt fills 1,200 / 16 = 75 full blocks. The first request computes all of them. When the request finishes, the engine keeps the 75 blocks in a cache table. The key of each block is a hash. The hash covers the token ids in the block and the hash of the previous block. The chain of hashes means that a block matches only when every earlier block also matches.

The second request arrives. The engine hashes its first 75 blocks and finds every one in the table. It links the new request to those blocks and does not compute them. The user part of 200 tokens needs 200 / 16 = 12.5, so 13 blocks. The engine runs prefill on 200 tokens instead of 1,400 tokens.

Press Next to follow the second request through the cache table.

:::scenario
title: Second request with a 1,200-token system prompt
state: blocks matched=0, blocks to compute=88, prefill tokens=1400, prefill time=about 70 ms
step: The engine splits the 1,400-token prompt into blocks of 16. The first 75 blocks hold the system prompt.
step: It hashes block 1 from its tokens. The hash is in the table.
state: blocks matched=1, blocks to compute=87
step: It hashes block 2 from its tokens and the hash of block 1. The hash is in the table. It continues down the chain.
state: blocks matched=2, blocks to compute=86
step: All 75 system prompt blocks match. The engine links the request to them and raises their reference counts.
state: blocks matched=75, blocks to compute=13, prefill tokens=200
step: Block 76 holds user tokens. Its hash is not in the table. The chain stops.
step: The engine runs prefill on the 200 user tokens only. The prefill time drops from about 70 ms to about 12 ms.
state: prefill time=about 12 ms
:::

| Quantity | Without caching | With caching |
|---|---|---|
| Prefill tokens per request | 1,400 | 200 |
| Prefill time (illustrative) | 70 ms | 12 ms |
| KV blocks computed | 88 | 13 |

The bars compare the prefill tokens per request.

:::bars
title: Prefill tokens per request
unit: tokens
Without caching: 1400
With caching: 200
:::

The prefill time drops by about 6 times. The number 70 ms is illustrative; the real time depends on the model and the GPU.

Now scale this to a day. Assume 100,000 requests per day with the same system prompt, and assume the cache keeps the prefix all day. The hit rate is 99,999 / 100,000, so the daily saving is about 120 million prefill tokens.

## How it works

The engine does this when a new request arrives:

1. Split the prompt tokens into blocks of the block size.
2. Compute the hash of each full block from its tokens and the previous hash.
3. Look up each hash in the cache table, from the first block on.
4. Stop at the first block not found.
5. Link the request to the found blocks and raise their reference count.
6. Run prefill on the remaining tokens only.

The diagram shows the lookup path for one new request.

:::flow
title: Prefix lookup for a new request
Prompt tokens -> Block hasher: blocks of 16 tokens
Block hasher -> Cache table: hash of the tokens plus the previous hash
Cache table -> Block hasher: hit, try the next block
Cache table -> Prefill: first miss, remaining tokens
Prefill -> KV cache: new blocks
KV cache -> Cache table: hashes of the new blocks
:::

The saving in prefill tokens for a request is $s = n_{shared} - (n_{shared} \\bmod b)$. Here $n_{shared}$ is the number of shared prefix tokens and $b$ is the block size. The modulo removes the last partial block, because the engine still computes that block.

When memory is full, the engine evicts cached blocks. Most engines evict the least recently used blocks first. A block with a reference count above zero is in use and cannot be evicted.

SGLang stores the cache as a radix tree. A radix tree is a tree in which each edge holds a run of tokens. Two prompts that share a prefix share a path from the root. The match is a walk down the tree. This structure handles many different shared prefixes at once, for example one prefix per customer.

Caution: a change at the start of the prompt changes the first hash, and the chain breaks for every later block. A timestamp or a user name at the top of the system prompt disables the cache for the whole prefix.


This script builds the chained block hashes for two requests that share the system prompt and counts the matched blocks.

:::code
lang: python
file: prefix.py
import hashlib

BLOCK = 16

def block_hashes(tokens):
    hashes, prev = [], ""
    full = len(tokens) - len(tokens) % BLOCK
    for i in range(0, full, BLOCK):
        chunk = tokens[i:i + BLOCK]
        prev = hashlib.sha256((prev + str(chunk)).encode()).hexdigest()[:12]
        hashes.append(prev)
    return hashes

system = list(range(1200))                  # 1,200 system prompt tokens
first = system + list(range(5000, 5200))    # plus a 200-token user message
second = system + list(range(6000, 6200))   # a different user message

table = set(block_hashes(first))
matched = 0
for h in block_hashes(second):
    if h not in table:
        break
    matched += 1
print("blocks matched:", matched, " tokens skipped:", matched * BLOCK)
print("tokens to prefill:", len(second) - matched * BLOCK)
:::

:::code
lang: text
blocks matched: 75  tokens skipped: 1200
tokens to prefill: 200
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Break the cache with a timestamp, then fix it
task: Build a third request that puts a 3-token date in front of the system prompt, and a fourth request that puts the same 3 tokens after the user message. Count the matched blocks for each against the table from prefix.py. Then compute how many tokens the engine skips for a shared prefix of 1,000 tokens with a block size of 16.
hint: The chain of hashes starts at block 1. Any change before a block changes every hash after it.
lang: python
solution:
date = [9001, 9002, 9003]
third = date + system + list(range(6000, 6200))
fourth = system + list(range(6000, 6200)) + date

def matched_blocks(tokens):
    n = 0
    for h in block_hashes(tokens):
        if h not in table:
            break
        n += 1
    return n

print(matched_blocks(third))     # 0: the date shifts every block
print(matched_blocks(fourth))    # 75: the prefix is unchanged
print(1000 - 1000 % 16)          # 992 tokens skipped
:::

## Common mistakes

- Mistake: putting the date or the user name at the start of the system prompt. Fix: put variable content after the fixed content.
- Mistake: expecting a saving when the prefix is shorter than one block. Fix: measure the shared prefix in blocks, not in tokens.
- Mistake: sending the few-shot examples in a different order for each request. Fix: fix the order so that the token sequence is identical.
- Mistake: running the load test with random prompts and reporting the hit rate. Fix: replay real prompts so the hit rate matches production.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: prefix caching
q: Why does the hash of a block include the hash of the previous block?
- To make the hash shorter
* So that a block matches only when the whole prefix before it matches
- To let blocks be evicted in order
- To store the block size in the hash
why: Keys and values of a block depend on every earlier token, so the hash must cover the whole prefix.
q: A shared prefix is 1,000 tokens and the block size is 16. How many tokens does the engine skip?
- 1,000
* 992
- 984
- 62
why: 62 full blocks cover 992 tokens, and the last 8 tokens sit in a partial block that the engine still computes.
q: Which blocks can the engine evict?
- Any block, starting with the largest
* Blocks with a reference count of zero, starting with the least recently used
- Only blocks of finished requests from the last minute
- Only the blocks of the system prompt
why: A block in use by a running request cannot be freed, and LRU picks among the rest.
q: A product has a 1,200-token system prompt and 100,000 requests per day. About how many prefill tokens does prefix caching save per day?
- 1.2 million
- 12 million
* 120 million
- 1.2 billion
why: Every request after the first skips 1,200 tokens, and 99,999 times 1,200 is about 120 million.
q: An engineer puts the current date at the top of the system prompt. What happens to the hit rate?
- It stays the same, because the date is short
- It falls by one block per request
* It drops to zero for the whole prefix, because the first hash changes and the chain breaks
- It rises, because the date is the same for all requests on one day
why: The date changes the first block, and every later hash depends on it.
:::

## Go further

Read the vLLM paper for block sharing and reference counts. Read the SGLang paper for the radix tree design and its eviction rule. The Prompt Cache paper shows reuse of cached segments that are not a strict prefix. The vLLM and SGLang documentation show the settings that enable prefix caching and report the hit rate.
`,
          },
          {
            slug: 'streaming',
            title: 'Streaming tokens to the client',
            summary: 'Streaming sends each token to the client as the engine samples it, so the user sees text long before the request ends.',
            minutes: 13,
            objectives: [
              'Explain how server-sent events carry tokens over HTTP',
              'Compute the time to first token and the total time for a streamed response',
              'Describe why the detokenizer holds some bytes before it sends text',
              'Handle a client disconnect so the engine frees its cache blocks',
            ],
            keyTerms: ['server-sent events', 'time to first token', 'detokenizer', 'back-pressure', 'kv-cache', 'tool call'],
            links: [
              { label: 'MDN: server-sent events', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events', kind: 'docs' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'Text Generation Inference documentation', url: 'https://huggingface.co/docs/text-generation-inference', kind: 'docs' },
              { label: 'Hussein Nasser on HTTP and streaming protocols', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
              { label: 'llama.cpp server source', url: 'https://github.com/ggml-org/llama.cpp', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson explains how an engine streams tokens to a client while it still generates. It covers the server-sent events (SSE) protocol, the detokenizer, the time to first token, and what happens when a client disconnects. It ends with streaming of tool-call output.

## Why it matters

A full answer of 300 tokens can take 9 seconds. A user who waits 9 seconds for a blank screen leaves. A user who sees the first word after half a second stays. Streaming also lets a client stop a bad answer early, which saves GPU time.

:::video
id: zduSFxRajkE
why: Watch the part on UTF-8 and byte-level encoding in the first 30 minutes. It explains why one character can span two tokens, which is the case the detokenizer must hold.
:::

## The idea with an example

A request asks for an answer of 300 tokens. The engine decodes at 30 ms per token.

| Quantity | Value |
|---|---|
| Prefill time (time to first token) | 400 ms |
| Decode time per token | 30 ms |
| Total decode time | 300 × 30 ms = 9.0 s |
| Total request time | 9.4 s |

The bars compare the wait before the user sees text.

:::bars
title: Time until the user sees text
unit: s
Without streaming: 9.4
With streaming: 0.4
:::

Without streaming the client waits 9.4 s and then receives the whole text. With streaming the client receives the first token at 400 ms. A person reads about 5 tokens per second, and the engine produces about 33 tokens per second. The text arrives faster than the user reads it.

The timeline shows the first half second of the stream.

:::timeline
title: First tokens of a streamed response
unit: ms
lane Engine
lane Client
Engine: prefill, time to first token @0-400
Engine -> Client: token 1 @400-405
Engine: decode step @400-430
Engine -> Client: token 2 @430-435
Engine: decode step @430-460
Engine -> Client: token 3 @460-465
Engine: decode step @460-490
Engine -> Client: token 4 @490-495
Client: shows text as it arrives @405-500
:::

The engine sends the stream as server-sent events over one HTTP response. Each event is a line of text that starts with data: and ends with a blank line. A stream of three events looks like this:

    data: {"choices":[{"delta":{"content":"The"}}]}

    data: {"choices":[{"delta":{"content":" cache"}}]}

    data: {"choices":[{"delta":{"content":" holds"}}]}

    data: [DONE]

The final [DONE] line tells the client that the response is complete.

## How it works

The path of one token is short:

1. The sampler picks a token id for the sequence.
2. The detokenizer converts the token id into text.
3. The API server wraps the text in a JSON object and writes one SSE event.
4. The HTTP layer flushes the event to the socket.
5. The client parses the event and appends the text to the screen.

Step 2 has an edge case. Tokenizers split text into byte pieces. A single character outside the ASCII range, such as an accented letter or an emoji, can span two or more tokens. After the first token the bytes do not form a complete UTF-8 character. The detokenizer holds the bytes and emits nothing. When the next token completes the character, the detokenizer emits the full character. The client therefore sees a short pause of one or two tokens on such characters.

Press Next to follow four tokens through the detokenizer and then a disconnect.

:::scenario
title: Streaming the text café ok
state: held bytes=0, sent text=none, events sent=0, request=running
step: The sampler picks a token for caf. The detokenizer gets three complete ASCII bytes and sends caf.
state: sent text=caf, events sent=1
step: The next token holds the first byte of the two-byte character é. The byte does not form a complete UTF-8 character. The detokenizer holds it and sends nothing.
state: held bytes=1
step: The next token holds the second byte. The character is complete. The detokenizer sends é.
state: held bytes=0, sent text=café, events sent=2
step: The next token is the word ok with a space in front. The detokenizer sends it at once.
state: sent text=café ok, events sent=3
step: The client closes the socket. The API server cancels the request, and the scheduler frees its KV cache blocks.
state: request=cancelled, cache blocks=freed
:::

The user-visible latency has two parts. The time to first token (TTFT) is the prefill time plus any queue time. The time per output token (TPOT) is the decode time per step. The total time is:

$$T = \\text{TTFT} + (n - 1) \\times \\text{TPOT}$$

Here $T$ is the total time, $n$ is the number of output tokens, and the first token arrives at TTFT.

Back-pressure happens when the client reads slower than the engine writes. The socket buffer fills. The API server must not block the engine loop on a slow socket, so it drains a per-request queue in a separate task.

When a client disconnects, the API server detects the closed socket. It must then cancel the request in the scheduler. The scheduler removes the sequence and frees its key-value (KV) cache blocks. If the server does not cancel, the engine decodes to the end for a client that is gone.

Caution: a missing cancel path wastes GPU time on every abandoned request. Test it by killing a client mid-stream and checking the running sequence count.

A tool call is a JSON object the model writes instead of prose. Engines stream it in fragments, one delta per event, with the same SSE format. The client appends the fragments and parses the JSON only after the final event, because a partial JSON string does not parse.


This script shows the detokenizer rule. It holds bytes until they form a complete UTF-8 character.

:::code
lang: python
file: detokenizer.py
class Detokenizer:
    def __init__(self):
        self.held = b""

    def feed(self, token_bytes):
        self.held += token_bytes
        try:
            text = self.held.decode("utf-8")
        except UnicodeDecodeError:
            return ""              # wait for the rest of the character
        self.held = b""
        return text

d = Detokenizer()
tokens = [b"caf", bytes.fromhex("c3"), bytes.fromhex("a9"), b" ok"]
for t in tokens:
    out = d.feed(t)
    print(t, "->", repr(out) if out else "(held)")

ttft_ms, tpot_ms, n = 400, 30, 300
print("total time:", (ttft_ms + (n - 1) * tpot_ms) / 1000, "s")
:::

:::code
lang: text
b'caf' -> 'caf'
b'\\xc3' -> (held)
b'\\xa9' -> 'é'
b' ok' -> ' ok'
total time: 9.37 s
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Parse a server-sent event stream
task: Write a function that takes the text of an SSE stream, finds every line that starts with data:, stops at [DONE], parses each JSON payload and returns the joined content. Test it on the four events from this lesson. The result is the text "The cache holds".
hint: Split the stream on newlines. Strip the data: prefix, skip empty lines, and use json.loads on the rest.
lang: python
solution:
import json

def join_stream(stream):
    parts = []
    for line in stream.splitlines():
        if not line.startswith("data: "):
            continue
        payload = line[len("data: "):]
        if payload == "[DONE]":
            break
        parts.append(json.loads(payload)["choices"][0]["delta"]["content"])
    return "".join(parts)

events = [
    'data: {"choices":[{"delta":{"content":"The"}}]}',
    'data: {"choices":[{"delta":{"content":" cache"}}]}',
    'data: {"choices":[{"delta":{"content":" holds"}}]}',
    "data: [DONE]",
]
print(join_stream(chr(10).join(events)))   # The cache holds
:::

## Common mistakes

- Mistake: buffering the whole response in a proxy between the engine and the client. Fix: disable response buffering in the proxy for the streaming route.
- Mistake: parsing each SSE event as complete JSON for a tool call. Fix: join the fragments and parse once after the final event.
- Mistake: decoding each token id to text on its own. Fix: let the detokenizer hold incomplete UTF-8 bytes until the character is complete.
- Mistake: ignoring a client disconnect. Fix: cancel the request and free its cache blocks.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: streaming
q: A response has 200 tokens, TTFT is 300 ms and TPOT is 25 ms. What is the total time?
- 5.0 s
* 5.275 s
- 5.3 s
- 8.0 s
why: 300 ms plus 199 steps of 25 ms is 300 + 4,975 = 5,275 ms.
q: Why does the detokenizer sometimes emit nothing for a token?
- The token is a stop token
* The token bytes do not yet form a complete UTF-8 character
- The client has not acknowledged the previous event
- The sampler returned the same token twice
why: A multi-byte character can span two tokens, and half a character is not valid text.
q: What must the server do when a client disconnects mid-stream?
- Finish the response and store it for later
* Cancel the request in the scheduler so the engine frees the KV cache blocks
- Lower the batch size
- Resend the last event
why: Without a cancel path the engine decodes to the end for a client that is gone and holds its cache.
q: Which line ends a stream in the OpenAI-style SSE format?
- An empty data: line
- A line with status: 200
* A line with data: [DONE]
- The closing of the HTTP connection only
why: The server sends data: [DONE] as the final event, and the client stops reading there.
q: A client parses each SSE event of a tool call as complete JSON. What happens?
- It works because each event is a full object
* It fails, because each event holds a fragment and only the joined fragments parse
- It works only for short tool calls
- The server rejects the request
why: Tool-call output streams in deltas, so the client must join them and parse once after the final event.
:::

## Go further

Read the MDN page for the exact SSE wire format and the client-side event source API. The vLLM and Text Generation Inference documentation describe their streaming endpoints and cancel behaviour. Hussein Nasser's channel covers HTTP streaming, buffering, and proxies at the protocol level. The llama.cpp server source shows a compact streaming implementation.
`,
          },
        ],
      },
      {
        slug: 'measurement',
        title: 'Measurement',
        description: 'The latency, throughput, and utilisation numbers that tell you whether a serving system is fast, and how to collect them.',
        level: 'advanced',
        lessons: [
          {
            slug: 'ttft-and-tpot',
            title: 'Time to first token and time per output token',
            summary: 'Two numbers, TTFT and TPOT, describe the latency of a streamed response, and each one depends on a different phase.',
            minutes: 13,
            objectives: [
              'Define TTFT, TPOT, inter-token latency, and end-to-end latency',
              'Compute the end-to-end latency of a request from its token counts',
              'Explain what a p99 value means and why it differs from the mean',
              'Choose a TPOT target from the reading speed of a user',
            ],
            keyTerms: ['time to first token', 'time per output token', 'p99-latency', 'continuous-batching', 'kv-cache'],
            links: [
              { label: 'Efficiently scaling transformer inference', url: 'https://arxiv.org/abs/2211.05102', kind: 'paper' },
              { label: 'DistServe: separating prefill and decode for goodput', url: 'https://arxiv.org/abs/2401.09670', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'Lilian Weng: large transformer model inference optimization', url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/', kind: 'article' },
              { label: 'ByteByteGo on latency percentiles and system design', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
            ],
            body: `
## What this lesson covers

This lesson defines the two latency numbers that describe a streamed response: time to first token (TTFT) and time per output token (TPOT). It shows how to combine them into the end-to-end latency. It then explains percentiles and how batch size moves these numbers.

## Why it matters

A single latency number hides the two phases of inference. Prefill sets TTFT. Decode sets TPOT. A system can have a fast TTFT and a slow TPOT, or the reverse. Each problem has a different fix. If you only measure the total time, you do not know which phase to fix.

## The idea with an example

A request has a prompt of 2,000 tokens and an answer of 300 tokens. The engine runs prefill at 10,000 tokens per second and decodes at 25 ms per token.

The TTFT is the prefill time plus any time in the queue. The prefill time is 2,000 / 10,000 = 0.2 s. With no queue, TTFT is 200 ms.

The decode time is 299 steps × 25 ms = 7.475 s. The first token arrives at TTFT, so only 299 steps remain. The end-to-end latency is 0.2 s + 7.475 s = 7.675 s.

The timeline shows the first 280 ms of the request.

:::timeline
title: TTFT and the first decode steps
unit: ms
lane Engine
lane Client
Engine: prefill, 2,000 tokens @0-200
Engine -> Client: token 1 @200-203
Engine: decode step @200-225
Engine -> Client: token 2 @225-228
Engine: decode step @225-250
Engine -> Client: token 3 @250-253
Engine: decode step @250-275
Engine -> Client: token 4 @275-278
:::

The same engine serves three request shapes with different results:

| Shape | Input tokens | Output tokens | TTFT | Decode time | End-to-end |
|---|---|---|---|---|---|
| Chat turn | 200 | 150 | 20 ms | 3.725 s | 3.745 s |
| Retrieval prompt | 4,000 | 300 | 400 ms | 7.475 s | 7.875 s |
| Long summary | 20,000 | 100 | 2,000 ms | 2.475 s | 4.475 s |

The bars compare the TTFT of the three shapes.

:::bars
title: TTFT by request shape
unit: ms
Chat turn, 200 input tokens: 20
Retrieval prompt, 4,000 input tokens: 400
Long summary, 20,000 input tokens: 2000
:::

The long summary has the slowest TTFT but a short total time. The chat turn has the fastest TTFT but spends almost all of its time in decode. Only the pair of numbers describes each shape.

Press Next to compute the latency of the retrieval prompt.

:::scenario
title: End-to-end latency of a 2,000-token prompt with a 300-token answer
state: prefill=none, TTFT=none, decode time=none, end-to-end=none
step: Divide the 2,000 prompt tokens by the prefill rate of 10,000 tokens per second. The prefill takes 0.2 s.
state: prefill=0.2 s
step: Add the queue time. The queue is empty, so TTFT is 200 ms.
state: TTFT=200 ms
step: The first token is already counted. 299 decode steps remain at 25 ms each.
state: decode steps=299
step: Multiply 299 by 25 ms. The decode time is 7.475 s.
state: decode time=7.475 s
step: Add TTFT and the decode time. The end-to-end latency is 7.675 s.
state: end-to-end=7.675 s
step: A queue wait of 500 ms would raise TTFT to 700 ms and the end-to-end latency to 8.175 s.
state: with a 500 ms queue=8.175 s
:::

## How it works

The four definitions are:

- TTFT: the time from the request arrival to the first token sent to the client.
- TPOT: the mean time between tokens after the first one, over one request.
- Inter-token latency: the time between two specific tokens; TPOT is its mean.
- End-to-end latency: the time from the request arrival to the last token.

The relation is:

$$T = \\text{TTFT} + (n - 1) \\times \\text{TPOT}$$

Here $T$ is the end-to-end latency, $n$ is the number of output tokens, and the first token is already counted inside TTFT.

Measure each number over many requests and report percentiles. The p50 is the median: half of the requests are faster. The p99 is the value that 99 percent of requests stay under, so it describes the slowest one percent. A mean hides the tail. A p99 shows it.

Batch size links TPOT to throughput. In decode the GPU reads every weight once per step. With one sequence in the batch, each step produces one token. With 32 sequences, each step produces 32 tokens and takes only a little longer. TPOT rises slowly, throughput rises almost 32 times. The queue also matters: a request that waits 500 ms for a slot adds 500 ms to its TTFT.

A person reads about 5 tokens per second, so a TPOT of 200 ms matches reading speed. Most products target a TPOT of 20 to 50 ms, so that text arrives faster than the user reads and the user can skim. A chat product also targets a TTFT under about one second, because a longer wait feels like a stall.

Note: the inter-token latency is not constant. A step that includes a large prefill chunk for another request makes every decode token in that step late. Report the p99 of the inter-token latency to catch these stalls.


This script computes the latency of the three request shapes and shows why a percentile differs from the mean.

:::code
lang: python
file: latency.py
def latency_ms(input_tokens, output_tokens, prefill_rate=10000, tpot_ms=25, queue_ms=0):
    ttft = input_tokens / prefill_rate * 1000 + queue_ms
    decode = (output_tokens - 1) * tpot_ms
    return ttft, decode, ttft + decode

shapes = (("chat turn", 200, 150), ("retrieval prompt", 4000, 300), ("long summary", 20000, 100))
for name, inp, out in shapes:
    ttft, decode, total = latency_ms(inp, out)
    print(name + ": TTFT", ttft, "ms, decode", decode / 1000, "s, end-to-end", round(total / 1000, 3), "s")

def percentile(values, p):
    values = sorted(values)
    return values[min(len(values) - 1, int(p / 100 * len(values)))]

ttfts = [180, 190, 200, 210, 220, 230, 250, 300, 900, 2100]
print("p50", percentile(ttfts, 50), "ms  p99", percentile(ttfts, 99), "ms  mean", sum(ttfts) / len(ttfts), "ms")
:::

:::code
lang: text
chat turn: TTFT 20.0 ms, decode 3.725 s, end-to-end 3.745 s
retrieval prompt: TTFT 400.0 ms, decode 7.475 s, end-to-end 7.875 s
long summary: TTFT 2000.0 ms, decode 2.475 s, end-to-end 4.475 s
p50 230 ms  p99 2100 ms  mean 478.0 ms
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Add a queue and watch the tail move
task: Use latency_ms to compute the end-to-end latency of a 5,000-token prompt with a 101-token answer at TPOT 40 ms, first with no queue and then with a 500 ms queue. Then take the ten TTFT samples from latency.py, add 500 ms to the slowest two, and print the new p50 and p99. Say in one sentence which number moved.
hint: Only the TTFT part changes with the queue. The p50 looks at the middle of the sorted list, the p99 at the end.
lang: python
solution:
print(latency_ms(5000, 101, tpot_ms=40))                 # (500.0, 4000, 4500.0)
print(latency_ms(5000, 101, tpot_ms=40, queue_ms=500))   # (1000.0, 4000, 5000.0)
ttfts = [180, 190, 200, 210, 220, 230, 250, 300, 1400, 2600]
print(percentile(ttfts, 50), percentile(ttfts, 99))      # 230 and 2600
# The p99 moved by 500 ms. The p50 did not move at all.
:::

## Common mistakes

- Mistake: reporting only the mean latency. Fix: report p50, p95, and p99, and look at the p99 first.
- Mistake: measuring TTFT at the engine instead of at the client. Fix: measure at the client, so queue time and network time are included.
- Mistake: comparing two engines with different output lengths. Fix: fix the prompt set and the output length, or compare TPOT directly.
- Mistake: tuning batch size for throughput and forgetting TPOT. Fix: set a TPOT target first, then raise batch size until the target breaks.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: TTFT and TPOT
q: A prompt of 5,000 tokens runs prefill at 10,000 tokens per second with no queue. What is the TTFT?
- 50 ms
* 500 ms
- 2 s
- 5 s
why: 5,000 divided by 10,000 is 0.5 seconds.
q: TTFT is 300 ms, TPOT is 40 ms, and the answer has 101 tokens. What is the end-to-end latency?
- 4.04 s
* 4.3 s
- 4.34 s
- 7.3 s
why: 300 ms plus 100 remaining steps of 40 ms is 4,300 ms.
q: What does a p99 TTFT of 2 s tell you?
- The average request waits 2 s for the first token
* One percent of requests wait 2 s or more for the first token
- Every request waits at most 2 s
- The slowest request waited 2 s
why: The p99 is the value that 99 percent of requests stay under, so it describes the slowest one percent.
q: Which phase of inference sets TTFT, and which sets TPOT?
- Decode sets TTFT; prefill sets TPOT
* Prefill plus queue time sets TTFT; decode sets TPOT
- Both come from decode
- Both come from the sampler
why: The first token appears after the prompt is processed; every later token takes one decode step.
q: The batch size rises from 1 to 32. What happens to TPOT and throughput?
- Both rise about 32 times
* TPOT rises a little; throughput rises almost 32 times
- TPOT falls 32 times; throughput stays the same
- Both stay the same
why: Decode reads the weights once per step, so a larger batch adds tokens per step at a small cost in step time.
:::

## Go further

The paper on efficiently scaling transformer inference explains the latency and throughput trade-off from first principles. The DistServe paper shows how separating prefill from decode protects TTFT and TPOT at the same time. Lilian Weng's post surveys the techniques that move each number. The vLLM documentation lists the metrics the engine exports. The ByteByteGo channel has short explanations of percentiles and tail latency in general systems.
`,
          },
          {
            slug: 'goodput-and-load-testing',
            title: 'Goodput and load testing',
            summary: 'Goodput counts only the requests that meet their latency targets, and a load test finds the concurrency where it peaks.',
            minutes: 16,
            objectives: [
              'Define goodput in terms of a service-level objective',
              'Compute goodput from throughput and the fraction of requests inside the SLO',
              'Run a load test that ramps concurrency and records the right numbers',
              'Explain the difference between open-loop and closed-loop load generators',
            ],
            keyTerms: ['goodput', 'service-level objective', 'p99-latency', 'back-pressure', 'continuous-batching', 'load test'],
            links: [
              { label: 'DistServe: goodput-optimised serving', url: 'https://arxiv.org/abs/2401.09670', kind: 'paper' },
              { label: 'Splitwise: phase splitting for inference', url: 'https://arxiv.org/abs/2311.18677', kind: 'paper' },
              { label: 'vLLM documentation, including the benchmark scripts', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'k6 load testing tool', url: 'https://github.com/grafana/k6', kind: 'repo' },
              { label: 'Locust load testing tool', url: 'https://github.com/locustio/locust', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson defines throughput and goodput and shows why they differ. It walks through a load test that ramps concurrency and records latency percentiles. It ends with a procedure to run a load test and the choice between open-loop and closed-loop load generators.

## Why it matters

A serving system can report a high throughput while every user waits too long. Throughput counts all work. Goodput counts only the work that arrives in time. Capacity planning, autoscaling, and engine comparison all need goodput.

## The idea with an example

A service-level objective (SLO) is a latency target that a request must meet. A common SLO for chat has two parts: time to first token (TTFT) under 1 s and time per output token (TPOT) under 50 ms.

A system serves 100 requests per second. Measurements show that 70 percent of the requests meet both parts of the SLO. The throughput is 100 requests per second. The goodput is 100 × 0.7 = 70 requests per second. The other 30 requests per second are work the system did but the user did not accept.

Press Next to compute the goodput.

:::scenario
title: Goodput of a system at 100 requests per second
state: throughput=100 req/s, inside SLO=unknown, goodput=unknown, wasted=unknown
step: Write the SLO down: TTFT p99 under 1 s and TPOT p99 under 50 ms.
state: SLO=TTFT under 1 s and TPOT under 50 ms
step: Measure every request. 70 percent meet both parts of the SLO.
state: inside SLO=70 percent
step: Multiply the throughput by the fraction. The goodput is 70 requests per second.
state: goodput=70 req/s
step: The other 30 requests per second are work the system did but the user did not accept.
state: wasted=30 req/s
step: Raise the load until throughput is 14 requests per second per replica at concurrency 64. Only 30 percent stay inside the SLO, so goodput falls to 4.2.
state: throughput=14 req/s per replica, inside SLO=30 percent, goodput=4.2 req/s, wasted=9.8 req/s
:::

A load test now ramps the number of concurrent requests. Each row records the p99 of TTFT and TPOT and the fraction of requests inside the SLO:

| Concurrency | Throughput (req/s) | TTFT p99 | TPOT p99 | Inside SLO | Goodput (req/s) |
|---|---|---|---|---|---|
| 1 | 0.5 | 0.3 s | 25 ms | 100% | 0.5 |
| 4 | 1.9 | 0.4 s | 28 ms | 100% | 1.9 |
| 16 | 6.5 | 0.7 s | 38 ms | 95% | 6.2 |
| 64 | 14.0 | 1.6 s | 65 ms | 30% | 4.2 |
| 128 | 15.0 | 4.0 s | 120 ms | 5% | 0.75 |

The bars show the throughput at each concurrency.

:::bars
title: Throughput by concurrency
unit: req/s
Concurrency 1: 0.5
Concurrency 4: 1.9
Concurrency 16: 6.5
Concurrency 64: 14
Concurrency 128: 15
:::

The bars show the goodput at the same concurrency levels.

:::bars
title: Goodput by concurrency
unit: req/s
Concurrency 1: 0.5
Concurrency 4: 1.9
Concurrency 16: 6.2 (the knee)
Concurrency 64: 4.2
Concurrency 128: 0.75
:::

Throughput rises at every row. Goodput peaks at concurrency 16 and then collapses. The point where goodput stops rising is the knee. Above the knee, extra load adds queue time and larger batches, so both TTFT and TPOT cross their targets. The right capacity for this system is about 16 concurrent requests per replica, not 128.

## How it works

Goodput is:

$$G = X \\times f_{SLO}$$

Here $G$ is the goodput and $X$ is the throughput in requests per second. $f_{SLO}$ is the fraction of requests that meet every part of the SLO.

The request shape changes the whole table. A prompt of 20,000 tokens takes 10 times longer in prefill than a prompt of 2,000 tokens. Take the input and output length distribution from production logs. Sample prompts from that distribution so the test matches the real load.

Run a load test with this procedure:

1. Write the SLO down with a p99 for TTFT and a p99 for TPOT.
2. Build a prompt set from production logs with the real length distribution.
3. Warm the engine with 100 requests so the cache and CUDA graphs are ready.
4. Run at concurrency 1 for at least 2 minutes and record every request.
5. Double the concurrency and repeat until the p99 values are far above the SLO.
6. Compute throughput, the fraction inside the SLO, and goodput for each row.
7. Mark the knee and set the capacity per replica below it.

A closed-loop generator keeps a fixed number of requests in flight. When one finishes, it sends the next. This generator never overloads the system, because the system sets the pace. An open-loop generator sends requests at a fixed rate, for example 20 per second, whatever the system does. This generator shows queue growth and back-pressure under real arrival patterns. Use closed-loop tests to find the knee and open-loop tests to check behaviour at a given arrival rate.

The timeline shows that the closed-loop generator waits for each request, while the open-loop generator keeps sending every second.

:::timeline
title: Closed-loop and open-loop load generators with 2 s requests
unit: s
lane Closed-loop
lane Open-loop
Closed-loop: request 1 @0-2
Closed-loop: request 2 @2-4
Closed-loop: request 3 @4-6
Open-loop: request 1 @0-2
Open-loop: request 2 @1-3
Open-loop: request 3 @2-4
Open-loop: request 4 @3-5
Open-loop: request 5 @4-6
:::

Caution: a closed-loop test at low concurrency can hide a capacity problem. Production traffic is open-loop, and a burst above the knee builds a queue that does not drain.


This script computes goodput for every row of the load test and finds the knee.

:::code
lang: python
file: goodput.py
SLO_TTFT_S, SLO_TPOT_MS = 1.0, 50
rows = [  # concurrency, throughput req/s, TTFT p99 s, TPOT p99 ms, fraction inside SLO
    (1, 0.5, 0.3, 25, 1.00),
    (4, 1.9, 0.4, 28, 1.00),
    (16, 6.5, 0.7, 38, 0.95),
    (64, 14.0, 1.6, 65, 0.30),
    (128, 15.0, 4.0, 120, 0.05),
]
knee = None
for conc, throughput, ttft, tpot, inside in rows:
    goodput = throughput * inside
    p99_ok = ttft <= SLO_TTFT_S and tpot <= SLO_TPOT_MS
    print("concurrency", conc, "throughput", throughput, "goodput", round(goodput, 2),
          "p99 inside SLO" if p99_ok else "p99 over SLO")
    if knee is None or goodput > knee[1]:
        knee = (conc, goodput)
print("knee at concurrency", knee[0], "with goodput", round(knee[1], 2), "req/s")
:::

:::code
lang: text
concurrency 1 throughput 0.5 goodput 0.5 p99 inside SLO
concurrency 4 throughput 1.9 goodput 1.9 p99 inside SLO
concurrency 16 throughput 6.5 goodput 6.17 p99 inside SLO
concurrency 64 throughput 14.0 goodput 4.2 p99 over SLO
concurrency 128 throughput 15.0 goodput 0.75 p99 over SLO
knee at concurrency 16 with goodput 6.17 req/s
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Run a closed-loop load test against a local model
task: Start a local OpenAI-compatible server (for example ollama serve with a small model, or vLLM on port 8000). Write a closed-loop load generator that sends streamed requests at concurrency 1, 2 and 4, records the TTFT and the TPOT of each request, and prints the p99 of both per level. Use only the standard library.
hint: A thread pool with n workers is a closed-loop generator with concurrency n. Measure TTFT as the time to the first data: line and TPOT as the remaining time divided by the remaining events.
lang: python
solution:
import json, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

URL = "http://localhost:11434/v1/completions"   # Ollama; vLLM uses port 8000
MODEL = "llama3.2"

def one_request(_):
    body = json.dumps({"model": MODEL, "prompt": "Explain the KV cache.",
                       "max_tokens": 64, "stream": True}).encode()
    req = urllib.request.Request(URL, data=body, headers={"Content-Type": "application/json"})
    t0, first, n = time.time(), None, 0
    with urllib.request.urlopen(req) as resp:
        for line in resp:
            if line.startswith(b"data: ") and b"[DONE]" not in line:
                n += 1
                if first is None:
                    first = time.time() - t0
    total = time.time() - t0
    return first, (total - first) / max(1, n - 1)

for conc in (1, 2, 4):
    with ThreadPoolExecutor(conc) as pool:
        results = list(pool.map(one_request, range(conc * 3)))
    ttfts = sorted(r[0] for r in results)
    tpots = sorted(r[1] for r in results)
    print("concurrency", conc, "TTFT p99", round(ttfts[-1], 2), "s  TPOT p99", round(tpots[-1] * 1000), "ms")
:::

## Common mistakes

- Mistake: reporting throughput without an SLO. Fix: define the SLO first, then report goodput next to throughput.
- Mistake: testing with short random prompts. Fix: replay prompts with the production length distribution.
- Mistake: reading results from the first 30 seconds. Fix: discard the warm-up window and run each level for minutes.
- Mistake: setting the autoscaler on GPU utilisation. Fix: scale on queue depth or on the fraction of requests inside the SLO.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: goodput and load testing
q: Throughput is 40 requests per second and 85 percent of requests meet the SLO. What is the goodput?
- 6 req/s
- 25 req/s
* 34 req/s
- 40 req/s
why: Goodput is throughput times the fraction inside the SLO, so 40 times 0.85 = 34.
q: In the table, why does goodput fall at concurrency 64 while throughput rises?
- The engine preempts most sequences
* The larger batch and queue push TTFT and TPOT over the SLO for most requests
- The load generator cannot keep up
- The KV cache is full, so requests fail
why: Only 30 percent of requests stay inside the SLO, so 14 times 0.3 is less than 6.5 times 0.95.
q: Which generator shows what happens when arrivals exceed capacity?
- A closed-loop generator, because it waits for each response
* An open-loop generator, because it keeps sending at a fixed rate
- Either one, because both measure the same thing
- Neither; only production traffic shows it
why: An open-loop generator builds a queue when the system cannot keep up, as real users do.
q: What is the first step of the load-test procedure?
- Run at concurrency 128 to find the maximum throughput
* Write the SLO down with a p99 for TTFT and a p99 for TPOT
- Warm the engine with 100 requests
- Pick the GPU
why: Without an SLO you cannot compute goodput, so every later row would be meaningless.
q: An autoscaler adds replicas when GPU utilisation passes 80 percent. Why is this a poor signal for an inference service?
- GPU utilisation is always 0 during decode
* The utilisation number stays high even when goodput has collapsed, so the scaler reacts too late or not at all
- Utilisation drops when the queue grows
- Replicas cannot be added while a batch runs
why: Queue depth or the fraction of requests inside the SLO tracks user experience; utilisation does not.
:::

## Go further

The DistServe paper defines goodput for inference and designs a system around it. The Splitwise paper shows similar measurements on real GPUs. The vLLM documentation includes benchmark scripts that report TTFT, TPOT, and throughput. The k6 and Locust repositories are general load generators that can replay prompt sets against an HTTP endpoint.
`,
          },
          {
            slug: 'gpu-utilisation',
            title: 'GPU utilisation, measured correctly',
            summary: 'The utilisation number from nvidia-smi says little, so use model FLOPs utilisation and memory bandwidth utilisation instead.',
            minutes: 15,
            objectives: [
              'Explain why the nvidia-smi utilisation number does not measure useful work',
              'Compute memory bandwidth utilisation for a decode step',
              'Compute model FLOPs utilisation for a batched decode step',
              'Choose the fix that matches a low MBU or a low MFU',
            ],
            keyTerms: ['arithmetic-intensity', 'model FLOPs utilisation', 'memory bandwidth utilisation', 'kv-cache', 'quantisation', 'profiler'],
            links: [
              { label: 'Efficiently scaling transformer inference', url: 'https://arxiv.org/abs/2211.05102', kind: 'paper' },
              { label: 'FlashAttention: an IO-aware attention kernel', url: 'https://arxiv.org/abs/2205.14135', kind: 'paper' },
              { label: 'PyTorch profiler documentation', url: 'https://pytorch.org/docs/stable/profiler.html', kind: 'docs' },
              { label: 'Lilian Weng: large transformer model inference optimization', url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/', kind: 'article' },
              { label: 'Umar Jamil on transformer inference internals', url: 'https://www.youtube.com/@umarjamilai', kind: 'video' },
            ],
            body: `
## What this lesson covers

This lesson explains what the utilisation number from nvidia-smi measures and why it misleads. It defines two better metrics: model FLOPs utilisation (MFU) and memory bandwidth utilisation (MBU). It computes both for a decode step.

## Why it matters

Teams buy GPUs by the hour. A GPU that shows 100 percent utilisation and produces few tokens wastes that money. MFU and MBU tell you whether the arithmetic units or the memory system is the limit, and so which change raises throughput.

:::video
id: l8pRSuU81PU
why: Use the chapter list to find where the tokens per second and MFU are computed, in the first hour. The speed-ups from bf16, torch.compile and flash attention each move the MFU in the way this lesson explains.
:::

## The idea with an example

The GPU-Util column in nvidia-smi reports the fraction of time in which at least one kernel ran. A kernel that uses one streaming multiprocessor out of 132 still counts as busy. A decode loop with many tiny kernels shows 100 percent while most of the chip idles.

Memory bandwidth utilisation measures something concrete. In a decode step the GPU reads every weight once. A 70B model in FP16 has 140 GB of weights. Treat the model as if it sits on one device with a peak bandwidth of 3.35 TB/s. In practice it spans two GPUs, and each GPU reads its half.

At batch size 1 the floor for one step is 140 GB / 3.35 TB/s = 42 ms. If the measured time per token is 42 ms, the achieved bandwidth is 140 GB / 0.042 s = 3.33 TB/s. The MBU is 3.33 / 3.35 = 99 percent. The engine is at the memory floor and nothing but faster memory or fewer bytes helps.

If the measured time per token is 60 ms, the achieved bandwidth is 140 / 0.060 = 2.33 TB/s. The MBU is 70 percent. The other 30 percent is overhead: kernel launches, synchronisation, or the scheduler.

The timeline shows where the 18 ms of overhead sits in a 60 ms step.

:::timeline
title: A 60 ms decode step with 30 percent overhead
unit: ms
lane CPU
lane GPU
CPU: schedule the step @0-6
CPU -> GPU: launch kernels @6-8
GPU: attention and MLP kernels, 42 ms of weight reads @8-50
GPU: sampler @50-53
GPU -> CPU: new token @53-55
CPU: detokenize and append @55-60
:::

Model FLOPs utilisation measures the arithmetic side. A forward pass costs about 2 floating point operations per weight per token. For the 70B model that is 140 GFLOPs per token. Now run a batch of 64 sequences, one token each, in a step of 25 ms. The work is 64 × 140 GFLOPs = 8.96 TFLOPs, so the rate is 8.96 / 0.025 = 358 TFLOPS. The H100 peak in FP16 is about 990 TFLOPS, so the MFU is 358 / 990 = 36 percent.

Press Next to compute MBU and MFU for the two measurements.

:::scenario
title: MBU and MFU for a 70B FP16 model on an H100
state: peak bandwidth=3.35 TB/s, peak FLOPS=990 T, weights=140 GB, MBU=none, MFU=none
step: Measure the decode step at batch size 1. It takes 60 ms.
state: step time=60 ms
step: Divide 140 GB by 0.060 s. The achieved bandwidth is 2.33 TB/s.
state: achieved bandwidth=2.33 TB/s
step: Divide by the peak. The MBU is 70 percent. The other 30 percent is overhead.
state: MBU=70 percent
step: Now measure a batch of 64 sequences. The step takes 25 ms and does 64 x 140 GFLOPs = 8.96 TFLOPs.
state: step time=25 ms, work=8.96 TFLOPs
step: Divide the work by the time. The rate is 358 TFLOPS.
state: achieved FLOPS=358 T
step: Divide by the peak of 990 TFLOPS. The MFU is 36 percent. The arithmetic units mostly idle, so raise the batch size or move fewer bytes.
state: MFU=36 percent, fix=raise the batch or quantise
:::

| Metric | Value | Reading |
|---|---|---|
| nvidia-smi GPU-Util | 100% | A kernel is always running |
| MBU at batch 1, 60 ms per token | 70% | 30% of time is overhead |
| MFU at batch 64, 25 ms per step | 36% | Arithmetic units are mostly idle |

The bars compare the three readings.

:::bars
title: Three utilisation readings for the same server
unit: percent
nvidia-smi GPU-Util: 100
MBU at batch 1: 70
MFU at batch 64: 36
:::

## How it works

The two formulas are:

$$\\text{MBU} = \\frac{\\text{bytes moved per step}}{t_{step} \\times B_{peak}}$$

The bytes moved per step are the weights plus the key-value (KV) cache read in that step. $t_{step}$ is the measured step time and $B_{peak}$ is the peak memory bandwidth.

$$\\text{MFU} = \\frac{2 \\times W \\times n_{tok}}{t_{step} \\times F_{peak}}$$

Here $W$ is the number of weights and $n_{tok}$ is the number of tokens in the step. $F_{peak}$ is the peak arithmetic rate of the GPU.

Each combination points to a fix:

- Low MBU and low MFU: the GPU waits on overhead. Use CUDA graphs, reduce kernel launches, or fix the scheduler.
- High MBU and low MFU: the memory system is the limit. Raise the batch size so each weight read serves more tokens, or quantise the weights to move fewer bytes.
- High MFU: the arithmetic units are the limit. This happens in prefill. Use a faster attention kernel or a lower-precision format.

Power and clocks also change the result. A GPU under a power cap lowers its clock, and both peaks fall. Read the actual clock during the test.

Use the PyTorch profiler to see the time of each kernel and the gaps between kernels. Use NVIDIA Nsight Systems to see the same timeline across the CPU, the GPU, and the communication library.

Note: the FP8 peak is twice the FP16 peak, so an FP8 MFU uses a different denominator.


This script computes MBU and MFU for the two measurements in the example.

:::code
lang: python
file: utilisation.py
def mbu(bytes_moved_gb, step_ms, peak_tb_per_s=3.35):
    achieved_tb_per_s = bytes_moved_gb / (step_ms / 1000) / 1000
    return achieved_tb_per_s, achieved_tb_per_s / peak_tb_per_s

def mfu(weights, tokens_in_step, step_ms, peak_tflops=990):
    achieved_tflops = 2 * weights * tokens_in_step / (step_ms / 1000) / 1e12
    return achieved_tflops, achieved_tflops / peak_tflops

achieved, util = mbu(140, 60)
print("MBU at batch 1, 60 ms:", round(achieved, 2), "TB/s,", round(util * 100), "%")
achieved, util = mfu(70e9, 64, 25)
print("MFU at batch 64, 25 ms:", round(achieved), "TFLOPS,", round(util * 100), "%")
:::

:::code
lang: text
MBU at batch 1, 60 ms: 2.33 TB/s, 70 %
MFU at batch 64, 25 ms: 358 TFLOPS, 36 %
:::

## Try it

Do this exercise before you read the common mistakes. It uses the numbers from this lesson.

:::exercise
title: Measure the bandwidth of your own device
task: Write a PyTorch script that copies a 1 GB tensor ten times and reports the achieved bandwidth in GB per second. Run it on the GPU if you have one, or on the CPU. Then compute the MBU against the peak of your device (for example 3.35 TB/s for an H100, or the memory bandwidth from your CPU specification).
hint: A copy reads 1 GB and writes 1 GB, so count 2 GB per copy. On a GPU call torch.cuda.synchronize before you read the clock.
lang: python
solution:
import time, torch

n = 256 * 1024 * 1024                     # 256 M FP32 elements = 1 GB
device = "cuda" if torch.cuda.is_available() else "cpu"
x = torch.empty(n, device=device, dtype=torch.float32)
y = torch.empty_like(x)
for _ in range(3):
    y.copy_(x)                            # warm up
if device == "cuda":
    torch.cuda.synchronize()
t0 = time.time()
for _ in range(10):
    y.copy_(x)
if device == "cuda":
    torch.cuda.synchronize()
dt = (time.time() - t0) / 10
achieved = 2 / dt
print(device, "moves 2 GB per copy in", round(dt * 1000, 1), "ms:", round(achieved), "GB/s")
peak = 3350 if device == "cuda" else 50   # replace with the peak of your device
print("MBU:", round(achieved / peak * 100), "%")
:::

## Common mistakes

- Mistake: reading GPU-Util as a measure of efficiency. Fix: compute MBU for decode and MFU for prefill.
- Mistake: counting only the weights in the bytes moved. Fix: add the KV cache bytes read in the step, which grow with context length.
- Mistake: using the marketing peak with sparsity. Fix: use the dense peak for the format in use.

## Check your understanding

Answer each question, then read the explanation.

:::quiz
title: Check: GPU utilisation
q: A 16 GB model decodes at 6 ms per token on a GPU with 3.35 TB per second. What is the MBU?
- 40 percent
- 60 percent
* about 80 percent
- 100 percent
why: 16 GB in 0.006 s is 2.67 TB/s, and 2.67 / 3.35 is 0.8.
q: What does a high MBU with a low MFU tell you to do?
- Use CUDA graphs to cut launch overhead
* Raise the batch size or move fewer bytes, because memory bandwidth is the limit
- Lower the batch size to free the arithmetic units
- Switch to a faster attention kernel
why: The memory system is saturated while the arithmetic units idle, so each byte read must serve more tokens.
q: Why can nvidia-smi show 100 percent while the GPU does little work?
- It reports the memory fill, not the compute
* It counts time with any kernel running, not how much of the chip the kernel uses
- It reports the CPU side of the driver
- It averages over the last hour
why: A kernel on one streaming multiprocessor out of 132 still counts the whole interval as busy.
q: A batch of 64 tokens runs through a 70B model in 25 ms. The GPU peak is 990 TFLOPS. What is the MFU?
- 14 percent
* 36 percent
- 72 percent
- 99 percent
why: 2 times 70 billion times 64 is 8.96 TFLOPs; divided by 0.025 s that is 358 TFLOPS, or 36 percent of 990.
q: Both MBU and MFU are low on a decode server. Which fix matches?
- Quantise the weights to INT4
- Raise the batch size
* Reduce overhead with CUDA graphs, fewer kernel launches or a faster scheduler
- Add a second GPU with tensor parallelism
why: Neither the memory system nor the arithmetic units is busy, so the time goes to gaps between kernels.
:::

## Go further

The paper on efficiently scaling transformer inference derives the memory and compute floors used here. The FlashAttention paper shows how an IO-aware kernel raises both metrics in prefill. The PyTorch profiler documentation explains how to record a kernel timeline. Lilian Weng's post surveys the methods that move each metric, and Umar Jamil's channel explains the arithmetic of inference.
`,
          },
        ],
      },
    ],
  }
