# Desktop/tablet toolbar strip: side borders + inset

## What changes

The category toolbar strip above the hero (the full-width white band with the turquoise top border) gets brought in from the screen edges on larger screens:

1. **Inset ~1.5 cm on each side** — the strip no longer touches the screen edges; it is narrowed by approximately 1.5 cm (≈57 px) on the left and right.
2. **Navy side borders** — left and right borders in navy (#081129), medium weight (2 px — thicker than a hairline, clearly not a heavy border).
3. **White strip** — the strip keeps its white background.
4. **Top border unchanged** — the existing turquoise top edge stays as it is.
5. **Stays inset when pinned** — when the strip sticks to the top of the viewport on scroll, it keeps the same 1.5 cm inset so nothing jumps or widens.
6. **Mobile untouched** — no borders or inset on mobile.

## File touched

`src/components/layout/BrowseByCategoryBar.tsx` (hero-placement branch only):

- `wrapperClass`: add ~57 px horizontal inset (Tailwind arbitrary value, e.g. `lg:mx-[57px]`) to both the in-flow and the fixed/pinned variants for `placement === "hero"`.
- `innerClass` for the hero placement: add `border-l-2 border-r-2 border-[#081129]` alongside the existing `border-t-2 border-[#22c0d4]`; background already white.

## Tablet note

The toolbar strip itself only renders at desktop widths (≥1024 px); tablet-width screens currently show the mobile brand header, which keeps its existing look. The borders therefore apply at every width where the strip is visible. If you want the strip (with borders) to appear on tablets too, that's a separate change — say the word.

## Verification

- Playwright screenshot at 1338 px and a tablet width (768 px) confirming: strip inset both sides, navy side borders visible, white background, top edge unchanged, mobile header untouched.
- Scroll test confirming the pinned state keeps the inset with no layout shift.
