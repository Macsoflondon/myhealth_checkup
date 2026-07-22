## Problem

The hero sales card (`src/components/sections/HeroSalesTestCard.tsx`) shows the same four chips — `Cholesterol, Vitamin D, Thyroid, Liver` — and `+52 biomarkers` on every rotation slide. Those are hard-coded fallbacks:

```ts
const DEFAULT_MARKERS = ["Cholesterol", "Vitamin D", "Thyroid", "Liver"]; // line 36
const totalMarkers = ad.biomarkerCount ?? 56;                              // line 44
```

`HeroMasthead.tsx` builds each ad from `realTestData` (static file) and never passes `markers` or `biomarkerCount`, so the fallbacks always win. The static `realTestData` also has a placeholder `"Biomarker Count": 4` for every row, so it's useless as a source anyway.

The real, scraped biomarker names and counts already live in Supabase `provider_tests` (`biomarker_count`, `biomarkers_list`) — that's what `useAllTests` reads today.

## Fix

Source the chips and count from the live scraped data for the exact rotation test, keyed by product URL. Never fabricate.

1. **Add a small hook** `useHeroAdBiomarkers(urls: string[])` (co-located in `HeroMasthead.tsx` or `src/hooks/queries/`):
   - One `react-query` fetch: `provider_tests` where `url in (…rotation urls)` selecting `url, biomarker_count, biomarkers_list, turnaround_days_text, sample_type`.
   - Returns a `Map<url, { markers: string[]; biomarkerCount: number|null; turnaround: string|null }>`.
   - 10-min staleTime; matches existing query defaults.

2. **HeroMasthead.tsx**
   - Compute the ad URLs from `ROTATION` once, call the hook, and merge the DB row into each `Advert` before passing to the card. Pass `markers` (first 4 names from `biomarkers_list`) and `biomarkerCount` (real number, may be `null`).

3. **HeroSalesTestCard.tsx**
   - Remove `DEFAULT_MARKERS` and the `?? 56` fallback.
   - Widen `HeroSalesAd`: `markers?: string[]; biomarkerCount?: number | null;`
   - Render logic:
     - If `markers.length === 0` and `biomarkerCount == null` → hide the whole chip row (no fake chips, no "+N biomarkers" pill).
     - If `markers.length > 0` → render up to 4 chips; only show `+N biomarkers` pill when `biomarkerCount != null && biomarkerCount > markers.length` (value = `biomarkerCount - markers.length`).
     - If only `biomarkerCount` is known → render a single pill "`N biomarkers`" instead of any names.
   - Same treatment for the modal's `Metric` "Full panel / Biomarkers" — show the real count or hide the cell.

4. **Turnaround** — while we're touching this: swap the hard-coded `Typical 2–5 days` in `MetaCell` and modal `Metric` for the fetched `turnaround_days_text` when present; hide the cell otherwise. (Small, in the same file, prevents the same "same info every card" complaint next.)

5. **No changes** to scrapers, DB schema, `realTestData`, or the rotation list itself.

### Files touched
- `src/components/sections/HeroMasthead.tsx` — add hook call, merge data into ads.
- `src/components/sections/HeroSalesTestCard.tsx` — remove fallbacks, conditional chip/meta rendering, widen prop type.
- (Optional) `src/hooks/queries/useHeroAdBiomarkers.ts` — new tiny hook file.

### Verification
- Playwright at `localhost:8080`: screenshot hero on desktop across 3 rotation cycles; confirm Thyroid Function slide shows real markers (TSH / FT4 / FT3 …) and correct count, Cholesterol slide shows lipid markers, Well Woman shows its panel.
- If a rotation URL has no matching `provider_tests` row, confirm the chip row is absent rather than showing placeholder chips.
