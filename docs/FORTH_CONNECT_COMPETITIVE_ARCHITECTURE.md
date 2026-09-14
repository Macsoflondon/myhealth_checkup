# Forth Connect — competitive architecture analysis

**Created:** 14 September 2026 · **Status:** research and architecture direction. No contact, no
contract, no integration, nothing built against a Forth API.

**Companion:** `docs/RESEARCH_FORTH_CONNECT.md` (partnership risk register and the canonical
inbound contract). This document is the *competitive* reading: which capabilities we cherry-pick,
which we deliberately refuse, and what each one became in our own schema.

**Sources, re-read 14 September 2026:**
<https://www.forthconnect.io/products/results-app/> ·
<https://www.forthconnect.io/products/connectpro/> ·
<https://www.forthconnect.io/products/myform/>

**Evidential standing:** everything below attributed to Forth is a *vendor marketing claim*. No
certificate, API document, schema or algorithm has been seen. Their API surface remains UNKNOWN
and nothing in our design assumes it exists.

---

## 1. What the official pages actually claim

### Results App

Controlled release ("digital access to test results **at a time you control**"), interactive
graphs and comparison charts, educational explanations, tracking over time, benchmarking against
"peers of the same sex and age group" from a stated set of over one million results, optional
in-app commentary from their own medical doctors, account and profile self-management, responsive
web plus optionally a branded native app, and SMS/push notifications. Security claims: UK storage
and processing, UK GDPR, ISO 27001 with external audit.

### ConnectPro

A browser-based practitioner platform: ordering, a bespoke profile builder over "more than 40
biomarkers validated for accuracy and stability under UKAS 15189 standards", client management,
viewing results and controlling their release to client dashboards, client access, and a branded
e-commerce shop.

### MyFORM

Two capillary samples on cycle days 14 and 21 produce eight results, from which best-fit curves
are modelled for LH, FSH, oestradiol and progesterone. Ranges are personalised to cycle length and
day of collection. A proprietary "FORM" (Forth Ovarian Responsiveness Metric) score is produced,
and the LH surge is located to identify a fertility window within one cycle. Explicit exclusions:
not for women using hormone treatment, without a cycle, or with cycles shorter than 22 or longer
than 40 days. The page also advertises "connectivity and API options" with no detail.

---

## 2. Reading, capability by capability

| Forth capability | Our judgement | What we built |
| --- | --- | --- |
| Controlled result release | **Adopt the concept, own the implementation.** It is the clinical-governance backbone of the whole record, not a feature | `diagnostic_reports.status` + `result_release_events`, plus a pure state machine in `src/lib/health/release-state-machine.ts` |
| Interactive graphs, comparison charts, latest/previous | **Adopt.** Table stakes, and trivial to better once the data model is right | `src/lib/health/biomarker-series.ts`, `HealthRecordService` |
| Educational explanations beside each result | **Adopt.** We already hold richer editorial content than a results app usually does | `biomarker_hub` (`what_it_measures`, `why_it_matters`, `when_to_retest`) joined at read time |
| Peer benchmarking by age and sex | **Adopt the shape, refuse the default.** A cohort claim over one million results is only as good as its statistical governance, and small cells re-identify people | `benchmark_cohort_policies`, off by default, with a database constraint that refuses to enable without both governance sign-offs and safe cohort sizes |
| Doctor commentary on results | **Adopt, strictly separated.** Commentary is an opinion attached to a result, never part of it | `clinical_review_comments` — append-only, released separately, never merged into an observation |
| Practitioner console, client management | **Adopt the domain model now, the portal much later** | `organisations`, `organisation_members` — deliberately granting no access to any health data yet |
| Bespoke profile builder | **Adopt, and keep it clinical.** Their builder sells; ours must not | `curated_test_profiles` — no price, no provider, no commission column, mapped to `biomarker_hub` |
| SMS and push notifications | **Adopt with consent-first defaults** | `notification_channel_preferences` (off by default) and `notification_events`, which carry no clinical content |
| Cycle-aware personalised hormone ranges | **Adopt the clinical modelling.** This is a genuine gap in our specification | `observations.cycle_day`/`cycle_phase`/`menstrual_status`/`hormone_medication_context` and `reference_range_contexts` |
| The FORM score | **Refuse.** A proprietary, unexplainable composite score cannot satisfy our explainability rule, and reproducing it would be both wrong and legally reckless | Nothing. When we build a composite metric it will be our own, versioned, with published components |
| HealthCoach category scores | **Refuse as-is.** Same reasoning. Learn the taxonomy, own the weights | Deferred to Phase 9, behind versioned rules |
| Branded native app | **Not a differentiator for us.** Responsive web first | Not planned |
| Their laboratory integrations | **This is the one thing genuinely worth buying** | `ingestion_adapters` — Forth would be one row, with no privileged column anywhere |

---

## 3. Where we are deliberately different

1. **We are not a practitioner platform with a client viewer bolted on.** Forth's user is a clinic;
   ours is the person. Release control therefore exists to protect clinical safety, not to gate a
   clinic's customer.
2. **Multi-provider neutrality is the business.** Forth's record is good because Forth fulfils the
   test. Ours has to hold a Medichecks result, a Randox result and a photographed NHS printout on
   the same chart. That is why `biomarker_hub` stays canonical and why the document-upload route,
   not any partner feed, is the reference ingestion implementation.
3. **The person verifies before anything is trusted.** No result becomes part of the longitudinal
   record because a machine or a partner said so.
4. **Nothing derived is stored as fact.** Trend direction, percentage change and any future score
   are computed at read time from `observations`, which is why that table has no interpretation
   column and never will.
5. **Commercial ranking cannot reach clinical logic.** A fulfilment partner has an obvious interest
   in being recommended. Adapter identity is not an input to recommendation, ranking or retesting,
   and that has to stay provable in a test.

---

## 4. Prioritised backlog

Ordered by dependency, not by appeal. Items marked *done* shipped on 14 September 2026 as empty,
additive schema plus contracts and tests — schema is not a feature.

| # | Capability | State | Next real step |
| --- | --- | --- | --- |
| 1 | Release model and status machine | Schema + state machine done | Server functions to perform transitions, writing a `result_release_events` row in the same transaction |
| 2 | Longitudinal query and chart service | Contract + pure maths done | Chart UI on the health dashboard once observations can exist |
| 3 | Clinician commentary | Schema done | Review queue, and an org-scoped policy that is written only with governance sign-off |
| 4 | Notification preferences and events | Schema done | Dispatch abstraction, preference screen, suppression rules |
| 5 | Organisation and practitioner domain | Schema done | Role model tests; no portal, no health-data grant |
| 6 | Curated test profiles | Schema done | Admin editor under `/control`; mapping to provider catalogue for comparison, read-only |
| 7 | Cycle context and contextual ranges | Schema done | Capture UI at result entry; range definitions with recorded evidence sources |
| 8 | Inbound adapters and webhook events | Schema + `InboundReport` contract done | Manual-entry adapter first, then document upload. No partner adapter before documentation exists |
| 9 | Benchmarking | Governance guardrails done, disabled | Nothing until statistical and clinical sign-off exist; the constraint enforces this |
| 10 | Documentation and contract tests | Done for 1, 2 and 8 | Extend as each contract above gains behaviour |

---

## 5. Decision

Forth stays exactly where the earlier research put it: **one optional fulfilment and ingestion
adapter, upstream of a canonical model we own outright.** The competitive review changes nothing
about that. What it changed is our own backlog — controlled release, cycle-aware ranges, clinician
commentary and benchmarking governance are now modelled in our schema rather than left implicit,
and the two capabilities that would have compromised us if copied (the FORM score and HealthCoach
weights) are recorded as explicit refusals rather than gaps.
