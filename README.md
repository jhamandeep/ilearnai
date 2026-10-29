# ilearnai

A free AI learning site for people who want to apply AI in their work and people who want to build AI systems. The practical path starts with an industry, a role, and a work problem; the technical path goes from no coding background to building complete systems. Eleven tracks span four levels (Level 0 foundations to Level 3 advanced), with 245 lessons, animated diagrams, chapter video sequences, exercises and quizzes, practice papers, a placement test, papers with reading notes, a glossary, roadmaps, a concept map, a hub of model, dataset and paper portals, and browser-local labs. Open draft access with browser-saved progress; optional accounts and no paywall.

## Teaching voices, Ask me and practical pathways

All 295 explainers and the RAG sample now use two conversational synthetic voices: Microsoft Ava (female) and Andrew (male). They take two-scene turns so an idea and its example stay together. The build-time pronunciation layer reads exact decimals, negative values, scientific notation, software versions, units, acronyms and selected tool names. For example, `0.0003` keeps every decimal digit while `Python 3.12` is read as “Python three point twelve.” Captions retain the authored text. Measured audio cues drive the existing diagrams; recordings have new content-hashed URLs so old cached voices are not reused.

The original neural-network logo animates its connections and central spark. Pause motion and reduced-motion preferences stop it. Violet replaces the primary selection and highlight accent. The homepage now links to the full labs without embedding gradient descent.

`/certifications` compares eight official pathways by role, preparation, experience and exam status, with provider links and a practical project for each. `/ai-infrastructure` explains five workloads, suggested starting computers, managed versus self-hosted systems, a request walkthrough and a weight-memory calculator. Hardware estimates are starting points, and the calculator explicitly excludes runtime, cache and training overhead. Certification availability and fees were checked on 29 October 2026 and should be confirmed with the provider before booking.

The floating **Ask me** panel uses built-in help, course summaries and the glossary. It can explain the current lesson or link to the new guides. It has no backend LLM, sends no questions to a service, and keeps at most 12 exchanges in page memory. It supports keyboard focus, Escape, clearing and navigation. Existing open-preview access and learning progress are unchanged.

The audio audit fully decoded 296 AAC files (including the sample), checked all 1,749 spoken cues for usable audio and timing, and found no clipping. The 295 main recordings total 178.5 minutes and 87 MB. The pronunciation test covers exact decimals, versions, addresses, scientific notation, units and acronyms. These checks validate the files and pronunciation rules; they do not represent a human listening review of every sentence.

Build passes. The new recordings passed all 295 explainer routes and 2,036 scene checks with no browser errors. Browser checks also cover 94 guide/chat/brand cases, 228 diagram readability cases, the gradient lab and homepage, and the new sample’s full player controls. The production server also passes the guide/chat suite and shared player controls. Product rendering covers all 245 lessons and 1,419 activities. Lint retains 16 existing warnings; the existing large main-bundle warning remains.

Rollback for this update: `rollback/before-ai-brand-askme-20261029` at `c5ad8e0`. Browser screenshots and functional results: `output/reviews/guides-chat/`. Run `npm run test:guides-chat-browser` with the app on port 5178 (or set `APP_URL`).

## Readable diagrams and compact mobile navigation

Lesson reading text is now 18px (17px on phones); captions, transcript text, course navigation and diagram labels are larger too. The shared renderer fits the measured content instead of a fixed empty 960×540 frame. Small players focus on the active explanation; wide diagrams use contained horizontal scrolling to preserve a 14px minimum label scale. The player and older flow/architecture diagrams use the page's light surface and matching controls. Play/resume sits below the drawing so it cannot cover a result.

The data-set, attention and PID explainers were recomposed with separate label lanes and meaningful transformations. `morph SOURCE -> TARGET` transfers a visible object into its result, including rectangle shape/colour changes, and supports reverse seeking and reduced motion. PID now plots the joint response with P/I/D explanations; attention shows proportional weights and combines weighted values. That layout-only update preserved its existing audio; the later teaching-voice update above replaces those recordings. Geometry-only narration changes can be rekeyed safely using `npm run narration:export && node scripts/reuse-narration.mjs`; the helper refuses any changed or ambiguous spoken text.

The mobile marketing header now starts as a compact logo/menu row. Its expandable navigation supports Escape, outside clicks, route changes, and breakpoint changes. Course navigation keeps the existing overlay behaviour. Rollback: `rollback/before-readable-diagrams-20261029` at `ab82fa4`. Browser review screenshots and reports are under `output/reviews/readable/`.

Validation: the 295-explainer playback regression passed 2,036 scene checks. The focused browser suite passed 228 scene/viewport checks for readable type, fitted node text, label collisions, transformations, backward seeking, reduced motion, and compact menus at 1440/720/390/320px; plot-framing follow-ups covered all 12 curve explainers. Product rendering passed 1,419 activity pages and 11 labs; all 11 course navigation checks pass. Build and visual validation pass; lint retains 16 existing warnings. Run `npm run test:readability-browser` for the focused regression.

## Course navigation and reading highlights

Opening a course or lesson automatically hides the main Home navigation. The menu button reopens it as an overlay, so it does not take width from course contents or the lesson. Selecting a menu link, changing routes, resizing across the mobile breakpoint, Escape, and the backdrop close the temporary drawer. Desktop browsing outside courses retains its separate menu preference.

Course headers, selected chapters, activity tabs, and action links now use blue, violet, and warm amber accents. Key ideas, worked examples, practice, and cautions have labelled highlights; the existing lesson text, diagrams, narration, progress, and practice logic are preserved. These styles apply inside courses, with no homepage redesign.

`npm run test:course-focus-browser` verifies all 11 course entry points, menu/back/route-change behaviour, content width, 1920/1100/900/390/320px layouts, reading highlights, and narration playback in Chrome 156. Product rendering also passed all 1,419 activity pages, and the course workspace checks passed all 245 lessons and 63 chapters. Screenshots are under `output/reviews/course-focus/`. Rollback before this change: `rollback/before-course-focus-20261029` at `18c28fe`.

## Narration across courses, work guides, and labs

All 245 lesson animations, 36 industry walkthroughs, 11 lab introductions, and three style-guide examples use Ava and Andrew conversational synthetic voices. Each of the 295 explainers has its own recording and measured scene cues. The existing lesson-specific diagrams, calculations, and labels remain the visual content; the audio clock now drives their builds, arrows, counters, and transitions. Narration includes authored step explanations, including those in the Microsoft curriculum track. Work guides narrate their concrete fictional examples and retain the decision questions and implementation guidance. Lab recordings explain fixed teaching examples alongside the live calculators.

The shared player provides play/pause, replay, a scrubber, previous/next scene, five-second rewind, speed, mute, captions, full screen, diagram enlargement, and a full transcript with scene jumps. On small screens the camera frames the active part of the diagram. Reduced motion shows completed scene states while still allowing explicit audio playback. There is no autoplay; leaving the page, hiding the tab, scrolling the player out of view, or starting another explainer pauses the recording. Failed downloads offer a retry and retain the transcript. No speech service or LLM runs during playback.

Recordings use content-addressed URLs. Editing an animation invalidates its recording rather than replaying stale speech. `npm run build` checks that every published explainer has a matching recording. New authoring drafts retain a readable, manually selectable diagram until their recordings are generated. Learning progress identifiers and quiz behaviour are unchanged.

To update recordings, install `scripts/requirements-narration.txt` in an isolated Python environment. Generation uses [edge-tts](https://github.com/rany2/edge-tts) at build time and macOS `afconvert` for AAC encoding. It requires network access to generate speech; playback only downloads local static assets. Then run:

```sh
npm run narration:export
output/neural-voice/venv/bin/python scripts/narration-speech-test.py
output/neural-voice/venv/bin/python scripts/build-course-narration.py
npm run test:narration
output/neural-voice/venv/bin/python scripts/audit-narration-audio.py
npm run test:narration-browser
```

Generation is resumable: identical voice/text/rate/pronunciation combinations are cached under ignored `output/narration/teaching-segments/`. Ten bounded generation tasks retry transient failures. Each scene is decoded and validated, trailing service padding is trimmed, teacher loudness is balanced conservatively, and a longer pause marks a change of speaker. Only a complete set of recordings replaces the manifest; a failed build leaves the previous cue sheet in place. The old Kokoro recordings remain recoverable from the rollback tag. No model weights, temporary WAVs or generation credentials ship to the browser.

Previous voice rollout validation (before the two-teacher update): Chrome 156 passed all 295 explainer routes and 2,036 scene checks, shared controls, audio exclusivity, navigation cleanup, 1440/390/320px layouts, reduced motion, and blocked-download retry. All 295 AAC files fully decoded with no silent spoken scenes or clipped samples. The product check passed all 1,419 activity pages, and work checks covered 252 role views. Production course/work/lab playback and seeking passed. Build passes; lint retains 16 existing warnings. The recordings total 160.5 minutes and approximately 80 MB; they load per player. These checks establish playback and synchronization, not a listening review of every spoken sentence. Local reports are under `output/reviews/sitewide-narration/` and `output/narration/`.

## Narrated explainer sample

Open `/preview/narrated-explainer` for a short concept sample from the RAG chapter. It uses a recorded synthetic voice, timed SVG scene builds, synchronized captions, a scrubber, pause/resume, replay, mute, playback speed, scene jumps, and full screen. The audio clock drives every visual frame. Smaller players follow the active part of the diagram; reduced motion disables the camera transition and gradual reveals. Audio starts only after Play and stops on navigation or when the document is hidden.

This route preserves the RAG diagram and script, with the same two teaching voices used throughout the courses. The sample diagram includes an illustrative refund policy, not real business data. Its conceptual source is [Microsoft's RAG overview](https://learn.microsoft.com/en-ca/azure/ai-foundry/concepts/retrieval-augmented-generation?view=foundry-classic).

To regenerate on macOS (Python 3.13 tested):

```sh
python3 -m venv output/neural-voice/venv
output/neural-voice/venv/bin/python -m pip install -r scripts/requirements-narration.txt
output/neural-voice/venv/bin/python scripts/build-explainer-sample.py
```

The previous sample, including its voice asset and cue sheet, is preserved locally at `output/rollback/before-natural-voice-20261028/sample-before-voice-change.tgz`.

`npm run test:explainer-browser` uses installed Chrome and the app at `http://127.0.0.1:5178` (override `APP_URL`). It exercises actual audio decoding/playback, cue synchronization, all controls, navigation cleanup, mobile layout, reduced motion, and blocked-audio recovery. It does not assess how natural the voice sounds. Rollback before this sample: `rollback/before-video-explainer-sample-20261028` at `41a208d`; a ZIP is saved locally under `output/rollback/before-video-explainer-sample-20261028/`.

## Python startup, course artwork, and gradient lab (28 October 2026)

The Python startup failure was reproduced in Chrome: a module worker created from a `blob:null` URL would not start inside the opaque-origin iframe. The runner now creates the module worker from a data URL and catches runtime-download errors separately from learner-code errors. It retains `sandbox="allow-scripts"`, source/token validation, the CDN-only connection policy, execution limits, and teardown. Failed downloads preserve the draft and offer a retry.

All 11 course covers now use original, distinct SVG illustrations with topic-specific live motion: code execution, a function curve, neural signals, an agent workflow, an optimisation path, retrieval, service routing, token batching, experimental results, a robot arm, and connected AI fields. The shared covers appear in course cards, course headers, and learning progress views. The toolbar's cover-motion control remembers a pause; reduced motion, hidden tabs, and offscreen artwork suspend animation. `node scripts/generate-course-art.mjs` reproduces the illustrations.

The actual gradient-descent lab has one responsive workspace for its plot, controls, numeric results, and loss trace, on both the homepage and lab page. Blue/coral contours replace green tones; start/current/minimum markers, parameter axes, and a manual **One step** control explain the animation. Reduced motion starts the lab paused; an explicit Play action can start it. The saddle plot includes both true minima and preserves negative loss values; Adam uses the selected learning rate without a hidden multiplier. Unstable steps stop with reset guidance. The standalone lab now appears before its longer explanation.

Browser checks run with the dev server at `http://127.0.0.1:5178` (override `APP_URL`), using installed Chrome through Playwright (`BROWSER_CHANNEL` can override the browser channel):

- `npm run test:python-browser`: real sandbox startup, meaningful starter failure, successful checks/output, blocked download and retry, Python exceptions, stop/retry, draft persistence, and navigation cleanup.
- `npm run test:visual-browser`: all 11 assets and live SVG scenes, pause/resume and persistence, reduced motion, offscreen suspension, all nine surface/optimiser first-step calculations, unstable-step recovery, and homepage/full-lab layout at 1440, 900, 390, and 320px.

This pass verifies Chrome 156; it does not establish Safari/Firefox compatibility or verify external video playback. Screenshots and local review output are under `output/reviews/course-artwork-20261028/`. Rollback: **`rollback/before-python-and-course-art-20261028`** at `ab3c9f0`, plus the local `output/rollback/before-python-and-course-art-20261028/project-snapshot.zip`.

## Completed curriculum and study workspace

The course workspace now applies to **all 11 tracks, 63 chapters, and 245 lessons**. Each course shows its whole lesson list without nested collapsed groups, with chapter selection, progress, and shareable `?view=lessons|videos|practice|resources&chapter=<slug>` filters. Video view exposes every chapter sequence and its previews. Practice view exposes every lesson task and its quiz link. Resources view collects and categorizes the actual lesson sources for the selected chapters. Lesson overviews show the existing application and worked example, and every animation page includes its learning objective and common mistakes. Summary panels render formulas as mathematics.

The runner also opens **103 existing lesson exercises** across all ten original tracks, alongside the 16 guided exercises. Each linked exercise preserves its task, hint, worked solution, independent draft, and a return link to the exact lesson activity. These 103 reference solutions were executed with real Pyodide/WASM and use compatible, self-contained Python. They are practice without automatic grading, and running them does not mark a lesson complete. Other tasks retain their original project or notebook instructions. `scripts/check-lesson-python.mjs --refresh` audits candidate references and refreshes `src/data/lessonPythonSupport.json`; a content fingerprint disables a stale shortcut when its solution changes. This compatibility index is not a sandbox or a correctness certificate; execution still uses the isolated runtime.

Coverage checks: `npm run test:course-workspace` exercises all four views for every course, all 63 chapter selections, every lesson practice entry, 799 course-source entries, all 103 Python deep links, and actual chapter/format button interactions in a simulated DOM. `npm run test:lesson-python` re-executes the supported references. `npm run check:product -- --preview` verifies the shared study tools on all 1,419 activity pages and guidance on all 245 animation pages. Course progress and existing activity/quiz identifiers are preserved. That stage used code checks; the later Chrome checks above cover Python startup and the revised visuals. External video playback remains unverified.

Rollback for the course-wide extension: **`rollback/before-course-wide-refinement-20261028`**, commit `1487d6a`, plus `output/rollback/before-course-wide-refinement-20261028/project-snapshot.zip` locally.

`/courses/complete-ai` teaches the 24 core topics of Microsoft's **AI for Beginners**, plus its multimodal extension. The portal includes the full main lesson readings, 95 linked diagrams/images, 25 original worked examples and animated walkthroughs, 25 practice tasks with solutions, and 75 explained questions. Seven chapter sequences add 24 curated video selections. Full framework notebooks and source lab assignments remain external, with environment instructions; they are not represented as completed in-browser notebook implementations.

The readings are adapted from commit `392d0df1b2647cbee104942390551f1ed9e072c8` of [Microsoft AI for Beginners](https://github.com/microsoft/AI-For-Beginners), with copyright, image credits, source links, and the [MIT license](public/licenses/microsoft-ai-for-beginners.txt) retained. These readings include historical models and terminology. Original ilearnai guides explain practical limitations; the OpenCV constant and Gym migration notes identify specific compatibility considerations. The checked-in reading JSON is used at build time. To reproduce the import, run `python3 scripts/import-microsoft-curriculum.py`; its pinned source manifest is checked in and downloads are cached under ignored `output/`.

The YouLearn-inspired learning interface uses white study surfaces, charcoal controls, restrained blue/purple accents, activity tabs, and a responsive study panel. Every lesson has Summary, Flashcards, Notes, and static Ask tabs. Notes save under `ilearnai:note:<account-or-guest>:<lesson-route>` in localStorage and can be downloaded; they do not sync across devices. Flashcard recall does not mark course activities complete. Ask uses built-in content and has no LLM connection. Smaller screens retain chapter navigation in an expandable list. Reduced-motion preferences disable the new reveal and hover effects. The homepage content and logo are preserved.

`/code` now has 16 standard-library Python exercises and 48 checks, including rule evidence, perceptrons, convolution responses, detection overlap, text vectors, recurrent state, Q-learning updates, and disaggregated evaluation. The larger portal has 63 chapter sequences, 200 video selections, 1,419 learning activities, and 2,215 rich lesson blocks.

Validation: production build, lint (16 existing warnings), complete activity server-rendering in guest preview, course-flow checks, chapter video selection checks, study-tool DOM interactions, and real Pyodide/WASM exercise execution in Node. `npm run test:study-tools` checks notes persistence, account/lesson isolation, keyboard tabs, flashcards, storage failure, and static Ask without network calls. All 95 new reading image URLs returned HTTP 200 on 28 October 2026. That stage was limited to code checks; see the later Chrome validation above. Actual YouTube playback remains unverified.

Rollback before this completion pass: tag **`rollback/pre-complete-curriculum-20261028`**, commit `d35450f`. The additional local snapshot is `output/rollback/before-complete-curriculum-20261028-103453/project-snapshot.zip`; runtime data and environment secrets are excluded. To inspect the checkpoint without disturbing current work, use `git worktree add ../ilearnai-rollback rollback/pre-complete-curriculum-20261028`. Publishing an earlier version should use a reviewed revert commit, not a forced history rewrite. Earlier draft sections below describe their individual implementation stages.

## Current draft: open access

Sign-in is optional during review. `npm run dev`, `npm run preview`, and `npm start` expose all lessons, labs, libraries, practice, and the dashboard without an account. The homepage gradient-descent lab is open too. Signed-out progress saves under `ilearnai:preview-progress:v1` in this browser, separate from account progress; clearing site data removes it. Existing signed-in users continue using their account progress.

For production, start the server with `REQUIRE_LOGIN=1 npm start` (or `REQUIRE_LOGIN=1 npm run dev` to test the gate locally). This single server setting restores both route access checks and the curriculum API requirement. The frontend reads the mode from the session response; no separate client build setting is needed. Account APIs retain their session checks in both modes.

## The learning path

| Level | Tracks |
| --- | --- |
| Level 0 Foundations | Start Here (computers, Python, tools, data) · Mathematics for AI from Zero |
| Level 1 Beginner | AI Foundations (first models, neural networks, language models, using models) · Build the AI Ecosystem (a project track: chat app, RAG, agents, fine-tuning, deployment) · AI from first principles (Microsoft curriculum readings with original guided practice) |
| Level 2 Intermediate | ML Mathematics · AI Engineering · System Design |
| Level 3 Advanced | Inference Engineering · AI Research · Open Robotics (preview) |

`/path` shows the whole path with prerequisites and what each track lets you build. `/practice/placement` suggests a level. Progress (activities and lessons done, quiz scores, practice results) saves in this browser for draft visitors, or per account in SQLite when signed in. `/dashboard` shows overall and course activity progress, quiz activity, and the next unfinished activity in the most recent lesson.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle in dist/
npm run lint
```

## Layout

The shared visual style follows the typography and spacing of Google AI's learning page: Google Sans Flex, a centered landing-page cover, rounded course artwork, neutral pill controls, and pale-blue feature sections. `src/google-style.css` contains the marketing appearance; `src/skills-style.css` supplies the Google Skills-inspired application navigation, Google Sans / Google Sans Text typography, navy course headers, searchable catalogue, and activity pages. `src/index.css` retains the component structure. Ten course covers use different subject illustrations; eight new assets and their generation prompts are recorded in `output/imagegen/skills-image-prompts.json`. Font files load from Google Fonts with local system fallbacks. Lesson animations have a theme-aware stage and an interactive player with a transcript. All 220 lessons contain an animation; worked examples in the existing lesson scenarios supply the 120 additions.

- `src/data/` — all content as typed TypeScript: tracks → modules → lessons (Markdown with `$math$`). The four Level 0 and 1 tracks keep one module per file under `src/data/tracks/<track>/<module>.ts` with a matching glossary file in `src/data/glossary/<module>.ts` (all glossary files are merged automatically); the older tracks are one file each. Also papers (with `prereqs` forming the reading-order hierarchy), glossary, blog posts, external resources and tools, roadmaps, the Knowledge Topography graph, and the lab registry.
- `src/pages/` — one file per route group. Lesson, paper, lab, blog, graph, hierarchy, resources and roadmap routes are lazy-loaded so Markdown/KaTeX, d3 and the labs stay out of the main bundle.
- `src/labs/` — pure client-side calculators and animations. No network calls. Includes KV cache sizing, an animated transformer block, an attention heat-map, a BPE tokenizer trainer, a gradient-descent race (SGD / momentum / Adam), sampling, the Agent Control Room, a Pareto model router, a timeout architect with log-normal tail simulation, and capacity planning.
- `/knowledge-graph` — d3-force concept map linking concepts, lessons, papers, labs and glossary terms. `/hierarchy` — papers laid out as a prerequisite DAG per track.
- `src/lib/auth.tsx` — server-backed session, protected learning routes, and account progress synchronization.

## Writing lessons

`CONTENT_SPEC.md` is the single reference for writing a lesson: audience and levels, the writing standard, the eight-section lesson anatomy, the block grammar, pedagogy rules, the file format, the verified video bank, glossary rules and the full Level 0 and 1 curriculum. Validate a module with `node scripts/check-visuals.mjs --file src/data/tracks/<track>/<module>.ts`.

## Writing standard

Original lesson text targets ASD-STE100 Simplified Technical English: sentences of at most 20–25 words, active voice, present tense, one term per concept, abbreviations spelled out on first use, no idioms. Attributed Microsoft readings retain their source writing and are not claimed to meet that standard. Every lesson has the same eight sections (what it covers, why it matters, the idea with an example, how it works, try it, common mistakes, check your understanding, go further) plus objectives, key terms and free links. `/style` documents the rules and `/labs/ste-checker` tests any text against the machine-checkable ones (`src/lib/ste.ts`).

## Visual blocks in lessons

Lesson bodies can embed twelve block types between paragraphs using `:::kind … :::` containers (converted to fenced code at render time so lesson text never needs backticks): `flow` (boxes and arrows with a travelling packet), `arch` (layered architecture with an animated request path), `timeline` (lanes, work bars and messages over time), `scenario` (a step player with a live state panel), `bars` (animated comparison), `matrix` (heat-map grid), `code` (code with a copy button), `exercise` (task, hint and hidden solution), `quiz` (multiple choice with explanations, scored and saved to the account), `video` (an inline free video from the verified bank) `graph` (function curves and point series with a tangent and a hover readout, drawn from a safe expression parser) and `anim` (a narrated continuous animation in the style of 3Blue1Brown: a 960x540 stage with boxes, axes, curves, dots, vectors and counters, scripted as objects plus narrated steps and played as a GSAP timeline with play, scrub, step, speed and full-screen controls). Renderers live in `src/components/rich/`. The style guide page shows a live example of each. `npm run visuals` validates every block in every lesson and reports coverage per track; `--file <module.ts>` runs the strict per-module check used while writing.

## Videos

`src/data/videos.ts` lists free YouTube lectures, playlists and channels per track. Video ids were checked against public listings; where only a playlist or channel could be confirmed, that is what is linked. Videos with an id play inline through youtube-nocookie.

## Practice and hub

`/practice` lists practice papers per track built from the lesson quizzes (`src/lib/exams.ts`) and the placement test. `/hub` (`src/data/portals.ts`) links model and dataset hubs (Hugging Face, Kaggle), practical courses and paper portals (arXiv, Papers with Code, Semantic Scholar) grouped by level.

## Not included

No analytics, sitemap, `llms.txt`, or outbound RSS subscription feed yet.

## Smoke test

`npm run smoke` server-renders every route and fails if any one 404s or throws. It also checks that every roadmap link, graph node link, graph edge, paper prerequisite and glossary cross-reference resolves.

## Full product rendering check

`npm run check:product` waits for lazy lesson blocks, checks all 220 lessons and their source links, checks SVG references and flow-box bounds, verifies every video and resource across level/track/type filters, and confirms that the homepage embeds the original gradient descent lab. Videos and resources use shareable query filters and are grouped by level, track, and topic. Lesson sources are grouped by type in each lesson’s resources activity.

## AI RSS news strip

The bottom news strip aggregates Google Research, Google DeepMind, Hugging Face, MIT News AI, and TechCrunch AI. It scrolls with Pause/Play controls, pauses on hover and focus, respects reduced motion, and has a readable source-filtered headline panel. Only titles, dates, source names, and original article links are retained.

`npm run dev` and `npm run preview` expose `/api/ai-news` through the Vite plugin. For a production Node host, run `npm run build` followed by `npm start`; set `HOST` and `PORT` as required by the host. The server fetches only the fixed source list and caches results for 15 minutes. Browsers check for updates every 15 minutes. Individual feed failures retain that source's cached headlines.

`npm run news:refresh` refreshes `src/data/news-snapshot.json` and `public/ai-news.json`. Pure static hosting uses this dated snapshot rather than a live backend: refresh it in the deployment build or on your hosting schedule. No third-party CORS proxy or API key is required. `npm run test:news` checks RSS/Atom parsing, fallback behavior, and input validation.

## Visual labs

All 11 labs include a live result visualization. Nine use animated bars, probability segments, or process flows tied to their calculated results. Gradient descent retains its original colored surface and adds a recent-loss trace. The transformer diagram's token follows its actual step and pause controls. Animated tours pause offscreen, in hidden tabs, and for reduced-motion preferences.

## Accounts and deployment

Account forms remain at `/signup` and `/login`. With `REQUIRE_LOGIN=1`, course outlines remain public while lessons, lab detail pages, libraries, practice, and the dashboard require a session. In the default open draft, all content and the original homepage gradient-descent lab are available without signing in.

For production with sign-in required, run `npm run build` then `REQUIRE_LOGIN=1 npm start` with Node 24.2+ (Node 26 tested). Deploy the Node server and keep `data/ilearnai.sqlite` on persistent storage; `AUTH_DB_PATH` can point to a mounted volume. The build writes full lesson bodies to private `server/content/curriculum.json`; only body-free course metadata ships in browser assets. Serve the application over HTTPS; when a trusted reverse proxy terminates TLS, set `TRUST_PROXY=1` so session cookies include Secure. Do not expose the database or private curriculum directory through static hosting. Pure static hosting supports the public catalogue and cached news only; account services require the Node backend.

Passwords use salted scrypt hashes. Session tokens are random, stored hashed in SQLite, and delivered through HttpOnly SameSite cookies. Mutations check origin and authenticated writes require CSRF tokens. Pending progress is kept per user in browser storage until saved, with a visible sync status and retry action. Existing anonymous browser progress is not automatically attached to new accounts. Email verification and password recovery are not implemented in this draft.

`npm run test:account-ui` checks sign-in gates, dashboard rendering, logout cleanup, and durable offline/in-flight progress queues. `npm run test:accounts` checks account isolation, CSRF, login/logout, persisted progress after database reopen, and absence of lesson bodies from the browser build. Test accounts exist only in a temporary database.

## Course activities and static Ask

Each lesson has an overview plus separately addressable reading, animation, video, practice, quiz, linked-lab, and resources activities at `/courses/:track/:module/:lesson/:activity`. Reading keeps all authored prose and diagrams, with links where interactive blocks were moved. Quizzes retain their original score indices. Completing every activity completes the lesson; previously completed lessons retain their completion until an activity is reopened. The dashboard and course overview count partial activity progress, including for signed-out draft visitors. Catalogue filters and searches are shareable URL parameters.

`/ask` is a static, browser-local site guide available to guests and signed-in learners. It matches questions against built-in navigation/account FAQs, public course and lesson summaries, lab descriptions, and glossary definitions. It offers relevant page links and an explicit fallback for unknown questions. It does not call an LLM or a question-answering backend, generate answers, or save chat history. The rest of the app still uses its existing account and RSS endpoints.

`npm run test:learning-flow` checks lossless extraction of all 1,294 activities, public/private outline parity, completion migration, static help matching and links, catalogue filters, and distinct course artwork. `npm run check:product` renders every activity and checks all 2,130 authored rich blocks.

The local draft before these course-flow changes is preserved in `output/rollback/before-skills-flow-20261026-193104/project-snapshot.zip`; extract into a separate directory to review or restore. Runtime account data is excluded. Reference inspection notes are in `output/reviews/google-ai-reference-20261026.json`; sign-in-only reference screens and browser visual checks have not been verified.

## AI for your work

`/for-work` is a practical path for nontechnical audiences. It covers banking, insurance, healthcare, retail, manufacturing, education, public services, professional services, technology, logistics, energy, and agriculture. Each of the 12 fields has three illustrative use cases, with benefits, current work, AI assistance, human responsibility, inputs, system connections, pilot scope, measures, and stop conditions. These are planning examples, not claimed deployments or promised outcomes. Industry evidence is linked and dated on each guide.

Choose leadership, managers, team members, architects, delivery, risk/compliance, or operations. The role choice persists in links using `?role=` and changes the action list, industry job context, and downloadable plain-text pilot brief. Compare two fields using the industry comparison; use the capacity calculator to account for review time, corrections, suitable task share, and monthly support. Negative results are shown as extra work rather than hidden.

Routes: `/for-work/:industry` and `/for-work/:industry/:useCase`. The original courses and labs remain available. Ask includes static work/industry/role guidance. Guides marked reviewed appear on the dashboard separately from technical course completion. `work:<industry>/<case>` keys persist in the existing browser preview store or signed-in account.

Content: `src/data/work/`; pages: `src/pages/ForWork.tsx`; interactions: `src/components/WorkTools.tsx`; presentation: `src/work-style.css`. `npm run test:work-learning` renders all 252 industry/use-case/role combinations and verifies brief contents, links, progress, calculator edge cases, and featured videos.

The homepage’s Keep exploring section uses three editorially selected talks and deep dives from `src/data/featuredVideos.ts`, rather than the first three foundation videos. The full library and its filters are unchanged. Original video pages were checked on 26 October 2026; these are editorial selections, not a ranking by views.

Rollback before this change: `output/rollback/before-ai-for-work-20261026-201303/project-snapshot.zip`. No deployment or push is included.

## Guided learning and chapter videos

All 220 lessons now expose matching term definitions and retain the original analogy and relevance explanation beside standalone animation activities. Additional glossary entries explain advanced concepts with examples. The animation format also supports a context, viewing focus, takeaway, and an explanation per scene. The AI terminology introduction separates methods from generative capabilities; twelve further lessons add practical worked examples and checks.

All 11 labs include a visual reading guide, a three-step experiment, a numerical or concrete example, a limitation, and a reflection answer. All 36 work guides include fictional input, proposed output, human review, and outcome examples. Playback is optional, stops at the final step, and has a complete text alternative.

All 56 modules have chapter video sequences with 176 curated selections and a task to complete afterwards. Each selection has a preview. Supported recordings play inside their own cards; selecting another closes the previous player. Titles use the same inline selection, and external links remain separate. Chapter navigation and collapsing a sequence stop playback. Full playlists and unsupported recordings explain their external playback option. The library adds 50 lectures from publisher-listed university courses. Of these, 45 returned YouTube oEmbed metadata; five Stanford recordings use external links because embedded playback could not be verified. Publisher source links and verification records are retained in `output/reviews/`. No timestamp or duration is invented for new recordings.

`npm run test:content-guidance` checks chapter coverage, previews, referenced videos, lesson context, explainer parsing, lab instructions, and all worked examples. `npm run test:chapter-videos` mounts the sequence in a simulated DOM and checks preview clicks, exact selected recording IDs, single-player behaviour, titles, closing, navigation, and collapsed playback. It does not load YouTube or replace a browser playback check. The homepage layout and new logo are unchanged by this content pass.

Rollback before this content pass: `output/rollback/before-content-refinement-20261027-124145/project-snapshot.zip`. No deployment or push is included.

## Learning workspace draft (28 October 2026)

`/code` adds eight standard-library Python exercises with worked examples, a CodeMirror editor, hints, solutions, output, and 24 checks. It uses pinned Pyodide 314.0.7 loaded on Run from jsDelivr, inside a module worker in an opaque-origin sandboxed iframe. The frame has no same-origin permission; its CSP only permits the runtime CDN for scripts and connections. Each run starts fresh. Stop, navigation, errors, and completion tear down the worker/frame; startup times out after 60 seconds and execution after 10 seconds. Output is capped. The runtime is browser-only; no learner code is sent to the application server. This is a practice environment, not a secure examination or a general notebook/package-installation service. The later Chrome test described above verifies browser/CSP execution; other browser engines have not been checked.

Python drafts and passed-exercise flags use separate localStorage keys (`ilearnai:python:*`) on the current browser/device. They do not sync to an account or count as course mastery. Storage failure is reported, and code can be downloaded. Clear site data to remove those drafts. Keyboard Tab leaves the editor; indentation uses spaces.

`/for-work` exposes a complete example immediately, with field selectors, a labelled animated flow, and an interactive decision question. All 36 case guides include specific incorrect alternatives, retryable feedback, and visible answers about pilot design and measurement. The full text example remains available, and motion is optional and respects reduced-motion preferences.

`/resources` adds 15 project-owned resources with source repositories, level, setup, and a concrete first task. `?collection=open-source` and `?kind=visualization` select the new collections. Related projects appear in course and lesson resource panels. The static Ask guide includes coding and resource navigation; it still uses no LLM.

`npm run test:workspace` executes exercise solutions and starters with the actual Pyodide WASM runtime in Node, checks all 36 questions in a simulated DOM, verifies library collections, and checks runner message filtering and cleanup. It does not replace a real-browser rendering, network, or CSP check. Research and the Microsoft curriculum gap map are in `output/reviews/learning-workspace-20261028/`.

Rollback: `output/rollback/before-learning-workspace-20261028-100606/project-snapshot.zip`. Extract into a separate directory first; account/runtime data and environment secrets were excluded. Homepage content and branding were preserved. No push or deployment is included.
