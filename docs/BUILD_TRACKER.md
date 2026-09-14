# MyHealthCheckup Health Intelligence Platform
# Master Build Completion Tracker

Status values:

- NOT STARTED
- IN PROGRESS
- BLOCKED
- COMPLETE
- DEFERRED
- FAILED / REWORK REQUIRED

Rule: an item is COMPLETE only when its acceptance criteria have been verified. A UI that renders is not sufficient.

Last updated: 2026-09-14

## Overall status

Architecture: COMPLETE
Master blueprint: COMPLETE
Build tracker: COMPLETE
Lovable write access: BLOCKED
Production Health Intelligence database build: NOT STARTED

Overall completion: 3 / 18 architecture layers formally specified and tracked. No production Health Intelligence schema changes have yet been approved as complete.

## Gate 0: Governance and architecture

| ID | Work item | Status | Evidence / exit criteria |
|---|---|---|---|
| G0.01 | Master architecture specification | COMPLETE | docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md exists |
| G0.02 | Build completion tracker | COMPLETE | This document |
| G0.03 | Existing marketplace preservation rule | COMPLETE | Additive migrations only unless explicitly approved |
| G0.04 | Source-of-truth hierarchy | COMPLETE | Source document -> extraction -> validation -> verification -> observation |
| G0.05 | Clinical safety boundaries | COMPLETE | No autonomous diagnosis, prescribing or treatment logic |
| G0.06 | Marketplace independence rules | COMPLETE | Commission cannot secretly determine clinical relevance |
| G0.07 | Security architecture baseline | COMPLETE | RLS, least privilege, audit, secure storage, retention and incident controls specified |
| G0.08 | FHIR interoperability target | COMPLETE | DiagnosticReport / Observation / Patient / DocumentReference / Specimen model specified |

## Phase 0: Existing platform and database audit

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P0.01 | Audit current repository structure | IN PROGRESS | Existing app structure documented |
| P0.02 | Audit all Supabase migrations | NOT STARTED | Every existing migration reviewed and catalogued |
| P0.03 | Inventory current database tables | NOT STARTED | Table inventory with purpose and ownership |
| P0.04 | Inventory current RLS policies | NOT STARTED | All policies reviewed for health-data isolation implications |
| P0.05 | Inventory current auth/profile model | NOT STARTED | User/profile relationships documented |
| P0.06 | Inventory provider/test catalogue | NOT STARTED | Existing provider, test and category relationships mapped |
| P0.07 | Identify existing biomarker/test mappings | NOT STARTED | Existing mappings identified before new ontology is created |
| P0.08 | Identify legacy/duplicate tables | NOT STARTED | Duplicate and obsolete structures documented, no deletion without approval |
| P0.09 | Architecture gap report | NOT STARTED | Gaps mapped against master blueprint |
| P0.10 | Phase 0 security review | NOT STARTED | No critical unresolved schema/RLS issue |
| P0.11 | Phase 0 exit gate | NOT STARTED | Architecture audit accepted |

## Phase 1: Health Record Foundation

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P1.01 | health_profiles | NOT STARTED | Profile ownership and isolation enforced |
| P1.02 | Profile relationships | NOT STARTED | Family/profile relationships explicitly controlled |
| P1.03 | Source documents | NOT STARTED | Secure metadata and storage reference model exists |
| P1.04 | Diagnostic reports | NOT STARTED | Report-level record linked to profile and source |
| P1.05 | Specimens | NOT STARTED | Collection context preserved |
| P1.06 | Observations | NOT STARTED | Atomic result model implemented |
| P1.07 | Reference ranges | NOT STARTED | Historical source range preserved per observation |
| P1.08 | Observation provenance | NOT STARTED | Every trusted observation traces to source |
| P1.09 | Verification records | NOT STARTED | Draft -> review -> confirmed/rejected workflow represented |
| P1.10 | Audit logs | NOT STARTED | Material health-data changes are auditable |
| P1.11 | RLS policies | NOT STARTED | Cross-profile access blocked by database policy |
| P1.12 | Manual result entry | NOT STARTED | User can create a draft/manual result and verify it |
| P1.13 | Basic health record UI | NOT STARTED | Verified observations visible to owning user |
| P1.14 | Phase 1 regression/security gate | NOT STARTED | Tests pass, no marketplace regression |

## Phase 2: AI Results and Document Intelligence

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P2.01 | Secure document upload | NOT STARTED | File type/size/security controls implemented |
| P2.02 | Extraction job model | NOT STARTED | Jobs have status, retry and audit fields |
| P2.03 | PDF parsing pipeline | NOT STARTED | Representative UK reports parse successfully |
| P2.04 | OCR/image pipeline | NOT STARTED | Image reports produce reviewable drafts |
| P2.05 | AI extraction schema | NOT STARTED | Strict structured output contract implemented |
| P2.06 | Biomarker candidate matching | NOT STARTED | Raw names map to candidate canonical biomarkers |
| P2.07 | Unit recognition | NOT STARTED | Units captured and validated |
| P2.08 | Reference-range extraction | NOT STARTED | Source range retained |
| P2.09 | Date/laboratory extraction | NOT STARTED | Collection/result/report dates and laboratory captured |
| P2.10 | Confidence scoring | NOT STARTED | Each extracted item has confidence metadata |
| P2.11 | Deterministic validation engine | NOT STARTED | Invalid/suspicious outputs flagged before verification |
| P2.12 | Human review UI | NOT STARTED | User sees and confirms extracted draft |
| P2.13 | Correction workflow | NOT STARTED | Corrections create audit history |
| P2.14 | Synthetic report fixture library | NOT STARTED | Diverse anonymised/synthetic reports available for regression |
| P2.15 | Phase 2 safety gate | NOT STARTED | AI cannot directly create trusted clinical observations |

## Phase 3: Biomarker Ontology and Longitudinal Engine

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P3.01 | Canonical biomarker table | NOT STARTED | Stable internal IDs and display names |
| P3.02 | Biomarker aliases | NOT STARTED | Provider/lab synonyms supported |
| P3.03 | Biomarker units | NOT STARTED | Supported units defined |
| P3.04 | Versioned unit conversions | NOT STARTED | Conversion rules are auditable |
| P3.05 | LOINC mappings | NOT STARTED | Appropriate observations mapped with review status |
| P3.06 | Test-to-biomarker mapping | NOT STARTED | Existing catalogue connected to canonical biomarkers |
| P3.07 | Observation normalisation | NOT STARTED | Original and canonical values both retained |
| P3.08 | Historical reference-range display | NOT STARTED | Source range shown with result |
| P3.09 | Biomarker history | NOT STARTED | Multiple trusted results grouped chronologically |
| P3.10 | Trend calculations | NOT STARTED | Direction/change/interval calculations verified |
| P3.11 | Biomarker charts | NOT STARTED | Mobile and accessible |
| P3.12 | Health timeline | NOT STARTED | Clinical dates drive timeline where available |
| P3.13 | Source drill-down | NOT STARTED | User can trace chart point to report/source |
| P3.14 | Phase 3 data-quality gate | NOT STARTED | No silent data corruption or unit overwrite |

## Phase 4: Retest Intelligence Engine

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P4.01 | Retest rule schema | NOT STARTED | Rules are versioned and auditable |
| P4.02 | Evidence/source fields | NOT STARTED | Each rule has evidence and review metadata |
| P4.03 | Time-based rules | NOT STARTED | Intervals calculated correctly |
| P4.04 | Result/trend-aware rules | NOT STARTED | Historical observations affect retest state |
| P4.05 | Test coverage engine | NOT STARTED | System knows which tests cover which biomarkers |
| P4.06 | Goal-aware rules | NOT STARTED | User goals influence relevant options without overriding safety |
| P4.07 | Monitoring states | NOT STARTED | No action / routine / monitoring / clinician review states implemented |
| P4.08 | Retest event generation | NOT STARTED | Eligible opportunities generated with reason |
| P4.09 | Reminder system | NOT STARTED | User controls reminder timing |
| P4.10 | Provider comparison handoff | NOT STARTED | Retest links into relevant provider comparison |
| P4.11 | Commission independence test | NOT STARTED | Commercial relationship cannot create clinical recommendation |
| P4.12 | Retest audit trail | NOT STARTED | Rule version and inputs recorded |
| P4.13 | Phase 4 clinical governance gate | NOT STARTED | Rules reviewed before production use |

## Phase 5: Personal Health Record and User Experience

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P5.01 | Health overview | NOT STARTED | Clear summary without clinical overclaiming |
| P5.02 | Results dashboard | NOT STARTED | Verified results easy to locate |
| P5.03 | Biomarker dashboard | NOT STARTED | History and source accessible |
| P5.04 | Documents area | NOT STARTED | Original reports organised by clinical date |
| P5.05 | Retests area | NOT STARTED | Due and upcoming monitoring visible |
| P5.06 | Timeline | NOT STARTED | Events ordered correctly |
| P5.07 | Family profiles | NOT STARTED | Explicitly separated profile data |
| P5.08 | Mobile-first accessibility | NOT STARTED | WCAG 2.2 AA target tested |
| P5.09 | Empty/loading/error states | NOT STARTED | All health-data screens have safe states |

## Phase 6: Clinician Reports and Secure Sharing

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P6.01 | Report builder | NOT STARTED | User selects data/date range |
| P6.02 | Factual longitudinal report | NOT STARTED | Source facts separated from generated explanation |
| P6.03 | PDF export | NOT STARTED | Accurate, accessible report |
| P6.04 | Secure share links | NOT STARTED | No public document URLs |
| P6.05 | Expiry | NOT STARTED | User controls link duration |
| P6.06 | Revocation | NOT STARTED | Access stops immediately after revocation |
| P6.07 | Access logging | NOT STARTED | Share access is auditable |
| P6.08 | Permission scopes | NOT STARTED | Single result, biomarker, date range and full record scopes |

## Phase 7: Provider and Laboratory Integrations

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P7.01 | Provider integration contract | NOT STARTED | Standard inbound result contract defined |
| P7.02 | Structured API ingestion | NOT STARTED | Provider results enter common pipeline |
| P7.03 | Laboratory matching | NOT STARTED | Laboratory identity resolved |
| P7.04 | Patient/profile matching | NOT STARTED | Safe matching with exception workflow |
| P7.05 | Email ingestion where appropriate | NOT STARTED | Governance and security approved |
| P7.06 | Automated reconciliation | NOT STARTED | Duplicate results handled safely |
| P7.07 | Provider integration monitoring | NOT STARTED | Failures visible to operations |

## Phase 8: FHIR / LOINC Interoperability

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P8.01 | Internal FHIR mapping | NOT STARTED | Internal model maps to FHIR concepts |
| P8.02 | Patient mapping | NOT STARTED | Health profile maps safely |
| P8.03 | DiagnosticReport export | NOT STARTED | Report context and result references preserved |
| P8.04 | Observation export | NOT STARTED | Atomic measurements exported correctly |
| P8.05 | DocumentReference mapping | NOT STARTED | Source documents represented appropriately |
| P8.06 | Specimen mapping | NOT STARTED | Specimen context preserved |
| P8.07 | LOINC terminology service | NOT STARTED | Mapping/version governance established |
| P8.08 | FHIR validation | NOT STARTED | Export passes appropriate validation |
| P8.09 | Interoperability security review | NOT STARTED | No inappropriate disclosure |

## Phase 9: Health Intelligence AI

| ID | Work item | Status | Acceptance criteria |
|---|---|---|---|
| P9.01 | Health-record retrieval | NOT STARTED | AI retrieves only authorised verified data |
| P9.02 | Source-grounded Q&A | NOT STARTED | Answers trace to source observations/documents |
| P9.03 | Trend explanation | NOT STARTED | Explanations distinguish fact from interpretation |
| P9.04 | Clinician preparation | NOT STARTED | User questions and history prepared without diagnosis |
| P9.05 | Document search | NOT STARTED | Search across authorised records |
| P9.06 | Cross-biomarker analysis | NOT STARTED | Safe, transparent and source-grounded |
| P9.07 | AI audit trail | NOT STARTED | Model/prompt/version/request recorded |
| P9.08 | AI safety regression suite | NOT STARTED | High-risk prompts tested and bounded |

## Cross-cutting workstreams

| ID | Workstream | Status | Acceptance criteria |
|---|---|---|---|
| X.01 | UK GDPR governance | NOT STARTED | DPIA, lawful basis, Article 9 condition and policies documented |
| X.02 | Data retention/deletion | NOT STARTED | Retention rules implemented and tested |
| X.03 | Backup/recovery | NOT STARTED | Recovery objectives documented and tested |
| X.04 | Security monitoring | NOT STARTED | Relevant security events monitored |
| X.05 | Dependency/security scanning | NOT STARTED | Vulnerability process established |
| X.06 | Admin MFA and privilege control | NOT STARTED | Admin access hardened |
| X.07 | Accessibility | NOT STARTED | WCAG 2.2 AA testing programme |
| X.08 | SEO/public marketplace preservation | NOT STARTED | Existing organic/marketplace behaviour preserved |
| X.09 | Analytics privacy | NOT STARTED | No health data sent to advertising analytics |
| X.10 | Disaster recovery exercise | NOT STARTED | Restore procedure tested |
| X.11 | Clinical governance | NOT STARTED | Governance owner and review process defined |
| X.12 | Data-quality operations | NOT STARTED | Provider/test/biomarker data review process established |

## Build gates

### Gate A: Architecture approved

Complete when G0.01 through G0.08 are complete.

### Gate B: Database foundation safe

Complete when P0.01 through P0.11 are complete.

### Gate C: Verified results foundation

Complete when P1.01 through P1.14 are complete.

### Gate D: Automated ingestion safe

Complete when P2.01 through P2.15 are complete.

### Gate E: Longitudinal intelligence reliable

Complete when P3.01 through P3.14 are complete.

### Gate F: Retesting governed

Complete when P4.01 through P4.13 are complete.

### Gate G: Patient record production-ready

Complete when P5 and P6 acceptance criteria are complete.

### Gate H: Connected ecosystem

Complete when P7 and P8 acceptance criteria are complete.

### Gate I: Health Intelligence AI

Complete when P9.01 through P9.08 are complete.

## Current blockers

1. Lovable write access is currently blocked by connector authorisation. The connector requires the current `projects:write` scope before code/database changes can be executed through Lovable.
2. Phase 0 database audit must precede creation of additive Health Intelligence migrations.

## Working rule

Never mark an item COMPLETE because code was generated. Mark it COMPLETE only after implementation, verification, security review, regression testing and acceptance criteria are satisfied.

## Recommended next execution order

1. Resolve Lovable write permission.
2. Complete Phase 0 schema/RLS audit.
3. Reconcile existing catalogue with canonical biomarker model.
4. Build Phase 1 database foundation.
5. Test profile isolation and RLS before adding result data.
6. Build manual result entry before AI extraction.
7. Build document intelligence only after the underlying observation/provenance model is stable.
8. Build longitudinal tracking before retest recommendations.
9. Govern retest rules before exposing them commercially.
10. Add secure sharing before external interoperability.
11. Add provider integrations after the common result contract is stable.
12. Add Health Intelligence AI last, using verified data as its source.

## Completion principle

The project is not finished when all screens exist.

It is finished when the platform can reliably take a user from:

Discover -> Compare -> Test -> Receive -> Verify -> Store -> Track -> Understand -> Retest -> Compare again

with security, provenance, clinical governance, interoperability and commercial independence intact.