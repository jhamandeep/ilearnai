import type { Level } from './types'

// Links out to the portals where learners run code, fetch data, pick models
// and read papers: Hugging Face, Kaggle, Google Colab, arXiv and friends.
// Every URL here is a stable, public page.

export type ModelTask = 'chat' | 'reasoning' | 'code' | 'embedding' | 'reranker' | 'vision' | 'speech' | 'image generation' | 'classic NLP' | 'robotics'
export type Access = 'open weights' | 'API only'

export interface ModelCard {
  name: string
  org: string
  task: ModelTask
  access: Access
  size: string // parameters, or "various"
  context: string // context window
  licence: string
  runOn: string // where a learner can run it
  bestFor: string
  level: Level
  hf?: string // Hugging Face repo id
  url: string // model page or provider docs
  paper?: string // arXiv or report url
  tracks: string[]
}

export const models: ModelCard[] = [
  // ---- chat and reasoning, API ----
  { name: 'Claude Sonnet 5.5', org: 'Anthropic', task: 'chat', access: 'API only', size: 'undisclosed', context: '200K tokens', licence: 'Commercial API', runOn: 'Anthropic API', bestFor: 'The default model for the build track: tool use, long documents, coding, structured output.', level: 'beginner', url: 'https://docs.anthropic.com/en/docs/about-claude/models', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { name: 'Claude Haiku 5.5', org: 'Anthropic', task: 'chat', access: 'API only', size: 'undisclosed', context: '200K tokens', licence: 'Commercial API', runOn: 'Anthropic API', bestFor: 'Fast and cheap: routing, classification, extraction, the cheap side of a model router.', level: 'beginner', url: 'https://docs.anthropic.com/en/docs/about-claude/models', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { name: 'GPT (OpenAI models)', org: 'OpenAI', task: 'chat', access: 'API only', size: 'undisclosed', context: '128K+ tokens', licence: 'Commercial API', runOn: 'OpenAI API; the same request shape many open servers copy', bestFor: 'Learning the OpenAI-compatible request format that Ollama, vLLM and many providers accept.', level: 'beginner', url: 'https://platform.openai.com/docs/models', tracks: ['build-ai-ecosystem'] },
  { name: 'Gemini', org: 'Google', task: 'chat', access: 'API only', size: 'undisclosed', context: '1M tokens', licence: 'Commercial API', runOn: 'Google AI Studio (free tier)', bestFor: 'Very long context experiments and a free tier for students.', level: 'beginner', url: 'https://ai.google.dev/gemini-api/docs/models', tracks: ['build-ai-ecosystem'] },
  // ---- chat, open weights ----
  { name: 'Llama 3.1 8B Instruct', org: 'Meta', task: 'chat', access: 'open weights', size: '8B', context: '128K tokens', licence: 'Llama 3.1 Community', runOn: 'Ollama, vLLM, a 16 GB GPU, or 8 GB with 4-bit quantisation', bestFor: 'The standard open chat model for local RAG and agent experiments.', level: 'beginner', hf: 'meta-llama/Llama-3.1-8B-Instruct', url: 'https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct', paper: 'https://arxiv.org/abs/2407.21783', tracks: ['build-ai-ecosystem', 'inference-engineering', 'ai-research'] },
  { name: 'Llama 3.3 70B Instruct', org: 'Meta', task: 'chat', access: 'open weights', size: '70B', context: '128K tokens', licence: 'Llama 3.3 Community', runOn: 'vLLM on 2 or more 80 GB GPUs, or hosted providers', bestFor: 'Open-weights quality close to API models; the model behind many inference engineering examples.', level: 'intermediate', hf: 'meta-llama/Llama-3.3-70B-Instruct', url: 'https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct', paper: 'https://arxiv.org/abs/2407.21783', tracks: ['inference-engineering', 'ai-research'] },
  { name: 'Qwen2.5 7B Instruct', org: 'Alibaba', task: 'chat', access: 'open weights', size: '7B', context: '128K tokens', licence: 'Apache 2.0', runOn: 'Ollama, vLLM, a 16 GB GPU', bestFor: 'Permissive licence, strong multilingual and coding ability, good fine-tuning base.', level: 'beginner', hf: 'Qwen/Qwen2.5-7B-Instruct', url: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct', paper: 'https://arxiv.org/abs/2412.15115', tracks: ['build-ai-ecosystem', 'inference-engineering'] },
  { name: 'Qwen2.5 0.5B Instruct', org: 'Alibaba', task: 'chat', access: 'open weights', size: '0.5B', context: '32K tokens', licence: 'Apache 2.0', runOn: 'Any laptop CPU; a free Colab T4 for fine-tuning', bestFor: 'The model the build track fine-tunes with LoRA: small enough to train in minutes.', level: 'beginner', hf: 'Qwen/Qwen2.5-0.5B-Instruct', url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct', paper: 'https://arxiv.org/abs/2412.15115', tracks: ['build-ai-ecosystem', 'ai-foundations'] },
  { name: 'SmolLM2 360M Instruct', org: 'Hugging Face', task: 'chat', access: 'open weights', size: '360M', context: '8K tokens', licence: 'Apache 2.0', runOn: 'CPU, browser, phone', bestFor: 'Seeing a complete, documented training recipe for a small model; fast experiments.', level: 'beginner', hf: 'HuggingFaceTB/SmolLM2-360M-Instruct', url: 'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct', paper: 'https://arxiv.org/abs/2502.02737', tracks: ['ai-foundations', 'build-ai-ecosystem'] },
  { name: 'Mistral 7B Instruct v0.3', org: 'Mistral AI', task: 'chat', access: 'open weights', size: '7B', context: '32K tokens', licence: 'Apache 2.0', runOn: 'Ollama, vLLM, a 16 GB GPU', bestFor: 'A clean 7B baseline; its paper introduced sliding-window attention to many readers.', level: 'beginner', hf: 'mistralai/Mistral-7B-Instruct-v0.3', url: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3', paper: 'https://arxiv.org/abs/2310.06825', tracks: ['build-ai-ecosystem', 'ai-research'] },
  { name: 'Gemma 2 9B IT', org: 'Google', task: 'chat', access: 'open weights', size: '9B', context: '8K tokens', licence: 'Gemma Terms', runOn: 'Ollama, vLLM, a 24 GB GPU', bestFor: 'A well-documented open model with a detailed technical report on distillation.', level: 'intermediate', hf: 'google/gemma-2-9b-it', url: 'https://huggingface.co/google/gemma-2-9b-it', paper: 'https://arxiv.org/abs/2408.00118', tracks: ['ai-research'] },
  { name: 'Phi-3.5 Mini Instruct', org: 'Microsoft', task: 'chat', access: 'open weights', size: '3.8B', context: '128K tokens', licence: 'MIT', runOn: 'Laptop GPU or CPU with quantisation', bestFor: 'What careful data curation does for a small model; MIT licence.', level: 'beginner', hf: 'microsoft/Phi-3.5-mini-instruct', url: 'https://huggingface.co/microsoft/Phi-3.5-mini-instruct', paper: 'https://arxiv.org/abs/2404.14219', tracks: ['ai-foundations', 'build-ai-ecosystem'] },
  { name: 'DeepSeek-R1', org: 'DeepSeek', task: 'reasoning', access: 'open weights', size: '671B MoE (37B active)', context: '128K tokens', licence: 'MIT', runOn: 'Hosted providers; distilled versions run locally', bestFor: 'The open reasoning model whose paper the research track reads; distilled 7B and 14B versions exist.', level: 'advanced', hf: 'deepseek-ai/DeepSeek-R1', url: 'https://huggingface.co/deepseek-ai/DeepSeek-R1', paper: 'https://arxiv.org/abs/2501.12948', tracks: ['ai-research'] },
  { name: 'DeepSeek-V3', org: 'DeepSeek', task: 'chat', access: 'open weights', size: '671B MoE (37B active)', context: '128K tokens', licence: 'MIT (code), model licence', runOn: 'Hosted providers or a multi-node GPU cluster', bestFor: 'The mixture-of-experts and FP8 training report behind the research track lessons.', level: 'advanced', hf: 'deepseek-ai/DeepSeek-V3', url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3', paper: 'https://arxiv.org/abs/2412.19437', tracks: ['ai-research', 'inference-engineering'] },
  // ---- code ----
  { name: 'Qwen2.5 Coder 7B Instruct', org: 'Alibaba', task: 'code', access: 'open weights', size: '7B', context: '128K tokens', licence: 'Apache 2.0', runOn: 'Ollama, vLLM', bestFor: 'A local coding assistant and a base for code fine-tuning.', level: 'intermediate', hf: 'Qwen/Qwen2.5-Coder-7B-Instruct', url: 'https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct', paper: 'https://arxiv.org/abs/2409.12186', tracks: ['build-ai-ecosystem'] },
  // ---- embeddings and rerankers ----
  { name: 'all-MiniLM-L6-v2', org: 'Sentence Transformers', task: 'embedding', access: 'open weights', size: '22M', context: '256 tokens', licence: 'Apache 2.0', runOn: 'CPU, in seconds', bestFor: 'The first embedding model for a RAG prototype: tiny, fast, 384 dimensions.', level: 'beginner', hf: 'sentence-transformers/all-MiniLM-L6-v2', url: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2', paper: 'https://arxiv.org/abs/1908.10084', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { name: 'BGE-M3', org: 'BAAI', task: 'embedding', access: 'open weights', size: '568M', context: '8K tokens', licence: 'MIT', runOn: 'GPU recommended; CPU works', bestFor: 'Dense, sparse and multi-vector retrieval in one model, 100+ languages.', level: 'intermediate', hf: 'BAAI/bge-m3', url: 'https://huggingface.co/BAAI/bge-m3', paper: 'https://arxiv.org/abs/2402.03216', tracks: ['ai-engineering', 'build-ai-ecosystem'] },
  { name: 'E5 Large v2', org: 'Microsoft', task: 'embedding', access: 'open weights', size: '335M', context: '512 tokens', licence: 'MIT', runOn: 'GPU recommended', bestFor: 'A strong English retrieval model; note its "query:" and "passage:" prefixes.', level: 'intermediate', hf: 'intfloat/e5-large-v2', url: 'https://huggingface.co/intfloat/e5-large-v2', paper: 'https://arxiv.org/abs/2212.03533', tracks: ['ai-engineering'] },
  { name: 'Nomic Embed Text v1.5', org: 'Nomic', task: 'embedding', access: 'open weights', size: '137M', context: '8K tokens', licence: 'Apache 2.0', runOn: 'CPU or GPU; also in Ollama', bestFor: 'Long-context embeddings with Matryoshka dimensions you can truncate.', level: 'intermediate', hf: 'nomic-ai/nomic-embed-text-v1.5', url: 'https://huggingface.co/nomic-ai/nomic-embed-text-v1.5', paper: 'https://arxiv.org/abs/2402.01613', tracks: ['ai-engineering', 'build-ai-ecosystem'] },
  { name: 'BGE Reranker v2 M3', org: 'BAAI', task: 'reranker', access: 'open weights', size: '568M', context: '8K tokens', licence: 'Apache 2.0', runOn: 'GPU recommended', bestFor: 'Reordering the top 50 retrieved chunks before they reach the model.', level: 'intermediate', hf: 'BAAI/bge-reranker-v2-m3', url: 'https://huggingface.co/BAAI/bge-reranker-v2-m3', tracks: ['ai-engineering', 'build-ai-ecosystem'] },
  { name: 'MS MARCO MiniLM Cross-Encoder', org: 'Sentence Transformers', task: 'reranker', access: 'open weights', size: '22M', context: '512 tokens', licence: 'Apache 2.0', runOn: 'CPU', bestFor: 'A tiny cross-encoder to learn how reranking differs from embedding similarity.', level: 'beginner', hf: 'cross-encoder/ms-marco-MiniLM-L-6-v2', url: 'https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  // ---- classic NLP ----
  { name: 'BERT base uncased', org: 'Google', task: 'classic NLP', access: 'open weights', size: '110M', context: '512 tokens', licence: 'Apache 2.0', runOn: 'CPU', bestFor: 'The encoder in the BERT paper; fine-tune it for classification in an afternoon.', level: 'beginner', hf: 'google-bert/bert-base-uncased', url: 'https://huggingface.co/google-bert/bert-base-uncased', paper: 'https://arxiv.org/abs/1810.04805', tracks: ['ai-foundations', 'ai-research'] },
  { name: 'DistilBERT SST-2', org: 'Hugging Face', task: 'classic NLP', access: 'open weights', size: '67M', context: '512 tokens', licence: 'Apache 2.0', runOn: 'CPU', bestFor: 'A ready sentiment classifier: your first pipeline() call in the Transformers library.', level: 'beginner', hf: 'distilbert/distilbert-base-uncased-finetuned-sst-2-english', url: 'https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english', paper: 'https://arxiv.org/abs/1910.01108', tracks: ['ai-foundations'] },
  { name: 'GPT-2', org: 'OpenAI', task: 'classic NLP', access: 'open weights', size: '124M to 1.5B', context: '1K tokens', licence: 'MIT', runOn: 'CPU', bestFor: 'The model Karpathy reproduces from scratch; generate text locally and inspect every layer.', level: 'beginner', hf: 'openai-community/gpt2', url: 'https://huggingface.co/openai-community/gpt2', paper: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf', tracks: ['ai-foundations', 'ai-research'] },
  // ---- vision, speech, images ----
  { name: 'CLIP ViT-B/32', org: 'OpenAI', task: 'vision', access: 'open weights', size: '151M', context: 'image + 77 tokens', licence: 'MIT', runOn: 'CPU or GPU', bestFor: 'Image and text in one embedding space: zero-shot image classification and image search.', level: 'intermediate', hf: 'openai/clip-vit-base-patch32', url: 'https://huggingface.co/openai/clip-vit-base-patch32', paper: 'https://arxiv.org/abs/2103.00020', tracks: ['ai-engineering', 'ai-research'] },
  { name: 'ViT base', org: 'Google', task: 'vision', access: 'open weights', size: '86M', context: '224x224 image', licence: 'Apache 2.0', runOn: 'CPU or GPU', bestFor: 'The transformer applied to image patches; fine-tune on CIFAR-10 in a notebook.', level: 'intermediate', hf: 'google/vit-base-patch16-224', url: 'https://huggingface.co/google/vit-base-patch16-224', paper: 'https://arxiv.org/abs/2010.11929', tracks: ['ai-research'] },
  { name: 'Whisper large v3', org: 'OpenAI', task: 'speech', access: 'open weights', size: '1.5B', context: '30 s audio windows', licence: 'Apache 2.0', runOn: 'GPU; small and base variants run on CPU', bestFor: 'Speech to text in 100 languages; add voice input to the chat app.', level: 'intermediate', hf: 'openai/whisper-large-v3', url: 'https://huggingface.co/openai/whisper-large-v3', paper: 'https://arxiv.org/abs/2212.04356', tracks: ['build-ai-ecosystem'] },
  { name: 'Stable Diffusion XL', org: 'Stability AI', task: 'image generation', access: 'open weights', size: '3.5B', context: 'text prompt', licence: 'CreativeML OpenRAIL++-M', runOn: 'A 12 GB GPU or Colab', bestFor: 'Learning diffusion models by running one; the diffusers library tutorial uses it.', level: 'intermediate', hf: 'stabilityai/stable-diffusion-xl-base-1.0', url: 'https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0', paper: 'https://arxiv.org/abs/2307.01952', tracks: ['ai-research'] },
  { name: 'FLUX.1 schnell', org: 'Black Forest Labs', task: 'image generation', access: 'open weights', size: '12B', context: 'text prompt', licence: 'Apache 2.0', runOn: 'A 24 GB GPU, or quantised on less', bestFor: 'A current open image model with a permissive licence and 1 to 4 step generation.', level: 'advanced', hf: 'black-forest-labs/FLUX.1-schnell', url: 'https://huggingface.co/black-forest-labs/FLUX.1-schnell', tracks: ['ai-research'] },
  // ---- robotics ----
  { name: 'LeRobot models', org: 'Hugging Face', task: 'robotics', access: 'open weights', size: 'various', context: 'camera + state', licence: 'Apache 2.0', runOn: 'A laptop for simulation; a low-cost arm for real tests', bestFor: 'Pretrained policies (ACT, Diffusion Policy, SmolVLA) with datasets and training code in one library.', level: 'advanced', url: 'https://huggingface.co/lerobot', paper: 'https://arxiv.org/abs/2506.01844', tracks: ['open-robotics'] },
]

export type DatasetTask = 'images' | 'text classification' | 'question answering' | 'language modelling' | 'instruction tuning' | 'preferences' | 'evaluation' | 'tabular' | 'robotics'

export interface DatasetCard {
  name: string
  portal: 'Hugging Face' | 'Kaggle' | 'Other'
  task: DatasetTask
  size: string
  licence: string
  url: string
  use: string // what to do with it
  level: Level
  tracks: string[]
}

export const datasets: DatasetCard[] = [
  { name: 'Titanic', portal: 'Kaggle', task: 'tabular', size: '891 rows', licence: 'Kaggle competition rules', url: 'https://www.kaggle.com/competitions/titanic', use: 'Your first classifier: predict survival from age, class and fare. The classic first Kaggle competition.', level: 'foundations', tracks: ['start-here', 'ai-foundations'] },
  { name: 'House Prices', portal: 'Kaggle', task: 'tabular', size: '1,460 rows, 79 columns', licence: 'Kaggle competition rules', url: 'https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques', use: 'Regression with real messy columns: the grown-up version of the 6-row house table in the lessons.', level: 'beginner', tracks: ['ai-foundations', 'start-here'] },
  { name: 'Iris', portal: 'Kaggle', task: 'tabular', size: '150 rows', licence: 'CC0', url: 'https://www.kaggle.com/datasets/uciml/iris', use: 'Three flower species, four measurements. Fits on one screen, so you can check every model by eye.', level: 'foundations', tracks: ['start-here', 'ai-foundations'] },
  { name: 'SMS Spam Collection', portal: 'Kaggle', task: 'text classification', size: '5,572 messages', licence: 'UCI', url: 'https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset', use: 'The spam filter from the lessons, on real messages. Rules first, then a learned model.', level: 'beginner', tracks: ['ai-foundations'] },
  { name: 'Digit Recognizer (MNIST)', portal: 'Kaggle', task: 'images', size: '42,000 images', licence: 'Kaggle competition rules', url: 'https://www.kaggle.com/competitions/digit-recognizer', use: 'Handwritten digits as a Kaggle competition, with public notebooks to learn from.', level: 'beginner', tracks: ['ai-foundations'] },
  { name: 'MNIST', portal: 'Hugging Face', task: 'images', size: '70,000 images', licence: 'MIT', url: 'https://huggingface.co/datasets/ylecun/mnist', use: 'The data set in the 3Blue1Brown videos. Train the neural-network module network on it.', level: 'beginner', tracks: ['ai-foundations', 'ml-math'] },
  { name: 'Fashion-MNIST', portal: 'Hugging Face', task: 'images', size: '70,000 images', licence: 'MIT', url: 'https://huggingface.co/datasets/zalando-datasets/fashion_mnist', use: 'Same shape as MNIST but harder; a good second image problem.', level: 'beginner', tracks: ['ai-foundations'] },
  { name: 'CIFAR-10', portal: 'Hugging Face', task: 'images', size: '60,000 colour images', licence: 'Unknown (research use)', url: 'https://huggingface.co/datasets/uoft-cs/cifar10', use: 'Ten classes of small colour photos; the standard first convolutional network benchmark.', level: 'intermediate', tracks: ['ai-foundations', 'ai-research'] },
  { name: 'IMDB reviews', portal: 'Hugging Face', task: 'text classification', size: '50,000 reviews', licence: 'Other', url: 'https://huggingface.co/datasets/stanfordnlp/imdb', use: 'Sentiment classification: fine-tune DistilBERT or prompt a model and compare.', level: 'beginner', tracks: ['ai-foundations', 'ai-engineering'] },
  { name: 'AG News', portal: 'Hugging Face', task: 'text classification', size: '127,600 articles', licence: 'Unknown', url: 'https://huggingface.co/datasets/fancyzhx/ag_news', use: 'Four-class news topic classification; a quick embeddings-plus-logistic-regression exercise.', level: 'beginner', tracks: ['ai-foundations', 'ai-engineering'] },
  { name: 'SQuAD', portal: 'Hugging Face', task: 'question answering', size: '100,000 questions', licence: 'CC BY-SA 4.0', url: 'https://huggingface.co/datasets/rajpurkar/squad', use: 'Questions with answers inside a paragraph. Build a RAG test set from it.', level: 'intermediate', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { name: 'GLUE', portal: 'Hugging Face', task: 'evaluation', size: '9 tasks', licence: 'Various', url: 'https://huggingface.co/datasets/nyu-mll/glue', use: 'The benchmark suite BERT was judged on. Learn what a benchmark is by running one task.', level: 'intermediate', tracks: ['ai-research'] },
  { name: 'WikiText-103', portal: 'Hugging Face', task: 'language modelling', size: '103M tokens', licence: 'CC BY-SA 3.0', url: 'https://huggingface.co/datasets/Salesforce/wikitext', use: 'Train a small language model and report perplexity, as in the research track.', level: 'intermediate', tracks: ['ai-research', 'ml-math'] },
  { name: 'FineWeb-Edu', portal: 'Hugging Face', task: 'language modelling', size: '1.3T tokens', licence: 'ODC-By', url: 'https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu', use: 'A modern pretraining corpus with its filtering recipe documented. Read the card; stream a sample.', level: 'advanced', tracks: ['ai-research'] },
  { name: 'The Pile', portal: 'Hugging Face', task: 'language modelling', size: '825 GB', licence: 'Various', url: 'https://huggingface.co/datasets/EleutherAI/pile', use: 'The 2020 open pretraining mix; compare its composition with the data-mixture lesson.', level: 'advanced', tracks: ['ai-research'] },
  { name: 'Alpaca', portal: 'Hugging Face', task: 'instruction tuning', size: '52,000 pairs', licence: 'CC BY-NC 4.0', url: 'https://huggingface.co/datasets/tatsu-lab/alpaca', use: 'The data set that started cheap instruction tuning. Inspect the JSON format before you build your own.', level: 'beginner', tracks: ['build-ai-ecosystem'] },
  { name: 'Dolly 15k', portal: 'Hugging Face', task: 'instruction tuning', size: '15,000 pairs', licence: 'CC BY-SA 3.0', url: 'https://huggingface.co/datasets/databricks/databricks-dolly-15k', use: 'Human-written instructions with a commercial-friendly licence; a good fine-tuning starter.', level: 'beginner', tracks: ['build-ai-ecosystem'] },
  { name: 'OpenAssistant Conversations', portal: 'Hugging Face', task: 'instruction tuning', size: '161,000 messages', licence: 'Apache 2.0', url: 'https://huggingface.co/datasets/OpenAssistant/oasst1', use: 'Multi-turn conversation trees with quality ratings; see what real chat training data looks like.', level: 'intermediate', tracks: ['build-ai-ecosystem', 'ai-research'] },
  { name: 'Anthropic HH-RLHF', portal: 'Hugging Face', task: 'preferences', size: '170,000 comparisons', licence: 'MIT', url: 'https://huggingface.co/datasets/Anthropic/hh-rlhf', use: 'Chosen and rejected responses: the raw material of the RLHF and DPO lessons.', level: 'advanced', tracks: ['ai-research'] },
  { name: 'UltraFeedback binarized', portal: 'Hugging Face', task: 'preferences', size: '64,000 pairs', licence: 'MIT', url: 'https://huggingface.co/datasets/HuggingFaceH4/ultrafeedback_binarized', use: 'The preference set used to train Zephyr with DPO; run the DPO derivation on real pairs.', level: 'advanced', tracks: ['ai-research'] },
  { name: 'GSM8K', portal: 'Hugging Face', task: 'evaluation', size: '8,500 problems', licence: 'MIT', url: 'https://huggingface.co/datasets/openai/gsm8k', use: 'Grade-school maths word problems: the benchmark in the chain-of-thought and reasoning lessons.', level: 'intermediate', tracks: ['ai-research', 'ai-foundations'] },
  { name: 'MMLU', portal: 'Hugging Face', task: 'evaluation', size: '15,900 questions, 57 subjects', licence: 'MIT', url: 'https://huggingface.co/datasets/cais/mmlu', use: 'The multiple-choice benchmark every model report cites. Score a model on one subject yourself.', level: 'intermediate', tracks: ['ai-foundations', 'ai-research'] },
  { name: 'LeRobot PushT', portal: 'Hugging Face', task: 'robotics', size: '206 episodes', licence: 'MIT', url: 'https://huggingface.co/datasets/lerobot/pusht', use: 'A small robot-learning data set to train a first policy in simulation.', level: 'advanced', tracks: ['open-robotics'] },
  { name: 'UCI Machine Learning Repository', portal: 'Other', task: 'tabular', size: '600+ data sets', licence: 'Various', url: 'https://archive.ics.uci.edu/', use: 'Decades of small, clean tabular data sets, each with a description page.', level: 'foundations', tracks: ['start-here', 'ai-foundations'] },
  { name: 'Google Dataset Search', portal: 'Other', task: 'tabular', size: 'millions', licence: 'Various', url: 'https://datasetsearch.research.google.com/', use: 'Search engine for data sets across the web; find data for your own project.', level: 'beginner', tracks: ['start-here', 'build-ai-ecosystem'] },
  { name: 'OpenML', portal: 'Other', task: 'tabular', size: '5,000+ data sets', licence: 'Various', url: 'https://www.openml.org/', use: 'Data sets with recorded benchmark results, loadable with one scikit-learn call.', level: 'beginner', tracks: ['ai-foundations'] },
]

export interface Practical {
  title: string
  portal: 'Kaggle' | 'Google Colab' | 'Hugging Face' | 'GitHub' | 'Other'
  url: string
  what: string
  level: Level
  minutes: string
  tracks: string[]
}

export const practicals: Practical[] = [
  { title: 'Google Colab: a free notebook with a GPU', portal: 'Google Colab', url: 'https://colab.research.google.com/', what: 'Open a new notebook and run Python in the browser with nothing installed. Runtime menu gives you a free GPU.', level: 'foundations', minutes: '5', tracks: ['start-here', 'ai-foundations', 'build-ai-ecosystem'] },
  { title: 'Welcome to Colab notebook', portal: 'Google Colab', url: 'https://colab.research.google.com/notebooks/intro.ipynb', what: 'The official tour: cells, running code, importing data, using a GPU.', level: 'foundations', minutes: '15', tracks: ['start-here'] },
  { title: 'Kaggle Learn: Python', portal: 'Kaggle', url: 'https://www.kaggle.com/learn/python', what: 'Seven short lessons with exercises graded in the browser. Pairs with the first-python module.', level: 'foundations', minutes: '300', tracks: ['start-here'] },
  { title: 'Kaggle Learn: Pandas', portal: 'Kaggle', url: 'https://www.kaggle.com/learn/pandas', what: 'Filtering, grouping and cleaning tables, with graded exercises.', level: 'foundations', minutes: '240', tracks: ['start-here'] },
  { title: 'Kaggle Learn: Intro to SQL', portal: 'Kaggle', url: 'https://www.kaggle.com/learn/intro-to-sql', what: 'Query real public data sets with SQL in the browser.', level: 'foundations', minutes: '180', tracks: ['start-here', 'system-design'] },
  { title: 'Kaggle Learn: Intro to Machine Learning', portal: 'Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', what: 'Decision trees and random forests on the house-price data, then your first competition submission.', level: 'beginner', minutes: '180', tracks: ['ai-foundations'] },
  { title: 'Kaggle Learn: Intermediate Machine Learning', portal: 'Kaggle', url: 'https://www.kaggle.com/learn/intermediate-machine-learning', what: 'Missing values, categorical columns, pipelines, cross-validation, gradient boosting.', level: 'beginner', minutes: '240', tracks: ['ai-foundations'] },
  { title: 'Kaggle Learn: Intro to Deep Learning', portal: 'Kaggle', url: 'https://www.kaggle.com/learn/intro-to-deep-learning', what: 'Build and train neural networks in Keras with graded exercises.', level: 'beginner', minutes: '240', tracks: ['ai-foundations'] },
  { title: 'Kaggle Learn: Computer Vision', portal: 'Kaggle', url: 'https://www.kaggle.com/learn/computer-vision', what: 'Convolutional networks and transfer learning on real images.', level: 'intermediate', minutes: '240', tracks: ['ai-research'] },
  { title: 'Kaggle notebooks and competitions', portal: 'Kaggle', url: 'https://www.kaggle.com/code', what: 'Thousands of public notebooks you can copy and run. Read a top notebook for any data set you use.', level: 'beginner', minutes: 'open', tracks: ['ai-foundations', 'start-here'] },
  { title: 'Hugging Face LLM course', portal: 'Hugging Face', url: 'https://huggingface.co/learn/llm-course/chapter1/1', what: 'Transformers library, tokenizers, fine-tuning and sharing models, with Colab notebooks per chapter.', level: 'beginner', minutes: '1,200', tracks: ['ai-foundations', 'build-ai-ecosystem'] },
  { title: 'Hugging Face Agents course', portal: 'Hugging Face', url: 'https://huggingface.co/learn/agents-course/unit0/introduction', what: 'Build agents with tools, memory and evaluation, with a certificate at the end.', level: 'beginner', minutes: '600', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { title: 'Hugging Face smol course', portal: 'GitHub', url: 'https://github.com/huggingface/smol-course', what: 'Fine-tune small models (SFT, DPO, LoRA, evaluation) on free hardware, notebook by notebook.', level: 'intermediate', minutes: '600', tracks: ['build-ai-ecosystem', 'ai-research'] },
  { title: 'Hugging Face Spaces', portal: 'Hugging Face', url: 'https://huggingface.co/spaces', what: 'Try thousands of model demos in the browser, then deploy your own Gradio app for free.', level: 'beginner', minutes: 'open', tracks: ['build-ai-ecosystem'] },
  { title: 'Open LLM Leaderboard', portal: 'Hugging Face', url: 'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard', what: 'Compare open models on standard benchmarks before you pick one.', level: 'beginner', minutes: '15', tracks: ['ai-foundations', 'build-ai-ecosystem'] },
  { title: 'MTEB embedding leaderboard', portal: 'Hugging Face', url: 'https://huggingface.co/spaces/mteb/leaderboard', what: 'Compare embedding models on retrieval benchmarks; pick one for your RAG system.', level: 'intermediate', minutes: '15', tracks: ['ai-engineering', 'build-ai-ecosystem'] },
  { title: 'LMArena', portal: 'Other', url: 'https://lmarena.ai/', what: 'Blind side-by-side human votes on chat models; the leaderboard behind many model choices.', level: 'beginner', minutes: '15', tracks: ['ai-foundations'] },
  { title: 'Neural Networks: Zero to Hero notebooks', portal: 'GitHub', url: 'https://github.com/karpathy/nn-zero-to-hero', what: 'The notebooks for Karpathy’s lecture series: micrograd, makemore and GPT, with exercises.', level: 'intermediate', minutes: '1,200', tracks: ['ai-foundations', 'ml-math', 'ai-research'] },
  { title: 'nanoGPT', portal: 'GitHub', url: 'https://github.com/karpathy/nanoGPT', what: 'Train a small GPT on Shakespeare in minutes, then read the 300-line model file.', level: 'intermediate', minutes: '120', tracks: ['ai-research'] },
  { title: 'micrograd', portal: 'GitHub', url: 'https://github.com/karpathy/micrograd', what: 'A 100-line autograd engine. Read it after the backpropagation lesson.', level: 'beginner', minutes: '60', tracks: ['ai-foundations', 'ml-math'] },
  { title: 'minbpe', portal: 'GitHub', url: 'https://github.com/karpathy/minbpe', what: 'Byte-pair encoding tokenizer in minimal code, with exercises.', level: 'intermediate', minutes: '90', tracks: ['ai-research', 'ai-foundations'] },
  { title: 'PyTorch: Learn the Basics', portal: 'Other', url: 'https://pytorch.org/tutorials/beginner/basics/intro.html', what: 'Tensors, datasets, models, autograd, optimisation and saving, each page with a Colab button.', level: 'beginner', minutes: '180', tracks: ['ai-foundations', 'ml-math'] },
  { title: 'scikit-learn examples gallery', portal: 'Other', url: 'https://scikit-learn.org/stable/auto_examples/index.html', what: 'Runnable examples for every classic model, each downloadable as a notebook.', level: 'beginner', minutes: 'open', tracks: ['ai-foundations'] },
  { title: 'Google ML Crash Course', portal: 'Other', url: 'https://developers.google.com/machine-learning/crash-course', what: 'Short videos, visual explanations and Colab exercises on regression, classification and neural networks.', level: 'beginner', minutes: '900', tracks: ['ai-foundations', 'math-from-zero'] },
  { title: 'fast.ai Practical Deep Learning', portal: 'Other', url: 'https://course.fast.ai/', what: 'Top-down deep learning: train a real image classifier in lesson 1, understand it later.', level: 'beginner', minutes: '1,500', tracks: ['ai-foundations'] },
  { title: 'Anthropic prompt engineering interactive tutorial', portal: 'GitHub', url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial', what: 'Nine notebook chapters with exercises on prompting Claude, from basics to tool use.', level: 'beginner', minutes: '240', tracks: ['ai-foundations', 'build-ai-ecosystem'] },
  { title: 'Anthropic cookbook', portal: 'GitHub', url: 'https://github.com/anthropics/anthropic-cookbook', what: 'Runnable notebooks for RAG, tool use, agents, PDFs, vision and evaluation with Claude.', level: 'beginner', minutes: 'open', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { title: 'Anthropic courses', portal: 'GitHub', url: 'https://github.com/anthropics/courses', what: 'API fundamentals, prompt engineering, evaluations and tool use, as notebook courses.', level: 'beginner', minutes: '600', tracks: ['build-ai-ecosystem'] },
  { title: 'OpenAI cookbook', portal: 'GitHub', url: 'https://github.com/openai/openai-cookbook', what: 'Notebooks for embeddings, RAG, function calling and evals with the OpenAI-compatible API.', level: 'beginner', minutes: 'open', tracks: ['build-ai-ecosystem', 'ai-engineering'] },
  { title: 'Hugging Face Transformers quick tour', portal: 'Hugging Face', url: 'https://huggingface.co/docs/transformers/quicktour', what: 'Your first pipeline() call: sentiment, generation and more in ten lines.', level: 'beginner', minutes: '30', tracks: ['ai-foundations'] },
  { title: 'Hugging Face PEFT quick tour', portal: 'Hugging Face', url: 'https://huggingface.co/docs/peft/quicktour', what: 'Attach LoRA adapters to a model and train only them; the fine-tuning lesson follows this.', level: 'intermediate', minutes: '45', tracks: ['build-ai-ecosystem'] },
  { title: 'Hugging Face TRL', portal: 'Hugging Face', url: 'https://huggingface.co/docs/trl/index', what: 'Supervised fine-tuning, DPO and GRPO trainers; the post-training lessons in code.', level: 'advanced', minutes: 'open', tracks: ['ai-research', 'build-ai-ecosystem'] },
  { title: 'LeRobot', portal: 'GitHub', url: 'https://github.com/huggingface/lerobot', what: 'Train and run robot policies on real and simulated data; the robotics track in code.', level: 'advanced', minutes: 'open', tracks: ['open-robotics'] },
  { title: 'vLLM quickstart', portal: 'Other', url: 'https://docs.vllm.ai/en/latest/getting_started/quickstart.html', what: 'Serve an open model with an OpenAI-compatible API in a few commands.', level: 'intermediate', minutes: '30', tracks: ['inference-engineering', 'build-ai-ecosystem'] },
  { title: 'Ollama', portal: 'Other', url: 'https://ollama.com/', what: 'Run Llama, Qwen, Gemma and embedding models on your own computer with one command.', level: 'beginner', minutes: '10', tracks: ['build-ai-ecosystem', 'ai-foundations'] },
]

export interface PaperPortal { title: string; url: string; what: string }

export const paperPortals: PaperPortal[] = [
  { title: 'arXiv: machine learning (cs.LG)', url: 'https://arxiv.org/list/cs.LG/recent', what: 'Where nearly every AI paper appears first. Free PDFs and HTML.' },
  { title: 'arXiv: computation and language (cs.CL)', url: 'https://arxiv.org/list/cs.CL/recent', what: 'Language model and NLP papers.' },
  { title: 'Hugging Face Papers', url: 'https://huggingface.co/papers', what: 'Daily trending papers with linked models, datasets and discussion. Each arXiv id has a page here.' },
  { title: 'alphaXiv', url: 'https://www.alphaxiv.org/', what: 'Read arXiv papers with comments, summaries and questions in the margin.' },
  { title: 'Semantic Scholar', url: 'https://www.semanticscholar.org/', what: 'Search papers, see citations and get a short summary of each.' },
  { title: 'Connected Papers', url: 'https://www.connectedpapers.com/', what: 'Draws a graph of related papers around one you give it. Good for finding what to read next.' },
  { title: 'OpenReview', url: 'https://openreview.net/', what: 'Conference submissions with their reviews. Learn how researchers judge papers.' },
  { title: 'ACL Anthology', url: 'https://aclanthology.org/', what: 'Every NLP conference paper, free.' },
  { title: 'Google Scholar', url: 'https://scholar.google.com/', what: 'Search across publishers; set alerts for an author or topic.' },
]

// Turn an arXiv URL into companion links on the paper portals.
export function arxivId(url: string): string | null {
  const m = /arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})(v\d+)?/.exec(url)
  return m ? m[1] : null
}

export function paperLinks(url: string) {
  const id = arxivId(url)
  if (!id) return []
  return [
    { label: 'Hugging Face Papers', url: `https://huggingface.co/papers/${id}` },
    { label: 'alphaXiv', url: `https://www.alphaxiv.org/abs/${id}` },
    { label: 'Semantic Scholar', url: `https://www.semanticscholar.org/arxiv/${id}` },
    { label: 'Connected Papers', url: `https://www.connectedpapers.com/search?q=${encodeURIComponent('arXiv:' + id)}` },
    { label: 'PDF', url: `https://arxiv.org/pdf/${id}` },
  ]
}
