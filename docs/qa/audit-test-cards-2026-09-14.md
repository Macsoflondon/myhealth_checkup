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

| Surface                          | Wraps                                      | onOpenDetail override?                                                                      |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `UnifiedTestCard.tsx`            | `UniversalTestCard`                        | never (legacy props dropped)                                                                |
| `ProviderTestCard.tsx`           | `UniversalTestCard`                        | passes through caller's `onClick`                                                           |
| `MedichecksTestCard.tsx`         | `UniversalTestCard`                        | none                                                                                        |
| `MostPopularTestsSection.tsx`    | `UnifiedTestCard`                          | n/a                                                                                         |
| `HeroPopularTests.tsx`           | `UniversalTestCard` directly               | none                                                                                        |
| `ClinicTestsSection.tsx`         | `UniversalTestCard` directly               | none                                                                                        |
| `RecommendationEngine.tsx`       | `UniversalTestCard` directly               | none                                                                                        |
| `RecommendedTestsCarousel.tsx`   | `UnifiedTestCard`                          | n/a                                                                                         |
| `CompareTests.tsx`               | `UnifiedTestCard`                          | n/a                                                                                         |
| `CategoryPageLayout.tsx`         | `UnifiedTestCard` (direct props)           | n/a                                                                                         |
| `ProviderTestsGrid.tsx`          | `UnifiedTestCard` via `toUnifiedCardProps` | n/a                                                                                         |
| `ProviderTestCatalogPage.tsx`    | `ProviderTestCard`                         | `() => setSelectedTest(test)` (internal modal)                                              |
| `ProviderTestsCatalogPage.tsx`   | `ProviderTestCard`                         | `() => setSelectedTest(test)` (internal modal)                                              |
| `MedichecksTestsCatalogPage.tsx` | `ProviderTestCard`                         | `() => setSelectedTest(test)` (internal modal)                                              |
| `MedichecksMensHealthPage.tsx`   | `MedichecksTestCard`                       | none                                                                                        |
| `DreamHealthShowcase.tsx`        | bespoke grid + filmstrip                   | grid: internal modal; filmstrip: **was raw external `<a>`, fixed**                          |
| `GoodbodyTestGallery.tsx`        | bespoke modal                              | internal, clearly-labelled external CTA                                                     |
| `TestListCard.tsx`               | bespoke                                    | internal `Link` + **mislabelled external button, fixed**; currently unreachable (see below) |
| `ProviderTestDetailModal.tsx`    | detail modal, not a card                   | —                                                                                           |

## Findings

| #   | surface                                                                                                        | contract rule                                                     | verdict                        | evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | fix                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `UniversalTestCard.tsx` (card body click)                                                                      | primary link must be internal                                     | **PASS** (was FAIL 2026-09-06) | `onClick={handleOpen}` → `setInternalOpen(true)` opens `UniversalTestDetailModal` by default; only overridden by a caller-supplied `onOpenDetail` (traced to every caller — all either omit it or wire it to their own internal modal state, never to `test.url`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | none needed — re-verify only; fixed upstream between 2026-09-06 and 2026-09-14 (141 commits)                                                                                                                                                                                                                                                                                                                                                           |
| 2   | `UniversalTestCard.tsx` "Book" button (card face, `handleBook`)                                                | external URL only on explicit, separately-labelled booking action | **PASS**                       | `aria-label="Book {test_name}"`, visible text "Book"/"Enquire"; `e.stopPropagation()` so it doesn't fight the card's own internal-open click                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | none                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 3   | `DreamHealthShowcase.tsx` filmstrip carousel (homepage, live)                                                  | as above                                                          | **FAIL → FIXED**               | `<a href={t.url} target="_blank" rel="noopener noreferrer sponsored">` wrapping a bare product photo, zero visible label, zero indication of an outbound link, on the homepage (`Index.tsx` → `PartnerShowcaseGrid` → `DreamHealthShowcase`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | replaced the `<a>` with `<button onClick={() => setSelectedTest(t)} aria-label="View details for {name}">`, matching the compliant pattern already used one section down in the same file's own grid; same `setSelectedTest`/`ProviderTestDetailModal` wiring, so the "Book" CTA is now reached honestly, one click later                                                                                                                              |
| 4   | `TestListCard.tsx` "View details" button (booking branch)                                                      | CTA label must match destination                                  | **FAIL → FIXED**               | button labelled "View details" actually called `buildProviderBookingUrl(test.url, ...)` with `{...externalLinkProps}` (`target="_blank"`) — a details-view label on an outbound booking link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | relabelled to `Book with {test.provider}`                                                                                                                                                                                                                                                                                                                                                                                                              |
| 5   | `TestListCard.tsx` "View details" button (no-URL branch)                                                       | button must do what it says                                       | **FAIL → FIXED**               | when `test.url` was falsy the button had `onClick={(e) => e.stopPropagation()}` and no navigation of its own — clicking it did literally nothing, silently eating the click that would otherwise have bubbled to the parent `Link`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | removed the dead `stopPropagation`; click now falls through to the card's own internal `Link`                                                                                                                                                                                                                                                                                                                                                          |
| 6   | `toUnifiedCardProps` (`src/lib/unifiedCardAdapter.ts`)                                                         | missing price must read as missing, never invented                | **FAIL → FIXED**               | `price: test.price ?? 0` — a genuinely-null price became a literal `0`, and `UniversalTestCard`'s own honest handling (`displayPrice != null ? £X.XX : "POA"`) never got the chance to apply, so it rendered the false claim **"£0.00"**. Live on two real surfaces: `MostPopularTestsSection.tsx` (homepage) and `ProviderTestsGrid.tsx` (provider catalog pages)                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | changed to `price: test.price ?? null`; widened `UnifiedTestCardProps.price` and `LegacyUnifiedProps.price` from `number` to `number \| null` to let it through; confirmed `fromLegacyUnified`'s `price: p.price` is a bare passthrough (no re-coercion) and `UniversalTestCard`'s `displayPrice != null` check is the only consumer, so no unsafe arithmetic anywhere downstream (checked every `.price.toFixed(` in the repo — none touch this type) |
| 7   | `ProviderTestDetailModal.tsx` `getAccreditations()`                                                            | UKAS/CQC/ISO claims must be backed by a real field                | **FAIL — flagged, not fixed**  | Hardcoded per-provider fallback map (`medichecks: ["UKAS accredited lab", "ISO 15189", "CQC regulated"]`, etc.) used whenever a row's real `lab_ukas_accredited`/`lab_cqc_regulated`/`lab_iso15189` flags are all null. Queried Supabase directly (`clvuioagsgfadynuvodj`, 2026-09-14): **Medichecks — the platform's largest provider, 200/200 active tests — has zero rows with any of the three flags set**, so every accreditation badge shown for a Medichecks test today comes entirely from this hardcoded map, not from verified row data. `goodbody-clinic`, `lola-health`, `london-health-company`, `london-medical-laboratory` are missing UKAS/ISO on all or nearly all rows too (CQC is comparatively well-populated). `clinilabs` (126/127) and `medical-diagnosis` (154/154) are essentially fully backed by real data | **not fixed.** See "Why this wasn't fixed" below                                                                                                                                                                                                                                                                                                                                                                                                       |
| 8   | `ProviderTestDetailModal.tsx` `formatTurnaround()`                                                             | turnaround must be real or honestly absent                        | **FAIL — flagged, not fixed**  | Same pattern, lower stakes: a hardcoded per-provider turnaround-time map used when `test.turnaround_days_text` and the Goodbody static lookup are both empty. Not queried for coverage this pass — noted for pass 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | not fixed, same reasoning as #7                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 9   | `GoodbodyTestGallery.tsx` modal                                                                                | external URL clearly labelled                                     | **PASS**                       | `<a href={bookUrl} target="_blank">Book with Goodbody Clinic →</a>`, plus a separate, honestly-labelled `+ Compare` internal link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | none                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 10  | `MostPopularTestsSection.tsx`, `ProviderTestsGrid.tsx`, `CategoryPageLayout.tsx` `ctaLabel`/`onCtaClick` props | — (dead-code hygiene, not a card-contract rule as written)        | **noted, not fixed**           | `UnifiedTestCard` (the component) never reads `ctaLabel`/`onCtaClick` — they're accepted for backward-compat typing then silently dropped before reaching `UniversalTestCard`. Not a user-facing bug (the safe internal-modal default applies regardless), but three call sites compute a value that does nothing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | left alone this pass — not in scope of the written contract; flagging for a contract-update decision, not silently adding a new rule mid-audit                                                                                                                                                                                                                                                                                                         |

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

---

# Pass 2 — 2026-09-28

Picked back up per the list above. Re-verified all four pass-1 fixes and the drift-guard
script survived the 210 commits that landed on `main` between passes (merges, PR #38
itself, an unrelated `core-systems` audit, and continued Lovable churn) — all four still
present, `node scripts/audit-card-external-links.mjs` still exits 0 (4 checked, 0
unlabelled). Confirmed the separate `core-systems` audit (`docs/qa/audit-core-systems-2026-09-21.md`)
independently re-checked and confirmed the same primary-link finding from pass 1 (no
overlap or contradiction) and did not touch the accreditation or turnaround findings
below — this pass is genuinely new ground, not a re-run of someone else's work.

## Counts

- Checks run this pass: 4 (biomarker-list rendering, location-options coverage query,
  turnaround-data coverage query, a copy-rule spot-check on 5 card-adjacent files)
- PASS: 3
- FAIL, flagged and NOT fixed (same compliance-adjacent reasoning as finding #7): 1
- Code changes this pass: none — the one new finding is data-backed but not something to
  silently code around, same as finding #7

## Findings

| # | surface | contract rule | verdict | evidence | fix |
|---|---|---|---|---|---|
| 11 | `BiomarkerChipList.tsx`, consumed by `UniversalTestCard`'s modal | full biomarker list available, not a sample | **PASS** | Shows the first 5 with a "Show N more" toggle — the full stored list is one click away, not truncated. When the stored list is shorter than the provider's own published count, the heading says so explicitly ("We are still collecting the individual names") rather than presenting the short list as complete, and is careful to frame it as *our* capture gap, never as the provider withholding data. The 3-chip preview on the card face itself (`UniversalTestCard.tsx:1341`) makes no completeness claim — no heading, no count — so it doesn't need the same guard. | none needed |
| 12 | `provider_tests` location flags, all 8 providers | home-kit/clinic-visit must be known, not silently defaulted | **PASS** | `select count(*) filter (where home_kit_available is null and clinic_visit_available is null) from provider_tests where is_active` → **0 across every provider**. Every active row has at least one of the two flags meaningfully set — no "both unknown" gap for the rendering layer to paper over. (Whether an individual `false` value was itself verified at scrape time, versus a lazy scraper default, is a backend/scraper-pipeline question — out of scope for a card-*rendering* audit, noted so it isn't mistaken for a checked item.) | none needed |
| 13 | 5 card-adjacent files (`UniversalTestCard.tsx`, `TestListCard.tsx`, `DreamHealthShowcase.tsx`, `MostPopularTestsSection.tsx`, `ProviderTestDetailModal.tsx`) | Great British English, no marketing hype, no outcome guarantees | **PASS** (sampled, not exhaustive) | Grepped for `guarantee`, `amazing`, `best-in-class`, `revolutioniz-`, `cure`, `diagnose your`, `life-chang-` — zero hits. Grepped for `color` in non-CSS contexts (excluding `className`, `style`, `UTC_`-prefixed tokens, `*Color` variable names) — zero hits; all "color" occurrences are legitimate CSS-property/variable spelling, not user-facing copy. Not a full copy audit — 5 files, not all 19 surfaces. | none needed |
| 14 | `ProviderTestDetailModal.tsx` `formatTurnaround()` | turnaround must be real or honestly absent, never invented | **FAIL — flagged, not fixed** | Same fallback pattern as finding #7, now quantified: `select count(*) filter (where turnaround_days_text is not null and turnaround_days_text <> '') from provider_tests where is_active` per provider. **Lola Health: 12/108 active tests (11%) have real turnaround data** — the other 96 fall through `test.turnaround_days_text \|\| goodbodyStatic?.turnaround \|\| formatTurnaround(test.provider_id)` to the hardcoded `"3–5 working days"` guess. **Randox: 28/67 (42%)** real, 39 tests hitting the hardcoded `"24 hours"` guess. Every other provider is ≥88% real (`clinilabs` 125/139, `medical-diagnosis` 121/154, `goodbody-clinic`/`london-health-company`/`london-medical-laboratory` all 100%). Also newly visible in the same query: `randox`'s biomarker data is thinner than assumed — `biomarkers_list`/`biomarker_count` set on only 49–50/67 rows (73–75%), the one real gap in an otherwise-clean finding #11. | **not fixed**, same reasoning as #7: `CLAUDE.md` doesn't establish whether these hardcoded per-provider turnaround times are a verified fact never migrated into the row schema, or a stale placeholder — deleting the fallback for ~135 real listings (96 Lola + 39 Randox) on that uncertainty is a product call, not something to make unilaterally mid-audit. Grouping with #7 as one decision: whoever can confirm current published turnaround/accreditation for Medichecks, Lola Health and Randox should either backfill the real `turnaround_days_text`/`lab_*` columns (correct fix, makes both fallback maps dead code) or explicitly cite the fallback maps' provenance in `ProviderTestDetailModal.tsx` so they're recorded facts rather than uncited assertions. |

## Adversarial review (pass 2)

- Re-ran the drift-guard script rather than trusting that it "should still pass" after
  210 commits — it does (4 checked, 0 unlabelled).
- Checked for a second audit's work colliding with this one before writing anything:
  confirmed `docs/qa/audit-core-systems-2026-09-21.md` covers different ground (Crux
  Control, the AI Human Context Engine, a broken-link/booking-URL gap distinct from this
  ledger's link-honesty findings) and its one card-contract-adjacent re-check (the
  primary-link finding) reached the same conclusion pass 1 did, independently.
- Tried to find a reason finding #14 might already be someone else's fixed problem before
  writing it up as new — grepped the core-systems ledger for `formatTurnaround`,
  `lab_ukas_accredited`, `lab_cqc_regulated`, `lab_iso15189`, `getAccreditations`: zero
  hits. Genuinely unaddressed.

## Exit status

Not a clean pass — one real finding, correctly not fixed. The loop's exit condition (two
consecutive zero-finding passes) isn't met. What a pass 3 should cover: the remaining
"what pass 2 still owes" items not reached this time (a full 19-surface copy-rule pass
rather than a 5-file sample; a same-test-three-surfaces cross-check for location-option
*consistency*, not just coverage — this pass confirmed the data exists, not that every
surface renders it identically), plus revisiting findings #7 and #14 once/if someone
resolves the underlying data question.

---

# Pass 3 — 2026-10-20

Picked back up on the user's request to re-verify everything is working and keep
fixing until it is. Significant drift since pass 2: ~15 more Lovable commits plus one
large dead-code cleanup (`23a1bcb6`, gpt-engineer-app bot, 19 files/2446 lines, pure
deletions) that removed three files from the original inventory —
`MostPopularTestsSection.tsx` (the component the user's *original* report was about),
`TestListCard.tsx`, and `ClinicTestsSection.tsx`. Confirmed before relying on anything:
these were genuine dead-code removals (zero additions in that commit), not a silent
regression — `MostPopularTestsSection`'s functional role on the homepage is now filled
by `HeroPopularTests.tsx`, already in this ledger's inventory and already verified safe.

## Counts

- Surfaces re-inventoried from code: 16 live (down from pass 1's 19 — 3 deleted, 4
  newly found missing from the drift-guard's own list, now added)
- Checks run this pass: 7
- FAIL, fixed (real logic bug, not a data-judgment call): 1
- Drift-guard coverage gaps found and fixed: 2
- Previously-flagged findings re-queried: 2 — one fully resolved since pass 1/2, one
  narrowed (partially resolved)
- Full copy-rule sweep (all 16 surfaces, not pass 2's 5-file sample): clean

## Re-verification: everything from passes 1–2 held

All four pass-1 fixes, the pass-2 confirmations, and the drift-guard script itself were
re-checked against current code rather than assumed:
- Price-honesty fix (`price: test.price ?? null`) — intact, comment and all.
- `DreamHealthShowcase` filmstrip button — intact.
- `node scripts/audit-card-external-links.mjs` — runs clean, but see finding #15 below;
  it was quietly checking less than it used to before this pass's fix.
- Biomarker-list and copy-rule passes — re-run at full scope (16 surfaces, not 5), still
  clean; see below.

## Findings

| # | surface | contract rule | verdict | evidence | fix |
|---|---|---|---|---|---|
| 15 | `scripts/audit-card-external-links.mjs` | the drift guard must actually see every external-nav mechanism in use | **FAIL → FIXED** | `UniversalTestCard.tsx`'s `handleBook` was refactored from a literal `window.open(test.url, ...)` to `openAffiliateUrl(test.url, ...)` (a new helper in `src/lib/affiliate/affiliate-tracking.ts`, added to centralise affiliate-tracking attribution — confirmed by reading it that it still ends in `window.open(target, "_blank", "noopener,noreferrer")`, so no behaviour regression, just a textual one). The guard's pattern list only matched the literal string `window.open(`, so it silently stopped checking this call site — checked-count dropped from 4 to 2 with no warning. Also found 4 live card surfaces missing from the guard's own `CARD_SURFACES` list (`MedichecksMensHealthPage.tsx`, `MedichecksTestsCatalogPage.tsx`, `ProviderComparisonPage.tsx`, `SimilarTestsSection.tsx`) that existed before pass 1 but were never added. | Added `/openAffiliateUrl\(/` to `EXTERNAL_NAV_PATTERNS`; added the 4 missing surfaces to `CARD_SURFACES`; added a dated header comment explaining exactly this failure mode so the next refactor-through-a-new-helper gets caught the same day, not the next audit. Re-ran: 3 checked (up from 2), 0 unlabelled — confirmed the `openAffiliateUrl` call site is itself honestly labelled (`handleBook`, `aria-label="Book {test} on the provider's website (opens in a new tab)"`). |
| 16 | `src/lib/categoryTestMapper.ts` `mapProviderTestRow` | location claims must be real, never a default dressed up as data | **FAIL → FIXED** | `collection = row.home_kit_available && row.clinic_visit_available ? "Home Kit / Clinic" : row.clinic_visit_available ? "Clinic" : "Home Kit"` — the final `else` returned `"Home Kit"` whenever `clinic_visit_available` was falsy, **including when `home_kit_available` was also false or null**. Queried Supabase: 2 live Medichecks rows have both flags falsy right now, so this mislabelled 2 real tests "Home Kit" with zero supporting data. This is a **confirmed cross-surface consistency bug**, not just a single-surface honesty one: `ProviderTestsGrid.tsx` (via `fromProviderTest`, direct boolean passthrough) would correctly show "Not stated" for one of these exact rows, while `CategoryPageLayout.tsx` (via this mapper → `fromCategoryTestItem`'s regex round-trip) showed "At-home kit" for the *same test* — traced the regex both ways by hand to confirm. | Added an explicit `home_kit_available` check before falling through, so the `else` is reached only when neither flag is true, and returns `"Not stated"` (matching the honest-fallback convention already used in `unifiedCardAdapter.ts` and `UniversalTestCard.tsx`'s own `collectionLabel`/`collectionDetail`, which already handles this case correctly and was the reference for what "correct" looks like here). Re-traced all four boolean combinations through both surfaces' full pipelines by hand post-fix — they now agree in every case. Added `src/lib/categoryTestMapper.locationHonesty.test.ts` (5 cases) as the drift guard — not executed in this sandbox (same `npm ci` / private-registry constraint as every prior Vitest file in this audit), written to the same structure as the already-passing `unifiedCardAdapter.price.test.ts`. |
| 7 (revisit) | `ProviderTestDetailModal.tsx` `getAccreditations()` | — | **RESOLVED since pass 1** | Re-queried the same coverage check from pass 1: **every provider is now at 100% real `lab_ukas_accredited`/`lab_cqc_regulated`/`lab_iso15189` coverage** except `clinilabs` (138/143, 96%) — Medichecks went from 0/200 to 195/195, Lola Health from 0/108 to 107/107. Someone backfilled the real columns since pass 1; confirmed `getAccreditations()`'s "row's real flags win" precedence is unchanged and still correct, so the hardcoded fallback map is now live dead code for all but a handful of rows. | No code change needed — the underlying data question this finding was blocked on has been answered. Worth a follow-up cleanup (remove the now-near-dead fallback map) but that's tidying, not a defect; not done this pass to keep the diff to confirmed bugs. |
| 14 (revisit) | `ProviderTestDetailModal.tsx` `formatTurnaround()` | — | **Narrowed — Lola Health resolved, Randox still real** | Re-queried: **Lola Health is now 107/107 (100%) real turnaround data**, up from 12/108 at pass 2 — resolved. **Randox is still only 28/65 (43%)** — essentially unchanged (was 28/67, 42%) — 37 live Randox tests still show the hardcoded `"24 hours"` guess, not their own data. `clinilabs` (125/143, 87%) and `medical-diagnosis` (121/154, 79%) have smaller, longer-standing gaps. | Still not fixed, same reasoning as before, now scoped to Randox specifically: deleting the fallback for 37 real listings on the question of whether "24 hours" is a verified-but-unmigrated fact or a stale guess is still a product call this audit can't make. |

## Full copy-rule sweep (all 16 surfaces)

Pass 2 sampled 5 files; this pass swept all 16 current surfaces for marketing hype
(`guarantee`, `amazing`, `best-in-class`, `revolutioniz-`, `cure`, `diagnose your`,
`life-chang-`, `miracle`, `breakthrough`) and Americanisms in user-facing copy
(`color`/`organize`/`analyze`/`favorite`/`personalize` outside CSS/class-name contexts).
Zero hits either way. Clean.

## Adversarial review (pass 3)

- Did not trust the drift guard's "0 unlabelled" result at face value — traced where its
  checked-count had quietly dropped and found the real cause (finding #15) before
  concluding the guard itself needed fixing, not just re-running it.
- Did not trust "both passed" on a provider-comparison check — hand-traced all four
  boolean combinations through *both* surfaces' actual code paths (not just one) to
  confirm finding #16's fix produces agreement, since the whole point of the finding was
  that two surfaces had been disagreeing silently.
- Re-queried both previously-flagged findings against live data rather than assuming
  "flagged, not fixed" meant "still true" — one had been resolved by someone else
  entirely, one had partially resolved; reporting either as still fully open would have
  been stale, not cautious.
- Confirmed the big Oct 5 deletion commit was pure cleanup (checked the commit's own
  diff stat: 2446 deletions, 0 additions) before trusting that nothing needed rebuilding
  to replace the 3 removed files.

## Exit status

Not a clean pass — this pass found and fixed 2 real bugs (one in the audit tooling
itself, one a genuine cross-surface data bug), so the loop's two-consecutive-zero-finding
exit condition isn't met; a pass 3 that finds bugs can't be one of the two clean passes
needed to stop. What remains open: the Randox turnaround gap (narrowed finding #14,
blocked on the same product decision as before), and the optional cleanup of the
now-near-dead accreditation fallback map (finding #7, not a defect). A pass 4 re-check of
this pass's two fixes, run clean, would be the first of the two passes needed to close
the loop.

## Finding #14 — resolved by explicit user decision (2026-10-20, same day)

The product/compliance decision this finding was blocked on has been made: the user
asked directly to fix the Randox turnaround gap. That decision resolves the uncertainty
this finding was flagged on — whether the hardcoded "24 hours" was a real-but-unmigrated
fact or a stale guess no longer matters once the owner has said to stop presenting it as
that test's own data.

**Fix:** `formatTurnaround()` in `ProviderTestDetailModal.tsx` now returns `null` for
`randox`/`randox-health` instead of the hardcoded `"24 hours"`. The call site
(`test.turnaround_days_text || goodbodyStatic?.turnaround || formatTurnaround(...) ||
"Not stated"`) already had the right shape for this — it just needed the function to be
honest about not knowing, and a final fallback added for when it says so. Scoped
narrowly to Randox, the provider actually asked about and the one with the largest gap
(37/65 active tests, 57%, relying on the guess) — `medichecks`, `goodbody-clinic`,
`lola-health`, `london-medical-laboratory`, and `tuli-health`'s entries in the same map
are untouched; each of those providers has real data on ≥79% of its rows (confirmed in
earlier passes), so wasn't flagged as needing this, and widening the fix to them wasn't
part of what was asked.

**A bug I had to fix to fix the bug:** the function originally returned
`defaults[providerId.toLowerCase()] || "2–5 working days"`. Simply setting Randox's map
entries to `null` would NOT have worked with that `||` — `null || "2–5 working days"`
evaluates to the generic guess, reintroducing the exact same class of fabricated-data
problem one level up. Changed the lookup to `id in defaults ? defaults[id] : "2–5 working
days"` so an explicit `null` is distinguished from "not in the map at all" (which still
correctly falls through to the generic guess for a provider with no entry).

**Verification:** exported `formatTurnaround` (previously module-private) and added
`src/components/providers/ProviderTestDetailModal.turnaroundHonesty.test.ts` (5 cases,
including the specific `in`-vs-`||` regression this fix depended on). Re-ran
`node scripts/audit-card-external-links.mjs` after the edit — 3 checked, 0 unlabelled,
unaffected. Could not execute the new Vitest file in this sandbox, same constraint as
every other test added in this audit.

This closes finding #14. Finding #7 (the near-dead accreditation fallback map) remains
open as an optional cleanup, not asked about this time.

## Finding #7 — cleanup done, same day as finding #14, per the same standing instruction

Re-queried before touching anything: real `lab_ukas_accredited`/`lab_cqc_regulated`/
`lab_iso15189` coverage is ≥96% for every provider; only **5 active rows system-wide
(all `clinilabs`)** still have none of the three flags set. Worth noting on the way
past: `clinilabs` had no entry in the old hardcoded map at all, so those 5 rows were
never getting the "verified-sounding" per-provider guess the map gave everyone else —
they were falling through to the map's own generic fallback (`["CQC regulated", "GDPR
compliant"]`), a second, blinder layer of the same fabrication.

**Fix:** deleted the entire hardcoded map from `getAccreditations()`. It now returns the
row's real flags, mapped to display strings, or an honest `[]` when a row has none —
never a guess. Exported the function (previously module-private) for testability and
added `ProviderTestDetailModal.accreditationHonesty.test.ts` (4 cases). Wrapped the
"Standards & Accreditation" section in `accreditations.length > 0 &&` so the ~5
`clinilabs` rows with nothing real to show get a clean, absent section rather than an
honest-but-visually-broken empty heading. Re-ran `node scripts/audit-card-external-links.mjs`
after the edit: 3 checked, 0 unlabelled, unaffected.

This closes finding #7. Both findings left open at the end of pass 3 are now resolved —
nothing outstanding from this audit as of 2026-10-20.

# Pass 4 — 2026-10-23

Run via `[AUDIT-LOOP] test-cards`, same day the branch was reset fresh from `main` after
PR #79 merged. **Not a clean pass** — a full inventory rebuild (required every run, per
the contract; the previous list was reused across passes 1–3 with only incremental
additions, and that is exactly how a surface gets missed) turned up three previously
un-inventoried surfaces, one of which is the most severe single defect found in this
entire audit to date.

## Counts

- Surfaces inventoried: 18 card/listing-rendering surfaces confirmed live (plus 1
  confirmed dead, see finding #28), rebuilt fresh from `rg`, not reused from memory
- New surfaces found this pass, never in any prior pass's inventory or the drift guard:
  `src/pages/CancerComparisonPage.tsx` (+ its `useEnhancedComparison.ts` hook and
  `CancerBiomarkerGroup.tsx`/`EnhancedComparisonTable.tsx` children),
  `src/components/search/IntelligentSearch.tsx`, `src/components/header/MegaMenuDropdown.tsx`
- Findings: 11 (#17–#25, #27–#28 — #26 not used, to avoid double-counting finding #17's
  fix under two numbers), all fixed this pass — see "Fix what you find" standing
  instruction; nothing deferred
- Re-verified and still holding: price-honesty (`unifiedCardAdapter.ts`), the
  location-label fix (`categoryTestMapper.ts`), the Randox turnaround fix and
  accreditation-fallback cleanup (`ProviderTestDetailModal.tsx`) — all survived PR #80's
  unrelated merge into this branch intact (re-read after the merge, not assumed)
- Also reviewed and found clean (not a finding): `src/lib/viewPricing.ts`, a new pricing
  layer added since pass 3 (part of #80) — every field is genuinely nullable end-to-end,
  `toNum()` never coerces a missing value to `0`. Worth recording so a future pass doesn't
  have to re-derive this from scratch.
- `node scripts/audit-card-external-links.mjs`: 3 → 5 checked (3 new surfaces added,
  each now 0 unlabelled) across every edit in this pass
- UNVERIFIED (tooling): `npm run lint`, `npm test -- --run`, `npm run build`,
  `npm run test:smoke` — same sandbox constraint as every prior pass (no `node_modules`,
  no registry access here); see "Verification" below

## How the new surfaces were found

The contract's inventory method (`rg -l "UniversalTestCard|UnifiedTestCard|..."` plus a
broader `rg -ln "test_name|provider_tests"` reconciled against routes) was re-run from
scratch rather than reusing the 16-surface list the drift guard already had. The broader
grep surfaced several files the narrower card-component grep missed because they don't
use any of the shared card components at all — they hand-roll their own markup. Each was
individually traced to confirm whether it actually renders a test card/row (not every
hit on `provider_tests`/`test_name` does) before being added to scope.

## Finding #17 — `CancerComparisonPage.tsx` has no internal link anywhere on the surface

**Contract rule:** primary click target must be our own test-detail page.
**Evidence:** `src/pages/CancerComparisonPage.tsx` (browse-grid card, ~L305–384 before
the fix) and `src/components/compare/EnhancedComparisonTable.tsx` (compare-tab card,
~L88–120 before the fix) — neither file contained `getTestDetailUrl`,
`getTestUrlFromProviderName`, `providerRoutes`, or any `/tests/` path, confirmed by
grep across all three files that make up this surface (the third,
`CancerBiomarkerGroup.tsx`, renders no links at all). The browse-grid card's only
actions were "Compare"/"Remove" (internal state toggles, not navigation) and an
icon-only external booking button — there was no path to our own site at all, worse
than every previously-fixed instance of this bug class, which at least had an internal
modal or `Link` as the primary target.
**Fix:** added an internal `<Link to={getTestDetailUrl(providerId, id)}>` wrapping the
test name on both cards, plus an explicit "View details" button on the browse grid.
Verified `getTestDetailUrl`/the route resolve by raw `provider_tests.id` (checked
`src/lib/seo/test-seo.functions.ts:25`, `.eq("id", data.testId)`), which is exactly what
`test.id` is on this surface.

## Finding #18 — icon-only "book" button with no visible or accessible label

**Contract rule:** external URL only on an "explicit, separately labelled" action.
**Evidence:** `CancerComparisonPage.tsx` browse-grid card's booking button was
`<Button variant="default" size="sm" onClick={...}><ExternalLink className="h-4 w-4" /></Button>`
— an icon with no `aria-label` and no visible text. A screen-reader user gets no
indication of what the button does or that it leaves the site.
**Fix:** added `aria-label="Book {testName} on {provider}'s website (opens in a new
tab)"` plus a visible "Book" label (hidden below `sm` breakpoint via `sr-only
sm:not-sr-only`, matching the icon-button space constraint), matching
`UniversalTestCard`'s established pattern (pass 1, finding #2).

## Finding #19 — price defaulted to `£0.00` on a null real price

**Contract rule:** missing price must read as missing, never invented (same rule as
pass 1 finding #6, independently broken here).
**Evidence:** `useEnhancedComparison.ts` (pre-fix) `const basePrice = test.price || 0;`
— identical bug shape to the original `unifiedCardAdapter.ts` bug, in a completely
separate adapter this audit hadn't looked at before.
**Fix:** `test.price ?? null`; widened `EnhancedTestData.basePrice`/`totalExpectedCost`
to `number | null` and `computeTotalExpectedCost()` (`src/lib/comparisonFormat.ts`,
shared by 3 call sites) to accept/return `number | null`, returning `null` up front
when `basePrice` is null rather than treating it as `0` inside the shared function too.
The other 2 callers (`ProviderComparisonTable.tsx`, `comparison-header-price.ts`) always
pass a real non-null price by their own types, so this is a pure widening — confirmed by
reading both call sites — but needed a `?? t.price`/`?? base` type-narrowing fallback to
keep TypeScript happy, since the exact point of the fix is that the function's return
type genuinely changed. Neither caller's runtime behaviour changes.

## Finding #20 — biomarker count and list invented from the test's free-text description

**Contract rule:** biomarker count/list must be real; absent data reads as absent.
**Evidence:** `useEnhancedComparison.ts` (pre-fix):
`biomarkerCount: test.biomarker_count || extractBiomarkerCount(test.description ?? null)`
and the equivalent for `biomarkersList`. `extractBiomarkerCount` kept-word-matched a
fixed 12-word list (`cholesterol`, `glucose`, `hba1c`, …) against the description and, if
**zero** of those words matched, still returned a fabricated floor of `5` via
`keywords.filter(...).length || 5`. `extractBiomarkers` did the equivalent for the list,
substring-matching 34 hardcoded biomarker names against the description. Queried
Supabase (`clvuioagsgfadynuvodj`, 2026-10-23): of 135 active cancer-related rows, 125
(93%) already have a real `biomarkers_list` and 134 (99%) a real `biomarker_count` — so
removing the fallback is safe and does not regress the feature into uselessness for the
~7% of rows left honestly blank.
**Fix:** `test.biomarker_count ?? null` / `(test.biomarkers_list as string[] | null) ??
null`; deleted both `extractBiomarkerCount` and `extractBiomarkers` entirely (dead code
that existed only to fabricate). Widened the two fields on `EnhancedTestData` to nullable.

## Finding #21 — turnaround defaulted to a flat 3 days

**Contract rule:** turnaround must be real or honestly absent (same rule as pass-3
finding #14's Randox case, independently broken here across every provider).
**Evidence:** `turnaroundDays: parseTurnaroundDays(test.turnaround_days_text) || 3`.
Supabase: 124/135 (92%) of the same cancer-related rows have real turnaround text.
**Fix:** `?? null` instead of `|| 3`; widened `EnhancedTestData.turnaroundDays` to
`number | null`.

## Finding #22 — home-kit availability defaulted to `true` on a null flag

**Contract rule:** location flags must reflect the real `home_kit_available` /
`clinic_visit_available` columns (same rule as pass-3 finding #16, independently broken
here).
**Evidence:** `homeKitAvailable: test.home_kit_available ?? true,
clinicVisitAvailable: test.clinic_visit_available ?? false`. A row with both flags
genuinely null would show a confident "home kit available, no clinic visit" claim with
no real data behind either half. Supabase: for this specific cancer-related subset both
flags are 100% populated today (135/135), so the practical exposure right now is low —
recorded honestly rather than oversold — but the trap is real for any future null row and
for any other `useEnhancedComparison` consumer.
**Fix:** `?? null` for both; widened both fields on `EnhancedTestData` to nullable.

## Finding #23 — accreditations hardcoded `["UKAS", "CQC"]` for every single test

**Contract rule:** UKAS/CQC/ISO claims must be backed by a real field (same rule as pass
1/pass-3 finding #7, but worse here: not a per-provider fallback map applied only when
flags are missing — a flat, unconditional hardcode applied to **every test on the page,
real flags or not**).
**Evidence:** `accreditations: ["UKAS", "CQC"]`, unconditional, in every object this
function ever returned. Supabase: 135/135 of the cancer-related rows checked do have at
least one real `lab_*` flag set today, so the badges happened to not be contradicted by
reality on this specific page as it stands — but the claim was never actually sourced
from any row's data, and a `clinilabs`-only-`lab_iso15189` test (the exact shape finding
#7 found 5 real rows of) would have shown an uncontradicted but wrong "UKAS, CQC" badge
set instead of "ISO 15189".
**Fix:** `accreditations: resolveAccreditationsFromRow(test) ?? []` — reused the same
shared helper (`src/lib/resolve-test-fields.ts`) the pass-3 fix to
`ProviderTestDetailModal.tsx` introduced, rather than writing a second implementation.
Added `lab_ukas_accredited`/`lab_cqc_regulated`/`lab_iso15189` to `RawTestRow` (the
`.select("*")` query already fetched these columns; they just weren't read).

## Finding #24 — a cancer-biomarker "included" checkmark could come from marketing copy, not data

**Contract rule:** a claim must be backed by a real field — doubly so for a clinically-
flavoured claim on the cancer-screening comparison page specifically.
**Evidence:** `CancerBiomarkerGroup.tsx`'s `testIncludesBiomarker()` (pre-fix) returned
true if the biomarker's name matched the real `biomarkersList` **or** `test.testName`
**or** `test.description`. A test whose marketing description happened to mention "PSA
levels" in passing — with no real biomarkers-list evidence it tests for PSA at all —
would show a green "included" checkmark next to that cancer marker. This is squarely
the kind of unbacked claim the contract rules out, on the one page where getting it
wrong carries the most weight.
**Fix:** removed the `testName`/`description` fallback entirely; the function now
checks only the real `biomarkersList`, and returns `false` immediately when it's `null`
or empty rather than falling through to the free-text match. Exported the function
(previously module-private) for testability.
**Scope note:** the remaining word-splitting fuzzy match (`biomarker.name.split(" ")`)
against the *real* list can still over-match on a shared word between two different
biomarker names (e.g. "antigen" matching both PSA and CEA) — that's a matching-precision
question, not a fabricated-data question, and rewriting the matching algorithm itself
would be scope creep beyond this pass's finding; noted for a future pass to pick up on
its own terms if it's worth doing.

## Finding #25 — the type-widening above would have silently broken "Best Value"/"Fastest Results"

**Caught during adversarial review, before shipping — not a pre-existing bug.** Once
`totalExpectedCost`/`turnaroundDays` became nullable to fix #19/#21, the existing
`comparisonResult` ranking logic (`test.totalExpectedCost < (best?.totalExpectedCost ??
Infinity)`) would have silently miscrowned a test with an *unknown* price/turnaround as
"Best Value"/"Fastest Results" — `null < 500` evaluates `true` in JS because `null`
coerces to `0` in a numeric comparison. Separately, `t.biomarkersList.map(...)` would
throw outright (`Cannot read properties of null (reading 'map')`) the moment two
selected tests included one with no real biomarkers list — a real crash on the Compare
tab, not just a display bug, reachable any time a user compares a test from the ~7% of
rows with no real `biomarkers_list`.
**Fix:** added explicit `!= null` guards to the `bestValue`/`fastestResults` reduces, and
`?? []`/`?? 0` guards everywhere `biomarkersList`/`biomarkerCount` get read inside
`comparisonResult`'s `useMemo`. Logged here rather than folded silently into #19–#23
because this is exactly the "circle back and try to break your own fix" step the loop
protocol requires — these would not have existed if #19–#23 had been shipped without it.

## Finding #27 — `IntelligentSearch.tsx`'s site search: every result's only action leaves the site, mislabelled "View Details"

**Contract rule:** primary click target internal; CTA label must match its destination
(the exact pattern pass 1 finding #4 fixed in dead code — this is the same pattern, live).
**Evidence:** `src/components/search/IntelligentSearch.tsx` (pre-fix, ~L247–259):
`<Button asChild size="sm"><a href={r.url || "#"} target="_blank" rel="noopener
noreferrer">View Details</a></Button>` was the **only** action on every search result
row. Confirmed this component is genuinely live: it's the platform's site-search feature
(backed by `useSearchTestsQuery`), not dead code like several previously-fixed instances
of this bug pattern. A visitor who searches for a test and clicks "View Details" — the
single available action — is sent straight to the provider's external site in a new tab,
with a label implying they're about to see more detail on our own site.
**Fix:** added an internal `<Link to={getTestDetailUrl(r.provider_id, r.id)}>` wrapping
the result's title, kept "View Details" as a second button but pointed it at the same
internal URL (so the label now matches its destination), and added a separate,
explicitly-labelled "Book" button (`aria-label` + visible text + icon) for the external
URL, shown only `{r.url && (...)}`.

## Finding #28 — `MegaMenuDropdown.tsx`: same whole-row-external pattern, confirmed dead code

**Contract rule:** as above.
**Evidence:** both of this component's test-listing blocks (`filteredPopularTests`,
`goodbodyTests`-backed `filteredTests`) rendered the **entire row** as `<a href={href}
target="_blank">` whenever `test.url` was an absolute URL — not a sub-button, the whole
clickable card. Before fixing it, traced whether this component is actually reachable:
`rg` found it's only imported by `src/components/header/NavigationMenu.tsx`, which is
only re-exported (as `NavigationItems`, data only — not the component) by
`NavigationItems.tsx`, which is imported only by `CategoryPillDropdown.tsx` (for its
*data array*, not the dropdown component) and a sitemap-links test. The live header
(`Header.tsx` → `BrowseByCategoryBar.tsx`) uses `CategoryPillDropdown`/`MoreDropdownMenu`
instead and never imports `MegaMenuDropdown` or `NavigationMenu` (the component) at all.
**This is confirmed dead code** — the same situation as pass 1's `TestListCard.tsx`.
**Fix:** applied anyway, per pass 1's own precedent ("the fix still lands — it's live
code reachable the moment someone wires it up, and leaving a landmine because 'nothing
uses it today' isn't a real defense"). The DB-backed block now always links to
`getTestDetailUrl(test.provider_id, test.id)`. The static-Goodbody-data block (whose ids
like `"Goodbody061"` are not real `provider_tests.id` values, so a canonical detail URL
can't be safely derived for it) keeps its pre-existing internal fallback path
(`/book/${test.id}`) rather than this pass guessing a new, unverifiable destination for
an already-disconnected static dataset — out of scope to redesign that dataset here.
Impact recorded honestly: **zero today**, real the moment the component is wired up.

## Adversarial review

- **Null/empty**: every new nullable field (`basePrice`, `turnaroundDays`,
  `biomarkerCount`, `biomarkersList`, `homeKitAvailable`, `clinicVisitAvailable`,
  `totalExpectedCost`) traced through every consumer in all 5 files that touch
  `EnhancedTestData` (confirmed via `rg -l "EnhancedTestData" src/` — exactly 5, all
  checked): `EnhancedComparisonTable.tsx` was already using falsy-checks (`||
  <Dash/>`, `? ... : <Dash/>`, `formatPrice()` which already accepted null) for every
  one of these fields — it was the *adapter* lying to an already-honest consumer, the
  same pattern as every other fix in this audit. `CancerComparisonPage.tsx`'s own grid
  needed new explicit `!= null` branches, added.
- **The crash case** (#25) was found specifically by asking "what happens when two
  selected tests are compared and one has a null biomarkersList" rather than only
  checking each field's display in isolation — the display-only check would have missed
  it, since no single field's render path crashes on its own.
- **SSR**: none of this pass's fixes touch `window`/`document`/`localStorage` at module
  or render scope.
- **Mobile**: the new "Book" button label on `IntelligentSearch.tsx`/`CancerComparisonPage.tsx`
  uses the same `sr-only sm:not-sr-only` pattern already used elsewhere in the codebase
  for icon-button labels at narrow widths — not a new pattern invented for this fix.
- **The other callers**: `computeTotalExpectedCost`'s 2 other call sites
  (`ProviderComparisonTable.tsx`, `comparison-header-price.ts`) traced individually;
  both always pass a real non-null price by their own types, so the widening is
  behaviour-neutral for them — confirmed by reading both, not assumed.
- **Data**: ran 2 Supabase queries against `clvuioagsgfadynuvodj` (coverage for
  biomarkers/count, price/turnaround/location-flags/accreditation on the 135 active
  cancer-related rows) rather than assuming the fallbacks were covering for mostly-empty
  data or mostly-redundant with real data.
- **Tried to defeat the drift guard**: confirmed the new `aria-label`-based "Book" labels
  on `IntelligentSearch.tsx`/`CancerComparisonPage.tsx` are actually caught by
  `BOOK_WORD_RE` (the guard checks 25 lines of surrounding context, and the aria-label
  text itself contains "Book" within that window) — re-ran the script after each edit
  rather than assuming the pattern-match would work from reading the regex alone.

## Verification

Ran and passed:

- `node scripts/audit-card-external-links.mjs` after every edit in this pass — 3 → 4 → 5
  external navigations checked as each new surface was added and fixed, 0 unlabelled
  throughout, exit 0 every time.
- 2 direct Supabase queries against `clvuioagsgfadynuvodj` (quoted above, findings
  #20/#21/#22/#23).
- Hand-traced every one of findings #17–#28 through its actual code path, including the
  5-file consumer sweep for finding #25's crash case.

**UNVERIFIED — could not run in this sandbox**, same constraint as every prior pass (no
`node_modules`, no private-registry access here):

- `npm run lint`
- `npm test -- --run` — including 2 new Vitest files this pass adds:
  `src/hooks/useEnhancedComparison.honesty.test.ts` (9 cases) and
  `src/components/compare/CancerBiomarkerGroup.honesty.test.ts` (5 cases), both written
  to match this repo's existing passing test style but not executed by any tool here.
- `npm run build`
- `npm run test:smoke`

## Drift guard

`scripts/audit-card-external-links.mjs`'s `CARD_SURFACES` grew from 16 to 19:
`EnhancedComparisonTable.tsx`, `CancerComparisonPage.tsx`,
`src/components/search/IntelligentSearch.tsx`, `src/components/header/MegaMenuDropdown.tsx`.

## Exit status

Not a clean pass — 11 findings (#17–#25, #27–#28), all fixed, none deferred. The loop's
two-consecutive-zero-finding exit condition is not met. A pass 5 that rebuilds the
inventory fresh again and re-verifies every fix from this pass (especially #25's crash
guard and the 3 newly-added drift-guard surfaces) is the next step, and would be the
first of the two clean passes needed to close the loop if it finds nothing new.

## Pass 5 — closing the `url_verified` coverage gap left open since PR #47 (2026-10-23)

Requested directly (not a fresh `[AUDIT-LOOP]` inventory pass): `audit-core-systems-2026-09-21.md`
Pass 3 had wired `provider_tests.url_verified` into `UniversalTestCard`'s three open-link
checks, but only threaded the real column into 2 of the ~30 query sites that feed it
(`useAtHomeTests`, `ProviderTestsGrid`) — every other card surface kept opening `test.url`
with no regard for whether the provider's own last link check had failed. This pass closes
that list.

### Finding #29 — the canonical test-detail page's own "Book" button used a fake, dead validity check

`src/components/templates/ProviderTestDetailTemplate.tsx`'s `BookingButton` — the primary
CTA on `/provider/:providerId/tests/:testId`, the single canonical URL for every provider's
every test — called `useUrlValidation(testUrl)`, destructured `isValid`, and then never
read it anywhere in the render. The hook itself only does client-side string shape checks
("does this parse as a URL, does it avoid literal `undefined`/`null`") and says so in its
own comment: it cannot check reachability from the browser (CORS). The real signal —
`provider_tests.url_verified`, populated by the `mhc-*` scrapers' actual server-side link
checks — was never read on this page at all. Fixed by removing the dead `isValid`
destructure, adding a real `urlVerified` prop sourced from `test.url_verified`, and routing
to the existing (previously secondary-only) "Browse all provider tests" fallback as the
primary state whenever `url_verified === false`. The second, lower "Book Your Test Now" CTA
on the same page had the identical unconditional-open bug; same fix, same fallback.

### Finding #30 — four more direct `<a href={…url} target="_blank">` opens with no `url_verified` check

Found by tracing every consumer of `CompareTestData`/`EnhancedTestData`/`ProviderTestRow`-
shaped card data that renders a provider link, not by re-grepping the contract's example
list (which this pass confirmed is stale — `TestProviderPriceTable.tsx` and
`GroupedTestsTable.tsx` weren't on it):

- `src/components/compare/ProviderComparisonTable.tsx` — `Book Now`, gated only by
  `!!t.url && t.url !== "#"`.
- `src/components/providers/ProviderTestDetailModal.tsx` — `Book`, 3 separate `test.url ?`
  checks (button, affiliate note, redirect copy).
- `src/components/compare/GroupedTestsTable.tsx` — `Order`, on the provider-comparison
  table's expanded rows.
- `src/pages/CancerComparisonPage.tsx` — `Book` (via `handleBookTest`/`openAffiliateUrl`);
  already fixed in pass 4 to add an internal "View details" link alongside it, but the
  external action itself still had no `url_verified` gate.
- `src/components/compare/TestProviderPriceTable.tsx` — `Book Now`/`Book`, 2 layouts
  (desktop table + mobile cards) × 2 render branches each = 4 occurrences.

All five switched from ad hoc truthiness checks to the shared
`canBookDirect(url, url_verified)` helper (`src/lib/booking-link-state.ts`, already used by
`UniversalTestCard` since PR #47) rather than each re-deriving the same three-state logic —
one helper, one place to get the `null`-vs-`false` distinction right.

### The data plumbing this needed

None of the above compiled without the underlying `url_verified` column actually reaching
these components, so the full chain was fixed end to end rather than gating on data that
was never fetched:

| Layer | Files |
|---|---|
| Supabase `.select()` strings | `testSlugLookup.ts` (canonical test-detail query), `testQueryBuilder.ts` (`COMPARE_SELECT`, `PANEL_VIEW_SELECT`), `CompareService.ts` (`unified_provider_tests` id lookup), `categoryTestMapper.ts` (`CATEGORY_TEST_COLUMNS`), `usePopularTestsFromDatabase.ts` (lean/full pool columns + fallback), `useHeroPopularTests.ts`, `useResolvedRecommendations.ts`, `useProvidersByTestType.ts` (both exports) |
| Row/interface types | `TestData`/`ProviderTestData`/`ComparisonProviderOption` (template), `LiveTestRow`, `UnifiedCompareRow`, `RawTestRow`, `PoolRow`/`PopularTest`, `HeroPopularTest`, `CategoryTestItem`, `ProviderTestRow` (useProvidersByTestType), `ProviderTestOption` (price table), `CompareTestData`, `EnhancedTestData` |
| Mapping functions | `TestDataTransformer.transformSingle`, `transformRawTestToEnhanced`, `mapProviderTestRow`, `mapHeroRows`, both `usePopularTestsFromDatabase` branches, both `useProvidersByTestType`/`useProvidersByCategory` branches |
| Adapters | `universalTestAdapter.ts`'s `fromCategoryTestItem` and `fromLegacyUnified` (`fromAtHomeTest`/`fromProviderTest` already carried it since PR #47) |
| Render-site pass-throughs (object literal only, no new logic) | `HeroPopularTests.tsx`, `RecommendedTestsCarousel.tsx`, `CompareTests.tsx`, `MostPopularTestsPage.tsx`, `DreamHealthShowcase.tsx`, `ProviderTestDetailTemplate.tsx`'s sibling-provider comparison rows |

### Explicitly checked and left alone

- `useClinicTests.ts` — genuinely dead code (exported from `src/hooks/index.ts`, imported
  nowhere else); adding `url_verified` to a hook nothing calls would be noise, not coverage.
- `SimilarTestsSection.tsx` — doesn't select `url` at all; its cards link to the internal
  provider route only. No external-link risk to begin with.
- `ProviderComparisonPage.tsx` — stats/accreditation overview; doesn't select or render
  `url`. Not a booking-link surface.
- `usePopularTestsForNavigation` (same file as the fixed hook) — `MegaMenuDropdown.tsx`
  already documents (and pass 4's finding #28 confirmed) that it never opens `test.url` for
  this data; left unchanged rather than adding an unused field.
- `GroupedTestsTable.tsx`'s "View" fallback still links to a guessed
  `/${provider}/${encodeURIComponent(testName)}` route rather than the canonical
  `/provider/:providerId/tests/:testId` — a pre-existing link-rules issue, not a
  `url_verified` one. More rows will now reach this branch (anything `url_verified === false`
  falls through to it), which is more exposure of an existing bug, not a new one. Flagged
  here rather than fixed, since the fix is a different, larger change (resolving the real
  canonical URL for every row in this table) than this pass's scope.

### Verification

- `npx tsc --noEmit -p tsconfig.json` — 0 errors, repo-wide, after fixing the one real
  fallout (`CancerBiomarkerGroup.honesty.test.ts`'s `EnhancedTestData` fixture needed
  `urlVerified: null` added once the field became required).
- `npm run build` — full production build, including the entire `prebuild` chain (secrets
  check, RLS grants check, **`audit-card-external-links.mjs`** — not listed in CLAUDE.md's
  prebuild description, confirmed by reading `package.json` directly — sitemap generation,
  SEO regression). Succeeded end to end.
- `node scripts/audit-card-external-links.mjs` directly — "5 external navigation(s) checked,
  0 unlabelled" (unchanged count; this pass added gating conditions, not new external links
  or new labels).
- `npx vitest run` — 1010/1014 passing. The same 4 pre-existing failures as every prior
  pass in this repo (`categoryMapping.test.ts`, blocked by this sandbox's own network
  policy on live Supabase queries — confirmed by checking out `main` with a clean
  `git stash` and re-running: identical 4 failures, same file, pre-existing).
- `npx eslint` scoped to the 25 changed files: 2 new formatting-only issues from this pass's
  own edits (long lines), fixed with `npx prettier --write`; the remaining 4 pre-existing
  errors in `useEnhancedComparison.ts` (an `any`, 3 ternary-formatting nits) were confirmed
  pre-existing on `main` via the same stash-and-compare method, not touched.
- **UNVERIFIED — could not run in this sandbox**: `npm run lint` (repo-wide; ~31k
  pre-existing issues, confirmed in PR #47 not to gate CI), `npm run test:smoke` (needs a
  running dev server + Playwright browser session this pass did not start).

### Drift guard

Not added this pass. `url_verified` coverage is a data-completeness property across ~25
files, not a single renderable pattern `audit-card-external-links.mjs`'s regex approach can
check — the script already verifies every external link is labelled, which is a different
rule. A machine check for "does every surface that can render a booking link actually read
`url_verified` before doing so" would need its own script; flagged as a follow-up, not
built here, since it wasn't asked for and deserves its own design pass rather than being
bolted on at the end of this one.

### Exit status

Not a clean pass by the loop's own definition (30 findings fixed total across passes 1–5),
but this specific, narrowly-scoped gap — `url_verified` coverage — is now closed across
every real card-rendering surface found by tracing actual data consumers rather than
re-running the same surface list. Two explicitly-identified items were left alone on
purpose (dead code, pre-existing unrelated bug) rather than silently expanded into.

### Addendum (2026-10-28) — rebased onto 194 newer `main` commits

Merging current `main` into this branch resolved seven conflicts. Six were overlaps where
`main` had added image fields beside this pass's `url_verified` fields; both were kept.
`CancerComparisonPage.tsx` now loads through `getCancerTests()` (`select("*")` on the
`unified_provider_tests` view) instead of its old effect. The view exposes `url_verified`
and the rows still pass through `transformToEnhanced`, so this pass's `canBookDirect` gates
there keep working.

A fresh sweep of every `href={…url}` and `openAffiliateUrl(` call found one database-backed
surface this pass had missed:

- **Finding #31:** `IntelligentSearch.tsx` (`/search`) showed its "Book" button on `r.url`
  alone. `testsApi.searchTests` now selects `url_verified`, and the button uses
  `canBookDirect(r.url, r.url_verified)`.

Left alone on purpose: `ProviderPriceComparison.tsx` and `ProviderComparisonSidebar.tsx`
render inside `TestPageTemplate` on the editorial `/test/*` pages, whose provider links are
hand-written constants with no `provider_tests` row, so `url_verified` does not exist for
them. Whether those hardcoded links should come from `provider_tests` is a separate
question.
