# Remove “Blood Test” from all test-card headlines

## Goal
Show concise test names across every test-kit card while leaving catalogue data, detail pages, modal content, search, SEO and provider wording unchanged.

## Changes
1. Add a small shared headline formatter that removes only a terminal `Blood Test` phrase, case-insensitively and with surrounding whitespace handled.
   - Examples: `Advanced Well Man Blood Test` → `Advanced Well Man`
   - `Advanced Thyroid Function Blood Test` → `Advanced Thyroid Function`
   - Names where “blood test” appears earlier in the title remain untouched.
2. Apply the formatter at the shared `UniversalTestCard` headline boundary so it covers provider profiles, category grids, popular-test grids and every other test-kit card path found in the audit.
3. Keep the original `test_name` everywhere outside card headlines, including detail modals, links, accessibility labels, comparison data, SEO and stored provider records.
4. Replace the duplicate provider-card-only cleaning with the shared formatter to prevent inconsistent behaviour.
5. Add focused unit tests for exact suffixes, mixed casing, trailing spaces and titles that must remain unchanged.
6. Verify representative Goodbody and Medichecks cards in the browser on desktop and mobile, and run the relevant tests and TypeScript check.

## Technical notes
- This is presentation-only; no Supabase rows or scraper output will be changed.
- The fix belongs in the common card renderer because the screenshot’s category cards use `UnifiedTestCard`, which bypasses the existing `ProviderTestCard` cleanup.
