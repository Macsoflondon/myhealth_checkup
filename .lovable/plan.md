Remove the `PersuasionTrustStrip` section (the turquoise/pink stats strip with "100% UKAS-accredited labs", "200+ tests compared", etc.) that sits directly below the hero on the homepage, since equivalent trust messaging already appears elsewhere on the page.

## Changes

**`src/pages/Index.tsx`**
- Remove the lazy import of `PersuasionTrustStrip`.
- Remove its `<Suspense><PersuasionTrustStrip /></Suspense>` block (currently rendered right after `<TestCategoryTicker />`).

The component file itself (`src/components/sections/PersuasionTrustStrip.tsx`) will be left in place in case you want to reuse it later — let me know if you'd prefer it deleted too.