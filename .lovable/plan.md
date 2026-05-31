## Scope
Update `src/components/sections/DreamHealthShowcase.tsx` (the "Our Partners Most Popular Tests" section on the homepage).

## Changes

1. **Cap grid at 9 cards**
   - Replace `interleaveByProvider(capped).slice(0, 20)` with `.slice(0, 9)`.
   - Keep the existing round-robin interleave so the 9 are mixed across providers (no clustering).
   - Lower the per-provider cap from 5 to 3 to guarantee mixing across at least 3 providers when 9 cards are shown.

2. **Carousel (filmstrip) uses the same mixed set**
   - Change `filmstripTests = orderedTests.slice(0, 8)` → `filmstripTests = orderedTests` so the moving strip cycles through the same 9 mixed-provider tiles.

3. **Use the provider URL for each card**
   - Card image, title, and the "See what's tested" CTA all link to `t.url` (open in new tab, `rel="noopener noreferrer sponsored"`) instead of opening the local modal.
   - Filter out any test missing a `url` (alongside the existing "must have real provider image" filter).
   - Remove the `ProviderTestDetailModal` usage and `selectedTest` state (no longer needed).

4. **Provider data only — no generated content**
   - Keep the existing strict image filter (`isRealProviderImage`): no Lovable uploads, no `/kits/*` placeholders, no fallback art. If a test has no real provider image, it's dropped.
   - Description: use `t.description` only. If missing, show no description (remove the synthesized "Comprehensive screening covering…" fallback).
   - Price, sample type, biomarker count, turnaround, name, provider name — all read straight from the DB row as-is.

5. **Loading skeleton count** → 9 to match.

## Out of scope
- No DB / hook / schema changes.
- No styling overhaul beyond the cap and link wiring.
- `MostPopularTestsSection.tsx` and `/popular-tests` page are untouched (this request is only the homepage Partners section).
