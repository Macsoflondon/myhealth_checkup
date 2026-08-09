# Hero toolbar band: pearl white with pink dividers

## What changes

1. The band that holds the category toolbar (between the divider line and the top of the hero image) becomes pearl white — the same bright white used for the "myhealth" wordmark.
2. The divider line above the toolbar becomes the pink hairline from the second screenshot (brand pink #e70d69), replacing the current translucent white line.
3. A matching pink hairline is added at the bottom of the white band, dividing it from the hero image.
4. The vertical space between the divider and the hero image is halved, with the toolbar vertically centred in the remaining space.

Desktop only — the mobile hero (which already uses a white sticky brand bar) is untouched.

## Technical detail

- `src/components/sections/HeroMasthead.tsx`
  - Divider: change `border-t border-white/45` to a 1px `#e70d69` rule; keep it full-bleed and drop the extra `my-3 sm:my-4` margin so it sits tight to the band below.
  - Toolbar wrapper (`-mx-3 sm:-mx-6 md:-mx-9 mt-0 sm:mt-5 lg:mt-6 order-1 sm:order-2`): give it `bg-white` (pearl white token), remove the `sm:mt-5 lg:mt-6` top margin, and add symmetric padding at roughly half the current gap (`py-2 sm:py-2.5`) so the dock is centred in the band.
  - Add `border-b border-[#e70d69]` to that wrapper so the same pink line divides the white band from the hero image.
  - Hero image container: drop `mt-5 sm:mt-5 lg:mt-6` so it starts immediately beneath the pink rule.
- `src/components/layout/BrowseByCategoryBar.tsx` (hero placement only)
  - The floating dock currently uses `bg-white/85` with a heavy drop shadow, which reads as a raised pill on navy. On the new white band, soften it: for `placement === "hero"`, use a light pearl surface with a hairline `#081129`/10 border and a much lighter shadow so it doesn't look like a floating card on white.
  - Ensure dock label/icon colours still meet contrast on white (they are already navy/brand-coloured).

## Verification

- Build and view the homepage at desktop width: white band, pink rule above and below, toolbar centred, gap roughly half its previous height.
- Check 1280px, 1716px and mobile widths for no regression.
