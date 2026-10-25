# Homepage: swap providers and clinical standards, tidy dividers and heading

## 1. Swap the two sections
- "Our trusted providers" carousel moves up to sit directly under the hero video.
- "Our clinical standards" strip moves down to where the providers carousel was (the first scrolled-in section, above Popular tests).
- Everything else keeps its current order.

## 2. One combined divider
- Replace the separate turquoise line (under the hero) and pink line (top of the standards strip) with a single turquoise-pink-turquoise gradient bar, the same one used at the bottom of the navy showcase.
- Apply the same combined bar wherever those two lines meet after the swap, so there is no white gap between them.

## 3. Clinical standards heading
- Restyle "Our clinical standards" to match the other section eyebrows: turquoise uppercase text with a short pink dash on each side (as in "Why myhealth checkup"), and drop the small turquoise underline beneath it.

## Technical details
- `src/pages/Index.tsx`: move the `PartnersGrid` element out of `DEFERRED_SECTIONS` into the slot where `AccreditedProvidersBar` renders, and put `AccreditedProvidersBar` first in `DEFERRED_SECTIONS` (keeping lazy/hydrate wrappers).
- `src/components/sections/AccreditedProvidersBar.tsx`: remove `border-t`/`border-b` colour borders, render a `h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise` bar; eyebrow uses the pink-dash/turquoise pattern with brand tokens.
- Hero's turquoise bottom border removed if it doubles up with the new bar.
- Update `src/pages/__tests__/homepage-section-order.test.ts` and the Homepage Order memory to the new sequence.
- Verify at 390px and 1280px with Playwright.
