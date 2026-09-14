# Phase 0 — Outstanding audit worklist

**Created:** 14 September 2026
**Companion documents:** `docs/PHASE_0_ARCHITECTURE_AUDIT.md` (findings), `docs/BUILD_TRACKER.md` / `docs/build-tracker.json` (status).

These six items are everything still standing between the current state and a genuinely closed Phase 0. Phase 1 does not begin until all six are resolved or explicitly deferred with a recorded decision. **No production Health Intelligence tables are to be created while this list is open.** The existing marketplace, provider, catalogue, SEO and referral functionality is preserved throughout — none of these actions touches it.

---

## W1 — Resolve `profiles` vs `user_profiles`

**Tracker:** P0.05, P0.08 · **Blocker:** B1 · **Priority:** highest — Phase 1 cannot be designed around an ambiguous identity record.

Current state:

| Table | Rows | Columns | Notes |
| --- | --- | --- | --- |
| `public.profiles` | 0 | 4 (`id`, `email`, `display_name`, `created_at`) | Empty despite an `auth.users` trigger named `handle_new_user_profile` |
| `public.user_profiles` | 2 | 18 (`date_of_birth`, `gender`, `phone_number`, address, emergency contact, …) | Holds the real records |

Actions:

1. Read the body of `handle_new_user_profile()` and confirm which table it actually writes to. If it targets `profiles`, establish why 3 auth users produced 0 rows — a silently failing trigger is itself a defect.
2. Enumerate every code reference to each table (`src/`, `supabase/functions/`, `scripts/`).
3. Decide the single canonical demographic record. `user_profiles` is the presumptive winner on data and field coverage, but the decision must be explicit. Date of birth and sex must live on the winner — they drive reference-range selection in Phase 3.
4. Retire the loser in its own reviewed, reversible migration, separate from any Phase 1 work. Do not fold this into a feature migration.

Acceptance: one profile table; the trigger writes to it and is proven to fire; no code references the retired table; existing auth and marketplace flows regression-tested.

---

## W2 — Investigate the 114 historical migration drift

**Tracker:** P0.02 · **Blocker:** B2 · **Priority:** high — no new schema until this is understood.

Current state: 393 rows in `supabase_migrations.schema_migrations` against 279 committed files in `supabase/migrations/`. Head versions match, so the repository is not behind at the tip; the gap is historical out-of-band change applied via dashboard or ad-hoc SQL.

Actions:

1. Extract the set difference: applied versions with no matching committed filename. Record it as an appendix to the audit document.
2. Classify each: Supabase-managed, a known dashboard action, or genuinely unknown.
3. For anything unknown that affects a table in the Health Intelligence scope, reconstruct its effect from the live schema rather than guessing at the SQL.
4. Backfill marker files where appropriate so future parity checks are meaningful.
5. Establish why the drift was not caught. `scripts/check-migration-parity.mjs` only validates local filename shape and duplicate versions; it defers the remote comparison to `.github/workflows/migration-parity.yml`. Confirm whether that workflow runs, whether it fails on drift, and whether the failure is enforced.

Acceptance: every applied-without-file version classified; the remote parity check demonstrably fails on injected drift.

---

## W3 — Verify dashboard-only settings

**Tracker:** P0.10, X.03, X.10 · **Blocker:** B4 · **Requires Supabase dashboard access — cannot be completed from this session.**

Capture and record:

- **Auth:** password minimum length and strength policy, leaked-password protection, MFA enforcement scope (is it required for admin accounts, or merely available?), JWT expiry, refresh-token rotation, redirect allow-list, email confirmation requirement.
- **Backups and PITR:** whether point-in-time recovery is enabled, retention window, last verified restore. Special-category health data cannot go to production without an evidenced recovery position.
- **Cron:** full `cron.job` inventory with schedules and command bodies. Confirm every scheduled edge-function call uses the vault-backed helpers (`call_edge_with_service_role`, `call_edge_with_automations`) rather than an embedded key.
- **Grants:** live `role_table_grants` for `anon`, `authenticated` and `service_role` across all public tables. RLS is evidenced; the grant layer beneath it is not.

Acceptance: each setting recorded with its value and the date observed, in `docs/PHASE_0_ARCHITECTURE_AUDIT.md`.

---

## W4 — Harden the `test-results` bucket

**Tracker:** P0.10 · **Priority:** medium — small, self-contained, do it before any upload feature exists.

Current state: `test-results` is private with four correct per-user object policies, but has no `file_size_limit` and no `allowed_mime_types`. Any authenticated user can currently place a file of any type and any size under their own prefix.

Actions:

1. Set a file-size limit appropriate to laboratory PDFs and result photographs.
2. Set an explicit MIME allow-list: PDF and common image types only. Anything outside it should be rejected at the storage layer, not merely filtered in the client.
3. Both changes go through `supabase--storage_update_bucket`, not a migration — `UPDATE storage.buckets` SQL is rejected.
4. Confirm the limits are enforced by attempting an oversized and a disallowed-type upload.

Acceptance: limits set and the rejection behaviour observed, not assumed.

---

## W5 — Add a storage prefix regression test

**Tracker:** P0.10 · **Priority:** medium.

The four `test-results` policies are all gated on `auth.uid()::text = (storage.foldername(name))[1]`. Per-user isolation therefore depends entirely on every upload path writing to a `<uid>/` prefix. That invariant is currently held only by convention in application code — there is no database constraint behind it and no test asserting it.

Actions:

1. Add a test asserting that every upload helper produces a key beginning with the authenticated user's id.
2. Add a negative case: an attempt to read or write an object under another user's prefix must be refused by the policy, not merely hidden by the UI.
3. Place it where it runs in CI, alongside the existing security checks rather than as a manual step.

Acceptance: both cases in CI and failing when the prefix logic is deliberately broken.

---

## W6 — Complete the architecture gap mapping

**Tracker:** P0.09 · **Blocker:** B3 · **Priority:** high — this is the last substantive Phase 0 deliverable.

Current state: project knowledge lists the canonical Health Intelligence entities but not the full original specification. The mapping of those entities onto what already exists has not been done.

Actions:

1. Produce a table mapping every canonical entity — identity/profile, biomarker, results, longitudinal, sharing/audit, AI/platform — to one of: **exists and is usable**, **exists but is unsuitable or empty scaffolding**, **collides in name with an existing table**, or **does not exist**.
2. Flag every naming collision explicitly. Known candidates: `biomarkers` against `biomarker_hub`; `audit_logs` (already exists, 14 columns, in active use); `ai_prompt_versions` (already exists); `observations` and `reference_ranges` against `biomarker_readings`, `test_results` and `clinical_reference_ranges`; `consent_records` against both `user_consents` and `clinical_consent_records`.
3. For each collision, record the decision: extend the existing table, or create the new entity under a distinct name. Additive and reversible either way.
4. Check the observation contract field by field against what any existing table can supply, so Phase 1 designs from a known starting point rather than from scratch.
5. If the original blueprint becomes retrievable, reconcile this mapping against it before closing P0.09.

Acceptance: complete entity mapping with a recorded decision for every collision, appended to `docs/PHASE_0_ARCHITECTURE_AUDIT.md`.

---

## Exit condition

Phase 0 closes (P0.11) when W1, W2, W4, W5 and W6 are done and W3 is either done or explicitly deferred with the residual risk accepted in writing. Only then does Phase 1 begin.
