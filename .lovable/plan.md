# Fertility mapping, provider card faces, modal layering (+ press/articles block)

Answering the fertility question first: the Male Fertility page is pulling female tests because the male sub-category filter in `src/config/subcategoryMap.ts` matches on the loose patterns `/male|men/i`. The word "female" contains "male" and "women" contains "men", so every female fertility panel scores as a match. That is the whole cause — it is a filter bug, not bad data. The rows themselves are mapped correctly (`Essentials Male fertility test`, `Ultimate Male Fertility Test`, `INFERTILITY Profile - Male` all sit under `canonical_category = fertility`).

## 1. Fix male/female sub-category matching

- Change the `male-fertility` patterns to word-bounded forms: `/\bmale\b/i`, `/\bmen\b/i`, `/\bmen's\b/i`, plus `sperm`, `semen`, `testosterone`. `\bmale\b` cannot match inside "female"; `\bmen\b` cannot match inside "women".
- Add an explicit exclusion list to the male entries (`female`, `women`, `oestrogen`, `progesterone`, `AMH`, `ovarian`, `menopause`) so a mixed title can never leak in.
- Apply the same word-bounded treatment to the other gendered entries (`mens-health` sub-categories, At-Home "Men's Health Home Kits"), and verify the female entries still exclude male-only panels.
- Add unit tests over the real fertility test names from the catalogue so this regression is caught in CI.

## 2. Provider profile test kits match the test-page style

Provider profile grids (`ProviderTestsGrid`) render `UnifiedTestCard`, which shows the plain product photo. Category test pages render `UniversalTestCard` with `defaultFace="brand"` — the dark branded face with the provider logo and test name, flipping to the detail card on hover. Switch the provider profile grid to the same `UniversalTestCard` with `defaultFace="brand"` (via the existing adapter) so both surfaces look identical, keeping the current ordering (add-ons last), add-on badge, ratings and junk filtering.

## 3. Test detail modal sits under the sticky toolbar

The detail modal renders at `z-50` while the sticky category toolbar sits at `z-[1000]` (and the mobile menu chip at `z-[1200]`), so the toolbar covers the top of the card. Raise the modal overlay and panel above both, and make sure body scroll-lock stays in place while it is open. Verified on the Lola Health "Female Hormones Clarity 31" card.

## 4. Partner press strip + relevant provider articles (previously approved, still to build)

Below the "Find the Right Health Test for You" quiz banner: a static "Our partners have featured in" press-logo row plus three Health Resource Hub articles matched to the page topic (female hormones → oestrogen/menopause/cycle pieces, etc.), built as `CategoryPressAndArticles` and rendered inside `CategoryPageBottom`, with a shared `src/data/pressLogos.ts` and a `topic-relevance` selector with tests.

## Technical notes

- Files: `src/config/subcategoryMap.ts` (+ new test), `src/components/providers/ProviderTestsGrid.tsx`, the detail-modal wrapper in `src/components/cards/UniversalTestCard.tsx`, new `src/components/sections/CategoryPressAndArticles.tsx`, `src/lib/blog/topic-relevance.ts`, `src/data/pressLogos.ts`, `src/components/sections/CategoryPageBottom.tsx`.
- No database or migration work — the catalogue rows are correct.
- `roadmap.md` gets these four items so nothing is dropped.
