

## Liquid-glass carousel with real publication logos

Upgrade the "As Seen In / Our Partners Have Featured In" carousel in `src/components/sections/FeaturedPublications.tsx` to:
1. Show the **actual** brand logos (no white silhouette filter).
2. Wrap each tile in a true **liquid-glass** container (frosted blur, soft inner highlight, subtle border, gentle gradient sheen).

All 17 logo files already exist in `public/images/logos/` — no new assets needed.

### Changes — `src/components/sections/FeaturedPublications.tsx`

**1. Remove the white silhouette filter on the `<img>`**
- Drop `style={{ filter: "brightness(0) invert(1)" }}`.
- Many publication marks (Guardian, Bloomberg, Vogue, BBC, etc.) are dark-on-transparent, which would disappear on navy. Solution: place each logo on a **light frosted-glass tile** so the original colours read correctly while still feeling premium against the navy section.

**2. Liquid-glass tile styling** (replace the current `bg-white/5 backdrop-blur-sm` anchor)
```tsx
className="relative flex items-center justify-center h-28 sm:h-32 rounded-2xl
           bg-white/85 backdrop-blur-xl
           border border-white/60
           shadow-[0_8px_32px_rgba(8,17,41,0.25),inset_0_1px_0_rgba(255,255,255,0.9)]
           hover:bg-white hover:scale-[1.03]
           transition-all duration-500 ease-out group px-5 overflow-hidden"
```
Add an inner highlight sheen as an absolutely-positioned child:
```tsx
<span className="pointer-events-none absolute inset-0 rounded-2xl
                 bg-gradient-to-br from-white/70 via-white/10 to-transparent
                 opacity-80" />
<span className="pointer-events-none absolute -top-1/2 -left-1/4 w-1/2 h-[200%]
                 bg-gradient-to-r from-transparent via-white/40 to-transparent
                 rotate-12 opacity-60" />
```
The logo `<img>` sits on a `relative z-10` wrapper so it stays above the sheen.

**3. Image rendering**
- Keep `object-contain`, `loading="lazy"`.
- Reduce max height slightly (`h-16 sm:h-20`) so each logo gets visible white padding inside the glass tile (matches the Medichecks/Goodbody padding standard).
- Add `decoding="async"`.

**4. Tile size**
- Narrow tiles from `width: 330px` → `width: 220px` so more brands are visible per scroll cycle and the glass cards look like premium chips rather than wide banners.
- Keep height `h-28 sm:h-32`.

**5. Background contrast around the carousel**
- Keep the navy section background; the new light glass tiles will pop against it (the current dark-on-dark + filtered logos look flat).
- Soften the section edge-mask from `5%/95%` to `8%/92%` for a more refined fade.

**6. No JS / animation changes**
- Existing `requestAnimationFrame` translateX loop, speed (`0.4`), quadrupled items, and infinite-loop reset all stay the same.

### Result
- Real Guardian / Bloomberg / Vogue / BBC / Cosmopolitan / Men's Health / Healthista etc. branding shown in original colours.
- Each logo sits inside a frosted, slightly translucent white glass chip with a soft inner highlight, subtle drop shadow and a diagonal sheen — the "liquid glass" look (Apple-style).
- High-end, editorial feel against the navy band; matches the premium positioning of the rest of the site.

### Out of scope
- No changes to the section heading, gradient lines, `NavyDecorativeCircles`, scroll speed, or surrounding `PartnerShowcaseGrid`.
- No changes to the `MediaSpotlight` or `PartnerShowcase` components (legacy/unused variants).

