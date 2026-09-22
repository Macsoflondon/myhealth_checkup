# Category accents

## Goal
Give each of the eight navigation categories a distinct, accessible colour and carry that same category identity into every universal test card without changing provider branding.

## Changes
- Update only the eight category colours in the canonical navigation map, keeping all existing icons and the locked brand/clinical/premium tokens unchanged.
- Add one shared category resolver beside that map. It will normalise canonical labels, slugs, and known subcategory labels to their parent navigation category, with General Wellness as the fallback.
- Extend universal card data with the resolved category colour and populate it in all five card adapters. The legacy adapter will honour the colour already supplied by category pages before falling back to the shared resolver.
- Replace the plain category text in the card body with a compact icon-and-label pill using the shared category icon, colour, and 10% tint.
- Preserve the existing provider-colour top stripe exactly.
- Leave unrelated uses of the old green and amber values unchanged; only duplicated category-navigation colour sources will be aligned if found.

## Technical details
- Keep strict TypeScript and avoid a second category-colour source.
- Add focused unit coverage for canonical labels, representative subcategories, fallback behaviour, and all adapter paths.
- Use the existing category navigation hierarchy as the alias source where practical.

## Verification
- Run the TypeScript check and focused unit tests.
- Run the available category-toolbar/category-bar browser test; if the named file is absent, use the repository's equivalent toolbar test and report that clearly.
- Check `/womens-health` and `/at-home-tests` in the browser at desktop and mobile widths, confirming pill/card colour agreement and no overflow.
- Confirm the card’s provider-colour top stripe remains unchanged.
