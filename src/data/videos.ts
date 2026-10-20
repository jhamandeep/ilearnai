import type { Video } from './types'

const v = (id: string, title: string, channel: string, track: string, topic: string, level: Video['level'], why: string, minutes?: number): Video => ({
  id, url: `https://www.youtube.com/watch?v=${id}`, title, channel, track, topic, level, why, minutes, kind: 'video',
})
const pl = (list: string, title: string, channel: string, track: string, topic: string, level: Video['level'], why: string): Video => ({
  id: '', url: `https://www.youtube.com/playlist?list=${list}`, title, channel, track, topic, level, why, kind: 'playlist',
})
const ch = (handle: string, title: string, track: string, topic: string, level: Video['level'], why: string): Video => ({
  id: '', url: `https://www.youtube.com/${handle}`, title, channel: title, track, topic, level, why, kind: 'channel',
})

// Every entry is free to watch. Video ids were checked against public listings;
// where only a playlist or channel could be confirmed, that is what is linked.
export const videos: Video[] = [
  // ---- AI research ----
  v('zjkBMFhNj_g', '[1hr Talk] Intro to Large Language Models', 'Andrej Karpathy', 'ai-research', 'Language models', 'beginner', 'The best one-hour overview of what a large language model is, how it is trained, and where it is going. No code.', 60),
  v('7xTGNNLPyMI', 'Deep Dive into LLMs like ChatGPT', 'Andrej Karpathy', 'ai-research', 'Language models', 'beginner', 'Three and a half hours from pretraining data to post-training. Watch it after the one-hour talk.', 211),
  v('kCc8FmEb1nY', "Let's build GPT: from scratch, in code, spelled out", 'Andrej Karpathy', 'ai-research', 'Transformers', 'intermediate', 'Builds a GPT in plain PyTorch, line by line. The clearest route from the attention equation to working code.', 117),
  pl('PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ', 'Neural Networks: Zero to Hero', 'Andrej Karpathy', 'ai-research', 'Foundations', 'beginner', 'Backpropagation, language models, and GPT built from nothing. About 19 hours with exercises in each description.'),
  v('aircAruvnKk', 'But what is a neural network?', '3Blue1Brown', 'ml-math', 'Foundations', 'beginner', 'Chapter 1 of the animated series. Handwritten digits, layers, weights and biases, in 19 minutes.', 19),
  pl('PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', 'Neural networks (animated series)', '3Blue1Brown', 'ml-math', 'Foundations', 'beginner', 'Gradient descent, backpropagation and the calculus behind it, drawn rather than written.'),
  v('eMlx5fFNoYc', 'Attention in transformers, visually explained', '3Blue1Brown', 'ai-research', 'Transformers', 'beginner', 'Queries, keys and values as geometry. Pairs with the attention lab on this site.', 26),
  pl('PLoROMvodv4rOY23Y0BoGoBGgQ1zmU_MT_', 'Stanford CS336: Language Modeling from Scratch (Spring 2025)', 'Stanford Online', 'ai-research', 'Language models', 'advanced', 'Tokenisers, architectures, kernels, parallelism, scaling laws, data and alignment, each as a full lecture with assignments.'),
  v('rmVRLeJRkl4', 'Stanford CS224N Winter 2021, Lecture 1: Introduction and Word Vectors', 'Stanford Online', 'ai-research', 'NLP', 'intermediate', 'The opening lecture of the standard NLP course. Follow the playlist from the Stanford Online channel.', 85),
  ch('@stanfordonline', 'Stanford Online', 'ai-research', 'Courses', 'intermediate', 'Full playlists for CS224N (NLP), CS229 (machine learning), CS230 (deep learning), CS25 (transformers) and CS336.'),
  ch('@YannicKilcher', 'Yannic Kilcher', 'ai-research', 'Paper explanations', 'advanced', 'Paper walkthroughs with the PDF on screen, including most of the papers on this site.'),
  ch('@umarjamilai', 'Umar Jamil', 'ai-research', 'From scratch', 'intermediate', 'Transformer, LLaMA, Mistral, LoRA, RLHF and DPO implemented from scratch in PyTorch, with the mathematics explained first.'),
  ch('@MITOpenCourseWare', 'MIT OpenCourseWare', 'ai-research', 'Courses', 'intermediate', 'Full MIT courses: 6.S191 Introduction to Deep Learning, 18.06 Linear Algebra, 6.006 Algorithms.'),
  ch('@Deeplearningai', 'DeepLearning.AI', 'ai-engineering', 'Courses', 'beginner', "Andrew Ng's channel: short courses on prompting, RAG, agents, fine-tuning and evaluation."),
  ch('@HuggingFace', 'Hugging Face', 'ai-engineering', 'Courses', 'beginner', 'Walkthroughs for the Transformers library, the free LLM course and the agents course.'),
  // ---- ML mathematics ----
  pl('PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU', 'Stanford CS229: Machine Learning (Autumn 2018)', 'Stanford Online', 'ml-math', 'Machine learning', 'intermediate', "Andrew Ng's full course: linear and logistic regression, generalisation, kernels, EM, reinforcement learning. 19 lectures."),
  ch('@3blue1brown', '3Blue1Brown', 'ml-math', 'Mathematics', 'beginner', 'Essence of linear algebra, essence of calculus, and the neural network series. The mathematics behind every lesson on this site.'),
  ch('@statquest', 'StatQuest with Josh Starmer', 'ml-math', 'Statistics', 'beginner', 'Probability, statistics, gradient descent, cross-entropy and transformers, each in a short clearly explained video.'),
  ch('@mathematicalmonk', 'mathematicalmonk', 'ml-math', 'Probability', 'intermediate', 'A long series on probability and machine learning theory in whiteboard style. Slow, precise, complete.'),
  ch('@ritvikmath', 'ritvikmath', 'ml-math', 'Statistics', 'beginner', 'Short derivations of common statistics and ML results, with the intuition first.'),
  // ---- AI engineering ----
  ch('@AIJasonZ', 'AI Jason', 'ai-engineering', 'Agents', 'beginner', 'Agent and tool-use builds with code, from prototype to something you can run.'),
  ch('@samwitteveenai', 'Sam Witteveen', 'ai-engineering', 'RAG and agents', 'intermediate', 'Practical walkthroughs of retrieval, agents and new model releases, with notebooks.'),
  ch('@jamesbriggs', 'James Briggs', 'ai-engineering', 'Retrieval', 'intermediate', 'Vector search, embeddings, chunking, reranking and hybrid retrieval, in depth.'),
  ch('@aiDotEngineer', 'AI Engineer', 'ai-engineering', 'Conference talks', 'intermediate', 'Talks from the AI Engineer summits: evaluation, agents, RAG in production, cost control.'),
  ch('@LangChain', 'LangChain', 'ai-engineering', 'Agents', 'beginner', 'Agent patterns, memory, evaluation and tracing, explained by the people who built the tools.'),
  // ---- Inference engineering ----
  ch('@vllm-project', 'vLLM', 'inference-engineering', 'Serving', 'advanced', 'Office hours and meetup talks on paged attention, scheduling, speculative decoding and quantisation.'),
  ch('@GPUMODE', 'GPU MODE', 'inference-engineering', 'Kernels', 'advanced', 'Lectures on CUDA, Triton, FlashAttention and performance work, from the people who write the kernels.'),
  ch('@NVIDIADeveloper', 'NVIDIA Developer', 'inference-engineering', 'Hardware', 'intermediate', 'GTC talks on TensorRT-LLM, inference optimisation and GPU architecture.'),
  ch('@PyTorch', 'PyTorch', 'inference-engineering', 'Framework', 'intermediate', 'Conference talks on torch.compile, distributed training and inference.'),
  ch('@ai-explained-', 'AI Explained', 'ai-research', 'Model releases', 'beginner', 'Careful readings of new model reports and benchmarks, without hype.'),
  // ---- System design ----
  pl('PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB', 'MIT 6.824: Distributed Systems (Spring 2020)', 'MIT 6.824', 'system-design', 'Distributed systems', 'advanced', 'GFS, Raft, ZooKeeper, Spanner, and the labs that go with them. The standard graduate course, free.'),
  ch('@ByteByteGo', 'ByteByteGo', 'system-design', 'System design', 'beginner', 'Short animated explanations of caches, queues, databases, load balancers and whole-system designs.'),
  ch('@hnasr', 'Hussein Nasser', 'system-design', 'Backend engineering', 'intermediate', 'Long-form backend engineering: databases, networking, protocols, and what actually happens on the wire.'),
  ch('@gkcs', 'Gaurav Sen', 'system-design', 'System design', 'beginner', 'System design interview walkthroughs: consistent hashing, message queues, sharding, rate limiting.'),
  ch('@jordanhasnolife5163', 'Jordan has no life', 'system-design', 'System design', 'intermediate', 'A full system design course and many design problems, grounded in Designing Data-Intensive Applications.'),
  ch('@InfoQ', 'InfoQ', 'system-design', 'Conference talks', 'intermediate', 'QCon talks from engineers at scale: architecture, reliability, incidents and lessons.'),
  ch('@MartinKleppmann', 'Martin Kleppmann', 'system-design', 'Distributed systems', 'intermediate', 'The author of Designing Data-Intensive Applications. His distributed systems lecture series is on this channel.'),
  ch('@CMUDatabaseGroup', 'CMU Database Group', 'system-design', 'Databases', 'advanced', 'Full CMU database courses: storage, indexes, concurrency control, query execution.'),
  ch('@googlecloudtech', 'Google Cloud Tech', 'system-design', 'Reliability', 'beginner', 'SRE and reliability content from the team that wrote the SRE book.'),
  // ---- Robotics ----
  ch('@StanfordASL', 'Stanford Autonomous Systems Lab', 'open-robotics', 'Robotics', 'advanced', 'Seminars on planning, control and learning for robots.'),
  ch('@TheRoboticsInstitute', 'CMU Robotics Institute', 'open-robotics', 'Robotics', 'advanced', 'Seminars and talks from one of the largest robotics departments.'),
  ch('@lexfridman', 'Lex Fridman', 'open-robotics', 'Interviews', 'beginner', 'Long interviews with robotics and AI researchers. Good for context before the papers.'),
]

export function videosForTrack(track: string) {
  return videos.filter((x) => x.track === track)
}

export function thumb(video: Video) {
  return video.id ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` : ''
}

export function embedUrl(video: Video) {
  return video.id ? `https://www.youtube-nocookie.com/embed/${video.id}` : ''
}
