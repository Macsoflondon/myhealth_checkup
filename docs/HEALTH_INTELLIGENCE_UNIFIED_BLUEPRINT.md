# myhealth checkup Health Intelligence Platform

## Unified blueprint and programme roadmap

**Version:** 1.0  
**Date:** 15 September 2026  
**Status:** Authoritative design baseline for implementation  
**Repository:** `Macsoflondon/myhealth_checkup`

This document unifies the existing Health Intelligence architecture with the competitive additions adopted from Forth Connect and Health Data Avatar, plus the previously approved marketplace, longitudinal, retest, sharing, interoperability and AI roadmap.

The purpose is simple: one architecture, one roadmap, one completion model, no lost work.

---

## 1. Product we are building

myhealth checkup remains a UK private diagnostics comparison and referral marketplace. Health Intelligence becomes the patient-owned longitudinal layer built around it.

### Core loop

**Discover → Compare → Test → Receive → Verify → Store → Track → Understand → Retest → Compare again**

The marketplace is not replaced. It becomes the commercial entry point into a much larger patient-controlled health record and testing intelligence system.

### Product promise

A person should be able to:

1. Find the right private test.
2. Compare providers without clinical ranking bias.
3. Complete testing through a provider.
4. Bring results into one secure record.
5. Verify extracted information before it becomes trusted data.
6. See results across years and providers.
7. Add symptoms, medications, lifestyle and other context.
8. Understand changes without turning the platform into an autonomous diagnostic system.
9. Know what information is missing or conflicting.
10. Identify appropriate retesting opportunities using governed rules.
11. Compare providers for the next test.
12. Prepare factual summaries for clinicians.
13. Share only the information required, for a defined period.
14. Export the record in interoperable formats.

---

## 2. Architectural principles

These principles override feature pressure.

### Evidence and trust

**Source document = evidence**  
**AI = extraction and assistance**  
**Validation engine = quality control**  
**Patient = confirmation boundary**  
**Database = structured record**  
**FHIR/LOINC = interoperability layer**  
**AI assistant = interface, not clinical authority**

AI must never turn an unverified extraction or generated interpretation into a trusted clinical observation.

### Commercial independence

Clinical relevance, retesting logic, health scoring and ranking must never use provider commission, affiliate value or fulfilment partner identity as an input.

### Provider neutrality

The record must work across laboratories, clinics, countries, document formats and future integrations. No single provider is the system of record.

### Provenance first

Every trusted observation must retain enough provenance to answer:

- Where did this value come from?
- Which document and report contained it?
- Which page or text anchor supports it?
- What extraction method produced it?
- What confidence did extraction have?
- What value, unit and reference range did the source show?
- Who confirmed or corrected it?
- When was it released or made visible?

### Patient ownership

The person controls their record, sharing and exit. Export must remain possible even if they stop using the service.

### Explainability

Every generated trend, score, target or retest recommendation must identify its rule/model version, inputs, evidence source and limitations.

### Safety boundary

No autonomous diagnosis, prescribing or definitive clinical decision. Abnormal-result escalation, where required by the governing clinical workflow, must be deterministic, auditable and human reviewed. It must not depend on an AI interpretation.

---

# 3. Unified platform architecture

The platform is organised into six product domains and eighteen implementation layers.

## Domain A: Health Marketplace

### 01. Health Discovery

- Search and browse tests.
- Browse health goals and categories.
- Educational test information.
- Provider and laboratory information.
- Accreditation and quality information.

### 02. Test Recommendation

- User goal and context.
- Biomarker coverage requirements.
- Test suitability rules.
- Clinical relevance separated from commercial ranking.
- Transparent reasons for recommendations.

### 03. Provider Comparison

Compare:

- Price.
- Biomarker coverage.
- Turnaround.
- Sample method.
- Phlebotomy or home visit.
- Doctor review.
- Location.
- Included and additional fees.
- Accreditation and provider attributes.

The comparison engine must never silently prefer a provider because of commission.

### 04. Test and Provider Catalogue

- Providers.
- Laboratories.
- Tests.
- Provider tests.
- Biomarker mappings.
- Scrape provenance.
- Catalogue quality controls.
- Availability and pricing history where supported.

---

## Domain B: Health Memory

### 05. Order and Referral Tracking

Track the commercial journey without turning affiliate data into clinical data.

- Referral event.
- Provider order.
- Test selected.
- Order state.
- Result expected.
- Result received.
- Reconciliation state.

### 06. Results Ingestion

One canonical inbound contract for every route:

- PDF upload.
- Image upload.
- Manual entry.
- Laboratory API.
- Partner platform.
- Email ingestion where approved.
- FHIR import.
- Future device and wearable adapters.

All routes converge on the same validation and provenance pipeline.

### 07. Document Intelligence

- Secure original storage.
- PDF parsing.
- OCR.
- Structured extraction.
- Biomarker identification.
- Unit detection.
- Reference range extraction.
- Test date and specimen date extraction.
- Laboratory and provider identification.
- Confidence scoring.
- Extraction job management.
- Retry and idempotency.

The original document remains evidence. Extracted data is a draft until verified.

### 08. Results Validation

Deterministic checks cover:

- Required fields.
- Biomarker identity.
- Units.
- Numeric and categorical value validity.
- Reference-range structure.
- Date consistency.
- Duplicate detection.
- Impossible values or parsing anomalies.
- Source/report relationships.
- Cross-field consistency where rules exist.

Validation failures must be visible rather than silently repaired.

### 09. Patient Verification

A review screen presents:

- Source document.
- Extracted value.
- Unit.
- Reference range.
- Biomarker mapping.
- Date.
- Laboratory.
- Confidence.
- Highlighted uncertainty.

The person confirms, edits or rejects each item. Corrections create audit history.

### 10. Health Data Provenance

Every trusted data point remains linked to its source. Provenance is immutable or superseded, never silently overwritten.

The system must support source hierarchy, for example:

1. Verified laboratory result.
2. Verified clinical document.
3. Patient-entered data.
4. AI-extracted but unverified draft.
5. AI-generated derivative such as summary or translation.
6. External knowledge source.

These categories must never be conflated.

---

## Domain C: Health Intelligence

### 11. Biomarker Ontology

Canonical biomarker layer with:

- Biomarker identity.
- Aliases.
- Units.
- Versioned unit conversion.
- LOINC mapping.
- Test-to-biomarker many-to-many relationships.
- Specimen context.
- Method and laboratory context.
- Contextual reference ranges.
- Sex and age context.
- Menstrual and cycle context where relevant.
- Hormone medication context.

LOINC remains the preferred interoperability identifier for laboratory and other health observations where an appropriate mapping exists. LOINC describes itself as the international standard for identifying health observations, measurements and documents. citeturn0search9

### 12. Longitudinal Health Engine

The core engine converts isolated observations into a historical series.

For every biomarker, support:

- Latest value.
- Previous value.
- Full historical series.
- Absolute change.
- Percentage change where mathematically valid.
- Trend direction.
- Time since previous result.
- Reference range at each measurement.
- Laboratory and method context.
- Unit conversion provenance.
- Data-quality state.
- Source drill-down.

Do not present a mathematical trend as a diagnosis.

### 13. Health Timeline

A unified chronological timeline combines:

- Diagnostic reports.
- Laboratory observations.
- Symptoms.
- Medications.
- Medication changes.
- Procedures.
- Appointments.
- Referrals.
- Vaccinations.
- Lifestyle/context events.
- Wearable summaries in later phases.
- Patient journal entries.
- Clinician comments.
- Retest events.

The timeline is the central Health Memory view.

### 14. Retest Intelligence Engine

This is the primary product differentiator.

Inputs:

- Time since last test.
- Previous result.
- Historical trend.
- Test category.
- Biomarker coverage.
- Previous testing frequency.
- User health goal.
- Relevant evidence-based interval rule.
- Clinical context.
- Provider availability.

Outputs must be structured and explainable, for example:

- No action.
- Routine review.
- Monitoring opportunity.
- Clinician review pathway.

Every recommendation includes:

- Last tested.
- Last result.
- Trend.
- Rule used.
- Evidence source.
- Rule version.
- Review date.
- Reason for recommendation.
- What information is missing.
- Relevant test options.

The engine then hands the user back to the provider comparison marketplace.

---

## Domain D: Personal Health Record

### 15. Personal Health Record

The record becomes a living patient-controlled health memory, not a document folder.

Core record areas:

- Profile.
- Conditions and diagnoses where verified.
- Allergies.
- Medications.
- Medication timeline.
- Procedures.
- Investigations.
- Laboratory results.
- Symptoms.
- Lifestyle/context.
- Family history.
- Vaccinations.
- Journal.
- Documents.
- Clinician comments.
- Retest history.
- Sharing history.

### HDA-derived Health Memory features

Adopt the underlying product patterns demonstrated by Health Data Avatar, without copying proprietary code, branding or wording.

HDA currently emphasises patient-controlled health memory, broad file ingestion, editable health data, searchable health history, fine-grained sharing, FHIR and LLM-oriented exports, redaction and AI chat. citeturn0search0turn0search3

Adopt:

- Editable health tree.
- Tags and document comments.
- Free-form health journal.
- Patient context separate from verified clinical observations.
- Gap detection.
- Conflict detection.
- Source-grounded smart search.
- Appointment preparation.
- Multilingual summaries and translations as derived artefacts.
- Medication extraction and medication timeline.
- Original document preview.
- Selective redaction.
- Structured export.
- Patient-controlled sharing.

Do not treat patient comments as clinical facts without provenance and verification state.

### 16. Clinician Sharing and Reports

Provide:

- Factual longitudinal report.
- Selected-result report.
- Full-record report.
- Clinician summary.
- Source-document attachments.
- Trend charts.
- Medication timeline.
- Relevant context.
- Data gaps.
- Conflict flags.
- Secure short-lived links.
- Password protection.
- Expiry.
- Revocation.
- Access logging.
- Optional QR access.

No permanent public document URLs.

Sharing must support least-privilege scopes rather than all-or-nothing access.

---

## Domain E: Interoperability and Connectivity

### 17. Interoperability / FHIR

Target resources include:

- Patient.
- DiagnosticReport.
- Observation.
- DocumentReference.
- Specimen.
- Medication-related resources as the medication model matures.
- Provenance.
- Questionnaire and QuestionnaireResponse later.

FHIR's current diagnostics model separates the report-level context from individual observations, with DiagnosticReport linking to atomic Observation resources. This aligns directly with our report → observation architecture. citeturn1search0turn1search2

The platform must support export and future import. FHIR compatibility must not be described as NHS connectivity.

### Adapter architecture

All external data routes use an adapter boundary.

Each adapter records:

- Source.
- Version.
- Authentication method.
- Mapping version.
- Data quality status.
- Last successful sync.
- Failure state.
- Retry state.
- Provenance requirements.
- Export and exit capability.

No partner integration proceeds against an undocumented API contract.

### Future wearable and questionnaire adapters

Architect now, build later:

- Apple Health / HealthKit.
- Google Health.
- Oura.
- Whoop.
- Questionnaires.
- Device measurements.

HDA has already moved in this direction with wearable ingestion and an MCP interface for controlled access to documents, medications, wearables and questionnaires. citeturn0search1turn0search2

---

## Domain F: Health Intelligence AI

### 18. Health Intelligence AI

AI capabilities are layered over verified and appropriately labelled data.

#### Stage 1

- Source-grounded search.
- Explain a result in plain language.
- Summarise a report.
- Find historical results.
- Compare two dates.
- Prepare a clinician summary.

#### Stage 2

- Cross-biomarker trend analysis.
- Context-aware questions.
- Appointment preparation.
- Data-gap identification.
- Conflict detection.
- Medication and symptom timeline questions.

#### Stage 3

- Personal health assistant.
- Health goal planning.
- Evidence-linked education.
- Explainable health scores.
- Personalised targets.
- Wearable/context correlation.

#### Stage 4

- External AI agent access through a controlled API or MCP-style layer.
- Explicit read/write scopes.
- OAuth 2.1 + PKCE where appropriate.
- Revocation.
- Audit logging.

HDA's MCP design is a useful reference for fixed tools, explicit permissions, OAuth 2.1 + PKCE and revocation. citeturn0search1

### AI safety rule

The assistant answers from authorised sources and states when the record is incomplete. It must not fabricate missing history, silently promote patient notes to clinical facts or present an AI-generated diagnosis as established fact.

---

# 4. New HDA-derived architectural layers

These are now first-class parts of the design, not optional extras.

| Capability | Decision | Build stage |
| --- | --- | --- |
| Health Memory | ADOPT | Phase 1 foundation |
| Unified Health Timeline | ADOPT | Phase 1/3 |
| Patient context and journal | ADOPT | Phase 1/5 |
| Editable health tree | ADOPT | Phase 5 |
| Data-gap engine | ADOPT | Phase 3/4 |
| Conflict detection | ADOPT | Phase 3/4 |
| Medication timeline | ADOPT | Phase 1/3 |
| Source-grounded smart search | ADOPT | Phase 9 |
| Appointment preparation | ADOPT | Phase 9 |
| Multilingual derivative model | ARCHITECT NOW | Phase 2/9 |
| PII detection and redaction | ARCHITECT NOW | Phase 6 |
| FHIR export | ADOPT | Phase 8 |
| LLM-friendly export | ADOPT | Phase 8/9 |
| Wearable adapters | ARCHITECT NOW | Phase 7/9 |
| Questionnaire adapters | ARCHITECT NOW | Phase 7/9 |
| External AI agent/MCP boundary | ARCHITECT NOW | Phase 9/10 |
| WhatsApp/Telegram journal ingestion | DEFER | Post-launch |
| Disease prediction | DO NOT BUILD NOW | Governance-dependent future research |

HDA's own release history shows why these features should be designed as separate processing jobs, with retry and recovery rather than one opaque upload workflow. citeturn0search2

---

# 5. Forth-derived architecture retained

The existing Forth review remains part of the design.

Adopted patterns:

- Controlled result release.
- Practitioner review state.
- Clinician comments.
- Longitudinal charts.
- Previous versus latest result context.
- Curated test profiles.
- Notifications with privacy-safe content.
- Cycle-aware hormone context.
- Contextual reference ranges.
- Adapter architecture.
- Future health scores and personalised targets.

Forth's model is especially useful for the operational journey from testing to result delivery and longitudinal review. Our architecture must outperform it on provider neutrality and patient-controlled cross-provider continuity.

Do not reproduce proprietary scoring such as Forth FORM. Do not use black-box composite health scores without explainability, versioning and governance.

---

# 6. Data architecture

## Canonical record model

```text
User
 └── Health Profile
      ├── Documents
      │    └── Diagnostic Reports
      │          ├── Specimens
      │          └── Observations
      │                ├── Biomarker
      │                ├── Reference Range
      │                ├── Provenance
      │                └── Verification
      │
      ├── Health Events
      │    ├── Symptoms
      │    ├── Medications
      │    ├── Procedures
      │    ├── Lifestyle / Context
      │    └── Journal Entries
      │
      ├── Longitudinal Series
      │    └── Biomarker History
      │
      ├── Retest Intelligence
      │    ├── Rules
      │    ├── Candidates
      │    └── Reminders
      │
      ├── Sharing
      │    ├── Reports
      │    ├── Permissions
      │    └── Access Logs
      │
      └── Interoperability
           ├── FHIR
           ├── LOINC
           └── External Adapters
```

## Canonical entities

Existing canonical entities remain authoritative. No parallel result, biomarker, audit or consent tables should be created merely to fit a new feature.

Key canonical entities include:

- `user_profiles`
- `health_profiles`
- `source_documents`
- `diagnostic_reports`
- `specimens`
- `observations`
- `observation_reference_ranges`
- `reference_range_contexts`
- `verification_records`
- `audit_logs`
- `biomarker_hub`
- `clinical_loinc_mappings`
- provider and catalogue entities
- retest and reminder entities
- sharing entities
- ingestion and AI processing entities

Where a new concept is required, first reconcile it against the live schema and architecture gap report.

---

# 7. Processing architecture

Every ingestion route follows this pipeline:

```text
Source
  ↓
Ingestion Adapter
  ↓
Original Evidence Stored
  ↓
Processing Job
  ↓
Extraction
  ↓
Biomarker / Entity Matching
  ↓
Deterministic Validation
  ↓
Draft Record
  ↓
Patient Verification
  ↓
Trusted Observation / Health Event
  ↓
Longitudinal Engine
  ↓
Retest Engine / AI / Sharing
```

Every processing job must have:

- ID.
- Status.
- Attempt count.
- Idempotency key.
- Source reference.
- Processing version.
- Started and completed timestamps.
- Failure reason.
- Safe retry behaviour.
- Audit trail.

---

# 8. Clinical context architecture

Health data must be contextual, but context must not be confused with the observation itself.

## Context dimensions

- Age.
- Sex at birth where clinically relevant.
- Pregnancy status where relevant.
- Menstrual status.
- Cycle day.
- Cycle phase.
- Hormonal contraception.
- HRT.
- Relevant hormone medication.
- Fasting status.
- Time of day.
- Specimen type.
- Laboratory.
- Assay/method where available.
- Relevant symptoms.
- Medication start/stop dates.
- Lifestyle events.

## Female health

Cycle-aware hormone tracking is foundational rather than a bolt-on feature. The architecture must support cycle-aware reference ranges, longitudinal hormone curves and model versions without copying a proprietary fertility score.

---

# 9. Health scoring and personalised targets

Health scores are deliberately later than longitudinal data and retest intelligence.

When eventually built:

1. Biomarker data.
2. Data-quality state.
3. Trend.
4. Context.
5. Health domain.
6. Evidence source.
7. Target rule.
8. Explainable score.
9. Personalised target.
10. Suggested action.
11. Retest interval.

Scores must be:

- Versioned.
- Explainable.
- Evidence-linked.
- Reproducible.
- Auditable.
- Optional.

No opaque score should become the primary health experience.

---

# 10. Benchmarking

Benchmarking is architecture-only until governance exists.

Potential future cohorts:

- Age band.
- Sex at birth.
- Approved population cohorts.

Controls required before activation:

- Minimum cohort size.
- Small-cell suppression.
- De-identification.
- Statistical methodology.
- Confidence intervals where appropriate.
- Data provenance.
- Consent and lawful basis.
- Clinical governance.
- Versioned benchmark dataset.

Benchmarking remains OFF by default.

---

# 11. Privacy and security architecture

Health data is special-category personal data. The platform must enforce privacy through architecture, not policy copy alone.

Required controls include:

- Private object storage.
- User-scoped RLS.
- Least-privilege grants.
- Server-side secrets.
- Signed short-lived access where required.
- No public health document URLs.
- Sanitised logs.
- No health data in advertising analytics.
- Consent records.
- Access audit logs.
- Retention controls.
- Export and deletion workflows.
- Admin MFA.
- Dependency scanning.
- Security monitoring.
- Backup and disaster recovery testing.
- Incident response.
- Data-subprocessor register.

PII detection and redaction should operate before selected exports or AI handoff where appropriate.

---

# 12. Interoperability strategy

The internal model remains richer than any single external standard.

FHIR is the translation layer, not the internal database.

For diagnostics, the core relationship is:

**DiagnosticReport → Observation → Biomarker / LOINC**

FHIR's specification explicitly positions DiagnosticReport as the report-level context and Observation as the atomic measurement/assertion, with DiagnosticReport linking to its observations. citeturn1search0turn1search2

Future exports should include machine-readable resources plus the original evidence document where permitted.

---

# 13. External AI and agent architecture

Future external AI access must be permissioned rather than a raw database connection.

Proposed fixed tool families:

- `get_health_profile`
- `get_files_manifest`
- `get_file_transcript`
- `get_verified_observations`
- `get_medications`
- `get_health_events`
- `query_biomarker_series`
- `get_retest_candidates`
- `get_wearable_data`
- `get_questionnaire_responses`
- `add_journal_entry`
- `add_note`

Read and write permissions must be separate. Every external action must be auditable and revocable.

HDA's fixed-tool MCP approach is a useful architectural reference, not a reason to expose unrestricted access. citeturn0search1

---

# 14. Unified roadmap

## Phase 0 — Architecture and safety gate

**Current status: BLOCKED only by known external verification items.**

Complete:

- Repository architecture audit.
- Migration reconciliation.
- Live table inventory.
- RLS inventory.
- Canonical profile model.
- Provider/test catalogue audit.
- Biomarker mapping audit.
- Legacy table review.
- Architecture gap report.
- Safe retirement of `public.profiles`.

Outstanding:

- Supabase dashboard security settings.
- Backups/PITR verification.
- Cron inventory.
- Live grants verification.
- Storage MIME configuration verification.
- `SUPABASE_DB_URL` for remote migration parity.

**Exit gate:** every dashboard-only item verified and remote parity run succeeds.

---

## Phase 1 — Health Record + Health Memory Foundation

This phase is expanded from the original health-record foundation because the HDA review showed that the record needs context and memory architecture from the start.

Build:

- Health profile.
- Source documents.
- Diagnostic reports.
- Specimens.
- Observations.
- Reference ranges.
- Provenance.
- Verification records.
- Audit logging.
- Manual result entry.
- Patient context model.
- Health events.
- Journal entries.
- Medication entity and provenance.
- Medication timeline foundation.
- Timeline event contract.
- Source hierarchy.
- Derived artefact model for translations and summaries.
- Processing job model.
- Basic Health Memory UI.

**Exit gate:** a user can manually add a result and context, verify it, view its provenance and see it on a chronological timeline without AI.

---

## Phase 2 — Document Intelligence

Build:

- Secure upload.
- PDF parsing.
- OCR/image reading.
- Structured extraction.
- Biomarker matching.
- Unit detection.
- Reference range extraction.
- Laboratory identification.
- Test date/specimen date extraction.
- Confidence scoring.
- Deterministic validation.
- Draft review.
- Corrections.
- Processing retries.
- Idempotency.
- Synthetic fixtures.
- Multilingual extraction foundation.

**Exit gate:** representative documents from multiple providers produce reviewable drafts with source-linked evidence and no unverified value enters the trusted record.

---

## Phase 3 — Biomarker Ontology + Longitudinal Engine

Build:

- Canonical biomarker mapping.
- Alias resolution.
- Unit conversion.
- LOINC mappings.
- Method/specimen context.
- Historical ranges.
- Biomarker series.
- Trend calculations.
- Charts.
- Source drill-down.
- Health timeline expansion.
- Data-quality indicators.
- Gap detection.
- Conflict detection.

**Exit gate:** a user can upload or enter multiple historical results and see a correct longitudinal series across providers.

---

## Phase 4 — Retest Intelligence

Build:

- Retest rule schema.
- Evidence and governance fields.
- Rule versioning.
- Time-based rules.
- Result-based rules.
- Trend-based rules.
- Coverage engine.
- Goal-aware rules.
- Monitoring states.
- Retest events.
- Reminders.
- Provider comparison handoff.
- Commission-independence tests.
- Clinical governance workflow.

**Exit gate:** the system identifies a retest candidate, explains why, shows the evidence and hands the user to a provider-neutral comparison.

---

## Phase 5 — Personal Health Record UX

Build:

- Health dashboard.
- Results.
- Biomarkers.
- Documents.
- Timeline.
- Health memory tree.
- Journal.
- Medications.
- Retests.
- Gaps.
- Conflicts.
- Family/dependent profiles where governance permits.
- Mobile-first experience.
- WCAG 2.2 AA.
- Empty/loading/error states.

**Exit gate:** the record is usable without technical knowledge and a user can find their complete health story without knowing which provider supplied the data.

---

## Phase 6 — Clinician Reports + Secure Sharing

Build:

- Factual reports.
- Longitudinal reports.
- Selected data scopes.
- Password-protected shares.
- Expiry.
- Revocation.
- Access logs.
- QR access.
- PII detection.
- Selective redaction.
- Clinician comments.
- Controlled release.

**Exit gate:** a user can safely share a defined subset of their record and revoke access without exposing the remainder.

---

## Phase 7 — Provider, Laboratory and External Data Integrations

Build:

- API adapters.
- Laboratory matching.
- Patient/profile matching.
- Email result ingestion where approved.
- FHIR import.
- Wearable adapter contracts.
- Questionnaire adapter contracts.
- Sync monitoring.
- Reconciliation.
- Failure recovery.

**Exit gate:** at least one external result source enters the same validation/provenance pipeline as a document upload.

---

## Phase 8 — FHIR + LOINC Interoperability

Build:

- FHIR mapping service.
- Patient export.
- DiagnosticReport export.
- Observation export.
- DocumentReference.
- Specimen.
- Provenance.
- Terminology mapping.
- Export validation.
- Import validation where supported.

**Exit gate:** an external system can consume a validated, traceable health record export without proprietary schema knowledge.

---

## Phase 9 — Health Intelligence AI

Build:

- Verified-data retrieval.
- Source-grounded search.
- Health-record Q&A.
- Historical result questions.
- Trend explanations.
- Appointment preparation.
- Health summaries.
- Data-gap explanations.
- Conflict explanations.
- Medication/context timeline queries.
- Evidence-linked health education.
- Multilingual summaries.
- AI safety and refusal rules.

**Exit gate:** the AI answers from authorised evidence, cites source records internally, exposes uncertainty and never silently promotes generated content to clinical truth.

---

## Phase 10 — Advanced Health Intelligence

Only after governance, data quality and safety foundations are proven.

Build:

- Explainable health scores.
- Personalised targets.
- Benchmarking under strict governance.
- Wearable correlations.
- Cycle-aware modelling.
- Advanced goal planning.
- External AI agent/MCP access.
- API ecosystem.
- Future research-grade risk modelling only under formal clinical governance.

**Exit gate:** every advanced intelligence feature has evidence, versioning, governance, reproducibility and a safe failure mode.

---

# 15. Completion gates

No phase is complete because a screen exists.

Every task must satisfy five conditions:

1. **Implementation** — code/schema/config exists.
2. **Verification** — behaviour is proven.
3. **Security review** — RLS, grants, provenance, retention and data classification are reviewed.
4. **Regression testing** — marketplace, catalogue, provider, referral, SEO and existing user flows remain intact.
5. **Acceptance criteria** — the task's explicit criteria are met.

Status values:

- `NOT STARTED`
- `IN PROGRESS`
- `BLOCKED`
- `COMPLETE`
- `DEFERRED`
- `FAILED / REWORK REQUIRED`

A task with four of five conditions remains `IN PROGRESS`.

---

# 16. Master completion checklist

## Governance

- [ ] Architecture locked.
- [ ] Canonical entities reconciled.
- [ ] Clinical safety rules documented.
- [ ] Commercial independence enforced.
- [ ] Data ownership and exit defined.

## Phase 0

- [x] Repository audit.
- [x] Migration reconciliation in repository.
- [x] Live table inventory.
- [x] RLS inventory.
- [x] Canonical profile model.
- [x] Catalogue audit.
- [x] Biomarker mapping audit.
- [x] Legacy review.
- [x] Architecture gap report.
- [x] `public.profiles` retirement.
- [ ] Dashboard security verification.
- [ ] Backup/PITR verification.
- [ ] Cron inventory.
- [ ] Live grants verification.
- [ ] Storage MIME verification.
- [ ] Remote migration parity.
- [ ] Phase 0 exit gate.

## Phase 1

- [ ] Health profile.
- [ ] Source document model and upload.
- [ ] Diagnostic report model.
- [ ] Observation contract.
- [ ] Reference-range model.
- [ ] Provenance.
- [ ] Verification workflow.
- [ ] Audit logging.
- [ ] Manual entry.
- [ ] Patient context.
- [ ] Health events.
- [ ] Journal.
- [ ] Medication timeline foundation.
- [ ] Derived artefacts.
- [ ] Processing job foundation.
- [ ] Health Memory UI.
- [ ] Security and regression gate.

## Phase 2

- [ ] Secure document ingestion.
- [ ] PDF parsing.
- [ ] OCR.
- [ ] AI extraction.
- [ ] Biomarker matching.
- [ ] Unit and range extraction.
- [ ] Date/laboratory extraction.
- [ ] Confidence scoring.
- [ ] Deterministic validation.
- [ ] Patient review.
- [ ] Corrections.
- [ ] Retry/idempotency.
- [ ] Multilingual foundation.
- [ ] Synthetic fixtures.
- [ ] Safety gate.

## Phase 3

- [ ] Biomarker ontology.
- [ ] Alias resolution.
- [ ] Units and conversion.
- [ ] LOINC mapping.
- [ ] Historical ranges.
- [ ] Longitudinal series.
- [ ] Trend engine.
- [ ] Charts.
- [ ] Timeline.
- [ ] Data-quality indicators.
- [ ] Gap engine.
- [ ] Conflict engine.
- [ ] Regression gate.

## Phase 4

- [ ] Retest rules.
- [ ] Evidence model.
- [ ] Versioning.
- [ ] Time rules.
- [ ] Result/trend rules.
- [ ] Coverage engine.
- [ ] Goal-aware logic.
- [ ] Monitoring states.
- [ ] Retest events.
- [ ] Reminders.
- [ ] Provider handoff.
- [ ] Commission-independence test.
- [ ] Clinical governance.

## Phase 5

- [ ] Health dashboard.
- [ ] Results.
- [ ] Biomarkers.
- [ ] Documents.
- [ ] Timeline.
- [ ] Health Memory tree.
- [ ] Journal.
- [ ] Medications.
- [ ] Retests.
- [ ] Gaps/conflicts.
- [ ] Dependants.
- [ ] WCAG 2.2 AA.
- [ ] Mobile QA.

## Phase 6

- [ ] Clinician report builder.
- [ ] Longitudinal report.
- [ ] Secure sharing.
- [ ] Scope controls.
- [ ] Password protection.
- [ ] Expiry.
- [ ] Revocation.
- [ ] Access logs.
- [ ] QR sharing.
- [ ] PII detection.
- [ ] Redaction.
- [ ] Clinician comments.
- [ ] Controlled release.

## Phase 7

- [ ] API adapter contract.
- [ ] Laboratory matching.
- [ ] Patient matching.
- [ ] Email ingestion where approved.
- [ ] FHIR import.
- [ ] Wearable adapters.
- [ ] Questionnaire adapters.
- [ ] Monitoring.
- [ ] Reconciliation.
- [ ] Recovery.

## Phase 8

- [ ] FHIR Patient.
- [ ] FHIR DiagnosticReport.
- [ ] FHIR Observation.
- [ ] FHIR DocumentReference.
- [ ] FHIR Specimen.
- [ ] FHIR Provenance.
- [ ] LOINC mapping.
- [ ] Export validation.
- [ ] Import validation.
- [ ] Security review.

## Phase 9

- [ ] Verified-data retrieval.
- [ ] Smart search.
- [ ] Health-record Q&A.
- [ ] Trend analysis.
- [ ] Appointment preparation.
- [ ] Health summaries.
- [ ] Gap/conflict explanation.
- [ ] Medication/context queries.
- [ ] Evidence-linked education.
- [ ] Multilingual output.
- [ ] AI safety gate.

## Phase 10

- [ ] Explainable health scores.
- [ ] Personalised targets.
- [ ] Governed benchmarking.
- [ ] Wearable correlations.
- [ ] Cycle-aware modelling.
- [ ] Advanced goal planning.
- [ ] External AI agent access.
- [ ] Public API ecosystem.
- [ ] Formal research governance for any risk modelling.

---

# 17. Product milestones

### Milestone 1 — Trusted Record

User manually enters or verifies a result and sees it in a secure longitudinal record with provenance.

### Milestone 2 — Import Any Result

User uploads a laboratory report and receives a reviewable extraction draft.

### Milestone 3 — See Your Health Over Time

Multiple results from different providers appear as one biomarker history.

### Milestone 4 — Know What to Retest

The retest engine identifies appropriate monitoring opportunities and links directly back to provider comparison.

### Milestone 5 — Bring Your Whole Health Story

Documents, medications, symptoms, journal and context become one patient-controlled timeline.

### Milestone 6 — Share Safely

A user sends a time-limited, purpose-specific record to a clinician.

### Milestone 7 — Ask Your Health Record

The assistant answers questions from authorised, verified data and points back to source evidence.

### Milestone 8 — Connect the Ecosystem

FHIR, laboratory APIs, wearables, questionnaires and external AI agents plug into the same governed architecture.

---

# 18. Competitive position

| Platform | Strongest capability | Our response |
| --- | --- | --- |
| Anamoris | Document ingestion, verification, longitudinal archive | Adopt provenance, review and family/profile concepts |
| LabTracker | Local-first privacy and structured lab tracking | Adopt privacy-by-architecture principles and transparent data controls |
| Ornament | Scale, biomarker breadth, longitudinal health experience | Match breadth over time, but retain stronger provenance and provider neutrality |
| Tohar | Lab analysis connected to test ordering | Build the full retest-to-marketplace loop |
| Forth Connect | Integrated testing, controlled release, practitioner workflow, health plans | Match workflow patterns while remaining provider-neutral |
| Health Data Avatar | Patient-owned health memory, multimodal context, sharing, search, agent access | Build a stronger diagnostics-native memory layer tied directly to testing and retesting |
| myhealth checkup | UK provider comparison and referral marketplace | Connect the marketplace to the longitudinal patient record and make the loop continuous |

The strategic moat is not one AI model. It is the combination of:

**provider network + test catalogue + biomarker ontology + patient health memory + longitudinal observations + provenance + retest intelligence + provider integrations + secure sharing + interoperability + patient trust.**

---

# 19. What we deliberately do not build yet

- Autonomous diagnosis.
- Autonomous prescribing.
- Black-box disease prediction.
- Proprietary third-party scoring copied into the product.
- Live population benchmarking before statistical governance.
- Provider-biased clinical ranking.
- Unrestricted AI access to the database.
- Public health document URLs.
- Clinician portals before consent and governance are complete.
- WhatsApp/Telegram ingestion before the core data model and security controls are proven.
- NHS connectivity claims before an actual approved integration exists.

---

# 20. Definition of done for the whole programme

The programme is not complete until:

1. The existing marketplace remains intact.
2. The Health Record is clinically structured and provenance-preserving.
3. Results from multiple providers can be combined safely.
4. AI extraction never bypasses verification.
5. Biomarker history works across years and providers.
6. Retest intelligence closes the loop back to provider comparison.
7. Health Memory captures both clinical evidence and patient context without conflating them.
8. Clinician sharing is granular, time-limited and auditable.
9. FHIR/LOINC interoperability is validated.
10. AI answers from authorised data and exposes uncertainty.
11. Security, privacy, retention, backup and disaster recovery controls are verified.
12. Accessibility and SEO remain intact.
13. Every tracker item has implementation, verification, security, regression and acceptance evidence.
14. The person can export their record and leave without losing ownership of their health history.

This is the programme baseline. Future changes should update this blueprint and the machine-readable tracker together rather than creating parallel roadmaps.
