import type { Roadmap } from './types'

export const roadmaps: Roadmap[] = [
  {
    track: 'ai-research',
    title: 'AI Research roadmap',
    summary: 'From the attention equation to reading frontier model reports critically, in about four months of evenings.',
    stages: [
      {
        title: 'The architecture',
        weeks: 3,
        goal: 'Derive multi-head attention and positional encodings by hand and implement a small decoder.',
        items: [
          { label: 'Why attention replaced recurrence', to: '/courses/ai-research/transformers/why-attention' },
          { label: 'Multi-head attention', to: '/courses/ai-research/transformers/multi-head' },
          { label: 'Positional encodings: sinusoids to RoPE', to: '/courses/ai-research/transformers/positional-encodings' },
          { label: 'Paper: Attention Is All You Need', to: '/papers/attention-is-all-you-need' },
          { label: 'Lab: Attention', to: '/labs/attention' },
        ],
      },
      {
        title: 'Scale and data',
        weeks: 3,
        goal: 'Explain why a 70B model beat a 280B one and compute a training budget from a token count.',
        items: [
          { label: 'From Kaplan to Chinchilla', to: '/courses/ai-research/scaling/kaplan-to-chinchilla' },
          { label: 'Inference-aware scaling', to: '/courses/ai-research/scaling/inference-aware-scaling' },
          { label: 'Paper: Scaling Laws', to: '/papers/scaling-laws' },
          { label: 'Paper: Chinchilla', to: '/papers/chinchilla' },
          { label: 'Paper: GPT-3', to: '/papers/gpt-3' },
        ],
      },
      {
        title: 'Post-training',
        weeks: 4,
        goal: 'Reproduce the DPO derivation and explain each stage of the RLHF pipeline and what can go wrong in it.',
        items: [
          { label: 'The RLHF pipeline', to: '/courses/ai-research/alignment/rlhf-pipeline' },
          { label: 'Deriving DPO', to: '/courses/ai-research/alignment/dpo-derivation' },
          { label: 'Paper: InstructGPT', to: '/papers/instructgpt' },
          { label: 'Paper: DPO', to: '/papers/dpo' },
          { label: 'Paper: Constitutional AI', to: '/papers/constitutional-ai' },
        ],
      },
      {
        title: 'Reasoning and architecture variants',
        weeks: 3,
        goal: 'Read a 2025 reasoning paper and an MoE paper and say what each actually changed.',
        items: [
          { label: "Paper: Let's Verify Step by Step", to: '/papers/lets-verify-step-by-step' },
          { label: 'Paper: DeepSeek-R1', to: '/papers/deepseek-r1' },
          { label: 'Paper: Switch Transformer', to: '/papers/switch-transformer' },
          { label: 'Paper: Mamba', to: '/papers/mamba' },
          { label: 'Glossary: mixture of experts', to: '/glossary/mixture-of-experts' },
        ],
      },
      {
        title: 'Reading a frontier report',
        weeks: 2,
        goal: 'Work through the Llama 3 report and map every section to something earlier in this roadmap.',
        items: [
          { label: 'Paper: The Llama 3 Herd of Models', to: '/papers/llama-3' },
          { label: 'Paper: RoFormer', to: '/papers/roformer' },
          { label: 'Lab: Transformer flow', to: '/labs/transformer-flow' },
        ],
      },
    ],
  },
  {
    track: 'ai-engineering',
    title: 'AI Engineering roadmap',
    summary: 'Build retrieval that is measured, agents whose reliability you can compute, and a routing layer that spends money on purpose.',
    stages: [
      {
        title: 'Embeddings and search',
        weeks: 2,
        goal: 'Explain what an embedding encodes and tune an HNSW index along its recall-latency curve.',
        items: [
          { label: 'What an embedding actually is', to: '/courses/ai-engineering/embeddings/what-is-an-embedding' },
          { label: 'HNSW and approximate nearest neighbours', to: '/courses/ai-engineering/embeddings/hnsw' },
          { label: 'Paper: Dense Passage Retrieval', to: '/papers/dpr' },
          { label: 'Paper: HNSW', to: '/papers/hnsw' },
          { label: 'Glossary: BM25', to: '/glossary/bm25' },
        ],
      },
      {
        title: 'RAG that is evaluated',
        weeks: 3,
        goal: 'Ship hybrid retrieval with a reranker and an eval set that reports retriever and generator numbers separately.',
        items: [
          { label: 'A RAG baseline that is actually good', to: '/courses/ai-engineering/rag/rag-baseline' },
          { label: 'Evaluating RAG end to end', to: '/courses/ai-engineering/rag/rag-evaluation' },
          { label: 'Glossary: chunking', to: '/glossary/chunking' },
          { label: 'Glossary: reciprocal rank fusion', to: '/glossary/reciprocal-rank-fusion' },
          { label: 'Lab: Tokenizer', to: '/labs/tokenizer' },
        ],
      },
      {
        title: 'Agents',
        weeks: 3,
        goal: 'Implement the ReAct loop, then compute the task success rate from per-step rates and fix the worst step.',
        items: [
          { label: 'The agent loop', to: '/courses/ai-engineering/agents/agent-loop' },
          { label: 'Memory and context management', to: '/courses/ai-engineering/agents/agent-memory' },
          { label: 'Paper: ReAct', to: '/papers/react' },
          { label: 'Paper: Chain of Thought', to: '/papers/chain-of-thought' },
          { label: 'Lab: Agent Control Room', to: '/labs/agent-control-room' },
        ],
      },
      {
        title: 'Adapting and routing models',
        weeks: 2,
        goal: 'Fine-tune with LoRA for one task and build a cost-quality router over two or more models.',
        items: [
          { label: 'Paper: LoRA', to: '/papers/lora' },
          { label: 'Glossary: Pareto frontier', to: '/glossary/pareto-frontier' },
          { label: 'Lab: Pareto router', to: '/labs/pareto-router' },
          { label: 'Lab: Timeout architect', to: '/labs/timeout-architect' },
        ],
      },
    ],
  },
  {
    track: 'inference-engineering',
    title: 'Inference Engineering roadmap',
    summary: 'Size memory by hand, understand the two regimes of a forward pass, and then read the serving papers with the numbers already in your head.',
    stages: [
      {
        title: 'Memory arithmetic',
        weeks: 2,
        goal: 'Compute weight and KV cache memory for any model and say how many sequences fit on a given GPU.',
        items: [
          { label: 'The KV cache, sized by hand', to: '/courses/inference-engineering/memory/kv-cache' },
          { label: 'Weight memory and quantisation', to: '/courses/inference-engineering/memory/weights-and-quantisation' },
          { label: 'Lab: KV cache estimator', to: '/labs/kv-cache' },
          { label: 'Glossary: arithmetic intensity', to: '/glossary/arithmetic-intensity' },
        ],
      },
      {
        title: 'The two regimes',
        weeks: 2,
        goal: 'Explain why prefill is compute-bound and decode is memory-bound, with the roofline numbers for one GPU.',
        items: [
          { label: 'Prefill vs decode', to: '/courses/inference-engineering/throughput/prefill-vs-decode' },
          { label: 'Paper: FlashAttention', to: '/papers/flash-attention' },
          { label: 'Paper: GQA', to: '/papers/gqa' },
          { label: 'Glossary: continuous batching', to: '/glossary/continuous-batching' },
        ],
      },
      {
        title: 'Serving systems',
        weeks: 3,
        goal: 'Read the vLLM paper and the speculative decoding papers and predict their speedups for your workload before measuring.',
        items: [
          { label: 'Speculative decoding', to: '/courses/inference-engineering/throughput/speculative-decoding' },
          { label: 'Paper: PagedAttention', to: '/papers/paged-attention' },
          { label: 'Paper: Speculative Decoding', to: '/papers/speculative-decoding' },
          { label: 'Paper: Medusa', to: '/papers/medusa' },
          { label: 'Lab: Sampling playground', to: '/labs/sampling' },
        ],
      },
      {
        title: 'Training-scale parallelism',
        weeks: 3,
        goal: 'Lay out a 70B model across a node with tensor parallelism and explain where ZeRO and pipeline parallelism fit.',
        items: [
          { label: 'Paper: Megatron-LM', to: '/papers/megatron-lm' },
          { label: 'Paper: ZeRO', to: '/papers/zero' },
          { label: 'Glossary: tensor parallelism', to: '/glossary/tensor-parallelism' },
          { label: 'Glossary: pipeline parallelism', to: '/glossary/pipeline-parallelism' },
        ],
      },
    ],
  },
  {
    track: 'system-design',
    title: 'System Design roadmap',
    summary: 'Estimate before you build, pick a consistency model on purpose, and read the three storage papers that every database descends from.',
    stages: [
      {
        title: 'Estimation',
        weeks: 2,
        goal: 'Turn users and request sizes into QPS, bandwidth, and storage within a factor of two.',
        items: [
          { label: 'Back-of-the-envelope estimation', to: '/courses/system-design/fundamentals/back-of-envelope' },
          { label: 'Lab: Capacity calculator', to: '/labs/capacity' },
          { label: 'Glossary: p99 latency', to: '/glossary/p99-latency' },
        ],
      },
      {
        title: 'Consistency',
        weeks: 3,
        goal: 'Define linearizability precisely and say what CAP does and does not force you to give up.',
        items: [
          { label: 'Consistency models', to: '/courses/system-design/fundamentals/consistency-models' },
          { label: 'Glossary: linearizability', to: '/glossary/linearizability' },
          { label: 'Glossary: CAP theorem', to: '/glossary/cap-theorem' },
          { label: 'Paper: Raft', to: '/papers/raft' },
        ],
      },
      {
        title: 'The storage papers',
        weeks: 3,
        goal: 'Compare Dynamo and Spanner on the same workload and defend a choice between them.',
        items: [
          { label: 'Paper: Dynamo', to: '/papers/dynamo' },
          { label: 'Paper: Spanner', to: '/papers/spanner' },
          { label: 'Paper: The LSM-Tree', to: '/papers/lsm-tree' },
          { label: 'Glossary: LSM tree', to: '/glossary/lsm-tree' },
        ],
      },
      {
        title: 'Reliability under load',
        weeks: 2,
        goal: 'Design timeouts, retries, and back-pressure for a fan-out service so that overload degrades instead of collapsing.',
        items: [
          { label: 'Glossary: back-pressure', to: '/glossary/back-pressure' },
          { label: 'Lab: Timeout architect', to: '/labs/timeout-architect' },
          { label: 'Lab: Agent Control Room', to: '/labs/agent-control-room' },
        ],
      },
    ],
  },
  {
    track: 'ml-math',
    title: 'ML Mathematics roadmap',
    summary: 'Enough linear algebra, calculus, and probability to read a method section without skipping the equations.',
    stages: [
      {
        title: 'Matrices as maps',
        weeks: 3,
        goal: 'See a matrix as a transformation, factor one with the SVD, and explain what rank means for a weight update.',
        items: [
          { label: 'Matrices as linear maps', to: '/courses/ml-math/linear-algebra/matrices-as-maps' },
          { label: 'Glossary: SVD', to: '/glossary/svd' },
          { label: 'Paper: LoRA', to: '/papers/lora' },
          { label: 'Lab: Attention', to: '/labs/attention' },
        ],
      },
      {
        title: 'Gradients',
        weeks: 3,
        goal: 'Derive the gradient of a two-layer network by hand and watch gradient descent move on a loss surface.',
        items: [
          { label: 'Gradients and the chain rule at scale', to: '/courses/ml-math/linear-algebra/gradients' },
          { label: 'Glossary: gradient descent', to: '/glossary/gradient-descent' },
          { label: 'Lab: Gradient descent', to: '/labs/gradient-descent' },
        ],
      },
      {
        title: 'Optimisation in practice',
        weeks: 2,
        goal: 'Explain why Adam works per-parameter and what dropout is an approximation of.',
        items: [
          { label: 'Paper: Adam', to: '/papers/adam' },
          { label: 'Paper: Dropout', to: '/papers/dropout' },
          { label: 'Glossary: Adam', to: '/glossary/adam' },
        ],
      },
      {
        title: 'Probability and sampling',
        weeks: 2,
        goal: 'Connect cross-entropy, perplexity, softmax, and the sampling knobs into one picture of a language model output.',
        items: [
          { label: 'Glossary: softmax', to: '/glossary/softmax' },
          { label: 'Glossary: perplexity', to: '/glossary/perplexity' },
          { label: 'Glossary: KL divergence', to: '/glossary/kl-divergence' },
          { label: 'Lab: Sampling playground', to: '/labs/sampling' },
        ],
      },
    ],
  },
]

export function findRoadmap(track: string) {
  return roadmaps.find((r) => r.track === track)
}

// ---- Zero to AI ecosystem: the four new tracks as one staged route ----
roadmaps.unshift(
  {
    track: 'start-here',
    title: 'Start Here roadmap (Level 0)',
    summary: 'From never having written code to running Python on real data, in about six weeks of evenings.',
    stages: [
      { title: 'Understand the machine', weeks: 1, goal: 'Explain what a computer, a file, a web request and a program are, in your own words.', items: [
        { label: 'What a computer does', to: '/courses/start-here/how-a-computer-works/input-process-store-output' },
        { label: 'How a web page reaches you', to: '/courses/start-here/how-a-computer-works/how-the-internet-works' },
        { label: 'What a program is', to: '/courses/start-here/how-a-computer-works/what-a-program-is' },
      ] },
      { title: 'Write Python', weeks: 2, goal: 'Write a 30-line program with a loop, a function and a list, and run it from the terminal.', items: [
        { label: 'Install Python and run your first file', to: '/courses/start-here/first-python/install-and-run' },
        { label: 'Variables and types', to: '/courses/start-here/first-python/variables-and-types' },
        { label: 'Loops', to: '/courses/start-here/first-python/loops' },
        { label: 'Functions', to: '/courses/start-here/first-python/functions' },
        { label: 'Practice: Kaggle Learn Python', to: '/hub?tab=practicals&track=start-here' },
      ] },
      { title: 'Work with data and tools', weeks: 2, goal: 'Load a CSV with pandas, commit your code to GitHub, and call a public API.', items: [
        { label: 'Tables with pandas', to: '/courses/start-here/python-for-data/tables-with-pandas' },
        { label: 'Git and GitHub', to: '/courses/start-here/builders-tools/git-and-github' },
        { label: 'APIs and JSON', to: '/courses/start-here/builders-tools/apis-and-json' },
        { label: 'Keys, secrets and environment variables', to: '/courses/start-here/builders-tools/secrets-and-env' },
      ] },
      { title: 'Understand data', weeks: 1, goal: 'Describe a data set by its rows, columns and labels, and clean a messy one.', items: [
        { label: 'What data is', to: '/courses/start-here/data-the-raw-material/what-data-is' },
        { label: 'Cleaning data', to: '/courses/start-here/data-the-raw-material/cleaning-data' },
        { label: 'Practice paper', to: '/practice' },
      ] },
    ],
  },
  {
    track: 'math-from-zero',
    title: 'Mathematics from Zero roadmap (Level 0)',
    summary: 'The four pieces of mathematics that every AI lesson uses, in about five weeks, with no prior algebra assumed.',
    stages: [
      { title: 'Numbers and functions', weeks: 1, goal: 'Read y = mx + b as a model and a log scale as a chart.', items: [
        { label: 'Functions as machines', to: '/courses/math-from-zero/numbers-and-functions/functions-as-machines' },
        { label: 'Lines and slopes', to: '/courses/math-from-zero/numbers-and-functions/lines-and-slopes' },
        { label: 'Exponents and logarithms', to: '/courses/math-from-zero/numbers-and-functions/exponents-and-logs' },
      ] },
      { title: 'Vectors and matrices', weeks: 2, goal: 'Compute a dot product, a cosine similarity and a 2x2 matrix product by hand.', items: [
        { label: 'A vector is a list of numbers', to: '/courses/math-from-zero/vectors-and-matrices/what-a-vector-is' },
        { label: 'The dot product', to: '/courses/math-from-zero/vectors-and-matrices/dot-product' },
        { label: 'Matrix multiplication by hand', to: '/courses/math-from-zero/vectors-and-matrices/matrix-multiplication' },
        { label: 'Lab: Attention visualiser', to: '/labs/attention' },
      ] },
      { title: 'Change', weeks: 1, goal: 'Run three steps of gradient descent on a one-variable function by hand.', items: [
        { label: 'Rate of change', to: '/courses/math-from-zero/change-and-gradients/rate-of-change' },
        { label: 'Follow the slope', to: '/courses/math-from-zero/change-and-gradients/follow-the-slope' },
        { label: 'Lab: Gradient descent playground', to: '/labs/gradient-descent' },
      ] },
      { title: 'Chance', weeks: 1, goal: 'Apply Bayes rule to the spam table and compute a cross-entropy in bits.', items: [
        { label: 'Conditional probability and Bayes rule', to: '/courses/math-from-zero/chance/conditional-and-bayes' },
        { label: 'Distributions you will meet', to: '/courses/math-from-zero/chance/distributions' },
        { label: 'Surprise, entropy and cross-entropy', to: '/courses/math-from-zero/chance/entropy-and-cross-entropy' },
      ] },
    ],
  },
  {
    track: 'ai-foundations',
    title: 'AI Foundations roadmap (Level 1)',
    summary: 'From the definition of machine learning to training a small network and understanding what a language model is, in about eight weeks.',
    stages: [
      { title: 'The map', weeks: 1, goal: 'Draw the learning loop and the AI ecosystem from memory.', items: [
        { label: 'The learning loop', to: '/courses/ai-foundations/what-ai-is/the-learning-loop' },
        { label: 'The AI ecosystem map', to: '/courses/ai-foundations/what-ai-is/the-ai-ecosystem-map' },
      ] },
      { title: 'Classic models', weeks: 2, goal: 'Fit and evaluate a regression and a classifier in scikit-learn on a Kaggle data set.', items: [
        { label: 'Linear regression', to: '/courses/ai-foundations/first-models/linear-regression' },
        { label: 'Classification', to: '/courses/ai-foundations/first-models/classification' },
        { label: 'Overfitting and generalisation', to: '/courses/ai-foundations/first-models/overfitting-and-generalisation' },
        { label: 'Data: Titanic on Kaggle', to: '/hub?tab=datasets&track=ai-foundations' },
      ] },
      { title: 'Neural networks', weeks: 2, goal: 'Compute a forward pass and one backpropagation step by hand, then train the same network in PyTorch.', items: [
        { label: 'A neuron', to: '/courses/ai-foundations/neural-networks/a-neuron' },
        { label: 'Backpropagation', to: '/courses/ai-foundations/neural-networks/backpropagation' },
        { label: 'Training in PyTorch', to: '/courses/ai-foundations/neural-networks/training-in-pytorch' },
        { label: 'Lab: Transformer block, animated', to: '/labs/transformer-flow' },
      ] },
      { title: 'Language models', weeks: 2, goal: 'Explain tokens, embeddings, attention and how an LLM is trained, and write a prompt that works.', items: [
        { label: 'Tokens', to: '/courses/ai-foundations/language-as-numbers/tokens' },
        { label: 'Attention and the transformer, gently', to: '/courses/ai-foundations/language-as-numbers/attention-gently' },
        { label: 'How an LLM is made', to: '/courses/ai-foundations/language-as-numbers/how-an-llm-is-made' },
        { label: 'Prompting that works', to: '/courses/ai-foundations/using-models/prompting' },
        { label: 'Lab: Tokenizer trainer', to: '/labs/tokenizer' },
      ] },
      { title: 'Choose and judge models', weeks: 1, goal: 'Pick a model for a task with a decision table and evaluate it on your own 20-question test set.', items: [
        { label: 'Choosing a model', to: '/courses/ai-foundations/using-models/choosing-a-model' },
        { label: 'Evaluating a model and basic safety', to: '/courses/ai-foundations/using-models/evaluating-and-safety' },
        { label: 'Paper: A Few Useful Things to Know About Machine Learning', to: '/papers' },
      ] },
    ],
  },
  {
    track: 'build-ai-ecosystem',
    title: 'Build the AI Ecosystem roadmap (Level 1)',
    summary: 'One project, six modules: from an API key to a deployed, monitored AI service with retrieval, agents and a fine-tuned model, in about ten weeks.',
    stages: [
      { title: 'Workshop and first call', weeks: 1, goal: 'Call a model from Python three ways: Anthropic API, OpenAI-compatible endpoint, local Ollama.', items: [
        { label: 'The project plan and architecture', to: '/courses/build-ai-ecosystem/set-up-your-workshop/the-project-plan' },
        { label: 'Call a model', to: '/courses/build-ai-ecosystem/set-up-your-workshop/call-a-model' },
      ] },
      { title: 'Chat application', weeks: 2, goal: 'Ship a streaming chat with a web UI and validated JSON output.', items: [
        { label: 'A chat loop in the terminal', to: '/courses/build-ai-ecosystem/chat-application/chat-loop' },
        { label: 'Structured output', to: '/courses/build-ai-ecosystem/chat-application/structured-output' },
        { label: 'A web UI', to: '/courses/build-ai-ecosystem/chat-application/web-ui' },
      ] },
      { title: 'Retrieval', weeks: 2, goal: 'Answer questions over your own documents with citations and a measured hit rate.', items: [
        { label: 'Why models need your documents', to: '/courses/build-ai-ecosystem/retrieval-rag/why-rag' },
        { label: 'Embeddings and a vector store', to: '/courses/build-ai-ecosystem/retrieval-rag/embed-and-store' },
        { label: 'Evaluating RAG', to: '/courses/build-ai-ecosystem/retrieval-rag/evaluate-rag' },
        { label: 'Lab: Model router and Pareto explorer', to: '/labs/pareto-router' },
      ] },
      { title: 'Agents', weeks: 2, goal: 'Run a tool-using agent with memory, an MCP server and guardrails.', items: [
        { label: 'Tool calling', to: '/courses/build-ai-ecosystem/agents-and-tools/tool-calling' },
        { label: 'The agent loop', to: '/courses/build-ai-ecosystem/agents-and-tools/the-agent-loop' },
        { label: 'Guardrails', to: '/courses/build-ai-ecosystem/agents-and-tools/guardrails' },
        { label: 'Lab: Agent Control Room', to: '/labs/agent-control-room' },
      ] },
      { title: 'Train and ship', weeks: 3, goal: 'Fine-tune a small model with LoRA, deploy the whole service in Docker with monitoring, and present the capstone.', items: [
        { label: 'Fine-tune a small open model with LoRA', to: '/courses/build-ai-ecosystem/train-your-own/lora-fine-tune' },
        { label: 'A Docker image for your service', to: '/courses/build-ai-ecosystem/ship-it/dockerise' },
        { label: 'Observability', to: '/courses/build-ai-ecosystem/ship-it/observability' },
        { label: 'Capstone: the full ecosystem', to: '/courses/build-ai-ecosystem/ship-it/capstone' },
      ] },
    ],
  },
)
