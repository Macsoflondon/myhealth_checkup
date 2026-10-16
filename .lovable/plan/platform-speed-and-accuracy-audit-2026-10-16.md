# Performance and accuracy audit (read-only), ranked by mobile impact

No files changed. Some findings are confirmed now. Items marked **[to measure]** need a production build and live queries. Those run after you approve; they write only to `dist/` and `/tmp`.

## Confirmed so far (ranked)

1. **SSR HTML is not cached at the edge (affects TTFB)**
   - Evidence: nothing in `src/routes`, `src/server.ts` or `vite.config.ts` sets Cache-Control on HTML. No nitro `routeRules` either. The only HTML caching is in `functions/_middleware.ts`: line 112 sets `max-age=0, must-revalidate` for humans, and lines 149–150 set `max-age=300, swr=86400` for bot snapshots only. The `/index.html` rule in `public/_headers:47` never matches SSR output.
   - Also: Lovable hosting (Worker), not Cloudflare Pages, now serves the live domain. That means `functions/_middleware.ts` and `public/_headers` may not run in production at all. **[to measure]** with `curl -I` on the live domain.
   - Fix: add `headers: () => ({ "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" })` to anonymous public routes (index, category, provider, test detail, biomarker database). Leave admin, control, account and `/api` routes uncached.
   - Expected saving: TTFB p75 from about 1.05 s to under 200 ms on edge hits. Risk: medium, because a cached page must not carry a logged-in user's data. Auth is client-side, so public SSR HTML is user-neutral. Verify that before shipping.

2. **Root route ships every font weight on every page (affects mobile FCP/LCP and CSS)**
   - Evidence: `src/routes/__root.tsx:4-21` loads 16 weight files: Montserrat 400–800 (5), DM Sans 400/500/700, EB Garamond 400/500/600 plus 400 and 500 italic, Lora 400, Lato 400/700.
   - No font files are preloaded.
   - **[to measure]** which families and weights the compiled CSS actually uses. Likely unused: Lora, Lato, Garamond 600 and both Garamond italics.
   - Fix: remove the unused imports and preload the two above-the-fold woff2 files.
   - Expected saving: about 60–120 KB of fonts. Risk: low.

3. **Root route mounts too much up front (affects JS payload)**
   - Evidence: `__root.tsx:24` initialises i18n and its language detector at module scope. Lines 44–52 import AuthProvider, SessionSecurityProvider, FloatingNavDock, AutoTranslatePage, GlobalComparisonBar, TestPageViewTracker and GlobalPageBackground eagerly. HelmetProvider is also included (lines 38 and 223).
   - Can be deferred after first paint with `lazyWithRetry` plus a client-only mount, with no change in behaviour:
     - AutoTranslatePage (only does anything when the language isn't English)
     - GlobalComparisonBar (empty until a test is selected)
     - FloatingNavDock (appears on scroll)
     - TestPageViewTracker
     - both Toasters
   - Keep eager:
     - AuthProvider and SessionSecurityProvider, because they wrap children (they could init lazily inside but stay mounted)
     - i18n, because SSR text needs it
     - Cookiebot (`__root.tsx:154-162`): it must stay first and blocking for auto-blocking consent to work. Don't defer it.
   - Expected saving: **[to measure]**, likely 30–80 KB gzip off the entry chunk. Risk: low to medium.

4. **Images (mobile bytes and possible LCP)**
   - Press logos (`public/images/logos/*.png`, rendered by `src/components/sections/FeaturedPublications.tsx:11+`): 17 PNGs of 63–150 KB each, about 1.8 MB total, at 1024–1264 px for a logo shown at roughly 120×40. `mirror.webp` is already 24 KB.
     - Fix: re-export as about 240 px WebP (each under 10 KB) and add width/height, `loading="lazy"` and `decoding="async"`.
     - Saving: about 1.7 MB. Risk: none.
   - Large files with no reference in `src`, so delete after a broader check:
     - `public/assets/kit-*.png`, six files of 1.4–1.6 MB at 1354×1428
     - `src/assets/hero/hero-gym-selfie.png` (1.37 MB)
     - `public/kits/advanced-well-man.png` (1.2 MB)
   - **Accuracy/compliance:** `public/lovable-uploads/providers/thriva@480.png` and `thriva@320.png` still exist, and Thriva is a banned provider. Delete them.
   - **[to measure]** width/height, lazy, decoding and srcset on each remaining image over 100 KB.

5. **Unbounded and `select("*")` reads (data payload)**
   - 49 `select("*")` calls in `src`. The public-facing ones:
     - `ProviderTestDetailTemplate.tsx:582`
     - `CancerComparisonPage.tsx:86`
     - `MedichecksTestsCatalogPage.tsx:50`
     - `MedichecksMensHealthPage.tsx:27`
     - `useProvidersByTestType.ts:38,97`
     - `useRecommendedTests.ts:63,82`
     - `useEnhancedComparison.ts:269`
     - `LiveDataService.ts:134`
     - `api/supabase/tests.api.ts:52,68,118,138,160`
   - `provider_tests` has 91 columns, so `*` drags in raw scrape HTML and description text.
   - Large caps:
     - `useAllTests.ts:61`: `.limit(1000)` over 19 columns
     - `BiomarkerLibraryService.ts:139`: `.range(0,4999)`
     - Admin pages at `.limit(5000)`: `AdminOpsPage` 69 and 103, `AdminPerformancePage` 98, `CrawlsSection` 75, `ExportSection` 27
   - Hooks fetching in `useEffect` instead of React Query: `useBiomarkersLibrary`, `useSavedProviders`, `useFavoritesApi`, `useUserRole`, `use-auth`, `useAdminMFA`.
   - `useTestCatalogue` was not found under that name. **[to measure]** the closest equivalent.
   - **[to measure]** row counts and payload KB for each call on live data.
   - Fix: explicit column lists, server pagination or loader-fed queries, and React Query for the `useEffect` hooks.

6. **`unified_provider_tests` readers (accuracy)**
   - Readers:
     - `src/services/CompareService.ts:126`
     - `src/lib/seo/test-seo.functions.ts:23` (SSR, so it also adds to TTFB)
     - MCP tools: `search-tests:69`, `get-test:65`, `compare-tests:70`, `save-favourite:24`, `list-my-favourites:52`, `get-data-quality:35`
   - **[to measure]** whether any reader dedupes by id, uses `.single()`, counts rows or depends on the mapping columns. Old `count` results (e.g. `get-data-quality`, `search-tests`) were inflated by the 127 duplicate rows, and the new numbers will be lower and correct.

7. **Router preload**
   - `src/router.tsx:23-28`: `defaultPreload` is unset and `defaultPreloadStaleTime` is 0, which is correct when React Query is in use.
   - `defaultPreload: "intent"` (plus `defaultPreloadDelay: 50`) is safe: loaders that call `ensureQueryData` warm the 10-minute query cache. Loaders that hit Supabase directly would refetch on every hover. **[to measure]** list those loaders first.
   - Saving: faster page changes on tap or hover. Risk: low.

8. **Web Vitals beacon (data accuracy, explains the missing mobile LCP)**
   - Confirmed:
     - The flush uses `supabase.functions.invoke` (`webVitals.ts:56`), which is an ordinary fetch with no keepalive. It gets cancelled on `pagehide` and `visibilitychange` (lines 131–136). That is exactly when mobile LCP and CLS are reported, so mobile samples get lost.
     - The route is captured once at line 103, so all client-side navigations are tagged with the landing route.
   - **Correction:** Android tablets are *not* classed as desktop. Line 28 matches `android` and labels them **mobile**. Only iPadOS 13+ (which reports a Mac user agent) lands in desktop.
   - Fix, needing no edge-function change:
     - Flush with `fetch(\`${SUPABASE_URL}/functions/v1/web-vitals-ingest\`, { method: "POST", keepalive: true, headers: { "content-type": "application/json", apikey, authorization: \`Bearer ${anonKey}\` }, body })`. Keep it under 64 KB.
     - Read `location.pathname` inside `report()` instead of once at install.
     - Treat `android` without `mobi` as tablet, and `Macintosh` with touch points as tablet.
   - Risk: low. CORS preflight still works with keepalive.

9. **Leaflet and the clinic map**
   - `package.json:81,91,92` lists `leaflet`, `react-leaflet` and `react-leaflet-cluster`, but nothing in `src` imports them. They are dead dependencies, so they can't load on any page.
   - Fix: remove all three. Do the same for recharts and framer-motion if the build confirms they're unused or admin-only.

## Next steps after approval (read-only, outputs only)

- Run `vite build`. From the SSR HTML for `/`, list each preloaded or render-blocking JS and CSS file with its gzip size. Grep the chunks for recharts, leaflet and framer-motion. Check that the hero `<link rel=preload imagesrcset>` (`src/routes/index.tsx:26-34`) matches the rendered `<picture>` candidates in `hero-slides.ts` / `HeroMasthead.tsx`.
- Run `curl -I` on the live `/` and a test page to see real Cache-Control headers and the hosting layer.
- Grep the built CSS for each font family and weight.
- Run live row counts and payload sizes for item 5.
- Read each `unified_provider_tests` reader for dedupe or count logic.
- Check width, height, lazy, decoding and srcset on each image over 100 KB.
- Deliver one final ranked table: issue, file:line, saving, risk, exact change. No source edits.
