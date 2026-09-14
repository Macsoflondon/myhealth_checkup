# Phase 0 Audit Worklist

Companion to `docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md` and `docs/BUILD_TRACKER.md`.

Purpose: make Phase 0 (`P0.01`-`P0.11` in the build tracker) executable — concrete
checks, not restated objectives. Each item lists what to run, what evidence it
produces, and the decision it forces. Nothing in Phase 1 should start until the
decisions in Section 0 and Section 7 are made and recorded.

Project: `clvuioagsgfadynuvodj` ("myhealth checkup", eu-west-2). Do not run
audit queries against `bcdqvjmhbudeuawsjlby` — that is the unrelated standalone
Supabase CLI project (see repo root `CLAUDE.md`).

---

## 0. Reconcile with the existing `clinical_*` domain — BLOCKING, do this first

The master plan proposes `diagnostic_reports`, `observations`, `biomarkers`,
`biomarker_loinc_mappings`, `consent_records`, `share_links` etc. as new
tables. A parallel implementation of most of these concepts **already exists
in production** under a `clinical_` prefix, plus a consolidated
`biomarker_hub`. The master plan does not mention any of it. This has to be
resolved before Phase 1 schema design, or you risk building a third parallel
biomarker/observation model on top of two that already exist.

Confirmed to exist today (live schema, `clvuioagsgfadynuvodj`):

| Table | Rows | Overlaps with master-plan concept | Wired to code? |
|---|---|---|---|
| `biomarker_hub` | 1,552 | §6 Biomarker ontology (`biomarkers`, `biomarker_aliases`, `biomarker_loinc_mappings`) — already has `loinc_code`, `snomed_code`, `category_clinical`/`category_consumer`, `synonyms`, `legacy_codes[]`, `source_systems[]`, `embedding` (vector), explicit comment: "Consolidates biomarker_knowledge_hub ... and biomarkers_library ... nothing is overwritten" | Referenced by biomarker library UI (consumer-facing content), not by any result pipeline |
| `clinical_loinc_mappings` | 47 | §25 LOINC architecture — has `verification_status`, `is_primary`, `code_source`, `release_version`, `verified_at`/`verified_by` — i.e. the exact governance model §25 asks for | Only `fhir-export` function |
| `clinical_snomed_mappings` | 47 | Not in master plan at all — SNOMED CT, one step further than LOINC | Only `fhir-export` function |
| `clinical_reference_ranges` | 0 | §16 Reference ranges — but modeled as canonical/population ranges (sex, age band, `source: 'nhs'`), not per-observation source ranges like §16 specifies | None found |
| `clinical_biomarker_history` | 0 | §4 `observations` + §14 longitudinal engine, flattened into one table incl. `trend_direction`, `ai_interpretation` | Only `fhir-export` function |
| `clinical_patient_uploads` | 0 | §4 `source_documents` + `extraction_jobs` | Only `fhir-export` function |
| `clinical_consent_records` | 0 | §4 `consent_records`, has `ip_hash`, `version`, `expires_at` | Only `fhir-export` function |
| `clinical_fhir_bundles` | 0 | §24/§7 Phase 7 FHIR export — stores generated R4 bundles with `validated`/`validation_errors` | Only `fhir-export` function |
| `clinical_gp_notifications` | 0 | Not in master plan at all — GP practice (ODS code) notification workflow | Only `fhir-export` function |
| `fhir_export_jobs` | 0 | Job-tracking wrapper around the above | `fhir-export` function |
| `data_sharing_grants` | 0 | §23 Secure sharing — `scope` JSONB *defaults to* `{"resources": ["Patient","DiagnosticReport","Observation"]}`, has `access_token_hash`, `expires_at` (30d default), `revoked_at`/`reason`, `access_count` | `AdminDataSharingPage` (admin-only route `/admin/data-sharing`) |
| `profiles` | 0 | **Resolved (2026-09-14):** not boilerplate. Migration `20260705205407` created it deliberately (`id references auth.users(id)`, self-service RLS: `profiles self read/insert/update`), paired with an `engine_*` table set (`engine_runs`, `engine_freezes`, `engine_checkpoints`, `engine_audit_log` — an agent/skill-run tracker: columns `command`, `skill`, `stage`, `status`) and a first-user-auto-admin trigger. The auto-admin trigger was deliberately dropped again in `20260730102214` once real admin was established (privilege-escalation cleanup), but `profiles` itself, its RLS, and the `engine_*` tables remain live. | RLS policies exist; no confirmed frontend reader found yet — re-check `src/` now that this is understood to be real, not dead |

**What this means:** almost all of Phase 0/1/7's target concepts already have a
schema, and a chunk of it (LOINC/SNOMED with verification status, consent,
FHIR bundle generation, sharing grants with FHIR-scoped resources) is *more*
mature than the master plan's own description of those layers. But it is
completely dark — one edge function and one admin page touch it; zero patient
UI. Nearly all tables have 0 rows except `biomarker_hub`, `clinical_loinc_mappings`,
`clinical_snomed_mappings`.

### 0.1 Find out who/what built this and why it was never surfaced
- `git log --all --oneline -- 'supabase/migrations/*clinical*'` and grep migration filenames/timestamps for when `clinical_*`, `biomarker_hub`, `fhir_export_jobs`, `data_sharing_grants` were introduced.
- Check PR history / commit messages for those migrations — was this a prior Lovable/Claude session's attempt at this exact program, later abandoned?
- Check `fhir-export/index.ts` in full (373 lines) and `AdminDataSharingPage.tsx` to determine actual functional completeness, not just schema existence.

### 0.2 Decide disposition, table by table
For each row in the table above, pick one:
- **Adopt as foundation** — extend it, do not create a same-purpose table under a new name.
- **Adopt with rework** — schema needs correction first (e.g. `clinical_biomarker_history` collapses observation+series+interpretation into one row, which conflicts with master plan §5's "don't collapse source/canonical, don't let AI write trusted fields" principle — `ai_interpretation` sitting directly on the trusted history row is a candidate violation).
- **Deprecate, migrate data out, drop** — only with explicit approval per principle #15 (no data loss without sign-off), and only if row count is genuinely 0 and nothing references it.

Do not let Phase 1 (`P1.01`-`P1.14`) proceed until this table has a decision recorded for every row. Add the decisions as a table in the gap report (0.9 below).

### 0.2a Disposition decisions — drafted 2026-09-14, from the migration-backfill audit

The git/production reconciliation (see `chore/backfill-missing-migrations` PR)
surfaced the full history of what actually happened to this schema between
2026-06-26 and 2026-09-12. That resolves several rows below from "needs
investigation" to "confirmed" — these are no longer open questions, they are
read directly from applied migration content.

| Table / area | Decision | Evidence |
|---|---|---|
| `biomarker_hub` | **Adopt as foundation — already done.** This is not a future consolidation to plan; it already happened. Migrations `biomarker_canonical_phase1` through `phase5` (2026-08-29) folded `biomarkers_library` and `biomarker_knowledge_hub` into `biomarker_hub`, resolved 18 case-duplicate pairs via a `canonical_id`/`status='duplicate'` mechanism (rows kept, never deleted), and preserved every non-redundant value from the losing side in a `variant_content` provenance column. | Migration content read directly, checksummed against production |
| `biomarkers_library`, `biomarker_knowledge_hub` | **Already deprecated, correctly.** Both renamed to `_archive` (`biomarkers_library_archive`, `biomarker_knowledge_hub_archive`) and replaced with read-only compatibility views under the original names, so no existing caller broke. Table comments explicitly say "Do not write new rows here." Nothing further to do — Section 7's "three generations" question is closed. | `biomarker_canonical_phase5_*` migrations |
| `clinical_loinc_mappings`, `clinical_snomed_mappings` | **Adopt as foundation — already linked.** `biomarker_canonical_phase3_terminology_link` (2026-08-29) added `biomarker_id`/`is_primary` to both, with a trigger (`sync_primary_terminology_code`) keeping `biomarker_hub.loinc_code`/`.snomed_code` in step automatically. The governance fields (`verification_status`, `verified_by`, `release_version`) are exactly what master plan §25 asks for. Build Phase 1's LOINC mapping against these tables, not new ones. | Migration content + earlier column audit |
| `biomarker_category_map` | **Adopt as foundation — already populated.** ~40 rows bridging `category_clinical` (snake_case) and `category_consumer` (Title Case) on `biomarker_hub`, seeded deliberately across two migrations including a gap-filling pass. | `biomarker_canonical_phase4_taxonomy*` migrations |
| `clinical_consent_records`, `clinical_fhir_bundles`, `data_sharing_grants`, `fhir_export_jobs` | **Adopt as foundation.** Well-modeled, FHIR-shaped, zero rows so zero migration risk. Extend for Phase 1/6/7 rather than building parallel tables. | Column audit, this session |
| `clinical_reference_ranges` | **Adopt with rework.** Models canonical/population ranges (sex, age band, `source: 'nhs'`) — a different, valid concept from master plan §16's per-observation *source* range. Keep both: this table for canonical/interpretive ranges, a new per-observation field on Phase 1's `observations` table for the range as printed on that specific lab report. Do not conflate the two or let one silently replace the other. | Column audit, this session |
| `clinical_biomarker_history`, `clinical_patient_uploads` | **Adopt with rework — still open, needs code-level check.** Structurally close to §4's `observations`/`source_documents`, but `clinical_biomarker_history` puts `ai_interpretation` directly on the same row as the trusted `value`/`unit`/`status` fields — a candidate violation of principle #3 (AI must never write a trusted observation directly). Both tables are still empty and untouched by any writer found so far. **Blocking sub-task:** trace `blood-test-analysis` and `ai-test-mapper` (Section 8, not yet done) before finalizing — if either already writes to this table, the fix is different than if nothing does yet. | Column audit; writer trace still pending |
| `clinical_gp_notifications` | **Adopt, explicitly deferred.** Real, deliberate schema (ODS code field) for GP-practice notifications — beyond anything in the master plan's current phases. Don't build against it yet; flag as a named Phase 7+ candidate so it isn't silently duplicated later. | Column audit, this session |
| `profiles` + `engine_*` tables | **Leave alone — unrelated to the health-record build.** Confirmed real (0.1 above) but serves a different purpose (looks like agent/skill-run tracking: `engine_runs.skill`, `.stage`, `.status`). Not a health-profile candidate despite the name. The actual multi-profile-per-account gap (master plan §4) is still open and unaddressed by any existing table — `user_profiles` remains hard 1:1 with `auth.users`. | Migration content, this session |
| `test_results` (`biomarker_results` JSONB) | **Deprecate.** Zero rows, the exact blob anti-pattern the master plan rejects (§5). Mark deprecated via table comment now; drop only after confirming no code path still references it. | Row count + schema, earlier this session |
| `uploaded_test_results` | **Adopt with rework, has live data (2 rows) — do not silently drop.** Reconcile into `clinical_patient_uploads` rather than deprecating outright, since real rows exist. | Row count, earlier this session |
| `user_health_data`, `user_health_scores`, `biomarker_readings` | **Deprecate.** All 0 rows, all conceptually absorbed by `biomarker_hub` + `clinical_biomarker_history`. Cheapest possible point to consolidate, before any real data lands in any of them. | Row counts, earlier this session |
| `biomarker_audit_runs` | **Out of scope, no action.** Confirmed as the `audit-biomarkers` scraper data-quality job log — unrelated to the clinical/health-record domain. Don't fold into `audit_logs`. | Function-name match, this session |
| `user_profiles` (NHS number, PII, 2 live rows) | **Leave alone in Phase 0/1.** Actively used by the marketplace/quiz features with real user data. Out of scope for the Health Intelligence buildout — a dedicated migration plan is required before this table is touched, per principle #15. Do not let Phase 1's `health_profiles` design assume it can extend or replace this table without that separate plan. | Column audit, earlier this session |

**Still genuinely open**, not resolved by the migration backfill:
- Section 8 (`blood-test-analysis`, `ai-test-mapper` full read) — required before `clinical_biomarker_history`'s disposition can be finalized.
- Section 9 (`fhir-export/index.ts` full read against Phase 7/8 acceptance criteria).
- The multi-profile-per-account gap has no owner yet — this is a real Phase 1 design task, not just an audit finding.

### 0.3 Specific correctness check on `clinical_biomarker_history`
`ai_interpretation` and `trend_direction` are columns directly on the row that
also holds `value`/`unit`/`status` — i.e., an AI-generated field lives on what
should be a trusted clinical record. Master plan principle #3 ("AI must never
write a trusted clinical observation directly") and #11 make this worth a
direct check: does anything write `ai_interpretation` automatically, or is it
human-reviewed first? Trace every writer of this table.

---

## 1. Repository and migration inventory (`P0.01`, `P0.02`)

- `ls supabase/migrations | wc -l` and confirm against `list_migrations` (MCP) — as of this audit: 278 migration files locally.
- Diff local migration files against `list_migrations` output for `clvuioagsgfadynuvodj` to confirm no drift between repo and live DB.
- Group migrations by rough era (naming pattern is `<timestamp>_<uuid>.sql`, not descriptive — flag this as a tooling gap: nothing makes migration intent greppable without opening each file).
- Output: one-line summary per migration era (not per file) — "what capability shipped in this window."

## 2. Table inventory (`P0.03`)

Already pulled once for this audit — 130 tables total on `public`. Re-run and diff periodically:

```sql
select table_name from information_schema.tables where table_schema='public' order by 1;
```

Bucket every table into: marketplace, identity/auth, clinical/health-record (the `clinical_*` + `biomarker_*` + `fhir_*` + `data_sharing_*` group), security/audit/SOC (`soc_*`, `security_*`, `audit_*`, `role_audit_log`, `encryption_keys`, `mfa_backup_codes`, `admin_recovery_tokens`), analytics/growth (`funnel_events*`, `platform_metrics*`, `revenue_events`, `user_events*`, `product_*`), scraping/provider-data pipeline (`scrape_*`, `provider_*`, `apify_*`), and "engine" (`engine_runs`, `engine_freezes`, `engine_checkpoints`, `engine_audit_log` — purpose unknown, check what writes these before assuming they're free to ignore).

## 3. RLS policy inventory (`P0.04`)

```sql
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename, policyname;
```

- `get_advisors(type: security)` returned zero lints at time of this audit — good baseline, re-run after every Phase 0/1 migration.
- Specifically verify: does any policy on `clinical_*` tables exist yet (they had 0 rows — confirm RLS is enabled and correct *before* anything writes to them, not after)?
- Confirm `user_profiles` RLS truly restricts to `user_id` owner only (comment claims this — verify the actual policy, not the comment).

## 4. Auth / profile model (`P0.05`)

- `user_profiles`: 1:1 with `auth.users` (`user_id UUID UNIQUE`). Master plan requires multi-profile-per-account (family use, §4). This is a structural gap, not additive — record explicitly as a Phase 1 blocker, not a Phase 0 nice-to-know.
- `profiles` table (0 rows, columns: `id`, `email`, `display_name`, `created_at`): determine whether this is (a) Supabase-starter boilerplate never wired up, (b) an abandoned first attempt at the multi-profile model, or (c) actively referenced by an auth trigger. Check for a trigger: 
  ```sql
  select tgname, tgrelid::regclass from pg_trigger where tgrelid = 'public.profiles'::regclass;
  select tgname, tgrelid::regclass from pg_trigger where tgrelid = 'auth.users'::regclass;
  ```
  If nothing references it and no trigger populates it, it's dead — note in gap report, don't build on it without renaming/repurposing deliberately.
- `user_roles` (5 rows) — document the role model before designing any admin-vs-clinician-vs-patient access split for Phase 5/6.

## 5. Provider / test catalogue (`P0.06`)

- Two candidate "test master" tables exist: `tests_master` (415 rows) and `blood_tests` (583 rows). Determine which is authoritative, or whether they serve genuinely different purposes (e.g. one is marketplace-facing, one is content/SEO). Do not let the new `tests` / `test_variants` model (§4) get built against the wrong one, or against both inconsistently.
- `provider_test_mapping` (410 rows) vs `provider_test_biomarkers` (4,434 rows) vs `category_test_mapping` (1,621 rows) — map how these three relate; the master plan's `test_biomarkers` / `provider_test_identifiers` needs to know which existing table it extends vs. replaces.

## 6. Existing biomarker / test mappings (`P0.07`)

- `biomarker_hub` (1,552 rows) is the de facto canonical biomarker table already. Read its full column list (fetched during this audit — 45 columns including `embedding` and `legacy_embedding` vectors, `variant_content` jsonb, `canonical_id` self-reference). Determine whether `canonical_id` already implements a dedup/alias mechanism equivalent to the master plan's `biomarker_aliases` table.
- `biomarker_category_map` (46 rows) — explicitly documented as bridging "clinical taxonomy" and "consumer taxonomy." This is a real, deliberate design decision already in place; the master plan's `biomarker_categories` should map onto this, not duplicate it.
- `provider_test_biomarkers` (4,434 rows) has a documented `biomarker_id` nullability rule (unmatched labels kept with `raw_label`, never dropped) — this is the exact "never silently lose data" discipline the master plan asks for (§11, §35). Worth preserving as a pattern.

## 7. Legacy / duplicate structures (`P0.08`)

Confirmed duplicates/overlaps to resolve explicitly (not just "note and move on" — each needs a stated decision):

- **Result storage, three generations:** `test_results` (`biomarker_results JSONB` blob, 0 rows) → `uploaded_test_results` (2 rows) → `clinical_biomarker_history` + `clinical_patient_uploads` (0 rows, more structured). Decide which is the line of descent Phase 1's `observations`/`diagnostic_reports` actually extends.
- **Biomarker reference — RESOLVED, not open.** `biomarkers_library` and `biomarker_knowledge_hub` were already consolidated into `biomarker_hub` and renamed to `_archive` tables behind compatibility views (see §0.2a). `biomarker_hub` **is** the canonical `biomarkers` table from master plan §4 — extend it, do not create a fourth table.
- **Health metrics:** `user_health_data`, `user_health_scores`, `biomarker_readings` — all 0 rows, all overlapping conceptually with `clinical_biomarker_history` and the master plan's `health_events`/`biomarker_series`. Since all are empty, this is the cheapest possible place to consolidate before any real data lands in any of them.
- **Audit runs:** `biomarker_audit_runs` (75 rows) vs `audit-biomarkers` edge function vs the master plan's general `audit_logs` — confirm this is a data-quality job log (matches `audit-biomarkers` function name) and not something that should be folded into `audit_logs`.

## 8. Existing AI/document pipeline (not in original tracker — add explicitly)

- `blood-test-analysis` function (336 lines) and `ai-test-mapper` function (536 lines) already perform work that overlaps with master plan Phase 2 (§9 document intelligence pipeline, §10 AI extraction contract). Read both in full. For each, determine:
  - What input it accepts (PDF? image? structured text?).
  - What it writes, and to which table(s) — does it write directly to a "trusted" table, which would violate principle #3/#4?
  - Whether it has any confidence scoring or validation step, or goes straight from AI output to storage.
- Record findings against `P2.05` (AI extraction schema) and `P2.11` (deterministic validation) — these two tracker items may already be 30-70% answered by existing code, or may reveal the existing code violates the very principles the master plan sets out (in which case that's a rework item, not a "delete and start over" item — principle #15).

## 9. Existing interoperability / sharing pipeline (not in original tracker — add explicitly)

- Read `fhir-export/index.ts` (373 lines) in full against master plan §24 (FHIR architecture) and Phase 7/8 acceptance criteria. Determine actual resource coverage (Patient/DiagnosticReport/Observation/DocumentReference/Specimen — which are implemented vs. stubbed).
- `data_sharing_grants.scope` defaulting to FHIR resource names is a strong signal this was built with the same FHIR-shaped model the master plan independently arrived at. Confirm whether `AdminDataSharingPage` is feature-complete enough to become the Phase 6 secure-sharing UI (extended to non-admin users) rather than building a new one.
- `clinical_gp_notifications` implies NHS GP-practice integration was already scoped (ODS code field). This is beyond anything in the master plan's current phases — decide whether to fold it into Phase 7 explicitly or flag as deliberately out of scope for now.

## 10. Security / governance baseline (`P0.10`)

- `get_advisors(security)` — clean at time of this audit (0 lints). Re-run after every migration in Phase 0/1, not just once.
- `encryption_keys` (1 row), `mfa_backup_codes`, `admin_recovery_tokens`, `verify-admin-mfa`/`mfa-recovery`/`admin-recovery` functions, `encrypt-sensitive-data`/`encryption-status` functions — there is already a real encryption/MFA subsystem. Master plan §26 lists these as requirements to build; confirm what fraction already exists vs. still needs building, table by table.
- `soc_incidents` (126 rows), `soc_incident_events` (6,445 rows), `security_scan_snapshots` (555 rows), `siem_export_cursor` — a working security-monitoring pipeline already exists and has real data. Don't re-scope this under Phase 0/1; just confirm it covers the new `clinical_*` tables once they go live (does SIEM export include them, or only marketplace tables?).

## 11. Architecture gap report (`P0.09`) — the actual Phase 0 deliverable

Single document, produced from sections 0-10 above, containing:
1. A disposition decision (adopt / adopt-with-rework / deprecate) for every table listed in Section 0 and Section 7, with the reasoning.
2. A revised Phase 1 schema plan that names, for each proposed master-plan table (`health_profiles`, `observations`, `diagnostic_reports`, `biomarkers`, `consent_records`, `share_links`, etc.), whether it is: new, or an extension of a named existing table, or a rename/rework of one.
3. An explicit call on `blood-test-analysis`, `ai-test-mapper`, `fhir-export`: keep, refactor-in-place, or replace — each with a reason tied to master plan principles #3/#4/#11.
4. Updated `docs/BUILD_TRACKER.md` — several `P0.06`/`P0.07`/`P2.05` items are likely NOT "NOT STARTED" once this report exists; they're "existing implementation found, disposition pending" or "existing implementation found, adopted." Don't mark them COMPLETE (nothing has been verified yet), but stop tracking them as if no work exists.

## 12. Phase 0 exit gate (`P0.11`)

Exit criteria, restated concretely: Section 11's gap report exists, every table in Section 0 has a recorded disposition, and the revised Phase 1 schema plan names zero net-new tables that duplicate an existing table's purpose without an explicit stated reason. Do not open a single Phase 1 migration PR before this gate is signed off.
