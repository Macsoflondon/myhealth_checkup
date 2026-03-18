

## Uniform Layout for All Pages (Except Homepage)

### Problem
Two issues identified:

1. **CompareTests** and **CategoryLandingPage** use `MainLayout hideHeader hideFooter` with a custom `HeroSection`, meaning they lack the standard BrandTicker (discount code carousel) and sticky navigation toolbar that other pages have.

2. **Category display names** are incomplete -- e.g. "vitamins" maps to just "Vitamins" instead of "Vitamin and Mineral Tests".

### Plan

**1. Fix CompareTests page layout**
- Remove `hideHeader hideFooter` from `MainLayout` so the standard header (BrandTicker + logo + sticky nav toolbar + footer) renders automatically.
- Remove the inline `HeroSection` component -- the page title ("Compare Vitamin and Mineral Tests") will instead be shown as a heading within the page content area, consistent with other category pages.

**2. Fix CategoryLandingPage layout**
- Same treatment: remove `hideHeader hideFooter`, remove `HeroSection`, use standard `MainLayout` with the header/footer showing.

**3. Update category display names**
- Add missing entries to `categoryDisplayNames` in `src/utils/categoryTaglines.ts`:
  - `"vitamins"` → `"Vitamin and Mineral Tests"`
  - Any other missing categories that resolve to incorrect names.

**4. Ensure all other category/subcategory pages use standard MainLayout**
- Audit the specialized pages (WomensHealthPage, MensHealthPage, WellnessPage, etc.) -- these already use `<Header />` or `<MainLayout>` without hiding, so they should already be correct. Confirm and fix any that aren't.

### Technical Details

**Files to modify:**
- `src/pages/CompareTests.tsx` -- remove `hideHeader hideFooter` props, remove `HeroSection`, add an `<h1>` heading inside the content area
- `src/pages/CategoryLandingPage.tsx` -- same treatment
- `src/utils/categoryTaglines.ts` -- add `"vitamins": "Vitamin and Mineral Tests"` (and tagline) plus any other missing categories

The result: every page except the homepage will show BrandTicker → sticky navigation toolbar → page content → footer, giving a uniform experience across all category and subcategory pages.

