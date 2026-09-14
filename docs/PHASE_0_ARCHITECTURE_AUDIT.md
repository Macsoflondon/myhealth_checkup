# Phase 0 — Architecture Audit (Health Intelligence Master Blueprint)

**Date:** 14 September 2026
**Scope:** Read-only audit of repository and read-only inspection of the connected Supabase project (`clvuioagsgfadynuvodj`).
**Status:** **Phase 0 NOT COMPLETE — blocked.** See "Blockers".

No schema, data, route, component or edge function was modified during this audit. The only write produced by this work is this document.

---

## Blockers

1. **`docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md` does not exist in this repository.** A full-repository search for the filename and for the phrase "Health Intelligence" returned zero matches outside of this audit file. The comparison of the existing implementation against the planned Health Intelligence schema therefore could not be performed. Every "conflict" and "missing prerequisite" statement below is inferred from conventional health-record architecture, **not** from the plan.
2. **`docs/BUILD_TRACKER.md` does not exist in this repository.** The Phase 0 acceptance criteria are unavailable, so Phase 0 cannot be genuinely assessed as met and has not been marked complete.

Both documents must be committed to `docs/` before Phase 0 can be closed.

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
