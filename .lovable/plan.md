### Adjust hero section vertical layout: anchor image to bottom, increase top gap

1. **Increase gap between Wordmark and H1** in `src/components/sections/HeroMasthead.tsx`:
   - Increase the H1 top margin (`mt-1.5 sm:mt-4`) to a significantly larger value (e.g., `mt-6 sm:mt-14` or `mt-8 sm:mt-16`) to create the requested dead space between "myhealthcheckup" and "Compare.".

2. **Anchor the hero image to the bottom of the viewport**:
   - Change the image wrapper div from `flex-1 min-h-[52svh] ...` to `flex-1 min-h-0` so it consumes all remaining vertical space and stretches to the bottom edge of the hero section.
   - Remove the negative horizontal margins (`-mx-3 sm:-mx-6 md:-mx-9`) if they cause the image to clip the section border, or keep them flush.
   - Ensure the `section` itself maintains `min-h-[88svh] sm:min-h-[100svh]` and `flex flex-col` so the image fills the gap between the header content and the bottom edge.

3. **Reposition the ticker** so the image is the visual base:
   - Option A: Remove the ticker from below the image and instead render it as an overlay at the bottom edge of the image wrapper (e.g., `absolute bottom-0` inside the image container).
   - Option B: Keep the ticker below the image but ensure the image itself extends flush to the section bottom by removing the ticker's bottom padding from the hero section and moving it outside.
   - The preferred approach is to overlay the ticker on the bottom edge of the image so the image remains the base of the page visually.

4. **Verify proportions** on mobile (360–414px) and desktop to ensure the image does not become too short on small screens while still filling the viewport on desktop.