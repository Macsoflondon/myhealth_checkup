## Goal
Make the four hero stack cards physically travel down the page and land in the 2×2 Featured Tests grid as the user scrolls — one continuous, scroll-linked animation (frames 1 → 9 of the reference).

## Approach
Replace the two-component split (`HeroTiltedDeck` in hero + `FeaturedTestsGrid` below) with a single scroll-choreographed unit so the same DOM nodes morph from stack to grid. No duplicate cards, no fade swaps.

```text
┌─ScrollStage (tall section, ~200vh)───────────┐
│  ┌─Sticky viewport (h-screen, top-0)──────┐ │  ← progress 0
│  │   [stacked tilted cards over hero bg]  │ │
│  │                                         │ │  ← progress 0.5 (spread)
│  │   [cards flatten + translate down]     │ │
│  │                                         │ │  ← progress 1.0
│  │   [2×2 grid slot positions, 0° tilt]   │ │
│  └─────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

## Implementation

1. **New `ScrollChoreographedDeck.tsx`**
   - One `framer-motion` `useScroll` tied to a tall outer `ref` (~200vh on desktop, ~160vh mobile).
   - Inner wrapper is `sticky top-0 h-screen` so the cards stay pinned while scroll progress advances.
   - Each card is `position: absolute` inside the sticky stage. Per-card `useTransform` interpolates **x, y, rotate, scale** across `[0, 0.45, 1]`:
     - `0` → current hero fanned stack position (matches existing `CARD_FRAMES` start values)
     - `0.45` → mid spread (cards fan outwards, rotation easing toward 0)
     - `1` → exact 2×2 grid slot (rotate 0°, scale 1, x/y computed from a 2-col CSS grid measurement).
   - Compute target slot positions with `useLayoutEffect` + `getBoundingClientRect` on four invisible placeholder divs laid out in a real grid, so the cards land pixel-perfect regardless of viewport. Re-measure on `resize`.

2. **Hero integration**
   - Remove `HeroTiltedDeck` mount from inside `HeroMasthead` (deck moves out into the page-level stage so it can travel past the hero).
   - `HeroMasthead` keeps headline, CTAs, marquee, etc. — just no deck.

3. **Page wiring (`src/pages/Index.tsx`)**
   - Replace `<FeaturedTestsGrid />` with `<ScrollChoreographedDeck />`.
   - Stage renders: hero content above + the sticky deck stage that continues past the hero bottom and ends at the grid resting position. The "Featured Tests" heading + "View all tests" link render inside the resting frame.

4. **Mobile**
   - Disable the scroll choreography under `sm` (matches existing pattern). Render the resting 2×2 (or 1-col) grid statically — same cards, no animation — to avoid janky sticky on small screens.

5. **A11y / perf**
   - `prefers-reduced-motion` → skip transforms, render resting grid immediately.
   - `will-change: transform` on animated cards only.
   - Existing `<Link>` wrappers preserved so the cards remain navigable throughout.

## Files

- **Create** `src/components/sections/ScrollChoreographedDeck.tsx` (owns the stage, sticky viewport, transforms, slot measurement, resting grid header).
- **Edit** `src/components/sections/HeroMasthead.tsx` — remove the embedded deck mount.
- **Edit** `src/pages/Index.tsx` — swap `FeaturedTestsGrid` for `ScrollChoreographedDeck`; drop the now-unused `HeroTiltedDeck` import from the hero path.
- **Keep** `HeroTiltedDeck.tsx` exports (`DeckCard`, `DEFAULT_DECK`, `DeckCardFrame`) — reused by the new component. Delete only after the swap is verified.
- **Keep** `FeaturedTestsGrid.tsx` until verified, then delete.

## Verification
- Playwright: scroll from `y=0` to past the grid in steps; screenshot at 0%, 25%, 50%, 75%, 100% of the stage and confirm progression matches reference frames 1→9.
- Confirm final cards align with where `FeaturedTestsGrid` previously rendered.
- Resize to 375px and confirm static grid renders without animation.
