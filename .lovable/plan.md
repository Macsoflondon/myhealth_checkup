## Plan

### 1. Remove the ad-card overlay from hero carousel
In `src/components/sections/HeroMasthead.tsx`, delete the `{ad && (...)}` block (lines 183-203) that renders the floating test card with the **Compare** button on the hero images. This removes the buttons the user highlighted in the screenshot.

### 2. Update hero background to #F5F5F5
Change the hero `<section>` background class from `bg-[#fafaf7]` to `bg-[#F5F5F5]` (line 120).

Also update the `PEARL` constant on line 13 from `"#fafaf7"` to `"#F5F5F5"` so it stays consistent with the user's stated colour.

No other sections, copy, or carousel logic are touched.