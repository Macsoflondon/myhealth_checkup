## What to build

Lift the "Live Comparison" card from `StartJourneySection` into its own reusable component, then render a second copy of it directly above the `FeaturedPublications` ("As Seen In / Press and media") block on the homepage. The new copy rotates through 3–4 different test panels.

## Steps

1. **New component** `src/components/sections/LiveComparisonCard.tsx`
   - Lift the right-hand card from `StartJourneySection.tsx` (lines 162–239) verbatim — same white rounded-2xl card, eyebrow "Live Comparison", rotating heading, table with multi-tier pricing, "Prices verified June 2026" footer.
   - Accept props:
     - `panels: Panel[]` (same `{ name, providers: [{ name, options: [{ label, price }] }] }` shape already in `TESTS`)
     - `rotateMs?: number` (default 60000)
     - `eyebrow?: string` (default `"Live Comparison"`)
     - `className?: string` for wrapper width control.
   - Internal `useState` + `useEffect` with the same 500 ms fade-out / swap / fade-in pattern.
   - Export a `DEFAULT_LIVE_COMPARISON_PANELS` const containing 4 panels: **Hormone Panel, Cholesterol Panel, Thyroid Health Panel, Vitamin D & B12 Panel** (sourced from the existing `TESTS` array — same prices, no data drift).

2. **Refactor `StartJourneySection.tsx`**
   - Replace inline card markup with `<LiveComparisonCard panels={TESTS} />`.
   - Keep the surrounding 2-column grid (video left, card right) untouched. Net behaviour unchanged.

3. **Insert second copy above As Seen In** in `src/components/sections/PartnerShowcaseGrid.tsx`
   - Add a new `SafeBlock` named "Live Comparison" rendered immediately before the existing `Featured Publications` `SafeBlock` (line 111).
   - Lazy-load `LiveComparisonCard`. Wrap in a centred container with section padding that matches the surrounding dark grid (`py-10 sm:py-14`, `max-w-2xl mx-auto px-4`).
   - Pass `panels={DEFAULT_LIVE_COMPARISON_PANELS}` (the 4-panel subset) and `rotateMs={8000}` so the standalone card cycles visibly (the in-flow card on `StartJourneySection` keeps its 60s cadence).
   - Add a short eyebrow heading above the card consistent with the dark grid: "Side-by-side pricing" eyebrow + h2 "See how providers compare, live" in white/turquoise to match the surrounding navy section styling.

4. **No data, route, RLS, or backend changes.** Pure presentation.

## Layout

```text
PartnerShowcaseGrid (navy)
├── Featured Partner (Goodbody)
├── Test Categories
├── Most Popular Tests
├── ► NEW: Live Comparison card (rotates Hormone → Cholesterol → Thyroid → Vit D&B12 every 8s)
├── Featured Publications  ← "As Seen In / Press and media"
└── Call To Action
```

## Files touched

- **New** `src/components/sections/LiveComparisonCard.tsx`
- **Edit** `src/components/sections/StartJourneySection.tsx` — swap inline card for `<LiveComparisonCard />`
- **Edit** `src/components/sections/PartnerShowcaseGrid.tsx` — lazy import + insert `SafeBlock` above `FeaturedPublications`

## Open question

Your message cut off mid-sentence ("rotate through three or four different…"). I've assumed **4 panels: Hormone, Cholesterol, Thyroid, Vitamin D & B12**, drawn from the existing rotation data so prices stay consistent. If you meant a different set (e.g. include Full Blood Count, or only 3 panels), tell me which and I'll adjust the `DEFAULT_LIVE_COMPARISON_PANELS` list — no other change needed.
