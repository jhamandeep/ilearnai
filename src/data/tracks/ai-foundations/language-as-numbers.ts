import type { Module } from '../../types'

export const mod: Module = {
  slug: 'language-as-numbers',
  title: 'Language as numbers',
  description:
    'How text becomes tokens, how tokens become vectors, how a model predicts the next word, how attention lets tokens look at each other, and how a large language model is trained and where it fails.',
  level: 'beginner',
  lessons: [
    {
      slug: 'tokens',
      title: 'Tokens',
      summary: 'Split text into tokens, see why models use subwords, and compute what a request costs from its token count.',
      minutes: 18,
      objectives: [
        'Explain what a token is and why a model cannot read raw text.',
        'Compare character, word and subword tokenization on the same sentence.',
        'Describe the byte-pair encoding idea with a hand-worked merge.',
        'Compute the cost of a request from its token count and a price per million tokens.',
      ],
      keyTerms: ['token', 'tokenizer', 'vocabulary', 'token id', 'subword', 'byte-pair encoding'],
      body: `
## What this lesson covers

This lesson explains tokens, the small pieces of text that a language model reads and writes. You will split the sentence "the cat sat on the mat" into tokens in 3 different ways. You will see why modern models use pieces of words, and you will compute the cost of a request from its token count.

## Why it matters

A language model never sees letters or words. It sees a list of whole numbers, and each number stands for one token. Every limit you meet later depends on tokens: the size of the context window, the price of a request, and the speed of a reply. When you build the chat application in the project track, you count tokens to control cost. The next lesson, [Embeddings](/courses/ai-foundations/language-as-numbers/embeddings), turns each token number into a vector. First you need to know where the numbers come from.

:::video
id: zduSFxRajkE
why: Watch the first 15 minutes. Andrej Karpathy pastes text into a tokenizer and shows how words break into pieces. You do not need to follow the code yet.
:::

## The idea with an example

> **Analogy.** A tokenizer works like a set of children's letter blocks. Some blocks carry one letter, some carry a common word such as "the", and some carry a common word piece such as "ing". To write a sentence, you pick blocks from the box and put them in a row. The box of blocks is the vocabulary. The number printed on the bottom of each block is its token id.

Take the sentence "the cat sat on the mat". A computer stores it as 22 characters, which includes 5 spaces. A character is one letter, digit, space or punctuation mark. There are 3 common ways to cut this text into tokens.

:::anim
title: The sentence becomes a list of token ids
text sent "the cat sat on the mat" @ 400,90 size: 24 color: yellow
box tok "Tokenizer" @ 400,180 icon: process
rect c1 @ 175,275 size: 80x50 "the"
rect c2 @ 265,275 size: 80x50 "cat"
rect c3 @ 355,275 size: 80x50 "sat"
rect c4 @ 445,275 size: 80x50 "on"
rect c5 @ 535,275 size: 80x50 "the"
rect c6 @ 625,275 size: 80x50 "mat"
rect ids @ 400,355 size: 300x50 "[1, 2, 3, 4, 1, 5]" color: blue
box model "Model" @ 400,450 icon: model
num chars = 0 @ 800,180 suffix: " characters" size: 26
num ntok = 0 @ 800,275 suffix: " tokens" size: 26 color: green
num cost = 0 @ 800,380 prefix: "cost " suffix: " dollars" digits: 6 size: 20 color: grey
text note "the gets id 1 both times" @ 800,450 size: 16 color: grey

step: Here is the sentence. The computer stores it as 22 characters, which includes 5 spaces.
  show sent, chars
  count chars -> 22
step: The tokenizer cuts the text into pieces. Each piece is one token. Common words stay whole.
  show tok
  arrow sent -> tok : text
  show c1, c2, c3, c4, c5, c6
  show ntok
  count ntok -> 6
step: The tokenizer looks up each piece in the vocabulary: the is 1, cat is 2, sat is 3, on is 4, mat is 5.
  label c1 "the|id 1"
  label c2 "cat|id 2"
  label c3 "sat|id 3"
  label c4 "on|id 4"
  label c5 "the|id 1"
  label c6 "mat|id 5"
step: The word the appears twice and gets the same id, 1, both times.
  highlight c1, c5
  show note
step: The model never sees the words. It reads only the list of ids.
  restore c1, c5
  show ids
  pulse ids
  show model
  arrow ids -> model : 1 2 3 4 1 5
step: The price is per million tokens. At 3 dollars per million, these 6 tokens cost 0.000018 dollars.
  show cost
  count cost -> 0.000018
  highlight ntok
:::

| Method | Tokens for the sentence | Count | Vocabulary size |
| --- | --- | --- | --- |
| Characters | t, h, e, space, c, a, t, ... | 22 | about 100 |
| Words | the, cat, sat, on, the, mat | 6 | over 500,000 |
| Subwords | the, cat, sat, on, the, mat | 6 | about 100,000 |

Character tokens give a tiny vocabulary, but every sentence becomes very long. Word tokens give short sentences, but the vocabulary must hold every word in every language, and it still misses new words such as a product name. Subword tokens sit in the middle. A subword is a piece of text that can be a whole common word or part of a rare one. Common words such as "the" and "cat" stay whole. A rare word such as "unbelievably" splits into pieces such as "un", "believ" and "ably".

The sentence becomes a list of token ids. A token id is the whole number that stands for one token in the vocabulary. Suppose the tokenizer uses the ids below. Each id is one row in a lookup table, and the model only ever sees the id column.

| Token | Token id |
| --- | --- |
| the | 1 |
| cat | 2 |
| sat | 3 |
| on | 4 |
| mat | 5 |

The sentence "the cat sat on the mat" becomes the list [1, 2, 3, 4, 1, 5]. Notice that "the" appears twice and gets the same id both times. The flow below shows the full round trip from text to ids and back.

:::flow
title: The round trip from text to tokens and back
Text -> Tokenizer: splits into pieces
Tokenizer -> Token ids: looks up each piece
Token ids -> Model: reads the numbers
Model -> New ids: predicts the next id
New ids -> Detokenizer: looks up each id
Detokenizer -> Text: joins the pieces
:::

How does a tokenizer decide which pieces exist? The most common method is byte-pair encoding (BPE). BPE is a procedure that starts from single characters and repeatedly merges the most frequent pair of neighbours into one new token. Run it by hand on our sentence. Count every pair of neighbouring characters inside the words. The pair "a" followed by "t" appears 3 times, in "cat", "sat" and "mat". The pairs "t" then "h" and "h" then "e" each appear 2 times, in the two copies of "the". Every other pair appears once. Press Next to follow the merges.

:::scenario
title: Three BPE merges on the cat sat on the mat
state: vocabulary=a c e h m n o s t, pieces=t h e / c a t / s a t / o n / t h e / m a t
step: Count every neighbouring pair of characters inside the words. The pair a+t appears 3 times, t+h appears 2 times, h+e appears 2 times.
state: top pair=a+t (3 times)
step: Merge the most frequent pair a+t into one new token "at". Add it to the vocabulary.
state: vocabulary=a c e h m n o s t at, pieces=t h e / c at / s at / o n / t h e / m at
step: Count again. Now t+h appears 2 times and h+e appears 2 times. Take the first one.
state: top pair=t+h (2 times)
step: Merge t+h into "th".
state: vocabulary=a c e h m n o s t at th, pieces=th e / c at / s at / o n / th e / m at
step: Count again. The pair th+e appears 2 times. Merge it into "the".
state: vocabulary=a c e h m n o s t at th the, pieces=the / c at / s at / o n / the / m at
step: Stop after 3 merges. The sentence now needs 10 tokens instead of 17 characters without spaces. A real tokenizer runs about 100,000 merges on billions of words.
:::

After 3 merges, "the" is a single token because it was frequent. "cat" is still 2 tokens, "c" and "at". With more text and more merges, "cat" would also become one token. This is the whole idea: frequent text gets short codes, rare text gets long codes.

## How it works

A real tokenizer follows these steps when it reads your text:

1. Convert the text to bytes. A byte is a number from 0 to 255, and every character in every language is one or more bytes. This step means the tokenizer can never meet an unknown character.
2. Apply the learned merges in the order they were learned. Each merge joins two neighbouring pieces into one.
3. Look up the id of each final piece in the vocabulary.
4. Return the list of ids.

The vocabulary is fixed before training. The model learns with one vocabulary and keeps it for life. This is why a model made by one company cannot read token ids from a different tokenizer. The id 2 means "cat" in our table, but it means something else in every other table.

Token counts matter for 3 reasons: the context window, the price, and the speed. The context window is the maximum number of tokens the model can read and write in one request. The price is set per million tokens. A useful rule for English: 1,000 tokens is about 750 words, so 1 word is about 1.33 tokens. Other languages often cost more tokens per word, because the vocabulary was learned mostly on English.

| Text | Words | Tokens (about) | Cost at 3 dollars per million input tokens |
| --- | --- | --- | --- |
| Our sentence | 6 | 6 | 0.000018 dollars |
| One page | 500 | 670 | 0.002 dollars |
| A 20,000-word report | 20,000 | 26,700 | 0.08 dollars |
| A 100,000-word book | 100,000 | 133,000 | 0.40 dollars |

The cost formula is $\\text{cost} = \\text{tokens} \\times \\frac{\\text{price}}{1{,}000{,}000}$. In words: multiply the token count by the price per million, then divide by one million. For the report: 26,700 times 3 is 80,100, and 80,100 divided by 1,000,000 is about 0.08 dollars.

Here is a word tokenizer written by hand. It is too simple for a real model, but it shows every step in the round trip.

:::code
lang: python
file: tiny_tokenizer.py
text = "the cat sat on the mat"

vocab = {}
for word in text.split(" "):
    if word not in vocab:
        vocab[word] = len(vocab) + 1

ids = [vocab[w] for w in text.split(" ")]
print("vocabulary:", vocab)
print("token ids:", ids)

id_to_word = {i: w for w, i in vocab.items()}
print("back to text:", " ".join(id_to_word[i] for i in ids))
:::

:::code
lang: text
vocabulary: {'the': 1, 'cat': 2, 'sat': 3, 'on': 4, 'mat': 5}
token ids: [1, 2, 3, 4, 1, 5]
back to text: the cat sat on the mat
:::

To count tokens the way a real model does, use a real tokenizer. The tiktoken package from OpenAI runs offline and loads the vocabulary of several public models. Install it with pip install tiktoken.

:::code
lang: python
file: count_tokens.py
import tiktoken

enc = tiktoken.get_encoding("cl100k_base")
text = "the cat sat on the mat"
ids = enc.encode(text)
print("ids:", ids)
print("count:", len(ids))
print("pieces:", [enc.decode([i]) for i in ids])

price_per_million = 3.0
print("cost in dollars:", len(ids) * price_per_million / 1_000_000)
:::

:::code
lang: text
ids: [1820, 8415, 7731, 389, 279, 5634]
count: 6
pieces: ['the', ' cat', ' sat', ' on', ' the', ' mat']
cost in dollars: 1.8e-05
:::

Look at the pieces. The space belongs to the token that follows it: " cat" with a leading space is one token. The two copies of "the" get different ids, 1820 and 279, because the first has no space in front of it. This detail surprises many people. The same word can be 2 different tokens depending on what sits before it.

## Try it

:::exercise
title: Count tokens and compute cost
task: Use the hand-written word tokenizer idea. Write a function cost(text, price_per_million) that splits the text on spaces, counts the words, multiplies the count by 1.33 to estimate tokens, and returns the cost in dollars. Test it on a 1,500-word essay (make a string with 1,500 copies of the word "cat") at 3 dollars per million tokens. The answer is about 0.006 dollars.
hint: 1,500 words times 1.33 is about 1,995 tokens. Then multiply by 3 and divide by 1,000,000.
lang: python
solution:
def cost(text, price_per_million):
    words = len(text.split(" "))
    tokens = words * 1.33
    return tokens * price_per_million / 1_000_000

essay = " ".join(["cat"] * 1500)
print(round(cost(essay, 3.0), 4))
:::

If you have tiktoken installed, run the same essay through enc.encode and compare the exact count with the estimate. The estimate of 1.33 tokens per word is a rule of thumb, not a law.

## Common mistakes

- Mistake: you think the model reads words. Fix: the model reads token ids, and a long or rare word can be several tokens.
- Mistake: you assume "cat" and " cat" are the same token. Fix: the leading space is part of the token, so they have different ids.
- Mistake: you count characters to estimate cost. Fix: count tokens, or use the rule of about 1.33 tokens per English word.
- Mistake: you mix tokenizers. Fix: always encode and decode with the tokenizer that belongs to the model you call.
- Mistake: you expect code and other languages to cost the same as English. Fix: code, numbers and non-English text often take more tokens per word, so measure them.

## Check your understanding

:::quiz
title: Check: tokens
q: Why do modern language models use subword tokens instead of whole words?
- Subwords make every sentence shorter than words do
* Subwords keep the vocabulary small and can still write any word, including new ones
- Subwords are easier for people to read
why: Whole-word vocabularies grow without limit and still miss new words; subwords cover every word with a fixed vocabulary.
q: In byte-pair encoding, which pair of neighbours is merged first?
- The pair that appears in the longest word
- The first pair in the text
* The pair that appears most often
- A random pair
why: BPE always merges the most frequent neighbouring pair, so common text gets short codes.
q: A document has 3,000 English words. About how many tokens is that?
- About 1,500
- About 3,000
* About 4,000
- About 12,000
why: One English word is about 1.33 tokens, and 3,000 times 1.33 is about 4,000.
q: A request has 50,000 input tokens and the price is 2 dollars per million input tokens. What does the input cost?
- 1 dollar
* 0.10 dollars
- 0.01 dollars
why: 50,000 times 2 is 100,000, and 100,000 divided by 1,000,000 is 0.10 dollars.
q: The sentence "the cat sat on the mat" gives ids [1820, 8415, 7731, 389, 279, 5634] in one tokenizer. Why do the two copies of "the" have different ids?
- The tokenizer made a mistake
* The second "the" has a space in front of it, and the space is part of the token
- The second "the" is a different word
why: The leading space belongs to the token, so "the" and " the" are different entries in the vocabulary.
:::

## Go further

Paste your own text into the OpenAI tokenizer page in the links and watch the pieces change colour. Read the tokenizer chapter of the Hugging Face LLM course for the full BPE algorithm with code. The next lesson, [Embeddings](/courses/ai-foundations/language-as-numbers/embeddings), takes the token ids you produced here and turns each one into a vector that carries meaning.
`,
      links: [
        { label: 'OpenAI tokenizer (interactive)', url: 'https://platform.openai.com/tokenizer', kind: 'docs' },
        { label: 'tiktoken on GitHub', url: 'https://github.com/openai/tiktoken', kind: 'repo' },
        { label: 'Hugging Face LLM course', url: 'https://huggingface.co/learn/llm-course', kind: 'course' },
        { label: 'Byte-pair encoding on Wikipedia', url: 'https://en.wikipedia.org/wiki/Byte-pair_encoding', kind: 'article' },
      ],
    },
    {
      slug: 'embeddings',
      title: 'Embeddings',
      summary: 'Turn each token into a vector, measure how similar two words are with cosine similarity, and build a sentence vector.',
      minutes: 20,
      objectives: [
        'Explain why a token id must become a vector before a model can use it.',
        'Compute the cosine similarity of two 2-dimensional word vectors by hand.',
        'Describe the word2vec idea in one paragraph.',
        'Build a sentence embedding by averaging word vectors.',
      ],
      keyTerms: ['embedding', 'embedding table', 'cosine similarity', 'word2vec', 'sentence embedding', 'semantic similarity'],
      body: `
## What this lesson covers

This lesson turns token ids into vectors called embeddings. You will give 5 words from "the cat sat on the mat" a 2-dimensional vector each, measure how close "cat" is to "mat", and average the vectors into one vector for the whole sentence. At the end you can explain why a search engine can find "kitten" when you type "cat".

## Why it matters

A token id is only a label. The id 2 for "cat" and the id 5 for "mat" say nothing about the fact that both are nouns and both appear in homes. An embedding is a vector of numbers that places similar words close together. Every language model starts with an embedding table, and the retrieval system you build in the project track searches documents by comparing embeddings. The next lesson, [Predicting the next word](/courses/ai-foundations/language-as-numbers/next-word-prediction), feeds these vectors into a model.

:::video
id: viZrOnJclY0
why: Watch the first 12 minutes. The video shows how word vectors are learned from neighbours and why "king" minus "man" plus "woman" lands near "queen".
:::

## The idea with an example

> **Analogy.** Think of a map of a country. Each town is a point with 2 numbers, how far east and how far north. Towns that are close on the map are close in real life. An embedding is a map of words. Each word is a point, and words with similar meaning sit close together. Nobody draws this map by hand. The model learns the positions from text.

Give each word in our sentence a 2-dimensional vector. A dimension is one of the numbers in the vector. For this lesson, read the first number as "how much this word is a thing" and the second as "how much this word is an action or position". Real embeddings have 300 to 4,000 dimensions and nobody can name what each one means, but the small version shows the mechanics.

:::anim
title: Words as arrows on a map, and how close two arrows point
axes ax @ 100,60 size: 440x420 x: 0,1 y: 0,1 xlabel: "thing-ness" ylabel: "action-ness"
vector the on ax from 0,0 to 0.1,0.1 color: grey label: "the (0.1, 0.1)"
vector cat on ax from 0,0 to 0.9,0.3 color: blue label: "cat (0.9, 0.3)"
vector mat on ax from 0,0 to 0.8,0.1 color: blue label: "mat (0.8, 0.1)"
vector sat on ax from 0,0 to 0.2,0.8 color: green label: "sat (0.2, 0.8)"
vector on on ax from 0,0 to 0.3,0.5 color: green label: "on (0.3, 0.5)"
text pair "cat and mat" @ 760,130 size: 22 color: yellow
num dotv = 0 @ 760,200 prefix: "dot product = " digits: 2 size: 26
text lens "lengths 0.949 and 0.806" @ 760,260 size: 18 color: grey
num cos = 0 @ 760,330 prefix: "cosine = " digits: 2 size: 32 color: green
text verdict "almost the same direction" @ 760,390 size: 18 color: green

step: Each word is an arrow on a map. The first number is thing-ness, the second is action-ness.
  show ax
  draw the
step: cat is (0.9, 0.3) and mat is (0.8, 0.1). Both are things, so both arrows point right.
  draw cat
  draw mat
step: sat is (0.2, 0.8) and on is (0.3, 0.5). Both arrows point up, away from the things.
  draw sat
  draw on
step: How close are cat and mat? Multiply matching numbers and add. The dot product is 0.75.
  dim the, sat, on
  show pair, dotv
  count dotv -> 0.75
step: Divide by both lengths, 0.949 and 0.806. The cosine is 0.98: the arrows point almost the same way.
  show lens
  show cos
  count cos -> 0.98
  show verdict
step: Compare cat with sat instead. The dot product is 0.42 and the cosine is 0.54: different directions.
  restore sat
  dim mat
  label pair "cat and sat"
  label lens "lengths 0.949 and 0.825"
  label verdict "different directions"
  color verdict orange
  count dotv -> 0.42
  & count cos -> 0.54
step: Two groups appear: things on the right, actions and positions above. Closeness in meaning is closeness between arrows.
  restore the, mat
  hide pair, dotv, lens, cos, verdict
  pulse cat, mat
  pulse sat, on
:::

| Word | Vector | Thing-ness | Action-ness |
| --- | --- | --- | --- |
| the | [0.1, 0.1] | low | low |
| cat | [0.9, 0.3] | high | low |
| sat | [0.2, 0.8] | low | high |
| on | [0.3, 0.5] | low | medium |
| mat | [0.8, 0.1] | high | low |

The embedding table is a lookup table with one row per token id. The model takes the id, reads the row, and gets the vector. The flow below shows that lookup.

:::flow
title: From text to vectors
Text -> Tokenizer: splits
Tokenizer -> Token ids: 1 2 3 4 1 5
Token ids -> Embedding table: reads one row per id
Embedding table -> Vectors: one vector per token
Vectors -> Model: processes the numbers
:::

How close are "cat" and "mat"? The standard measure is cosine similarity. Cosine similarity is a number from -1 to 1 that says how much two vectors point in the same direction. A value of 1 means the same direction, 0 means unrelated, and -1 means opposite. To compute it, divide the dot product of the two vectors by the product of their lengths. Press Next to compute it for "cat" and "mat".

:::scenario
title: Cosine similarity of cat and mat
state: cat=[0.9 0.3], mat=[0.8 0.1]
step: Compute the dot product. Multiply matching numbers and add: 0.9 times 0.8 plus 0.3 times 0.1.
state: dot=0.72 + 0.03 = 0.75
step: Compute the length of cat. Square each number, add, take the square root: sqrt(0.81 + 0.09) = sqrt(0.90).
state: length of cat=0.949
step: Compute the length of mat: sqrt(0.64 + 0.01) = sqrt(0.65).
state: length of mat=0.806
step: Divide the dot product by the product of the lengths: 0.75 divided by (0.949 times 0.806).
state: cosine=0.75 / 0.765 = 0.98
step: The result 0.98 is close to 1. The vectors of cat and mat point almost the same way.
:::

Now compare "cat" and "sat". The dot product is 0.9 times 0.2 plus 0.3 times 0.8, which is 0.18 plus 0.24, which is 0.42. The length of "sat" is the square root of 0.04 plus 0.64, which is 0.825. The cosine is 0.42 divided by 0.949 times 0.825, which is 0.54. The grid below shows all the pairs. Dark cells are similar pairs.

:::matrix
title: Cosine similarity between four words of the sentence
cols: cat, mat, sat, on
cat: 1.00, 0.98, 0.54, 0.76
mat: 0.98, 1.00, 0.36, 0.62
sat: 0.54, 0.36, 1.00, 0.96
on: 0.76, 0.62, 0.96, 1.00
:::

Two groups appear. The things "cat" and "mat" are close to each other. The action and position words "sat" and "on" are close to each other. The two groups are far apart. This is semantic similarity: closeness in meaning, measured as closeness between vectors.

## How it works

Where do the numbers come from? A model learns them. The classic method is word2vec, a 2013 method that learns word vectors by predicting neighbours. The idea has 4 steps:

1. Start with random vectors for every word in the vocabulary.
2. Take a word and its neighbours from real text. In "the cat sat on the mat", the neighbours of "sat" are "cat" and "on".
3. Nudge the vector of "sat" a little towards the vectors of its neighbours, and a little away from the vectors of random other words.
4. Repeat over billions of words.

After training, words that appear in the same places have similar vectors. "cat" and "dog" both appear after "the" and before "sat", so they end up close. The model never learns what a cat is. It learns where the word "cat" is used.

The cosine similarity formula is $\\cos(\\theta) = \\frac{a \\cdot b}{\\|a\\| \\, \\|b\\|}$. In words: the dot product of the two vectors, divided by the length of the first times the length of the second. The dot product of 2-dimensional vectors is $a_1 b_1 + a_2 b_2$: multiply the first numbers, multiply the second numbers, and add. The length of a vector is $\\sqrt{a_1^2 + a_2^2}$: square each number, add, and take the square root.

Why divide by the lengths? Because a long vector would otherwise look similar to everything. Division removes length and keeps only direction. Two words with vectors [0.9, 0.3] and [0.45, 0.15] have cosine 1.0, because the second is the first scaled by one half.

| Measure | Formula in words | Range | Used for |
| --- | --- | --- | --- |
| Dot product | multiply matching numbers, add | any number | raw scores, attention |
| Cosine similarity | dot product divided by both lengths | -1 to 1 | comparing meanings |
| Euclidean distance | square root of the sum of squared differences | 0 and up | clustering |

Here is the computation in NumPy. NumPy is the Python package for arrays of numbers.

:::code
lang: python
file: cosine.py
import numpy as np

table = {
    "the": np.array([0.1, 0.1]),
    "cat": np.array([0.9, 0.3]),
    "sat": np.array([0.2, 0.8]),
    "on": np.array([0.3, 0.5]),
    "mat": np.array([0.8, 0.1]),
}

def cosine(a, b):
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

print("cat vs mat:", round(cosine(table["cat"], table["mat"]), 2))
print("cat vs sat:", round(cosine(table["cat"], table["sat"]), 2))

sentence = "the cat sat on the mat".split(" ")
vectors = np.array([table[w] for w in sentence])
print("sentence vector:", vectors.mean(axis=0).round(2))
:::

:::code
lang: text
cat vs mat: 0.98
cat vs sat: 0.54
sentence vector: [0.4  0.32]
:::

The last 2 lines build a sentence embedding. A sentence embedding is one vector for a whole sentence. The simplest method is the average of the word vectors. Add the first numbers of all 6 words: 0.1 plus 0.9 plus 0.2 plus 0.3 plus 0.1 plus 0.8 is 2.4, and 2.4 divided by 6 is 0.40. Add the second numbers: 0.1 plus 0.3 plus 0.8 plus 0.5 plus 0.1 plus 0.1 is 1.9, and 1.9 divided by 6 is 0.32. The sentence vector is [0.40, 0.32]. Real systems use a transformer model to produce sentence embeddings, and the vector then carries word order too. The averaging method loses word order: "the cat sat on the mat" and "the mat sat on the cat" get the same vector.

Embedding models are also sold as a service. You send text and receive a vector with 1,024 or more dimensions. The project track uses one of these to index your documents.

## Try it

:::exercise
title: Compute a cosine similarity by hand
task: Use the table above. Compute the cosine similarity between "sat" [0.2, 0.8] and "on" [0.3, 0.5] by hand with a calculator. Then check your answer with the cosine function from the code block. The answer is about 0.96.
hint: Dot product: 0.2 times 0.3 plus 0.8 times 0.5. Length of sat: square root of 0.04 plus 0.64. Length of on: square root of 0.09 plus 0.25.
lang: text
solution:
dot = 0.2 * 0.3 + 0.8 * 0.5 = 0.06 + 0.40 = 0.46
length of sat = sqrt(0.04 + 0.64) = sqrt(0.68) = 0.825
length of on  = sqrt(0.09 + 0.25) = sqrt(0.34) = 0.583
cosine = 0.46 / (0.825 * 0.583) = 0.46 / 0.481 = 0.96
:::

Then change the vector of "the" to [0.5, 0.5] in the code and run it again. Watch how the sentence vector moves.

## Common mistakes

- Mistake: you compare embeddings from two different models. Fix: vectors only mean something inside the model that made them, so embed the query and the documents with the same model.
- Mistake: you use the dot product alone to compare meanings. Fix: divide by the lengths, or normalise every vector to length 1 first.
- Mistake: you believe the dimensions have names. Fix: our "thing-ness" labels are a teaching device; real dimensions are learned and unnamed.
- Mistake: you average word vectors and expect word order to survive. Fix: use a sentence embedding model when order matters.

## Check your understanding

:::quiz
title: Check: embeddings
q: Why does a model need embeddings instead of token ids alone?
- Ids are too large to store
* Ids carry no information about meaning, and vectors can place similar words close together
- Vectors are faster to read from disk
why: An id is a label; the embedding vector gives the model numbers whose closeness reflects similarity in use.
q: Two vectors are [2, 0] and [4, 0]. What is their cosine similarity?
- 0.5
- 8
* 1.0
- 0
why: Both vectors point in exactly the same direction; cosine ignores length, so the answer is 1.
q: A word2vec model is trained on a large text. Why do "cat" and "dog" end up with similar vectors?
- The training data contains a dictionary that says they are both animals
* They appear in similar positions, next to similar neighbours
- Short words always get similar vectors
why: word2vec only sees neighbours; words used in the same contexts are pushed to the same region.
q: You average word vectors to get a sentence vector. Which pair of sentences gets the same vector?
* "the cat sat on the mat" and "the mat sat on the cat"
- "the cat sat" and "the cat ran"
- "a cat" and "the cat"
why: Averaging ignores order, so any two sentences with the same words in any order give the same mean.
q: Cosine similarity of "cat" and "sat" is 0.54 while "cat" and "mat" is 0.98. What does this tell you?
- "sat" is a misspelling of "cat"
* The vectors of "cat" and "mat" point in a much more similar direction than "cat" and "sat"
- "cat" appears more often than "sat"
why: Cosine measures direction only; a higher value means the two words are closer in the embedding space.
:::

## Go further

Read the Illustrated Word2vec by Jay Alammar for pictures of the training step. The 3Blue1Brown video in the links shows the same vectors inside a large language model. The next lesson, [Predicting the next word](/courses/ai-foundations/language-as-numbers/next-word-prediction), uses the vectors to guess which word comes after "the cat sat on the".
`,
      links: [
        { label: 'The Illustrated Word2vec (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-word2vec/', kind: 'article' },
        { label: 'Hugging Face LLM course', url: 'https://huggingface.co/learn/llm-course', kind: 'course' },
        { label: 'Cosine similarity on Wikipedia', url: 'https://en.wikipedia.org/wiki/Cosine_similarity', kind: 'article' },
        { label: 'Efficient Estimation of Word Representations in Vector Space (word2vec, 2013)', url: 'https://arxiv.org/abs/1301.3781', kind: 'paper' },
      ],
    },
    {
      slug: 'next-word-prediction',
      title: 'Predicting the next word',
      summary: 'Count word pairs in a tiny corpus to predict the next word, see why counting breaks, and meet the neural language model and sampling.',
      minutes: 20,
      objectives: [
        'Compute next-word probabilities from bigram counts on a tiny corpus.',
        'Explain why a counting model fails on word pairs it has never seen.',
        'Describe how a neural language model replaces the count table.',
        'Generate text by sampling from a probability table.',
      ],
      keyTerms: ['language model', 'corpus', 'n-gram', 'bigram', 'logit', 'softmax', 'sampling', 'greedy decoding'],
      body: `
## What this lesson covers

This lesson builds a language model, a program that gives a probability to the next word. You will count word pairs in a corpus of 3 sentences, turn the counts into probabilities, and generate new text from them. Then you will see why a neural network does the same job better.

## Why it matters

Every large language model is a next-word predictor. ChatGPT, Claude and every open model produce text one token at a time, and each token comes from a probability table. If you understand the counting model in this lesson, you understand the shape of the output of every model you will ever call. The next lesson, [Attention and the transformer, gently](/courses/ai-foundations/language-as-numbers/attention-gently), explains how the modern model computes the table.

:::video
id: LPZh9BOjkQs
why: Watch all 8 minutes. The video shows a model predicting one word at a time and explains the probability table in pictures.
:::

## The idea with an example

> **Analogy.** A friend finishes your sentences. When you say "the cat sat on the", your friend says "mat" before you do. The friend is not reading your mind. The friend has heard that phrase many times and knows what usually comes next. A language model is this friend, trained on a very large amount of text.

A corpus is the collection of text a model learns from. Our corpus has 3 sentences:

1. the cat sat on the mat
2. the cat sat on the rug
3. the dog sat on the mat

:::anim
title: Count what follows, turn counts into probabilities, sample, repeat
text corpus "the cat sat on the mat|the cat sat on the rug|the dog sat on the mat" @ 190,150 size: 18
text ask "After the, what comes next?" @ 190,290 size: 18 color: yellow
text total "the appears 6 times" @ 190,340 size: 16 color: grey
rect r1 @ 520,120 size: 120x50 "cat"
rect r2 @ 520,190 size: 120x50 "dog"
rect r3 @ 520,260 size: 120x50 "mat"
rect r4 @ 520,330 size: 120x50 "rug"
num n1 = 0 @ 640,120 size: 24
num n2 = 0 @ 640,190 size: 24
num n3 = 0 @ 640,260 size: 24
num n4 = 0 @ 640,330 size: 24
num p1 = 0 @ 780,120 prefix: "p = " digits: 2 size: 24 color: green
num p2 = 0 @ 780,190 prefix: "p = " digits: 2 size: 24 color: green
num p3 = 0 @ 780,260 prefix: "p = " digits: 2 size: 24 color: green
num p4 = 0 @ 780,330 prefix: "p = " digits: 2 size: 24 color: green
text out "the" @ 480,450 size: 26 color: green
dot pick @ 520,120 r: 9 color: yellow
dot pick2 @ 520,330 r: 9 color: yellow

step: The corpus is 3 sentences. The model counts which word follows which word.
  show corpus
step: To predict the word after the, count every neighbour pair that starts with the.
  show ask, r1, r2, r3, r4, n1, n2, n3, n4
  count n1 -> 2
  & count n2 -> 1
  & count n3 -> 2
  & count n4 -> 1
step: the appears 6 times. Divide each count by 6. The 4 probabilities add up to 1.
  show total, p1, p2, p3, p4
  count p1 -> 0.33
  & count p2 -> 0.17
  & count p3 -> 0.33
  & count p4 -> 0.17
step: Sample one word with these probabilities. Suppose the sample is cat. Append it to the text.
  show out
  highlight r1
  show pick
  move pick -> 480,450
  hide pick
  label out "the cat"
  restore r1
step: The last word is cat. Its only next word in the corpus is sat, so the probability is 1.0.
  hide r2, r3, r4, n2, n3, n4, p2, p3, p4
  label ask "After cat, what comes next?"
  label total "cat appears 2 times"
  label r1 "sat"
  count p1 -> 1
  label out "the cat sat"
step: After sat comes on, then the, each with probability 1.0. The text grows one word at a time.
  label ask "After sat, what comes next?"
  label total "sat appears 3 times"
  label r1 "on"
  count n1 -> 3
  label out "the cat sat on"
  label ask "After on, what comes next?"
  label total "on appears 3 times"
  label r1 "the"
  label out "the cat sat on the"
step: Back at the, sample again. This time the sample is rug. The sentence is complete.
  label ask "After the, what comes next?"
  label total "the appears 6 times"
  label r1 "cat"
  count n1 -> 2
  & count p1 -> 0.33
  show r2, r3, r4, n2, n3, n4, p2, p3, p4
  highlight r4
  show pick2
  move pick2 -> 480,450
  hide pick2
  label out "the cat sat on the rug"
step: With other samples it writes the dog sat on the rug, a sentence it never saw.
  restore r4
  label out "the dog sat on the rug"
  color out yellow
  pulse out
:::

The simplest model counts bigrams. A bigram is a pair of neighbouring words. An n-gram is a run of n neighbouring words, so a bigram is an n-gram with n equal to 2. To predict the word after "the", count every bigram that starts with "the".

| Previous word | Next word | Count | Probability |
| --- | --- | --- | --- |
| the | cat | 2 | 2 / 6 = 0.33 |
| the | dog | 1 | 1 / 6 = 0.17 |
| the | mat | 2 | 2 / 6 = 0.33 |
| the | rug | 1 | 1 / 6 = 0.17 |

The word "the" appears 6 times in the corpus. After it comes "cat" 2 times, "dog" 1 time, "mat" 2 times and "rug" 1 time. Divide each count by 6 to get a probability. The 4 probabilities add up to 1. Some rows are certain: after "sat" comes "on" 3 times out of 3, so the probability of "on" after "sat" is 1.0.

The flow below shows how the model generates text. It looks at the last word, reads the probability row, picks a word, writes it, and repeats.

:::flow
title: Generating text one word at a time
Last word -> Count table: look up the row
Count table -> Probabilities: divide by the row total
Probabilities -> Pick: sample one word
Pick -> Output text: append the word
Output text -> Last word: the new word becomes the context
:::

Press Next to generate a sentence. The picks are sampled, which means random choices that follow the probabilities.

:::scenario
title: Generating a sentence from bigram counts
state: text=the, last word=the
step: Read the row for "the": cat 0.33, dog 0.17, mat 0.33, rug 0.17. Sample a word. Suppose the sample is "cat".
state: text=the cat, last word=cat
step: Read the row for "cat". The only next word in the corpus is "sat", probability 1.0.
state: text=the cat sat, last word=sat
step: Read the row for "sat". The only next word is "on", probability 1.0.
state: text=the cat sat on, last word=on
step: Read the row for "on". The only next word is "the", probability 1.0.
state: text=the cat sat on the, last word=the
step: Read the row for "the" again. Sample. This time suppose the sample is "rug".
state: text=the cat sat on the rug, last word=rug
step: "rug" ends a sentence in the corpus, so stop. The model wrote a sentence that exists in the corpus. With other samples it could write "the dog sat on the rug", which does not exist.
:::

Already the model can produce a sentence it never saw: "the dog sat on the rug". This is the first hint that a language model does more than copy.

## How it works

The counting model has 2 problems. First, it gives probability 0 to anything it never saw. The bigram "the bird" has count 0, so the model says a bird can never follow "the". Second, the table explodes. With 2 words of context the table needs one row per pair of words. With a vocabulary of 50,000 words that is 2.5 billion rows, and most rows are empty. With 10 words of context the table is larger than every computer on Earth.

A neural language model fixes both problems. Instead of a table, it uses a neural network that takes the context and outputs a score for every word in the vocabulary. The steps are:

1. Turn each context word into its embedding vector, as in the previous lesson.
2. Pass the vectors through the network. The output is one number per vocabulary word. These raw numbers are called logits.
3. Apply softmax to the logits. Softmax turns any list of numbers into probabilities that are positive and add up to 1.
4. Pick the next word from the probabilities.

Because similar words have similar vectors, the network that learned "the cat sat" will also give a sensible score to "the dog sat" and even "the bird sat". It fills the empty rows of the table by similarity.

Compute softmax by hand on a vocabulary of 4 words. Suppose the network outputs the logits in the table.

| Word | Logit | exp(logit) | Probability |
| --- | --- | --- | --- |
| cat | 2.0 | 7.39 | 7.39 / 20.22 = 0.37 |
| mat | 2.0 | 7.39 | 7.39 / 20.22 = 0.37 |
| dog | 1.0 | 2.72 | 2.72 / 20.22 = 0.13 |
| rug | 1.0 | 2.72 | 2.72 / 20.22 = 0.13 |

The softmax formula is $p_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}}$. In words: raise e to the power of each logit, then divide each result by the sum of all results. The sum here is 7.39 plus 7.39 plus 2.72 plus 2.72, which is 20.22. The 4 probabilities add up to 1, and higher logits give higher probabilities.

The last step is sampling. Sampling means picking a word at random with the given probabilities. Greedy decoding instead always takes the highest probability. Greedy decoding gives the same text every time and often repeats itself. Sampling gives variety. The lesson [Temperature and sampling](/courses/ai-foundations/using-models/sampling-and-temperature) shows how to tune the randomness.

Here is the whole counting model in Python.

:::code
lang: python
file: bigram.py
import random
from collections import defaultdict

corpus = [
    "the cat sat on the mat",
    "the cat sat on the rug",
    "the dog sat on the mat",
]

counts = defaultdict(lambda: defaultdict(int))
for sentence in corpus:
    words = sentence.split(" ") + ["END"]
    for prev, nxt in zip(words, words[1:]):
        counts[prev][nxt] += 1

def probabilities(prev):
    row = counts[prev]
    total = sum(row.values())
    return {w: c / total for w, c in row.items()}

print("after the:", probabilities("the"))

random.seed(4)
word = "the"
out = [word]
while word != "END":
    row = probabilities(word)
    word = random.choices(list(row), weights=list(row.values()))[0]
    out.append(word)
print(" ".join(out[:-1]))
:::

:::code
lang: text
after the: {'cat': 0.3333333333333333, 'mat': 0.3333333333333333, 'rug': 0.16666666666666666, 'dog': 0.16666666666666666}
the cat sat on the cat sat on the rug
:::

The special token END marks the end of a sentence. Real models have an end token too, and they stop when they sample it. The call random.seed(4) fixes the random choices so you get the same output every run. With seed 4 the model writes "the cat sat on the cat sat on the rug", a sentence that is not in the corpus. After the second "the" it sampled "cat" instead of a sentence ending. Change the seed to 1 and it writes "the cat sat on the mat".

## Try it

:::exercise
title: Extend the corpus
task: Add the sentence "the cat ran on the mat" to the corpus list. Before you run the code, predict by hand the new probability of "sat" after "cat" and the new row for "the". Then run the code and check. The probability of "sat" after "cat" should be 2 / 3 = 0.67.
hint: Count how many times "cat" appears across all 4 sentences and how many of those are followed by "sat". For "the", count all 8 appearances and what follows each one.
lang: text
solution:
After cat: sat 2 times, ran 1 time, so sat = 2/3 = 0.67 and ran = 1/3 = 0.33.
After the: cat 3, dog 1, mat 3, rug 1, out of 8.
cat = 0.375, dog = 0.125, mat = 0.375, rug = 0.125.
:::

## Common mistakes

- Mistake: you think the model picks the most likely word every time. Fix: most systems sample, so the output changes between runs unless you fix the seed.
- Mistake: you believe the model looks up sentences it has stored. Fix: it computes a probability for every word from the context; it can produce sentences that never appeared.
- Mistake: you forget that probabilities in one row must add to 1. Fix: always divide by the row total, or apply softmax.
- Mistake: you give a counting model a long context and expect it to work. Fix: the table grows too fast; a neural model generalises by similarity instead.

## Check your understanding

:::quiz
title: Check: next-word prediction
q: In the 3-sentence corpus, what is the probability of "mat" after "the"?
- 2 / 3
* 2 / 6
- 1 / 6
- 2 / 4
why: "the" appears 6 times and is followed by "mat" 2 times, so the probability is 2 / 6, which is about 0.33.
q: Why does a bigram model give probability 0 to "the bird"?
* The pair never appeared in the corpus, so its count is 0
- "bird" is not a real word
- Bigram models cannot represent nouns
why: Counting models can only assign probability to pairs they have counted; unseen pairs get 0.
q: The logits for 3 words are [3.0, 1.0, 1.0]. Which statement about the softmax output is true?
- All three probabilities are equal
- The first probability is 3 times the second
* The first probability is the largest and all three add up to 1
- The first probability is exactly 0.6
why: Softmax keeps the order of the logits and normalises the outputs so they sum to 1; the exact value here is about 0.79.
q: A neural language model sees "the bird sat" for the first time. Why can it still give a sensible next-word probability?
- It stores every possible sentence
* "bird" has an embedding close to "cat" and "dog", so the network treats it similarly
- It asks a human
why: The network maps similar vectors to similar outputs, which fills gaps that a count table leaves empty.
q: You run the bigram program twice with different seeds. What changes?
- The probability table
* The sampled sentence
- The corpus
why: The counts and probabilities are fixed by the corpus; only the random picks depend on the seed.
:::

## Go further

The Karpathy video in the links builds this exact bigram model in code and then grows it into a neural network. The Hugging Face course has a chapter on causal language modelling. The next lesson, [Attention and the transformer, gently](/courses/ai-foundations/language-as-numbers/attention-gently), shows the network that modern models use to turn a context into logits.
`,
      links: [
        { label: 'Intro to Large Language Models (Karpathy)', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g', kind: 'video' },
        { label: 'Hugging Face LLM course', url: 'https://huggingface.co/learn/llm-course', kind: 'course' },
        { label: 'n-gram language models on Wikipedia', url: 'https://en.wikipedia.org/wiki/Word_n-gram_language_model', kind: 'article' },
        { label: 'Softmax function on Wikipedia', url: 'https://en.wikipedia.org/wiki/Softmax_function', kind: 'article' },
      ],
    },
    {
      slug: 'attention-gently',
      title: 'Attention and the transformer, gently',
      summary: 'Compute attention for 3 tokens with 2-dimensional vectors, and see why letting every token look at every other token beats reading left to right.',
      minutes: 24,
      objectives: [
        'Explain the roles of query, key and value with an everyday analogy.',
        'Compute attention weights for a 3-token sentence by hand.',
        'Describe why attention beats a left-to-right chain for long text.',
        'Name the parts of a transformer block and what each one does.',
      ],
      keyTerms: ['attention', 'query', 'key', 'value', 'softmax', 'transformer', 'causal mask'],
      body: `
## What this lesson covers

This lesson explains attention, the operation that lets each token in a sentence look at the other tokens. You will compute every number for the 3 tokens "the cat sat" with 2-dimensional vectors. Then you will see how attention fits inside the transformer, the network behind every modern language model.

## Why it matters

The previous lesson said a neural network turns the context into logits. Attention is the part of that network that decides which earlier words matter for the next prediction. When the model reads "the cat sat on the", it needs to know that "cat" is the thing that sat, so "mat" is a better guess than "sky". Attention finds that link. The cost of attention also sets the cost of every request you make. The next lesson, [How an LLM is made](/courses/ai-foundations/language-as-numbers/how-an-llm-is-made), stacks many attention layers and trains them on the internet.

:::video
id: eMlx5fFNoYc
why: Watch the first 12 minutes. It animates the query, key and value vectors with the same colours this lesson uses in words.
:::

## The idea with an example

> **Analogy.** You walk into a library with a question written on a card. That card is your query. Every book has a label on its spine. Each label is a key. You compare your card with every label and take the books whose labels match best. Inside the chosen books is the content you take home. That content is the value. Attention is this search, done with vectors, for every token at once.

Take the 3 tokens "the", "cat" and "sat" with the embeddings from the embeddings lesson: the is [0.1, 0.1], cat is [0.9, 0.3], sat is [0.2, 0.8]. The model makes 3 vectors from each embedding: a query, a key and a value. It makes them with 3 learned 2 by 2 matrices. To keep every number visible, this lesson uses tiny matrices.

:::anim
title: The token sat asks who sat: query, keys, weights, new vector
rect t1 @ 220,100 size: 230x76 "the|(0.1, 0.1)" color: blue
rect t2 @ 480,100 size: 230x76 "cat|(0.9, 0.3)" color: purple
rect t3 @ 740,100 size: 230x76 "sat|(0.2, 0.8)" color: teal
rect k1 @ 220,150 size: 230x64 "the key|(0.1, 0.1)" color: blue
rect k2 @ 480,150 size: 230x64 "cat key|(0.3, 0.9)" color: purple
rect k3 @ 740,150 size: 230x64 "sat key|(0.8, 0.2)" color: teal
text knote "Keys swap the two numbers" @ 480,40 size: 22 color: grey
rect q @ 480,300 size: 280x68 "query of sat|(0.2, 0.8)" color: orange
num s1 = 0 @ 220,300 prefix: "score " digits: 2 size: 28 color: blue
num s2 = 0 @ 480,300 prefix: "score " digits: 2 size: 28 color: purple
num s3 = 0 @ 740,300 prefix: "score " digits: 2 size: 28 color: teal
num w1 = 0.26 @ 220,390 prefix: "weight " digits: 2 size: 28 color: blue
num w2 = 0.43 @ 480,390 prefix: "weight " digits: 2 size: 28 color: purple
num w3 = 0.31 @ 740,390 prefix: "weight " digits: 2 size: 28 color: teal
text wnote "Softmax · positive weights that add up to 1" @ 480,475 size: 22 color: grey
rect v1 @ 220,390 size: 230x76 "0.26 × (0.1, 0.1)|(0.026, 0.026)" color: blue
rect v2 @ 480,390 size: 230x76 "0.43 × (0.9, 0.3)|(0.387, 0.129)" color: purple
rect v3 @ 740,390 size: 230x76 "0.31 × (0.2, 0.8)|(0.062, 0.248)" color: teal
text share1 "26% · the" @ 220,290 size: 26 color: blue
text share2 "43% · cat" @ 480,290 size: 26 color: purple
text share3 "31% · sat" @ 740,290 size: 26 color: teal
rect bar1 @ 220,330 size: 104x24 color: blue
rect bar2 @ 480,330 size: 172x24 color: purple
rect bar3 @ 740,330 size: 124x24 color: teal
rect out @ 480,490 size: 340x64 "new sat ≈ (0.47, 0.40)" color: purple

step: Three tokens: the, cat and sat. Each token starts as its embedding vector.
  show t1, t2, t3
step: Each token makes a key, the label on its spine. The key matrix swaps the 2 numbers.
  show knote
  morph t1 -> k1
  & morph t2 -> k2
  & morph t3 -> k3
step: The token sat asks: who sat? Its query is its own vector, (0.2, 0.8).
  show q
  pulse k3
step: The dot product of the query with each key gives a score: 0.10, 0.78 and 0.32.
  arrow aq1 = q -> k1
  & arrow aq2 = q -> k2
  & arrow aq3 = q -> k3
  hide q, aq1, aq2, aq3
  show s1, s2, s3
  count s1 -> 0.10
  & count s2 -> 0.78
  & count s3 -> 0.32
step: Divide by the square root of 2 and apply softmax. The weights 0.26, 0.43 and 0.31 add up to 1.
  show wnote
  morph s1 -> w1
  & morph s2 -> w2
  & morph s3 -> w3
  pulse w2
step: Multiply each value by its weight and add them. The new vector for sat is about (0.47, 0.40).
  hide wnote
  morph w1 -> v1
  & morph w2 -> v2
  & morph w3 -> v3
  move v1 -> 400,490
  & move v2 -> 480,490
  & move v3 -> 560,490
  hide v1, v2, v3
  show share1, share2, share3, bar1, bar2, bar3
  show out
  pulse out
step: sat now carries 43 percent of cat, so it knows who sat. Every token updates in one step.
  highlight out
  pulse k2
:::

The weights displayed in the animation are rounded. The final vector uses the full-precision weights, giving approximately (0.47, 0.40).

| Vector | Matrix | What it does | Result for the | Result for cat | Result for sat |
| --- | --- | --- | --- | --- | --- |
| Query q | identity | keeps the vector as it is | [0.1, 0.1] | [0.9, 0.3] | [0.2, 0.8] |
| Key k | swap rows | swaps the 2 numbers | [0.1, 0.1] | [0.3, 0.9] | [0.8, 0.2] |
| Value v | identity | keeps the vector as it is | [0.1, 0.1] | [0.9, 0.3] | [0.2, 0.8] |

The identity matrix is [[1, 0], [0, 1]] and leaves a vector unchanged. The swap matrix is [[0, 1], [1, 0]] and exchanges the 2 numbers. Why swap for the keys? Our second dimension means "action-ness". After the swap, a word with high action-ness gets a key with a high first number, which matches queries with high thing-ness. In plain words: a verb now looks for its subject. A real model learns matrices that do far more, but the mechanics are the same.

Now compute the attention of the token "sat". Its query is [0.2, 0.8]. Compare it with all 3 keys using the dot product. Press Next to follow each step.

:::scenario
title: Attention for the token sat
state: q_sat=[0.2 0.8], k_the=[0.1 0.1], k_cat=[0.3 0.9], k_sat=[0.8 0.2]
step: Dot product of the query with each key. the: 0.02 + 0.08 = 0.10. cat: 0.06 + 0.72 = 0.78. sat: 0.16 + 0.16 = 0.32.
state: scores=[0.10 0.78 0.32]
step: Divide each score by the square root of the vector size. The size is 2, and sqrt(2) is 1.41.
state: scaled=[0.07 0.55 0.23]
step: Apply softmax. exp gives [1.07 1.73 1.26], the sum is 4.06, so divide each by 4.06.
state: weights=[0.26 0.43 0.31]
step: Multiply each value by its weight and add. 0.26 times [0.1 0.1] plus 0.43 times [0.9 0.3] plus 0.31 times [0.2 0.8].
state: output=[0.03+0.38+0.06 0.03+0.13+0.25]=about [0.47 0.40]
step: The output for sat is about [0.47 0.40]. It is a mix of all 3 tokens, with the most weight on cat. The token sat now carries information about who sat.
:::

The output [0.47, 0.40] replaces the old vector of "sat". The new vector has more thing-ness than before, because it absorbed 43 percent of "cat". That is what attention does: it updates each token with a weighted mix of the others.

Models that generate text use a causal mask. A causal mask is a rule that stops a token from looking at tokens that come after it, because at generation time those tokens do not exist yet. With the mask, "the" can only look at itself, "cat" can look at "the" and "cat", and "sat" can look at all 3. The grid shows the full weight table with the mask. Each row adds up to 1.

:::matrix
title: Attention weights for the cat sat with a causal mask
cols: the, cat, sat
the: 1.00, 0, 0
cat: 0.43, 0.57, 0
sat: 0.26, 0.43, 0.31
:::

Check the "cat" row yourself. Its query is [0.9, 0.3]. The dot product with k_the is 0.09 plus 0.03, which is 0.12. The dot product with k_cat is 0.27 plus 0.27, which is 0.54. Scaled by 1.41 they are 0.085 and 0.38. The exponentials are 1.09 and 1.46, the sum is 2.55, and the weights are 0.43 and 0.57.

## How it works

The general procedure for a sequence of tokens:

1. Multiply every embedding by the query matrix, the key matrix and the value matrix. This gives one query, one key and one value per token.
2. For each query, take the dot product with every key. This gives a score for every pair of tokens.
3. Divide the scores by the square root of the vector size. This keeps the numbers from growing too large when vectors are long.
4. Apply the causal mask by setting scores for future tokens to minus infinity, which softmax turns into 0.
5. Apply softmax to each row so the weights are positive and add to 1.
6. Multiply each value by its weight and add them up. This is the new vector for the token.

The formula is $\\mathrm{Attention}(Q, K, V) = \\mathrm{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right) V$. In words: multiply the queries by the transposed keys to get all scores at once, divide by the square root of the vector size, apply softmax to each row, and multiply by the values. The matrices Q, K and V stack the vectors of all tokens as rows.

Why does this beat reading left to right? Older models read one token at a time and carried a single memory vector forward. Information about the first word had to survive every step to reach the last word, and it often did not. Attention connects every pair of tokens in one step. The path from "cat" to "mat" has length 1, however many words sit between them. The price is that the model computes a score for every pair, so the work grows with the square of the length. For 1,000 tokens that is 1 million scores per layer.

| Method | Path from token 1 to token 1,000 | Work per layer | Runs in parallel |
| --- | --- | --- | --- |
| Left-to-right chain | 999 steps | grows with length | no |
| Attention | 1 step | grows with length squared | yes |

A transformer is a stack of blocks. Each block has an attention layer followed by a small feed-forward network. A feed-forward network is the plain neural network from the earlier module, applied to each token on its own. Attention moves information between tokens; the feed-forward network processes each token. Real models stack 30 to 100 blocks, and each attention layer runs several heads, which are independent copies of the computation above with their own matrices.

:::flow
title: One transformer block inside a language model
Token ids -> Embeddings: lookup
Embeddings -> Attention: tokens look at each other
Attention -> Feed-forward: each token on its own
Feed-forward -> Next block: repeat 30 to 100 times
Next block -> Logits: one score per vocabulary word
Logits -> Softmax: probabilities for the next token
:::

Here is the 3-token computation in NumPy, with every number from the scenario.

:::code
lang: python
file: attention3.py
import numpy as np

X = np.array([[0.1, 0.1],   # the
              [0.9, 0.3],   # cat
              [0.2, 0.8]])  # sat

W_q = np.array([[1, 0], [0, 1]])
W_k = np.array([[0, 1], [1, 0]])
W_v = np.array([[1, 0], [0, 1]])

Q, K, V = X @ W_q, X @ W_k, X @ W_v
scores = Q @ K.T / np.sqrt(2)

mask = np.triu(np.ones((3, 3)), k=1).astype(bool)
scores[mask] = -np.inf

weights = np.exp(scores) / np.exp(scores).sum(axis=1, keepdims=True)
print("weights:")
print(weights.round(2))
print("output for sat:", (weights @ V)[2].round(2))
:::

:::code
lang: text
weights:
[[1.   0.   0.  ]
 [0.43 0.57 0.  ]
 [0.26 0.43 0.31]]
output for sat: [0.47 0.4 ]
:::

The line with np.triu builds the causal mask: it marks every cell above the diagonal, and the next line sets those scores to minus infinity. Remove those 2 lines and every token can see every other token, which is what an embedding model does when it reads a whole document at once.

## Try it

:::exercise
title: Attention without the mask
task: Remove the mask and compute the full attention row for the query of "cat" [0.9, 0.3] against all 3 keys by hand. Use the keys k_the [0.1, 0.1], k_cat [0.3, 0.9], k_sat [0.8, 0.2]. Scale by 1.41 and apply softmax. The answer is about [0.25, 0.34, 0.41].
hint: Dot products: 0.12, 0.54, 0.78. Divide each by 1.41, take exp, divide by the sum.
lang: text
solution:
scores  = [0.12, 0.54, 0.78]
scaled  = [0.085, 0.38, 0.55]
exp     = [1.09, 1.46, 1.73]
sum     = 4.28
weights = [0.25, 0.34, 0.41]
Without the mask, cat attends most to sat, the verb that follows it.
:::

## Common mistakes

- Mistake: you confuse keys with values. Fix: keys decide how much weight each token gets, values are the content that gets mixed.
- Mistake: you apply softmax down the columns. Fix: apply softmax across each row, so each query gets weights that add to 1.
- Mistake: you forget the scale factor. Fix: divide by the square root of the vector size before softmax; with 2-dimensional vectors that is 1.41.
- Mistake: you think attention has no cost. Fix: the score table has one cell per pair of tokens, so doubling the text multiplies the attention work by 4.
- Mistake: you believe the identity and swap matrices are what real models use. Fix: real models learn their matrices from data; the tiny ones here only make the numbers easy.

## Check your understanding

:::quiz
title: Check: attention
q: In the library analogy, which vector is the label on a book spine?
- The query
* The key
- The value
why: Keys are compared with the query to decide which tokens to read from, like labels compared with a question.
q: Three scaled scores are [0, 0, 0]. What are the attention weights after softmax?
- [0, 0, 0]
* [0.33, 0.33, 0.33]
- [1, 0, 0]
- [0, 0, 1]
why: Equal scores give equal exponentials, and softmax divides by the sum, so each weight is one third.
q: Why does a language model use a causal mask?
- To save memory
* So a token cannot use information from tokens that come after it, which do not exist at generation time
- To make the weights add up to 1
why: The model generates left to right, so training must hide the future from each position.
q: Text has 500 tokens. The model is given 1,000 tokens instead. By how much does the attention score work grow?
- It stays the same
- It doubles
* It grows 4 times
- It grows 1,000 times
why: Attention computes one score per pair of tokens, so the work grows with the square of the length, and 2 squared is 4.
q: After attention, the vector for "sat" became [0.47, 0.40] instead of [0.2, 0.8]. What happened?
- The model made an error
* The token absorbed a weighted mix of the other tokens, mostly cat
- The embedding table changed
why: The output of attention is the weighted sum of the values, so sat now carries information about its subject.
:::

## Go further

Read the Illustrated Transformer by Jay Alammar for pictures of every step with 2 tokens. The 3Blue1Brown transformer video and the StatQuest video in the links repeat the same computation with different drawings. The next lesson, [How an LLM is made](/courses/ai-foundations/language-as-numbers/how-an-llm-is-made), takes this network and trains it on trillions of tokens.
`,
      links: [
        { label: 'The Illustrated Transformer (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-transformer/', kind: 'article' },
        { label: 'Attention Is All You Need (Vaswani et al., 2017)', url: 'https://arxiv.org/abs/1706.03762', kind: 'paper' },
        { label: 'Transformers, the tech behind LLMs (3Blue1Brown)', url: 'https://www.youtube.com/watch?v=wjZofJX0v4M', kind: 'video' },
        { label: 'Transformer Neural Networks clearly explained (StatQuest)', url: 'https://www.youtube.com/watch?v=zxQyTK8quyY', kind: 'video' },
      ],
    },
    {
      slug: 'how-an-llm-is-made',
      title: 'How an LLM is made and what it cannot do',
      summary: 'Follow a model from raw internet text through pretraining, fine-tuning and human feedback, then learn its 3 hard limits: the context window, hallucination and the knowledge cutoff.',
      minutes: 22,
      objectives: [
        'Describe the 3 training stages of a large language model and what each one adds.',
        'Explain what the context window is and compute whether a document fits in it.',
        'Explain why a model hallucinates and what the knowledge cutoff means.',
        'Choose a mitigation for each limit before you build with a model.',
      ],
      keyTerms: ['large language model', 'pretraining', 'fine-tuning', 'RLHF', 'context window', 'hallucination', 'knowledge cutoff'],
      body: `
## What this lesson covers

This lesson follows a large language model from raw text to a chat assistant. You will see the 3 training stages: pretraining, fine-tuning and learning from human feedback. Then you will meet the 3 limits that every builder must design around: the context window, hallucination and the knowledge cutoff.

## Why it matters

You now know the parts: tokens, embeddings, next-word prediction and attention. This lesson shows how the parts become a product. More important, it shows where the product fails. Every system in the project track exists to work around one of these limits. Retrieval works around the context window and the knowledge cutoff. Evaluation works around hallucination. The next module, [Prompting that works](/courses/ai-foundations/using-models/prompting), starts using the finished model.

:::video
id: zjkBMFhNj_g
why: Watch the first 25 minutes. Andrej Karpathy explains pretraining and fine-tuning with the same 3 stages this lesson uses, and shows what a model's weights look like on disk.
:::

## The idea with an example

> **Analogy.** Think of a student who learns a trade. First, the student reads every book in the library for years. That is pretraining: wide knowledge, no manners. Next, a teacher shows the student 10,000 worked examples of good answers. That is fine-tuning: the student learns the format of a helpful reply. Last, customers rate the answers and the student adjusts towards the ones people prefer. That is learning from human feedback. The student is now useful, but still only knows what was in the library on the day they stopped reading.

A large language model (LLM) is a transformer with billions of parameters trained to predict the next token on a very large corpus. A parameter is one learned number in the network. The architecture below shows the 3 stages and what flows between them. Press the path to watch raw text become a chat reply.

:::arch
title: The LLM training pipeline
layer: Data | Web text, Books and code, Instruction pairs, Human ratings
layer: Training | Pretraining, Fine-tuning, Preference tuning
layer: Models | Base model, Instruct model, Chat model
layer: Serving | Chat app
flow: Web text -> Pretraining -> Base model -> Fine-tuning -> Instruct model -> Preference tuning -> Chat model -> Chat app
note: Pretraining = predict the next token on trillions of tokens
note: Preference tuning = reinforcement learning from human feedback (RLHF) or a direct method such as DPO
:::

Stage 1 is pretraining. The model reads trillions of tokens from the web, books and code. For each position it predicts the next token, compares its guess with the real token, and nudges its parameters to make the real token more likely. This is the learning loop from earlier in the track, run billions of times. The output is a base model. A base model continues text. If you type "the cat sat on the", it writes "mat". If you type a question, it may write 3 more questions, because that is what text on the web often does.

Stage 2 is fine-tuning. Fine-tuning is further training on a small, chosen data set. Here the data is tens of thousands of instruction pairs: a prompt and an ideal response written by people. The model learns the shape of a helpful answer. The output is an instruct model.

Stage 3 is preference tuning. People compare 2 answers to the same prompt and pick the better one. The method called reinforcement learning from human feedback (RLHF) trains a reward model on those choices, then trains the LLM to score well on the reward model. Direct preference optimisation (DPO) reaches a similar result without the reward model. The output is the chat model you talk to.

| Stage | Data | Size of data | What the model learns | Output |
| --- | --- | --- | --- | --- |
| Pretraining | web, books, code | trillions of tokens | language, facts, reasoning patterns | base model |
| Fine-tuning | prompt and response pairs | tens of thousands | the format of a helpful reply | instruct model |
| Preference tuning | human comparisons | tens of thousands | which answers people prefer | chat model |

Press Next to follow one request through the finished model, and watch the context fill up.

:::scenario
title: One request through a chat model with an 8-token window
state: window=8 tokens, used=0
step: The app sends a system prompt: "You are a helpful assistant." That is 6 tokens.
state: used=6, free=2
step: The user types "Summarise this report." That is 4 tokens. The total is 10, which is more than 8.
state: used=10, free=-2, status=too long
step: The app must cut something. It removes the system prompt and keeps the user message.
state: used=4, free=4
step: The model generates "Which report?" That is 3 tokens. Output tokens also live in the window.
state: used=7, free=1
step: The window is almost full after one exchange. A real window holds 128,000 to 1,000,000 tokens, but it fills up the same way.
:::

## How it works

The 3 limits follow from the way the model is made. Here is each one, why it happens, and what you do about it.

1. The context window is the maximum number of tokens the model can hold in one request, input and output together. It is a limit of attention: the score table has one cell per pair of tokens, so memory and time grow with the square of the window. Everything the model knows about your conversation must fit inside. The model has no memory between requests. If the window is 128,000 tokens and your document is 200,000 tokens, the model cannot read it in one call.
2. Hallucination is a confident, fluent, wrong statement. It happens because the model is trained to produce likely text, not true text. If you ask who wrote "the cat sat on the mat", the most likely continuation is an author name, so the model gives one, even though the phrase has no known author. Fine-tuning reduces this but does not remove it.
3. The knowledge cutoff is the date of the last text in the pretraining data. The model knows nothing after it. Ask about an event after the cutoff, and the model either says it does not know or hallucinates.

:::anim
title: One exchange fills an 8-token context window
text msg "The context window holds 8 tokens, input and output together" @ 480,80 size: 19 color: yellow
rect s1 @ 165,130 size: 80x50 "You" color: blue
rect s2 @ 255,130 size: 80x50 "are" color: blue
rect s3 @ 345,130 size: 80x50 "a" color: blue
rect s4 @ 435,130 size: 80x50 "helpful" color: blue
rect s5 @ 525,130 size: 80x50 "assistant" color: blue
rect s6 @ 615,130 size: 80x50 "." color: blue
rect u1 @ 165,200 size: 80x50 "Summarise" color: purple
rect u2 @ 255,200 size: 80x50 "this" color: purple
rect u3 @ 345,200 size: 80x50 "report" color: purple
rect u4 @ 435,200 size: 80x50 "." color: purple
rect o1 @ 525,200 size: 80x50 "Which" color: green
rect o2 @ 615,200 size: 80x50 "report" color: green
rect o3 @ 705,200 size: 80x50 "?" color: green
rect w1 @ 165,290 size: 80x50 color: grey
rect w2 @ 255,290 size: 80x50 color: grey
rect w3 @ 345,290 size: 80x50 color: grey
rect w4 @ 435,290 size: 80x50 color: grey
rect w5 @ 525,290 size: 80x50 color: grey
rect w6 @ 615,290 size: 80x50 color: grey
rect w7 @ 705,290 size: 80x50 color: grey
rect w8 @ 795,290 size: 80x50 color: grey
num used = 0 @ 300,380 prefix: "used " suffix: " of 8" size: 28
text over "2 tokens do not fit" @ 680,380 size: 20 color: red
text real "A real window holds 128,000 to 1,000,000 tokens and fills the same way" @ 480,450 size: 16 color: grey

step: The context window holds 8 tokens, input and output together. Every token of the conversation must fit.
  show msg, w1, w2, w3, w4, w5, w6, w7, w8
  show used
step: The app sends the system prompt: You are a helpful assistant. That is 6 tokens.
  label msg "System prompt: You are a helpful assistant."
  show s1, s2, s3, s4, s5, s6
  move s1 -> 165,290
  & move s2 -> 255,290
  & move s3 -> 345,290
  & move s4 -> 435,290
  & move s5 -> 525,290
  & move s6 -> 615,290
  & count used -> 6
step: The user types: Summarise this report. That is 4 tokens. The total is 10, more than 8.
  label msg "User: Summarise this report."
  show u1, u2, u3, u4
  move u1 -> 705,290
  & move u2 -> 795,290
  & count used -> 10
  color u3, u4 red
  show over
step: The app must cut something. It removes the system prompt and keeps the user message.
  label msg "The system prompt is dropped"
  hide over, s1, s2, s3, s4, s5, s6
  move u1 -> 165,290
  & move u2 -> 255,290
  & move u3 -> 345,290
  & move u4 -> 435,290
  & count used -> 4
  color u3, u4 purple
step: The model generates: Which report? That is 3 tokens. Output tokens also live in the window.
  label msg "Model: Which report?"
  show o1, o2, o3
  move o1 -> 525,290
  & move o2 -> 615,290
  & move o3 -> 705,290
  & count used -> 7
step: After one exchange the window is almost full: 7 of 8 tokens used, 1 free.
  highlight w8
  show real
:::

The fix for each limit shapes the systems you will build.

| Limit | Why it happens | What you do about it |
| --- | --- | --- |
| Context window | attention cost grows with the square of the length | split documents, retrieve only the relevant parts, summarise history |
| Hallucination | the model produces likely text, not true text | give it the facts in the prompt, ask for citations, test with your own questions |
| Knowledge cutoff | pretraining data ends on a date | put recent facts in the prompt, give the model a search tool |

Context windows have grown fast. The bars show typical sizes, in thousands of tokens.

:::bars
title: Typical context windows by year, in thousands of tokens
unit: thousand tokens
2020 model: 2
2022 model: 4
2023 model: 32
2024 model: 128
2026 model: 1000
:::

A 1,000,000-token window holds about 750,000 words, which is 7 or 8 long novels. That sounds like enough for everything, but 3 problems remain. Long requests cost more, because you pay per token. Long requests are slower. And models still pay less attention to facts in the middle of a very long context than to facts at the start or the end. Retrieval stays useful even with large windows.

Here is a small program that checks whether a document fits in a window and, if not, how many pieces to cut it into.

:::code
lang: python
file: fits.py
def plan(words, window_tokens, reserve_for_answer=2000):
    tokens = int(words * 1.33)
    room = window_tokens - reserve_for_answer
    if tokens <= room:
        return f"{tokens} tokens: fits in one request"
    pieces = -(-tokens // room)   # round up
    return f"{tokens} tokens: split into {pieces} pieces"

print(plan(6, 128_000))
print(plan(20_000, 32_000))
print(plan(120_000, 32_000))
print(plan(120_000, 200_000))
:::

:::code
lang: text
7 tokens: fits in one request
26600 tokens: fits in one request
159600 tokens: split into 6 pieces
159600 tokens: fits in one request
:::

The program keeps 2,000 tokens free for the answer, because the output lives in the same window as the input. The expression with 2 minus signs rounds a division up without importing the math module.

There are a few more things an LLM cannot do on its own. It cannot run code, browse the web or read your files unless you give it a tool. It cannot count letters in a word reliably, because it sees tokens, not letters. It cannot remember your last conversation unless the app stores it and sends it again. Each of these gaps becomes a feature you build in the project track.

## Try it

:::exercise
title: Plan a long document
task: A legal contract has 50,000 words. Your model has a 32,000-token context window. Using the rule of 1.33 tokens per word and reserving 2,000 tokens for the answer, work out by hand whether it fits and, if not, how many pieces you need. Then check with the plan function. The answer is 3 pieces.
hint: 50,000 times 1.33 is 66,500 tokens. The room is 32,000 minus 2,000. Divide and round up.
lang: text
solution:
tokens = 50,000 * 1.33 = 66,500
room   = 32,000 - 2,000 = 30,000
pieces = 66,500 / 30,000 = 2.2, rounded up to 3
The contract needs 3 requests, or a retrieval step that sends only the relevant clauses.
:::

Then ask any chat model a question about an event from last week and one about a made-up book title. Note which one it answers with confidence. That is the knowledge cutoff and hallucination in one experiment.

## Common mistakes

- Mistake: you treat a fluent answer as a true answer. Fix: fluency comes from pretraining and says nothing about truth; verify facts or supply them in the prompt.
- Mistake: you expect the model to remember yesterday's chat. Fix: the model has no memory between requests; your app must store and resend the history.
- Mistake: you paste a 300-page document and get an error or a poor answer. Fix: check the token count against the window and retrieve only the relevant parts.
- Mistake: you ask about recent events and trust the reply. Fix: check the knowledge cutoff, and give the model current facts or a search tool.
- Mistake: you think fine-tuning adds new facts. Fix: fine-tuning mostly teaches format and style; facts come from pretraining or from the prompt.

## Check your understanding

:::quiz
title: Check: how an LLM is made
q: What does a base model do when you give it a question?
- It always answers the question
* It continues the text in the most likely way, which may be more questions
- It refuses until it is fine-tuned
why: Pretraining teaches next-token prediction on web text, where a question is often followed by other text, not an answer.
q: A document is 90,000 words. A model has a 128,000-token window. Using 1.33 tokens per word, does the document fit?
* Yes, it is about 120,000 tokens and leaves a little room for the answer
- No, it is about 180,000 tokens
- No, words and tokens are the same, so 90,000 words need 90,000 tokens plus the system prompt
why: 90,000 times 1.33 is about 119,700 tokens, which is under 128,000 with room for a short answer.
q: A model states the name of the author of a nursery rhyme that has no known author. What is this?
- The knowledge cutoff
* Hallucination
- A context window error
why: The model produced a likely-looking but false fact because it is trained to produce probable text.
q: Which stage teaches a model the format of a helpful reply?
- Pretraining
* Fine-tuning on prompt and response pairs
- Tokenization
why: Fine-tuning on instruction pairs changes how the model responds; pretraining supplies the underlying knowledge.
q: You want a model to answer questions about documents you wrote last month. What is the best approach?
- Wait for the next model release
- Ask the model to remember the documents
* Put the relevant parts of the documents in the prompt, retrieved when needed
why: The knowledge cutoff and the context window are both handled by sending the right facts in each request.
:::

## Go further

The Karpathy deep dive in the links spends 3 hours on the 3 stages with real data. The Anthropic documentation describes the context window and the knowledge cutoff of each model. The next module starts with [Prompting that works](/courses/ai-foundations/using-models/prompting), where you write instructions that get a chat model to do a real task.
`,
      links: [
        { label: 'Deep Dive into LLMs like ChatGPT (Karpathy)', url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI', kind: 'video' },
        { label: 'Anthropic documentation', url: 'https://docs.anthropic.com/', kind: 'docs' },
        { label: 'Training language models to follow instructions with human feedback (InstructGPT, 2022)', url: 'https://arxiv.org/abs/2203.02155', kind: 'paper' },
        { label: 'Hugging Face LLM course', url: 'https://huggingface.co/learn/llm-course', kind: 'course' },
      ],
    },
  ],
}
