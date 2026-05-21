## Why Randox kit images aren't showing

Two compounding issues:

**1. The card component doesn't render images at all.** `src/components/providers/ProviderTestCard.tsx` (used by every provider catalog page, including `/providers/randox`) has no `<img>` element. The `image_url` field isn't even part of `ProviderTestCardData` — so even when the DB has a perfectly good kit URL, the card renders text-only. This affects all providers using the generic catalog, but it's most visible on Randox because Randox's catalog has 66 cards in a grid where the empty image slot is obvious.

**2. 44 of 66 Randox `image_url` values are a UK-flag placeholder, not a kit image.** From the DB:

```text
44 × https://rdxhealthfrontdoor-...azurefd.net/image/gb.png   ← UK flag, not a kit
21 × https://stesrhplatforma071.blob.core.windows.net/...     ← real kit photo
 1 × other
```

That's the placeholder Randox themselves serve on their own site when no product shot exists. The scraper just stored whatever was on the page. So even after fixing the rendering, 2/3 of cards would still show a flag.

## Fix

### A. Render images on the card (all providers benefit)

In `src/components/providers/ProviderTestCard.tsx`:

1. Add `image_url?: string | null` to `ProviderTestCardData`.
2. Add a 1:1 image header above the existing content block. When a usable image exists, render `<img loading="lazy" decoding="async">` on a `bg-gray-50` square. When missing or filtered, render a centered `TestTube2` icon with the provider brand-color tint as a clean fallback (matches existing card style).
3. Add a `isUsableImage(url)` helper that returns false for empty/null and for known Randox placeholders (`/image/gb.png`, optionally any URL ending `/gb.png` from the rdxhealthfrontdoor host) so the fallback icon shows instead of a misleading flag.

### B. Pass `image_url` through the query

In `src/pages/ProviderTestsCatalogPage.tsx` (and `ProviderTestCatalogPage.tsx` if it uses the same card) — make sure the Supabase `select(...)` includes `image_url` so the field reaches the card.

### C. Refresh Randox imagery (optional follow-up, no code change)

The scraper at `supabase/functions/randox-scraper/index.ts` should skip the `gb.png` placeholder and either (a) leave `image_url` null when no real kit photo is found on the source page, or (b) attempt to derive a category-specific fallback. This is a one-line guard and a re-run, but I'll leave it out of this plan unless you want it included — the rendering fix alone resolves the "no kit showing" complaint by replacing flags with a clean branded fallback.

## Files

- `src/components/providers/ProviderTestCard.tsx` — add image header, placeholder filter, fallback icon
- `src/pages/ProviderTestsCatalogPage.tsx` — include `image_url` in the query select
- `src/pages/ProviderTestCatalogPage.tsx` — same, if it uses the same card

## Verification

- Open `/providers/randox` — every card has either a real kit photo or a clean branded TestTube icon, no UK flags.
- Open `/providers/medichecks`, `/providers/goodbody-clinic`, `/providers/thriva` — confirm kit images now render and existing layout still flows.
- Mobile 384px — image area stays square, card height consistent across the grid.

## Question

Do you want me to also patch the Randox scraper to stop storing the `gb.png` placeholder going forward, or just ship the rendering fix?
