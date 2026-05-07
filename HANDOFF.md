# Handoff — Zo Collaboration Globe

**Session:** 2026-05-06/07  
**Last commit:** `a53a470` (feat: link_type field with friend/collab/alum/mentor/sponsor taxonomy)

---

## What was built

### Backend (✅ Done)
- **SQLite DB** at `data/globe.db` — self-initializes and seeds on first run (`bun run lib/init-db.ts`)
- **Schema** (`lib/schema.sql`): `hubs` table + `links` table with `link_type TEXT NOT NULL DEFAULT 'friend'` + CHECK constraint for 5 link types: `friend`, `collab`, `alum`, `mentor`, `sponsor`
- **DB lib** (`lib/db.ts`): pure spawnSync wrapper around `sqlite3` CLI — no npm deps
- **API routes** (all reading from the shared SQLite DB):
  - `GET /api/hubs` — all spaces
  - `GET /api/hubs/:handle` — one space
  - `POST /api/hubs` — register a new space
  - `PUT /api/hubs/:handle` — update a space
  - `GET /api/links` — all connections with type
  - `POST /api/links` — create a connection (accepts `from_handle`, `to_handle`, `link_type`)
  - `DELETE /api/links/:id` — remove a connection
- **Seed data** (`lib/data.ts`): 6 sample Zo Spaces + 8 typed sample links

### Frontend (⚠️ Partial)
- **Live at:** `https://etok.zo.space/globe` (route synced via zo.space)
- Renders 6 registered spaces in sidebar + 5 link-type legend
- **three-globe is NOT rendering** — see "Open Issue" below

### Repo structure
```
zo-collaboration-globe/
├── HANDOFF.md           ← you are here
├── AGENTS.md            ← agent instructions
├── README.md
├── PLAN.md              ← build plan
├── .gitignore           ← ignores data/*.db
├── lib/
│   ├── schema.sql       ← SQLite schema
│   ├── data.ts          ← seed data + types (SAMPLE_SPACES, SAMPLE_LINKS)
│   ├── db.ts            ← SQLite wrapper (no npm deps)
│   └── init-db.ts       ← creates schema, runs migrations, seeds
├── data/
│   └── globe.db         ← local SQLite DB (gitignored, generated on init)
└── routes/
    ├── index.ts         ← three-globe page (⚠️ broken — see below)
    └── api/
        ├── hubs.ts      ← GET/POST hubs
        ├── hubs/[handle].ts ← GET/PUT/DELETE one hub
        ├── links.ts     ← GET/POST links
        └── links/[id].ts ← DELETE link
```

---

## Resolved: Globe canvas render crash

**Symptom:** The page UI loads (sidebar shows 6 spaces, legend renders) but the three-globe canvas itself does not appear.

**Runtime error in server log:**
```
[runtime] Error in /globe: a.tags.join is not a function
```

**Fix applied:** `routes/index.ts` now normalizes tags before both search and rendering. The page no longer assumes `space.tags` is always a clean `string[]`, so malformed or stringified tag payloads cannot crash the globe.

**Notes:** `lib/db.ts` already normalizes SQLite `tags` values on read, but the route now defends itself as well. Keep the normalizer in place if you add more tag displays later.

---

## Pivot framing (from 2026-05-06 session)

The product is no longer "live event art tooling." It is a **public registry and visualization layer for the Zo network**:

> **Globe** = spatial network view (each node is a Zo Space, arcs show relationships by type)  
> **Registry** = submission and discovery layer (submit your Zo Space URL, name, location, bio, category)  
> **Gallery** = mosaic grid of all registered spaces (like threejs.org examples or a social media grid)

This reframing makes the system actionable immediately without needing the Global Art Project coordination. The 5 link types (`friend`, `collab`, `alum`, `mentor`, `sponsor`) directly support this framing.

---

## Sync instructions

The zo.space route is synced manually. To push updates:
1. `git add -A && git commit` in the repo
2. `git push`
3. Sync the route via zo.space tooling (the `routes/index.ts` file maps to `/globe`)

The zo.space build requires `routes/index.ts` to have no `import` statements that reference sibling files (e.g. `../lib/data`). The seed data is embedded directly in the route file as `SAMPLE_SPACES` / `SAMPLE_LINKS` arrays.

---

## Related context files
- `wiki/zo-x-future-of-collaboration.md` — original Global Art Project wiki page
- `wiki/global-art-project-role.md` — Ethan's role positioning doc
- `transcript-202605030928-jordan-hansel-ethan.md` — Jordan + Hansel + Ethan sync that led to pivot framing
