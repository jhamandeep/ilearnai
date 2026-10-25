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
    level: 'intermediate',
    tldr: 'The Transformer replaces recurrence with self-attention, and every large language model since uses this design.',
    notes: `
## What the paper does

The paper introduces the Transformer, a sequence model with no recurrence and no convolution. Each layer uses self-attention. Self-attention lets every position read every other position in one step. The model trains on machine translation and sets a new best score on two benchmarks.

## Why it matters

Recurrent models process tokens one after another. This makes training slow and makes long-range links weak. The Transformer processes all tokens of a sequence in parallel, so it uses accelerators well. Every large language model since 2018 uses this design.

## How to read it

1. Read Section 3.2.1 for scaled dot-product attention and the $\\sqrt{d_k}$ scale factor.
2. Read Section 3.2.2 for multi-head attention.
3. Read Table 1. It compares the path length between two positions for each architecture. This table is the main argument.
4. Read Section 3.5 for the sinusoidal positional encoding. Later models replaced it.

## Key equation or idea

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

$Q$ is the query matrix, $K$ is the key matrix, $V$ is the value matrix, and $d_k$ is the dimension of one key vector. The division by $\\sqrt{d_k}$ keeps the softmax input in a range with useful gradients.

## What came after

BERT (day 10) kept the encoder. GPT-3 (day 9) kept the decoder. RoFormer (day 11) replaced the positional encoding. FlashAttention (day 5) made the attention computation fast on real hardware.
`,
    prereqs: [],
    tags: ['architecture', 'attention', 'foundations'],
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
    level: 'advanced',
    tldr: 'Test loss follows a smooth power law in model size, data size and compute over seven orders of magnitude.',
    notes: `
## What the paper does

The paper trains many language models of different sizes on different amounts of data. It measures the test loss of each run. The loss follows a power law in three quantities: the number of weights, the number of training tokens, and the compute budget. The power law holds over seven orders of magnitude.

## Why it matters

Before this paper, "bigger is better" was a belief. This paper turned the belief into an equation with fitted constants. Research teams used the equation to plan the compute budgets of the next five years.

## How to read it

1. Read Figure 1. It shows the three power laws on one page.
2. Read Section 3 for the definitions of $N$, $D$ and $C$.
3. Read Section 4 for the fits. Note the exponents.
4. Read Section 6 for the recommendation on model size against data size. Chinchilla (day 3) corrected this recommendation.

## Key equation or idea

$$L(N) = \\left(\\frac{N_c}{N}\\right)^{\\alpha_N}$$

$L$ is the test loss, $N$ is the number of weights without the embedding, $N_c$ is a fitted constant, and $\\alpha_N \\approx 0.076$ is the fitted exponent. A small exponent means the loss falls slowly, so each gain costs much more compute.

## What came after

Chinchilla (day 3) refit the law with better learning rate schedules. It found that data must grow as fast as model size. GPT-3 (day 9) applied the law at 175 billion weights.
`,
    prereqs: ['attention-is-all-you-need'],
    tags: ['scaling', 'training', 'foundations'],
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
    level: 'advanced',
    tldr: 'For a fixed compute budget, grow the number of weights and the number of training tokens at the same rate, about 20 tokens per weight.',
    notes: `
## What the paper does

The paper trains more than 400 models with 70 million to 16 billion weights on 5 billion to 500 billion tokens. It fits a loss function in two variables: the number of weights $N$ and the number of training tokens $D$. The paper then trains Chinchilla, a model with 70 billion weights, on 1.4 trillion tokens.

## Why it matters

Chinchilla used the same compute as Gopher. Gopher had 280 billion weights and saw 300 billion tokens. Chinchilla beat Gopher on most benchmarks. The result showed that most large models of 2021 had too few training tokens.

## How to read it

1. Read Figure 1. It places earlier models against the compute-optimal line.
2. Read Section 3 for the three fitting methods. All three agree.
3. Read Table 3 for the predicted optimal sizes at each compute budget.
4. Read Section 4 for the Chinchilla against Gopher results.

## Key equation or idea

$$L(N, D) = E + \\frac{A}{N^{\\alpha}} + \\frac{B}{D^{\\beta}}$$

$L$ is the loss, $E$ is the loss of a perfect model, $N$ is the number of weights, $D$ is the number of tokens, and $A$, $B$, $\\alpha$ and $\\beta$ are fitted constants. The exponents are close to equal, so $N$ and $D$ must grow together.

## What came after

Llama 3 (day 18) trained a model with 8 billion weights on 15 trillion tokens. The blog post on the 20-tokens rule explains why serving cost moves the optimum.
`,
    prereqs: ['scaling-laws'],
    tags: ['scaling', 'training'],
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
    level: 'intermediate',
    tldr: 'Supervised fine-tuning, a reward model and PPO turn GPT-3 into an assistant that follows instructions.',
    notes: `
## What the paper does

The paper describes a three-step recipe. Step one is supervised fine-tuning (SFT) on prompts with human-written answers. Step two trains a reward model on human rankings of model outputs. Step three uses proximal policy optimization (PPO), a reinforcement learning algorithm, to make the model produce outputs with a high reward.

## Why it matters

Human labelers preferred the InstructGPT model with 1.3 billion weights over the base GPT-3 model with 175 billion weights. Alignment training gave more useful behaviour than a model 100 times larger. This recipe is reinforcement learning from human feedback (RLHF). Every chat assistant since uses a version of it.

## How to read it

1. Read Figure 2 for the three steps.
2. Read Section 3.5 for the reward model loss and the PPO objective.
3. Read Section 4.1 for the preference results against model size.
4. Read Section 4.2 on the "alignment tax". The RL step reduces some benchmark scores, and a mixed objective repairs them.

## Key equation or idea

$$\\text{objective}(\\phi) = \\mathbb{E}_{x, y}\\left[r_\\theta(x, y) - \\beta \\log \\frac{\\pi_\\phi(y \\mid x)}{\\pi_{\\text{SFT}}(y \\mid x)}\\right]$$

$r_\\theta$ is the reward model, $\\pi_\\phi$ is the policy under training, $\\pi_{\\text{SFT}}$ is the supervised model, and $\\beta$ sets the strength of the penalty. The penalty keeps the policy close to the supervised model.

## What came after

Direct Preference Optimization (day 7) removed the reward model and PPO. Constitutional AI (day 17) and RLAIF (day 36) replaced the human labels with model labels.
`,
    prereqs: ['attention-is-all-you-need'],
    tags: ['alignment', 'rlhf', 'post-training'],
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
    level: 'advanced',
    tldr: 'Attention is limited by memory traffic, not by arithmetic. Tiling the computation removes the limit with no approximation.',
    notes: `
## What the paper does

The paper gives a new algorithm for exact attention. The standard algorithm writes the full score matrix of size $T \\times T$ to high-bandwidth memory (HBM). FlashAttention splits the query, key and value matrices into tiles. It computes each tile inside the small on-chip memory (SRAM) and uses an online softmax. It never writes the full score matrix.

## Why it matters

The kernel is 2 to 4 times faster. The memory use grows linearly with the sequence length instead of quadratically. The paper also gives the lens for the whole inference track: count the bytes moved, not the floating-point operations (FLOPs).

## How to read it

1. Read Section 2.2 for the memory hierarchy of a GPU and the HBM against SRAM bandwidth numbers.
2. Read Section 3.1 and Algorithm 1 for tiling and the online softmax.
3. Read Figure 1 for the speed comparison.
4. Read Section 3.2 for the proof of the number of HBM accesses.

## Key equation or idea

The online softmax keeps a running maximum $m$ and a running sum $\\ell$ for each row. When a new tile arrives with maximum $m'$, the algorithm rescales the old sum by $e^{m - m'}$ and adds the new terms.

## What came after

FlashAttention-2 and FlashAttention-3 improved the work split across GPU threads. PagedAttention (day 6) applied the same memory view to the key-value cache. Mamba (day 20) used the same hardware-aware scan for state-space models.
`,
    prereqs: ['attention-is-all-you-need'],
    tags: ['attention', 'kernels', 'memory'],
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
    level: 'advanced',
    tldr: 'Store the key-value cache in fixed-size blocks, like virtual memory pages, so no memory is wasted. This is the design of vLLM.',
    notes: `
## What the paper does

The paper describes vLLM, a serving system for large language models. Its main idea is PagedAttention. The key-value (KV) cache holds the keys and values of all earlier tokens of a request. Earlier servers reserved a cache for the maximum sequence length for every request. vLLM splits the cache into small fixed-size blocks and allocates blocks only when a request needs them.

## Why it matters

Reserved cache memory that a request never uses is waste. The paper measures 60 to 80 percent waste in earlier systems. With paging, the server fits 2 to 4 times more requests in the same memory, so the throughput rises by the same factor.

## How to read it

1. Read Section 2.3 for the memory problem and Figure 2 for the waste measurement.
2. Read Section 4.1 for the block table and the virtual-memory comparison.
3. Read Section 4.3 for prefix sharing and copy-on-write.
4. Read Figure 12 for the throughput results.

## Key equation or idea

Each request owns a block table. The table maps a logical block number to a physical block in GPU memory. The attention kernel reads the table and gathers the keys and values from the physical blocks. An operating system page table works the same way.

## What came after

Prefix caching and continuous batching became standard in every serving engine. The blog post "What a KV cache really costs" gives the arithmetic that this paper makes necessary.
`,
    prereqs: ['flash-attention'],
    tags: ['serving', 'kv-cache', 'memory'],
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
    level: 'advanced',
    tldr: 'Train directly on preference pairs with a classification loss, with no reward model and no PPO.',
    notes: `
## What the paper does

The paper derives a closed-form link between the RLHF objective and the optimal policy. It shows that the reward can be written as a function of the policy itself. With this substitution, the reward model loss becomes a loss on the policy. The method is direct preference optimization (DPO). Training needs only pairs of a preferred and a rejected answer.

## Why it matters

PPO is the least stable part of RLHF. It needs a reward model, a value model, a reference model and sampling during training. DPO needs only the policy and a frozen reference model. The result matches PPO on summarization and dialogue tasks with much less engineering.

## How to read it

1. Read Section 4 for the derivation. Reproduce it by hand.
2. Read Equation 7 for the DPO loss.
3. Read Figure 2 for the reward against KL trade-off.
4. Read Appendix A for the proof that the loss is correct.

## Key equation or idea

$$\\mathcal{L}_{\\text{DPO}} = -\\mathbb{E}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)}\\right)\\right]$$

$y_w$ is the preferred answer, $y_l$ is the rejected answer, $\\pi_\\theta$ is the policy, $\\pi_{\\text{ref}}$ is the reference model, $\\sigma$ is the sigmoid function, and $\\beta$ sets the strength of the constraint.

## What came after

Llama 3 (day 18) used DPO instead of PPO in its post-training rounds. DeepSeek-R1 (day 19) returned to online RL for reasoning tasks.
`,
    prereqs: ['instructgpt'],
    tags: ['alignment', 'post-training'],
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
    level: 'advanced',
    tldr: 'A reward model that grades each reasoning step beats a reward model that grades only the final answer on the MATH benchmark.',
    notes: `
## What the paper does

The paper compares two kinds of reward model for mathematics problems. An outcome reward model (ORM) scores only the final answer. A process reward model (PRM) scores every step of the solution. The paper trains both on the same base model and compares them with best-of-N selection. It also releases PRM800K, a dataset of 800,000 step-level labels.

## Why it matters

An outcome reward gives credit to a wrong chain that ends in the correct answer. A process reward does not. The PRM solved 78 percent of a MATH test subset. The ORM solved 72 percent. The step-level signal is also denser, so it gives more information per problem.

## How to read it

1. Read Section 2 for the two reward model types and the data collection.
2. Read Figure 3 for the best-of-N curves. The PRM gap grows with N.
3. Read Section 5 for the active learning method used to pick problems to label.
4. Read Section 6 on generalization to other benchmarks.

## Key equation or idea

The PRM gives each step a probability of correctness. The score of a full solution is the product of the step probabilities. Best-of-N picks the solution with the highest product out of N samples.

## What came after

DeepSeek-R1 (day 19) reported that process reward models did not help its reinforcement learning on verifiable tasks. Read the two papers together to see both sides of the argument.
`,
    prereqs: ['instructgpt'],
    tags: ['reasoning', 'reward-models', 'post-training'],
  },
  {
    slug: 'gpt-3',
    day: 9,
    title: 'Language Models are Few-Shot Learners',
    authors: 'Brown, Mann, Ryder, Subbiah, Kaplan, Dhariwal, Neelakantan, Shyam, Sastry, Askell et al.',
    year: 2020,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2005.14165',
    track: 'ai-research',
    level: 'intermediate',
    tldr: 'A decoder-only model with 175 billion weights learns a new task from examples in the prompt, with no weight updates.',
    notes: `
## What the paper does

The paper trains a language model with 175 billion weights on 300 billion tokens. It tests the model without fine-tuning. The prompt holds zero, one or a few examples of a task, then a new input. The model completes the output. The paper calls this in-context learning.

## Why it matters

Before GPT-3, a model needed fine-tuning for each task. GPT-3 showed that a large enough model can do many tasks from the prompt alone. This made the prompt an interface and the model a general product. The gap between zero-shot and few-shot scores grows with model size.

## How to read it

1. Read Figure 1.2. It shows accuracy against the number of in-context examples for each model size.
2. Read Section 2.1 for the model sizes and Section 2.2 for the data.
3. Read Section 3 for the benchmark results. Focus on Table 3.1.
4. Read Section 5 for the limitations. The authors state that the model reasons poorly.
5. Read Section 4 for the data contamination analysis. Most later papers copy this method.

## Key equation or idea

The model never updates its weights at test time. It reads the examples in the context window and conditions on them. Few-shot performance is a function of model size, so scale buys task ability.

## What came after

Chain-of-thought prompting (day 15) extended in-context learning to reasoning. InstructGPT (day 4) added alignment training. LoRA (day 14) made fine-tuning of such large models cheap.
`,
    prereqs: ['attention-is-all-you-need', 'scaling-laws'],
    tags: ['scaling', 'in-context-learning', 'foundations'],
  },
  {
    slug: 'bert',
    day: 10,
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Devlin, Chang, Lee, Toutanova',
    year: 2019,
    venue: 'NAACL',
    url: 'https://arxiv.org/abs/1810.04805',
    track: 'ai-research',
    level: 'intermediate',
    tldr: 'Masked language modelling trains an encoder that reads both directions, and a fine-tuned copy sets new scores on eleven tasks.',
    notes: `
## What the paper does

The paper trains a Transformer encoder with two tasks. The first task masks 15 percent of the input tokens and predicts them from the surrounding tokens on both sides. The second task predicts whether two sentences follow each other. After pretraining, a small output layer is added and the whole model is fine-tuned on each task.

## Why it matters

A decoder predicts the next token and can only read tokens to the left. The BERT encoder reads the full sentence, so each token representation depends on all other tokens. One pretrained checkpoint gave the best score on eleven benchmarks. BERT also set the pretrain-then-fine-tune pattern for the next three years.

## How to read it

1. Read Figure 1 for the pretraining and fine-tuning procedure.
2. Read Section 3.1 for the masking rule and the 80-10-10 split.
3. Read Table 1 for the GLUE results.
4. Read Section 5.1 for the ablation of the two pretraining tasks.

## Key equation or idea

The masked language model loss is the cross-entropy over the masked positions only. The model sees the token [MASK] in the input and must output the original token. This forces each hidden state to encode its context.

## What came after

Decoder-only models won the generation race. Encoders remain the standard for embeddings, rerankers and classifiers. Dense Passage Retrieval (day 21) and ColBERT (day 34) both start from a BERT encoder.
`,
    prereqs: ['attention-is-all-you-need'],
    tags: ['architecture', 'encoders', 'embeddings'],
  },
  {
    slug: 'roformer',
    day: 11,
    title: 'RoFormer: Enhanced Transformer with Rotary Position Embedding',
    authors: 'Su, Lu, Pan, Murtadha, Wen, Liu',
    year: 2024,
    venue: 'Neurocomputing',
    url: 'https://arxiv.org/abs/2104.09864',
    track: 'ai-research',
    level: 'advanced',
    tldr: 'Rotate each query and key by an angle proportional to its position. The attention score then depends only on the distance between the two tokens.',
    notes: `
## What the paper does

The paper introduces rotary position embedding (RoPE). It splits each query and key vector into pairs of dimensions. It rotates each pair by an angle that grows with the token position. The dot product of a rotated query and a rotated key then depends only on the difference between the two positions.

## Why it matters

Additive position embeddings put the absolute position into every dot product. RoPE encodes relative position with no extra weights and no extra compute at inference. It works with the key-value cache, because the rotation of a cached key does not change. Most open models use it.

## How to read it

1. Read Section 3.2 for the goal: a function of the relative position only.
2. Read Equation 15 and the block-diagonal rotation matrix.
3. Read Section 3.4.3 for the long-term decay property.
4. Read Table 2 for the results on long documents.

## Key equation or idea

$$\\langle R_m q, R_n k \\rangle = \\langle q, R_{n-m} k \\rangle$$

$R_m$ is the rotation matrix for position $m$, $q$ is the query, $k$ is the key, and $n - m$ is the distance between the two tokens. The rotation angle of pair $i$ is $m \\theta_i$ with $\\theta_i = 10000^{-2i/d}$, where $d$ is the head dimension.

## What came after

Context-extension methods such as NTK scaling and YaRN change the base 10000. Llama 3 (day 18) uses a base of 500000 for its 128K context.
`,
    prereqs: ['attention-is-all-you-need'],
    tags: ['architecture', 'positional-encoding', 'long-context'],
  },
  {
    slug: 'switch-transformer',
    day: 12,
    title: 'Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity',
    authors: 'Fedus, Zoph, Shazeer',
    year: 2022,
    venue: 'JMLR',
    url: 'https://arxiv.org/abs/2101.03961',
    track: 'ai-research',
    level: 'advanced',
    tldr: 'Send each token to one of many feed-forward experts, so the number of weights grows and the compute per token does not.',
    notes: `
## What the paper does

The paper simplifies the mixture-of-experts (MoE) layer. A MoE layer holds $E$ copies of the feed-forward block, called experts, and a router. The router sends each token to one expert only. The paper trains models with up to 1.6 trillion weights and shows that they train stably.

## Why it matters

A dense model spends the same compute on every token. A MoE model can hold ten times more weights at the same compute per token. The Switch models reach the same loss as a dense T5 model with 4 to 7 times less training time. The cost moves from compute to memory, because all experts must stay loaded.

## How to read it

1. Read Section 2.1 for the routing rule and Figure 2 for the layer diagram.
2. Read Section 2.2 for the capacity factor. Tokens over the capacity of an expert are dropped.
3. Read Section 2.4 for the load-balancing loss.
4. Read Figure 4 for the speed-quality comparison with dense models.

## Key equation or idea

The router computes $p_i(x) = \\text{softmax}(W_r x)_i$ for each expert $i$. The token goes to the expert with the highest $p_i$. The output of the layer is $p_i(x) \\cdot E_i(x)$, so the gradient flows through the router weights $W_r$.

## What came after

Mixtral, DeepSeek-V3 and many other models use top-2 or fine-grained routing. The blog post "MoE is a memory trick" explains the serving cost.
`,
    prereqs: ['attention-is-all-you-need', 'scaling-laws'],
    tags: ['architecture', 'mixture-of-experts', 'scaling'],
  },
  {
    slug: 'gqa',
    day: 13,
    title: 'GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints',
    authors: 'Ainslie, Lee-Thorp, de Jong, Zemlyanskiy, Lebrón, Sanghai',
    year: 2023,
    venue: 'EMNLP',
    url: 'https://arxiv.org/abs/2305.13245',
    track: 'inference-engineering',
    level: 'advanced',
    tldr: 'Share one key-value head across a group of query heads. Quality stays near multi-head attention, and the cache shrinks toward multi-query size.',
    notes: `
## What the paper does

The paper introduces grouped-query attention (GQA). Multi-head attention (MHA) gives each of the $h$ query heads its own key and value heads. Multi-query attention (MQA) shares one key-value (KV) head across all query heads. GQA uses $g$ KV heads, with $1 < g < h$.

## Why it matters

Decode is limited by memory bandwidth, and the KV cache holds most of the bytes. MQA cuts the cache by a factor of $h$ but reduces quality. GQA cuts the cache by $h / g$ with almost no loss. Llama 3 70B uses 64 query heads and 8 KV heads, an 8 times smaller cache.

## How to read it

1. Read Figure 2 for the three attention layouts.
2. Read Section 3.1 for the conversion recipe. The KV heads of a group are averaged, then the model trains for 5 percent of the original steps.
3. Read Figure 1 for quality against inference time. GQA sits at the knee of the curve.
4. Read Table 1 for the benchmark numbers.

## Key equation or idea

The KV cache size per token is $2 \\times L \\times g \\times d_{\\text{head}} \\times b$. $L$ is the number of layers, $g$ is the number of KV heads, $d_{\\text{head}}$ is the head dimension, and $b$ is the bytes per element. GQA reduces $g$.

## What came after

Most models since 2023 use GQA. DeepSeek-V2 introduced multi-head latent attention, which compresses the cache further.
`,
    prereqs: ['attention-is-all-you-need', 'flash-attention'],
    tags: ['attention', 'kv-cache', 'serving'],
  },
  {
    slug: 'lora',
    day: 14,
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: 'Hu, Shen, Wallis, Allen-Zhu, Li, Wang, Wang, Chen',
    year: 2022,
    venue: 'ICLR',
    url: 'https://arxiv.org/abs/2106.09685',
    track: 'ai-engineering',
    level: 'intermediate',
    tldr: 'Freeze the weights and train a low-rank update $BA$ beside each weight matrix. It needs ten thousand times fewer trainable values and adds no inference cost.',
    notes: `
## What the paper does

The paper introduces low-rank adaptation (LoRA). Full fine-tuning updates every weight. LoRA freezes the base weight matrix $W$ and trains a product $BA$ of two small matrices. The rank $r$ of the product is small, often 4 to 16. At serving time, the product is added to $W$ once, so the model runs at the same speed as before.

## Why it matters

Full fine-tuning of a model with 175 billion weights needs a copy of the optimizer state for every task. A LoRA adapter is a few megabytes. One server can hold hundreds of adapters for one base model.

## How to read it

1. Read Section 4.1 for the update rule and the initialization.
2. Read Section 4.2 for the absence of extra inference latency.
3. Read Table 2 for the GPT-3 results against other adapter methods.
4. Read Section 7.1 for which weight matrices to adapt.

## Key equation or idea

$$h = W x + \\frac{\\alpha}{r} B A x$$

$W$ is the frozen weight matrix, $A \\in \\mathbb{R}^{r \\times d}$ and $B \\in \\mathbb{R}^{d \\times r}$ are the trainable matrices, $r$ is the rank, and $\\alpha$ is a scale constant. $B$ starts at zero, so the model starts at the base weights.

## What came after

QLoRA trains the adapter on a 4-bit base model. Practice has moved from the query and value matrices to all linear layers. Serving systems such as vLLM load many adapters at once.
`,
    prereqs: ['gpt-3'],
    tags: ['fine-tuning', 'parameter-efficient', 'post-training'],
  },
  {
    slug: 'chain-of-thought',
    day: 15,
    title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    authors: 'Wei, Wang, Schuurmans, Bosma, Ichter, Xia, Chi, Le, Zhou',
    year: 2022,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2201.11903',
    track: 'ai-research',
    level: 'beginner',
    tldr: 'Show the model worked examples with intermediate steps, and accuracy on arithmetic rises, but only for models above about 100 billion weights.',
    notes: `
## What the paper does

The paper changes the few-shot prompt. A standard prompt shows a question and a bare answer. A chain-of-thought (CoT) prompt shows a question, the reasoning steps, and then the answer. The model copies the pattern and writes its own steps before its answer.

## Why it matters

PaLM 540B went from 18 percent to 57 percent on the GSM8K arithmetic benchmark with no training change. The model spends tokens on computation before it commits to an answer. This is the first clear sign that reasoning can be a decode-time budget. The effect appears only above about 100 billion weights.

## How to read it

1. Read Figure 1 for the two prompt formats.
2. Read Figure 4 for the results against model size. Small models write fluent but wrong chains.
3. Read Section 3.3 for the ablations. Extra tokens alone do not give the gain.
4. Read Section 3.4 for the robustness to different example writers.

## Key equation or idea

The model samples the answer $y$ conditioned on the question $x$ and its own reasoning $z$: first $z \\sim p(z \\mid x)$, then $y \\sim p(y \\mid x, z)$. The intermediate text $z$ gives the model more forward passes per answer.

## What came after

Self-consistency samples many chains and takes a majority vote. ReAct (day 16) adds tool calls between reasoning steps. DeepSeek-R1 (day 19) trains the model with reinforcement learning to write long chains on its own.
`,
    prereqs: ['gpt-3'],
    tags: ['reasoning', 'prompting', 'in-context-learning'],
  },
  {
    slug: 'react',
    day: 16,
    title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    authors: 'Yao, Zhao, Yu, Du, Shafran, Narasimhan, Cao',
    year: 2023,
    venue: 'ICLR',
    url: 'https://arxiv.org/abs/2210.03629',
    track: 'ai-engineering',
    level: 'intermediate',
    tldr: 'Alternate a reasoning step, a tool action and the tool result in one trajectory. Every agent framework implements this loop.',
    notes: `
## What the paper does

The paper proposes ReAct, a prompt format for agents. The model writes a thought in free text. Then it writes an action, such as a search query. The system runs the action and appends the observation to the context. The loop repeats until the model writes a final answer.

## Why it matters

Chain-of-thought reasoning cannot look up facts. Action-only agents cannot plan. ReAct combines both. On HotpotQA and ALFWorld it beat both pure reasoning and pure acting. It also reduces false claims, because the model grounds its claims in observations.

## How to read it

1. Read Figure 1 for a full trajectory with thoughts, actions and observations.
2. Read Section 3 for the question answering setup and Table 1 for the results.
3. Read Section 3.3 for the failure analysis. Most errors are reasoning loops and bad search results.
4. Note the length of the prompt in Appendix C. The loop structure does the work, not long instructions.

## Key equation or idea

The context at step $t$ is $(x, \\hat{a}_1, o_1, \\ldots, \\hat{a}_{t-1}, o_{t-1})$. $x$ is the task, $\\hat{a}_i$ is a thought or an action, and $o_i$ is an observation. The policy maps this context to the next thought or action.

## What came after

Toolformer (day 33) trained tool use into the weights instead of the prompt. Function calling in model APIs made the action format a structured object.
`,
    prereqs: ['chain-of-thought'],
    tags: ['agents', 'tool-use', 'prompting'],
  },
  {
    slug: 'constitutional-ai',
    day: 17,
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    authors: 'Bai, Kadavath, Kundu, Askell, Kernion, Jones, Chen, Goldie, Mirhoseini et al.',
    year: 2022,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/2212.08073',
    track: 'ai-research',
    level: 'advanced',
    tldr: 'Replace human labels for harmlessness with model critiques against a written set of principles, then run reinforcement learning from AI feedback.',
    notes: `
## What the paper does

The paper trains a harmless assistant with almost no human labels for harm. A short list of principles, called the constitution, replaces the labels. In the supervised phase, the model critiques its own answer against a principle and then revises the answer. In the reinforcement learning phase, the model compares two answers against a principle. These comparisons train a preference model, and the policy trains against it.

## Why it matters

Reinforcement learning from human feedback (RLHF) needs many human labels, and labelers disagree about harm. Constitutional AI (CAI) writes the norms down, so they are inspectable and easy to change. The resulting model was less harmful and also less evasive than the RLHF baseline.

## How to read it

1. Read Figure 1 for the two phases.
2. Read Section 3 for the critique-and-revision loop. This is a data generation pipeline.
3. Read Section 4.1 for chain-of-thought preference labelling. It raised agreement with humans.
4. Read Figure 2 for the harmlessness against helpfulness results.

## Key equation or idea

The critique-revision step is a loop. The model answers a prompt, then it writes a critique of the answer under one principle, then it writes a revised answer. The revised answers form the supervised training set.

## What came after

RLAIF (day 36) measured AI feedback against human feedback directly. The same pattern now produces most synthetic post-training data.
`,
    prereqs: ['instructgpt', 'chain-of-thought'],
    tags: ['alignment', 'rlaif', 'post-training'],
  },
  {
    slug: 'llama-3',
    day: 18,
    title: 'The Llama 3 Herd of Models',
    authors: 'Grattafiori et al. (Llama Team, AI at Meta)',
    year: 2024,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/2407.21783',
    track: 'ai-research',
    level: 'advanced',
    tldr: 'The most complete public description of how a frontier-scale dense model is trained, evaluated and served.',
    notes: `
## What the paper does

The paper describes the Llama 3 model family, with 8, 70 and 405 billion weights. It covers the data mix, the scaling-law fits used to choose the 405B size, the parallelism layout on 16,000 GPUs, the failure rates during training, the post-training rounds, and the serving numbers in 8-bit floating point (FP8).

## Why it matters

Most frontier model reports contain little engineering detail. This one has 90 pages of it. It is the best single document for seeing how the ideas in this reading series fit together in one system.

## How to read it

1. Read Section 3.2.1 for the four-dimensional parallelism: tensor, pipeline, context and data. Note why the order of the dimensions matters for network traffic.
2. Read Section 3.3.4 for the reliability data: 419 unplanned interruptions in 54 days, with 58 percent from GPU failures.
3. Read Section 4 for the post-training recipe: six rounds of SFT, rejection sampling and DPO.
4. Read Section 6 for the FP8 serving results.

## Key equation or idea

The paper fits a scaling law on the downstream benchmark score, not only on the loss. It uses the fit to choose 405 billion weights and 15.6 trillion tokens for the compute budget. The fit predicts the final benchmark score of the large model from small runs.

## What came after

Llama 3.1 extended the context to 128K tokens. Llama 3.2 added vision and small models. Most open-model reports now follow this structure.
`,
    prereqs: ['chinchilla', 'instructgpt', 'roformer', 'gqa', 'dpo'],
    tags: ['training', 'scaling', 'systems-report'],
  },
  {
    slug: 'deepseek-r1',
    day: 19,
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    authors: 'DeepSeek-AI',
    year: 2025,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/2501.12948',
    track: 'ai-research',
    level: 'advanced',
    tldr: 'Reinforcement learning with rule-based rewards only, and no process supervision, produces long chains of thought and self-correction.',
    notes: `
## What the paper does

The paper trains two reasoning models. R1-Zero starts from the base model and trains with reinforcement learning (RL) only. The reward is a rule: the answer is correct or not, and the format is correct or not. The full R1 adds a small supervised cold-start set before RL and a second RL stage for readability. The paper also distills R1 into smaller dense models.

## Why it matters

R1-Zero learns to write longer reasoning during training without any instruction to do so. Behaviours such as re-checking a step appear on their own. The results matched the OpenAI o1 model. The paper, the weights and the distilled models were all released.

## How to read it

1. Read Section 2.2.1 for group relative policy optimization (GRPO).
2. Read Figure 3 for the response length against training steps.
3. Read Section 2.3 for the four-stage R1 pipeline.
4. Read Section 4.2 for the methods that did not work, including process reward models and tree search. Compare with day 8.

## Key equation or idea

GRPO samples a group of $G$ answers for one prompt. The advantage of answer $i$ is $A_i = (r_i - \\text{mean}(r)) / \\text{std}(r)$, where $r_i$ is its reward. The group mean replaces the value model of PPO, which halves the memory.

## What came after

Many open reproductions confirmed the result on small models. The method became the standard recipe for reasoning models with verifiable rewards.
`,
    prereqs: ['lets-verify-step-by-step', 'chain-of-thought', 'dpo'],
    tags: ['reasoning', 'reinforcement-learning', 'post-training'],
  },
  {
    slug: 'mamba',
    day: 20,
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    authors: 'Gu, Dao',
    year: 2024,
    venue: 'COLM',
    url: 'https://arxiv.org/abs/2312.00752',
    track: 'ai-research',
    level: 'advanced',
    tldr: 'A recurrent model with input-dependent state transitions and a hardware-aware scan. It trains as fast as attention and decodes in constant time per token.',
    notes: `
## What the paper does

The paper introduces Mamba, a sequence model based on a state space model (SSM). An SSM compresses the past into a fixed-size state and updates it at each token. Earlier SSMs used the same transition at every step. Mamba makes the transition parameters functions of the input token. The paper implements the resulting scan inside on-chip memory, in the same way as FlashAttention.

## Why it matters

Attention costs $O(T^2)$ per layer and keeps a cache that grows with the context length $T$. Mamba costs $O(T)$ to train and $O(1)$ per token to decode. The input-dependent transition lets the model select which tokens to remember. Mamba matched Transformers of twice its size on language modelling at the scale tested.

## How to read it

1. Read Section 2 for the SSM background and Equation 1.
2. Read Section 3.1 for selection, with the selective-copy and induction-head tasks.
3. Read Section 3.3 for the hardware-aware scan.
4. Read Section 4.2 for the language results and Section 5 for the limits.

## Key equation or idea

$$h_t = \\bar{A} h_{t-1} + \\bar{B}_t x_t, \\quad y_t = C_t h_t$$

$h_t$ is the state, $x_t$ is the input, $y_t$ is the output, and $\\bar{B}_t$ and $C_t$ depend on $x_t$. This dependence is the selection mechanism.

## What came after

Pure SSMs lag on tasks that need exact recall. Production models such as Jamba and Nemotron-H mix a few attention layers with Mamba layers.
`,
    prereqs: ['attention-is-all-you-need', 'flash-attention'],
    tags: ['architecture', 'state-space', 'long-context'],
  },
  {
    slug: 'dpr',
    day: 21,
    title: 'Dense Passage Retrieval for Open-Domain Question Answering',
    authors: 'Karpukhin, Oğuz, Min, Lewis, Wu, Edunov, Chen, Yih',
    year: 2020,
    venue: 'EMNLP',
    url: 'https://arxiv.org/abs/2004.04906',
    track: 'ai-engineering',
    level: 'intermediate',
    tldr: 'Two BERT encoders, one for questions and one for passages, trained with in-batch negatives, beat BM25 on open-domain question answering.',
    notes: `
## What the paper does

The paper trains a dense retriever. One BERT encoder maps a question to a vector. A second BERT encoder maps a passage to a vector. The score is the dot product. The training loss is a contrastive loss: the correct passage must score higher than the other passages in the same batch and one hard negative from BM25. BM25 is a lexical ranking function based on term frequency.

## Why it matters

Before this paper, dense retrieval needed very large pretraining. DPR needed only a few thousand question-passage pairs. It beat BM25 by 9 to 19 points on top-20 accuracy. Every retrieval-augmented generation (RAG) system uses this pattern: a bi-encoder, a vector index, and a separate reader.

## How to read it

1. Read Section 3.1 for the two encoders and the score.
2. Read Section 3.2 for the negatives. The hard negative gives most of the gain.
3. Read Table 2 for the comparison with BM25. BM25 still wins on queries with rare entities.
4. Read Section 5.1 for the sample efficiency results.

## Key equation or idea

$$L = -\\log \\frac{e^{\\text{sim}(q, p^+)}}{e^{\\text{sim}(q, p^+)} + \\sum_j e^{\\text{sim}(q, p_j^-)}}$$

$q$ is the question vector, $p^+$ is the correct passage vector, $p_j^-$ are the negative passage vectors, and $\\text{sim}$ is the dot product.

## What came after

ColBERT (day 34) keeps one vector per token instead of one per passage. HNSW (day 22) is the index that makes dense search fast.
`,
    prereqs: ['bert'],
    tags: ['retrieval', 'embeddings', 'rag'],
  },
  {
    slug: 'hnsw',
    day: 22,
    title: 'Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs',
    authors: 'Malkov, Yashunin',
    year: 2018,
    venue: 'IEEE TPAMI',
    url: 'https://arxiv.org/abs/1603.09320',
    track: 'ai-engineering',
    level: 'advanced',
    tldr: 'A proximity graph with sparse upper layers, searched greedily from the top, finds approximate nearest neighbours in logarithmic time.',
    notes: `
## What the paper does

The paper gives a data structure for approximate nearest neighbour search. Each vector is a node in a graph. Each node links to a fixed number of near nodes. Nodes also appear in upper layers with decreasing probability, so the top layer is sparse. A search starts at the top layer and moves greedily to the nearest neighbour at each layer until it reaches the bottom.

## Why it matters

Exact search over millions of vectors with 1024 dimensions is a full scan. HNSW finds the true neighbour with high probability in logarithmic time. Faiss, pgvector and Lucene implement it. It is the default index of every vector database.

## How to read it

1. Read Section 3 for the construction algorithm and Figure 1 for the layer diagram.
2. Read Algorithm 1 for the insertion rule and Algorithm 2 for the search.
3. Read Section 4 for the choice of neighbours by the heuristic.
4. Read Figure 3 and the following figures for recall against queries per second.

## Key equation or idea

Three settings control the index. $M$ is the number of links per node. efConstruction is the size of the candidate list during insertion. efSearch is the size of the candidate list during a query. A larger efSearch gives higher recall and lower speed.

## What came after

The graph often takes 1.5 to 2 times the memory of the vectors. DiskANN moved the graph to disk.
`,
    prereqs: ['dpr'],
    tags: ['retrieval', 'vector-search', 'data-structures'],
  },
  {
    slug: 'raft',
    day: 23,
    title: 'In Search of an Understandable Consensus Algorithm',
    authors: 'Ongaro, Ousterhout',
    year: 2014,
    venue: 'USENIX ATC',
    url: 'https://raft.github.io/raft.pdf',
    track: 'system-design',
    level: 'intermediate',
    tldr: 'Consensus split into leader election, log replication and safety, with the goal that engineers can implement it correctly.',
    notes: `
## What the paper does

The paper describes Raft, a consensus algorithm. Consensus lets a group of servers agree on a sequence of log entries, even when some servers fail. Raft chooses one leader. The leader accepts all writes and copies them to the followers. If the leader fails, the followers elect a new one after a random timeout. The paper proves that committed entries are never lost.

## Why it matters

Paxos is correct but hard to understand and hard to implement. Raft gives the same guarantee with a design that follows the way engineers think. etcd, CockroachDB, TiKV and the KRaft mode of Kafka all run it. If you learn one consensus protocol, learn this one.

## How to read it

1. Read Figure 2, the one-page summary of the state and the remote procedure calls. Implementations transcribe it directly.
2. Read Section 5.2 for leader election.
3. Read Section 5.3 for log replication and the log matching property.
4. Read Section 5.4.1 for the election restriction. A candidate must hold all committed entries.

## Key equation or idea

A log entry is committed when the leader has copied it to a majority of the servers. Two majorities always share at least one server. So any new leader holds every committed entry, and committed entries never change.

## What came after

Spanner (day 25) uses Paxos groups per shard for the same job. Most new distributed databases chose Raft after 2014.
`,
    prereqs: [],
    tags: ['consensus', 'replication', 'distributed-systems'],
  },
  {
    slug: 'dynamo',
    day: 24,
    title: "Dynamo: Amazon's Highly Available Key-value Store",
    authors: 'DeCandia, Hastorun, Jampani, Kakulapati, Lakshman, Pilchin, Sivasubramanian, Vosshall, Vogels',
    year: 2007,
    venue: 'SOSP',
    url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
    track: 'system-design',
    level: 'advanced',
    tldr: 'Choose availability over consistency with consistent hashing, vector clocks, sloppy quorums and read repair.',
    notes: `
## What the paper does

The paper describes Dynamo, the key-value store behind the Amazon shopping cart. The store never refuses a write, even during a network partition. Replicas can hold different versions of one key. The system keeps all versions and gives them to the application at read time. The application merges them.

## Why it matters

Dynamo is the opposite design choice to Raft (day 23) and Spanner (day 25). It is the origin of the availability-first side of the CAP trade-off in practice. CAP states that a system under partition must choose between consistency and availability. Cassandra, Riak and Voldemort all descend from Dynamo.

## How to read it

1. Read Table 1. It lists each technique and the problem it solves. The table is a syllabus for distributed storage.
2. Read Section 4.2 for consistent hashing and virtual nodes.
3. Read Section 4.4 for vector clocks and the choice to push merging to the application.
4. Read Section 4.6 for sloppy quorums and hinted handoff.

## Key equation or idea

A write goes to $N$ replicas and succeeds after $W$ of them answer. A read succeeds after $R$ of them answer. If $R + W > N$, a read overlaps the latest write in at least one replica. The overlap gives a recent version, but not a single version.

## What came after

Later Dynamo-style systems replaced vector clocks with last-writer-wins timestamps. The LSM tree (day 26) is the storage engine inside most of them.
`,
    prereqs: [],
    tags: ['storage', 'availability', 'distributed-systems'],
  },
  {
    slug: 'spanner',
    day: 25,
    title: "Spanner: Google's Globally-Distributed Database",
    authors: 'Corbett, Dean, Epstein, Fikes, Frost, Furman, Ghemawat, Gubarev, Heiser, Hochschild et al.',
    year: 2012,
    venue: 'OSDI',
    url: 'https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf',
    track: 'system-design',
    level: 'advanced',
    tldr: 'Transactions with external consistency across datacentres, made possible by a clock API that reports its own uncertainty.',
    notes: `
## What the paper does

The paper describes Spanner, a database that spans many datacentres. Each shard is a Paxos group. A transaction across shards uses two-phase commit. The key component is TrueTime, a clock API that returns an interval instead of a single time. GPS receivers and atomic clocks keep the interval small. A transaction waits until the interval has passed before it commits.

## Why it matters

Before Spanner, most engineers believed that global transactions with strong consistency were too slow. Spanner delivers external consistency: if transaction A commits before transaction B starts, A has the smaller timestamp everywhere. CockroachDB and YugabyteDB are the open-source descendants.

## How to read it

1. Read Section 3 for the TrueTime API and its guarantees.
2. Read Section 4.1.2 for the commit-wait rule.
3. Read Section 4.2.1 for read-only transactions. They need no locks.
4. Read Section 5.1 for the measured clock uncertainty.
5. Compare the design with Dynamo (day 24) and decide which one your product needs.

## Key equation or idea

TrueTime returns an interval $[t_{\\text{earliest}}, t_{\\text{latest}}]$ that contains the true time. A transaction with timestamp $s$ waits until $t_{\\text{earliest}} > s$ before it commits. After the wait, every later transaction on any machine gets a larger timestamp.

## What came after

Hybrid logical clocks gave a software-only approximation of TrueTime. Cloud Spanner became a public product in 2017.
`,
    prereqs: ['raft', 'dynamo'],
    tags: ['transactions', 'consistency', 'distributed-systems'],
  },
  {
    slug: 'lsm-tree',
    day: 26,
    title: 'The Log-Structured Merge-Tree (LSM-Tree)',
    authors: "O'Neil, Cheng, Gawlick, O'Neil",
    year: 1996,
    venue: 'Acta Informatica',
    url: 'https://www.cs.umb.edu/~poneil/lsmtree.pdf',
    track: 'system-design',
    level: 'intermediate',
    tldr: 'Buffer writes in memory, flush sorted runs to disk, and merge runs in the background, to trade read cost for write throughput.',
    notes: `
## What the paper does

The paper introduces the log-structured merge-tree (LSM tree). New writes go to a sorted structure in memory. When the memory structure is full, the system writes it to disk as one sorted file. Background merges combine the files into larger sorted files. A read checks the memory structure first and then the files from newest to oldest.

## Why it matters

A B-tree updates in place, so random writes become random disk operations. The LSM tree makes every write sequential. RocksDB, LevelDB, Cassandra and most modern stores use it. The Kafka partition log is the single-level case of the same design.

## How to read it

1. Read Section 1 for the write-cost problem with B-trees.
2. Read Section 2 for the two-component LSM tree and the rolling merge.
3. Read Section 3 for the cost model with more than two components.
4. Read Section 4 for the comparison with B-tree costs.

## Key equation or idea

The design has three costs. Write amplification is the number of times each byte is rewritten by merges. Read amplification is the number of files a read must check. Space amplification is the disk used beyond the live data. A design can make two of them small, not all three.

## What came after

Bloom filters reduce read amplification. Levelled and size-tiered compaction are the two main merge strategies, and the choice decides whether a store stalls under load.
`,
    prereqs: ['dynamo'],
    tags: ['storage', 'data-structures', 'databases'],
  },
  {
    slug: 'adam',
    day: 27,
    title: 'Adam: A Method for Stochastic Optimization',
    authors: 'Kingma, Ba',
    year: 2015,
    venue: 'ICLR',
    url: 'https://arxiv.org/abs/1412.6980',
    track: 'ml-math',
    level: 'intermediate',
    tldr: 'A step size per weight, computed from running averages of the gradient and of its square, with a correction for the first steps.',
    notes: `
## What the paper does

The paper introduces Adam, an optimizer for stochastic gradient descent. Adam keeps two running averages for every weight. The first average $m_t$ tracks the gradient. The second average $v_t$ tracks the squared gradient. The update divides $m_t$ by the square root of $v_t$. A bias correction repairs the averages in the first steps, when they start at zero.

## Why it matters

Plain gradient descent uses one learning rate for every weight. Gradients in a deep network differ in scale by orders of magnitude across layers. Adam moves each weight by about the learning rate, whatever the gradient scale. Almost every language model trains with Adam or with its weight-decay variant AdamW.

## How to read it

1. Read Algorithm 1.
2. Read Section 3 for the bias correction.
3. Read Section 2.1 for the bound on the step size.
4. Read Section 6 for the experiments.

## Key equation or idea

$$\\theta_t = \\theta_{t-1} - \\eta \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}$$

$\\theta_t$ is the weight, $\\eta$ is the learning rate, $\\hat{m}_t = m_t / (1 - \\beta_1^t)$ is the corrected first moment, $\\hat{v}_t = v_t / (1 - \\beta_2^t)$ is the corrected second moment, and $\\epsilon$ prevents division by zero.

## What came after

AdamW moved weight decay out of the gradient. Language models use $\\beta_2 = 0.95$ instead of the default 0.999. The two extra values per weight are why optimizer state dominates training memory, and why ZeRO (day 30) exists.
`,
    prereqs: [],
    tags: ['optimisation', 'training', 'foundations'],
  },
  {
    slug: 'dropout',
    day: 28,
    title: 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting',
    authors: 'Srivastava, Hinton, Krizhevsky, Sutskever, Salakhutdinov',
    year: 2014,
    venue: 'JMLR',
    url: 'https://jmlr.org/papers/v15/srivastava14a.html',
    track: 'ml-math',
    level: 'beginner',
    tldr: 'Set random activations to zero during training and use the full network at test time, to train an implicit ensemble.',
    notes: `
## What the paper does

The paper introduces dropout, a regularization method. During training, each unit is kept with probability $p$ and set to zero otherwise. Each minibatch therefore trains a different thin sub-network. At test time, all units are active and the weights are scaled by $p$. This approximates the average of all the sub-networks.

## Why it matters

Dropout made deep networks trainable on small datasets without overfitting. It also started the habit of seeing training-time noise as an ensemble. The paper improved the best results on vision, speech and text benchmarks of its time. Large language models usually set dropout to zero, because they see each token once and underfit rather than overfit.

## How to read it

1. Read Section 2 for the motivation from sexual reproduction and co-adaptation.
2. Read Section 4 for the training and test rules.
3. Read Section 7.1 for the feature visualizations.
4. Read Section 7.4 for the effect of $p$ and Section 7.5 for the data size results.

## Key equation or idea

A network with $n$ units contains $2^n$ possible thin networks. Dropout trains them with shared weights. At test time, the scaled full network approximates the geometric mean of their predictions.

## What came after

Inverted dropout divides by $p$ during training instead, so inference needs no change. Every framework uses this form. Batch normalization (day 35) replaced dropout in most vision models.
`,
    prereqs: ['adam'],
    tags: ['regularisation', 'training', 'foundations'],
  },
  {
    slug: 'megatron-lm',
    day: 29,
    title: 'Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism',
    authors: 'Shoeybi, Patwary, Puri, LeGresley, Casper, Catanzaro',
    year: 2019,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/1909.08053',
    track: 'inference-engineering',
    level: 'advanced',
    tldr: 'Split each attention and feed-forward block across GPUs along the right axis, so each layer needs only two all-reduce operations.',
    notes: `
## What the paper does

The paper introduces tensor parallelism for Transformers. The feed-forward block has two weight matrices. Megatron splits the first by columns and the second by rows. The nonlinear function between them then runs on each GPU without communication. Attention splits by head. Each layer needs one all-reduce in the forward pass and one in the backward pass. An all-reduce sums a tensor across all GPUs.

## Why it matters

A single GPU cannot hold a model with more than a few billion weights. Megatron trained a model with 8.3 billion weights on 512 GPUs with 76 percent scaling efficiency. Every frontier model still uses this layout inside a node.

## How to read it

1. Read Section 3 and Figure 3 for the split of the feed-forward block and the attention block.
2. Read the definitions of the $f$ and $g$ operators. $f$ is the identity in the forward pass and an all-reduce in the backward pass. $g$ is the reverse.
3. Read Section 5.1 for the scaling results.

## Key equation or idea

For $Y = \\text{GeLU}(X A)$ with $A = [A_1, A_2]$ split by columns, each GPU computes $\\text{GeLU}(X A_i)$ alone. For the next matrix $B$ split by rows, each GPU computes a partial product, and one all-reduce gives the sum.

## What came after

Tensor parallelism stays inside a node, because it needs NVLink bandwidth. Pipeline and data parallelism cover the links between nodes. ZeRO (day 30) combines with it.
`,
    prereqs: ['attention-is-all-you-need', 'scaling-laws'],
    tags: ['parallelism', 'training', 'systems'],
  },
  {
    slug: 'zero',
    day: 30,
    title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models',
    authors: 'Rajbhandari, Rasley, Ruwase, He',
    year: 2020,
    venue: 'SC20',
    url: 'https://arxiv.org/abs/1910.02054',
    track: 'inference-engineering',
    level: 'advanced',
    tldr: 'Data parallelism keeps the full optimizer state on every GPU. Shard it, and the memory per GPU falls by the number of GPUs.',
    notes: `
## What the paper does

The paper introduces the Zero Redundancy Optimizer (ZeRO). Standard data parallelism keeps a full copy of the weights, the gradients and the optimizer state on every GPU. ZeRO stage 1 shards the optimizer state across the GPUs. Stage 2 also shards the gradients. Stage 3 also shards the weights and gathers each layer just before use.

## Why it matters

Mixed-precision Adam needs about 16 bytes per weight: 2 for the half-precision weight, 2 for the gradient, 4 for the full-precision master weight, and 8 for the two moments. For a model with 7.5 billion weights, that is 120 GB per GPU. ZeRO stage 3 on 64 GPUs cuts it to under 2 GB. The communication volume for stages 1 and 2 is the same as plain data parallelism.

## How to read it

1. Read Section 3 for the memory breakdown.
2. Read Figure 1 and Table 1 for the memory per GPU at each stage.
3. Read Section 5 for the three stages.
4. Read Section 7 for the communication analysis.

## Key equation or idea

Memory per GPU for the optimizer state falls from $12 \\Psi$ to $12 \\Psi / N_d$. $\\Psi$ is the number of weights and $N_d$ is the number of data-parallel GPUs.

## What came after

Fully sharded data parallelism (FSDP) in PyTorch is ZeRO stage 3. Production runs stack ZeRO with Megatron tensor parallelism (day 29).
`,
    prereqs: ['adam', 'megatron-lm'],
    tags: ['parallelism', 'training', 'memory'],
  },
  {
    slug: 'speculative-decoding',
    day: 31,
    title: 'Fast Inference from Transformers via Speculative Decoding',
    authors: 'Leviathan, Kalman, Matias',
    year: 2023,
    venue: 'ICML',
    url: 'https://arxiv.org/abs/2211.17192',
    track: 'inference-engineering',
    level: 'advanced',
    tldr: 'A small draft model proposes several tokens, and the large target model checks them in one forward pass, with the same output distribution.',
    notes: `
## What the paper does

The paper gives an algorithm to speed up sampling from a large model. A small draft model samples $\\gamma$ tokens. The large target model scores all of them in one forward pass. Each draft token is accepted with probability $\\min(1, p(x)/q(x))$, where $p$ is the target probability and $q$ is the draft probability. The first rejected token is resampled from a corrected distribution.

## Why it matters

Decode is limited by memory bandwidth. A forward pass over 5 tokens costs about the same as a pass over 1 token. Speculative decoding uses this spare compute. The output is identical in distribution to sampling from the target model alone. Typical speedups are 2 to 3 times.

## How to read it

1. Read Section 2 and Algorithm 1 for the sampling and acceptance rule.
2. Read Theorem 3.5. It proves the output distribution is unchanged.
3. Read Section 3.5 for the expected number of accepted tokens.
4. Read Section 4 for the results on translation and summarization.

## Key equation or idea

$$\\mathbb{E}[\\text{accepted tokens}] = \\frac{1 - \\alpha^{\\gamma + 1}}{1 - \\alpha}$$

$\\alpha$ is the expected agreement between the draft and the target, and $\\gamma$ is the number of draft tokens. A higher $\\alpha$ gives more tokens per target pass.

## What came after

The speedup falls at high batch load, because the spare compute disappears. Medusa (day 32) removed the separate draft model. EAGLE drafts at the hidden-state level.
`,
    prereqs: ['flash-attention', 'paged-attention'],
    tags: ['serving', 'decoding', 'latency'],
  },
  {
    slug: 'medusa',
    day: 32,
    title: 'Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads',
    authors: 'Cai, Li, Geng, Peng, Lee, Chen, Dao',
    year: 2024,
    venue: 'ICML',
    url: 'https://arxiv.org/abs/2401.10774',
    track: 'inference-engineering',
    level: 'advanced',
    tldr: 'Remove the draft model. Extra prediction heads on the target model propose a tree of candidates, and one forward pass checks the tree.',
    notes: `
## What the paper does

The paper adds $k$ small prediction heads on top of the last hidden state of a language model. Head $i$ predicts the token $i$ positions ahead. The top candidates of all heads form a tree of possible continuations. A special attention mask lets one forward pass score every path in the tree. The longest accepted path becomes the output.

## Why it matters

Speculative decoding (day 31) needs a draft model with the same tokenizer and a close distribution. Such a model is hard to find and costs memory. Medusa needs no second model and no second key-value cache. It gives a 2.2 to 2.8 times speedup.

## How to read it

1. Read Figure 1 for the heads and the tree.
2. Read Section 3.1 for the head architecture.
3. Read Section 3.2 for tree attention and the mask.
4. Read Section 3.3 for the two training modes. Medusa-1 freezes the base model. Medusa-2 trains the base model with the heads.

## Key equation or idea

Head $k$ computes $p_t^{(k)} = \\text{softmax}(W_2^{(k)} \\cdot \\text{SiLU}(W_1^{(k)} h_t) + h_t)$ with a residual link. $h_t$ is the last hidden state, and $W_1^{(k)}$ and $W_2^{(k)}$ are the head weights. The output is the distribution over the token at position $t + k + 1$.

## What came after

Medusa-1 can be added to a model you did not train. EAGLE drafts with a one-layer autoregressive head on the hidden states and reaches higher acceptance rates.
`,
    prereqs: ['speculative-decoding'],
    tags: ['serving', 'decoding', 'latency'],
  },
  {
    slug: 'toolformer',
    day: 33,
    title: 'Toolformer: Language Models Can Teach Themselves to Use Tools',
    authors: 'Schick, Dwivedi-Yu, Dessì, Raileanu, Lomeli, Zettlemoyer, Cancedda, Scialom',
    year: 2023,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2302.04761',
    track: 'ai-engineering',
    level: 'intermediate',
    tldr: 'A language model teaches itself when to call an API, by keeping only the calls that reduce its own loss on the next tokens.',
    notes: `
## What the paper does

The paper trains a language model to call tools such as a calculator, a search engine and a calendar. The model writes a few examples of API calls into a text corpus. Each call runs, and the result is inserted into the text. The paper keeps a call only if it lowers the loss on the tokens after it. The model then fine-tunes on the filtered corpus.

## Why it matters

ReAct (day 16) puts tool use into the prompt. Toolformer puts it into the weights. The model learns both when to call a tool and how to write the call, without human labels. A model with 6.7 billion weights beat GPT-3 on arithmetic and fact tasks.

## How to read it

1. Read Figure 1 for the three-step data pipeline.
2. Read Section 2 for the filtering rule.
3. Read Section 3 for the five tools.
4. Read Table 1 and the following tables for the results per tool.

## Key equation or idea

A call $c_i$ with result $r_i$ is kept if $L_i^- - L_i^+ \\geq \\tau$. $L_i^+$ is the loss on the following tokens with the call and its result in the context. $L_i^-$ is the smaller loss without the call or with the call but no result. $\\tau$ is a threshold.

## What came after

Function calling became a standard feature of model APIs. Tool use is now trained in post-training with large synthetic datasets.
`,
    prereqs: ['react', 'gpt-3'],
    tags: ['agents', 'tool-use', 'self-supervision'],
  },
  {
    slug: 'colbert',
    day: 34,
    title: 'ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT',
    authors: 'Khattab, Zaharia',
    year: 2020,
    venue: 'SIGIR',
    url: 'https://arxiv.org/abs/2004.12832',
    track: 'ai-engineering',
    level: 'advanced',
    tldr: 'Keep one vector per token for both the query and the passage, and score with a sum of per-token maximum similarities.',
    notes: `
## What the paper does

The paper introduces ColBERT, a retrieval model with late interaction. A BERT encoder maps every query token to a vector and every passage token to a vector. The passage vectors are computed once and stored. At query time, each query token finds its most similar passage token. The score is the sum of these maxima.

## Why it matters

A bi-encoder such as DPR (day 21) compresses a passage into one vector and loses detail. A cross-encoder reads the query and the passage together and is accurate but slow. ColBERT keeps the accuracy of fine-grained matching and the speed of precomputed passage vectors. It is the standard answer to the entity-heavy queries where DPR fails.

## How to read it

1. Read Figure 1 for the comparison of four scoring architectures.
2. Read Section 3.1 for the query and passage encoders.
3. Read Section 3.3 for the MaxSim score.
4. Read Section 3.4 for the end-to-end retrieval with a vector index.

## Key equation or idea

$$S_{q, d} = \\sum_{i} \\max_{j} E_{q_i} \\cdot E_{d_j}^T$$

$E_{q_i}$ is the vector of query token $i$, $E_{d_j}$ is the vector of passage token $j$, and the dot product is the similarity. The sum runs over the query tokens, and the maximum runs over the passage tokens.

## What came after

ColBERTv2 compressed the token vectors to reduce storage. Late interaction is now a standard reranker option in retrieval-augmented generation pipelines.
`,
    prereqs: ['bert', 'dpr'],
    tags: ['retrieval', 'late-interaction', 'rag'],
  },
  {
    slug: 'batch-normalization',
    day: 35,
    title: 'Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift',
    authors: 'Ioffe, Szegedy',
    year: 2015,
    venue: 'ICML',
    url: 'https://arxiv.org/abs/1502.03167',
    track: 'ml-math',
    level: 'intermediate',
    tldr: 'Normalize each layer input to zero mean and unit variance over the minibatch, so deep networks train faster with higher learning rates.',
    notes: `
## What the paper does

The paper introduces batch normalization (BN). For each feature, BN subtracts the minibatch mean and divides by the minibatch standard deviation. Two learned values, a scale $\\gamma$ and a shift $\\beta$, restore the ability to represent any output. At test time, BN uses running averages of the mean and the variance instead of the minibatch statistics.

## Why it matters

Before BN, deep networks needed careful initialization and low learning rates. The paper names the problem internal covariate shift: the distribution of each layer input changes as the earlier layers train. With BN, an image classifier reached the same accuracy in 14 times fewer steps. BN also reduced the need for dropout.

## How to read it

1. Read Section 2 for the problem statement.
2. Read Section 3 and Algorithm 1 for the training rule.
3. Read Section 3.1 for the inference rule with running averages.
4. Read Section 4.2 for the ImageNet experiments.

## Key equation or idea

$$y = \\gamma \\frac{x - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}} + \\beta$$

$x$ is the input, $\\mu_B$ is the minibatch mean, $\\sigma_B^2$ is the minibatch variance, $\\epsilon$ is a small constant for numerical safety, and $\\gamma$ and $\\beta$ are learned.

## What came after

Later work showed that the main effect is a smoother loss surface, not the removal of covariate shift. Layer normalization replaced BN in Transformers, because it does not depend on the batch.
`,
    prereqs: ['dropout'],
    tags: ['normalisation', 'training', 'foundations'],
  },
  {
    slug: 'rlaif',
    day: 36,
    title: 'RLAIF: Scaling Reinforcement Learning from Human Feedback with AI Feedback',
    authors: 'Lee, Phatale, Mansoor, Mesnard, Ferret, Lu, Bishop, Hall, Carbune, Rastogi, Prakash',
    year: 2023,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/2309.00267',
    track: 'ai-research',
    level: 'advanced',
    tldr: 'Preference labels from a language model train a reward model as well as human labels do, at a fraction of the cost.',
    notes: `
## What the paper does

The paper compares reinforcement learning from AI feedback (RLAIF) with reinforcement learning from human feedback (RLHF). A large language model labels which of two answers is better. These labels train a reward model. The policy then trains against the reward model. The paper also tests direct RLAIF, where the labeler model scores the policy outputs during training with no separate reward model.

## Why it matters

Human preference labels are the most expensive part of RLHF. The paper shows that humans prefer the RLAIF policy and the RLHF policy at the same rate on summarization and dialogue tasks. The AI labels cost about ten times less. The paper also shows that a labeler model can improve a policy of the same size as itself.

## How to read it

1. Read Figure 1 for the two pipelines side by side.
2. Read Section 3.1 for the labeling prompt, with the preamble and chain-of-thought reasoning.
3. Read Table 1 for the win rates against humans.
4. Read Section 4.3 for the same-size labeler result.

## Key equation or idea

The labeler model outputs the probability of "answer 1" and "answer 2" after a reasoning prompt. These two probabilities form a soft label. The reward model trains with cross-entropy against the soft label.

## What came after

Constitutional AI (day 17) introduced the idea. RLAIF gave the controlled comparison. Synthetic preference data is now the main input of most open post-training pipelines.
`,
    prereqs: ['instructgpt', 'constitutional-ai'],
    tags: ['alignment', 'rlaif', 'post-training'],
  },
  {
    slug: 'a-few-useful-things-ml',
    day: 37,
    title: 'A Few Useful Things to Know About Machine Learning',
    authors: 'Domingos',
    year: 2012,
    venue: 'CACM',
    url: 'https://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf',
    track: 'ai-foundations',
    level: 'beginner',
    tldr: 'Twelve short lessons about learning from data: generalization is the goal, overfitting has many faces, and more data often beats a cleverer algorithm.',
    notes: `
## What the paper does

The paper collects twelve lessons that machine learning researchers know but textbooks rarely state. Each lesson is one short section. The paper covers what a learner is made of (representation, evaluation and optimization), why generalization is the goal, why data alone is not enough, how overfitting happens, why intuition fails in high dimensions, and why more data often beats a cleverer algorithm.

## Why it matters

A beginner can run scikit-learn in five lines and get a number. The number means nothing without the ideas in this paper. The paper explains why you must hold out test data, why a model with a perfect training score can be useless, and why feature engineering takes most of the work on a real project. It is the shortest honest map of the field.

## How to read it

1. Read the first section. It splits every learner into three parts: representation, evaluation and optimization. Keep this split in mind for every model you meet.
2. Read "It's generalization that counts" and "Overfitting has many faces" together. They explain the train/test split.
3. Read "Intuition fails in high dimensions". This is the curse of dimensionality in plain words.
4. Read "More data beats a cleverer algorithm" and "Feature engineering is the key". These two sections decide how you spend your time on a project.
5. Skip "Theoretical guarantees are not what they seem" on the first pass.

## Key equation or idea

Generalization error splits into bias and variance. Bias is the error a learner makes when it is too simple for the data. Variance is the error it makes when it follows random noise in the training set. A linear model has high bias and low variance. A deep decision tree has low bias and high variance. Cross-validation measures the sum of the two on data the learner did not see.

## What came after

The three-part split explains every paper in this list. Hidden Technical Debt (day 43) describes what happens when these lessons meet a production system. The Deep Learning review (day 38) shows how neural networks learn their own features, which changes the feature engineering lesson but not the generalization lesson.
`,
    prereqs: [],
    tags: ['foundations', 'generalization', 'overfitting'],
  },
  {
    slug: 'deep-learning-review',
    day: 38,
    title: 'Deep Learning',
    authors: 'LeCun, Bengio, Hinton',
    year: 2015,
    venue: 'Nature',
    url: 'https://www.nature.com/articles/nature14539',
    track: 'ai-foundations',
    level: 'beginner',
    tldr: 'A nine-page review of deep learning by the three people who built the field: layers learn features from raw data, and backpropagation trains them.',
    notes: `
## What the paper does

The paper is a review, not an experiment. Three of the people who built the field explain deep learning in nine pages. It covers supervised learning, gradient descent and backpropagation, convolutional networks for images, distributed representations for words, and recurrent networks for sequences. It ends with a short list of open problems that later papers solved.

## Why it matters

Before deep learning, an engineer wrote the feature extractor by hand. A deep network learns the features from raw data. Each layer turns the output of the layer below into a slightly more abstract description. Pixels become edges, edges become parts, parts become objects. The paper states this idea in one place with clear figures. LeCun, Bengio and Hinton shared the 2018 Turing Award for the work it describes.

## How to read it

1. Read the first two pages for the representation learning idea.
2. Read the box on backpropagation and Figure 1. The figure shows the forward pass and the backward pass on a small network. Draw it yourself.
3. Read the section on convolutional networks. Note the four ideas: local connections, shared weights, pooling and many layers.
4. Read the section on distributed representations and language. It links to word2vec (day 39).
5. Read the last section, "The future of deep learning". Attention and memory are on the list.

## Key equation or idea

A layer computes $z = Wx + b$ and then $y = f(z)$, where $x$ is the input vector, $W$ is the weight matrix, $b$ is the bias vector and $f$ is a non-linear function such as ReLU, $f(z) = \\max(0, z)$. The network stacks many such layers. Backpropagation applies the chain rule from the output back to each weight, so one backward pass gives the gradient for every weight at once.

## What came after

Dropout (day 28) and Batch Normalization (day 35) made deep networks easier to train. The Transformer (day 1) replaced the recurrent networks in the sequence section. Every later paper in the beginner list assumes the ideas in this review.
`,
    prereqs: ['a-few-useful-things-ml'],
    tags: ['foundations', 'neural-networks', 'backpropagation'],
  },
  {
    slug: 'word2vec',
    day: 39,
    title: 'Efficient Estimation of Word Representations in Vector Space',
    authors: 'Mikolov, Chen, Corrado, Dean',
    year: 2013,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/1301.3781',
    track: 'ai-foundations',
    level: 'beginner',
    tldr: 'Train a tiny network to predict a word from its neighbours, and the hidden layer becomes a vector for each word where similar words sit close together.',
    notes: `
## What the paper does

The paper trains a small neural network to predict a word from its neighbours (CBOW) or the neighbours from the word (Skip-gram). The hidden layer of the network becomes a vector for each word. The vectors are a few hundred numbers long. The paper shows that these vectors capture meaning: words with similar use get similar vectors, and some relations become straight lines in the vector space.

## Why it matters

Before this paper, a word was a one-hot vector: a list of zeros with one 1. Every pair of words was equally far apart. After this paper, "king" and "queen" sit close together, and "king" minus "man" plus "woman" lands near "queen". The paper also showed that a simple model trained on a very large corpus beats a complex model trained on a small one. This is the idea behind every embedding model you will use for retrieval.

## How to read it

1. Read Section 3 for the two architectures. Figure 1 shows both. CBOW averages the context; Skip-gram predicts each context word.
2. Read Section 4 for the analogy test. The test is "a is to b as c is to what?", answered by vector arithmetic.
3. Read Table 3. More dimensions and more data both raise the accuracy.
4. Skip the hierarchical softmax details on the first pass.

## Key equation or idea

Skip-gram maximises the average log probability of the context words:

$$\\frac{1}{T} \\sum_{t=1}^{T} \\sum_{-c \\le j \\le c,\\, j \\ne 0} \\log p(w_{t+j} \\mid w_t)$$

$T$ is the number of words in the corpus, $c$ is the window size, $w_t$ is the centre word and $w_{t+j}$ is a context word. Two words that appear in the same contexts get vectors that point in the same direction, so the dot product between them is large.

## What came after

GloVe computed similar vectors from co-occurrence counts. BERT (day 10) gave each word a different vector in each sentence. Sentence-BERT (day 44) made one vector for a whole sentence, which is what a RAG system (day 45) stores in its vector database.
`,
    prereqs: ['deep-learning-review'],
    tags: ['embeddings', 'nlp', 'foundations'],
  },
  {
    slug: 'gpt-2',
    day: 40,
    title: 'Language Models are Unsupervised Multitask Learners',
    authors: 'Radford, Wu, Child, Luan, Amodei, Sutskever',
    year: 2019,
    venue: 'OpenAI',
    url: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf',
    track: 'ai-foundations',
    level: 'beginner',
    tldr: 'A 1.5 billion weight Transformer trained only to predict the next token does summarisation, translation and question answering when the prompt describes the task.',
    notes: `
## What the paper does

The paper trains a decoder-only Transformer with 1.5 billion weights on WebText, 40 gigabytes of web pages linked from Reddit. The only training task is to predict the next token. The paper then tests the model on reading comprehension, summarisation, translation and question answering with no fine-tuning. It writes the task as text, such as "TL;DR:" for a summary, and reads the model's continuation.

## Why it matters

GPT-2 showed that one model trained on one objective can do many tasks when the prompt describes the task. This is the zero-shot idea. It also showed that results keep rising with model size on a log scale, which led to the scaling laws (day 2) and to GPT-3 (day 9). The model is small enough to run on a laptop, so it is the first LLM many people train or fine-tune themselves.

## How to read it

1. Read Section 2 for the training data and the byte-pair encoding tokenizer. The tokenizer is still used today.
2. Read Table 2 for the four model sizes, from 117 million to 1.5 billion weights.
3. Read Section 3 and Figure 1. Every task score rises with model size, and none has flattened.
4. Read Section 4 on memorisation. The authors check how much test data appears in the training set.

## Key equation or idea

A language model computes the probability of a text as a product of next-token probabilities:

$$p(x) = \\prod_{i=1}^{n} p(s_i \\mid s_1, \\ldots, s_{i-1})$$

$x$ is the text, $s_i$ is token $i$, and $n$ is the number of tokens. A task becomes $p(\\text{output} \\mid \\text{input}, \\text{task})$. The task is just more tokens in the context, so one model can do any task that can be written as text.

## What came after

GPT-3 (day 9) grew the model 100 times and added few-shot examples to the prompt. InstructGPT (day 4) added human feedback so the model follows instructions. The chain-of-thought paper (day 15) showed that the prompt can also ask for reasoning steps.
`,
    prereqs: ['attention-is-all-you-need'],
    tags: ['language-models', 'pretraining', 'zero-shot'],
  },
  {
    slug: 'datasheets-for-datasets',
    day: 41,
    title: 'Datasheets for Datasets',
    authors: 'Gebru, Morgenstern, Vecchione, Vaughan, Wallach, Daumé III, Crawford',
    year: 2018,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/1803.09010',
    track: 'ai-foundations',
    level: 'beginner',
    tldr: 'Every dataset should ship with a short document that answers fixed questions about why it was made, what is in it, how it was collected and how it may be used.',
    notes: `
## What the paper does

The paper proposes a datasheet, a short document that travels with every dataset. The datasheet answers questions in seven groups: motivation, composition, collection process, preprocessing, uses, distribution and maintenance. The idea comes from electronics, where every component ships with a datasheet that lists its operating conditions. The paper gives the full question list and worked examples.

## Why it matters

A model is only as good as its data. Many public datasets have no record of who collected them, what was removed, or which uses the authors meant. Teams then train on data that does not match their task, or that contains private information. A datasheet makes a dataset creator write these facts down once, and makes a dataset user read them before training. It is the first thing to write when you build a dataset of your own.

## How to read it

1. Read Section 1 for the electronics analogy and the two audiences: creators and consumers.
2. Read Section 3 for the questions. Do not try to memorise them. Note that each group has a reason stated under it.
3. Read the example datasheet in the appendix. It shows how an honest answer looks, including answers such as "unknown".
4. Then open a dataset you use and try to answer the composition questions for it.

## Key equation or idea

There is no equation. The idea is a checklist with a fixed order. The order matters: motivation comes first, because the reason a dataset exists explains most of its gaps. Composition comes second, because it tells a user what each row is, how many rows there are, and whether the data is a sample or the whole population.

## What came after

Model Cards (day 42) applied the same idea to trained models. Hugging Face added a dataset card to every dataset on its hub, with fields taken from this paper. Hidden Technical Debt (day 43) explains why data dependencies are the most expensive part of a machine learning system.
`,
    prereqs: [],
    tags: ['data', 'documentation', 'ethics'],
  },
  {
    slug: 'model-cards',
    day: 42,
    title: 'Model Cards for Model Reporting',
    authors: 'Mitchell, Wu, Zaldivar, Barnes, Vasserman, Hutchinson, Spitzer, Raji, Gebru',
    year: 2018,
    venue: 'arXiv',
    url: 'https://arxiv.org/abs/1810.03993',
    track: 'ai-foundations',
    level: 'beginner',
    tldr: 'Every trained model should ship with a one-page card that states its intended use, its evaluation data, and its scores broken down by group.',
    notes: `
## What the paper does

The paper proposes a model card, a one or two page document that ships with a trained model. The card lists the model's details, its intended uses and the uses it is not meant for, the factors that change its behaviour, the metrics used, the evaluation data, the training data, and the results broken down by group. The paper shows two cards: one for a smile detector and one for a toxicity classifier.

## Why it matters

A single accuracy number hides a lot. A face model can score 95 percent overall and 70 percent on one skin tone. A model card forces the author to report the score per group, so the user sees the gap before deployment. The card also states the intended use, so a model built for one task is not quietly reused for another. Every model on the Hugging Face hub now has a card, and this paper set the format.

## How to read it

1. Read Section 1 for the motivation. It names the people who read a card: developers, policy makers, and the people the model affects.
2. Read Section 4 for the nine sections of a card. The section on intended use is the most important and the most often skipped.
3. Read Figure 2, the smile detector card. Note how the evaluation table splits by age, gender and skin type.
4. Read Section 5 on disaggregated evaluation.

## Key equation or idea

Evaluate on every slice, not only on the whole. If the test set has groups $g_1, \\ldots, g_k$, report the metric for each $g_i$ and for every pair of groups when the groups cross, such as age with gender. Confidence intervals matter here, because a small group gives a noisy number. A gap between slices is a finding, not a footnote.

## What came after

Datasheets (day 41) covers the data side of the same problem. Llama 3 (day 18) and most open model releases now publish a model card with evaluation tables in this format. Your own fine-tuned model should ship with one.
`,
    prereqs: ['datasheets-for-datasets'],
    tags: ['evaluation', 'documentation', 'ethics'],
  },
  {
    slug: 'hidden-technical-debt',
    day: 43,
    title: 'Hidden Technical Debt in Machine Learning Systems',
    authors: 'Sculley, Holt, Golovin, Davydov, Phillips, Ebner, Chaudhary, Young, Crespo, Dennison',
    year: 2015,
    venue: 'NeurIPS',
    url: 'https://proceedings.neurips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html',
    track: 'build-ai-ecosystem',
    level: 'beginner',
    tldr: 'The model is a small box in the middle of a large system, and the data pipelines, glue code and feedback loops around it are where the maintenance cost hides.',
    notes: `
## What the paper does

The paper lists the ways a machine learning system costs more to maintain than a normal program. The authors work at Google and write from experience. The debt comes in groups: entanglement (changing one input changes everything), hidden feedback loops, undeclared consumers of model outputs, data dependencies that nobody tracks, glue code and pipeline jungles, configuration debt, and changes in the outside world. The paper gives one figure that every engineer has seen since: the model code is a small black box in the middle of a large diagram of infrastructure.

## Why it matters

Beginners think the model is the project. In a real system the model is about five percent of the code. The rest collects data, checks it, builds features, serves predictions, and watches the results. Each of these parts can break in a way that no test catches, because the model keeps returning numbers that look fine. This paper gives names to those failures, so a team can look for them.

## How to read it

1. Read Figure 1 first. It shows how small the model code is.
2. Read Section 2 on entanglement. The rule "Changing Anything Changes Everything" explains why you cannot swap one feature freely.
3. Read Section 4 on data dependencies. Unstable inputs and unused features are the two most common forms.
4. Read Section 7, the list of questions to ask about your own system. Use it as a checklist.

## Key equation or idea

CACE: Changing Anything Changes Everything. A model learns the joint pattern of all its inputs. If you change the scale of one input, the weights for all the other inputs are now wrong too. No part of a learned model can be tested alone. This is why a machine learning system needs end-to-end checks on the data and on the predictions, not only unit tests on the code.

## What came after

Datasheets (day 41) and Model Cards (day 42) are documentation answers to the data dependency and undeclared consumer problems. The field of MLOps grew from this paper. The ship-it module of the project track teaches logging, tracing and alerts, which are the tools that make the debt visible.
`,
    prereqs: ['a-few-useful-things-ml'],
    tags: ['mlops', 'systems', 'production'],
  },
  {
    slug: 'sentence-bert',
    day: 44,
    title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks',
    authors: 'Reimers, Gurevych',
    year: 2019,
    venue: 'EMNLP',
    url: 'https://arxiv.org/abs/1908.10084',
    track: 'build-ai-ecosystem',
    level: 'intermediate',
    tldr: 'Fine-tune BERT so each sentence becomes one fixed vector, and similarity search over thousands of sentences drops from hours to seconds.',
    notes: `
## What the paper does

BERT (day 10) compares two sentences by feeding both into the network at once. That gives good scores, but finding the most similar pair in 10,000 sentences takes 50 million forward passes. Sentence-BERT (SBERT) fine-tunes BERT with a siamese setup: each sentence goes through the network alone and comes out as one fixed vector. Similar sentences get vectors with high cosine similarity. The 10,000-sentence search then takes 10,000 forward passes plus a fast vector comparison.

## Why it matters

This is the paper behind every embedding model you use in a RAG system (day 45). The sentence-transformers library that the authors released is still a standard way to turn text into vectors. The paper shows the trade: a small loss in accuracy against a cross-encoder, for a speed gain of about 65 hours down to 5 seconds on the clustering task.

## How to read it

1. Read Section 1 for the 50 million forward passes problem. This is the whole motivation.
2. Read Section 3 and Figure 1 for the siamese network and the three loss functions. Mean pooling over the token outputs gives the sentence vector.
3. Read Table 1. Plain BERT vectors without fine-tuning score worse than averaged GloVe vectors. Fine-tuning is what makes the vectors useful.
4. Read Section 6 for the time comparison.

## Key equation or idea

Two sentences $a$ and $b$ get vectors $u$ and $v$. Their similarity is the cosine:

$$\\cos(u, v) = \\frac{u \\cdot v}{\\|u\\| \\, \\|v\\|}$$

The training loss pushes the cosine of sentence pairs with the same meaning towards 1 and the cosine of unrelated pairs towards 0. Because each vector depends on one sentence only, you can compute all the vectors once and store them.

## What came after

DPR (day 21) trained separate encoders for questions and passages for search. RAG (day 45) put the vectors in front of a generator. ColBERT (day 34) kept one vector per token instead of one per sentence for higher accuracy. Lost in the Middle (day 46) shows what happens after retrieval, when the passages reach the model.
`,
    prereqs: ['bert', 'word2vec'],
    tags: ['embeddings', 'retrieval', 'nlp'],
  },
  {
    slug: 'rag',
    day: 45,
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Lewis, Perez, Piktus, Petroni, Karpukhin, Goyal, Küttler, Lewis, Yih, Rocktäschel, Riedel, Kiela',
    year: 2020,
    venue: 'NeurIPS',
    url: 'https://arxiv.org/abs/2005.11401',
    track: 'build-ai-ecosystem',
    level: 'intermediate',
    tldr: 'Join a dense retriever and a text generator: the model looks up passages in a document store before it answers, so facts live in an index you can update.',
    notes: `
## What the paper does

The paper joins a retriever and a generator into one model. The retriever is DPR (day 21): it turns the question into a vector and finds the nearest passages in a Wikipedia index of 21 million chunks. The generator is BART, a sequence-to-sequence Transformer. It reads the question and the retrieved passages and writes the answer. The two parts train together, so the retriever learns which passages help the generator.

## Why it matters

A language model stores facts in its weights. The facts are fixed on the day training ends, and the model cannot show where a fact came from. RAG moves the facts into a document store that you can update and inspect. The answer comes with the passages that support it. This is the architecture of almost every "chat with your documents" product, and it is what the retrieval module of the project track builds.

## How to read it

1. Read Figure 1. It shows the question going to the retriever, the top passages going to the generator, and the answer coming out.
2. Read Section 2 for the two variants. RAG-Sequence uses one passage for the whole answer; RAG-Token can switch passages per token.
3. Read Section 4 and Table 1 for the open-domain question answering results.
4. Read Section 4.5 on swapping the index. The authors replaced the 2016 Wikipedia with the 2018 one and the model's answers changed without retraining.

## Key equation or idea

RAG-Sequence marginalises over the top $k$ retrieved passages $z$:

$$p(y \\mid x) \\approx \\sum_{z \\in \\text{top-}k} p_{\\eta}(z \\mid x) \\, p_{\\theta}(y \\mid x, z)$$

$x$ is the question, $y$ is the answer, $p_{\\eta}(z \\mid x)$ is the retriever score and $p_{\\theta}(y \\mid x, z)$ is the generator. Most systems today skip the sum and simply paste the top passages into the prompt.

## What came after

Modern RAG systems use an instruction-tuned LLM as the generator and a vector database such as Chroma or FAISS as the index. Lost in the Middle (day 46) shows that the position of the right passage in the prompt changes the answer. ColBERT (day 34) and hybrid search improve the retrieval step.
`,
    prereqs: ['sentence-bert', 'dpr'],
    tags: ['retrieval', 'rag', 'nlp'],
  },
  {
    slug: 'lost-in-the-middle',
    day: 46,
    title: 'Lost in the Middle: How Language Models Use Long Contexts',
    authors: 'Liu, Lin, Hewitt, Paranjape, Bevilacqua, Petroni, Liang',
    year: 2023,
    venue: 'TACL',
    url: 'https://arxiv.org/abs/2307.03172',
    track: 'build-ai-ecosystem',
    level: 'beginner',
    tldr: 'Put the right document in the middle of a long prompt and accuracy falls; put it first or last and accuracy rises. Order your retrieved chunks.',
    notes: `
## What the paper does

The paper tests what a language model does with a long prompt. The task is question answering with 10, 20 or 30 retrieved documents in the context. Exactly one document holds the answer. The authors move that document to each position, from first to last, and measure accuracy. They repeat the test on a key-value lookup task that has no natural language at all.

## Why it matters

The result is a U-shaped curve. Accuracy is high when the answer is at the start of the prompt, high when it is at the end, and much lower when it is in the middle. In some runs the model with the answer in the middle scores lower than the same model with no documents at all. A RAG system (day 45) that pastes 20 chunks into a prompt in retrieval order can hide the best chunk in the worst place. The fix is cheap: put the top-ranked chunks first or last, and send fewer of them.

## How to read it

1. Read Figure 1. It shows the U curve for one model. The whole paper is in this figure.
2. Read Section 2 for the multi-document question answering setup.
3. Read Figure 5 for the result across models. Models with longer context windows show the same curve; a bigger window does not fix the middle.
4. Read Section 3 for the key-value task. The curve appears even with no natural language, so it is a property of the model, not of the text.
5. Read Section 5 for the retriever-reader trade-off: more documents raise recall but lower the final accuracy past a point.

## Key equation or idea

There is no equation. The idea is an experiment design: hold everything fixed and move one thing. The one thing is the position of the gold document. Because each position gets the same documents and the same question, any change in accuracy comes from position alone.

## What came after

Reranking became a standard step: retrieve 50 chunks, rerank, keep the top 5, and place them in order. Longer-context models of 2024 and 2025 reduced the dip but did not remove it. The evaluate-rag lesson of the project track measures this on your own documents.
`,
    prereqs: ['rag'],
    tags: ['rag', 'context-window', 'evaluation'],
  },
]

export function findPaper(slug: string) {
  return papers.find((p) => p.slug === slug)
}

const TRACK_ORDER = [
  'ai-research',
  'ai-engineering',
  'inference-engineering',
  'system-design',
  'ml-math',
  'open-robotics',
]

/**
 * Papers grouped by track, each group in a dependency-respecting order.
 * A paper never appears before one of its prereqs; ties are broken by day.
 */
export function paperHierarchy(): { track: string; papers: Paper[] }[] {
  const bySlug = new Map(papers.map((p) => [p.slug, p]))
  const indegree = new Map<string, number>()
  const dependents = new Map<string, string[]>()

  for (const p of papers) {
    indegree.set(p.slug, 0)
    dependents.set(p.slug, [])
  }
  for (const p of papers) {
    for (const pre of p.prereqs ?? []) {
      if (!bySlug.has(pre)) continue
      indegree.set(p.slug, (indegree.get(p.slug) ?? 0) + 1)
      dependents.get(pre)!.push(p.slug)
    }
  }

  const byDay = (a: string, b: string) => bySlug.get(a)!.day - bySlug.get(b)!.day
  const ready = papers
    .filter((p) => indegree.get(p.slug) === 0)
    .map((p) => p.slug)
    .sort(byDay)
  const ordered: Paper[] = []

  while (ready.length > 0) {
    const slug = ready.shift()!
    ordered.push(bySlug.get(slug)!)
    for (const next of dependents.get(slug) ?? []) {
      const remaining = (indegree.get(next) ?? 0) - 1
      indegree.set(next, remaining)
      if (remaining === 0) {
        ready.push(next)
        ready.sort(byDay)
      }
    }
  }

  // Any paper left over is part of a cycle; append by day so nothing is lost.
  for (const p of [...papers].sort((a, b) => a.day - b.day)) {
    if (!ordered.includes(p)) ordered.push(p)
  }

  const tracks = [...new Set([...TRACK_ORDER, ...ordered.map((p) => p.track)])]
  return tracks
    .map((track) => ({ track, papers: ordered.filter((p) => p.track === track) }))
    .filter((g) => g.papers.length > 0)
}
