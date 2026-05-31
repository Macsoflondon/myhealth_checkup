# Fix "Our Partners Most Popular Tests" — 9 cards, restored info, Premium Complete tile

## 1. Why only 6 cards show today

`usePopularTestsFromDatabase` returns only rows flagged `is_popular = true`. That set is currently ~6 rows after the round‑robin cap of 2/provider, so the grid collapses to 6 even though `limit=30` is requested.

**Fix:** in `src/hooks/usePopularTestsFromDatabase.ts`, after the popular query, if the result is shorter than `limit`, run a second query against `provider_tests` (active, has price, excluding already‑returned ids) ordered by price desc, and append until we have `limit` rows. Preserves the popular ordering at the top and gives the grid enough variety to fill 9 with at most 2 per provider.

No DB schema changes. No new dependencies.

## 2. Restore the missing card info

Earlier the card body in `DreamHealthShowcase.tsx` showed three things that were stripped during the recent edits:

- `from £X` price (always with the word "from")
- A struck‑through `typical £Y` anchor (≈ `displayPrice × 1.6`, rounded)
- A social‑proof line: `N people compared this in the last 7 days` (deterministic from `t.id`, so it doesn't jitter on every render)

**Fix:** put those three elements back into the card markup, exactly where they used to sit:

```text
[Provider]                        (turquoise eyebrow)
Test name                         (bold heading)
Description                       (existing)
• N people compared this …        (social proof)
typical £Y         from £X        (anchor + price)        [See what's tested]
```

Keep the existing `formatTestPrice` import — we'll bypass it here in favour of explicit `from £{displayPrice}` to honour the user's instruction that "from" must always be visible.

## 3. Force Goodbody "Premium Complete" to use the branded fallback tile

The Goodbody Premium Complete image is a square branded box that looks out of place next to the other product photos. Add a small allow/deny step in the image resolver in `DreamHealthShowcase.tsx`:

```text
const FORCE_FALLBACK = [
  { provider: "goodbody-clinic", test: /premium\s+complete/i },
];
const shouldForceFallback = (t) =>
  FORCE_FALLBACK.some(r => r.provider === t.provider_id && r.test.test(t.test_name));
```

`resolveImage(t)` returns `null` when `shouldForceFallback(t)` is true, so both the grid card and the filmstrip render `<FallbackTile t={t} />` (Goodbody navy → turquoise gradient with provider + test name). All other imagery stays exactly as it is now.

## 4. Out of scope (explicitly unchanged)

- The hero → carousel flow above this section.
- The filmstrip layout, speed, masking, and tile sizes.
- The `FallbackTile` visual treatment.
- The CTA button copy and behaviour.
- Any other section on the homepage.

## Files touched

- `src/hooks/usePopularTestsFromDatabase.ts` — top‑up query so the hook returns up to `limit` rows even when `is_popular` count is low.
- `src/components/sections/DreamHealthShowcase.tsx` — restore `from £X` / `typical £Y` / social‑proof line in the card body, and add the `shouldForceFallback` rule for Goodbody Premium Complete.
