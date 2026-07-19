## Plan: fix the live comparison panels properly

### What I verified
- The current live database rows are not showing duplicate providers or walk-in wording in the rows I queried, but the screenshot proves stale/mixed panel data is still reaching the UI somewhere.
- There is still legacy comparison wording in the codebase and old seed migrations include `Walk-in UK clinics`, `Walk-in London`, and `Clinic-based` wording.
- The live panel UI currently trusts whatever JSON is in `live_comparison_panels.rows`, so if stale rows or older panel shapes return, the UI can still render duplicate Clinilabs and forbidden wording.

### Fix scope
1. **Harden the UI renderer**
   - In `StartJourneySection.tsx`, normalise every database row before rendering.
   - Drop duplicate providers within each panel using provider id/name.
   - Reject panels that mix `at_home` and `clinic` rows.
   - Convert all method wording to only:
     - `At-home test kit`
     - `In-clinic test`
   - Never render `Walk-in`, `Walk-in UK clinics`, `Walk-in London`, or `Clinic-based` from database JSON.

2. **Clean the live panel data source**
   - Update `live_comparison_panels` data so every panel is method-pure.
   - Ensure each provider appears once per panel.
   - Prefer broader provider coverage across the nine providers where relevant, instead of repeated Clinilabs rows.
   - Keep separate rotations for the same test type where data exists:
     - `Thyroid Health Panel — At-home test kit`
     - `Thyroid Health Panel — In-clinic test`

3. **Add database guardrails**
   - Add a database validation function or trigger for `live_comparison_panels.rows` so future updates cannot save:
     - duplicate providers in one panel
     - mixed collection methods in one panel
     - forbidden labels containing `walk-in` or `clinic-based`
   - This prevents the scraper or a future seed from reintroducing the exact issue.

4. **Update the scraper behaviour**
   - Adjust `refresh-live-comparison-panels` so it preserves the method fields and only updates prices/timestamps.
   - Do not allow scraper output to rewrite method labels into legacy wording.

5. **Verify in browser and database**
   - Query every `live_comparison_panels` row for duplicate provider names, mixed methods, and forbidden wording.
   - Check the homepage live panel DOM after load for:
     - no visible `Walk-in`
     - no visible `Clinic-based`
     - no duplicated provider names within a card
     - footer still using `last_scraped_at`
   - Verify at mobile width matching your screenshot.

### Technical notes
- Schema/config changes will go through a Supabase migration.
- Data cleanup will use the Supabase data update tool, not a schema migration.
- Frontend changes stay limited to the live comparison rendering path.