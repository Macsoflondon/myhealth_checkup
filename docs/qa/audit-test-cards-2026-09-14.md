# Test-card audit — Pass 1

Run via `[AUDIT-LOOP] test-cards`, 2026-09-14. Scope: every surface that renders a test
card or test listing, per `.claude/skills/mhc-audit-loop/references/card-contract.md`.

**This is pass 1, not the whole loop.** The loop exits on two consecutive zero-finding
passes; this pass found and fixed four real defects and surfaced one that needs a human
compliance decision, not a code fix. See "What pass 2 still owes" at the bottom.

## Counts

- Surfaces inventoried: 19 (rebuilt from code, not reused from the contract's example list)
- Checks run this pass: 12 (link-honesty across all surfaces, price-honesty across the
  `toUnifiedCardProps` chain, one accreditation data-coverage query)
- FAIL, fixed: 4
- FAIL, flagged and NOT fixed (compliance decision needed): 1 (2 sub-instances)
- PASS: 7
- UNVERIFIED (tooling): `npm run lint`, `npm test`, `npm run build`, `npm run test:smoke`
  — see "Verification" below
- Drift guards added this pass: 1 script (verified by running it), 1 Vitest file (not
  executed — see below)

## Inventory (rebuilt fresh, per the contract's method)

`UniversalTestCard.tsx` is the actual card; everything else wraps or adapts into it.

| Surface | Wraps | onOpenDetail override? |
|---|---|---|
| `UnifiedTestCard.tsx` | `UniversalTestCard` | never (legacy props dropped) |
| `ProviderTestCard.tsx` | `UniversalTestCard` | passes through caller's `onClick` |
| `MedichecksTestCard.tsx` | `UniversalTestCard` | none |
| `MostPopularTestsSection.tsx` | `UnifiedTestCard` | n/a |
| `HeroPopularTests.tsx` | `UniversalTestCard` directly | none |
| `ClinicTestsSection.tsx` | `UniversalTestCard` directly | none |
| `RecommendationEngine.tsx` | `UniversalTestCard` directly | none |
| `RecommendedTestsCarousel.tsx` | `UnifiedTestCard` | n/a |
| `CompareTests.tsx` | `UnifiedTestCard` | n/a |
| `CategoryPageLayout.tsx` | `UnifiedTestCard` (direct props) | n/a |
| `ProviderTestsGrid.tsx` | `UnifiedTestCard` via `toUnifiedCardProps` | n/a |
| `ProviderTestCatalogPage.tsx` | `ProviderTestCard` | `() => setSelectedTest(test)` (internal modal) |
| `ProviderTestsCatalogPage.tsx` | `ProviderTestCard` | `() => setSelectedTest(test)` (internal modal) |
| `MedichecksTestsCatalogPage.tsx` | `ProviderTestCard` | `() => setSelectedTest(test)` (internal modal) |
| `MedichecksMensHealthPage.tsx` | `MedichecksTestCard` | none |
| `DreamHealthShowcase.tsx` | bespoke grid + filmstrip | grid: internal modal; filmstrip: **was raw external `<a>`, fixed** |
| `GoodbodyTestGallery.tsx` | bespoke modal | internal, clearly-labelled external CTA |
| `TestListCard.tsx` | bespoke | internal `Link` + **mislabelled external button, fixed**; currently unreachable (see below) |
| `ProviderTestDetailModal.tsx` | detail modal, not a card | — |

## Findings

| # | surface | contract rule | verdict | evidence | fix |
|---|---|---|---|---|---|
| 1 | `UniversalTestCard.tsx` (card body click) | primary link must be internal | **PASS** (was FAIL 2026-09-06) | `onClick={handleOpen}` → `setInternalOpen(true)` opens `UniversalTestDetailModal` by default; only overridden by a caller-supplied `onOpenDetail` (traced to every caller — all either omit it or wire it to their own internal modal state, never to `test.url`) | none needed — re-verify only; fixed upstream between 2026-09-06 and 2026-09-14 (141 commits) |
| 2 | `UniversalTestCard.tsx` "Book" button (card face, `handleBook`) | external URL only on explicit, separately-labelled booking action | **PASS** | `aria-label="Book {test_name}"`, visible text "Book"/"Enquire"; `e.stopPropagation()` so it doesn't fight the card's own internal-open click | none |
| 3 | `DreamHealthShowcase.tsx` filmstrip carousel (homepage, live) | as above | **FAIL → FIXED** | `<a href={t.url} target="_blank" rel="noopener noreferrer sponsored">` wrapping a bare product photo, zero visible label, zero indication of an outbound link, on the homepage (`Index.tsx` → `PartnerShowcaseGrid` → `DreamHealthShowcase`) | replaced the `<a>` with `<button onClick={() => setSelectedTest(t)} aria-label="View details for {name}">`, matching the compliant pattern already used one section down in the same file's own grid; same `setSelectedTest`/`ProviderTestDetailModal` wiring, so the "Book" CTA is now reached honestly, one click later |
| 4 | `TestListCard.tsx` "View details" button (booking branch) | CTA label must match destination | **FAIL → FIXED** | button labelled "View details" actually called `buildProviderBookingUrl(test.url, ...)` with `{...externalLinkProps}` (`target="_blank"`) — a details-view label on an outbound booking link | relabelled to `Book with {test.provider}` |
| 5 | `TestListCard.tsx` "View details" button (no-URL branch) | button must do what it says | **FAIL → FIXED** | when `test.url` was falsy the button had `onClick={(e) => e.stopPropagation()}` and no navigation of its own — clicking it did literally nothing, silently eating the click that would otherwise have bubbled to the parent `Link` | removed the dead `stopPropagation`; click now falls through to the card's own internal `Link` |
| 6 | `toUnifiedCardProps` (`src/lib/unifiedCardAdapter.ts`) | missing price must read as missing, never invented | **FAIL → FIXED** | `price: test.price ?? 0` — a genuinely-null price became a literal `0`, and `UniversalTestCard`'s own honest handling (`displayPrice != null ? £X.XX : "POA"`) never got the chance to apply, so it rendered the false claim **"£0.00"**. Live on two real surfaces: `MostPopularTestsSection.tsx` (homepage) and `ProviderTestsGrid.tsx` (provider catalog pages) | changed to `price: test.price ?? null`; widened `UnifiedTestCardProps.price` and `LegacyUnifiedProps.price` from `number` to `number \| null` to let it through; confirmed `fromLegacyUnified`'s `price: p.price` is a bare passthrough (no re-coercion) and `UniversalTestCard`'s `displayPrice != null` check is the only consumer, so no unsafe arithmetic anywhere downstream (checked every `.price.toFixed(` in the repo — none touch this type) |
| 7 | `ProviderTestDetailModal.tsx` `getAccreditations()` | UKAS/CQC/ISO claims must be backed by a real field | **FAIL — flagged, not fixed** | Hardcoded per-provider fallback map (`medichecks: ["UKAS accredited lab", "ISO 15189", "CQC regulated"]`, etc.) used whenever a row's real `lab_ukas_accredited`/`lab_cqc_regulated`/`lab_iso15189` flags are all null. Queried Supabase directly (`clvuioagsgfadynuvodj`, 2026-09-14): **Medichecks — the platform's largest provider, 200/200 active tests — has zero rows with any of the three flags set**, so every accreditation badge shown for a Medichecks test today comes entirely from this hardcoded map, not from verified row data. `goodbody-clinic`, `lola-health`, `london-health-company`, `london-medical-laboratory` are missing UKAS/ISO on all or nearly all rows too (CQC is comparatively well-populated). `clinilabs` (126/127) and `medical-diagnosis` (154/154) are essentially fully backed by real data | **not fixed.** See "Why this wasn't fixed" below |
| 8 | `ProviderTestDetailModal.tsx` `formatTurnaround()` | turnaround must be real or honestly absent | **FAIL — flagged, not fixed** | Same pattern, lower stakes: a hardcoded per-provider turnaround-time map used when `test.turnaround_days_text` and the Goodbody static lookup are both empty. Not queried for coverage this pass — noted for pass 2 | not fixed, same reasoning as #7 |
| 9 | `GoodbodyTestGallery.tsx` modal | external URL clearly labelled | **PASS** | `<a href={bookUrl} target="_blank">Book with Goodbody Clinic →</a>`, plus a separate, honestly-labelled `+ Compare` internal link | none |
| 10 | `MostPopularTestsSection.tsx`, `ProviderTestsGrid.tsx`, `CategoryPageLayout.tsx` `ctaLabel`/`onCtaClick` props | — (dead-code hygiene, not a card-contract rule as written) | **noted, not fixed** | `UnifiedTestCard` (the component) never reads `ctaLabel`/`onCtaClick` — they're accepted for backward-compat typing then silently dropped before reaching `UniversalTestCard`. Not a user-facing bug (the safe internal-modal default applies regardless), but three call sites compute a value that does nothing | left alone this pass — not in scope of the written contract; flagging for a contract-update decision, not silently adding a new rule mid-audit |

## Why finding #7/#8 wasn't fixed

The card contract says a claim with no backing field is a FAIL, and normally the fix is
"show missing as missing." Here that's not obviously correct: `CLAUDE.md`'s own compliance
section says only accredited providers are onboarded to the platform at all, which means
the hardcoded map may well be recording a **true fact that was verified once at provider
onboarding and never migrated into the row-level schema** — not a fabrication. Deleting
the fallback would replace a plausibly-true claim with "not stated" for 200 live Medichecks
tests, which is a worse outcome if the underlying fact is correct, and a compliance
decision either way (per `mhc-skill-os`'s conflict priority, Compliance outranks Product
intent, and this isn't a call to make unilaterally mid-audit).

This is a **blocked** item, not a skipped one. What unblocks it: someone who can confirm
whether Medichecks/Goodbody/Lola/LHC/LML's UKAS/CQC/ISO status is current, then either
backfill `lab_ukas_accredited`/`lab_cqc_regulated`/`lab_iso15189` on the real rows (the
correct fix — makes the fallback map dead code) or explicitly document the fallback map's
provenance so it's a recorded fact rather than an uncited assertion sitting in a modal
component.

## Adversarial review

Tried against the four fixed defects specifically:

- **Null/empty**: price `null` and price `0` are now distinguishable end-to-end
  (`unifiedCardAdapter.price.test.ts` asserts both, plus a real price passing through
  unchanged).
- **SSR**: none of the four fixes touch `window`/`document`/`localStorage` at module or
  render scope — the `<a>`→`<button onClick>` swap and the label/stopPropagation changes
  are pure JSX/event-handler edits.
- **The other callers**: every consumer of `UnifiedTestCard`/`toUnifiedCardProps` was
  traced (5 call sites) to confirm none re-introduces a raw non-null price assumption.
- **Mobile/other surfaces sharing the fix**: `TestListCard` is exported from
  `src/components/compare/index.ts` but — checked via repo-wide grep — has zero current
  importers. The fix still lands (it's live code reachable the moment someone wires it up,
  and leaving a landmine because "nothing uses it today" isn't a real defense), but its
  user-facing impact right now is zero, which is recorded honestly rather than overstated.
- **Tried to defeat the new drift guard**: confirmed via `git show HEAD:<path>` that the
  script's heuristic would have flagged the original `DreamHealthShowcase` bug (no "book"
  word within 25 lines of its `target="_blank"`). It would **not** have caught the
  `TestListCard` mislabelling on its own — the word "book" appears in
  `buildProviderBookingUrl`'s name regardless of what the visible button text says, so a
  mislabelled-but-book-adjacent case can still pass. Documented as a known limitation in
  the script itself, not silently oversold.

## Verification

Ran and passed:
- `node scripts/audit-card-external-links.mjs` (also `npm run audit:card-links`) — 4
  external navigations checked across the 19-surface inventory, 0 unlabelled, exit 0.
- Direct Supabase query against `clvuioagsgfadynuvodj` for finding #7's coverage numbers
  (quoted above).

**UNVERIFIED — could not run in this sandbox**, same constraint as PR #35: `package.json`'s
lockfile pins `qs`/`fast-uri` to a private Lovable artifact-registry mirror this sandbox has
no credentials for, so `npm ci` fails and none of the following ran:
- `npm run lint`
- `npm test -- --run` (includes the new `unifiedCardAdapter.price.test.ts` — written to
  match this repo's existing passing test in `universalTestAdapter.addon.test.ts`
  line-for-line in structure and import style, but not executed)
- `npm run build` (would also run the new `audit-card-external-links.mjs` via `prebuild`
  — that script itself was run and passed standalone, just not through the full chain)
- `npm run test:smoke`

These need a real CI run (or a local machine with registry access) to be verified, not
just source-inspected. Flagging this plainly rather than claiming a pass I didn't observe.

## What pass 2 still owes

This pass focused on link-honesty and price-honesty — the two rule classes the user's
original report pointed at. Not yet audited to the same depth:

- Full biomarker-list availability check (card vs. one-click-away) across all 19 surfaces
- Location-options (`home_kit_available`/`clinic_visit_available`) consistency check
  across at least 3 real tests on every surface, per the contract's "same test, same
  values everywhere" cross-check
- Copy rules (Great British English, no marketing language, plain-English first-use
  explanations) — not reviewed this pass
- `formatTurnaround()`'s data coverage (finding #8) — not queried
- The actual CI run of everything marked UNVERIFIED above
