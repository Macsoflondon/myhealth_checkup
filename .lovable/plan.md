Match toolbar and hero text colours to the navy trust-standards text

## Objective
Make the hero slogan "Your" words and the category toolbar text the same solid navy (`#081129`) as the trust-standards labels below the hero image.

## Current state
- Trust standards labels: `rgb(8, 17, 41)` — solid navy (`#081129`).
- Hero slogan "Your" words: `oklab(... / 0.55)` — navy at 55% opacity.
- Toolbar category pill text: `rgba(8, 17, 41, 0.72)` — navy at 72% opacity.
- Toolbar "More" button text: `rgba(8, 17, 41, 0.72)` — navy at 72% opacity.
- Top ticker text: already `rgb(8, 17, 41)` — solid navy, but uses `text-brand-navy` token.

## Changes

1. **Hero slogan in `src/components/layout/BrowseByCategoryBar.tsx`**
   - Change the two `<span className="... text-[#081129]/55">Your ...</span>` instances to `text-[#081129]` so they match the trust-standard labels.

2. **Toolbar category pill text in `src/components/layout/CategoryPillDropdown.tsx`**
   - Change the default label colour from `rgba(8,17,41,0.72)` to `#081129` in the inline style on the category name `<span>`.
   - Keep the active/hover accent colours (pink and turquoise) unchanged.

3. **Toolbar "More" button in `src/components/layout/BrowseByCategoryBar.tsx`**
   - Change the "More" label colour from `text-[rgba(8,17,41,0.72)]` to `text-[#081129]`.

4. **Top ticker in `src/components/sections/TestCategoryTicker.tsx`**
   - No visual change needed (already `#081129`). Optionally standardise the inline variant from `text-brand-navy` to `text-[#081129]` so the same literal colour value is used across all three elements.

## Verification
- Re-inspect the hero slogan, toolbar pills, and top ticker in the preview.
- Confirm their computed `color` is `rgb(8, 17, 41)`.
- Confirm active/hover states still use pink/turquoise accents.
