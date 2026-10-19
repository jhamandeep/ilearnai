# replica-fan

A study replica of fanout.sh: guided learning tracks, daily papers with notes, a glossary, and browser-local labs.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle in dist/
npm run lint
```

## Layout

- `src/data/` — all content as typed TypeScript: tracks → modules → lessons (Markdown with `$math$`), papers, glossary, lab registry.
- `src/pages/` — one file per route group. Lesson, paper and lab routes are lazy-loaded so Markdown/KaTeX and the labs stay out of the main bundle.
- `src/labs/` — pure client-side calculators. No network calls.
- `src/lib/auth.tsx` — client-side session and Pro entitlement stored in localStorage.

## What is stubbed

- **Auth** is a fake magic link: entering an email signs you in immediately.
- **Pricing** sets the plan locally. There is no Stripe, no server, and no real entitlement check. Pro lesson bodies ship in the bundle, so gating is cosmetic until a backend serves them.
- **Prices** are placeholders.
- No analytics, sitemap, `llms.txt`, or RSS yet.

## Smoke test

`npm run smoke` server-renders every route and fails if any one 404s or throws.
