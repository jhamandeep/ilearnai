# Resources with a purpose

[Learning hub](../README.md) · [Learning paths](learning-paths.md) · [Infrastructure](infrastructure.md)

Use a resource to answer a question or complete an experiment. This selection links to the original course, documentation, paper, or project. It is a starting collection rather than a ranking.

## Courses and practical documentation

| Resource | Use it for | A useful stopping point |
| --- | --- | --- |
| [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) | Regression, classification, data, and neural-network concepts | Explain a loss curve and an evaluation metric |
| [Microsoft AI for Beginners](https://github.com/microsoft/AI-For-Beginners) | A broad curriculum spanning symbolic approaches, neural networks, vision, and language | Complete an exercise and describe its assumptions |
| [PyTorch: Learn the Basics](https://docs.pytorch.org/tutorials/beginner/basics/intro.html) | Tensors, data, models, gradients, and training loops | Train and evaluate a small network |
| [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | Transformers, tokenizers, datasets, and model adaptation | Explain the inputs and outputs of a transformer task |
| [scikit-learn cross-validation guide](https://scikit-learn.org/stable/modules/cross_validation.html) | Reliable model comparisons and data splitting | Choose a split that avoids leakage for your task |
| [scikit-learn evaluation guide](https://scikit-learn.org/stable/modules/model_evaluation.html) | Metrics and their trade-offs | Justify a metric using the cost of a particular error |

Some courses include videos and notebooks; use their official navigation for the current sequence. The portal's broader [video catalog](../src/data/videos.ts) and [featured selections](../src/data/featuredVideos.ts) connect media to learning topics.

## Visual exploration

| Resource | Experiment |
| --- | --- |
| [TensorFlow Playground](https://playground.tensorflow.org/) | Change features, layers, and learning rate; compare training and test behaviour |
| [ilearnai labs](../README.md#explore-the-interactive-labs) | Explore attention, gradient descent, tokenization, sampling, memory, and capacity in the local portal |
| [ilearnai worked designs](../README.md#worked-projects) | Follow a diagram from an input through evidence, a model, and a review step |

Before changing a control, predict what you expect. Afterward, explain any difference. That turns a visual into an experiment.

## Open-source tools to inspect

These are optional tools for deeper projects. The repository's [small Python examples](../examples/README.md) do not require them.

| Tool or project | Area to explore | Question to answer first |
| --- | --- | --- |
| [scikit-learn](https://scikit-learn.org/stable/) | Classical ML and evaluation | Can a simple baseline solve the task? |
| [PyTorch](https://github.com/pytorch/pytorch) | Neural-network training and tensor computation | What objective and data will train the model? |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | Local language-model inference | Does the model format and runtime fit my hardware? |
| [vLLM](https://docs.vllm.ai/en/latest/) | Language-model serving | What concurrency and latency must the service handle? |
| [pgvector](https://github.com/pgvector/pgvector) | Vector similarity search within PostgreSQL | Does semantic retrieval improve my measured baseline? |

Check model terms, project licenses, and current compatibility in the upstream documentation before incorporating a dependency. Model weights and runtime code can have different terms.

## Read papers with a question

| Paper | Why read it | Question to bring |
| --- | --- | --- |
| [Attention Is All You Need](https://arxiv.org/abs/1706.03762), 2017 | Transformer architecture | Where does information move between positions? |
| [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401), 2020 | Combining retrieval with generation | Which information is stored in parameters, and which is retrieved? |
| [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685), 2021 | Adapting a model through low-rank updates | Which parameters change, and what does that save? |
| [FlashAttention](https://arxiv.org/abs/2205.14135), 2022 | Attention computation with attention to memory traffic | Why can data movement dominate an implementation? |

Read the problem and the main figure first. Then inspect the experimental setup, baseline, and limitations before deriving every equation. The papers' publication years are historical context, not a claim that they represent the newest method.

Copy this reading note:

```text
Paper and version:
Problem:
Main idea in my own words:
Compared with:
Evidence and experimental conditions:
Limitations:
One small experiment I could reproduce:
```

The portal's [paper catalog](../src/data/papers.ts) contains a wider selection.

## Certifications and structured study

Choose a credential based on the work you want to do and the platform you actually use. Begin with the current official exam guide, map its objectives to practical exercises, and identify prerequisites.

| Provider | Official catalog | How to use it |
| --- | --- | --- |
| Microsoft | [Microsoft Learn credentials](https://learn.microsoft.com/en-us/credentials/browse/) | Filter by role and AI-related skills, then read the current objectives |
| Google Cloud | [Google Cloud certifications](https://cloud.google.com/learn/certification) | Compare foundational and professional pathways |
| AWS | [AWS Certification](https://aws.amazon.com/certification/) | Match the credential level and subject to your intended role |

Exam names, availability, fees, and requirements can change; check the provider before booking. These links do not imply that completing ilearnai awards a credential or guarantees exam readiness. Keep a project and evaluation report alongside any certificate.

## More from this repository

- [General resources](../src/data/resources.ts)
- [Open-source and visual resources](../src/data/openResources.ts)
- [Learning portals](../src/data/portals.ts)
- [Videos](../src/data/videos.ts)
- [Papers](../src/data/papers.ts)

These links open the app's source catalogs. To browse them as a learning interface, [run the portal](development.md#run-locally).
