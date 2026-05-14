## Goal

Replace the current horizontal-scrolling ticker in `FeaturedPublications.tsx` with a **static bento grid** of dark navy rounded cards — styled like the uploaded reference (Forth Results app). Each card holds a single publication logo, sized varied (1×1, 2×1, 1×2) for a bespoke editorial feel.

## Scope

- File: `src/components/sections/FeaturedPublications.tsx` (rewrite body)
- No changes to `PartnerShowcaseGrid.tsx`, `Index.tsx`, or any other consumer — the export name and section position stay the same.
- Heading copy unchanged: eyebrow "As Seen In" + heading "Our Partners Have Featured In".
- Same wrapper: navy background, top/bottom turquoise→pink gradient lines, decorative circles.

## Visual spec

- Container: `max-w-6xl mx-auto`, padded.
- Grid: CSS grid, `grid-cols-2 md:grid-cols-4 lg:grid-cols-6`, `auto-rows-[110px] md:auto-rows-[130px]`, `gap-3 md:gap-4`.
- Cards: `rounded-2xl md:rounded-3xl`, deep navy fill `bg-[#0f1a3d]` with subtle inner ring `ring-1 ring-white/5`, soft shadow, on hover `ring-brand-turquoise/40` + slight lift.
- Logo: white/inverted via `brightness-0 invert opacity-80`, centred, `max-h-12 md:max-h-16 max-w-[70%] object-contain`. Hover → `opacity-100`.
- Bento sizing pattern (repeats every ~12 cells so 17 logos fill cleanly):
  - Tile 1: `col-span-2` (wide)
  - Tile 4: `row-span-2` (tall)
  - Tile 7: `col-span-2 row-span-2` (hero)
  - Remaining: 1×1
  - Encoded as a `spans[]` array indexed by position; falls back to `''` (1×1).
- Mobile (2 cols): only allow `col-span-2` to avoid awkward stretching; ignore `row-span-2` on `<md`.
- Subtle entrance: `animate-fade-in` per card with staggered `style={{ animationDelay: ... }}`.

## Data

Reuse the existing 17-publication array as-is (logos already white-friendly via the invert filter).

## Accessibility / SEO

- Each card stays an `<a target="_blank" rel="noopener noreferrer">` with `aria-label={`${name} — opens in new tab`}` and meaningful `alt`.
- Heading remains a single `<h2>`.
- Section retains semantic `<section>` and the existing decorative gradient lines.

## Out of scope

- No changes to other sections, no new dependencies, no animation libraries (pure Tailwind + existing `animate-fade-in`).
- Ticker animation logic and `trackRef` removed.

## Technical notes

- Drop the `useRef`/`useEffect` ticker code entirely.
- Keep the `NavyDecorativeCircles` import and the gradient line divs.
- Use a small helper: `const spanFor = (i: number) => spans[i] ?? ''` to keep JSX clean.
