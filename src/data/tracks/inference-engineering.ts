import type { Track } from '../types'

export const track: Track = {
    slug: 'inference-engineering',
    title: 'Inference Engineering',
    tagline: 'Serve large models fast and cheap.',
    description:
      'KV caches, batching, quantisation, speculative decoding, attention kernels, parallelism, the serving stack, and the measurements that decide what fits on a GPU.',
    accent: 'var(--accent-inference)',
    status: 'live',
    modules: [
      {
        slug: 'memory',
        title: 'Memory arithmetic',
        description: 'Count the bytes for weights, the KV cache, and activations before you buy a GPU.',
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

## The idea with an example

A transformer generates text one token at a time. To produce the next token, each attention layer compares the new token with every earlier token. For that comparison the layer needs the key vector and the value vector of each earlier token.

Without a cache, the engine recomputes all keys and values at every step. With a cache, the engine computes each key and value once and stores it.

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

Now remove grouped-query attention. The model then has 64 key-value heads instead of 8. The cache grows by a factor of 8 to 21.5 GB per sequence. Not one full-length sequence fits in 16 GB.

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

To size a server, use this procedure:

1. Compute the bytes per token: $2 \\times L \\times H_{kv} \\times d_{head} \\times b$.
2. Multiply by the longest context length you accept.
3. Subtract the weight memory and the engine overhead from the GPU memory.
4. Divide the remaining memory by the per-sequence cache size.
5. Round down. The result is the number of full-length sequences.

Note: most sequences are shorter than the maximum, so a real engine holds more sequences than this worst case.

## Common mistakes

- Mistake: use the number of query heads in the formula. Fix: use the number of key-value heads, which GQA makes much smaller.
- Mistake: forget the factor of 2 for keys and values. Fix: write the formula down and check every factor.
- Mistake: size the cache for the average prompt only. Fix: size for the longest context you accept, then let the scheduler fill the rest.

## Check your understanding

- Question: what is the cache per token for a model with $L = 32$, $H_{kv} = 8$, $d_{head} = 128$ in FP16? Answer: $2 \\times 32 \\times 8 \\times 128 \\times 2 = 131{,}072$ bytes, about 0.13 MB.
- Question: a model with 32 query heads and 4 key-value heads uses which number in the formula? Answer: 4, the number of key-value heads.
- Question: a 24 GB GPU has 8 GB free and each sequence needs 1.34 GB of cache. How many fit? Answer: 5, because $8 / 1.34 = 5.97$ rounds down.

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

## The idea with an example

Weight memory is a product of two numbers:

$$\\text{bytes} = N \\times b$$

$N$ is the number of weights. $b$ is the number of bytes per weight. FP16 uses 2 bytes. 8-bit integer (INT8) uses 1 byte. INT4 uses 0.5 bytes.

| Model | FP16 | INT8 | INT4 |
| --- | --- | --- | --- |
| 7B | 14 GB | 7 GB | 3.5 GB |
| 13B | 26 GB | 13 GB | 6.5 GB |
| 70B | 140 GB | 70 GB | 35 GB |

Now quantise four weights by hand. The values are 0.8, -1.2, 0.3 and 2.1. INT4 holds integers from -8 to 7. Use a symmetric scheme with one scale and no zero point.

1. Find the largest absolute value: 2.1.
2. Compute the scale: $s = 2.1 / 7 = 0.3$.
3. Divide each value by the scale and round to the nearest integer.
4. Store the four integers and the scale 0.3.

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

Activation quantisation stores the activations in INT8 as well. The scheme W8A8 means 8-bit weights and 8-bit activations. SmoothQuant moves the activation outliers into the weights, which are easier to quantise. W8A8 uses the faster integer arithmetic units, so it helps during prefill.

Quality drops in three situations:

- Small models. A 1B model has few redundant weights, so each error matters more.
- Outlier channels. Some channels hold values 100 times larger than the rest.
- Long reasoning tasks. Small errors compound over many generated tokens.

Caution: a quantised model can pass a perplexity test and still fail your task. Run your own evaluation before you ship.

## Common mistakes

- Mistake: quantise a 1B model to INT4 and expect the same quality as a 70B at INT4. Fix: keep small models at INT8 or FP16.
- Mistake: count only the weights and ignore the scales. Fix: add about 10 percent to the INT4 estimate for group size 128.
- Mistake: expect INT4 to speed up prefill. Fix: expect a speed-up in decode only; use W8A8 for prefill.
- Mistake: measure quality with perplexity only. Fix: run your task evaluation on the quantised model.

## Check your understanding

- Question: how much memory do the weights of a 13B model need in INT8? Answer: $13 \\times 10^9 \\times 1 = 13$ GB.
- Question: a group of 128 weights holds one value of 10 and 127 values below 0.1. What goes wrong? Answer: the scale becomes $10 / 7 = 1.43$ and the 127 small values all round to zero.
- Question: why does weight-only INT4 help decode but not prefill? Answer: decode reads the weights from memory for every token; prefill is limited by arithmetic, not by reads.

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

## The idea with an example

Take a 70B model in 4-bit integer (INT4) form on an 80 GB GPU. The budget has four parts:

| Part | Size | Note |
| --- | --- | --- |
| Weights | 35 GB | 70B weights at 0.5 bytes each |
| Engine overhead | 3 GB | CUDA context, kernels, buffers |
| Activation workspace | 2 GB | depends on batch size and prompt length |
| KV cache | the rest | 80 - 35 - 3 - 2 = 40 GB |

Each 8k-token sequence needs 2.68 GB of cache. Divide: $40 / 2.68 = 14.9$. The GPU can hold 14 full-length sequences at once.

Most engines do not use all 80 GB. vLLM has a setting named gpu-memory-utilization with a default of 0.9. That reserves 10 percent for the driver and for memory fragmentation. With 0.9, the engine sees 72 GB. The cache budget then drops to $72 - 35 - 3 - 2 = 32$ GB, which holds 11 full-length sequences.

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

The activation workspace holds the intermediate tensors of one forward pass. Its size scales with batch size times prompt length times hidden size. A chunked prefill limits the number of prompt tokens per step, which caps this tensor.

When one GPU does not fit, you have three options:

| Option | Memory per GPU | Cache budget | Trade-off |
| --- | --- | --- | --- |
| 1 GPU, 70B INT4 | 80 GB | 32 GB | lowest cost, small quality loss |
| 2 GPUs, 70B FP8 | 80 GB each | 2 x 32 GB | full quality, two GPUs |
| 2 GPUs, 70B FP16 | 80 GB each | 2 x 0 GB | does not fit |

The FP16 row shows a common failure. The usable total is 2 x 0.9 x 80 = 144 GB. The weights take 140 GB. After overhead on each GPU nothing remains for the cache. A 70B FP16 model needs four 80 GB GPUs for a useful cache.

Tensor parallelism splits every weight matrix across the GPUs. Each GPU holds one slice of the weights and one slice of the cache for every sequence.

Caution: a mixture-of-experts (MoE) model counts all experts in its weight memory, not only the active ones. Mixtral 8x7B has 47B weights and needs 94 GB in FP16.

## Common mistakes

- Mistake: subtract the weights from the full GPU memory. Fix: multiply by the utilisation fraction first.
- Mistake: forget the engine overhead. Fix: reserve 2 to 4 GB per GPU before you count the cache.
- Mistake: buy two GPUs for a FP16 70B model. Fix: compute the cache budget first; two GPUs leave no room.
- Mistake: count only active experts for an MoE model. Fix: count every expert, because all of them stay in memory.

## Check your understanding

- Question: a 24 GB GPU runs a 7B INT4 model with 3 GB overhead and 1 GB workspace at utilisation 0.9. What is the cache budget? Answer: $0.9 \\times 24 - 3.5 - 3 - 1 = 14.1$ GB.
- Question: that model needs 0.5 GB of cache per 4k sequence. How many fit? Answer: 28, because $14.1 / 0.5 = 28.2$.
- Question: why does a 70B FP16 model not fit on two 80 GB GPUs? Answer: the weights take 140 GB of a usable 144 GB, which leaves nothing for the cache.

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

## The idea with an example

Prefill processes the whole prompt in one forward pass. For a 1,000-token prompt the GPU multiplies a 1,000-row matrix by every weight matrix. It reads each weight once and uses it 1,000 times. The arithmetic units saturate. Prefill is compute-bound.

Decode produces one token per step. For each step the GPU reads every weight again and uses it once. The arithmetic units wait for memory. Decode is memory-bound.

The measure that separates the two cases is arithmetic intensity:

$$I = \\frac{\\text{FLOPs}}{\\text{bytes moved}}$$

$I$ is the arithmetic intensity. FLOPs is the number of floating-point operations. Bytes moved is the number of bytes read from GPU memory.

Now compute the ridge point of an H100 GPU. It performs about 990 TFLOPS in 16-bit floating point (FP16). Its memory delivers 3.35 TB per second. Divide: $990 / 3.35 = 295$ FLOPs per byte. Below 295 the GPU waits for memory. Above 295 it waits for arithmetic.

A 70B model in FP16 has 140 GB of weights. One decode step for one sequence does about 2 FLOPs per weight, so 140 GFLOPs. It reads all 140 GB. The intensity is $2$ FLOPs per byte, far below 295. The step time is set by the memory read: $140 / 3350 = 0.042$ seconds, or 42 ms per token. No kernel can beat this number on one GPU.

## How it works

Batching fixes the intensity. If 32 sequences decode together, the GPU reads the weights once and does 32 times the arithmetic. The intensity rises to $2 \\times 32 = 64$ FLOPs per byte. The step still takes about 42 ms, but it produces 32 tokens.

| Batch size | FLOPs per byte | Tokens per 42 ms step | Tokens per second |
| --- | --- | --- | --- |
| 1 | 2 | 1 | 24 |
| 8 | 16 | 8 | 190 |
| 32 | 64 | 32 | 760 |
| 128 | 256 | 128 | 3,050 |
| 256 | 512 | 256 | 3,900 (now compute-bound) |

Above batch 148 the intensity crosses the ridge point. The step time then grows with the batch, and throughput stops growing in proportion.

Note: the key-value (KV) cache read also grows with the batch. At batch 128 with 4k-token sequences the cache read is $128 \\times 1.34 = 172$ GB, larger than the weights. The real ridge arrives sooner than the table shows.

To estimate the decode floor for any model and GPU:

1. Compute the weight bytes: number of weights times bytes per weight.
2. Divide by the memory bandwidth of the GPU in bytes per second.
3. The result is the shortest time per decode step at batch size 1.
4. Multiply the batch size by 2 FLOPs per weight to get the intensity.
5. Compare it with the ridge point to find whether the batch is memory-bound or compute-bound.

Prefill needs the opposite treatment. A 1,000-token prompt already has intensity $2 \\times 1000 = 2000$. Larger batches do not help prefill, and they delay the decode steps of other sequences. A later lesson on disaggregation handles this conflict.

## Common mistakes

- Mistake: measure tokens per second at batch size 1 and call it the server capacity. Fix: measure at the batch size you plan to run.
- Mistake: buy a GPU for its FLOPS when you serve decode. Fix: compare memory bandwidth, because decode reads weights.
- Mistake: expect a faster kernel to cut decode time below the memory floor. Fix: compute the floor first; then reduce bytes with quantisation.
- Mistake: ignore the KV cache in the bytes moved. Fix: add the cache read for every sequence in the batch.

## Check your understanding

- Question: a GPU does 400 TFLOPS and moves 2 TB per second. What is its ridge point? Answer: $400 / 2 = 200$ FLOPs per byte.
- Question: a 7B FP16 model decodes on that GPU. What is the shortest step time at batch 1? Answer: $14 / 2000 = 7$ ms.
- Question: at what batch size does that model cross the ridge point? Answer: $200 / 2 = 100$ sequences.

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

With continuous batching the engine checks the batch after every step. When the 10-token request finishes at step 10, its slot is free. A waiting request takes the slot at step 11. The same happens at steps 50 and 100. If the queue has enough work, every slot in every step does useful work. Waste falls from 55 percent to near zero.

| Method | Steps | Slots used | Useful slots | Waste |
| --- | --- | --- | --- | --- |
| Static | 200 | 800 | 360 | 55 % |
| Continuous, empty queue | 200 | 800 | 360 | 55 % |
| Continuous, full queue | 200 | 800 | 800 | 0 % |

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

## Common mistakes

- Mistake: set max_num_seqs far above the cache budget. Fix: compute the sequences that fit, then set the limit a little above that number.
- Mistake: benchmark with requests of equal length. Fix: use a length mix from production logs, because equal lengths hide the gain.
- Mistake: leave chunked prefill off and then see time per token spike. Fix: enable it and set a chunk size near 512 tokens.
- Mistake: treat preemption as free. Fix: watch the preemption counter and add memory before it rises.

## Check your understanding

- Question: three requests need 20, 40 and 100 tokens and the batch has 3 slots. How many slots does static batching waste? Answer: $300 - 160 = 140$ slots.
- Question: what event frees a slot in continuous batching? Answer: a sequence produces its end token or reaches its length limit.
- Question: why does chunked prefill lower the delay for decode sequences? Answer: it spreads the prompt work over many steps instead of one long step.

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

Suppose the first three tokens pass and "down" fails. The engine replaces "down" with a sample from the target model, "on". The step produced 4 tokens: "the", "cat", "sat", "on". A plain decode step produces 1 token for the same weight read.

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

The method loses in two cases. At high batch size the target model is already compute-bound, so the verification pass costs $k$ times more and the gain vanishes. At low acceptance rate, below about 0.5, the draft work exceeds the saved work.

Two variants remove the separate draft model. Medusa adds extra output heads to the target model, and each head predicts one future token. EAGLE predicts the next hidden state of the target model with a small head and decodes drafts from it, which gives higher acceptance.

## Common mistakes

- Mistake: pick a draft model with a different tokenizer. Fix: use a draft that shares the exact vocabulary of the target.
- Mistake: enable speculative decoding on a server at batch size 128. Fix: use it for latency at low batch, not for throughput at high batch.
- Mistake: accept all draft tokens to save time. Fix: keep the rejection rule, or the output distribution changes.
- Mistake: set $k$ to 10 and expect 10 tokens per step. Fix: compute the expected tokens from $\\alpha$; past $k = 5$ the gain is small.

## Check your understanding

- Question: what is the expected number of tokens per step with $\\alpha = 0.6$ and $k = 3$? Answer: $(1 - 0.6^4) / 0.4 = 2.18$.
- Question: a draft token has $q = 0.5$ and the target gives $p = 0.2$. What is the acceptance probability? Answer: $\\min(1, 0.2 / 0.5) = 0.4$.
- Question: why does the gain vanish at high batch size? Answer: the target pass becomes compute-bound, so verifying $k$ tokens costs $k$ times more.

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

With disaggregation the prefill pool handles the prompt. The decode pool never sees it. The 32 streams keep their 30 ms pace. When the prefill finishes, the engine copies the KV cache of the prompt to a decode GPU and the stream starts.

Compute the copy cost. A 70B model with grouped-query attention stores about 0.33 MB of cache per token. The prompt has 4,000 tokens: $4000 \\times 0.33 = 1{,}320$ MB, about 1.3 GB. Over an NVLink connection at 400 GB per second, the copy takes $1.3 / 400 = 0.0033$ seconds, about 3 ms. Over a 100 Gb per second network, it takes about 105 ms.

| Link | Bandwidth | Copy time for 1.3 GB |
| --- | --- | --- |
| NVLink | 400 GB/s | 3 ms |
| PCIe 5 x16 | 64 GB/s | 20 ms |
| 400 Gb Ethernet | 50 GB/s | 26 ms |
| 100 Gb Ethernet | 12.5 GB/s | 105 ms |

Within one node the copy is cheap compared with a 300 ms prefill.

## How it works

The request path has five stages:

1. The router sends the prompt to a prefill GPU.
2. The prefill GPU runs one forward pass, produces the first token, and writes the KV cache.
3. The engine copies the cache to a decode GPU over the fastest available link.
4. The decode GPU adds the sequence to its batch and streams tokens.
5. The prefill GPU frees the cache and takes the next prompt.

The two pools want different settings. The prefill pool is compute-bound, so it benefits from large chunks and high tensor parallelism. The decode pool is memory-bound, so it benefits from large batches and a large cache budget.

Size the pools from the ratio of work. Take a request with a 2,000-token prompt and a 300-token answer. Suppose one prefill GPU sustains 20,000 prompt tokens per second and one decode GPU sustains 2,000 output tokens per second. Then:

$$\\frac{N_p}{N_d} = \\frac{2000 / 20000}{300 / 2000} = \\frac{0.1}{0.15} = 0.67$$

$N_p$ is the number of prefill GPUs and $N_d$ the number of decode GPUs. For every 3 decode GPUs you need 2 prefill GPUs. Measure the two rates on your own hardware before you set the ratio.

Note: DistServe and Splitwise both report 2 to 4 times more requests per GPU than a shared engine at the same latency targets.

## Common mistakes

- Mistake: disaggregate across a 10 Gb network. Fix: keep the two pools inside one node or on a fast fabric.
- Mistake: size both pools equal. Fix: compute the ratio from measured prefill and decode rates.
- Mistake: tune both pools with the same tensor parallel degree. Fix: give the prefill pool more parallelism and the decode pool more cache.
- Mistake: adopt disaggregation for a server with short prompts. Fix: use chunked prefill first; disaggregation pays off with long prompts.

## Check your understanding

- Question: a prompt has 10,000 tokens at 0.13 MB of cache per token. How long does the copy take at 400 GB/s? Answer: 1.3 GB divided by 400 GB/s is about 3 ms.
- Question: why does a single long prefill step hurt the other sequences? Answer: all sequences share one step, so every stream waits for the prefill to finish.
- Question: a decode GPU sustains 1,000 tokens per second and a prefill GPU 10,000. Requests have 1,000 prompt tokens and 100 answer tokens. What is the GPU ratio? Answer: $(1000/10000)/(100/1000) = 1$, one prefill GPU per decode GPU.

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

## How it works

The kernel splits the query, key, and value matrices into blocks. A block is small enough to fit in SRAM. The procedure for one block of queries is:

1. Load the query block into SRAM once.
2. Load one key block and one value block.
3. Compute the block of scores in SRAM.
4. Update the running maximum, the running sum, and the running output with the rescale step above.
5. Repeat from step 2 for the next key block.
6. Divide the running output by the running sum and write the final output to HBM.

The score matrix never exists in HBM. So memory grows linearly with $T$ instead of quadratically. The table shows the score-matrix memory for one layer with 64 heads in FP16.

| Sequence length T | Standard attention | FlashAttention extra memory |
|---|---|---|
| 2,048 | 537 MB | a few MB |
| 8,192 | 8.6 GB | a few MB |
| 32,768 | 137 GB | a few MB |

Note: FlashAttention changes the order of the arithmetic, not the result. The output matches standard attention up to floating-point rounding.

FlashAttention-2 reorders the loops and the work split across GPU threads, and about doubles the speed. FlashAttention-3 uses the asynchronous memory and FP8 features of the Hopper GPUs for another large gain. In PyTorch, call torch.nn.functional.scaled_dot_product_attention and the library selects a fused kernel when the shapes allow it.

## Common mistakes

- Mistake: you call FlashAttention an approximation. Fix: it is exact; the online softmax rescale makes the result identical in exact arithmetic.
- Mistake: you write your own attention with explicit matrix multiplication and softmax. Fix: use the fused entry point so the score matrix stays in SRAM.
- Mistake: you measure memory at short context and expect the same at long context. Fix: the standard score matrix grows with $T^2$, so test at the longest context you serve.

## Check your understanding

- How many bytes does the score matrix for one head use at $T = 4,096$ in FP16? Answer: $4096^2 \\times 2 = 33.5$ MB.
- Which two running values does the online softmax keep? Answer: the running maximum and the running sum of exponentials.
- Why does the kernel rescale the old sum when a new block arrives? Answer: the maximum can rise, and all old exponentials must use the new maximum.

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

The paged layout also grows with the sequence. When token 81 arrives, the engine allocates one more block.

## How it works

Two kinds of waste exist. Internal fragmentation is empty space inside a reserved region. The contiguous layout had 1,978 slots of internal fragmentation. External fragmentation is free memory split into pieces too small to use. The contiguous layout suffers from it when sequences of different lengths finish in a random order. Paged attention limits internal fragmentation to less than one block per sequence. It removes external fragmentation because every free block has the same size and fits any request.

The attention kernel reads the block table during the computation. For query token $t$ and key position $j$, the kernel computes the block index $\\lfloor j / B \\rfloor$ and the offset $j \\bmod B$. Here $B$ is the block size. It looks up the physical block address in the table and reads the key and value from that address. The extra lookup costs a little time, so engines tune $B$ between 8 and 32 tokens.

The block table also enables sharing. Several sequences can point at the same physical block. Parallel sampling produces many answers from one prompt, and beam search keeps many candidates with a common prefix. All of them share the prompt blocks. The engine keeps a reference count on each block. When one sequence wants to write into a shared block, the engine copies that block first and then writes into the copy. This is copy-on-write.

When memory runs out, the engine evicts. The scheduler picks a sequence, frees all of its blocks, and marks it as preempted. Later it recomputes the cache from the prompt. The procedure to size a cache pool is:

1. Compute the bytes per token with $2 \\times L \\times H_{kv} \\times d_{\\text{head}} \\times b$. Here $L$ is the layer count, $H_{kv}$ the KV heads, $d_{\\text{head}}$ the head dimension, and $b$ the bytes per element.
2. Multiply by the block size $B$ to get bytes per block.
3. Divide the free GPU memory after weights by bytes per block to get the block count.

## Common mistakes

- Mistake: you set a very small block size to reduce waste. Fix: tiny blocks increase table lookups and kernel overhead; 16 is a good default.
- Mistake: you reserve the cache for the maximum context length per request. Fix: let the engine allocate blocks on demand.
- Mistake: you ignore preemption in load tests. Fix: watch the preemption counter; frequent preemption means the cache pool is too small.

## Check your understanding

- How many blocks of size 16 does a 100-token sequence need, and how many slots are empty? Answer: 7 blocks, 12 empty slots.
- Which kind of fragmentation does paged attention remove completely? Answer: external fragmentation.
- When does copy-on-write copy a block? Answer: when a sequence writes into a block that other sequences still share.

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

## The idea with an example

An attention layer has $H$ query heads. Each query head needs a key head and a value head to attend to.

- MHA gives each query head its own key and value head. The number of KV heads is $H$.
- MQA gives all query heads one shared key head and one shared value head. The number of KV heads is 1.
- GQA puts the query heads into $G$ groups. Each group shares one key head and one value head. The number of KV heads is $G$.

The cache size per sequence is:

$$\\text{bytes} = 2 \\times L \\times H_{kv} \\times d_{\\text{head}} \\times T \\times b$$

The factor 2 covers keys and values. $L$ is the number of layers, $H_{kv}$ is the number of KV heads, and $d_{\\text{head}}$ is the head dimension. $T$ is the number of tokens, and $b$ is the bytes per element. Take a 70B-class model with $H = 64$, $d_{\\text{head}} = 128$, and $L = 80$. Use $T = 8192$ and $b = 2$ for FP16 (16-bit floating point).

1. MHA: $H_{kv} = 64$. Bytes $= 2 \\times 80 \\times 64 \\times 128 \\times 8192 \\times 2 = 21.5$ GB.
2. GQA with 8 groups: $H_{kv} = 8$. Bytes $= 21.5 / 8 = 2.7$ GB.
3. MQA: $H_{kv} = 1$. Bytes $= 21.5 / 64 = 0.34$ GB.

| Layout | KV heads | Cache at 8,192 tokens | Sequences in 40 GB of free memory |
|---|---|---|---|
| MHA | 64 | 21.5 GB | 1 |
| GQA (8 groups) | 8 | 2.7 GB | 14 |
| MQA | 1 | 0.34 GB | 119 |

## How it works

The cache size also sets the bytes read per decoded token. For one new token the kernel reads the keys and values of every previous token. For MHA at 8,192 tokens that is 21.5 GB per sequence per step. A GPU with 3.35 TB/s of HBM bandwidth needs 6.4 ms for that read alone. With GQA the read falls to 0.8 ms. With MQA it falls to 0.1 ms. The compute for attention is the same in all three cases, so GQA and MQA raise the arithmetic intensity of the step. Arithmetic intensity is the number of floating-point operations per byte moved.

Quality follows the number of KV heads. The GQA paper shows that 8 groups match MHA quality within noise on summarisation and translation. MQA loses a small but measurable amount of quality and trains less stably. Most teams pick $G = 8$ because it also matches the 8 GPUs in a tensor-parallel node, so each GPU holds one KV head.

You do not have to train a GQA model from scratch. The procedure to convert an MHA checkpoint is:

1. Group the $H$ key heads into $G$ groups of $H / G$ heads.
2. Replace each group with the mean of its key projection weights.
3. Do the same for the value heads.
4. Continue training on a small fraction of the original data, about 5 percent, so the model adapts.

The GQA paper calls this uptraining, and it recovers nearly all of the quality.

## Common mistakes

- Mistake: you size the cache with the number of query heads. Fix: use the number of KV heads from the model configuration file.
- Mistake: you assume MQA is always the right choice because the cache is smallest. Fix: measure the quality loss on your task; GQA with 8 groups is usually the safer choice.
- Mistake: you set tensor parallelism larger than the number of KV heads. Fix: the engine must then copy KV heads across GPUs, which wastes memory.

## Check your understanding

- A model has 32 query heads and 4 KV heads. By what factor is the cache smaller than MHA? Answer: 8 times.
- Why does GQA speed up decode even though the compute is the same? Answer: the step reads fewer bytes from HBM, and decode is bandwidth-bound.
- How does uptraining build the GQA key heads from the MHA checkpoint? Answer: it takes the mean of the key projection weights within each group.

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

Attention splits by head. A model with 64 heads places 16 heads on each of 4 GPUs. Each GPU computes attention for its heads. The output projection is row-split like $B$, so it ends with one more all-reduce. Each layer therefore performs two all-reduce steps.

The memory arithmetic for a 70B model in FP16 on 4 GPUs is:

1. Weights: $140 / 4 = 35$ GB per GPU.
2. The key-value (KV) cache also splits by head, so each GPU holds a quarter of the cache.
3. Each GPU has 80 GB, so $80 - 35 = 45$ GB remains for the cache and activations.

## How it works

The communication volume per all-reduce is the size of the activation tensor. Each all-reduce moves about $2 \\times N \\times d \\times b$ bytes per GPU. $N$ is the number of tokens in the batch, $d$ is the hidden size, and $b$ is the bytes per element. The factor 2 comes from the reduce-scatter and the all-gather phases of a ring all-reduce. Take a decode step with 32 sequences, so $N = 32$, $d = 8192$, and $b = 2$:

$$2 \\times 32 \\times 8192 \\times 2 = 1{,}048{,}576 \\text{ bytes} \\approx 1 \\text{ MB per all-reduce}$$

An 80-layer model performs 160 all-reduce steps per token. That is about 160 MB per decode step. The volume is small, but each all-reduce has a fixed latency of 10 to 30 microseconds on NVLink. So communication adds 2 to 5 ms per decode step before any bytes move. The table compares the two link types in a typical server.

| Link | Bandwidth per GPU | All-reduce latency | 160 all-reduce steps |
|---|---|---|---|
| NVLink inside a node | 900 GB/s | about 20 us | about 3 ms |
| Ethernet between nodes | 50 GB/s | about 200 us | about 32 ms |

This is why engines keep tensor parallelism inside one node. Across nodes the latency per layer grows ten times.

The procedure to set tensor parallelism in a serving engine is:

1. Compute weight bytes: weight count times bytes per element.
2. Divide by the GPU memory to get the smallest TP degree that fits with room for the cache.
3. Round up to a divisor of the number of attention heads and the number of KV heads.
4. Confirm that all GPUs in the group sit on the same NVLink fabric.

Caution: a TP degree that does not divide the number of KV heads forces the engine to copy KV heads. The cache per GPU then stops shrinking.

## Common mistakes

- Mistake: you run tensor parallelism across two servers over Ethernet. Fix: keep TP inside a node and use pipeline parallelism across nodes.
- Mistake: you pick TP = 3 for a model with 32 heads. Fix: pick a divisor of the head count, such as 2, 4, or 8.
- Mistake: you expect the step time to fall by the TP factor. Fix: the fixed all-reduce latency does not shrink, so the gain flattens.

## Check your understanding

- How much weight memory does each GPU hold for a 70B FP16 model at TP = 8? Answer: 17.5 GB.
- How many all-reduce steps happen per token in a 32-layer model? Answer: 64.
- Why does the MLP need only one all-reduce? Answer: the column split of the first matrix needs no communication, and the row split of the second needs one sum.

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

## How it works

With $S$ stages and $M$ micro-batches, each stage spends $M$ time units on useful work. The ramp-up and ramp-down add $S - 1$ idle units. The bubble fraction is:

$$\\text{bubble} = \\frac{S - 1}{M + S - 1}$$

$S$ is the number of stages, and $M$ is the number of micro-batches in one batch. Work through two cases with $S = 4$.

1. $M = 8$: bubble $= 3 / (8 + 3) = 3 / 11 = 27$ percent of the time is idle.
2. $M = 32$: bubble $= 3 / (32 + 3) = 3 / 35 = 8.6$ percent of the time is idle.

More micro-batches shrink the bubble. But each micro-batch must be large enough to keep a GPU efficient, so $M$ has a practical limit.

Two schedules are common. GPipe runs all $M$ forward passes, then all $M$ backward passes. It is simple, but it stores the activations of all $M$ micro-batches until the backward passes start. The one-forward-one-backward (1F1B) schedule from PipeDream starts the backward pass of micro-batch 1 as soon as it is ready. Each stage then holds the activations of at most $S$ micro-batches. The bubble fraction is the same, but the memory is much lower.

For serving there is no backward pass. The engine fills the pipeline with different requests instead of micro-batches of one batch. The common layout places tensor parallelism inside each node and pipeline parallelism across nodes. A model with 2 nodes of 8 GPUs runs with TP = 8 and PP = 2. The procedure to set it up is:

1. Divide the layers into $S$ groups with equal compute per group.
2. Give the first and last stage fewer layers if they also hold the embedding and output matrices.
3. Set the number of in-flight requests to at least $S$ so every stage stays busy.
4. Measure the time per stage and move layers until the stages balance.

Note: the latency of one request is the sum of the stage times plus the transfer times. Pipeline parallelism raises throughput but does not cut the latency of a single request.

## Common mistakes

- Mistake: you use one micro-batch and see a 75 percent idle rate on 4 stages. Fix: raise the number of micro-batches until the bubble is below 10 percent.
- Mistake: you split the layers into equal counts and ignore the embedding matrix. Fix: balance by measured stage time, not by layer count.
- Mistake: you use pipeline parallelism inside a node to lower latency. Fix: use tensor parallelism inside a node; pipeline parallelism adds latency.

## Check your understanding

- What is the bubble fraction for 8 stages and 56 micro-batches? Answer: $7 / 63 = 11$ percent.
- What crosses the link between two pipeline stages? Answer: the activation tensor of one micro-batch, not the weights.
- Why does 1F1B use less memory than GPipe? Answer: it frees the activations of each micro-batch as soon as its backward pass is done.

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

| Configuration | Bytes per weight per GPU | 7B model, 8 GPUs |
|---|---|---|
| Plain data parallelism | 16 | 112 GB |
| ZeRO stage 1 | $4 + 12/N$ | 38.5 GB |
| ZeRO stage 2 | $2 + 14/N$ | 26.25 GB |
| ZeRO stage 3 | $16/N$ | 14 GB |

## How it works

In the table, $N$ is the number of data-parallel GPUs. Each stage adds communication. Stages 1 and 2 cost the same as plain data parallelism. Each step does one reduce-scatter of the gradients and one all-gather of the updated weights. Stage 3 adds more. Before each layer runs, the GPUs all-gather the weights of that layer, use them, and then drop them. This happens in the forward pass and again in the backward pass. The total traffic is about 1.5 times that of plain data parallelism.

PyTorch implements the same idea as Fully Sharded Data Parallel (FSDP). FSDP shards the weights, gradients, and optimizer state of each layer and gathers them on demand. DeepSpeed implements the three stages and adds offload to central processor (CPU) memory and disk.

For serving, data parallelism means independent replicas. Each replica is a full engine with its own weights and key-value (KV) cache. A load balancer in front sends each request to one replica. The procedure to scale serving is:

1. Tune one replica until its throughput stops rising with batch size.
2. Measure its throughput at the target latency.
3. Divide the required load by that throughput to get the replica count.

## Common mistakes

- Mistake: you count only the 2 bytes of FP16 weights when you size training. Fix: count all 16 bytes, including the optimizer state.
- Mistake: you choose stage 3 on Ethernet and wonder why the step time doubled. Fix: use stage 2 inside a node, or add faster links.
- Mistake: you keep a sharded checkpoint and try to load it on a different GPU count. Fix: save a consolidated checkpoint, or use a loader that reshards.

## Check your understanding

- How many bytes per weight does ZeRO stage 3 need on 16 GPUs? Answer: 1 byte.
- Which tensor does stage 2 shard that stage 1 does not? Answer: the gradients.
- Why does stage 3 cost more communication? Answer: it all-gathers the weights of every layer in both the forward and backward passes.

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

| Layout | Nodes | Weights per GPU | Free for cache | Communication | Latency note |
|---|---|---|---|---|---|
| FP16, TP 8, PP 2 | 2 | 51 GB | 470 GB | NVLink all-reduce plus one cross-node hop | sum of two stage times |
| FP8, TP 8, PP 1 | 1 | 51 GB | 235 GB | NVLink all-reduce only | lowest per token |
| FP8, TP 8, PP 2 | 2 | 25 GB | 875 GB | NVLink all-reduce plus one hop | highest throughput |

The second layout gives the lowest latency because no request crosses a node. The third gives the highest throughput because the large cache pool holds the most concurrent sequences. The first is the choice when you cannot accept any quantisation loss.

## How it works

The general recipe has four steps.

1. Fit the model. Choose the precision, then raise TP inside a node until the weights fit with at least a third of the memory left. Cap TP at the GPU count in a node and at the number of KV heads.
2. Span nodes only if step 1 fails. Add PP stages across nodes.
3. Add replicas. Each TP times PP group is one replica. Divide the required throughput by the throughput of one replica to get the DP count.
4. Check the links. Compute the bytes per step on each link and divide by the link bandwidth. If that time is a large fraction of the step time, reduce the degree on that link.

Take a TP group with $L$ layers, $N$ tokens per step, hidden size $d$, and $b$ bytes per element. The all-reduce traffic per step is about:

$$\\text{bytes per step} = 2 \\times L \\times 2 \\times N \\times d \\times b$$

The first 2 counts the two all-reduce steps per layer, and the second 2 counts the two phases of each all-reduce. With $L = 126$, $N = 64$, $d = 16384$, and $b = 2$ this is 1.06 GB per step. That takes about 1.2 ms at 900 GB/s. Over Ethernet at 50 GB/s it is 21 ms, which is why TP stays on NVLink.

Mixture-of-experts (MoE) models add expert parallelism (EP). An MoE layer has many expert MLPs, and each token visits only a few of them. Expert parallelism places different experts on different GPUs and routes each token to the GPU that holds its expert with an all-to-all exchange.

## Common mistakes

- Mistake: you raise TP across nodes because PP looks harder to configure. Fix: cross-node TP multiplies the per-layer latency; use PP across nodes.
- Mistake: you fit the weights exactly and leave 5 GB for the cache. Fix: leave at least a third of the memory for the cache and activations.
- Mistake: you apply tensor parallelism to an MoE layer and copy every expert to every GPU. Fix: use expert parallelism so each GPU holds a subset of experts.

## Check your understanding

- A 70B FP16 model on 80 GB GPUs: what is the smallest TP that leaves a third of the memory free? Answer: TP = 4 (35 GB weights, 45 GB free).
- Which layout gives the lowest latency for the 405B example? Answer: FP8 with TP = 8 on one node.
- What communication pattern does expert parallelism use? Answer: an all-to-all exchange of tokens between GPUs.

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

## The idea with an example

An engine runs a loop. Each pass through the loop is one step. In each step the engine runs one forward pass of the model for one batch of tokens.

Consider three requests at the start of a step:

| Request | State | Tokens needed this step |
|---|---|---|
| A | New, prompt of 500 tokens | 500 (prefill) |
| B | Mid-decode, 40 tokens generated | 1 (decode) |
| C | Mid-decode, 12 tokens generated | 1 (decode) |

The scheduler has a token budget of 2,048 tokens per step. The engine calls this limit max_num_batched_tokens. The scheduler counts: 500 + 1 + 1 = 502 tokens. The total is below 2,048, so all three requests fit in one batch.

The key-value (KV) cache stores the keys and values of every token already processed. The cache is split into blocks of 16 tokens. Request A needs 500 / 16 = 31.25, so 32 blocks. Requests B and C each need one more token, so each one may need one new block. The block manager checks that 34 free blocks exist. If they do, the scheduler admits A.

The model runner then executes one forward pass over 502 tokens. The sampler picks one new token for A, one for B, and one for C. The detokenizer turns each token into text. The scheduler appends the new tokens and moves A into the decode state. The next step starts.

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

## Common mistakes

- Mistake: setting the token budget to the context length. Fix: set it to a few thousand tokens so decode requests do not wait for one long prefill.
- Mistake: reading the number of running requests as throughput. Fix: measure tokens per second at the sampler.
- Mistake: giving the engine 99 percent of GPU memory. Fix: leave room for activations, or the model runner fails on a large batch.
- Mistake: ignoring preemption counts in the logs. Fix: treat a rising preemption count as a sign that the cache is too small for the load.

## Check your understanding

- Question: what does the scheduler check before it admits a new request? Answer: that enough free KV cache blocks and token budget remain for this step.
- Question: in the example, why does request A need 32 blocks? Answer: 500 tokens divided by a block size of 16 is 31.25, so the engine rounds up to 32.
- Question: what does preemption by recompute cost? Answer: the engine runs prefill again for the preempted sequence.

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

## The idea with an example

A product has a system prompt of 1,200 tokens. Every user message adds about 200 tokens. The KV cache uses blocks of 16 tokens.

The system prompt fills 1,200 / 16 = 75 full blocks. The first request computes all of them. When the request finishes, the engine keeps the 75 blocks in a cache table. The key of each block is a hash. The hash covers the token ids in the block and the hash of the previous block. The chain of hashes means that a block matches only when every earlier block also matches.

The second request arrives. The engine hashes its first 75 blocks and finds every one in the table. It links the new request to those blocks and does not compute them. The user part of 200 tokens needs 200 / 16 = 12.5, so 13 blocks. The engine runs prefill on 200 tokens instead of 1,400 tokens.

| Quantity | Without caching | With caching |
|---|---|---|
| Prefill tokens per request | 1,400 | 200 |
| Prefill time (illustrative) | 70 ms | 12 ms |
| KV blocks computed | 88 | 13 |

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

The saving in prefill tokens for a request is $s = n_{shared} - (n_{shared} \\bmod b)$. Here $n_{shared}$ is the number of shared prefix tokens and $b$ is the block size. The modulo removes the last partial block, because the engine still computes that block.

When memory is full, the engine evicts cached blocks. Most engines evict the least recently used blocks first. A block with a reference count above zero is in use and cannot be evicted.

SGLang stores the cache as a radix tree. A radix tree is a tree in which each edge holds a run of tokens. Two prompts that share a prefix share a path from the root. The match is a walk down the tree. This structure handles many different shared prefixes at once, for example one prefix per customer.

Caution: a change at the start of the prompt changes the first hash, and the chain breaks for every later block. A timestamp or a user name at the top of the system prompt disables the cache for the whole prefix.

## Common mistakes

- Mistake: putting the date or the user name at the start of the system prompt. Fix: put variable content after the fixed content.
- Mistake: expecting a saving when the prefix is shorter than one block. Fix: measure the shared prefix in blocks, not in tokens.
- Mistake: sending the few-shot examples in a different order for each request. Fix: fix the order so that the token sequence is identical.
- Mistake: running the load test with random prompts and reporting the hit rate. Fix: replay real prompts so the hit rate matches production.

## Check your understanding

- Question: why does the hash of a block include the hash of the previous block? Answer: so that a block matches only when the whole prefix before it matches.
- Question: a shared prefix is 1,000 tokens and the block size is 16. How many tokens does the engine skip? Answer: 992 tokens, because 62 full blocks cover 992 tokens and the last 8 tokens form a partial block.
- Question: which blocks can the engine evict? Answer: blocks with a reference count of zero, starting with the least recently used.

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

## The idea with an example

A request asks for an answer of 300 tokens. The engine decodes at 30 ms per token.

| Quantity | Value |
|---|---|
| Prefill time (time to first token) | 400 ms |
| Decode time per token | 30 ms |
| Total decode time | 300 × 30 ms = 9.0 s |
| Total request time | 9.4 s |

Without streaming the client waits 9.4 s and then receives the whole text. With streaming the client receives the first token at 400 ms. A person reads about 5 tokens per second, and the engine produces about 33 tokens per second. The text arrives faster than the user reads it.

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

The user-visible latency has two parts. The time to first token (TTFT) is the prefill time plus any queue time. The time per output token (TPOT) is the decode time per step. The total time is:

$$T = \\text{TTFT} + (n - 1) \\times \\text{TPOT}$$

Here $T$ is the total time, $n$ is the number of output tokens, and the first token arrives at TTFT.

Back-pressure happens when the client reads slower than the engine writes. The socket buffer fills. The API server must not block the engine loop on a slow socket, so it drains a per-request queue in a separate task.

When a client disconnects, the API server detects the closed socket. It must then cancel the request in the scheduler. The scheduler removes the sequence and frees its key-value (KV) cache blocks. If the server does not cancel, the engine decodes to the end for a client that is gone.

Caution: a missing cancel path wastes GPU time on every abandoned request. Test it by killing a client mid-stream and checking the running sequence count.

A tool call is a JSON object the model writes instead of prose. Engines stream it in fragments, one delta per event, with the same SSE format. The client appends the fragments and parses the JSON only after the final event, because a partial JSON string does not parse.

## Common mistakes

- Mistake: buffering the whole response in a proxy between the engine and the client. Fix: disable response buffering in the proxy for the streaming route.
- Mistake: parsing each SSE event as complete JSON for a tool call. Fix: join the fragments and parse once after the final event.
- Mistake: decoding each token id to text on its own. Fix: let the detokenizer hold incomplete UTF-8 bytes until the character is complete.
- Mistake: ignoring a client disconnect. Fix: cancel the request and free its cache blocks.

## Check your understanding

- Question: a response has 200 tokens, TTFT is 300 ms, and TPOT is 25 ms. What is the total time? Answer: 300 ms + 199 × 25 ms = 5.275 s.
- Question: why does the detokenizer sometimes emit nothing for a token? Answer: the token bytes do not yet form a complete UTF-8 character.
- Question: what must the server do when a client disconnects mid-stream? Answer: cancel the request in the scheduler so the engine frees the KV cache blocks.

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

The same engine serves three request shapes with different results:

| Shape | Input tokens | Output tokens | TTFT | Decode time | End-to-end |
|---|---|---|---|---|---|
| Chat turn | 200 | 150 | 20 ms | 3.725 s | 3.745 s |
| Retrieval prompt | 4,000 | 300 | 400 ms | 7.475 s | 7.875 s |
| Long summary | 20,000 | 100 | 2,000 ms | 2.475 s | 4.475 s |

The long summary has the slowest TTFT but a short total time. The chat turn has the fastest TTFT but spends almost all of its time in decode. Only the pair of numbers describes each shape.

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

## Common mistakes

- Mistake: reporting only the mean latency. Fix: report p50, p95, and p99, and look at the p99 first.
- Mistake: measuring TTFT at the engine instead of at the client. Fix: measure at the client, so queue time and network time are included.
- Mistake: comparing two engines with different output lengths. Fix: fix the prompt set and the output length, or compare TPOT directly.
- Mistake: tuning batch size for throughput and forgetting TPOT. Fix: set a TPOT target first, then raise batch size until the target breaks.

## Check your understanding

- Question: a prompt of 5,000 tokens runs prefill at 10,000 tokens per second with no queue. What is the TTFT? Answer: 500 ms.
- Question: TTFT is 300 ms, TPOT is 40 ms, and the answer has 101 tokens. What is the end-to-end latency? Answer: 300 ms + 100 × 40 ms = 4.3 s.
- Question: what does a p99 TTFT of 2 s tell you? Answer: one percent of requests wait 2 s or more for the first token.

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

A load test now ramps the number of concurrent requests. Each row records the p99 of TTFT and TPOT and the fraction of requests inside the SLO:

| Concurrency | Throughput (req/s) | TTFT p99 | TPOT p99 | Inside SLO | Goodput (req/s) |
|---|---|---|---|---|---|
| 1 | 0.5 | 0.3 s | 25 ms | 100% | 0.5 |
| 4 | 1.9 | 0.4 s | 28 ms | 100% | 1.9 |
| 16 | 6.5 | 0.7 s | 38 ms | 95% | 6.2 |
| 64 | 14.0 | 1.6 s | 65 ms | 30% | 4.2 |
| 128 | 15.0 | 4.0 s | 120 ms | 5% | 0.75 |

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

Caution: a closed-loop test at low concurrency can hide a capacity problem. Production traffic is open-loop, and a burst above the knee builds a queue that does not drain.

## Common mistakes

- Mistake: reporting throughput without an SLO. Fix: define the SLO first, then report goodput next to throughput.
- Mistake: testing with short random prompts. Fix: replay prompts with the production length distribution.
- Mistake: reading results from the first 30 seconds. Fix: discard the warm-up window and run each level for minutes.
- Mistake: setting the autoscaler on GPU utilisation. Fix: scale on queue depth or on the fraction of requests inside the SLO.

## Check your understanding

- Question: throughput is 40 requests per second and 85 percent meet the SLO. What is the goodput? Answer: 34 requests per second.
- Question: in the table, why does goodput fall at concurrency 64 while throughput rises? Answer: the larger batch and queue push TTFT and TPOT over the SLO for most requests.
- Question: which generator shows what happens when arrivals exceed capacity? Answer: an open-loop generator, because it keeps sending at a fixed rate.

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

## The idea with an example

The GPU-Util column in nvidia-smi reports the fraction of time in which at least one kernel ran. A kernel that uses one streaming multiprocessor out of 132 still counts as busy. A decode loop with many tiny kernels shows 100 percent while most of the chip idles.

Memory bandwidth utilisation measures something concrete. In a decode step the GPU reads every weight once. A 70B model in FP16 has 140 GB of weights. Treat the model as if it sits on one device with a peak bandwidth of 3.35 TB/s. In practice it spans two GPUs, and each GPU reads its half.

At batch size 1 the floor for one step is 140 GB / 3.35 TB/s = 42 ms. If the measured time per token is 42 ms, the achieved bandwidth is 140 GB / 0.042 s = 3.33 TB/s. The MBU is 3.33 / 3.35 = 99 percent. The engine is at the memory floor and nothing but faster memory or fewer bytes helps.

If the measured time per token is 60 ms, the achieved bandwidth is 140 / 0.060 = 2.33 TB/s. The MBU is 70 percent. The other 30 percent is overhead: kernel launches, synchronisation, or the scheduler.

Model FLOPs utilisation measures the arithmetic side. A forward pass costs about 2 floating point operations per weight per token. For the 70B model that is 140 GFLOPs per token. Now run a batch of 64 sequences, one token each, in a step of 25 ms. The work is 64 × 140 GFLOPs = 8.96 TFLOPs, so the rate is 8.96 / 0.025 = 358 TFLOPS. The H100 peak in FP16 is about 990 TFLOPS, so the MFU is 358 / 990 = 36 percent.

| Metric | Value | Reading |
|---|---|---|
| nvidia-smi GPU-Util | 100% | A kernel is always running |
| MBU at batch 1, 60 ms per token | 70% | 30% of time is overhead |
| MFU at batch 64, 25 ms per step | 36% | Arithmetic units are mostly idle |

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

## Common mistakes

- Mistake: reading GPU-Util as a measure of efficiency. Fix: compute MBU for decode and MFU for prefill.
- Mistake: counting only the weights in the bytes moved. Fix: add the KV cache bytes read in the step, which grow with context length.
- Mistake: using the marketing peak with sparsity. Fix: use the dense peak for the format in use.

## Check your understanding

- Question: a 16 GB model decodes at 6 ms per token on a GPU with 3.35 TB/s. What is the MBU? Answer: 16 / 0.006 = 2.67 TB/s, so about 80 percent.
- Question: what does a high MBU with a low MFU tell you to do? Answer: raise the batch size or move fewer bytes, because memory bandwidth is the limit.
- Question: why can nvidia-smi show 100 percent while the GPU does little work? Answer: it counts time with any kernel running, not how much of the chip the kernel uses.

## Go further

The paper on efficiently scaling transformer inference derives the memory and compute floors used here. The FlashAttention paper shows how an IO-aware kernel raises both metrics in prefill. The PyTorch profiler documentation explains how to record a kernel timeline. Lilian Weng's post surveys the methods that move each metric, and Umar Jamil's channel explains the arithmetic of inference.
`,
          },
        ],
      },
    ],
  }
