# Migration reconciliation inventory and policy

**Created:** 14 September 2026 · **Scope:** W2 of `docs/PHASE_0_AUDIT_WORKLIST.md`
**Companions:** `docs/MIGRATION_HISTORY.md`, `docs/PHASE_0_ARCHITECTURE_AUDIT.md`

This document records what the historical migration drift actually consists of, and the
policy that governs which of it is brought back under schema version control. No
historical SQL has been invented, replayed or re-applied, and no executable duplicate
migration file has been created for an already-applied version.

## The numbers

Measured 14 September 2026 against `supabase_migrations.schema_migrations`
(393 applied versions) and `supabase/migrations/*.sql` (279 committed files).

| Set | Count |
| --- | --- |
| Applied and committed | 267 |
| Applied with no committed file | 126 |
| — of which timestamp near-misses (`+1s` CLI skew) | 12 |
| — of which true orphans | 114 |
| Committed but never applied | 0 |

Classification of the 114 true orphans, taken from the `statements` array that
`schema_migrations` stores alongside each version:

| Class | Count | Disposition |
| --- | --- | --- |
| A — `CREATE TABLE` | 4 | Backfill a marker file |
| B — `ADD COLUMN` | 8 | Backfill a marker file |
| C — destructive (authorised at the time) | 1 | Backfill a marker file |
| D — RLS / grant / security | 17 | Backfill a marker file |
| E — function / trigger | 3 | Backfill a marker file |
| F — index | 1 | Backfill a marker file |
| G — view | 7 | Backfill a marker file |
| H — cron | 3 | Backfill a marker file |
| I — catalogue DML only | 62 | **Excluded by policy — see below** |
| Z — other / mixed | 8 | Classify individually during backfill |

"Schema-bearing" in the worklist means classes A + B + C (13). "Security orphans"
means class D (17).

Every orphan row carries `version`, `name`, `created_by` and the complete
`statements` array. This is the site owner's own work, applied through the Lovable
migration tool and never written back as files. It is not unattributed out-of-band SQL.

**Material finding:** the `biomarker_canonical_phase1…phase4` sequence of 29 August is
uncommitted and is a partial early implementation of the Phase 3 biomarker ontology —
`biomarker_hub` made canonical, 18 case-duplicate pairs resolved, LOINC and SNOMED
relinked by id, a taxonomy mapping table added, `provider_test_biomarkers` created.
Phase 3 starts further along than the plan assumes.

## Policy

1. **Routine catalogue DML is excluded from schema version control.** The 62 class-I
   orphans are provider-catalogue maintenance — junk-row cleanup, category
   normalisation, deduplication, price and stock corrections. They describe no schema
   and replaying them against a moved-on catalogue would be actively harmful. They
   remain fully auditable in `schema_migrations.statements`. This exclusion is
   deliberate: pretending data maintenance belongs in schema history guarantees the
   drift recurs.
2. **Schema-bearing and security changes are reproducible from the repository alone.**
   Classes A–H are backfilled as *marker* files containing the verbatim recorded
   statements wrapped so they are no-ops against the live database, never as
   re-executable DDL.
3. **Backfill is a separate, reviewed change.** It is not bundled with feature work, and
   it happens after the parity enforcement below is proven to work.
4. **Timestamp near-misses are corrected metadata-only**, the same way as the
   2026-07-05 pass recorded in `docs/MIGRATION_HISTORY.md`, with a backup snapshot
   taken first. All 12 postdate that reconciliation, so the cause was never removed,
   only cleared once.

## Enforcement (implemented 14 September 2026)

The previous CI could not detect drift at all. Two independent holes:

- `.github/workflows/migration-parity.yml` gated the remote diff on
  `if: ${{ secrets.SUPABASE_DB_URL != '' }}`. GitHub does not expose the `secrets`
  context to step-level `if`, so the condition never evaluated truthy, the remote half
  never ran, and the job still reported green.
- The `pull_request` trigger was path-filtered to `supabase/migrations/**`, so a
  migration applied through the tool without a file touches no path and opens no PR.

Both are now fixed:

| Change | File |
| --- | --- |
| Secret moved to job-level `env`; steps test `env.SUPABASE_DB_URL != ''` | `.github/workflows/migration-parity.yml` |
| Explicit warning annotation when the secret is absent, so a skipped remote check is visible rather than silent | same |
| Daily `schedule` trigger plus `workflow_dispatch`, so drift cannot hide behind path filters | same |
| Remote comparison extracted from inline bash into a reviewable script that exits non-zero when `SUPABASE_DB_URL` is missing | `scripts/check-remote-migration-parity.mjs` |
| Comparison logic isolated, pure and auditable, with the `+1s` skew tolerance stated as an explicit, narrow rule (trailing version only, exactly one second, no other difference — and reported in the log when applied rather than silently swallowed) | `scripts/lib/migration-parity-core.mjs` |
| Fixture self-test proving the checker fails on deliberate drift, passes on identical sets, tolerates only the documented skew, and rejects malformed versions — run in CI, no production access | `src/lib/ci/__tests__/migration-parity.test.ts` |

Fixture self-test result, 14 September 2026: 8 tests passed.

## Still outstanding

- Backfill the 13 schema-bearing and 17 security marker files (plus the 8 class-Z
  after individual classification).
- ~~Correct the 12 near-miss versions, backup first.~~ Done 24 September 2026, repository-side
  only (no production write): each real migration file was renamed to the version
  `schema_migrations` recorded for it (its `name` column already pointed at that file), and
  the placeholder reconciliation marker at that version was removed. Checked against the
  live version list with `compareMigrationSets`: `ok: true`, 0 missing either side, 33
  excluded-by-policy versions correctly uncommitted.
- Confirm the remote check goes red against a real injected orphan once
  `SUPABASE_DB_URL` is configured in repository secrets. Until that secret exists, CI
  emits a warning and the remote half is genuinely not verified.
