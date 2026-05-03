# Zo × Future of Collaboration

A global creative coordination demo — each node is a person, each edge a shared intention.

## Live

**https://etok.zo.space/globe**

## What we built

1. **PRD** — Sharpened the original vision into a bounded v1 spec at `wiki/zo-spaces-future-of-collaboration-prd.md`
2. **Globe site** — Standalone git repo at [github.com/EthanThatOneKid/zo-collaboration-globe](https://github.com/EthanThatOneKid/zo-collaboration-globe)
3. **Live globe** — `/globe` route on `etok.zo.space` (no extra service slot needed) serving an interactive SVG globe with 6 sample artist hubs

## Sample hubs (current)

| Handle | Name | Location | Bio |
|---|---|---|---|
| `@etok` | Ethan | San Francisco, CA | Maker, builder, Zo enthusiast |
| `@vangogh` | Van Gogh | Arles, France | Painter of nights and sunflowers |
| `@picasso` | Picasso | Barcelona, Spain | Cubist, sculptor, troublemaker |
| `@kahlo` | Frida Kahlo | Coyoacán, Mexico | Painter of self, pain, and flowers |
| `@okeeffe` | Georgia O'Keeffe | Santa Fe, NM | Desert flowers and animal bones |
| `@kusama` | Yayoi Kusama | Tokyo, Japan | Infinity, polka dots, mirrors |

## Next: three-globe upgrade

Replace the SVG globe with [three-globe](https://github.com/vasturiano/three-globe) for a real 3D animated Earth:

- [ ] `npm install three-globe` → not needed (use CDN or copy UMD)
- [ ] Swap `routes/index.ts` from SVG canvas to `<ThreeGlobe>` component
- [ ] Load sample hub data as JSON-LD graph
- [ ] Animate arcs between connected hubs
- [ ] Click-to-zoom and hover tooltips on nodes
- [ ] Background: star field or dark space aesthetic
- [ ] Portrait/mobile-friendly layout

## Later phases

- **Artist sub-pages** — `/vangogh`, `/picasso`, `/kahlo`, `/okeeffe`, `/kusama` — real-looking personal pages as if each artist were alive on Zo today
- **Hub directory** — index page listing all hubs with search/filter
- **Follow system** — follow/unfollow hubs, follower count
- **Shared intentions** — hubs can post short-term collaborative intentions (e.g. "looking for a co-author on a painting about ocean colors")
- **Mesh layer** — JSON-LD schema for hub profiles + shared state
- **Zo × Future of Collaboration site** — full brand site at `zo.etok.me` (or custom domain) once plan is locked

## Stack

- Zo Space page route (`/globe`) — no extra service slot
- React + TypeScript
- Tailwind CSS 4 (pre-configured on zo.space)
- Three.globe for 3D globe (CDN or copy)