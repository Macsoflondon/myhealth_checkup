# Fix card readability, hover behaviour and non-test catalogue rows

## Scope

1. **Fix dark-on-dark text across test and provider cards**
   - Change the selected provider test heading and “tests available” count to the white/on-dark semantic foreground where they sit on navy.
   - Complete the existing frontend contrast sweep across test cards, provider cards and their surrounding dark sections.
   - Replace confirmed dark/inherited foregrounds on dark surfaces with `text-on-dark`, `text-on-dark-muted` or another accessible semantic foreground, without changing light-surface text.

2. **Make the test-card reveal deliberate and smooth**
   - Replace the current 240ms image-to-information transition with a slower, calm crossfade of roughly 1.5 seconds.
   - Add hover intent so briefly passing over or touching a card does not immediately switch faces.
   - Preserve keyboard focus behaviour, touch access through “View details”, and reduced-motion support.

3. **Permanently remove non-test catalogue entries**
   - Delete these confirmed active rows and their dependent records using correctly typed lookup keys:
     - Medichecks: `collection method - urine in-store`
     - Medichecks: `collection method - urine nurse-visit`
     - Medichecks: `Visit a Medichecks partner clinic [collection method]`
     - Clinilabs: `Phlebotomy (Venous draw) at clinic`
   - Remove other confirmed non-diagnostic products found in the same audit: standalone biological collection kit and vaccination products.
   - Re-query the live catalogue to prove none remain.

4. **Prevent re-ingestion and hide legacy contamination**
   - Extend the shared scraper junk-name guard to reject gift/voucher products, collection-method products, standalone clinic/nurse/phlebotomy visits, standalone collection kits and vaccination products.
   - Apply the same rules in the frontend shared guard and replace the duplicate at-home-only filter with that shared implementation.
   - Filter provider grids through the shared guard so a stale row cannot surface while awaiting database cleanup.

5. **Keep Lola Health add-ons subordinate**
   - Sort provider catalogue results with full tests before add-ons, then retain existing popularity ordering within each group.
   - Keep the visible add-on badge on both resting and detail faces.

## Technical verification

- Run focused unit tests for the expanded junk-name rules and existing relevant tests.
- Run lint on affected files.
- Verify provider and at-home catalogue pages in the browser at desktop and mobile widths.
- Confirm the hover transition is smooth, keyboard/touch access remains usable, dark-section copy is readable, Lola Health add-ons follow full tests, and removed rows return zero database matches.
- Run the contrast audit and address every confirmed card/section finding in scope before completion.
