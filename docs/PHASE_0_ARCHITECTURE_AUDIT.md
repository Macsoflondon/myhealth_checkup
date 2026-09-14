# Phase 0 — Architecture Audit (Health Intelligence Master Blueprint)

**Date:** 14 September 2026 (first pass), amended 14 September 2026 (second pass)
**Scope:** Read-only audit of repository and read-only inspection of the connected Supabase project (`clvuioagsgfadynuvodj`).
**Status:** **Phase 0 NOT COMPLETE — blocked.** See "Blockers".

No schema, data, route, component or edge function was modified during this audit. The only write produced by this work is this document.

---

## Blockers

1. **`docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md` does not exist in this repository or anywhere in its git history.** The comparison of the existing implementation against the planned Health Intelligence schema therefore could not be performed. Every "conflict" and "missing prerequisite" statement below is inferred from conventional health-record architecture, **not** from the plan.
2. **`docs/BUILD_TRACKER.md` does not exist in this repository or anywhere in its git history.** The Phase 0 acceptance criteria (P0.01–P0.11) are unavailable, so no tracker item can be evidenced and Phase 0 has not been marked complete.
3. **`docs/PHASE_0_AUDIT_WORKLIST.md` and `docs/build-tracker.json` are likewise absent.**
4. **The branch `docs/health-intelligence-master-plan` is not reachable from this project.** Second-pass retrieval attempt, 14 September 2026:
   - `git remote -v` resolves `origin` to the Lovable-internal mirror (`git.private.lovable-gcp.code.storage/37e227e1-…`), **not** to GitHub.
   - `git ls-remote --heads origin` returned 151 refs; **none** matches `docs/health-intelligence-master-plan` or contains "health".
   - `git log --all` and a scan of reachable trees found no blob under any of the four filenames at any commit.
   - No GitHub connector connection is available to this workspace (`list_connections` for `github` returned none), so the GitHub API route is also unavailable.

   Per instruction, the documents were **not** reconstructed from memory. They must be supplied by one of: pushing the branch to the Lovable-connected remote, cherry-picking the four files onto `main`, creating a GitHub connector connection in workspace settings, or pasting the file contents directly into chat.

Phase 0 cannot be closed until the four documents are present and the audit is re-run against them.


---

## VERIFIED FROM REPOSITORY

### Evidence base

| Source | Count |
| --- | --- |
| Migration files in `supabase/migrations/` | 279 |
| `CREATE TABLE` statements across migrations | 78 distinct public-schema tables |
| Migration files containing `CREATE POLICY` | 81 |
| Migration files referencing `has_role(...)` | 54 |
| Route files under `src/routes/` | 145 |
| Supabase edge functions under `supabase/functions/` | 66 |
| Vitest unit/integration test files | 29 |
| Playwright specs (`e2e/` + `tests/e2e/`) | 13 |

### 1. Tables and migrations relevant to users, providers, tests, biomarkers and catalogue

**Identity and user data** — `profiles`, `user_profiles`, `user_roles`, `user_preferences`, `user_consents`, `user_sessions`, `mfa_backup_codes`, `encryption_keys`, `data_sharing_grants`, `data_access_requests`.

**Provider and catalogue** — `provider_tests` (91 columns, the canonical write target), `provider_test_mapping`, `provider_test_history`, `provider_metadata`, `provider_metrics`, `provider_biomarker_products`, `provider_section_category_map`, `provider_blog_posts`, `provider_catalogue_snapshots`, `tests_master`, `test_categories`, `categories`, `category_aliases`, `category_test_mapping`, `category_slug_redirects`, `lola_health_products`, `popular_test_enrichment_cache`, `live_comparison_panels`.

**Biomarkers** — `biomarker_hub` (45 columns, includes a pgvector `embedding` column with an HNSW index and the `match_biomarkers` RPC), `provider_test_biomarkers` (join table), `biomarker_category_map`, `biomarker_audit_runs`, `biomarker_readings`, `known_scrape_junk_labels`.

**Ingestion / provenance** — `scrape_runs`, `scrape_run_log`, `scrape_operations`, `scrape_change_events`, `scraping_jobs`, `scraper_alerts`, `apify_provider_configs`, `price_history`, `price_updates`, `product_change_log`, `product_scores`, `product_popularity`, `sync_heartbeat`.

**Clinical / interoperability scaffolding (already present)** — `clinical_biomarker_history`, `clinical_consent_records`, `clinical_fhir_bundles`, `clinical_gp_notifications`, `clinical_loinc_mappings`, `clinical_patient_uploads`, `clinical_reference_ranges`, `clinical_snomed_mappings`, plus `fhir_export_jobs`. Introduced by migrations `20260630185319_…` and `20260827211820_…`.

Live row counts (read-only query, 14 Sep 2026):

| Table | Rows |
| --- | --- |
| `provider_tests` | 904 |
| `provider_test_biomarkers` | 4,434 |
| `biomarker_hub` | 1,552 |
| `clinical_loinc_mappings` | 47 |
| `user_roles` | 5 |
| `uploaded_test_results` | 2 |
| `biomarker_readings`, `test_results`, `health_insights`, `clinical_patient_uploads`, `clinical_reference_ranges`, `user_consents`, `profiles` | 0 |

The marketplace/catalogue side is fully populated and live. **Every user-facing health-record table is empty**, confirming the clinical layer is scaffolding, not an operating system of record.

### 2. RLS and auth patterns

- Roles live in a dedicated `user_roles` table with the `app_role` enum (`admin`, `moderator`, `user`) — correct separation, no role column on profiles.
- `public.has_role(_user_id uuid, _role app_role)` is a `SECURITY DEFINER` `STABLE` SQL function with `search_path = public`, used by 54 migrations for admin policies. `is_current_user_admin()` wraps it.
- RLS is **enabled on all 24 sensitive tables sampled**, including every `clinical_*` table, `uploaded_test_results`, `biomarker_readings`, `user_health_data`, `user_health_scores`, `health_insights`, `test_results`, `user_consents`, `encryption_keys`, `fhir_export_jobs`, `data_sharing_grants` and `audit_logs`.
- Policy counts per table vary from 1 to 4. All eight `clinical_*` tables plus `encryption_keys`, `biomarker_hub` and `provider_tests` carry exactly **one** policy each — these are almost certainly admin-only or service-role-only blanket policies with no user-scoped read path.
- Front-end auth: `src/context/AuthContext.tsx` + `SessionSecurityProvider` composed in `src/routes/__root.tsx`; `src/hooks/use-auth.ts` resolves `isAdmin` from `user_roles`; `src/components/auth/AdminRoute.tsx` gates admin pages; MFA enforced on admin recovery token issuance (`admin-recovery` edge function, AAL2).
- `scripts/check-rls-grants.mjs` runs in `prebuild` and in `npm run security:check`, gating builds on RLS/GRANT hygiene.

### 3. Biomarker/test relationships and data quality controls

- Relationship chain: `provider_tests` → `provider_test_biomarkers` → `biomarker_hub`; category resolution via `categories` / `category_aliases` / `provider_section_category_map` and the `resolve_canonical_category` / `category_text_to_canonical` functions.
- Quality controls in place: `strip_biomarker_junk()` trigger, `known_scrape_junk_labels`, `get_biomarker_validation_issues()`, `biomarker_audit_runs`, `npm run audit:biomarker-references`, `src/utils/is-junk-test-name.ts` (unit-tested), and the £1-floor suspicious-price quarantine in `upsertWithProvenance.ts`.
- Provenance: `description_scraped` / `description_source` (`scraped_verbatim`) on `provider_tests`; `scrape_runs` and `product_change_log` record ingestion history. Provenance is strong for **catalogue** data.

### 4. Document / result / health-record functionality

- `uploaded_test_results` (2 rows) with a private `test-results` storage bucket; access via `healthDataApi.getSecureFileUrl()` issuing one-hour signed URLs.
- `biomarker_readings`, `user_health_data`, `user_health_scores`, `health_insights`, `test_results` — all tabled, typed, RLS-enabled and wired into `src/api/supabase/healthData.api.ts`, all empty.
- Interop: `fhir_export_jobs`, `clinical_fhir_bundles`, LOINC/SNOMED mapping tables, `import_terminology_codes()`, `guard_primary_terminology_code()` trigger, and a contract test at `src/lib/__tests__/fhirExport.contract.test.ts`.
- Audit: `log_data_access_with_reason` RPC wrapped by `src/lib/audit/logAccess.ts` with typed reason codes and C0–C4 classification; `audit_logs`, `admin_activity_log`, `role_audit_log`, `audit_retention_policy`, `apply_audit_retention()`, `siem_export_cursor`.
- Encryption: `EncryptionService` (unit-tested), `encryption_keys` table, `validate_encrypted_fields()` trigger, `encrypt-sensitive-data` edge function, `/admin/encryption-status` page.

### 5. Storage buckets (live)

| Bucket | Public | Size limit | MIME allow-list |
| --- | --- | --- | --- |
| `test-results` | no | none | none |
| `videos` | no | none | none |
| `provider-test-images` | **yes** | none | none |

### 6. Existing automated tests

- 29 Vitest files. Health-adjacent coverage: `fhirExport.contract.test.ts`, `EncryptionService.test.ts`, `securityPatterns.test.ts`, `socWatchUtils.test.ts`, `BiomarkerAnalysisResult.test.tsx`, `RecommendationResults.test.tsx`, `testFinder/scoring.test.ts`, `is-junk-test-name.test.ts`.
- 13 Playwright specs, split across a legacy `e2e/` directory and the configured `tests/e2e/` directory (`playwright.config.ts` `testDir: ./tests/e2e`) — the `e2e/` specs are **not** run by `npm run test:smoke`.
- CI: 9 GitHub workflows including `security-scan`, `dependency-audit`, `migration-parity`, `category-mapping-regression`, `biomarker-reference-audit`, `nav-slug-audit`, `sitemap-validation`, `e2e`.
- **No test asserts RLS behaviour**, no test exercises upload → parse → reading persistence, and no test covers consent capture or audit-log emission.

---

## NOT VERIFIED BECAUSE PRODUCTION DB IS EXTERNAL

The Supabase project is external/unmanaged by Lovable. Read-only SQL **was** available through the Lovable Supabase read tool and was used for the counts above; the service-role key is **not** stored. The following therefore remain unverified:

1. **Policy bodies.** Only policy *counts* and `relrowsecurity` flags were read. The `USING` / `WITH CHECK` expressions of the single-policy `clinical_*` tables were not inspected, so it is not established whether they are admin-only, service-role-only, or unintentionally permissive.
2. **GRANT state in production.** `scripts/check-rls-grants.mjs` validates migration files, not the live catalogue. Live `information_schema.role_table_grants` was not audited.
3. **Storage object policies.** Bucket flags were read; `storage.objects` policies for `test-results` were not.
4. **Drift between migrations and live schema.** 140 live public tables versus 78 `CREATE TABLE` statements in migrations implies substantial out-of-band schema (partitions such as `*_2025…2028` account for some, but not all). `.github/workflows/migration-parity.yml` exists but its last result was not checked.
5. **Auth configuration** — password policy, leaked-password protection, MFA enforcement, JWT expiry, redirect allow-list. Not readable without dashboard access.
6. **Backups, PITR and retention settings.** `docs/BACKUP_RESTORE_TEST_RUNBOOK.md` documents intent; live configuration unverified.
7. **Cron job inventory.** `cron.job` contents were not read in this pass.
8. **Production deployment.** `myhealthcheckup.co.uk` was previously observed returning 404 on `/`; unchanged and unverified here.

---

## RECOMMENDED ACTIONS

### Prerequisites before Phase 1 (hard gates)

| # | Action | Why |
| --- | --- | --- |
| P0-1 | Commit `docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md` and `docs/BUILD_TRACKER.md` | Phase 0 cannot be assessed or closed without the plan and acceptance criteria |
| P0-2 | Re-run this audit as a true gap analysis once P0-1 lands | Section 5 of the brief (naming collisions) is unanswerable today |
| P0-3 | Dump and review the `USING`/`WITH CHECK` body of every policy on the eight `clinical_*` tables, `encryption_keys`, `biomarker_hub` | Single-policy tables holding health data are the highest-risk unknown |
| P0-4 | Resolve migration/live-schema drift; confirm `migration-parity` is green | Building Phase 1 on an undocumented schema repeats the problem |
| P0-5 | Confirm whether the empty `clinical_*` / `ai_operation_logs` / `funnel_events` / `seo_*` scaffolding is being kept or retired | Prior guidance flags ~25 empty zero-trigger tables; Phase 1 must not build on abandoned scaffolding |

### Naming-collision candidates to check against the plan

`health_insights`, `biomarker_readings`, `uploaded_test_results`, `test_results`, `user_health_data`, `user_health_scores`, `clinical_biomarker_history`, `clinical_reference_ranges`, `clinical_consent_records`, `user_consents`, `data_sharing_grants`, `biomarker_hub`. Note the pre-existing **duplication risk**: `user_consents` vs `clinical_consent_records`, and `clinical_biomarker_history` vs `biomarker_readings` — two candidate homes each for consent and for longitudinal readings. The plan must pick one of each; do not add a third.

### Security, privacy, provenance and audit gaps

1. Set an explicit `file_size_limit` and MIME allow-list on `test-results`; health documents currently accept any type at any size.
2. Confirm `storage.objects` policies scope `test-results` reads to the owning user.
3. `user_consents` is empty and no UI writes to it — consent capture is a Phase 1 prerequisite for any health-record processing under UK GDPR Article 9.
4. Provenance rigour exists for catalogue data but has **no equivalent for user-derived health data** — `biomarker_readings` has no source/parser/confidence/verified-by column set comparable to `description_source`.
5. `log_data_access_with_reason` fails soft and is only called where a developer remembers to call it; consider a trigger-backed guarantee on C3/C4 tables.
6. Retention: `audit_retention_policy` + `apply_audit_retention()` cover logs; there is **no documented retention or erasure path for uploaded health documents or derived readings**.
7. `OPENAI_API_KEY` remains invalid — `ai-human-context` has silently served non-AI fallbacks since 23 July 2026. Any Phase 1 feature depending on interpretation inherits this failure.

### Regression coverage required for Phase 1

| Area | New test |
| --- | --- |
| RLS | Integration tests proving user A cannot read user B's `uploaded_test_results`, `biomarker_readings`, `health_insights` |
| Storage | Signed-URL expiry and cross-user object-access denial |
| Upload pipeline | Upload → parse → `biomarker_readings` persistence, including malformed-document handling |
| Consent | Consent required before processing; withdrawal blocks further reads |
| Audit | Every C3/C4 read emits an `audit_logs` row with a reason code |
| Terminology | LOINC/SNOMED mapping resolution and the `guard_primary_terminology_code` trigger |
| Marketplace non-regression | Extend `tests/e2e/render-smoke.spec.ts` to assert catalogue, compare and provider-detail routes still render |
| Housekeeping | Fold the legacy `e2e/` specs into `tests/e2e/` so CI actually runs them |

---

## Files and objects inspected

`docs/` (listing), `supabase/migrations/` (279 files, aggregate grep), `supabase/functions/` (listing, 66), `src/routes/` (listing, 145), `src/api/supabase/healthData.api.ts`, `src/lib/audit/logAccess.ts`, `src/hooks/use-auth.ts`, `src/lib/testFinder/supabaseAdapter.ts`, `src/types/entities.ts`, `src/lib/mcp/index.ts`, `package.json`, `playwright.config.ts`, `CLAUDE.md`, `roadmap.md`, `.github/workflows/`, and read-only queries against `information_schema`, `pg_class`, `pg_policy` and `storage.buckets`.

---

## SECOND PASS — 14 September 2026: live read-only verification

This pass resolved several items previously listed as "not verified". All queries were read-only (`pg_policy`, `pg_class`, `pg_trigger`, `information_schema`, `storage.buckets`, `supabase_migrations.schema_migrations`). Nothing was written to the database.

### Correction to the first pass

The first pass flagged the eight `clinical_*` tables and `encryption_keys` as "one policy each — likely admin-only blanket policies with no user-scoped read path" and called it the highest-risk unknown. **Reading the policy bodies shows this concern was wrong.** The single policies are `FOR ALL` and are correctly user-scoped.

### Verified policy bodies — `clinical_*`

| Table | Policy | Cmd | Expression |
| --- | --- | --- | --- |
| `clinical_biomarker_history` | `user_biomarker_history` | ALL | `auth.uid() = user_id OR has_role(auth.uid(),'admin')` |
| `clinical_consent_records` | `user_consent_records` | ALL | same |
| `clinical_fhir_bundles` | `user_fhir_bundles` | ALL | same |
| `clinical_gp_notifications` | `user_gp_notifications` | ALL | same |
| `clinical_patient_uploads` | `user_clinical_uploads` | ALL | same |
| `clinical_loinc_mappings` | `admin_loinc` | ALL | `has_role(auth.uid(),'admin')` |
| `clinical_reference_ranges` | `admin_ref_ranges` | ALL | `has_role(auth.uid(),'admin')` |
| `clinical_snomed_mappings` | `admin_snomed` | ALL | `has_role(auth.uid(),'admin')` |

Related: `encryption_keys` is admin-read-only to `authenticated`; `biomarker_readings`, `uploaded_test_results`, `health_insights`, `fhir_export_jobs` and `data_sharing_grants` all carry per-command `auth.uid() = user_id` policies. `health_insights` additionally blocks user deletes (`USING false`) and restricts inserts to admin/moderator. `biomarker_hub` has one permissive `SELECT … USING (true)` policy — acceptable for a public biomarker catalogue.

Residual observations (not defects, worth deciding on):
- The `clinical_*` `ALL` policies have no separate `WITH CHECK`, so Postgres reuses `USING`. Functionally correct; an explicit `WITH CHECK` would be clearer.
- Those policies are granted to `PUBLIC` rather than `TO authenticated`. `auth.uid()` is null for `anon`, so no rows leak, but scoping them to `authenticated` is tidier and matches the newer policies on `fhir_export_jobs` / `data_sharing_grants`.

### Verified `storage.objects` policies for `test-results`

Four policies (SELECT, INSERT, UPDATE, DELETE), each gated on `bucket_id = 'test-results' AND auth.uid()::text = (storage.foldername(name))[1]`. **Per-user object isolation is enforced, provided uploads are always written under a `<uid>/` prefix** — that prefix convention is a code-side invariant with no database constraint behind it and no test asserting it.

Bucket flags unchanged: `test-results` private, `videos` private, `provider-test-images` public. **`test-results` still has no `file_size_limit` and no `allowed_mime_types`** — the first-pass recommendation stands.

### Migration / live-schema parity

| Metric | Value |
| --- | --- |
| Migration files committed in `supabase/migrations/` | 279 |
| Rows in `supabase_migrations.schema_migrations` | 393 |
| Earliest / latest applied version | `20250714231842` / `20260912113814` |
| Public base tables live | 121 (16 of them `*_2025…2028` partitions) |

**~114 migrations have been applied to production with no corresponding committed file.** The latest applied version equals the latest committed version, so the repository is not behind at the head — the gap is historical, out-of-band changes made through the dashboard or ad-hoc SQL.

`scripts/check-migration-parity.mjs` only validates local filename shape and duplicate versions; by its own comment it defers the remote comparison to `.github/workflows/migration-parity.yml`. The remote half of that check is therefore the only thing that would have caught this, and the 114-file gap indicates it is either not running, not failing, or not enforced.

### Auth / profile model

- 3 rows in `auth.users`; 5 rows in `user_roles`; one non-internal trigger on `auth.users` (`handle_new_user_profile`).
- **Two competing profile tables.** `public.profiles` (4 columns: `id`, `email`, `display_name`, `created_at`) holds **0 rows**. `public.user_profiles` (18 columns, including `date_of_birth`, `gender`, `phone_number`, address and emergency-contact fields) holds **2 rows**. The `auth.users` trigger is named for `profiles`, yet `profiles` is empty while `user_profiles` is populated — so either the trigger targets `user_profiles`, or it is failing silently, or `profiles` is dead.
- This must be resolved before Phase 1: a health-intelligence layer needs one unambiguous demographic record (date of birth and sex drive reference-range selection).

### Items still not verified

Auth provider configuration (password policy, leaked-password protection, MFA enforcement, JWT expiry, redirect allow-list), backup/PITR settings, live `role_table_grants`, and `cron.job` contents remain unreadable without Supabase dashboard access. Production deployment status of `myhealthcheckup.co.uk` is unchanged and unverified.

### Second-pass additions to recommended actions

| # | Action |
| --- | --- |
| P0-6 | Decide `profiles` vs `user_profiles` as the single demographic record; migrate or drop the loser (as its own reviewed migration, not in Phase 1) |
| P0-7 | Investigate the 114 uncommitted production migrations; backfill marker files per `docs/MIGRATION_HISTORY.md` and confirm the remote parity workflow actually fails on drift |
| P0-8 | Add `file_size_limit` and `allowed_mime_types` to the `test-results` bucket |
| P0-9 | Add a regression test asserting uploads are written under `<uid>/`, since the storage policy depends entirely on that prefix |
| P0-10 | Optional hardening: add explicit `WITH CHECK` and `TO authenticated` to the eight `clinical_*` policies |

### Phase 0 tracker status (P0.01–P0.11)

**Not assessable.** `docs/BUILD_TRACKER.md` and `docs/build-tracker.json` are absent, so the text of P0.01–P0.11 and their acceptance criteria are unknown. No tracker item has been marked complete, and no tracker file was created or edited. Once the tracker is supplied, the evidence above should map onto it directly — in particular the RLS, storage-policy, parity and auth-model items, which are now evidenced rather than assumed.

---

## THIRD PASS — 14 September 2026: W1, W2 and W6

Read-only. No schema, data, route or function was modified. Nothing was deleted or migrated.

### W1 — `profiles` vs `user_profiles`: RESOLVED

**`user_profiles` is the active demographic model. `public.profiles` is dead.** This is now settled by evidence, not inference.

**1. The trigger writes to `user_profiles`.** The body of `handle_new_user_profile()` (SECURITY DEFINER, `search_path = ''`) parses `first_name`/`last_name` from `raw_user_meta_data`, falling back to splitting `full_name` for OAuth signups, then performs three inserts:

```
INSERT INTO public.user_profiles (user_id, first_name, last_name) ...
INSERT INTO public.user_preferences (user_id) ...
INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
```

It never touches `public.profiles`. The earlier concern that the trigger was named for `profiles` and failing silently is wrong — the name is simply misleading. Row counts corroborate: `user_profiles` 2, `user_preferences` 2, `user_roles` 5, `profiles` 0.

**2. No code reads or writes `public.profiles`.** A repository-wide search for `.from("profiles")` returns nothing in `src/`, `supabase/functions/` or `scripts/`. The one apparent hit — `supabase/functions/encryption-status/index.ts` — uses `profiles` as a local JavaScript variable name while selecting `.from("user_profiles")`. Every real consumer targets `user_profiles`: `src/api/supabase/users.api.ts` (whose `UserProfile` interface mirrors the 18-column shape exactly), `src/services/EncryptionService.ts`, `src/pages/AdminEncryptionStatusPage.tsx`, `supabase/functions/encrypt-sensitive-data`, `encryption-status`, `send-test-notification`, `security-alert-notify`, and `scripts/backup-restore-test.sh`. The only remaining reference to `profiles` anywhere is its generated row type in `src/integrations/supabase/types.ts`, which is produced from the live schema and is not a usage.

**3. `profiles` has no dependents and is unreachable through the Data API.**

| Dependent kind | Result |
| --- | --- |
| Inbound foreign keys | none |
| Triggers | none |
| Dependent views | none |
| Outbound constraints | `profiles_pkey`; `profiles_id_fkey → auth.users(id) ON DELETE CASCADE` |
| RLS policies | 3 — `profiles self insert`, `profiles self read`, `profiles self update`, all `auth.uid() = id` |
| **Table grants** | **none — no row in `role_table_grants` for `anon`, `authenticated` or `service_role`** |

The absence of grants is decisive. PostgREST cannot reach the table at all, whatever its policies say. `profiles` could never have accumulated rows through the app.

**4. Field coverage.** `profiles` carries `id`, `email`, `display_name`, `created_at`. `user_profiles` carries `user_id`, `first_name`, `last_name`, `date_of_birth`, `gender`, `phone_number`, four address fields, two emergency-contact fields, `last_login`, `account_status` and timestamps. **Only `user_profiles` holds `date_of_birth` and `gender`**, which Phase 3 requires for reference-range selection.

**Recommendation (not executed):** adopt `user_profiles` as the canonical demographic record. Retire `public.profiles` in its own reviewed, reversible migration, separate from any feature work, and rename `handle_new_user_profile()` to match the table it actually writes to. Dropping it is zero-risk on current evidence: no data, no grants, no dependents, no code path. Note the differing key convention — `profiles.id` **is** the auth user id, while `user_profiles` uses a surrogate `id` plus a `user_id` column. Health Intelligence `health_profiles` should follow the `user_profiles` convention, since profiles must eventually be separable from accounts to support family profiles.

### W2 — Migration drift: ENUMERATED AND CLASSIFIED

Exact set difference between `supabase_migrations.schema_migrations` (393 rows) and the 14-digit prefixes of the 279 committed files:

| Set | Count |
| --- | --- |
| Applied and committed | 267 |
| Applied with **no** committed file | **126** |
| of which: timestamp near-miss (within 10s of a committed file) | 12 |
| of which: **true orphans** | **114** |
| Committed but never applied remotely | 0 |

The 114 figure in the second pass was correct; the extra 12 are the previously documented `+1s` CLI skew recurring (`20260705225139 → …135`, `20260719143122 → …121`, `20260721105637 → …633`, and nine more). `docs/MIGRATION_HISTORY.md` records the same class of drift being reconciled on 2026-07-05; every one of these 12 postdates that reconciliation, so the skew was not eliminated, only cleared once.

**The history is not lost.** `schema_migrations` stores `name`, `created_by` and the full `statements` array, so each orphan is fully attributable and recoverable. Classification of all 114 by statement content:

| Class | Count | Reading |
| --- | --- | --- |
| Data-only DML (INSERT/UPDATE/DELETE) | 62 | Catalogue maintenance — junk-row cleanup, category normalisation, deduplication, price and stock corrections per provider. No schema effect. |
| Security: policies, RLS, GRANT/REVOKE | 17 | e.g. `revoke_truncate_on_mfa_backup_codes`, `restrict_comparison_test_groups_to_read_only` |
| Views | 7 | Mostly repeated `ALTER VIEW unified_provider_tests SET (security_invoker = true)` |
| `ALTER TABLE … ADD COLUMN` | 8 | e.g. `add_image_is_stock_flag`, `biomarker_canonical_phase1_add_columns` |
| `CREATE TABLE` | 4 | `image_audit_results`, `provider_test_biomarkers_link_table`, biomarker taxonomy, junk guard |
| Functions and triggers | 3 | |
| Cron | 3 | |
| Indexes | 1 | `drop_unused_indexes` is classified separately under Other |
| Destructive | 1 | `biomarker_drop_archives` — explicitly authorised, preceded by `biomarker_preserve_archive_variants` |
| Other | 8 | FK additions, whitelist fixes, privilege-escalation trigger removal |

**Assessment:** this is not mysterious out-of-band SQL. It is the site owner's own work applied through the Lovable migration tool and never written back as files — 62 of 114 are pure catalogue data maintenance that arguably never belonged in version control anyway. The genuinely schema-bearing subset is **13 migrations** (4 CREATE TABLE, 8 ADD COLUMN, 1 destructive) plus 17 security changes, and every one is named, dated, attributed and recoverable verbatim from `statements`.

Materially, the `biomarker_canonical_phase1…phase4` sequence of 29 August is the most significant: it establishes `biomarker_hub` as the canonical biomarker entity, resolves 18 case-duplicate pairs, links LOINC and SNOMED to it by id, adds a taxonomy mapping table, and creates `provider_test_biomarkers`. **That work is a direct partial implementation of the Phase 3 biomarker ontology, done ahead of the programme and uncommitted.** It changes the Phase 3 starting position — see W6.

**Is remote drift actually enforced? Almost certainly not.** `.github/workflows/migration-parity.yml` does contain a genuine remote diff (`psql` against `SUPABASE_DB_URL`, `comm` on both directions, tolerating one trailing `+1s` pair). But the step is guarded by:

```yaml
if: ${{ secrets.SUPABASE_DB_URL != '' }}
```

GitHub does not expose the `secrets` context to step-level `if` expressions — the documented contexts there are `github`, `needs`, `strategy`, `matrix`, `job`, `runner`, `env`, `vars`, `steps` and `inputs`. The condition therefore cannot evaluate truthy, and the remote half of the check is skipped on every run while the job still reports green. That is consistent with 114 orphans accumulating unnoticed. Additionally, the `pull_request` trigger is path-filtered to `supabase/migrations/**`, so a migration applied through the tool without a file touches no path and opens no PR — nothing triggers the check at all. **This must be confirmed against actual Actions run logs before it is treated as established**; the reasoning is from GitHub's documented context availability, and the run logs were not readable from this session.

### W6 — Architecture gap mapping

Planned canonical entities from project knowledge, mapped against the live schema. Decisions are **proposed, not executed.**

#### Identity and profile

| Planned | Existing | Class | Proposed decision |
| --- | --- | --- | --- |
| `auth.users` | `auth.users`, 3 rows | EXISTS AND USABLE | Keep |
| `health_profiles` | `user_profiles` (2 rows) is an *account* profile, not a health profile; no subject-separable record exists | MISSING | **New.** A health profile is the subject of measurement and must support family members, so it cannot be 1:1 with an account. `user_profiles` stays as the account record |
| `profile_memberships` | none | MISSING | New |
| `profile_relationships` | none | MISSING | New |
| `consent_records` | `user_consents` (10 cols, 0 rows) and `clinical_consent_records` (12 cols, 0 rows) — two empty competing models | COLLISION | **Extend one, retire the other.** `clinical_consent_records` is the better shape (`expires_at`, `ip_hash`, `metadata`, `version`) and is already referenced by `clinical_patient_uploads.consent_record_id`. Both are empty, so this is cost-free now and expensive later |

#### Biomarker

| Planned | Existing | Class | Proposed decision |
| --- | --- | --- | --- |
| `biomarkers` | `biomarker_hub` — 1,552 rows, 45 columns, already declared canonical by the uncommitted 29 Aug phase-1 work, HNSW pgvector `embedding`, public read policy | COLLISION (name only) | **Keep and extend `biomarker_hub`.** Do not create a `biomarkers` table. Renaming would break the public catalogue, `match_biomarkers()`, the Human Context Engine and 4,434 mapping rows for no gain |
| `biomarker_aliases` | none as a table; case-duplicate resolution and `variant_content` provenance exist on the hub | MISSING | New, keyed to `biomarker_hub.id` |
| `biomarker_loinc_mappings` | `clinical_loinc_mappings` (47 rows, 23 cols) and `clinical_snomed_mappings` (47 rows), both already linked to the canonical biomarker by id with provenance columns | EXISTS AND USABLE | Keep. Rename is unnecessary |
| `biomarker_units` / `biomarker_unit_conversions` | none | MISSING | New. Versioned conversions are a hard requirement for cross-provider comparability |
| `biomarker_categories` | `biomarker_category_map` (46 rows) plus the 29 Aug taxonomy table | EXISTS AND USABLE | Keep, verify coverage |
| `biomarker_reference_definitions` | `clinical_reference_ranges` (13 cols, **0 rows**) — has `sex`, `age_min_years`, `age_max_years`, `population`, `source` | EXISTS BUT EMPTY | Keep the shape, populate it. Note it keys on `biomarker_code`/`loinc_code`, not the canonical biomarker id — add the id link |

#### Results

| Planned | Existing | Class | Proposed decision |
| --- | --- | --- | --- |
| `source_documents` | `clinical_patient_uploads` (13 cols, 0 rows) — `file_ref`, `mime_type`, `file_size_bytes`, `status`, `consent_record_id`; and `uploaded_test_results` (11 cols, **2 rows**) which conflates document, report and parsed payload in one row | EXISTS BUT UNSUITABLE | **Extend `clinical_patient_uploads`** as the document record. Migrate the 2 `uploaded_test_results` rows and retire that table — its `parsed_data` jsonb blob is exactly the undifferentiated shape the observation contract exists to replace |
| `diagnostic_reports` | `test_results` (14 cols, 0 rows) is report-shaped (`result_date`, `pdf_url`, `provider_id`, `reviewed_by_professional`) but stores results as a `biomarker_results` jsonb blob | EXISTS BUT UNSUITABLE | **New `diagnostic_reports`.** `test_results` is empty and predates the contract; retire it rather than bend it |
| `specimens` | none | MISSING | New |
| `observations` | `biomarker_readings` (12 cols, 0 rows) and `clinical_biomarker_history` (18 cols, 0 rows) — two empty competing models | COLLISION | **New `observations`.** Neither is adequate: `biomarker_readings` has no provenance, no canonical/source value split, no validation or verification state; `clinical_biomarker_history` is closer (`source_upload_id`, `source_type`, `lab_name`, `loinc_code`) but carries `ai_interpretation` and `trend_direction` *on the observation row*, which violates the rule that AI never creates a trusted clinical observation and that trend mathematics is derived, not stored as fact. Both are empty — retire both |
| `observation_components` | none | MISSING | New |
| `reference_ranges` | `clinical_reference_ranges` is a *definitions* table, not the historical range attached to an observation | EXISTS BUT UNSUITABLE for this role | Keep it as `biomarker_reference_definitions`; create a separate per-observation historical range record, as the rule that historical ranges remain attached to each observation requires |
| `observation_provenance` | none. The catalogue side has strong provenance (`upsertWithProvenance.ts`, `scrape_runs`, `product_change_log`); the health side has none | MISSING | New. Model it on the catalogue pattern |
| `extraction_jobs` / `extraction_items` | none. `scraping_jobs` and `scrape_operations` are catalogue-side and must not be reused | MISSING | New |
| `validation_events` | none | MISSING | New |
| `verification_records` | none. No table anywhere carries a patient-verification state | MISSING | New. This is the gate between draft and trusted — nothing currently implements it |

#### Longitudinal

| Planned | Existing | Class | Proposed decision |
| --- | --- | --- | --- |
| `health_events` | none | MISSING | New |
| `biomarker_series` | `clinical_biomarker_history` (0 rows) is the nearest, but is per-reading not per-series | EXISTS BUT UNSUITABLE | New, derived from `observations` |
| `trend_snapshots` | none | MISSING | New |
| `retest_rules` / `retest_events` | none at all | MISSING | New. The whole Phase 4 differentiator is greenfield |
| `reminders` | `price_alert_preferences` (0 rows) and `notification_history` (0 rows) are commercial-alert plumbing | EXISTS BUT UNSUITABLE | New. Keep the commercial tables separate — mixing them would entangle clinical prompts with affiliate messaging and breach commission independence |
| `recommendation_events` | `recommendation_history` (13 cols, 0 rows) | EXISTS BUT EMPTY | Inspect and likely extend |

#### Sharing and audit

| Planned | Existing | Class | Proposed decision |
| --- | --- | --- | --- |
| `share_links` / `share_permissions` | `data_sharing_grants` (16 cols, 0 rows) — `access_token_hash`, `scope`, `expires_at`, `revoked_at`, `revoked_reason`, `last_accessed_at`, `access_count` | EXISTS AND USABLE | **Keep and extend.** This already covers expiry, revocation and access counting; it needs a per-scope permission child table |
| `access_events` | `data_access_requests` (0 rows); `log_data_access()`, `log_data_access_with_reason()` and `log_sensitive_data_access()` triggers exist | PARTIAL | Extend the existing audit path rather than build a parallel one |
| `audit_logs` | `audit_logs` — **6 rows, live, 14 columns** including `reason_code`, `purpose`, `data_classification`, `siem_exported_at` | COLLISION (name) — EXISTS AND USABLE | **Keep and extend.** The planned entity and the live table are the same thing. Do not create a second one |

#### AI and platform

| Planned | Existing | Class | Proposed decision |
| --- | --- | --- | --- |
| `ai_requests` / `ai_outputs` | `ai_operation_logs` (partitioned 2025–2028), live and written by `ai-human-context` | PARTIAL | Extend; splitting request from output is worthwhile for source-grounded Q&A |
| `ai_prompt_versions` | `ai_prompt_versions` — **exists, 9 cols, 0 rows**: `prompt_key`, `version`, `content`, `job_type`, `is_active`, `created_by` | COLLISION (name) — EXISTS AND EMPTY | **Keep.** The shape is right and matches the planned entity. Populate rather than replace |
| `model_versions` | none | MISSING | New |
| `system_events` / `error_events` | `operational_alerts`, `soc_incidents`, `edge_function_logs`, `cron_run_log` | EXISTS AND USABLE | Keep |

#### Summary

| Class | Count |
| --- | --- |
| EXISTS AND USABLE | 9 |
| EXISTS BUT UNSUITABLE / EMPTY | 7 |
| COLLISION (name clash needing a decision) | 5 |
| MISSING | 19 |

**Five name collisions require a ratified decision before any Phase 1 migration**, or a migration will clash with a live table: `biomarkers`/`biomarker_hub`, `audit_logs`, `ai_prompt_versions`, `consent_records`, and `observations`/`reference_ranges` against the existing clinical tables. The proposed resolution in every case is to extend what exists rather than introduce a parallel structure.

**Observation contract readiness:** no existing table supplies more than roughly half the required fields. `clinical_biomarker_history` is closest and still lacks the source/canonical value split, specimen, method, source page and text, extraction method and confidence, validation status, verification status and verifier. Phase 1 designs `observations` fresh.

### Tracker effect

`P0.05` moves to COMPLETE — the model is determined and evidenced; execution of the retirement is worklist W1 and remains open. `P0.02` and `P0.08` stay IN PROGRESS. `P0.09` moves from BLOCKED to IN PROGRESS: the mapping is complete against project knowledge, and only ratification of the five collision decisions is outstanding. Blocker B3 is downgraded — project knowledge supplied the entity list the missing blueprint would have.

---

## FOURTH PASS — 14 September 2026: safe remediation executed

This pass changed code, CI and one bucket setting. It changed **no** production table, no
production data, no schema, and nothing in the marketplace, provider, catalogue, SEO or
referral surfaces.

### W2 — Migration parity enforcement: FIXED

Full inventory and the exclusion policy now live in `docs/MIGRATION_RECONCILIATION.md`.

Two independent holes meant drift could never be detected, which explains its accumulation:

1. `.github/workflows/migration-parity.yml` gated the remote diff on
   `if: ${{ secrets.SUPABASE_DB_URL != '' }}`. GitHub does not expose the `secrets` context
   to step-level `if`, so the condition never evaluated truthy, the remote half never ran,
   and the job still reported green.
2. The `pull_request` trigger was path-filtered to `supabase/migrations/**`, so a migration
   applied through the tool without a file touches no path and opens no PR.

Remediation:

| Change | Artefact |
| --- | --- |
| Secret moved to job-level `env`; steps test `env.SUPABASE_DB_URL != ''` | `.github/workflows/migration-parity.yml` |
| Visible warning annotation when the secret is absent, so a skipped remote check is never silent | same |
| Daily schedule (`17 6 * * *`) plus `workflow_dispatch` | same |
| Remote comparison extracted from inline bash to a reviewable script that exits non-zero when the URL is missing | `scripts/check-remote-migration-parity.mjs` |
| Comparison logic isolated and pure; the `+1s` skew tolerance is now explicit and narrow (trailing version only, exactly one second, nothing else differing) and is reported in the log when applied rather than silently swallowed | `scripts/lib/migration-parity-core.mjs` |
| Fixture self-test proving the checker fails on deliberate drift — no production access | `src/lib/ci/__tests__/migration-parity.test.ts` |

**Verified:** 8 of 8 fixture tests pass. **Not yet verified:** the live remote diff, because
`SUPABASE_DB_URL` is not present in repository secrets. Until it is, CI warns and the remote
half is genuinely unproven. No historical SQL was invented, replayed or backfilled.

### W4 — `test-results` bucket hardening: PARTIAL

Before: private, `file_size_limit` null, `allowed_mime_types` null — any authenticated user
could place a file of any type and any size under their own prefix.

After (set through `supabase--storage_update_bucket`, not raw SQL; re-read from
`storage.buckets` to confirm): `file_size_limit = 20971520` (20 MB), `public = false`.

Rationale for 20 MB: UK laboratory PDF reports are typically well under 2 MB; a
multi-page scanned report or a modern phone photograph of a result sheet can reach 8–12 MB.
20 MB accommodates both with headroom while making bulk-storage abuse plainly abnormal. The
previous client-side 10 MB toast was a soft check only and is now replaced by a shared
helper that mirrors the bucket limit.

`provider-test-images` and `videos` were not altered.

**Residual gap — recorded honestly:** the supported bucket operation exposes only
`public` and `file_size_limit`. It has no parameter for `allowed_mime_types`, and raw
`UPDATE storage.buckets` is rejected. The MIME allow-list is therefore enforced in
application code (`assertUploadableFile`) but **not** at the storage layer. Setting
`allowed_mime_types` to PDF, JPEG, PNG, WebP, HEIC and HEIF requires Supabase dashboard
access and is added to W3's dashboard checklist. Until then a determined authenticated
client could still place a disallowed type under its own prefix, bounded by 20 MB.

### W5 — Storage prefix regression: DONE

The four `test-results` policies are all gated on
`auth.uid()::text = (storage.foldername(name))[1]`, so per-user isolation depends entirely on
every upload path writing a `<uid>/` prefix. That invariant was previously held only by an
inline template literal in one component.

- `src/lib/storage/testResultsPath.ts` is now the single place the invariant is expressed:
  `buildTestResultObjectKey(userId, fileName)`, `isOwnedByUser`, `assertUploadableFile`,
  `TEST_RESULTS_MAX_BYTES`, `TEST_RESULTS_ALLOWED_MIME_TYPES`.
- `src/components/dashboard/TestResultUploader.tsx` — the only upload path to the bucket,
  confirmed by search — now uses the helper instead of `${user.id}/${Date.now()}.${ext}`,
  and validates size and type before upload.
- `src/lib/storage/__tests__/testResultsPath.test.ts` asserts the positive invariant and the
  negative security cases: an empty or anonymous id is refused; path traversal in the
  filename is neutralised; another user's id embedded in the filename cannot coerce the
  prefix; ownership checks reject cross-user keys; oversized and disallowed types are
  rejected.
- `.github/workflows/unit-tests.yml` added, running the full vitest suite on push, pull
  request and manual dispatch, so neither this suite nor the parity self-test is stranded.

**Verified:** 10 of 10 tests pass (18 of 18 with the parity suite). The tests are
deterministic and create no persistent health data. A live policy-level cross-user probe
against production storage was deliberately not run — it would require a second real session
and would write objects into the bucket holding real user data.

### W1 — Profile model: retirement plan, not executed

`user_profiles` remains canonical on the third-pass evidence. `public.profiles` was **not**
dropped and `handle_new_user_profile()` was **not** renamed in this pass, per instruction.

Retirement plan, to run as one reviewed migration containing nothing else:

1. Pre-flight, re-asserted at execution time, not assumed from this document:
   `select count(*) from public.profiles` is 0; no rows in `pg_depend` / `information_schema`
   referencing it; no grants; no policies; no triggers; no inbound foreign keys.
2. Snapshot: `create table private.profiles_retired_20260914 as select * from public.profiles;`
   retained for one release cycle, so the rollback is a rename rather than a recreation.
3. `drop table public.profiles;`
4. `alter function public.handle_new_user_profile() rename to handle_new_user_signup;` and
   update the `auth.users` trigger to match, in the same transaction.
5. Regenerate `src/integrations/supabase/types.ts` so the dead row type disappears.
6. Regression: a real signup must still produce one `user_profiles`, one `user_preferences`
   and one `user_roles` row; the admin console and dashboard must load unchanged.

Rollback requirements, stated explicitly in the migration comment:
`drop trigger` → rename the function back → `create table public.profiles as select * from
private.profiles_retired_20260914` → restore the original (empty) grant set, which is none.
Because the table is empty and ungranted, rollback restores structure only, and nothing
depends on that structure.

**Tracker consequence:** P0.05 stays COMPLETE — the model is determined and evidenced, which
is what that task asks. P0.08 stays IN PROGRESS and cannot be COMPLETE: the acceptance rule
requires implementation and regression, and the retirement has deliberately not been
implemented. A documentation-only status is not sufficient for P0.08.

### W6 — Architecture direction: RATIFIED AS DIRECTION, NOT EXECUTED

The following are recorded as the ratified architecture direction, on the site owner's
instruction of 14 September 2026. Each is consistent with project knowledge and with the
third-pass evidence. **No destructive retirement has been executed, and no Phase 1 table has
been created.**

| Decision | Direction |
| --- | --- |
| `biomarker_hub` | Keep and extend as the canonical biomarker entity. Do not create `biomarkers`. |
| `audit_logs` | Keep and extend. Do not create a second audit table. |
| `ai_prompt_versions` | Keep. Populate rather than replace. |
| `consent_records` | Extend `clinical_consent_records`; retire `user_consents` later. Both empty today. |
| `observations` | Create new. Do not promote `biomarker_readings` or `clinical_biomarker_history` to the authoritative observation table. |
| `reference_ranges` | Keep `clinical_reference_ranges` as the definitions table; attach a separate historical range to each observation. |
| Source documents | `clinical_patient_uploads` is the source-document base. The 2 `uploaded_test_results` rows migrate later through a controlled migration before that table is retired. |
| `diagnostic_reports`, `specimens` | Create new, later. |
| Sharing | Keep `data_sharing_grants` as the foundation; extend with scoped permissions. |
| Audit and AI infrastructure | Extend what exists rather than duplicate it. |

Rationale for the `observations` decision, restated because it is the one that looks like
duplication and is not: `clinical_biomarker_history` stores `ai_interpretation` and
`trend_direction` on the observation row itself. That violates rule 5 — AI must never create
a trusted clinical observation — and the rule that trend mathematics is derived, never
recorded as fact. All three candidate tables are empty, so the correction is free now and
expensive later.

### Part B — Forth Connect

Recorded in `docs/RESEARCH_FORTH_CONNECT.md`. Summary of the architectural implication for
this audit: Forth is a candidate **fulfilment and ingestion adapter upstream of the canonical
model**, never a replacement for it. The canonical inbound contract in section 4.1 of that
document is now the required shape for every ingestion route — Forth, provider API, FHIR,
PDF upload and manual entry alike — and Phase 2 should be designed against it. Two hard
requirements would gate any integration: we receive and may retain the original laboratory
document for every result, and we hold a contractual right to bulk export on demand and on
exit. Discovery only; no contact, no contract, no code.
