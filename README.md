# ilearnai

A free, complete learning site: full lessons written in ASD-STE100 Simplified Technical English, free video lectures, papers with reading notes, a glossary, roadmaps, a concept map, and browser-local labs. No accounts, no paywall.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle in dist/
npm run lint
```

## Layout

- `src/data/` — all content as typed TypeScript: tracks → modules → lessons (Markdown with `$math$`), papers (with `prereqs` forming the reading-order hierarchy), glossary, blog posts, external resources and tools, roadmaps, the Knowledge Topography graph, and the lab registry.
- `src/pages/` — one file per route group. Lesson, paper, lab, blog, graph, hierarchy, resources and roadmap routes are lazy-loaded so Markdown/KaTeX, d3 and the labs stay out of the main bundle.
- `src/labs/` — pure client-side calculators and animations. No network calls. Includes KV cache sizing, an animated transformer block, an attention heat-map, a BPE tokenizer trainer, a gradient-descent race (SGD / momentum / Adam), sampling, the Agent Control Room, a Pareto model router, a timeout architect with log-normal tail simulation, and capacity planning.
- `/knowledge-graph` — d3-force concept map linking concepts, lessons, papers, labs and glossary terms. `/hierarchy` — papers laid out as a prerequisite DAG per track.
- `src/lib/auth.tsx` — client-side session and Pro entitlement stored in localStorage.

## Writing standard

All lesson text follows ASD-STE100 Simplified Technical English: sentences of at most 20–25 words, active voice, present tense, one term per concept, abbreviations spelled out on first use, no idioms. Every lesson has the same seven sections (what it covers, why it matters, a worked example, how it works, common mistakes, check questions, go further) plus objectives, key terms and free links. `/style` documents the rules and `/labs/ste-checker` tests any text against the machine-checkable ones (`src/lib/ste.ts`).

## Videos

`src/data/videos.ts` lists free YouTube lectures, playlists and channels per track. Video ids were checked against public listings; where only a playlist or channel could be confirmed, that is what is linked. Videos with an id play inline through youtube-nocookie.

## Not included

No analytics, sitemap, `llms.txt`, or RSS yet.

## Smoke test

`npm run smoke` server-renders every route and fails if any one 404s or throws. It also checks that every roadmap link, graph node link, graph edge, paper prerequisite and glossary cross-reference resolves.
