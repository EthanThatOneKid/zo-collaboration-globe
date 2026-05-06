# Zo Collaboration Globe

A shareable collaboration globe demo with a real 3D Earth, animated relationship arcs, and a lightweight SQLite-backed data layer for hubs and links.

**Live at:** `https://etok.zo.space/globe`

## Stack

- **Zo Space** route (`routes/index.ts`) — React + Tailwind, zero setup
- **Globe scene:** `globe.gl` via CDN, backed by `three-globe`
- **Data model:** sample seeds in `lib/data.ts`, SQLite schema in `lib/schema.sql`
- **Persistence:** SQLite through the `sqlite3` CLI in API routes

## Routes

| Path | Description |
|------|-------------|
| `/` | Main globe — 3D Earth, animated arcs, focus transitions, active hub panel |
| `/api/hubs` | GET list of hubs, POST a new hub |
| `/api/hubs/:handle` | GET/PUT a single hub |
| `/api/links` | GET list of connections, POST a new link |
| `/api/links/:id` | DELETE a link |

## Dev

```bash
bun run dev      # dev server (localhost:3099)
bun run lint     # check
bun run typecheck # type check
```

## Architecture

- The page boots from `SAMPLE_HUBS` and `SAMPLE_LINKS`, then hydrates from `/api/hubs` and `/api/links`
- The globe view orbits to the active hub and highlights only the relevant collaboration arcs
- The fallback renderer keeps the route usable if the CDN globe script fails
- All DB files live in `{cwd}/data/` and stay out of git
