Replace the desktop wrapped flex layout in `src/components/sections/AccreditedProvidersBar.tsx` with a continuous marquee carousel matching the mobile behaviour, so all 8 trust badges scroll on one line at every breakpoint.

## Changes

**`src/components/sections/AccreditedProvidersBar.tsx`**
- Remove the `hidden md:flex flex-wrap ...` desktop block and the two-row mobile marquee.
- Render a single `MarqueeRow` containing all 8 items, alternating turquoise/pink tones per badge.
- Duplicate items (x2) inside the row for seamless `-50%` translate looping.
- Duration: ~45s desktop, ~35s mobile (via responsive class or single tuned value).
- Keep edge fade gradients (`from-[#081129]`) on both sides at all breakpoints.
- Pause animation on hover (`hover:[animation-play-state:paused]`) for accessibility.
- Respect `prefers-reduced-motion`: stop the animation and allow horizontal scroll instead.
- Keep the heading, navy background, semantic `<section aria-label>`, and `BadgePill` styling unchanged.

## Technical notes
- Reuse the existing `animate-marquee` keyframe already used on mobile.
- Single row means we drop `rowA`/`rowB` splitting and the `offset` prop usage.
- No changes to `Index.tsx` or other consumers — the component API stays the same.
