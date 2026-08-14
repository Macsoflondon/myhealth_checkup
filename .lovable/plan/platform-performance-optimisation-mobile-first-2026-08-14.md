# Platform performance optimisation (mobile-first)

Goal: cut mobile payload and speed up first render across the whole platform, without changing any layout, copy or behaviour.

## What's slowing things down (verified)

- `src/assets/hero` holds 9.3 MB of images; `src/assets/kits` another 6.5 MB. Single files reach 2.6 MB (`hero-kit-kitchen.png`), 1.95 MB (`hero-kit-unboxing.png`), 1.78 MB (`hero-empowered-results.webp`), 1.37 MB (`goodbody-advanced-well-man-v2.png`). PNG is being used for photographs, which is the worst possible format here.
- The hero renders a single `<img src>` per slide at `sizes="100vw"` with no `srcset`, so a 390px phone downloads the same full-size file as a 4K desktop.
- All four hero slides are mounted in the DOM at once; only the first is truly needed for first paint.
- Heavy libraries (`leaflet` + `react-leaflet-cluster`, `recharts`, `framer-motion`, `lodash`) sit in the main dependency graph; any that are statically imported from shared modules land in the initial bundle.
- No build-time image pipeline and no manual chunking are configured.

## Plan

### 1. Build-time responsive images
- Add `vite-imagetools` and a small `ResponsiveImage` component that emits AVIF + WebP `<source>` sets with widths 480/768/1200/1920 and a correct `sizes` attribute.
- Convert every large bundled photo (hero, kits, compliance) to generated variants; JPEG/WebP stays the fallback. No original PNG photos ship.
- Delete hero/kit images no longer referenced anywhere (audit references first; only remove ones with zero hits).

### 2. Hero (LCP path)
- Give the first slide a real `srcset` so mobile pulls a ~480–768px AVIF instead of the full-width asset, and keep the existing LQIP + preload.
- Update the route `preload` link in `src/routes/index.tsx` to use `imagesrcset`/`imagesizes` so the preload matches the image the browser actually picks (otherwise it double-downloads).
- Mount only slide 1 initially; mount slides 2–4 after first paint / on idle. Rotation behaviour unchanged.

### 3. Non-hero imagery
- Apply the same responsive component to test-card, kit and provider imagery, all with `loading="lazy"`, `decoding="async"` and explicit width/height to keep CLS at zero.
- CDN assets (`.asset.json`) stay as-is but get correct `sizes`, dimensions and lazy attributes wherever they're rendered.

### 4. JavaScript weight
- Verify leaflet/react-leaflet, recharts and any admin-only bundles are behind `React.lazy` + `ClientOnly`, so the clinic map and charts never load on the homepage.
- Replace whole-package `lodash` imports with per-function imports (or native equivalents).
- Audit `framer-motion` usage; swap simple fade/reveal animations (e.g. `SectionReveal`) to CSS transitions so motion isn't pulled into the initial chunk.
- Add manual chunking for vendor groups (react/router, supabase, radix, charts/maps) to improve cache hit rate between deploys.

### 5. Fonts and third-party
- Confirm Montserrat/DM Sans load only the weights actually used, with `font-display: swap` and preloaded woff2 for the two above-the-fold weights.
- Keep existing long-cache headers in `public/_headers`; no changes needed there.

### 6. Verification
- Before/after build output: total JS, initial chunk size, and image bytes on `/`.
- Playwright run at 390×710 (mobile) plus desktop capturing LCP, CLS and transferred bytes for `/`, a category page, and `/compare`.
- Visual screenshot diff on those routes to prove nothing shifted; existing E2E and unit suites must pass.

## Technical notes

`vite-imagetools` runs at build time inside the existing Vite config; no runtime image service, no SSRF surface. Generated variants are hashed and covered by the `/assets/*` immutable cache rule already in `public/_headers`. Prerender and SSR output are unaffected — `<picture>` markup is static HTML, so crawler snapshots keep working.
