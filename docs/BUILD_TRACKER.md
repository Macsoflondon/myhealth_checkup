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

**Status: IN PROGRESS** — six of eleven tasks evidenced. Cannot close: the architecture gap report is unreconciled against the full original blueprint, and two structural defects (duplicate profile models, migration drift) are open.

| ID | Task | Status | Evidence / blocker |
| --- | --- | --- | --- |
| P0.01 | Repository architecture audit | COMPLETE | `docs/PHASE_0_ARCHITECTURE_AUDIT.md` — routes, services, data layer, auth, scripts and CI inspected |
| P0.02 | All migrations reviewed | IN PROGRESS | 279 committed files enumerated; **114 production migrations have no committed file**. Historical drift unexplained — see `docs/PHASE_0_AUDIT_WORKLIST.md` W2 |
| P0.03 | Live table inventory | COMPLETE | 121 public base tables (16 partitions); row counts captured for catalogue and health-record tables |
| P0.04 | RLS policy inventory | COMPLETE | Policy bodies read for all `clinical_*`, health-record and storage objects. User-scoped (`auth.uid() = user_id OR has_role(...,'admin')`); `biomarker_hub` public read by design; `test-results` objects scoped to `<uid>/` prefix |
| P0.05 | Auth and profile model | IN PROGRESS | 3 auth users, 5 `user_roles`, one `handle_new_user_profile` trigger. **`profiles` (0 rows, 4 cols) and `user_profiles` (2 rows, 18 cols) compete**; trigger is named for the empty table. Unresolved — worklist W1 |
| P0.06 | Provider and test catalogue audit | COMPLETE | 904 `provider_tests`; scrape provenance, junk-price quarantine and out-of-stock handling verified in `upsertWithProvenance.ts` |
| P0.07 | Biomarker and test mapping audit | COMPLETE | 1,552 `biomarker_hub` rows; 4,434 `provider_test_biomarkers` links; many-to-many confirmed; 47 `clinical_loinc_mappings` |
| P0.08 | Legacy and duplicate table review | IN PROGRESS | Identified: `profiles`/`user_profiles`; `user_consents`/`clinical_consent_records`; `biomarker_readings`/`clinical_biomarker_history`. ~25 empty zero-trigger tables catalogued. No keep/retire decision taken |
| P0.09 | Architecture gap report | BLOCKED | The full original blueprint (`HEALTH_INTELLIGENCE_MASTER_PLAN.md`) is unretrievable; project knowledge carries the entity list but not the complete specification. Mapping of 40+ canonical entities onto existing tables is not done — worklist W6 |
| P0.10 | Security review | IN PROGRESS | RLS and storage policies evidenced. Outstanding: `test-results` bucket has no file-size limit and no MIME allow-list; no test asserts the `<uid>/` prefix invariant; auth password/MFA policy, backups/PITR, cron inventory and live grants are dashboard-only and unverified — worklist W3, W4, W5 |
| P0.11 | Phase 0 exit gate | BLOCKED | Gated on P0.02, P0.05, P0.08, P0.09, P0.10 |

**Phase 0 blockers**

- **B1** — Two competing profile models. Phase 1 needs one unambiguous demographic record; date of birth and sex drive reference-range selection.
- **B2** — 114 production migrations with no committed file. No new schema until this is reconciled and understood.
- **B3** — Original master blueprint unretrievable; gap report cannot be completed against it.
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
