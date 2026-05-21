## Problem

On mobile (≤640px) the "Provider of the Month" Goodbody bento grid in `src/components/sections/GoodbodyBentoShowcase.tsx` uses a rigid `auto-rows-[88px]` track. The two stacked text callouts ("Goodbody Clinics deliver…", "Clinical-grade…", "UKAS-accredited…", "make proactive health simple…") need ~150–200px each, but each `row-span-2` cell is only 176px tall total. The callout text overflows the cell and visually collides with the kit tiles and the "View Goodbody Profile" CTA below it (visible in the screenshot — the CTA button is sitting on top of the last callout text).

Secondary issue: the mobile layout currently puts a full-width kit tile (Premium Complete, Female Hormone, Cholesterol) on its own row, which breaks the visual grouping and inflates section height needlessly.

## Fix

Rework the grid responsively so the bento behaviour only applies from `sm:` upward; mobile becomes a clean 2-column flow with auto height.

In `GoodbodyBentoShowcase.tsx`:

1. **Grid track** — change `grid-cols-4 sm:grid-cols-6 auto-rows-[88px] sm:auto-rows-[112px]` to `grid-cols-2 sm:grid-cols-6 auto-rows-auto sm:auto-rows-[112px]`.
2. **Each cell** — drop the mobile-only `col-span-*` / `row-span-2`, keep the `sm:` spans intact. Example: `col-span-2 sm:col-span-2 row-span-2` → `sm:col-span-2 sm:row-span-2`.
3. **Kit tiles** — give them a fixed mobile aspect (`aspect-square sm:aspect-auto sm:h-full`) so the image-led tiles stay square on mobile instead of stretching with text-card neighbours.
4. **Logo cell** — shrink padding on mobile (`p-4 sm:p-8`) and cap logo height (`h-32 sm:h-64 md:h-80`) so it stops dominating the fold.
5. **Callout pair wrapper** — keep `flex flex-col gap-3`, allow natural height on mobile (`sm:row-span-2`), so both callouts render in full without clipping.
6. **CTA spacing** — bump top margin to `mt-10 sm:mt-8` so the "View Goodbody Profile" button never sits on top of the last callout when the grid reflows.

Desktop (sm and up) layout is unchanged — same 6-column bento, same row heights, same visual order.

## Files

- `src/components/sections/GoodbodyBentoShowcase.tsx` — responsive class adjustments only; no logic, copy, or link changes.

## Verification

- Open `/` at 384px viewport, confirm: callouts no longer clipped, no overlap with CTA, kit tiles render as squares stacked 2-up.
- Re-check at 768px and 1280px to confirm the desktop bento is visually identical to before.
