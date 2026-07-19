Update the AI Health Quiz section in `src/pages/Index.tsx` (lines 208–259):

1. **H2 header on one line, closer to the border**
   - Force the H2 to stay on a single line with `whitespace-nowrap` and reduce horizontal padding/max-width so it sits ~1 cm closer to the section edge.
   - Adjust the left text column’s max-width or the container padding to move the heading outward.

2. **Brighten subheading text**
   - Change the paragraph under the H2 from `text-white/70` to `text-white` (or `text-white/95`) so it is a brighter white.

3. **Brighten and centre helper text under the CTA**
   - Change the helper text row under the CTA button from `text-white/60` to `text-white` (or `text-white/95`).
   - Ensure the helper row is directly underneath the CTA button and evenly spread/centered, not offset to one side. Use `justify-center` and consistent gap/spacing so it aligns evenly under the button on all breakpoints.

No data or logic changes — purely presentational.