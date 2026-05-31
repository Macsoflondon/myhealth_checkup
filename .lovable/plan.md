
## Goal
On the home `Our Partners Most Popular Tests` block (component: `src/components/sections/DreamHealthShowcase.tsx`), render **9 test cards in the grid** with a mix of all providers, and make the **scrolling filmstrip carousel** above it cycle a mix of providers instead of only GOODBODY.

## Root cause of the current behaviour
The component hard-filters every test that does not have a real, provider-hosted `image_url`:

```ts
const withImage = popularTests.filter((t) => isRealProviderImage(t.image_url));
```

In production data today only GOODBODY rows have provider-hosted image URLs that pass `isRealProviderImage`. That is why:
- The grid collapses to ~3 cards
- The filmstrip is 100% GOODBODY

## Changes (frontend only, single file: `DreamHealthShowcase.tsx`)

1. **Drop the "must have provider image" gate.** Keep `isRealProviderImage` for *choosing* whether to render an `<img>`, but stop using it to filter rows out of the dataset.

2. **Branded fallback tile when no image.** When `resolveImage(t)` returns `null`, render a same-shape tile (square in filmstrip, 4:3 in card) with:
   - Background gradient from the provider's brand colour (via existing `getBranding(provider_id)`), defaulting to the navy → turquoise brand gradient.
   - Centered provider name (uppercase, white) + small category label underneath.
   - No external assets — pure CSS so it can't 404.

3. **Provider mix enforcement.** Tighten the existing `interleaveByProvider` so the final 9 cards include **at most 2 per provider**, drawn round-robin across every provider present in the dataset (GOODBODY, Medichecks, Lola Health, Thriva, Randox, London Medical Laboratory). Slice to **9** for the grid.

4. **Filmstrip uses the same mixed set.** Change `filmstripTests` from `orderedTests.slice(0, 8)` to use the same 9 mixed entries (or up to 12 if dataset allows). Quadrupled loop already handles seamless scroll.

5. **Most-chosen label** stays on the top 3 cards only (unchanged rule).

6. No DB schema changes, no hook changes, no copy changes beyond what's needed for the fallback tile. `usePopularTestsFromDatabase(18)` already returns enough rows.

## Out of scope
- Editing the popular flag (`is_popular`) on rows in the database.
- Scraping or backfilling provider images.
- Any other home sections.

## Verification
- Reload `/`, scroll to `Our Partners Most Popular Tests`.
- Grid shows exactly 9 cards, no more than 2 from the same provider, with provider name visible on each card.
- Filmstrip above shows multiple provider brand tiles cycling (not just GOODBODY).
- Cards that have a real image still show the image; cards that don't show the branded gradient fallback with provider name.
