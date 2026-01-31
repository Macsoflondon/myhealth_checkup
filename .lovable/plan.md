
## Remove Duplicate HealthAssetBanner

### What I'll Do

Remove the standalone `HealthAssetBanner` component from the homepage since its content ("Your health is your greatest asset!") is now integrated directly into the `MissionSection` as a navy banner heading.

### Changes

**1. Update `src/pages/Index.tsx`**
- Remove the `HealthAssetBanner` import (line 11)
- Remove the `<HealthAssetBanner />` component usage (line 112)

**2. Optionally delete the component file**
- `src/components/sections/HealthAssetBanner.tsx` can be deleted as it's no longer needed

### Updated Section Order

After the change, the homepage sections will flow as:
1. Hero
2. MissionSection (includes the navy banner heading)
3. PartnersGrid
4. JourneySimplified
5. FeaturedPublications
6. TaglineVideoSection
7. MostPopularTestsSection
8. TopConcernsSection
9. FindClinicSection
10. HereToHelp
11. FinalCTA
12. TrustPlatformSection
