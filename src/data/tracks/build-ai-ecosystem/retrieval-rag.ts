import type { Module } from '../../types'

export const mod: Module = {
  slug: 'retrieval-rag',
  title: 'Retrieval over your own documents (RAG)',
  description: 'Load and chunk your own files, embed the chunks into Chroma, retrieve the best ones for a question, answer with citations, and measure how well the whole pipeline works.',
  level: 'beginner',
  lessons: [
    {
      slug: 'why-rag',
      title: 'Why models need your documents',
      summary: 'After this lesson you can explain why a model cannot answer questions about your own files and draw the retrieval-augmented generation (RAG) pipeline that fixes this.',
      minutes: 20,
      objectives: [
        'Explain the two limits that stop a model from answering questions about your files: the knowledge cutoff and the context window.',
        'Compute the token cost of pasting a whole document set into every request.',
        'Draw the four stages of a RAG pipeline: load, embed, retrieve, answer.',
        'Run a first script that answers a question with and without a document in the prompt.',
      ],
      keyTerms: ['RAG', 'retrieval', 'grounding', 'context window', 'knowledge cutoff', 'hallucination'],
      links: [
        { label: 'Retrieval-augmented generation for knowledge-intensive NLP tasks (Lewis et al., 2020)', url: 'https://arxiv.org/abs/2005.11401', kind: 'paper' },
        { label: 'Context windows (Claude docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows', kind: 'docs' },
        { label: 'Chroma documentation', url: 'https://docs.trychroma.com/', kind: 'docs' },
        { label: 'Lost in the middle: how language models use long contexts', url: 'https://arxiv.org/abs/2307.03172', kind: 'paper' },
      ],
      body: `
## What this lesson covers

This lesson explains why a model cannot answer questions about your own files, and what retrieval-augmented generation (RAG) does about it. RAG is a pipeline that finds the right pieces of your documents and puts them in the prompt before the model answers. You add a rag folder and a data folder to your aiworkshop repository. At the end you can draw the pipeline and explain each stage in one sentence.

## Why it matters

The chat application you built in the last module answers from what the model learned in training. That is enough for general questions. It is not enough for questions about your company, your course notes or your own PDF files. Every useful AI system in a business answers from private documents: a support bot reads the product manual, a legal assistant reads the contracts. This module builds that ability, and it is the part of the ecosystem that the agents in the next module will search. The next lesson, [Loading and chunking documents](/courses/build-ai-ecosystem/retrieval-rag/load-and-chunk), builds the first stage of the pipeline.

:::video
id: T-D1OfcDW1M
why: Watch all 8 minutes. The presenter draws the same three parts this lesson names: the model, your documents and the retrieval step between them.
:::

## The idea with an example

> **Analogy.** An exam has two formats. In a closed-book exam you answer from memory, and you guess when you do not remember. In an open-book exam you can bring the textbook, but you cannot read all 600 pages during the exam. So you use the index at the back. You look up the keyword, open the one page it points to, and answer from that page. A model without your documents sits a closed-book exam. RAG gives the model an open-book exam with a very good index.

The running example for this whole module is a small bakery called Sunrise Bakery. It has three short documents. Create a data folder in your aiworkshop repository and save these three files.

:::code
lang: text
file: data/menu.txt
Sunrise Bakery menu. Sourdough loaf: 4.50. Rye loaf: 5.00. Cinnamon roll: 3.00. Almond croissant: 3.50. Carrot cake slice: 4.00. We bake every loaf before 7 am. Prices are in dollars and include tax.
:::

:::code
lang: text
file: data/opening_hours.txt
Sunrise Bakery opening hours. Monday to Friday: 7 am to 5 pm. Saturday: 8 am to 2 pm. Sunday: closed. On public holidays we open from 9 am to 1 pm. The last batch of bread comes out of the oven at 11 am.
:::

:::code
lang: text
file: data/allergens.txt
Sunrise Bakery allergen list. The sourdough loaf contains wheat. The rye loaf contains rye and wheat, so it is not gluten free. The cinnamon roll contains wheat, milk and egg. The almond croissant contains wheat, milk, egg and almonds. The carrot cake contains wheat, egg and walnuts. We bake all products in one kitchen, so traces of nuts can be present in any product.
:::

The three files hold 141 words together. That is about 190 tokens. A token is the unit of text a model reads, and 100 words is roughly 130 tokens in English. Now take one question: "Is the rye loaf gluten free?" The model has never seen Sunrise Bakery. It was trained on text from before its knowledge cutoff, the date of the last text in its training data, and your bakery was never on the internet. So a model without the documents has two options. It can say it does not know, or it can invent a confident answer. A confident false answer is a hallucination.

The naive fix is to paste all three files into every request. For 190 tokens this works, and the first script below does exactly that. The problem appears when the documents grow. A 300-page manual holds about 100,000 words, which is about 130,000 tokens. The model claude-sonnet-5-5 has a context window of 1,000,000 tokens, so the manual fits. The context window is the maximum number of tokens one request can hold. But fitting is not the same as cheap or good. Input costs 2 dollars per 1,000,000 tokens, so one question costs 0.26 dollars. 1,000 questions a day cost 260 dollars a day. And a model that reads 130,000 tokens to find one sentence answers more slowly and makes more mistakes, because the one sentence is buried.

RAG replaces "paste everything" with "find the right pieces". Press Next to follow the question through the four stages.

:::scenario
title: One question through the RAG pipeline
state: question=Is the rye loaf gluten free?, chunks in store=5, chunks in prompt=0
step: Before any question arrives, you load the three files and cut them into 5 chunks. A chunk is a short piece of text, here about 40 words. Each chunk gets an id such as allergens.txt#0.
state: vectors stored=5
step: You turn each chunk into an embedding, a list of 384 numbers that encodes its meaning, and store the vectors in Chroma.
state: query vector=384 numbers
step: A question arrives. You turn the question into an embedding with the same model.
state: top 3=allergens.txt#0 0.71, menu.txt#0 0.48, allergens.txt#1 0.41
step: Chroma compares the question vector with the 5 chunk vectors and returns the 3 most similar chunks with a score.
state: chunks in prompt=3, prompt tokens=about 160
step: You build a prompt that holds the 3 chunks with their ids and the question.
state: answer=No. The rye loaf contains rye and wheat, so it is not gluten free [allergens.txt#0].
step: The model answers from the chunks and cites the chunk id. The 2 chunks about opening hours never enter the prompt.
:::

The prompt held about 160 tokens instead of 130,000, and the answer points to the exact chunk that supports it. This is the whole idea. Every lesson in this module builds one stage of this scenario.

:::arch
title: The RAG pipeline inside aiworkshop
layer: User | Terminal, Web page
layer: Your code | Chunker, Prompt builder
layer: Models | Embedding model, Claude API
layer: Data | data folder, Chroma store
flow: Terminal -> Embedding model -> Chroma store -> Prompt builder -> Claude API -> Terminal
note: Chroma store = finds the 3 chunks most similar to the question
:::

## How it works

A RAG system has two phases. The indexing phase runs once, or every time the documents change. The query phase runs for every question. Keep the two phases separate in your head and in your code, because they fail in different ways.

1. Load. Read each file and turn it into plain text. A PDF needs a library; a text file needs one line of Python.
2. Chunk. Cut the text into pieces of a fixed size with some overlap. Give each piece an id and record which file and position it came from.
3. Embed and store. Turn each chunk into a vector with an embedding model and save the vectors in a vector store. The vector store is a database that finds the vectors closest to a query vector.
4. Retrieve. Embed the question with the same model and ask the store for the top k chunks. The number k is small, usually 3 to 10.
5. Answer. Put the chunks and the question in a prompt. Tell the model to answer only from the chunks and to cite their ids.
6. Evaluate. Ask a fixed set of test questions and measure how often the right chunk is retrieved and how often the answer is correct.

Steps 1 to 3 are the indexing phase. Steps 4 and 5 are the query phase. Step 6 checks both. The word grounding describes what step 5 achieves: the answer rests on text you can point to, not on memory.

The two phases run at different times and at different speeds. Indexing the bakery takes a few seconds and happens once. Indexing a 300-page manual takes a minute or two on a laptop and happens again only when a page changes. The query phase must be fast, because a person is waiting: embedding the question takes milliseconds, the search takes milliseconds, and the model call takes 1 to 3 seconds. Keep this split in mind when something is slow. A slow indexing script is a small problem. A slow query is a problem the user sees.

RAG is also not the right tool for every job. It answers questions whose answer sits in a document. It does not teach the model a new writing style, a new language or a new way to reason; those need fine-tuning or a different model. And it does not help when the question needs the whole document at once, such as "summarise this contract", where you pass the full text and skip retrieval.

| Approach | Tokens per question | Cost per 1,000 questions | Works when documents change | Risk |
| --- | --- | --- | --- | --- |
| Ask the model from memory | about 20 | 0.04 dollars | no, the model never saw them | hallucination |
| Paste every document | 130,000 for a 300-page manual | 260 dollars | yes, on the next request | slow, buried facts, high cost |
| Fine-tune the model | about 20 | 0.04 dollars plus training | no, you must train again | the model still invents details |
| RAG with 3 chunks | about 160 | 0.32 dollars | yes, re-index the changed file | wrong chunk retrieved |

The last column matters. RAG does not remove every failure. It changes the failure into one you can measure: did the right chunk reach the prompt. The last lesson of this module, [Evaluating RAG](/courses/build-ai-ecosystem/retrieval-rag/evaluate-rag), measures exactly that.

Here is the first script. It asks the same question twice: once with no document and once with the allergens file pasted in. Create the rag folder with an empty rag/__init__.py, then write rag/ask_naive.py.

:::code
lang: python
file: rag/ask_naive.py
from pathlib import Path
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"
DATA = Path(__file__).resolve().parent.parent / "data"

def ask(question: str, context: str = "") -> str:
    system = "You answer questions about Sunrise Bakery. If you do not know, say so."
    prompt = question if not context else f"Document:\\n{context}\\n\\nQuestion: {question}"
    reply = client.messages.create(model=MODEL, max_tokens=512, system=system,
                                   messages=[{"role": "user", "content": prompt}])
    return "".join(block.text for block in reply.content if block.type == "text")

question = "Is the rye loaf gluten free?"
print("Without documents:", ask(question))
allergens = (DATA / "allergens.txt").read_text(encoding="utf-8")
print("With allergens.txt:", ask(question, allergens))
:::

:::code
lang: bash
python -m rag.ask_naive
:::

:::code
lang: text
Without documents: I do not have information about Sunrise Bakery or its rye loaf.
With allergens.txt: No. The rye loaf contains rye and wheat, so it is not gluten free.
:::

The first answer is the good case: the model admits it does not know. Some models instead write a confident guess, which is why the system prompt tells the model to say so. The second answer is correct because the fact is in the prompt. The rest of the module automates the step you did by hand here: choosing which file to paste.

One more number to keep. The question plus the pasted file is about 120 tokens. With three files it is about 220. With 300 files it is 20,000, and the model starts to miss facts in the middle of the prompt. The Lost in the middle paper in the links measured this effect. Short, relevant context beats long, complete context.

## Try it

:::exercise
title: Make the model fail, then fix it
task: Run rag/ask_naive.py with the question "What time does the bakery close on Saturday?" First pass no context, then pass allergens.txt, then pass opening_hours.txt. Write down the three answers. Which file made the answer correct, and what did the model do when it had the wrong file?
hint: Change the question variable and add a third call that reads opening_hours.txt. The wrong file should make the model say it cannot find the answer, not invent a time.
lang: python
solution:
question = "What time does the bakery close on Saturday?"
print("Without documents:", ask(question))
allergens = (DATA / "allergens.txt").read_text(encoding="utf-8")
print("With allergens.txt:", ask(question, allergens))
hours = (DATA / "opening_hours.txt").read_text(encoding="utf-8")
print("With opening_hours.txt:", ask(question, hours))
# Expected: only the third call answers "2 pm". The second call should say the
# document does not mention Saturday hours. If it invents a time, the system
# prompt needs a stronger instruction.
:::

## Common mistakes

- Mistake: expect the model to know your documents because they are on your computer. Fix: the model only sees what is in the request, so your code must put the text in the prompt.
- Mistake: paste every document into every request because the context window is large. Fix: count the tokens and the cost per question, then retrieve only the chunks that match.
- Mistake: treat a confident answer as a correct answer. Fix: ask the model to cite the chunk it used, and check the chunk.
- Mistake: fine-tune a model to teach it facts that change every week. Fix: use RAG for facts and fine-tuning for style or format, as the lesson [When to fine-tune, prompt, or retrieve](/courses/build-ai-ecosystem/train-your-own/when-to-fine-tune) explains.

## Check your understanding

:::quiz
title: Check: why RAG
q: You ask a model about a document that was written yesterday and never published. Why can the model not answer from memory?
- The document is too long for the context window
* The document was never in the training data, so the model has no memory of it
- The model refuses to read private documents
why: Training ended at the knowledge cutoff, and a private document never entered the training data at all.
q: A manual holds 130,000 tokens. Input costs 2 dollars per 1,000,000 tokens. What does one question cost when you paste the whole manual?
- 0.026 dollars
* 0.26 dollars
- 2.60 dollars
why: 130,000 divided by 1,000,000 is 0.13, and 0.13 times 2 dollars is 0.26 dollars.
q: Which step belongs to the query phase, not the indexing phase?
- Cutting a file into chunks
- Storing chunk vectors in Chroma
* Embedding the question and asking the store for the top 3 chunks
why: Indexing prepares the chunks once; the query phase runs for each question and starts by embedding the question.
q: A RAG system gives a wrong answer. Which failure is new compared with asking the model from memory?
* The wrong chunk was retrieved, so the right fact never reached the prompt
- The model forgot the question
- The vector store changed the text of the chunk
why: RAG adds a retrieval step, and that step can miss the right chunk; the last lesson measures how often it does.
q: What does grounding mean in this module?
- The model runs on your own computer
* The answer rests on a chunk of text you can point to
- The model uses a lower temperature
why: A grounded answer cites the chunk that supports it, so you can check it against the source.
:::

## Go further

The 2020 paper by Lewis and colleagues introduced the name RAG and the idea of a retriever in front of a generator. The Claude context window documentation gives the exact limits and the token counting endpoint. The Lost in the middle paper shows with measurements why short, relevant context wins over long context. The next lesson, [Loading and chunking documents](/courses/build-ai-ecosystem/retrieval-rag/load-and-chunk), writes the loader and the chunker that produce the 5 chunks from this scenario.
`,
    },
    {
      slug: 'load-and-chunk',
      title: 'Loading and chunking documents',
      summary: 'After this lesson you can read PDF and text files into plain text, cut the text into overlapping chunks of a chosen size, and attach metadata such as file name and position to each chunk.',
      minutes: 22,
      objectives: [
        'Write a loader that reads text files and PDF files into plain text.',
        'Write a chunker that cuts text into pieces of 40 words with an overlap of 10 words.',
        'Compute how many chunks a document of a given length produces.',
        'Choose a chunk size and explain the trade-off between small and large chunks.',
      ],
      keyTerms: ['document loader', 'chunking', 'chunk', 'chunk size', 'chunk overlap', 'metadata'],
      links: [
        { label: 'pypdf documentation', url: 'https://pypdf.readthedocs.io/en/stable/', kind: 'docs' },
        { label: 'Chunking strategies (Chroma research)', url: 'https://research.trychroma.com/evaluating-chunking', kind: 'article' },
        { label: 'pathlib: object-oriented filesystem paths (Python docs)', url: 'https://docs.python.org/3/library/pathlib.html', kind: 'docs' },
        { label: 'Contextual retrieval (Anthropic)', url: 'https://www.anthropic.com/news/contextual-retrieval', kind: 'article' },
      ],
      body: `
## What this lesson covers

This lesson builds the first stage of the RAG pipeline: loading and chunking. A document loader reads a file and returns its text. A chunker cuts that text into pieces called chunks. You write rag/load.py and rag/chunk.py in your aiworkshop repository. At the end you can turn any folder of text and PDF files into a list of chunks, each with an id and metadata.

## Why it matters

The chunk is the unit of retrieval. The vector store in the next lesson never returns a file; it returns chunks. If a chunk is too large, the prompt fills with text the question does not need. If a chunk is too small, a fact gets cut in half and no chunk holds the whole answer. Every later result, including the hit rate you measure in the last lesson, depends on how you cut the text here. The next lesson, [Embeddings and a vector store](/courses/build-ai-ecosystem/retrieval-rag/embed-and-store), takes the chunks from this lesson and turns them into vectors.

## The idea with an example

> **Analogy.** A librarian makes index cards for a long book. One card per book is useless, because the card would have to hold the whole book. One card per word is also useless, because a single word tells you nothing. The librarian writes one card per paragraph, and at the top of each card writes the book title and the page number. When a card ends in the middle of a sentence, the next card repeats that sentence so no idea is lost. The card is a chunk. The title and page number are metadata. The repeated sentence is the overlap.

Take data/opening_hours.txt from the last lesson. It holds 44 words. Choose a chunk size of 40 words and an overlap of 10 words. Chunk size is the maximum number of words in one chunk. Chunk overlap is the number of words that the end of one chunk shares with the start of the next. The chunker walks through the list of words with a start position and an end position. Press Next to watch it.

:::scenario
title: Chunking opening_hours.txt with size 40 and overlap 10
state: words=44, size=40, overlap=10, start=0, chunks=0
step: Split the text on spaces. The result is a list of 44 words.
state: end=40
step: Set end to start plus size, which is 40. Because 40 is less than 44, the chunk is words 0 to 39.
state: chunks=1, chunk 0=Sunrise Bakery opening hours. Monday to Friday: 7 am to 5 pm. ... comes out of the
step: Join words 0 to 39 and save them as chunk 0. The chunk ends in the middle of a sentence: "comes out of the".
state: start=30
step: Move start to end minus overlap, which is 40 minus 10, so 30. The next chunk starts 10 words before the last one ended.
state: end=44
step: Set end to start plus size, which is 70. That is more than 44, so end becomes 44, the end of the text.
state: chunks=2, chunk 1=pm. The last batch of bread comes out of the oven at 11 am.
step: Join words 30 to 43 and save them as chunk 1. The overlap repairs the broken sentence: chunk 1 holds the full sentence about the last batch.
state: done=true
step: The end reached the last word, so the chunker stops. Two chunks cover one file of 44 words.
:::

Now run the same rule on all three files. The menu holds 33 words, which is less than 40, so it gives 1 chunk. The opening hours give 2 chunks. The allergen list holds 64 words and gives 2 chunks: words 0 to 39 and words 30 to 63. The whole bakery is 5 chunks. Each chunk gets an id made from the file name and its position, such as allergens.txt#1. The id is what the model cites in the answer lesson.

:::flow
title: From files to chunks
data folder -> Loader: one file at a time
Loader -> Plain text: PDF pages or file content
Plain text -> Chunker: list of words
Chunker -> Chunk list: 5 chunks with ids
Chunk list -> Next lesson: embed and store
:::

## How it works

Loading comes first. A text file needs one call: read the file as a string. A PDF needs a library, because a PDF stores drawing commands, not plain text. The library pypdf opens the file, walks through the pages and extracts the text of each page. Install it with pip install pypdf. Some PDF files hold scanned images instead of text, and pypdf returns an empty string for them; those need optical character recognition, which this module does not cover.

:::code
lang: python
file: rag/load.py
from pathlib import Path
from pypdf import PdfReader

DATA = Path(__file__).resolve().parent.parent / "data"

def load_text(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    return [{"source": path.name, "page": 1, "text": text}]

def load_pdf(path: Path) -> list[dict]:
    reader = PdfReader(str(path))
    pages = []
    for number, page in enumerate(reader.pages, 1):
        text = page.extract_text() or ""
        if text.strip():
            pages.append({"source": path.name, "page": number, "text": text})
    return pages

def load_folder(folder: Path = DATA) -> list[dict]:
    documents = []
    for path in sorted(folder.iterdir()):
        if path.suffix == ".txt":
            documents.extend(load_text(path))
        elif path.suffix == ".pdf":
            documents.extend(load_pdf(path))
    return documents

if __name__ == "__main__":
    for doc in load_folder():
        print(doc["source"], "page", doc["page"], len(doc["text"].split()), "words")
:::

Each loader returns a list of dictionaries with the same three keys: source, page and text. The source is the file name. The page is 1 for a text file and the real page number for a PDF. This dictionary is the metadata of the document, the facts about the text that are not the text itself. Metadata travels with every chunk, so a chunk can later say "I come from page 12 of the manual".

Plain text loses some structure, and you should know what is lost. A heading becomes an ordinary line. A table becomes words separated by spaces, with the row and column order often scrambled. A two-column PDF page can come out with the columns interleaved. Print the text of one page after loading and read it before you trust it. For most manuals, notes and reports the loss is small. For documents that are mostly tables, a different loader that keeps the rows, such as one built on pdfplumber, gives better chunks.

Chunking comes second. The steps are the ones the scenario showed:

1. Split the text into words.
2. Set start to 0.
3. Set end to start plus size, but never past the last word.
4. Join the words from start to end and save the chunk with the file name, the page and a running index.
5. If end reached the last word, stop.
6. Otherwise set start to end minus overlap and go back to step 3.

:::code
lang: python
file: rag/chunk.py
from rag.load import load_folder

def chunk_text(text: str, size: int = 40, overlap: int = 10) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + size, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start = end - overlap
    return chunks

def make_chunks(documents: list[dict], size: int = 40, overlap: int = 10) -> list[dict]:
    result = []
    for doc in documents:
        for index, text in enumerate(chunk_text(doc["text"], size, overlap)):
            result.append({
                "id": f"{doc['source']}#{index}",
                "text": text,
                "metadata": {"source": doc["source"], "page": doc["page"], "index": index},
            })
    return result

if __name__ == "__main__":
    chunks = make_chunks(load_folder())
    print(len(chunks), "chunks")
    for chunk in chunks:
        print(chunk["id"], len(chunk["text"].split()), "words:", chunk["text"][:50], "...")
:::

:::code
lang: bash
python -m rag.chunk
:::

:::code
lang: text
5 chunks
allergens.txt#0 40 words: Sunrise Bakery allergen list. The sourdough loaf c ...
allergens.txt#1 34 words: The almond croissant contains wheat, milk, egg and ...
menu.txt#0 33 words: Sunrise Bakery menu. Sourdough loaf: 4.50. Rye loa ...
opening_hours.txt#0 40 words: Sunrise Bakery opening hours. Monday to Friday: 7 ...
opening_hours.txt#1 14 words: pm. The last batch of bread comes out of the oven ...
:::

The chunker counts words, which is easy to read and to check by hand. Production systems usually count tokens with the model tokenizer, because the embedding model has a token limit, often 256 or 512 tokens. The rule is the same; only the unit changes. The overlap must be smaller than the size, or the loop never moves forward. The code does not check this, so keep the rule in mind when you change the numbers.

The number of chunks follows a formula. With n words, size s and overlap o, each chunk after the first adds s minus o new words. For the allergen list, n is 64, s is 40 and o is 10. The first chunk covers 40 words. The remaining 24 words need one more chunk, because each extra chunk covers 30 new words. So 2 chunks. For a 300-page manual with 100,000 words, the same rule gives about 3,333 chunks.

| Chunk size (overlap 10) | Chunks from 100,000 words | What a chunk holds | Strength | Weakness |
| --- | --- | --- | --- | --- |
| 20 words | about 10,000 | one sentence | very precise retrieval | facts split across chunks |
| 40 words | about 3,333 | one short paragraph | good balance for question answering | needs overlap |
| 200 words | about 526 | a section | each chunk is self-contained | prompt fills with unused text |
| 1,000 words | about 101 | several pages | rarely splits a fact | retrieval becomes vague, cost rises |

Start at 40 to 100 words for question answering over notes and manuals. Go larger when the questions need whole sections, such as "summarise the refund policy". Go smaller when the questions ask for single facts. You do not have to guess: the last lesson of this module measures the hit rate, and you can rerun it with a different size. The Chroma research article in the links compares chunking strategies with such measurements.

Two refinements help on real documents. First, split on structure before splitting on size: cut at headings and blank lines, then apply the word rule inside each section, so a chunk rarely crosses from one topic into another. Second, prepend context to each chunk, such as the file name and the heading it sits under. The chunk "Sunday: closed" is clearer as "opening_hours.txt, Sunrise Bakery opening hours: Sunday: closed". Anthropic's contextual retrieval article in the links shows that this one change cuts retrieval failures by a large margin.

## Try it

:::exercise
title: Change the chunk size and count
task: Predict how many chunks make_chunks produces for the three bakery files with size 20 and overlap 5. Then run it and check. Then find the smallest size that gives exactly 3 chunks in total with overlap 0.
hint: Each chunk after the first adds size minus overlap new words. Menu 33 words, hours 44 words, allergens 64 words. With overlap 0, 3 chunks in total means 1 chunk per file, so the size must be at least the longest file.
lang: python
solution:
from rag.load import load_folder
from rag.chunk import make_chunks

docs = load_folder()
print(len(make_chunks(docs, size=20, overlap=5)))
# menu: 33 words -> 20, then 15 new words per chunk -> 2 chunks
# hours: 44 words -> 20 + 15 + 9 -> 3 chunks
# allergens: 64 words -> 20 + 15 + 15 + 14 -> 4 chunks
# total 9

for size in range(30, 70):
    if len(make_chunks(docs, size=size, overlap=0)) == 3:
        print("smallest size for 3 chunks:", size)
        break
# prints 64, the length of allergens.txt
:::

## Common mistakes

- Mistake: set the overlap equal to or larger than the size. Fix: keep the overlap at about a quarter of the size, so the loop always moves forward and the repeated text stays small.
- Mistake: throw away the file name and page number after loading. Fix: carry source, page and index in the metadata of every chunk, because the citation and the evaluation need them.
- Mistake: chunk a scanned PDF and get empty chunks. Fix: print the word count per page after loading, and run optical character recognition on pages that return no text.
- Mistake: choose a chunk size once and never revisit it. Fix: measure the hit rate on a test set and try two or three sizes.
- Mistake: let a chunk cross from the end of one section into the start of the next. Fix: split on headings and blank lines first, then apply the size rule inside each section.

## Check your understanding

:::quiz
title: Check: loading and chunking
q: A file holds 100 words. The chunk size is 40 and the overlap is 10. How many chunks does the chunker produce?
- 2
* 3
- 4
why: The first chunk covers words 0 to 39, the second starts at 30 and covers to 69, the third starts at 60 and covers to 99.
q: Why does the chunker repeat 10 words at the start of each new chunk?
- To make every chunk the same length
* So a sentence cut at a chunk boundary appears whole in at least one chunk
- Because the embedding model needs 10 extra words
why: The overlap repairs broken sentences, as chunk 1 of opening_hours.txt showed.
q: A question asks for one price from a menu. Which chunk size most likely retrieves the exact fact without extra text?
* 40 words
- 1,000 words
- the whole file as one chunk
why: Small chunks hold one fact each, so the retrieved chunk matches the question closely and the prompt stays short.
q: Which field is metadata rather than text?
- The sentence "Sunday: closed"
* The page number the sentence came from
- The embedding of the sentence
why: Metadata describes the text, such as its source file, page and position, and travels with the chunk.
q: pypdf returns an empty string for every page of a PDF. What is the most likely cause?
- The chunk size is too small
- The file has no metadata
* The PDF holds scanned images rather than text
why: pypdf extracts text that the PDF stores as text; a scanned page is an image and needs optical character recognition.
:::

## Go further

The pypdf documentation shows how to read page text, metadata and even images from a PDF. The Chroma research article compares chunk sizes and splitting rules with measured retrieval scores. The Anthropic contextual retrieval article explains why adding a short context line to each chunk helps so much. The next lesson, [Embeddings and a vector store](/courses/build-ai-ecosystem/retrieval-rag/embed-and-store), turns the 5 chunks into vectors and stores them in Chroma.
`,
    },
    {
      slug: 'embed-and-store',
      title: 'Embeddings and a vector store',
      summary: 'After this lesson you can turn chunks into embedding vectors with a sentence-transformers model, store them in Chroma, and run a similarity search that returns the chunks closest to a question.',
      minutes: 24,
      objectives: [
        'Explain what an embedding model does to a chunk of text and why similar meanings give nearby vectors.',
        'Compute cosine similarity between two small vectors by hand.',
        'Write an indexing script that embeds the bakery chunks and stores them in a Chroma collection.',
        'Run a similarity search and read the ids, documents and distances it returns.',
      ],
      keyTerms: ['embedding', 'embedding model', 'vector store', 'cosine similarity', 'cosine distance', 'similarity search', 'HNSW'],
      links: [
        { label: 'sentence-transformers documentation', url: 'https://www.sbert.net/', kind: 'docs' },
        { label: 'all-MiniLM-L6-v2 model card (Hugging Face)', url: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2', kind: 'docs' },
        { label: 'Chroma: query and get', url: 'https://docs.trychroma.com/docs/querying-collections/query-and-get', kind: 'docs' },
        { label: 'Efficient and robust approximate nearest neighbor search using HNSW graphs', url: 'https://arxiv.org/abs/1603.09320', kind: 'paper' },
      ],
      body: `
## What this lesson covers

This lesson builds the second stage of the pipeline: embedding and storage. An embedding model turns a chunk of text into a vector, a list of numbers that encodes its meaning. A vector store keeps those vectors and finds the ones closest to a query vector. You write rag/index.py in your aiworkshop repository, embed the 5 bakery chunks with the model all-MiniLM-L6-v2 and store them in Chroma. At the end you can search the store with a question and read the results.

## Why it matters

Retrieval by keyword fails as soon as the question uses different words from the document. "Is the rye loaf gluten free?" shares no word with "contains rye and wheat" except rye. An embedding model places both sentences near each other because they mean related things. This is what makes RAG work on real questions from real people. The vector store is also the piece of the ecosystem that the memory lesson in the agents module reuses, so building it well pays twice. The next lesson, [Retrieve, build the prompt, answer with citations](/courses/build-ai-ecosystem/retrieval-rag/retrieve-and-answer), uses the search from this lesson to answer questions.

If you read [Embeddings](/courses/ai-foundations/language-as-numbers/embeddings) and [The dot product](/courses/math-from-zero/vectors-and-matrices/dot-product) earlier, this lesson applies both to real text.

:::video
id: gl1r1XV0SLw
why: Watch all 8 minutes. It shows text becoming vectors and a query finding its nearest neighbours, which is the exact search this lesson runs in Chroma.
:::

## The idea with an example

> **Analogy.** Imagine a huge map of a city where every shop is placed by what it sells, not by its street. Bakeries sit near other bakeries, and a cake shop sits between the bakeries and the sweet shops. To find a place for a chocolate croissant, you do not read every shop sign. You walk to the bakery district and look at the five nearest doors. The embedding model is the rule that places each shop on the map. The vector store is the map with a fast way to find the nearest doors. The question is a new pin you drop, and the search returns the doors closest to it.

The map of a text embedding has 384 dimensions instead of 2, but the idea is the same. The model all-MiniLM-L6-v2 reads a chunk and outputs 384 numbers. Two chunks about allergens get vectors that point in similar directions. A chunk about opening hours points somewhere else. The vector for the question "Is the rye loaf gluten free?" lands near the allergen chunks.

You compare two vectors with cosine similarity, a number from -1 to 1. The value 1 means the same direction, 0 means unrelated, and values near -1 are rare for text. Cosine similarity is the dot product of the two vectors divided by the product of their lengths. The dot product multiplies the vectors position by position and adds the results. The length of a vector is the square root of the dot product of the vector with itself.

Try it with 3 numbers instead of 384. Take a = [2, 1, 0] and b = [1, 1, 0]. The dot product is 2 times 1 plus 1 times 1 plus 0 times 0, which is 3. The length of a is the square root of 5, about 2.24. The length of b is the square root of 2, about 1.41. So the cosine similarity is 3 divided by 3.16, which is 0.95. The two vectors point in nearly the same direction. Now take c = [0, 0, 3]. Its dot product with a is 0, so the cosine similarity is 0: unrelated.

Here is what the similarities between the 5 bakery chunks look like with the real model. The values come from one run of all-MiniLM-L6-v2, rounded to 2 decimals; your run gives values close to these.

:::matrix
title: Cosine similarity between the 5 bakery chunks
cols: menu#0, hours#0, hours#1, allergens#0, allergens#1
menu#0: 1.00, 0.46, 0.38, 0.57, 0.52
hours#0: 0.46, 1.00, 0.63, 0.31, 0.29
hours#1: 0.38, 0.63, 1.00, 0.22, 0.24
allergens#0: 0.57, 0.31, 0.22, 1.00, 0.78
allergens#1: 0.52, 0.29, 0.24, 0.78, 1.00
:::

Read the grid row by row. The two allergen chunks score 0.78 with each other because they share words and topic. The two opening hours chunks score 0.63. The menu sits in between, because it names the same products as the allergen list. Every chunk scores 1.00 with itself. Now drop the question into the store. Press Next to watch the search.

:::scenario
title: Similarity search for "Is the rye loaf gluten free?"
state: question vector=384 numbers, chunks=5, k=3
step: Embed the question with the same model that embedded the chunks. A different model would give a vector in a different map, and the distances would mean nothing.
state: allergens#0=0.71, allergens#1=0.41, menu#0=0.48, hours#0=0.09, hours#1=0.12
step: Compute the cosine similarity between the question vector and each of the 5 stored vectors.
state: sorted=allergens#0 0.71, menu#0 0.48, allergens#1 0.41, hours#1 0.12, hours#0 0.09
step: Sort the 5 scores from highest to lowest.
state: top 3=allergens#0, menu#0, allergens#1
step: Keep the top 3. The allergen chunk that mentions rye and wheat is first. The menu is second because it names the rye loaf. Both opening hours chunks drop out.
state: distances=0.29, 0.52, 0.59
step: Chroma reports a distance instead of a similarity. The cosine distance is 1 minus the cosine similarity, so a smaller distance means a closer match.
:::

## How it works

The indexing script has four steps:

1. Load and chunk the documents with the code from the last lesson.
2. Load the embedding model and encode every chunk text into a vector of 384 numbers.
3. Open a Chroma collection on disk with cosine distance as its measure.
4. Add the ids, the texts, the vectors and the metadata to the collection.

Install the two libraries with pip install sentence-transformers chromadb. The first run downloads the model, about 90 megabytes, and caches it. After that the model loads in a few seconds and embeds thousands of chunks per minute on a laptop CPU.

:::code
lang: python
file: rag/index.py
import chromadb
from sentence_transformers import SentenceTransformer
from rag.load import load_folder
from rag.chunk import make_chunks

MODEL_NAME = "all-MiniLM-L6-v2"
STORE_PATH = "rag/chroma"

def build_index() -> int:
    chunks = make_chunks(load_folder())
    embedder = SentenceTransformer(MODEL_NAME)
    vectors = embedder.encode([c["text"] for c in chunks], normalize_embeddings=True)
    print("vector shape:", vectors.shape)

    store = chromadb.PersistentClient(path=STORE_PATH)
    collection = store.get_or_create_collection(name="bakery", metadata={"hnsw:space": "cosine"})
    collection.add(
        ids=[c["id"] for c in chunks],
        documents=[c["text"] for c in chunks],
        embeddings=vectors.tolist(),
        metadatas=[c["metadata"] for c in chunks],
    )
    return collection.count()

if __name__ == "__main__":
    print("chunks in store:", build_index())
:::

:::code
lang: bash
python -m rag.index
:::

:::code
lang: text
vector shape: (5, 384)
chunks in store: 5
:::

The shape (5, 384) says 5 vectors of 384 numbers each. The argument normalize_embeddings scales every vector to length 1, so the dot product equals the cosine similarity and the division step disappears. PersistentClient writes the store to the rag/chroma folder, so the vectors survive after the program ends. Add rag/chroma to your .gitignore, because it is built from the data and can be rebuilt at any time. The metadata hnsw:space set to cosine tells Chroma which measure to use when it compares vectors.

A vector store is a database built for one question: which stored vectors are closest to this one. With 5 chunks, Chroma can compare the query with every vector. With 10,000,000 chunks that takes too long, so Chroma builds an index called a hierarchical navigable small world (HNSW) graph. HNSW links each vector to its near neighbours in layers and walks the graph towards the query, so the search touches a few hundred vectors instead of millions. The result is approximate, which means it can miss the true nearest neighbour in rare cases, in exchange for a search that finishes in milliseconds.

| Vector store | Where it runs | Good for | Note |
| --- | --- | --- | --- |
| Chroma | in your Python process, on disk | learning, prototypes, up to a few million chunks | used in this module |
| FAISS | in your Python process, in memory | research, very fast search on one machine | you save and load the index yourself |
| pgvector | inside PostgreSQL | apps that already have a Postgres database | vectors next to your other tables |
| Pinecone, Weaviate, Qdrant | a server or a hosted service | production at scale, many users | network calls, cost per month |

Now search the store. The query call takes the question vector and the number of results. It returns a dictionary of lists, one list per query, which is why every field ends in [0].

:::code
lang: python
file: rag/search.py
import chromadb
from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer("all-MiniLM-L6-v2")
collection = chromadb.PersistentClient(path="rag/chroma").get_collection("bakery")

def search(question: str, k: int = 3) -> list[tuple[str, str, float]]:
    vector = embedder.encode([question], normalize_embeddings=True)[0].tolist()
    result = collection.query(query_embeddings=[vector], n_results=k,
                              include=["documents", "distances"])
    ids = result["ids"][0]
    docs = result["documents"][0]
    distances = result["distances"][0]
    return list(zip(ids, docs, distances))

if __name__ == "__main__":
    for chunk_id, text, distance in search("Is the rye loaf gluten free?"):
        print(f"{distance:.2f}  {chunk_id}  {text[:60]}...")
:::

:::code
lang: text
0.29  allergens.txt#0  Sunrise Bakery allergen list. The sourdough loaf contains wh...
0.52  menu.txt#0  Sunrise Bakery menu. Sourdough loaf: 4.50. Rye loaf: 5.00. C...
0.59  allergens.txt#1  The almond croissant contains wheat, milk, egg and almonds. ...
:::

The first column is the cosine distance, 1 minus the similarity. The best match has the smallest distance. The exact numbers differ a little between model versions, but the order is what matters, and the order is stable. One rule above all others: embed the question with the same model and the same normalisation as the chunks. If you change the embedding model, delete the rag/chroma folder and rebuild the index.

When you rebuild, delete the old collection first or use the upsert method instead of add, because add refuses an id that already exists. The script above uses add so you see that error once and learn what it means.

## Try it

:::exercise
title: Cosine similarity by hand, then with the model
task: Compute the cosine similarity of a = [3, 4] and b = [4, 3] by hand. Then write a small script that embeds the sentences "The bakery is closed on Sunday" and "We do not open on Sundays" and prints their cosine similarity. Then add a third sentence about carrot cake and check that it scores lower.
hint: The dot product of a and b is 12 plus 12. Both lengths are 5. With normalize_embeddings=True, the cosine similarity is the dot product of the two vectors, which numpy computes with the @ operator.
lang: python
solution:
# by hand: (3*4 + 4*3) / (5 * 5) = 24 / 25 = 0.96

from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer("all-MiniLM-L6-v2")
sentences = ["The bakery is closed on Sunday",
             "We do not open on Sundays",
             "The carrot cake contains walnuts"]
v = embedder.encode(sentences, normalize_embeddings=True)
print("closed vs not open:", round(float(v[0] @ v[1]), 2))
print("closed vs carrot cake:", round(float(v[0] @ v[2]), 2))
# The first value is high (around 0.7 to 0.8) and the second is low (around 0.1 to 0.2).
:::

## Common mistakes

- Mistake: embed the chunks with one model and the questions with another. Fix: keep the model name in one constant and use it in both the index script and the search script.
- Mistake: read a Chroma distance as a similarity and pick the largest. Fix: with cosine space, distance is 1 minus similarity, so pick the smallest.
- Mistake: forget the [0] when reading query results and loop over a list of lists. Fix: Chroma returns one list per query; take index 0 for a single question.
- Mistake: run the index script twice and get an error about existing ids. Fix: delete the collection before rebuilding, or use upsert instead of add.
- Mistake: commit the rag/chroma folder to git. Fix: add it to .gitignore and rebuild it from the data folder when needed.

## Check your understanding

:::quiz
title: Check: embeddings and vector stores
q: Two chunks have cosine similarity 0.78 and two others have 0.22. What does this tell you?
* The first pair is much closer in meaning than the second pair
- The first pair shares exactly 78 percent of its words
- The second pair contains an error
why: Cosine similarity measures direction in the embedding space, which reflects meaning; it is not a word overlap percentage.
q: Compute the cosine similarity of a = [1, 0] and b = [1, 1].
- 0.50
* 0.71
- 1.00
why: The dot product is 1, the lengths are 1 and the square root of 2, so the result is 1 divided by 1.41, which is 0.71.
q: Chroma returns distances 0.29, 0.52 and 0.59 for three chunks. Which chunk is the best match?
* The one with distance 0.29
- The one with distance 0.59
- They are equal because the collection uses cosine space
why: Cosine distance is 1 minus similarity, so the smallest distance is the closest match.
q: You switch the embedding model from all-MiniLM-L6-v2 to a larger model but keep the old Chroma store. What happens to searches?
- They get better because the new model is larger
- Nothing changes because the store keeps the text
* The results become meaningless because the question vectors live in a different space from the stored vectors
why: Every model defines its own space; vectors from two models cannot be compared, so the index must be rebuilt.
q: Why does Chroma build an HNSW graph instead of comparing the query with every vector?
- To make the vectors shorter
* To find near neighbours among millions of vectors in milliseconds, at the cost of a rare miss
- To store the metadata
why: An exact scan over millions of vectors is too slow for every question; HNSW trades a small chance of a miss for speed.
:::

## Go further

The sentence-transformers documentation lists many embedding models with their size and their quality scores, and the model card for all-MiniLM-L6-v2 explains what the model was trained on. The Chroma query documentation shows filters on metadata, such as only chunks from one file. The HNSW paper explains the layered graph that makes the search fast. The next lesson, [Retrieve, build the prompt, answer with citations](/courses/build-ai-ecosystem/retrieval-rag/retrieve-and-answer), puts the top 3 chunks into a prompt and gets an answer with chunk ids.
`,
    },
    {
      slug: 'retrieve-and-answer',
      title: 'Retrieve, build the prompt, answer with citations',
      summary: 'After this lesson you can retrieve the top k chunks for a question, build a prompt template that holds them with their ids, and get an answer from claude-sonnet-5-5 that cites the chunk ids it used.',
      minutes: 22,
      objectives: [
        'Choose a value of k and explain what changes when k grows or shrinks.',
        'Write a prompt template that holds the chunks, their ids, the rules and the question.',
        'Run rag/ask.py and get an answer that cites chunk ids such as [allergens.txt#0].',
        'Explain what the model should do when no retrieved chunk holds the answer.',
      ],
      keyTerms: ['top-k', 'prompt template', 'citation', 'grounding', 'retrieval', 'hallucination'],
      links: [
        { label: 'Messages API reference (Claude docs)', url: 'https://docs.anthropic.com/en/api/messages', kind: 'docs' },
        { label: 'Citations (Claude docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/citations', kind: 'docs' },
        { label: 'Lost in the middle: how language models use long contexts', url: 'https://arxiv.org/abs/2307.03172', kind: 'paper' },
        { label: 'Anthropic Python SDK', url: 'https://github.com/anthropics/anthropic-sdk-python', kind: 'repo' },
      ],
      body: `
## What this lesson covers

This lesson builds the query phase of the pipeline. Your code embeds the question, asks Chroma for the top k chunks, puts them in a prompt with their ids and sends the prompt to the model. The model answers from the chunks and cites the ids. You write rag/ask.py in your aiworkshop repository. At the end you can ask any question about the bakery and get an answer you can trace to a chunk.

## Why it matters

This is the moment the pieces become a product. A user types a question and gets an answer that points at the source. The citation is not decoration. It lets a person check the answer, it lets your evaluation script check it automatically, and it tells you which chunk to fix when the answer is wrong. Without citations a RAG system is a model that sounds sure. With citations it is a system you can audit. The next lesson, [Evaluating RAG](/courses/build-ai-ecosystem/retrieval-rag/evaluate-rag), uses the ids from this lesson to measure the whole pipeline.

## The idea with an example

> **Analogy.** A clerk answers letters for a company. For each letter, an assistant pulls the three most relevant pages from the archive, clips a label with the page number to each one and puts them on the desk with a rule: answer from these pages only, and write the page number next to every fact. If none of the pages answers the letter, the clerk writes "we have no record" instead of guessing. The three pages are the top k chunks. The labels are the chunk ids. The rule is the prompt template. The page numbers in the reply are citations.

Take the question from the first lesson: "Is the rye loaf gluten free?" The search from the last lesson returns 3 chunks: allergens.txt#0 at distance 0.29, menu.txt#0 at 0.52 and allergens.txt#1 at 0.59. The number of chunks you keep is called top k, and here k is 3. The prompt builder writes each chunk on its own paragraph with the id in square brackets in front, then the question. The system prompt holds the rules. Press Next to see the prompt grow.

:::scenario
title: Building the prompt for one question
state: question=Is the rye loaf gluten free?, k=3, prompt=empty
step: Embed the question and query Chroma. The store returns 3 ids with their texts and distances.
state: context=[allergens.txt#0] Sunrise Bakery allergen list. The sourdough loaf contains wheat. The rye loaf contains rye and wheat...
step: Write the first chunk into the context with its id in square brackets.
state: context=3 chunks, about 130 tokens
step: Add the other two chunks the same way, separated by blank lines. The order is the order of the search: best match first.
state: prompt=Context: ... Question: Is the rye loaf gluten free?
step: Put the context under the heading Context and the question under the heading Question. This is the user message.
state: system=answer only from the context, cite ids, say when the answer is missing
step: The system prompt carries the three rules. It never changes between questions, so the model treats it as the standing instruction.
state: answer=No. The rye loaf contains rye and wheat, so it is not gluten free [allergens.txt#0].
step: Send the system prompt and the user message to claude-sonnet-5-5. The answer quotes the fact and cites the chunk that holds it.
:::

The model ignored the two chunks that did not help. That is normal and fine. Retrieval over-fetches on purpose: it is cheap to include 3 chunks and expensive to miss the one that matters.

:::flow
title: The query phase
Question -> Embedding model: text to vector
Embedding model -> Chroma: query vector
Chroma -> Prompt builder: top 3 chunks with ids
Prompt builder -> Claude API: system rules plus context plus question
Claude API -> User: answer with [chunk ids]
:::

## How it works

The query phase has five steps, and rag/ask.py holds one function per step:

1. Retrieve. Embed the question and query Chroma for k chunks. Reuse the search function from the last lesson.
2. Format. Turn each chunk into one line that starts with its id in square brackets.
3. Build. Combine the context and the question into the user message with a prompt template. A prompt template is a fixed text with slots that your code fills in.
4. Call. Send the system prompt and the user message to the model with the Anthropic SDK.
5. Return. Collect the text blocks of the reply.

| Part of the prompt | Where it goes | Changes per question | Example |
| --- | --- | --- | --- |
| Role and task | system prompt | no | You answer questions about Sunrise Bakery. |
| Rules | system prompt | no | Use only the context. Cite ids. Say when the answer is missing. |
| Citation format | system prompt | no | [allergens.txt#0] |
| Context | user message | yes | 3 chunks, each with its id |
| Question | user message | yes | Is the rye loaf gluten free? |

Keep the parts that never change in the system prompt. Keep the parts that change in the user message. This split is also what makes prompt caching work later, because the model can reuse the fixed prefix across requests.

:::code
lang: python
file: rag/ask.py
import anthropic
from rag.search import search

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"

SYSTEM = """You answer questions about Sunrise Bakery.
Use only the context chunks in the user message. Each chunk starts with its id in square brackets.
After every fact you state, cite the id of the chunk it comes from, like this: [menu.txt#0].
If the context does not contain the answer, reply exactly: I cannot find this in the documents."""

def format_context(chunks: list[tuple[str, str, float]]) -> str:
    return "\\n\\n".join(f"[{chunk_id}] {text}" for chunk_id, text, _distance in chunks)

def build_prompt(question: str, chunks: list[tuple[str, str, float]]) -> str:
    return f"Context:\\n{format_context(chunks)}\\n\\nQuestion: {question}"

def ask(question: str, k: int = 3) -> tuple[str, list[str]]:
    chunks = search(question, k)
    prompt = build_prompt(question, chunks)
    reply = client.messages.create(model=MODEL, max_tokens=1024, system=SYSTEM,
                                   messages=[{"role": "user", "content": prompt}])
    answer = "".join(block.text for block in reply.content if block.type == "text")
    return answer, [chunk_id for chunk_id, _text, _distance in chunks]

if __name__ == "__main__":
    import sys
    question = " ".join(sys.argv[1:]) or "Is the rye loaf gluten free?"
    answer, used = ask(question)
    print("retrieved:", used)
    print("answer:", answer)
:::

:::code
lang: bash
python -m rag.ask "Is the rye loaf gluten free?"
python -m rag.ask "Can I buy a cinnamon roll at 3 pm on a Saturday?"
python -m rag.ask "Do you deliver?"
:::

:::code
lang: text
retrieved: ['allergens.txt#0', 'menu.txt#0', 'allergens.txt#1']
answer: No. The rye loaf contains rye and wheat, so it is not gluten free [allergens.txt#0].
retrieved: ['opening_hours.txt#0', 'menu.txt#0', 'opening_hours.txt#1']
answer: No. The bakery closes at 2 pm on Saturday [opening_hours.txt#0]. Cinnamon rolls are on the menu at 3.00 [menu.txt#0], but at 3 pm the shop is closed.
retrieved: ['opening_hours.txt#1', 'menu.txt#0', 'opening_hours.txt#0']
answer: I cannot find this in the documents.
:::

The second question shows why k is larger than 1. The answer needs the Saturday hours and the menu, and both chunks sit in the top 3. The third question shows the missing-answer rule. The store always returns k chunks, even for a question about delivery that no document covers, because a nearest neighbour always exists. The model must notice that none of the chunks help, and the exact reply makes that case easy to detect in code.

The ask function returns the retrieved ids together with the answer. The evaluation lesson needs both: the ids to check retrieval, the answer to check the final result. Returning them separately costs nothing now and saves a rewrite later.

Choosing k is a trade-off. A larger k raises the chance that the right chunk is in the prompt, but it also adds tokens and gives the model more text to be distracted by. The Lost in the middle paper in the links found that models use facts at the start and end of a long context better than facts in the middle. Keep k small, put the best match first, and raise k only when the evaluation shows misses.

| k | Tokens of context with 40-word chunks | Chance the right chunk is present | When to use |
| --- | --- | --- | --- |
| 1 | about 55 | lowest | never for real questions |
| 3 | about 160 | good for a small store | this module |
| 5 | about 270 | better for stores with thousands of chunks | most production systems start here |
| 10 | about 540 | highest, with more distraction | with a reranker that sorts the 10 first |

Two refinements are worth knowing. First, a distance threshold: if the best distance is above, say, 0.7, skip the model call and return the missing-answer reply at once. That saves a request and removes one chance of hallucination. Second, the Claude API has a built-in citations feature that marks which part of a document each sentence came from, listed in the links. The square-bracket convention in this lesson does the same job with less machinery, and it works with any model.

A word on the create call itself. The model argument names the model, here claude-sonnet-5-5. The max_tokens argument caps the length of the reply; 1024 tokens is about 750 words, which is plenty for an answer with citations. The system argument carries the rules, and messages carries the one user message built from the template. The reply holds a list of content blocks, and your code joins the text blocks. Each request is complete on its own, so the retrieved chunks must be sent every time; the API keeps nothing from the last question.

The cost of one question is small and worth computing once. The system prompt is about 90 tokens, the context about 160 and the question about 10, so the input is about 260 tokens. The answer is about 30 tokens. At 2 dollars per 1,000,000 input tokens and 10 dollars per 1,000,000 output tokens, one question costs about 0.0008 dollars, and 1,000 questions cost 0.82 dollars. Compare that with the 260 dollars from the first lesson for pasting a whole manual.

## Try it

:::exercise
title: Add a distance threshold and test it
task: Change ask so that it returns the missing-answer reply without calling the model when the best distance is greater than 0.7. Test it with "Do you deliver?" and with "What does the sourdough loaf cost?". Print whether the model was called.
hint: The search result is a list of tuples (id, text, distance), sorted by distance. The first tuple holds the best distance. Compare it with the threshold before build_prompt.
lang: python
solution:
def ask(question: str, k: int = 3, threshold: float = 0.7) -> tuple[str, list[str]]:
    chunks = search(question, k)
    ids = [chunk_id for chunk_id, _text, _distance in chunks]
    best = chunks[0][2]
    if best > threshold:
        print("model not called, best distance", round(best, 2))
        return "I cannot find this in the documents.", ids
    print("model called, best distance", round(best, 2))
    prompt = build_prompt(question, chunks)
    reply = client.messages.create(model=MODEL, max_tokens=1024, system=SYSTEM,
                                   messages=[{"role": "user", "content": prompt}])
    answer = "".join(block.text for block in reply.content if block.type == "text")
    return answer, ids

# "Do you deliver?" should skip the model; the sourdough price should call it
# and answer 4.50 [menu.txt#0]. If the delivery question still calls the model,
# lower the threshold a little and check the distances it prints.
:::

## Common mistakes

- Mistake: put the chunks in the prompt without their ids. Fix: write the id in square brackets at the start of every chunk, or the model has nothing to cite.
- Mistake: write the rules in the user message and change them from question to question. Fix: keep the rules in the system prompt so they are stable and cacheable.
- Mistake: assume a question without an answer returns no chunks. Fix: the store always returns k chunks; the system prompt and a distance threshold handle the missing case.
- Mistake: set k to 1 to save tokens. Fix: use 3 to 5, because many questions need two chunks and the best match is not always first.
- Mistake: trust a citation without reading the chunk. Fix: print the retrieved ids with the answer and spot-check them, and automate the check in the next lesson.

## Check your understanding

:::quiz
title: Check: retrieve and answer
q: Which part of the prompt should stay the same for every question?
- The context chunks
- The question
* The rules about using only the context and citing ids
why: Fixed rules belong in the system prompt, where they stay stable and can be cached; the context and question change each time.
q: A question needs facts from two files. With k set to 1, what most likely happens?
* The model gets one chunk and answers only half of the question or says the answer is missing
- Chroma merges the two files into one chunk
- The model fetches the second file on its own
why: The model sees only the chunks your code puts in the prompt, and k set to 1 provides one chunk.
q: Why does the search return 3 chunks for "Do you deliver?" when no document mentions delivery?
- The embedding model misunderstood the question
* A nearest neighbour always exists, so the store returns the k least-far chunks
- Chroma pads the result with random chunks
why: Similarity search ranks the stored vectors by distance and returns the best k, whatever the distances are.
q: The answer says "The rye loaf costs 5.00 [allergens.txt#0]". You open allergens.txt#0 and it holds no prices. What went wrong?
- The retrieval missed the menu chunk
* The model cited the wrong chunk, which the citation lets you catch
- The chunk size was too large
why: The citation is exactly what makes this error visible; the fix is a stronger rule in the system prompt or a better model.
q: You raise k from 3 to 20. Which effect is most likely?
- The cost per question falls
* The right chunk is more often present, but the model is more often distracted by unrelated text
- The citations become more accurate
why: More chunks raise the chance of including the right one and add tokens and noise, which the Lost in the middle paper measured.
:::

## Go further

The Messages API reference lists every field of the create call, including the system prompt and max_tokens. The citations documentation shows the built-in alternative to square-bracket ids. The Lost in the middle paper explains why the order of the chunks matters. The next lesson, [Evaluating RAG](/courses/build-ai-ecosystem/retrieval-rag/evaluate-rag), writes a test set of questions, measures how often the right chunk is retrieved, and grades the answers with a model.
`,
    },
    {
      slug: 'evaluate-rag',
      title: 'Evaluating RAG',
      summary: 'After this lesson you can build a test set of questions with expected chunk ids, measure retrieval hit rate, grade answers with a model as judge, and improve the score with hybrid search and reranking.',
      minutes: 25,
      objectives: [
        'Write a test set of 8 questions, each with the chunk id that holds the answer.',
        'Compute the hit rate of retrieval at k equal to 3.',
        'Run a model as a judge that grades each answer against a reference answer.',
        'Explain how hybrid search and reranking raise the hit rate, and run both.',
      ],
      keyTerms: ['test set', 'hit rate', 'LLM judge', 'hybrid search', 'BM25', 'reciprocal rank fusion', 'reranking'],
      links: [
        { label: 'Okapi BM25 (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Okapi_BM25', kind: 'article' },
        { label: 'rank_bm25 library', url: 'https://github.com/dorianbrown/rank_bm25', kind: 'repo' },
        { label: 'Reciprocal rank fusion outperforms Condorcet and individual rank learning methods', url: 'https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf', kind: 'paper' },
        { label: 'Pretrained cross-encoders for reranking (sentence-transformers)', url: 'https://www.sbert.net/docs/cross_encoder/pretrained_models.html', kind: 'docs' },
        { label: 'Ragas: evaluation for RAG pipelines', url: 'https://docs.ragas.io/', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson measures the pipeline you built. You write a test set, a list of questions with the chunk that holds each answer. You compute the hit rate, the share of questions where retrieval returned the right chunk. You grade the final answers with a model as judge. Then you improve the retrieval with hybrid search and reranking and measure again. You add rag/tests.json and rag/eval.py to your aiworkshop repository.

## Why it matters

A RAG system that works on three questions you tried by hand can fail on the fourth. Without a measurement you cannot tell whether a change to the chunk size, the model or the prompt made things better or worse. The test set turns opinions into numbers. It is also the habit that separates a demo from a product, and the observability lesson in the ship-it module builds on the same idea. This is the last lesson of the module. The next module, [Agents and tools](/courses/build-ai-ecosystem/agents-and-tools/tool-calling), gives the model tools, and one of the tools it can call is the search you built here.

## The idea with an example

> **Analogy.** A driving school does not judge a student by one lesson. It keeps a fixed list of manoeuvres: parallel park, hill start, emergency stop. The student does all of them, and the instructor ticks pass or fail on each. Next week, after a change in how the school teaches, the same list shows whether the change helped. The list is the test set. The share of ticks is the score. The fixed list is what makes two weeks comparable.

For the bakery, the test set has 8 questions. For each, you write the id of the chunk that holds the answer and a short reference answer. Three of the questions are shown here; the file in the How it works section holds all 8.

| Question | Expected chunk | Reference answer |
| --- | --- | --- |
| Is the rye loaf gluten free? | allergens.txt#0 | No, it contains rye and wheat. |
| What time does the last batch of bread come out? | opening_hours.txt#1 | 11 am. |
| How much is a slice of carrot cake? | menu.txt#0 | 4.00. |

The hit rate at k is the share of questions where the expected chunk appears in the top k results. Run the search for all 8 questions with k equal to 3. Suppose 6 of them include the expected chunk. The hit rate is 6 divided by 8, which is 0.75. The two misses are the interesting part. Press Next to see what happens on each question.

:::scenario
title: Measuring hit rate on 3 of the 8 test questions
state: hits=0, asked=0, k=3
step: Ask "Is the rye loaf gluten free?". The top 3 ids are allergens.txt#0, menu.txt#0, allergens.txt#1. The expected id allergens.txt#0 is present.
state: hits=1, asked=1
step: Count a hit. The expected chunk was first, but a hit only needs it to be anywhere in the top 3.
state: top 3=opening_hours.txt#0, menu.txt#0, allergens.txt#1
step: Ask "What time does the last batch of bread come out?". The expected id is opening_hours.txt#1, the 14-word chunk. It is missing: the longer chunk about hours won the dense search.
state: hits=1, asked=2
step: Count a miss. Write the question and the returned ids into a misses list, so you can read them later.
state: top 3=menu.txt#0, allergens.txt#1, allergens.txt#0
step: Ask "How much is a slice of carrot cake?". The expected id menu.txt#0 is first.
state: hits=2, asked=3, hit rate=0.67
step: Count a hit. After 3 questions the hit rate is 2 divided by 3, which is 0.67. After all 8 it is 6 divided by 8, which is 0.75.
:::

The miss on the last-batch question is a classic one. The question shares the exact words "last batch" with the small chunk, but the embedding of the small chunk is weak because it is short and starts mid-sentence. A keyword search would have found it at once. That is the case for hybrid search, which comes later in this lesson.

:::flow
title: The evaluation loop
tests.json -> Retriever: 8 questions
Retriever -> Hit rate: top 3 ids per question
Retriever -> rag/ask.py: chunks for the prompt
rag/ask.py -> Judge model: answer plus reference answer
Judge model -> Report: PASS or FAIL per question
:::

## How it works

Evaluation has two layers, because the pipeline has two parts that can fail:

1. Retrieval evaluation. For each test question, run the search and check whether the expected chunk id is in the top k. This needs no model call and runs in a second.
2. Answer evaluation. For each test question, run the full ask function and compare the answer with the reference. A model reads both and returns PASS or FAIL. This is an LLM judge: a model that grades another model's output against a rubric.

Start with the test set. Write it by hand; 8 questions are enough to begin, and 30 to 50 are typical for a real project. Cover every file, include at least one question that needs two chunks, and include one question with no answer in the documents.

:::code
lang: json
file: rag/tests.json
[
  {"q": "Is the rye loaf gluten free?", "chunk": "allergens.txt#0", "ref": "No, it contains rye and wheat."},
  {"q": "What time does the last batch of bread come out?", "chunk": "opening_hours.txt#1", "ref": "11 am."},
  {"q": "How much is a slice of carrot cake?", "chunk": "menu.txt#0", "ref": "4.00."},
  {"q": "Is the bakery open on Sunday?", "chunk": "opening_hours.txt#0", "ref": "No, it is closed on Sunday."},
  {"q": "Which products contain nuts?", "chunk": "allergens.txt#1", "ref": "The almond croissant and the carrot cake, and traces can be in any product."},
  {"q": "When does the bakery open on a public holiday?", "chunk": "opening_hours.txt#0", "ref": "9 am."},
  {"q": "Does the cinnamon roll contain milk?", "chunk": "allergens.txt#0", "ref": "Yes."},
  {"q": "Do you deliver?", "chunk": "", "ref": "I cannot find this in the documents."}
]
:::

The last entry has an empty chunk field. For that question the retrieval check is skipped and only the answer is graded: the correct behaviour is the missing-answer reply.

:::code
lang: python
file: rag/eval.py
import json
from pathlib import Path
import anthropic
from rag.search import search
from rag.ask import ask

client = anthropic.Anthropic()
JUDGE = "claude-sonnet-5-5"
TESTS = json.loads((Path(__file__).parent / "tests.json").read_text(encoding="utf-8"))

def hit_rate(k: int = 3) -> float:
    scored = [t for t in TESTS if t["chunk"]]
    hits = 0
    for t in scored:
        ids = [chunk_id for chunk_id, _text, _distance in search(t["q"], k)]
        if t["chunk"] in ids:
            hits += 1
        else:
            print("MISS", t["q"], "->", ids)
    return hits / len(scored)

def judge(question: str, answer: str, reference: str) -> str:
    prompt = (f"Question: {question}\\nReference answer: {reference}\\nCandidate answer: {answer}\\n\\n"
              "Does the candidate state the same facts as the reference, with no extra false claims? "
              "Ignore citations in square brackets and differences in wording. Reply with one word: PASS or FAIL.")
    reply = client.messages.create(model=JUDGE, max_tokens=5,
                                   messages=[{"role": "user", "content": prompt}])
    return "".join(b.text for b in reply.content if b.type == "text").strip()

if __name__ == "__main__":
    print(f"hit rate at 3: {hit_rate(3):.2f}")
    passed = 0
    for t in TESTS:
        answer, _ids = ask(t["q"])
        verdict = judge(t["q"], answer, t["ref"])
        passed += verdict == "PASS"
        print(verdict, "|", t["q"], "|", answer[:70])
    print(f"answers passed: {passed}/{len(TESTS)}")
:::

:::code
lang: text
MISS What time does the last batch of bread come out? -> ['opening_hours.txt#0', 'menu.txt#0', 'allergens.txt#1']
MISS Which products contain nuts? -> ['allergens.txt#0', 'menu.txt#0', 'opening_hours.txt#0']
hit rate at 3: 0.71
PASS | Is the rye loaf gluten free? | No. The rye loaf contains rye and wheat, so it is not gluten free [a
FAIL | What time does the last batch of bread come out? | I cannot find this in the documents.
...
answers passed: 6/8
:::

The judge prompt has three parts that matter. It gives the reference, so the model compares rather than decides on its own. It says what to ignore, the citations and the wording, so a correct answer in different words passes. It asks for one word, so your code can compare the string. The judge is a model, so it makes mistakes too. Spot-check a few of its verdicts by hand the first time, and keep the rubric strict about extra false claims, because those are the hallucinations you most want to catch.

Here 7 questions have an expected chunk, 5 hit, so the hit rate is 5 divided by 7, which is 0.71. The two misses point at two different causes. The last-batch question needs an exact phrase that lives in a short chunk. The nuts question uses the word "nuts" while the chunk says "almonds" and "walnuts"; the dense search found the chunk about allergens in general instead.

Hybrid search fixes the first kind of miss. It runs two searches and merges them. The dense search is the embedding search you have. The sparse search is a keyword search named BM25, which scores a chunk by how often the query words appear in it and how rare those words are across all chunks. BM25 finds "last batch" at once. Install it with pip install rank_bm25. Then merge the two ranked lists with reciprocal rank fusion (RRF): each chunk gets 1 divided by 60 plus its rank in each list, and the sums are sorted. The constant 60 stops the top rank from dominating. A chunk that is first in one list and absent from the other scores 1 divided by 61, about 0.0164. A chunk that is third in both lists scores 2 divided by 63, about 0.0317, and wins.

:::code
lang: python
file: rag/hybrid.py
from rank_bm25 import BM25Okapi
from rag.search import search, collection

ALL = collection.get(include=["documents"])
IDS, DOCS = ALL["ids"], ALL["documents"]
BM25 = BM25Okapi([doc.lower().split() for doc in DOCS])

def bm25_search(question: str, k: int = 3) -> list[str]:
    scores = BM25.get_scores(question.lower().split())
    order = sorted(range(len(IDS)), key=lambda i: scores[i], reverse=True)
    return [IDS[i] for i in order[:k]]

def hybrid_search(question: str, k: int = 3, c: int = 60) -> list[str]:
    dense = [chunk_id for chunk_id, _text, _distance in search(question, k)]
    sparse = bm25_search(question, k)
    fused: dict[str, float] = {}
    for ranked in (dense, sparse):
        for rank, chunk_id in enumerate(ranked, 1):
            fused[chunk_id] = fused.get(chunk_id, 0.0) + 1.0 / (c + rank)
    return sorted(fused, key=fused.get, reverse=True)[:k]

if __name__ == "__main__":
    print(hybrid_search("What time does the last batch of bread come out?"))
:::

:::code
lang: text
['opening_hours.txt#1', 'opening_hours.txt#0', 'menu.txt#0']
:::

Reranking fixes the second kind of miss. A reranker is a second model that reads the question and one chunk together and outputs a relevance score. It is slower than an embedding comparison, because it runs once per chunk, but it is much more accurate, because it sees both texts at the same time. So you retrieve a larger list, say the top 10 from hybrid search, and let the reranker sort them, then keep the top 3. The cross-encoder ms-marco-MiniLM-L-6-v2 from sentence-transformers is a small, free reranker.

:::code
lang: python
file: rag/rerank.py
from sentence_transformers import CrossEncoder
from rag.hybrid import hybrid_search, IDS, DOCS

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
TEXT = dict(zip(IDS, DOCS))

def rerank(question: str, k: int = 3, candidates: int = 10) -> list[str]:
    ids = hybrid_search(question, candidates)
    scores = reranker.predict([(question, TEXT[i]) for i in ids])
    order = sorted(range(len(ids)), key=lambda i: scores[i], reverse=True)
    return [ids[i] for i in order[:k]]

if __name__ == "__main__":
    print(rerank("Which products contain nuts?"))
:::

Now plug each retriever into hit_rate and compare. Change the search call inside hit_rate to the function you want to test, and run the three variants on the same tests.json.

:::bars
title: Hit rate at 3 on the 7 scored bakery questions
unit: hit rate
Dense only: 0.71
BM25 only: 0.57
Hybrid (RRF): 0.86
Hybrid plus reranker: 1.00
:::

BM25 alone scores lower than dense, because it misses the gluten question, which shares few words with its chunk. The fusion of both is better than either. The reranker fixes the remaining miss. On a real document set with 30 or more questions, the same pattern holds, though the numbers are rarely this clean. The point of the test set is that you now know, instead of hoping.

| Measurement | What it checks | Needs a model call | Typical first result | Common fix |
| --- | --- | --- | --- | --- |
| Hit rate at k | the expected chunk is in the top k | no | 0.6 to 0.8 | hybrid search, smaller chunks, context lines |
| Answer pass rate | the answer states the reference facts | yes, one judge call per question | 0.7 to 0.9 | better prompt rules, reranking, larger k |
| Missing-answer rate | the model refuses when no chunk helps | yes | often too low | distance threshold, stronger system rule |
| Citation accuracy | the cited chunk holds the fact | yes, or a human check | 0.8 to 0.95 | ids in every chunk, judge rubric |

## Try it

:::exercise
title: Add questions and find a miss
task: Add 4 questions of your own to rag/tests.json, one per file plus one that needs two chunks. Run rag/eval.py. If every question hits, lower k to 1 and run again. Write down which question misses first and why, then check whether hybrid_search recovers it.
hint: A question that needs two chunks, such as "Can I buy a rye loaf on Sunday morning?", has two possible expected chunks; pick the one the reference answer depends on most, here opening_hours.txt#0. To test hybrid search, replace search with hybrid_search inside hit_rate.
lang: python
solution:
# add to rag/tests.json:
# {"q": "What does a sourdough loaf cost?", "chunk": "menu.txt#0", "ref": "4.50."},
# {"q": "When is the bakery open on Saturday?", "chunk": "opening_hours.txt#0", "ref": "8 am to 2 pm."},
# {"q": "Does the almond croissant contain egg?", "chunk": "allergens.txt#1", "ref": "Yes."},
# {"q": "Can I buy a rye loaf on Sunday morning?", "chunk": "opening_hours.txt#0", "ref": "No, the bakery is closed on Sunday."}

from rag.hybrid import hybrid_search

def hit_rate_with(retriever, k: int = 3) -> float:
    scored = [t for t in TESTS if t["chunk"]]
    hits = sum(t["chunk"] in retriever(t["q"], k) for t in scored)
    return hits / len(scored)

dense = lambda q, k: [i for i, _t, _d in search(q, k)]
print("dense k=1:", hit_rate_with(dense, 1))
print("hybrid k=1:", hit_rate_with(hybrid_search, 1))
# Questions whose chunk is short or shares exact words with the question
# tend to miss with dense search at k=1 and recover with hybrid search.
:::

## Common mistakes

- Mistake: test the pipeline on the same three questions you used while building it. Fix: write a test set that covers every file and includes a question with no answer.
- Mistake: measure only the final answer. Fix: measure the hit rate first, because a wrong answer with the right chunk and a wrong answer with the wrong chunk need different fixes.
- Mistake: let the judge decide without a reference answer. Fix: give the reference and a rubric, and ask for a single word.
- Mistake: change two things at once, such as chunk size and k, and rerun. Fix: change one thing, run the same test set, record the number, then change the next.
- Mistake: merge dense and BM25 results by adding their raw scores. Fix: use reciprocal rank fusion, because the two scores live on different scales.

## Check your understanding

:::quiz
title: Check: evaluating RAG
q: 7 test questions have an expected chunk, and the expected chunk is in the top 3 for 5 of them. What is the hit rate at 3?
- 0.50
* 0.71
- 0.83
why: 5 divided by 7 is 0.71.
q: The hit rate is 1.00 but the answer pass rate is 0.60. Where is the problem most likely?
- The chunk size
- The embedding model
* The prompt or the model that writes the answer, because the right chunk reaches the prompt every time
why: Retrieval delivered the right chunk, so the failures happen after retrieval, in the answer step.
q: A question contains the exact phrase "last batch" and the dense search misses the chunk that holds it. Which change targets this miss directly?
* Add BM25 keyword search and fuse the lists with reciprocal rank fusion
- Raise the temperature of the answer model
- Make the judge rubric stricter
why: BM25 scores exact word matches, which is what the dense search undervalued here.
q: In reciprocal rank fusion with the constant 60, a chunk ranks 1st in one list and is absent from the other. Another chunk ranks 2nd in both lists. Which scores higher?
- The first chunk, because a 1st place beats everything
* The second chunk, because 2 divided by 62 is larger than 1 divided by 61
- They tie
why: 1 divided by 61 is about 0.0164 while 2 divided by 62 is about 0.0323, so appearing in both lists wins.
q: Why does a reranker run after retrieval rather than instead of it?
- Because rerankers cannot read questions
* Because it scores one chunk at a time and is too slow to run over every chunk in the store
- Because Chroma requires it
why: A cross-encoder reads the question and chunk together, which is accurate but costs one model pass per chunk, so it sorts a short candidate list.
q: Which test question checks the missing-answer behaviour?
- Is the rye loaf gluten free?
- Which products contain nuts?
* Do you deliver?
why: No document mentions delivery, so the correct answer is the exact missing-answer reply, and the judge checks for it.
:::

## Go further

The Wikipedia article on BM25 gives the formula and the history of keyword ranking. The reciprocal rank fusion paper is 2 pages long and shows why rank fusion beats score fusion. The sentence-transformers cross-encoder page lists rerankers by size and accuracy. Ragas is a library that automates several of the measurements in this lesson at scale. You have now built the retrieval part of the ecosystem. The next module, [Agents and tools](/courses/build-ai-ecosystem/agents-and-tools/tool-calling), gives the model tools, and the search you built becomes one of them.
`,
    },
  ],
}
