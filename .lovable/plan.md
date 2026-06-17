## Three perf wins

### 1. Cache the `popular-test-website-data` edge function

Today: every homepage hit scrapes 8–12 provider product pages synchronously → 2.3–2.7 s averages.

Plan:
- New table `public.popular_test_enrichment_cache`:
  ```
  test_id uuid PK, provider_id text, url text,
  title text, description text, image_url text, price numeric,
  fetched_at timestamptz default now()
  ```
  Service-role only (no anon/auth grants — function uses service key).
- Edge function flow:
  1. Look up rows by `id IN (...)`.
  2. Return cached rows where `fetched_at > now() - 24h`.
  3. For misses/stale, scrape concurrently, upsert into cache, return merged result.
- Add `Cache-Control: public, max-age=3600` on the response so the browser/CDN also caches.
- Frontend: bump the React Query `staleTime` for popular tests to 1 h (currently re-fetches every mount).

Expected: warm calls drop from ~2.5 s to ~150 ms (single DB round-trip).

### 2. Cut homepage DOM (~24k nodes → target <8k)

- Build a tiny `<LazyMount>` wrapper: renders a sized placeholder until an `IntersectionObserver` fires `rootMargin: '400px'`, then renders children.
- Wrap below-fold homepage sections in `src/pages/Index.tsx` (everything below the hero + first CTA): partner showcases, comparison tables, accreditation bars, health resources, founder story, FAQ, etc.
- Combine with `React.lazy()` for the heaviest ones (`ProviderComparisonTable`, `MostPopularTestsSection`, `DreamHealthShowcase`, `PartnerShowcaseGrid`) so their JS is code-split out of the initial bundle.

Expected: smaller initial DOM, faster FCP, drop in style-recalc time (currently 1.54 s).

### 3. Non-blocking Google Fonts

`index.html` currently does `<link rel="stylesheet" href="…fonts.googleapis…">` — render-blocking.

Replace with async pattern:
```html
<link rel="preload" as="style" href="…" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="…"></noscript>
```
Preconnects already in place. `display=swap` already set so no FOIT.

### Files touched
- `supabase/migrations/<new>.sql` — cache table + grants.
- `supabase/functions/popular-test-website-data/index.ts` — read-through cache.
- `src/hooks/usePopularTestsFromDatabase.ts` — bump staleTime.
- `src/components/common/LazyMount.tsx` — new helper.
- `src/pages/Index.tsx` — wrap below-fold sections, lazy-import heavy ones.
- `index.html` — async fonts link.

### Verification
- Re-run `browser--performance_profile` on mobile preview, confirm: edge function p50 < 300 ms (second load), DOM nodes < 10k, FCP < 3 s, no render-blocking fonts link.

### Out of scope
- No design/UI changes.
- No new dependencies.
- No changes to scraper logic (we just cache its output).
