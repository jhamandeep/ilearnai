import type { Video } from './types'
import chapterSourceVideos from './chapterSourceVideos.json'

// Every entry is free to watch. Every video id below was checked against
// YouTube's oEmbed endpoint (title and channel returned). Entries marked
// embeddable: false exist but their owner disabled embedding, so the site shows
// a thumbnail that opens YouTube instead of an inline player.
// Lesson text embeds a video with a ":::video" block whose id must appear here.
const v = (id: string, title: string, channel: string, track: string, topic: string, level: Video['level'], why: string, minutes?: number, embeddable = true): Video => ({
  id, url: `https://www.youtube.com/watch?v=${id}`, title, channel, track, topic, level, why, minutes, kind: 'video', embeddable,
})
const pl = (list: string, title: string, channel: string, track: string, topic: string, level: Video['level'], why: string): Video => ({
  id: '', url: `https://www.youtube.com/playlist?list=${list}`, title, channel, track, topic, level, why, kind: 'playlist',
})
const ch = (handle: string, title: string, track: string, topic: string, level: Video['level'], why: string): Video => ({
  id: '', url: `https://www.youtube.com/${handle}`, title, channel: title, track, topic, level, why, kind: 'channel',
})

export const videos: Video[] = [
  ...chapterSourceVideos as Video[],
  // ---- Level 0: Start here (computers, code, data) ----
  v('mCq8-xTH7jA', 'How Computers Work: What Makes a Computer, a Computer?', 'Code.org', 'start-here', 'Computers', 'foundations', 'Five minutes on input, storage, processing and output. The whole computer in one picture.', 5),
  v('tpIctyqH29Q', 'Crash Course Computer Science Preview', 'CrashCourse', 'start-here', 'Computers', 'foundations', 'The trailer for a 40-episode series that goes from transistors to the internet. Watch the series when you want depth.', 3),
  v('3LPJfIKxwWc', 'CS50x 2024 - Lecture 0 - Scratch', 'CS50', 'start-here', 'Programming', 'foundations', "Harvard's first programming lecture. No code yet, only the ideas: instructions, loops, conditions, and how a computer thinks.", 150),
  v('x7X9w_GIm1s', 'Python in 100 Seconds', 'Fireship', 'start-here', 'Python', 'foundations', 'A fast tour of what Python looks like, so the language feels familiar before you write it.', 2),
  v('YYXdXT2l-Gg', 'Python Tutorial for Beginners 1: Install and Setup for Mac and Windows', 'Corey Schafer', 'start-here', 'Python', 'foundations', 'Installing Python and running your first file, step by step, on both operating systems.', 15),
  v('rfscVS0vtbw', 'Learn Python - Full Course for Beginners', 'freeCodeCamp.org', 'start-here', 'Python', 'foundations', 'Four and a half hours that cover every Python idea in this track. Watch one section at a time, after the matching lesson.', 267),
  v('nLRL_NcnK-4', "Harvard CS50's Introduction to Programming with Python", 'freeCodeCamp.org', 'start-here', 'Python', 'foundations', 'The full Harvard Python course in one video: functions, conditionals, loops, exceptions, libraries, files, and tests.', 960),
  v('KkMDCCdjyW8', 'Lecture 1 | Programming Methodology (Stanford CS106A)', 'Stanford', 'start-here', 'Programming', 'foundations', "Stanford's first programming lecture by Mehran Sahami. The thinking habits matter more than the language used.", 50),
  v('HW29067qVWk', 'Jupyter Notebook Tutorial: Introduction, Setup, and Walkthrough', 'Corey Schafer', 'start-here', 'Tools', 'foundations', 'The notebook is where most AI code is written first. This shows how to install and use it.', 30),
  v('I4EWvMFj37g', 'Bash in 100 Seconds', 'Fireship', 'start-here', 'Terminal', 'foundations', 'What the terminal is and the handful of commands you need.', 2),
  v('rrB13utjYV4', 'Linux in 100 Seconds', 'Fireship', 'start-here', 'Terminal', 'foundations', 'Almost every AI server runs Linux. Two minutes on what it is.', 2),
  v('hwP7WQkmECE', 'Git Explained in 100 Seconds', 'Fireship', 'start-here', 'Git', 'foundations', 'Version control in two minutes: commits, branches, and why you need it.', 2),
  v('RGOj5yH7evk', 'Git and GitHub for Beginners - Crash Course', 'freeCodeCamp.org', 'start-here', 'Git', 'foundations', 'A full hour on Git and GitHub with every command typed on screen.', 69),
  v('s7wmiS2mSXY', 'What is an API? (in 3 minutes)', 'MuleSoft Videos', 'start-here', 'APIs', 'foundations', 'The restaurant analogy for an API. Every AI model you call is behind one.', 3),
  v('-MTSQjw5DrM', 'RESTful APIs in 100 Seconds', 'Fireship', 'start-here', 'APIs', 'foundations', 'What a REST API is and what a request and response look like.', 3),
  v('zsjvFFKOm3c', 'SQL Explained in 100 Seconds', 'Fireship', 'start-here', 'Data', 'foundations', 'Databases and SQL in two minutes. You will store your AI data in one.', 2),
  v('Gjnup-PuquQ', 'Docker in 100 Seconds', 'Fireship', 'start-here', 'Deploy', 'foundations', 'Why your program runs on your laptop but not on the server, and the fix.', 2),
  v('pg19Z8LL06w', 'Docker Crash Course for Absolute Beginners', 'TechWorld with Nana', 'build-ai-ecosystem', 'Deploy', 'beginner', 'One hour from zero to building and running your own container.', 70),
  v('PeMlggyqz0Y', 'Machine Learning Explained in 100 Seconds', 'Fireship', 'start-here', 'AI', 'foundations', 'The whole field in 100 seconds. Watch it first, then again at the end.', 2),

  // ---- Level 0: Mathematics from zero ----
  v('fNk_zzaMoSs', 'Vectors | Chapter 1, Essence of linear algebra', '3Blue1Brown', 'math-from-zero', 'Vectors', 'foundations', 'What a vector is, drawn as an arrow and as a list of numbers. The first idea you need for AI.', 10),
  v('kYB8IZa5AuE', 'Linear transformations and matrices | Chapter 3, Essence of linear algebra', '3Blue1Brown', 'math-from-zero', 'Matrices', 'foundations', 'A matrix is a machine that moves vectors. The animation makes this obvious.', 11),
  v('XkY2DOUCWMU', 'Matrix multiplication as composition | Chapter 4, Essence of linear algebra', '3Blue1Brown', 'math-from-zero', 'Matrices', 'foundations', 'Why matrix multiplication works the way it does. Every neural network layer is one of these.', 10),
  v('LyGKycYT2v0', 'Dot products and duality | Chapter 9, Essence of linear algebra', '3Blue1Brown', 'math-from-zero', 'Vectors', 'beginner', 'The dot product measures how much two vectors agree. Attention and embeddings are built on it.', 14),
  v('PFDu9oVAE-g', 'Eigenvectors and eigenvalues | Chapter 14, Essence of linear algebra', '3Blue1Brown', 'ml-math', 'Matrices', 'intermediate', 'The directions a matrix leaves alone. Needed for PCA and for understanding optimisers.', 17),
  v('WUvTyaaNkzM', 'The essence of calculus', '3Blue1Brown', 'math-from-zero', 'Calculus', 'foundations', 'Calculus from the area of a circle. Start here if the word derivative scares you.', 17),
  v('9vKqVkMQHKk', 'The paradox of the derivative | Chapter 2, Essence of calculus', '3Blue1Brown', 'math-from-zero', 'Calculus', 'foundations', 'What a derivative really is: the best constant approximation of change at an instant.', 17),
  v('YG15m2VwSjA', 'Visualizing the chain rule and product rule | Chapter 4, Essence of calculus', '3Blue1Brown', 'math-from-zero', 'Calculus', 'beginner', 'The chain rule is the engine of backpropagation. See it before you compute it.', 16),
  v('SzZ6GpcfoQY', 'Calculating the Mean, Variance and Standard Deviation', 'StatQuest with Josh Starmer', 'math-from-zero', 'Statistics', 'foundations', 'The three numbers that describe any list of measurements.', 15),
  v('pYxNSUDSFH4', 'In Statistics, Probability is not Likelihood.', 'StatQuest with Josh Starmer', 'math-from-zero', 'Probability', 'beginner', 'A five-minute distinction that clears up most confusion about training objectives.', 5),
  v('HZGCoVF3YvM', 'Bayes theorem, the geometry of changing beliefs', '3Blue1Brown', 'math-from-zero', 'Probability', 'beginner', 'Updating a belief with evidence, drawn as areas. The idea behind spam filters and language models.', 15),
  v('8idr1WZ1A7Q', 'Binomial distributions | Probabilities of probabilities, part 1', '3Blue1Brown', 'math-from-zero', 'Probability', 'beginner', 'How repeated yes-or-no events make a distribution. A gentle door into probability.', 12),
  v('2MuDZIAzBMY', 'Stanford CS109 Probability for Computer Scientists | Counting | Lecture 1', 'Stanford Online', 'math-from-zero', 'Probability', 'beginner', "Stanford's probability course for programmers, from the first lecture.", 80),
  v('KpKog-L9veg', 'Neural Networks Part 5: ArgMax and SoftMax', 'StatQuest with Josh Starmer', 'math-from-zero', 'Functions', 'beginner', 'Softmax turns any list of numbers into probabilities. Every language model ends with it.', 11),
  v('6ArSys5qHAU', 'Neural Networks Part 6: Cross Entropy', 'StatQuest with Josh Starmer', 'math-from-zero', 'Loss', 'beginner', 'The loss function that trains every classifier and language model, explained with small numbers.', 10),

  // ---- Level 1: AI foundations ----
  v('i_LwzRVP7bg', 'Machine Learning for Everybody – Full Course', 'freeCodeCamp.org', 'ai-foundations', 'Machine learning', 'beginner', 'A four-hour course that writes real models in Python with no heavy mathematics.', 234),
  v('nk2CQITm_eo', 'Linear Regression, Clearly Explained!!!', 'StatQuest with Josh Starmer', 'ai-foundations', 'Regression', 'beginner', 'Fitting a line to points. The first model in this track.', 27),
  v('yIYKR4sgzI8', 'StatQuest: Logistic Regression', 'StatQuest with Josh Starmer', 'ai-foundations', 'Classification', 'beginner', 'From predicting a number to predicting yes or no.', 9),
  v('_L39rN6gz7Y', 'Decision and Classification Trees, Clearly Explained!!!', 'StatQuest with Josh Starmer', 'ai-foundations', 'Trees', 'beginner', 'A model that is a flow chart of questions. Easy to read, surprisingly strong.', 18),
  v('EuBBz3bI-aA', 'Machine Learning Fundamentals: Bias and Variance', 'StatQuest with Josh Starmer', 'ai-foundations', 'Generalisation', 'beginner', 'Why a model that fits the training data perfectly can be useless.', 7),
  v('fSytzGwwBVw', 'Machine Learning Fundamentals: Cross Validation', 'StatQuest with Josh Starmer', 'ai-foundations', 'Evaluation', 'beginner', 'How to test a model honestly when you only have one data set.', 6),
  v('4jRBRDbJemM', 'ROC and AUC, Clearly Explained!', 'StatQuest with Josh Starmer', 'ai-foundations', 'Evaluation', 'beginner', 'The two curves you will see in every classifier report.', 17),
  v('sDv4f4s2SB8', 'Gradient Descent, Step-by-Step', 'StatQuest with Josh Starmer', 'ai-foundations', 'Training', 'beginner', 'The algorithm that trains almost every model, done with one parameter and a calculator.', 24),
  v('aircAruvnKk', 'But what is a neural network? | Deep learning chapter 1', '3Blue1Brown', 'ai-foundations', 'Neural networks', 'beginner', 'Handwritten digits, layers, weights and biases, in 19 minutes.', 19),
  v('IHZwWFHWa-w', 'Gradient descent, how neural networks learn | Deep Learning Chapter 2', '3Blue1Brown', 'ai-foundations', 'Training', 'beginner', 'How the network changes its weights to make fewer mistakes.', 21),
  v('Ilg3gGewQ5U', 'Backpropagation, intuitively | Deep Learning Chapter 3', '3Blue1Brown', 'ai-foundations', 'Training', 'beginner', 'Which weights to blame for an error, and by how much.', 13),
  v('tIeHLnjs5U8', 'Backpropagation calculus | Deep Learning Chapter 4', '3Blue1Brown', 'ml-math', 'Training', 'intermediate', 'The chain rule applied to a network, written out.', 10),
  v('CqOfi41LfDw', 'The Essential Main Ideas of Neural Networks', 'StatQuest with Josh Starmer', 'ai-foundations', 'Neural networks', 'beginner', 'A tiny network fitted to a curve, one number at a time.', 18),
  v('viZrOnJclY0', 'Word Embedding and Word2Vec, Clearly Explained!!!', 'StatQuest with Josh Starmer', 'ai-foundations', 'Embeddings', 'beginner', 'How words become numbers that carry meaning.', 16),
  v('LPZh9BOjkQs', 'Large Language Models explained briefly', '3Blue1Brown', 'ai-foundations', 'Language models', 'beginner', 'Eight minutes on what a language model is, how it is trained, and what it is not.', 8),
  v('zjkBMFhNj_g', '[1hr Talk] Intro to Large Language Models', 'Andrej Karpathy', 'ai-foundations', 'Language models', 'beginner', 'The best one-hour overview of what a large language model is, how it is trained, and where it is going. No code.', 60),
  v('7xTGNNLPyMI', 'Deep Dive into LLMs like ChatGPT', 'Andrej Karpathy', 'ai-foundations', 'Language models', 'beginner', 'Three and a half hours from pretraining data to post-training. Watch it after the one-hour talk.', 211),
  v('zxQyTK8quyY', "Transformer Neural Networks, ChatGPT's foundation, Clearly Explained!!!", 'StatQuest with Josh Starmer', 'ai-foundations', 'Transformers', 'beginner', 'The transformer with small numbers and no matrices larger than two by two.', 36),
  v('wjZofJX0v4M', 'Transformers, the tech behind LLMs | Deep Learning Chapter 5', '3Blue1Brown', 'ai-foundations', 'Transformers', 'beginner', 'What happens inside a GPT, drawn step by step.', 27),
  v('eMlx5fFNoYc', 'Attention in transformers, step-by-step | Deep Learning Chapter 6', '3Blue1Brown', 'ai-research', 'Transformers', 'beginner', 'Queries, keys and values as geometry. Pairs with the attention lab on this site.', 26),
  v('9-Jl0dxWQs8', 'How might LLMs store facts | Deep Learning Chapter 7', '3Blue1Brown', 'ai-research', 'Transformers', 'intermediate', 'What the MLP layers do, and where a fact might live.', 23),
  v('XfpMkf4rD6E', 'Stanford CS25: V2 I Introduction to Transformers w/ Andrej Karpathy', 'Stanford Online', 'ai-foundations', 'Transformers', 'beginner', "Karpathy's history and overview of the transformer for Stanford's seminar. Opens on YouTube.", 53, false),
  v('_ZvnD73m40o', 'Prompt Engineering Tutorial – Master ChatGPT and LLM Responses', 'freeCodeCamp.org', 'ai-foundations', 'Prompting', 'beginner', 'How to write prompts that work, with many examples.', 41),

  // ---- Level 1 to 2: Build the AI ecosystem ----
  v('T-D1OfcDW1M', 'What is Retrieval-Augmented Generation (RAG)?', 'IBM Technology', 'build-ai-ecosystem', 'Retrieval', 'beginner', 'Six minutes on why a model needs your documents and how retrieval gives them to it.', 7),
  v('klTvEwg3oJ4', 'Vector databases are so hot right now. WTF are they?', 'Fireship', 'build-ai-ecosystem', 'Retrieval', 'beginner', 'What a vector database stores and when you need one.', 4),
  v('gl1r1XV0SLw', 'What is a Vector Database? Powering Semantic Search & AI Applications', 'IBM Technology', 'build-ai-ecosystem', 'Retrieval', 'beginner', 'A calmer explanation of vector search with a worked example.', 8),
  v('F8NKVhkZZWI', 'What are AI Agents?', 'IBM Technology', 'build-ai-ecosystem', 'Agents', 'beginner', 'An agent is a model in a loop with tools. This explains the loop.', 12),
  v('1bUy-1hGZpI', 'What is LangChain?', 'IBM Technology', 'build-ai-ecosystem', 'Frameworks', 'beginner', 'What an LLM application framework does for you and what it hides.', 8),
  v('eur8dUO9mvE', 'What is MCP? Integrate AI Agents with Databases & APIs', 'IBM Technology', 'build-ai-ecosystem', 'Agents', 'beginner', 'The Model Context Protocol: a standard way to give a model tools.', 10),
  v('00Q0G84kq3M', 'RAG vs. Fine Tuning', 'IBM Technology', 'build-ai-ecosystem', 'Design choices', 'beginner', 'When to retrieve and when to train. The decision you will make on every project.', 8),
  v('WxYC9-hBM_g', 'Run your own AI (but private)', 'NetworkChuck', 'build-ai-ecosystem', 'Local models', 'beginner', 'Install Ollama and run an open model on your own computer in ten minutes.', 23),
  v('7t2alSnE2-I', 'FastAPI - A python framework | Full Course', 'Sarthaksavvy', 'build-ai-ecosystem', 'Serving', 'beginner', 'Build the web server that will sit in front of your model.', 160),
  v('3c-iBn73dDE', 'Docker Tutorial for Beginners [FULL COURSE in 3 Hours]', 'TechWorld with Nana', 'build-ai-ecosystem', 'Deploy', 'intermediate', 'The complete Docker course when the crash course is not enough.', 180),
  v('PziYflu8cB8', 'Kubernetes Explained in 100 Seconds', 'Fireship', 'build-ai-ecosystem', 'Deploy', 'intermediate', 'What Kubernetes is, so the word stops being scary.', 2),
  v('G1rOthIU-uo', 'Redis in 100 Seconds', 'Fireship', 'build-ai-ecosystem', 'Caching', 'beginner', 'The cache you will put in front of your model calls.', 2),
  v('LCEmiRjPEtQ', 'Andrej Karpathy: Software Is Changing (Again)', 'Y Combinator', 'build-ai-ecosystem', 'Big picture', 'beginner', 'How programming changes when models write and run code. Context for the whole track.', 40),
  v('V_xro1bcAuA', 'PyTorch for Deep Learning & Machine Learning – Full Course', 'freeCodeCamp.org', 'ai-foundations', 'PyTorch', 'intermediate', 'A 25-hour course. Use the first chapters when you first meet tensors.', 1530),

  // ---- Level 2 to 3: research, Stanford and university courses ----
  v('VMj-3S1tku0', 'The spelled-out intro to neural networks and backpropagation: building micrograd', 'Andrej Karpathy', 'ml-math', 'Backpropagation', 'intermediate', 'Backpropagation written from scratch in 150 lines of Python.', 145),
  v('PaCmpygFfXo', 'The spelled-out intro to language modeling: building makemore', 'Andrej Karpathy', 'ai-research', 'Language models', 'intermediate', 'A character-level language model built from a table of counts to a neural network.', 117),
  v('kCc8FmEb1nY', "Let's build GPT: from scratch, in code, spelled out", 'Andrej Karpathy', 'ai-research', 'Transformers', 'intermediate', 'Builds a GPT in plain PyTorch, line by line. The clearest route from the attention equation to working code.', 117),
  v('zduSFxRajkE', "Let's build the GPT Tokenizer", 'Andrej Karpathy', 'ai-research', 'Tokenisation', 'intermediate', 'Byte-pair encoding built from scratch, with every strange tokenizer bug explained.', 134),
  v('l8pRSuU81PU', "Let's reproduce GPT-2 (124M)", 'Andrej Karpathy', 'ai-research', 'Training', 'advanced', 'A full pretraining run, including the GPU and data engineering.', 241),
  pl('PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ', 'Neural Networks: Zero to Hero', 'Andrej Karpathy', 'ai-foundations', 'Foundations', 'beginner', 'Backpropagation, language models, and GPT built from nothing. About 19 hours with exercises in each description.'),
  pl('PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', 'Neural networks (animated series)', '3Blue1Brown', 'ai-foundations', 'Foundations', 'beginner', 'Gradient descent, backpropagation and the calculus behind it, drawn rather than written.'),
  v('rmVRLeJRkl4', 'Stanford CS224N: NLP with Deep Learning | Winter 2021 | Lecture 1 - Intro & Word Vectors', 'Stanford Online', 'ai-research', 'NLP', 'intermediate', 'The opening lecture of the standard NLP course.', 85),
  pl('PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ', 'Stanford CS224N: Natural Language Processing with Deep Learning | Winter 2021', 'Stanford Online', 'ai-research', 'NLP', 'intermediate', 'Word vectors, RNNs, attention, transformers, pretraining and question answering. The full course.'),
  v('jGwO_UgTS7I', 'Stanford CS229: Machine Learning Lecture 1 - Andrew Ng (Autumn 2018)', 'Stanford Online', 'ai-foundations', 'Machine learning', 'beginner', "Andrew Ng's opening lecture to the classic machine learning course. Opens on YouTube.", 77, false),
  v('Bl4Feh_Mjvo', 'Stanford CS229 Machine Learning | Introduction | 2022 | Lecture 1', 'Stanford Online', 'ai-foundations', 'Machine learning', 'beginner', 'The 2022 version of CS229 with Tengyu Ma and Christopher Ré. Embeds inline.', 78),
  pl('PLoROMvodv4rNyWOpJg_Yh4NSqI4Z4vOYy', 'Stanford CS229: Machine Learning | Spring 2022', 'Stanford Online', 'ml-math', 'Machine learning', 'intermediate', 'Supervised learning, generalisation, kernels, deep learning, unsupervised learning and reinforcement learning.'),
  v('UzxYlbK2c7E', 'Lecture 1 | Machine Learning (Stanford CS229, 2008)', 'Stanford', 'ai-foundations', 'Machine learning', 'beginner', "Andrew Ng's original 2008 CS229 lecture. Older, but complete and embeddable.", 69),
  v('9vM4p9NN0Ts', 'Stanford CS229 I Machine Learning I Building Large Language Models (LLMs)', 'Stanford Online', 'ai-research', 'Language models', 'intermediate', 'Yann Dubois covers architecture, data, evaluation, scaling and post-training in one lecture. Opens on YouTube.', 105, false),
  v('PySo_6S4ZAg', 'Stanford CS230: Deep Learning | Autumn 2018 | Lecture 1', 'Stanford Online', 'ai-foundations', 'Deep learning', 'beginner', "Andrew Ng's deep learning course opener.", 75),
  pl('PLoROMvodv4rOABXSygHTsbvUz4G_YQhOb', 'Stanford CS230: Deep Learning | Autumn 2018', 'Stanford Online', 'ai-foundations', 'Deep learning', 'beginner', 'Full deep learning course: networks, optimisation, convolutional networks, sequence models, and project advice.'),
  v('vT1JzLTH4G4', 'Stanford CS231n Lecture 1 | Introduction to Convolutional Neural Networks for Visual Recognition', 'Stanford University School of Engineering', 'ai-research', 'Computer vision', 'intermediate', 'The famous computer vision course, 2017 edition.', 57),
  pl('PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv', 'Stanford CS231n: Convolutional Neural Networks for Visual Recognition (Spring 2017)', 'Stanford University School of Engineering', 'ai-research', 'Computer vision', 'intermediate', 'Image classification, convolutional networks, training tricks, detection, segmentation and generative models.'),
  v('NfnWJUyUJYU', 'CS231n Winter 2016: Lecture 1: Introduction and Historical Context', 'Andrej Karpathy', 'ai-research', 'Computer vision', 'intermediate', "Karpathy's own 2016 opening lecture of CS231n.", 80),
  v('P127jhj-8-Y', 'Stanford CS25: V1 I Transformers United: DL Models that have revolutionized NLP, CV, RL', 'Stanford Online', 'ai-research', 'Transformers', 'intermediate', 'The opening session of the transformer seminar.', 50),
  v('bHSDPgZYie0', 'Stanford CS25: Transformers United V6 I Overview of Transformers', 'Stanford Online', 'ai-research', 'Transformers', 'intermediate', 'The 2026 overview of transformers from the same seminar.', 70),
  pl('PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM', 'Stanford CS25 - Transformers United', 'Stanford Online', 'ai-research', 'Transformers', 'intermediate', 'Guest lectures from the people who built the models: Karpathy, OpenAI, DeepMind, Anthropic and more.'),
  v('SQ3fZ1sAqXI', 'Stanford CS336 Language Modeling from Scratch | Spring 2025 | Lecture 1: Overview and Tokenization', 'Stanford Online', 'ai-research', 'Language models', 'advanced', 'The first lecture of the course that builds a language model end to end.', 80),
  pl('PLoROMvodv4rOY23Y0BoGoBGgQ1zmU_MT_', 'Stanford CS336: Language Modeling from Scratch (Spring 2025)', 'Stanford Online', 'ai-research', 'Language models', 'advanced', 'Tokenisers, architectures, kernels, parallelism, scaling laws, data and alignment, each as a full lecture with assignments.'),
  v('FgzM3zpZ55o', 'Stanford CS234: Reinforcement Learning | Winter 2019 | Lecture 1 - Introduction', 'Stanford Online', 'ai-research', 'Reinforcement learning', 'intermediate', "Emma Brunskill's opening lecture. Opens on YouTube.", 70, false),
  pl('PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX', 'Stanford CS234 | Reinforcement Learning | Spring 2024', 'Stanford Online', 'ai-research', 'Reinforcement learning', 'intermediate', 'The 2024 reinforcement learning course: bandits, MDPs, policy gradients and RLHF.'),
  v('J8Eh7RqggsU', 'Overview Artificial Intelligence Course | Stanford CS221 (Autumn 2019)', 'Stanford Online', 'ai-foundations', 'AI', 'beginner', 'What the field of AI covers, as a map: search, games, probability, logic, learning. Opens on YouTube.', 60, false),
  v('yaLEGZuIIgE', 'Stanford CS221 | Autumn 2025 | Lecture 1: Course Overview and AI Foundations', 'Stanford Online', 'ai-foundations', 'AI', 'beginner', 'The 2025 opening lecture of the Stanford AI course. Opens on YouTube.', 80, false),
  v('JAB_plj2rbA', 'Stanford CS224W: Machine Learning with Graphs | 2021 | Lecture 1.1 - Why Graphs', 'Stanford Online', 'ai-research', 'Graphs', 'intermediate', 'Why graphs need their own machine learning.', 15),
  pl('PLoROMvodv4rPOWA-omMM6STXaWW4FvJT8', 'Stanford CS236: Deep Generative Models (2023)', 'Stanford Online', 'ai-research', 'Generative models', 'advanced', 'Autoregressive models, VAEs, GANs, diffusion and energy models, by Stefano Ermon.'),
  v('bkVCAk9Nsss', 'Stanford CS330 Deep Multi-Task & Meta Learning - What is multi-task learning? | 2022 | Lecture 1', 'Stanford Online', 'ai-research', 'Meta learning', 'advanced', "Chelsea Finn's opening lecture.", 75),
  pl('PLoROMvodv4rMIJ-TvblAIkw28Wxi27B36', 'Stanford CS330: Deep Multi-Task & Meta Learning (Autumn 2021)', 'Stanford Online', 'ai-research', 'Meta learning', 'advanced', 'Multi-task, transfer and meta learning for the robotics and research tracks.'),
  v('kV1ru-Inzl4', 'Stanford EE364A Convex Optimization | Stephen Boyd | 2023 | Lecture 1', 'Stanford Online', 'ml-math', 'Optimisation', 'advanced', "Stephen Boyd's opening lecture on convex optimisation.", 80),
  pl('PLoROMvodv4rMJqxxviPa4AmDClvcbHi6h', 'Stanford EE364A Convex Optimization | Stephen Boyd | 2023', 'Stanford Online', 'ml-math', 'Optimisation', 'advanced', 'The standard optimisation course, for the mathematics behind every training loop.'),
  pl('PLoROMvodv4rPt5D0zs3YhbWSZA8Q_DyiJ', 'Stanford CS224U: Natural Language Understanding | Spring 2021', 'Stanford Online', 'ai-research', 'NLP', 'advanced', 'Evaluation, retrieval-based question answering, grounding and analysis methods.'),
  pl('PLSrTvUm384I9PV10koj_cqit9OfbJXEkq', 'Stanford MLSys Seminars', 'Stanford MLSys Seminars', 'inference-engineering', 'Systems', 'advanced', 'Weekly talks on machine learning systems: serving, compilers, data systems and hardware.'),
  pl('PLoROMvodv4rMWw6rRoeSpkiseTHzWj6vu', 'Stanford EE380 Colloquium on Computer Systems', 'Stanford Online', 'system-design', 'Systems', 'advanced', 'Industry and research talks on real computer systems.'),
  ch('@stanfordonline', 'Stanford Online', 'ai-research', 'Courses', 'intermediate', 'Full playlists for CS224N (NLP), CS229 (machine learning), CS230 (deep learning), CS25 (transformers), CS234 (RL), CS336 and more.'),
  ch('@YannicKilcher', 'Yannic Kilcher', 'ai-research', 'Paper explanations', 'advanced', 'Paper walkthroughs with the PDF on screen, including most of the papers on this site.'),
  ch('@umarjamilai', 'Umar Jamil', 'ai-research', 'From scratch', 'intermediate', 'Transformer, LLaMA, Mistral, LoRA, RLHF and DPO implemented from scratch in PyTorch, with the mathematics explained first.'),
  ch('@MITOpenCourseWare', 'MIT OpenCourseWare', 'ai-research', 'Courses', 'intermediate', 'Full MIT courses: 6.S191 Introduction to Deep Learning, 18.06 Linear Algebra, 6.006 Algorithms.'),
  ch('@Deeplearningai', 'DeepLearning.AI', 'build-ai-ecosystem', 'Courses', 'beginner', "Andrew Ng's channel: short courses on prompting, RAG, agents, fine-tuning and evaluation."),
  ch('@HuggingFace', 'Hugging Face', 'build-ai-ecosystem', 'Courses', 'beginner', 'Walkthroughs for the Transformers library, the free LLM course and the agents course.'),
  ch('@ai-explained-', 'AI Explained', 'ai-research', 'Model releases', 'beginner', 'Careful readings of new model reports and benchmarks, without hype.'),

  // ---- ML mathematics channels ----
  ch('@3blue1brown', '3Blue1Brown', 'math-from-zero', 'Mathematics', 'foundations', 'Essence of linear algebra, essence of calculus, and the neural network series. The mathematics behind every lesson on this site.'),
  ch('@statquest', 'StatQuest with Josh Starmer', 'math-from-zero', 'Statistics', 'foundations', 'Probability, statistics, gradient descent, cross-entropy and transformers, each in a short clearly explained video.'),
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

export function findVideo(id: string) {
  return videos.find((x) => x.id === id)
}

export function thumb(video: Video) {
  return video.id ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` : ''
}

export function embedUrl(video: Video) {
  return video.id && video.embeddable !== false ? `https://www.youtube-nocookie.com/embed/${video.id}` : ''
}
