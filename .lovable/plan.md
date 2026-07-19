## Findings

The live comparison price shown for CliniLabs testosterone is **not accurate as an in-clinic end price**.

Verified current state:
- CliniLabs’ Shopify product source for `Testosterone Blood Test` is **£19**.
- `provider_tests` stores CliniLabs testosterone with:
  - base price: **£19**
  - in-clinic collection fee: **£30**
  - expected in-clinic total: **£49**
- `live_comparison_panels` currently displays **£19** for the in-clinic CliniLabs testosterone row.
- This is systemic: the testosterone panels also show base prices for providers where fees exist, e.g. Medichecks and Goodbody.

## Plan

### 1. Fix pricing rules for live comparison panels
- Treat panel prices as **method-specific expected totals**, not raw product/list prices.
- For **in-clinic** rows:
  - show `price + mandatory collection fee + mandatory clinical review fee`.
- For **at-home test kit** rows:
  - show the kit price unless the additional fee is mandatory for that at-home method.
- Keep provider page URLs unchanged so users can confirm current pricing before booking.

### 2. Stop the refresh job from overwriting totals with raw scraped prices
- Update `refresh-live-comparison-panels` so it does not scrape the first `£` value from product pages and write that directly into the panel.
- Instead, refresh panels from `provider_tests`, using:
  - provider id
  - source test URL/name
  - collection method
  - method-specific total price
- Keep `last_scraped_at` updating only after a real refresh.

### 3. Rebuild affected live comparison panel rows
- Regenerate the existing panel JSON so displayed prices use expected totals.
- Specifically correct testosterone panels, including CliniLabs in-clinic testosterone from **£19** to **£49**.
- Audit all panels for rows where displayed price matches base price but differs from expected total.

### 4. Prevent method mixing and bad labels from coming back
- Keep panels method-pure:
  - one panel rotation is **At-home test kit** only
  - another is **In-clinic test** only
- Ensure no row uses forbidden wording like `Walk-in`, `Walk in`, or `Clinic-based`.
- Remove provider rows whose stored collection method does not match the panel method.

### 5. Run the real scraper/refresh path
- Deploy the updated edge function.
- Run the provider scrapers/refresh job once manually after deployment.
- Re-query `live_comparison_panels` to confirm:
  - CliniLabs testosterone in-clinic displays **£49**
  - no mixed at-home/in-clinic rows
  - no duplicate provider rows within a panel
  - `last_scraped_at` reflects the refresh

### 6. Verify in the browser
- Check the homepage live comparison cards on desktop and mobile.
- Confirm the footer timestamp still says prices were verified recently.
- Confirm rows show realistic end prices and provider/method labels remain clean.