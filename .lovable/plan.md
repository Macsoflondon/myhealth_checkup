## Swap the two card sets

The four tall image cards from `TestCategoriesSection` (Blood Tests, Cancer Screening, Wellness, At-Home) become the scroll-choreographed cards in the hero. The four mock test cards I built (Medichecks, Randox, Goodbody, LML) move down to replace them inside `TestCategoriesSection`.

## Changes

1. **`ScrollChoreographedDeck.tsx`** — swap the data + visual:
   - Replace `DEFAULT_DECK` import with the four category entries (tag, title, description, image, link, linkLabel, tagVariant) copied from `TestCategoriesSection`.
   - Replace `CardVisual` with a portrait card that matches the existing category-card look: full-bleed background image, navy gradient overlay, tag pill, large heading, description, "Explore X →" link. Same component used in both stack and resting grid.
   - Change resting grid slots from landscape `aspect-[4/3.2]` to portrait `aspect-[3/5]` (or `min-h-[520px]`) to match category-card proportions.
   - Keep the same scroll choreography (stack → travel → 2×2 grid) and `hero-deck-anchor` source.

2. **`TestCategoriesSection.tsx`** — replace its grid contents with the test-card mockups previously in the hero deck:
   - Import `DEFAULT_DECK` from `HeroTiltedDeck` (the Medichecks/Randox/Goodbody/LML data).
   - Render the cards using the existing `DeckCardFrame`-style visual (browser-chrome mock card with chips/price/CTA). Keep the section heading "Every test. Every provider. One transparent platform." intact.
   - Layout: same 4-up responsive grid (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`).

3. **Hero anchor sizing** — bump `#hero-deck-anchor` height in `HeroMasthead.tsx` to better match the new portrait card aspect (e.g. `h-[520px] sm:h-[560px] lg:h-[600px]`).

4. **Cleanup** — `HeroTiltedDeck.tsx` exports (`DEFAULT_DECK`, `DeckCard`, `DeckCardFrame`) stay so `TestCategoriesSection` can reuse them. Export `DeckCardFrame` if not already exported.

## Verification
Playwright scroll at y=0, mid, end. Confirm:
- Hero now shows a fanned stack of the four category cards (with imagery).
- They travel down and land in a 2×2 grid.
- The "What We Compare / Every test. Every provider." section further down now renders the four white test-card mockups.
