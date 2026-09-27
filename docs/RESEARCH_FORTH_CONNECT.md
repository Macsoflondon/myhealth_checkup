# Research — Forth Connect (Humankind Ventures) as a potential integration partner

**Created:** 14 September 2026 · **Status:** discovery only. No contact made, no contract, no
integration built, nothing marked complete in the tracker beyond a research item.

**Provenance of everything below:** vendor-published marketing material, supplied and
summarised by the site owner from Forth's official product pages, plus one independent
report where cited. **These are vendor claims, not independently certified facts.** Nothing
here comes from Forth's internal implementation, and no proprietary code, schema or
documentation has been obtained, copied or inferred. Any statement about their API surface
is explicitly marked UNKNOWN until Forth supplies technical documentation under an
agreement.

---

## 1. What Forth publicly claims

### HealthCoach — <https://www.forthconnect.io/products/healthcoach/>

- Converts blood biomarkers into health scores across ten categories, including heart,
  hormone, immune, kidney, liver, mental, metabolic, muscle and bone, and nutritional health.
- Scores are weighted combinations of component biomarkers.
- Personal factors — age, gender, menstrual status — modify the result.
- Identifies focus areas, sets personalised incremental targets over roughly three to six
  months, and provides tailored guidance.

### ConnectPro — <https://www.forthconnect.io/products/connectpro/>

- Browser-based practitioner platform: ordering tests, building bespoke profiles, tracking
  clients, viewing and releasing results, client access, branded e-commerce.
- Claims ISO 27001 certification, UK data storage, UKAS ISO 15189 validation for its
  biomarker offering, and integration with multiple laboratories.

### Results App — <https://www.forthconnect.io/products/results-app/>

- Controlled results release, interactive graphs, comparison charts, educational content,
  health tracking, branded app options.

### MyFORM — <https://www.forthconnect.io/products/myform/>

- Maps four female hormones across the menstrual cycle using cycle-day-specific
  personalised ranges, produces a FORM score, identifies the LH surge.

### Platform and connectivity — <https://www.forthconnect.io/solutions/>

- Forth states its technology framework supports laboratory integration and API/connectivity
  options. Independent reporting also describes ConnectPro exposing order and result
  information through API integration.
- **UNKNOWN and to be treated as unknown:** endpoint inventory, resource schema,
  authentication model, webhook/callback support, FHIR conformance, sandbox availability,
  rate limits, SLAs, result-document retrieval, historical backfill, bulk export.

### Corporate claims

- More than one million results analysed and delivered; UK data processing and storage;
  UK GDPR; ISO 27001; clinical supervision by GMC-registered GPs.
- **Verification action:** re-read the current official pages at the point of any commercial
  discussion and request certificates directly (ISO 27001 statement of applicability and
  scope, UKAS 15189 scope per laboratory, DPIA support, sub-processor list). Marketing pages
  are not evidence of certification scope.

---

## 2. Architecture comparison

### A. What Forth appears to have solved better than our current design

| Area | Why |
| --- | --- |
| Multi-laboratory order and result plumbing | We have none. Our catalogue ends at an affiliate hand-off; we never see a structured result. Forth claims live integrations with several laboratories. |
| Structured biomarker result delivery | Our only ingestion route today is a user-uploaded PDF, which requires the whole document-intelligence pipeline (Phase 2) before it yields anything trustworthy. A structured feed bypasses OCR, table detection and extraction confidence entirely. |
| Controlled result release | The clinical-governance workflow of holding a result until a clinician releases it is genuinely non-trivial and they have it in production. |
| Cycle-aware female hormone modelling | Cycle-day-specific reference ranges are a real clinical modelling problem. MyFORM is ahead of anything we have specified. |
| Practitioner-facing tooling | ConnectPro is a working practitioner console. Our Phase 6 clinician reports are unbuilt. |
| Operating clinical supervision | GMC-registered GP oversight already in place; for us that is a hiring and governance exercise, not a code one. |

### B. Integrate rather than rebuild

1. **Laboratory order fulfilment and result ingestion** — the single largest accelerator, and
   the one that costs us least in strategic terms because it sits *upstream* of our canonical
   model.
2. **Structured result delivery** as a normalised inbound feed, if and only if it maps to our
   own inbound contract (section 4).
3. **Result-release workflow** for any Forth-fulfilled order, treating release as an event we
   record rather than a process we own.
4. **Phlebotomy / kit logistics** where Forth's laboratory relationships already cover it.

### C. Learn from, but build ourselves

1. **Health scoring.** A HealthCoach-like category score is a product differentiator and must
   be explainable and auditable by us. Learn the category taxonomy and the idea of weighted
   component scores; own the weights, the versioning and the rationale.
2. **Personalised incremental targets.** Same reasoning. Targets must be traceable to a
   versioned rule with a recorded evidence source, exactly as `retest_rules` requires.
3. **Cycle-aware ranges.** Learn the model; implement in our own
   `biomarker_reference_definitions` so it applies to results from any provider, not only
   Forth's.
4. **Longitudinal engine, retest intelligence, PHR UX, secure sharing.** These are the product.

### D. Must NOT outsource

| Must stay ours | Why |
| --- | --- |
| The canonical biomarker ontology (`biomarker_hub`) | It is the interoperability layer that lets a Medichecks result and a Randox result sit on one chart. Delegating it re-couples us to one vendor's naming. |
| The observation store and its provenance chain | Project knowledge requires source value/unit and canonical value/unit stored separately, historical ranges attached per observation, and provenance to the source document. A vendor's normalised output is an *input* to that, never the record itself. |
| Patient verification | Rule 7: a result becomes trusted only after the patient confirms it. That gate cannot live in a third party. |
| Source documents | Rule 4: the original laboratory document is source evidence. We must hold our own copy. |
| Provider comparison, ranking and clinical relevance | Rule 12: commercial ranking stays independent of clinical relevance. A partner who also fulfils orders has an obvious incentive to be recommended. Scoring and recommendation logic must never sit with a party that benefits from the outcome. |
| Multi-provider neutrality | The marketplace is the business. A results layer that can only ingest one vendor's output destroys it. |
| The user relationship and the data controller role | We are the controller for the PHR. Any integrator is a processor. |

---

## 3. Risks

| Risk | Assessment | Mitigation |
| --- | --- | --- |
| Vendor lock-in | High if Forth's model becomes our model. Low if Forth is one adapter behind a canonical contract. | Adapter pattern, section 4. No Forth identifier in any core table except a nullable provenance field. |
| Proprietary scoring opacity | HealthCoach weights are unlikely to be disclosed. An unexplainable score cannot satisfy our explainability rule. | Do not surface Forth scores as ours. If displayed at all, attribute them and store them as a third-party opinion, not as a derived platform value. |
| Cannot import non-Forth results | Fatal to the marketplace if it happens. | Our upload/extraction pipeline (Phase 2) must be built regardless, and must be the default path. Forth is an optimisation for Forth-fulfilled orders only. |
| Commercial incentive distorting clinical relevance | Direct conflict with rule 12. | Recommendation and retest engines never read fulfilment-partner identity as an input. Assert this in code and in a test. |
| Controller/processor roles | Unclear from marketing material. | Settle in the data-processing agreement before any personal data flows. Our position: we are controller, Forth is processor for fulfilment and results transmission. |
| UK GDPR Article 9 | Special category data throughout. | DPIA covering the integration specifically, lawful basis recorded, explicit consent for the Forth route captured in `clinical_consent_records`. |
| Portability and exit | Unknown. | Contractual right to bulk export of all results and source documents, in a machine-readable form, at any time and on termination, at no cost. Non-negotiable. |
| API availability, rate limits, SLA | UNKNOWN. | Establish before design. Assume nothing. |
| Do we keep source documents and history? | UNKNOWN. | Contractual requirement that we receive and may retain the original laboratory document for every result. If we cannot, the integration fails rule 4 and does not proceed. |
| Are HealthCoach outputs exportable and auditable? | UNKNOWN. | Require export with the component breakdown and algorithm version. Without that, treat scores as unusable for our purposes. |

---

## 4. Recommendation

**Direction: Forth is an optional fulfilment-and-ingestion adapter, not the architecture.**
It sits upstream of our canonical model and behind an interface. Removing it must cost us
nothing but a source of results.

```text
Marketplace / comparison
        |
        v
Provider or laboratory order            <- Forth is ONE fulfilment adapter among several
        |
        v
Inbound results adapter (Forth | provider API | FHIR | PDF upload | manual)
        |
        v
Canonical inbound contract  (section 4.1)
        |
        v
Deterministic validation -> provenance -> patient verification
        |
        v
biomarker_hub  ->  observations  ->  longitudinal engine
        |
        v
Retest engine · our own scores and targets · clinician sharing
        |
        v
back into provider comparison
```

### 4.1 The canonical inbound contract

Every ingestion route, Forth included, must produce this before anything is persisted as
trusted. Nothing vendor-specific appears below the adapter boundary.

```text
InboundReport
  externalReportId            string        (vendor's id, provenance only)
  sourceSystem                enum          forth | provider_api | fhir | upload | manual
  orderReference              string | null (links back to our order/referral record)
  subject                     our health profile id
  laboratory                  name + accreditation reference
  collectedAt, reportedAt     timestamps
  specimen                    type, collection method
  sourceDocument              original PDF/report bytes or a retrievable reference  [REQUIRED]
  observations                InboundObservation[]

InboundObservation
  sourceName                  verbatim vendor/lab biomarker label      [REQUIRED, never discarded]
  sourceCode                  LOINC or vendor code, if supplied
  sourceValue, sourceUnit     exactly as reported                      [REQUIRED]
  valueType                   quantitative | qualitative | ratio | titre
  sourceReferenceRange        low, high, text, and the population it applies to
  sourceFlag                  vendor's own H/L/abnormal marker, if any
  method                      assay/method, if supplied
  page / textAnchor           where in the source document it came from
  extractionMethod            structured_feed | ocr | manual
  extractionConfidence        0–1
```

Mapping `sourceName`/`sourceCode` to a canonical `biomarker_hub` entry, deriving
`canonicalValue`/`canonicalUnit`, validation, and patient verification all happen **after**
this boundary, in our code, identically for every source. A structured Forth feed simply
arrives with `extractionMethod = structured_feed` and confidence 1, skipping OCR — it does
not skip validation, provenance or verification.

### 4.2 Interfaces we would require from Forth

1. Order placement and status, keyed by our own order reference.
2. Result retrieval, structured, per order, with the fields above.
3. Retrieval of the original laboratory document for every result.
4. Result-release state as an observable event.
5. Webhook or poll for result-ready.
6. Sandbox with synthetic data.
7. Bulk historical export on demand and on exit.
8. Written statement of controller/processor roles, sub-processors, retention and deletion.

Items 3 and 7 are hard requirements. Without them the integration breaches our own
provenance and portability rules and should not proceed at any price.

### 4.3 Keeping Forth optional

- One adapter module, one configuration flag, per-provider. No Forth reference anywhere in
  the canonical schema except a nullable `source_system` / `external_report_id` provenance
  pair.
- The PDF-upload route is built first and remains the reference implementation, so the
  platform is complete without Forth.
- A regression test asserts that recommendation, ranking and retest outputs are identical
  regardless of `source_system`.
- We hold every source document ourselves from day one.

### 4.4 Next step if pursued

Request technical documentation and a sandbox under NDA, and answer only the UNKNOWNs in
section 3. No design work against a guessed API. This is a discovery item in the tracker and
nothing more.
