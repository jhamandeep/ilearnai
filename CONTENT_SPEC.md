# ilearnai content specification

This is the single reference for anyone (human or agent) who writes lessons for the site. Read all of it before you write a lesson. The scripts enforce most of it; the rest is reviewed.

## 1. Goal and audience

The site takes a person with **no coding and no AI background** to someone who can **build a complete AI system**: a trained model, a retrieval system over their own documents, an agent with tools, and a deployed service. Content is organised in four levels:

| Level | Slug | Who it is for |
| --- | --- | --- |
| Level 0 | `foundations` | Never written code, never studied AI. Nothing is assumed, not even what a file is. |
| Level 1 | `beginner` | Can run a Python file. Knows what a model is. Builds first AI programs. |
| Level 2 | `intermediate` | Has built a small AI program. Wants to understand how parts work inside. |
| Level 3 | `advanced` | Reads papers and runs experiments. |

A Level 0 or Level 1 lesson must make sense to a reader who has **never seen the subject before**. Every new word is defined in the sentence where it first appears. Every abstract idea gets a concrete, everyday analogy first and a worked example with real numbers second. Never say "as you know". Never skip a step because it "is obvious".

## 2. Writing standard (ASD-STE100 Simplified Technical English)

The checker (`src/lib/ste.ts`, `/labs/ste-checker`) enforces the machine-checkable rules.

- Sentences of at most **20 words** in instructions and **25 words** in descriptions. Split long sentences.
- **Active voice**. Say who does the action. "The model reads the tokens", not "the tokens are read".
- **Present tense**. "The loop runs ten times."
- **One term per concept**, and the same term every time. Do not switch between "model", "network" and "net" for one thing.
- **Spell out an abbreviation on first use**: "central processing unit (CPU)". Then use the abbreviation.
- Paragraphs of at most **6 sentences**. One topic per paragraph.
- Avoid rhetorical questions in descriptive text. Headings and quizzes may use questions.
- Avoid idioms, jokes that need culture, and vague words like "basically", "simply", "just".
- Use "you" for the reader. Give instructions as commands: "Open the terminal. Type python."
- Numbers: use digits. Give units. Prefer small concrete numbers you then compute with.
- British or American spelling is fine, but be consistent inside one lesson.

## 3. Lesson anatomy (every lesson, every level)

Each lesson is one object in a module file (see section 6). The body is Markdown. **Every lesson has these sections, in this order, with these exact headings:**

```
## What this lesson covers
## Why it matters
## The idea with an example
## How it works
## Try it
## Common mistakes
## Check your understanding
## Go further
```

Rules per section:

1. **What this lesson covers.** 2 to 4 sentences. Name the one thing the reader learns and what they will be able to do.
2. **Why it matters.** Connect it to the end goal (building an AI system) and to the next lesson. Include a `:::video` block here or in the next section when a matching video exists in the bank (section 7).
3. **The idea with an example.** Start with an **everyday analogy** (one short paragraph, a `>` blockquote beginning with `**Analogy.**`). Then one **worked example with concrete numbers or concrete text**, carried through every step. Include at least one `:::flow`, `:::arch`, `:::timeline`, `:::matrix` or `:::graph` diagram and one `:::scenario` step player that walks the example. Any lesson that has a function, a line, a loss curve or a distribution draws it with `:::graph`.
4. **How it works.** The general mechanism. Use numbered steps. Include a table. Include code (`:::code`) whenever code exists for the topic. Mathematics uses `$...$` inline and `$$...$$` display, but at Level 0 and 1 each formula is **also written out in words** in the sentence that follows.
5. **Try it.** At least one `:::exercise` block with a task, a hint and a solution. Level 0 to 1: an exercise the reader can do in under ten minutes on their own computer or on paper.
6. **Common mistakes.** 3 to 5 bullets in the form "Mistake: … Fix: …".
7. **Check your understanding.** Exactly one `:::quiz` block with **4 to 6 questions**, each with 3 or 4 options, one correct, and a one-sentence `why:`. Questions test understanding, not memory of a word. Wrong options are plausible, not silly.
8. **Go further.** 2 to 4 sentences pointing to the lesson `links` and to the next lesson.

Target length: **1,400 to 2,200 words** of prose per lesson, not counting blocks. A Level 0 lesson is at the long end because it explains more.

Every lesson has: `objectives` (3 to 5, each starts with a verb: Explain, Compute, Write, Run, Choose), `keyTerms` (4 to 8 terms; each term must exist in the glossary, see section 8), `links` (2 to 5 free resources: real URLs only, prefer official docs, arXiv, Wikipedia, 3Blue1Brown, StatQuest, freeCodeCamp, Python docs, Hugging Face docs), `minutes` (realistic: words / 180 plus time for blocks, typically 12 to 25).

## 4. Visual and interactive blocks

Lesson bodies embed blocks with `:::kind` ... `:::` containers. **Never use backticks anywhere in a lesson body** (bodies are template literals; backticks break them). Blocks are converted to fenced code at render time. Inside a block do not use Markdown, `$` math, `**`, or backticks. Each block opens on its own line as `:::kind` and closes on its own line as `:::`.

### flow: boxes and arrows with a travelling packet

```
:::flow
title: How a request reaches a web server
Browser -> Router: sends the request
Router -> Internet: forwards it
Internet -> Server: delivers it
Server -> Browser: returns the page
:::
```
At least 3 edges. Node names at most 20 characters.

### arch: layered architecture with an animated request path

```
:::arch
title: A chat app with retrieval
layer: Users | Browser, Mobile app
layer: Service | API server, Prompt builder
layer: Models | LLM API
layer: Data | Vector database, Postgres
flow: Browser -> API server -> Vector database -> API server -> LLM API -> API server -> Browser
note: Vector database = finds the 5 most similar chunks
:::
```
2 to 5 layers, each `layer: Name | box, box, box`. `flow:` lists box names in the order a request visits them. Box names at most 21 characters and must match exactly. Use `arch` whenever you show how parts of a system fit together.

### scenario: step player with a live state panel

```
:::scenario
title: One loop iteration
state: i=0, total=0
step: Set i to 0 and total to 0.
step: Add i to total.
state: total=0
step: Increase i by 1.
state: i=1
step: Check if i is less than 3. It is, so repeat.
:::
```
At least 3 `step:` lines. `state:` lines set variables shown in the panel after the step above them; a `state:` before the first step is the initial state.

### timeline: lanes with work bars and messages over time

```
:::timeline
title: Request timing
unit: ms
lane Client
lane Server
lane Database
Client -> Server: request @0
Server: parse @0-2
Server -> Database: query @2
Database: read @2-8
Database -> Server: rows @8
Server -> Client: response @10
:::
```
Every bar and message line ends with `@start` or `@start-end` (numbers in the unit given by `unit:`). A line without `@` is ignored. `lane Name` lines fix the lane order; lanes named only in messages are added automatically.

### bars: animated comparison

```
:::bars
title: Time to read 1 GB
unit: seconds
RAM: 0.1
SSD: 2
Hard disk: 10
Internet: 80
:::
```

### matrix: heat-map grid

```
:::matrix
title: Similarity between four words
cols: cat, dog, car, bus
cat: 1.0, 0.8, 0.1, 0.1
dog: 0.8, 1.0, 0.1, 0.1
car: 0.1, 0.1, 1.0, 0.7
bus: 0.1, 0.1, 0.7, 1.0
:::
```

### code: code with a copy button (indentation preserved)

```
:::code
lang: python
file: hello.py
name = "Ada"
for i in range(3):
    print("Hello,", name)
:::
```
`lang:` is required (python, bash, json, text, yaml, dockerfile, javascript, html, sql). `file:` optional. Use `lang: text` for program output. **Inside code: no backticks, no `${`.** Write a backslash as two backslashes (`\\n` in the source gives `\n` in the rendered code). Keep each snippet under 40 lines and runnable as shown. Show the expected output in a second `lang: text` block when it helps.

### exercise: task, hint and hidden solution

```
:::exercise
title: Count the vowels
task: Write a function count_vowels(text) that returns how many of a, e, i, o, u appear in text. Test it on the word "banana". The answer is 3.
hint: Loop over each character. Check if it is in the string "aeiou".
lang: python
solution:
def count_vowels(text):
    count = 0
    for ch in text:
        if ch in "aeiou":
            count = count + 1
    return count

print(count_vowels("banana"))
:::
```
`task:` and `hint:` may run over several lines. Everything after the `solution:` line is code (or text for a paper exercise).

### quiz: multiple choice with explanations

```
:::quiz
title: Check: variables
q: What does the line x = 5 do in Python?
- Checks whether x equals 5
* Stores the value 5 under the name x
- Prints 5
why: A single equals sign assigns a value to a name. Comparison uses two equals signs.
q: After x = 5 and then x = x + 1, what is x?
- 5
* 6
- 51
why: The right side is computed first using the old x, then the result is stored back in x.
:::
```
Each `q:` has 3 or 4 options. Exactly one starts with `*` (correct). Others start with `-`. Each has a `why:`.

### video: an embedded free video

```
:::video
id: aircAruvnKk
why: Watch the first ten minutes. It shows the layers that this lesson describes in words.
:::
```
`id:` **must be one of the ids in section 7** (they are verified). `why:` says what to watch for and how much to watch. Optional `start: 90` (seconds). One or two videos per lesson at most; at Level 0 and 1 almost every lesson should have one.

### graph: a function plot or point series with a hover readout

```
:::graph
title: Gradient descent on f(x) = (x - 3)^2
x: -1, 7
y: 0, 16
xlabel: x
ylabel: f(x)
f: loss = (x-3)^2
points: steps | 0 9, 0.6 5.76, 1.08 3.69, 1.464 2.36, 1.771 1.51
tangent: 0
vline: 3 = minimum
:::
```
`x: min, max` is required. `y:` is optional (computed from the data). Up to three `f:` lines, each `name = expression` or just the expression, drawn as animated curves. Expressions use `x`, numbers, `+ - * / ^`, parentheses, `e`, `pi`, and the functions sin, cos, tan, exp, log (natural), log2, log10, sqrt, abs, tanh, max, min, relu, sigmoid; implicit multiplication such as `2x` works. `points: name | x y, x y, ...` draws a point series that appears one point at a time (good for descent steps or data). `tangent: x0` draws the tangent of the first curve at x0 with its slope. `vline: x = label` draws a labelled vertical guide. The reader moves the pointer over the plot to read every curve at that x. Use `graph` for any function, line, loss curve, activation, distribution or small data set; it counts as the lesson's diagram. For an explanation that moves (a point descending a curve, a request crossing a system), use `anim` instead.

### anim: a narrated, continuous animation (the main explainer of a lesson)

An `anim` block is a short animated explainer with subtitles: one theme-aware stage of 960 x 540 units, objects that appear, move, connect and change, and one narration line per scene. The opening frame is visible before playback. The reader starts playback, then can pause, scrub, select a scene, change speed, open full screen, or explore the steps in the transcript. Playback pauses offscreen and in a hidden tab. Reduced-motion users can select completed scene frames without transitions. The renderer measures visible objects across the scenes and fits their actual bounds on desktop. Phones focus on the active explanation. Labels use a larger type scale, and the canvas scrolls horizontally instead of shrinking text below 14 screen pixels. Enlarge opens the full composition; Fit scene returns to automatic framing. Use it for the one idea the lesson exists to teach. Every lesson must have one; put it under "How it works" (or "The idea with an example" for Level 0). It counts as the lesson's diagram. `npm run visuals` enforces animation coverage across all tracks.

```
:::anim
title: One question through a chat app with retrieval
box user "You" @ 110,270 icon: user
box api "API server" @ 420,270 icon: server
box vdb "Vector database" @ 420,450 icon: database
box llm "LLM" @ 790,270 icon: model
text q "What is a token?" @ 110,170 size: 18 color: yellow
num chunks = 0 @ 650,450 suffix: " chunks" size: 24
text note "The prompt holds the question|and the 5 chunks" @ 790,150 size: 16 color: grey

step: You type a question in the browser. It goes to the API server.
  show user, q, api
  arrow user -> api : question
step: The server turns the question into numbers and asks the vector database for similar text.
  show vdb
  arrow api -> vdb : embedding
step: The database returns the five closest chunks.
  show chunks
  arrow vdb -> api : 5 chunks
  & count chunks -> 5
step: The server builds a prompt from the question and the chunks and sends it to the model.
  show llm, note
  arrow api -> llm : prompt
step: The model writes an answer. The server streams it back to you.
  arrow llm -> api : answer
  arrow api -> user : answer
  highlight llm
:::
```

**Make the animation understandable on its own.** Optional `context:`, `focus:`, and `takeaway:` lines before object declarations explain the task, what to notice, and the practical conclusion. An `explain:` line after a `step:` gives the reason for that scene. It appears with the current caption and in the transcript. These fields do not change the animation actions. Use specific explanations, not generic encouragement. Keep fictional numbers labelled as examples.

**Structure.** Objects are declared first, one per line. Then `step: narration` lines, each followed by its actions (indent them for readability). Objects start hidden; `show` them in the step where they matter so the picture builds up with the narration. Coordinates are stage units: x from 0 (left) to 960, y from 0 (top) to 540. Keep 60 units from the edges. Put the main objects on a grid (for example x = 110, 420, 790 and y = 150, 270, 450) so arrows are straight.

**Objects** (`[...]` optional; strings with spaces go in double quotes; `|` in a string makes a line break):

```
box ID "Label" @ x,y [icon: name] [size: WxH] [color: c]      rounded box with an icon chosen from the label (server, database, model, user, browser, queue, cache, gpu, ...); icon: none hides it
rect ID @ x,y size: WxH ["Label"] [color: c]                   plain rounded rectangle (a memory cell, a batch, a slot)
text ID "Words" @ x,y [size: 20] [color: c] [anchor: start|middle|end]
num ID = 0 @ x,y [prefix: "x = "] [suffix: " ms"] [digits: 2] [size: 30] [color: c]   a number that can count
dot ID @ x,y [r: 7] [color: c] [label: "p"]                    a point; add "on AX" to use axes coordinates
axes AX @ x,y size: WxH x: min,max y: min,max [xlabel: "x"] [ylabel: "y"]   a coordinate system; @ is its top-left corner
curve ID on AX = expression [label: "loss"] [color: c] [dashed]   a function of x (same expression language as graph)
vector ID on AX from x,y to x,y [label: "v"] [color: c]        an arrow with a head; also works without "on AX" in stage units
line ID on AX from x,y to x,y [color: c] [dashed]
tangent ID on CURVE at x0 [len: 1.5] [label: slope]           tangent of a curve; label: slope prints the live slope
arrow ID from A to B ["label"] [color: c] [dashed]             a connector you can show later (arrows are usually made by the arrow action instead)
```

A morph consumes its source and reveals its target. Both must be declared boxes, rectangles, text, numbers, or dots. Give targets their own positions and labels. It is seekable in either direction and snaps to its completed result with reduced motion. Keep arrows in separate lanes from labels; use transformations to show a change in meaning, not as decoration. Geometry-only edits can reuse the approved recordings with `npm run narration:export && node scripts/reuse-narration.mjs`; this refuses changed or ambiguous spoken text.

**Actions** (one per line under a step; a line that starts with `&` runs together with the previous action; add `(2s)` at the end to set the duration):

```
show IDS              fade and pop in (comma-separated ids; curves and vectors draw themselves)
hide IDS
draw IDS              trace a curve, vector or line
arrow A -> B : label  draw a connector from the edge of A to the edge of B, then send a glowing packet along it
send A -> B : label   send another packet along an existing connector
move ID -> x,y        slide an object (axes coordinates if the object is on axes)
morph SOURCE -> TARGET  move a visible object into a hidden result, reshape its rectangle if applicable, then reveal the result
walk ID along CURVE from x0 to x1     slide a dot along a curve
vector ID -> x,y      move the tip of a vector
tangent ID -> x1      slide a tangent along its curve
count ID -> 42        animate a num to a new value
label ID "new text"   change the words of a box, rect, text or vector
highlight IDS         thick violet outline        dim IDS   fade to 30%        restore IDS   undo both
color IDS red         recolour (blue, yellow, green, red, purple, orange, teal, pink, white, grey or #hex)
pulse IDS             a quick scale pulse
zoom x,y 1.6          move the camera to a point at a scale; zoom reset returns
wait 1.5
```

**Rules.** 4 to 8 steps; one sentence of narration per step (at most 20 words, STE); every step has at least one action; the scene must contain motion (arrows, moves, walks, counts, draws), not only shows. The narration says what the reader sees now, in the present tense. Name objects after the lesson's own terms. Numbers in a `num` must match the numbers in the prose. The validator reports unknown ids, bad coordinates, steps without actions and objects that are never shown. Add `[3s]` after a narration line to hold it longer.

## 5. Pedagogy rules (course design)

Each lesson follows this sequence, which maps to the headings above: **hook and objectives → concrete example with analogy → mechanism → practice → check → reflection and next step**.

- Teach **one** idea per lesson. If you need two, split the lesson.
- Lead with the concrete and move to the abstract. Numbers before symbols. A table of three rows before the general formula.
- Carry **one running example** through the whole lesson (the same sentence, the same three numbers, the same small data set).
- Name the misconception before the correction (the Common mistakes section).
- Quiz questions follow Bloom's levels: at least one "apply" question (compute or predict), not only "remember".
- Each lesson ends by naming what the next lesson adds.
- Code first appears at Level 0 module 2. Before that, no code.
- Level 0 and 1 lessons define every technical word inline the first time: "A variable is a name for a stored value."

## 6. File format

One module per file, in `src/data/tracks/<track-slug>/<module-slug>.ts`:

```ts
import type { Module } from '../../types'

export const mod: Module = {
  slug: 'first-python',
  title: 'Your first Python',
  description: 'Install Python, run a file, and learn the five ideas every program uses.',
  level: 'foundations',
  lessons: [
    {
      slug: 'install-and-run',
      title: 'Install Python and run your first file',
      summary: 'One sentence that says what the reader can do after the lesson.',
      minutes: 18,
      objectives: ['Install Python 3 on Windows, macOS or Linux.', 'Run a Python file from the terminal.'],
      keyTerms: ['Python', 'terminal', 'interpreter'],
      body: `
## What this lesson covers
...
`,
      links: [
        { label: 'Python downloads', url: 'https://www.python.org/downloads/', kind: 'docs' },
      ],
    },
  ],
}
```

Rules for the TypeScript:
- Strings use single quotes. If a string contains an apostrophe, use double quotes for that string instead.
- The body is a template literal (backticks) so **no backticks inside it** and **no `${`**.
- A backslash inside the body must be written twice (`\\`), including LaTeX commands: write `$\\sqrt{2}$` to get the square root symbol.
- Link `kind` is one of: video, paper, docs, article, repo, course.
- Lesson slugs are lowercase words joined with hyphens, unique within the module.

Each module also has a glossary file `src/data/glossary/<module-slug>.ts` (one per module, so writers never edit the same file):

```ts
import type { GlossaryTerm } from '../types'

export const terms: GlossaryTerm[] = [
  { term: 'Variable', slug: 'variable', short: 'A name that stores a value.', long: 'Two to four sentences with an example.', related: ['data-type'] },
]
```
Every `keyTerms` entry in the module must appear in some file under `src/data/glossary/` (yours or an existing one; `core.ts` holds the original terms). Do not redefine a slug that already exists in another file. `related` slugs must exist in some glossary file. Slug = lowercase term with hyphens.

Validate your module with:

```
node scripts/check-visuals.mjs --file src/data/tracks/<track>/<module>.ts
```
It renders every block, checks the block grammar, the section headings, the quiz shape, the video ids, backticks and `${`, and reports problems. Fix every problem before you finish.

## 7. Verified video bank

Only these ids may appear in `:::video` blocks (all checked against YouTube oEmbed). Ids marked (link only) open on YouTube instead of playing inline; use them sparingly.

Level 0, computers and code: `mCq8-xTH7jA` How Computers Work (Code.org, 5 min) · `tpIctyqH29Q` Crash Course Computer Science preview · `3LPJfIKxwWc` CS50 Lecture 0 Scratch (Harvard) · `x7X9w_GIm1s` Python in 100 Seconds · `YYXdXT2l-Gg` Install Python (Corey Schafer) · `rfscVS0vtbw` Learn Python full course (freeCodeCamp, 4.5 h) · `nLRL_NcnK-4` Harvard CS50P Python full course · `KkMDCCdjyW8` Stanford CS106A Lecture 1 · `HW29067qVWk` Jupyter Notebook tutorial · `I4EWvMFj37g` Bash in 100 Seconds · `rrB13utjYV4` Linux in 100 Seconds · `hwP7WQkmECE` Git in 100 Seconds · `RGOj5yH7evk` Git and GitHub crash course · `s7wmiS2mSXY` What is an API (3 min) · `-MTSQjw5DrM` RESTful APIs in 100 Seconds · `zsjvFFKOm3c` SQL in 100 Seconds · `Gjnup-PuquQ` Docker in 100 Seconds · `pg19Z8LL06w` Docker crash course (1 h) · `PeMlggyqz0Y` Machine Learning in 100 Seconds

Level 0, mathematics: `fNk_zzaMoSs` Vectors (3Blue1Brown) · `kYB8IZa5AuE` Linear transformations and matrices · `XkY2DOUCWMU` Matrix multiplication as composition · `LyGKycYT2v0` Dot products · `PFDu9oVAE-g` Eigenvectors · `WUvTyaaNkzM` Essence of calculus · `9vKqVkMQHKk` The derivative · `YG15m2VwSjA` Chain rule · `SzZ6GpcfoQY` Mean, variance, standard deviation (StatQuest) · `pYxNSUDSFH4` Probability is not likelihood · `HZGCoVF3YvM` Bayes theorem (3Blue1Brown) · `8idr1WZ1A7Q` Binomial distributions · `2MuDZIAzBMY` Stanford CS109 Probability Lecture 1 · `KpKog-L9veg` Softmax (StatQuest) · `6ArSys5qHAU` Cross entropy (StatQuest)

Level 1, AI foundations: `i_LwzRVP7bg` Machine Learning for Everybody (freeCodeCamp) · `nk2CQITm_eo` Linear regression (StatQuest) · `yIYKR4sgzI8` Logistic regression · `_L39rN6gz7Y` Decision trees · `EuBBz3bI-aA` Bias and variance · `fSytzGwwBVw` Cross validation · `4jRBRDbJemM` ROC and AUC · `sDv4f4s2SB8` Gradient descent step by step · `aircAruvnKk` But what is a neural network (3Blue1Brown) · `IHZwWFHWa-w` Gradient descent, how networks learn · `Ilg3gGewQ5U` Backpropagation intuitively · `tIeHLnjs5U8` Backpropagation calculus · `CqOfi41LfDw` Main ideas of neural networks (StatQuest) · `viZrOnJclY0` Word embeddings and word2vec · `LPZh9BOjkQs` LLMs explained briefly (3Blue1Brown, 8 min) · `zjkBMFhNj_g` Intro to LLMs (Karpathy, 1 h) · `7xTGNNLPyMI` Deep dive into LLMs (Karpathy, 3.5 h) · `zxQyTK8quyY` Transformers clearly explained (StatQuest) · `wjZofJX0v4M` Transformers (3Blue1Brown) · `eMlx5fFNoYc` Attention step by step · `9-Jl0dxWQs8` How LLMs store facts · `_ZvnD73m40o` Prompt engineering tutorial (freeCodeCamp) · `V_xro1bcAuA` PyTorch full course (freeCodeCamp) · `XfpMkf4rD6E` Stanford CS25 Intro to Transformers, Karpathy (link only) · `jGwO_UgTS7I` Stanford CS229 Lecture 1, Andrew Ng 2018 (link only) · `Bl4Feh_Mjvo` Stanford CS229 Lecture 1, 2022 · `UzxYlbK2c7E` Stanford CS229 Lecture 1, 2008 · `PySo_6S4ZAg` Stanford CS230 Deep Learning Lecture 1 · `J8Eh7RqggsU` Stanford CS221 AI overview 2019 (link only) · `yaLEGZuIIgE` Stanford CS221 Lecture 1, 2025 (link only)

Level 1 to 2, building: `T-D1OfcDW1M` What is RAG (IBM) · `klTvEwg3oJ4` Vector databases (Fireship) · `gl1r1XV0SLw` What is a vector database (IBM) · `F8NKVhkZZWI` What are AI agents (IBM) · `1bUy-1hGZpI` What is LangChain (IBM) · `eur8dUO9mvE` What is MCP (IBM) · `00Q0G84kq3M` RAG vs fine-tuning (IBM) · `WxYC9-hBM_g` Run your own AI with Ollama (NetworkChuck) · `7t2alSnE2-I` FastAPI full course · `3c-iBn73dDE` Docker full course (3 h) · `PziYflu8cB8` Kubernetes in 100 Seconds · `G1rOthIU-uo` Redis in 100 Seconds · `LCEmiRjPEtQ` Karpathy: Software Is Changing (Again)

Level 2 to 3, research and Stanford: `VMj-3S1tku0` micrograd (Karpathy) · `PaCmpygFfXo` makemore · `kCc8FmEb1nY` Let's build GPT · `zduSFxRajkE` GPT tokenizer · `l8pRSuU81PU` Reproduce GPT-2 · `rmVRLeJRkl4` Stanford CS224N Lecture 1 · `9vM4p9NN0Ts` Stanford CS229 Building LLMs, Dubois (link only) · `vT1JzLTH4G4` Stanford CS231n Lecture 1 (2017) · `NfnWJUyUJYU` CS231n Lecture 1 (2016, Karpathy) · `P127jhj-8-Y` Stanford CS25 V1 opener · `bHSDPgZYie0` Stanford CS25 V6 overview · `SQ3fZ1sAqXI` Stanford CS336 Lecture 1 · `FgzM3zpZ55o` Stanford CS234 RL Lecture 1 (link only) · `JAB_plj2rbA` Stanford CS224W Lecture 1.1 · `bkVCAk9Nsss` Stanford CS330 Lecture 1 · `kV1ru-Inzl4` Stanford EE364A Convex Optimization Lecture 1

## 8. Glossary and cross-links

- Every `keyTerms` entry resolves to a glossary term (existing or in the track glossary file). The lesson sidebar links them.
- Link to other lessons with relative site routes in prose: `[Functions](/courses/start-here/first-python/functions)`. Only link to lessons that exist in the curriculum below (use the slugs given).
- The `before` field (optional) lists lessons to read first, as `{ label, to }` with routes of the same form.

## 9. Curriculum (new tracks)

Slugs are fixed; use them exactly. Each line is `lesson-slug — Title — the one idea`.

### Track `start-here` — Start Here: Computers, Code and Data from Zero (Level 0, order 1, no prerequisites)

Module `how-a-computer-works` — How a computer works
- `input-process-store-output` — What a computer does — input, processing, storage, output; bits and bytes; CPU, memory, disk with an everyday analogy (a kitchen)
- `files-folders-os` — Files, folders and the operating system — paths, extensions, what an OS does, Windows vs macOS vs Linux
- `how-the-internet-works` — How a web page reaches you — client, server, request, response, URL, IP address, HTTP, HTTPS, what "the cloud" is
- `what-a-program-is` — What a program is — exact instructions, a recipe analogy, why computers need exactness, the idea of a programming language, interpreter vs compiler in one paragraph

Module `first-python` — Your first Python
- `install-and-run` — Install Python and run your first file — install on each OS, the terminal, python --version, create hello.py, run it, what an error looks like
- `variables-and-types` — Variables and types — names for values; int, float, str, bool; print; type(); converting between types
- `lists-and-dicts` — Lists and dictionaries — ordered collections and key-value lookups; indexing; adding; len
- `decisions` — Decisions with if and else — comparisons, booleans, and/or/not, indentation blocks
- `loops` — Repeating with loops — for over a list, range, while, accumulators, the running total example
- `functions` — Functions — def, parameters, return, why we name recipes, calling, scope in one paragraph

Module `python-for-data` — Python for working with data
- `files-csv-json` — Reading and writing files — open, read, write; CSV rows; JSON as nested dicts and lists; the json module
- `errors-and-debugging` — Errors and how to read them — reading a traceback bottom-up, common error types, try/except, print debugging
- `packages-and-pip` — Packages and pip — import, the standard library, pip install, virtual environments, requirements.txt
- `notebooks` — Notebooks: Jupyter and Colab — cells, run order, state, when to use a notebook vs a file, Colab free GPU
- `tables-with-pandas` — Tables with pandas and arrays with NumPy — DataFrame, read_csv, filter, groupby, mean, a simple plot; NumPy array and shape

Module `builders-tools` — Tools every builder uses
- `terminal-commands` — The terminal: the twelve commands you need — pwd, ls, cd, mkdir, touch, cat, cp, mv, rm, which, echo, |, > and the PATH idea
- `git-and-github` — Git and GitHub — init, add, commit, log, branch, push, clone, pull; why version control; .gitignore
- `apis-and-json` — APIs and JSON — HTTP methods, status codes, headers, the requests library, reading a JSON response, rate limits
- `secrets-and-env` — Keys, secrets and environment variables — API keys, .env files, never commit a key, os.environ, what happens when a key leaks
- `docker-in-plain-words` — Docker in plain words — images vs containers, "works on my machine", docker run hello-world, a Dockerfile for a Python script

Module `data-the-raw-material` — Data, the raw material of AI
- `what-data-is` — What data is — examples (rows), features (columns), labels, a 6-row house-price table carried through the module
- `kinds-of-data` — Kinds of data — numbers, categories, text, images as grids of numbers, audio as a list of numbers; structured vs unstructured
- `cleaning-data` — Cleaning data — missing values, duplicates, outliers, inconsistent formats; with pandas
- `data-rules-and-ethics` — Where data comes from and the rules — licences, privacy, consent, personal data, bias in data, documentation (datasheets)

### Track `math-from-zero` — Mathematics for AI from Zero (Level 0, order 2, no prerequisites)

Module `numbers-and-functions` — Numbers and functions
- `numbers-you-will-meet` — Numbers you will meet — integers, decimals, negatives, fractions, percent, very large and very small (scientific notation), rounding, floating point in one paragraph
- `functions-as-machines` — Functions as machines — input, output, f(x) notation, tables, graphs, composition
- `lines-and-slopes` — Lines and slopes — y = mx + b, slope as rate, intercept, fitting a line by eye to 5 points (the first model)
- `exponents-and-logs` — Exponents and logarithms — powers, roots, e, log as the inverse, log scale, why loss curves and learning rates use logs

Module `vectors-and-matrices` — Vectors and matrices
- `what-a-vector-is` — A vector is a list of numbers — point, arrow, feature list; 2D and 3D; higher dimensions as lists
- `vector-arithmetic` — Adding, scaling and measuring vectors — addition, scalar multiple, length (norm), distance
- `dot-product` — The dot product — definition, geometric meaning, cosine similarity, a 3-word similarity example
- `matrices` — Matrices — a table of numbers, rows and columns, shape, a matrix as a machine that moves vectors (rotation and scaling examples)
- `matrix-multiplication` — Matrix multiplication by hand — the shape rule, row times column, a 2x2 by 2x1 example, a tiny neural network layer as a matrix multiply

Module `change-and-gradients` — Change: derivatives and gradients
- `rate-of-change` — Rate of change — average vs instant slope, the derivative as the slope of the tangent, with a car-speed analogy
- `derivative-rules` — Derivative rules you need — power, constant, sum, product, chain rule, each with one numeric example
- `follow-the-slope` — Minimising a function by following the slope — gradient descent on f(x) = (x - 3)^2 by hand, learning rate, too big and too small
- `gradients-many-variables` — Many variables: partial derivatives and the gradient — f(x, y), partials, the gradient vector points uphill, one descent step in 2D

Module `chance` — Chance: probability and statistics
- `probability-basics` — Probability basics — outcomes, events, 0 to 1, counting, dice and cards, complementary events
- `conditional-and-bayes` — Conditional probability and Bayes' rule — P(A|B), the spam-filter example with 1,000 emails, base rates
- `mean-variance` — Random variables, mean, variance, standard deviation — expectation, spread, computed on a 6-number list
- `distributions` — Distributions you will meet — uniform, Bernoulli, categorical, normal (bell curve); softmax as a way to make a categorical distribution
- `entropy-and-cross-entropy` — Surprise, entropy and cross-entropy — information in bits, entropy of a coin and a die, cross-entropy as the training loss with a 3-class example

### Track `ai-foundations` — AI Foundations: How Machines Learn (Level 1, order 3, prerequisites: start-here, math-from-zero)

Module `what-ai-is` — What AI is
- `the-four-circles` — AI, machine learning, deep learning and generative AI — distinguish the broad field, learning methods, and content-generation capability; keep the stable slug, but do not portray all four as strictly nested categories
- `rules-vs-learning` — Rules versus learning — the spam filter written as rules vs learned from examples; when each wins
- `the-learning-loop` — The learning loop — data, model, loss, update, evaluate; the one picture for the whole field, with the house-price table
- `the-ai-ecosystem-map` — The AI ecosystem map — data, training, models, serving, apps, agents, tools, evaluation, monitoring; what Level 1 track 4 builds

Module `first-models` — Your first models
- `linear-regression` — Predict a number: linear regression — by hand on 5 points, then scikit-learn; coefficients
- `measuring-error` — Measuring error and splitting data — MSE, MAE, train/test split, why you never test on training data
- `classification` — Predict a category: logistic regression — sigmoid, threshold, accuracy, precision, recall, confusion matrix
- `trees-and-neighbours` — Decision trees, random forests and nearest neighbours — three models that need no calculus
- `overfitting-and-generalisation` — Overfitting, underfitting and cross-validation — the memorising student analogy, regularisation in one paragraph

Module `neural-networks` — Neural networks
- `a-neuron` — A neuron — weights, bias, weighted sum, activation (ReLU, sigmoid), computed by hand
- `layers-and-forward-pass` — Layers and the forward pass — a 2-2-1 network computed by hand; matrices behind it
- `loss-and-descent` — Loss and gradient descent for a network — one parameter update by hand; learning rate; epochs and batches
- `backpropagation` — Backpropagation — assigning blame with the chain rule on the 2-2-1 network; why it is efficient
- `training-in-pytorch` — Training in PyTorch — tensors, autograd, nn.Module, a training loop on a tiny data set; reading the loss curve

Module `language-as-numbers` — Language as numbers
- `tokens` — Tokens — characters, words, subwords; byte-pair encoding idea; token counts and cost
- `embeddings` — Embeddings — words as vectors; similarity; word2vec idea; embeddings for sentences
- `next-word-prediction` — Predicting the next word — counting n-grams on a tiny corpus, then a neural language model; sampling
- `attention-gently` — Attention and the transformer, gently — query, key, value with a 3-token example; why it beats reading left to right
- `how-an-llm-is-made` — How an LLM is made and what it cannot do — pretraining, fine-tuning, RLHF; context window; hallucination; knowledge cutoff

Module `using-models` — Using models
- `prompting` — Prompting that works — instructions, examples, format, role, system prompt, chain of thought; before and after prompts
- `sampling-and-temperature` — Temperature and sampling — logits to probabilities, temperature, top-p; determinism and seeds
- `choosing-a-model` — Choosing a model — open vs closed, local vs API, size, context, price per million tokens, a decision table
- `evaluating-and-safety` — Evaluating a model and basic safety — benchmarks, your own test set, human review, refusals, injection, privacy

### Track `build-ai-ecosystem` — Build the AI Ecosystem: Project Track (Level 1, order 4, prerequisites: ai-foundations)

Module `set-up-your-workshop` — Set up your workshop
- `the-project-plan` — The project plan and architecture — the final system drawn as an arch block; the repository layout; what each module adds
- `environment-and-keys` — Environment, keys and the first commit — venv, requirements, .env, API key from a provider, git init and first commit
- `call-a-model` — Call a model — the Anthropic API with the Python SDK (model id claude-sonnet-5-5), an OpenAI-compatible call, and a local model with Ollama; compare outputs

Module `chat-application` — Chat application
- `chat-loop` — A chat loop in the terminal — messages list, roles, keeping history, exit
- `streaming-and-tokens` — Streaming and token counting — stream events, printing as it arrives, counting tokens and cost
- `structured-output` — Structured output — asking for JSON, a schema with pydantic, validation and retry
- `web-ui` — A web UI — FastAPI endpoint plus a single HTML page with fetch; run locally

Module `retrieval-rag` — Retrieval over your own documents (RAG)
- `why-rag` — Why models need your documents — context window, knowledge cutoff, the RAG architecture
- `load-and-chunk` — Loading and chunking documents — PDF and text loading, chunk size and overlap, metadata
- `embed-and-store` — Embeddings and a vector store — embedding chunks, Chroma or FAISS, similarity search
- `retrieve-and-answer` — Retrieve, build the prompt, answer with citations — top-k, prompt template, citing chunk ids
- `evaluate-rag` — Evaluating RAG — a test set of questions, retrieval hit rate, answer grading with a model, hybrid search and reranking

Module `agents-and-tools` — Agents and tools
- `tool-calling` — Tool calling — defining a tool with a JSON schema, the model asks, your code runs it, you return the result
- `the-agent-loop` — The agent loop — plan, act, observe, repeat; stop conditions; max steps; a file-search agent
- `memory` — Memory — short-term (the context), summarisation, long-term store with embeddings
- `workflows-and-mcp` — Multi-step workflows and MCP — chaining steps, the Model Context Protocol, writing a tiny MCP server
- `guardrails` — Guardrails — permissions, human approval, input and output checks, prompt injection, logging every tool call

Module `train-your-own` — Train and fine-tune your own model
- `when-to-fine-tune` — When to fine-tune, prompt, or retrieve — a decision table with examples and costs
- `build-a-dataset` — Build a dataset — JSONL format, instruction and response pairs, quality over quantity, a 200-example plan
- `lora-fine-tune` — Fine-tune a small open model with LoRA — Hugging Face transformers and peft on Colab; what LoRA changes
- `evaluate-and-serve` — Evaluate and serve the fine-tuned model — before vs after on a held-out set; serve with Ollama or vLLM

Module `ship-it` — Ship it: deploy, monitor, cost
- `dockerise` — A Docker image for your service — Dockerfile, build, run, environment variables, health check
- `deploy` — Deploy to a cloud — a container host (Fly.io, Render or AWS), HTTPS, secrets, a first real URL
- `observability` — Observability — logging prompts and responses, tracing, latency and error dashboards, alerts
- `cost-control` — Cost control — caching, model routing, rate limits, budgets; computing monthly cost
- `capstone` — Capstone: the full ecosystem — the complete architecture, a checklist, a demo script, and what to learn next in Level 2

## 10. Context, guided labs, and chapter video sequences

Standalone animation activities retain the lesson’s authored analogy and relevance paragraph, plus a term glossary. Do not add rich blocks to this context panel: interactive blocks stay in their own activities.

Every lab needs an everyday explanation, a visual reading guide, a controlled three-step experiment, a worked example, a limitation, and a reflection answer in `src/data/learning/labGuides.ts`. Check instructions against actual control labels and numeric limits.

Every module has a curated sequence in `src/data/learning/chapterVideos.ts`. Include at least three relevant videos or full series, a concrete viewing focus for each, and a practical follow-up. Clearly label source difficulty and full-video duration. A 100-second overview can remain optional orientation; it is not sufficient chapter coverage. Keep publisher course links and verification evidence for additions. Do not invent timestamps, durations, or playback checks.

The work guides use fictional input, draft, review, and outcome examples in `src/data/work/examples.ts`. Preserve uncertainty and separate a suggested output from a verified fact or authorised action.

Chapter previews and titles select the same recording inside its own card. Keep the YouTube link separate. Load one selected player at a time, without a playlist parameter for individual recordings. Show a preview and explicit external-playback explanation when inline playback is unavailable. Stop hidden playback when a sequence is collapsed or a chapter changes.

Run `npm run test:content-guidance` and `npm run test:chapter-videos` alongside the content and product-rendering checks. Simulated-DOM interactions do not verify real external video playback.
