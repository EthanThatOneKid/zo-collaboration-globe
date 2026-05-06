# Zo Collaboration Globe Plan

## Goal

Turn this repo into a shareable demo for the future-of-collaboration idea: one globe hub plus a small set of fictionalized artist spaces that feel connected.

## Scope

- 1 main globe homepage at `/`
- 5 sample artist spaces:
  - `/vangogh`
  - `/picasso`
  - `/kahlo`
  - `/okeeffe`
  - `/kusama`
- 1 shared data model for hubs, links, and profile text
- 1 consistent visual system across the globe and the artist pages

## Build Order

1. Keep the globe homepage as the primary entry point.
2. Create the five artist pages as separate routes in the same repo.
3. Give each artist page a distinct but coherent layout, using the same base design language.
4. Wire the globe to visibly connect those five spaces.
5. Add copy that makes it explicit this is a fictionalized demo of "what if these artists had Zo today."
6. Test the routes in-browser on desktop and mobile.
7. Tighten any layout, spacing, or readability issues before calling it done.

## Visual Rules

- Use the globe as the central metaphor.
- Keep the network small and legible.
- Make each artist page feel personal, not generic.
- Avoid clutter; the demo should explain itself in seconds.
- Keep the fictional nature clear enough that nobody mistakes it for a real archive.

## Definition of Done

- The repo has a polished globe homepage.
- The five sample artist spaces are live as routes in the same repo.
- The hub relationships are visible and understandable.
- The README tells the next session what exists and what to do next.

## Three-globe upgrade (next session)

Replace the SVG globe with [three-globe](https://github.com/vasturiano/three-globe) for a real 3D animated Earth.

### Tech approach

- **CDN strategy**: Since zo.space does not allow `npm install`, use the three-globe UMD/IIFE CDN build instead of the npm package. Load via `<script src="https://unpkg.com/three-globe/globe.gl.js">` in a `<Script>` tag within the route, or inline the minified UMD as a string in route code.
- **Data model**: Refactor `SAMPLE_HUBS` array into a JSON-LD graph structure at the top of `routes/index.ts` so it can be consumed by both the SVG fallback and the three-globe layer.
- **Fallback**: Keep the existing SVG globe as a SSR-safe fallback when `window` is unavailable or three-globe fails to load.

### Build order

1. [ ] Verify three-globe CDN URL resolves (`https://unpkg.com/three-globe/globe.gl.js`)
2. [ ] Refactor hub data into a clean JSON array at top of `routes/index.ts`
3. [ ] Add a `useMountedGlobe` hook that swaps between SVG and three-globe depending on a feature flag or CDN availability
4. [ ] Load three-globe via CDN script tag (no npm install needed)
5. [ ] Port `SAMPLE_HUBS` + `EDGES` to three-globe's `globeData` + `linksData` API
6. [ ] Animate arcs between connected hubs
7. [ ] Add hover tooltips and click-to-zoom
8. [ ] Add star-field background
9. [ ] Test mobile/portrait layout
10. [ ] Update `README.md` with the new visual stack

### Open questions

- [ ] Is three-globe compatible with zo.space's React 19 + Tailwind 4 setup? (verified: vanilla Three.js works, so three-globe should too via CDN)
- [ ] Should the 5 artist sub-pages (`/vangogh`, `/picasso`, etc.) come before or after the three-globe upgrade?