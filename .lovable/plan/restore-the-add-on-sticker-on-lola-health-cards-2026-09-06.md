# Restore the "Add-on" sticker on Lola Health cards

## Why it disappeared

The badge was never removed from the card itself — the card still has the amber "Add-on" pill built in. The problem is upstream: when a provider's test is converted into the shape the card reads, the add-on flag is dropped on the floor. So the card asks "is this an add-on?", gets nothing back, and shows no sticker. Same for the short line explaining the add-on rules, which exists in the data ("Add-on biomarker only. Must be purchased with a full blood panel kit.") but is never passed to the card.

The data itself is correct: 74 of Lola Health's 108 live entries are already marked as add-ons, and every one of them already carries its purchase requirement text.

## The fix

1. Carry the add-on flag and the purchase-requirement note through the card conversion steps so they reach the card, everywhere a provider test is rendered — provider pages, category pages, search and at-home listings.
2. The amber "Add-on" pill then shows on both faces of the card (resting image face and hover face), as designed.
3. Show the add-on requirement line on the card's hover face and in the quick-view, so the sticker explains itself rather than just labelling.
4. Keep the ordering rule: add-ons list after the full tests on the Lola Health page, and apply that same ordering to any other listing that mixes both.
5. Add a small automated test that fails if the add-on flag stops reaching the card again, so this cannot silently regress a third time.

## Technical notes

- Root cause: `fromProviderTest`, `fromLegacyUnified`, `fromAtHomeTest` and `fromCategoryTestItem` in `src/lib/universalTestAdapter.ts` never set `is_addon` (or `purchase_notes`) on `UniversalTestData`, while `UniversalTestCard.tsx` renders its badge off `test.is_addon` at two sites.
- Add `is_addon` and `purchase_notes` to `UniversalTestData`, populate in all four adapters, and pass `purchase_notes` through `toUnifiedCardProps` / `LegacyUnifiedProps` where the source row has it (`ProviderTestsGrid` already selects both columns).
- Requirement line rendered in the card's detail face under the title and in `ProviderTestDetailModal` (which already has an add-on block) — no new copy invented, provider/DB text verbatim.
- Ordering: `ProviderTestsGrid` already sorts `is_addon` ascending; mirror in the category and search listings that surface Lola rows.
- Vitest unit test over the adapters asserting the flag and note survive the conversion.
- No schema change, no scraper change, no data edits.
