import type { BlogPost } from './types'

export const posts: BlogPost[] = [
  {
    slug: 'count-bytes-not-flops',
    title: 'Count bytes, not FLOPs',
    date: '2026-10-15',
    track: 'inference-engineering',
    summary: 'One rule explains most of inference performance: count the bytes moved from memory, not the floating-point operations.',
    minutes: 6,
    body: `
Every GPU data sheet lists floating-point operations per second (FLOPS). Many new engineers therefore count multiplications. For large language model (LLM) decode, this is the wrong number. The right number is the bytes moved through high-bandwidth memory (HBM).

## The arithmetic

An H100 GPU performs about 1000 trillion FLOPs per second in bf16. It moves about 3.35 terabytes per second from HBM. Divide the two numbers. The result is about 300 FLOPs per byte. If a kernel does fewer than 300 FLOPs per byte it reads, the compute units wait for memory.

Decode produces one token per step. One step for one sequence reads every weight once. A model with 70 billion weights in bf16 holds 140 GB. The step performs about $2 \\times 70 \\times 10^9$ FLOPs, two per weight. That is 1 FLOP per byte, 300 times below the line. The GPU is idle more than 99 percent of the time. The step takes $140 / 3350 \\approx 42$ ms. This is the lower bound for single-stream decode at this size.

## What follows from it

Batching costs almost nothing at first. A batch of 32 sequences reads the weights once and performs 32 times the FLOPs. That is still only 32 FLOPs per byte. Throughput grows almost linearly with batch size until one of two limits. Either the key-value (KV) cache fills the memory, or the ratio crosses 300. In most deployments the cache fills first.

Quantization is a bandwidth method. Four-bit weights take 35 GB instead of 140 GB, so one step takes a quarter of the time. The extra FLOPs for the conversion do not matter, because the GPU has spare compute.

Prefill is different. A prompt with 4000 tokens reads the weights once and performs 4000 tokens of FLOPs. That is 8000 FLOPs per byte. Prefill is limited by compute. This is why the time to the first token grows with the prompt length, and why prefill and decode prefer different hardware.

## The habit

Estimate before you profile. Divide the bytes read by the bandwidth. The result is a lower bound on latency. If the measured latency is within 20 percent of the bound, kernel work will not help. Use a smaller model, fewer bytes per weight, or a larger batch. If the measured latency is 3 times the bound, you have a software problem.

## Key points

- Decode is limited by memory bandwidth, not by compute.
- Batching and quantization both reduce the bytes read per token.
- Compute the bandwidth bound before you profile a kernel.
`,
  },
  {
    slug: 'your-rag-eval-is-lying',
    title: 'Why your RAG eval is lying to you',
    date: '2026-10-03',
    track: 'ai-engineering',
    summary: 'Four ways a retrieval benchmark reports a score that does not hold with real users.',
    minutes: 7,
    body: `
A team ships a retrieval pipeline with 91 percent answer accuracy on its evaluation set. The first week of production feedback is poor. The evaluation measured something else. Retrieval-augmented generation (RAG) is a system that retrieves passages and then writes an answer from them. Its evaluation can fail in four ways.

## The questions came from the documents

The fastest way to build a RAG evaluation is to let a model read each chunk and write a question for it. A chunk is a piece of a document that the system stores and retrieves. Such questions reuse the words of the chunk. Retrieval then looks easy. Real users ask with their own words. They ask about things that span two chunks, or about things that are not in the corpus. Hold out a sample of real queries from the logs, even fifty. Label those. The gap between the two scores is your real headroom.

## You measured the generator, not the retriever

End-to-end accuracy mixes two failures. Either the correct passage was not retrieved, or it was retrieved and the model still answered wrongly. These have different fixes. Report recall at k for the retriever alone, with the correct passage labelled. Recall at k is the share of queries where the correct passage is in the top k results. Then report answer quality only for the queries with a retrieval hit. A 91 percent end-to-end score with 70 percent recall at 5 means the generator guesses correctly from memory a third of the time.

## The judge shares the model's blind spots

If the same model family writes the answer and grades it, both make the same confident mistakes. The grader forgives them. Use a different model family as the judge. Give the judge the correct passage, and do not ask it to assess plausibility. Check 10 percent of the grades by hand each time the pipeline changes. Judge agreement with humans drifts as the queries change.

## Nothing tests the empty case

A large share of real queries have no answer in the corpus. An evaluation built from the corpus has none of these. It cannot catch a system that invents an answer. Add unanswerable queries, at least 15 percent of the set. Score a refusal as correct for those.

None of this needs a larger evaluation. It needs the right 200 examples and three numbers instead of one.

## Key points

- Label real user queries, not questions written from the chunks.
- Report retriever recall and generator accuracy as separate numbers.
- Include unanswerable queries and use a judge from a different model family.
`,
  },
  {
    slug: 'twenty-tokens-per-parameter',
    title: 'The 20-tokens-per-parameter rule, and when to break it',
    date: '2026-09-24',
    track: 'ai-research',
    summary: 'Chinchilla gives the optimum for training cost only. Add the serving cost and the optimum moves far.',
    minutes: 6,
    body: `
The Chinchilla result is simple to state. For a fixed training budget, the loss is lowest when the number of training tokens is about 20 times the number of parameters. A parameter is one trained weight of the model. A model with 10 billion parameters wants 200 billion tokens. Teams also apply it where it does not hold.

## What the rule assumes

The objective is the training loss per unit of training compute. Nothing else enters. The fit is $L(N, D) = E + A/N^{\\alpha} + B/D^{\\beta}$. $L$ is the loss, $N$ is the number of parameters, $D$ is the number of tokens, and the other symbols are fitted constants. The two exponents are close to equal. This is why the optimum is a fixed ratio.

The budget constraint is $C \\approx 6ND$, where $C$ is the training compute. More tokens force a smaller model, and the reverse. The curve is flat near the optimum. A run at 40 tokens per parameter has almost the same loss as a run at 20 for the same compute.

## When to break it

If the model will serve many users, every parameter costs bandwidth on every token for the life of the deployment. A model with half the parameters and four times the tokens has almost the same loss. It has half the serving cost and twice the throughput per GPU. Llama 3 8B trained on 15 trillion tokens, about 1900 per parameter. This was a deliberate choice. The correct ratio comes from the total cost: training plus expected inference. For a popular model, inference dominates by orders of magnitude.

If data is the limit instead of compute, the question changes. With a fixed 2 trillion tokens of good data, repeated passes give smaller but real gains for up to about four passes. After that, they harm. Past that point, train a larger model on the same data.

If you distill from a teacher model, the rule does not apply. A student trained on teacher outputs sees a lower-entropy target. It needs fewer tokens to reach a given loss.

## The practical reading

Use 20 as the floor for a research run where only the checkpoint matters. For a product, compute the serving cost per token over the expected life of the model. Add it to the training cost. Minimize the sum. The answer is usually a smaller model trained much longer than Chinchilla suggests.

## Key points

- The ratio of 20 minimizes training loss for fixed training compute only.
- Serving cost moves the optimum toward smaller models with more tokens.
- Repeated data helps for about four passes, and distillation changes the rule.
`,
  },
  {
    slug: 'what-a-kv-cache-really-costs',
    title: 'What a KV cache really costs',
    date: '2026-09-12',
    track: 'inference-engineering',
    summary: 'The formula for the key-value cache, three worked examples, and why the cache sets your batch size first.',
    minutes: 5,
    body: `
The key-value (KV) cache holds the keys and values of every earlier token of a request. Here is the arithmetic.

## The formula

For each token and each layer, the cache stores one key vector and one value vector per KV head:

$$\\text{bytes per token} = 2 \\times L \\times H_{kv} \\times d_{head} \\times b$$

$L$ is the number of layers, $H_{kv}$ is the number of KV heads, $d_{head}$ is the head dimension, and $b$ is the bytes per element. The factor 2 counts keys and values.

## Three models

Llama 2 7B has 32 layers, 32 KV heads and a head dimension of 128. In bf16, $b = 2$. The cache is $2 \\times 32 \\times 32 \\times 128 \\times 2 = 524{,}288$ bytes per token, about half a megabyte. A conversation with 4000 tokens uses 2 GB. An 80 GB card with 14 GB of weights holds about 30 such conversations.

Llama 3 70B has 80 layers, 8 KV heads and a head dimension of 128. The low head count comes from grouped-query attention (GQA). The cache is $2 \\times 80 \\times 8 \\times 128 \\times 2 = 327{,}680$ bytes per token, about 320 KB. The 70B model uses less cache per token than the 7B model. GQA cut the KV heads by a factor of 8.

A request with 128,000 tokens on the 70B model needs 40 GB of cache. The weights take 140 GB across two cards. One long request adds more than a quarter of that again. Long context is a memory product, not a model product.

## What it decides

Batch size is the cache memory divided by the bytes per sequence. Before PagedAttention, servers reserved the maximum context for every request. The cost per sequence was the worst case, and 60 to 80 percent of the cache memory stayed unused. Paging reserves only the blocks in use. This is where the 2 to 4 times throughput gain of vLLM came from.

A cache in 8-bit floating point halves the number. A 4-bit cache quarters it, with a measurable quality cost on long-context recall. Prefix caching shares the system-prompt part across requests. For a 2000-token system prompt on a chat product, this is often the largest single gain.

Run the numbers for your model in the KV cache lab before you buy hardware. The cache is usually the limit.

## Key points

- Cache bytes per token equal 2 times layers times KV heads times head dimension times bytes per element.
- GQA reduces the KV heads, so a larger model can use less cache per token.
- Cache memory divided by bytes per sequence sets the batch size.
`,
  },
  {
    slug: 'tail-latency-p50-lies',
    title: 'Tail latency, or why p50 lies',
    date: '2026-08-30',
    track: 'system-design',
    summary: 'Fan-out turns a rare slow response into a common one, and here is the arithmetic and the fixes.',
    minutes: 6,
    body: `
A service reports a median latency of 20 ms and a 99th percentile (p99) of 400 ms. The p99 is the latency that 99 percent of requests beat. One request in a hundred is slow. This sounds rare. Then you remember that one page calls the service once for each of 50 items.

## The fan-out multiplier

Fan-out is the number of backend calls one user request makes. If each of $n$ independent calls is slow with probability $p$, the probability that at least one call is slow is $1 - (1 - p)^n$. For $p = 0.01$ and $n = 50$, the result is 39 percent. For $n = 100$, it is 63 percent. The user waits for the slowest call. So a p99 at the backend becomes close to a median at the front. Your median user sees your tail.

This is why the median of a backend says almost nothing about the product. Measure the distribution at the edge, for each operation the user sees.

## Where the tail comes from

Queueing is the usual cause. At 70 percent utilization, a single-server queue has a mean wait of about 2.3 service times. At 90 percent, the mean wait is 9 service times. The tail grows faster than the mean. Keep headroom. A CPU average over one minute hides bursts that saturate the server for one second.

Other causes give the same shape. Garbage collection pauses, retries that pile onto a slow replica, cold caches after a deploy, and the longest sequence in a static batch all produce a few requests far out in the tail.

## What works

Hedged requests: send the same request to a second replica after the 95th percentile delay, and take the first answer. This adds about 5 percent load and removes most of the tail caused by independent slowness. Dean and Barroso report a 40 percent reduction in the 95th percentile for about 2 percent extra requests.

Cancellation: when one replica answers, cancel the other. Then the extra work does not become extra load.

Deadlines: pass the deadline through the call graph. A downstream call then stops work on a request the user has already abandoned.

Bounded queues with load shedding: overload then produces fast failures instead of slow successes.

Measurement that matches the user: percentiles at the edge, per operation, over short windows. A one-minute p99 can hide a ten-second outage.

## Key points

- With fan-out $n$, the chance of one slow call is $1 - (1 - p)^n$.
- Queueing near full utilization makes the tail grow faster than the mean.
- Hedged requests, cancellation and deadlines cut the tail at low cost.
`,
  },
  {
    slug: 'agent-reliability-math',
    title: 'The agent reliability math',
    date: '2026-08-18',
    track: 'ai-engineering',
    summary: 'Per-step success compounds over an agent trajectory, and three levers change the result.',
    minutes: 6,
    body: `
A demo agent completes a ten-step task. It looks almost ready. It is not, and the reason is arithmetic.

## Compounding

If each step succeeds independently with probability $p$, a task of $n$ steps succeeds with probability $p^n$. At $p = 0.95$ and $n = 10$, the result is 60 percent. At $n = 20$, it is 36 percent. A model that is correct 95 percent of the time per decision fails more often than it succeeds past 20 decisions. Independence is an optimistic assumption. An early error corrupts the context for every later step, so real success rates are usually worse than $p^n$.

The inverse matters more. For 90 percent task success over 10 steps, you need $p = 0.9^{1/10} \\approx 0.99$. Over 30 steps, you need 0.9965. Prompt changes do not reach these numbers.

## The three levers

Fewer steps. Each tool you merge removes a step. Each decision you move from the model into fixed code removes a step. A workflow where the model classifies once and fixed code does the rest is more reliable than one where the model drives each step. It is also cheaper. This lever has the best return, and most teams use it last.

Verification with retry. If the output of a step can be checked, a failed step costs one retry instead of the whole task. With a checker that catches a fraction $c$ of the failures and $k$ attempts, the effective success per step rises toward $1 - (1 - p)^k$ for the caught failures. Checkable steps include: run the tests, validate a schema, confirm that a record exists. Design the task so that more steps are checkable.

Fallbacks. When a step fails after its retries, hand off. Hand off to a stronger model, to a different tool, or to a person with the context assembled. A fallback turns a hard failure into a slower success. The slow path runs only for the fraction of tasks that need it.

## Doing the sum

The Agent Control Room lab lets you set the rate per step, the retries and the fallbacks. It shows the compound number. Try 12 steps at 0.95 with no retries. Then add a checker on the four steps that can have one. The difference is usually the gap between a demo and a product.

## Key points

- Task success is $p^n$ at best, and it falls fast with the number of steps.
- Remove steps first, because each removed step removes an exponent.
- Add checkers with retries and fallbacks on the steps that remain.
`,
  },
  {
    slug: 'read-a-paper-in-40-minutes',
    title: 'How to read a paper in 40 minutes',
    date: '2026-08-05',
    track: 'ai-research',
    summary: 'A fixed procedure that extracts the claim, the evidence and the limits of a machine learning paper without a linear read.',
    minutes: 5,
    body: `
Most machine learning papers follow a fixed layout. Most readers ignore the layout and start at the introduction. Here is the procedure that the paper notes on this site follow.

## Minutes 0 to 5: the claim

Read the abstract. Then read the last paragraph of the introduction, where the authors list the contributions. Then read the conclusion. Write one sentence: what does this paper claim is true now that was not true before? If you cannot write that sentence, the paper is either badly written or not for you yet. In both cases, stop.

## Minutes 5 to 15: the evidence

Go to the main results table or figure. Find the baseline. Ask three questions. Is the baseline the strongest one, or a convenient one? Is the gain larger than the run-to-run variance? If there are no error bars or seeds, assume that it might not be. Does the comparison hold compute and data constant?

Then find the ablation table. An ablation removes one part of the method and measures the change. The ablation shows which part does the work. That part is usually smaller than the framing of the paper.

## Minutes 15 to 30: the method

Now read the method section with the results in mind. Check whether the mechanism explains the evidence. Work through the central equation with a pen. If there is a scaling or cost argument, do the arithmetic for one concrete case. Most people skip this part. This part makes the paper stay in memory.

## Minutes 30 to 40: the catch

Every paper has a limitations paragraph, a footnote, or an appendix table where the method stops working. Find it. Then write three more sentences. What must be true for this result to matter for your work? What is the cheapest experiment that checks that? Which earlier paper does this one depend on that you have not read?

## What to skip

Skip the related work section, unless you write one. Skip the motivation in the introduction, because you know it if you read the paper. Skip proofs on a first pass. Skip any appendix section that no table you cared about refers to.

Forty minutes, five sentences written down. The notes in the paper series are those five sentences, cleaned up.

## Key points

- Write the one-sentence claim before you read the method.
- Judge the evidence by the baseline, the variance and the ablation.
- Find the limit of the method and write three questions about it.
`,
  },
  {
    slug: 'sizing-a-gpu-fleet-for-chat',
    title: 'How to size a GPU fleet for a chat product',
    date: '2026-07-24',
    track: 'inference-engineering',
    summary: 'A procedure from daily active users to a number of GPUs, with every assumption written down so you can change it.',
    minutes: 7,
    body: `
The question arrives as "how many GPUs do we need?" The honest answer is a chain of six estimates. Write them down, then argue about the inputs.

## Demand

Start with concurrent requests at peak, not with daily totals. 100,000 daily active users with 8 messages each give 800,000 requests per day. Chat traffic has a peak-to-mean ratio of about 3, so the peak hour sees about 100,000 requests, or about 28 per second. Each request produces about 300 output tokens at a target of 30 tokens per second per user. So a request occupies the server for 10 seconds. Concurrency is arrivals times duration: 280 requests in flight at peak. Add 50 percent headroom for growth and for a bad hour: 420.

## Supply per GPU

Memory sets the supply first. A model with 70 billion weights in 8-bit floating point (FP8) takes 70 GB. An 80 GB card leaves 10 GB for the key-value (KV) cache, which is too small. Use two cards with tensor parallelism: 160 GB in total, 90 GB for the cache. At 320 KB per token in FP8 and a mean context of 3000 tokens, each request needs about 1 GB. So about 90 requests fit per pair.

Then check the bandwidth. Two H100 cards deliver about 6.7 TB/s together. One decode step reads 70 GB of weights, about 10 ms. It also reads the cache for all 90 sequences, another 90 GB, about 13 ms. That is about 23 ms per step, or 43 tokens per second per sequence. This is above the target of 30, so memory is the binding limit and 90 concurrent requests per pair is the number. In practice, measure with a load test and take 70 percent of the benchmark result.

## The fleet

420 concurrent requests divided by 90 per pair is about 5 pairs, or 10 GPUs. Add one pair for failover and one pair for deploys and canaries: 14 GPUs.

## What moves the number

Output length is linear in cost. A verbose system prompt that doubles the tokens doubles the fleet. Prefix caching of the system prompt cuts the cache cost per request. Speculative decoding helps latency at small batch sizes, but not throughput at this utilization. A 4-bit model halves the weight reads and fits on one card per replica.

The capacity lab and the KV cache lab on this site run this procedure with your own numbers.

## Key points

- Concurrency equals peak arrivals per second times seconds per request.
- Cache memory per request sets the number of requests per GPU pair.
- Prefix caching and quantization are the first two changes that move the fleet size.
`,
  },
  {
    slug: 'moe-is-a-memory-trick',
    title: 'MoE is a memory trick, not a compute trick',
    date: '2026-07-11',
    track: 'ai-research',
    summary: 'A mixture-of-experts model separates the number of weights from the compute per token, and this decides where it wins.',
    minutes: 6,
    body: `
A mixture-of-experts (MoE) model lists a large total number of weights and a small active number: for example, 671 billion total and 37 billion active. A common reading is that it is a 37B model with more knowledge for free. The correct reading is that it is a 671B model with a 37B compute budget.

## What MoE spends

Per token, a dense model multiplies by every weight. An MoE model routes each token to a few experts and multiplies only by those. An expert is one copy of the feed-forward block. So the floating-point operations (FLOPs) per token scale with the active weights. This is why training a sparse model is cheap relative to its total size.

But all experts must stay in memory, because the next token can need any of them. Weight memory scales with the total weights. The 671B model in 8-bit floating point takes 671 GB. That needs eight 96 GB cards before the first key-value cache entry. The model uses the memory of a dense 671B model and the compute of a 37B model.

## Why that is still a good trade

Batching amortizes memory. At batch size 1, decode reads the whole model per token. The sparse model is then as slow as a dense 671B model, which is unusable. At batch size 256, the batch touches most experts anyway. Each expert is read once and used by all the tokens routed to it. The cost per token then approaches that of a 37B model. MoE pays off exactly when you can batch: high-traffic serving and training.

Dense models are limited by bandwidth at small batch and by compute at large batch. MoE moves the compute limit much higher, because the compute per token is small. It keeps the knowledge that extra weights buy. It converts spare memory into model quality.

## Where it does not help

Latency-sensitive, low-concurrency work: an on-device assistant or a single-user coding tool. There the model is limited by bandwidth, and the total weights are the cost.

Fine-tuning. Routing makes the gradients sparse and noisy, and expert load imbalance appears quickly. LoRA on the attention weights avoids this and is the usual choice.

Any deployment that needs expert parallelism across nodes. The all-to-all exchange of tokens between nodes then dominates. The capacity factor from the Switch Transformer paper is the setting you will tune.

## Key points

- FLOPs per token follow the active weights, but memory follows the total weights.
- MoE wins at large batch sizes, where each expert read serves many tokens.
- MoE loses at batch size 1, in fine-tuning, and when routing crosses nodes.
`,
  },
  {
    slug: 'three-retrieval-bugs',
    title: 'The three retrieval bugs every team ships',
    date: '2026-07-01',
    track: 'ai-engineering',
    summary: 'The same three retrieval mistakes appear in nearly every RAG pipeline, and each takes about one day to fix.',
    minutes: 6,
    body: `
Retrieval systems fail in predictable ways. Three failures account for most of the gap between a demo and a reliable product.

## Chunks that lose their context

A chunk is a piece of a document that the system embeds and retrieves on its own. The document was written as a whole. The sentence "this setting is ignored in production" is useless without the name of the setting. The heading that names it is three chunks earlier. Fixed-window chunking produces thousands of these orphans.

The fix is cheap. Prepend the document title and the enclosing section heading to each chunk before you embed it. Store the parent document ID, so the generator can receive the surrounding paragraphs at answer time. Retrieve over small chunks and generate over larger windows. Teams that do this see recall at 5 rise by 10 to 20 points on their own queries.

## Dense-only retrieval

Embedding models are trained on semantic similarity. They are poor at exact strings: error codes, product codes, function names and personal names. A query for ERR_CONN_RESET_4012 retrieves passages about connection errors in general. BM25, a lexical ranking function, finds the exact string at once.

Run both, every time. Merge the two result lists with reciprocal rank fusion. Lexical search costs almost nothing, the fusion is ten lines of code, and the combined recall beats either method on every corpus we have measured.

## No reranker, or a reranker nobody evaluated

The top 20 results from a bi-encoder plus BM25 usually contain the correct passage. The top 3 that fit in the prompt often do not, because the first-stage scores are coarse. A cross-encoder reranker reads the query and the passage together and reorders the candidates. It is slower per pair, which is acceptable for 20 pairs.

The bug is to skip this stage, or to add one and never measure it. A reranker tuned on web search data can harm results on a technical corpus. Build the evaluation from the earlier post. Measure recall at 3 with and without the reranker. Keep it only if it wins.

## The order to fix them

Fix hybrid retrieval first, because it is the smallest change with the largest effect. Fix chunk context second. Add reranking third, with the evaluation in place before you add it. Each fix takes about one day. Do them before you touch the prompt, the embedding model or the vector database. Most teams spend their first month on those instead.

## Key points

- Add the title and section heading to each chunk before you embed it.
- Combine dense and lexical retrieval with reciprocal rank fusion.
- Measure a reranker before you keep it.
`,
  },
]

export function findPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
