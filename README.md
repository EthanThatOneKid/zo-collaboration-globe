# Zo Collaboration Globe

A shareable Zo Space registry with a real 3D Earth, animated relationship arcs, a privacy-safe location flow, and a showcase wall for standout spaces.

**Live at:** `https://etok.zo.space/globe`

## Product shape

- `Globe` — spatial overview of where Zo Spaces live and how they link
- `Registry` — searchable list plus a registration flow for adding a space
- `Showcase` — mosaic gallery for browsing the strongest spaces as a social layer

## Stack

- **Zo Space** route (`routes/index.ts`) — React + Tailwind, zero setup
- **Globe scene:** `globe.gl` via CDN, backed by `three-globe`
- **Data model:** sample seeds + shared types in `lib/data.ts`
- **Persistence:** lightweight SQLite through the `sqlite3` CLI in API routes

## Routes

| Path | Description |
|------|-------------|
| `/` | Main product surface with globe, registry, and showcase modes |
| `/api/hubs` | GET registry entries, POST a Zo Space into the registry |
| `/api/links` | GET connections, POST a connection between two spaces |

## Dev

```bash
bun run dev      # dev server (localhost:3099)
bun run lint     # check
bun run typecheck # type check
```

## Architecture

- The page boots from `SAMPLE_SPACES` and `SAMPLE_LINKS`, then hydrates from `/api/hubs` and `/api/links`
- Registration stores an approximate pin by shifting the submitted coordinates up to 10 miles
- The globe view orbits to the selected space and highlights only the relevant arcs
- The showcase wall reads from the same registry as the globe, so the network and gallery stay in sync
- The fallback renderer keeps the route usable if the CDN globe script fails
- All DB files live in `{cwd}/data/` and stay out of git
