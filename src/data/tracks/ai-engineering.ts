import type { Track } from '../types'

export const track: Track = {
    slug: 'ai-engineering',
    title: 'AI Engineering',
    tagline: 'Embeddings, retrieval, agents, and evaluation that survive production.',
    description:
      'The practical track. Build retrieval pipelines, agent loops, prompts, evaluation harnesses, fine-tuning runs, and production guards, and learn where each one breaks.',
    accent: 'var(--accent-engineering)',
    status: 'live',
    modules: [
      {
        slug: 'embeddings',
        title: 'Embeddings and vector search',
        description: 'Turn text into vectors, cut documents into chunks, and search millions of vectors fast.',
        lessons: [
          {
            slug: 'what-is-an-embedding',
            title: 'What an embedding is',
            summary: 'An embedding is a list of numbers that places a text in a space where similar texts are close.',
            minutes: 12,
            objectives: [
              'Compute the cosine similarity of two small vectors by hand.',
              'Explain why a retrieval model uses different prefixes for queries and passages.',
              'Choose a vector dimension for a given storage budget.',
            ],
            keyTerms: ['embedding', 'cosine similarity', 'dot product', 'bi-encoder', 'Matryoshka embedding'],
            links: [
              { label: 'Sentence-BERT: sentence embeddings with siamese networks', url: 'https://arxiv.org/abs/1908.10084', kind: 'paper' },
              { label: 'Matryoshka representation learning', url: 'https://arxiv.org/abs/2205.13147', kind: 'paper' },
              { label: 'Dense passage retrieval for open-domain question answering', url: 'https://arxiv.org/abs/2004.04906', kind: 'paper' },
              { label: 'sentence-transformers library', url: 'https://github.com/UKPLab/sentence-transformers', kind: 'repo' },
              { label: '3Blue1Brown: linear algebra and vectors, visually', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            ],
            body: `
## What this lesson covers

This lesson defines an embedding and shows how to compare two embeddings with cosine similarity. It works through a tiny example with 3-dimensional vectors. It then explains three facts about real embedding models that change how you build a search system.

## Why it matters

A search engine must know that "How do I reset my password?" and "password reset steps" mean the same thing. The two texts share only one word. An embedding model maps each text to a vector, and texts with the same meaning get vectors that point in the same direction. Every retrieval-augmented generation (RAG) system, semantic cache, and recommendation feed starts with this step. If the embeddings are poor, nothing downstream can repair the result.

## The idea with an example

An embedding model is a neural network that reads a text and outputs a vector of $d$ numbers. Real models use $d$ between 256 and 4096. For this example, use $d = 3$.

Suppose the model produces these vectors:

| Text | Vector |
| --- | --- |
| A: "reset my password" | (0.9, 0.1, 0.4) |
| B: "password reset steps" | (0.8, 0.2, 0.5) |
| C: "best pizza in town" | (0.1, 0.9, 0.2) |

Compare A with B. First compute the dot product. Multiply the matching entries and add them:

$0.9 \\times 0.8 + 0.1 \\times 0.2 + 0.4 \\times 0.5 = 0.72 + 0.02 + 0.20 = 0.94$

Next compute the length of each vector. The length of A is $\\sqrt{0.81 + 0.01 + 0.16} = \\sqrt{0.98} \\approx 0.99$. The length of B is $\\sqrt{0.64 + 0.04 + 0.25} = \\sqrt{0.93} \\approx 0.96$.

Divide the dot product by the product of the lengths: $0.94 / (0.99 \\times 0.96) \\approx 0.99$. A and B are almost parallel. They mean the same thing.

Now compare A with C. The dot product is $0.09 + 0.09 + 0.08 = 0.26$. The length of C is about 0.93. The similarity is $0.26 / (0.99 \\times 0.93) \\approx 0.28$. A search for A returns B, not C.

## How it works

The similarity score between two vectors $u$ and $v$ is the cosine of the angle between them:

$$\\cos(u, v) = \\frac{u \\cdot v}{\\|u\\| \\, \\|v\\|}$$

Here $u \\cdot v$ is the dot product, and $\\|u\\|$ is the length of $u$. The score is 1 for the same direction, 0 for a right angle, and -1 for opposite directions.

Note: most models normalise each vector to length 1. Then the cosine equals the dot product.

To search a collection, follow this procedure:

1. Embed every document once and store the vectors.
2. Embed the query with the same model.
3. Compute the similarity between the query vector and every stored vector.
4. Return the documents with the highest scores.

Three facts about real models change how you use this procedure.

First, a question and its answer do not look alike. A model trained only on "similar texts are close" puts questions near other questions. Retrieval models train on pairs of queries and passages instead. Many models expect a prefix such as "query:" or "passage:" to mark the side of the pair. Use the prefix the model card specifies.

Second, the model is a bi-encoder. It embeds the query and the document separately and never sees them together. Search is fast, because document vectors are computed once. Accuracy is limited, because the model cannot compare the two texts word by word. A later lesson adds a reranker.

Third, the dimension $d$ sets the storage cost. One million vectors at $d = 1024$ in 32-bit floats take $10^6 \\times 1024 \\times 4 = 4.1$ GB. Models trained with the Matryoshka method order their dimensions by importance. Keep only the first 256 dimensions and storage falls to 1.0 GB with little loss.

## Common mistakes

- Mistake: embed the query with one model and the documents with another model. Fix: use the same model and the same version for both sides.
- Mistake: compare vectors with Euclidean distance when the model was trained for cosine similarity. Fix: use the similarity function named on the model card.
- Mistake: embed a 20-page document as one vector. Fix: cut the document into chunks first; the next lesson explains how.
- Mistake: expect the model to match codes such as "SKU-4471". Fix: add a keyword search beside the vector search.

## Check your understanding

- Question: Two normalised vectors have a dot product of 0.95. What is their cosine similarity? Answer: 0.95, because normalised vectors have length 1.
- Question: Why do retrieval models add a "query:" prefix? Answer: The prefix tells the model to embed the text as a question, so it lands near passages that answer it.
- Question: How much storage do 2 million vectors need at $d = 512$ in 32-bit floats? Answer: $2 \\times 10^6 \\times 512 \\times 4 = 4.1$ GB.

## Go further

The Sentence-BERT paper introduced the bi-encoder design that most embedding models use. The dense passage retrieval paper trains a model on query and passage pairs. The Matryoshka paper shows why you can truncate a vector and keep most of the accuracy. The sentence-transformers repository embeds text in three lines of code. The 3Blue1Brown channel gives a visual introduction to vectors and dot products.
`,
          },
          {
            slug: 'chunking-strategies',
            title: 'Chunking: cut documents into pieces',
            summary: 'Chunking decides how much text each vector represents, and it changes retrieval quality more than the model choice.',
            minutes: 13,
            objectives: [
              'Compute the number of chunks a document produces for a given size and overlap.',
              'Explain why chunks that are too large or too small both lose information.',
              'Choose a chunking method for a document type.',
            ],
            keyTerms: ['chunking', 'embedding', 'token', 'overlap', 'recall'],
            links: [
              { label: 'Retrieval-augmented generation for knowledge-intensive NLP', url: 'https://arxiv.org/abs/2005.11401', kind: 'paper' },
              { label: 'Lost in the middle: how language models use long contexts', url: 'https://arxiv.org/abs/2307.03172', kind: 'paper' },
              { label: 'Hugging Face NLP course', url: 'https://huggingface.co/learn/nlp-course', kind: 'course' },
              { label: 'LangChain text splitters', url: 'https://github.com/langchain-ai/langchain', kind: 'repo' },
              { label: 'Patterns for building LLM systems', url: 'https://eugeneyan.com/writing/llm-patterns/', kind: 'article' },
            ],
            body: `
## What this lesson covers

This lesson explains chunking, the step that cuts a long document into pieces before you embed it. It works through the arithmetic of chunk size and overlap on a 1,000-token document. It then compares fixed-size, sentence-based, and structure-based chunking.

## Why it matters

An embedding model has a maximum input length, often 512 tokens. A token is the unit the model reads; one token is about four characters of English. A 20-page manual has about 10,000 tokens, so it does not fit. One vector also cannot represent 20 pages. It would average many ideas into one point, and a query about one idea would not match it. Chunking fixes both problems, and the chunking choice often moves recall more than the choice of model.

## The idea with an example

Take a 1,000-token document. Cut it into chunks of 200 tokens with no overlap. You get $1000 / 200 = 5$ chunks. Each chunk gets its own vector.

Now suppose a key sentence sits at token 195 to token 210. The cut at token 200 splits the sentence across chunk 1 and chunk 2. Neither chunk holds the full sentence, so neither vector represents it well.

Add an overlap of 50 tokens. Each chunk still has 200 tokens, but each new chunk starts 150 tokens after the previous one. Chunk 1 covers tokens 0 to 200. Chunk 2 covers tokens 150 to 350. The key sentence now sits fully inside chunk 2.

The number of chunks rises. The step size is $200 - 50 = 150$ tokens. The count is:

$$n = \\left\\lceil \\frac{N - s}{s - o} \\right\\rceil + 1$$

Here $N$ is the document length, $s$ is the chunk size, and $o$ is the overlap. For this document: $\\lceil (1000 - 200) / 150 \\rceil + 1 = \\lceil 5.33 \\rceil + 1 = 7$ chunks. Overlap costs 40 percent more vectors in this case. It buys protection against bad cuts.

| Chunk size | Overlap | Chunks | Storage factor |
| --- | --- | --- | --- |
| 200 | 0 | 5 | 1.0 |
| 200 | 50 | 7 | 1.4 |
| 100 | 25 | 13 | 2.6 |
| 500 | 100 | 3 | 0.6 |

## How it works

Three chunking methods cover most needs.

Fixed-size chunking cuts at a fixed token count. It is simple and fast, but it cuts sentences and tables in half.

Sentence-based chunking splits the text at sentence ends first. It then packs whole sentences into a chunk until the chunk reaches the size limit. No sentence is cut. This is the default choice for prose.

Structure-based chunking uses the headings, paragraphs, and list items of the document. A Markdown file splits at headings. A code file splits at functions. An HTML page splits at section tags. Each chunk keeps its heading as a prefix, so the vector knows the topic.

Follow this procedure to pick the settings:

1. Build a test set of 50 questions with the passage that answers each one.
2. Chunk the corpus with a size of 256 tokens and an overlap of 32 tokens.
3. Measure recall at 10: the fraction of questions whose answer passage appears in the top 10 results.
4. Repeat with sizes 128 and 512.
5. Keep the size with the highest recall.

Note: add the document title and the section heading to the start of every chunk. A chunk that reads "Pricing: the premium plan costs 20 dollars" retrieves better than "the premium plan costs 20 dollars".

Caution: a chunk size above 500 tokens often lowers recall. The vector averages too many ideas. Chunks below 100 tokens lose the context around a sentence. Most teams end between 200 and 500 tokens.

## Common mistakes

- Mistake: chunk a table row by row, so each row loses its column headers. Fix: repeat the header row in every chunk of the table.
- Mistake: use character counts instead of token counts, and overflow the model's limit. Fix: count with the tokenizer of the embedding model.
- Mistake: change the chunk size after indexing and compare old and new scores. Fix: re-embed the whole corpus every time the chunking changes.
- Mistake: store the chunk text without the document id and position. Fix: store metadata, so you can show the source and fetch neighbouring chunks.

## Check your understanding

- Question: A 3,000-token document, chunk size 300, overlap 60. How many chunks? Answer: $\\lceil (3000 - 300) / 240 \\rceil + 1 = 13$ chunks.
- Question: Why does a 2,000-token chunk retrieve poorly? Answer: Its vector averages many topics, so it matches no single query well.
- Question: Which method keeps code functions whole? Answer: Structure-based chunking, because it splits at function boundaries.

## Go further

The retrieval-augmented generation paper shows the pipeline that chunking feeds into. The "lost in the middle" paper measures how a model ignores passages in the middle of a long prompt. That result argues for fewer, better chunks. The Hugging Face NLP course covers tokenizers, which you need to count tokens correctly. The LangChain repository holds text splitters for prose, Markdown, and code. The patterns article by Eugene Yan collects practical lessons on retrieval systems.
`,
          },
          {
            slug: 'hnsw',
            title: 'HNSW and approximate nearest neighbours',
            summary: 'HNSW finds near neighbours in a graph so that search cost grows with the logarithm of the collection size.',
            minutes: 15,
            objectives: [
              'Compute the cost of brute-force search for a given collection.',
              'Explain how a search moves through the layers of an HNSW graph.',
              'Choose M, efConstruction, and efSearch for a recall target.',
            ],
            keyTerms: ['hnsw', 'approximate nearest neighbour', 'recall', 'embedding', 'inverted file index', 'product quantisation'],
            links: [
              { label: 'Efficient and robust approximate nearest neighbor search using HNSW graphs', url: 'https://arxiv.org/abs/1603.09320', kind: 'paper' },
              { label: 'hnswlib: header-only HNSW implementation', url: 'https://github.com/nmslib/hnswlib', kind: 'repo' },
              { label: 'FAISS: a library for efficient similarity search', url: 'https://github.com/facebookresearch/faiss', kind: 'repo' },
              { label: 'Qdrant vector database', url: 'https://github.com/qdrant/qdrant', kind: 'repo' },
              { label: 'VectorDBBench: benchmark vector databases', url: 'https://github.com/zilliztech/VectorDBBench', kind: 'repo' },
            ],
            body: `
## What this lesson covers

This lesson explains why exact vector search stops working at a million vectors. It introduces the Hierarchical Navigable Small World (HNSW) graph and walks through one search on a tiny graph. It then explains the three settings that trade recall against speed and memory.

## Why it matters

Exact search compares the query with every stored vector. The cost is $O(Nd)$ for $N$ vectors of dimension $d$. For one million vectors at $d = 1024$, one query needs about one billion multiplications. One CPU core needs about a second for that. At 100 queries per second, exact search on CPU is not possible. Approximate nearest neighbour (ANN) search returns almost the same results in a fraction of the time. HNSW is the most common ANN method in vector databases.

## The idea with an example

Place 8 vectors on a line, with ids 1 to 8 at positions 1 to 8. The query is at position 6.3. Exact search checks all 8 points and returns 6.

HNSW builds layers. The top layer holds a few points, each lower layer holds more, and the bottom layer holds all points. Every point links to its nearest neighbours in its layer.

Suppose the layers are:

| Layer | Points |
| --- | --- |
| 2 | 1, 5 |
| 1 | 1, 3, 5, 7 |
| 0 | 1, 2, 3, 4, 5, 6, 7, 8 |

The search runs like this:

1. Start at layer 2 at point 1. Its neighbour 5 is closer to 6.3. Move to 5. Stop, because no neighbour is closer.
2. Drop to layer 1 at point 5. Its neighbours are 3 and 7. Point 7 is at distance 0.7; point 5 is at distance 1.3. Move to 7. Point 5 is not closer. Stop.
3. Drop to layer 0 at point 7. Its neighbours are 6 and 8. Point 6 is at distance 0.3. Move to 6. No neighbour is closer. Return 6.

The search visited 5 points instead of 8. In a graph with a million points, it visits a few hundred. The top layers make long jumps; the bottom layer makes the final short steps.

## How it works

Each point joins the graph at a random top layer. The chance of a higher layer falls by a constant factor per layer, so there are about $\\log N$ layers. Search cost is about $O(\\log N)$.

Three settings control the graph.

M is the number of links per point. A larger M gives more paths and higher recall, but it costs memory. Each link is a 4-byte id. A point with M = 16 uses about 64 bytes of links plus its vector. Typical values are 12 to 48.

efConstruction is the size of the candidate list during index building. A larger value finds better neighbours and takes longer to build. Typical values are 100 to 400.

efSearch is the size of the candidate list during a query. It must be at least the number of results you want. A larger value visits more points, raises recall, and raises latency. You tune it at run time.

A typical result on one million vectors at $d = 768$:

| efSearch | Recall at 10 | Latency per query |
| --- | --- | --- |
| 16 | 0.86 | 0.3 ms |
| 64 | 0.96 | 0.8 ms |
| 256 | 0.99 | 2.5 ms |

Recall at 10 is the fraction of the 10 true nearest neighbours that the index returns.

Note: HNSW keeps every vector and all links in memory. One million vectors at $d = 1024$ need 4.1 GB plus about 0.1 GB of links.

When the collection does not fit in memory, use the inverted file index with product quantisation (IVF-PQ). IVF groups vectors into clusters and searches only the nearest clusters. PQ compresses a 1024-dimensional vector from 4,096 bytes to 64 bytes. Recall falls, so most teams rerank the top 100 results with the full vectors.

## Common mistakes

- Mistake: set efSearch below the number of requested results. Fix: set efSearch to at least 4 times k.
- Mistake: report latency without recall. Fix: always measure recall against exact search on a sample of 1,000 queries.
- Mistake: delete many vectors and expect the same speed. Fix: rebuild the index after many deletes, because deleted points still sit in the graph.
- Mistake: apply a filter such as "category = shoes" after the search, and get too few results. Fix: use a database that filters inside the graph traversal.

## Check your understanding

- Question: What is the cost of exact search over 10 million vectors at $d = 512$? Answer: About $5 \\times 10^9$ multiplications per query.
- Question: Which setting changes query recall without a rebuild? Answer: efSearch.
- Question: Why does IVF-PQ need a reranking step? Answer: Compressed vectors give rough distances, so the final order needs the full vectors.

## Go further

The HNSW paper describes the layered graph and the proof of logarithmic search cost. The hnswlib repository is the reference implementation and is small enough to read. FAISS holds HNSW, IVF, and product quantisation in one library. Qdrant is an open-source vector database with filtered HNSW search. VectorDBBench measures recall and latency across databases on your own data.
`,
          },
        ],
      },
      {
        slug: 'rag',
        title: 'Retrieval-augmented generation',
        description: 'Ground a model in your own documents with retrieval, reranking, and measurement.',
        lessons: [
          {
            slug: 'rag-baseline',
            title: 'A RAG baseline that holds up',
            summary: 'Combine keyword search and vector search, merge the ranks, and measure recall before you touch the model.',
            minutes: 15,
            objectives: [
              'Explain why keyword search and vector search find different documents.',
              'Compute a reciprocal rank fusion score by hand for a small result set.',
              'Measure recall at k on a labelled set before you change the generator.',
              'Choose a value of k that balances recall and prompt size.',
            ],
            keyTerms: ['bm25', 'embedding', 'reciprocal-rank-fusion', 'chunking', 'recall at k', 'hybrid retrieval'],
            links: [
              { label: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al.)', url: 'https://arxiv.org/abs/2005.11401', kind: 'paper' },
              { label: 'Dense Passage Retrieval for Open-Domain Question Answering', url: 'https://arxiv.org/abs/2004.04906', kind: 'paper' },
              { label: 'Pyserini: a toolkit for BM25 and dense retrieval', url: 'https://github.com/castorini/pyserini', kind: 'repo' },
              { label: 'bm25s: fast BM25 in pure Python', url: 'https://github.com/xhluca/bm25s', kind: 'repo' },
              { label: 'Sentence Transformers: embedding models and search utilities', url: 'https://github.com/UKPLab/sentence-transformers', kind: 'repo' },
              { label: 'Patterns for building LLM-based systems (Eugene Yan)', url: 'https://eugeneyan.com/writing/llm-patterns/', kind: 'article' },
            ],
            body: `
## What this lesson covers

Retrieval-augmented generation (RAG) gives a language model documents to read before it answers. This lesson builds the retrieval half of that system. You learn to run keyword search and vector search in parallel, merge their results, and measure how often the right document appears. The generator comes later.

## Why it matters

A model can only cite a fact if the retriever puts that fact into the prompt. If the retriever misses the document, no prompt wording can repair the answer. Most RAG failures in production are retrieval failures, not generation failures.

Keyword search and vector search fail in different ways. Keyword search finds exact strings such as product codes, names, and error messages. Vector search finds passages with the same meaning but different words. A retriever that combines both covers the gaps of each one.

## The idea with an example

Suppose a user asks: "How do I reset the X200 router?" The corpus has three relevant documents.

- D1: a manual page that contains the string "X200" and the word "reset".
- D2: a support article titled "Restore factory settings on your router".
- D3: a forum post that mentions "X200" but talks about firmware.

Run two searches in parallel. The keyword search uses BM25 (best match 25), a scoring function that rewards exact term matches and rare terms. The vector search embeds the query and each chunk, then ranks chunks by cosine similarity.

| Document | BM25 rank | Vector rank |
|---|---|---|
| D1 | 1 | 2 |
| D2 | 3 | 1 |
| D3 | 2 | 5 |

Now merge the two lists with reciprocal rank fusion (RRF). RRF gives each document a score from its rank in each list. The score is:

$$s(d) = \\sum_{i} \\frac{1}{k + r_i(d)}$$

Here $s(d)$ is the fused score of document $d$ and $r_i(d)$ is its rank in list $i$. The constant $k$ softens the effect of top ranks. The usual value is $k = 60$.

Compute the scores:

- D1: $1/(60+1) + 1/(60+2) = 0.01639 + 0.01613 = 0.03252$
- D2: $1/(60+3) + 1/(60+1) = 0.01587 + 0.01639 = 0.03226$
- D3: $1/(60+2) + 1/(60+5) = 0.01613 + 0.01538 = 0.03151$

The fused order is D1, D2, D3. D1 wins because both searches rank it near the top. D2 is a close second even though BM25 ranked it third. D3 drops because the vector search ranks it low. The fused list matches what a human would want.

## How it works

The baseline pipeline has five stages.

1. Split each document into chunks of 200 to 500 tokens with a small overlap.
2. Build a BM25 index over the chunks and embed each chunk into a vector index.
3. At query time, run BM25 and vector search in parallel. Take the top 50 from each.
4. Merge the two lists with RRF and keep the top k fused results.
5. Pass the top k chunks to the generator.

Measure the retriever before you tune anything else. Build a labelled set of at least 100 questions. For each question, record the chunk IDs that contain the answer. Then compute recall at k:

$$\\text{recall@}k = \\frac{\\text{number of questions with a correct chunk in the top } k}{\\text{number of questions}}$$

Here $k$ is the number of chunks you keep. If 83 of 100 questions have a correct chunk in the top 10, recall@10 is 0.83. Track recall@5, recall@10, and recall@20 in a table and watch how they change when you edit the pipeline.

Note: a larger k raises recall but also raises prompt length and cost. A typical starting point is k = 5 to 10 chunks.

Caution: if a document is missing from the index, no retriever setting can find it. Check index coverage first.

## Common mistakes

- Mistake: use only vector search. Fix: add BM25 so exact names and codes still match.
- Mistake: tune the prompt when answers are wrong. Fix: measure recall@k first and fix retrieval if it is low.
- Mistake: chunk documents at 2,000 tokens. Fix: use 200 to 500 token chunks so each vector holds one idea.
- Mistake: merge lists by adding raw BM25 and cosine scores. Fix: use RRF, because the two scores have different scales.
- Mistake: build the labelled set from easy demo questions. Fix: sample real user questions and label them.

## Check your understanding

- What does RRF use from each search: the raw score or the rank? The rank, so the two scales do not need calibration.
- A document ranks 1 in BM25 and 4 in vector search, with k = 60. What is its RRF score? $1/61 + 1/64 = 0.01639 + 0.01563 = 0.03202$.
- Recall@10 is 0.40 on your labelled set. Should you change the prompt or the retriever? The retriever, because the right chunk is missing most of the time.

## Go further

The original RAG paper by Lewis and colleagues shows the first end-to-end system and is short to read. The Dense Passage Retrieval paper explains how the embedding models for retrieval are trained. Pyserini and bm25s give you working BM25 indexes in a few lines. Sentence Transformers covers the vector side. Eugene Yan's article on LLM patterns places retrieval in the context of a full application.
`,
          },
          {
            slug: 'reranking-and-citations',
            title: 'Reranking and citations',
            summary: 'Score candidate chunks with a cross-encoder, fit them into a token budget, and make the model cite by number.',
            minutes: 15,
            objectives: [
              'Explain the difference between a bi-encoder and a cross-encoder.',
              'Rerank a small candidate set by hand and select chunks under a token budget.',
              'Build a prompt with numbered chunks and ask for citations by number.',
              'Verify that each citation points at a chunk that supports the claim.',
            ],
            keyTerms: ['cross-encoder', 'bi-encoder', 'reranking', 'token budget', 'citation', 'embedding'],
            links: [
              { label: 'ColBERT: late interaction for efficient passage search', url: 'https://arxiv.org/abs/2004.12832', kind: 'paper' },
              { label: 'Lost in the Middle: How Language Models Use Long Contexts', url: 'https://arxiv.org/abs/2307.03172', kind: 'paper' },
              { label: 'Sentence Transformers: cross-encoder models for reranking', url: 'https://github.com/UKPLab/sentence-transformers', kind: 'repo' },
              { label: 'ColBERT reference implementation', url: 'https://github.com/stanford-futuredata/ColBERT', kind: 'repo' },
              { label: 'Anthropic cookbook: RAG and citation examples', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'repo' },
            ],
            body: `
## What this lesson covers

The first-stage retriever returns a wide set of candidates. This lesson adds a second stage that scores each candidate against the query with more care. It then shows how to pack the best chunks into a prompt and how to make the model cite them by number. Finally it shows how to check each citation.

## Why it matters

A bi-encoder embeds the query and the chunk separately, then compares two vectors. It is fast, but it never sees the query and the chunk together. A cross-encoder reads the query and the chunk as one input and outputs one relevance score. It is slow, but it is more accurate. Most of the quality gain in a RAG pipeline comes from this reranking step.

Citations matter because a model can produce a fluent answer with no support in the retrieved text. A citation by number lets a program check the claim against the chunk.

## The idea with an example

The user asks: "What is the maximum upload size for the free plan?" The first stage returns 50 candidate chunks. Look at four of them.

| Chunk | Content summary | First-stage rank | Cross-encoder score |
|---|---|---|---|
| C1 | Free plan: uploads up to 25 MB per file | 3 | 0.94 |
| C2 | Pro plan: uploads up to 2 GB per file | 1 | 0.61 |
| C3 | How to upload a file from the mobile app | 2 | 0.22 |
| C4 | Free plan storage total is 5 GB | 4 | 0.48 |

The first stage ranked C2 first because it shares many words with the query. The cross-encoder reads the query with each chunk, sees that C2 covers the wrong plan, and gives C1 the top score.

Now apply a token budget. Suppose the prompt has room for 600 tokens of context. C1 is 180 tokens, C4 is 150 tokens, C2 is 200 tokens, and C3 is 170 tokens. Take chunks in score order until the budget is full: C1 (180), C2 (380), C4 (530). C3 does not fit and has a low score, so drop it.

Number the chunks in the prompt:

    [1] Free plan: uploads up to 25 MB per file. ...
    [2] Pro plan: uploads up to 2 GB per file. ...
    [3] Free plan storage total is 5 GB. ...

    Answer the question. After each claim, cite the chunk number in square brackets.

The model answers: "The free plan allows uploads up to 25 MB per file [1]." A checker reads citation [1]. It finds the string "25 MB" in chunk 1 and marks the claim as supported.

## How it works

The reranking stage follows a fixed procedure.

1. Take the top N candidates from the first stage. N is usually 20 to 100.
2. For each candidate, build the input pair (query, chunk) and run the cross-encoder.
3. Sort the candidates by the cross-encoder score.
4. Add chunks in score order until the token budget is full.
5. Number each chunk and place it in the prompt.
6. Instruct the model to cite chunk numbers after each claim.
7. Parse the answer, extract the citations, and check each one.

The cross-encoder is a small transformer with one output. The score is:

$$s = \\sigma(f(q \\oplus c))$$

Here $q$ is the query, $c$ is the chunk, and $\\oplus$ is concatenation with a separator token. $f$ is the transformer and $\\sigma$ is the sigmoid function, which maps the output to a value between 0 and 1.

Reranking costs N forward passes of a small model. For N = 50 this adds about 100 to 300 milliseconds on one graphics processing unit (GPU).

Note: models read the start and the end of a long context better than the middle. Place the highest scored chunk first and the second highest last.

Caution: a citation is a pointer, not a proof. Always check that the cited chunk contains the claim.

## Common mistakes

- Mistake: rerank all 10,000 chunks with the cross-encoder. Fix: rerank only the top 50 from the first stage.
- Mistake: pass 30 chunks and hope the model finds the right one. Fix: pass 3 to 8 chunks that fit a fixed token budget.
- Mistake: accept any citation the model writes. Fix: verify that the cited chunk contains the claim.
- Mistake: trust the first-stage order after reranking. Fix: use the cross-encoder order to place chunks in the prompt.

## Check your understanding

- Why is a cross-encoder more accurate than a bi-encoder? It reads the query and the chunk together, so it can match them word by word.
- Your budget is 500 tokens and the top chunks are 220, 190, and 160 tokens. Which fit? The first two (410 tokens); the third would exceed the budget.
- The model cites [2] for a claim that appears only in chunk 1. What does the checker report? An unsupported citation, so the answer fails verification.

## Go further

The ColBERT paper describes a middle path between bi-encoders and cross-encoders called late interaction, and its repository has a complete implementation. The Lost in the Middle paper measures how position in the context changes answer accuracy. The Sentence Transformers repository ships ready-made cross-encoder models. The Anthropic cookbook contains worked examples of prompts with citations.
`,
          },
          {
            slug: 'rag-evaluation',
            title: 'Evaluating RAG end to end',
            summary: 'Measure retrieval and generation separately with a golden set and a calibrated judge.',
            minutes: 18,
            objectives: [
              'Compute context precision and context recall for a retrieved set.',
              'Explain the difference between faithfulness and answer relevance.',
              'Build a golden set that labels both the chunks and the answer.',
              'Calibrate a language model judge against human labels.',
              'List the main failure modes of a model judge.',
            ],
            keyTerms: ['golden set', 'context precision', 'context recall', 'faithfulness', 'answer relevance', 'llm judge', 'chunking'],
            links: [
              { label: 'RAGAS: automated evaluation of retrieval-augmented generation', url: 'https://arxiv.org/abs/2309.15217', kind: 'paper' },
              { label: 'Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena', url: 'https://arxiv.org/abs/2306.05685', kind: 'paper' },
              { label: 'Self-RAG: learning to retrieve, generate, and critique', url: 'https://arxiv.org/abs/2310.11511', kind: 'paper' },
              { label: 'RAGAS library', url: 'https://github.com/explodinggradients/ragas', kind: 'repo' },
              { label: 'FastChat: MT-Bench judge prompts and code', url: 'https://github.com/lm-sys/FastChat', kind: 'repo' },
            ],
            body: `
## What this lesson covers

A RAG system has two parts that can fail: the retriever and the generator. This lesson gives each part its own metrics. You build a golden set, compute retrieval metrics by hand, and then score generation with a language model judge. You also learn how to check that the judge agrees with humans.

## Why it matters

If you measure only the final answer, you cannot tell which part broke. A wrong answer can come from a missing chunk or from a model that ignored a correct chunk. The fix is different in each case. Separate metrics point you to the right fix.

A judge model makes evaluation cheap and fast, but it has biases. If you never compare it to human labels, the score can rise while real quality falls.

## The idea with an example

Build a golden set. For each question, a human writes the correct answer and marks the chunks that support it. Take one question with two supporting chunks in the corpus, G1 and G2.

The retriever returns five chunks: G1, N1, G2, N2, N3. The N chunks are not relevant.

Context precision asks: of the retrieved chunks, how many are relevant? Two of five are relevant, so precision is $2/5 = 0.40$.

Context recall asks: of the relevant chunks, how many did we retrieve? Both G1 and G2 appear, so recall is $2/2 = 1.00$.

Now the generator writes: "The free plan allows 25 MB uploads and includes 10 GB of storage." The chunks say 25 MB and 5 GB. Split the answer into claims.

| Claim | Supported by a chunk? |
|---|---|
| Free plan allows 25 MB uploads | Yes (G1) |
| Free plan includes 10 GB storage | No (G2 says 5 GB) |

Faithfulness is the fraction of claims supported by the context: $1/2 = 0.50$. The second claim is a hallucination, a statement the model produced without support.

Answer relevance asks whether the answer addresses the question. If the question asked only about upload size, the storage sentence is extra. A judge gives a relevance score of about 0.7.

Across 200 golden questions you might see: context recall 0.85, context precision 0.45, faithfulness 0.78, answer relevance 0.90. Retrieval recall is good, so the fix is to improve faithfulness, for example with a stricter prompt or a reranker.

## How it works

Run the evaluation as a fixed procedure.

1. Collect 100 to 500 real questions. Have humans write answers and mark supporting chunks.
2. Run the retriever. Compute context precision and context recall per question and average them.
3. Run the generator on the retrieved chunks. Split each answer into claims.
4. Ask the judge whether each claim is supported by the chunks. Compute faithfulness.
5. Ask the judge to score answer relevance from 1 to 5.
6. Sample 50 judged items. Have a human label them and compute agreement with the judge.

A minimal judge prompt looks like this:

    You are checking a claim against a set of passages.
    Passages:
    {chunks}
    Claim: {claim}
    Answer with one word: SUPPORTED or UNSUPPORTED.
    Then give one sentence that quotes the passage or says nothing supports the claim.

Agreement between the judge and humans is measured with Cohen's kappa:

$$\\kappa = \\frac{p_o - p_e}{1 - p_e}$$

Here $p_o$ is the observed agreement rate and $p_e$ is the agreement expected by chance. A kappa above 0.7 means the judge is usable. If the judge and humans agree on 46 of 50 items, $p_o = 0.92$. With balanced labels, $p_e = 0.5$, so $\\kappa = 0.84$.

Judges have known failure modes. They prefer longer answers and answers in their own style. Confident wording can fool them. They give different scores when the order of two compared answers changes.

Note: use the judge for binary claim checks when you can. Binary labels are easier to calibrate than 1 to 5 scores.

Caution: never tune the system on the same golden set you report. Hold out at least 30 percent for the final number.

## Common mistakes

- Mistake: report one overall score. Fix: report retrieval and generation metrics in separate columns.
- Mistake: trust the judge without a human check. Fix: label a sample and compute kappa.
- Mistake: write golden answers from the model's own output. Fix: have humans write answers from the source documents.
- Mistake: use long judge rubrics with many criteria. Fix: ask one binary question per call.
- Mistake: evaluate on 10 questions. Fix: use at least 100, because a 10 question score moves by 10 points per item.

## Check your understanding

- The retriever returns 8 chunks and 2 are relevant out of 4 relevant chunks in the corpus. What are precision and recall? Precision 0.25, recall 0.50.
- An answer has 4 claims and the judge supports 3. What is faithfulness? 0.75.
- Judge and humans agree on 40 of 50 balanced items. What is kappa? $p_o = 0.80$, $p_e = 0.50$, so $\\kappa = 0.60$, which is below the usable threshold.

## Go further

The RAGAS paper defines the four metrics used here and the library implements them. The MT-Bench paper by Zheng and colleagues measures judge biases, including position and length bias, and the FastChat repository contains the judge prompts. Self-RAG shows a model that critiques its own retrieval, which is a research direction for automatic faithfulness.
`,
          },
        ],
      },
      {
        slug: 'agents',
        title: 'Agents and tool use',
        description: 'Build a model loop with tools, make it reliable, and keep its memory under control.',
        lessons: [
          {
            slug: 'agent-loop',
            title: 'The agent loop',
            summary: 'An agent is a model in a loop with tools, and the loop needs a clear reason to stop.',
            minutes: 12,
            objectives: [
              'Describe the observe, think, act cycle of an agent.',
              'Write the loop in pseudo-code with a step budget.',
              'Trace a three-step task through the loop by hand.',
              'List the stop conditions every loop needs.',
            ],
            keyTerms: ['react', 'chain-of-thought', 'tool call', 'step budget', 'stop condition', 'in-context-learning'],
            links: [
              { label: 'ReAct: Synergizing Reasoning and Acting in Language Models', url: 'https://arxiv.org/abs/2210.03629', kind: 'paper' },
              { label: 'Toolformer: Language Models Can Teach Themselves to Use Tools', url: 'https://arxiv.org/abs/2302.04761', kind: 'paper' },
              { label: 'LLM Powered Autonomous Agents (Lilian Weng)', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', kind: 'article' },
              { label: 'OpenAI cookbook: tool-use examples', url: 'https://github.com/openai/openai-cookbook', kind: 'repo' },
              { label: 'DeepLearning.AI channel', url: 'https://www.youtube.com/@Deeplearningai', kind: 'video' },
            ],
            body: `
## What this lesson covers

An agent is a language model that runs in a loop. On each turn it reads the conversation so far, decides whether to call a tool, and then reads the result. This lesson shows the loop in pseudo-code, traces a small task through it, and lists the conditions that make it stop.

## Why it matters

A single model call answers one question. A loop lets the model gather information, act on a system, and check its own work. Most useful applications, from code assistants to support bots, use this loop. The loop is short to write. It is hard to make reliable, and the stop conditions are the first thing that breaks.

## The idea with an example

The user asks: "How many open bugs are assigned to Maria?" The agent has two tools. find_user maps a name to a user ID. count_issues counts issues for a user ID and a status.

Trace the loop step by step.

| Step | Model output | Tool result |
|---|---|---|
| 1 | Call find_user with name "Maria" | user_id = 4821 |
| 2 | Call count_issues with user_id 4821 and status "open" | count = 7 |
| 3 | Final answer: "Maria has 7 open bugs." | none |

On step 1 the model reads the question and sees that it needs a user ID. It calls find_user. The program runs the tool and appends the result to the conversation. On step 2 the model sees the ID and calls count_issues. On step 3 the model has what it needs and writes an answer with no tool call. The loop sees no tool call and stops.

The whole task used three model calls and two tool calls. A step budget of 10 would have been enough.

## How it works

The loop in pseudo-code:

    messages = [system_prompt, user_message]
    steps = 0
    while steps < MAX_STEPS:
        response = model(messages, tools)
        messages.append(response)
        if response has no tool_calls:
            return response.text
        for call in response.tool_calls:
            result = run_tool(call)
            messages.append(tool_result(call.id, result))
        steps = steps + 1
    return "Stopped: step budget reached"

The loop has three stages on every pass.

1. Observe: the model reads all messages, including the latest tool results.
2. Think: the model decides on the next tool call or on a final answer. Chain of thought, a short written plan before the action, helps here.
3. Act: the program runs the tool calls and appends the results.

This pattern is called ReAct, short for reason and act. The model alternates between a reasoning step and an action step.

Every loop needs stop conditions. There are four.

- The model returns a final answer with no tool call.
- The step count reaches the budget.
- The token count of the messages reaches a limit.
- A tool reports an error that the model cannot recover from, such as a permission failure.

Note: the step budget is a safety net, not a target. A budget of 20 steps with a typical task that takes 4 steps is reasonable.

Caution: a loop with no budget can run until the token bill is large. Set the budget before the first test.

## Common mistakes

- Mistake: run the loop with no step budget. Fix: set MAX_STEPS and a token limit before the first run.
- Mistake: drop tool results from the conversation to save tokens. Fix: keep results; the model needs them on the next turn.
- Mistake: let a tool exception crash the loop. Fix: catch the exception and append the error text as a tool result.
- Mistake: give the model a vague goal with no success check. Fix: state the goal and the form of the final answer in the system prompt.

## Check your understanding

- What ends the loop in the normal case? The model returns a response with no tool calls.
- The budget is 5 steps and the task needs 7 tool calls in sequence. What happens? The loop stops at step 5 and returns the budget message.
- In the trace above, how many model calls happened? Three: two with tool calls and one with the final answer.

## Go further

The ReAct paper introduced the reason and act pattern and shows traces like the one above. Toolformer shows how a model can learn when to call a tool. Lilian Weng's article surveys planning, memory, and tool use for agents in one place. The OpenAI cookbook has runnable loop examples. The DeepLearning.AI channel hosts short courses on agent design.
`,
          },
          {
            slug: 'tool-design',
            title: 'Designing tools for a model',
            summary: 'Narrow, typed tools with clear errors produce better tool calls than broad, loose ones.',
            minutes: 14,
            objectives: [
              'Write a tool schema with typed inputs and a one-sentence description.',
              'Explain why errors must return as observations rather than exceptions.',
              'Separate read tools from write tools and make write tools idempotent.',
              'Rewrite a bad tool into two good tools.',
            ],
            keyTerms: ['tool schema', 'json schema', 'idempotency', 'observation', 'read tool', 'write tool'],
            links: [
              { label: 'Toolformer: Language Models Can Teach Themselves to Use Tools', url: 'https://arxiv.org/abs/2302.04761', kind: 'paper' },
              { label: 'Anthropic cookbook: tool-use notebooks', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'repo' },
              { label: 'OpenAI cookbook: function-calling examples', url: 'https://github.com/openai/openai-cookbook', kind: 'repo' },
              { label: 'Building LLM applications for production (Chip Huyen)', url: 'https://huyenchip.com/2023/04/11/llm-engineering.html', kind: 'article' },
            ],
            body: `
## What this lesson covers

A tool is a function that the model can call by name with typed arguments. This lesson shows how to write the schema for a tool, how to shape its results, and how to handle errors. You rewrite one bad tool into two good tools.

## Why it matters

The model chooses tools from their names and descriptions. It fills arguments from the schema. A vague tool produces vague calls, and vague calls produce wrong results. A tool that throws an exception kills the loop. A tool that returns an error message lets the model try again. Good tool design is the cheapest way to raise agent reliability.

## The idea with an example

Here is a bad tool.

    {
      "name": "do_database",
      "description": "Database operations",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" }
        }
      }
    }

The model has to write raw query text. It does not know the table names. It can delete data by mistake. When the query fails, the server throws and the loop stops.

Split it into two narrow tools. The first reads.

    {
      "name": "find_customer",
      "description": "Return the id, name and email of customers whose name contains the given text. Read only.",
      "parameters": {
        "type": "object",
        "properties": {
          "name_contains": { "type": "string", "description": "Part of the customer name, case-insensitive" },
          "limit": { "type": "integer", "minimum": 1, "maximum": 20, "default": 5 }
        },
        "required": ["name_contains"]
      }
    }

The second writes.

    {
      "name": "update_customer_email",
      "description": "Set the email of one customer. Safe to call twice with the same arguments.",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "integer" },
          "email": { "type": "string", "format": "email" }
        },
        "required": ["customer_id", "email"]
      }
    }

Now trace a call. The model calls find_customer with name_contains = "Lopez". The tool returns:

    {"results": [{"id": 311, "name": "Ana Lopez", "email": "ana@old.com"}], "count": 1}

The model then calls update_customer_email with customer_id 311. If the email is malformed, the tool returns:

    {"error": "invalid_email", "message": "Email must contain @", "retryable": true}

The model reads the message and sends a corrected call. The loop never crashed.

## How it works

Follow these rules when you write a tool.

1. Give the tool one job. Name it with a verb and a noun: find_customer, not customer_tool.
2. Write a one or two sentence description that says what the tool returns and when to use it.
3. Type every argument. Add minimum, maximum, enum, and default values where they apply.
4. Mark the required arguments. Keep optional arguments few.
5. Return a small, structured result. Include a count or a status field.
6. Return errors as data with an error code, a message, and a retryable flag.
7. Separate read tools from write tools. Let the system prompt say which ones need care.
8. Make write tools idempotent. A second call with the same arguments must produce the same state.

Idempotency means that repeating an action has no extra effect. An agent that retries a non-idempotent tool, such as send_invoice, can send two invoices. Add an idempotency key or make the tool check for an existing record.

The description budget matters too. If the agent has 30 tools with 100 tokens each, the tool list costs 3,000 tokens on every call. Keep descriptions short and remove tools the task does not need.

Note: a tool result is an observation. The model reads it as text, so a clear message is more useful than a stack trace.

Caution: a write tool with no confirmation can change production data on the first wrong call. Test write tools against a staging system.

## Common mistakes

- Mistake: one tool that takes a free-text command. Fix: split it into named tools with typed arguments.
- Mistake: tool errors raise exceptions. Fix: catch them and return a structured error object.
- Mistake: tools return 50 kilobytes of raw data. Fix: return the fields the task needs and a count.
- Mistake: a retry sends a payment twice. Fix: make the tool idempotent with a request key.
- Mistake: descriptions say "Does things with users". Fix: say what it returns and when to use it.

## Check your understanding

- Why return errors as observations? The model can read the message and correct its next call, while an exception stops the loop.
- What makes a write tool safe to retry? Idempotency: the same arguments produce the same final state.
- You have 40 tools at 120 tokens each. What is the tool list cost per call? 4,800 tokens.

## Go further

The Toolformer paper shows how tool use emerges from training data. The Anthropic and OpenAI cookbooks contain schema examples and complete loops you can run. Chip Huyen's article covers the engineering around tools, including testing and cost.
`,
          },
          {
            slug: 'agent-reliability',
            title: 'The reliability arithmetic of agents',
            summary: 'Per-step success rates multiply, so long tasks need retries, checks, and fallbacks.',
            minutes: 15,
            objectives: [
              'Compute the success rate of an n-step task from the per-step rate.',
              'Compute how retries raise the per-step success rate.',
              'Choose between retries, fallbacks, and verification for a given failure.',
              'Design checkpoints so a failed task can resume.',
            ],
            keyTerms: ['per-step success rate', 'retry', 'fallback', 'verification', 'checkpoint', 'react'],
            links: [
              { label: 'Reflexion: Language Agents with Verbal Reinforcement Learning', url: 'https://arxiv.org/abs/2303.11366', kind: 'paper' },
              { label: 'Tree of Thoughts: Deliberate Problem Solving with Large Language Models', url: 'https://arxiv.org/abs/2305.10601', kind: 'paper' },
              { label: 'ReAct: Synergizing Reasoning and Acting in Language Models', url: 'https://arxiv.org/abs/2210.03629', kind: 'paper' },
              { label: 'DSPy: programs that optimise prompts and pipelines', url: 'https://github.com/stanfordnlp/dspy', kind: 'repo' },
              { label: 'Full Stack Deep Learning: LLM Bootcamp', url: 'https://fullstackdeeplearning.com/llm-bootcamp/', kind: 'course' },
            ],
            body: `
## What this lesson covers

An agent task is a chain of steps. Each step can fail. This lesson gives the arithmetic that links the per-step success rate to the task success rate. It then shows the three tools that raise the rate: retries, verification, and fallbacks. It ends with checkpoints, so a task that fails late does not start over.

## Why it matters

A step that works 95 percent of the time feels reliable in a demo. A task with 20 such steps works about one time in three. Teams see this gap when they move from demos to production. The arithmetic tells you how many steps you can afford and where to add protection.

## The idea with an example

Let $p$ be the probability that one step succeeds. Let $n$ be the number of steps in sequence. If the steps are independent, the task succeeds with probability:

$$P_{\\text{task}} = p^n$$

Here $P_{\\text{task}}$ is the probability that every step succeeds.

Compute $p = 0.95$ and $n = 20$: $0.95^{20} = 0.358$. The task works 36 percent of the time.

| Steps $n$ | $p = 0.90$ | $p = 0.95$ | $p = 0.99$ |
|---|---|---|---|
| 1 | 0.90 | 0.95 | 0.99 |
| 5 | 0.59 | 0.77 | 0.95 |
| 10 | 0.35 | 0.60 | 0.90 |
| 20 | 0.12 | 0.36 | 0.82 |
| 50 | 0.005 | 0.08 | 0.61 |

Now add retries. If a step fails, the program runs it again, up to $r$ extra times. A step with $r$ retries succeeds unless every attempt fails:

$$p_{\\text{retry}} = 1 - (1 - p)^{r + 1}$$

Here $p_{\\text{retry}}$ is the success rate of the step with retries. With $p = 0.95$ and $r = 2$: $1 - 0.05^3 = 1 - 0.000125 = 0.999875$. Over 20 steps: $0.999875^{20} = 0.9975$. Two retries per step move the task from 36 percent to 99.7 percent.

This only works when failures are random. If a step fails because the tool always rejects the input, a retry fails the same way. That is where verification and fallbacks come in.

## How it works

Follow this procedure to design for reliability.

1. Count the steps in the task and estimate $p$ per step from logs.
2. Compute $p^n$. If it is below the target, continue.
3. Classify each failure as random or systematic. A timeout is random. A wrong argument is systematic.
4. Add retries with a short delay for random failures.
5. Add a verification step after each important action. The verifier is a tool or a second model call that checks the result.
6. Add a fallback for systematic failures: a simpler tool, a smaller plan, or a hand-off to a human.
7. Write a checkpoint after each completed step so a resumed task skips finished work.

Verification turns a silent failure into a detected failure. A step with $p = 0.95$ and a verifier that catches 90 percent of errors leaves $0.05 \\times 0.10 = 0.005$ undetected errors. The detected ones go back for a retry or a fallback.

A fallback is a second path that is more reliable but less capable. For a search tool that fails on complex queries, the fallback is a plain keyword search. For a 10-step plan that fails, the fallback is a 3-step plan with a human review.

Checkpoints store the state after each step: the messages so far, the tool results, and a step index. If the process restarts, it loads the checkpoint and continues from the last completed step.

Note: retries cost tokens and time. Two retries on every step can double the worst-case cost.

Caution: never retry a write tool that is not idempotent. A retried payment is a double payment.

## Common mistakes

- Mistake: measure the per-step rate on a demo and assume it holds. Fix: measure $p$ from production logs per tool.
- Mistake: retry every failure. Fix: retry random failures only; route systematic ones to a fallback.
- Mistake: let the model verify its own output with no tool. Fix: use a tool or a second, independent check.
- Mistake: restart the whole task after one late failure. Fix: checkpoint after each step and resume.
- Mistake: plan 50 steps when 10 would do. Fix: shorten the chain, because fewer steps multiply fewer risks.

## Check your understanding

- With $p = 0.90$ and $n = 10$, what is the task success rate? $0.90^{10} = 0.35$.
- With $p = 0.90$ and $r = 1$ retry, what is the per-step rate? $1 - 0.10^2 = 0.99$.
- A tool rejects a malformed date on every attempt. Retry or fallback? Fallback, because the failure is systematic.

## Go further

Open the Agent Control Room lab at /labs/agent-control-room to change $p$, $n$, and the retry count and watch the task rate move. The Reflexion paper shows an agent that uses verbal feedback to retry with a better plan. Tree of Thoughts explores several plans and prunes the weak ones. DSPy optimises prompts across a pipeline, which raises $p$ at the source. The LLM Bootcamp course covers these trade-offs in a production setting.
`,
          },
          {
            slug: 'agent-memory',
            title: 'Memory and context management for agents',
            summary: 'Keep a long conversation useful with rolling summaries, structured scratchpads, and retrieval over past turns.',
            minutes: 16,
            objectives: [
              'Compute the token cost of a long conversation with and without summaries.',
              'Explain the three memory strategies and what each one loses.',
              'Choose a memory strategy for a given task length and budget.',
              'Design a scratchpad schema for a multi-step task.',
            ],
            keyTerms: ['context window', 'rolling summary', 'scratchpad', 'retrieval over history', 'embedding', 'in-context-learning'],
            links: [
              { label: 'MemGPT: Towards LLMs as Operating Systems', url: 'https://arxiv.org/abs/2310.08560', kind: 'paper' },
              { label: 'Generative Agents: Interactive Simulacra of Human Behavior', url: 'https://arxiv.org/abs/2304.03442', kind: 'paper' },
              { label: 'Lost in the Middle: How Language Models Use Long Contexts', url: 'https://arxiv.org/abs/2307.03172', kind: 'paper' },
              { label: 'LangChain: memory and retrieval components', url: 'https://github.com/langchain-ai/langchain', kind: 'repo' },
              { label: 'LLM Powered Autonomous Agents (Lilian Weng)', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', kind: 'article' },
            ],
            body: `
## What this lesson covers

The context window is the number of tokens the model can read in one call. A long agent session fills it. This lesson compares three ways to keep the useful parts: rolling summaries, structured scratchpads, and retrieval over past turns.

## Why it matters

Every model call re-reads the whole conversation. Cost and latency grow with the number of tokens. Models also lose accuracy on facts in the middle of a long context. Memory management keeps both numbers under control.

## The idea with an example

Take a support session with 50 turns. Each turn, a user message plus an agent reply plus tool results, is about 400 tokens. With no memory management the context grows by 400 tokens per turn.

| Turn | Context tokens (no management) |
|---|---|
| 10 | 4,000 |
| 25 | 10,000 |
| 50 | 20,000 |

The total tokens read over the session is the sum of all turns. That is $400 \\times (1 + 2 + \\ldots + 50) = 510{,}000$ tokens.

Now add a rolling summary every 10 turns. The program replaces the oldest 10 turns with a 300 token summary. The context never exceeds about 4,300 tokens: one summary plus 10 recent turns. The total over 50 turns is at most $50 \\times 4{,}300 = 215{,}000$ tokens. That is a 2 to 3 times cost saving. The price is that fine details from early turns are lost unless the summary keeps them.

Add a structured scratchpad. The agent keeps a small JSON object with the facts that matter: the customer ID, the open ticket number, the steps completed. The scratchpad is about 200 tokens and never grows beyond a fixed schema. The model reads it on every turn.

Add retrieval over history. The program embeds every past turn and stores the vectors. On each new turn it retrieves the 3 most similar past turns and adds them to the context. This brings back detail that the summary dropped, for about 1,200 extra tokens.

| Strategy | Context size at turn 50 | What it loses | Extra latency |
|---|---|---|---|
| None | 20,000 tokens | Nothing, until the window is full | None |
| Rolling summary | about 4,300 tokens | Fine detail from old turns | One summary call per 10 turns |
| Scratchpad | about 200 tokens plus recent turns | Anything not in the schema | None |
| Retrieval | about 1,200 extra tokens | Turns that do not match the query | 20 to 50 ms |


## How it works

Implement memory management with this procedure.

1. Define a scratchpad schema with the fields the task needs. Update it after each tool result.
2. Keep the last K turns in full. K = 10 is a common choice.
3. When the turn count passes K, summarise the oldest turns into a short paragraph. Keep names, numbers, and decisions.
4. Embed each turn as it ends and store it in a vector index keyed by session.
5. On each new turn, retrieve the top 3 similar past turns. Add them before the recent turns.
6. Assemble the context in this order: system prompt, scratchpad, summary, retrieved turns, recent turns.

The context size with this plan is bounded:

$$C = S + P + M + R \\cdot t + K \\cdot t$$

Here $C$ is the context in tokens, $S$ is the system prompt, $P$ is the scratchpad, and $M$ is the summary. $R$ is the number of retrieved turns, $K$ is the number of recent turns, and $t$ is the average tokens per turn. Set $S = 800$, $P = 200$, $M = 300$, $R = 3$, $K = 10$, and $t = 400$. Then $C = 6{,}500$ tokens at any turn.

Note: put the most important facts in the scratchpad, not in the summary. The scratchpad does not drift.

Caution: a summary written by the model can invent details. Keep the raw turns in storage so a human can check.

## Common mistakes

- Mistake: let the context grow until the model rejects the call. Fix: set K and summarise early.
- Mistake: summarise the scratchpad facts along with the chat. Fix: keep the scratchpad separate and structured.
- Mistake: retrieve 20 past turns on every call. Fix: retrieve 3 to 5; more adds noise and cost.
- Mistake: delete raw history after a summary. Fix: store it; retrieval and audits need it.

## Check your understanding

- A 40-turn session at 500 tokens per turn with no management. What is the context at turn 40? 20,000 tokens.
- Which strategy keeps exact numbers from turn 3 available at turn 45? Retrieval over history, or the scratchpad if the number was stored there.
- Why place the scratchpad before the recent turns? Models read the start and end of the context best, and the scratchpad holds the key facts.

## Go further

MemGPT treats the context window as a cache and moves data in and out like an operating system. The Generative Agents paper uses a memory stream with retrieval scored by recency and relevance. Lost in the Middle explains why context order matters. LangChain ships summary, buffer, and vector memory classes you can compare. Lilian Weng's article covers memory types in the wider agent picture.
`,
          },
        ],
      },
      {
        slug: 'prompting-and-structured-output',
        title: 'Prompting and structured output',
        description: 'Write prompts that a model follows and outputs that a program can parse.',
        lessons: [
          {
            slug: 'prompt-structure',
            title: 'The structure of a good prompt',
            summary: 'A prompt has a fixed order of parts, and the order changes the result.',
            minutes: 14,
            objectives: [
              'Explain the difference between the system role and the user role.',
              'Order the five parts of a prompt: role, task, context, constraints, output format.',
              'Place instructions where a model reads them best in a long prompt.',
              'Version a prompt so that a change can be tested and reverted.',
            ],
            keyTerms: ['system prompt', 'user prompt', 'delimiter', 'in-context-learning', 'prompt version'],
            links: [
              { label: 'Lost in the Middle: how models use long contexts', url: 'https://arxiv.org/abs/2307.03172', kind: 'paper' },
              { label: 'Training language models to follow instructions (InstructGPT)', url: 'https://arxiv.org/abs/2203.02155', kind: 'paper' },
              { label: 'Lilian Weng: prompt engineering', url: 'https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/', kind: 'article' },
              { label: 'Anthropic cookbook (prompt examples)', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'repo' },
              { label: 'promptfoo: test prompts like code', url: 'https://github.com/promptfoo/promptfoo', kind: 'repo' },
            ],
            body: `
## What this lesson covers

A prompt is the text you send to a language model. This lesson shows the parts of a prompt and the order that works. You rewrite a weak prompt for a support-ticket classifier into a strong one. You also learn how to version a prompt.

## Why it matters

A model does what the prompt says, not what you mean. A prompt with no stated output format returns prose when you want a label. A prompt with the task hidden after a long document loses the task. Most production failures of a model call come from the prompt, not from the model. A fixed structure removes a whole class of these failures.

## The idea with an example

A model call has two roles. The system prompt sets the role and the rules for the whole conversation. The user prompt carries the request for one turn.

Here is a weak prompt for a ticket classifier.

    Classify this ticket: "My card was charged twice for order 8841."

The model may answer with a sentence, a label, or a question. Three calls give three different shapes. Now the strong version.

    System:
    You are a support triage assistant for an online shop.
    Task: assign exactly one category to each ticket.
    Allowed categories: billing, shipping, account, product, other.
    Rules:
    - Output only the category name in lower case.
    - If two categories apply, choose the one the customer asks to fix.
    - If the ticket is empty, output: other

    User:
    <ticket>
    My card was charged twice for order 8841.
    </ticket>

The strong prompt has five parts in a fixed order:

1. Role: "support triage assistant for an online shop".
2. Task: "assign exactly one category".
3. Context: the list of allowed categories.
4. Constraints: the three rules.
5. Output format: "only the category name in lower case".

The tags around the ticket are delimiters. A delimiter is a marker that separates data from instructions. The model then does not treat a sentence inside the ticket as an instruction. The output is now one token: "billing".

## How it works

A model predicts the next token from all tokens before it. The parts that come first set the frame for everything after. The role tells the model which register to use. The task tells it what to produce. The context gives the facts. The constraints remove options. The output format fixes the shape.

Position also matters inside long prompts. Research on long contexts shows that a model attends most to the start and the end of the prompt. Facts in the middle get less weight. Use this procedure for a prompt with a long document:

1. Put the role and the task at the start of the system prompt.
2. Put the document inside delimiters in the user prompt.
3. Repeat the task and the output format in one line after the document.
4. Keep the total length well below the context window.

Version every prompt like code. Store it in a file with a name and a version, for example triage_v3.txt. Record the model name and the date next to it. When a prompt changes, run the evaluation set before and after. Keep the old version until the new one passes.

Note: a prompt is one input to the model. The temperature and the maximum output length also change the result. Record them with the prompt version.

## Common mistakes

- Mistake: put the task after a 5,000-token document and nowhere else. Fix: state the task before the document and repeat it after.
- Mistake: paste user data directly into the instruction text. Fix: wrap data in delimiters and tell the model to treat it as data.
- Mistake: ask for "a short answer" and expect a label. Fix: state the exact output format and give the allowed values.
- Mistake: edit a prompt in the code of a running service. Fix: store prompts in versioned files and test each change on a golden set.
- Mistake: write a rule in the negative only, such as "do not be verbose". Fix: state the positive rule, such as "output one word".

## Check your understanding

- Which prompt part fixes the shape of the output? The output format part, with the exact allowed values.
- Where does a model attend least in a long prompt? The middle, so put the task at the start and repeat it at the end.
- Why use delimiters around a ticket? They separate data from instructions, so the model does not follow text inside the ticket.

## Go further

The Lost in the Middle paper measures how answer quality changes with the position of a fact in the prompt. The InstructGPT paper explains how models learn to follow instructions, which is why the system role works. Lilian Weng's prompt engineering post surveys the main techniques. The Anthropic cookbook has worked prompt examples you can copy. Use promptfoo to run a prompt against a test set on every change.
`,
          },
          {
            slug: 'few-shot-prompting',
            title: 'Few-shot prompting',
            summary: 'Examples in the prompt teach the model a task without training.',
            minutes: 15,
            objectives: [
              'Explain in-context learning and the difference between zero-shot and few-shot prompts.',
              'Choose the number of examples from a measured accuracy curve.',
              'Compute the daily token cost of the examples in a prompt.',
              'Decide when to replace few-shot examples with fine-tuning.',
            ],
            keyTerms: ['in-context-learning', 'zero-shot', 'few-shot', 'label balance', 'chain-of-thought'],
            links: [
              { label: 'Language models are few-shot learners (GPT-3)', url: 'https://arxiv.org/abs/2005.14165', kind: 'paper' },
              { label: 'Calibrate before use: example order and label bias', url: 'https://arxiv.org/abs/2102.09690', kind: 'paper' },
              { label: 'Chain-of-thought prompting', url: 'https://arxiv.org/abs/2201.11903', kind: 'paper' },
              { label: 'DSPy: programs that pick examples for you', url: 'https://github.com/stanfordnlp/dspy', kind: 'repo' },
              { label: 'DeepLearning.AI channel', url: 'https://www.youtube.com/@Deeplearningai', kind: 'video' },
            ],
            body: `
## What this lesson covers

In-context learning is the ability of a model to do a task from examples in the prompt. This lesson compares zero-shot prompts and few-shot prompts. You read an accuracy table, pick a number of examples, and compute what the examples cost per day. You also learn when few-shot stops and fine-tuning starts.

## Why it matters

Few-shot examples are the cheapest way to raise the accuracy of a task. You change text, not weights. But every example costs tokens on every call. A team that adds 10 examples to a prompt with 10,000 calls per day pays for them every day. You need both numbers, accuracy and cost, to choose well.

## The idea with an example

Take the ticket classifier from the previous lesson. A zero-shot prompt gives the task and the categories but no examples. A few-shot prompt adds labelled tickets before the real one.

    Ticket: "Where is my parcel? It said delivered yesterday."
    Category: shipping

    Ticket: "I cannot log in after I changed my email."
    Category: account

    Ticket: "You charged me twice for order 8841."
    Category: billing

    Ticket: "<the real ticket>"
    Category:

Now measure accuracy on a labelled set of 500 tickets with a different number of examples. The table shows illustrative results.

| Examples | Accuracy | Extra tokens per call |
|---|---|---|
| 0 | 71% | 0 |
| 3 | 84% | 360 |
| 8 | 86% | 960 |

The jump from 0 to 3 examples adds 13 points. The jump from 3 to 8 adds 2 points at almost three times the tokens. Three examples is the right choice here.

Now compute the cost. Each example is about 120 tokens. Three examples add 360 tokens per call. At 10,000 calls per day the examples add 3.6 million tokens per day. Assume 3 dollars per million input tokens. The examples cost 10.80 dollars per day, or about 325 dollars per month. Compare that with the cost of the errors the examples remove.

## How it works

A model sees the examples as part of the sequence. It learns the pattern of input and output from them and continues the pattern. No weight changes. The model did learn the general skill during training. The examples only tell it which skill to use and in which format.

The content and the order of the examples both matter:

- Cover every label. A set with three billing tickets and no shipping tickets pushes the model toward billing.
- Balance the labels. Give about the same number of examples per label.
- Vary the order. Models often prefer the label of the last example. Measure accuracy with two or three orders and keep a stable one.
- Keep the format identical to the real input. The model copies the format of the examples.

Use this procedure to pick the number of examples:

1. Build a labelled test set of at least 200 items.
2. Measure accuracy at 0, 1, 3, 5, and 8 examples.
3. Find the smallest count after which accuracy gains less than 2 points.
4. Compute the token cost at that count for one day of traffic.
5. Compare the cost with the value of the extra accuracy.

Few-shot stops at a limit. If the task needs more than about 20 examples, or if the examples fill a large part of the context, fine-tuning is cheaper. Fine-tuning puts the examples into the weights once and removes them from every call.

Note: chain-of-thought examples, where each example shows its reasoning steps, help on multi-step tasks. They cost more tokens per example.

## Common mistakes

- Mistake: use examples from one label only. Fix: give a balanced set across all labels.
- Mistake: write examples in a format different from the real input. Fix: use the same delimiters and fields for examples and input.
- Mistake: add examples without a test set and assume accuracy rises. Fix: measure accuracy at each count on a labelled set.
- Mistake: keep 15 examples in a prompt with high traffic. Fix: compute the daily token cost and compare with fine-tuning.
- Mistake: use test-set items as examples. Fix: keep examples and the test set separate.

## Check your understanding

- What changes in the model during in-context learning? Nothing; the weights stay fixed and only the prompt changes.
- Three examples of 120 tokens at 10,000 calls per day cost how many tokens? 3.6 million tokens per day.
- When is fine-tuning the better choice? When the task needs many examples, or when the examples cost more each day than one training run.

## Go further

The GPT-3 paper introduced the term few-shot learner and shows accuracy curves against the number of examples. The Calibrate Before Use paper measures how example order and label imbalance shift the output. The chain-of-thought paper shows that worked reasoning in examples improves multi-step tasks. DSPy searches for good examples automatically. The DeepLearning.AI channel has short courses on prompting.
`,
          },
          {
            slug: 'json-schema-output',
            title: 'Structured output with JSON Schema',
            summary: 'A schema turns model text into data that a program can trust.',
            minutes: 16,
            objectives: [
              'Write a JSON Schema with type, properties, required, and enum.',
              'Explain the difference between prompt-only output and constrained decoding.',
              'Build a validation and retry loop around a model call.',
              'Estimate the failure rate of a pipeline before and after a schema.',
            ],
            keyTerms: ['JSON Schema', 'constrained decoding', 'validation', 'retry loop', 'softmax'],
            links: [
              { label: 'JSON Schema: getting started', url: 'https://json-schema.org/learn', kind: 'docs' },
              { label: 'Outlines: constrained generation', url: 'https://github.com/dottxt-ai/outlines', kind: 'repo' },
              { label: 'Guidance: structured generation', url: 'https://github.com/guidance-ai/guidance', kind: 'repo' },
              { label: 'Pydantic: validate data in Python', url: 'https://github.com/pydantic/pydantic', kind: 'repo' },
              { label: 'vLLM documentation (structured outputs)', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
            ],
            body: `
## What this lesson covers

A program cannot read prose. It can read JavaScript Object Notation (JSON). This lesson shows how a JSON Schema describes the exact shape you want. You compare two ways to get that shape: a prompt alone, or constrained decoding. You then build a validation loop and compute what it does to the failure rate.

## Why it matters

An extraction pipeline runs thousands of model calls per hour. If one call in twenty returns a broken JSON object, the pipeline stops or stores bad data. Structured output moves the shape check from a human to a schema. Every downstream step then gets data with known fields and known types.

## The idea with an example

Take an invoice. You want the invoice number, the total, the currency, and the due date. Write the schema first.

    {
      "type": "object",
      "properties": {
        "invoice_number": { "type": "string" },
        "total": { "type": "number" },
        "currency": { "type": "string", "enum": ["EUR", "USD", "GBP"] },
        "due_date": { "type": "string", "format": "date" }
      },
      "required": ["invoice_number", "total", "currency"],
      "additionalProperties": false
    }

Read the parts. The "type" sets the data type of each field. The "properties" list the fields. The "required" list names fields that must appear. The "enum" restricts a field to a fixed list of values. The "additionalProperties: false" rule rejects any field you did not name.

Send an invoice and the schema to the model. A correct answer looks like this.

    { "invoice_number": "INV-2041", "total": 1280.5, "currency": "EUR", "due_date": "2026-11-30" }

Now measure a pipeline of 1,000 invoices. The numbers are illustrative.

| Method | Broken JSON | Wrong type or missing field | Usable |
|---|---|---|---|
| Prompt only, no validation | 4% | 6% | 90% |
| Prompt plus validation and one retry | 0.3% | 1% | 98.7% |
| Constrained decoding | 0% | 0.2% | 99.8% |

Validation and one retry recover most failures. Constrained decoding removes the shape failures at the source.

## How it works

There are two mechanisms.

Prompt-only output puts the schema in the prompt and asks for JSON. The model usually complies. It can still add a sentence before the JSON, miss a field, or write a number as a string. You must validate.

Constrained decoding changes the sampling step. At each token the engine computes the set of tokens that keep the output valid against the schema. It sets the probability of every other token to zero before it samples. The output is valid JSON by construction. The engine, not the prompt, enforces the shape. Open-source engines offer this through a grammar or a schema option.

Use this procedure for the validation loop:

1. Call the model with the schema in the prompt or in the request.
2. Parse the response as JSON. If parsing fails, go to step 5.
3. Validate the object against the schema. If validation fails, go to step 5.
4. Return the object and stop.
5. Send the error message back to the model and ask for a corrected object.
6. Repeat from step 2 at most two times, then raise an error.

Caution: a valid shape is not a correct value. The schema cannot tell that the total is 1280.5 and not 128.05. Keep a separate accuracy check on a golden set.

Note: the "format" keyword, such as "date", is a hint in many validators and not a hard rule. Check the validator settings.

## Common mistakes

- Mistake: ask for JSON with no schema and parse the first bracket. Fix: define a schema and validate every response.
- Mistake: allow extra fields. Fix: set additionalProperties to false so a renamed field fails early.
- Mistake: retry forever on an invalid response. Fix: cap retries at two and log the failure.
- Mistake: trust a valid object as a correct one. Fix: measure field accuracy on a labelled set.
- Mistake: use free text for a field with five known values. Fix: use an enum.

## Check your understanding

- What does the required list do? It names the fields that must appear, so a missing field fails validation.
- How does constrained decoding guarantee valid JSON? It sets the probability of every token that breaks the schema to zero before sampling.
- Does a valid schema prove the total is right? No; it proves the shape, and a golden set checks the values.

## Go further

The JSON Schema site has a short guide that covers every keyword used in this lesson. Outlines and Guidance are libraries that implement constrained decoding on open models. Pydantic validates objects in Python and produces a schema from a class. The vLLM documentation describes the structured output options in a serving engine.
`,
          },
          {
            slug: 'tool-schemas',
            title: 'Tool schemas the model can use',
            summary: 'A tool definition is a name, a description, and an input schema that the model reads.',
            minutes: 15,
            objectives: [
              'Write a tool definition with a name, a description, and an input schema.',
              'Rewrite a vague tool description into one that the model calls correctly.',
              'Describe how a program validates and executes a tool call.',
              'Explain when a model makes parallel tool calls.',
            ],
            keyTerms: ['tool definition', 'input schema', 'tool call', 'enum', 'parallel tool calls', 'in-context-learning'],
            links: [
              { label: 'JSON Schema: getting started', url: 'https://json-schema.org/learn', kind: 'docs' },
              { label: 'Anthropic cookbook (tool use examples)', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'repo' },
              { label: 'OpenAI cookbook (function calling examples)', url: 'https://github.com/openai/openai-cookbook', kind: 'repo' },
              { label: 'Pydantic: generate schemas from classes', url: 'https://github.com/pydantic/pydantic', kind: 'repo' },
              { label: 'Full Stack LLM Bootcamp', url: 'https://fullstackdeeplearning.com/llm-bootcamp/', kind: 'course' },
            ],
            body: `
## What this lesson covers

A tool is a function that your program runs when the model asks for it. The model never runs code. It writes a tool call, a small JSON object with the tool name and the arguments. This lesson shows how to define a tool so that the model calls it correctly. You rewrite a weak weather tool into a good one.

## Why it matters

An agent is a model in a loop with tools. Most agent failures start with a bad tool call. The call has a wrong argument, a missing field, or the wrong tool. The model reads only three things about a tool: the name, the description, and the input schema. These three strings are the whole interface. Good strings give good calls.

## The idea with an example

Here is a weak tool definition.

    {
      "name": "weather",
      "description": "Gets weather.",
      "input_schema": {
        "type": "object",
        "properties": {
          "loc": { "type": "string" },
          "u": { "type": "string" }
        }
      }
    }

The model does not know what "loc" accepts. A city name, a postcode, or coordinates? It does not know what "u" means. Nothing is required, so it may send an empty object. Now the strong version.

    {
      "name": "get_current_weather",
      "description": "Return the current temperature and conditions for one city.
        Use this when the user asks about weather now. Do not use it for forecasts.",
      "input_schema": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "description": "City name in English, for example Paris or Osaka."
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit. Default to celsius."
          }
        },
        "required": ["city"]
      }
    }

The name says what the tool returns. The description says when to use it and when not to. Each field has a description with an example. The unit is an enum with two values, so the model cannot send "C" or "degrees". The city is required.

Run the user message "Is it raining in Lisbon?" against both tools. The weak tool gives calls like {"loc": "Lisbon?"} or {}. The strong tool gives {"city": "Lisbon", "unit": "celsius"} almost every time.

## How it works

The model receives the tool definitions in the prompt, in a fixed format that it saw during training. It treats them as part of the context. When the model decides a tool fits, it writes a tool call instead of a text answer. Your program then follows this procedure:

1. Read the tool name from the call. If the name is not in your list, return an error message to the model.
2. Validate the arguments against the input schema. If validation fails, return the error text to the model.
3. Run the function with the validated arguments.
4. Return the result to the model as a tool result message.
5. Call the model again with the result in the conversation.

Return errors as messages, not as crashes. The model can read "city not found" and try again. It cannot recover from a stopped program.

A model can also write several tool calls in one response. This is a parallel tool call. It happens when the calls do not depend on each other, for example the weather in two cities. Run them at the same time and return all results in one turn. This saves one model call per extra tool.

Note: keep the number of tools small. A model with 40 tools picks the wrong one more often than a model with 8. Group tools by task and give each agent only the tools it needs.

## Common mistakes

- Mistake: describe a tool in two words. Fix: state what it returns, when to use it, and when not to.
- Mistake: accept a unit as free text. Fix: use an enum with the exact allowed values.
- Mistake: make every field optional. Fix: mark the fields the function cannot run without as required.
- Mistake: raise an exception when the model sends a bad argument. Fix: return the validation error as a tool result so the model can correct it.
- Mistake: give one agent every tool in the company. Fix: give each agent a short list of tools for its task.

## Check your understanding

- What are the three parts of a tool definition that the model reads? The name, the description, and the input schema.
- Why use an enum for the unit field? It limits the value to a fixed list, so the model cannot send an unknown unit.
- What is a parallel tool call? One model response with several tool calls that your program can run at the same time.

## Go further

The JSON Schema guide covers the keywords used in input schemas. The Anthropic cookbook and the OpenAI cookbook contain runnable tool-use examples with full loops. Pydantic generates an input schema from a Python class, which keeps the schema and the function in sync. The Full Stack LLM Bootcamp has a lecture on building applications around tool calls.
`,
          },
        ],
      },
      {
        slug: 'evaluation',
        title: 'Evaluation',
        description: 'Measure a model system with a labelled set, a judge, and a regression test.',
        lessons: [
          {
            slug: 'golden-sets',
            title: 'Golden sets',
            summary: 'A golden set is a fixed, labelled test set that every change must pass.',
            minutes: 15,
            objectives: [
              'Explain what a golden set is and what it is not.',
              'Build a golden set from production logs with stratified sampling.',
              'Compute Cohen\'s kappa from a 2x2 agreement table.',
              'Version a golden set and keep it out of the training data.',
            ],
            keyTerms: ['golden set', 'stratified sampling', 'annotator agreement', 'Cohen\'s kappa', 'leakage'],
            links: [
              { label: 'OpenAI evals framework', url: 'https://github.com/openai/evals', kind: 'repo' },
              { label: 'LM Evaluation Harness', url: 'https://github.com/EleutherAI/lm-evaluation-harness', kind: 'repo' },
              { label: 'Hugging Face evaluate library', url: 'https://github.com/huggingface/evaluate', kind: 'repo' },
              { label: 'Eugene Yan: patterns for building LLM systems', url: 'https://eugeneyan.com/writing/llm-patterns/', kind: 'article' },
              { label: 'StatQuest channel (statistics basics)', url: 'https://www.youtube.com/@statquest', kind: 'video' },
            ],
            body: `
## What this lesson covers

A golden set is a fixed list of inputs with correct outputs that humans checked. This lesson shows how to build one from real traffic. You learn how to label items with two annotators and how to measure their agreement with Cohen's kappa. You also learn how to version the set and keep it out of training data.

## Why it matters

Without a golden set, every prompt change is a guess. A team ships a new prompt because three examples looked better. A week later a category that nobody checked has dropped from 90 percent to 70 percent. A golden set turns "looks better" into a number that you can compare across every change.

## The idea with an example

Take the ticket classifier with five categories. Production logs hold 40,000 tickets from the last month. You want a golden set of 200 items.

First, stratify. Stratified sampling draws a fixed number of items from each group, so small groups are not lost. The table shows the traffic and the sample.

| Category | Share of traffic | Items in golden set |
|---|---|---|
| billing | 45% | 50 |
| shipping | 30% | 50 |
| account | 15% | 40 |
| product | 8% | 40 |
| other | 2% | 20 |

The sample is not proportional. The "other" category has 2 percent of traffic but 20 items, so a 10 percent accuracy change in that category is visible.

Second, label with two annotators. Each person labels all 200 items without seeing the other person's labels. Now measure agreement. Take one category, billing, as a yes or no question. The 2x2 table counts the pairs.

| | B says billing | B says not billing |
|---|---|---|
| A says billing | 46 | 4 |
| A says not billing | 6 | 144 |

Observed agreement is the diagonal divided by the total: $p_o = (46 + 144) / 200 = 0.95$. Now the agreement expected by chance. A says billing 50 times out of 200, so 0.25. B says billing 52 times, so 0.26. Expected agreement on billing is $0.25 \\times 0.26 = 0.065$. Expected agreement on not billing is $0.75 \\times 0.74 = 0.555$. So $p_e = 0.62$.

$$\\kappa = \\frac{p_o - p_e}{1 - p_e} = \\frac{0.95 - 0.62}{0.38} = 0.87$$

Here $\\kappa$ is Cohen's kappa, $p_o$ is the observed agreement, and $p_e$ is the agreement expected by chance. A kappa of 0.87 is strong. Below 0.6, the labelling guide needs work.

Third, resolve disagreements. The 10 items where A and B differ go to a third person. The final label is the resolved one.

## How it works

A golden set has four properties. It is fixed: the items do not change between runs. It is labelled: every item has a correct output. It is representative: it covers the categories and hard cases that production sees. It is separate: no item appears in training data or in prompts.

Use this procedure to build one:

1. Sample 200 to 300 items from production logs, stratified by category.
2. Write a labelling guide with one example per category and the rules for hard cases.
3. Have two annotators label every item independently.
4. Compute kappa. If kappa is below 0.6, fix the guide and label again.
5. Resolve the disagreements and store the final labels.
6. Store the set in version control with a version number and a date.
7. Add new hard cases from production each month as a new version.

Leakage is the use of golden items anywhere in the system. A golden item used as a few-shot example gives a false pass. A golden item in fine-tuning data does the same. Keep a list of item identifiers and check every training file against it.

Note: start at 100 to 300 items. A smaller set cannot show a change of a few points. A larger set costs more to label and to run.

## Common mistakes

- Mistake: sample the golden set in proportion to traffic. Fix: stratify so that small categories have enough items.
- Mistake: label with one person. Fix: use two annotators and measure kappa.
- Mistake: use golden items as few-shot examples. Fix: keep the identifiers of golden items and check every prompt and training file.
- Mistake: change items between runs. Fix: version the set and compare only runs on the same version.
- Mistake: build the set from cases you invent. Fix: sample from real logs and add invented cases only for known gaps.

## Check your understanding

- Why stratify the sample? So that a rare category has enough items to show a change.
- What does a kappa of 0.3 tell you? The annotators agree only a little more than chance, so the labelling guide is unclear.
- What is leakage? The use of a golden item in training data or in a prompt, which gives a false pass.

## Go further

The OpenAI evals repository and the LM Evaluation Harness show how teams store test sets and run them against models. The Hugging Face evaluate library has implementations of agreement metrics. Eugene Yan's article on patterns for LLM systems has a long section on evaluation. The StatQuest channel explains the statistics behind agreement and sampling in short videos.
`,
          },
          {
            slug: 'llm-judges',
            title: 'Models as judges',
            summary: 'A model can grade outputs at scale, but only after you check it against humans.',
            minutes: 16,
            objectives: [
              'Explain the difference between pointwise and pairwise judging.',
              'Write a rubric that a judge model can apply.',
              'Calibrate a judge against human labels and read the result.',
              'Detect position bias and length bias in a judge.',
            ],
            keyTerms: ['judge model', 'pointwise', 'pairwise', 'rubric', 'position bias', 'length bias', 'temperature'],
            links: [
              { label: 'Judging LLM-as-a-judge with MT-Bench', url: 'https://arxiv.org/abs/2306.05685', kind: 'paper' },
              { label: 'G-Eval: evaluation with chain-of-thought judges', url: 'https://arxiv.org/abs/2303.16634', kind: 'paper' },
              { label: 'RAGAS: automated evaluation of retrieval pipelines', url: 'https://arxiv.org/abs/2309.15217', kind: 'paper' },
              { label: 'FastChat: judge code from the MT-Bench paper', url: 'https://github.com/lm-sys/FastChat', kind: 'repo' },
              { label: 'RAGAS library', url: 'https://github.com/explodinggradients/ragas', kind: 'repo' },
            ],
            body: `
## What this lesson covers

A judge model is a model that grades the output of another model. This lesson shows the two ways to judge and the rubric that the judge reads. It then shows the calibration step that tells you how much to trust the judge. You also learn two biases that judges show.

## Why it matters

Humans cannot grade 5,000 outputs after every change. A judge model can, in minutes. But a judge is a model, and it makes errors of its own. A team that trusts an uncalibrated judge ships changes that only the judge likes. The calibration number is the limit on what the judge can tell you.

## The idea with an example

You want to grade the answers of a support assistant. Two methods exist.

Pointwise judging scores one answer on a scale. The judge reads the question, the answer, and a rubric, and returns a score from 1 to 5. A rubric is a short list of criteria with a definition for each score.

    Score 5: answers the question, correct facts, no extra text.
    Score 3: answers the question but adds unneeded text or one minor error.
    Score 1: wrong, off topic, or refuses a valid question.

Pairwise judging compares two answers to the same question and returns A, B, or tie. It is better for "which prompt is better" questions. It is worse for "is this good enough" questions.

Now calibrate. Take 300 items that humans scored. Run the judge on the same items. Count how often the judge's score matches the human score. Assume the result is 82 percent agreement, and the judge is one point off in most other cases.

What does 82 percent let you say? Run two prompts, A and B, on 300 items. The judge gives A an average of 3.9 and B an average of 4.1. The judge is wrong on about 18 percent of items, and its errors are not all in one direction. A difference of 0.2 on a 5-point scale is inside the noise of the judge. You cannot say that B is better. A difference of 0.6 with the same judge is a real signal. State the noise band with every judge score.

## How it works

The judge is a normal model call. The prompt has four parts: the task, the rubric, the item to grade, and the output format. Set the temperature to zero so the score is repeatable. Ask for a one-line reason before the score. The reason improves the score and gives you a log to read.

Use this procedure to calibrate and to check for bias:

1. Collect 200 to 300 items with human scores.
2. Run the judge with temperature zero and record the scores.
3. Compute the agreement rate and the average absolute difference.
4. For pairwise judging, run every pair twice with the order of A and B swapped.
5. Count the pairs where the verdict changes with the order. That count measures position bias.
6. Compare the average length of the winners and the losers. A large gap measures length bias.

Position bias is the tendency of a judge to prefer the first answer, or the second, because of its position. Swap the order and keep only verdicts that agree in both orders. Length bias is the tendency to prefer longer answers. Add a line to the rubric that penalises unneeded text, and check the gap again.

The cost is one judge call per item, or two per pair with the swap. At 300 items and 500 tokens per call, one run is 150,000 tokens. At 3 dollars per million input tokens, one run costs about 0.45 dollars.

Caution: do not use the same model as the judge and as the system under test. A model rates its own style higher than the style of other models.

## Common mistakes

- Mistake: report a judge score with no calibration. Fix: measure the agreement with human scores first and state the noise band.
- Mistake: compare two prompts with one order of A and B. Fix: swap the order and keep only verdicts that agree.
- Mistake: write a rubric with one line, "rate the quality". Fix: define each score with criteria the judge can check.
- Mistake: run the judge at temperature 1. Fix: use temperature zero so that the same item gets the same score.
- Mistake: judge a system with the same model that produced the output. Fix: use a different model as the judge.

## Check your understanding

- When is pairwise judging the better method? When the question is which of two versions is better, not whether one version is good enough.
- A judge agrees with humans 82 percent of the time; is a 0.2 point change real? No; it is inside the judge's noise.
- How do you detect position bias? Run each pair in both orders and count the verdicts that change.

## Go further

The MT-Bench paper introduced judge models at scale and measured position bias and length bias. G-Eval shows that a judge that reasons before it scores agrees more with humans. The RAGAS paper and library apply judge models to retrieval pipelines, with separate scores for faithfulness and relevance. The FastChat repository has the judge prompts from the MT-Bench paper that you can copy.
`,
          },
          {
            slug: 'offline-online-and-regression-tests',
            title: 'Offline, online, and regression tests',
            summary: 'Offline tests catch regressions before a release, and online metrics catch what they miss.',
            minutes: 16,
            objectives: [
              'Explain the difference between offline evaluation and online metrics.',
              'Compute the standard error of a pass rate and decide if a drop is real.',
              'Set up a regression test that runs the golden set on every change.',
              'Choose a canary rollout and the guardrail metrics that stop it.',
            ],
            keyTerms: ['offline evaluation', 'online metrics', 'regression test', 'standard error', 'A/B test', 'guardrail metric', 'canary rollout'],
            links: [
              { label: 'promptfoo: regression tests for prompts', url: 'https://github.com/promptfoo/promptfoo', kind: 'repo' },
              { label: 'Langfuse: tracing and online scores', url: 'https://github.com/langfuse/langfuse', kind: 'repo' },
              { label: 'Chip Huyen: building LLM applications for production', url: 'https://huyenchip.com/2023/04/11/llm-engineering.html', kind: 'article' },
              { label: 'StatQuest channel (standard error, A/B tests)', url: 'https://www.youtube.com/@statquest', kind: 'video' },
              { label: 'Full Stack LLM Bootcamp', url: 'https://fullstackdeeplearning.com/llm-bootcamp/', kind: 'course' },
            ],
            body: `
## What this lesson covers

Offline evaluation runs a fixed golden set before a release. Online metrics measure real users after a release. This lesson shows what each one can and cannot see. You compute whether a drop in pass rate is real, and you wire the golden set into a regression test. You then release with a canary.

## Why it matters

A prompt change that passes a demo can break a category that nobody tried. A model upgrade can change the output format and break a parser. Offline tests catch these before users see them. Online metrics catch the failures that the golden set does not contain, such as a new type of question. A system with only one of the two is blind on one side.

## The idea with an example

The ticket classifier has a golden set of 200 items. The current prompt passes 182 items, a pass rate of 91 percent. A new prompt passes 176 items, a pass rate of 88 percent. Is the drop of 3 points real, or is it noise?

A pass rate is a proportion. Its standard error measures how much it moves with a different sample of the same size.

$$SE = \\sqrt{\\frac{p(1 - p)}{n}}$$

Here $SE$ is the standard error, $p$ is the pass rate, and $n$ is the number of items. For the baseline, $p = 0.91$ and $n = 200$:

$$SE = \\sqrt{\\frac{0.91 \\times 0.09}{200}} = \\sqrt{0.00041} \\approx 0.020$$

The standard error is about 2 points. The standard error of the difference between two rates is about $\\sqrt{2} \\times 0.02 \\approx 0.028$. A drop of 3 points is about one standard error of the difference. That is not strong evidence. With 800 items the standard error halves to 1 point, and the same drop is strong evidence.

Two rules follow. Set the failure threshold from the standard error. Grow the golden set when you need to see small changes.

| Items | Standard error of one rate | Smallest clear drop |
|---|---|---|
| 100 | 2.9 points | about 8 points |
| 200 | 2.0 points | about 6 points |
| 800 | 1.0 points | about 3 points |

## How it works

Offline evaluation has three parts: the golden set, a scorer, and a baseline. The scorer is an exact match for a label, a schema check, or a judge model. The baseline is the score of the current version. A regression test compares the new score with the baseline and fails the build when the drop is larger than the threshold.

Use this procedure for the regression test:

1. Store the golden set, the prompt, and the model name in version control.
2. On every change to the prompt, the model, or the tools, run the whole golden set.
3. Compute the pass rate and the standard error.
4. If the pass rate drops by more than two standard errors of the difference, fail the build.
5. Store the per-item results so you can read which items changed.

Online metrics come from real traffic. Examples are thumbs up and down, task completion, the share of answers that a user edits, latency, and cost per request. An A/B test sends a share of traffic to the new version and compares these metrics between the two groups. Guardrail metrics are metrics that must not get worse, such as the refusal rate, the error rate, and the 99th percentile latency.

A canary rollout sends the new version to a small share of traffic first, for example 5 percent. Watch the guardrail metrics for a fixed window. If no guardrail fails, raise the share in steps: 5, 25, 50, 100 percent. If a guardrail fails, roll back at once.

Note: online metrics are noisy and slow. A thumbs-up rate needs thousands of events to show a change of a few points.

## Common mistakes

- Mistake: fail the build on any drop in pass rate. Fix: set the threshold from the standard error of the set.
- Mistake: run the golden set only for prompt changes. Fix: run it for model upgrades and tool changes too.
- Mistake: ship to 100 percent of traffic after a green offline test. Fix: use a canary and watch the guardrail metrics.
- Mistake: measure only the average score online. Fix: track guardrail metrics such as error rate and tail latency.
- Mistake: never add online failures to the golden set. Fix: review failed requests each month and add the new cases.

## Check your understanding

- What is the standard error of a 91 percent pass rate on 200 items? About 2 points.
- What does a guardrail metric do in a rollout? It stops the rollout when it gets worse, even if the main metric improves.
- Why keep both offline and online evaluation? Offline tests are fast and repeatable, and online metrics show the cases the golden set lacks.

## Go further

promptfoo runs a golden set against prompts in a continuous integration job and shows per-item differences. Langfuse records traces and online scores so you can link a bad request to its prompt version. Chip Huyen's article covers the gap between offline and online results in production systems. The StatQuest channel explains standard errors and A/B tests. The Full Stack LLM Bootcamp has a lecture on evaluation in production.
`,
          },
        ],
      },
      {
        slug: 'fine-tuning',
        title: 'Fine-tuning',
        description: 'Change the weights of a model when prompts and retrieval are not enough.',
        lessons: [
          {
            slug: 'when-to-fine-tune',
            title: 'When to fine-tune',
            summary: 'Fine-tune for format, style, latency and cost, not for new facts.',
            minutes: 12,
            objectives: [
              'Explain the four steps of the decision ladder from prompt to fine-tune.',
              'Compute the monthly token cost of a long prompt at a given call volume.',
              'Choose between retrieval and fine-tuning for a given problem.',
              'Identify problems that fine-tuning does not solve.',
            ],
            keyTerms: ['fine-tuning', 'in-context-learning', 'retrieval-augmented generation', 'system prompt', 'lora'],
            links: [
              { label: 'InstructGPT: training models to follow instructions', url: 'https://arxiv.org/abs/2203.02155', kind: 'paper' },
              { label: 'LIMA: less is more for alignment', url: 'https://arxiv.org/abs/2305.11206', kind: 'paper' },
              { label: 'Chip Huyen: building LLM applications for production', url: 'https://huyenchip.com/2023/04/11/llm-engineering.html', kind: 'article' },
              { label: 'Eugene Yan: patterns for building LLM systems', url: 'https://eugeneyan.com/writing/llm-patterns/', kind: 'article' },
              { label: 'Full Stack Deep Learning: LLM bootcamp', url: 'https://fullstackdeeplearning.com/llm-bootcamp/', kind: 'course' },
            ],
            body: `
## What this lesson covers

Fine-tuning changes the weights of a model with your own examples. This lesson gives you a decision ladder with four steps. It shows the cost arithmetic that makes fine-tuning worth the effort. It also lists the problems that fine-tuning does not solve.

## Why it matters

Fine-tuning is the most expensive step in the ladder. It needs clean data, a training run, an evaluation and a deployment. Many teams start there and waste weeks. Other teams never get there and pay for long prompts on every call.

## The idea with an example

A support team runs a large model with a 2,000-token system prompt. The prompt holds the tone rules and twelve few-shot examples of good answers. The service makes 50,000 calls per day.

The prompt tokens alone are 2,000 times 50,000, which is 100 million input tokens per day. Assume the large model costs 3 dollars per million input tokens. The prompt costs 300 dollars per day, or about 9,000 dollars per month.

Now fine-tune a small model on 3,000 good answers. The model learns the tone and the format from the weights. The system prompt shrinks to 200 tokens. The fine-tuned model removes 1,800 tokens from every call. Assume the small model costs 0.2 dollars per million input tokens.

| Setup | Prompt tokens per call | Tokens per day | Cost per day | Cost per month |
| --- | --- | --- | --- | --- |
| Large model, long prompt | 2,000 | 100M | 300 dollars | 9,000 dollars |
| Small fine-tuned model | 200 | 10M | 2 dollars | 60 dollars |

The saving is about 8,940 dollars per month on prompt tokens alone. The small model also answers faster, because it reads fewer tokens. The training run costs a few hundred dollars, so the fine-tune pays for itself in the first week.

Note: the arithmetic only holds if the small fine-tuned model matches the large model on your test set.

## How it works

Climb the ladder one step at a time. Stop at the first step that passes your evaluation.

1. Write a clear prompt. State the task, the format and the constraints. Test it on a golden set of at least 50 examples.
2. Add few-shot examples. Put three to ten good input and output pairs in the prompt. This uses in-context learning, where the model copies the pattern of the examples.
3. Add retrieval. If the model lacks facts, retrieve the facts from your documents and put them in the prompt. This is retrieval-augmented generation (RAG).
4. Fine-tune. If the model still fails on format, style or consistency, train on 1,000 or more examples. Also fine-tune when the prompt is long and the volume is high.

Use the table to decide what fine-tuning can do.

| Problem | Fine-tune helps | Better tool |
| --- | --- | --- |
| Wrong output format | Yes | Also try a JSON schema |
| Wrong tone or style | Yes | Few-shot examples first |
| Long prompt, high volume | Yes | Prompt caching first |
| Missing facts about your data | No | Retrieval |
| Facts that change every week | No | Retrieval |
| Reasoning errors on hard tasks | Rarely | A larger model |

Fine-tuning teaches behaviour, not knowledge. A model with 1,000 training examples learns how to answer. It does not learn the content of your 10,000-page manual. Retrieval does that job, and a fine-tuned model that reads retrieved context is a common production setup.

Caution: if your format rules change, you must retrain. Keep the training data in version control.

## Common mistakes

- Mistake: fine-tune to add facts. Fix: use retrieval for facts, and fine-tune only for format and style.
- Mistake: skip the prompt and few-shot steps. Fix: build a golden set and test the cheap steps first.
- Mistake: compare the fine-tuned model to the large model without a test set. Fix: run both models on the same 200 held-out examples and compare scores.
- Mistake: count only the training cost. Fix: add the cost of data cleaning, evaluation and retraining when the rules change.
- Mistake: fine-tune a model with 100 examples. Fix: collect at least 1,000 clean examples, or stay at the few-shot step.

## Check your understanding

- Question: a prompt has 3,000 tokens and the service makes 20,000 calls per day. How many prompt tokens per day is that? Answer: 60 million tokens per day.
- Question: your model does not know last week's product prices. Do you fine-tune? Answer: no, you add retrieval, because fine-tuning does not add changing facts.
- Question: which step of the ladder uses in-context learning? Answer: the few-shot step, where the model copies the pattern of the examples in the prompt.

## Go further

The InstructGPT paper shows how a model with 1.3 billion weights beat a model 100 times larger after fine-tuning on good instructions. LIMA shows that 1,000 careful examples can be enough. Chip Huyen and Eugene Yan both write about the full ladder from prompt to fine-tune, with production examples. The Full Stack Deep Learning bootcamp gives free lectures on the same decisions.
`,
          },
          {
            slug: 'lora',
            title: 'LoRA: low-rank adaptation',
            summary: 'Train two small matrices instead of the full weight matrix.',
            minutes: 16,
            objectives: [
              'Compute the number of trainable weights in a LoRA adapter for a given rank.',
              'Explain the equation W + BA and the role of each matrix.',
              'Compare the memory of a full fine-tune with the memory of a LoRA fine-tune.',
              'Choose the rank, the scale and the target matrices for a first run.',
            ],
            keyTerms: ['lora', 'rank', 'adapter', 'quantisation', 'adam', 'gradient-descent'],
            links: [
              { label: 'LoRA: low-rank adaptation of large language models', url: 'https://arxiv.org/abs/2106.09685', kind: 'paper' },
              { label: 'QLoRA: efficient fine-tuning of quantized models', url: 'https://arxiv.org/abs/2305.14314', kind: 'paper' },
              { label: 'Hugging Face PEFT documentation', url: 'https://huggingface.co/docs/peft', kind: 'docs' },
              { label: 'PEFT repository', url: 'https://github.com/huggingface/peft', kind: 'repo' },
              { label: 'Umar Jamil: paper walkthroughs including LoRA', url: 'https://www.youtube.com/@umarjamilai', kind: 'video' },
            ],
            body: `
## What this lesson covers

Low-rank adaptation (LoRA) fine-tunes a large model with a small number of trainable weights. This lesson shows the equation, counts the weights for one matrix and sizes the memory for a model with 7 billion weights.

## Why it matters

A full fine-tune updates every weight. For a model with 7 billion weights, that needs more than 100 gigabytes (GB) of graphics processing unit (GPU) memory. LoRA fits the same job on one GPU with 24 GB. LoRA also produces a small adapter file that you can swap per task at serving time.

## The idea with an example

Take one weight matrix $W$ in an attention layer. In a common model it has 4,096 rows and 4,096 columns, which is about 16.8 million weights. A full fine-tune trains all of them.

LoRA freezes $W$ and adds a correction $BA$. Pick a rank $r = 8$. Then $B$ has 4,096 rows and 8 columns, and $A$ has 8 rows and 4,096 columns.

| Matrix | Shape | Weights |
| --- | --- | --- |
| $W$ (frozen) | 4,096 x 4,096 | 16,777,216 |
| $B$ (trained) | 4,096 x 8 | 32,768 |
| $A$ (trained) | 8 x 4,096 | 32,768 |
| Adapter total | | 65,536 |

The adapter has 65,536 trainable weights. That is 0.4 percent of the original matrix. The product $BA$ still has the full shape of 4,096 by 4,096, so it can change every output of the layer. It can only make changes of rank 8 or less. In practice, the changes that a fine-tune needs are close to low rank.

## How it works

The adapted weight matrix is

$$W' = W + \\frac{\\alpha}{r} BA$$

$W$ is the original frozen matrix with shape $d \\times k$. $B$ is a trained matrix with shape $d \\times r$, and $A$ is a trained matrix with shape $r \\times k$. $r$ is the rank, a small integer such as 8 or 16. $\\alpha$ is a scale, and the ratio $\\alpha / r$ sets how strongly the adapter changes the output.

At the start of training, $B$ is all zeros and $A$ is random. The product $BA$ is zero, so the model begins as the original model. Gradient descent then updates only $A$ and $B$.

Follow this procedure for a first run.

1. Pick the target matrices. Start with the query, key, value and output projections in attention. Add the multilayer perceptron (MLP) matrices if quality is low.
2. Pick the rank. Start with $r = 8$ or $r = 16$.
3. Set $\\alpha = 2r$ and a learning rate near $2 \\times 10^{-4}$.
4. Train for one to three passes over the data. Watch the validation loss after each pass.
5. Merge the adapter into $W$ for serving, or keep it separate to swap adapters per task.

Quantised LoRA (QLoRA) stores the frozen base model in 4-bit weights and keeps the adapter in 16-bit. The memory of the base model drops by a factor of four, with a small loss in quality.

The memory table shows the sizes for a model with 7 billion weights. A full fine-tune in 16-bit with the Adam optimiser needs about 16 bytes per weight. That covers the weight, its gradient and two optimiser states.

| Setup | Base weights | Gradients and optimiser | Approximate total |
| --- | --- | --- | --- |
| Full fine-tune, 16-bit, Adam | 14 GB | 98 GB | 112 GB plus activations |
| LoRA, 16-bit base | 14 GB | under 1 GB | 15 GB plus activations |
| QLoRA, 4-bit base | 3.5 GB | under 1 GB | 5 GB plus activations |

Activations add a few GB that depend on batch size and sequence length.

Caution: merging the adapter into a 4-bit base model loses precision. Merge into the 16-bit base weights instead.

## Common mistakes

- Mistake: set the rank to 256 on the first run. Fix: start at 8 or 16, and raise the rank only when the validation loss stops falling.
- Mistake: target only the query and value matrices and expect a large style change. Fix: add the key, output and MLP matrices.
- Mistake: keep the learning rate of a full fine-tune. Fix: use a higher rate, near $2 \\times 10^{-4}$, because the adapter starts at zero.
- Mistake: compare a LoRA run to a full fine-tune without the same data and steps. Fix: hold the data, the steps and the evaluation fixed.

## Check your understanding

- Question: a matrix has 8,192 rows and 1,024 columns, and the rank is 16. How many adapter weights are there? Answer: 8,192 x 16 plus 16 x 1,024, which is 147,456 weights.
- Question: why is $B$ set to zero at the start? Answer: so that $BA$ is zero and the model starts as the original model.
- Question: what does QLoRA change compared with LoRA? Answer: it stores the frozen base model in 4-bit weights to save memory.

## Go further

Read the LoRA paper for the rank experiments and the low-rank argument. The QLoRA paper explains 4-bit storage and the memory arithmetic. The Hugging Face PEFT documentation and repository give working code for both methods. Umar Jamil walks through the LoRA paper on his channel.
`,
          },
          {
            slug: 'data-preparation',
            title: 'Data preparation for fine-tuning',
            summary: 'Clean examples matter more than many examples.',
            minutes: 15,
            objectives: [
              'Write one training record in the chat template format.',
              'Explain why 1,000 clean examples can beat 50,000 raw examples.',
              'Filter a raw log into a clean training set with a four-step procedure.',
              'Split the data and use the validation loss to detect overfitting.',
            ],
            keyTerms: ['instruction tuning', 'chat template', 'deduplication', 'decontamination', 'validation loss', 'overfitting'],
            links: [
              { label: 'LIMA: less is more for alignment', url: 'https://arxiv.org/abs/2305.11206', kind: 'paper' },
              { label: 'Llama 2: open foundation and fine-tuned chat models', url: 'https://arxiv.org/abs/2307.09288', kind: 'paper' },
              { label: 'Hugging Face Datasets documentation', url: 'https://huggingface.co/docs/datasets', kind: 'docs' },
              { label: 'Hugging Face TRL documentation', url: 'https://huggingface.co/docs/trl', kind: 'docs' },
              { label: 'Hugging Face Transformers documentation', url: 'https://huggingface.co/docs/transformers', kind: 'docs' },
            ],
            body: `
## What this lesson covers

A fine-tune is only as good as its data. This lesson shows the format of one training record and the four cleaning steps that turn raw logs into a training set. It also explains how to split the data and how to read the validation loss.

## Why it matters

Most failed fine-tunes fail on data, not on the training code. Duplicate records teach the model to repeat. Wrong answers in the data teach the model to be wrong with confidence. Test questions in the data make the evaluation lie to you. The Llama 2 team reports that a few tens of thousands of clean examples beat millions of noisy ones.

## The idea with an example

A support team has 50,000 raw chat logs. They want 3,000 clean training examples. They apply four filters in order and count what remains.

1. Remove exact and near duplicates. Hash each conversation, then compare embeddings with a similarity threshold of 0.95. Count: 50,000 drops to 31,000.
2. Remove low-quality answers. Keep only conversations where the customer rated the answer 4 or 5 out of 5. Count: 31,000 drops to 9,500.
3. Remove unsafe and private content. Drop records that contain personal data or policy violations. Count: 9,500 drops to 7,800.
4. Remove evaluation overlap and trim length. Drop any record that matches a question in the golden set. Drop answers under 20 tokens or over 1,500 tokens. Count: 7,800 drops to 3,000.

The team then reads 100 random records by hand. If more than 5 of the 100 have a problem, they add a filter and run again.

Note: step 4 is decontamination. If a test question stays in the training set, the test score rises for the wrong reason.

The final 3,000 records are strong. The LIMA paper shows that 1,000 careful examples teach a model the format and the tone of a good answer. More examples help only if they are as clean as the first 1,000.

## How it works

Each record holds one conversation. The chat template is the fixed layout that the model saw in its own training. Use the same template, or the model reads your records as plain text. A record in JSON Lines (JSONL) format looks like this.

    {"messages": [
      {"role": "system", "content": "You answer billing questions in two short paragraphs."},
      {"role": "user", "content": "Why was I charged twice this month?"},
      {"role": "assistant", "content": "Two charges appear when a payment retries after a bank timeout. ..."}
    ]}

The training library applies the template, adds the special tokens and masks the loss. Masking means the model trains only on the assistant tokens. It does not learn to predict the user text.

Check the length distribution before training. Compute the token count of every record and look at the 50th, 90th and 99th percentiles. Set the maximum sequence length just above the 99th percentile. Records beyond that length are cut or dropped.

Then split the data.

1. Shuffle the records.
2. Hold out 5 to 10 percent as the validation set. Keep the split fixed in version control.
3. Train and record the validation loss after each pass over the data.
4. Stop when the validation loss stops falling. If it rises while the training loss falls, the model overfits.

Overfitting means the model memorises the training records instead of the pattern. With 3,000 records, two or three passes are usually enough.

Caution: never tune the number of passes on the test set. Use the validation set for that decision, and the test set once at the end.

## Common mistakes

- Mistake: train on raw logs with duplicates. Fix: deduplicate by hash and by embedding similarity first.
- Mistake: keep answers that the customer rated badly. Fix: filter by rating or by a human review of a sample.
- Mistake: write records in a custom text format. Fix: use the chat template of the base model.
- Mistake: leave test questions in the training data. Fix: remove any record that matches the evaluation set.
- Mistake: train for ten passes because the training loss keeps falling. Fix: stop when the validation loss stops falling.

## Check your understanding

- Question: 20,000 raw records remain after deduplication from 40,000. What is the duplication rate? Answer: 50 percent of the raw records were duplicates.
- Question: why mask the loss on the user tokens? Answer: so the model learns to write answers, not to predict questions.
- Question: training loss falls and validation loss rises. What happens? Answer: the model overfits, so stop training or add data.

## Go further

The LIMA paper is the clearest argument for quality over quantity. The Llama 2 paper describes the cleaning that a large team applies at scale. The Hugging Face Datasets documentation covers deduplication and filtering with code. The TRL and Transformers documentation show how the chat template and the loss mask work in practice.
`,
          },
          {
            slug: 'dpo-in-practice',
            title: 'DPO in practice',
            summary: 'Train on preference pairs without a separate reward model.',
            minutes: 18,
            objectives: [
              'Explain every symbol in the DPO loss.',
              'Compute the DPO loss for one preference pair by hand.',
              'Compare DPO with RLHF on data, compute and stability.',
              'Detect verbosity bias in a preference dataset.',
            ],
            keyTerms: ['dpo', 'rlhf', 'kl-divergence', 'preference pair', 'reference model', 'win rate'],
            links: [
              { label: 'Direct preference optimization', url: 'https://arxiv.org/abs/2305.18290', kind: 'paper' },
              { label: 'Deep RL from human preferences', url: 'https://arxiv.org/abs/1706.03741', kind: 'paper' },
              { label: 'InstructGPT: training models to follow instructions', url: 'https://arxiv.org/abs/2203.02155', kind: 'paper' },
              { label: 'Hugging Face TRL documentation', url: 'https://huggingface.co/docs/trl', kind: 'docs' },
              { label: 'TRL repository', url: 'https://github.com/huggingface/trl', kind: 'repo' },
            ],
            body: `
## What this lesson covers

Direct preference optimisation (DPO) trains a model to prefer one answer over another. This lesson explains the loss, computes it by hand for one pair, and compares DPO with reinforcement learning from human feedback (RLHF).

## Why it matters

Supervised fine-tuning teaches a model to copy good answers. It cannot teach the model that one answer is better than another. Preference training does that. RLHF needs a reward model and a reinforcement learning loop. DPO reaches similar quality with one loss function and one training run.

## The idea with an example

A preference pair has three parts: a prompt $x$, a chosen answer $y_w$ and a rejected answer $y_l$. A human picked the chosen answer as better.

The model under training is $\\pi_\\theta$. A frozen copy of the starting model is the reference $\\pi_{ref}$. For each answer, compute the log-probability from each model and take the difference. This is the log-ratio.

| Answer | $\\log \\pi_\\theta$ | $\\log \\pi_{ref}$ | Log-ratio |
| --- | --- | --- | --- |
| Chosen $y_w$ | -12.0 | -12.5 | 0.5 |
| Rejected $y_l$ | -14.3 | -14.0 | -0.3 |

The model already likes the chosen answer a little more than the reference does. It likes the rejected answer a little less. The margin is the difference of the two log-ratios, scaled by $\\beta$. With $\\beta = 0.1$ the margin is $0.1 \\times (0.5 - (-0.3)) = 0.08$.

The loss is the negative log of the sigmoid of the margin. The sigmoid of 0.08 is about 0.52. The negative log of 0.52 is about 0.654. The loss is 0.654 for this pair.

The gradient pushes the margin up. It raises the probability of the chosen answer and lowers the probability of the rejected answer. When the margin reaches 3, the sigmoid is 0.95 and the loss is 0.05. Training then moves to the pairs that the model still gets wrong.

## How it works

The DPO loss for one pair is

$$\\mathcal{L} = -\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{ref}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{ref}(y_l|x)}\\right)$$

$\\sigma$ is the sigmoid function, which maps any number to a value between 0 and 1. $\\pi_\\theta(y|x)$ is the probability that the model under training gives to answer $y$ for prompt $x$. $\\pi_{ref}(y|x)$ is the same probability from the frozen reference model. $y_w$ is the chosen answer and $y_l$ is the rejected answer. $\\beta$ is a scale, usually between 0.05 and 0.5.

$\\beta$ controls how far the model moves from the reference. A small $\\beta$ lets the model move far before the loss saturates. A large $\\beta$ keeps the model close. This is the same role that the Kullback-Leibler (KL) penalty plays in RLHF. Start with $\\beta = 0.1$.

Follow this procedure.

1. Start from a supervised fine-tuned model. Copy it as the reference.
2. Collect 1,000 to 10,000 preference pairs. Each pair needs a clear winner.
3. Train for one pass with a learning rate near $5 \\times 10^{-7}$.
4. Evaluate the win rate on 200 held-out prompts with a judge that did not label the data.

The table compares the two methods.

| Property | RLHF | DPO |
| --- | --- | --- |
| Models in memory | Policy, reference, reward, value | Policy, reference |
| Training loop | Sample, score, update with PPO | One supervised loss |
| Stability | Sensitive to many settings | Stable with two settings |
| Data | Pairs for the reward model, then prompts | Pairs only |
| Quality | High, with effort | Close to RLHF |

Proximal policy optimisation (PPO) is the reinforcement learning algorithm in RLHF. It samples answers during training. DPO never samples, which makes it cheaper and more stable.

Caution: verbosity bias is the most common failure. If labellers pick the longer answer most of the time, DPO teaches the model to write long answers. Check the length ratio of chosen to rejected answers before training.

## Common mistakes

- Mistake: train DPO from the base model. Fix: run supervised fine-tuning first, then DPO.
- Mistake: set $\\beta$ to 1.0 and see no change. Fix: lower $\\beta$ to 0.1 so the model can move.
- Mistake: evaluate with the same judge that labelled the pairs. Fix: use a different judge or human raters for the win rate.
- Mistake: accept pairs where the two answers are near equal. Fix: keep only pairs with a clear winner.
- Mistake: ignore the length of the chosen answers. Fix: balance the pairs so length does not predict the winner.

## Check your understanding

- Question: the chosen log-ratio is 1.0, the rejected log-ratio is -1.0 and $\\beta$ is 0.1. What is the margin? Answer: 0.1 x 2.0, which is 0.2.
- Question: what does a larger $\\beta$ do? Answer: it keeps the model closer to the reference model.
- Question: which two models does DPO keep in memory? Answer: the policy under training and the frozen reference.

## Go further

The DPO paper derives the loss from the RLHF objective and shows that the two optimise the same goal. The Christiano paper introduced learning from human preferences, and the InstructGPT paper applied it to a large model. The Hugging Face TRL documentation and repository contain a DPO trainer with the loss above, plus the settings used in this lesson.
`,
          },
        ],
      },
      {
        slug: 'production',
        title: 'Production',
        description: 'Run a model service that stays cheap, visible and safe under real traffic.',
        lessons: [
          {
            slug: 'caching-and-cost-control',
            title: 'Caching and cost control',
            summary: 'Three caches and a router cut the cost of a model service.',
            minutes: 15,
            objectives: [
              'Compute the daily cost of a model service from token counts and prices.',
              'Explain the difference between an exact cache, a semantic cache and a prefix cache.',
              'Choose a similarity threshold for a semantic cache.',
              'Route requests between a large and a small model by difficulty.',
            ],
            keyTerms: ['exact cache', 'semantic cache', 'prefix caching', 'kv-cache', 'model routing', 'pareto-frontier', 'embedding'],
            links: [
              { label: 'Prompt Cache: modular attention reuse', url: 'https://arxiv.org/abs/2311.04934', kind: 'paper' },
              { label: 'vLLM: efficient serving with PagedAttention', url: 'https://arxiv.org/abs/2309.06180', kind: 'paper' },
              { label: 'vLLM documentation', url: 'https://docs.vllm.ai/en/latest/', kind: 'docs' },
              { label: 'LiteLLM repository', url: 'https://github.com/BerriAI/litellm', kind: 'repo' },
              { label: 'Eugene Yan: patterns for building LLM systems', url: 'https://eugeneyan.com/writing/llm-patterns/', kind: 'article' },
            ],
            body: `
## What this lesson covers

A model service pays for every token it reads and writes. This lesson computes the cost of a service with real numbers. It then shows three caches and one router that lower that cost.

## Why it matters

Token cost grows with traffic, and traffic grows after launch. Many requests repeat, and many prompts share the same prefix. A cache turns that repetition into savings. A router sends easy requests to a cheap model. Together they often cut the bill in half.

## The idea with an example

A service handles 100,000 requests per day. The average request has 1,500 input tokens and 300 output tokens. Assume the model costs 3 dollars per million input tokens and 15 dollars per million output tokens.

Compute the daily cost without a cache.

| Item | Tokens per day | Price per million | Cost per day |
| --- | --- | --- | --- |
| Input | 150 million | 3 dollars | 450 dollars |
| Output | 30 million | 15 dollars | 450 dollars |
| Total | | | 900 dollars |

Now add an exact-response cache. The cache stores the answer under a hash of the full prompt. Measurement shows a 30 percent hit rate, so 30,000 requests never reach the model.

| Item | Tokens per day | Price per million | Cost per day |
| --- | --- | --- | --- |
| Input | 105 million | 3 dollars | 315 dollars |
| Output | 21 million | 15 dollars | 315 dollars |
| Total | | | 630 dollars |

The cache saves 270 dollars per day, or about 8,100 dollars per month.

## How it works

Three caches work at three levels.

| Cache | Key | Hit condition | Saves |
| --- | --- | --- | --- |
| Exact-response cache | Hash of the full prompt | Identical prompt | Input and output tokens |
| Semantic cache | Embedding of the prompt | Similar prompt | Input and output tokens |
| Prefix cache | Shared prompt prefix | Same first tokens | Prefill compute on the prefix |

The exact cache is simple and safe. Set a time to live, such as one day, so stale answers expire.

The semantic cache embeds each prompt as a vector. A new prompt hits the cache if its cosine similarity to a stored prompt is above a threshold. A threshold of 0.95 is a safe start. A lower threshold raises the hit rate and the number of wrong answers.

The prefix cache lives inside the serving engine or the provider. The engine keeps the key-value (KV) cache for a shared prefix, such as the system prompt. The next request with the same prefix skips the prefill of those tokens. Put the stable text first in the prompt and the changing text last, or the prefix never matches.

A router adds a fourth saving. Follow this procedure.

1. Label 500 requests as easy or hard by hand.
2. Run both the small and the large model on them. Record quality and cost.
3. Train a small classifier to predict the label from the request.
4. Send easy requests to the small model. Send the rest to the large model.
5. Sample 1 percent of routed requests and check them each week.

If 60 percent of requests are easy and the small model costs one tenth as much, the bill falls by about 54 percent. Also set a maximum output length for every call, and trim retrieved context to a fixed token budget.

Caution: a semantic cache can return a correct answer to a different question. Never use it for requests that contain user-specific data.

## Common mistakes

- Mistake: put the user question before the system prompt. Fix: put the stable prefix first so the prefix cache matches.
- Mistake: set the semantic threshold at 0.8 to raise the hit rate. Fix: start at 0.95 and lower it only with measured error rates.
- Mistake: cache answers that depend on the current time. Fix: exclude those routes or set a short time to live.
- Mistake: route by request length alone. Fix: label a sample by hand and train a classifier on real difficulty.
- Mistake: leave the maximum output length unset. Fix: set a limit on every call.

## Check your understanding

- Question: 50,000 requests per day with 2,000 input tokens each at 3 dollars per million. What is the daily input cost? Answer: 100 million tokens, so 300 dollars per day.
- Question: which cache saves compute but not tokens billed by a provider? Answer: the prefix cache, which saves prefill work on shared prefixes.
- Question: why put the system prompt first? Answer: the prefix cache only matches tokens from the start of the prompt.

## Go further

The Prompt Cache paper explains how attention states for shared prompt segments can be reused. The vLLM paper and documentation describe prefix caching in an open serving engine. LiteLLM is an open proxy that adds caching and routing in front of many providers. Eugene Yan collects caching and routing patterns with trade-offs. The lab at /labs/pareto-router lets you move the routing threshold and watch cost and quality change.
`,
          },
          {
            slug: 'observability',
            title: 'Observability',
            summary: 'Log, trace and measure every request so you can find the slow and costly ones.',
            minutes: 14,
            objectives: [
              'List the fields to log for every model request.',
              'Read a trace of a multi-step agent call and find the slowest span.',
              'Explain p50, p95 and p99 latency.',
              'Design a dashboard and alerts for a model service.',
            ],
            keyTerms: ['trace', 'span', 'p99-latency', 'time to first token', 'prompt version', 'sampling'],
            links: [
              { label: 'OpenTelemetry documentation', url: 'https://opentelemetry.io/docs/', kind: 'docs' },
              { label: 'OpenTelemetry Python repository', url: 'https://github.com/open-telemetry/opentelemetry-python', kind: 'repo' },
              { label: 'Langfuse repository', url: 'https://github.com/langfuse/langfuse', kind: 'repo' },
              { label: 'Chip Huyen: building LLM applications for production', url: 'https://huyenchip.com/2023/04/11/llm-engineering.html', kind: 'article' },
              { label: 'Hussein Nasser: backend engineering', url: 'https://www.youtube.com/@hnasr', kind: 'video' },
            ],
            body: `
## What this lesson covers

Observability is the ability to see what a service does from its logs, traces and metrics. This lesson lists the fields to log per request and walks through a trace of a three-step agent call. It then defines the percentile latencies and shows a dashboard with alerts.

## Why it matters

A model service fails in quiet ways. Answers get worse after a prompt change. Latency rises when a provider slows down. Cost climbs when an agent loops. With logs, traces and metrics you find the failure in minutes and link it to the change that caused it.

## The idea with an example

An agent answers a question in three steps. It retrieves documents, calls the model, calls a tool, and calls the model again. A trace records one span per step. A span is a named unit of work with a start time and a duration.

| Span | Start (ms) | Duration (ms) |
| --- | --- | --- |
| retrieval | 0 | 120 |
| model call 1 | 120 | 1,800 |
| tool call | 1,920 | 400 |
| model call 2 | 2,320 | 1,100 |
| Total | | 3,420 |

The durations add up to 3,420 milliseconds (ms). The first model call takes 53 percent of the time. If the team wants a faster agent, that span is the target. A shorter prompt on that step saves more than any change to retrieval.

Each model span also records the input tokens, the output tokens and the cost. If the first call has 4,000 input tokens and the second has 6,000, the context grows in the second call.

## How it works

Log these fields for every request.

| Field | Why |
| --- | --- |
| Request id and trace id | Link the request to its spans |
| Prompt version | Find which prompt change caused a regression |
| Model name and version | Compare models over time |
| Input tokens and output tokens | Compute cost and detect context growth |
| Time to first token and total latency | Separate queue time from generation time |
| Tool calls and their results | Debug agent loops |
| Cost | Sum per user, per route and per day |
| User feedback | Join quality signals to the request |

Time to first token (TTFT) is the delay from the request to the first output token. Total latency is the delay to the last token. A high TTFT with a normal total means the request waited in a queue or had a long prefill.

Percentile latencies describe the distribution. The p50 latency is the value that half of requests fall under. The p95 is the value that 95 percent fall under. The p99 latency is the value that 99 percent of requests fall under, so 1 in 100 requests is slower. Report all three, because the average hides the slow tail.

Build the dashboard with these panels.

1. Requests per minute, split by route and model.
2. p50, p95 and p99 latency, with TTFT as a separate line.
3. Error rate, split by error type: timeout, rate limit, filter block, schema failure.
4. Cost per request and cost per day.
5. Token counts per request, as a histogram.

Then add alerts. Alert when p99 latency stays above a limit for five minutes. Alert when the error rate goes above 2 percent. Alert when the daily cost passes a budget by noon.

Metrics do not show quality. Sample 1 percent of requests and send them to a human review queue. Store the prompt, the answer and the trace together. Tag every review with the prompt version. A drop in review scores after a version change is the fastest signal of a bad prompt.

Caution: logs contain user text. Mask personal data before storage and set a retention limit.

## Common mistakes

- Mistake: log only the average latency. Fix: log the p50, p95 and p99, and watch the p99.
- Mistake: log the prompt text without the prompt version. Fix: add a version field, and bump it on every change.
- Mistake: trace only the model call. Fix: add spans for retrieval, tools and post-processing, so the total adds up.
- Mistake: store raw personal data in logs. Fix: mask it at the logging layer and set a retention limit.
- Mistake: review quality only after a complaint. Fix: sample 1 percent of traffic every day for review.

## Check your understanding

- Question: a trace shows retrieval 200 ms, model 2,500 ms and tool 300 ms. What is the total? Answer: 3,000 ms.
- Question: p99 latency is 8 seconds. What does that mean? Answer: 1 in 100 requests takes longer than 8 seconds.
- Question: TTFT is high but the total latency is normal. What do you check first? Answer: the queue time and the prefill length, not the generation speed.

## Go further

The OpenTelemetry documentation defines traces, spans and metrics, and the Python repository has the code to emit them. Langfuse is an open tool that stores model traces with tokens, costs and feedback. Chip Huyen describes the logging that production model services need. Hussein Nasser explains latency percentiles and backend tracing on his channel.
`,
          },
          {
            slug: 'safety-filters-and-fallbacks',
            title: 'Safety filters and fallbacks',
            summary: 'Filter the inputs and outputs, and plan what happens when the model fails.',
            minutes: 15,
            objectives: [
              'Design input and output filters for a model service.',
              'Compute the combined availability of a primary model and a fallback model.',
              'Order the fallback chain from timeout to canned answer.',
              'Explain what a circuit breaker does and when it opens.',
            ],
            keyTerms: ['prompt injection', 'output filter', 'fallback', 'circuit breaker', 'availability', 'back-pressure', 'allowlist'],
            links: [
              { label: 'Constitutional AI', url: 'https://arxiv.org/abs/2212.08073', kind: 'paper' },
              { label: 'NeMo Guardrails repository', url: 'https://github.com/NVIDIA/NeMo-Guardrails', kind: 'repo' },
              { label: 'Purple Llama: safety tools and classifiers', url: 'https://github.com/meta-llama/PurpleLlama', kind: 'repo' },
              { label: 'Lilian Weng: LLM-powered autonomous agents', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', kind: 'article' },
              { label: 'ByteByteGo: system design', url: 'https://www.youtube.com/@ByteByteGo', kind: 'video' },
            ],
            body: `
## What this lesson covers

Filters stop bad inputs and bad outputs. Fallbacks keep the service up when the model fails or slows down. This lesson shows both, with the availability arithmetic for a fallback chain.

## Why it matters

A model follows instructions, and some of those instructions come from attackers. A pasted document can tell the model to ignore its rules. A tool call can delete data. A provider can go down for an hour. Each of these happens in production, and each has a cheap defence.

## The idea with an example

A service runs on a primary model with 98 percent availability. That means it fails or times out on 2 percent of calls. The team adds a fallback model from a different provider with 97 percent availability.

The service fails only when both models fail. If the two failures are independent, the combined failure rate is the product of the two rates.

$$P(\\text{fail}) = 0.02 \\times 0.03 = 0.0006$$

The combined availability is $1 - 0.0006 = 0.9994$, or 99.94 percent. On 100,000 requests per day, the single model fails 2,000 times. The pair fails 60 times.

Note: two models on the same provider fail together, so the arithmetic does not hold.

## How it works

Filters sit on both sides of the model.

Input filters run before the prompt reaches the model.

- Match known prompt injection patterns, such as "ignore the previous instructions". Log the match and block or flag the request.
- Detect personal identifiable information (PII), such as card numbers, and mask it.
Output filters run before the answer reaches the user.

- Run a safety classifier on the answer. Block the answer if the score passes a threshold.
- Match regular expressions for secrets, such as keys and tokens, and redact them.
- Validate structured output against its schema.

Tool permissions use an allowlist. The agent can call only the tools on the list. A tool that writes or deletes needs a confirmation step. Treat every tool result as untrusted text, because a web page or a file can carry an injection.

The fallback chain runs in a fixed order. Follow this procedure.

1. Set a timeout on the primary call, such as 10 seconds.
2. If the call times out or returns a transient error, retry once with a backoff of 1 second. Retry a second time with 2 seconds.
3. If the retries fail, call the fallback model with the same prompt.
4. If the fallback fails, return a cached answer for the same question if one exists.
5. If there is no cached answer, return a canned message and a request id.

A circuit breaker stops the retries when the primary is down. It counts failures in a window. If more than 50 percent of calls fail in one minute, the breaker opens. An open breaker sends every call to the fallback at once. After 30 seconds it lets one test call through. If the test call succeeds, the breaker closes.

The table shows the time cost of the full chain.

| Step | Worst-case time added |
| --- | --- |
| Primary call with timeout | 10 s |
| Two retries with backoff | 23 s |
| Fallback call with timeout | 10 s |
| Cached or canned answer | under 0.1 s |

The worst case is 43 seconds, which is too long for a chat user. Shorten the timeouts on interactive routes to 5 seconds and allow one retry.

Graceful degradation means the service gives a smaller answer instead of no answer. A search feature can return the retrieved documents without a summary.

Caution: retries multiply load on a provider that is already slow. Use the circuit breaker, and apply back-pressure by rejecting new requests when the queue is full.

## Common mistakes

- Mistake: trust tool results as instructions. Fix: treat every tool result as data and keep the rules in the system prompt.
- Mistake: retry without a limit. Fix: allow one or two retries with backoff and a circuit breaker.
- Mistake: put the fallback on the same provider. Fix: use a second provider or a self-hosted model.
- Mistake: filter only the input. Fix: filter the output too, because the model can leak secrets from its context.
- Mistake: give the agent every tool. Fix: use an allowlist and a confirmation step for writes.

## Check your understanding

- Question: the primary model has 99 percent availability and the fallback has 95 percent. What is the combined availability? Answer: 1 - 0.01 x 0.05, which is 0.9995.
- Question: when does a circuit breaker open? Answer: when the failure rate in a short window passes a threshold, such as 50 percent in one minute.
- Question: why is a tool result untrusted? Answer: it can contain text that tries to instruct the model.

## Go further

The Constitutional AI paper shows how a model can judge its own outputs against written rules, which is the basis of many output filters. NeMo Guardrails and Purple Llama are open toolkits with input and output classifiers. Lilian Weng describes the risks in agent loops with tools. ByteByteGo covers circuit breakers and retries in general system design. The lab at /labs/timeout-architect lets you set timeouts and retries per hop and see the tail latency of the whole chain.
`,
          },
        ],
      },
    ],
  }
