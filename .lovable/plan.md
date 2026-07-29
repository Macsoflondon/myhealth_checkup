## Goal

Toolbar sits directly beneath the slogan and above the hero imagery, the mobile hero uses its vertical space better, and the hairline divider under the wordmark is easier to see.

## Changes

### 1. Toolbar relocation (`src/components/sections/HeroMasthead.tsx`, `src/pages/Index.tsx`)

Current order on the homepage is: hero section (ticker → wordmark/slogan → images) → category toolbar → mobile slogan → trust bar.

New order inside the hero section itself:

```text
ticker
wordmark
hairline divider
slogan  (+ language / login controls on desktop)
category toolbar   <-- moved here, full-bleed
hero image slideshow
```

- Render the mobile-only slogan block inside `HeroMasthead` (moved out of `Index.tsx`) so both breakpoints share one slot directly above the toolbar.
- Render `<BrowseByCategoryBar compact placement="hero" />` inside `HeroMasthead`, full-bleed with the same negative margins used by the ticker, immediately before the image container.
- Remove the standalone toolbar and mobile slogan blocks from `Index.tsx`; the trust bar then follows the hero section as before.
- Keep the toolbar's existing sticky/scroll behaviour and the white mobile background rule untouched; only its position in the tree changes.

### 2. Mobile hero space optimisation

- Trim the hero's mobile minimum height so the added toolbar doesn't push the image into a sliver — reduce the `min-h-[78svh]` mobile value and let the image container flex to fill.
- Tighten mobile vertical rhythm: smaller slogan block padding, reduced gap between slogan, toolbar and image.
- Guarantee a sensible image floor on mobile so the slideshow never collapses below a usable height.

### 3. Divider contrast

- Raise the hairline between the wordmark and slogan from `border-white/25` to a clearly visible but still restrained `border-white/45`, and keep it a 1px hairline.

## Verification

- Check mobile (390px) and desktop (1338px) in the preview: toolbar directly under slogan, all pills still on one line on desktop, hero image still flush with the ticker area and not squashed.
- Confirm sticky header behaviour and mobile menu button visibility still work on scroll.
