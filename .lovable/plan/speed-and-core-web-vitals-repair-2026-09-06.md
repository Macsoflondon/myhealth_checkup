# Speed and Core Web Vitals repair

Google's own test API had hit its daily limit, so I measured the live site directly instead: fetched the real homepage, listed every file the browser is told to download before it can paint, and weighed each one. The findings below are from that measurement, not assumptions.

## What's actually slowing the homepage down

Roughly 450 KB of compressed JavaScript is requested up front, plus a 186 KB HTML document and a font stylesheet loaded from Google's servers that blocks painting.

The specific offenders:

1. **Chart library loaded on the homepage (106 KB).** Nothing on the homepage draws a chart. It is being dragged in by a shared barrel file that re-exports the comparison chart, so it lands in the initial download.
2. **Animation library loaded on the homepage (40 KB).** Only two gallery sections use it, neither above the fold.
3. **One giant main bundle (253 KB).** Too much shared code is bundled together instead of split by what the first screen needs.
4. **Two competing font systems.** Montserrat and DM Sans are self-hosted (8 stylesheets), while EB Garamond and Lora are pulled from Google Fonts as a render-blocking stylesheet on every page. One page also injects a third font import at runtime, which blocks that page again mid-render.
5. **Hero image preload mismatch.** The preload hint points at a PNG file but declares itself as AVIF. Browsers can end up fetching a hero image twice, or fetching the wrong one, which directly hurts the Largest Contentful Paint score.
6. **Oversized HTML.** The homepage document is 186 KB, inflated by large inline structured-data blocks duplicated between the page and the site root.

## The fixes

1. Stop the chart library reaching the homepage: import the comparison chart directly where it is used and load it only when a comparison view opens, rather than via the shared barrel.
2. Load the animation library only inside the two gallery sections that need it, on demand.
3. Split the main bundle so the first screen ships only what it renders; everything below the fold stays deferred as it already is.
4. Consolidate fonts: self-host the two editorial fonts alongside the existing ones, remove the Google Fonts stylesheet and the runtime font import, and keep only the weights actually used.
5. Correct the hero preload so the declared type and the file match, guaranteeing exactly one hero download at the right size.
6. Remove the duplicated structured-data blocks so each page states them once.

Nothing about the layout, wording, colours or behaviour changes — this is purely about what the browser downloads and when.

## Verification

- Re-measure the same page before and after: total JavaScript, number of blocking requests, and HTML size.
- Run a browser check at desktop and mobile sizes recording paint timing and layout stability, plus screenshots to prove nothing moved.
- Run the existing test suites and the type check.
- Once live, re-run Google's PageSpeed test to confirm the score movement.

## Technical notes

- Barrel-import fix in `src/components/compare/index.ts` plus direct/lazy imports at the call sites; verify `vendor-charts` and `vendor-motion` no longer appear as `modulepreload` in the SSR HTML for `/`.
- Font work: add `@fontsource` packages for EB Garamond and Lora, drop the `fonts.googleapis.com` `<link>` from `src/routes/__root.tsx` and the inline `@import` in `BiomarkerLibraryUI.tsx`, keep `display: swap`.
- Hero preload: reconcile `FIRST_SLIDE_SRC` (currently a `.png`) with `type: "image/avif"` in `src/routes/index.tsx`; make the fallback `href` the smallest AVIF candidate.
- Manual chunking in `vite.config.ts` stays, but charts/motion should be reached only through dynamic imports so their chunks are never preloaded on `/`.
- Structured data: keep the Organization/WebSite JSON-LD in `__root.tsx` only, leave the page-specific MedicalBusiness schema on the homepage.
