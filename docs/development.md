# Run and maintain ilearnai

[Learning hub](../README.md) · [Contributing](../CONTRIBUTING.md) · [Content specification](../CONTENT_SPEC.md)

The repository contains both the GitHub learning hub and a React/TypeScript learning portal. The portal uses Vite for development and a Node server for curriculum, accounts, progress, and the news endpoint.

## Run locally

Use Node.js 26 and npm. The current development environment uses Node 26.3.1. The server imports Node's built-in SQLite API; an older Node release without that API will not start the account/content service.

```bash
git clone https://github.com/jhamandeep/ilearnai.git
cd ilearnai
npm ci
npm run dev
```

Open the local URL Vite prints, normally `http://localhost:5173`. If that port is occupied, Vite may choose another. Use the running server rather than opening `index.html` directly.

Course content is accessible without signing in by default. Optional account and progress services use a local SQLite file. External videos and some browser runtimes require network access.

For the standalone Python teaching examples, see [examples/README.md](../examples/README.md); they do not need Node or the app.

## Build and serve

```bash
npm run build
npm start
```

The server normally listens at `http://127.0.0.1:4173`. The build prepares both static assets in `dist/` and server-side lesson content in `server/content/curriculum.json`.

The complete portal needs the Node service. Copying only `dist/` to GitHub Pages does not provide the curriculum, account, progress, or RSS endpoints.

| Variable | Purpose |
| --- | --- |
| `HOST` | Bind address for `npm start`; default `127.0.0.1` |
| `PORT` | Port for `npm start`; default `4173` |
| `AUTH_DB_PATH` | SQLite path; default `data/ilearnai.sqlite` |
| `REQUIRE_LOGIN=1` | Opt into requiring login for course content; open preview is the default |
| `TRUST_PROXY=1` | Honor the forwarded HTTPS scheme for secure session cookies behind a trusted proxy |
| `APP_URL` | Base URL used by browser checks that support it |

For a hosted environment, retain the generated server content and a writable, persistent database location. Use HTTPS and configure any trusted reverse proxy explicitly. These settings describe the current server; the learning-hub update does not deploy a hosting environment.

## Where things live

| Path | Purpose |
| --- | --- |
| [README.md](../README.md) | GitHub learning-hub entry point |
| [docs/](.) | Written learning guides, worked designs, and development notes |
| [examples/](../examples/) | Standard-library Python teaching examples |
| [src/data/tracks/](../src/data/tracks/) | Course and lesson definitions |
| [src/data/tracks-catalog.json](../src/data/tracks-catalog.json) | Generated browser catalog with lesson outlines |
| [src/data/work/](../src/data/work/) | Industry, role, and practical-use-case content |
| [src/data/labs.ts](../src/data/labs.ts) | Interactive lab catalog |
| [src/pages/](../src/pages/) | Portal pages |
| [src/components/](../src/components/) | Shared interface components |
| [server/](../server/) | Curriculum, accounts, progress, and news services |
| [scripts/](../scripts/) | Content generation and verification commands |
| [public/licenses/](../public/licenses/) | Retained third-party license notices |

## Update the curriculum index

After changing lesson definitions, regenerate the catalog and the GitHub chapter index:

```bash
npm run curriculum:build
node scripts/update-learning-index.mjs
node scripts/update-learning-index.mjs --check
```

The index script changes only the marked curriculum section in [learning-paths.md](learning-paths.md). Review the README's summary counts if the curriculum size changes. Do not hand-edit the generated catalog or the marked index section.

## Choose checks that match the change

| Change | Useful checks |
| --- | --- |
| Learning-hub prose | Review Markdown rendering, relative links, heading anchors, and source attribution |
| Chapter index | `node scripts/update-learning-index.mjs --check` |
| Python teaching examples | Run the documented commands and relevant boundary cases |
| Application code | `npm run build` and `npm run lint`, plus the relevant focused suite |
| Lesson/content structure | `npm run smoke` and `npm run check:product` |
| Chapter navigation | `npm run test:chapter-navigation-browser` |
| Browser Python runner | `npm run test:python-browser` |
| Account service | `npm run test:accounts` |

Browser suites use Playwright and an installed browser. Several default to `http://127.0.0.1:5178`; inspect the script and set `APP_URL` to match your running server. [package.json](../package.json) lists all available checks.

## Content and attribution

Follow [CONTENT_SPEC.md](../CONTENT_SPEC.md) for portal lessons. Explain the purpose, use a concrete example, include a meaningful check, and distinguish a demonstration from production behaviour.

Imported Microsoft readings retain their source links and [license](../public/licenses/microsoft-ai-for-beginners.txt). The import script and its pinned manifest live in [scripts/](../scripts/). Preserve those notices when editing adapted material.

The [archived maintainer notes](maintainer-history.md) preserve the former README, including historical validation reports and rollback references. Some entries describe older product states; use this document for current setup.
