## Goal
Add a small sticky promo carousel that floats at the top of the "Premium Complete" test kit tile inside the Goodbody Featured Partner of the Month bento.

## Scope
Single file: `src/components/sections/GoodbodyBentoShowcase.tsx`. Frontend/presentation only — no data, route, or business logic changes.

## Implementation

1. **Wrap the Premium Complete tile** (currently lines 69–71) in a `relative` container so the floating promo can absolutely position over it.

2. **Build a `PremiumPromoCarousel` sub-component** rendered inside that wrapper, positioned `absolute -top-2 left-2 right-2 z-10` so it visually floats above the tile while scrolling with the section. ("Sticky" here = visually pinned to the tile's top edge — true CSS `position: sticky` doesn't apply inside a grid cell of this size.)
   - Rounded pill, gradient background `from-brand-pink to-brand-turquoise`, white text, small shadow, `text-[10px] sm:text-xs` font-semibold uppercase tracking-wide.
   - Reuse the existing `useMarqueeTicker` hook (`@/hooks/useMarqueeTicker`) for the scrolling messages, with `overflow-hidden` and mask edges matching the PromoTicker pattern.
   - Messages (rotated):
     - `20% OFF — code GB20`
     - `Free GP review included`
     - `UKAS-accredited results`
     - `Limited time offer`
   - Add a small ✦ or • separator between items, coloured white/80.

3. **Tile padding adjustment**: add `pt-6` (or equivalent) to the Premium Complete `KitTile` only, so the floating pill doesn't overlap the product image. Easiest path: pass an optional `extraClassName` prop to `KitTile`, or wrap the tile in a div with `pt-3` so the absolute pill clears the image.

4. **Accessibility**: wrap the marquee in a region with `aria-label="Promotional offer for Premium Complete blood test"`. Respect `prefers-reduced-motion` — the shared `useMarqueeTicker` already handles pause on offscreen/tab-hide; add a CSS fallback that stops translation when reduced-motion is set.

5. **Responsive**: on mobile (`<sm`) the pill sits flush across the tile; on `sm+` it remains the same offset. No layout shift to other bento cells.

## Out of scope
- No changes to PromoTicker, Header, or any other section.
- No new routes, no analytics events beyond what already exists on the tile click.
- No backend / promo-code validation logic.

## Files touched
- `src/components/sections/GoodbodyBentoShowcase.tsx` (edit only)
