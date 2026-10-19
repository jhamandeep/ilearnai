import type { Lab } from './types'

export const labs: Lab[] = [
  {
    slug: 'kv-cache',
    title: 'KV cache memory estimator',
    blurb: 'Size the cache for any model config and see how many sequences fit on a GPU.',
    category: 'inference',
  },
  {
    slug: 'agent-control-room',
    title: 'Agent Control Room',
    blurb: 'Chain per-step success rates with retries and fallbacks to see what multi-step reliability really is.',
    category: 'agents',
  },
  {
    slug: 'capacity',
    title: 'Back-of-the-envelope capacity',
    blurb: 'Users, requests, bytes, and peak factors into QPS, bandwidth, and storage.',
    category: 'systems',
  },
  {
    slug: 'sampling',
    title: 'Sampling playground',
    blurb: 'Temperature, top-k, and top-p applied to a logit vector, visualised.',
    category: 'math',
  },
]
