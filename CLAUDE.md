@AGENTS.md

# Scope discipline

Only make the exact change the user asked for in this session. Don't bundle
unrelated refactors, restructures, or "while I'm at it" fixes into the same
commit/PR — even ones that look obviously correct. If you notice a separate
problem while working, mention it and ask before touching it; don't just fix
it. Keep every commit/PR scoped to a single concern.

This applies regardless of which Claude surface is doing the work (this CLI,
the `@claude` GitHub Action, a claude.ai/code session, etc.) — it's a project
convention, not a tool-specific setting.

**Why:** A claude.ai/code session asked to fix a nested `<main>` landmark
also moved several pages into a route group "while it was in there,"
undoing an intentional design decision (sidebar scoped to the home page
only). That extra change had to be found and reverted separately. The
`@claude` GitHub Action workflow has its own guardrail for this
(`.github/workflows/claude.yml`); this is the repo-wide version so it holds
regardless of which Claude surface is used.
