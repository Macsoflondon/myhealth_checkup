# Two-state test cards: product image by default, details on hover

Every test card on the platform is rendered by one component (`UniversalTestCard`), so this is a single change that lands everywhere: category pages, provider catalogues, at-home kits, Medichecks pages and AI recommendations.

## What changes

**Default (rest) state**
- The card shows the provider's product-packaging photograph, filling a fixed-height image area, with a slim caption strip underneath carrying the test name, provider name and price. This mirrors the supplied product-grid screenshot.
- A small "View details" affordance sits in the corner so the interaction is discoverable and usable without a mouse.

**Hover state (pointer devices)**
- The existing detailed information card fades in over the product image: test name, category tag, short description, biomarker count and preview, turnaround time, collection method, price, and the existing Compare / Book actions.
- Crossfade of 240ms with a 4px upward slide on the information layer, reversing on mouse-out. Both layers are stacked in the same fixed-size box, so nothing reflows and grid rows stay perfectly aligned.

**Touch devices and keyboard**
- No hover. The product image stays visible; tapping "View details" (or the card) opens the existing detail modal, exactly as today.
- Keyboard focus on the card reveals the information layer the same way hover does, and Enter still opens the modal.
- The transition is disabled for users who have reduced motion enabled — the layers swap instantly.

## Product images

Category pages already only list tests that have a product image, so those grids are fully covered. Across the whole catalogue, roughly a third of listings currently carry an image (all 127 Clinilabs listings, most London Health Company, some Medichecks, Randox, Goodbody, Lola; Thriva has none).

For a listing with no image, the card falls back to a branded packaging-style panel — provider logo and test name on a tinted navy/turquoise panel — rather than a broken or blank tile. No placeholder stock imagery, and no invented data.

## Technical notes

- `src/components/cards/UniversalTestCard.tsx`: add an `image_url` field to `UniversalTestData`; wrap the current card body in a two-layer stack (image layer + existing info layer) using opacity/transform transitions driven by CSS `group-hover` and `group-focus-within`, with `prefers-reduced-motion` respected. Card height, borders, accent stripe and compare state styling are unchanged.
- `src/lib/categoryTestMapper.ts` and `CategoryTestItem` (`src/components/category/CategoryPageLayout.tsx`): carry the already-fetched `image_url` through instead of dropping it.
- `src/lib/universalTestAdapter.ts`: map `image_url` in each adapter (`fromAtHomeTest`, `fromProviderTest`, `fromCategoryTest`, `fromMedichecksTest`).
- `src/hooks/queries/useAtHomeTests.ts`: add `image_url` to the select list (other card queries already fetch it).
- Images load lazily with fixed intrinsic dimensions and `object-contain` on a white plate, so there is no layout shift and no LCP regression.
- No database, comparison-engine or business-logic changes.

## Verification

- Visual check on desktop and mobile viewports for a category grid (rest, hover, focus, touch), including a provider with no product image.
- Confirm card heights are identical before and after hover, and that the compare/book actions still work from the hovered state.
