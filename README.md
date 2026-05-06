# Zo Collaboration Globe

A shareable demo for the future-of-collaboration — one globe, multiple artist hubs, connected by shared intentions.

**Live at:** `https://etok.zo.space/globe`

## Stack

- **Zo Space** route (`routes/index.ts`) — React + Tailwind, zero setup
- **Globe:** three-globe via CDN (UMD build — no npm install needed)
- **Data:** hub data in `lib/data.ts`, SQLite schema in `lib/schema.sql`
- **Persistence:** SQLite via `better-sqlite3` (synchronous, works in Bun/Zo Space API routes)

## Routes

| Path | Description |
|------|-------------|
| `/` | Main globe — three-globe with hub nodes + animated arcs |
| `/vangogh`, `/picasso`, `/kahlo`, `/okeeffe`, `/kusama` | Artist sub-pages |
| `/api/hubs` | GET list of hubs, POST a new hub |
| `/api/hubs/:handle` | GET/PUT/DELETE a single hub |
| `/api/links` | GET list of connections, POST a new link |
| `/api/links/:id` | DELETE a link |
| `/api/init-db` | Initialize the SQLite DB schema |

## Dev

```bash
bun run dev      # dev server (localhost:3099)
bun run lint     # check
bun run typecheck # type check
```

## Architecture

- Hub data (location, bio, color, handle) lives in SQLite — replace `SAMPLE_HUBS` static array
- Artist sub-pages read from `/api/hubs/:handle`
- Globe reads hubs + links from `/api/hubs` + `/api/links`
- All DB files live in `{cwd}/data/` — never in git (see `.gitignore`)
