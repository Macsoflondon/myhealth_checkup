# Fix unreadable text on dark (navy) sections

Text on navy backgrounds is currently rendered at low opacity (`text-white/40` to `text-white/80`) or, in a few places, in navy/slate on navy — so it's effectively invisible. A live contrast audit of the homepage, a category page and `/compare?category=…` confirmed the offenders.

## Confirmed problems

| Where | Text | Current |
|---|---|---|
| Compare/category header | "278 tests in this category" | `text-white/70` |
| Homepage trust bar | "All listed providers meet every one of the following standards" | white at 80% opacity |
| Footer | Copyright line, "Legal Hub" link | `text-white/60` |
| Newsletter block | Sub-headline | `text-white/70` |
| Newsletter block | "We will never share your email…" | `text-white/40` |
| Comparison bar | "Select up to 5 tests to compare…" | slate `#4a5568` on dark |
| Medical disclaimer | "Medical disclaimer:" heading | navy `#081129` on navy |

## What I'll do

1. **Set a readable floor for text on navy.** Body and label text on dark surfaces moves to pearl white or, at minimum, `text-white/85`. De-emphasised microcopy (disclaimers, legal, captions) goes to `text-white/75` — never below. Nothing on navy stays under WCAG AA (4.5:1 for body, 3:1 for large text).
2. **Fix the hardcoded dark-on-dark cases** — the comparison bar copy and the medical disclaimer heading get explicit light colours instead of inheriting slate/navy.
3. **Sweep every dark surface, not just the three pages I audited.** I'll run the same automated contrast pass across the main route set (home, all category pages, compare, compare-by-goal/symptom, provider profiles, biomarker library, find-test, trust centre, legal pages) and fix each failure found.
4. **Keep brand colours intact.** Turquoise `#22c0d4` and pink `#e70d69` accents stay as accents; where pink is used for small body text on navy (it measures ~4.1:1) I'll lighten it slightly for small sizes only, keeping headline accents unchanged.
5. **Re-run the audit after the fixes** and report the remaining count (target: zero failures on dark surfaces).

## Technical notes

- Add semantic tokens in `src/styles.css` for dark-surface text (e.g. `--color-on-dark`, `--color-on-dark-muted`) and use those rather than scattering ad-hoc `text-white/xx` values, so future dark sections inherit the correct contrast.
- Files with known hits: `src/components/layout/Footer.tsx`, `src/components/sections/NewsletterSection.tsx`, `src/components/common/AccreditedProvidersBar.tsx`, `src/pages/CompareTests.tsx`, `src/components/category/CategoryStatusStates.tsx`, `src/components/category/CategoryCompareDrawer.tsx`, plus whatever the full sweep turns up.
- The audit is a throwaway Playwright script under `/tmp` (computed colour vs. resolved ancestor background, alpha-composited); it won't be committed.
