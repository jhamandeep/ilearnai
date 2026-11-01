# Choose a learning path

[Learning hub](../README.md) · [AI primer](ai-primer.md) · [Complete chapter index](#complete-chapter-index)

Choose a path by what you want to do. The tracks overlap deliberately: you can learn the foundations, apply them in a project, and revisit the mathematics when a question becomes useful.

The written guides are readable on GitHub. The full lesson experience—narration, activities, videos, and progress—is in the [companion portal](development.md#run-locally). Source links in the chapter index open the lesson definitions for browsing and contribution.

## Apply AI at work

**For:** leaders, managers, team members, domain specialists, and delivery teams. No coding prerequisite.

1. Read the first three sections of the [AI primer](ai-primer.md).
2. Choose a familiar task from [AI at work](ai-at-work.md).
3. Map the current workflow and define a checked, useful result.
4. Read the [document assistant](projects/document-assistant.md) design, focusing on sources and review.
5. Write a [pilot brief](ai-at-work.md#copy-this-pilot-brief).

**Checkpoint:** explain where AI contributes, where people decide, and how you would tell whether the workflow improved.

## Beginner path

**For:** someone new to programming or AI.

1. [Start Here](#start-here): computers, Python, data, and tools.
2. [Mathematics for AI from Zero](#math-from-zero): learn the mathematical ideas alongside small examples.
3. [AI Foundations](#ai-foundations): build the connection from data to models.
4. Run the [Python experiments](../examples/README.md) and explain each result.
5. Choose [AI from first principles](#complete-ai) for broader vision, language, and reasoning topics, or move to a project.

**Checkpoint:** modify a small program, explain what it reads and produces, and distinguish training error from evaluation on unseen data.

## Builder path

**For:** someone comfortable with basic Python. If functions, files, and APIs are unfamiliar, begin with Start Here.

1. [AI Foundations](#ai-foundations), or review the [primer](ai-primer.md).
2. [Build the AI Ecosystem](#build-ai-ecosystem): work through an application from setup to shipping.
3. Design the [document assistant](projects/document-assistant.md).
4. [AI Engineering](#ai-engineering): deepen retrieval, agents, evaluation, and production practice.
5. Write a small evaluation set and a report comparing your design with a baseline.

**Checkpoint:** demonstrate the useful case, a missing-evidence case, and a dependency failure. Explain what your project actually implements.

## Systems path

**For:** architects, backend engineers, infrastructure engineers, and technical delivery leads.

1. Review the application-level concepts in [AI Engineering](#ai-engineering).
2. [System Design](#system-design): storage, consistency, caching, queues, and reliability.
3. Complete the [infrastructure capacity estimate](infrastructure.md#worked-capacity-estimate).
4. [Inference Engineering](#inference-engineering): memory, throughput, kernels, parallelism, and measurement.
5. Record a reproducible workload with input lengths, output lengths, concurrency, latency, and failure behaviour.

**Checkpoint:** explain why a model fitting into memory is different from a service meeting its latency and throughput requirements.

## Research path

**For:** someone comfortable with Python and introductory ML, with willingness to work through mathematics.

1. [ML Mathematics](#ml-math): revisit linear algebra, calculus, probability, and optimisation.
2. [AI Research](#ai-research): transformers, scaling, alignment, data, and experimental practice.
3. Select a paper from the [reading guide](resources.md#read-papers-with-a-question).
4. Reproduce a small result or ablation within a stated compute budget.
5. Explore [Open Robotics](#open-robotics) if perception and action are your next interest.

**Checkpoint:** distinguish the paper's measured result, your own measured result, and an untested hypothesis.

## Keep a learning record

After a chapter, write three lines:

```text
I can explain:
I tried and observed:
I still need to understand:
```

Use the [review questions](review-questions.md) to find gaps. Advance when you can explain or demonstrate the outcome, rather than just recognising the terms.

## Complete chapter index

This index is generated from the checked-in curriculum catalog. Chapter links open the relevant source file; when a track keeps chapters together, several links intentionally open the same file. In the local portal, open the matching course and chapter for the reading experience.

<!-- curriculum:start -->

**11 tracks · 63 chapters · 245 lessons**

<a id="start-here"></a>

### Start Here: Computers, Code and Data from Zero

**Level:** foundations. **Outcome:** Write and run small Python programs, read and clean a data table with pandas, use the terminal, Git, APIs and Docker, and explain what data is.

[Track source](../src/data/tracks/start-here.ts) · Local app route: `/courses/start-here`

| Chapter | Lessons |
| --- | --- |
| [How a computer works](../src/data/tracks/start-here/how-a-computer-works.ts) | 4 |
| [Your first Python](../src/data/tracks/start-here/first-python.ts) | 6 |
| [Python for working with data](../src/data/tracks/start-here/python-for-data.ts) | 5 |
| [Tools every builder uses](../src/data/tracks/start-here/builders-tools.ts) | 5 |
| [Data, the raw material of AI](../src/data/tracks/start-here/data-the-raw-material.ts) | 4 |

<a id="math-from-zero"></a>

### Mathematics for AI from Zero

**Level:** foundations. **Outcome:** Compute a dot product, a matrix product, a derivative, one gradient-descent step and a probability by hand, and read the formulas in Level 1 lessons.

[Track source](../src/data/tracks/math-from-zero.ts) · Local app route: `/courses/math-from-zero`

| Chapter | Lessons |
| --- | --- |
| [Numbers and functions](../src/data/tracks/math-from-zero/numbers-and-functions.ts) | 4 |
| [Vectors and matrices](../src/data/tracks/math-from-zero/vectors-and-matrices.ts) | 5 |
| [Change: derivatives and gradients](../src/data/tracks/math-from-zero/change-and-gradients.ts) | 4 |
| [Chance: probability and statistics](../src/data/tracks/math-from-zero/chance.ts) | 5 |

<a id="ai-foundations"></a>

### AI Foundations: How Machines Learn

**Level:** beginner. **Outcome:** Train and evaluate first models with scikit-learn and PyTorch, explain how a language model predicts the next token, and use a model well through prompts and sampling.

[Track source](../src/data/tracks/ai-foundations.ts) · Local app route: `/courses/ai-foundations`

| Chapter | Lessons |
| --- | --- |
| [What AI is](../src/data/tracks/ai-foundations/what-ai-is.ts) | 4 |
| [Your first models](../src/data/tracks/ai-foundations/first-models.ts) | 5 |
| [Neural networks](../src/data/tracks/ai-foundations/neural-networks.ts) | 5 |
| [Language as numbers](../src/data/tracks/ai-foundations/language-as-numbers.ts) | 5 |
| [Using models](../src/data/tracks/ai-foundations/using-models.ts) | 4 |

<a id="build-ai-ecosystem"></a>

### Build the AI Ecosystem: Project Track

**Level:** beginner. **Outcome:** Ship a working AI system: a streaming chat app with a web UI, retrieval with citations, a tool-using agent with guardrails, a LoRA fine-tuned model, and a monitored, cost-controlled deployment.

[Track source](../src/data/tracks/build-ai-ecosystem.ts) · Local app route: `/courses/build-ai-ecosystem`

| Chapter | Lessons |
| --- | --- |
| [Set up your workshop](../src/data/tracks/build-ai-ecosystem/set-up-your-workshop.ts) | 3 |
| [Chat application](../src/data/tracks/build-ai-ecosystem/chat-application.ts) | 4 |
| [Retrieval over your own documents (RAG)](../src/data/tracks/build-ai-ecosystem/retrieval-rag.ts) | 5 |
| [Agents and tools](../src/data/tracks/build-ai-ecosystem/agents-and-tools.ts) | 5 |
| [Train and fine-tune your own model](../src/data/tracks/build-ai-ecosystem/train-your-own.ts) | 4 |
| [Ship it: deploy, monitor, cost](../src/data/tracks/build-ai-ecosystem/ship-it.ts) | 5 |

<a id="ml-math"></a>

### ML Mathematics

**Level:** intermediate. **Outcome:** Follow and reproduce the mathematics in machine-learning papers: gradients, probability, optimisation and information theory.

[Track source](../src/data/tracks/ml-math.ts) · Local app route: `/courses/ml-math`

| Chapter | Lessons |
| --- | --- |
| [Linear algebra](../src/data/tracks/ml-math.ts) | 5 |
| [Calculus](../src/data/tracks/ml-math.ts) | 3 |
| [Probability](../src/data/tracks/ml-math.ts) | 4 |
| [Statistics and information](../src/data/tracks/ml-math.ts) | 3 |
| [Optimisation](../src/data/tracks/ml-math.ts) | 4 |
| [From linear models to networks](../src/data/tracks/ml-math.ts) | 4 |

<a id="ai-engineering"></a>

### AI Engineering

**Level:** intermediate. **Outcome:** Design, evaluate and operate retrieval, agent and tool-use systems in production.

[Track source](../src/data/tracks/ai-engineering.ts) · Local app route: `/courses/ai-engineering`

| Chapter | Lessons |
| --- | --- |
| [Embeddings and vector search](../src/data/tracks/ai-engineering.ts) | 3 |
| [Retrieval-augmented generation](../src/data/tracks/ai-engineering.ts) | 3 |
| [Agents and tool use](../src/data/tracks/ai-engineering.ts) | 4 |
| [Prompting and structured output](../src/data/tracks/ai-engineering.ts) | 4 |
| [Evaluation](../src/data/tracks/ai-engineering.ts) | 3 |
| [Fine-tuning](../src/data/tracks/ai-engineering.ts) | 4 |
| [Production](../src/data/tracks/ai-engineering.ts) | 3 |

<a id="system-design"></a>

### System Design

**Level:** intermediate. **Outcome:** Design a complete backend with caches, queues, databases and failure handling, and defend each choice.

[Track source](../src/data/tracks/system-design.ts) · Local app route: `/courses/system-design`

| Chapter | Lessons |
| --- | --- |
| [Fundamentals](../src/data/tracks/system-design.ts) | 5 |
| [Storage](../src/data/tracks/system-design.ts) | 4 |
| [Replication and consistency](../src/data/tracks/system-design.ts) | 4 |
| [Partitioning](../src/data/tracks/system-design.ts) | 3 |
| [Caching and queues](../src/data/tracks/system-design.ts) | 4 |
| [Reliability](../src/data/tracks/system-design.ts) | 4 |
| [Case studies](../src/data/tracks/system-design.ts) | 4 |

<a id="inference-engineering"></a>

### Inference Engineering

**Level:** advanced. **Outcome:** Size a GPU fleet, tune a serving stack, and explain every millisecond of latency.

[Track source](../src/data/tracks/inference-engineering.ts) · Local app route: `/courses/inference-engineering`

| Chapter | Lessons |
| --- | --- |
| [Memory arithmetic](../src/data/tracks/inference-engineering.ts) | 3 |
| [Batching and throughput](../src/data/tracks/inference-engineering.ts) | 4 |
| [Attention kernels](../src/data/tracks/inference-engineering.ts) | 3 |
| [Parallelism](../src/data/tracks/inference-engineering.ts) | 4 |
| [The serving stack](../src/data/tracks/inference-engineering.ts) | 3 |
| [Measurement](../src/data/tracks/inference-engineering.ts) | 3 |

<a id="ai-research"></a>

### AI Research

**Level:** advanced. **Outcome:** Derive the transformer, scaling laws, RLHF and DPO by hand, and read a 2025 reasoning paper and say what it changed.

[Track source](../src/data/tracks/ai-research.ts) · Local app route: `/courses/ai-research`

| Chapter | Lessons |
| --- | --- |
| [Transformers from first principles](../src/data/tracks/ai-research.ts) | 4 |
| [Scaling laws and compute-optimal training](../src/data/tracks/ai-research.ts) | 3 |
| [Alignment: SFT, RLHF, DPO](../src/data/tracks/ai-research.ts) | 3 |
| [Pretraining data](../src/data/tracks/ai-research.ts) | 4 |
| [Architectures beyond the dense transformer](../src/data/tracks/ai-research.ts) | 3 |
| [Reasoning models](../src/data/tracks/ai-research.ts) | 4 |
| [Research practice](../src/data/tracks/ai-research.ts) | 4 |

<a id="open-robotics"></a>

### Open Robotics

**Level:** advanced. **Outcome:** Explain the modern robot learning stack and read current robotics papers.

[Track source](../src/data/tracks/open-robotics.ts) · Local app route: `/courses/open-robotics`

| Chapter | Lessons |
| --- | --- |
| [Vision-language-action models](../src/data/tracks/open-robotics.ts) | 3 |
| [Perception and state estimation](../src/data/tracks/open-robotics.ts) | 3 |
| [Control and learning](../src/data/tracks/open-robotics.ts) | 3 |

<a id="complete-ai"></a>

### AI from first principles

**Level:** beginner. **Outcome:** Explain the main AI approaches, inspect their computations, compare their limits, and plan a relevant experiment.

[Track source](../src/data/tracks/complete-ai.ts) · Local app route: `/courses/complete-ai`

| Chapter | Lessons |
| --- | --- |
| [Ideas, history, and symbolic reasoning](../src/data/tracks/complete-ai.ts) | 2 |
| [Neural networks and frameworks](../src/data/tracks/complete-ai.ts) | 3 |
| [Computer vision from pixels to regions](../src/data/tracks/complete-ai.ts) | 7 |
| [Language, representations, and generation](../src/data/tracks/complete-ai.ts) | 8 |
| [Search, reinforcement learning, and agents](../src/data/tracks/complete-ai.ts) | 3 |
| [Responsible AI in practice](../src/data/tracks/complete-ai.ts) | 1 |
| [Extension: image and language together](../src/data/tracks/complete-ai.ts) | 1 |

<!-- curriculum:end -->

---

[Back to the learning hub](../README.md) · [Run the portal](development.md#run-locally)
