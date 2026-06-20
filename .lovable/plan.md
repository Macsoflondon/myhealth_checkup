## Goal

In `StartJourneySection`, delete the left-side letterbox video card and move the second live comparison table (currently in `PartnerShowcaseGrid`, using `DEFAULT_LIVE_COMPARISON_PANELS`) into its place. End state: two `LiveComparisonCard`s sit side-by-side in Row 2 of `StartJourneySection`, and the comparison card is removed from `PartnerShowcaseGrid`.

## Changes

1. **`src/components/sections/StartJourneySection.tsx`**
   - Remove the `<video>` block (lines ~127–155) including the `letterboxVideo` import and the "From Letterbox to Lab" overlay copy.
   - Replace that left grid cell with `<LiveComparisonCard panels={DEFAULT_LIVE_COMPARISON_PANELS} rotateMs={30000} />`.
   - Import `DEFAULT_LIVE_COMPARISON_PANELS` from `@/components/sections/LiveComparisonCard`.
   - Keep the existing right-hand `LiveComparisonCard panels={TESTS}` unchanged.

2. **`src/components/sections/PartnerShowcaseGrid.tsx`**
   - Remove the `<LiveComparisonCard panels={DEFAULT_LIVE_COMPARISON_PANELS} ... />` instance (line ~129) and its surrounding wrapper/Suspense if it becomes empty, plus the now-unused imports.

## Out of scope

- No changes to the `LiveComparisonCard` component itself.
- No copy or styling changes elsewhere on the homepage.
- The `compare-screen-recording.mov` asset file is left in place (not deleted) in case it's referenced elsewhere; can be removed in a follow-up if desired.
