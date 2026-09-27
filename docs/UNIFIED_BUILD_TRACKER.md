# Health Intelligence Unified Build Tracker

**Version:** 1.0  
**Date:** 15 September 2026  
**Companion blueprint:** `docs/HEALTH_INTELLIGENCE_UNIFIED_BLUEPRINT.md`  
**Machine-readable tracker:** `docs/unified-build-tracker.json`

This tracker is the execution checklist for the unified blueprint. It incorporates the original Health Intelligence programme, Forth-derived improvements and the Health Data Avatar additions.

## Status values

- `NOT STARTED`
- `IN PROGRESS`
- `BLOCKED`
- `COMPLETE`
- `DEFERRED`
- `FAILED / REWORK REQUIRED`

## Definition of complete

Every task requires evidence for all five conditions:

1. Implementation
2. Verification
3. Security review
4. Regression testing
5. Acceptance criteria

A task remains `IN PROGRESS` until all five are evidenced.

---

# Programme status

| Area | Status | Current position |
| --- | --- | --- |
| Governance | COMPLETE | Architecture and safety principles fixed |
| Phase 0 | BLOCKED | Dashboard verification and remote migration parity outstanding |
| Phase 1 | IN PROGRESS | Schema groundwork exists, feature layer not complete |
| Phase 2 | NOT STARTED | Document intelligence |
| Phase 3 | NOT STARTED | Biomarker ontology and longitudinal engine |
| Phase 4 | NOT STARTED | Retest intelligence |
| Phase 5 | NOT STARTED | Personal Health Record UX |
| Phase 6 | NOT STARTED | Clinician reports and secure sharing |
| Phase 7 | NOT STARTED | Provider/lab/external integrations |
| Phase 8 | NOT STARTED | FHIR/LOINC interoperability |
| Phase 9 | NOT STARTED | Health Intelligence AI |
| Phase 10 | NOT STARTED | Advanced intelligence |

---

# Gate 0 — Governance

| ID | Task | Status |
| --- | --- | --- |
| G0.01 | Supabase/PostgreSQL system of record | COMPLETE |
| G0.02 | Marketplace preserved and migrations additive/reversible | COMPLETE |
| G0.03 | Source evidence and AI draft hierarchy | COMPLETE |
| G0.04 | Clinical safety boundary | COMPLETE |
| G0.05 | Commission-independent clinical logic | COMPLETE |
| G0.06 | UK health-data security baseline | COMPLETE |
| G0.07 | FHIR/LOINC target without NHS connectivity claim | COMPLETE |
| G0.08 | Patient ownership and export principle | COMPLETE |
| G0.09 | HDA/Forth competitive patterns incorporated into architecture | COMPLETE |

---

# Phase 0 — Architecture and safety gate

| ID | Task | Status |
| --- | --- | --- |
| P0.01 | Repository architecture audit | COMPLETE |
| P0.02 | Migration reconciliation | COMPLETE, remote parity pending |
| P0.03 | Live table inventory | COMPLETE |
| P0.04 | RLS policy inventory | COMPLETE |
| P0.05 | Canonical auth/profile model | COMPLETE |
| P0.06 | Provider/test catalogue audit | COMPLETE |
| P0.07 | Biomarker/test mapping audit | COMPLETE |
| P0.08 | Legacy/duplicate review | COMPLETE |
| P0.09 | Architecture gap report | COMPLETE |
| P0.10 | Security review | BLOCKED |
| P0.11 | Phase 0 exit gate | BLOCKED |
| P0.12 | Supabase auth policy verification | BLOCKED |
| P0.13 | Backup/PITR verification | BLOCKED |
| P0.14 | Cron inventory verification | BLOCKED |
| P0.15 | Live role grants verification | BLOCKED |
| P0.16 | Storage MIME allow-list verification | BLOCKED |
| P0.17 | Remote migration parity | BLOCKED |

Exit criteria: all dashboard-only controls verified, remote parity passes, no unresolved P0 security blocker.

---

# Phase 1 — Health Record + Health Memory Foundation

| ID | Task | Status |
| --- | --- | --- |
| P1.01 | Health profile | IN PROGRESS |
| P1.02 | Profile relationships/dependants model | NOT STARTED |
| P1.03 | Source documents | IN PROGRESS |
| P1.04 | Diagnostic reports | IN PROGRESS |
| P1.05 | Specimens | IN PROGRESS |
| P1.06 | Observations full contract | IN PROGRESS |
| P1.07 | Historical/contextual reference ranges | IN PROGRESS |
| P1.08 | Provenance contract | IN PROGRESS |
| P1.09 | Verification records and review workflow | NOT STARTED |
| P1.10 | Health-record audit logging | NOT STARTED |
| P1.11 | RLS acceptance suite | NOT STARTED |
| P1.12 | Manual result entry | NOT STARTED |
| P1.13 | Patient context model | NOT STARTED |
| P1.14 | Health events model | NOT STARTED |
| P1.15 | Free-form journal | NOT STARTED |
| P1.16 | Medication entity and provenance | NOT STARTED |
| P1.17 | Medication timeline foundation | NOT STARTED |
| P1.18 | Source hierarchy | NOT STARTED |
| P1.19 | Derived artefact model for translations/summaries | NOT STARTED |
| P1.20 | Processing job foundation | NOT STARTED |
| P1.21 | Basic Health Memory UI | NOT STARTED |
| P1.22 | Security/regression/acceptance gate | NOT STARTED |

Exit criteria: manual results and context can be captured, verified, audited and viewed on a secure chronological timeline.

---

# Phase 2 — Document Intelligence

| ID | Task | Status |
| --- | --- | --- |
| P2.01 | Secure upload | NOT STARTED |
| P2.02 | Extraction jobs | NOT STARTED |
| P2.03 | PDF parsing | NOT STARTED |
| P2.04 | OCR/image reading | NOT STARTED |
| P2.05 | Structured AI extraction | NOT STARTED |
| P2.06 | Biomarker matching | NOT STARTED |
| P2.07 | Unit recognition | NOT STARTED |
| P2.08 | Reference-range extraction | NOT STARTED |
| P2.09 | Date/laboratory/specimen extraction | NOT STARTED |
| P2.10 | Confidence scoring | NOT STARTED |
| P2.11 | Deterministic validation | NOT STARTED |
| P2.12 | Patient review interface | NOT STARTED |
| P2.13 | Corrections and audit history | NOT STARTED |
| P2.14 | Retry/idempotency/failure recovery | NOT STARTED |
| P2.15 | Multilingual extraction foundation | NOT STARTED |
| P2.16 | Synthetic document fixtures | NOT STARTED |
| P2.17 | Security and clinical safety gate | NOT STARTED |

Exit criteria: provider documents become reviewable drafts without unverified values entering trusted storage.

---

# Phase 3 — Biomarker Ontology + Longitudinal Engine

| ID | Task | Status |
| --- | --- | --- |
| P3.01 | Canonical biomarker mapping | NOT STARTED |
| P3.02 | Alias resolution | NOT STARTED |
| P3.03 | Unit catalogue | NOT STARTED |
| P3.04 | Versioned unit conversion | NOT STARTED |
| P3.05 | LOINC mappings | NOT STARTED |
| P3.06 | Test-to-biomarker many-to-many mapping | NOT STARTED |
| P3.07 | Value normalisation | NOT STARTED |
| P3.08 | Historical reference ranges | NOT STARTED |
| P3.09 | Biomarker series | NOT STARTED |
| P3.10 | Trend calculation | NOT STARTED |
| P3.11 | Longitudinal charts | NOT STARTED |
| P3.12 | Unified Health Timeline | NOT STARTED |
| P3.13 | Source drill-down | NOT STARTED |
| P3.14 | Data-quality indicators | NOT STARTED |
| P3.15 | Data-gap engine | NOT STARTED |
| P3.16 | Conflict detection engine | NOT STARTED |
| P3.17 | Cross-provider continuity tests | NOT STARTED |
| P3.18 | Security/regression gate | NOT STARTED |

Exit criteria: correct historical biomarker series work across providers, units and ranges with source drill-down.

---

# Phase 4 — Retest Intelligence

| ID | Task | Status |
| --- | --- | --- |
| P4.01 | Retest rule schema | NOT STARTED |
| P4.02 | Evidence/source/jurisdiction fields | NOT STARTED |
| P4.03 | Rule versioning and effective/review dates | NOT STARTED |
| P4.04 | Time-based rules | NOT STARTED |
| P4.05 | Result-based rules | NOT STARTED |
| P4.06 | Trend-based rules | NOT STARTED |
| P4.07 | Test coverage engine | NOT STARTED |
| P4.08 | Goal-aware rules | NOT STARTED |
| P4.09 | Monitoring states | NOT STARTED |
| P4.10 | Retest events | NOT STARTED |
| P4.11 | Reminder engine | NOT STARTED |
| P4.12 | Provider comparison handoff | NOT STARTED |
| P4.13 | Commission-independence contract test | NOT STARTED |
| P4.14 | Clinical governance workflow | NOT STARTED |
| P4.15 | Audit trail | NOT STARTED |
| P4.16 | Retest UX | NOT STARTED |

Exit criteria: the system explains a retest opportunity using governed evidence and routes the user to a neutral provider comparison.

---

# Phase 5 — Personal Health Record UX

| ID | Task | Status |
| --- | --- | --- |
| P5.01 | Health dashboard | NOT STARTED |
| P5.02 | Results view | NOT STARTED |
| P5.03 | Biomarker view | NOT STARTED |
| P5.04 | Documents view | NOT STARTED |
| P5.05 | Retests view | NOT STARTED |
| P5.06 | Timeline view | NOT STARTED |
| P5.07 | Health Memory tree | NOT STARTED |
| P5.08 | Journal/context UI | NOT STARTED |
| P5.09 | Medication timeline UI | NOT STARTED |
| P5.10 | Gap/conflict UI | NOT STARTED |
| P5.11 | Dependant/family profiles | NOT STARTED |
| P5.12 | Mobile-first QA | NOT STARTED |
| P5.13 | WCAG 2.2 AA | NOT STARTED |
| P5.14 | Empty/loading/error states | NOT STARTED |
| P5.15 | SEO preservation | NOT STARTED |
| P5.16 | Regression gate | NOT STARTED |

Exit criteria: a person can use the Health Record as a coherent lifelong memory without understanding the underlying data model.

---

# Phase 6 — Clinician Reports + Secure Sharing

| ID | Task | Status |
| --- | --- | --- |
| P6.01 | Report builder | NOT STARTED |
| P6.02 | Factual longitudinal report | NOT STARTED |
| P6.03 | Selected-data report | NOT STARTED |
| P6.04 | PDF export | NOT STARTED |
| P6.05 | Secure short-lived links | NOT STARTED |
| P6.06 | Password protection | NOT STARTED |
| P6.07 | Expiry | NOT STARTED |
| P6.08 | Revocation | NOT STARTED |
| P6.09 | Access logs | NOT STARTED |
| P6.10 | Permission scopes | NOT STARTED |
| P6.11 | QR sharing | NOT STARTED |
| P6.12 | PII detection | NOT STARTED |
| P6.13 | Selective redaction | NOT STARTED |
| P6.14 | Clinician comments | NOT STARTED |
| P6.15 | Controlled result release | NOT STARTED |
| P6.16 | Security and governance gate | NOT STARTED |

Exit criteria: purpose-specific sharing is secure, auditable, revocable and does not expose unrelated health information.

---

# Phase 7 — Provider, Laboratory and External Data Integrations

| ID | Task | Status |
| --- | --- | --- |
| P7.01 | Canonical inbound adapter contract | NOT STARTED |
| P7.02 | API ingestion adapter | NOT STARTED |
| P7.03 | Laboratory matching | NOT STARTED |
| P7.04 | Patient/profile matching | NOT STARTED |
| P7.05 | Approved email result ingestion | NOT STARTED |
| P7.06 | FHIR import adapter | NOT STARTED |
| P7.07 | Wearable adapter boundary | NOT STARTED |
| P7.08 | Questionnaire adapter boundary | NOT STARTED |
| P7.09 | Sync monitoring | NOT STARTED |
| P7.10 | Reconciliation | NOT STARTED |
| P7.11 | Failure recovery | NOT STARTED |
| P7.12 | Adapter security review | NOT STARTED |

Exit criteria: external data enters the same evidence, validation and verification pipeline as uploaded documents.

---

# Phase 8 — FHIR + LOINC Interoperability

| ID | Task | Status |
| --- | --- | --- |
| P8.01 | Internal FHIR mapping service | NOT STARTED |
| P8.02 | Patient export | NOT STARTED |
| P8.03 | DiagnosticReport export | NOT STARTED |
| P8.04 | Observation export | NOT STARTED |
| P8.05 | DocumentReference export | NOT STARTED |
| P8.06 | Specimen export | NOT STARTED |
| P8.07 | Provenance export | NOT STARTED |
| P8.08 | LOINC terminology mapping | NOT STARTED |
| P8.09 | Export validation | NOT STARTED |
| P8.10 | Import validation | NOT STARTED |
| P8.11 | Security review | NOT STARTED |

Exit criteria: a standards-based export can be consumed by another system with source traceability preserved.

---

# Phase 9 — Health Intelligence AI

| ID | Task | Status |
| --- | --- | --- |
| P9.01 | Authorised verified-data retrieval | NOT STARTED |
| P9.02 | Source-grounded smart search | NOT STARTED |
| P9.03 | Health-record Q&A | NOT STARTED |
| P9.04 | Historical result questions | NOT STARTED |
| P9.05 | Trend explanations | NOT STARTED |
| P9.06 | Appointment preparation | NOT STARTED |
| P9.07 | Factual health summaries | NOT STARTED |
| P9.08 | Gap/conflict explanations | NOT STARTED |
| P9.09 | Medication/context queries | NOT STARTED |
| P9.10 | Evidence-linked education | NOT STARTED |
| P9.11 | Multilingual summaries | NOT STARTED |
| P9.12 | AI source hierarchy enforcement | NOT STARTED |
| P9.13 | AI uncertainty/refusal rules | NOT STARTED |
| P9.14 | Prompt/model versioning | NOT STARTED |
| P9.15 | AI security/privacy review | NOT STARTED |
| P9.16 | AI regression and safety gate | NOT STARTED |

Exit criteria: AI answers only from authorised sources, exposes gaps and uncertainty, and cannot create trusted observations.

---

# Phase 10 — Advanced Health Intelligence

| ID | Task | Status |
| --- | --- | --- |
| P10.01 | Explainable health scores | NOT STARTED |
| P10.02 | Personalised targets | NOT STARTED |
| P10.03 | Governed benchmarking | NOT STARTED |
| P10.04 | Wearable correlations | NOT STARTED |
| P10.05 | Cycle-aware modelling | NOT STARTED |
| P10.06 | Advanced health goals | NOT STARTED |
| P10.07 | External AI agent/API boundary | NOT STARTED |
| P10.08 | MCP-style fixed tool layer | NOT STARTED |
| P10.09 | Read/write permission separation | NOT STARTED |
| P10.10 | OAuth/PKCE integration | NOT STARTED |
| P10.11 | External access revocation | NOT STARTED |
| P10.12 | Research governance for risk modelling | NOT STARTED |
| P10.13 | Advanced intelligence safety gate | NOT STARTED |

Exit criteria: advanced intelligence is explainable, governed, reproducible, auditable and safely reversible.

---

# Cross-cutting controls

| ID | Control | Status |
| --- | --- | --- |
| X.01 | UK GDPR/special-category data governance | NOT STARTED |
| X.02 | Retention schedule and deletion workflow | NOT STARTED |
| X.03 | Backup/PITR | BLOCKED |
| X.04 | Security monitoring | IN PROGRESS |
| X.05 | Dependency scanning | NOT STARTED |
| X.06 | Admin MFA | IN PROGRESS |
| X.07 | Accessibility | NOT STARTED |
| X.08 | SEO preservation | IN PROGRESS |
| X.09 | Analytics privacy | NOT STARTED |
| X.10 | Disaster recovery | NOT STARTED |
| X.11 | Clinical governance | NOT STARTED |
| X.12 | Data quality governance | IN PROGRESS |
| X.13 | External connector/Forth discovery | IN PROGRESS |
| X.14 | HDA competitive architecture review | COMPLETE |
| X.15 | Provenance and source hierarchy enforcement | IN PROGRESS |
| X.16 | AI safety governance | NOT STARTED |
| X.17 | Data portability/export | NOT STARTED |
| X.18 | Incident response | NOT STARTED |

---

# Competitive backlog

| ID | Capability | Decision | Status |
| --- | --- | --- | --- |
| C-HDA-01 | Health Memory | ADOPT | GROUNDWORK |
| C-HDA-02 | Unified timeline | ADOPT | GROUNDWORK |
| C-HDA-03 | Patient context/journal | ADOPT | GROUNDWORK |
| C-HDA-04 | Gap detection | ADOPT | PLANNED |
| C-HDA-05 | Conflict detection | ADOPT | PLANNED |
| C-HDA-06 | Medication timeline | ADOPT | GROUNDWORK |
| C-HDA-07 | Source-grounded search | ADOPT | PLANNED |
| C-HDA-08 | Appointment preparation | ADOPT | PLANNED |
| C-HDA-09 | Multilingual derivatives | ARCHITECT NOW | PLANNED |
| C-HDA-10 | PII redaction | ADOPT | PLANNED |
| C-HDA-11 | FHIR export | ADOPT | PLANNED |
| C-HDA-12 | LLM-ready export | ADOPT | PLANNED |
| C-HDA-13 | Wearable adapters | ARCHITECT NOW | PLANNED |
| C-HDA-14 | Questionnaire adapters | ARCHITECT NOW | PLANNED |
| C-HDA-15 | External AI agent/MCP | ARCHITECT NOW | PLANNED |
| C-HDA-16 | WhatsApp/Telegram journals | DEFER | DEFERRED |
| C-HDA-17 | Disease prediction | DO NOT BUILD NOW | DEFERRED |
| C-FORTH-01 | Controlled result release | ADOPT | GROUNDWORK |
| C-FORTH-02 | Clinician comments | ADOPT | PLANNED |
| C-FORTH-03 | Practitioner continuity view | ADOPT | PLANNED |
| C-FORTH-04 | Curated test profiles | ADOPT | PLANNED |
| C-FORTH-05 | Cycle-aware hormones | ADOPT | PLANNED |
| C-FORTH-06 | Contextual ranges | ADOPT | GROUNDWORK |
| C-FORTH-07 | Explainable targets | ADOPT | PLANNED |
| C-FORTH-08 | Benchmarking architecture | ADOPT | GROUNDWORK |
| C-FORTH-09 | Proprietary FORM score | DO NOT COPY | DEFERRED |

---

# Current blockers

| ID | Blocker | Impact | Status |
| --- | --- | --- | --- |
| B4 | Supabase dashboard-only security settings | Phase 0 exit, backup/DR verification | OPEN |
| B5 | Missing `SUPABASE_DB_URL` repository secret | Remote migration parity | OPEN |

No other blocker should be invented. New blockers must be recorded here before a task is marked blocked.

---

# Release gates

A release candidate requires:

- [ ] All phase acceptance criteria met.
- [ ] No unresolved critical security finding.
- [ ] RLS tested for every affected table.
- [ ] Storage access tested for positive and negative paths.
- [ ] Provenance tested end-to-end.
- [ ] AI cannot bypass verification.
- [ ] Marketplace regression suite passes.
- [ ] Catalogue and referral flows pass.
- [ ] SEO checks pass.
- [ ] Accessibility checks pass for affected surfaces.
- [ ] Data retention behaviour tested.
- [ ] Audit logs tested.
- [ ] Backup and recovery tested where applicable.
- [ ] Clinical governance sign-off where applicable.

This tracker is the working completion list. Update the status only when evidence exists.
