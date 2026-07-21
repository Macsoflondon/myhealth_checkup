Plan to fix the divider issue only:

1. Update the divider in `src/pages/Index.tsx`
   - Keep it directly under the slogan in the AI Health Quiz container.
   - Make the divider exactly centred with `mx-auto`.
   - Keep the width at three-quarters of the container on mobile and desktop.
   - Replace the invisible navy first segment with pearl white, so the divider visibly reads as three colours: pearl white, turquoise, pink.

2. Avoid touching unrelated areas
   - No scraper changes.
   - No database changes.
   - No hero carousel changes.
   - No provider/test data changes.

3. Verify visually after implementation
   - Check the preview around the section directly under the hero image.
   - Confirm the divider is visibly tricolour, centred, and spans roughly 75% of the navy container.