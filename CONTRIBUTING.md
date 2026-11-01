# Contributing to ilearnai

Help a learner understand an idea, use it in a practical task, or reproduce an example. Clear corrections and small improvements are welcome.

## Report something unclear or broken

Open an [issue](https://github.com/jhamandeep/ilearnai/issues) with the page or lesson, what you expected, and what happened. For code examples, include the command, runtime version, and relevant error text. Remove credentials and personal data.

For an explanation you found confusing, tell us which sentence lost you and what you were trying to understand.

## Propose a change

1. Start from the current repository and make a focused branch.
2. Read the relevant guide and [development notes](docs/development.md).
3. Explain the idea in your own words. Credit adapted material and preserve its license notices.
4. Verify the changed content or behaviour.
5. Open a pull request describing the learner's problem, the resulting improvement, and the checks you ran.

## What makes a good learning contribution?

- Start with a question or task a learner can recognise.
- Define unfamiliar terms when they first appear.
- Include a concrete example, diagram, or worked calculation.
- Make exercises produce an observable result.
- Add a useful question and an explanation of the answer.
- State assumptions, especially for toy data and capacity estimates.
- Link directly to original papers, official documentation, or upstream projects.
- Avoid unsupported claims about model quality, industry outcomes, or certification readiness.

For new portal lessons, follow [CONTENT_SPEC.md](CONTENT_SPEC.md). For written hub guides, use relative links, descriptive headings, and GitHub-supported Markdown. Mermaid diagrams should have readable labels and a nearby prose explanation.

## Verify your change

Run the checks appropriate to the files you touched; see [the check guide](docs/development.md#choose-checks-that-match-the-change). For Python examples, verify both the documented result and any failure behaviour your change affects.

If you change the curriculum, regenerate the catalog and chapter index. Check that README summary counts still agree:

```bash
npm run curriculum:build
node scripts/update-learning-index.mjs
node scripts/update-learning-index.mjs --check
```

Do not commit generated build output, local databases, credentials, or browser review artifacts. Existing ignore rules cover the usual local directories.

## Third-party material

Link to external resources when a link is sufficient. If adapting content, check its terms and keep the required credit. The Microsoft curriculum material has a retained [MIT notice](public/licenses/microsoft-ai-for-beginners.txt); that notice applies to that material and does not automatically license unrelated content.
