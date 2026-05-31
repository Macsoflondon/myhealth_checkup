## Goal
Fix the homepage “Our Partners Most Popular Tests” section so it consistently shows 9 real tests, uses real provider product images, and reflects current provider website pricing/details — including London Medical Laboratory and Lola Health.

## What I’ll change
1. **Repair provider coverage in the popular-tests pipeline**
   - Extend the popularity refresh logic so London Medical Laboratory is included in the popular ranking flow instead of being excluded.
   - Review Lola Health ranking refresh at the same time so its rows are actually eligible for the homepage set.
   - Keep the homepage locked to 9 items.

2. **Fix image sourcing for provider cards**
   - Update the data flow so the card image uses the real product/test-kit image URL from the provider product page wherever available.
   - Remove dependency on placeholder/fallback imagery for London Medical Laboratory when a product image can be scraped and stored.

3. **Refresh stale provider website data**
   - Re-run the relevant scrapers / popularity refresh so price, product URL, description, and image URL are pulled again from the providers’ live sites.
   - Verify London Medical Laboratory rows are repopulated with usable images and current product metadata.

4. **Tighten homepage filtering so bad rows stay out**
   - Keep non-test items like “Blood Draw Appointment” excluded.
   - Preserve provider diversity in the 9-card set while allowing London Medical Laboratory and Lola Health to appear once their data is valid.

5. **Validate the result end-to-end**
   - Check the underlying provider rows after refresh.
   - Confirm the homepage section is drawing from refreshed data and that London Medical Laboratory and Lola Health can surface with real kit images.

## Technical notes
- Current issue found: London Medical Laboratory has active rows but **0 popular flags** and **0 images**, so the homepage filter drops it.
- Current issue found: the `scrape-popular-tests` function only refreshes **Goodbody, Medichecks, and Lola**, so London Medical Laboratory never gets ranked into the “popular” pool.
- Current issue found: Lola Health has rows, but currently also has **0 popular flags**, so it depends on fallback selection rather than being explicitly ranked.
- Current issue found: the homepage component already slices to **9** items, but the data underneath is incomplete/stale, which is why the visible set collapses toward Goodbody/Medichecks.

## Deliverable
A homepage popular-tests section that stays at 9 cards and pulls real provider product data/images, with London Medical Laboratory and Lola Health properly represented when their live rows are available.