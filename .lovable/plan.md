## Plan: live comparison cards by collection method

### What I’ll change
- **Stop mixing collection methods** in the same live comparison panel.
  - Each card rotation will be either **At-home test kit** or **In-clinic test** only.
  - The method wording will be shown once at the top of the table, not repeated inconsistently per provider.

- **Remove wrong collection language**.
  - Replace/normalise `Walk-in UK clinics`, `Walk-in London`, `home nurse`, and similar wording.
  - Use only approved labels: **At-home test kit** or **In-clinic test**.

- **Fix duplicate providers inside a panel**.
  - A provider should appear at most once per comparison panel.
  - Where a test has multiple matching products from the same provider, keep the best-priced relevant option for that method.

- **Improve provider coverage**.
  - Build panels from the wider `provider_tests` data rather than the current manually-seeded rows that over-repeat CliniLabs.
  - Include the available provider spread across the platform where they actually have a comparable test and the matching method.

- **Preserve live verified footer**.
  - Keep using `last_scraped_at` so the footer continues to show relative live verification, e.g. `Prices verified 19 minutes ago...`.

### UI behaviour
- Add a small table-level method label/header near the top of each live comparison table:
  - **At-home test kit** for home-only panels.
  - **In-clinic test** for clinic-only panels.
- Provider rows will display provider name + price cleanly, with no mixed method labels in the row list.
- Keep the existing premium card styling and live comparison rotation.

### Data/backend behaviour
- Update the `live_comparison_panels` rows so each JSON row has consistent method wording.
- Reseed/refresh the existing panel data from `provider_tests`, grouped by:
  - test theme/category
  - collection method
  - unique provider
- No new table is needed.

### Technical notes
- Frontend files to update:
  - `src/components/sections/LiveComparisonCard.tsx`
  - `src/components/sections/StartJourneySection.tsx`
- Database update:
  - Clean and repopulate `public.live_comparison_panels` using existing provider data.
- Validation:
  - Query the table after the update to confirm no panel mixes home and clinic wording.
  - Confirm no panel repeats the same provider.
  - Browser-check the homepage card layout at the current viewport and mobile width.