

## Merge Provider Pages and Fix Pricing

### Problem Summary

1. **Two separate pages for the same thing**: `/providers` (AllProvidersPage) and `/trusted-providers` (TrustedProvidersPage/FeaturedProviders) both list the same 6 providers but with different card styles and layouts.
2. **"Browse Available Tests" goes to the wrong page**: The provider profile's "Browse Available Tests" button links to `/provider/:id/tests` (ProviderTestCatalogPage -- a dark-themed, generic page), while each provider also has a dedicated, better-styled catalog at `/providers/medichecks`, `/providers/goodbody-clinic`, etc.
3. **Medichecks pricing missing**: 58 out of 75 Medichecks tests have no price in the database. The card shows "View on provider site" instead of a price. This is a data gap from the scraper not capturing prices for those tests.
4. **Icon/text alignment on buttons**: Some buttons have icons stacking above text instead of sitting inline.

---

### Plan

#### Step 1: Merge the two pages -- keep "Trusted UK Providers" as the single destination

- **Redirect `/providers` to `/trusted-providers`**: Change the `/providers` route to render a `<Navigate to="/trusted-providers" replace />` redirect instead of `AllProvidersPage`.
- Keep the FeaturedProviders card style (branded top border, provider logo, ratings, tags) as the canonical look.
- The page title remains "Trusted UK Providers".

#### Step 2: Fix "Browse Available Tests" routing on provider profile pages

- In `ProviderProfilePage.tsx`, change the "Browse Available Tests" link from `/provider/${provider.id}/tests` (generic ProviderTestCatalogPage) to the correct provider-specific catalog route:
  - Medichecks -> `/providers/medichecks`
  - GoodBody -> `/providers/goodbody-clinic`
  - Thriva -> `/providers/thriva`
  - Randox -> `/providers/randox`
  - Lola Health -> `/providers/lola-health`
  - London Medical Lab -> `/providers/london-medical-laboratory`
- Use a lookup map (same as `PROVIDER_CATALOG_ROUTES` from AllProvidersPage) to resolve the correct route.

#### Step 3: Fix Medichecks pricing

- The database has 58 Medichecks tests with NULL prices. The scraper needs to be re-run to capture these, but in the meantime:
  - Update the `formatPrice` function in `MedichecksTestsCatalogPage.tsx` to show "Price on request" as a link to the provider's test URL (already partially done), but also add a visual distinction so it does not look like a bug.
  - More importantly, trigger a scraper refresh or manually update the prices for popular tests. This is a data issue, not a code issue -- the code already handles null prices. The scraper (`run-all-scrapers` edge function) should be re-triggered to pull current prices.

#### Step 4: Verify all button destinations and icon alignment

- Audit every button across FeaturedProviders cards, AllProvidersPage cards, ProviderProfilePage, and provider catalog pages to ensure:
  - Icons use `inline-flex items-center gap-2` with `flex-shrink-0` on the icon and `<span>` around the text
  - All "View Profile" buttons link to `/provider/{id}`
  - All "Browse Tests" / "Browse Available Tests" buttons link to the correct provider-specific catalog
  - All "Visit Website" buttons open the correct external URL
  - All "Book" / external buttons open the provider's test-specific URL

---

### Technical Details

**Files to modify:**

| File | Change |
|---|---|
| `src/routes/featureRoutes.tsx` | Replace `AllProvidersPage` import with a `Navigate` redirect from `/providers` to `/trusted-providers` |
| `src/pages/ProviderProfilePage.tsx` | Add `PROVIDER_CATALOG_ROUTES` map; update "Browse Available Tests" link to use provider-specific route; ensure all button icons are inline |
| `src/pages/MedichecksTestsCatalogPage.tsx` | Update `formatPrice` to show "Price on request" more clearly when price is null |
| `src/components/sections/FeaturedProviders.tsx` | Verify "View Profile" links resolve correctly (currently uses `/provider/${provider.id.toLowerCase()}` which may not match for all providers) |

**Route changes:**

```text
/providers         -> Redirect to /trusted-providers
/trusted-providers -> TrustedProvidersPage (FeaturedProviders cards -- kept as-is)
/provider/:id      -> ProviderProfilePage (individual profile)
/providers/medichecks -> MedichecksTestsCatalogPage (test catalog)
/providers/goodbody-clinic -> GoodbodyTestsCatalogPage
...etc (unchanged)
```

**FeaturedProviders card ID fix:**

The FeaturedProviders cards use IDs like "Medichecks", "Goodbody", "Randox" etc. for the "View Profile" link. These need to map correctly to the provider profile route. Current link is `/provider/medichecks` which resolves via partial matching. This works but should be verified for all 6 providers.

**Data note:**

The Medichecks pricing gap (58/75 tests missing prices) is a database/scraper issue. The code change will improve the display for missing prices, but a scraper re-run is recommended to populate the actual prices.

