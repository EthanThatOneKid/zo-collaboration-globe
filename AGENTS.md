# Zo Collaboration Globe

This repo is the standalone home for the collaboration globe demo.

## Rules

- Routes go in `routes/` — one file per route, lowercase kebab-case filenames.
- Shared data/types go in `lib/data.ts`.
- DB schema + migrations go in `lib/schema.sql` + `lib/migrate.ts`.
- Keep the demo self-contained. Avoid reaching back into `etok.zo.space`.
- If you change the public story, update `README.md` in the same commit.

## Intent

This repo exists to show the future-of-collaboration idea as a single, shareable globe demo with a small set of real-looking hubs and clear connections.
