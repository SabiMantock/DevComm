<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DevComm 1 — project guardrails

## Route groups

`app/(root)/` applies the Sidebar layout (via its `layout.tsx`) and is intentionally scoped to the Home page only. Never move another page into `(root)` to "give it the sidebar," even as a side effect of an unrelated change — this has already caused an unintended regression once (see the Scope discipline section in CLAUDE.md). New pages default to being plain top-level routes directly under `app/` (Navbar + Footer only, no sidebar) unless the operator explicitly asks for the sidebar on that page.

## Semantic HTML

- `<ul>`/`<li>` only for genuinely parallel/interchangeable items (nav links, tag lists). Action clusters (auth buttons, CTA rows) and in-page filters/tabs use a plain `<div>`, not a list.
- `<nav>` is reserved for actual navigation landmarks (Sidebar). In-page filter/tab strips are not navigation and should use `<div>`, not `<nav>`.
- Give every `<nav>` an `aria-label`, since the page has more than one.

## Shared components — check before adding new ones

- `Button` (`variant="primary"|"ghost"`) — any CTA or clickable action.
- `Card` (`as="div"|"article"`) — any bordered/padded content block.
- `FooterLink` — small muted links, supports an `external` flag.
- `FilterStrip` — generic, takes a `groups` prop (`{ label, options }[]`).

Don't hand-roll a new version of a pattern one of these already covers.

## Data conventions

- Shared mock data lives in `data/*.ts` as typed exports (e.g. `Post`, `Project`) — never duplicated inline inside page files.
- Every data item has a stable `id` (a slug-style string is fine) — required for dynamic routes/detail pages to look items up.
- Tags render as `#lowercase-no-punctuation` (see PostCard/ProjectCard's tag rendering) — reuse the same transform anywhere tags are displayed, don't reinvent it.

## Styling

- Use the project's existing global color/theme variables only. Never introduce new colors or raw hex values.
- Match existing spacing/typography conventions already used elsewhere rather than inventing new scales.

## Build order — don't get ahead of it

This project is being built in phases, alongside a Next.js course: static shell → local/mock data rendering → forms with local state → real persistence → auth. Don't add a backend, database, or auth logic unless explicitly asked for, even if it would "complete" a feature. Local `useState` for things like likes and comments is fine (already in use); anything requiring a server, database, or session handling is out of scope until the operator asks for it.

## Git workflow

- Every new piece of work (feature, component, page, fix) gets its own branch off `main` and a PR — don't commit new work directly to `main`. Only fall back to committing straight to `main` if the operator explicitly says to for that instance.
- "Merge after review" means the automated `claude-review` GitHub Action check completing with `SUCCESS` (check `statusCheckRollup`), not a human approval via GitHub's review UI. GitGuardian's check is another automated gate that runs alongside it.
- When a task asks to extract or create a reusable component/util, wire it into only the usage the task specifies. Don't also retrofit pre-existing call sites onto it in the same PR, even when it's an obvious win — that's the same scope-discipline concern as `CLAUDE.md`'s Scope discipline section, applied specifically to newly-created shared components. Mention the opportunity and ask first.
