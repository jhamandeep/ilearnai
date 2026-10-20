import type { Lab } from './types'

export const labs: Lab[] = [
  { slug: 'kv-cache', title: 'KV cache memory estimator', blurb: 'Size the cache for any model config and see how many sequences fit on a GPU.', category: 'inference' },
  { slug: 'transformer-flow', title: 'Transformer block, animated', blurb: 'Follow one token through embedding, attention, MLP and the residual stream.', category: 'math' },
  { slug: 'attention', title: 'Attention visualiser', blurb: 'Type a sentence and watch the attention matrix sharpen, flatten, and mask.', category: 'math' },
  { slug: 'tokenizer', title: 'Tokenizer trainer', blurb: 'Train byte-pair encoding on your own text and watch merges form, one at a time.', category: 'inference' },
  { slug: 'gradient-descent', title: 'Gradient descent playground', blurb: 'SGD, momentum and Adam racing down three loss surfaces, animated.', category: 'math' },
  { slug: 'sampling', title: 'Sampling playground', blurb: 'Temperature, top-k, and top-p applied to a logit vector, visualised.', category: 'math' },
  { slug: 'agent-control-room', title: 'Agent Control Room', blurb: 'Chain per-step success rates with retries and fallbacks to see what multi-step reliability really is.', category: 'agents' },
  { slug: 'pareto-router', title: 'Model router and Pareto explorer', blurb: 'Find the frontier of quality versus cost and route easy requests to the cheap side.', category: 'agents' },
  { slug: 'timeout-architect', title: 'Timeout architect', blurb: 'Set per-hop timeouts and retries, then simulate the tail of the whole chain.', category: 'systems' },
  { slug: 'ste-checker', title: 'STE writing checker', blurb: 'Paste any text and get it checked against the ASD-STE100 rules this site is written in.', category: 'writing' },
  { slug: 'capacity', title: 'Back-of-the-envelope capacity', blurb: 'Users, requests, bytes, and peak factors into QPS, bandwidth, and storage.', category: 'systems' },
]
