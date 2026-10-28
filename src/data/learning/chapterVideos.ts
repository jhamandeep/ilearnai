import { videos } from '../videos'

export interface ChapterVideoPick { ref: string; focus: string }
export interface ChapterVideoGuide { goal: string; picks: ChapterVideoPick[]; practice: string }
const pick = (ref: string, focus: string): ChapterVideoPick => ({ ref, focus })
const guide = (goal: string, picks: ChapterVideoPick[], practice: string): ChapterVideoGuide => ({ goal, picks, practice })

// Curated at module level: sequences follow the actual chapter subjects.
// A reference is a video ID or a verified playlist ID already in the library.
export const chapterVideoGuides: Record<string, ChapterVideoGuide> = {
  'start-here/how-a-computer-works': guide('Connect hardware, instructions, and the programs you use each day.', [
    pick('3LPJfIKxwWc', 'Begin with the explanations of how information is represented and how instructions solve a problem.'),
    pick('KkMDCCdjyW8', 'Follow how a large problem becomes a sequence of precise instructions. The programming language differs from this course.'),
    pick('JP7ITIXGpHk', 'Watch inputs, outputs, and function calls become a small Python program.')], 'Describe the input, processing, storage, and output of an application you use.'),
  'start-here/first-python': guide('Watch one language idea at a time, then type your own small program.', [
    pick('JP7ITIXGpHk', 'Start with values, variables, function calls, and return values.'),
    pick('_b6NgY_pMdw', 'Follow comparisons and conditions. Predict which branch runs before the example continues.'),
    pick('-7xg8pGcP6w', 'Watch how a loop visits values and changes a running result.'),
    pick('rfscVS0vtbw', 'Use the matching functions, lists, and dictionaries chapters as additional practice.')], 'Write a program that classifies three values and prints a result for each.'),
  'start-here/python-for-data': guide('Read data, handle errors, and make your work repeatable.', [
    pick('KD-Yoel6EVQ', 'Follow file input and output. Notice how stored text becomes values in a program.'),
    pick('LW7g1169v7w', 'Read an error and follow the exception-handling examples.'),
    pick('MztLZWibctI', 'Watch how imports reuse library code instead of copying it into every file.'),
    pick('HW29067qVWk', 'Compare notebook cells with a script, especially execution order and stored state.')], 'Load a small file, handle one invalid value, and rerun the work from a clean start.'),
  'start-here/builders-tools': guide('Understand the tools around a program, not only the code inside it.', [
    pick('RGOj5yH7evk', 'Follow the complete edit, stage, commit, and inspect cycle.'),
    pick('7t2alSnE2-I', 'Use the request and endpoint sections to connect a browser request with server code.'),
    pick('pg19Z8LL06w', 'Watch how a container packages a program and its environment.')], 'Explain which problem Git, an API, and a container each solve.'),
  'start-here/data-the-raw-material': guide('Connect records, tables, and data checks to a useful application.', [
    pick('KD-Yoel6EVQ', 'See how a file becomes structured information you can inspect.'),
    pick('i_LwzRVP7bg', 'Use the data preparation sections. Notice which columns become inputs and which become targets.'),
    pick('tIrcxwLqzjQ', 'Use unit tests to check a small data-cleaning function before trusting its output.')], 'Make a three-row data table and list missing values, units, and the source of each column.'),
  'math-from-zero/numbers-and-functions': guide('Build intuition for input, output, and rates of change.', [
    pick('nk2CQITm_eo', 'Watch how a line describes the relationship between two measured quantities.'),
    pick('WUvTyaaNkzM', 'Follow the connection between changing quantities and accumulated quantities.'),
    pick('KpKog-L9veg', 'See how a list of scores becomes a set of probabilities.')], 'Choose three inputs, compute their outputs, and explain the units on both axes.'),
  'math-from-zero/vectors-and-matrices': guide('Move from a list of numbers to a transformation you can see.', [
    pick('fNk_zzaMoSs', 'Compare the arrow and list-of-numbers views of a vector.'),
    pick('kYB8IZa5AuE', 'Watch a matrix move the basis vectors and the space around them.'),
    pick('XkY2DOUCWMU', 'Follow why multiplying matrices corresponds to applying transformations in sequence.'),
    pick('LyGKycYT2v0', 'Connect the dot product to alignment between vectors.')], 'Draw two vectors, add them, and compute a small matrix-vector product by hand.'),
  'math-from-zero/change-and-gradients': guide('Understand slope before using it to reduce error.', [
    pick('9vKqVkMQHKk', 'See why a derivative describes local change.'),
    pick('YG15m2VwSjA', 'Follow how one change passes through a composition of functions.'),
    pick('sDv4f4s2SB8', 'Work through one gradient-descent update with the numerical example.')], 'Use the gradient descent lab. Change only the learning rate and explain the difference.'),
  'math-from-zero/chance': guide('Use small examples to connect probability, evidence, and uncertainty.', [
    pick('8idr1WZ1A7Q', 'Follow repeated yes-or-no events and the distribution of their counts.'),
    pick('HZGCoVF3YvM', 'Track how new evidence changes the relevant group of possibilities.'),
    pick('SzZ6GpcfoQY', 'Compute a mean and a measure of spread from a short list.'),
    pick('6ArSys5qHAU', 'See how a predicted probability is judged against the observed answer.')], 'Write one example where a high percentage is misleading because the relevant group is small.'),
  'ai-foundations/what-ai-is': guide('Separate the task, the learning method, and the output capability.', [
    pick('i_LwzRVP7bg', 'Use the introductory explanations before the coding work. Name an input, a target, and a prediction.'),
    pick('aircAruvnKk', 'Watch how a neural network turns input numbers into an output.'),
    pick('zjkBMFhNj_g', 'Compare training a language model with using it to generate text.')], 'Describe a work task without saying “AI”: name its input, output, and required human check.'),
  'ai-foundations/first-models': guide('Compare predicting a number, choosing a category, and checking performance.', [
    pick('nk2CQITm_eo', 'Follow the fitted line and the errors between predictions and observations.'),
    pick('yIYKR4sgzI8', 'Watch how a classification model produces a probability before a threshold becomes a decision.'),
    pick('_L39rN6gz7Y', 'Follow how a decision tree splits the examples.'),
    pick('fSytzGwwBVw', 'See why evaluation must use examples that did not fit the model.')], 'Choose a model for one numeric task and one category task. Explain how you will test each.'),
  'ai-foundations/neural-networks': guide('Follow the sequence from a neuron to learning across a network.', [
    pick('aircAruvnKk', 'Start with layers, weights, activations, and the meaning of the output.'),
    pick('IHZwWFHWa-w', 'Connect the loss surface to parameter updates.'),
    pick('Ilg3gGewQ5U', 'Follow how the error informs changes to earlier parts of the network.'),
    pick('V_xro1bcAuA', 'Use the tensor and training-loop chapters when you implement the lesson in PyTorch.')], 'Explain the forward pass, error measurement, and update as three separate operations.'),
  'ai-foundations/language-as-numbers': guide('Follow text into tokens, vectors, context, and generation.', [
    pick('viZrOnJclY0', 'See how word representations place related uses near one another.'),
    pick('LPZh9BOjkQs', 'Connect token prediction to generated language.'),
    pick('wjZofJX0v4M', 'Follow the visual explanation of transformer attention.'),
    pick('7xTGNNLPyMI', 'Use the tokenization, training, and inference sections for a longer synthesis.')], 'Use the tokenizer and attention labs, then explain what their teaching simulations do not measure.'),
  'ai-foundations/using-models': guide('Use instructions, sampling choices, and evaluation together.', [
    pick('_ZvnD73m40o', 'Compare a vague request with one that includes evidence, a task, and an output format.'),
    pick('zjkBMFhNj_g', 'Review the distinction between a model’s learned behaviour and the information supplied in context.'),
    pick('fSytzGwwBVw', 'Transfer the separation of development and evaluation data to your own model comparison.')], 'Write two prompt versions and compare them on the same five cases, including one missing-information case.'),
  'build-ai-ecosystem/set-up-your-workshop': guide('Prepare a reproducible workspace before connecting a model.', [
    pick('RGOj5yH7evk', 'Create a small version-control history you can inspect and undo.'),
    pick('MztLZWibctI', 'Review imports and reusable packages before installing project dependencies.'),
    pick('WxYC9-hBM_g', 'See one local-model setup. Follow current project documentation for version-sensitive commands.')], 'Record how a teammate can start the project without receiving your secret keys.'),
  'build-ai-ecosystem/chat-application': guide('Connect a conversation loop with a web service and structured data.', [
    pick('7t2alSnE2-I', 'Follow request handling, validation, and responses in a Python web service.'),
    pick('zjkBMFhNj_g', 'Connect conversation history to the context supplied to a language model.'),
    pick('_ZvnD73m40o', 'Use the output-format examples, then enforce your expected structure in code.')], 'Trace one message from the interface to the model and back. Identify where an invalid response is handled.'),
  'build-ai-ecosystem/retrieval-rag': guide('Find relevant documents before asking the model to answer.', [
    pick('T-D1OfcDW1M', 'Follow retrieval, context construction, and answer generation as separate steps.'),
    pick('gl1r1XV0SLw', 'Connect vector search with finding relevant passages.'),
    pick('00Q0G84kq3M', 'Compare providing knowledge through retrieval with changing model behaviour through training.'),
    pick('JpAxdTWQJxM', 'Optional advanced lecture: consider what an evaluation actually measures and what its dataset omits.')], 'Use one answerable question and one question absent from the documents. Inspect both retrieval and answer quality.'),
  'build-ai-ecosystem/agents-and-tools': guide('Trace the loop from a proposed action to a checked tool result.', [
    pick('F8NKVhkZZWI', 'Identify the model, tools, observations, and stop conditions in an agent loop.'),
    pick('eur8dUO9mvE', 'Understand how a tool connection exposes capabilities to an application.'),
    pick('1bUy-1hGZpI', 'Watch what a framework coordinates, then identify which permissions your application still controls.')], 'Describe an action the agent may propose, an action it may execute, and when it must stop.'),
  'build-ai-ecosystem/train-your-own': guide('Decide whether training helps, then compare before and after.', [
    pick('00Q0G84kq3M', 'Start with the distinction between missing knowledge and a behaviour you want to teach.'),
    pick('V_xro1bcAuA', 'Use the training-loop and evaluation chapters as implementation background.'),
    pick('2oH6PWPrYFo', 'Optional advanced lecture: distinguish the stages of adapting a pretrained model.')], 'Define a held-out set before changing the model. Compare failure cases, not only average scores.'),
  'build-ai-ecosystem/ship-it': guide('Package, serve, and inspect a complete application.', [
    pick('pg19Z8LL06w', 'Build and run a container, including its environment and exposed service.'),
    pick('7t2alSnE2-I', 'Review validation, failure handling, and API boundaries.'),
    pick('EfM546A79aM', 'Optional advanced lecture: connect model serving to latency, memory, and throughput constraints.')], 'Demonstrate a normal request, a failed request, a restart, and the measurements you would inspect.'),
  'ml-math/linear-algebra': guide('Connect geometry, matrix operations, and learned representations.', [
    pick('LyGKycYT2v0', 'Interpret the dot product geometrically before expanding it into components.'),
    pick('XkY2DOUCWMU', 'Relate matrix multiplication to successive transformations.'),
    pick('PFDu9oVAE-g', 'Identify directions that a transformation scales without changing their direction.')], 'Compute one matrix-vector product and describe the same operation geometrically.'),
  'ml-math/calculus': guide('Use derivatives to trace how a parameter affects an output.', [
    pick('9vKqVkMQHKk', 'Build the local-rate interpretation of a derivative.'),
    pick('YG15m2VwSjA', 'Follow the chain rule through composed functions.'),
    pick('tIeHLnjs5U8', 'Connect those derivatives to backpropagation in a network.')], 'Check an analytic derivative against a small finite-difference calculation.'),
  'ml-math/probability': guide('Separate a distribution, an observation, and a belief update.', [
    pick('2MuDZIAzBMY', 'Use counting examples to define the relevant sample space.'),
    pick('HZGCoVF3YvM', 'Follow a conditional update while keeping base rates visible.'),
    pick('pYxNSUDSFH4', 'Compare probability of data with likelihood as a function of a model parameter.')], 'Write a conditional-probability example and identify its conditioning event.'),
  'ml-math/statistics-and-information': guide('Connect summaries, uncertainty, and losses used in learning.', [
    pick('SzZ6GpcfoQY', 'Compute location and spread before interpreting a dataset.'),
    pick('6ArSys5qHAU', 'Connect the probability assigned to the correct outcome with cross-entropy.'),
    pick('fSytzGwwBVw', 'See why changing the evaluation split changes the evidence you obtain.')], 'Explain how two samples can share a mean but have different spreads and different practical implications.'),
  'ml-math/optimisation': guide('Connect the geometry of error to practical update rules.', [
    pick('sDv4f4s2SB8', 'Compute one update before studying a complete trajectory.'),
    pick('IHZwWFHWa-w', 'Connect network parameters with points on a loss surface.'),
    pick('kV1ru-Inzl4', 'Optional deeper lecture: distinguish a general optimisation problem from a convex one.')], 'Compare two learning rates on the same lab surface and describe the observed trade-off.'),
  'ml-math/linear-models-to-networks': guide('Build from a fitted line to a differentiable program.', [
    pick('nk2CQITm_eo', 'Inspect the errors a linear model tries to reduce.'),
    pick('aircAruvnKk', 'Follow how layers extend the model’s transformations.'),
    pick('VMj-3S1tku0', 'Implement the computation graph and gradients in a small working system.')], 'Trace one parameter from the forward calculation to its gradient and update.'),
  'ai-engineering/embeddings': guide('Connect vector representations with useful similarity searches.', [
    pick('viZrOnJclY0', 'Understand learned representations before using a vector database.'),
    pick('gl1r1XV0SLw', 'Follow how vectors support similarity search.'),
    pick('PjST2n7abAY', 'Advanced implementation background: compare vector and inverted index structures.')], 'Create two relevant and two irrelevant search examples. Inspect whether the ranking meets the task.'),
  'ai-engineering/rag': guide('Inspect retrieval quality independently from generated-answer quality.', [
    pick('T-D1OfcDW1M', 'Separate the retrieval and generation stages.'),
    pick('gl1r1XV0SLw', 'Connect the retrieval stage with the stored representation.'),
    pick('JpAxdTWQJxM', 'Use evaluation design to decide what the test set can support.')], 'Classify a failed answer as a retrieval miss, unsupported generation, stale source, or ambiguous question.'),
  'ai-engineering/agents': guide('Evaluate complete tool-using workflows, including their failure paths.', [
    pick('F8NKVhkZZWI', 'Trace an agent’s proposed action, tool call, observation, and next decision.'),
    pick('eur8dUO9mvE', 'Inspect the boundary between a tool protocol and application permissions.'),
    pick('LCEmiRjPEtQ', 'Consider how model-assisted software changes the balance between instructions and evaluation.')], 'Use the agent lab to compare step-level success with whole-workflow success.'),
  'ai-engineering/prompting-and-structured-output': guide('Turn a vague request into an output your application can check.', [
    pick('_ZvnD73m40o', 'Inspect examples that specify the task, evidence, and expected form.'),
    pick('7t2alSnE2-I', 'Apply request and response validation concepts to your application boundary.'),
    pick('tIrcxwLqzjQ', 'Use small tests to check both valid and invalid outputs.')], 'Write a schema and two invalid examples. Decide whether to retry, repair, or return an error.'),
  'ai-engineering/evaluation': guide('Build evidence about the exact task you intend to release.', [
    pick('fSytzGwwBVw', 'Separate fitting and tuning from evaluation.'),
    pick('4jRBRDbJemM', 'Understand threshold trade-offs instead of relying on one accuracy value.'),
    pick('JpAxdTWQJxM', 'Compare evaluation choices for language-model systems.')], 'Write acceptance criteria for an ordinary case, a difficult case, and a case that should remain unanswered.'),
  'ai-engineering/fine-tuning': guide('Connect a training choice with a measurable change in behaviour.', [
    pick('00Q0G84kq3M', 'Distinguish retrieval from behaviour adaptation.'),
    pick('2oH6PWPrYFo', 'Follow the purposes of mid-training and post-training.'),
    pick('V_xro1bcAuA', 'Review training, validation, and model comparison in working code.')], 'Explain why a new dataset should fix an observed failure, then define a held-out comparison.'),
  'ai-engineering/production': guide('Connect the user-facing service with model and infrastructure limits.', [
    pick('7t2alSnE2-I', 'Review service boundaries and failure handling.'),
    pick('3c-iBn73dDE', 'Follow packaging, images, containers, and the runtime environment.'),
    pick('EfM546A79aM', 'Study model inference bottlenecks and serving trade-offs.')], 'Name a quality measure, a latency measure, a cost measure, and the owner who responds when each fails.'),
  'system-design/fundamentals': guide('Move from workload assumptions to the structure of a service.', [
    pick('7t2alSnE2-I', 'Follow a concrete client-to-service request path.'),
    pick('7NPIENPr-zk', 'Review how a database represents the information a service stores.'),
    pick('PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB', 'Use the introductory distributed-systems lectures for the reasons services are spread across machines.')], 'Draw one request path and label the workload, state, and failure points.'),
  'system-design/storage': guide('Connect logical records to pages, indexes, and memory.', [
    pick('PRLXdIMJhOg', 'Follow records into files, pages, and tuples.'),
    pick('8-2yv4z0VZc', 'Watch how the buffer pool manages data in memory.'),
    pick('u7ii_Lvm9rM', 'Follow the search and update behaviour of a B+tree index.')], 'Explain why an index can make a read faster while making writes more expensive.'),
  'system-design/replication-and-consistency': guide('Reason about concurrent updates and multiple copies of state.', [
    pick('tMFAgvDViAI', 'Start with the correctness problems created by concurrent transactions.'),
    pick('IFLQBWY6dlE', 'Connect database execution with distributed placement and coordination.'),
    pick('PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB', 'Use the replication and Raft lectures to study agreement across machines.')], 'Describe what a user can observe when two replicas temporarily disagree.'),
  'system-design/partitioning': guide('Explain how splitting data changes both load and coordination.', [
    pick('nuNW8IfgPNU', 'Review hash-table lookup before comparing distributed partitioning schemes.'),
    pick('IFLQBWY6dlE', 'Follow the placement and execution issues introduced by distributed databases.'),
    pick('pQh5fka3FC0', 'Continue the distributed-database discussion and identify cross-partition work.')], 'Choose a partition key and describe a workload that would make it uneven.'),
  'system-design/caching-and-queues': guide('Understand reused data and delayed work through their underlying trade-offs.', [
    pick('8-2yv4z0VZc', 'Study a concrete cache: database buffer pools and replacement decisions.'),
    pick('CedEy54pe3g', 'Distinguish durable logging from volatile buffering. A log is not automatically a task queue.'),
    pick('PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB', 'Use the distributed-systems case studies to inspect state, replay, and coordination.')], 'Describe what happens if cached data is stale or a queued task is delivered twice.'),
  'system-design/reliability': guide('Connect failure handling with recovery and evidence of correctness.', [
    pick('CedEy54pe3g', 'Follow why write-ahead logging protects recoverability.'),
    pick('X2jc4qalNy0', 'Trace what a database restores after a crash.'),
    pick('PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB', 'Study the replication lectures and how the system reacts to machine failures.')], 'Write a recovery sequence and identify the state that must survive a restart.'),
  'system-design/case-studies': guide('Use complete systems to practise explaining trade-offs.', [
    pick('PLrw6a1wE39_tb2fErI4-WkMbsvGQk9_UB', 'Choose one published system from the course and identify its workload and failure assumptions.'),
    pick('IFLQBWY6dlE', 'Compare the distributed-database structure with your design.'),
    pick('qiVUf9X6ItM', 'Compare different database architectures rather than assuming one design suits every workload.')], 'Present your design with one rejected alternative and the condition that would change your choice.'),
  'inference-engineering/memory': guide('Separate model storage, cached context, and working memory.', [
    pick('EfM546A79aM', 'Study the inference lecture with attention to memory and cached computation.'),
    pick('l8pRSuU81PU', 'Inspect the systems work in a complete model implementation; distinguish training memory from inference memory.'),
    pick('PLoROMvodv4rOY23Y0BoGoBGgQ1zmU_MT_', 'Use the resource-accounting and inference lectures for a deeper sequence.')], 'Use the KV-cache lab to show which term changes when context length doubles.'),
  'inference-engineering/throughput': guide('Explain why faster completion of one request differs from more requests per second.', [
    pick('EfM546A79aM', 'Follow inference scheduling and efficiency trade-offs.'),
    pick('E8Mju53VB00', 'Connect kernel execution with the hardware work behind throughput.'),
    pick('l8pRSuU81PU', 'Watch how an implementation measures and improves useful work per unit time.')], 'Define a benchmark with fixed input and output lengths. Report latency as well as throughput.'),
  'inference-engineering/attention-kernels': guide('Connect the attention equation with its memory and compute implementation.', [
    pick('eMlx5fFNoYc', 'Follow the attention calculation before changing its implementation.'),
    pick('E8Mju53VB00', 'Study kernels, Triton, and execution-level optimisation.'),
    pick('EfM546A79aM', 'Connect attention costs with the wider inference workload.')], 'Explain how two implementations can compute the same result while moving different amounts of data.'),
  'inference-engineering/parallelism': guide('Identify what is split, what is copied, and what must communicate.', [
    pick('l8pRSuU81PU', 'Inspect the distributed implementation and its communication boundaries.'),
    pick('PLoROMvodv4rOY23Y0BoGoBGgQ1zmU_MT_', 'Follow the parallelism lectures in the course sequence.'),
    pick('EfM546A79aM', 'Compare those choices with the needs of model inference.')], 'Draw one parallelism strategy and label the data sent between devices.'),
  'inference-engineering/serving-stack': guide('Follow a model request through both application and inference services.', [
    pick('7t2alSnE2-I', 'Review request handling, validation, and response behaviour.'),
    pick('EfM546A79aM', 'Study the scheduling and compute work behind the model endpoint.'),
    pick('3c-iBn73dDE', 'Connect the process with its packaged runtime and deployment environment.')], 'Trace a request that is queued, cancelled, and retried. Identify which layer owns each action.'),
  'inference-engineering/measurement': guide('Measure a defined workload instead of comparing isolated headline numbers.', [
    pick('EfM546A79aM', 'Identify the workload assumptions behind inference performance.'),
    pick('JpAxdTWQJxM', 'Separate system speed from task quality and evaluation validity.'),
    pick('E8Mju53VB00', 'Connect a local optimisation with the measurements needed to assess it.')], 'Record hardware, batch size, token lengths, warmup, and latency percentiles before comparing results.'),
  'ai-research/transformers': guide('Connect an intuitive diagram with a complete implementation.', [
    pick('wjZofJX0v4M', 'Start with the visual explanation of information flow through attention.'),
    pick('kCc8FmEb1nY', 'Follow the same mechanism in a small working language model.'),
    pick('bHSDPgZYie0', 'Compare the broader transformer architecture perspective.')], 'Match a line of model code to the corresponding operation in the diagram.'),
  'ai-research/scaling': guide('Separate model size, data, compute, and the evidence behind a scaling claim.', [
    pick('9vM4p9NN0Ts', 'Follow the components and training choices needed to build a language model.'),
    pick('l8pRSuU81PU', 'Inspect a concrete training run and its systems constraints.'),
    pick('PLoROMvodv4rOY23Y0BoGoBGgQ1zmU_MT_', 'Use the scaling-law lectures, then compare their assumptions with the chapter.')], 'List which variable changes in an experiment and which variables must remain comparable.'),
  'ai-research/alignment': guide('Connect post-training objectives with observed behaviour and evaluation.', [
    pick('2oH6PWPrYFo', 'Follow the purposes of supervised adaptation and preference-based post-training.'),
    pick('JpAxdTWQJxM', 'Inspect what the evaluation measures and what it leaves untested.'),
    pick('PLoROMvodv4rOY23Y0BoGoBGgQ1zmU_MT_', 'Use the post-training and alignment lectures for the longer sequence.')], 'Describe one desired behaviour, its training signal, and a way the score could improve without the behaviour improving.'),
  'ai-research/pretraining-data': guide('Treat the dataset as an experimental choice with measurable effects.', [
    pick('-qm0ln33G24', 'Compare data sources and the decisions involved in assembling a dataset.'),
    pick('zduSFxRajkE', 'Inspect how tokenization changes the representation of training text.'),
    pick('l8pRSuU81PU', 'Connect prepared data with the actual training pipeline.')], 'Document provenance, duplicate handling, filtering, and the evaluation boundary for a small dataset.'),
  'ai-research/architectures-beyond': guide('Compare alternatives by the workload and constraints they address.', [
    pick('kCc8FmEb1nY', 'Establish a working transformer baseline before considering alternatives.'),
    pick('PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM', 'Choose the architecture talks relevant to the lesson. Use their named assumptions, not only headline results.'),
    pick('EfM546A79aM', 'Compare candidate architectures through inference memory and computation requirements.')], 'Write a comparison table with task quality, compute, memory, and limitations.'),
  'ai-research/reasoning': guide('Distinguish generated reasoning text, task outcomes, and training signals.', [
    pick('7xTGNNLPyMI', 'Use the reasoning and post-training discussion as conceptual background.'),
    pick('2oH6PWPrYFo', 'Connect changes in behaviour with the post-training process.'),
    pick('JpAxdTWQJxM', 'Ask whether the evaluation tests the intended capability or an easier substitute.')], 'Construct a case where a plausible explanation accompanies a wrong final answer.'),
  'ai-research/research-practice': guide('Make an experiment understandable and repeatable by another person.', [
    pick('JpAxdTWQJxM', 'Define the claim your evaluation can actually support.'),
    pick('-qm0ln33G24', 'Record dataset choices and possible sources of contamination.'),
    pick('l8pRSuU81PU', 'Inspect the implementation details required to reproduce a training run.')], 'Write an experiment card with hypothesis, baseline, data, controls, measurements, and a stopping rule.'),
  'open-robotics/vla': guide('Connect perception and language with actions that affect the physical world.', [
    pick('hTuW51CpUg4', 'Distinguish a robot’s task space from the set of configurations it can reach.'),
    pick('mGuDXlZEoSc', 'Review the control-system loop that turns a desired action into feedback-controlled motion.'),
    pick('PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM', 'Use relevant multimodal or robotics talks as advanced context; the core control ideas still need separate validation.')], 'Describe an instruction, its observable goal, and a physical constraint the robot must preserve.'),
  'open-robotics/perception-and-state': guide('Represent position and orientation before interpreting a robot’s observations.', [
    pick('PPgJPjCUIXU', 'Follow configuration representations and their limitations.'),
    pick('OZucG1DY_sY', 'Connect a rotation matrix with an actual change of orientation.'),
    pick('vlb3P7arbkU', 'Combine rotation and translation in a homogeneous transformation.')], 'Describe the same point in two reference frames and identify the transformation between them.'),
  'open-robotics/control-and-learning': guide('Connect a desired motion with measured error and a feedback response.', [
    pick('mGuDXlZEoSc', 'Start with the purpose of feedback and the parts of a control system.'),
    pick('ddkUszFVTUk', 'Watch how a control choice changes the response to error.'),
    pick('aC4LQuB4Cic', 'Distinguish planning a path from controlling motion along that path.')], 'Name the desired state, observed state, error, and action in a small control task.'),
}

export function chapterVideoGuide(track: string, module: string) { return chapterVideoGuides[`${track}/${module}`] }
export function chapterVideo(ref: string) {
  return videos.find(video => video.id === ref || (video.kind === 'playlist' && new URL(video.url).searchParams.get('list') === ref))
}
