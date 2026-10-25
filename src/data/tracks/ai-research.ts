import type { Track } from '../types'

export const track: Track = {
  slug: 'ai-research',
  title: 'AI Research',
  tagline: 'Read the papers that matter, in the order they matter.',
  description:
    'A guided path through the foundational literature of modern deep learning: transformers, scaling laws, alignment, pretraining data, sparse and recurrent architectures, reasoning models, and the practice of research itself.',
  accent: 'var(--accent-research)',
  status: 'live',
  level: 'advanced',
  order: 9,
  audience: 'Researchers and engineers who want to read frontier papers and model reports critically.',
  outcome: 'Derive the transformer, scaling laws, RLHF and DPO by hand, and read a 2025 reasoning paper and say what it changed.',
  prerequisites: ['ai-foundations', 'ml-math'],
  modules: [
    {
      slug: 'transformers',
      title: 'Transformers from first principles',
      description: 'The architecture behind every frontier model, built piece by piece with small worked examples.',
      level: 'advanced',
      lessons: [
        {
          slug: 'why-attention',
          title: 'Why attention replaced recurrence',
          summary: 'Recurrent networks squeeze the past into one vector, and attention removes that bottleneck.',
          minutes: 14,
          objectives: [
            'Explain why a recurrent network loses information over long sequences.',
            'Compute scaled dot-product attention for a 3-token sequence by hand.',
            'State the cost of attention in sequence length and why it matters.',
            'Describe the role of the scale factor in the attention equation.',
          ],
          keyTerms: ['attention', 'query', 'key', 'value', 'softmax', 'recurrent neural network', 'KV cache'],
          body: `
## What this lesson covers

This lesson explains the problem with recurrent networks on long text. It then introduces attention, the operation that replaced recurrence in modern language models. You will compute one attention step by hand for a 3-token sequence.

## Why it matters

Every large language model today uses attention as its core operation. The cost of attention sets the cost of inference. The key-value (KV) cache, grouped-query attention, and flash attention all exist to make this one operation cheaper. If you understand the equation, you understand most of the inference engineering track.

:::video
id: eMlx5fFNoYc
why: Watch the first 15 minutes. It animates the query, key and value vectors and the score grid that this lesson computes by hand for 3 tokens.
:::

## The idea with an example

A recurrent neural network (RNN) reads a sequence one token at a time. A token is one unit of text, often part of a word. At each step, the RNN updates one hidden vector $h_t$. The hidden vector must hold everything the model knows about the past. Information about token 3 must survive hundreds of updates before it can influence token 400. In practice, the gradient through that long chain either shrinks to zero or grows without bound. The model forgets.

The diagram shows the single chain that carries information from token 1 to token 400 in an RNN.

:::flow
title: Information path in an RNN, one chain of hidden states
Token 1 -> h1: write
h1 -> h2: carry
h2 -> h3: carry
h3 -> h400: 397 more updates
h400 -> Token 400: read
:::

Attention removes the chain. Each position looks at every other position in a single step. Consider a sequence of 3 tokens with 2-dimensional vectors. Suppose the query of token 3 is $q_3 = [1, 0]$. Suppose the keys are $k_1 = [1, 0]$, $k_2 = [0, 1]$, and $k_3 = [1, 1]$. The dot products are:

| Key | Score $q_3 \\cdot k_i$ |
| --- | --- |
| $k_1$ | 1 |
| $k_2$ | 0 |
| $k_3$ | 1 |

Divide each score by $\\sqrt{d_k} = \\sqrt{2} \\approx 1.41$. The scaled scores are $[0.71, 0, 0.71]$. Apply softmax, the function that turns scores into positive weights that sum to one. The weights are about $[0.40, 0.20, 0.40]$. The output for token 3 is the weighted sum of the three value vectors with these weights. Token 3 now reads mostly from tokens 1 and 3, and a little from token 2. No information passed through a chain of hidden states.

Press Next to follow the attention step for token 3.

:::scenario
title: One attention step for token 3
state: q3=[1 0], k1=[1 0], k2=[0 1], k3=[1 1]
step: Compute the dot product of the query with each key.
state: scores=[1 0 1]
step: Divide each score by the square root of 2, which is about 1.41.
state: scaled=[0.71 0 0.71]
step: Apply softmax so the weights are positive and sum to one.
state: weights=[0.40 0.20 0.40]
step: Multiply each value vector by its weight and add the results.
state: output=0.40 v1 + 0.20 v2 + 0.40 v3
step: Token 3 reads mostly from tokens 1 and 3 and a little from token 2.
:::

## How it works

The general equation is:

$$\\mathrm{Attention}(Q, K, V) = \\mathrm{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right) V$$

$Q$ is the matrix of queries, one row per token. $K$ is the matrix of keys. $V$ is the matrix of values. $d_k$ is the width of each key vector. The model produces $Q$, $K$, and $V$ from the input with three learned weight matrices.

To compute attention for a sequence of $T$ tokens by hand:

1. Multiply the input by the weight matrices $W_Q$, $W_K$, and $W_V$ to get $Q$, $K$, and $V$.
2. Compute the score matrix $QK^\\top$. The result has shape $T \\times T$.
3. Divide every score by $\\sqrt{d_k}$.
4. Apply softmax to each row.
5. Multiply the weight matrix by $V$.

The diagram shows the path of the queries, keys, and values through one head.

:::flow
title: Scaled dot-product attention, one head
Input X -> Q: multiply by WQ
Input X -> K: multiply by WK
Input X -> V: multiply by WV
Q -> Scores: dot with K
K -> Scores: dot with Q
Scores -> Softmax: divide by sqrt dk
Softmax -> Output: weights times V
V -> Output: weighted sum
:::

The scale factor matters. Dot products grow with $d_k$. Without the division, large scores push softmax to put all weight on one token. In that regime the gradients are close to zero and training stalls.

The cost is quadratic. Step 2 compares every token with every token, so the work grows with $T^2$. For a sequence of 4,000 tokens, that is 16 million scores per head per layer. The benefit is a path of length one between any two tokens. That short path is the reason that scale works.

The bars compare the score count for three sequence lengths.

:::bars
title: Scores per head per layer as the sequence grows
unit: million
1,000 tokens: 1
4,000 tokens: 16
16,000 tokens: 256
:::

Note: in a decoder model, each token can only look at earlier tokens. The model sets the scores for later tokens to minus infinity before softmax. This is the causal mask.

The grid shows causal attention weights for the 4-token sentence "the cat sat down", where each row sums to one and the cells above the diagonal are zero.

:::matrix
title: Causal attention weights for the cat sat down
cols: the, cat, sat, down
the: 1.0, 0, 0, 0
cat: 0.6, 0.4, 0, 0
sat: 0.2, 0.5, 0.3, 0
down: 0.1, 0.4, 0.2, 0.3
:::

The code below runs the 3-token example from this lesson in plain Python. Change the query vector and watch the weights move.

:::code
lang: python
import math

def softmax(xs):
    m = max(xs)
    es = [math.exp(x - m) for x in xs]
    s = sum(es)
    return [e / s for e in es]

def attention(q, keys, values):
    d = len(q)
    scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in keys]
    w = softmax(scores)
    width = len(values[0])
    out = [sum(w[i] * values[i][j] for i in range(len(values))) for j in range(width)]
    return scores, w, out

keys = [[1, 0], [0, 1], [1, 1]]
values = [[1, 0], [0, 1], [1, 1]]
scores, w, out = attention([1, 0], keys, values)
print("scaled scores", [round(s, 2) for s in scores])
print("weights", [round(x, 2) for x in w])
print("output", [round(x, 2) for x in out])
:::

The output is:

:::code
lang: text
scaled scores [0.71, 0.0, 0.71]
weights [0.4, 0.2, 0.4]
output [0.8, 0.6]
:::

## Try it

:::exercise
title: Attention for token 2
task: Use the keys k1 = [1, 0], k2 = [0, 1], k3 = [1, 1] and the values v1 = [1, 0], v2 = [0, 1], v3 = [1, 1] from the lesson. Compute the attention output for token 2, whose query is q2 = [0, 1]. Do it on paper first, then check with the code from the lesson. Give the three weights and the output vector to 2 decimals.
hint: The dot products are 0, 1 and 1. Divide by the square root of 2 before the softmax. The output is the weighted sum of the three value vectors.
lang: python
solution:
import math

def softmax(xs):
    es = [math.exp(x) for x in xs]
    return [e / sum(es) for e in es]

keys = [[1, 0], [0, 1], [1, 1]]
values = [[1, 0], [0, 1], [1, 1]]
q = [0, 1]
scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(2) for k in keys]
w = softmax(scores)
out = [sum(w[i] * values[i][j] for i in range(3)) for j in range(2)]
print([round(x, 2) for x in w])   # [0.2, 0.4, 0.4]
print([round(x, 2) for x in out]) # [0.6, 0.8]
:::

## Common mistakes

- Mistake: you forget the scale factor and training stalls. Fix: always divide by $\\sqrt{d_k}$ before softmax.
- Mistake: you apply softmax over columns. Fix: apply softmax over each row, so each query gets weights that sum to one.
- Mistake: you think attention has no memory cost. Fix: the score matrix is $T \\times T$ per head, and the KV cache grows with $T$.
- Mistake: you confuse keys with values. Fix: keys decide the weights, values provide the content.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: attention
q: Why does a recurrent network lose information about early tokens in a long sequence?
- The hidden vector grows with every token until it overflows
* The information must survive a long chain of updates and the gradient through that chain vanishes or explodes
- The network reads the sequence backwards
- Softmax removes small values
why: An RNN carries the past in one hidden vector through hundreds of updates, and the gradient through that chain shrinks to zero or grows without bound.
q: A sequence has 10 tokens and each key has width 64. What is the shape of the score matrix Q K transposed?
- 10 by 64
- 64 by 64
* 10 by 10
- 1 by 10
why: The score matrix compares every token with every token, so it has one row and one column per token.
q: The query of token 3 is [1, 0] and the keys are k1 = [1, 0], k2 = [0, 1], k3 = [1, 1]. Which weight vector does scaled attention produce, to 2 decimals?
- [0.33, 0.33, 0.33]
* [0.40, 0.20, 0.40]
- [0.50, 0.00, 0.50]
- [0.20, 0.40, 0.40]
why: The scaled scores are [0.71, 0, 0.71], and the softmax of those scores is about [0.40, 0.20, 0.40].
q: What goes wrong if you remove the division by the square root of d k?
- The weights no longer sum to one
* Large scores saturate the softmax, so the gradients are close to zero and training stalls
- The model can no longer see later tokens
- The KV cache doubles in size
why: Dot products grow with d k, and without the scale factor the softmax puts almost all weight on one token where the gradient is tiny.
q: The sequence length grows from 4,000 tokens to 16,000 tokens. By what factor does the number of attention scores per head grow?
- 4
- 8
* 16
- 256
why: The score count grows with the square of the sequence length, and 4 squared is 16.
:::

## Go further

Read the original Transformer paper for the full architecture. The Illustrated Transformer article gives pictures for each step. The Annotated Transformer provides working code next to each equation. The 3Blue1Brown channel has a visual series on attention.
`,
          links: [
            { label: 'Attention Is All You Need (Vaswani et al., 2017)', url: 'https://arxiv.org/abs/1706.03762', kind: 'paper' },
            { label: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', kind: 'article' },
            { label: 'The Annotated Transformer', url: 'https://nlp.seas.harvard.edu/annotated-transformer/', kind: 'article' },
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
          ],
        },
        {
          slug: 'multi-head',
          title: 'Multi-head attention and why heads specialise',
          summary: 'The model splits its width into several small attention heads so each head can learn a different pattern.',
          minutes: 12,
          objectives: [
            'Compute the head width from the model width and the number of heads.',
            'Explain why multi-head attention costs the same as one wide head.',
            'Describe two attention patterns that heads learn in practice.',
            'Explain why pruning heads leads to grouped-query attention.',
          ],
          keyTerms: ['multi-head attention', 'attention head', 'induction head', 'grouped-query attention', 'KV cache'],
          body: `
## What this lesson covers

This lesson explains multi-head attention. One attention head computes one pattern of similarity across the sequence. Language has many patterns at once. Multi-head attention runs several heads in parallel so the model can learn several patterns.

## Why it matters

Heads are the unit that inference engineers prune, share, and cache. Grouped-query attention shares keys and values across heads to shrink the KV cache. Interpretability researchers study single heads to understand what a model does. If you know how heads split the model width, you can read both kinds of paper.

:::video
id: eMlx5fFNoYc
start: 1150
why: Watch from about minute 19, where the video adds more heads and the output matrix. Compare its picture with the split-and-concat flow in this lesson.
:::

## The idea with an example

Take a model with width $d_{\\text{model}} = 8$ and $h = 2$ heads. Each head gets width $d_k = 8 / 2 = 4$. The model projects the 8-dimensional input into two 4-dimensional query vectors, two 4-dimensional key vectors, and two 4-dimensional value vectors.

The diagram shows how the width splits into two heads and joins again.

:::flow
title: Two heads split the width 8 and mix back
Input x (8) -> Head 1 (4): project Q K V
Input x (8) -> Head 2 (4): project Q K V
Head 1 (4) -> Concat (8): 4 numbers
Head 2 (4) -> Concat (8): 4 numbers
Concat (8) -> Output WO: multiply
:::

Consider the 4-token sentence "the cat sat down". Head 1 might learn to look at the previous token. At the token "sat", head 1 puts weight 0.9 on "cat" and 0.1 elsewhere. Head 2 might learn to look at the subject of the sentence. At the token "down", head 2 puts weight 0.8 on "cat". Each head produces a 4-dimensional output. The model concatenates the two outputs into one 8-dimensional vector and multiplies by an output matrix.

Press Next to follow the token "sat" through both heads.

:::scenario
title: The token sat passes through two heads
state: input=8 numbers, head 1=idle, head 2=idle
step: The model projects the 8-number input into two 4-number queries, keys, and values.
state: head 1=4-number q k v, head 2=4-number q k v
step: Head 1 looks at the previous token and puts weight 0.9 on cat.
state: head 1=weight 0.9 on cat
step: Head 2 looks for the subject of the sentence and puts weight 0.8 on cat.
state: head 2=weight 0.8 on cat
step: Each head outputs 4 numbers. The model concatenates them into 8 numbers.
state: concat=8 numbers
step: The output matrix mixes the 8 numbers and returns the result to the stream.
state: output=8 numbers
:::

The grid shows the weights of head 1, the previous-token head, for all four tokens.

:::matrix
title: Head 1, a previous-token head, on the cat sat down
cols: the, cat, sat, down
the: 1.0, 0, 0, 0
cat: 0.9, 0.1, 0, 0
sat: 0.05, 0.9, 0.05, 0
down: 0.03, 0.07, 0.9, 0
:::

Compare the cost with one head of width 8. One head computes scores from 8-dimensional dot products. Two heads compute scores from two 4-dimensional dot products. The total number of multiplications is the same. The difference is capacity. One wide head learns one weighting of the sequence. Two narrow heads learn two different weightings.

## How it works

The equation is:

$$\\mathrm{MultiHead}(X) = \\mathrm{Concat}(\\mathrm{head}_1, \\dots, \\mathrm{head}_h) W^O$$

$X$ is the input matrix with one row per token. $\\mathrm{head}_i$ is the output of scaled dot-product attention for head $i$, computed with its own projection matrices $W_i^Q$, $W_i^K$, and $W_i^V$. $W^O$ is the output projection. It mixes the heads back into the model width.

To size the heads:

1. Choose the model width $d_{\\text{model}}$ and the number of heads $h$.
2. Compute the head width $d_k = d_{\\text{model}} / h$.
3. Allocate one $W_i^Q$, $W_i^K$, and $W_i^V$ per head, each of shape $d_{\\text{model}} \\times d_k$.
4. Allocate one $W^O$ of shape $d_{\\text{model}} \\times d_{\\text{model}}$.

Probing studies find heads with clear jobs. Some heads attend to the previous token. Some heads track the subject of a clause. Induction heads find an earlier copy of the current token and attend to the token after it. Induction heads are the mechanism behind in-context learning, the ability to copy a pattern from the prompt.

Many heads can be removed with a small loss in quality. That observation led to multi-query attention and grouped-query attention. In grouped-query attention, several query heads share one key head and one value head. The KV cache shrinks by the same factor.

The bars compare the number of key-value heads the cache stores per layer under each scheme for a model with 32 query heads.

:::bars
title: Key-value heads stored per layer with 32 query heads
unit: heads
Multi-head attention: 32
Grouped-query attention: 8 (4 query heads per group)
Multi-query attention: 1
:::

Note: the number of heads is a design choice. Llama 3 8B uses 32 query heads and 8 key-value heads.

The table lists the head sizes of three public models.

| Model | Width | Query heads | Head width | Key-value heads |
| --- | --- | --- | --- | --- |
| GPT-2 small | 768 | 12 | 64 | 12 |
| Llama 3 8B | 4,096 | 32 | 128 | 8 |
| Llama 3 70B | 8,192 | 64 | 128 | 8 |

The code below splits a width of 8 into 2 heads of width 4, runs attention in each head, and concatenates the outputs. It uses the sentence from the lesson with random weights.

:::code
lang: python
import math, random

random.seed(0)
d_model, h = 8, 2
d_k = d_model // h
tokens = ["the", "cat", "sat", "down"]
X = [[random.uniform(-1, 1) for _ in range(d_model)] for _ in tokens]

def matmul(A, B):
    return [[sum(a * b for a, b in zip(row, col)) for col in zip(*B)] for row in A]

def rand_matrix(rows, cols):
    return [[random.uniform(-0.5, 0.5) for _ in range(cols)] for _ in range(rows)]

def softmax(xs):
    m = max(xs)
    es = [math.exp(x - m) for x in xs]
    return [e / sum(es) for e in es]

def head(X):
    Q, K, V = (matmul(X, rand_matrix(d_model, d_k)) for _ in range(3))
    out = []
    for i, q in enumerate(Q):
        scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d_k) for k in K[: i + 1]]
        w = softmax(scores)
        out.append([sum(w[j] * V[j][c] for j in range(i + 1)) for c in range(d_k)])
    return out

heads = [head(X) for _ in range(h)]
concat = [sum((hd[i] for hd in heads), []) for i in range(len(tokens))]
Y = matmul(concat, rand_matrix(d_model, d_model))
print("head width", d_k)
print("concat width", len(concat[0]))
print("output width", len(Y[0]), "rows", len(Y))
:::

The output is:

:::code
lang: text
head width 4
concat width 8
output width 8 rows 4
:::

## Try it

:::exercise
title: Size the heads of Llama 3 8B
task: Llama 3 8B has width 4,096, 32 query heads, 8 key-value heads and head width 128. Compute three numbers: the head width from the model width and the number of query heads, the number of key and value numbers the cache stores per token per layer under grouped-query attention, and the same count under full multi-head attention with 32 key-value heads. State the factor by which grouped-query attention shrinks the cache.
hint: Head width is model width divided by query heads. Per token per layer, the cache stores one key and one value of head width for each key-value head.
lang: python
solution:
d_model, q_heads, kv_heads = 4096, 32, 8
d_k = d_model // q_heads
gqa = 2 * kv_heads * d_k
mha = 2 * q_heads * d_k
print("head width", d_k)              # 128
print("GQA numbers per token per layer", gqa)   # 2048
print("MHA numbers per token per layer", mha)   # 8192
print("cache shrinks by", mha // gqa)  # 4
:::

## Common mistakes

- Mistake: you think more heads cost more compute. Fix: for a fixed model width, the compute is the same, because each head is narrower.
- Mistake: you set $d_{\\text{model}}$ not divisible by $h$. Fix: choose $h$ so that $d_k$ is an integer.
- Mistake: you skip the output projection $W^O$. Fix: the heads must mix, or each head only sees its own subspace.
- Mistake: you assume every head is important. Fix: measure the loss after removing a head before you keep it.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: multi-head attention
q: A model has width 4,096 and 32 heads. What is the head width?
- 32
- 64
* 128
- 256
why: The head width is the model width divided by the number of heads, and 4,096 divided by 32 is 128.
q: Why does multi-head attention cost about the same compute as one head of the full width?
* Each head is narrower, so the dot-product work splits across heads with no extra total
- The heads share one set of weights
- Only one head runs per token
- The output projection is skipped
why: For a fixed model width, h heads of width d over h do the same total multiplications as one head of width d.
q: What does an induction head do?
- It attends to the previous token only
- It attends to the subject of the sentence
* It finds an earlier copy of the current token and attends to the token that followed it
- It sets all weights to the same value
why: Induction heads copy patterns from the prompt, which is the mechanism behind in-context learning.
q: A model has 32 query heads. Under grouped-query attention with 4 query heads per group, how many key-value heads does each layer store?
- 32
- 16
* 8
- 1
why: Each group of 4 query heads shares one key head and one value head, so 32 divided by 4 gives 8.
q: What happens if you remove the output projection W O?
- The model trains faster with the same quality
* The heads never mix, so each head only sees its own subspace
- The KV cache doubles
- The head width becomes zero
why: The output projection is the only place where the heads combine, so without it each head stays in its own subspace.
:::

## Go further

The Transformer paper introduces multi-head attention in section 3.2. The grouped-query attention paper shows how to convert a trained model to fewer key-value heads. The Illustrated Transformer has clear diagrams of the split and concatenation. Lilian Weng's attention survey covers the variants.
`,
          links: [
            { label: 'Attention Is All You Need (Vaswani et al., 2017)', url: 'https://arxiv.org/abs/1706.03762', kind: 'paper' },
            { label: 'GQA: Training generalized multi-query transformer models', url: 'https://arxiv.org/abs/2305.13245', kind: 'paper' },
            { label: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/', kind: 'article' },
            { label: 'Attention? Attention! (Lilian Weng)', url: 'https://lilianweng.github.io/posts/2018-06-24-attention/', kind: 'article' },
          ],
        },
        {
          slug: 'positional-encodings',
          title: 'Positional encodings: sinusoids to RoPE',
          summary: 'Attention ignores order, so the model adds a position signal to each token.',
          minutes: 18,
          objectives: [
            'Explain why attention without positions treats a sentence as a set.',
            'Compute a sinusoidal position vector for a small example.',
            'Describe how rotary position embedding (RoPE) makes scores depend on relative offset.',
            'Choose a method to extend a trained model to longer sequences.',
          ],
          keyTerms: ['positional encoding', 'RoPE', 'ALiBi', 'relative position', 'context length', 'extrapolation'],
          body: `
## What this lesson covers

This lesson explains why a transformer needs a position signal. It covers four methods: sinusoidal encodings, learned encodings, attention with linear biases (ALiBi), and rotary position embedding (RoPE). It ends with the methods that extend a trained model to a longer context.

## Why it matters

Order carries meaning. "Dog bites man" and "man bites dog" contain the same tokens. Without a position signal, attention produces the same output for both. The choice of position method also decides how far a model can read past its training length. Long-context work in production depends on RoPE scaling.

## The idea with an example

Attention is a set operation. If you shuffle the input rows, the output rows shuffle in the same way, and nothing else changes. The model needs a way to tell token 1 from token 2.

The simplest fix adds a position vector to each token embedding. Take a width of 4 and the sinusoidal method from the original Transformer. For position $p$ and dimension pair $i$, the entries are $\\sin(p / 10000^{2i/d})$ and $\\cos(p / 10000^{2i/d})$. With $d = 4$ the two pairs use frequencies $1$ and $1/100$. The vectors for the first three positions are:

| Position | Entries |
| --- | --- |
| 0 | $[0, 1, 0, 1]$ |
| 1 | $[0.84, 0.54, 0.01, 1.00]$ |
| 2 | $[0.91, -0.42, 0.02, 1.00]$ |

The first pair changes fast. The second pair changes slowly. Together they form a unique code for each position, like the hands of a clock.

The grid shows the four entries for positions 0 to 3, with the fast pair on the left and the slow pair on the right.

:::matrix
title: Sinusoidal position codes, width 4, positions 0 to 3
cols: sin fast, cos fast, sin slow, cos slow
pos 0: 0, 1, 0, 1
pos 1: 0.84, 0.54, 0.01, 1.00
pos 2: 0.91, -0.42, 0.02, 1.00
pos 3: 0.14, -0.99, 0.03, 1.00
:::

RoPE takes a different route. Instead of adding a vector, it rotates the query and key vectors by an angle that grows with position. Pair up the dimensions. Rotate the pair at position $m$ by the angle $m\\theta$. Take a query at position 5 and a key at position 2. Rotate one by $5\\theta$ and the other by $2\\theta$. Their dot product depends only on the difference, $3\\theta$. The score depends on relative offset, not on absolute position.

Press Next to follow the two rotations and see that only the difference survives.

:::scenario
title: RoPE with a query at position 5 and a key at position 2
state: query position=5, key position=2, theta=0.1 rad
step: Pair up the dimensions of the query and the key.
step: Rotate the query pair by 5 times theta.
state: query angle=0.5 rad
step: Rotate the key pair by 2 times theta.
state: key angle=0.2 rad
step: Take the dot product. Only the difference of the angles survives.
state: effective angle=0.3 rad
step: Move both tokens 10 positions later. The angles change but the difference stays 0.3 radians.
state: query position=15, key position=12, query angle=1.5 rad, key angle=1.2 rad
:::

## How it works

The RoPE property is:

$$\\langle R_m q, R_n k \\rangle = \\langle q, R_{n-m} k \\rangle$$

$R_m$ is the rotation matrix for position $m$. $q$ is a query vector. $k$ is a key vector. $\\langle \\cdot, \\cdot \\rangle$ is the dot product. The equation says that rotating both vectors by their positions equals rotating one vector by the offset.

To apply RoPE to one head:

1. Split the head width into pairs of dimensions.
2. Assign each pair $i$ a frequency $\\theta_i = 10000^{-2i/d}$.
3. Rotate the pair of the query at position $m$ by the angle $m\\theta_i$.
4. Rotate the pair of the key at position $n$ by the angle $n\\theta_i$.
5. Compute the dot product as usual.

The diagram shows where the rotation acts inside one head.

:::flow
title: Where RoPE acts inside one head
Input x -> Query q: multiply by WQ
Input x -> Key k: multiply by WK
Input x -> Value v: multiply by WV
Query q -> Rotate by m theta: position m
Key k -> Rotate by n theta: position n
Rotate by m theta -> Dot product: rotated q
Rotate by n theta -> Dot product: rotated k
Value v -> Output: no rotation
Dot product -> Output: softmax weights
:::

ALiBi uses no position vectors at all. It subtracts a penalty from each score. The penalty grows with the distance between the query and the key. Close tokens get a small penalty and far tokens get a large one.

The bars compare the ALiBi penalty at four distances for a head with slope 0.5.

:::bars
title: ALiBi penalty with slope 0.5 by distance
unit: score units
distance 1: 0.5
distance 4: 2
distance 16: 8
distance 64: 32
:::

Models fail past their training length because they never saw the large angles. Position interpolation scales every position down so the largest angle stays inside the trained range. NTK-aware scaling and YaRN change the base frequency instead, so high frequencies stay sharp and low frequencies stretch. Both methods need a short fine-tune on long sequences.

Caution: a model that reads a 128,000-token prompt still needs a KV cache for all 128,000 tokens. Position scaling solves the encoding problem, not the memory problem.

The code below computes the sinusoidal table from the lesson and then checks the RoPE property with a 2-dimensional rotation: the score for positions 5 and 2 equals the score for positions 15 and 12.

:::code
lang: python
import math

def sinusoid(pos, d=4):
    out = []
    for i in range(d // 2):
        freq = 1.0 / (10000 ** (2 * i / d))
        out += [math.sin(pos * freq), math.cos(pos * freq)]
    return out

for p in range(4):
    print("pos", p, [round(x, 2) for x in sinusoid(p)])

def rotate(v, angle):
    x, y = v
    return [x * math.cos(angle) - y * math.sin(angle), x * math.sin(angle) + y * math.cos(angle)]

def rope_score(q, k, m, n, theta=0.1):
    qr, kr = rotate(q, m * theta), rotate(k, n * theta)
    return qr[0] * kr[0] + qr[1] * kr[1]

q, k = [1.0, 0.5], [0.3, 0.8]
print("positions 5 and 2 ", round(rope_score(q, k, 5, 2), 4))
print("positions 15 and 12", round(rope_score(q, k, 15, 12), 4))
print("positions 5 and 4 ", round(rope_score(q, k, 5, 4), 4))
:::

The output is:

:::code
lang: text
pos 0 [0.0, 1.0, 0.0, 1.0]
pos 1 [0.84, 0.54, 0.01, 1.0]
pos 2 [0.91, -0.42, 0.02, 1.0]
pos 3 [0.14, -0.99, 0.03, 1.0]
positions 5 and 2  0.8608
positions 15 and 12 0.8608
positions 5 and 4  0.7614
:::

## Try it

:::exercise
title: Sinusoid for position 3 and a RoPE check
task: Compute the width-4 sinusoidal vector for position 3 by hand with the two frequencies 1 and 1 over 100. Then take the query q = [1, 0] and the key k = [1, 0], set theta to 0.1 radians, and compute the RoPE score for the query at position 7 and the key at position 3. Predict the score for positions 27 and 23 without computing it, then check with the code from the lesson.
hint: Position 3 gives sin 3 = 0.14 and cos 3 = -0.99 for the fast pair. For RoPE, only the difference of 4 positions matters, so the score is cos of 0.4 radians.
lang: python
solution:
import math

p = 3
fast = [math.sin(p), math.cos(p)]
slow = [math.sin(p / 100), math.cos(p / 100)]
print([round(x, 2) for x in fast + slow])   # [0.14, -0.99, 0.03, 1.0]

def rotate(v, a):
    return [v[0] * math.cos(a) - v[1] * math.sin(a), v[0] * math.sin(a) + v[1] * math.cos(a)]

def score(m, n, theta=0.1):
    qr, kr = rotate([1, 0], m * theta), rotate([1, 0], n * theta)
    return qr[0] * kr[0] + qr[1] * kr[1]

print(round(score(7, 3), 4))     # 0.9211, which is cos(0.4)
print(round(score(27, 23), 4))   # 0.9211, the same
:::

## Common mistakes

- Mistake: you add RoPE to the value vectors. Fix: rotate only queries and keys.
- Mistake: you run inference at twice the training length with no scaling. Fix: apply position interpolation or YaRN and fine-tune.
- Mistake: you think sinusoidal encodings give relative positions. Fix: they give absolute codes; the model must learn relative use.
- Mistake: you change the RoPE base and keep the old weights unchanged. Fix: fine-tune for a few hundred steps on long documents.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: positional encodings
q: You shuffle the input tokens of a transformer that has no position signal. What happens to the attention output?
- The output is unchanged in every row
* The output rows shuffle in the same way and nothing else changes
- The output becomes all zeros
- The model raises an error
why: Attention is a set operation, so a permutation of the inputs gives the same permutation of the outputs.
q: In RoPE, a query sits at position 9 and a key at position 4 with theta equal to 0.1 radians. Which angle decides their score?
- 0.9 radians
- 1.3 radians
* 0.5 radians
- 0.4 radians
why: Only the difference of the positions survives the dot product, and 9 minus 4 is 5, so the angle is 5 times 0.1.
q: Why does a RoPE model fail when you run it at twice its training length with no change?
- The KV cache runs out
- The sinusoids repeat and positions collide
* The rotation angles exceed the range the model saw in training
- The value vectors are rotated too far
why: The model never learned to read the large angles that long positions produce, so scores become meaningless.
q: How does ALiBi encode position?
- It adds a sinusoid to each embedding
- It rotates the queries and keys
* It subtracts a penalty from each score that grows with the distance between query and key
- It learns one vector per position
why: ALiBi adds no vectors at all; a linear bias on the scores favours close tokens.
q: Which vectors does RoPE rotate?
- Queries, keys and values
* Queries and keys only
- Values only
- The residual stream
why: The rotation must act on the two vectors whose dot product forms the score, and the values carry content and are left alone.
:::

## Go further

The RoFormer paper introduces RoPE with the full derivation. The ALiBi paper shows the linear bias method and its extrapolation results. The YaRN paper explains frequency-aware scaling and compares it with position interpolation. Lilian Weng's transformer family survey places all four methods side by side.
`,
          links: [
            { label: 'RoFormer: Enhanced transformer with rotary position embedding', url: 'https://arxiv.org/abs/2104.09864', kind: 'paper' },
            { label: 'Train Short, Test Long: ALiBi', url: 'https://arxiv.org/abs/2108.12409', kind: 'paper' },
            { label: 'YaRN: Efficient context window extension', url: 'https://arxiv.org/abs/2309.00071', kind: 'paper' },
            { label: 'The Transformer Family v2 (Lilian Weng)', url: 'https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/', kind: 'article' },
          ],
        },
        {
          slug: 'transformer-block',
          title: 'The full block: residuals, normalisation, and the MLP',
          summary: 'A transformer layer combines attention with a residual stream, a normalisation step, and a feed-forward network.',
          minutes: 16,
          objectives: [
            'Draw the data flow through one pre-norm transformer block.',
            'Explain why residual connections let deep models train.',
            'Compute the weight count of one block from its width.',
            'Describe the job of the feed-forward network compared with attention.',
          ],
          keyTerms: ['residual connection', 'layer normalisation', 'feed-forward network', 'MLP', 'pre-norm', 'residual stream'],
          body: `
## What this lesson covers

This lesson assembles a full transformer block from its parts. The parts are attention, the residual connection, layer normalisation, and the feed-forward network. You will count the weights of one block and trace a vector through it.

## Why it matters

The block is the repeated unit of every language model. A 32-layer model is 32 copies of this block. The weight count of a block decides memory use. The feed-forward network holds about two thirds of the weights, and that is where mixture of experts applies. The residual stream is the object that interpretability research reads and edits.

:::video
id: 9-Jl0dxWQs8
why: Watch the whole video, about 22 minutes. It shows why the feed-forward network, the part with two thirds of the weights, is where a model stores facts.
:::

## The idea with an example

Take a model with width $d = 4$ and a single token. The token enters as the vector $x = [1, 2, 0, 1]$. This vector is the residual stream. The block updates it in two steps.

The diagram shows the data path through one pre-norm block, with the two skip paths that carry the stream around each sub-layer.

:::flow
title: Data path through one pre-norm block
Stream x -> LayerNorm 1: normalise
LayerNorm 1 -> Attention: mean 0 variance 1
Attention -> Add 1: update a
Stream x -> Add 1: skip path
Add 1 -> LayerNorm 2: x prime
LayerNorm 2 -> FFN: normalised
FFN -> Add 2: update f
Add 1 -> Add 2: skip path
Add 2 -> Next block: x double prime
:::

Step one is attention. The block normalises $x$ to have mean 0 and variance 1. Then attention produces an update, say $a = [0.5, 0, 0.5, 0]$. The block adds the update to the stream: $x' = x + a = [1.5, 2, 0.5, 1]$.

Step two is the feed-forward network. The block normalises $x'$ again. It multiplies by an up-projection of shape $4 \\times 16$, applies a nonlinearity, and multiplies by a down-projection of shape $16 \\times 4$. Suppose the result is $f = [0, -1, 0, 1]$. The block adds it: $x'' = x' + f = [1.5, 1, 0.5, 2]$. That vector goes to the next block.

Press Next to follow the vector through the block.

:::scenario
title: One token vector through the block
state: x=[1 2 0 1]
step: Normalise x to mean 0 and variance 1. The copy on the skip path stays unchanged.
state: normalised=[0 1.41 -1.41 0]
step: Attention reads the normalised vector and produces the update a.
state: a=[0.5 0 0.5 0]
step: Add a to the stream.
state: x=[1.5 2 0.5 1]
step: Normalise the new stream and run the feed-forward network. It produces the update f.
state: f=[0 -1 0 1]
step: Add f to the stream. The result goes to the next block.
state: x=[1.5 1 0.5 2]
:::

The important point is that each part only adds to the stream. The original $x$ survives unchanged inside $x''$. A block that learns nothing adds zero and passes the input through. That property lets a 100-layer model train.

## How it works

The pre-norm block computes:

$$x' = x + \\mathrm{Attn}(\\mathrm{LN}(x)), \\qquad x'' = x' + \\mathrm{FFN}(\\mathrm{LN}(x'))$$

$x$ is the residual stream, with one row per token. $\\mathrm{LN}$ is layer normalisation, the operation that rescales each row to mean 0 and unit variance and then applies a learned gain. $\\mathrm{Attn}$ is multi-head attention. $\\mathrm{FFN}$ is the feed-forward network, also called the multilayer perceptron (MLP).

The feed-forward network is:

$$\\mathrm{FFN}(z) = \\sigma(z W_1) W_2$$

$W_1$ has shape $d \\times 4d$. $W_2$ has shape $4d \\times d$. $\\sigma$ is a nonlinearity such as the Gaussian error linear unit (GELU). Modern models use a gated variant called SwiGLU with three matrices.

To count the weights in one block:

1. Count the four attention matrices: $4 \\times d \\times d$.
2. Count the two feed-forward matrices: $2 \\times d \\times 4d = 8d^2$.
3. Add the two normalisation gains: $2d$, small enough to ignore.
4. Total: about $12d^2$.

For $d = 4096$, one block has about 200 million weights. The feed-forward part is 8 of the 12 parts. Attention moves information between tokens. The feed-forward network processes each token on its own and stores most of the learned facts.

The table lists the weights of each part for a width of 4,096.

| Part | Shape | Weights at width 4,096 |
| --- | --- | --- |
| Attention, four matrices | 4 times d by d | 67 million |
| Feed-forward up-projection | d by 4d | 67 million |
| Feed-forward down-projection | 4d by d | 67 million |
| Normalisation gains | 2d | 8,192 |

The bars compare the three parts.

:::bars
title: Weights in one block at width 4,096
unit: million
Attention: 67
Feed-forward network: 134
Normalisation: 0.008
:::

Note: the original Transformer applied normalisation after the residual add. Modern models apply it before, which is more stable at depth.

The code below runs one pre-norm block on the vector x = [1, 2, 0, 1] from the lesson with small fixed weights, and counts the weights for width 4,096.

:::code
lang: python
import math

def layer_norm(x, eps=1e-5):
    mean = sum(x) / len(x)
    var = sum((v - mean) ** 2 for v in x) / len(x)
    return [(v - mean) / math.sqrt(var + eps) for v in x]

def gelu(v):
    return 0.5 * v * (1 + math.tanh(math.sqrt(2 / math.pi) * (v + 0.044715 * v ** 3)))

def matvec(W, x):
    return [sum(w * v for w, v in zip(row, x)) for row in W]

d = 4
x = [1.0, 2.0, 0.0, 1.0]
W1 = [[0.1 * ((i + j) % 3 - 1) for j in range(d)] for i in range(4 * d)]
W2 = [[0.1 * ((i * j) % 3 - 1) for j in range(4 * d)] for i in range(d)]

def attention_update(z):
    return [0.5, 0.0, 0.5, 0.0]   # stands in for the attention sub-layer

x1 = [a + b for a, b in zip(x, attention_update(layer_norm(x)))]
f = matvec(W2, [gelu(v) for v in matvec(W1, layer_norm(x1))])
x2 = [a + b for a, b in zip(x1, f)]
print("after attention", x1)
print("after FFN", [round(v, 3) for v in x2])

width = 4096
print("weights per block", 12 * width * width / 1e6, "million")
:::

The output is:

:::code
lang: text
after attention [1.5, 2.0, 0.5, 1.0]
after FFN [1.485, 2.006, 0.617, 0.985]
weights per block 201.326592 million
:::

## Try it

:::exercise
title: Count the weights of GPT-2 small
task: GPT-2 small has width 768 and 12 blocks. Use the rule from the lesson to count the weights in one block and in all 12 blocks. Then add the embedding table for a vocabulary of 50,257 units, which GPT-2 ties to the output layer. Compare your total with the published 124 million.
hint: One block holds about 12 times d squared weights. The embedding table holds vocabulary times width.
lang: python
solution:
d, layers, vocab = 768, 12, 50257
per_block = 12 * d * d
blocks = layers * per_block
embed = vocab * d
print("one block", per_block / 1e6, "million")      # 7.08
print("all blocks", blocks / 1e6, "million")        # 84.9
print("embedding", embed / 1e6, "million")          # 38.6
print("total", (blocks + embed) / 1e6, "million")   # 123.5, close to 124
:::

## Common mistakes

- Mistake: you replace the stream instead of adding to it. Fix: always write $x + f(x)$, never $f(x)$ alone.
- Mistake: you normalise across the batch. Fix: layer normalisation works across the width of one token.
- Mistake: you set the hidden width equal to $d$. Fix: use $4d$, or about $2.7d$ for a gated network.
- Mistake: you count only attention weights. Fix: the feed-forward network has twice as many.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: the transformer block
q: A block has learned nothing and adds zero at both sub-layers. What leaves the block?
- A vector of zeros
- The normalised input
* The input, unchanged
- The input scaled by two
why: Each sub-layer only adds to the residual stream, so a zero update passes the input through.
q: Which part of a block holds most of the weights?
- The attention matrices
* The feed-forward network
- The normalisation gains
- The causal mask
why: The two feed-forward matrices hold 8 of the 12 d squared weights in a block.
q: A model has width 2,048. About how many weights does one block hold?
- 4 million
- 25 million
* 50 million
- 200 million
why: Twelve times 2,048 squared is about 50 million.
q: Where does a pre-norm block apply layer normalisation?
- After the residual add, on the stream
* Before each sub-layer, inside the branch, so the skip path stays unnormalised
- Only once, at the output of the model
- Across the batch dimension
why: Pre-norm normalises the input to attention and to the feed-forward network and leaves the skip path untouched, which is stable at depth.
q: Layer normalisation on the vector [1, 2, 0, 1] rescales it to which mean and variance?
- Mean 1 and variance 1
* Mean 0 and variance 1
- Mean 0 and variance 0.5
- Mean 1 and variance 0
why: Layer normalisation subtracts the mean of the row and divides by its standard deviation, so the result has mean 0 and unit variance.
:::

## Go further

The Transformer paper gives the original post-norm block in section 3. The layer normalisation paper explains why per-token normalisation helps. The GLU variants paper describes SwiGLU. Karpathy's nanoGPT repository contains a full block in about 100 lines of code.
`,
          links: [
            { label: 'Attention Is All You Need (Vaswani et al., 2017)', url: 'https://arxiv.org/abs/1706.03762', kind: 'paper' },
            { label: 'Layer Normalization (Ba et al., 2016)', url: 'https://arxiv.org/abs/1607.06450', kind: 'paper' },
            { label: 'GLU Variants Improve Transformer (Shazeer, 2020)', url: 'https://arxiv.org/abs/2002.05202', kind: 'paper' },
            { label: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT', kind: 'repo' },
            { label: 'Andrej Karpathy', url: 'https://www.youtube.com/@AndrejKarpathy', kind: 'video' },
          ],
        },
      ],
    },
    {
      slug: 'scaling',
      title: 'Scaling laws and compute-optimal training',
      description: 'How loss falls with model size, data, and compute, and how to spend a fixed budget.',
      level: 'advanced',
      lessons: [
        {
          slug: 'kaplan-to-chinchilla',
          title: 'From Kaplan to Chinchilla',
          summary: 'Loss follows a power law in weights and tokens, and the Chinchilla paper fixed the ratio between them.',
          minutes: 16,
          objectives: [
            'Explain what a power law in loss means with a numerical example.',
            'Compute the Chinchilla-optimal token count for a given weight count.',
            'State why the Kaplan and Chinchilla papers reached different conclusions.',
            'Estimate training compute from weights and tokens with the 6ND rule.',
          ],
          keyTerms: ['scaling law', 'power law', 'Chinchilla-optimal', 'compute budget', 'FLOPs', 'perplexity'],
          body: `
## What this lesson covers

This lesson explains scaling laws, the empirical rules that link loss to model size, data size, and compute. It covers the Kaplan paper of 2020 and the Chinchilla paper of 2022. You will compute a compute-optimal training plan for a small budget.

## Why it matters

A frontier training run costs tens of millions of dollars. Scaling laws let a team predict the loss of a large run from small runs. They also decide how to split a budget between a bigger model and more data. Every modern model card reports its weight count and token count, and the ratio between them comes from this work.

:::video
id: 9vM4p9NN0Ts
why: This lecture opens on YouTube. Watch the scaling laws part, about 20 minutes in the middle. Note how the speaker uses small runs to predict a large one, which is the method of this lesson.
:::

## The idea with an example

Loss is the number that training tries to reduce. For a language model, lower loss means better next-token prediction. A power law says that loss falls by a fixed fraction every time you multiply the input by a fixed factor.

Suppose loss depends on weight count $N$ as $L = 2.0 + 400 / N^{0.34}$. Compute the loss for three model sizes:

| Weights $N$ | $400 / N^{0.34}$ | Loss |
| --- | --- | --- |
| 100 million | 0.75 | 2.75 |
| 1 billion | 0.34 | 2.34 |
| 10 billion | 0.16 | 2.16 |

Each 10 times increase in size removes about 55 percent of the excess loss above 2.0. The 2.0 is the floor. No model size reaches below it, because natural text has irreducible randomness.

The bars compare the loss of the three sizes.

:::bars
title: Loss by weight count with L = 2.0 + 400 / N to the power 0.34
unit: loss
100 million weights: 2.75
1 billion weights: 2.34
10 billion weights: 2.16
:::

Now add data. The Chinchilla paper found that a fixed compute budget has one best split. Take a budget large enough to train a 1 billion weight model on 20 billion tokens. The same budget trains a 2 billion weight model on 10 billion tokens, or a 500 million weight model on 40 billion tokens. Chinchilla found that the balanced option, about 20 tokens per weight, gives the lowest loss.

Press Next to plan a run for a budget of 10 to the power 21 FLOPs.

:::scenario
title: Plan a run for a budget of 10 to the power 21 FLOPs
state: budget=1e21 FLOPs, N=unknown, D=unknown
step: Set the token count to 20 times the weight count.
state: D=20 N
step: Write the compute rule. C equals 6 times N times D, so C equals 120 N squared.
state: equation=120 N squared = 1e21
step: Divide the budget by 120 and take the square root.
state: N=2.9 billion
step: Multiply N by 20 to get the token count.
state: D=58 billion
step: Check the data supply. The run needs 58 billion tokens of good text.
state: check=58 billion tokens needed
:::

## How it works

The Chinchilla fit is:

$$L(N, D) = E + \\frac{A}{N^{\\alpha}} + \\frac{B}{D^{\\beta}}$$

$N$ is the weight count. $D$ is the training token count. $E$ is the irreducible loss. $A$, $B$, $\\alpha$, and $\\beta$ are fitted constants. The paper reports $\\alpha \\approx 0.34$ and $\\beta \\approx 0.28$.

Training compute $C$ in floating-point operations (FLOPs) follows the rule $C \\approx 6ND$. Each weight takes part in about 6 operations per token: 2 in the forward pass and 4 in the backward pass.

To plan a compute-optimal run:

1. Fix the compute budget $C$ in FLOPs.
2. Set $D = 20N$.
3. Solve $C = 6N \\cdot 20N = 120N^2$ for $N$.
4. Compute $D = 20N$.
5. Check the result against your data supply.

For $C = 10^{21}$ FLOPs, step 3 gives $N \\approx 2.9$ billion weights and $D \\approx 58$ billion tokens.

The Kaplan paper reached a different conclusion. It found that weights should grow much faster than data. The cause was the learning rate schedule. Kaplan reused one long schedule for every run, and short runs ended before their learning rate decayed. Chinchilla tuned the schedule to each run length. With the fair comparison, the balanced split won.

The timing diagram shows the two schedules for a run of 4,000 steps: the Kaplan decay sits after the run has ended, and the Chinchilla decay finishes inside the run.

:::timeline
title: Learning rate schedules for a 4,000-step run
unit: steps
lane Kaplan schedule
lane Chinchilla schedule
Kaplan schedule: warmup @0-200
Kaplan schedule: constant high rate, run stops at 4000 @200-4000
Kaplan schedule: decay planned for a 10000-step run @4000-10000
Chinchilla schedule: warmup @0-200
Chinchilla schedule: cosine decay to zero at step 4000 @200-4000
:::

Note: the exact ratio depends on the data and the tokeniser. Treat 20 as a starting point, not a constant.

The code below computes the loss table from the lesson and plans a compute-optimal run for a budget you choose.

:::code
lang: python
import math

def loss(N, E=2.0, A=400, alpha=0.34):
    return E + A / N ** alpha

for N in [1e8, 1e9, 1e10]:
    print("N =", N, "loss =", round(loss(N), 2))

def plan(C, ratio=20):
    N = math.sqrt(C / (6 * ratio))
    return N, ratio * N

for C in [1e21, 1e23]:
    N, D = plan(C)
    print("budget", C, "weights", round(N / 1e9, 1), "B", "tokens", round(D / 1e9), "B")
:::

The output is:

:::code
lang: text
N = 100000000.0 loss = 2.76
N = 1000000000.0 loss = 2.35
N = 10000000000.0 loss = 2.16
budget 1e+21 weights 2.9 B tokens 58 B
budget 1e+23 weights 28.9 B tokens 577 B
:::

## Try it

:::exercise
title: Plan a run for 10 to the power 23 FLOPs
task: Use the rule C = 6 N D and D = 20 N to plan a compute-optimal run for a budget of 10 to the power 23 FLOPs. Give the weight count and the token count. Then compute the loss of that model with the fit L = 2.0 + 400 over N to the power 0.34, and compare it with the 2.9 billion weight model from the lesson.
hint: Solve 120 N squared = C, so N is the square root of C over 120. The token count is 20 N.
lang: python
solution:
import math

C = 1e23
N = math.sqrt(C / 120)
D = 20 * N
print("weights", round(N / 1e9, 1), "billion")   # 28.9
print("tokens", round(D / 1e9), "billion")       # 577
for n in [2.9e9, N]:
    print("loss", round(2.0 + 400 / n ** 0.34, 3))   # 2.243 then 2.111
:::

## Common mistakes

- Mistake: you compare runs with mismatched learning rate schedules. Fix: decay the learning rate to the end of each run.
- Mistake: you read loss as a measure of downstream quality. Fix: loss predicts benchmarks only within one model family and data mix.
- Mistake: you fit a power law from two points. Fix: use at least five model sizes across two orders of magnitude.
- Mistake: you ignore the floor $E$. Fix: fit $E$ as a free constant, or the exponents come out wrong.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: scaling laws
q: With the rule D = 20 N, how many tokens does a 7 billion weight model need?
- 7 billion
- 70 billion
* 140 billion
- 1.4 trillion
why: Twenty tokens per weight times 7 billion weights is 140 billion tokens.
q: What does the constant E represent in the Chinchilla fit?
- The learning rate
- The cost of one token
* The irreducible loss that no model size can go below
- The number of epochs
why: Natural text has randomness that no model can predict, and E is the floor that the power law terms sit on top of.
q: Why did the Kaplan paper favour larger models over more data?
- It used a different tokeniser
* It reused one long learning rate schedule, so short runs ended before their rate decayed
- It measured loss on training data
- It trained only on code
why: Chinchilla tuned the schedule to each run length, and with that fair comparison the balanced split won.
q: Training compute for a 1 billion weight model on 20 billion tokens is about how many FLOPs?
- 2 times 10 to the power 19
* 1.2 times 10 to the power 20
- 6 times 10 to the power 20
- 1.2 times 10 to the power 22
why: C is about 6 N D, and 6 times 10 to the power 9 times 2 times 10 to the power 10 is 1.2 times 10 to the power 20.
q: A team fits a power law from two model sizes. What is the main problem?
- Two points cannot be plotted on a log axis
* Two points always fit a line, so the fit tells you nothing about whether the law holds
- The floor E is always zero
- Power laws need at least one trillion tokens
why: A power law is a line on log axes, and any two points lie on some line, so you need at least five sizes across two orders of magnitude.
:::

## Go further

The Kaplan paper is the first full study of the power laws. The Chinchilla paper corrects the ratio and provides the fitted equation. The Deep Double Descent paper explains why loss can rise and fall again as size grows. Yannic Kilcher's channel has walkthroughs of both scaling papers.
`,
          links: [
            { label: 'Scaling Laws for Neural Language Models (Kaplan et al., 2020)', url: 'https://arxiv.org/abs/2001.08361', kind: 'paper' },
            { label: 'Training Compute-Optimal Large Language Models (Hoffmann et al., 2022)', url: 'https://arxiv.org/abs/2203.15556', kind: 'paper' },
            { label: 'Deep Double Descent (Nakkiran et al., 2019)', url: 'https://arxiv.org/abs/1912.02292', kind: 'paper' },
            { label: 'Yannic Kilcher', url: 'https://www.youtube.com/@YannicKilcher', kind: 'video' },
          ],
        },
        {
          slug: 'inference-aware-scaling',
          title: 'Inference-aware scaling',
          summary: 'When serving cost counts, the best plan trains a smaller model on far more tokens than Chinchilla suggests.',
          minutes: 14,
          objectives: [
            'Add expected inference tokens to a compute budget.',
            'Explain why production models train past the Chinchilla point.',
            'Compute the lifetime cost of two model sizes for a fixed request volume.',
            'Describe the data limit that bounds overtraining.',
          ],
          keyTerms: ['inference cost', 'overtraining', 'Chinchilla-optimal', 'FLOPs', 'tokens per weight'],
          body: `
## What this lesson covers

This lesson extends scaling laws to include the cost of serving a model. The Chinchilla rule minimises training loss for a training budget. When a model serves billions of requests, the serving cost dominates. You will compute the lifetime cost of two model sizes and see why the smaller one wins.

## Why it matters

Llama 3 8B trained on 15 trillion tokens, about 1,900 tokens per weight. That is nearly 100 times the Chinchilla ratio. The reason is inference. A smaller model is cheaper to run on every request for the life of the product. Teams that only know the Chinchilla rule misjudge this decision.

## The idea with an example

Suppose you need a model with a target loss. Two plans reach it:

- Plan A: 10 billion weights trained on 200 billion tokens. This is Chinchilla-optimal.
- Plan B: 5 billion weights trained on 800 billion tokens. This is overtrained.

Compute the training cost with $C = 6ND$:

| Plan | Weights | Tokens | Training FLOPs |
| --- | --- | --- | --- |
| A | 10 B | 200 B | $1.2 \\times 10^{22}$ |
| B | 5 B | 800 B | $2.4 \\times 10^{22}$ |

Plan B costs twice as much to train. Now add serving. Each generated token costs about $2N$ FLOPs. Suppose the product serves 1 trillion tokens over its life:

| Plan | Serving FLOPs | Total FLOPs |
| --- | --- | --- |
| A | $2 \\times 10^{22}$ | $3.2 \\times 10^{22}$ |
| B | $1 \\times 10^{22}$ | $3.4 \\times 10^{22}$ |

At 1 trillion served tokens the plans are close. At 10 trillion served tokens, Plan A costs $21.2 \\times 10^{22}$ and Plan B costs $12.4 \\times 10^{22}$. Plan B wins by a wide margin. The more you serve, the more the small model pays back its extra training.

Press Next to add the serving cost step by step.

:::scenario
title: Lifetime cost of Plan A and Plan B
state: served tokens=0, Plan A cost=1.2e22, Plan B cost=2.4e22
step: Count the training cost first. Plan B costs twice as much to train.
step: Serve 1 trillion tokens. Each token costs 2 N FLOPs, so Plan A pays 2e22 and Plan B pays 1e22.
state: served tokens=1 trillion, Plan A cost=3.2e22, Plan B cost=3.4e22
step: Plan A is still ahead by a small margin.
step: Serve 10 trillion tokens in total. Plan A pays 20e22 for serving and Plan B pays 10e22.
state: served tokens=10 trillion, Plan A cost=21.2e22, Plan B cost=12.4e22
step: Plan B now costs about 40 percent less over the life of the product.
:::

The bars compare the two totals at 10 trillion served tokens.

:::bars
title: Total cost at 10 trillion served tokens
unit: x 10^22 FLOPs
Plan A, 10 billion weights: 21.2
Plan B, 5 billion weights: 12.4
:::

## How it works

The combined cost is:

$$C_{\\text{total}} = 6ND_{\\text{train}} + 2ND_{\\text{infer}}$$

$N$ is the weight count. $D_{\\text{train}}$ is the number of training tokens. $D_{\\text{infer}}$ is the expected number of tokens served over the life of the model. The first term is training. The second term is serving.

The grid shows the total cost of each plan at three serving volumes, in units of 10 to the power 22 FLOPs.

:::matrix
title: Total FLOPs in units of 10 to the power 22
cols: 1 T served, 3 T served, 10 T served
Plan A 10B: 3.2, 7.2, 21.2
Plan B 5B: 3.4, 5.4, 12.4
:::

To choose a plan:

1. Fix the target loss from the product requirement.
2. Estimate $D_{\\text{infer}}$ from the expected request volume.
3. For each candidate $N$, use the Chinchilla fit to find the $D_{\\text{train}}$ that reaches the target loss.
4. Compute $C_{\\text{total}}$ for each candidate.
5. Choose the $N$ with the lowest total.

The loss curve bounds this process. A small model cannot reach a low target no matter how many tokens it sees. The term $A / N^{\\alpha}$ sets a floor for each size. Overtraining has diminishing returns, so the curve flattens.

Data supply is the other bound. Plan B needs 800 billion tokens of good data. The quality of the extra tokens matters as much as the count. The lesson on data-constrained scaling covers what happens when the supply runs out.

Caution: inference FLOPs are not the only serving cost. Memory bandwidth for the KV cache often dominates at long context. Include it in a real estimate.

The code below reproduces the cost grid from the lesson and finds the serving volume at which Plan B becomes cheaper than Plan A.

:::code
lang: python
def total(N, D_train, D_infer):
    return 6 * N * D_train + 2 * N * D_infer

plans = {"A": (10e9, 200e9), "B": (5e9, 800e9)}
for served in [1e12, 3e12, 10e12]:
    row = [round(total(N, D, served) / 1e22, 1) for N, D in plans.values()]
    print("served", served / 1e12, "T tokens  A, B =", row)

served = 0.0
while total(*plans["B"], served) > total(*plans["A"], served):
    served += 1e10
print("break-even at about", served / 1e12, "trillion served tokens")
:::

The output is:

:::code
lang: text
served 1.0 T tokens  A, B = [3.2, 3.4]
served 3.0 T tokens  A, B = [7.2, 5.4]
served 10.0 T tokens  A, B = [21.2, 12.4]
break-even at about 1.2 trillion served tokens
:::

## Try it

:::exercise
title: Find the break-even point
task: Plan A trains 10 billion weights on 200 billion tokens. Plan B trains 5 billion weights on 800 billion tokens. Write the total cost of each plan as a function of the served token count D infer, set the two totals equal, and solve for D infer by hand. Then check the answer with the code from the lesson.
hint: Plan A costs 1.2 times 10 to the power 22 plus 2 times 10 to the power 10 times D infer. Plan B costs 2.4 times 10 to the power 22 plus 1 times 10 to the power 10 times D infer.
lang: python
solution:
train_A = 6 * 10e9 * 200e9
train_B = 6 * 5e9 * 800e9
per_token_A = 2 * 10e9
per_token_B = 2 * 5e9
D = (train_B - train_A) / (per_token_A - per_token_B)
print(D / 1e12, "trillion served tokens")   # 1.2
:::

## Common mistakes

- Mistake: you plan with training cost only. Fix: add $2ND_{\\text{infer}}$ to the budget.
- Mistake: you assume any loss target is reachable by a small model. Fix: check the floor $E + A / N^{\\alpha}$ first.
- Mistake: you estimate serving volume for the first month. Fix: estimate for the full life of the model.
- Mistake: you count only FLOPs. Fix: memory traffic sets latency on real hardware.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: inference-aware scaling
q: What is the serving cost per generated token for a 5 billion weight model?
- 5 billion FLOPs
* 10 billion FLOPs
- 30 billion FLOPs
- 100 billion FLOPs
why: Each generated token costs about 2 N FLOPs, and 2 times 5 billion is 10 billion.
q: Why does the smaller, overtrained model win at a high serving volume?
- It reaches a lower loss floor
* Its cheaper cost per served token repays the extra training cost
- It needs fewer training tokens
- Its KV cache is free
why: The extra training is paid once, and the saving per token is paid back on every one of trillions of requests.
q: Plan A and Plan B from the lesson have served 1 trillion tokens. Which plan is cheaper in total, and by how much?
* Plan A, by 0.2 times 10 to the power 22 FLOPs
- Plan B, by 0.2 times 10 to the power 22 FLOPs
- Plan B, by 8.8 times 10 to the power 22 FLOPs
- They cost the same
why: Plan A totals 3.2 and Plan B totals 3.4 in units of 10 to the power 22, so Plan A is still ahead at 1 trillion served tokens.
q: What stops a team from overtraining a tiny model without limit?
- The learning rate
* The loss floor for that size and the supply of good data
- The number of GPUs
- The KL penalty
why: The term A over N to the power alpha sets a floor for each size, and the extra tokens must exist and be good.
q: Which serving cost does the FLOP count in this lesson leave out?
- The cost of training the tokeniser
- The cost of the reward model
* Memory traffic for the KV cache, which often dominates at long context
- The cost of the embedding table
why: On real hardware, reading the KV cache from memory sets latency at long context, and FLOPs alone miss it.
:::

## Go further

The Sardana and Frankle paper adds inference to the Chinchilla objective and gives the full method. The Llama 3 report explains the decision to train small models on 15 trillion tokens. The Chinchilla paper provides the loss fit that the method depends on.
`,
          links: [
            { label: 'Beyond Chinchilla-Optimal: Accounting for Inference (Sardana and Frankle, 2023)', url: 'https://arxiv.org/abs/2401.00448', kind: 'paper' },
            { label: 'The Llama 3 Herd of Models (2024)', url: 'https://arxiv.org/abs/2407.21783', kind: 'paper' },
            { label: 'Training Compute-Optimal Large Language Models (Hoffmann et al., 2022)', url: 'https://arxiv.org/abs/2203.15556', kind: 'paper' },
            { label: 'LLaMA: Open and Efficient Foundation Language Models (2023)', url: 'https://arxiv.org/abs/2302.13971', kind: 'paper' },
          ],
        },
        {
          slug: 'data-constrained-scaling',
          title: 'Scaling when data runs out',
          summary: 'When good tokens are scarce, repeated epochs help up to a point, and then more weights help less.',
          minutes: 14,
          objectives: [
            'Describe how loss changes when a model sees the same tokens again.',
            'Estimate the number of useful epochs from the Muennighoff result.',
            'Choose between repeating data and adding lower-quality data.',
            'Explain why synthetic data changes the data budget.',
          ],
          keyTerms: ['epoch', 'data-constrained', 'repeated data', 'overfitting', 'synthetic data', 'tokens per weight'],
          body: `
## What this lesson covers

This lesson covers scaling when the supply of training tokens is fixed. It explains the effect of repeated epochs, the value of lower-quality data, and the role of synthetic data. You will use a simple rule to decide how many times to repeat a dataset.

## Why it matters

The public web holds a finite number of good tokens. Estimates put the usable English web text at a few tens of trillions of tokens. Frontier models already train on that scale. Every team that trains a model in a narrow domain, such as code or law, hits the limit much earlier. The rules in this lesson decide what to do next.

## The idea with an example

An epoch is one full pass over the training data. Suppose you have 100 billion tokens of good text and a budget to train on 400 billion tokens. You have three options:

- Repeat the 100 billion tokens for 4 epochs.
- Train for 1 epoch and stop, which wastes compute.
- Add 300 billion tokens of lower-quality text for 1 epoch.

The Muennighoff study measured the first option. Tokens seen for the second time are worth almost as much as new tokens. Tokens seen for the fourth time are worth about as much as new tokens too. Past 4 epochs the value falls fast. By 16 epochs, extra passes add almost nothing, and loss can rise. So 4 epochs of good data is a safe plan.

The timing diagram shows the four epochs and the value of each token as the run repeats the data.

:::timeline
title: Four epochs over 100 billion unique tokens
unit: B tokens
lane Run
lane Token value
Run: epoch 1 @0-100
Run: epoch 2 @100-200
Run: epoch 3 @200-300
Run: epoch 4 @300-400
Token value: 1.0 @0-100
Token value: 0.97 @100-200
Token value: 0.93 @200-300
Token value: 0.9 @300-400
:::

Here is the pattern from the study in rough numbers:

| Epochs | Value of each repeated token |
| --- | --- |
| 1 | 1.00 |
| 4 | about 0.9 |
| 8 | about 0.6 |
| 16 | about 0.2 |

Option three depends on the quality gap. If the extra text is close in quality, mix it in. If it is far worse, repeat the good data instead.

The bars compare the value of a repeated token at four epoch counts.

:::bars
title: Value of a token seen again, by epoch count
unit: relative
Epoch 1: 1.0
Epoch 4: 0.9
Epoch 8: 0.6
Epoch 16: 0.2
:::

## How it works

The study extends the Chinchilla fit with an effective data term:

$$D_{\\text{eff}} = U + U R^{*} \\left(1 - e^{-R_D / R^{*}}\\right)$$

$U$ is the number of unique tokens. $R_D$ is the number of repeats, so $R_D = 0$ means one epoch. $R^{*}$ is a fitted constant of about 15. $D_{\\text{eff}}$ is the number of fresh tokens with the same value. The exponential term says that each extra repeat adds less than the one before.

To plan a data-constrained run:

1. Count the unique good tokens $U$.
2. Compute the Chinchilla token target $D = 20N$ for the planned $N$.
3. If $D \\le 4U$, train for $D / U$ epochs.
4. If $D > 4U$, compute $D_{\\text{eff}}$ and check whether more weights still help.
5. If weights no longer help, spend the budget on data filtering or synthetic data instead.

Press Next to plan the run from the example with 100 billion good tokens.

:::scenario
title: Plan a run with 100 billion good tokens
state: unique tokens U=100 billion, planned N=20 billion weights, D=unknown
step: Compute the Chinchilla target. D equals 20 times N.
state: D=400 billion
step: Compare D with 4 U. 400 billion equals 4 times 100 billion, so 4 epochs is safe.
state: epochs=4
step: Compute the effective data with 3 repeats and R star equal to 15.
state: D eff=100 billion x (1 + 15 x (1 - e^-0.2)) = 372 billion
step: The 400 billion tokens seen are worth about 372 billion fresh tokens. Train for 4 epochs.
state: decision=train 4 epochs
:::

Synthetic data changes the budget. A model generates text that matches a target style, and a filter keeps the best outputs. The Phi series of models trains on textbook-style synthetic text and matches larger models on reasoning tasks. The cost moves from collection to generation and filtering.

Note: repeated epochs help less for a large model than for a small one. Large models memorise sooner.

The code below computes the effective data for a fixed supply of unique tokens at several epoch counts, with R star equal to 15.

:::code
lang: python
import math

def effective_tokens(U, epochs, R_star=15):
    R_D = epochs - 1
    return U + U * R_star * (1 - math.exp(-R_D / R_star))

U = 100e9
for epochs in [1, 2, 4, 8, 16]:
    seen = U * epochs
    eff = effective_tokens(U, epochs)
    print("epochs", epochs, "seen", round(seen / 1e9), "B", "worth", round(eff / 1e9), "B", "value per token", round(eff / seen, 2))
:::

The output is:

:::code
lang: text
epochs 1 seen 100 B worth 100 B value per token 1.0
epochs 2 seen 200 B worth 197 B value per token 0.98
epochs 4 seen 400 B worth 372 B value per token 0.93
epochs 8 seen 800 B worth 659 B value per token 0.82
epochs 16 seen 1600 B worth 1048 B value per token 0.66
:::

## Try it

:::exercise
title: Is a 16-epoch run worth it?
task: You have 100 billion unique good tokens and a plan to see 1.6 trillion tokens, which is 16 epochs. Use the effective data formula with R star equal to 15 to compute how many fresh tokens the run is worth. Then compute the same for 8 epochs. State the value per seen token in each case and decide which run you would fund.
hint: R D is the number of repeats, so 16 epochs means R D equals 15 and 8 epochs means R D equals 7. Divide the effective tokens by the tokens seen to get the value per token.
lang: python
solution:
import math

U = 100e9
for epochs in [8, 16]:
    R_D = epochs - 1
    eff = U + U * 15 * (1 - math.exp(-R_D / 15))
    print(epochs, "epochs worth", round(eff / 1e9), "B tokens",
          "value per token", round(eff / (U * epochs), 2))
# 8 epochs: about 660 B, 0.83 per token
# 16 epochs: about 1048 B, 0.65 per token. The second 800 B tokens add only 388 B.
:::

## Common mistakes

- Mistake: you train for 20 epochs on a small dataset. Fix: stop near 4 epochs and look for more data.
- Mistake: you add a huge low-quality corpus to reach a token target. Fix: measure loss on a held-out set with and without it.
- Mistake: you generate synthetic data without a filter. Fix: score every sample and keep only the top fraction.
- Mistake: you count tokens before deduplication. Fix: count unique tokens after deduplication.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: data-constrained scaling
q: About how many epochs over good data are close to free in the Muennighoff study?
- 1
* 4
- 16
- 40
why: Up to about 4 epochs each repeated token is worth almost as much as a fresh one, and past that the value falls fast.
q: A run sees its data 3 times. What is R D in the effective data formula?
- 3
* 2
- 1
- 0
why: R D counts repeats, not passes, so three passes means two repeats.
q: You have 50 billion unique tokens and want to train a 10 billion weight model to the Chinchilla target. Which option matches the lesson's rule?
- Train for 1 epoch and stop
* Train for 4 epochs, since 200 billion tokens equals 4 times the supply
- Train for 20 epochs
- Train a 100 billion weight model instead
why: The target is 20 times 10 billion, which is 200 billion tokens, and that is exactly 4 U, the safe limit.
q: What does synthetic data trade for the cost of collection?
- Nothing, it is free
- A larger vocabulary
* The cost of generation and of filtering the outputs
- A lower loss floor
why: A model must generate the text and a filter must keep the best samples, so the cost moves rather than disappears.
q: Why do repeated epochs help a large model less than a small one?
* Large models memorise the data sooner
- Large models use a smaller learning rate
- Large models have a smaller vocabulary
- Large models cannot shuffle data
why: A model with more weights fits the repeated tokens faster, so the extra passes turn into memorisation instead of learning.
:::

## Go further

The Muennighoff paper gives the full data-constrained fit and the epoch experiments. The Phi paper shows what a filtered synthetic textbook corpus can do. The Chinchilla paper provides the base fit. The FineWeb paper describes how a modern web corpus is filtered to extend the supply of good tokens.
`,
          links: [
            { label: 'Scaling Data-Constrained Language Models (Muennighoff et al., 2023)', url: 'https://arxiv.org/abs/2305.16264', kind: 'paper' },
            { label: 'Textbooks Are All You Need (Gunasekar et al., 2023)', url: 'https://arxiv.org/abs/2306.11644', kind: 'paper' },
            { label: 'Training Compute-Optimal Large Language Models (Hoffmann et al., 2022)', url: 'https://arxiv.org/abs/2203.15556', kind: 'paper' },
            { label: 'The FineWeb Datasets (2024)', url: 'https://arxiv.org/abs/2406.17557', kind: 'paper' },
          ],
        },
      ],
    },
    {
      slug: 'alignment',
      title: 'Alignment: SFT, RLHF, DPO',
      description: 'How a base model becomes an assistant through demonstrations, preferences, and reinforcement learning.',
      level: 'advanced',
      lessons: [
        {
          slug: 'rlhf-pipeline',
          title: 'The RLHF pipeline',
          summary: 'Supervised fine-tuning, a reward model, and reinforcement learning turn a base model into an assistant.',
          minutes: 18,
          objectives: [
            'Describe the three stages of reinforcement learning from human feedback (RLHF).',
            'Compute the Bradley-Terry loss for one preference pair.',
            'Explain the purpose of the KL penalty in the RL stage.',
            'Choose the data each stage needs.',
          ],
          keyTerms: ['RLHF', 'supervised fine-tuning', 'reward model', 'Bradley-Terry', 'KL divergence', 'PPO', 'policy'],
          body: `
## What this lesson covers

This lesson explains reinforcement learning from human feedback (RLHF), the recipe that turns a base model into an assistant. It covers the three stages: supervised fine-tuning, reward modelling, and reinforcement learning. You will compute the reward model loss for one example pair.

## Why it matters

A base model predicts the next token of web text. Ask it a question and it may continue with more questions. RLHF teaches the model to answer, to refuse unsafe requests, and to follow a format. Every chat model you have used went through a version of this pipeline. The cost and the failure modes of alignment come from these three stages.

:::video
id: zjkBMFhNj_g
why: Watch the first 35 minutes. The part on training the assistant compares pretraining with fine-tuning on labeler-written conversations and comparison labels, which is the pipeline of this lesson in pictures.
:::

## The idea with an example

Take the prompt "Explain photosynthesis to a child". The base model produces a random continuation. The pipeline fixes this in three steps.

The diagram shows the three stages and the data that moves between them.

:::flow
title: The three RLHF stages
Base model -> SFT model: train on written answers
SFT model -> Reward model: copy, add scalar head
SFT model -> Labelers: two answers per prompt
Labelers -> Reward model: chosen and rejected pairs
SFT model -> Policy: initial weights
Reward model -> Policy: scores during PPO
Policy -> Assistant: final weights
:::

Stage one is supervised fine-tuning (SFT). A labeler writes a good answer. The model trains to reproduce that answer token by token, with the same loss as pretraining. After a few thousand examples, the model answers questions in the right format.

Stage two is reward modelling. The SFT model produces two answers to the prompt. A labeler picks the better one. Call the chosen answer $y_w$ and the rejected one $y_l$. A reward model, a copy of the SFT model with a scalar output head, learns to give $y_w$ a higher score. Suppose it currently scores $y_w$ at 1.0 and $y_l$ at 0.5. The difference is 0.5. The loss is $-\\log \\sigma(0.5) \\approx 0.47$. If the scores were swapped, the loss would be $-\\log \\sigma(-0.5) \\approx 0.97$. The loss pushes the gap in the right direction.

Press Next to compute the reward model loss for the pair.

:::scenario
title: Reward model loss for one preference pair
state: score chosen=1.0, score rejected=0.5, gap=0.5
step: Subtract the rejected score from the chosen score.
step: Apply the sigmoid to the gap. The sigmoid of 0.5 is 0.62.
state: sigmoid=0.62
step: Take the negative logarithm. The loss is 0.47.
state: loss=0.47
step: Now swap the scores so the rejected answer scores higher.
state: score chosen=0.5, score rejected=1.0, gap=-0.5, sigmoid=0.38
step: The loss rises to 0.97. The gradient pushes the chosen score up and the rejected score down.
state: loss=0.97
:::

The bars compare the loss for three values of the gap.

:::bars
title: Reward model loss by score gap
unit: nats
Gap +0.5, chosen scores higher: 0.47
Gap 0, both answers score the same: 0.69
Gap -0.5, rejected scores higher: 0.97
:::

Stage three is reinforcement learning (RL). The policy, the model under training, generates answers. The reward model scores them. The policy updates its weights to raise the score. A penalty keeps the policy close to the SFT model so it does not find scoring tricks.

## How it works

The reward model loss for one pair is:

$$\\mathcal{L}_{\\text{RM}} = -\\log \\sigma\\big(r_\\phi(x, y_w) - r_\\phi(x, y_l)\\big)$$

$x$ is the prompt. $r_\\phi$ is the reward model with weights $\\phi$. $y_w$ is the preferred answer and $y_l$ is the rejected answer. $\\sigma$ is the sigmoid function, which maps any number to the range 0 to 1. This is the Bradley-Terry model of pairwise choice.

The RL objective is:

$$\\max_\\pi \\; \\mathbb{E}_{y \\sim \\pi}[r(x, y)] - \\beta\\, \\mathrm{KL}\\big(\\pi \\,\\|\\, \\pi_{\\text{SFT}}\\big)$$

$\\pi$ is the policy. $\\mathbb{E}_{y \\sim \\pi}$ is the average over answers the policy generates. $\\mathrm{KL}$ is the Kullback-Leibler divergence, a measure of how far the policy has moved from the SFT model. $\\beta$ sets the strength of the penalty. Proximal policy optimisation (PPO) is the algorithm that performs the update.

The timing diagram shows one PPO iteration, from sampling to the weight update.

:::timeline
title: One PPO iteration
unit: s
lane Policy
lane Reward model
lane Reference
lane Optimiser
Policy: generate 256 answers @0-30
Policy -> Reward model: answers @30-31
Policy -> Reference: answers @30-31
Reward model: score answers @31-36
Reference: log probabilities for KL @31-36
Reward model -> Optimiser: rewards @36-37
Reference -> Optimiser: KL penalty @36-37
Optimiser: 4 gradient epochs on the batch @37-55
Optimiser -> Policy: new weights @55-56
:::

To run the pipeline:

1. Collect 10,000 to 100,000 prompt and answer pairs. Train the SFT model.
2. Sample two answers per prompt from the SFT model. Collect labeler choices.
3. Train the reward model with the Bradley-Terry loss.
4. Run PPO with the reward model and the KL penalty.
5. Evaluate with fresh labelers, not the reward model.

The table lists the data each stage needs.

| Stage | Input data | Typical size | Output |
| --- | --- | --- | --- |
| Supervised fine-tuning | prompts with written answers | 10,000 to 100,000 pairs | SFT model |
| Reward modelling | two answers per prompt with a labeler choice | 50,000 to 1 million pairs | reward model |
| Reinforcement learning | prompts only | 10,000 to 100,000 prompts | policy |

Caution: the reward model is a proxy. Optimise it too hard and the policy finds answers that score high but read badly. This is reward hacking.

The code below computes the Bradley-Terry loss for the pair from the lesson and for a few other score gaps.

:::code
lang: python
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def reward_model_loss(score_chosen, score_rejected):
    return -math.log(sigmoid(score_chosen - score_rejected))

print("chosen 1.0, rejected 0.5:", round(reward_model_loss(1.0, 0.5), 2))
print("chosen 0.5, rejected 1.0:", round(reward_model_loss(0.5, 1.0), 2))
print("equal scores:", round(reward_model_loss(0.7, 0.7), 2))
for gap in [-2, -1, 0, 1, 2, 4]:
    print("gap", gap, "loss", round(reward_model_loss(gap, 0), 3))
:::

The output is:

:::code
lang: text
chosen 1.0, rejected 0.5: 0.47
chosen 0.5, rejected 1.0: 0.97
equal scores: 0.69
gap -2 loss 2.127
gap -1 loss 1.313
gap 0 loss 0.693
gap 1 loss 0.313
gap 2 loss 0.127
gap 4 loss 0.018
:::

## Try it

:::exercise
title: Loss and gradient for one preference pair
task: The reward model scores the chosen answer at 2.0 and the rejected answer at 0.0. Compute the Bradley-Terry loss by hand. Then compute the gradient of the loss with respect to the gap, which is minus one plus the sigmoid of the gap, for gaps of 2.0, 0.0 and -2.0. Explain in one sentence which pair pushes the model hardest.
hint: The sigmoid of 2 is 0.88. The loss is minus the log of that. The gradient has size 1 minus the sigmoid of the gap.
lang: python
solution:
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

for gap in [2.0, 0.0, -2.0]:
    loss = -math.log(sigmoid(gap))
    grad = -(1 - sigmoid(gap))
    print("gap", gap, "loss", round(loss, 3), "gradient", round(grad, 3))
# gap 2.0: loss 0.127, gradient -0.119
# gap 0.0: loss 0.693, gradient -0.5
# gap -2.0: loss 2.127, gradient -0.881. The pair the model gets wrong pushes hardest.
:::

## Common mistakes

- Mistake: you set $\\beta = 0$ to get higher rewards. Fix: keep the KL penalty and watch the KL value during training.
- Mistake: you judge the final model by its reward score. Fix: use held-out human ratings.
- Mistake: you train the reward model on answers from a different model. Fix: sample preference pairs from the SFT model you will optimise.
- Mistake: you skip SFT and go straight to RL. Fix: SFT gives the policy a sensible starting distribution.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: the RLHF pipeline
q: What data does the supervised fine-tuning stage need?
* Prompts with answers written by labelers
- Two answers per prompt with a labeler choice
- Prompts only
- A reward model
why: SFT trains the model to reproduce good answers token by token, so it needs written answers.
q: The reward model gives both answers in a pair the same score. What is the loss for that pair?
- 0
- 0.5
* About 0.69
- 1
why: The gap is zero, the sigmoid of zero is 0.5, and minus the log of 0.5 is about 0.69.
q: The reward model scores the chosen answer at 0.5 and the rejected answer at 1.0. Which statement is true?
- The loss is 0.47 and the gradient is small
* The loss is about 0.97 and the gradient pushes the chosen score up and the rejected score down
- The loss is zero because the scores differ
- The loss is negative
why: With a gap of minus 0.5 the sigmoid is 0.38, the loss is about 0.97, and the update works to reverse the order.
q: What does the KL penalty in the RL objective prevent?
- The reward model from training
* The policy from drifting far from the SFT model into answers that score high but read badly
- The labelers from disagreeing
- The learning rate from decaying
why: Without the penalty the policy exploits the reward model, and the KL term keeps it close to a sensible starting distribution.
q: How should you judge the final policy?
- By its average reward model score
- By its training loss
* By ratings from fresh labelers on held-out prompts
- By its KL value alone
why: The reward model is a proxy that the policy was optimised against, so only new human ratings measure real quality.
:::

## Go further

The InstructGPT paper describes the full three-stage recipe with results. The earlier summarisation paper tested the same method on one task. The original deep RL from human preferences paper introduced the idea of learning a reward from comparisons. The TRL documentation shows each stage in code.
`,
          links: [
            { label: 'Training language models to follow instructions with human feedback (Ouyang et al., 2022)', url: 'https://arxiv.org/abs/2203.02155', kind: 'paper' },
            { label: 'Learning to summarize from human feedback (Stiennon et al., 2020)', url: 'https://arxiv.org/abs/2009.01325', kind: 'paper' },
            { label: 'Deep reinforcement learning from human preferences (Christiano et al., 2017)', url: 'https://arxiv.org/abs/1706.03741', kind: 'paper' },
            { label: 'TRL documentation', url: 'https://huggingface.co/docs/trl', kind: 'docs' },
          ],
        },
        {
          slug: 'dpo-derivation',
          title: 'Deriving DPO',
          summary: 'Direct preference optimisation removes the reward model by solving the RLHF objective in closed form.',
          minutes: 20,
          objectives: [
            'Write the optimal policy of the KL-regularised objective.',
            'Invert the optimal policy to express the reward in terms of the policy.',
            'Explain why the partition function cancels in a preference pair.',
            'Compute the DPO loss for one example pair.',
          ],
          keyTerms: ['DPO', 'partition function', 'reference model', 'KL divergence', 'Bradley-Terry', 'implicit reward'],
          body: `
## What this lesson covers

This lesson derives direct preference optimisation (DPO) step by step. DPO trains a policy on preference pairs with no separate reward model and no reinforcement learning loop. The derivation has three steps: solve the RLHF objective, invert the solution, and substitute into the Bradley-Terry loss.

## Why it matters

DPO replaces the PPO stage with a single supervised loss. It needs two copies of the model instead of four. It has no sampling loop and few hyperparameters. Most open-weight assistants released after 2023 use DPO or a close variant. If you understand the derivation, you can read every variant paper.

## The idea with an example

Start with a tiny world. A prompt has only two possible answers, A and B. The reference model, the SFT model, gives A probability 0.5 and B probability 0.5. A reward model scores A at 1.0 and B at 0.0. Set $\\beta = 1$.

The RLHF objective asks for a policy that raises reward but stays close to the reference. The best policy multiplies each reference probability by $e^{r / \\beta}$ and renormalises. For A, $0.5 \\times e^{1} = 1.36$. For B, $0.5 \\times e^{0} = 0.5$. The sum is 1.86, the partition function. The optimal policy gives A probability $1.36 / 1.86 = 0.73$ and B probability 0.27.

Now reverse the question. Suppose you observe the optimal policy and the reference. Can you recover the reward? Yes, up to a constant. For A, $\\beta \\log(0.73 / 0.5) = 0.38$. For B, $\\beta \\log(0.27 / 0.5) = -0.62$. The difference is $1.0$, which equals the original reward gap. The constant from the partition function dropped out when you subtracted. DPO builds its loss from this difference, so it never needs the partition function.

Press Next to follow the tiny world from reference to optimal policy and back to the reward.

:::scenario
title: Two answers, one reward, and the policy that follows
state: ref A=0.5, ref B=0.5, reward A=1.0, reward B=0.0, beta=1
step: Multiply each reference probability by e to the power of reward over beta.
state: unnormalised A=1.36, unnormalised B=0.5
step: Add the two numbers. The sum is the partition function Z.
state: Z=1.86
step: Divide each number by Z to get the optimal policy.
state: policy A=0.73, policy B=0.27
step: Reverse the question. Compute beta times the log ratio of policy to reference for each answer.
state: implicit A=0.38, implicit B=-0.62
step: Subtract. The difference is 1.0, the original reward gap. Z cancelled.
state: difference=1.0
:::

The bars compare the probability of each answer before and after optimisation.

:::bars
title: Probability of each answer under the reference and the optimal policy
unit: probability
A under reference: 0.5
A under optimal policy: 0.73
B under reference: 0.5
B under optimal policy: 0.27
:::

## How it works

Step one. The KL-regularised objective has the closed-form optimum:

$$\\pi^{*}(y \\mid x) = \\frac{1}{Z(x)}\\, \\pi_{\\text{ref}}(y \\mid x)\\, \\exp\\!\\left(\\frac{r(x, y)}{\\beta}\\right)$$

$\\pi^{*}$ is the optimal policy. $\\pi_{\\text{ref}}$ is the reference model. $r$ is the reward. $\\beta$ is the KL strength. $Z(x)$ is the partition function, the sum over all answers that makes the probabilities add to one.

Step two. Take logarithms and solve for the reward:

$$r(x, y) = \\beta \\log \\frac{\\pi^{*}(y \\mid x)}{\\pi_{\\text{ref}}(y \\mid x)} + \\beta \\log Z(x)$$

Step three. Put this reward into the Bradley-Terry loss. The loss uses $r(x, y_w) - r(x, y_l)$. The term $\\beta \\log Z(x)$ appears in both and cancels. The result is the DPO loss:

$$\\mathcal{L}_{\\text{DPO}} = -\\log \\sigma\\!\\left(\\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)}\\right)$$

$\\pi_\\theta$ is the policy under training with weights $\\theta$. $y_w$ and $y_l$ are the chosen and rejected answers. $\\sigma$ is the sigmoid.

The diagram shows the three steps of the derivation in order.

:::flow
title: The three steps of the DPO derivation
RLHF objective -> Optimal policy: solve in closed form
Optimal policy -> Reward formula: take logs and invert
Reward formula -> Bradley-Terry loss: substitute for r
Bradley-Terry loss -> Z cancels: subtract the pair
Z cancels -> DPO loss: sigmoid of beta log ratios
:::

To train with DPO:

1. Freeze a copy of the SFT model as $\\pi_{\\text{ref}}$.
2. For each pair, compute the log probability of $y_w$ and $y_l$ under both models.
3. Form the two log ratios and subtract them.
4. Apply the DPO loss and take a gradient step on $\\theta$.

Note: the log ratio $\\beta \\log(\\pi_\\theta / \\pi_{\\text{ref}})$ acts as an implicit reward. You can read it off a trained DPO model.

The table compares the two methods.

| Property | RLHF with PPO | DPO |
| --- | --- | --- |
| Model copies in memory | 4: policy, reference, reward, value | 2: policy, reference |
| Sampling loop | yes | no |
| Reward model | separate, trained first | implicit, inside the policy |
| Main hyperparameters | beta, clip range, batch, PPO epochs | beta |

The code below runs the tiny world from the lesson: it computes the optimal policy, recovers the implicit rewards, and evaluates the DPO loss for the pair A over B.

:::code
lang: python
import math

ref = {"A": 0.5, "B": 0.5}
reward = {"A": 1.0, "B": 0.0}
beta = 1.0

unnorm = {y: ref[y] * math.exp(reward[y] / beta) for y in ref}
Z = sum(unnorm.values())
policy = {y: unnorm[y] / Z for y in ref}
print("Z", round(Z, 2), "policy", {y: round(p, 2) for y, p in policy.items()})

implicit = {y: beta * math.log(policy[y] / ref[y]) for y in ref}
print("implicit rewards", {y: round(r, 2) for y, r in implicit.items()})
print("difference", round(implicit["A"] - implicit["B"], 2))

def dpo_loss(pi, ref, chosen, rejected, beta=1.0):
    margin = beta * math.log(pi[chosen] / ref[chosen]) - beta * math.log(pi[rejected] / ref[rejected])
    return -math.log(1 / (1 + math.exp(-margin)))

print("DPO loss at the reference", round(dpo_loss(ref, ref, "A", "B"), 3))
print("DPO loss at the optimal policy", round(dpo_loss(policy, ref, "A", "B"), 3))
:::

The output is:

:::code
lang: text
Z 1.86 policy {'A': 0.73, 'B': 0.27}
implicit rewards {'A': 0.38, 'B': -0.62}
difference 1.0
DPO loss at the reference 0.693
DPO loss at the optimal policy 0.313
:::

## Try it

:::exercise
title: A three-answer world
task: Extend the tiny world to three answers A, B and C. The reference gives each probability 1 over 3. The rewards are 1.0, 0.0 and -1.0. Set beta to 1. Compute the partition function, the optimal policy, and the implicit reward of each answer. Check that the implicit reward differences A minus B and B minus C both equal 1.0.
hint: Multiply each reference probability by e to the power of the reward, add the three results to get Z, divide to get the policy, then take beta times the log of policy over reference.
lang: python
solution:
import math

ref = 1 / 3
rewards = {"A": 1.0, "B": 0.0, "C": -1.0}
unnorm = {y: ref * math.exp(r) for y, r in rewards.items()}
Z = sum(unnorm.values())
policy = {y: u / Z for y, u in unnorm.items()}
implicit = {y: math.log(policy[y] / ref) for y in policy}
print("Z", round(Z, 3))                                        # 1.362
print({y: round(p, 3) for y, p in policy.items()})            # A 0.665, B 0.245, C 0.090
print({y: round(r, 3) for y, r in implicit.items()})          # 0.691, -0.309, -1.309
print(round(implicit["A"] - implicit["B"], 3), round(implicit["B"] - implicit["C"], 3))   # 1.0 1.0
:::

## Common mistakes

- Mistake: you let the reference model update. Fix: freeze it, or the log ratios lose their meaning.
- Mistake: you sum log probabilities over answers of different lengths without care. Fix: check for a length bias in the chosen answers.
- Mistake: you choose $\\beta$ too small. Fix: start near 0.1 and watch how far the policy drifts.
- Mistake: you reuse preference pairs from a different reference model. Fix: sample pairs from the reference you will train from.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: DPO
q: Why can DPO ignore the partition function Z?
- Z is always equal to 1
- Z is learned by the reward model
* Z depends only on the prompt, so it is the same for both answers and cancels in the difference
- Z is set to zero by the KL penalty
why: Both answers in a pair share one prompt, and the term beta log Z appears in both rewards and drops out when you subtract.
q: What plays the role of the reward in a trained DPO model?
- The log probability of the answer
* Beta times the log ratio of the policy probability to the reference probability
- The sigmoid of the answer length
- The partition function
why: Inverting the optimal policy gives the reward as beta log of policy over reference, up to a constant.
q: In the tiny world, the reference gives A and B probability 0.5 each, the reward of A is 1.0 and of B is 0.0, and beta is 1. What probability does the optimal policy give A?
- 0.50
- 0.62
* 0.73
- 1.00
why: The unnormalised values are 1.36 and 0.5, the sum is 1.86, and 1.36 over 1.86 is 0.73.
q: How many model copies does DPO keep in memory during training?
- 1
* 2, the policy and a frozen reference
- 3
- 4, the policy, the reference, the reward model and the value model
why: DPO removes the reward model and the value model, so only the policy and the frozen reference remain.
q: A team lets the reference model update along with the policy. What breaks?
- The partition function becomes negative
* The log ratios lose their meaning as implicit rewards, so the loss no longer matches the derivation
- The chosen answers become shorter
- Nothing, DPO still works
why: The derivation assumes a fixed reference, and the implicit reward is measured against it.
:::

## Go further

The DPO paper contains the derivation with proofs in the appendix. The InstructGPT paper gives the objective DPO solves. The TRL documentation has a DPO trainer with examples. Umar Jamil's channel has a long derivation video.
`,
          links: [
            { label: 'Direct Preference Optimization (Rafailov et al., 2023)', url: 'https://arxiv.org/abs/2305.18290', kind: 'paper' },
            { label: 'Training language models to follow instructions with human feedback (Ouyang et al., 2022)', url: 'https://arxiv.org/abs/2203.02155', kind: 'paper' },
            { label: 'TRL documentation', url: 'https://huggingface.co/docs/trl', kind: 'docs' },
            { label: 'Umar Jamil', url: 'https://www.youtube.com/@umarjamilai', kind: 'video' },
          ],
        },
        {
          slug: 'reward-hacking-and-ai-feedback',
          title: 'Reward hacking and AI feedback',
          summary: 'Reward models fail in predictable ways, and AI-written feedback both scales and reshapes the pipeline.',
          minutes: 15,
          objectives: [
            'Describe three ways a policy exploits a reward model.',
            'Explain how a KL budget and reward model ensembles limit the damage.',
            'Describe the constitutional AI loop for AI feedback.',
            'Choose when to use AI feedback instead of human labels.',
          ],
          keyTerms: ['reward hacking', 'overoptimisation', 'constitutional AI', 'RLAIF', 'KL divergence', 'length bias'],
          body: `
## What this lesson covers

This lesson covers two topics that follow from the RLHF pipeline. The first is reward hacking, the failure where a policy scores high on the reward model and low with people. The second is AI feedback, the use of a model instead of a labeler to produce preferences. Constitutional AI is the main example.

## Why it matters

Reward hacking is the most common way an alignment run goes wrong. The reward curve rises, the demo looks worse, and the team loses a week. AI feedback is the main way labs scale preference data past what labelers can produce. A researcher needs to know both the failure and the fix.

:::video
id: 7xTGNNLPyMI
why: Use the chapter list and watch the reinforcement learning from human feedback chapter near the end, about 15 minutes. It shows a policy that fools a reward model with nonsense, which is the failure this lesson explains.
:::

## The idea with an example

Suppose a reward model trained on 50,000 pairs. In that data, labelers often preferred the longer answer because it gave more detail. The reward model learned that length predicts preference. Now run PPO. The policy discovers that a 600-word answer scores higher than a 200-word answer. By step 1,000, every answer is long and padded with repetition. The reward has risen from 1.0 to 3.5. Human ratings have fallen.

Here is a simplified trace from such a run:

| PPO step | Reward score | KL from SFT | Human rating |
| --- | --- | --- | --- |
| 0 | 1.0 | 0 | 6.0 |
| 500 | 2.0 | 5 | 6.8 |
| 1,000 | 3.5 | 20 | 5.1 |

The best model is at step 500, not at the end. The KL value is the early warning signal. The Gao study found that the true quality follows a curve that rises and then falls as the KL grows. The peak moves later with a bigger reward model and more preference data.

Press Next to follow the run through the three checkpoints.

:::scenario
title: A PPO run that hacks the length bias
state: step=0, reward=1.0, KL=0, human rating=6.0, answer length=200 words
step: The reward model learned that long answers win. PPO starts from the SFT model.
step: By step 500 the answers grow to 400 words with more detail. People like them more.
state: step=500, reward=2.0, KL=5, human rating=6.8, answer length=400 words
step: By step 1000 the answers reach 600 words and repeat themselves. The reward keeps rising.
state: step=1000, reward=3.5, KL=20, human rating=5.1, answer length=600 words
step: The KL passed 20 nats. The best checkpoint is step 500, not the last one.
state: best checkpoint=step 500
:::

The bars compare the human rating at the three checkpoints.

:::bars
title: Human rating by PPO step
unit: out of 10
Step 0: 6.0 (reward 1.0, KL 0)
Step 500: 6.8 (reward 2.0, KL 5)
Step 1000: 5.1 (reward 3.5, KL 20)
:::

Constitutional AI replaces the labeler for harmlessness. The model generates an answer. The model then critiques its own answer against a written principle such as "choose the response that is least harmful". The model rewrites the answer. The pairs of original and rewritten answers train the reward model. The principles replace the labeler, and one principle applies to thousands of prompts.

The diagram shows the constitutional AI loop from prompt to policy.

:::flow
title: The constitutional AI loop
Prompt -> Model: generate answer
Model -> Critique: apply one principle
Critique -> Revision: rewrite the answer
Revision -> SFT data: revised answers
Revision -> AI preferences: compare two answers
AI preferences -> Reward model: train
Reward model -> RL policy: scores
:::

## How it works

Overoptimisation follows an approximate law:

$$R_{\\text{true}}(d) = d\\,(\\alpha - \\beta \\log d)$$

$d$ is the square root of the KL distance from the SFT model. $R_{\\text{true}}$ is the quality judged by a gold reward. $\\alpha$ and $\\beta$ are fitted constants. The curve rises, peaks, and falls.

To protect a run against reward hacking:

1. Record the KL from the SFT model at every evaluation step.
2. Stop PPO when the KL passes a fixed budget, often between 5 and 20 nats.
3. Train an ensemble of reward models from different seeds. Use the minimum score, or the mean minus a margin.
4. Subtract a length penalty from the reward.
5. Have people rate samples from several checkpoints and pick the best.

The constitutional AI loop has two phases:

1. Supervised phase: generate, critique, revise, and fine-tune on the revisions.
2. RL phase: generate two answers, ask the model which one better follows a principle, and train a reward model on those AI preferences. This is reinforcement learning from AI feedback (RLAIF).

AI feedback works best for criteria a model can judge, such as harmlessness or format. It works less well where the judge model lacks the skill, such as hard mathematics.

Note: the judge model has its own biases. Many judges prefer their own style and longer answers.

The code below scans the overoptimisation curve from the lesson for one set of constants and reports the KL at which true quality peaks, so you can set a KL budget before a run.

:::code
lang: python
import math

def true_reward(kl, alpha=0.6, beta=0.3):
    d = math.sqrt(kl)
    return d * (alpha - beta * math.log(d)) if d > 0 else 0.0

best_kl, best_r = 0, 0
for step in range(1, 400):
    kl = step * 0.1
    r = true_reward(kl)
    if r > best_r:
        best_kl, best_r = kl, r
    if step % 50 == 0:
        print("KL", round(kl, 1), "true reward", round(r, 3))
print("peak at KL", round(best_kl, 1), "nats, true reward", round(best_r, 3))
:::

The output is:

:::code
lang: text
KL 5.0 true reward 0.802
KL 10.0 true reward 0.805
KL 15.0 true reward 0.751
KL 20.0 true reward 0.674
KL 25.0 true reward 0.586
KL 30.0 true reward 0.492
KL 35.0 true reward 0.395
peak at KL 7.4 nats, true reward 0.815
:::

## Try it

:::exercise
title: Set a KL budget from the curve
task: Take the curve R true of d equal to d times alpha minus beta log d, with alpha equal to 0.6 and beta equal to 0.3. Find the value of d where the curve peaks by setting its derivative to zero, then convert d to a KL value, since d is the square root of the KL. Compare your answer with the budget of 5 to 20 nats in the lesson. Then repeat with alpha equal to 0.9 and say in one sentence what a bigger alpha means for the budget.
hint: The derivative is alpha minus beta log d minus beta. Set it to zero to get log d equal to alpha over beta minus 1.
lang: python
solution:
import math

for alpha in [0.6, 0.9]:
    beta = 0.3
    d = math.exp(alpha / beta - 1)
    print("alpha", alpha, "peak d", round(d, 2), "KL budget", round(d * d, 1), "nats")
# alpha 0.6: d 2.72, KL 7.4 nats, inside the 5 to 20 range
# alpha 0.9: d 7.39, KL 54.6 nats. A larger alpha, from a bigger reward model and more data, moves the peak later.
:::

## Common mistakes

- Mistake: you train PPO until the reward stops rising. Fix: stop on a KL budget and pick the checkpoint with the best human rating.
- Mistake: you use one reward model for a long run. Fix: use an ensemble and refresh it with new pairs.
- Mistake: you use AI feedback for a skill the judge does not have. Fix: keep human labels or verifiable checks for that skill.
- Mistake: you write vague principles. Fix: write one clear, testable sentence per principle.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: reward hacking and AI feedback
q: Which signal warns of reward hacking before any person reads an answer?
- The training loss of the reward model
* The KL distance from the SFT model
- The number of labelers
- The learning rate
why: True quality rises and then falls as the KL grows, so a KL past the budget means the policy has drifted into exploits.
q: In the lesson's PPO trace, which checkpoint should the team ship?
- Step 0, because the KL is zero
* Step 500, where the human rating peaks at 6.8
- Step 1,000, where the reward is highest
- None, the run failed
why: The reward keeps rising to step 1,000 but the human rating falls to 5.1, and step 500 has the best rating.
q: Why does an ensemble of reward models limit the damage?
- It trains faster than one model
* The policy must fool several models at once, and the minimum score punishes exploits that only one model rewards
- It removes the need for a KL penalty
- It makes answers shorter
why: Different seeds learn different quirks, so an answer that games one model usually scores low on another.
q: What replaces the labeler in constitutional AI?
- A larger reward model
- A unit test
* A written principle that the model applies as a critic to its own answer
- A length penalty
why: The model critiques and rewrites its answer against a principle, and the pairs train the reward model.
q: For which criterion is AI feedback the weakest choice?
- Harmlessness
- Answer format
* Hard mathematics that the judge model cannot solve
- Politeness
why: A judge can only grade what it can do, so skills the judge lacks need human labels or a verifiable check.
:::

## Go further

The reward model overoptimisation paper fits the curve and tests ensembles. The constitutional AI paper gives the full critique and revision loop. The RLAIF paper compares AI preferences to human preferences on several tasks. The InstructGPT paper describes the human baseline that these methods extend.
`,
          links: [
            { label: 'Scaling Laws for Reward Model Overoptimization (Gao et al., 2022)', url: 'https://arxiv.org/abs/2210.10760', kind: 'paper' },
            { label: 'Constitutional AI: Harmlessness from AI Feedback (Bai et al., 2022)', url: 'https://arxiv.org/abs/2212.08073', kind: 'paper' },
            { label: 'RLAIF: Scaling RL from Human Feedback with AI Feedback (Lee et al., 2023)', url: 'https://arxiv.org/abs/2309.00267', kind: 'paper' },
            { label: 'Training language models to follow instructions with human feedback (Ouyang et al., 2022)', url: 'https://arxiv.org/abs/2203.02155', kind: 'paper' },
          ],
        },
      ],
    },
    {
      slug: 'pretraining-data',
      title: 'Pretraining data',
      description: 'Tokenisation, data mixtures, deduplication, and curriculum: the work that decides what a model learns.',
      level: 'advanced',
      lessons: [
        {
          slug: 'tokenisation',
          title: 'Tokenisation and byte-pair encoding',
          summary: 'A tokeniser splits text into units from a fixed vocabulary, and the split shapes everything the model sees.',
          minutes: 16,
          objectives: [
            'Run three merge steps of byte-pair encoding (BPE) on a small corpus by hand.',
            'Explain why vocabulary size trades sequence length against embedding size.',
            'Describe two failure modes caused by the tokeniser.',
            'Compute the compression ratio of a tokeniser on a sample.',
          ],
          keyTerms: ['token', 'tokeniser', 'byte-pair encoding', 'vocabulary', 'embedding', 'compression ratio'],
          body: `
## What this lesson covers

This lesson explains how a tokeniser turns text into tokens. It covers byte-pair encoding (BPE), the algorithm used by most language models. You will run the merge procedure by hand on a tiny corpus and see how vocabulary size affects the model.

## Why it matters

The model never sees characters. It sees token identifiers. A bad tokeniser makes arithmetic hard, makes some languages three times more expensive, and wastes context. Every token count in a scaling law, an API bill, or a KV cache estimate depends on the tokeniser. Research on data starts here.

:::video
id: zduSFxRajkE
why: Watch the first 40 minutes. It builds byte-pair encoding from scratch in Python and explains the failure modes with digits and other languages that this lesson lists.
:::

## The idea with an example

Take a corpus with three words and their counts: "low" appears 5 times, "lower" appears 2 times, and "newest" appears 6 times. Start with a vocabulary of single characters. Write each word as a sequence of characters with an end marker: l o w _, l o w e r _, n e w e s t _.

BPE finds the most frequent pair of adjacent units and merges them into one unit. Count the pairs:

| Pair | Where it appears | Count |
| --- | --- | --- |
| w e | lower (2) and newest (6) | 8 |
| l o | low (5) and lower (2) | 7 |
| o w | low (5) and lower (2) | 7 |
| n e, e w, e s, s t, t _ | newest (6) | 6 each |
| w _ | low (5) | 5 |
| e r, r _ | lower (2) | 2 each |

The pair "w e" has the highest count, 8, because it appears in both "lower" and "newest". Merge "w e" into "we". Now the words read l o w _, l o we r _, and n e we s t _. Count again: "l o" appears 7 times, so merge it into "lo". Count again: five pairs tie at 6 ("n e", "e we", "we s", "s t", "t _"). The code below breaks ties in alphabetical order, so it merges "e we" into "ewe". After three merges the vocabulary has three new units: "we", "lo", and "ewe". The word "lower" now tokenises as "lo", "we", "r", "_", and "newest" as "n", "ewe", "s", "t", "_". Repeat until the vocabulary reaches a target size, often 32,000 to 128,000 units.

Press Next to run the three merges and watch the token lists change.

:::scenario
title: Three BPE merges on low, lower, newest
state: vocabulary=characters only, low=l o w _, lower=l o w e r _, newest=n e w e s t _
step: Count every adjacent pair across all three words, weighted by word count. The pair w e appears 2 + 6 = 8 times.
state: top pair=w e (8)
step: Merge w e into we. Rewrite every word that contains it.
state: vocabulary=characters + we, lower=l o we r _, newest=n e we s t _, top pair=l o (7)
step: Merge l o into lo. The words low and lower change.
state: vocabulary=characters + we + lo, low=lo w _, lower=lo we r _, top pair=e we (6, tie broken alphabetically)
step: Merge e we into ewe. Only newest changes.
state: vocabulary=characters + we + lo + ewe, newest=n ewe s t _
step: Stop after three merges. The word lower now tokenises as lo, we, r, and the end marker.
state: lower tokens=lo we r _, newest tokens=n ewe s t _
:::

A larger vocabulary makes sequences shorter. The sentence "the newest lower" might take 7 tokens with a vocabulary of 100 and 3 tokens with a vocabulary of 50,000. Shorter sequences cost less attention. The price is a larger embedding table and a larger output layer.

The bars compare the token count of the sentence for the two vocabulary sizes.

:::bars
title: Tokens for the sentence the newest lower
unit: tokens
Vocabulary of 100: 7
Vocabulary of 50,000: 3
:::

## How it works

The BPE training procedure:

1. Split the corpus into words. Split each word into bytes or characters.
2. Count every pair of adjacent units across the corpus.
3. Merge the most frequent pair into a new unit. Record the merge.
4. Repeat steps 2 and 3 until the vocabulary reaches the target size.

To tokenise new text, apply the recorded merges in order. Modern tokenisers work on bytes, so any input has a tokenisation and there is no unknown token.

The diagram shows the path from raw text to the embedding table.

:::flow
title: From text to token identifiers
Raw text -> Pre-tokeniser: split on spaces
Pre-tokeniser -> Bytes: encode each word
Bytes -> Merge rules: apply merges in order
Merge rules -> Tokens: low e r
Tokens -> Vocabulary: look up each unit
Vocabulary -> Token ids: integers
Token ids -> Embedding table: one row per id
:::

The compression ratio is:

$$\\rho = \\frac{\\text{number of bytes}}{\\text{number of tokens}}$$

$\\rho$ is the average number of bytes per token. English text with a 100,000 unit vocabulary gives about 4 bytes per token. A tokeniser trained on English gives about 1.5 bytes per token on Thai, so Thai text costs almost three times as many tokens.

The bars compare the bytes per token for the two languages.

:::bars
title: Bytes per token with an English-trained tokeniser
unit: bytes per token
English: 4.0
Thai: 1.5
:::

Two failure modes come from the tokeniser. Numbers split in odd places, so "1234" may become "12" and "34", and the model must learn arithmetic across the split. Rare strings that appear in the vocabulary but not in training data become glitch tokens with untrained embeddings.

Note: the embedding table has one row per vocabulary unit. With a vocabulary of 128,000 and a width of 4,096, the table holds 524 million weights.

The code below runs byte-pair encoding on the three-word corpus from the lesson and prints each merge. Its three merges match the pair table and the scenario above: w e, then l o, then e we.

:::code
lang: python
from collections import Counter

corpus = {"low": 5, "lower": 2, "newest": 6}
words = {tuple(w) + ("_",): n for w, n in corpus.items()}

def pair_counts(words):
    counts = Counter()
    for symbols, n in words.items():
        for a, b in zip(symbols, symbols[1:]):
            counts[(a, b)] += n
    return counts

def merge(words, pair):
    out = {}
    for symbols, n in words.items():
        new, i = [], 0
        while i < len(symbols):
            if i + 1 < len(symbols) and (symbols[i], symbols[i + 1]) == pair:
                new.append(symbols[i] + symbols[i + 1])
                i += 2
            else:
                new.append(symbols[i])
                i += 1
        out[tuple(new)] = n
    return out

for step in range(3):
    counts = pair_counts(words)
    best = min(counts, key=lambda p: (-counts[p], p))   # highest count, ties in alphabetical order
    words = merge(words, best)
    print("merge", step + 1, best, "count", counts[best])
for symbols in words:
    print(" ".join(symbols))
:::

The output is:

:::code
lang: text
merge 1 ('w', 'e') count 8
merge 2 ('l', 'o') count 7
merge 3 ('e', 'we') count 6
lo w _
lo we r _
n ewe s t _
:::

## Try it

:::exercise
title: Run five merges, then change the corpus
task: Run the code from the lesson and check that the first three merges match the table. Then change the loop to run 5 merges and write down how newest and lower tokenise at the end. Finally raise the count of lower from 2 to 6 and predict, before you run it, which pair wins the first merge.
hint: After three merges the live pairs in newest are n ewe, ewe s, s t and t _. Ties break in alphabetical order in this code. For the second part, count l o and w e again with the new word counts.
lang: text
solution:
With 5 merges the code prints:
merge 1 (w, e) count 8
merge 2 (l, o) count 7
merge 3 (e, we) count 6
merge 4 (ewe, s) count 6
merge 5 (ewes, t) count 6
newest tokenises as n ewest _ and lower as lo we r _.
The lesson's sequence l o, lo w, e s is what you get if you only count the pairs in its table.
:::

## Common mistakes

- Mistake: you count words to estimate cost. Fix: run the tokeniser and count tokens.
- Mistake: you train the tokeniser on English only for a multilingual model. Fix: sample the tokeniser corpus with the same mix as the training data.
- Mistake: you change the tokeniser after pretraining. Fix: the embeddings are tied to the vocabulary; keep it fixed.
- Mistake: you ignore how digits split. Fix: split numbers into single digits or fixed groups of three.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: tokenisation
q: After the merges l o and lo w, how does the word lower tokenise?
- l o w e r _
* low e r _
- lo w e r _
- lower _
why: The two merges turn l o w into one unit, and the rest of the word stays as single characters.
q: What does a larger vocabulary cost?
- Longer sequences
* A larger embedding table and output layer
- Fewer merges
- A slower pre-tokeniser
why: Each vocabulary unit is a row in the embedding table and a column in the output layer.
q: An English-trained tokeniser gives 4 bytes per token on English and 1.5 bytes per token on Thai. A Thai text of 6,000 bytes costs about how many tokens?
- 1,500
- 2,400
* 4,000
- 9,000
why: Tokens equal bytes divided by bytes per token, and 6,000 divided by 1.5 is 4,000, almost three times the 1,500 that English would cost.
q: A vocabulary has 128,000 units and the model width is 4,096. How many weights does the embedding table hold?
- 128,000
- 4 million
- 131 million
* About 524 million
why: The table has one row of width 4,096 per unit, and 128,000 times 4,096 is about 524 million.
q: Why is it a problem to change the tokeniser after pretraining?
- The pre-tokeniser needs retraining
* The embeddings are tied to the old vocabulary, so the new units have no trained rows
- The compression ratio becomes negative
- Merges cannot be recorded twice
why: Every token id maps to a learned embedding row, and a new vocabulary breaks that mapping.
:::

## Go further

The Sennrich paper introduced BPE for neural translation. The SentencePiece paper describes a tokeniser that works from raw text. Karpathy's minbpe repository implements BPE in about 100 lines. The Hugging Face tokenizers documentation covers the production library.
`,
          links: [
            { label: 'Neural Machine Translation of Rare Words with Subword Units (Sennrich et al., 2015)', url: 'https://arxiv.org/abs/1508.07909', kind: 'paper' },
            { label: 'SentencePiece (Kudo and Richardson, 2018)', url: 'https://arxiv.org/abs/1808.06226', kind: 'paper' },
            { label: 'minbpe', url: 'https://github.com/karpathy/minbpe', kind: 'repo' },
            { label: 'Hugging Face tokenizers documentation', url: 'https://huggingface.co/docs/tokenizers', kind: 'docs' },
            { label: 'tiktoken', url: 'https://github.com/openai/tiktoken', kind: 'repo' },
          ],
        },
        {
          slug: 'data-mixtures',
          title: 'Data mixtures and domain weights',
          summary: 'A pretraining corpus mixes sources with chosen weights, and the weights change what the model is good at.',
          minutes: 15,
          objectives: [
            'Compute the token share of each source from a mixture table.',
            'Explain why upsampling a small high-quality source helps and where it stops helping.',
            'Describe the DoReMi method for choosing domain weights.',
            'Design a small mixture experiment with a held-out evaluation per domain.',
          ],
          keyTerms: ['data mixture', 'domain weight', 'upsampling', 'DoReMi', 'held-out set', 'epoch'],
          body: `
## What this lesson covers

This lesson explains how a pretraining corpus is assembled from sources with weights. It covers the trade-offs in those weights, the method that learns them, and a procedure to test a mixture at small scale.

## Why it matters

Two models with the same architecture and the same token count can differ by 10 points on a code benchmark. The cause is usually the mixture. A team that tunes the mixture gets more quality per token than a team that adds weights. Mixture decisions also decide what the model knows about law, medicine, or a low-resource language.

## The idea with an example

Suppose you have four sources:

| Source | Available tokens | Weight | Tokens in a 1 T run | Epochs |
| --- | --- | --- | --- | --- |
| Web | 10 T | 0.70 | 700 B | 0.07 |
| Code | 500 B | 0.15 | 150 B | 0.3 |
| Books | 100 B | 0.10 | 100 B | 1.0 |
| Papers | 20 B | 0.05 | 50 B | 2.5 |

The weight is the fraction of training tokens drawn from each source. Multiply the weight by the run length to get the tokens per source. Divide by the available tokens to get the epochs. The papers source repeats 2.5 times, which is safe. The web source uses only 7 percent of its supply, so you can filter it hard and keep the best part.

The bars compare the epochs each source runs in the 1 trillion token run.

:::bars
title: Epochs per source in the 1 trillion token run
unit: epochs
Web: 0.07
Code: 0.3
Books: 1.0
Papers: 2.5
:::

Now change one weight. Raise code from 0.15 to 0.30 and lower web to 0.55. The model will likely improve on code benchmarks and lose a little on general knowledge. If you raise papers to 0.30, the papers source would repeat 15 times, and the lesson on data-constrained scaling says that is past the useful limit. The available supply caps how far you can upsample a small source.

Press Next to move weight between sources and watch the epoch counts.

:::scenario
title: Move weight from web to code in a 1 trillion token run
state: web=0.70, code=0.15, books=0.10, papers=0.05, code epochs=0.3
step: Raise the code weight to 0.30 and lower the web weight to 0.55.
state: web=0.55, code=0.30, code epochs=0.6
step: Code now supplies 300 billion tokens, which is 0.6 epochs of the 500 billion available.
step: Expect better code benchmarks and a small loss on general knowledge.
state: expected=code up and general knowledge down a little
step: Now try papers at 0.30 instead. That is 300 billion tokens from a 20 billion token source.
state: papers=0.30, papers epochs=15
step: Fifteen epochs is past the useful limit. Keep papers near 0.05.
state: papers=0.05, papers epochs=2.5
:::

## How it works

The mixture is a probability vector $w$ over domains. During training, each batch draws from domain $i$ with probability $w_i$. The expected loss is:

$$L(w) = \\sum_i w_i\\, L_i$$

$L_i$ is the loss on domain $i$. $w_i$ is the weight of domain $i$. This equation says that the mixture sets which losses the model works hardest to reduce. It does not say the domains are independent. Code data improves reasoning on other tasks, and web data improves code comments.

DoReMi learns the weights with a small proxy model:

1. Train a small reference model on a uniform mixture.
2. Train a second small model. At each step, raise the weight of domains where this model lags the reference by the most.
3. Average the weights over training. Use the average for the full-size run.

The method finds domains that are hard but learnable and gives them more weight. The authors reported that weights found with a 280 million weight proxy transferred to an 8 billion weight model.

The diagram shows how DoReMi turns two small runs into the weights for the full run.

:::flow
title: DoReMi learns domain weights with small models
Uniform mixture -> Reference model: train small
Reference model -> Proxy model: per-domain loss targets
Proxy model -> Weight update: raise lagging domains
Weight update -> Proxy model: next step
Weight update -> Average weights: over training
Average weights -> Full-size run: final mixture
:::

To test a mixture by hand:

1. Build a held-out evaluation set for each domain, at least 1 million tokens each.
2. Train a small model, about 100 million weights, on each candidate mixture for the same token count.
3. Record the loss per domain for each run.
4. Pick the mixture with the best trade-off for your target use.

Caution: the best mixture at 100 million weights is not always the best at 10 billion weights. Confirm the top two candidates at a larger scale before committing a big run.

The code below computes the tokens per source and the epochs for the mixture in the lesson, and flags any source that would repeat more than 4 times.

:::code
lang: python
sources = {
    "web":    {"available": 10e12,  "weight": 0.70},
    "code":   {"available": 500e9,  "weight": 0.15},
    "books":  {"available": 100e9,  "weight": 0.10},
    "papers": {"available": 20e9,   "weight": 0.05},
}
run_tokens = 1e12

def report(sources, run_tokens, limit=4):
    assert abs(sum(s["weight"] for s in sources.values()) - 1) < 1e-9
    for name, s in sources.items():
        tokens = s["weight"] * run_tokens
        epochs = tokens / s["available"]
        flag = "  TOO MANY EPOCHS" if epochs > limit else ""
        print(name, "tokens", round(tokens / 1e9), "B", "epochs", round(epochs, 2), flag)

report(sources, run_tokens)
print("--- papers raised to 0.30, web lowered to 0.45")
sources["papers"]["weight"], sources["web"]["weight"] = 0.30, 0.45
report(sources, run_tokens)
:::

The output is:

:::code
lang: text
web tokens 700 B epochs 0.07 
code tokens 150 B epochs 0.3 
books tokens 100 B epochs 1.0 
papers tokens 50 B epochs 2.5 
--- papers raised to 0.30, web lowered to 0.45
web tokens 450 B epochs 0.04 
code tokens 150 B epochs 0.3 
books tokens 100 B epochs 1.0 
papers tokens 300 B epochs 15.0   TOO MANY EPOCHS
:::

## Try it

:::exercise
title: Scale the run to 2 trillion tokens
task: Keep the four sources from the lesson with the weights web 0.55, code 0.30, books 0.10 and papers 0.05, and plan a 2 trillion token run. Compute the tokens and the epochs for each source. Find every source that passes 4 epochs and propose one change of weights that fixes it while the weights still sum to 1.
hint: Tokens per source equal weight times 2 trillion. Papers has only 20 billion tokens available.
lang: python
solution:
avail = {"web": 10e12, "code": 500e9, "books": 100e9, "papers": 20e9}
weights = {"web": 0.55, "code": 0.30, "books": 0.10, "papers": 0.05}
run = 2e12
for name in avail:
    tokens = weights[name] * run
    print(name, round(tokens / 1e9), "B", "epochs", round(tokens / avail[name], 2))
# web 0.11, code 1.2, books 2.0, papers 5.0 which is past the limit.
# One fix: papers 0.03 and web 0.57 gives papers 3 epochs.
:::

## Common mistakes

- Mistake: you set weights from available supply alone. Fix: weight by value per token, and cap by the epoch limit.
- Mistake: you evaluate one average loss. Fix: track loss per domain, or a gain in one domain can hide a loss in another.
- Mistake: you test mixtures with different token counts. Fix: hold the total token budget fixed across candidates.
- Mistake: you move weights late in training without a plan. Fix: use a fixed schedule, such as an annealing phase with more high-quality data.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: data mixtures
q: A source has 50 billion tokens and weight 0.2 in a 1 trillion token run. How many epochs does it run?
- 0.4
- 2
* 4
- 10
why: The source supplies 200 billion tokens, and 200 billion divided by 50 billion is 4.
q: Which domains does DoReMi give more weight to?
- The largest domains
- The domains with the lowest loss
* The domains where the proxy model lags the reference model the most
- The domains with the most duplicates
why: DoReMi raises the weight of domains that are hard but learnable, which the gap to the reference reveals.
q: Why does a mixture test need a held-out set per domain?
- A single set is too small
* One average loss can hide a gain in one domain and a loss in another
- Domains have different tokenisers
- The proxy model cannot read mixed data
why: Mixture changes trade quality between domains, and only per-domain losses show the trade.
q: You raise the weight of a 20 billion token source to 0.30 in a 1 trillion token run. What is the main problem?
- The source is too small to matter
* The source would repeat 15 times, far past the useful epoch limit
- The web weight becomes negative
- The embedding table grows
why: Weight 0.30 means 300 billion tokens drawn from 20 billion available, which is 15 epochs.
q: A team compares two mixtures at different total token counts. Why is the comparison invalid?
- Different tokenisers were used
* More tokens lower loss on their own, so the mixture effect cannot be separated from the budget effect
- Mixtures only matter above 1 trillion tokens
- DoReMi requires equal weights
why: Holding the total budget fixed is the only way to attribute a loss difference to the weights.
:::

## Go further

The DoReMi paper gives the weighting algorithm and the transfer results. The Pile paper describes the first widely used public mixture with its weights. The Llama 3 report explains the annealing phase with upsampled high-quality data. The Dolma paper documents a fully open corpus and its mixture decisions.
`,
          links: [
            { label: 'DoReMi: Optimizing Data Mixtures (Xie et al., 2023)', url: 'https://arxiv.org/abs/2305.10429', kind: 'paper' },
            { label: 'The Pile: An 800GB Dataset of Diverse Text (Gao et al., 2020)', url: 'https://arxiv.org/abs/2101.00027', kind: 'paper' },
            { label: 'The Llama 3 Herd of Models (2024)', url: 'https://arxiv.org/abs/2407.21783', kind: 'paper' },
            { label: 'Dolma: An Open Corpus of Three Trillion Tokens (Soldaini et al., 2024)', url: 'https://arxiv.org/abs/2402.00159', kind: 'paper' },
          ],
        },
        {
          slug: 'deduplication',
          title: 'Deduplication with MinHash',
          summary: 'Duplicate documents waste compute and cause memorisation, and MinHash finds near-duplicates at web scale.',
          minutes: 15,
          objectives: [
            'Compute the Jaccard similarity of two small documents.',
            'Explain how MinHash estimates Jaccard similarity with a few numbers per document.',
            'Describe why exact and near-duplicate removal need different tools.',
            'Set a similarity threshold for a corpus and explain the trade-off.',
          ],
          keyTerms: ['deduplication', 'Jaccard similarity', 'MinHash', 'shingle', 'near-duplicate', 'memorisation'],
          body: `
## What this lesson covers

This lesson explains why duplicate documents hurt a language model and how to remove them. It covers exact matching, Jaccard similarity, and MinHash. You will compute a similarity by hand and see how MinHash makes the computation cheap.

## Why it matters

Web crawls are full of copies. Boilerplate, mirrored pages, and syndicated articles appear thousands of times. The Lee study found that removing duplicates lets a model reach the same loss in fewer steps and cuts memorised output by ten times. Duplicates between training and test sets also inflate benchmark scores. Deduplication is the first filter in every modern pipeline.

## The idea with an example

Take two short documents:

- Document A: "the cat sat on the mat"
- Document B: "the cat sat on a mat"

Split each into shingles, overlapping runs of three words. Document A has the shingles "the cat sat", "cat sat on", "sat on the", and "on the mat". Document B has "the cat sat", "cat sat on", "sat on a", and "on a mat". The two sets share 2 shingles. The union has 6 distinct shingles. The Jaccard similarity is $2 / 6 \\approx 0.33$.

Press Next to compute the similarity shingle by shingle.

:::scenario
title: Jaccard similarity of two six-word documents
state: A=the cat sat on the mat, B=the cat sat on a mat
step: Split A into shingles of three words.
state: shingles A=the cat sat | cat sat on | sat on the | on the mat
step: Split B the same way.
state: shingles B=the cat sat | cat sat on | sat on a | on a mat
step: Count the shared shingles. Two shingles appear in both sets.
state: shared=2
step: Count the distinct shingles across both sets. There are six.
state: union=6
step: Divide. The Jaccard similarity is 2 over 6, about 0.33.
state: Jaccard=0.33
:::

Exact matching finds only identical documents. It uses a hash of the full text and a lookup table. It misses Document B because one word differs. Near-duplicate detection needs the Jaccard measure, but comparing every pair of 1 billion documents is impossible.

MinHash fixes this. Take a hash function and apply it to every shingle in a document. Keep only the minimum hash value. Two documents have the same minimum with probability equal to their Jaccard similarity. Repeat with 100 different hash functions. The fraction of matching minimums estimates the similarity. Each document now carries 100 numbers, its signature, instead of thousands of shingles.

## How it works

The Jaccard similarity is:

$$J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}$$

$A$ and $B$ are the shingle sets. $|A \\cap B|$ is the number of shared shingles. $|A \\cup B|$ is the number of distinct shingles across both. The key property of MinHash is:

$$P\\big[\\min h(A) = \\min h(B)\\big] = J(A, B)$$

$h$ is a random hash function. $\\min h(A)$ is the smallest hash over the shingles of $A$.

The full procedure for a corpus:

1. Normalise the text: lowercase, remove punctuation, collapse spaces.
2. Remove exact duplicates with a hash of the full text.
3. Split each document into shingles of 5 words, or 13 for long documents.
4. Compute a MinHash signature of 100 to 200 values per document.
5. Group the signature into bands. Put documents with an identical band into one bucket.
6. Compare documents in the same bucket. Mark pairs above the threshold as duplicates.
7. Keep one document per group of duplicates.

Step 5 is locality-sensitive hashing. It keeps the number of comparisons small. With 20 bands of 5 values each, pairs with similarity 0.8 land in a shared bucket with high probability, and pairs with similarity 0.3 almost never do.

The diagram shows the full pipeline from raw documents to one kept copy.

:::flow
title: Deduplication pipeline for one corpus
Raw documents -> Normalise: lowercase, strip
Normalise -> Exact hash: full text
Exact hash -> Shingles: 5-word runs
Shingles -> MinHash: 100 values
MinHash -> Bands: 20 bands of 5
Bands -> Buckets: identical band
Buckets -> Compare pairs: estimate Jaccard
Compare pairs -> Keep one: above threshold
:::

The bars compare the chance that a pair shares a bucket at four similarity levels.

:::bars
title: Chance that a pair shares a bucket with 20 bands of 5 values
unit: probability
Jaccard 0.3: 0.05
Jaccard 0.5: 0.47
Jaccard 0.7: 0.97
Jaccard 0.9: 1.0
:::

The threshold is a trade-off. A threshold of 0.9 removes mirrored pages and keeps paraphrases. A threshold of 0.5 removes more templated text and some useful variants. Most pipelines use 0.7 to 0.85.

The table lists the effect of three thresholds.

| Threshold | Removes | Keeps | Use |
| --- | --- | --- | --- |
| 0.9 | mirrored pages | paraphrases and templated text | conservative |
| 0.7 to 0.85 | mirrors and most templates | most paraphrases | most pipelines |
| 0.5 | templates and some useful variants | little near-duplicate text | aggressive |

Note: the Lee study also removed repeated substrings of 50 tokens across documents with a suffix array. That catches licence text and headers that MinHash misses.

The code below computes the Jaccard similarity of the two documents from the lesson, then estimates it with 100 MinHash values.

:::code
lang: python
import hashlib

def shingles(text, k=3):
    words = text.lower().split()
    return {" ".join(words[i : i + k]) for i in range(len(words) - k + 1)}

def jaccard(a, b):
    return len(a & b) / len(a | b)

def h(s, seed):
    return int(hashlib.md5(f"{seed}:{s}".encode()).hexdigest(), 16)

def minhash(shingle_set, n=100):
    return [min(h(s, seed) for s in shingle_set) for seed in range(n)]

def estimate(sig_a, sig_b):
    return sum(x == y for x, y in zip(sig_a, sig_b)) / len(sig_a)

A = shingles("the cat sat on the mat")
B = shingles("the cat sat on a mat")
print("shingles A", sorted(A))
print("shingles B", sorted(B))
print("exact Jaccard", round(jaccard(A, B), 3))
print("MinHash estimate", estimate(minhash(A), minhash(B)))
:::

The output is:

:::code
lang: text
shingles A ['cat sat on', 'on the mat', 'sat on the', 'the cat sat']
shingles B ['cat sat on', 'on a mat', 'sat on a', 'the cat sat']
exact Jaccard 0.333
MinHash estimate 0.33
:::

## Try it

:::exercise
title: Shorter shingles, higher similarity
task: Repeat the lesson's computation for Document A, the cat sat on the mat, and Document B, the cat sat on a mat, with shingles of 2 words instead of 3. Write out both shingle sets, count the shared and the distinct shingles, and compute the Jaccard similarity by hand. Then check it with the code from the lesson and explain in one sentence why the similarity rose.
hint: Document A has 5 two-word shingles and Document B has 5. Three of them appear in both.
lang: python
solution:
def shingles(text, k):
    w = text.split()
    return {" ".join(w[i:i + k]) for i in range(len(w) - k + 1)}

A = shingles("the cat sat on the mat", 2)
B = shingles("the cat sat on a mat", 2)
print(sorted(A))            # the cat, cat sat, sat on, on the, the mat
print(sorted(B))            # the cat, cat sat, sat on, on a, a mat
print(len(A & B), len(A | B), round(len(A & B) / len(A | B), 2))   # 3 7 0.43
# Shorter shingles are less specific, so one changed word breaks fewer of them.
:::

## Common mistakes

- Mistake: you only remove exact duplicates. Fix: add MinHash for near-duplicates.
- Mistake: you deduplicate within each source but not across sources. Fix: run one pass over the whole corpus.
- Mistake: you forget to deduplicate against evaluation sets. Fix: remove training documents that overlap benchmark test sets.
- Mistake: you use short shingles on long documents. Fix: longer shingles reduce false matches.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: deduplication
q: Two documents share 4 shingles and have 10 distinct shingles in total. What is their Jaccard similarity?
- 0.25
* 0.4
- 0.6
- 2.5
why: Jaccard is the size of the intersection over the size of the union, and 4 over 10 is 0.4.
q: What does one MinHash value tell you about two documents?
- Their exact Jaccard similarity
* Whether they share the smallest hash, which happens with probability equal to their similarity
- Whether they are exact copies
- The number of shared words
why: One hash function gives one coin flip whose chance of a match equals the Jaccard similarity, and 100 flips give an estimate.
q: Why group the signature values into bands?
- To make the signature shorter
- To compress the documents
* To compare only pairs that land in a shared bucket instead of every pair
- To remove exact duplicates
why: Locality-sensitive hashing uses bands so that similar pairs collide in a bucket and dissimilar pairs almost never do.
q: Two documents have Jaccard similarity 0.5. With 20 bands of 5 values, about how likely are they to share at least one bucket?
- 0.05
* About 0.47
- 0.97
- 1.0
why: The chance that one band of 5 values matches is 0.5 to the power 5, about 0.03, and the chance that at least one of 20 bands matches is about 0.47.
q: Which duplicates does exact hashing miss?
- Mirrored pages with identical text
* Pages that differ by one word
- Pages in a different source
- Pages shorter than 50 words
why: A full-text hash changes if any character changes, so near-duplicates need MinHash.
:::

## Go further

The Lee paper measures the effect of deduplication on loss and memorisation. The RefinedWeb paper describes a web pipeline built around deduplication. The datasketch repository implements MinHash and locality-sensitive hashing in Python. The FineWeb paper reports the surprising result that global deduplication can remove too much.
`,
          links: [
            { label: 'Deduplicating Training Data Makes Language Models Better (Lee et al., 2021)', url: 'https://arxiv.org/abs/2107.06499', kind: 'paper' },
            { label: 'The RefinedWeb Dataset for Falcon LLM (Penedo et al., 2023)', url: 'https://arxiv.org/abs/2306.01116', kind: 'paper' },
            { label: 'datasketch', url: 'https://github.com/ekzhu/datasketch', kind: 'repo' },
            { label: 'The FineWeb Datasets (2024)', url: 'https://arxiv.org/abs/2406.17557', kind: 'paper' },
          ],
        },
        {
          slug: 'curriculum',
          title: 'Quality filtering and curriculum',
          summary: 'Filters pick the tokens worth training on, and the order of data across a run changes the final model.',
          minutes: 14,
          objectives: [
            'Describe a classifier-based quality filter and how to train it.',
            'Explain the annealing phase and why it uses high-quality data.',
            'Compare a fixed mixture with a curriculum on a small experiment.',
            'Choose a context length schedule for a long-context model.',
          ],
          keyTerms: ['quality filter', 'curriculum', 'annealing', 'perplexity', 'context length', 'classifier'],
          body: `
## What this lesson covers

This lesson covers two decisions after deduplication. The first is quality filtering, the step that scores each document and drops the worst. The second is curriculum, the order in which the model sees data over a run. You will see how an annealing phase at the end of training raises benchmark scores.

## Why it matters

A trillion raw web tokens contain a large fraction of spam, navigation text, and broken markup. A good filter removes most of it and keeps the tokens that teach. Teams that report large gains from "better data" usually mean a better filter. Curriculum is newer. A short phase of high-quality data at the end of a run is now standard practice.

:::video
id: 7xTGNNLPyMI
why: Watch the first 20 minutes, which walk through the FineWeb pipeline from raw crawl to filtered text. Match each stage to the rule and classifier filters in this lesson.
:::

## The idea with an example

Take a 100 billion token run. Compare two plans:

| Plan | Tokens 0 to 90 B | Tokens 90 B to 100 B |
| --- | --- | --- |
| Fixed | Web mixture | Web mixture |
| Annealed | Web mixture | 50 percent web, 50 percent curated |

The curated set holds textbooks, high-quality code, and reasoning data. In the annealed plan the learning rate also decays to near zero over the final 10 billion tokens. The Llama 3 team used this pattern and reported gains of several points on reasoning benchmarks. The model is most sensitive to data during the decay, so the data it sees then leaves a strong mark.

The timing diagram shows the data, the learning rate, and the context length across the annealed run.

:::timeline
title: The annealed plan over a 100 billion token run
unit: B tokens
lane Data
lane Learning rate
lane Context
Data: web mixture @0-90
Data: 50 percent curated @90-100
Learning rate: warmup @0-2
Learning rate: high and slow decay @2-90
Learning rate: decay to near zero @90-100
Context: 8000 tokens @0-95
Context: 128000 tokens @95-100
:::

Quality filtering happens earlier, before the run starts. A simple filter uses rules: drop documents with fewer than 50 words, drop documents where more than 30 percent of lines end without punctuation, and drop documents with a high ratio of symbols to words. A stronger filter trains a classifier. Take 100,000 documents from a trusted source, such as reference articles, as positives. Take 100,000 random web documents as negatives. Train a fast linear model on word features. Score every document in the corpus and keep the top 20 to 40 percent.

Press Next to build the classifier filter step by step.

:::scenario
title: Build a classifier filter for a web corpus
state: positives=0, negatives=0, classifier=none, corpus kept=100 percent
step: Collect 100,000 documents from a trusted reference source as positives.
state: positives=100000
step: Sample 100,000 random web documents as negatives.
state: negatives=100000
step: Train a fast linear model on word features.
state: classifier=trained
step: Score every document in the corpus and sort by score.
state: corpus=scored
step: Keep the top 30 percent. Check that enough tokens remain for the run.
state: corpus kept=30 percent
step: Train two small models, one on the filtered corpus and one on the raw corpus, and compare the losses.
state: check=two small runs
:::

## How it works

A filter assigns each document a score and a decision:

$$\\text{keep}(d) = \\mathbf{1}\\big[s(d) > \\tau\\big]$$

$d$ is a document. $s(d)$ is the score from rules or a classifier. $\\tau$ is a threshold. $\\mathbf{1}$ is the indicator function, which is 1 when the condition holds and 0 otherwise.

To build and test a classifier filter:

1. Collect positive examples from a trusted source and negatives from the raw corpus.
2. Train a fast classifier on word or character features.
3. Score the corpus and pick a threshold that keeps the token count you need.
4. Train two small models, one on filtered data and one on unfiltered data, for the same token count.
5. Compare loss on held-out sets and benchmark scores.

A curriculum changes the data distribution over time. Three curricula are common:

- Annealing: shift to high-quality data during the learning rate decay.
- Context length: train on short sequences first, then extend to long sequences in the last few percent of the run.
- Difficulty: start with simple text and add harder domains such as mathematics later.

The context length schedule saves compute. Attention cost grows with the square of the sequence length. Training 95 percent of the run at 8,000 tokens and 5 percent at 128,000 tokens costs much less than the full run at 128,000 tokens, and the long-context quality is close.

The bars compare the attention compute per token for three schedules, relative to a run at 8,000 tokens.

:::bars
title: Relative attention compute per token for three schedules
unit: x
All steps at 8,000 tokens: 1
95 percent at 8,000 and 5 percent at 128,000: 1.75
All steps at 128,000 tokens: 16
:::

Caution: a filter trained on one source teaches the model that source's style. Check that the filtered corpus still covers the domains you need.

The code below applies the three rule filters from the lesson to a few documents and reports which ones survive.

:::code
lang: python
docs = {
    "article": "The mitochondrion is the part of the cell that produces energy. " * 12,
    "nav": "Home | About | Contact | Login | Cart",
    "symbols": "@@@ ### $$$ %%% ^^^ &&& *** ((( ))) +++ === ~~~ ||| " * 5,
    "list": (chr(10).join(["item one", "item two", "item three", "item four", "item five"]) + chr(10)) * 10,
}

def keep(text):
    words = text.split()
    if len(words) < 50:
        return False, "fewer than 50 words"
    symbols = sum(1 for w in words if not any(c.isalnum() for c in w))
    if symbols / len(words) > 0.1:
        return False, "too many symbols"
    lines = [l for l in text.splitlines() if l.strip()]
    no_punct = sum(1 for l in lines if l.strip()[-1] not in ".!?")
    if no_punct / len(lines) > 0.3:
        return False, "too many lines without punctuation"
    return True, "kept"

for name, text in docs.items():
    ok, reason = keep(text)
    print(name, "->", reason)
:::

The output is:

:::code
lang: text
article -> kept
nav -> fewer than 50 words
symbols -> too many symbols
list -> too many lines without punctuation
:::

## Try it

:::exercise
title: Pick a threshold that keeps enough tokens
task: A classifier scored a 1 trillion token corpus. The score bands hold these token counts: scores above 0.9 hold 50 billion, 0.8 to 0.9 hold 150 billion, 0.7 to 0.8 hold 200 billion, 0.6 to 0.7 hold 200 billion, and below 0.6 hold 400 billion. Your run needs 300 billion tokens at no more than 1 epoch. Find the highest threshold that supplies enough tokens. Then say what changes if you allow 4 epochs.
hint: Add the bands from the top down until the sum reaches 300 billion. With 4 epochs you only need 75 billion unique tokens.
lang: python
solution:
bands = [(0.9, 50e9), (0.8, 150e9), (0.7, 200e9), (0.6, 200e9), (0.0, 400e9)]
for need in [300e9, 75e9]:
    total = 0
    for threshold, tokens in bands:
        total += tokens
        if total >= need:
            print("need", need / 1e9, "B  threshold", threshold, "supplies", total / 1e9, "B")
            break
# 1 epoch: threshold 0.7 gives 400 B. 4 epochs: threshold 0.8 gives 200 B, so the filter can be stricter.
:::

## Common mistakes

- Mistake: you set the threshold to keep only the top 5 percent. Fix: check that enough tokens remain for the run, and relax the threshold if not.
- Mistake: you anneal on data the evaluation set overlaps with. Fix: deduplicate the curated set against every benchmark first.
- Mistake: you extend context length at the start of training. Fix: extend it at the end, after the model learns short-range structure.
- Mistake: you judge a filter by eye. Fix: train two small models and compare them.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: filtering and curriculum
q: When does the annealing phase happen?
- During the warmup at the start of the run
* During the learning rate decay at the end of the run
- Halfway through the run
- After training, during evaluation
why: The model is most sensitive to data while the learning rate decays, so the curated data goes there.
q: What do you need to train a classifier filter?
- A reward model
* Positive examples from a trusted source and random negatives from the raw corpus
- A deduplicated test set
- The full training run
why: The classifier learns to tell trusted text from typical web text, and then scores every document.
q: A run trains 95 percent of its steps at 8,000 tokens and 5 percent at 128,000 tokens. Relative to a run entirely at 8,000 tokens, what is its attention compute per token?
- 1.05 times
* 1.75 times
- 8 times
- 16 times
why: Attention cost grows with the square of the length, so the long phase costs 16 times per token, and 0.95 plus 0.05 times 16 is 1.75.
q: Why train on short sequences first and extend the context at the end?
- Long sequences need a different tokeniser
* Attention cost grows with the square of the length, and short-range structure is learned first
- Long sequences cannot be shuffled
- The learning rate must be zero for long sequences
why: Most of the run at short length is cheap, and a short long-context phase at the end recovers most of the quality.
q: A filter keeps only the top 5 percent of a 1 trillion token corpus for a 400 billion token run. What is the problem?
- The classifier is too slow
* Only 50 billion tokens remain, so the run would repeat them 8 times
- The positives are too clean
- The annealing phase becomes too long
why: Five percent of 1 trillion is 50 billion tokens, and 400 billion over 50 billion is 8 epochs, past the useful limit.
:::

## Go further

The FineWeb paper describes rule filters and a classifier filter with ablations for each step. The Phi paper shows what a strongly filtered corpus achieves. The Llama 3 report documents the annealing phase and the context length schedule. The RefinedWeb paper gives a full pipeline from crawl to corpus.
`,
          links: [
            { label: 'The FineWeb Datasets (2024)', url: 'https://arxiv.org/abs/2406.17557', kind: 'paper' },
            { label: 'Textbooks Are All You Need (Gunasekar et al., 2023)', url: 'https://arxiv.org/abs/2306.11644', kind: 'paper' },
            { label: 'The Llama 3 Herd of Models (2024)', url: 'https://arxiv.org/abs/2407.21783', kind: 'paper' },
            { label: 'The RefinedWeb Dataset for Falcon LLM (Penedo et al., 2023)', url: 'https://arxiv.org/abs/2306.01116', kind: 'paper' },
            { label: 'Hugging Face datasets documentation', url: 'https://huggingface.co/docs/datasets', kind: 'docs' },
          ],
        },
      ],
    },
    {
      slug: 'architectures-beyond',
      title: 'Architectures beyond the dense transformer',
      description: 'Mixture of experts, state space models, and the methods that make long context work.',
      level: 'advanced',
      lessons: [
        {
          slug: 'mixture-of-experts',
          title: 'Mixture of experts',
          summary: 'A sparse model keeps many feed-forward experts but runs only a few per token, so weights grow faster than compute.',
          minutes: 17,
          objectives: [
            'Compute active and total weights for a mixture of experts (MoE) layer.',
            'Trace one token through a top-2 router by hand.',
            'Explain why a load-balancing loss is needed.',
            'State the memory and serving costs that MoE does not reduce.',
          ],
          keyTerms: ['mixture of experts', 'expert', 'router', 'top-k gating', 'load balancing', 'active weights', 'feed-forward network'],
          body: `
## What this lesson covers

This lesson explains the mixture of experts (MoE) layer. An MoE layer replaces one feed-forward network with several, called experts, and a router that picks a few experts per token. You will trace a token through the router and count the weights.

## Why it matters

Mixtral, DeepSeek-V3, and several frontier models use MoE. The design lets a model hold hundreds of billions of weights while spending the compute of a much smaller model per token. The cost moves from compute to memory. If you serve or train these models, you need to understand where that cost went.

## The idea with an example

Take a dense transformer block with width $d = 4$ and a feed-forward network with hidden width 16. The feed-forward network has $4 \\times 16 + 16 \\times 4 = 128$ weights. Replace it with 8 experts of the same shape. The layer now has $8 \\times 128 = 1{,}024$ weights.

A router decides which experts a token uses. The router is a small matrix of shape $4 \\times 8$. It maps the token vector to 8 scores. Suppose a token produces the scores:

| Expert | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Score | 0.1 | 2.0 | 0.3 | 1.5 | 0.0 | 0.2 | 0.4 | 0.1 |

With top-2 gating, the router keeps experts 2 and 4. It applies softmax to their two scores: $e^{2.0} / (e^{2.0} + e^{1.5}) \\approx 0.62$ and $0.38$. The token goes through expert 2 and expert 4 only. The output is $0.62 \\times \\text{expert}_2(x) + 0.38 \\times \\text{expert}_4(x)$.

Count the cost. The token used $2 \\times 128 = 256$ expert weights plus the 32 router weights. The layer holds 1,024 weights. The active weights are about a quarter of the total. Compute per token grew by two times compared with the dense block, but capacity grew by eight times.

Press Next to follow the token through the router and the two chosen experts.

:::scenario
title: One token through a top-2 router with 8 experts
state: token=4 numbers, scores=none, chosen=none
step: Multiply the token by the 4 by 8 router matrix to get 8 scores.
state: scores=0.1 2.0 0.3 1.5 0.0 0.2 0.4 0.1
step: Keep the two highest scores. Experts 2 and 4 win.
state: chosen=expert 2 (2.0) and expert 4 (1.5)
step: Apply softmax to the two kept scores only.
state: gates=0.62 and 0.38
step: Run the token through expert 2 and expert 4. Skip the other six.
state: active weights=256 of 1024
step: Add the two outputs with the gate weights.
state: output=0.62 x expert 2 + 0.38 x expert 4
:::

## How it works

The MoE layer computes:

$$y = \\sum_{i \\in \\mathrm{TopK}(g(x))} \\frac{e^{g_i(x)}}{\\sum_{j \\in \\mathrm{TopK}} e^{g_j(x)}}\\, E_i(x)$$

$x$ is the token vector. $g(x) = x W_g$ is the router output, one score per expert. $\\mathrm{TopK}$ selects the $k$ highest scores. $E_i$ is expert $i$, a feed-forward network. $y$ is the layer output.

The diagram shows the path of one token through the layer.

:::flow
title: Path of one token through an MoE layer
Token x -> Router: 4 by 8 matrix
Router -> Top-2 select: 8 scores
Top-2 select -> Expert 2: gate 0.62
Top-2 select -> Expert 4: gate 0.38
Expert 2 -> Weighted sum: output
Expert 4 -> Weighted sum: output
Weighted sum -> Next sublayer: y
:::

Routing creates a balance problem. If the router sends most tokens to expert 2, that expert learns and the others do not. The router then sends even more tokens to expert 2. A load-balancing loss prevents this:

$$\\mathcal{L}_{\\text{bal}} = \\alpha\\, N \\sum_{i=1}^{N} f_i\\, P_i$$

$N$ is the number of experts. $f_i$ is the fraction of tokens routed to expert $i$. $P_i$ is the mean router probability for expert $i$. $\\alpha$ is a small weight, often 0.01. The loss is lowest when every expert receives the same share.

To size an MoE model:

1. Choose the number of experts $N$ and the number of active experts $k$.
2. Compute the total weights: attention weights plus $N$ times the expert size per layer.
3. Compute the active weights: attention weights plus $k$ times the expert size per layer.
4. Use the active weights for compute estimates and the total weights for memory.

Mixtral 8x7B has 47 billion total weights and 13 billion active weights per token. It runs at the speed of a 13 billion weight model and needs the memory of a 47 billion weight model.

The bars compare the total and active weights of Mixtral with a dense model of the same speed.

:::bars
title: Total and active weights
unit: billion
Mixtral 8x7B total: 47
Mixtral 8x7B active per token: 13
Dense 13B total: 13
:::

Caution: during serving, every expert must sit in GPU memory, because any token might call it. MoE cuts compute per token, not memory per token.

The code below runs the top-2 router on the 8 scores from the lesson and counts the active weights.

:::code
lang: python
import math

scores = [0.1, 2.0, 0.3, 1.5, 0.0, 0.2, 0.4, 0.1]
d, hidden, n_experts, k = 4, 16, 8, 2

def top_k_gates(scores, k):
    chosen = sorted(range(len(scores)), key=lambda i: -scores[i])[:k]
    es = [math.exp(scores[i]) for i in chosen]
    gates = [e / sum(es) for e in es]
    return list(zip(chosen, gates))

for expert, gate in top_k_gates(scores, k):
    print("expert", expert + 1, "gate", round(gate, 2))

expert_weights = d * hidden + hidden * d
router_weights = d * n_experts
total = n_experts * expert_weights + router_weights
active = k * expert_weights + router_weights
print("total weights", total, "active weights", active, "fraction", round(active / total, 2))
:::

The output is:

:::code
lang: text
expert 2 gate 0.62
expert 4 gate 0.38
total weights 1056 active weights 288 fraction 0.27
:::

## Try it

:::exercise
title: Top-3 routing and Mixtral's weights
task: Use the 8 router scores from the lesson and switch to top-3 gating. Name the three chosen experts, compute their gate values to 2 decimals, and count the active weights out of the 1,056 total. Then size Mixtral 8x7B: 32 layers, width 4,096, expert hidden width 14,336, 3 matrices per expert, 8 experts, top-2 routing, 46.7 billion total weights. Compute the weights per expert across all layers, the shared weights, and the active weights per token. Explain in one sentence why the active count is not simply total over 4.
hint: The third highest score is 0.4 for expert 7. One expert across 32 layers holds 32 times 3 times 4,096 times 14,336 weights. Attention and embeddings are shared, so they count in both totals.
lang: python
solution:
import math

scores = [0.1, 2.0, 0.3, 1.5, 0.0, 0.2, 0.4, 0.1]
chosen = sorted(range(8), key=lambda i: -scores[i])[:3]
es = [math.exp(scores[i]) for i in chosen]
print([(i + 1, round(e / sum(es), 2)) for i, e in zip(chosen, es)])   # (2, 0.55) (4, 0.34) (7, 0.11)
print("active", 3 * 128 + 32, "of", 8 * 128 + 32)                     # 416 of 1056

per_expert = 32 * 3 * 4096 * 14336
shared = 46.7e9 - 8 * per_expert
active = shared + 2 * per_expert
print(round(per_expert / 1e9, 2), "B per expert")   # 5.64
print(round(shared / 1e9, 1), "B shared")           # 1.6
print(round(active / 1e9, 1), "B active")           # 12.9, the reported 13 B
# The shared attention and embedding weights run for every token, so active is more than a quarter of total.
:::

## Common mistakes

- Mistake: you quote total weights as a proxy for cost. Fix: report both total and active weights.
- Mistake: you train with no balancing loss. Fix: add it, and track the token share per expert.
- Mistake: you place all experts on one device. Fix: use expert parallelism to spread experts across devices.
- Mistake: you set $k$ equal to $N$. Fix: that is a dense model with extra routing cost.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: mixture of experts
q: A layer has 16 experts and top-2 routing. What fraction of the expert weights does one token use?
- One half
- One quarter
* One eighth
- One sixteenth
why: Each token runs 2 of the 16 experts, and 2 over 16 is one eighth.
q: The router keeps scores 2.0 and 1.5 for the two chosen experts. What gate does the first expert get, to 2 decimals?
- 0.50
- 0.57
* 0.62
- 0.88
why: The softmax over the two kept scores gives e to the 2.0 over the sum of e to the 2.0 and e to the 1.5, which is 0.62.
q: What does the load-balancing loss reward?
- Sending every token to the best expert
* An equal share of tokens across experts
- A smaller router matrix
- Fewer active experts per token
why: Without it the busiest expert keeps winning, and the loss is lowest when every expert receives the same share.
q: Which cost does a mixture of experts not reduce?
- Compute per token
* Memory, because every expert must sit in GPU memory
- Router cost
- Training tokens
why: Any token might call any expert, so all experts stay loaded even though only a few run.
q: A team sets the number of active experts equal to the number of experts. What have they built?
- A faster sparse model
* A dense model with extra routing cost
- A model with no feed-forward network
- A model with a larger KV cache
why: If every expert runs on every token, the layer is a wide dense feed-forward network plus a router that does nothing useful.
:::

## Go further

The Shazeer paper introduced sparse gating with the balancing loss. The Switch Transformer paper simplified routing to top-1 and scaled it. The Mixtral paper reports a modern open MoE with its design choices. The Hugging Face blog post on MoE is a clear overview with diagrams.
`,
          links: [
            { label: 'Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer (Shazeer et al., 2017)', url: 'https://arxiv.org/abs/1701.06538', kind: 'paper' },
            { label: 'Switch Transformers (Fedus et al., 2021)', url: 'https://arxiv.org/abs/2101.03961', kind: 'paper' },
            { label: 'Mixtral of Experts (Jiang et al., 2024)', url: 'https://arxiv.org/abs/2401.04088', kind: 'paper' },
            { label: 'Mixture of Experts Explained (Hugging Face)', url: 'https://huggingface.co/blog/moe', kind: 'article' },
          ],
        },
        {
          slug: 'state-space-models',
          title: 'State space models and Mamba',
          summary: 'A state space model updates a fixed-size state at each token, so it costs constant memory per step.',
          minutes: 18,
          objectives: [
            'Run a scalar state space recurrence by hand for a 4-token sequence.',
            'Explain why a linear recurrence can run as a convolution in training.',
            'Describe the selection mechanism that Mamba adds.',
            'Compare the inference cost of a state space model and a transformer.',
          ],
          keyTerms: ['state space model', 'Mamba', 'recurrence', 'hidden state', 'selective scan', 'KV cache', 'linear time'],
          body: `
## What this lesson covers

This lesson explains state space models (SSMs), a family of sequence layers with a fixed-size state. It covers the basic recurrence, the trick that trains it in parallel, and the selection mechanism from Mamba. You will run a tiny recurrence by hand and compare the costs with attention.

## Why it matters

Attention stores a key and a value for every past token. At 1 million tokens of context, that cache is tens of gigabytes. A state space model stores one state vector of fixed size, no matter how long the input is. Mamba matched transformers on language modelling at small scale with linear cost in sequence length. Hybrid models now mix both layer types.

## The idea with an example

A state space model keeps a state $h_t$ and updates it at each step:

$$h_t = a\\, h_{t-1} + b\\, x_t, \\qquad y_t = c\\, h_t$$

Set $a = 0.5$, $b = 1$, $c = 1$, and $h_0 = 0$. Feed the sequence $x = [1, 0, 0, 2]$:

| Step $t$ | $x_t$ | $h_t = 0.5 h_{t-1} + x_t$ | $y_t$ |
| --- | --- | --- | --- |
| 1 | 1 | 0.5 × 0 + 1 = 1.0 | 1.0 |
| 2 | 0 | 0.5 × 1.0 + 0 = 0.5 | 0.5 |
| 3 | 0 | 0.5 × 0.5 + 0 = 0.25 | 0.25 |
| 4 | 2 | 0.5 × 0.25 + 2 = 2.125 | 2.125 |

The state remembers the input from step 1 with a weight that halves each step. The output at step 4 contains $0.125$ from step 1 plus $2$ from step 4. This is a weighted sum over the past with weights $a^{t-s}$. Because the weights only depend on the distance $t - s$, the whole output is a convolution of the input with the kernel $[1, 0.5, 0.25, 0.125]$. A convolution runs in parallel on a GPU. So the model trains as a convolution and runs as a recurrence.

Press Next to run the recurrence one token at a time.

:::scenario
title: Scalar state space recurrence with a equal to 0.5
state: h=0, x=1 0 0 2, t=0
step: Read x1 equal to 1. Halve the state and add the input.
state: h=1.0, y=1.0, t=1
step: Read x2 equal to 0. Halve the state. Nothing is added.
state: h=0.5, y=0.5, t=2
step: Read x3 equal to 0. Halve the state again.
state: h=0.25, y=0.25, t=3
step: Read x4 equal to 2. Halve the state and add 2.
state: h=2.125, y=2.125, t=4
step: The input from step 1 survives with weight 0.125, which is 0.5 to the power 3.
state: weight of x1=0.125
:::

The grid shows the weight of each input s in each output t, which is the convolution kernel written as a matrix.

:::matrix
title: Weight of input s in output t, the convolution kernel
cols: s=1, s=2, s=3, s=4
t=1: 1, 0, 0, 0
t=2: 0.5, 1, 0, 0
t=3: 0.25, 0.5, 1, 0
t=4: 0.125, 0.25, 0.5, 1
:::

The constant $a$ is the weakness. The model forgets every input at the same rate. It cannot choose to remember the word "not" longer than the word "the". Mamba fixes this by letting $a$, $b$, and $c$ depend on the current input. The model now decides at each token how much to keep and how much to write. This is the selection mechanism.

## How it works

The general discrete state space layer is:

$$h_t = \\bar{A}\\, h_{t-1} + \\bar{B}\\, x_t, \\qquad y_t = C\\, h_t$$

$h_t$ is the state vector of size $N$. $x_t$ is the input at step $t$. $\\bar{A}$ is an $N \\times N$ matrix that decays the state. $\\bar{B}$ writes the input into the state. $C$ reads the output from the state. In S4 and Mamba, $\\bar{A}$ is diagonal, so the update is cheap.

Mamba computes $\\bar{B}$, $C$, and a step size $\\Delta$ from $x_t$ with small linear layers. The step size scales the decay: a large $\\Delta$ resets the state, and a small $\\Delta$ keeps it. Because the parameters change per token, the convolution trick no longer applies. Mamba uses a parallel scan instead, an algorithm that computes all $h_t$ in $O(T \\log T)$ parallel work with the recurrence kept in fast on-chip memory.

To compare costs for a sequence of $T$ tokens with state size $N$ and model width $d$:

| Cost | Attention | State space model |
| --- | --- | --- |
| Training compute | $O(T^2 d)$ | $O(T N d)$ |
| Inference memory per layer | $O(T d)$ | $O(N d)$ |
| Compute per generated token | $O(T d)$ | $O(N d)$ |

With $N = 16$ and $T = 100{,}000$, the state space model is thousands of times cheaper per generated token.

The bars compare the compute per generated token per layer in multiples of the width.

:::bars
title: Compute per generated token per layer in multiples of the width d
unit: x d
Attention at 100,000 tokens: 100000
State space model with N equal to 16: 16
:::

Note: fixed state size is also a limit. The model cannot recall an exact token from 50,000 steps ago unless the state kept it. Transformers do this with no effort. Hybrid models place one attention layer per several state space layers to get both.

The code below runs the scalar recurrence from the lesson, then computes the same outputs as a convolution with the kernel of powers of a, and checks that they match.

:::code
lang: python
def recurrence(x, a=0.5, b=1.0, c=1.0):
    h, ys = 0.0, []
    for xt in x:
        h = a * h + b * xt
        ys.append(c * h)
    return ys

def convolution(x, a=0.5, b=1.0, c=1.0):
    kernel = [c * b * a ** i for i in range(len(x))]
    return [sum(kernel[t - s] * x[s] for s in range(t + 1)) for t in range(len(x))]

x = [1, 0, 0, 2]
print("recurrence ", recurrence(x))
print("convolution", convolution(x))
print("kernel", [0.5 ** i for i in range(4)])

T, N, d = 100000, 16, 4096
print("attention per token", T * d, "SSM per token", N * d, "ratio", T // N)
:::

The output is:

:::code
lang: text
recurrence  [1.0, 0.5, 0.25, 2.125]
convolution [1.0, 0.5, 0.25, 2.125]
kernel [1.0, 0.5, 0.25, 0.125]
attention per token 409600000 SSM per token 65536 ratio 6250
:::

## Try it

:::exercise
title: A slower forgetting rate
task: Run the recurrence from the lesson on x = [1, 0, 0, 2] with a equal to 0.9 instead of 0.5. Fill in the four states by hand. Then write the convolution kernel for a equal to 0.9 and say what weight the input from step 1 has in the output at step 4. Explain in one sentence why Mamba lets a change per token.
hint: Each step multiplies the old state by 0.9 and adds the input. The weight of input s in output t is 0.9 to the power t minus s.
lang: python
solution:
h, a = 0.0, 0.9
for xt in [1, 0, 0, 2]:
    h = a * h + xt
    print(round(h, 3))        # 1.0, 0.9, 0.81, 2.729
print([round(a ** i, 3) for i in range(4)])   # 1.0, 0.9, 0.81, 0.729
# Input 1 has weight 0.729 at step 4. A fixed a forgets every input at the same rate,
# so Mamba computes a, b and c from the current token and can keep some inputs longer.
:::

## Common mistakes

- Mistake: you expect a state space model to copy a long random string. Fix: use a hybrid with attention for exact recall.
- Mistake: you train the selective model with a plain convolution. Fix: the parameters vary per token, so use the scan.
- Mistake: you compare models at different training token counts. Fix: match the token budget and the weight count.
- Mistake: you ignore hardware. Fix: the scan needs a fused kernel to be fast.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: state space models
q: In the lesson example with a equal to 0.5, what weight does the input from step 1 have in the output at step 4?
- 0.5
- 0.25
* 0.125
- 0.0625
why: The weight is a to the power of the distance, and 0.5 to the power 3 is 0.125.
q: Why can a state space model with fixed a, b and c train as a convolution?
- The state is always zero
* The weights depend only on the distance between positions, so the output is a fixed kernel applied to the input
- The sequence is short
- The GPU converts recurrences automatically
why: A weighted sum over the past with weights that depend only on t minus s is by definition a convolution.
q: Which parts does Mamba make depend on the current input?
- The state size N
* The write matrix, the read matrix and the step size
- The sequence length
- The vocabulary
why: Selection lets the model decide per token how much to keep and how much to write, which a fixed a cannot do.
q: A state space layer has state size 16 and the model width is 4,096. A transformer layer at 100,000 tokens stores a cache of 100,000 times the width. By what factor is the state space layer cheaper per generated token?
- 16
- 100
* About 6,250
- 100,000
why: The attention cost is proportional to 100,000 and the state space cost to 16, and 100,000 over 16 is 6,250.
q: What task does a pure state space model do worse than a transformer?
- Predicting the next word in a sentence
* Copying an exact long random string from far back in the context
- Running on a GPU
- Training in parallel
why: A fixed-size state cannot hold every past token, while attention can look up any past token directly.
:::

## Go further

The Mamba paper introduces selection and the hardware-aware scan. The S4 paper gives the structured state space foundation. The Mamba-2 paper connects state space models to a form of linear attention. The Annotated S4 walks through the mathematics with code. The Mamba repository has the reference implementation.
`,
          links: [
            { label: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces (Gu and Dao, 2023)', url: 'https://arxiv.org/abs/2312.00752', kind: 'paper' },
            { label: 'Efficiently Modeling Long Sequences with Structured State Spaces (Gu et al., 2021)', url: 'https://arxiv.org/abs/2111.00396', kind: 'paper' },
            { label: 'Transformers are SSMs: Mamba-2 (Dao and Gu, 2024)', url: 'https://arxiv.org/abs/2405.21060', kind: 'paper' },
            { label: 'The Annotated S4', url: 'https://srush.github.io/annotated-s4/', kind: 'article' },
            { label: 'Mamba repository', url: 'https://github.com/state-spaces/mamba', kind: 'repo' },
          ],
        },
        {
          slug: 'long-context',
          title: 'Long context: cost, extension, and evaluation',
          summary: 'Long context needs a cheaper attention kernel, a position extension, and a test that measures real recall.',
          minutes: 16,
          objectives: [
            'Compute the KV cache size for a given context length and model.',
            'Explain how flash attention removes the full score matrix from memory.',
            'Describe ring attention and how it spreads a sequence across devices.',
            'Design a needle-in-a-haystack test and state its limits.',
          ],
          keyTerms: ['context length', 'KV cache', 'flash attention', 'ring attention', 'needle in a haystack', 'lost in the middle', 'RoPE'],
          body: `
## What this lesson covers

This lesson covers the three problems of long context. The first is memory and compute for attention over many tokens. The second is the position encoding, which must extend past the training length. The third is evaluation, because a model can accept a long input and still fail to use it.

## Why it matters

Models now accept 128,000 to 1 million tokens. Users put whole codebases and books in one prompt. The cost of serving those prompts and the quality of answers about the middle of the prompt are open research problems. A team that ships long context without the right test ships a model that forgets the middle.

## The idea with an example

Take a model with 32 layers, 8 key-value heads, head width 128, and 16-bit numbers. Each token stores one key and one value per layer per head. The size per token is:

$$2 \\times 32 \\times 8 \\times 128 \\times 2\\ \\text{bytes} = 131{,}072\\ \\text{bytes}$$

That is 128 kilobytes per token. A 128,000 token prompt needs 16 gigabytes of KV cache for one request. The weights of an 8 billion weight model in 16-bit take another 16 gigabytes. One long request fills a 40 gigabyte GPU.

Press Next to size the cache for the request step by step.

:::scenario
title: Size the KV cache for one 128,000 token request
state: layers=32, KV heads=8, head width=128, bytes per number=2
step: Multiply the KV heads by the head width. One key per layer holds 1,024 numbers.
state: numbers per key=1024
step: Double it for the value. One layer stores 2,048 numbers per token.
state: numbers per layer=2048
step: Multiply by 32 layers. One token stores 65,536 numbers.
state: numbers per token=65536
step: Multiply by 2 bytes. One token costs 131,072 bytes, which is 128 kilobytes.
state: bytes per token=131072
step: Multiply by 128,000 tokens. The request needs about 16 gigabytes.
state: cache for request=16 GB
:::

The bars compare the cache with the weights and the GPU capacity.

:::bars
title: Memory for one 128,000 token request on an 8 billion weight model
unit: GB
KV cache: 16
Weights in 16-bit: 16
GPU capacity: 40
:::

Now the score matrix. Naive attention writes all $T \\times T$ scores to memory before softmax. At $T = 128{,}000$, one head has 16 billion scores. Flash attention never writes this matrix. It processes keys in blocks of a few hundred, keeps a running maximum and a running sum for the softmax, and updates the output block by block. The memory for scores drops from $O(T^2)$ to $O(T)$, and the compute stays the same but runs faster because it stays on-chip.

For sequences longer than one device can hold, ring attention splits the sequence across devices. Each device holds one block of queries and passes its keys and values around a ring. After a full rotation, every query has seen every key.

The diagram shows the key and value blocks moving around a ring of four devices.

:::flow
title: Ring attention over four devices
Device 1 -> Device 2: K and V block 1
Device 2 -> Device 3: K and V block 2
Device 3 -> Device 4: K and V block 3
Device 4 -> Device 1: K and V block 4
:::

## How it works

The online softmax that flash attention uses keeps three values per query row: the running maximum $m$, the running sum $\\ell$, and the running output $o$. For each new block of scores $s$:

1. Compute the new maximum $m' = \\max(m, \\max s)$.
2. Rescale the old sum and output by $e^{m - m'}$.
3. Add $\\sum e^{s - m'}$ to the sum and $\\sum e^{s - m'} v$ to the output.
4. Set $m = m'$.
5. After the last block, divide the output by the sum.

The result equals full softmax attention to within rounding error.

The timing diagram shows how flash attention loads one key block at a time and updates the running values on-chip.

:::timeline
title: Flash attention processes keys in blocks for one query row
unit: blocks
lane GPU memory
lane On-chip
GPU memory -> On-chip: load Q and K block 1 @0-0.3
On-chip: scores, running max, running sum @0.3-1
GPU memory -> On-chip: load K block 2 @1-1.3
On-chip: rescale and update @1.3-2
GPU memory -> On-chip: load K block 3 @2-2.3
On-chip: rescale and update @2.3-3
On-chip -> GPU memory: write final output row @3-3.3
:::

Extension of the position encoding uses the methods from the positional encoding lesson. Scale the RoPE frequencies, then fine-tune on a small set of long documents. Llama 3 extended from 8,000 to 128,000 tokens in six stages at the end of pretraining.

To evaluate long context:

1. Build a long document of filler text.
2. Insert one fact, the needle, at a chosen depth.
3. Ask a question that the needle answers.
4. Repeat for many depths and lengths. Plot accuracy as a grid.

The needle test is necessary but weak. A model can pass it and still fail to combine two facts from different places. Stronger tests ask for multiple needles, for counting, or for reasoning over the whole input. The lost-in-the-middle study found that models use facts at the start and the end of a prompt more than facts in the middle.

The table compares three long-context tests.

| Test | Measures | Limit |
| --- | --- | --- |
| Needle in a haystack | recall of one fact at one depth and length | a model can pass with no reasoning |
| Multiple needles | recall of several facts at once | no reasoning across the facts |
| Whole-input reasoning | counting or combining facts across the input | expensive to build and to run |

Caution: a model with a 128,000 token window and a 4,000 token training length for most of its run has seen few long examples. Check the recall grid before you trust it.

The code below sizes the KV cache for the model from the lesson, then runs the online softmax over three blocks of scores and checks it against the full softmax.

:::code
lang: python
import math

def kv_bytes_per_token(layers, kv_heads, head_dim, bytes_per_number=2):
    return 2 * layers * kv_heads * head_dim * bytes_per_number

per_token = kv_bytes_per_token(32, 8, 128)
print("bytes per token", per_token, "=", per_token // 1024, "KB")
print("cache for 128k tokens", round(per_token * 128000 / 2**30, 1), "GB")

scores = [1.0, 3.0, 0.5, 2.0, 2.5, 1.5]
values = [1, 2, 3, 4, 5, 6]
m, l, o = -math.inf, 0.0, 0.0
for start in range(0, len(scores), 2):
    s, v = scores[start : start + 2], values[start : start + 2]
    m_new = max(m, max(s))
    scale = math.exp(m - m_new)
    l = l * scale + sum(math.exp(x - m_new) for x in s)
    o = o * scale + sum(math.exp(x - m_new) * vv for x, vv in zip(s, v))
    m = m_new
print("online softmax output", round(o / l, 4))
es = [math.exp(x) for x in scores]
print("full softmax output  ", round(sum(e * v for e, v in zip(es, values)) / sum(es), 4))
:::

The output is:

:::code
lang: text
bytes per token 131072 = 128 KB
cache for 128k tokens 15.6 GB
online softmax output 3.4057
full softmax output   3.4057
:::

## Try it

:::exercise
title: Size the cache for Llama 3 70B
task: Llama 3 70B has 80 layers, 8 key-value heads and head width 128, stored in 16-bit numbers. Compute the KV cache bytes per token and the cache for one 128,000 token request in gigabytes. Then compute how many such requests fit next to the 140 gigabytes of weights on a server with 640 gigabytes of GPU memory.
hint: Bytes per token equal 2 times layers times key-value heads times head width times 2 bytes. Divide the free memory by the cache per request.
lang: python
solution:
per_token = 2 * 80 * 8 * 128 * 2
cache = per_token * 128000
print("bytes per token", per_token)                      # 327680, which is 320 KB
print("GB per request", round(cache / 2**30, 1))        # 39.1
free = 640 - 140
print("requests that fit", int(free // (cache / 2**30)))   # 12
:::

## Common mistakes

- Mistake: you size the cache by weights alone. Fix: compute bytes per token times the context length.
- Mistake: you run naive attention at long length and run out of memory. Fix: use a flash attention kernel.
- Mistake: you test only at the end of the prompt. Fix: test every depth and look for the dip in the middle.
- Mistake: you extend context with no fine-tune. Fix: fine-tune on long documents after scaling the positions.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: long context
q: A model stores 64 kilobytes of cache per token. About how much cache does a 100,000 token prompt need?
- 640 megabytes
* 6.4 gigabytes
- 64 gigabytes
- 640 gigabytes
why: 64 kilobytes times 100,000 tokens is 6.4 billion bytes, about 6.4 gigabytes.
q: What does flash attention avoid writing to GPU memory?
- The query vectors
- The value vectors
* The full T by T score matrix
- The KV cache
why: It processes keys in blocks with a running maximum and sum, so the scores never leave on-chip memory.
q: Which three running values does the online softmax keep per query row?
- The mean, the variance and the output
* The running maximum, the running sum and the running output
- The first key, the last key and the output
- The block size, the step size and the output
why: Each new block rescales the old sum and output by the change in the maximum, then adds its own terms.
q: What did the lost-in-the-middle study show?
- Models cannot read past 4,000 tokens
* Models use facts in the middle of a long prompt less than facts at the start and the end
- Models forget the start of a prompt first
- Models ignore the end of a prompt
why: Accuracy dips when the needle sits in the middle, which is why a long-context test must cover every depth.
q: Why is a single needle-in-a-haystack pass a weak test?
- It is too expensive
* A model can recall one fact without any reasoning across the input
- It only tests the first 1,000 tokens
- It requires a fine-tune
why: The test checks recall of one planted fact, so a model can pass it and still fail to combine facts.
:::

## Go further

The flash attention paper describes the blocked kernel and the online softmax. The ring attention paper extends the idea across devices. The lost-in-the-middle paper is the key evaluation result. The YaRN paper covers the position extension. The Llama 3 report describes a full long-context training schedule.
`,
          links: [
            { label: 'FlashAttention (Dao et al., 2022)', url: 'https://arxiv.org/abs/2205.14135', kind: 'paper' },
            { label: 'Ring Attention with Blockwise Transformers (Liu et al., 2023)', url: 'https://arxiv.org/abs/2310.01889', kind: 'paper' },
            { label: 'Lost in the Middle (Liu et al., 2023)', url: 'https://arxiv.org/abs/2307.03172', kind: 'paper' },
            { label: 'YaRN: Efficient context window extension', url: 'https://arxiv.org/abs/2309.00071', kind: 'paper' },
            { label: 'The Llama 3 Herd of Models (2024)', url: 'https://arxiv.org/abs/2407.21783', kind: 'paper' },
          ],
        },
      ],
    },
    {
      slug: 'reasoning',
      title: 'Reasoning models',
      description: 'Chain of thought, process rewards, reinforcement learning on verifiable tasks, and spending compute at test time.',
      level: 'advanced',
      lessons: [
        {
          slug: 'chain-of-thought',
          title: 'Chain of thought and self-consistency',
          summary: 'A model that writes its steps before its answer solves more problems, and voting over several chains helps more.',
          minutes: 15,
          objectives: [
            'Explain why intermediate tokens increase the compute a model spends on a problem.',
            'Write a chain-of-thought prompt for a word problem.',
            'Compute a majority vote over sampled chains.',
            'State where chain of thought fails to help.',
          ],
          keyTerms: ['chain of thought', 'self-consistency', 'majority vote', 'in-context learning', 'temperature', 'reasoning trace'],
          body: `
## What this lesson covers

This lesson explains chain of thought, the practice of asking a model to write its reasoning steps before its final answer. It covers the zero-shot form, the few-shot form, and self-consistency, which samples several chains and votes. You will work one problem both ways.

## Why it matters

Chain of thought was the first method that let language models solve multi-step arithmetic and logic. It is also the base of every reasoning model. Models such as OpenAI o1 and DeepSeek-R1 are trained to produce long chains. The lessons that follow build on the idea in this one.

:::video
id: 7xTGNNLPyMI
why: Use the chapter list and watch the chapter on models needing tokens to think, about 10 minutes. It explains why each generated token adds compute, which is the mechanism behind chain of thought.
:::

## The idea with an example

Take the problem: "A shop has 23 apples. It uses 20 for lunch and buys 6 more. How many apples does it have?"

A direct prompt asks for the answer alone. A small model often outputs 29 or 3, because it must do two steps in one token. A chain-of-thought prompt adds "Let's think step by step" or shows a worked example first. The model writes: "The shop starts with 23 apples. After lunch it has 23 minus 20, which is 3. It buys 6 more, so it has 3 plus 6, which is 9. The answer is 9."

Each step is a short computation. Each generated token gives the model one more forward pass of compute. The chain turns one hard prediction into several easy ones.

Press Next to follow the apple problem through the chain.

:::scenario
title: The apple problem with a chain of thought
state: apples=23, stage=start
step: The shop starts with 23 apples.
state: stage=read the problem
step: It uses 20 for lunch. Compute 23 minus 20.
state: apples=3, stage=subtract
step: It buys 6 more. Compute 3 plus 6.
state: apples=9, stage=add
step: Write the final answer in the fixed format. The answer is 9.
state: answer=9, stage=done
:::

Self-consistency samples several chains with a temperature above zero. Suppose you sample five chains and get the answers 9, 9, 3, 9, and 29. The majority answer is 9 with 3 votes. A single chain is right about 60 percent of the time on this kind of problem. The vote over five chains is right more often, because errors in different chains tend to disagree with each other and the correct answer tends to repeat.

The bars compare the votes for each answer.

:::bars
title: Votes over five sampled chains
unit: votes
Answer 9: 3
Answer 3: 1
Answer 29: 1
:::

## How it works

A chain of thought changes the probability the model computes. Without a chain, the model estimates $P(\\text{answer} \\mid \\text{question})$ in one step. With a chain, it estimates:

$$P(\\text{answer} \\mid \\text{question}) = \\sum_{\\text{chain}} P(\\text{answer} \\mid \\text{chain}, \\text{question})\\, P(\\text{chain} \\mid \\text{question})$$

The sum runs over all possible chains. Each term is easier for the model than the direct estimate. Sampling one chain takes one term. Self-consistency approximates the sum with several samples and a vote.

To apply self-consistency:

1. Write a prompt with a few worked examples, each with steps and a final answer in a fixed format.
2. Sample $n$ chains with temperature between 0.5 and 0.8.
3. Extract the final answer from each chain with a regular expression.
4. Return the answer with the most votes.

The diagram shows three sampled chains and the vote.

:::flow
title: Self-consistency with sampled chains
Prompt -> Sampler: temperature 0.7
Sampler -> Chain 1: sample
Sampler -> Chain 2: sample
Sampler -> Chain 3: sample
Chain 1 -> Extract answer: 9
Chain 2 -> Extract answer: 9
Chain 3 -> Extract answer: 3
Extract answer -> Majority vote: 9 9 3
Majority vote -> Final answer: 9
:::

The number of samples trades cost for accuracy. Gains flatten after 10 to 40 samples on most benchmarks.

The table compares the three methods on the apple problem type.

| Method | Generated tokens per question | Accuracy |
| --- | --- | --- |
| Direct answer | a few | lowest |
| One chain | about 50 | about 60 percent |
| Five chains with a vote | about 250 | above 60 percent |

Chain of thought helps on tasks with a clear sequence of steps: arithmetic, symbolic logic, and multi-hop questions. It helps little on tasks that need a fact the model does not know, or on tasks that a single lookup solves. Small models below a few billion weights often produce chains with fluent but wrong steps, and the chain hurts.

Note: a chain is not a transcript of the computation inside the model. The chain can give one reason while the model used another. Treat it as a tool, not an explanation.

The code below extracts the final answer from five sampled chains and returns the majority vote, as self-consistency does.

:::code
lang: python
from collections import Counter

chains = [
    "23 minus 20 is 3. 3 plus 6 is 9. The answer is 9.",
    "Start with 23. Use 20, leaving 3. Buy 6, giving 9. The answer is 9.",
    "23 minus 20 is 3. The answer is 3.",
    "23 - 20 + 6 = 9. The answer is 9.",
    "23 plus 6 is 29. The answer is 29.",
]

def extract_answer(chain):
    marker = "The answer is "
    tail = chain[chain.rfind(marker) + len(marker):]
    return tail.strip().rstrip(".")

answers = [extract_answer(c) for c in chains]
votes = Counter(answers)
print("answers", answers)
print("votes", dict(votes))
print("self-consistency returns", votes.most_common(1)[0][0])
:::

The output is:

:::code
lang: text
answers ['9', '9', '3', '9', '29']
votes {'9': 3, '3': 1, '29': 1}
self-consistency returns 9
:::

## Try it

:::exercise
title: When does the vote beat one chain?
task: A single chain answers the apple problem correctly with probability 0.6, and each wrong chain gives a random wrong answer that rarely repeats. Compute the probability that a majority vote over 5 chains returns the right answer, which happens when at least 3 of the 5 chains are correct. Then compute it for 3 chains and for 9 chains. Say in one sentence why the gains flatten.
hint: Use the binomial formula. For 5 chains, add the probabilities of exactly 3, 4 and 5 correct chains.
lang: python
solution:
from math import comb

def vote_accuracy(n, p=0.6):
    need = n // 2 + 1
    return sum(comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(need, n + 1))

for n in [1, 3, 5, 9, 41]:
    print(n, "chains", round(vote_accuracy(n), 3))
# 1: 0.6, 3: 0.648, 5: 0.683, 9: 0.733, 41: 0.90. Each extra chain adds less than the one before.
:::

## Common mistakes

- Mistake: you vote over chains sampled at temperature zero. Fix: raise the temperature, or all chains are identical.
- Mistake: you vote over the full chain text. Fix: vote over the extracted final answer.
- Mistake: you use chain of thought for a one-fact question. Fix: it adds cost and no accuracy.
- Mistake: you trust the chain as the model's true reasoning. Fix: test the answer, not the story.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: chain of thought
q: Why does a chain of thought help a model with arithmetic?
- It makes the model larger
* Each step is one easy prediction, and each generated token adds a forward pass of compute
- It removes the need for a tokeniser
- It lowers the temperature
why: The chain turns one hard prediction into several easy ones, and the model spends compute on every token it writes.
q: Five chains answer 7, 7, 8, 7, 2. What does self-consistency return?
- 2
* 7
- 8
- The average, 6.2
why: Self-consistency votes over the extracted final answers, and 7 has three of the five votes.
q: Which temperature setting breaks self-consistency?
* Zero, because every chain is identical
- 0.5
- 0.7
- 1.0
why: Voting needs different chains, and at temperature zero the sampler returns the same chain every time.
q: One chain costs about 50 generated tokens. A vote over 20 chains costs about how many tokens per question?
- 50
- 70
* 1,000
- 2,500
why: Twenty chains at 50 tokens each is 1,000 tokens, which is the price of the accuracy gain.
q: For which task does chain of thought add cost and no accuracy?
- A three-step word problem
- A multi-hop question
* A question that one fact lookup answers
- A symbolic logic puzzle
why: There are no intermediate steps to write, so the chain only adds tokens.
:::

## Go further

The chain-of-thought paper shows the few-shot method and the scale at which it starts to work. The zero-shot paper introduced the step-by-step instruction. The self-consistency paper gives the voting method and its gains. The GSM8K paper describes the grade-school mathematics benchmark used in all three.
`,
          links: [
            { label: 'Chain-of-Thought Prompting Elicits Reasoning (Wei et al., 2022)', url: 'https://arxiv.org/abs/2201.11903', kind: 'paper' },
            { label: 'Large Language Models are Zero-Shot Reasoners (Kojima et al., 2022)', url: 'https://arxiv.org/abs/2205.11916', kind: 'paper' },
            { label: 'Self-Consistency Improves Chain of Thought Reasoning (Wang et al., 2022)', url: 'https://arxiv.org/abs/2203.11171', kind: 'paper' },
            { label: 'Training Verifiers to Solve Math Word Problems (Cobbe et al., 2021)', url: 'https://arxiv.org/abs/2110.14168', kind: 'paper' },
          ],
        },
        {
          slug: 'process-reward-models',
          title: 'Outcome and process reward models',
          summary: 'An outcome reward scores the final answer, and a process reward scores each step, which gives better search and fewer lucky guesses.',
          minutes: 16,
          objectives: [
            'Distinguish an outcome reward model (ORM) from a process reward model (PRM).',
            'Score a 4-step solution with a process reward and combine the step scores.',
            'Describe how to label steps with human raters or with rollouts.',
            'Explain why best-of-n selection with a PRM beats majority vote.',
          ],
          keyTerms: ['outcome reward model', 'process reward model', 'verifier', 'best-of-n', 'step label', 'reward model'],
          body: `
## What this lesson covers

This lesson explains verifiers for reasoning. An outcome reward model (ORM) scores a whole solution by its final answer. A process reward model (PRM) scores each step. You will score a short solution with each and see how the scores pick the best of several samples.

## Why it matters

A model that samples 100 solutions needs a way to pick one. Majority vote works only when the correct answer repeats. A verifier can pick a correct answer that appears once. Process rewards also give a training signal for every step, which is what reinforcement learning on reasoning uses. The choice between outcome and process rewards is a live research question.

## The idea with an example

Take the problem "What is 15 percent of 240, plus 7?" and a 4-step solution:

1. "10 percent of 240 is 24."
2. "5 percent of 240 is 12."
3. "So 15 percent of 240 is 24 plus 12, which is 38."
4. "Adding 7 gives 45."

Step 3 contains an arithmetic error: 24 plus 12 is 36. An outcome reward model sees the final answer 45, compares it with the correct answer 43, and gives the solution a low score. It says nothing about where the error is.

A process reward model gives each step a probability of being correct:

| Step | PRM score |
| --- | --- |
| 1 | 0.98 |
| 2 | 0.97 |
| 3 | 0.05 |
| 4 | 0.90 |

The model marks step 3 as the failure. To get one score for the whole solution, take the product or the minimum of the step scores. The product is $0.98 \\times 0.97 \\times 0.05 \\times 0.90 \\approx 0.04$. The minimum is 0.05. Either way, the solution scores low, and the score points at the broken step.

Press Next to score the solution one step at a time.

:::scenario
title: Score the 4-step solution with a process reward model
state: step 1=unscored, step 2=unscored, step 3=unscored, step 4=unscored, solution score=none
step: Read the problem and step 1. The PRM gives 0.98.
state: step 1=0.98
step: Read up to step 2. The PRM gives 0.97.
state: step 2=0.97
step: Read up to step 3. The sum 24 plus 12 is written as 38. The PRM gives 0.05.
state: step 3=0.05
step: Read up to step 4. The addition from 38 is correct on its own. The PRM gives 0.90.
state: step 4=0.90
step: Multiply the four scores. The product is about 0.04. The minimum is 0.05.
state: solution score=0.04 (product) or 0.05 (minimum)
:::

The bars compare the step scores.

:::bars
title: PRM score per step
unit: probability
Step 1: 0.98
Step 2: 0.97
Step 3: 0.05 (24 plus 12 written as 38)
Step 4: 0.90
:::

Now sample 10 solutions and score each. Pick the one with the highest score. This is best-of-n selection. A solution with the right answer reached by a wrong step gets a low PRM score. A majority vote would accept it.

## How it works

Both reward models are classifiers on top of a language model. The ORM reads the problem and the full solution and outputs one probability. The PRM reads the problem and the solution up to step $k$ and outputs a probability for step $k$. The solution score is:

$$s(\\text{solution}) = \\prod_{k=1}^{K} p_k \\quad \\text{or} \\quad \\min_k p_k$$

$K$ is the number of steps. $p_k$ is the PRM probability that step $k$ is correct.

To train a PRM you need step labels. Two methods exist:

1. Human labels: raters mark each step as correct, incorrect, or neutral. The PRM800K dataset has 800,000 such labels.
2. Automatic labels: from each step, sample several continuations to the end. Label the step by the fraction of continuations that reach the correct final answer. Math-Shepherd introduced this method.

The automatic method needs only final answers, so it scales. The label measures whether the step keeps the solution on track, not whether the step is correct by itself.

To use a verifier at test time:

1. Sample $n$ solutions from the policy at a temperature above zero.
2. Score each solution with the verifier.
3. Return the solution with the best score, or group by final answer and sum scores per answer.

The second option, weighted voting, combines the verifier with the vote and often wins.

The diagram shows best-of-n selection over three sampled solutions.

:::flow
title: Best-of-n selection with a verifier
Problem -> Policy: sample n solutions
Policy -> Solution 1: answer 45
Policy -> Solution 2: answer 43
Policy -> Solution 3: answer 43
Solution 1 -> Verifier: score 0.04
Solution 2 -> Verifier: score 0.91
Solution 3 -> Verifier: score 0.12, wrong step
Verifier -> Best answer: pick solution 2
:::

Caution: a verifier is a reward model and can be hacked. If you train the policy against it, watch for solutions that score high and read wrong.

The code below scores the 4-step solution from the lesson with the product and the minimum rules, then runs best-of-n selection and weighted voting over three sampled solutions.

:::code
lang: python
from collections import defaultdict

solutions = [
    {"answer": 45, "steps": [0.98, 0.97, 0.05, 0.90]},
    {"answer": 43, "steps": [0.98, 0.97, 0.96, 0.98]},
    {"answer": 43, "steps": [0.90, 0.15, 0.95, 0.93]},
]

def product(xs):
    out = 1.0
    for x in xs:
        out *= x
    return out

for s in solutions:
    s["score"] = product(s["steps"])
    print("answer", s["answer"], "product", round(s["score"], 3), "min", min(s["steps"]))

best = max(solutions, key=lambda s: s["score"])
print("best-of-n picks answer", best["answer"])

weighted = defaultdict(float)
for s in solutions:
    weighted[s["answer"]] += s["score"]
print("weighted vote", {a: round(w, 3) for a, w in weighted.items()})
:::

The output is:

:::code
lang: text
answer 45 product 0.043 min 0.05
answer 43 product 0.894 min 0.96
answer 43 product 0.119 min 0.15
best-of-n picks answer 43
weighted vote {45: 0.043, 43: 1.014}
:::

## Try it

:::exercise
title: Label a step with rollouts
task: Use the Math-Shepherd method to label step 3 of the lesson's solution, the step that writes 24 plus 12 as 38. From that step you sample 8 continuations to a final answer. Six of them end at 45 and two end at 43, and the correct answer is 43. Compute the label for step 3. Then do the same for step 2, where 8 continuations give 7 answers of 43 and 1 of 45. Explain in one sentence why the step 3 label is not zero even though the step is wrong.
hint: The label is the fraction of rollouts that reach the correct final answer.
lang: python
solution:
def label(rollout_answers, correct):
    return sum(a == correct for a in rollout_answers) / len(rollout_answers)

step3 = [45] * 6 + [43] * 2
step2 = [43] * 7 + [45]
print("step 3 label", label(step3, 43))   # 0.25
print("step 2 label", label(step2, 43))   # 0.875
# Two rollouts recovered from the error later, so the label measures whether the
# solution can still reach the answer from here, not whether the step is correct.
:::

## Common mistakes

- Mistake: you train the PRM with only final-answer labels. Fix: label steps, by raters or by rollouts.
- Mistake: you average step scores. Fix: use the product or minimum, so one bad step sinks the solution.
- Mistake: you pick the best of 100 with an ORM and expect the answer to be sound. Fix: the ORM accepts lucky guesses; a PRM checks the path.
- Mistake: you sample at temperature zero. Fix: diversity is what best-of-n needs.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: outcome and process rewards
q: What does a process reward model output?
- One score for the final answer
* One probability per step
- A rewritten solution
- The number of steps
why: The PRM reads the solution up to step k and gives a probability that step k is correct.
q: A solution has step scores 0.9, 0.8, 0.5 and 1.0. What is its score under the product rule, and under the minimum rule?
- 0.8 and 0.5
* 0.36 and 0.5
- 0.36 and 0.8
- 0.5 and 0.36
why: The product of the four scores is 0.36, and the smallest score is 0.5.
q: Why can a PRM reject a solution whose final answer is correct?
- The PRM never sees the final answer
* A step along the way is wrong, so the answer was a lucky guess
- The PRM only scores the first step
- The answer is too long
why: The step scores catch a broken step even when a later error cancels it out.
q: How does Math-Shepherd label a step without human raters?
- It asks a larger model to grade the step
* It samples several continuations from the step and uses the fraction that reach the correct final answer
- It compares the step with the textbook
- It counts the tokens in the step
why: The label needs only final answers, which makes it cheap to scale.
q: Why does best-of-n with a verifier beat majority vote on hard problems?
- It needs fewer samples
* It can pick a correct answer that appears only once among many wrong ones
- It uses temperature zero
- It does not need a policy
why: Majority vote requires the correct answer to repeat, while a verifier can rank a single correct sample first.
:::

## Go further

The Let's Verify Step by Step paper compares ORMs and PRMs with human step labels. The Uesato paper gives the earlier comparison on GSM8K. The Math-Shepherd paper introduces automatic step labels. The original verifier paper trained the first ORM on grade-school mathematics.
`,
          links: [
            { label: "Let's Verify Step by Step (Lightman et al., 2023)", url: 'https://arxiv.org/abs/2305.20050', kind: 'paper' },
            { label: 'Solving math word problems with process- and outcome-based feedback (Uesato et al., 2022)', url: 'https://arxiv.org/abs/2211.14275', kind: 'paper' },
            { label: 'Math-Shepherd (Wang et al., 2023)', url: 'https://arxiv.org/abs/2312.08935', kind: 'paper' },
            { label: 'Training Verifiers to Solve Math Word Problems (Cobbe et al., 2021)', url: 'https://arxiv.org/abs/2110.14168', kind: 'paper' },
          ],
        },
        {
          slug: 'rl-verifiable-rewards',
          title: 'Reinforcement learning on verifiable rewards',
          summary: 'When a checker can grade the answer, the model can learn long reasoning from the grade alone, with no reward model.',
          minutes: 18,
          objectives: [
            'Define a verifiable reward and give three examples.',
            'Compute a group-relative advantage for a batch of sampled solutions.',
            'Explain why response length grows during training and what it means.',
            'Describe the DeepSeek-R1 recipe in order.',
          ],
          keyTerms: ['verifiable reward', 'GRPO', 'advantage', 'policy', 'KL divergence', 'reasoning trace', 'reward hacking'],
          body: `
## What this lesson covers

This lesson explains reinforcement learning with verifiable rewards (RLVR). A verifiable reward comes from a program that checks the answer: a unit test, an exact match, or a proof checker. It covers the group relative policy optimisation (GRPO) algorithm and the DeepSeek-R1 recipe. You will compute one advantage by hand.

## Why it matters

RLHF needs a reward model, and a reward model can be hacked. A checker cannot be hacked in the same way. A unit test either passes or fails. DeepSeek-R1 showed that a base model trained with checkers alone learns to write long chains, to check its own work, and to backtrack. This result changed how labs build reasoning models.

:::video
id: 7xTGNNLPyMI
why: Use the chapter list and watch the reinforcement learning chapter and the DeepSeek-R1 part that follows it, about 25 minutes. It shows the response length growing and the model learning to check its own work, which is step 1 of the recipe in this lesson.
:::

## The idea with an example

Take the problem "Find the smallest prime greater than 90." The checker is a function that returns 1 if the final answer is 97 and 0 otherwise. Sample 4 solutions from the policy:

| Sample | Final answer | Reward |
| --- | --- | --- |
| 1 | 91 | 0 |
| 2 | 97 | 1 |
| 3 | 93 | 0 |
| 4 | 97 | 1 |

GRPO compares each sample with the others in its group. The group mean reward is 0.5. The standard deviation is 0.5. The advantage of each sample is its reward minus the mean, divided by the standard deviation. Samples 2 and 4 get advantage $+1$. Samples 1 and 3 get advantage $-1$.

Press Next to compute the advantages by hand.

:::scenario
title: Group-relative advantage for four samples
state: rewards=0 1 0 1, mean=unknown, std=unknown
step: The checker grades each final answer. Only 97 scores 1.
step: Compute the group mean. The sum is 2 and the group size is 4.
state: mean=0.5
step: Compute the standard deviation. Every reward is 0.5 away from the mean.
state: std=0.5
step: Subtract the mean from each reward and divide by the standard deviation.
state: advantages=-1 +1 -1 +1
step: Raise the probability of every token in samples 2 and 4. Lower it for samples 1 and 3.
state: update=samples 2 and 4 up | samples 1 and 3 down
:::

The bars compare the advantage of each sample.

:::bars
title: Advantage per sample
unit: standard deviations
Sample 1, answer 91: -1
Sample 2, answer 97: 1
Sample 3, answer 93: -1
Sample 4, answer 97: 1
:::

The update raises the probability of every token in samples 2 and 4. It lowers the probability of every token in samples 1 and 3. The model learns whatever those correct samples did: perhaps they listed primes, perhaps they checked divisibility by 7. Over many problems, the useful behaviours survive and the useless ones fade.

Nothing in this loop needs a reward model or a human label. It needs problems with checkable answers.

## How it works

The GRPO advantage for sample $i$ in a group of $G$ samples is:

$$A_i = \\frac{r_i - \\mathrm{mean}(r_1, \\dots, r_G)}{\\mathrm{std}(r_1, \\dots, r_G)}$$

$r_i$ is the reward of sample $i$. The mean and standard deviation are over the group. The group replaces the value network that PPO uses, which saves a full model copy.

The objective is the PPO clipped objective with this advantage, plus a KL penalty to a reference model:

$$\\mathcal{L} = -\\mathbb{E}\\left[\\min\\big(\\rho_i A_i,\\ \\mathrm{clip}(\\rho_i, 1 - \\epsilon, 1 + \\epsilon) A_i\\big)\\right] + \\beta\\, \\mathrm{KL}(\\pi_\\theta \\,\\|\\, \\pi_{\\text{ref}})$$

$\\rho_i$ is the ratio of the new policy probability to the old policy probability for the sample. $\\epsilon$ is the clip range, often 0.2. $\\beta$ is the KL weight.

The DeepSeek-R1 recipe in order:

1. Start from the base model. Run GRPO on mathematics and code with checkers only. This is R1-Zero. The chains grow long and the model learns to reflect, but the text is hard to read.
2. Collect a few thousand clean long chains. Fine-tune the base model on them as a cold start.
3. Run GRPO again on verifiable tasks, with a small reward for a consistent language.
4. Sample a large set of solutions, filter by the checker, and fine-tune on them together with general data.
5. Run a final RLHF stage for helpfulness and safety.

The diagram shows the recipe from the base model to R1.

:::flow
title: The DeepSeek-R1 recipe
Base model -> R1-Zero: GRPO with checkers
R1-Zero -> Cold start data: a few thousand clean chains
Cold start data -> SFT model: fine-tune the base
SFT model -> GRPO stage 2: verifiable tasks
GRPO stage 2 -> Filtered samples: checker keeps correct
Filtered samples -> SFT stage 2: plus general data
SFT stage 2 -> RLHF stage: helpfulness and safety
RLHF stage -> R1: final model
:::

Response length grows during step 1. The model finds that more steps give more chances to check its work. The length curve is a useful signal: a sudden drop means the policy found a shortcut in the checker.

Caution: a checker with a hole becomes a reward to hack. A test suite that only checks one case teaches the model to print that case.

The code below grades four sampled answers with a checker and computes the group-relative advantages from the lesson.

:::code
lang: python
import math

def checker(answer):
    return 1.0 if answer == 97 else 0.0

def advantages(rewards):
    mean = sum(rewards) / len(rewards)
    var = sum((r - mean) ** 2 for r in rewards) / len(rewards)
    std = math.sqrt(var)
    if std == 0:
        return [0.0 for _ in rewards]
    return [(r - mean) / std for r in rewards]

samples = [91, 97, 93, 97]
rewards = [checker(a) for a in samples]
print("rewards", rewards)
print("advantages", [round(a, 2) for a in advantages(rewards)])

print("group of 8 with 3 correct:", [round(a, 2) for a in advantages([1, 1, 1, 0, 0, 0, 0, 0])])
print("group where all fail:", advantages([0, 0, 0, 0]))
:::

The output is:

:::code
lang: text
rewards [0.0, 1.0, 0.0, 1.0]
advantages [-1.0, 1.0, -1.0, 1.0]
group of 8 with 3 correct: [1.29, 1.29, 1.29, -0.77, -0.77, -0.77, -0.77, -0.77]
group where all fail: [0.0, 0.0, 0.0, 0.0]
:::

## Try it

:::exercise
title: Advantages for a group of 8
task: A group has 8 samples and 3 of them pass the checker. Compute the mean reward, the standard deviation, and the advantage of a correct sample and of a wrong sample by hand. Then say what happens to the advantages when all 8 samples fail, and why the lesson recommends problems with a pass rate between 20 and 80 percent.
hint: For rewards of 0 and 1, the variance is p times 1 minus p where p is the pass rate. The standard deviation is its square root.
lang: python
solution:
import math

p = 3 / 8
std = math.sqrt(p * (1 - p))
print("mean", p, "std", round(std, 3))                  # 0.375, 0.484
print("correct", round((1 - p) / std, 2))               # 1.29
print("wrong", round((0 - p) / std, 2))                 # -0.77
# If all 8 fail, every reward equals the mean, the standard deviation is 0,
# and every advantage is 0, so the group gives no learning signal.
:::

## Common mistakes

- Mistake: you use a checker that matches the answer as a string. Fix: normalise formats, or the model learns formats and not mathematics.
- Mistake: you set the group size to 2. Fix: use 8 to 64 samples so the mean and standard deviation are stable.
- Mistake: you remove the KL penalty for speed. Fix: keep a small penalty, or the model drifts into unreadable text.
- Mistake: you train only on problems the model already solves. Fix: pick problems with a pass rate between 20 and 80 percent, so the group has both outcomes.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: verifiable rewards
q: In a group of 4 samples, 1 is correct. What is the advantage of the correct sample?
- 0.25
- 1.0
* About 1.7
- 4.0
why: The mean is 0.25 and the standard deviation is about 0.43, so the advantage is 0.75 over 0.43, about 1.7.
q: What does GRPO remove compared with PPO?
- The KL penalty
- The policy
* The value network, replaced by the group mean
- The clip range
why: The group of samples provides the baseline that the value network would estimate, which saves a model copy.
q: Why does the response length grow during the first stage of the DeepSeek-R1 recipe?
- The KL penalty forces longer text
* Longer chains give the model more chances to check and correct its work, and the checker rewards that
- The tokeniser changes
- The learning rate grows
why: Nothing tells the model to write more; it discovers that reflection and backtracking raise its pass rate.
q: A checker compares the final answer to the string 97. The model learns to always write 97 in the required format and nothing else. What went wrong?
- The group size was too large
* The checker has a hole, so it became a reward to hack
- The KL penalty was too strong
- The problems were too hard
why: A checker that only matches one case teaches the model to print that case, which is reward hacking on a program.
q: Why avoid training only on problems the model already solves?
- They cost more tokens
* Every sample gets the same reward, so the advantages are all zero and there is no signal
- The checker cannot grade them
- The KL penalty becomes negative
why: GRPO learns from differences inside a group, and a group with all the same outcome has none.
:::

## Go further

The DeepSeek-R1 paper gives the full recipe and the R1-Zero result. The DeepSeekMath paper introduces GRPO. The STaR paper is the earlier idea of fine-tuning on self-generated correct chains. The OpenAI o1 post describes the first production reasoning model. The TRL documentation includes a GRPO trainer.
`,
          links: [
            { label: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (2025)', url: 'https://arxiv.org/abs/2501.12948', kind: 'paper' },
            { label: 'DeepSeekMath: Pushing the Limits of Mathematical Reasoning (2024)', url: 'https://arxiv.org/abs/2402.03300', kind: 'paper' },
            { label: 'STaR: Bootstrapping Reasoning With Reasoning (Zelikman et al., 2022)', url: 'https://arxiv.org/abs/2203.14465', kind: 'paper' },
            { label: 'Learning to reason with LLMs (OpenAI)', url: 'https://openai.com/index/learning-to-reason-with-llms/', kind: 'article' },
            { label: 'TRL documentation', url: 'https://huggingface.co/docs/trl', kind: 'docs' },
          ],
        },
        {
          slug: 'test-time-compute',
          title: 'Scaling test-time compute',
          summary: 'Spending more compute per question at inference can beat spending it on a bigger model, within limits.',
          minutes: 15,
          objectives: [
            'Compare three ways to spend inference compute on one question.',
            'Compute the coverage of a sampling budget from a per-sample pass rate.',
            'Explain when test-time compute beats a larger model and when it does not.',
            'Describe the budget-forcing method from the s1 paper.',
          ],
          keyTerms: ['test-time compute', 'best-of-n', 'coverage', 'tree search', 'budget forcing', 'compute-optimal'],
          body: `
## What this lesson covers

This lesson covers test-time compute, the compute a model spends on one question at inference time. It compares three methods: longer chains, parallel sampling with a verifier, and search over steps. You will compute how many samples a problem needs and see the trade-off against training a larger model.

## Why it matters

A trained model has a fixed quality per forward pass. Test-time methods raise that quality on demand. Reasoning models now expose a "thinking budget". Serving teams must price it, and research teams must decide whether a budget is better spent on training or on inference. The scaling curves in this lesson decide that.

## The idea with an example

Suppose a model solves a hard problem on 10 percent of single samples. Sample once and the chance of at least one correct answer is 0.10. Sample 10 times and the chance is $1 - 0.9^{10} \\approx 0.65$. Sample 100 times and it is $1 - 0.9^{100} \\approx 1.0$. This quantity is coverage. Coverage says a correct answer is in the set. It does not say you can find it.

Press Next to compute the coverage at each sample count.

:::scenario
title: Coverage for a problem with a 10 percent pass rate
state: pass rate=0.10, samples=1, coverage=0.10
step: One sample is correct with probability 0.10.
step: Sample 10 times. The chance that all 10 fail is 0.9 to the power 10, about 0.35.
state: samples=10, all fail=0.35
step: Subtract from 1. Coverage is 0.65.
state: coverage=0.65
step: Sample 100 times. The chance that all fail is 0.9 to the power 100, about 0.00003.
state: samples=100, all fail=0.00003
step: Coverage is close to 1.0. A correct answer is almost surely in the set, but you still need to find it.
state: coverage=1.0
:::

The bars compare the coverage at the three sample counts.

:::bars
title: Coverage by sample count at a 10 percent pass rate
unit: probability
1 sample: 0.10
10 samples: 0.65
100 samples: 1.0
:::

Three ways to use the samples:

| Method | Finds the answer when | Cost |
| --- | --- | --- |
| Majority vote | the correct answer is the most common | $n$ samples |
| Best-of-n with a verifier | the verifier ranks a correct sample first | $n$ samples plus $n$ verifier calls |
| Step search with a PRM | the PRM steers each step | fewer full samples, more partial ones |

For a problem at 10 percent pass rate, majority vote fails, because wrong answers outnumber the right one. A verifier can still pick the correct sample. For a problem at 70 percent pass rate, majority vote is enough and the verifier adds little.

A longer chain is the serial option. The model spends more tokens on one attempt instead of several attempts. The s1 paper forced longer chains by appending the word "Wait" when the model tried to stop. Accuracy rose with each extension, up to a limit.

## How it works

Coverage for $n$ independent samples with pass rate $p$ is:

$$c(n) = 1 - (1 - p)^{n}$$

$c(n)$ is the probability that at least one sample is correct. $p$ is the single-sample pass rate. The Large Language Monkeys study found that measured coverage follows this curve across several orders of magnitude of $n$.

The grid shows the coverage for three pass rates and four sample counts.

:::matrix
title: Coverage c(n) for pass rate p and sample count n
cols: n=1, n=10, n=100, n=1000
p=0.01: 0.01, 0.10, 0.63, 1.00
p=0.1: 0.10, 0.65, 1.00, 1.00
p=0.3: 0.30, 0.97, 1.00, 1.00
:::

To choose a test-time strategy for a given problem distribution:

1. Measure the single-sample pass rate on a sample of problems.
2. For easy problems with $p > 0.5$, use majority vote with a small $n$.
3. For medium problems, use best-of-n with a verifier.
4. For hard problems with $p < 0.1$, use step search or a longer chain, and accept a lower ceiling.
5. Record accuracy against compute for each method and keep the frontier.

The Snell study compared test-time compute with pretraining compute. For easy and medium problems, a small model with search matched a model 14 times larger. For the hardest problems, the larger model won, because no amount of sampling helps a model that cannot produce one correct step.

Budget forcing controls the serial chain. Set a maximum token count and cut the chain there. Set a minimum and append a continuation prompt until the chain reaches it. The s1 paper trained on 1,000 curated chains and used this control to trace a clean accuracy curve against thinking tokens.

Note: the cost of a long chain is paid in KV cache memory and latency, not only in FLOPs. A 30,000 token chain holds a 30,000 token cache for the whole request.

The code below computes coverage for several pass rates and sample counts, and finds the sample count that reaches a target coverage.

:::code
lang: python
import math

def coverage(p, n):
    return 1 - (1 - p) ** n

for p in [0.01, 0.1, 0.3]:
    print("p =", p, [round(coverage(p, n), 2) for n in [1, 10, 100, 1000]])

def samples_needed(p, target=0.95):
    return math.ceil(math.log(1 - target) / math.log(1 - p))

for p in [0.01, 0.1, 0.3]:
    print("p =", p, "samples for 95 percent coverage:", samples_needed(p))
:::

The output is:

:::code
lang: text
p = 0.01 [0.01, 0.1, 0.63, 1.0]
p = 0.1 [0.1, 0.65, 1.0, 1.0]
p = 0.3 [0.3, 0.97, 1.0, 1.0]
p = 0.01 samples for 95 percent coverage: 299
p = 0.1 samples for 95 percent coverage: 29
p = 0.3 samples for 95 percent coverage: 9
:::

## Try it

:::exercise
title: Budget the samples
task: A problem set has a single-sample pass rate of 0.1. Compute by hand how many samples you need for a coverage of 0.95, using the logarithm of 0.05 divided by the logarithm of 0.9. Then compute the coverage with 20 samples for a pass rate of 0.2. Finally, each sample costs 500 tokens; say how many tokens the 95 percent budget costs and whether majority vote or a verifier should select the answer.
hint: The logarithm of 0.05 is about -3.0 and the logarithm of 0.9 is about -0.105.
lang: python
solution:
import math

n = math.ceil(math.log(0.05) / math.log(0.9))
print("samples for 0.95 coverage at p 0.1:", n)         # 29
print("coverage with 20 samples at p 0.2:", round(1 - 0.8 ** 20, 3))   # 0.988
print("tokens:", n * 500)                                 # 14500
# At a 10 percent pass rate wrong answers outnumber the right one, so use a verifier.
:::

## Common mistakes

- Mistake: you report coverage as accuracy. Fix: coverage is an upper bound; report the accuracy of the selection method.
- Mistake: you use majority vote on hard problems. Fix: wrong answers outnumber the right one; use a verifier.
- Mistake: you assume test-time compute always beats a bigger model. Fix: it loses on the hardest problems.
- Mistake: you extend the chain without a cap. Fix: accuracy flattens, and cost does not.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: test-time compute
q: A model has a 20 percent pass rate. What is the coverage with 10 samples?
- 20 percent
- 65 percent
* About 89 percent
- 100 percent
why: Coverage is 1 minus 0.8 to the power 10, and 0.8 to the power 10 is about 0.11.
q: The correct answer appears once in 100 samples. Which method can still return it?
- Majority vote
* Best-of-n with a verifier
- A lower temperature
- A shorter chain
why: A vote needs the right answer to be common, but a verifier can rank a single correct sample first.
q: What does budget forcing control?
- The number of parallel samples
* The length of the reasoning chain, with a cap and a forced minimum
- The size of the model
- The verifier threshold
why: The s1 paper cut the chain at a maximum and appended a continuation word to extend it to a minimum.
q: What is the difference between coverage and accuracy?
- They are the same number
* Coverage says a correct answer is in the set; accuracy says the selection method returned it
- Accuracy is always higher than coverage
- Coverage only applies to code tasks
why: Coverage is an upper bound on what any selection method can achieve.
q: On which problems did the larger model beat a small model with search in the Snell study?
- Easy problems
- Medium problems
* The hardest problems, where the small model cannot produce one correct step
- All problems
why: Sampling only helps when a correct sample is possible, and on the hardest problems the small model never produces one.
:::

## Go further

The Snell paper gives the compute-optimal comparison between test-time and pretraining compute. The Large Language Monkeys paper measures coverage curves. The s1 paper describes budget forcing with a small fine-tune. The Tree of Thoughts paper is the first step search method.
`,
          links: [
            { label: 'Scaling LLM Test-Time Compute Optimally (Snell et al., 2024)', url: 'https://arxiv.org/abs/2408.03314', kind: 'paper' },
            { label: 'Large Language Monkeys: Scaling Inference Compute with Repeated Sampling (Brown et al., 2024)', url: 'https://arxiv.org/abs/2407.21787', kind: 'paper' },
            { label: 's1: Simple test-time scaling (Muennighoff et al., 2025)', url: 'https://arxiv.org/abs/2501.19393', kind: 'paper' },
            { label: 'Tree of Thoughts (Yao et al., 2023)', url: 'https://arxiv.org/abs/2305.10601', kind: 'paper' },
          ],
        },
      ],
    },
    {
      slug: 'research-practice',
      title: 'Research practice',
      description: 'How to read a paper, reproduce a result, run ablations, and write up what you found.',
      level: 'advanced',
      lessons: [
        {
          slug: 'read-a-paper',
          title: 'How to read a paper',
          summary: 'Read in three passes, write the claim in one sentence, and check the evidence before you believe it.',
          minutes: 14,
          objectives: [
            'Apply the three-pass method to a machine learning paper.',
            'Write the main claim of a paper in one sentence with its conditions.',
            'Check whether the experiments support the claim.',
            'Keep a reading log that you can search later.',
          ],
          keyTerms: ['three-pass method', 'claim', 'baseline', 'ablation', 'reading log', 'related work'],
          body: `
## What this lesson covers

This lesson gives a procedure for reading a research paper. It uses the three-pass method and adds checks that fit machine learning papers. You will apply it to one paper and produce a one-paragraph note.

## Why it matters

The field publishes thousands of papers each month. A researcher cannot read them all in full. A fixed procedure lets you decide in 10 minutes whether a paper deserves an hour. It also protects you from a common error: accepting a claim because the abstract states it with confidence.

## The idea with an example

Take the Chinchilla paper as the example. Apply the three passes.

The timing diagram shows the three passes and the decision between each pair.

:::timeline
title: Three passes over one paper
unit: minutes
lane Pass 1
lane Pass 2
lane Pass 3
Pass 1: title, abstract, headings, figures, conclusion @0-10
Pass 1 -> Pass 2: decide to continue @10
Pass 2: full text, every figure, open questions @10-70
Pass 2 -> Pass 3: paper worth building on @70
Pass 3: re-derive and attack the argument @70-250
:::

Pass one takes 10 minutes. Read the title, the abstract, the section headings, and every figure caption. Read the conclusion. Write the claim in one sentence: "For a fixed compute budget, loss is lowest when weights and tokens grow at the same rate, so most 2022 models were too large for their data." Note the conditions: one model family, one data mix, loss measured on held-out text.

Pass two takes about an hour. Read the full text but skip the proofs. Study each figure. For Chinchilla, figure 1 shows three fitting methods and their agreement. Look at the axes: are they log-scaled, and what range do they cover? Check the baselines: the paper compares with Gopher, a model from the same lab with the same data. Write down every question you cannot answer.

Pass three takes several hours and is for papers you will build on. Re-derive the key result. For Chinchilla, fit the loss equation to the data in the appendix and check the exponents. Try to break the argument. The learning rate schedule difference with Kaplan is the key detail. Would the result hold with a different tokeniser? The paper does not say.

The note at the end of pass two for this paper is one paragraph: the claim, the conditions, the strongest evidence, the weakest point, and what you would test next.

Press Next to follow the first two passes on the Chinchilla paper.

:::scenario
title: Pass one and pass two on the Chinchilla paper
state: minutes=0, claim=none, conditions=none, open questions=0
step: Read the title, the abstract, the headings, every figure caption, and the conclusion.
state: minutes=10
step: Write the claim in one sentence. Loss is lowest when weights and tokens grow at the same rate.
state: claim=weights and tokens grow at the same rate
step: Note the conditions. One model family, one data mix, loss on held-out text.
state: conditions=one family + one data mix + held-out loss
step: Read the full text. Study figure 1 and its log axes. Find the Gopher baseline.
state: minutes=70, baseline=Gopher from the same lab
step: Write down what the paper does not answer, such as the effect of a different tokeniser.
state: open questions=1
step: Write the one-paragraph note with the claim, the conditions, the evidence, and the weakest point.
state: note=written
:::

## How it works

The three passes are:

1. Pass one: title, abstract, headings, figures, conclusion. Decide whether to continue.
2. Pass two: full text without proofs. Note every unanswered question.
3. Pass three: re-derive and reproduce. Attack the argument.

The bars compare the time each pass takes.

:::bars
title: Time per pass
unit: minutes
Pass 1: 10
Pass 2: 60
Pass 3: 240 (several hours)
:::

For a machine learning paper, add these checks during pass two:

- Find the baseline. Ask whether the baseline was tuned as hard as the new method.
- Find the ablation table. Ask which component the gain depends on.
- Find the number of runs. Ask whether the gap is larger than the variation between seeds.
- Find the evaluation data. Ask whether the training data could contain it.
- Find the compute. Ask whether the comparison holds compute equal.

The table lists the five checks and where to look for each.

| Check | What to confirm | Where to look |
| --- | --- | --- |
| Baseline | tuned as hard as the new method | experiments section and appendix |
| Ablation | the component that carries the gain | ablation table |
| Runs | the gap is larger than the seed variation | error bars and seed count |
| Evaluation data | the training data does not contain it | data section |
| Compute | the comparison holds compute equal | setup section or appendix |

Write the claim as: "Under conditions C, method M beats baseline B on metric X by amount D." If you cannot fill every slot, the paper has not told you enough.

Keep a reading log. One entry per paper, with the one-sentence claim, the conditions, one figure that carries the evidence, and your open questions. Use plain text so you can search it. After a year the log is worth more than any single paper.

Note: a paper from a well-known lab needs the same checks as any other paper. The Kaplan paper came from a strong lab and was still corrected by Chinchilla.

The code below keeps a reading log in a plain-text file, one entry per paper, and searches it. Run it twice: once to add the Chinchilla entry and once to search.

:::code
lang: python
import json, sys
from pathlib import Path

LOG = Path("reading_log.jsonl")

def add(entry):
    with LOG.open("a") as f:
        f.write(json.dumps(entry) + chr(10))

def search(word):
    for line in LOG.read_text().splitlines():
        e = json.loads(line)
        if word.lower() in json.dumps(e).lower():
            print(e["title"], "->", e["claim"])

add({
    "title": "Training Compute-Optimal Large Language Models",
    "claim": "For a fixed compute budget, loss is lowest when weights and tokens grow at the same rate.",
    "conditions": ["one model family", "one data mix", "loss on held-out text"],
    "figure": "Figure 1, three fitting methods agree",
    "weakest": "the result may depend on the tokeniser, which the paper does not test",
})
search("tokeniser")
:::

The output is:

:::code
lang: text
Training Compute-Optimal Large Language Models -> For a fixed compute budget, loss is lowest when weights and tokens grow at the same rate.
:::

## Try it

:::exercise
title: Pass one on the DPO paper
task: Open the DPO paper from the alignment module. Spend 10 minutes on pass one only: title, abstract, headings, figure captions and conclusion. Write the claim in the template Under conditions C, method M beats baseline B on metric X by amount D. Then write one condition the abstract leaves out and one question you cannot answer without pass two.
hint: The baseline is PPO-based RLHF. Look for the summarisation and dialogue experiments in the figure captions for the metric and the size of the gain.
lang: text
solution:
Claim: Under the condition of preference data sampled from a fixed reference model, DPO
matches or beats PPO-based RLHF on win rate against a reference answer, judged by GPT-4,
on summarisation and single-turn dialogue, with no reward model and no sampling loop.
Condition left out: the judge is a model, not a person, for most comparisons.
Open question for pass two: how sensitive is the result to beta and to the length of the
chosen answers? The ablation table and the appendix should say.
:::

## Common mistakes

- Mistake: you read every paper start to finish. Fix: stop after pass one for most papers.
- Mistake: you believe the abstract. Fix: find the figure that supports the claim and read its axes.
- Mistake: you skip the appendix. Fix: the hyperparameters and the failure cases live there.
- Mistake: you remember the claim and forget the conditions. Fix: write both in the log.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: reading a paper
q: What do you read in pass one?
- The full text without proofs
* The title, abstract, headings, figure captions and conclusion
- The appendix and the code
- The related work section only
why: Pass one takes 10 minutes and decides whether the paper deserves an hour.
q: Which question do you ask about the baseline?
- Whether it is from the same lab
* Whether it was tuned as hard as the new method
- Whether it uses the same tokeniser
- Whether it has a GitHub repository
why: A weak baseline inflates the gain, and the experiments section and appendix show how much tuning each side got.
q: A paper reports a gain of 0.8 points with one run per setting. What check does this fail?
- The compute check
* The runs check, because the gap may be smaller than the variation between seeds
- The evaluation data check
- The ablation check
why: Without several seeds you cannot tell a real gain from noise.
q: A reader writes the claim as the method works much better. Which slots of the claim template are missing?
- Only the amount
* The conditions, the baseline, the metric and the amount
- Only the metric
- None, the claim is complete
why: A complete claim names the conditions, the method, the baseline, the metric and the size of the gain.
q: Why keep a reading log in plain text?
- Papers are plain text
* You can search it later, and after a year it is worth more than any single paper
- Reviewers require it
- It replaces pass three
why: A searchable log of claims, conditions and open questions turns reading into something you can build on.
:::

## Go further

Keshav's short guide is the source of the three-pass method. The troubling trends paper lists the ways papers mislead, with examples. Hamming's talk on research explains how to pick what to read and what to work on. The Chinchilla paper is a good first subject for the full procedure.
`,
          links: [
            { label: 'How to Read a Paper (Keshav)', url: 'https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf', kind: 'article' },
            { label: 'Troubling Trends in Machine Learning Scholarship (Lipton and Steinhardt, 2018)', url: 'https://arxiv.org/abs/1807.03341', kind: 'paper' },
            { label: 'You and Your Research (Hamming)', url: 'https://www.cs.virginia.edu/~robins/YouAndYourResearch.html', kind: 'article' },
            { label: 'Training Compute-Optimal Large Language Models (Hoffmann et al., 2022)', url: 'https://arxiv.org/abs/2203.15556', kind: 'paper' },
          ],
        },
        {
          slug: 'reproduce-a-result',
          title: 'Reproduce a result',
          summary: 'A reproduction starts from the smallest run that shows the effect, matches the baseline first, and logs everything.',
          minutes: 16,
          objectives: [
            'Choose the smallest experiment that tests the main claim of a paper.',
            'Match a published baseline number before you change anything.',
            'Track seeds, configurations, and metrics so a run can be repeated.',
            'Decide when a gap between your number and the paper is real.',
          ],
          keyTerms: ['reproduction', 'baseline', 'seed', 'variance', 'configuration', 'experiment tracking'],
          body: `
## What this lesson covers

This lesson gives a procedure for reproducing a published result. It covers how to scale the experiment down, how to match the baseline, how to log the work, and how to judge a gap. You will plan a reproduction of a small claim.

## Why it matters

Reproduction is the fastest way to learn a method and the only way to trust it. Many published gains shrink or vanish when another team runs them. A researcher who can reproduce results in a week is more valuable than one who can only read them. Every new project should start with a reproduction of its strongest baseline.

:::video
id: l8pRSuU81PU
why: Watch the first 30 minutes. It starts a reproduction of GPT-2 by matching the published model and its loss before changing anything, which is the baseline-first rule of this lesson.
:::

## The idea with an example

Take the claim "chain-of-thought prompting raises accuracy on grade-school mathematics". The paper reports a gain for a model with over 100 billion weights. You do not have that model. Plan a small version.

Step one: pick the smallest setting where the effect should appear. The paper's own figure shows gains from about 10 billion weights. Choose an open model of that size. Choose 500 problems from the test set instead of all 1,319.

Step two: match the baseline. Run the direct prompt and record accuracy. The paper reports a number for a similar model. Suppose the paper reports 10 percent and you get 9 percent. The gap of 1 point on 500 problems is within the noise. Move on. If you got 25 percent, stop and find the difference, because something in your setup differs from the paper.

Step three: run the method. Use the exact few-shot examples from the paper's appendix. Record accuracy. Suppose you get 32 percent and the paper reports 35 percent. The gap is 3 points with a standard error of about 2 points. The effect reproduces.

Step four: write it up in one page with the configuration, the numbers, and the gap.

Press Next to follow the four steps with the numbers.

:::scenario
title: Reproduce the chain-of-thought gain at small scale
state: model=10 billion weight open model, problems=500, baseline=none, method=none
step: Run the direct prompt. The paper reports 10 percent for a similar model.
state: baseline=9 percent (paper 10)
step: The gap is 1 point on 500 problems, inside the noise. Continue.
state: baseline check=pass
step: Run the few-shot chain-of-thought prompt from the appendix with 3 seeds.
state: method=32 percent (paper 35)
step: Compute the standard error. For 0.32 on 500 problems it is about 0.02.
state: standard error=2 points
step: The gap of 3 points is within two standard errors. The effect reproduces.
state: verdict=reproduces
:::

The bars compare your numbers with the paper.

:::bars
title: Accuracy on 500 grade-school problems
unit: percent
Direct prompt, paper: 10
Direct prompt, yours: 9
Chain of thought, paper: 35
Chain of thought, yours: 32
:::

## How it works

A reproduction is itself an experiment with a hypothesis: "the published number holds in my setup". Treat it with the same care.

The procedure:

1. Write the claim with its conditions, from the reading lesson.
2. Identify the smallest scale that the paper itself shows the effect at.
3. Fix a configuration file with every setting: model, data, prompt, seed, tokeniser, evaluation script.
4. Run the baseline. Compare with the paper. Resolve any large gap before you continue.
5. Run the method with at least 3 seeds.
6. Compute the mean and standard error. Compare with the paper.
7. Save the configuration, the logs, and the outputs with a version identifier.

The diagram shows the procedure as a path from the claim to the saved record.

:::flow
title: The reproduction procedure
Claim -> Smallest scale: from the paper's own figure
Smallest scale -> Config file: every setting
Config file -> Baseline run: direct prompt
Baseline run -> Gap check: compare with paper
Gap check -> Method runs: 3 seeds
Method runs -> Mean and SE: compare with paper
Mean and SE -> Saved record: configs, logs, outputs
:::

The standard error of an accuracy estimate is:

$$\\mathrm{SE} = \\sqrt{\\frac{p(1 - p)}{n}}$$

$p$ is the measured accuracy. $n$ is the number of test problems. For $p = 0.3$ and $n = 500$, the standard error is about 0.02. A gap smaller than two standard errors is not evidence of a difference.

A gap is real when it is larger than the seed variation and the sampling error, and when it survives a check of the configuration. Common causes of a false gap are a different tokeniser, a different prompt format, a different evaluation parser, and a different data split. Check those four first.

The table lists the four causes with a symptom and a check for each.

| Cause | Symptom | Check |
| --- | --- | --- |
| Different tokeniser | token counts and prompt lengths differ | compare token counts on one example |
| Different prompt format | baseline far from the paper | copy the appendix prompt exactly |
| Different evaluation parser | right answers marked wrong | inspect 20 parsed outputs by hand |
| Different data split | numbers differ in both directions | confirm the split and its size |

Caution: a result that reproduces only with the authors' exact seed is not a result. Run several seeds.

The code below checks a reproduction gap with the standard error formula from the lesson. Change the numbers to your own run.

:::code
lang: python
import math

def standard_error(p, n):
    return math.sqrt(p * (1 - p) / n)

def verdict(ours, paper, n):
    se = standard_error(ours, n)
    gap = abs(ours - paper)
    status = "reproduces" if gap <= 2 * se else "real gap, investigate"
    print(f"ours {ours:.2f} paper {paper:.2f} n {n} SE {se:.3f} gap {gap:.2f} -> {status}")

verdict(0.09, 0.10, 500)   # baseline
verdict(0.32, 0.35, 500)   # chain of thought
verdict(0.28, 0.35, 500)   # a gap that needs a look
verdict(0.50, 0.55, 200)
:::

The output is:

:::code
lang: text
ours 0.09 paper 0.10 n 500 SE 0.013 gap 0.01 -> reproduces
ours 0.32 paper 0.35 n 500 SE 0.021 gap 0.03 -> reproduces
ours 0.28 paper 0.35 n 500 SE 0.020 gap 0.07 -> real gap, investigate
ours 0.50 paper 0.55 n 200 SE 0.035 gap 0.05 -> reproduces
:::

## Try it

:::exercise
title: Judge a gap
task: You repeat the chain-of-thought reproduction from the lesson on 500 problems and get 28 percent against the paper's 35 percent. Compute the standard error by hand and decide whether the gap is real. Then list the four causes of a false gap from the lesson in the order you would check them, with one sentence on why that order.
hint: The standard error is the square root of p times 1 minus p over n. Compare the gap with two standard errors.
lang: python
solution:
import math

p, n, paper = 0.28, 500, 0.35
se = math.sqrt(p * (1 - p) / n)
print(round(se, 3), "gap", round(paper - p, 2), "limit", round(2 * se, 3))   # 0.02, 0.07, 0.04
# The gap of 7 points is beyond two standard errors, so it is real. Check in this order:
# 1 prompt format, since a copied appendix prompt is the fastest check
# 2 evaluation parser, by reading 20 parsed outputs
# 3 tokeniser, by comparing token counts on one example
# 4 data split, by confirming the split and its size
:::

## Common mistakes

- Mistake: you start at full scale. Fix: start at the smallest scale that shows the effect.
- Mistake: you change the method before the baseline matches. Fix: match the baseline first.
- Mistake: you run one seed. Fix: run at least three and report the spread.
- Mistake: you keep settings in your shell history. Fix: put every setting in a versioned configuration file.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: reproducing a result
q: What do you do before you run the new method?
- Tune the learning rate
* Match the published baseline number
- Write the paper
- Change the prompt
why: A baseline that does not match means the setup differs, and every later number inherits that difference.
q: With accuracy 0.5 on 200 problems, what is the standard error?
- 0.0025
- 0.01
* About 0.035
- 0.25
why: The square root of 0.5 times 0.5 over 200 is about 0.035.
q: Your number is 32 percent and the paper reports 35 percent on 500 problems. What is the verdict?
- The gap is real
* The gap of 3 points is within two standard errors of about 2 points each, so the effect reproduces
- The paper is wrong
- You need 10 more seeds
why: A gap smaller than two standard errors is not evidence of a difference.
q: A reproduction matches only with the authors' exact random seed. What does that show?
- The method is robust
* The result is not a result, because it does not survive seed variation
- The baseline was too strong
- The tokeniser differs
why: A real effect is larger than the variation between seeds, so run several and report the spread.
q: Which cause of a false gap do you check by reading 20 parsed outputs by hand?
- A different tokeniser
- A different data split
* A different evaluation parser that marks right answers wrong
- A different model size
why: Parser errors show up as correct answers scored as wrong, and only inspection catches them.
:::

## Go further

The Pineau paper gives a reproducibility checklist that conference reviewers use. The releasing-research-code repository lists what a code release should include. The Weights and Biases documentation shows how to track configurations and metrics. Karpathy's recipe post is a field guide to debugging a training run.
`,
          links: [
            { label: 'Improving Reproducibility in Machine Learning Research (Pineau et al., 2020)', url: 'https://arxiv.org/abs/2003.12206', kind: 'paper' },
            { label: 'ML Code Completeness Checklist', url: 'https://github.com/paperswithcode/releasing-research-code', kind: 'repo' },
            { label: 'Weights and Biases documentation', url: 'https://docs.wandb.ai', kind: 'docs' },
            { label: 'A Recipe for Training Neural Networks (Karpathy)', url: 'https://karpathy.github.io/2019/04/25/recipe/', kind: 'article' },
          ],
        },
        {
          slug: 'run-ablations',
          title: 'Run ablations',
          summary: 'An ablation removes one part at a time, holds everything else fixed, and shows which part carries the gain.',
          minutes: 15,
          objectives: [
            'Design an ablation table for a method with three components.',
            'Hold compute and data fixed across ablation runs.',
            'Read an ablation table and identify the component that matters.',
            'Report seed variance next to every ablation number.',
          ],
          keyTerms: ['ablation', 'control', 'confound', 'seed variance', 'baseline', 'hyperparameter sweep'],
          body: `
## What this lesson covers

This lesson explains ablations, the experiments that show which part of a method causes its gain. It covers how to design the table, how to keep the comparison fair, and how to read the result. You will design an ablation for a method with three parts.

## Why it matters

A method is often a bundle: a new loss, a new data filter, and a longer schedule. The paper reports a gain for the bundle. The reader needs to know which part to adopt. Reviewers ask for ablations for this reason. In your own work, ablations stop you from shipping a part that does nothing.

## The idea with an example

Suppose your method for fine-tuning has three parts: a new loss term, a data filter, and a learning rate warmup that is twice as long. The full method scores 72 on a benchmark. The baseline scores 65.

Design a table with one row per removed part:

| Configuration | Loss term | Filter | Long warmup | Score |
| --- | --- | --- | --- | --- |
| Baseline | no | no | no | 65.0 ± 0.8 |
| Full method | yes | yes | yes | 72.1 ± 0.6 |
| Without loss term | no | yes | yes | 71.8 ± 0.7 |
| Without filter | yes | no | yes | 66.2 ± 0.9 |
| Without long warmup | yes | yes | no | 71.5 ± 0.6 |

Read the table. Removing the loss term costs 0.3 points, inside the seed spread. Removing the filter costs 5.9 points. Removing the warmup costs 0.6 points. The filter carries the gain. The loss term, the part you spent the most time on, does nothing you can measure.

The bars compare the score of each configuration.

:::bars
title: Benchmark score by configuration, mean of 3 seeds
unit: points
Baseline: 65.0
Full method: 72.1
Without loss term: 71.8
Without filter: 66.2
Without long warmup: 71.5
:::

Now the honest paper says: "the gain comes from the data filter". The method shrinks to one part. That is a better result, because it is simpler and it is true.

Press Next to read the table one row at a time.

:::scenario
title: Read the ablation table one row at a time
state: full method=72.1, suspected cause=all three parts
step: Remove the loss term. The score falls to 71.8, a drop of 0.3 points.
state: drop without loss term=0.3, verdict loss term=inside seed spread
step: Remove the filter. The score falls to 66.2, a drop of 5.9 points.
state: drop without filter=5.9, verdict filter=carries the gain
step: Remove the long warmup. The score falls to 71.5, a drop of 0.6 points.
state: drop without warmup=0.6, verdict warmup=inside seed spread
step: Compare each drop with two standard deviations, about 1.4 points. Only the filter passes.
state: suspected cause=the filter alone
step: Shrink the method to one part and say so in the write-up.
state: method=data filter
:::

## How it works

An ablation holds everything fixed except one part. The things to hold fixed are:

- Training compute in FLOPs or steps.
- Training data and its order, through a fixed seed.
- Evaluation data and the evaluation script.
- All hyperparameters not under test.

To run an ablation study:

1. List the parts of the method.
2. Write the full configuration and the baseline configuration.
3. For each part, write a configuration with that part removed and nothing else changed.
4. Run every configuration with the same 3 seeds.
5. Report mean and standard deviation per configuration.
6. Mark a part as important only when removing it costs more than two standard deviations.

A confound is a change that rides along with the part under test. If the filter also shrinks the dataset, the ablation measures the filter and the smaller dataset together. To separate them, add a row with a random subset of the same size. If the new loss needs a different learning rate, sweep the learning rate for both the full method and the ablation, or the comparison favours the one you tuned.

A full factorial design tests every combination of parts. For three parts that is 8 runs. It shows interactions: a part that helps only when another part is present. Use it when the parts could interact and the runs are cheap.

The grid shows one slice of a full factorial design for the example, with the long warmup kept on.

:::matrix
title: Factorial slice with the long warmup on, mean score
cols: no filter, filter
no loss term: 65.6, 71.8
loss term: 66.2, 72.1
:::

Note: an ablation that removes a part and replaces it with nothing can be unfair. Replace a new loss term with the standard term, not with zero.

The code below reads the ablation table from the lesson and flags each part whose removal costs more than two standard deviations.

:::code
lang: python
full = (72.1, 0.6)
rows = {
    "loss term":   (71.8, 0.7),
    "filter":      (66.2, 0.9),
    "long warmup": (71.5, 0.6),
}
baseline = (65.0, 0.8)

print("full method", full[0], "baseline", baseline[0], "gain", round(full[0] - baseline[0], 1))
for part, (score, sd) in rows.items():
    drop = full[0] - score
    limit = 2 * max(sd, full[1])
    verdict = "carries the gain" if drop > limit else "inside seed spread"
    print(f"without {part:12s} drop {drop:4.1f}  limit {limit:3.1f}  {verdict}")
:::

The output is:

:::code
lang: text
full method 72.1 baseline 65.0 gain 7.1
without loss term    drop  0.3  limit 1.4  inside seed spread
without filter       drop  5.9  limit 1.8  carries the gain
without long warmup  drop  0.6  limit 1.2  inside seed spread
:::

## Try it

:::exercise
title: Add a confound row
task: The filter in the lesson keeps 60 percent of the data, so the full method also trains on a smaller dataset. Design one extra row that separates the filter from the smaller dataset. Say what the row trains on, and predict its score under two hypotheses: the filter picks good data, or any 60 percent subset works as well. Then write the rule you would use to decide between the hypotheses from the row's score and the seed spread.
hint: The row keeps everything from the full method but replaces the filtered subset with a random subset of the same size.
lang: text
solution:
Row: random 60 percent subset, loss term on, long warmup on, same seeds, same steps.
If the filter picks good data, this row scores near the no-filter row, about 66.
If any subset works, it scores near the full method, about 72.
Rule: the filter is real if the full method beats the random-subset row by more than
two standard deviations, about 1.4 points. Otherwise the gain came from the smaller
dataset, and the write-up must say so.
:::

## Common mistakes

- Mistake: you ablate with one seed. Fix: a 0.5 point gap with one seed is noise.
- Mistake: you remove a part and keep its hyperparameters. Fix: re-tune the settings that the part affects.
- Mistake: you compare at different step counts. Fix: fix the compute budget across rows.
- Mistake: you drop the rows that embarrass the method. Fix: report every row you ran.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: ablations
q: In the lesson's table, which part carries the gain?
- The new loss term
* The data filter
- The long warmup
- All three equally
why: Removing the filter costs 5.9 points, while removing either other part costs less than the seed spread.
q: Removing a part drops the score from 72.1 to 71.5 with a standard deviation of 0.6. Is the part important?
- Yes, any drop counts
* No, the drop of 0.6 is inside two standard deviations, about 1.2
- Yes, because 0.6 equals the standard deviation
- It cannot be decided without a factorial design
why: A part counts only when removing it costs more than two standard deviations.
q: What does a full factorial design reveal that a one-at-a-time table does not?
- The seed variance
* Interactions, where a part helps only when another part is present
- The compute budget
- The baseline score
why: Testing every combination shows whether parts depend on each other.
q: A new loss term needs a different learning rate from the baseline. What is the fair ablation?
- Use the baseline learning rate for both
- Use the new learning rate for both
* Sweep the learning rate for both the full method and the ablation
- Skip the ablation
why: Otherwise the comparison favours whichever setting you tuned.
q: A method has 3 parts. How many runs does a full factorial design need per seed?
- 3
- 4
* 8
- 9
why: Each part is on or off, and 2 to the power 3 is 8 combinations.
:::

## Go further

The ablation studies paper surveys the practice and its history. The deep learning tuning playbook gives a full method for fair hyperparameter comparison. The troubling trends paper shows what happens when ablations are missing. The Weights and Biases documentation covers sweeps for the tuning step.
`,
          links: [
            { label: 'Ablation Studies in Artificial Neural Networks (Meyes et al., 2019)', url: 'https://arxiv.org/abs/1901.08644', kind: 'paper' },
            { label: 'Deep Learning Tuning Playbook', url: 'https://github.com/google-research/tuning_playbook', kind: 'repo' },
            { label: 'Troubling Trends in Machine Learning Scholarship (Lipton and Steinhardt, 2018)', url: 'https://arxiv.org/abs/1807.03341', kind: 'paper' },
            { label: 'Weights and Biases documentation', url: 'https://docs.wandb.ai', kind: 'docs' },
          ],
        },
        {
          slug: 'write-up',
          title: 'Write up a result',
          summary: 'A good write-up states one claim, shows the figure that proves it, and gives the reader what they need to repeat it.',
          minutes: 14,
          objectives: [
            'Write a one-sentence claim and build the paper around it.',
            'Design the main figure before you write the text.',
            'Structure a research write-up in the standard sections.',
            'List the details a reader needs to reproduce the result.',
          ],
          keyTerms: ['claim', 'main figure', 'abstract', 'related work', 'limitations', 'reproducibility'],
          body: `
## What this lesson covers

This lesson gives a procedure for writing up a result. It covers the claim, the main figure, the section structure, and the reproducibility details. The output can be a workshop paper, a blog post, or an internal report. The procedure is the same.

## Why it matters

A result that no one can read is a result that no one uses. Reviewers read hundreds of papers and give each one minutes. A clear claim and a clear figure survive that. The write-up is also the last check on the work: a claim you cannot state in one sentence is a claim you have not finished testing.

## The idea with an example

Take the ablation result from the previous lesson. The data filter gave a 6 point gain, and the loss term did nothing. Build the write-up from that.

The claim: "A classifier-based data filter raises fine-tuning accuracy on benchmark X by 6 points at equal compute, and a new loss term adds nothing on top." One sentence, with the condition, the method, the metric, and the size.

The main figure: a bar chart with four bars, baseline, filter only, loss term only, and both, with error bars from three seeds. A reader who sees only this figure learns the whole result. Draw it on paper before you write a word of text.

The bars show the main figure for the example.

:::bars
title: The main figure, accuracy by configuration
unit: points
Baseline: 65.0
Filter only: 71.8
Loss term only: 66.2
Filter and loss term: 72.1
:::

The abstract, in four sentences: the problem, the method, the main number, and the limitation. For example: "Fine-tuning on noisy data wastes compute. We train a fast classifier to filter the data and compare it with a new loss term. The filter gives 6 points at equal compute; the loss term gives none. The result holds for one model family and one benchmark."

The rest of the paper supports those four sentences.

Press Next to build the write-up from the result.

:::scenario
title: Build the write-up from the ablation result
state: claim=none, main figure=none, abstract=none
step: Write the claim in one sentence with the condition, the method, the metric, and the size.
state: claim=filter gives 6 points at equal compute and the loss term adds nothing
step: Draw the main figure on paper. Four bars with error bars from three seeds.
state: main figure=four bars + error bars
step: Write the method and the experiments around the figure.
state: sections=method + experiments
step: Write the introduction, then the abstract in four sentences.
state: abstract=problem + method + number + limitation
step: Add related work and a plain limitations section.
state: sections=all eight
:::

## How it works

The standard structure, with the question each section answers:

1. Abstract: what did you find?
2. Introduction: why does it matter, and what is the claim?
3. Related work: what did others do, and how does this differ?
4. Method: what exactly did you do, with enough detail to repeat?
5. Experiments: what is the evidence, with the main figure first?
6. Ablations: which part carries the gain?
7. Limitations: where does the claim stop?
8. Conclusion: what is the one thing to remember?

The table lists the length of each part in a 4-page paper.

| Section | Content | Length in a 4-page paper |
| --- | --- | --- |
| Abstract | problem, method, main number, limitation | 4 sentences |
| Introduction | why it matters and the claim | half a page |
| Method | what exactly you did | one page |
| Experiments and ablations | the evidence, main figure first | one and a half pages |
| Limitations and conclusion | where the claim stops | half a page |

Write the sections in this order: main figure, method, experiments, introduction, abstract, related work, limitations. The abstract comes late because it summarises what the figures show.

The diagram shows the writing order.

:::flow
title: Writing order for the sections
Main figure -> Method: what produced it
Method -> Experiments: the evidence
Experiments -> Introduction: the claim
Introduction -> Abstract: four sentences
Abstract -> Related work: position the claim
Related work -> Limitations: where it stops
:::

The reproducibility section lists:

- Model, size, and source.
- Data, size, and the filter or split.
- Every hyperparameter, in a table.
- Number of seeds and how the error bars were computed.
- Compute in GPU hours.
- A link to the code and the configuration files.

Write the limitations in plain statements. "We tested one model family" is a limitation. "Future work could test more models" is not. State what you did not test and what could change the result.

Note: use the same word for the same thing throughout. If the method is "the filter" in the abstract, it is "the filter" in every section.

The code below draws the main figure from the lesson with error bars from three seeds. It needs the matplotlib library, which you can install with pip.

:::code
lang: python
import matplotlib.pyplot as plt

configs = ["Baseline", "Filter only", "Loss term only", "Filter and loss term"]
means = [65.0, 71.8, 66.2, 72.1]
sds = [0.8, 0.7, 0.9, 0.6]

fig, ax = plt.subplots(figsize=(6, 3.5))
ax.bar(configs, means, yerr=sds, capsize=4, color="#4a7ebb")
ax.set_ylim(60, 75)
ax.set_ylabel("Accuracy on benchmark X")
ax.set_title("Filter gives 6 points at equal compute; loss term adds nothing")
for i, m in enumerate(means):
    ax.text(i, m + 1.0, f"{m:.1f}", ha="center")
plt.tight_layout()
plt.savefig("main_figure.png", dpi=150)
print("saved main_figure.png")
:::

## Try it

:::exercise
title: Write the abstract for the reproduction
task: Take the chain-of-thought reproduction from the lesson on reproducing a result: a 10 billion weight open model, 500 grade-school problems, 9 percent with a direct prompt and 32 percent with the few-shot chain prompt, against the paper's 10 and 35 percent. Write the one-sentence claim in the template from the reading lesson. Then write the four-sentence abstract: problem, method, main number, limitation.
hint: The condition is the model size and the problem set. The metric is accuracy. The limitation is one model and one benchmark.
lang: text
solution:
Claim: On 500 GSM8K problems with a 10 billion weight open model, few-shot chain-of-thought
prompting beats a direct prompt on accuracy by 23 points, from 9 to 32 percent.
Abstract: Published chain-of-thought gains were measured on models most teams cannot run.
We repeat the few-shot chain-of-thought experiment with a 10 billion weight open model on
500 grade-school problems, with three seeds and the paper's own prompts. Chain-of-thought
raises accuracy from 9 to 32 percent, within two standard errors of the paper's 35 percent.
The result covers one model family and one benchmark.
:::

## Common mistakes

- Mistake: you write the introduction first. Fix: write the main figure first and let it set the claim.
- Mistake: you claim more than the figure shows. Fix: match the claim to the strongest figure and no further.
- Mistake: you hide the negative result. Fix: the loss term that did nothing is a finding; report it.
- Mistake: you omit the hyperparameter table. Fix: no reader can reproduce a result without it.

## Check your understanding

Answer these questions before you move on.

:::quiz
title: Check: writing up a result
q: Which part of the write-up do you make first?
- The abstract
- The related work
* The main figure
- The limitations
why: The figure sets the claim, and every section then supports what the figure shows.
q: What four things does the abstract state?
- The authors, the lab, the date and the venue
* The problem, the method, the main number and the limitation
- The claim, the figure, the code and the data
- The baseline, the metric, the seeds and the compute
why: Four sentences, one per item, tell a reader in a minute what was found and where it stops.
q: The ablation found that the loss term adds nothing. What should the write-up do with it?
- Remove it to keep the paper short
* Report it, because a part that does nothing is a finding
- Move it to future work
- Claim a small gain anyway
why: Hiding a negative result misleads the reader, and the simpler method is the stronger result.
q: Which sentence belongs in a limitations section?
- Future work could test more models
* We tested one model family and one benchmark
- Our method is state of the art
- The code will be released later
why: A limitation is a plain statement of what you did not test, not a promise.
q: A reader wants to repeat the result. Which item must the write-up include?
- The names of the reviewers
- The conference deadline
* A table of every hyperparameter, the seed count and the compute used
- A longer introduction
why: Without the configuration and the compute, no reader can reproduce the number.
:::

## Go further

The troubling trends paper describes the writing habits that mislead readers. The Pineau checklist lists what to include for reproducibility. The releasing-research-code repository covers the code release. Overleaf's guides cover the mechanics of a LaTeX paper.
`,
          links: [
            { label: 'Troubling Trends in Machine Learning Scholarship (Lipton and Steinhardt, 2018)', url: 'https://arxiv.org/abs/1807.03341', kind: 'paper' },
            { label: 'Improving Reproducibility in Machine Learning Research (Pineau et al., 2020)', url: 'https://arxiv.org/abs/2003.12206', kind: 'paper' },
            { label: 'ML Code Completeness Checklist', url: 'https://github.com/paperswithcode/releasing-research-code', kind: 'repo' },
            { label: 'Overleaf guides', url: 'https://www.overleaf.com/learn', kind: 'docs' },
          ],
        },
      ],
    },
  ],
}
