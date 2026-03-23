
Rebuild the homepage hero as an exact screenshot-driven implementation, not a loose approximation.

1. Replace the hero background asset
- Update `src/components/sections/Hero.tsx` to use the newly uploaded blood-tube image instead of the current bundled asset.
- During implementation, copy the uploaded file into `src/assets/` and import that exact file so the background matches the screenshot.

2. Rebuild the hero container to match the screenshot structure
- Keep the hero as a full-width section with the image covering the entire area.
- Add the soft pink wash over the image plus a subtle dotted pattern overlay across the full hero area, because the screenshot clearly has both.
- Tighten the vertical spacing so the badge, heading, underline, text block, CTAs, and search card stack at the same density as the screenshot.

3. Match the badge exactly
- Use a centered turquoise pill with white text.
- Match its smaller scale, softer shadow, and lighter visual weight from the screenshot rather than the current heavier badge treatment.

4. Rebuild the headline to match the screenshot line-for-line
- Set the heading to a lighter weight and larger scale with the exact two-line wrapping seen in the screenshot.
- Keep the navy main text and pink “All in one place!” accent inline on the second line.
- Adjust max width and line-height so the break lands like the screenshot, not the current version.

5. Match the underline and mission copy block
- Replace the current simple underline with the short centered turquoise-to-pink gradient stroke shown in the screenshot.
- Keep the left turquoise vertical rule on the mission copy, but adjust its height, thickness, spacing, and paragraph widths to match the screenshot.
- Use the same darker navy text tone and heavier paragraph styling as shown.

6. Match CTA buttons exactly
- Use three centered pill buttons with the screenshot’s widths, heights, spacing, corner radius, and white text.
- Keep turquoise / pink / turquoise fills in the same order.
- Ensure hover states still turn pink where appropriate, but the default visual must prioritize screenshot fidelity.

7. Rebuild the search card to screenshot proportions
- Increase the card width and rounded corners so it looks like the large floating white panel in the screenshot.
- Make the top search input taller, with the pale turquoise border, larger left icon, and lighter placeholder styling.
- Restyle the inner popular-searches panel with the same inset card look, uppercase heading, and centered turquoise pills.

8. Match the trust signals bar directly below
- Keep it as a separate white strip immediately under the hero card.
- Lay out the five trust items in two centered rows exactly like the screenshot, with small turquoise icons and compact navy text.
- Preserve the values shown in the screenshot, including “200+ tests available” and “150+ clinics nationwide”.

9. Align homepage integration with the screenshot
- Update `src/pages/Index.tsx` so the preloaded hero image points to the new uploaded asset instead of the old `/lovable-uploads/hero-bg-pink-tubes.webp` reference.
- Verify spacing between `Hero`, `TestCategoryTicker`, and `MissionSection` so the transition matches the screenshot: white trust bar, navy ticker, then navy mission block.

10. Important surrounding cleanup
- Confirm `src/App.css` is not affecting layout in practice; if it is wired in later, its `#root` max-width would break full-width hero rendering and should be removed during implementation.
- Keep all work limited to the hero-related homepage files unless exact screenshot matching requires a tiny spacing adjustment in adjacent sections.

Files to update
- `src/components/sections/Hero.tsx`
- `src/pages/Index.tsx`
- Possibly adjacent homepage section spacing only if needed for exact match

Technical notes
- The current Hero already has the right content pieces, but the screenshot mismatch comes from composition: wrong image source, missing dotted overlay, incorrect headline weight/width, incorrect spacing rhythm, insufficiently accurate search-card proportions, and trust-bar alignment.
- The rebuild should be screenshot-first: structure and sizing should be driven by the uploaded reference, not by existing component defaults.
