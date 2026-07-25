Goal: Restore the brand slogan below the My Health Checkup wordmark on desktop and tablet, keep the current mobile slogan placement, and remove the hero sales/test cards entirely.

Scope
- `src/components/sections/HeroMasthead.tsx` — header/hero component
- `src/components/sections/HeroSalesTestCard.tsx` — hero test card component
- `src/pages/Index.tsx` — homepage layout

Changes
1. HeroMasthead.tsx
   - Add a slogan bar directly under the Wordmark row, visible only on `sm:` and up.
   - Slogan copy: "YOUR HEALTH. YOUR CHOICE. ONE TRUSTED PLATFORM." with brand turquoise/pink accents and Montserrat styling matching existing brand tokens.
   - Remove the `HeroSalesTestCard` import.
   - Remove the conditional `<HeroSalesTestCard ad={ad} />` block and its wrapping `hidden sm:block` div.
   - Keep `useHeroPopularTests` and advert derivation only if still used elsewhere; otherwise remove to avoid dead code. Since the cards are the only consumer, remove the hook usage and advert memo.

2. Index.tsx
   - Keep the existing slogan div (currently between `BrowseByCategoryBar` and `AccreditedProvidersBar`) but restrict it to mobile only (`sm:hidden`).
   - Ensure no duplicate slogan appears on desktop/tablet.

3. HeroSalesTestCard.tsx
   - Delete this component file. It will no longer be referenced.

Verification
- Build passes (`npm run build`).
- Visual check: desktop/tablet shows slogan under wordmark; mobile keeps slogan below category bar; no test card appears in hero on any breakpoint.
- No other pages import `HeroSalesTestCard`; confirm with a quick search before deletion.