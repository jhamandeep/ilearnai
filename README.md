# ilearnai

A free, complete learning site that takes a person with no coding and no AI background to building a complete AI system. Ten tracks in four levels (Level 0 foundations to Level 3 advanced), full lessons written in ASD-STE100 Simplified Technical English with animated diagrams, inline videos, exercises and quizzes, practice papers, a placement test, papers with reading notes, a glossary, roadmaps, a concept map, a hub of model, dataset and paper portals, and browser-local labs. No accounts, no paywall.

## The learning path

| Level | Tracks |
| --- | --- |
| Level 0 Foundations | Start Here (computers, Python, tools, data) · Mathematics for AI from Zero |
| Level 1 Beginner | AI Foundations (first models, neural networks, language models, using models) · Build the AI Ecosystem (a project track: chat app, RAG, agents, fine-tuning, deployment) |
| Level 2 Intermediate | ML Mathematics · AI Engineering · System Design |
| Level 3 Advanced | Inference Engineering · AI Research · Open Robotics (preview) |

`/path` shows the whole path with prerequisites and what each track lets you build. `/practice/placement` suggests a level. Progress (lessons done, quiz scores) is stored in the browser (`src/lib/progress.ts`).

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle in dist/
npm run lint
```

## Layout

- `src/data/` — all content as typed TypeScript: tracks → modules → lessons (Markdown with `$math$`). The four Level 0 and 1 tracks keep one module per file under `src/data/tracks/<track>/<module>.ts` with a matching glossary file in `src/data/glossary/<module>.ts` (all glossary files are merged automatically); the older tracks are one file each. Also papers (with `prereqs` forming the reading-order hierarchy), glossary, blog posts, external resources and tools, roadmaps, the Knowledge Topography graph, and the lab registry.
- `src/pages/` — one file per route group. Lesson, paper, lab, blog, graph, hierarchy, resources and roadmap routes are lazy-loaded so Markdown/KaTeX, d3 and the labs stay out of the main bundle.
- `src/labs/` — pure client-side calculators and animations. No network calls. Includes KV cache sizing, an animated transformer block, an attention heat-map, a BPE tokenizer trainer, a gradient-descent race (SGD / momentum / Adam), sampling, the Agent Control Room, a Pareto model router, a timeout architect with log-normal tail simulation, and capacity planning.
- `/knowledge-graph` — d3-force concept map linking concepts, lessons, papers, labs and glossary terms. `/hierarchy` — papers laid out as a prerequisite DAG per track.
- `src/lib/auth.tsx` — client-side session and Pro entitlement stored in localStorage.

## Writing lessons

`CONTENT_SPEC.md` is the single reference for writing a lesson: audience and levels, the writing standard, the eight-section lesson anatomy, the block grammar, pedagogy rules, the file format, the verified video bank, glossary rules and the full Level 0 and 1 curriculum. Validate a module with `node scripts/check-visuals.mjs --file src/data/tracks/<track>/<module>.ts`.

## Writing standard

All lesson text follows ASD-STE100 Simplified Technical English: sentences of at most 20–25 words, active voice, present tense, one term per concept, abbreviations spelled out on first use, no idioms. Every lesson has the same eight sections (what it covers, why it matters, the idea with an example, how it works, try it, common mistakes, check your understanding, go further) plus objectives, key terms and free links. `/style` documents the rules and `/labs/ste-checker` tests any text against the machine-checkable ones (`src/lib/ste.ts`).

## Visual blocks in lessons

Lesson bodies can embed twelve block types between paragraphs using `:::kind … :::` containers (converted to fenced code at render time so lesson text never needs backticks): `flow` (boxes and arrows with a travelling packet), `arch` (layered architecture with an animated request path), `timeline` (lanes, work bars and messages over time), `scenario` (a step player with a live state panel), `bars` (animated comparison), `matrix` (heat-map grid), `code` (code with a copy button), `exercise` (task, hint and hidden solution), `quiz` (multiple choice with explanations, scored and saved locally), `video` (an inline free video from the verified bank) `graph` (function curves and point series with a tangent and a hover readout, drawn from a safe expression parser) and `anim` (a narrated continuous animation in the style of 3Blue1Brown: a 960x540 stage with boxes, axes, curves, dots, vectors and counters, scripted as objects plus narrated steps and played as a GSAP timeline with play, scrub, step, speed and full-screen controls). Renderers live in `src/components/rich/`. The style guide page shows a live example of each. `npm run visuals` validates every block in every lesson and reports coverage per track; `--file <module.ts>` runs the strict per-module check used while writing.

## Videos

`src/data/videos.ts` lists free YouTube lectures, playlists and channels per track. Video ids were checked against public listings; where only a playlist or channel could be confirmed, that is what is linked. Videos with an id play inline through youtube-nocookie.

## Practice and hub

`/practice` lists practice papers per track built from the lesson quizzes (`src/lib/exams.ts`) and the placement test. `/hub` (`src/data/portals.ts`) links model and dataset hubs (Hugging Face, Kaggle), practical courses and paper portals (arXiv, Papers with Code, Semantic Scholar) grouped by level.

## Not included

No analytics, sitemap, `llms.txt`, or RSS yet.

## Smoke test

`npm run smoke` server-renders every route and fails if any one 404s or throws. It also checks that every roadmap link, graph node link, graph edge, paper prerequisite and glossary cross-reference resolves.
