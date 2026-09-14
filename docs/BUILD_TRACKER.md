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

**Status: IN PROGRESS** — eight of eleven tasks evidenced (fourth pass, 14 September 2026). Cannot close: the dead `public.profiles` table is still in place and its retirement is unexecuted, the schema-bearing migration orphans are not backfilled, the live remote parity diff is unproven until `SUPABASE_DB_URL` exists in repository secrets, and the dashboard-only settings (auth policy, backups/PITR, cron, grants, and the bucket MIME allow-list) remain unverified.

| ID | Task | Status | Evidence / blocker |
| --- | --- | --- | --- |
| P0.01 | Repository architecture audit | COMPLETE | `docs/PHASE_0_ARCHITECTURE_AUDIT.md` — routes, services, data layer, auth, scripts and CI inspected |
| P0.02 | All migrations reviewed | IN PROGRESS | Inventory, classification and exclusion policy published in `docs/MIGRATION_RECONCILIATION.md` (126 applied-without-file: 12 `+1s` near-misses, 114 true orphans — 62 catalogue DML excluded by policy, 17 security, 13 schema-bearing, 8 unclassified, rest views/cron/functions/index). **Parity enforcement fixed 14 Sep 2026:** job-level `env` replaces the step-level `secrets` expression that could never evaluate, daily schedule added, remote diff extracted to `scripts/check-remote-migration-parity.mjs`, pure logic in `scripts/lib/migration-parity-core.mjs` with the `+1s` tolerance made explicit and logged, fixture self-test 8/8 passing in CI. Outstanding: marker-file backfill, near-miss correction, live remote run once `SUPABASE_DB_URL` exists — worklist W2 |
| P0.03 | Live table inventory | COMPLETE | 121 public base tables (16 partitions); row counts captured for catalogue and health-record tables |
| P0.04 | RLS policy inventory | COMPLETE | Policy bodies read for all `clinical_*`, health-record and storage objects. User-scoped (`auth.uid() = user_id OR has_role(...,'admin')`); `biomarker_hub` public read by design; `test-results` objects scoped to `<uid>/` prefix |
| P0.05 | Auth and profile model | COMPLETE | **`user_profiles` is canonical.** `handle_new_user_profile()` body read from `pg_proc`: it inserts into `user_profiles`, `user_preferences` and `user_roles`, never `profiles` — the trigger name is misleading, not broken. Zero code references to `public.profiles` anywhere; it has no inbound FKs, triggers or dependent views, and **no table grants at all**, so PostgREST cannot reach it. Only `user_profiles` carries `date_of_birth` and `gender`. Retirement migration is worklist W1 (execution, not investigation) |
| P0.06 | Provider and test catalogue audit | COMPLETE | 904 `provider_tests`; scrape provenance, junk-price quarantine and out-of-stock handling verified in `upsertWithProvenance.ts` |
| P0.07 | Biomarker and test mapping audit | COMPLETE | 1,552 `biomarker_hub` rows; 4,434 `provider_test_biomarkers` links; many-to-many confirmed; 47 `clinical_loinc_mappings` |
| P0.08 | Legacy and duplicate table review | IN PROGRESS | Duplicates enumerated with row counts and column lists; ten architecture decisions ratified as direction on 14 Sep 2026 (fourth-pass audit section). Six-step `public.profiles` retirement plan with an explicit rollback now recorded. **Not COMPLETE:** the acceptance rule requires implementation and regression of the retirement, which is deliberately unexecuted this pass — worklist W1 |
| P0.09 | Architecture gap report | COMPLETE | All 40 canonical entities mapped against the live schema (9 usable, 7 unsuitable/empty, 5 collisions, 19 missing); observation contract checked field by field. All five collision decisions plus the `uploaded_test_results` decision ratified as architecture direction on 14 Sep 2026 and recorded in `docs/PHASE_0_ARCHITECTURE_AUDIT.md` |
| P0.10 | Security review | IN PROGRESS | `test-results` hardened 14 Sep 2026: private, 20 MB `file_size_limit`, verified by re-reading `storage.buckets`. `<uid>/` prefix invariant and MIME allow-list centralised in `src/lib/storage/testResultsPath.ts`; 10 positive and negative regression tests run in CI via `.github/workflows/unit-tests.yml`. **Residual:** `allowed_mime_types` is not settable through the supported bucket operation and needs dashboard access; auth password/MFA policy, backups/PITR, cron inventory and live grants remain dashboard-only and unverified — worklist W3 |
| P0.11 | Phase 0 exit gate | BLOCKED | Gated on P0.02, P0.05, P0.08, P0.09, P0.10 |

**Phase 0 blockers**

- **B1** — ~~Two competing profile models.~~ **Resolved 14 Sep 2026:** `user_profiles` is canonical on trigger, code, dependency and grant evidence. Narrowed to execution — `public.profiles` still needs retiring in its own reversible migration (W1).
- **B2** — 114 orphan migrations. **Narrowed 14 Sep 2026:** all enumerated, classified and attributable from `schema_migrations.statements`; only 13 are schema-bearing. Now a backfill-and-enforcement task, not an unknown. No new schema until the schema-bearing set is backfilled and the parity check actually runs (W2).
- **B3** — Original master blueprint unretrievable. **Downgraded 14 Sep 2026:** project knowledge supplied the canonical entity list, and the gap mapping is complete against it. Reconcile if the branch ever becomes reachable.
- **B4** — Dashboard-only settings (auth policy, backups/PITR, cron, grants) unverifiable from this session.

---

## Phase 1 — Health record foundation

**Status: NOT STARTED.** Gated behind a genuinely closed Phase 0. No production Health Intelligence tables are to be created.

| ID | Task | Status |
| --- | --- | --- |
| P1.01 | `health_profiles` | NOT STARTED |
| P1.02 | Profile relationships and memberships | NOT STARTED |
| P1.03 | `source_documents` | NOT STARTED |
| P1.04 | `diagnostic_reports` | NOT STARTED |
| P1.05 | `specimens` | NOT STARTED |
| P1.06 | `observations` (full observation contract) | NOT STARTED |
| P1.07 | `reference_ranges` (historical ranges retained per observation) | NOT STARTED |
| P1.08 | `observation_provenance` | NOT STARTED |
| P1.09 | `verification_records` | NOT STARTED |
| P1.10 | Audit logging for health-record access | NOT STARTED |
| P1.11 | RLS across all Phase 1 tables | NOT STARTED |
| P1.12 | Manual result entry | NOT STARTED |
| P1.13 | Basic health record UI | NOT STARTED |
| P1.14 | Regression and security gate | NOT STARTED |

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

---

## Change log

| Date | Change |
| --- | --- |
| 14 Sep 2026 | Tracker created locally from project knowledge. Gate 0 marked COMPLETE. Phase 0 IN PROGRESS with four blockers. Phase 1 onward NOT STARTED. No schema created. |
| X.13 | Partner lab/results integration discovery (Forth Connect) | IN PROGRESS | `docs/RESEARCH_FORTH_CONNECT.md`, 14 Sep 2026: vendor claims recorded as claims, API surface marked UNKNOWN, A/B/C/D comparison, risk register and the canonical inbound contract every ingestion route must satisfy. Discovery only — no contact, no contract, no integration. No production integration may be marked complete from this item |
