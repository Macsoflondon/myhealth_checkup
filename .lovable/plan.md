

## Plan: Add Ticker Above Header and Enlarge Logo

### 1. Add BrandTicker copy above the header

Place the `BrandTicker` component in `MainLayout.tsx` directly above the `Header`, so it renders at the very top of every page (above the UKAS banner and header). No style changes to the ticker itself.

**File: `src/layouts/MainLayout.tsx`**
- Import `BrandTicker`
- Render `<BrandTicker />` as the first element inside the wrapper div, before `UKASBanner` and `Header`

### 2. Increase logo size ~3x in the header

Current desktop logo: `h-20 lg:h-24 xl:h-28` (~80-112px)
New desktop logo: `h-48 lg:h-56 xl:h-64` (~192-256px) — approximately 3x larger

Current mobile logo: `h-[92px]`
New mobile logo: `h-[200px] xs:h-[220px] sm:h-[240px]` — approximately 2.5-3x larger

**File: `src/components/layout/Header.tsx`**
- Update the `className` on both mobile and desktop `<img>` tags to use the larger height values
- Logo remains centred (already centred via flex layout)

