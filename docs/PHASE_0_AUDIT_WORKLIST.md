# Phase 0 — Outstanding audit worklist

**Created:** 14 September 2026 · **Last updated:** 14 September 2026 (third pass)
**Companion documents:** `docs/PHASE_0_ARCHITECTURE_AUDIT.md` (findings), `docs/BUILD_TRACKER.md` / `docs/build-tracker.json` (status).

These six items are everything still standing between the current state and a genuinely closed Phase 0. Phase 1 does not begin until all six are resolved or explicitly deferred with a recorded decision. **No production Health Intelligence tables are to be created while this list is open.** The existing marketplace, provider, catalogue, SEO and referral functionality is preserved throughout — none of these actions touches it.

| Item | State after the fourth pass (14 Sep 2026) |
| --- | --- |
| W1 profiles vs user_profiles | **Investigation complete; retirement plan and rollback written.** Migration deliberately not executed |
| W2 migration drift | **Parity enforcement fixed and self-tested; inventory and exclusion policy published** (`docs/MIGRATION_RECONCILIATION.md`). Marker backfill and near-miss correction outstanding; live remote diff unproven until `SUPABASE_DB_URL` exists |
| W3 dashboard-only settings | Blocked — needs Supabase dashboard access. Now also carries the `allowed_mime_types` setting from W4 |
| W4 bucket hardening | **Partial.** 20 MB limit set and verified; MIME allow-list not settable through the supported operation, enforced in application code only |
| W5 storage prefix test | **Done.** Shared helper, 10 positive and negative tests, running in CI |
| W6 architecture gap mapping | **Mapping complete; ten decisions ratified as direction.** No retirement executed, no Phase 1 table created |

---

## W1 — Resolve `profiles` vs `user_profiles`

**Tracker:** P0.05 (now COMPLETE), P0.08 · **Blocker:** B1, narrowed to execution only · **Priority:** highest.

### Resolved — `user_profiles` is canonical

Evidence is recorded in full in the third-pass section of the audit document. In summary:

1. `handle_new_user_profile()` inserts into `public.user_profiles`, `public.user_preferences` and `public.user_roles`. It never references `public.profiles`. The trigger name is misleading; it is not failing.
2. No code anywhere reads or writes `public.profiles`. The only apparent hit was a local variable name in `supabase/functions/encryption-status/index.ts`, which selects from `user_profiles`.
3. `profiles` has no inbound foreign keys, no triggers, no dependent views and — decisively — **no table grants to `anon`, `authenticated` or `service_role`**, so PostgREST cannot reach it at all. It could never have received a row through the application.
4. Only `user_profiles` carries `date_of_birth` and `gender`, which Phase 3 reference-range selection requires.

### Remaining actions

1. Retire `public.profiles` in its own reviewed, reversible migration, separate from any feature work. Zero-risk on current evidence: no data, no grants, no dependents, no code path. Include the rollback statement in the migration comment.
2. Rename `handle_new_user_profile()` to match the table it writes, in the same migration.
3. Regenerate `src/integrations/supabase/types.ts` afterwards so the dead `profiles` row type disappears.
4. Record the key-convention decision for Phase 1: `profiles.id` *is* the auth user id, whereas `user_profiles` uses a surrogate `id` plus `user_id`. `health_profiles` follows the `user_profiles` convention, because a health profile must eventually be separable from an account to support family profiles.
5. Regression-test signup end to end — a new auth user must still produce a `user_profiles`, `user_preferences` and `user_roles` row.

**Acceptance:** one profile table; the trigger writes to it and is proven to fire on a real signup; no code or generated type references the retired table; auth and marketplace flows regression-tested.

---

## W2 — Historical migration drift

**Tracker:** P0.02 · **Blocker:** B2, narrowed · **Priority:** high.

### Enumerated

| Set | Count |
| --- | --- |
| Applied and committed | 267 |
| Applied with no committed file | 126 |
| of which timestamp near-miss (`+1s` CLI skew) | 12 |
| of which true orphans | 114 |
| Committed but never applied | 0 |

All 114 are classified in the audit document. The headline: **62 are pure catalogue DML** (junk-row cleanup, category normalisation, deduplication, price and stock corrections), 17 are security changes, and only **13 are schema-bearing** (4 `CREATE TABLE`, 8 `ADD COLUMN`, 1 authorised destructive). Every row carries `name`, `created_by` and the complete `statements` array, so nothing is lost — this is the owner's own work applied through the Lovable migration tool and never written back as files, not unattributed out-of-band SQL.

The 12 near-misses are the `+1s` skew that `docs/MIGRATION_HISTORY.md` records as reconciled on 2026-07-05. All 12 postdate that reconciliation, so the cause was never removed, only cleared once.

**Material finding:** the `biomarker_canonical_phase1…phase4` sequence of 29 August is uncommitted and is a partial early implementation of the Phase 3 biomarker ontology — `biomarker_hub` made canonical, 18 case-duplicate pairs resolved, LOINC and SNOMED relinked by id, a taxonomy mapping table added, `provider_test_biomarkers` created. Phase 3 starts further along than the plan assumes.

### Remaining actions

1. Backfill marker files for the 13 schema-bearing orphans and the 17 security orphans, using the verbatim `statements` text, so the schema history is reproducible from the repository alone. Marker files are no-ops against the live database.
2. Decide whether the 62 catalogue-DML orphans are backfilled or formally excluded. Recommendation: exclude them by policy and state it in `docs/MIGRATION_HISTORY.md` — routine data maintenance does not belong in schema version control, and pretending otherwise guarantees the drift recurs.
3. Correct the 12 near-miss versions the same metadata-only way as the 2026-07-05 pass, with a backup snapshot first.
4. **Fix parity enforcement.** In `.github/workflows/migration-parity.yml` the remote diff step is guarded by `if: ${{ secrets.SUPABASE_DB_URL != '' }}`. GitHub does not expose the `secrets` context to step-level `if`, so the condition cannot evaluate truthy and the remote half is skipped while the job still reports green. Move the secret into a job-level `env` and test `env.SUPABASE_DB_URL != ''`, or drop the guard and let the step fail loudly when the secret is absent.
5. Note the second hole: the `pull_request` trigger is path-filtered to `supabase/migrations/**`, so a migration applied through the tool without a file touches no path and opens no PR. Add a scheduled run so drift is detected on a timer, not only on PR.
6. Verify the fix by injecting a deliberate orphan and confirming CI goes red.

**Acceptance:** schema-bearing and security orphans backfilled or formally excluded by written policy; near-miss versions reconciled; remote parity check demonstrably fails on injected drift, evidenced by an Actions run.

---

## W3 — Verify dashboard-only settings

**Tracker:** P0.10, X.03, X.10 · **Blocker:** B4 · **Requires Supabase dashboard access — cannot be completed from this session.**

Capture and record:

- **Auth:** password minimum length and strength policy, leaked-password protection, MFA enforcement scope (is it required for admin accounts, or merely available?), JWT expiry, refresh-token rotation, redirect allow-list, email confirmation requirement.
- **Backups and PITR:** whether point-in-time recovery is enabled, retention window, last verified restore. Special-category health data cannot go to production without an evidenced recovery position.
- **Cron:** full `cron.job` inventory with schedules and command bodies. Confirm every scheduled edge-function call uses the vault-backed helpers (`call_edge_with_service_role`, `call_edge_with_automations`) rather than an embedded key.
- **Grants:** live `role_table_grants` for `anon`, `authenticated` and `service_role` across all public tables. RLS is evidenced; the grant layer beneath it is not. The `profiles` finding in W1 shows this layer genuinely diverges from the policy layer.

**Acceptance:** each setting recorded with its value and the date observed, in `docs/PHASE_0_ARCHITECTURE_AUDIT.md`.

---

## W4 — Harden the `test-results` bucket

**Tracker:** P0.10 · **Priority:** medium — small, self-contained, do it before any upload feature exists.

Current state: `test-results` is private with four correct per-user object policies, but has no `file_size_limit` and no `allowed_mime_types`. Any authenticated user can currently place a file of any type and any size under their own prefix.

Actions:

1. Set a file-size limit appropriate to laboratory PDFs and result photographs.
2. Set an explicit MIME allow-list: PDF and common image types only. Anything outside it should be rejected at the storage layer, not merely filtered in the client.
3. Both changes go through `supabase--storage_update_bucket`, not a migration — `UPDATE storage.buckets` SQL is rejected.
4. Confirm the limits are enforced by attempting an oversized and a disallowed-type upload.

**Acceptance:** limits set and the rejection behaviour observed, not assumed.

---

## W5 — Add a storage prefix regression test

**Tracker:** P0.10 · **Priority:** medium.

The four `test-results` policies are all gated on `auth.uid()::text = (storage.foldername(name))[1]`. Per-user isolation therefore depends entirely on every upload path writing to a `<uid>/` prefix. That invariant is currently held only by convention in application code — there is no database constraint behind it and no test asserting it.

Actions:

1. Add a test asserting that every upload helper produces a key beginning with the authenticated user's id.
2. Add a negative case: an attempt to read or write an object under another user's prefix must be refused by the policy, not merely hidden by the UI.
3. Place it where it runs in CI, alongside the existing security checks rather than as a manual step.

**Acceptance:** both cases in CI and failing when the prefix logic is deliberately broken.

---

## W6 — Architecture gap mapping

**Tracker:** P0.09 · **Blocker:** B3, downgraded · **Priority:** high.

### Mapping complete

Every canonical entity in project knowledge is mapped against the live schema in the third-pass section of the audit document:

| Class | Count |
| --- | --- |
| Exists and usable | 9 |
| Exists but unsuitable or empty scaffolding | 7 |
| Name collision requiring a decision | 5 |
| Missing | 19 |

**Observation contract readiness:** no existing table supplies more than roughly half the required fields. `clinical_biomarker_history` is closest and still lacks the source/canonical value split, specimen, method, source page and text, extraction method and confidence, validation status, verification status and verifier. Phase 1 designs `observations` fresh.

### Remaining action — ratify the five collision decisions

These are proposals. None has been executed, and a Phase 1 migration written against the plan's literal entity names would clash with a live table in each case.

| Collision | Proposed decision | Why |
| --- | --- | --- |
| `biomarkers` vs `biomarker_hub` | **Keep and extend `biomarker_hub`.** Do not create `biomarkers` | 1,552 rows, already declared canonical by the uncommitted 29 Aug work, HNSW pgvector index, public catalogue read, 4,434 mapping rows, `match_biomarkers()` and the Human Context Engine all depend on it |
| `audit_logs` | **Keep and extend.** Do not create a second | Live with 6 rows and exactly the planned shape, including `reason_code`, `purpose`, `data_classification`, `siem_exported_at` |
| `ai_prompt_versions` | **Keep.** Populate rather than replace | Exists, empty, correct shape |
| `consent_records` vs `user_consents` / `clinical_consent_records` | **Extend `clinical_consent_records`, retire `user_consents`** | Better shape (`expires_at`, `ip_hash`, `metadata`, `version`) and already referenced by `clinical_patient_uploads.consent_record_id`. Both empty, so free now and expensive later |
| `observations` / `reference_ranges` vs `biomarker_readings` / `test_results` / `clinical_reference_ranges` | **New `observations`; retire `biomarker_readings`, `clinical_biomarker_history` and `test_results`; keep `clinical_reference_ranges` as the definitions table and add a separate per-observation historical range** | Neither existing table meets the observation contract. `clinical_biomarker_history` stores `ai_interpretation` and `trend_direction` on the observation row, which violates the rule that AI never creates a trusted observation and that trend mathematics is derived, not recorded as fact. All three are empty |

Also to ratify: `uploaded_test_results` holds the only two rows of real user health data on the platform. The proposal is to migrate them into `clinical_patient_uploads` plus the new `observations` and retire the table — its `parsed_data` jsonb blob is precisely the undifferentiated shape the observation contract exists to replace.

If the original blueprint becomes retrievable, reconcile this mapping against it before closing P0.09.

**Acceptance:** each of the five decisions plus the `uploaded_test_results` decision recorded as ratified, with the ratifying instruction quoted, in `docs/PHASE_0_ARCHITECTURE_AUDIT.md`.

---

## Exit condition

Phase 0 closes (P0.11) when W1, W2, W4, W5 and W6 are done and W3 is either done or explicitly deferred with the residual risk accepted in writing. Only then does Phase 1 begin.

---

## Worklist outcome — 14 September 2026 (fifth pass)

| Item | Outcome |
| --- | --- |
| W1 — profile model | **DONE.** `user_profiles` confirmed canonical; `public.profiles` retired in an isolated reversible migration after a clean live preflight (0 rows, 0 grants, 0 triggers, 0 inbound FKs, 0 dependent views, 0 referencing functions). `handle_new_user_profile()` deliberately not renamed — bound to the reserved `auth.users` trigger; a `COMMENT` records the true target. Signup regression green. |
| W2 — migration drift | **DONE in the repository.** 93 non-executing marker files committed, 33 catalogue-DML versions excluded by written policy, parity tooling enforces both, 12 tests green. No historical DDL or DML replayed. Live remote diff still blocked by B5. |
| W3 — dashboard-only controls | **OPEN, external.** Auth password/MFA policy, backups/PITR, cron inventory, live grants and storage `allowed_mime_types` all require Supabase dashboard access. Application-level enforcement stays in `src/lib/storage/testResultsPath.ts`. Not claimed as verified. |
| W4 — bucket hardening | **DONE as far as the supported interface allows.** `test-results` private, 20 MB limit verified. MIME allow-list enforced in application code; the bucket-level setting is a dashboard residual. |
| W5 — storage prefix | **DONE.** `<uid>/` invariant centralised, 10 positive and negative tests (traversal, prefix spoofing, cross-user) running in CI. |
| W6 — architecture decisions | **DONE.** All ten ratified as direction and now implemented in the groundwork migration: `biomarker_hub`, `audit_logs`, `ai_prompt_versions` and `clinical_consent_records` kept canonical; `observations` created fresh with no interpretation field; per-observation historical ranges; `diagnostic_reports` and `specimens` new; contextual ranges added for cycle-aware modelling. |

**Exit condition restated:** W1, W2, W4, W5 and W6 are done. W3 is not done and cannot be done from this session. Phase 0 therefore stays IN PROGRESS with P0.10 and P0.11 BLOCKED on B4 and B5 — it is not being marked complete on the strength of everything else passing.
