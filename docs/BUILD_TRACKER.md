# Health Intelligence — Build Tracker

**Created:** 14 September 2026
**Source of truth for programme structure:** project knowledge, "HEALTH INTELLIGENCE PLATFORM BUILD RULES".
**Machine-readable mirror:** `docs/build-tracker.json` — the two must be kept in step. If they disagree, this file is authoritative for narrative and the JSON is authoritative for status strings.

This tracker was created locally because `docs/health-intelligence-master-plan` could not be retrieved (see `docs/PHASE_0_ARCHITECTURE_AUDIT.md`, Blockers). It encodes the programme structure now held in project knowledge. If the original blueprint later becomes available, reconcile against it rather than assuming this file is complete.

---

## Status values

| Status | Meaning |
| --- | --- |
| `NOT STARTED` | No work begun. |
| `IN PROGRESS` | Work begun, acceptance criteria not yet met. |
| `BLOCKED` | Cannot proceed until a named blocker is cleared. |
| `COMPLETE` | All five completion conditions evidenced (below). |
| `DEFERRED` | Deliberately postponed by decision, with a recorded reason. |
| `FAILED / REWORK REQUIRED` | Attempted and rejected at verification, security review or regression. |

## Completion rule

A task is `COMPLETE` **only** when all five are evidenced, and the evidence is recorded against the task:

1. **Implementation** — the change exists in the repository.
2. **Verification** — behaviour observed to be correct, not merely rendering.
3. **Security review** — RLS, grants, provenance, least privilege and data-classification impact assessed.
4. **Regression testing** — existing marketplace, provider, catalogue, SEO and referral functionality proven unbroken.
5. **Acceptance criteria** — the task's own stated criteria met.

"It renders" is not completion. A task with four of five conditions stays `IN PROGRESS`.

---

## Gate 0 — Governance

**Status: COMPLETE** — governance constraints are recorded in project knowledge and now bind all subsequent work.

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| G0.1 | Architecture fixed (Supabase/PostgreSQL system of record, no Firebase) | COMPLETE | Project knowledge, "Non-negotiable architecture" 1 |
| G0.2 | Preservation rule (marketplace, provider, catalogue, SEO, referral preserved; additive reversible migrations only) | COMPLETE | Project knowledge, items 2–3 |
| G0.3 | Source-of-truth hierarchy (original laboratory document is source evidence; AI produces drafts only) | COMPLETE | Project knowledge, items 4–5, 8–10 |
| G0.4 | Clinical safety (no autonomous diagnosis, prescribing or definitive clinical decisions; deterministic validation and patient verification precede trust) | COMPLETE | Project knowledge, items 6–7, 13 |
| G0.5 | Marketplace independence (commission must never determine clinical recommendation) | COMPLETE | Project knowledge, item 12 |
| G0.6 | Security baseline (UK GDPR special-category handling, RLS, least privilege, audit, admin MFA, signed URLs, retention) | COMPLETE | Project knowledge, "UK health-data governance" |
| G0.7 | FHIR/LOINC as interoperability target, not a claim of NHS connectivity | COMPLETE | Project knowledge, items 14, "FHIR model" |

---

## Phase 0 — Architecture, database and RLS audit

**Status: IN PROGRESS** — **ten of eleven tasks evidenced** (fifth pass, 14 September 2026). Everything executable from the agent is now done: the migration reconciliation is committed, and `public.profiles` has been retired in an isolated reversible migration after a clean live preflight. The gate stays open for one reason only — the residual P0.10 items all require Supabase dashboard access (auth policy, backups/PITR, cron inventory, live grants, `allowed_mime_types`), and the live remote parity diff needs the `SUPABASE_DB_URL` repository secret. Neither is claimed as verified.

| ID | Task | Status | Evidence / blocker |
| --- | --- | --- | --- |
| P0.01 | Repository architecture audit | COMPLETE | `docs/PHASE_0_ARCHITECTURE_AUDIT.md` — routes, services, data layer, auth, scripts and CI inspected |
| P0.02 | All migrations reviewed | COMPLETE | **Reconciliation executed 14 Sep 2026.** All 126 applied-without-file versions accounted for: **93 non-executing marker files** committed as `supabase/migrations/<version>_reconciliation_marker.sql` (comment-only headers carrying version, class and md5 — the parity checker rejects any marker containing executable SQL), and **33 catalogue-DML versions formally excluded** via `supabase/migrations/.excluded-versions` under the written policy in `docs/MIGRATION_RECONCILIATION.md`. No historical DDL or DML was replayed; no SQL was invented. Parity tooling honours the exclusion registry and rejects malformed entries and excluded-but-committed versions. Local parity passes: 375 files, 93 comment-only markers, 33 excluded. 12 unit tests green. **External verification blocker (B5):** the live remote diff cannot run until `SUPABASE_DB_URL` exists in repository secrets — the script fails loudly rather than reporting a false pass |
| P0.03 | Live table inventory | COMPLETE | 121 public base tables (16 partitions); row counts captured for catalogue and health-record tables |
| P0.04 | RLS policy inventory | COMPLETE | Policy bodies read for all `clinical_*`, health-record and storage objects. User-scoped (`auth.uid() = user_id OR has_role(...,'admin')`); `biomarker_hub` public read by design; `test-results` objects scoped to `<uid>/` prefix |
| P0.05 | Auth and profile model | COMPLETE | **`user_profiles` is canonical.** `handle_new_user_profile()` body read from `pg_proc`: it inserts into `user_profiles`, `user_preferences` and `user_roles`, never `profiles` — the trigger name is misleading, not broken. Zero code references to `public.profiles` anywhere; it has no inbound FKs, triggers or dependent views, and **no table grants at all**, so PostgREST cannot reach it. Only `user_profiles` carries `date_of_birth` and `gender`. Retirement migration is worklist W1 (execution, not investigation) |
| P0.06 | Provider and test catalogue audit | COMPLETE | 904 `provider_tests`; scrape provenance, junk-price quarantine and out-of-stock handling verified in `upsertWithProvenance.ts` |
| P0.07 | Biomarker and test mapping audit | COMPLETE | 1,552 `biomarker_hub` rows; 4,434 `provider_test_biomarkers` links; many-to-many confirmed; 47 `clinical_loinc_mappings` |
| P0.08 | Legacy and duplicate table review | COMPLETE | Duplicates enumerated; ten architecture decisions ratified as direction. **`public.profiles` retired 14 Sep 2026** in an isolated, reversible migration whose comment carries the complete rollback DDL (table, FK, primary key, RLS and all three policies). Live preflight first proved 0 rows, 0 grants, 0 triggers, 0 inbound FKs, 0 dependent views, 0 referencing functions, 0 realtime publications and 0 code references. `handle_new_user_profile()` deliberately **not** renamed — it is bound to the reserved `auth.users` trigger `on_auth_user_created_profile`; a `COMMENT` records the true target instead. Post-migration: `to_regclass('public.profiles')` null, signup trigger intact, `user_profiles` 2 rows, catalogue unchanged (904 / 1,552). Types regenerated; the dead row type is gone. No other legacy table touched |
| P0.09 | Architecture gap report | COMPLETE | All 40 canonical entities mapped against the live schema (9 usable, 7 unsuitable/empty, 5 collisions, 19 missing); observation contract checked field by field. All five collision decisions plus the `uploaded_test_results` decision ratified as architecture direction on 14 Sep 2026 and recorded in `docs/PHASE_0_ARCHITECTURE_AUDIT.md` |
| P0.10 | Security review | BLOCKED | `test-results` unchanged and hardened: private, 20 MB `file_size_limit`, `<uid>/` prefix invariant and MIME allow-list centralised in `src/lib/storage/testResultsPath.ts` with 10 CI regression tests. The new Health Intelligence tables shipped with explicit grants, RLS and least-privilege policies, and the **Supabase linter reports zero issues** after remediation — three `SECURITY DEFINER` helpers were moved into a non-exposed `private` schema so they cannot be called over the API. **Residual, dashboard-only (B4):** `allowed_mime_types` is not settable through the supported bucket operation; auth password/MFA policy, backups/PITR, cron inventory and live `role_table_grants` remain unverifiable from this session and are **not** claimed as verified |
| P0.11 | Phase 0 exit gate | BLOCKED | Ten of eleven tasks COMPLETE with evidence. Held open solely by the P0.10 dashboard residuals (B4) and the absent `SUPABASE_DB_URL` secret (B5). No further Phase 0 item is executable from the agent |

**Phase 0 blockers**

- **B1** — ~~Two competing profile models.~~ **RESOLVED 14 Sep 2026.** `public.profiles` retired; `user_profiles` is canonical and untouched.
- **B2** — ~~114 orphan migrations.~~ **RESOLVED in the repository, 14 Sep 2026.** 93 marker files committed, 33 catalogue-DML versions excluded by written policy, parity tooling enforces both. Live remote verification is tracked separately as B5.
- **B3** — Original master blueprint unretrievable. **Downgraded 14 Sep 2026:** project knowledge supplied the canonical entity list and the gap mapping is complete against it. The narrative plan has been reconstructed locally as `docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md`. Reconcile if the branch ever becomes reachable.
- **B4** — Dashboard-only settings (auth password/MFA policy, backups/PITR, cron inventory, live grants, storage `allowed_mime_types`) unverifiable from this session. **OPEN — needs the site owner.**
- **B5** — `SUPABASE_DB_URL` missing from repository secrets, so the remote migration parity diff in `.github/workflows/migration-parity.yml` cannot run. It fails loudly rather than reporting a false pass. **OPEN — needs the site owner.**

---

## Phase 1 — Health record foundation

**Status: IN PROGRESS** — groundwork schema shipped 14 September 2026 in one additive, reversible migration: **18 tables, 14 enums, explicit grants, RLS on every table, least-privilege policies, Supabase linter clean.** Every table is empty by design. Schema is not a feature: no item below is COMPLETE, because completion requires an ingestion path, patient verification and a user-facing surface, none of which exist yet.

Contracts and pure logic accompanying the schema: `src/types/health-intelligence.ts`, `src/lib/health/release-state-machine.ts`, `src/lib/health/biomarker-series.ts`, `src/services/HealthRecordService.ts`, with 19 unit tests. Typecheck clean; full suite green.

| ID | Task | Status | Evidence |
| --- | --- | --- | --- |
| P1.01 | `health_profiles` | IN PROGRESS | Table created, owner-scoped RLS, separate from `auth.users` so dependant profiles are possible later. No UI |
| P1.02 | Profile relationships and memberships | NOT STARTED | Deferred deliberately; `organisation_members` covers the practitioner side only and grants no health-data access |
| P1.03 | `source_documents` | IN PROGRESS | Table created; `storage_path` is a private object path, never a public URL. No upload path yet |
| P1.04 | `diagnostic_reports` | IN PROGRESS | Table created with the release status machine; owner can read only once released. No ingestion |
| P1.05 | `specimens` | IN PROGRESS | Table created and linked to reports |
| P1.06 | `observations` (full observation contract) | IN PROGRESS | **Authoritative result table.** Carries no interpretation or AI-derived field. Source value, unit and range immutable after insert, enforced by a trigger. Trust requires `verification_status = 'confirmed'`. Cycle day, phase, menstrual status and hormone medication context included |
| P1.07 | `reference_ranges` (historical ranges retained per observation) | IN PROGRESS | `observation_reference_ranges` retains the range that applied at the time; `reference_range_contexts` holds versioned contextual definitions, inactive until clinically signed off |
| P1.08 | `observation_provenance` | IN PROGRESS | Provenance carried on `observations` itself (source document, page, text anchor, extraction method and confidence) rather than a separate table — ratified P0.09 decision |
| P1.09 | `verification_records` | NOT STARTED | Verification state exists on the observation; the confirm/edit/reject audit trail is outstanding |
| P1.10 | Audit logging for health-record access | NOT STARTED | Canonical `audit_logs` to be wired when read paths go live |
| P1.11 | RLS across all Phase 1 tables | IN PROGRESS | Enabled with policies on all 18 tables and linter-clean; the acceptance test suite proving each policy is outstanding |
| P1.12 | Manual result entry | NOT STARTED | First adapter to build against `InboundReport` |
| P1.13 | Basic health record UI | NOT STARTED | |
| P1.14 | Regression and security gate | NOT STARTED | |


---

## Phase 2 — Document intelligence

All `NOT STARTED`.

P2.01 secure upload · P2.02 `extraction_jobs` · P2.03 PDF parsing · P2.04 OCR / image reading · P2.05 structured AI extraction · P2.06 biomarker matching · P2.07 unit recognition · P2.08 reference-range extraction · P2.09 date and laboratory identification · P2.10 confidence scoring · P2.11 deterministic validation · P2.12 human review interface · P2.13 corrections with audit history · P2.14 synthetic test fixtures · P2.15 safety gate

---

## Phase 3 — Biomarker ontology and longitudinal engine

All `NOT STARTED`.

P3.01 canonical `biomarkers` · P3.02 `biomarker_aliases` · P3.03 `biomarker_units` · P3.04 versioned unit conversions · P3.05 LOINC mappings · P3.06 test-to-biomarker mapping (many-to-many) · P3.07 value normalisation · P3.08 historical reference ranges · P3.09 biomarker history · P3.10 trend calculation · P3.11 charts · P3.12 health timeline · P3.13 source drill-down · P3.14 data-quality gate

---

## Phase 4 — Retest intelligence

All `NOT STARTED`. Primary product differentiator. Clinical intervals must never be hard-coded into UI components.

P4.01 retest rule schema · P4.02 evidence fields (source, jurisdiction, governance status, effective/review dates, version) · P4.03 time-based rules · P4.04 result and trend rules · P4.05 coverage engine · P4.06 goal-aware rules · P4.07 monitoring states (no action / routine review / monitoring opportunity / clinician review pathway) · P4.08 `retest_events` · P4.09 reminders · P4.10 provider comparison handoff · P4.11 commission-independence test · P4.12 audit trail · P4.13 clinical governance gate

---

## Phase 5 — Personal health record UX

All `NOT STARTED`.

P5.01 overview · P5.02 results · P5.03 biomarkers · P5.04 documents · P5.05 retests · P5.06 timeline · P5.07 family profiles · P5.08 WCAG 2.2 AA · P5.09 empty, loading and error states

---

## Phase 6 — Clinician reports and secure sharing

All `NOT STARTED`. No public document URLs.

P6.01 report builder · P6.02 factual longitudinal report · P6.03 PDF export · P6.04 secure short-lived links · P6.05 expiry · P6.06 revocation · P6.07 access logging · P6.08 permission scopes

---

## Phase 7 — Provider and laboratory integrations

All `NOT STARTED`. All inbound routes must converge on the single validation and provenance pipeline.

P7.01 common inbound contract · P7.02 API ingestion · P7.03 laboratory matching · P7.04 profile matching · P7.05 email ingestion (only where approved) · P7.06 reconciliation · P7.07 monitoring

---

## Phase 8 — FHIR and LOINC interoperability

All `NOT STARTED`.

P8.01 internal mapping · P8.02 Patient · P8.03 DiagnosticReport · P8.04 Observation · P8.05 DocumentReference · P8.06 Specimen · P8.07 terminology service · P8.08 export validation · P8.09 security review

---

## Phase 9 — Health Intelligence AI

All `NOT STARTED`. AI never creates a trusted clinical observation.

P9.01 authorised verified-data retrieval · P9.02 source-grounded Q&A · P9.03 trend explanation · P9.04 clinician preparation · P9.05 document search · P9.06 cross-biomarker analysis · P9.07 AI audit trail · P9.08 safety regression

---

## Cross-cutting workstreams

| ID | Workstream | Status | Note |
| --- | --- | --- | --- |
| X.01 | UK GDPR, DPIA, Article 6 lawful basis, Article 9 condition | NOT STARTED | Required before production health-data use |
| X.02 | Retention and deletion | NOT STARTED | `audit_retention_policy` and `apply_audit_retention()` exist for audit data only |
| X.03 | Backup and recovery | BLOCKED | PITR and backup configuration are dashboard-only — worklist W3 |
| X.04 | Security monitoring | IN PROGRESS | `soc_incidents`, `operational_alerts`, `csp_reports`, `siem_export_cursor` exist and are wired |
| X.05 | Dependency scanning | NOT STARTED | No dependency scan in the prebuild chain |
| X.06 | Admin MFA | IN PROGRESS | `verify-admin-mfa`, `mfa_backup_codes` and AAL2 on recovery-token issuance exist; enforcement breadth unverified |
| X.07 | Accessibility (WCAG 2.2 AA) | NOT STARTED | No automated accessibility check in CI |
| X.08 | SEO preservation | IN PROGRESS | `seo-regression.mjs`, `validate-structured-data.mjs` and sitemap generation run in `prebuild` |
| X.09 | Analytics privacy | NOT STARTED | Rule: never send identifiable health data to advertising or analytics services |
| X.10 | Disaster recovery | NOT STARTED | Depends on X.03 |
| X.11 | Clinical governance | NOT STARTED | Needed before any retest rule ships |
| X.12 | Data quality operations | IN PROGRESS | Junk-price quarantine, biomarker audit runs, scrape provenance and out-of-stock handling live for the catalogue; nothing equivalent for health-record data |
| X.13 | Partner lab/results integration discovery (Forth Connect) | IN PROGRESS | `docs/RESEARCH_FORTH_CONNECT.md` and `docs/FORTH_CONNECT_COMPETITIVE_ARCHITECTURE.md`, 14 Sep 2026: vendor claims recorded as claims, API surface marked UNKNOWN, A/B/C/D comparison, risk register, canonical inbound contract, and an explicit list of capabilities we refuse to copy. Discovery only — no contact, no contract, no integration. No production integration may be marked complete from this item |

---

## Competitive design backlog (Forth-inspired)

Added 14 September 2026. Reasoning in `docs/FORTH_CONNECT_COMPETITIVE_ARCHITECTURE.md`; narrative in `docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md` §5. Every item below is **groundwork only** — schema, contracts and tests exist; no behaviour, no UI, no data.

| ID | Capability | Status | Groundwork shipped | Remaining before COMPLETE |
| --- | --- | --- | --- | --- |
| F.A | Results delivery and release control | GROUNDWORK | `diagnostic_reports.status`, append-only `result_release_events` (no update/delete grant), per-source release policy, `release-state-machine.ts` + 9 tests | Transition server functions writing the event in the same transaction; reviewer UI; notification on release |
| F.B | Longitudinal results experience | GROUNDWORK | `biomarker-series.ts` (trusted-only, latest/previous, absolute and percentage change, direction, interval) + 10 tests; `HealthRecordService` read layer | Charts, date-range and reference-range overlays, provider/lab context, educational copy join |
| F.C | Peer benchmarking | GROUNDWORK, DISABLED | `benchmark_cohort_policies` with a CHECK constraint refusing `is_enabled` without both governance sign-offs, minimum cohort 100 and small-cell threshold 10 | Statistical governance, clinical sign-off, de-identification method, cohort definitions. Not to be enabled before all four exist |
| F.D | Clinician commentary | GROUNDWORK | `clinical_review_comments` — attributed, timestamped, separately released, no UPDATE grant, corrections by supersede, never merged into an observation | Review queue, org-scoped policy (governance-gated), release wiring |
| F.E | Practitioner and clinic console | GROUNDWORK | `organisations`, `organisation_members`, `private.is_org_member()` — **no health-data access granted** | Role model tests, consent flow, permissions design. No portal before governance is complete |
| F.F | Curated test profiles | GROUNDWORK | `curated_test_profiles` + `_biomarkers` mapped to `biomarker_hub`; deliberately no price, provider or commission column; public read only when published | Admin editor under `/control`; read-only mapping to the provider catalogue |
| F.G | Notifications | GROUNDWORK | `notification_channel_preferences` (off by default, per channel per event type), `notification_events` carrying no clinical content | Dispatch abstraction, preference screen, delivery-status audit, suppression rules |
| F.H | Cycle-aware female health modelling | GROUNDWORK | `observations.cycle_day`/`cycle_phase`/`menstrual_status`/`hormone_medication_context`; `reference_range_contexts`, inactive until clinically signed off; `CycleContext` contract | Capture UI, evidence-sourced range definitions, our own explainable curve model. **Forth's FORM score is explicitly not to be implemented** |
| F.I | Connectivity and adapters | GROUNDWORK | `InboundReport`/`InboundObservation` canonical contract; `ingestion_adapters` (status, hard-requirement flags); `ingestion_events` (signature verification required, no payload body stored) | Manual-entry adapter, then document upload as the reference implementation. No partner adapter before documentation and a sandbox exist |

**Standing constraints on this backlog:** no partner-specific column in any canonical table; adapter identity is never an input to recommendation, ranking or retesting; no proprietary third-party score is reproduced; no clinical content leaves the record in a notification; nothing here justifies a claim of NHS connectivity.

---

## Change log

| Date | Change |
| --- | --- |
| 14 Sep 2026 | Tracker created locally from project knowledge. Gate 0 marked COMPLETE. Phase 0 IN PROGRESS with four blockers. Phase 1 onward NOT STARTED. No schema created. |
| 14 Sep 2026 (fourth pass) | Migration parity CI rebuilt and self-tested; `docs/MIGRATION_RECONCILIATION.md` published; `test-results` bucket limited to 20 MB; `<uid>/` storage prefix invariant centralised and regression-tested in CI; `public.profiles` retirement plan and rollback recorded but not executed; ten W6 architecture decisions ratified as direction; Forth Connect discovery recorded as X.13. P0.09 COMPLETE. No production table created, altered, dropped or renamed. |
| 14 Sep 2026 (fifth pass) | Migration reconciliation executed (93 marker files, 33 policy exclusions) — P0.02 COMPLETE. `public.profiles` retired in an isolated reversible migration after a clean live preflight — P0.08 COMPLETE. Health Intelligence groundwork shipped: 18 additive tables, 14 enums, RLS and grants throughout, `SECURITY DEFINER` helpers relocated to a non-exposed `private` schema, Supabase linter clean. Canonical contracts, release state machine, longitudinal series maths and the health-record read layer added with 19 tests. Phase 1 moved to IN PROGRESS (schema only). `docs/FORTH_CONNECT_COMPETITIVE_ARCHITECTURE.md` and `docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md` written; competitive backlog F.A–F.I added. Phase 0 **not** marked COMPLETE: B4 (dashboard-only) and B5 (`SUPABASE_DB_URL`) remain open and are not claimed as verified. Marketplace, catalogue, SEO and referral functionality untouched (904 provider tests, 1,552 biomarkers, 4,434 links). |

