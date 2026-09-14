# MyHealthCheckup Health Intelligence Platform

## Technical Master Plan

Status: Architecture baseline
Owner: MYHEALTHCHECKUP LTD
Platform: myhealth checkup
Primary stack: React + TypeScript + Vite + Supabase/PostgreSQL
Primary jurisdiction: United Kingdom

## 1. Product objective

MyHealthCheckup will evolve from a private diagnostic comparison platform into a longitudinal personal health record and testing intelligence platform.

Core loop:

Discover -> Compare -> Test -> Receive -> Verify -> Store -> Track -> Understand -> Retest -> Compare again

The platform must combine the strongest ideas observed in Ornament, Anamoris, LabTracker and Tohar without copying their implementation or compromising clinical safety.

The marketplace remains the acquisition and transaction layer. The health record becomes the retention layer. The biomarker ontology becomes the data foundation. The retest engine becomes the recurring engagement and commercial loop. Interoperability becomes the long-term infrastructure layer.

## 2. Non-negotiable architectural principles

1. Supabase/PostgreSQL remains the system of record. Do not migrate the platform to Firebase.
2. The original laboratory document remains the source evidence.
3. AI extraction creates a draft only. AI must never write a trusted clinical observation directly.
4. Deterministic validation runs before persistence of an extracted result.
5. Patient verification is required before an uploaded result becomes a trusted longitudinal observation.
6. Every trusted observation must retain provenance back to its source report.
7. Original values, units and reference ranges must never be overwritten by normalised values.
8. Historical laboratory reference ranges remain attached to the individual result.
9. Canonical biomarker mapping must be separate from provider test naming.
10. Commercial ranking must remain separate from clinical relevance and must not be pay-to-rank.
11. AI must not autonomously diagnose, prescribe or replace clinical review.
12. Health data is UK GDPR special category data and must receive appropriate security, lawful-basis and governance controls.
13. The architecture should map cleanly to FHIR concepts without prematurely claiming NHS interoperability.
14. Build the data model before adding advanced AI features.
15. Prefer small, reversible changes and migration files. Never delete existing production data or functionality without explicit approval.

## 3. Target system layers

### Marketplace

1. Health Discovery
2. Test Recommendation
3. Provider Comparison
4. Test and Provider Catalogue
5. Order and Referral Tracking

### Health data

6. Results Ingestion
7. Document Intelligence
8. Results Validation
9. Patient Verification
10. Health Data Provenance
11. Biomarker Ontology
12. Longitudinal Results Engine
13. Health Timeline
14. Retest Intelligence

### User services

15. Personal Health Record
16. Clinician Reports and Secure Sharing

### Infrastructure

17. FHIR and LOINC interoperability
18. Health Intelligence AI

## 4. Core data model

The relational model should be built around the following entities.

### Identity and profiles

- auth.users
- health_profiles
- profile_memberships
- profile_relationships
- consent_records

A single account must support multiple health profiles for family use while maintaining strict isolation between profiles.

### Marketplace

- providers
- laboratories
- provider_locations
- tests
- test_variants
- test_biomarkers
- provider_test_identifiers
- categories
- test_categories
- affiliate_events
- orders
- order_items

### Biomarker ontology

- biomarkers
- biomarker_aliases
- biomarker_loinc_mappings
- biomarker_units
- biomarker_unit_conversions
- biomarker_categories
- biomarker_reference_definitions

### Results

- source_documents
- diagnostic_reports
- specimens
- observations
- observation_components
- reference_ranges
- observation_provenance
- extraction_jobs
- extraction_items
- validation_events
- verification_records

### Longitudinal intelligence

- health_events
- biomarker_series
- trend_snapshots
- retest_rules
- retest_events
- reminders
- recommendation_events

### Sharing and audit

- share_links
- share_permissions
- access_events
- audit_logs

### AI and platform operations

- ai_requests
- ai_outputs
- ai_prompt_versions
- model_versions
- system_events
- error_events

## 5. Canonical observation model

Every laboratory result should ultimately resolve to an observation with the following conceptual fields:

- observation_id
- health_profile_id
- diagnostic_report_id
- biomarker_id
- source_name
- source_value
- source_unit
- canonical_value
- canonical_unit
- value_type
- reference_low
- reference_high
- reference_text
- abnormal_flag_from_source
- specimen_id
- specimen_type
- collection_datetime
- result_datetime
- laboratory_id
- method_text
- source_document_id
- source_page
- source_text_excerpt
- extraction_method
- extraction_confidence
- validation_status
- verification_status
- verified_at
- verified_by
- created_at
- updated_at

Do not collapse source_value and canonical_value. Both are required for traceability.

## 6. Biomarker ontology

The biomarker layer is a strategic asset.

Each canonical biomarker should have:

- Stable internal ID
- Canonical name
- Preferred display name
- Synonyms
- Provider aliases
- Category
- Specimen type
- Preferred units
- Supported units
- Unit conversion rules
- LOINC mapping where appropriate
- Notes on comparability
- Active/inactive state

Example:

Raw provider terms:
- Serum Ferritin
- Ferritin
- Ferritin level

Canonical record:
- Ferritin

The mapping must not assume that similarly named tests are clinically identical. Method, specimen and unit differences must remain available.

## 7. Test-to-biomarker mapping

A provider test is not a biomarker.

A test should map to one or more canonical biomarkers through a many-to-many relationship.

Example:

Provider test: Comprehensive Health Panel

Biomarkers:
- HbA1c
- Total cholesterol
- HDL cholesterol
- LDL cholesterol
- Triglycerides
- ALT
- AST
- Creatinine
- eGFR
- Ferritin
- Vitamin B12
- Vitamin D

This mapping powers both comparison and retesting.

## 8. Results ingestion architecture

Support four ingestion routes.

### Route A: Provider or laboratory API

Structured results enter the ingestion service.

### Route B: FHIR

Accept compatible DiagnosticReport, Observation, Patient and related resources when integrations exist.

### Route C: PDF upload

Customer uploads a laboratory report.

### Route D: Image upload

Customer photographs a paper report.

Manual entry remains available as a fallback.

All routes should converge into the same validation and provenance pipeline.

## 9. Document intelligence pipeline

The pipeline is:

Upload
-> file security checks
-> malware/content validation
-> temporary processing object
-> document classification
-> OCR/document reading
-> table detection
-> result extraction
-> date extraction
-> laboratory/provider identification
-> biomarker matching
-> unit recognition
-> reference-range extraction
-> confidence scoring
-> validation
-> user review
-> verified observation

The original source document must remain associated with the final observation.

## 10. AI extraction contract

AI output must be structured and constrained.

The extraction service should return, at minimum:

- report date candidates
- sample collection date candidates
- laboratory candidates
- report type
- patient-name match indicator where appropriate
- result rows

Each result row:

- raw test name
- raw value
- raw unit
- raw reference range
- raw flag
- canonical biomarker candidate
- canonical biomarker confidence
- unit confidence
- reference-range confidence
- source page
- source text
- overall confidence

The AI must not produce clinical diagnoses as part of extraction.

## 11. Validation engine

Validation is deterministic and must run after extraction.

Checks include:

- valid numeric or categorical value
- valid unit for biomarker
- unit compatibility
- reference range structure
- date validity
- biomarker mapping confidence
- source text presence
- source-page validity
- laboratory recognition
- duplicate detection
- impossible or suspicious values
- unexpected unit/value combinations

Low-confidence or failed results move into a review queue.

Validation should never silently change the source result.

## 12. Patient verification

Uploaded results are initially Draft.

Customer sees:

- Biomarker
- Value
- Unit
- Reference range
- Test date
- Source laboratory
- Source document reference

Customer actions:

- Confirm
- Edit
- Reject

Only Confirmed observations become trusted longitudinal observations.

Corrections must create an audit record.

## 13. Provenance model

Every trusted observation must answer:

Where did this number come from?

The system must be able to show:

- original report
- page
- laboratory
- test/report identifier
- collection date
- result date
- raw value
- raw unit
- extracted value
- canonical value
- extraction method
- validation status
- patient verification status
- correction history

## 14. Longitudinal engine

The longitudinal engine groups observations by canonical biomarker while preserving laboratory-specific metadata.

Example:

Ferritin

2024-01: 18 µg/L
2024-08: 29 µg/L
2025-03: 41 µg/L
2026-08: 62 µg/L

The engine should calculate:

- chronological series
- absolute change
- percentage change where mathematically appropriate
- direction of change
- interval between tests
- historical reference-range status
- latest trusted observation
- previous trusted observation

Trend calculations must not be presented as clinical conclusions.

## 15. Unit normalisation

Store both original and canonical values.

Example:

source_value = 42
source_unit = nmol/L
canonical_value = 42
canonical_unit = nmol/L

If conversion is required:

source_value = original reported number
source_unit = original unit
canonical_value = converted number
canonical_unit = canonical unit
conversion_rule = versioned rule identifier

Never replace the original value.

## 16. Reference ranges

Reference ranges belong to individual observations because ranges vary by laboratory, method, population and other factors.

Store:

- reference_low
- reference_high
- reference_text
- source laboratory
- method where available
- source document

Never recalculate historical status using a current generic range without clearly labelling it as a separate analytical view.

## 17. Health timeline

Timeline events should include:

- test ordered
- test completed
- report received
- report verified
- clinician report generated
- result shared
- retest reminder created
- retest due
- new result received

The timeline should use the clinically relevant date where available, not merely the upload timestamp.

## 18. Retest Intelligence Engine

This should become a primary differentiator.

Inputs:

- previous test date
- previous trusted observation
- trend history
- biomarker category
- test coverage
- user-selected health goals
- previous testing frequency
- evidence-based retesting rules where appropriate
- provider availability
- user preferences
- clinical governance rules

Outputs:

- no action
- routine review
- monitoring opportunity
- clinician review pathway

The engine must not generate a retest recommendation solely because a provider pays a commission.

## 19. Retest rule model

Rules should be versioned and auditable.

Each rule should include:

- rule_id
- biomarker or test scope
- trigger type
- minimum interval
- preferred interval
- maximum interval if applicable
- evidence source
- jurisdiction
- clinical governance status
- effective date
- expiry/review date
- explanation text
- version

Do not hard-code clinical intervals directly into UI components.

## 20. Retest marketplace loop

When a valid retest event exists:

Health record
-> retest opportunity
-> relevant tests
-> provider comparison
-> provider selection
-> affiliate/referral event
-> external purchase
-> result ingestion
-> verification
-> longitudinal update
-> next monitoring calculation

This creates a recurring customer loop without turning health data into a sales mechanism.

## 21. Personal health record UX

Primary sections:

- Overview
- Results
- Biomarkers
- Timeline
- Documents
- Retests
- Shared reports
- Profile settings

Biomarker cards should prioritise:

- latest trusted result
- previous result
- test date
- trend
- original reference range
- source
- view history

Avoid dashboards that overwhelm users with hundreds of numbers.

## 22. Clinician report

One-click report generation should include:

- patient profile
- selected date range
- selected biomarkers
- current results
- previous results
- trends
- reference ranges
- test dates
- laboratories
- source document index
- user questions/notes

The report must distinguish measured facts from generated commentary.

## 23. Secure sharing

Users should be able to share:

- single result
- selected biomarkers
- selected date range
- report
- full record

Sharing mechanism:

- secure short-lived link
- explicit permissions
- expiry
- revocation
- access logging

No public document URLs.

## 24. FHIR architecture

Internal concepts should map cleanly to:

- Patient
- DiagnosticReport
- Observation
- DocumentReference
- Specimen
- ServiceRequest
- Organization
- Practitioner/PractitionerRole

FHIR's DiagnosticReport represents the report-level clinical context and links to atomic Observation results. Observation represents the individual measurements. This architecture is therefore appropriate for the proposed model.

FHIR is an interoperability target, not a claim of current NHS connectivity.

## 25. LOINC architecture

Where appropriate, canonical laboratory observations should carry LOINC mappings.

LOINC mapping should be versioned and reviewed.

Do not infer a LOINC code from name similarity alone when specimen, method or timing changes the meaning.

## 26. Security architecture

Because health data is UK GDPR special category data, security and governance must be designed into the product.

Required controls:

- Supabase Row Level Security
- least-privilege access
- encrypted storage
- encrypted transport
- signed document URLs
- strict service-role separation
- audit logging
- administrator MFA
- secrets management
- dependency monitoring
- vulnerability management
- backup and recovery
- secure deletion
- incident response process
- data retention rules
- DPIA
- documented Article 6 lawful basis
- documented Article 9 condition
- appropriate policy documentation where required

No health-data table should rely on front-end filtering as its security boundary.

## 27. Data minimisation

Collect only what is necessary for the stated purpose.

Separate:

- identity data
- health data
- source documents
- analytics
- audit data

Do not send identifiable health information to advertising or analytics services.

## 28. AI governance

AI services must be isolated behind server-side functions.

Never expose provider/API secrets in the browser.

Every AI operation should record:

- request ID
- user/profile context
- model
- model version
- prompt/template version
- input document ID
- output schema version
- timestamp
- validation result

AI-generated text must never overwrite source observations.

## 29. Clinical safety boundaries

The platform is a comparison and personal health record service unless and until a separately governed clinical service is introduced.

Do not implement:

- autonomous diagnosis
- medication changes
- treatment prescriptions
- definitive interpretation of complex conditions
- automated clinical decisions presented as medical advice

The platform may present measured values, historical trends, educational explanations and prompts to seek appropriate clinical review.

## 30. Marketplace independence

Provider ranking must be explainable.

Ranking factors may include:

- relevance
- price
- biomarker coverage
- sample method
- turnaround
- location
- included services
- accreditation
- user-selected filters

Commission must not secretly override relevance.

Affiliate relationships must be disclosed.

## 31. Admin architecture

Admin users require dedicated controls for:

- providers
- laboratories
- tests
- biomarker mappings
- provider URLs
- pricing
- turnaround
- accreditation
- test verification status
- data-quality flags
- extraction review
- validation failures
- retest rules
- AI prompt versions
- audit logs

Provider and test data should carry last-verified timestamps.

## 32. Development phases

### Phase 0: Architecture and audit

- Audit current application
- Audit current Supabase schema
- Identify existing tables and migrations
- Map current provider/test data
- Confirm authentication model
- Confirm current RLS
- Produce migration plan
- Freeze no existing functionality

Exit criteria: architecture gap analysis approved.

### Phase 1: Health record foundation

- health profiles
- source documents
- diagnostic reports
- specimens
- observations
- biomarkers
- reference ranges
- provenance
- verification
- audit logs

Exit criteria: a user can create a profile, upload a test document placeholder, create/manual-enter a result, verify it and see it in a longitudinal record.

### Phase 2: AI document ingestion

- secure upload
- OCR/document processing
- structured extraction
- confidence scores
- validation
- review queue
- patient confirmation

Exit criteria: representative UK laboratory PDFs can be converted into verified observations with source provenance.

### Phase 3: Longitudinal health engine

- biomarker history
- charts
- trends
- reference-range display
- unit normalisation
- timeline

Exit criteria: multiple reports produce a coherent chronological history.

### Phase 4: Retest intelligence

- versioned rules
- due dates
- monitoring states
- reminders
- test-to-biomarker coverage
- marketplace handoff

Exit criteria: a verified history produces transparent retest opportunities and relevant comparison results.

### Phase 5: Sharing and reports

- clinician report
- secure sharing
- expiry
- revocation
- access audit

Exit criteria: a user can securely share selected health information and revoke it.

### Phase 6: Provider integrations

- provider APIs
- email ingestion where lawful and technically appropriate
- structured result ingestion
- automated patient matching

Exit criteria: at least one provider can deliver structured results end to end.

### Phase 7: Interoperability

- LOINC mapping
- FHIR export/import
- DiagnosticReport
- Observation
- DocumentReference
- Patient
- Specimen

Exit criteria: validated internal records can be represented as standards-compatible resources.

### Phase 8: Health Intelligence AI

- health record question answering
- trend summaries
- clinician preparation
- document search
- cross-result retrieval

Exit criteria: AI answers only from verified health data and clearly separates source facts from generated explanation.

## 33. MVP scope

The first production health-record release should include only:

- account
- health profile
- document upload
- secure storage
- manual result entry
- biomarkers
- diagnostic reports
- observations
- reference ranges
- provenance
- patient verification
- basic historical charts
- basic timeline
- basic retest reminders

Do not block MVP on NHS integrations, wearables, genomics or advanced AI.

## 34. Testing strategy

Every major layer requires:

- unit tests
- integration tests
- database tests
- RLS tests
- extraction fixtures
- validation fixtures
- regression tests
- security tests
- accessibility tests
- mobile tests

Create a permanent fixture library containing anonymised synthetic laboratory reports representing:

- common blood panels
- multi-page reports
- different layouts
- different units
- abnormal flags
- missing reference ranges
- OCR errors
- handwritten/photographed documents where appropriate
- multiple laboratories

Never use real patient documents in automated tests unless explicitly governed and appropriately de-identified.

## 35. Definition of done

A feature is not complete because the UI renders.

It is complete only when:

- database schema is migrated
- RLS is tested
- error states exist
- loading states exist
- mobile UX works
- accessibility is checked
- audit requirements are met
- source provenance is preserved
- relevant tests pass
- regression checks pass
- no existing functionality has been broken
- documentation is updated

## 36. Build discipline for Lovable/Codex

Use the sequence:

PATCH -> VERIFY -> AUDIT -> SECURE -> REGRESSION

For each feature:

1. Inspect current implementation.
2. Make the smallest complete change.
3. Run verification.
4. Audit data flow and RLS.
5. Review security implications.
6. Run regression checks.
7. Record the migration and acceptance criteria.

Never perform broad rewrites when a targeted change is sufficient.

## 37. Phase 0 immediate worklist

1. Audit all current Supabase migrations.
2. Generate current schema inventory.
3. Identify provider/test tables and relationships.
4. Identify existing authentication and profile tables.
5. Review current RLS policies.
6. Identify existing test-to-biomarker information.
7. Identify duplicate or legacy tables.
8. Create a canonical biomarker migration plan.
9. Create health-record tables in a separate migration.
10. Create source-document storage policy.
11. Create provenance and verification model.
12. Create synthetic extraction fixtures.
13. Create validation test suite.
14. Add audit logging.
15. Implement health-profile isolation.

No production result ingestion should begin until the Phase 0 security and schema review is complete.

## 38. Acceptance test for the complete core journey

Given a new customer:

1. Customer creates a health profile.
2. Customer uploads a laboratory PDF.
3. System stores the source document securely.
4. System creates an extraction job.
5. AI returns structured draft results.
6. Validation checks each result.
7. Low-confidence results are flagged.
8. Customer reviews the draft.
9. Customer confirms valid results.
10. System creates trusted observations.
11. Every observation links to the source report.
12. Biomarkers map to canonical IDs.
13. Results appear in the health record.
14. Historical results appear on the biomarker timeline.
15. The retest engine evaluates eligible rules.
16. A relevant retest opportunity is displayed where appropriate.
17. Customer opens provider comparison.
18. Affiliate/referral event is recorded.
19. New results later enter the same pipeline.
20. Longitudinal history updates without overwriting prior source data.

## 39. Strategic success criteria

The platform should ultimately be able to answer four questions better than competitors:

1. What should I test?
2. Where should I test it?
3. What has changed in my health data over time?
4. When is it appropriate to review or repeat relevant testing?

The competitive moat is not the AI model.

The moat is the combination of:

- UK provider network
- canonical test catalogue
- biomarker ontology
- provenance-linked health records
- longitudinal observations
- retest intelligence
- provider integrations
- interoperability
- patient trust

## 40. Immediate implementation decision

Do not rebuild the existing marketplace from scratch.

Extend the existing MyHealthCheckup application and Supabase database with a separate, versioned Health Intelligence domain.

The first technical deliverable is an architecture audit and schema map. The second is the health-record foundation migration. The third is the verified document-ingestion pipeline.

The marketplace and health record should share the canonical test and biomarker layers but remain logically separated so that clinical data never becomes a commercial ranking mechanism.
