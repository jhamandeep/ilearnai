import type { ChapterVideoGuide } from './chapterVideos'

export const completeAiVideoGuides: Record<string, ChapterVideoGuide> = {
  'complete-ai/ideas-and-reasoning': { goal: 'Build a map of rules, learning, and model-based decisions before choosing a method.', picks: [
    { ref: 'J8Eh7RqggsU', focus: 'Use the Stanford AI overview to distinguish search, logic, probabilistic reasoning, and learning.' },
    { ref: 'UzxYlbK2c7E', focus: 'Connect examples, model parameters, and fitting in a full introductory machine-learning lecture.' },
    { ref: 'zjkBMFhNj_g', focus: 'Contrast language-model training and generation with explicitly written symbolic rules.' },
  ], practice: 'Choose one business task. Explain which part needs a rule, which part might use learning, and how each is tested.' },
  'complete-ai/neural-networks': { goal: 'Follow the full sequence from network representation to derivatives and a framework training loop.', picks: [
    { ref: 'aircAruvnKk', focus: 'Draw the inputs, hidden layers, weights, and outputs while following the network example.' },
    { ref: 'Ilg3gGewQ5U', focus: 'Follow how a loss supplies a signal for earlier parameters through backpropagation.' },
    { ref: 'V_xro1bcAuA', focus: 'Use the tensor, automatic differentiation, and training-loop chapters to connect the mathematics to PyTorch.' },
  ], practice: 'Compute one update by hand and compare it with the framework example. Keep a separate validation set.' },
  'complete-ai/computer-vision': { goal: 'Study image processing, local features, generated images, object boxes, and pixel masks as different tasks.', picks: [
    { ref: 'vT1JzLTH4G4', focus: 'Begin with the computer-vision task map and how datasets changed the field.' },
    { ref: 'bNb2fEVKeEo', focus: 'Trace convolution and pooling operations before treating the network as an image classifier.' },
    { ref: '5WoItGTWV54', focus: 'Compare the objectives of autoencoders, VAEs, and GANs, including what each objective does not guarantee.' },
    { ref: 'nDPWywWRIRo', focus: 'Distinguish bounding-box detection, semantic segmentation, and instance segmentation.' },
    { ref: 'PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv', focus: 'Use the full CS231n sequence for training methods, transfer, visualisation, and additional implementations.' },
  ], practice: 'Create a table with one input, output shape, annotation requirement, and failure measure for each vision task.' },
  'complete-ai/language-and-representation': { goal: 'Move from word representations through sequence models to contextual attention and generation.', picks: [
    { ref: 'viZrOnJclY0', focus: 'Relate word-vector geometry to context and identify the limits of a static representation.' },
    { ref: '6niqTuYFZLQ', focus: 'Follow recurrent state through time and compare RNN, LSTM, and GRU architectures.' },
    { ref: 'wjZofJX0v4M', focus: 'Track how attention combines token information and why masking changes available context.' },
    { ref: 'PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ', focus: 'Use the complete CS224N series to connect embeddings, sequence tagging, attention, and pretrained language models.' },
  ], practice: 'Describe the output difference between a document classifier, a named-entity tagger, an encoder, and a next-token generator.' },
  'complete-ai/search-and-agents': { goal: 'Compare searching over candidates with learning action choices from interaction.', picks: [
    { ref: 'J8Eh7RqggsU', focus: 'Use the search and decision-making portions to identify states, choices, and constraints.' },
    { ref: 'FgzM3zpZ55o', focus: 'Follow states, actions, rewards, policies, and the distinction between prediction and control.' },
    { ref: 'PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX', focus: 'Study MDPs, value estimation, exploration, and policy gradients in the full reinforcement-learning course.' },
  ], practice: 'Specify a small shared-resource problem. Define feasible actions, a reward, a coordination rule, and a failure case.' },
  'complete-ai/responsible-practice': { goal: 'Connect responsible-AI principles to data choices, measurement, and the people affected by a system.', picks: [
    { ref: 'wmyVODy_WD8', focus: 'Identify sources of bias across the lifecycle and distinguish aggregate scores from group outcomes.' },
    { ref: '-qm0ln33G24', focus: 'Advanced extension: inspect source selection and data curation decisions before discussing downstream behaviour.' },
    { ref: 'JpAxdTWQJxM', focus: 'Advanced extension: examine what an evaluation can establish and where its conclusions stop.' },
  ], practice: 'Write a release review that names affected people, representative evidence, accessibility needs, and a person who can stop the workflow.' },
  'complete-ai/multimodal-extension': { goal: 'Understand representations across image and language before comparing multimodal products.', picks: [
    { ref: 'P127jhj-8-Y', focus: 'Connect attention-based architectures across language, vision, and reinforcement-learning settings.' },
    { ref: '5WoItGTWV54', focus: 'Review generative objectives so image generation is not confused with image-text similarity.' },
    { ref: 'PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM', focus: 'Explore the seminar series for deeper work on multimodal representations and their evaluation.' },
  ], practice: 'Design a comparison between matching an image to text and generating an image from text. Give each task its own evaluation.' },
}
