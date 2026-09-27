# Forth Connect — competitive architecture analysis

**Created:** 14 September 2026 · **Status:** research and ratified architecture direction.
No contact, no contract, no integration, no code written against a Forth API.

**Companion documents:** `docs/RESEARCH_FORTH_CONNECT.md` (partnership risk register),
`docs/HEALTH_INTELLIGENCE_MASTER_PLAN.md` §5 (narrative), `docs/BUILD_TRACKER.md`
(F.A–F.I backlog and status).

**Sources, read in full 14 September 2026:** the product pages for
[Results App](https://www.forthconnect.io/products/results-app/),
[ConnectPro](https://www.forthconnect.io/products/connectpro/),
[MyFORM](https://www.forthconnect.io/products/myform/) and
[HealthCoach](https://www.forthconnect.io/products/healthcoach/), plus
[Solutions](https://www.forthconnect.io/solutions/) and the
[Terms of Service](https://www.forthconnect.io/terms-of-service/).

**Evidential standing.** Everything attributed to Forth below is a published claim or a
published contractual term. No certificate, API document, schema, algorithm or weighting has
been seen. Their API surface remains UNKNOWN and nothing in our design assumes it exists. The
Terms are the strongest evidence available, because a company's contract describes what it has
actually committed to do rather than what its marketing would like to imply.

---

## 1. What Forth is actually doing, across the lifecycle

Read across all six pages, Forth is not a results app with a shop attached. It is a **vertically
integrated white-label testing operator** that sells its own stack to other brands. The lifecycle
they operate:

```text
partner brand's shop (ConnectPro, branded)
   -> order placed against a catalogue or a bespoke profile the partner built
   -> CE-marked kit despatched (ISO 13485, MHRA-registered), hourly just-in-time batches
   -> finger-prick or venous sample, biomarkers validated for stability in postal transit
   -> analysis at one of several integrated laboratories (subcontracted processors)
   -> in-house GMC-registered GPs review; critical results managed clinically
   -> result held, then RELEASED at a time the partner controls
   -> patient notified (SMS/push), views in a browser or branded app
   -> Results App: graphs, comparison to previous, peer benchmark, doctor commentary
   -> HealthCoach: category scores, focus areas, personalised 3-6 month targets, nudges
   -> MyFORM for cycle-aware female hormone modelling
   -> retest, and the loop repeats inside Forth
```

Two things follow from that shape, and they matter more than any individual feature.

**First, the moat is operational, not algorithmic.** CE-marked kits, an ISO 13485 quality system,
MHRA registration, hourly fulfilment, a validated biomarker list for postal stability under UKAS
15189, a laboratory network and an employed GP rota. That is a logistics and clinical-governance
business. HealthCoach and MyFORM sit on top of it as differentiation, but the thing that is hard
to copy is the middle of the chain, not the scoring.

**Second, the loop is closed and single-vendor by construction.** Forth's record is coherent
because Forth ordered the test, Forth's lab ran it, and Forth's GP signed it off. Every
capability they have that we admire is downstream of that control. We do not have it and are not
going to buy it, because the whole point of our platform is that the person can compare eight
providers and choose. **Our equivalent capabilities therefore have to be engineered to survive
heterogeneous input, and that is a genuinely harder problem than the one Forth solved.** Every
design decision below follows from that sentence.

### What the Terms reveal that the marketing does not

The Terms of Service are worth more than the product pages, because they show the clinical-safety
machinery:

- **A named contractual artefact, the "Healthcare Comment"**, prepared by a "Healthcare
  Practitioner engaged by us" — separate from the "Results Report". Commentary is a distinct
  deliverable with its own obligations, not a note field. We had already separated these; the
  Terms confirm it is the correct shape.
- **Abnormal-result escalation that overrides the customer's own opt-out.** Where a result is
  abnormal "by reference to generally accepted UK medical standards", Forth may share the
  customer's name and contact details with GPs or other qualified healthcare services *even if
  the customer opted out of detailed comments*, and a practitioner may contact them directly to
  recommend immediate medical attention. This is the single most important clinical-safety
  pattern on the whole site, and it has a hard consequence for us: **a safety escalation route
  cannot be a consent-toggleable feature.** It is a standing duty with its own lawful basis.
- **An emergency exclusion stated before anything else** — do not use results if you may be
  having a medical emergency, with named symptoms.
- **An explicit non-diagnostic position**: the services "involve reporting of results only", with
  no promise of a diagnosis, recommendation or referral.
- **No continuity of practitioner is guaranteed**, and Forth therefore shares prior results
  between practitioners so each reviewer sees history. Previous-result context is a
  clinical-safety requirement, not a nice chart.
- **Laboratories and phlebotomy providers are named as subcontracted processors** receiving
  personal data.

---

## 2. Product features worth adopting

| Forth feature | What is actually good about it | Our version |
| --- | --- | --- |
| Controlled release of results | Decouples "result exists" from "person can see it", which is what makes clinician review possible at all | `diagnostic_reports.status` + `release_policy`; owner sees nothing until `released` |
| Comparison to the person's previous result, shown inline | The single most useful number on a results screen is the last one | `BiomarkerSeriesSummary.previous`, `absoluteChange`, `percentageChange`, `intervalDays` |
| Interactive graphs with an explanation beside each marker | Turns a number into a decision | Charts over `observations`, joined to `biomarker_hub` editorial we already own |
| Category grouping of biomarkers (Lipids, Inflammatory Markers, Glucose Control, Sex Steroid Hormones) | A good information architecture; roughly ten categories, each with a stated biomarker count | `curated_test_profiles` for clinical groupings — deliberately not the commercial catalogue's categories |
| Focus areas — which single component most moves a category | Genuinely useful prioritisation, and explainable if the weights are yours | Deferred to Phase 9 as an explainable, versioned rule. Not scored, ranked |
| Personalised incremental targets over three to six months | Makes retesting meaningful instead of arbitrary | Feeds Phase 4 retest intelligence via `retest_rules`, with a recorded evidence source |
| Guidance conditioned on age, sex, menstrual cycle and hormone medication | The conditioning set is right, and we had not specified hormone medication before reading this | Already added to `observations`: `cycle_day`, `cycle_phase`, `menstrual_status`, `hormone_medication_context` |
| Doctor commentary attached to results | A trust multiplier that costs a rota, not an algorithm | `clinical_review_comments` — attributed, released separately |
| SMS and push notification of release | Results are time-sensitive; email alone is not enough | `notification_channel_preferences` + `notification_events`, consent-first |
| Peer benchmarking by age and sex | Context people ask for constantly | `benchmark_cohort_policies` — designed, and disabled until governance exists |
| Cycle-day-specific personalised ranges | A real clinical modelling advance over static ranges | `reference_range_contexts` + per-observation historical ranges |

## 3. Architectural patterns worth adopting

1. **Release as a state, not a flag.** A result has a lifecycle, and the transitions are the
   interesting part. We model it as `diagnostic_reports.status` plus an **append-only**
   `result_release_events` log with no `UPDATE` or `DELETE` grant, so the history of who released
   what and when cannot be rewritten. Forth's page implies the state; we make the audit trail
   structural.
2. **Release policy as configuration per source.** Forth's partners each choose how results
   reach their clients. We carry `release_policy` on both `ingestion_adapters` (the default) and
   `diagnostic_reports` (the effective one), so a home-upload behaves differently from a
   clinician-ordered panel without branching code.
3. **The bespoke profile builder as a first-class entity.** ConnectPro lets a practitioner
   assemble a panel from validated biomarkers. That is the right primitive — a curated set of
   biomarkers with a rationale — and it belongs in the clinical layer, not the shop.
4. **Modular products over one monolith.** Forth sells ConnectPro, Results App, HealthCoach and
   MyFORM separately. That is a coherence discipline as much as a pricing one: each module has a
   clean boundary. Our layers should be equally separable, which is why the longitudinal maths is
   a pure module with no database import.
5. **Conditioning context travels with the measurement.** Age, sex, cycle day and hormone
   medication change what a value means. Storing them on the observation rather than deriving
   them later is the only way a historical result stays interpretable.
6. **An explicit adapter/connectivity layer.** Forth advertises lab integration and API options
   as a distinct capability. We formalise it as `ingestion_adapters`, with `supports_source_document`
   and `supports_bulk_export` recorded per adapter so an integration's compliance with our own
   hard requirements is a data field, not a memory.

## 4. Clinical and data governance patterns worth adopting

1. **Abnormal-result escalation as a standing duty.** Modelled from their clause 11.5: a route
   that operates regardless of the person's commentary preferences, with its own lawful basis,
   its own audit trail and a recorded outcome. **Design constraint: it must never be implemented
   as a consent toggle, and it must never be triggered by an AI interpretation.** Escalation
   triggers off a deterministic rule against a validated observation and a recorded clinical
   standard, with a human in the loop.
2. **Commentary is a deliverable, not a field.** Separate entity, named author, professional
   registration recorded, own release state, corrections by supersede rather than edit. Already
   built as `clinical_review_comments` with no `UPDATE` grant.
3. **Previous-result context supplied to the reviewer.** Because practitioner continuity is not
   guaranteed, the reviewer must see history. Our advantage: our history spans providers.
4. **A stated non-diagnostic position, visible before the result.** We already carry a
   medical-review disclaimer in the root layout; the health record needs its own, at the point of
   viewing a value, plus the emergency-symptom exclusion.
5. **Named processors.** Laboratories, phlebotomy providers and any fulfilment partner are
   processors and must be listed, with the disclosure recorded against
   `clinical_consent_records`.
6. **Certification as a claim with a scope.** ISO 27001, ISO 13485, MHRA registration, UKAS
   15189 — each has a scope document. We cite our own, and we never restate a partner's
   certification as though it covered our platform.

## 5. Commercial and workflow patterns worth adopting

| Pattern | Adopt? | Note |
| --- | --- | --- |
| Practitioner console with a client list and a review queue | Domain model now, portal much later | `organisations`, `organisation_members` exist and grant **no** health-data access |
| Ordering and order-status tracking keyed to a partner reference | Yes — this is Layer 5 and it is currently missing | Must key on *our* order reference so any fulfiller is interchangeable |
| Just-in-time fulfilment and kit logistics | No. Buy, never build | It is a warehouse business |
| Branded white-label storefront | No | We are the brand; a comparison platform that white-labels itself has nothing left |
| Modular commercial packaging | Yes, as an internal boundary discipline | Not as a pricing model |
| Bespoke profile building as a *sales* tool | No — as a *clinical* tool, yes | `curated_test_profiles` deliberately has no price, provider or commission column |

## 6. Things we should deliberately NOT copy

1. **The FORM score.** A proprietary, unpublished composite. Copying it would be both an
   intellectual-property problem and a direct breach of our explainability rule. Refused.
2. **HealthCoach's weighting scheme.** The page states that "advanced AI" interprets and assigns
   component scores. An AI-assigned score that cannot be decomposed and versioned cannot be shown
   to a person as though it were a measurement. We will build category scores — deterministic,
   versioned, with published components and a visible rationale — or we will not ship them.
3. **Any AI output that reaches a trusted field.** HealthCoach demonstrates exactly the
   temptation our rules exist to prevent. `observations` has no interpretation, score, trend or
   AI column, and that is enforced by the table definition and an immutability trigger.
4. **Benchmarking switched on by default.** A "one million results" cohort is a marketing number
   until someone states the inclusion criteria, the minimum cell size and the de-identification
   method.
5. **White-labelling our own front end.**
6. **Vertical integration into kits, logistics and a lab network.** It would make us a provider,
   which destroys the editorial independence that is the product.
7. **Single-vendor result gravity.** Anything that only works for results we fulfilled ourselves.
8. **Guidance that drifts toward advice.** Their Terms carefully scope this. Ours must too.

## 7. Where our architecture should be stronger than Forth's

This is the important section. Eight places where the multi-provider constraint, correctly
handled, produces something Forth structurally cannot match.

1. **Cross-provider longitudinal continuity.** Forth can chart results Forth produced. We chart a
   Medichecks ferritin from March against a Randox ferritin from September and a photographed GP
   printout from last year, on one axis, with units reconciled and each point retaining the
   laboratory, method and the reference range that applied *at the time*. That requires a
   canonical ontology (`biomarker_hub`), a source/canonical value split, and per-observation
   historical ranges — all of which we have and a single-vendor app has no reason to build.
2. **Patient verification as the trust boundary.** Forth's result is trusted because Forth's lab
   produced it. Ours cannot inherit trust from a vendor, so we make it explicit: nothing enters
   the longitudinal record until the person confirms the value, unit, date and source against the
   original document. That is a stronger provenance story than "we ran the test", because it
   works for every source including ones we have never heard of.
3. **Provenance to a page and a text anchor.** Every observation points at its source document,
   page, and the text it came from, with the extraction method and confidence recorded. A person
   can click a number and see where it came from. Forth has no need for this; we do, and it makes
   our record auditable in a way theirs is not.
4. **Explainable, versioned intelligence.** Every score, target and retest recommendation we ever
   show will carry its rule version, its components and its evidence source. "Because the
   algorithm says so" is not available to us, and that constraint is a feature.
5. **Recommendation independent of who profits.** Forth recommends within Forth. We compare across
   eight providers, and our hard rule is that fulfilment-partner identity is never an input to
   clinical relevance, retest timing or ranking. This needs to be provable, not asserted — hence
   the source-neutrality contract test.
6. **The loop closes back into the marketplace.** Discovery → comparison → test → result →
   verification → record → retest intelligence → *back into comparison*, with the retest
   recommendation landing on a fresh, price-aware, multi-provider comparison of the specific
   biomarkers that need repeating. Forth's loop returns to Forth's catalogue. This is the whole
   thesis of the platform, and it is the one capability neither Forth nor any single provider can
   build.
7. **The person owns the record, including the exit.** Full export of observations and original
   documents, on demand, in a machine-readable form. Our own portability requirement, applied to
   ourselves and not only to partners.
8. **Contextual ranges that apply across sources.** Cycle-aware ranges implemented in
   `reference_range_contexts` apply to a hormone result from *any* provider, not only to results
   from our own assay. MyFORM's modelling only works on MyFORM samples.

---

## 8. Mapping to the eighteen layers

Canonical entities are fixed: `biomarker_hub` (biomarkers), `audit_logs` (audit),
`clinical_consent_records` (consent), `observations` (results). Nothing below creates a
duplicate of any of them.

| # | Layer | State | Canonical entities | Forth-derived addition |
| --- | --- | --- | --- | --- |
| 1 | Health discovery | Live | marketplace, `biomarker_hub` | Category-based biomarker grouping via `curated_test_profiles` |
| 2 | Test recommendation | Live (scoring + AI fallback) | `ai_prompt_versions` | Retest targets feed it later; adapter identity never an input |
| 3 | Provider comparison | Live | `unified_provider_tests` | Unchanged. Deliberately untouched by health-record work |
| 4 | Test and provider catalogue | Live | `provider_tests`, `biomarker_hub` | `curated_test_profiles` sits beside it, clinical not commercial |
| 5 | Order and referral tracking | **Missing** | — | Order reference keyed to us, fulfiller interchangeable. P1 |
| 6 | Results ingestion | Schema only | `ingestion_adapters`, `ingestion_events`, `diagnostic_reports` | Adapter architecture; per-adapter hard-requirement flags |
| 7 | Document intelligence | Not started | `source_documents` | Source document REQUIRED per report, never a public URL |
| 8 | Results validation | Schema only | `observations.validation_status` | Deterministic validation before trust; AI produces drafts only |
| 9 | Patient verification | Schema only | `observations.verification_status` | The trust boundary Forth does not need and we do |
| 10 | Health data provenance | Schema only | `observations` (document, page, text anchor, method, confidence), `audit_logs` | Immutability trigger on source fields |
| 11 | Biomarker ontology | Partially built | `biomarker_hub` (1,552 rows, 4,434 links) | Category taxonomy; contextual ranges |
| 12 | Longitudinal results engine | Contract + maths done | `observations`, `observation_reference_ranges` | Latest/previous, change, direction, interval — measurement only |
| 13 | Health timeline | Not started | `observations`, `diagnostic_reports` | Release events appear on the timeline as events |
| 14 | Retest intelligence | Not started | `retest_rules` (planned) | Personalised targets as versioned, evidence-sourced rules |
| 15 | Personal health record | Not started | all of the above | Export and deletion as first-class, not a support ticket |
| 16 | Clinician reports and sharing | Domain model only | `organisations`, `organisation_members`, `clinical_review_comments`, `data_sharing_grants` | Healthcare-comment model; escalation route; previous-result context for reviewers |
| 17 | FHIR and LOINC | Not started | — | `InboundReport` maps to DiagnosticReport/Observation/DocumentReference/Specimen |
| 18 | Health intelligence AI | Not started | `ai_prompt_versions`, `ai_operation_logs` | Category scores and focus areas — deterministic and versioned, or not at all |

---

## 9. Prioritised implementation backlog

Priorities are ordered by whether the platform is *safe and honest* without them, not by appeal.
Nothing below is started; the F.x groundwork referenced is schema, contracts and tests only.

### P0 — required before a single real result is stored

| ID | Item | Depends on | Acceptance criteria |
| --- | --- | --- | --- |
| P0-a | Release transition server functions | F.A groundwork | Every status change goes through the state machine and writes a `result_release_events` row **in the same transaction**; an invalid transition is rejected by the database, not only by the UI; a report is unreadable by its owner until `released`, proved by an RLS test executing as a non-owner and as a pre-release owner |
| P0-b | Manual-entry ingestion adapter | F.I contract, P0-a | Produces a valid `InboundReport`; `sourceValue` and `sourceUnit` preserved verbatim; writes provenance with `extraction_method = 'manual_entry'`; round-trip test proves source fields are unchanged after canonicalisation |
| P0-c | Patient verification flow | P0-b | Draft observations display value, unit, range, date, laboratory and source document; confirm / edit / reject recorded with actor and timestamp; an edit supersedes rather than overwrites; only `confirmed` rows appear in any series — asserted in `biomarker-series` tests |
| P0-d | Deterministic validation pass | P0-b | Unit recognised, value parses to the declared `value_type`, range sanity-checked, date plausible; failures surface a reason and block trust; no LLM anywhere in the path — enforced by a module-boundary test |
| P0-e | Abnormal-result escalation policy | P0-d, X.11 clinical governance | Written policy naming the clinical standard, the lawful basis and the human in the loop; deterministic trigger against validated observations only; escalation is **not** consent-toggleable and is recorded in `audit_logs`; never triggered by an AI output |
| P0-f | Health-record access audit | canonical `audit_logs` | Every read of an observation or source document by anyone other than the owner writes an audit row with actor, purpose and data classification |
| P0-g | Source-neutrality contract test | — | An automated test asserts that no canonical health module references any partner brand and that the observation contract exposes no interpretation, score or AI field. **Shipped 14 Sep 2026** |
| P0-h | Non-diagnostic and emergency notice in the record | — | Visible at the point of viewing a result, not only in the footer; names emergency symptoms; states that the platform reports and compares and does not diagnose |

### P1 — the product

| ID | Item | Depends on | Acceptance criteria |
| --- | --- | --- | --- |
| P1-a | Longitudinal charts | P0-c | Multi-provider series on one axis; reference-range overlay uses the range stored per observation, not today's; laboratory, method and provider labelled per point; explicitly captioned as measurement change, not interpretation |
| P1-b | Document upload and extraction | P0-c, Phase 2 | Original retained in the private bucket under the `<uid>/` prefix; extraction produces drafts only; confidence recorded; every draft reviewable against the page it came from |
| P1-c | Order and referral tracking (Layer 5) | — | Our order reference is primary; fulfiller is a nullable adapter reference; a result arriving from any adapter can be matched to an order; removing an adapter loses no order history |
| P1-d | Notification dispatch | F.G groundwork | Consent checked per channel per event type before send; payload carries no biomarker name or value; delivery status recorded; nothing forwarded to analytics or advertising — asserted by test |
| P1-e | Clinician review queue | P0-a, P0-e | Reviewer sees previous results for context; commentary is attributed with professional registration and released separately from the result; org-scoped policy added only with governance sign-off recorded |
| P1-f | Contextual reference ranges | F.H groundwork | Ranges resolve by biomarker, sex, age band, cycle phase and cycle day; each carries an evidence source and a version; `is_active` requires clinical sign-off; a range change never mutates a historical observation |
| P1-g | Curated profile admin | F.F groundwork | Editable under `/control`; maps to `biomarker_hub` only; no price, provider or commission field can be added — asserted by a schema test |
| P1-h | Export and deletion | P0-c | Machine-readable export of all observations plus original documents, on demand; deletion removes documents and observations and leaves an audit record |

### P2 — intelligence, once the record exists and is trusted

| ID | Item | Depends on | Acceptance criteria |
| --- | --- | --- | --- |
| P2-a | Retest intelligence | P1-a, P1-f, X.11 | Output limited to no action, routine review, monitoring opportunity or clinician pathway; every recommendation cites its rule version and evidence source; a test proves identical output regardless of `source_system` and of commission |
| P2-b | Category scores and focus areas | P2-a | Deterministic and versioned; every score decomposes into named components with weights the person can see; no AI-assigned weighting; withheld where inputs are insufficient |
| P2-c | Personalised targets | P2-b | Traceable to a versioned rule with a recorded evidence source; framed as measurement targets, never as clinical goals or outcomes |
| P2-d | Hormone curve modelling | P1-f | Our own model, published method, versioned; states its own limits (cycle length bounds, hormone medication) as Forth's does; **not** a reimplementation of FORM |
| P2-e | Health timeline | P1-a | Results, releases, verifications and retests on one chronological surface |
| P2-f | FHIR export | P1-a | Validates against the profiles before release; DiagnosticReport carries report context, Observation the atomic measurement; export is not a claim of NHS connectivity |
| P2-g | Clinician sharing | P1-e, P1-h | Short-lived signed links, explicit scope, expiry, revocation, access logging; no public document URL ever issued |

### Do not build yet — explicit

| Item | Why not | Unblocks when |
| --- | --- | --- |
| Peer benchmarking | Re-identification risk and no statistical governance. The database constraint already refuses to enable it | Statistical governance, clinical sign-off, de-identification method and cohort definitions all exist in writing |
| Production clinician portal | Broad access to special-category data before permissions and consent are designed | P1-e complete, DPIA covering practitioner access, role model tested |
| Any Forth adapter | No documentation, no sandbox, no agreed terms; building against a guessed API is wasted work | Forth supplies technical documentation and a sandbox under NDA, **and** contractually commits to per-result source documents and bulk export on demand and on exit. Without both, the integration breaches our own provenance and portability rules and does not proceed at any price |
| AI interpretation on the record surface | Cannot be allowed to read as clinical truth | P2-b exists, with explainability and a governance sign-off |
| Kit logistics, phlebotomy, laboratory operations | Makes us a provider and destroys editorial independence | Never. Partner instead |
| White-label storefront | Nothing left of the proposition | Never |
| Promoting `clinical_biomarker_history` or `biomarker_readings` to authoritative | They store `ai_interpretation` and `trend_direction` on the row, which violates two standing rules | Never. `observations` is authoritative |

---

## 10. Decision

Forth stays exactly where the earlier research placed it: **one optional fulfilment and ingestion
adapter, upstream of a canonical model we own outright, removable at the cost of one source of
results and nothing else.** Reading the full lifecycle strengthens rather than weakens that
position — their advantages are operational and single-vendor, and buying into them would cost us
the multi-provider neutrality that is the entire business.

What this review changed is our own backlog. Controlled release, abnormal-result escalation,
previous-result context for reviewers, hormone medication as conditioning context, contextual
ranges, commentary as a separate deliverable and benchmarking governance are now modelled
explicitly instead of left implicit. Two capabilities are recorded as deliberate refusals rather
than gaps: the FORM score and HealthCoach's AI-assigned weights. And eight areas are named where
the harder problem we are solving should produce a materially better platform than the easier one
Forth solved.
