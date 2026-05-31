## Goal
Restore the homepage “Our Partners Most Popular Tests” section to the previous 9-card layout shown in your screenshot.

## What I’ll change
1. Remove the current filmstrip/carousel behaviour from the homepage section.
2. Restore the section to a fixed grid of exactly 9 test containers on the homepage.
3. Keep the cards mixed across providers rather than grouped by a single provider.
4. Use only saved provider test data for each card:
   - test name
   - provider name
   - description
   - price
   - URL
   - saved image URL from the test record
5. Keep all card links pointing directly to each test’s saved provider URL.
6. Do not generate, substitute, or invent any images.

## Implementation approach
- Update `src/components/sections/DreamHealthShowcase.tsx` so it matches the previous grid-style section instead of the current carousel-heavy version.
- Keep the selection logic focused on producing exactly 9 valid cards with:
  - a non-empty test URL
  - a saved external image URL
  - provider-backed row data only
- Preserve provider mixing, but prioritise the old visual structure from the screenshot.
- Remove the extra logic that is causing the section to present differently from before.

## Technical details
- `src/components/sections/DreamHealthShowcase.tsx`
  - remove the moving image strip
  - render the homepage section as a 3x3 card grid
  - keep card content and click targets driven by the saved provider rows
- `src/hooks/usePopularTestsFromDatabase.ts`
  - keep or tighten the fetch so the component receives enough valid rows to reliably fill 9 cards
  - ensure rows used by the homepage have both `url` and `image_url`

## Result
The homepage section will go back to the prior 9-container presentation from your screenshot, using the saved provider image URLs and saved provider test information only.