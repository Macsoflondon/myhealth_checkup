# Health Intelligence — master plan

**Created:** 14 September 2026 · **Authoritative for narrative direction.**
**Status source of truth:** `docs/BUILD_TRACKER.md` and `docs/build-tracker.json`.

This file was written locally because the original blueprint document could not be retrieved from
the repository (see `docs/PHASE_0_ARCHITECTURE_AUDIT.md`, Blockers, B3). It encodes the programme
now held in project knowledge. If the original blueprint becomes reachable, reconcile against it
rather than assuming this file is complete.

---

## 1. What we are building

myhealth checkup is becoming a longitudinal personal health record and testing intelligence
platform on top of the existing UK private diagnostics comparison marketplace. The marketplace is
preserved in full; the record is added beside it.

**The loop:** discover → compare → test → receive → verify → store → track → understand → retest →
compare again.

## 2. Rules that bind every decision

1. Supabase/PostgreSQL is the system of record.
2. Marketplace, provider, catalogue, SEO and referral functionality is preserved. Migrations are
   additive and reversible.
3. The original laboratory document is source evidence.
4. AI produces drafts only. It never creates a trusted clinical observation.
5. Deterministic validation runs before trusted persistence; the person verifies before trust.
6. Every trusted observation retains provenance to its source report and document, stores source
   value/unit/range separately from canonical, and keeps the range that applied at the time.
7. A provider test is not a biomarker; the mapping is many-to-many.
8. Commercial ranking is independent of clinical relevance. Commission never influences a clinical
   recommendation.
9. No autonomous diagnosis, prescribing or definitive clinical decision.
10. FHIR and LOINC are interoperability targets, not a claim of NHS connectivity.
11. Build the data model before the advanced AI.

## 3. Canonical entities — ratified, do not duplicate

| Concern | Canonical | Never create |
| --- | --- | --- |
| Biomarker catalogue | `biomarker_hub` | a second `biomarkers` table |
| Audit | `audit_logs` | a second audit table |
| Consent | `clinical_consent_records` | a second consent table |
| Prompt versions | `ai_prompt_versions` | a replacement |
| Results | `observations` (created 14 Sep 2026) | promoting `clinical_biomarker_history` or `biomarker_readings` |
| Range definitions | `clinical_reference_ranges`, extended by `reference_range_contexts` | a parallel definitions table |
| Per-result historical range | `observation_reference_ranges` | storing the range only on the observation |

## 4. Phases

| Phase | Scope | State |
| --- | --- | --- |
| 0 | Architecture, database and RLS audit | Ten of eleven tasks complete; the exit gate is held by dashboard-only verification |
| 1 | Health record foundation | Schema in place and empty; ingestion, verification and UX outstanding |
| 2 | AI document ingestion | Not started |
| 3 | Biomarker ontology and longitudinal engine | Partially pre-built by the 29 August canonicalisation work |
| 4 | Retest intelligence | Not started |
| 5 | Personal health record UX | Not started |
| 6 | Clinician reports and secure sharing | Domain model only |
| 7 | Provider and laboratory integrations | Adapter contract only |
| 8 | FHIR and LOINC interoperability | Not started |
| 9 | Health Intelligence AI | Not started |

## 5. Competitive design section — Forth-inspired capabilities

Added 14 September 2026 after a full-lifecycle review of Forth Connect: Results App, ConnectPro,
MyFORM, HealthCoach, Solutions and their Terms of Service. Full reasoning — including the eight
areas where our architecture should be stronger than theirs, and what we refuse to copy — is in
`docs/FORTH_CONNECT_COMPETITIVE_ARCHITECTURE.md`, which also carries the P0/P1/P2 backlog with
dependencies, acceptance criteria and explicit do-not-build-yet items.

The governing conclusion: Forth's advantages are **operational and single-vendor** — CE-marked
kits, ISO 13485, MHRA registration, a laboratory network and an employed GP rota — and every
capability downstream of that is coherent because Forth controls the whole chain. We do not have
that control and will not buy it. Our equivalent capabilities must survive heterogeneous input
from eight or more providers, which is a harder problem, and solving it correctly is what makes
the platform defensible.

**A. Results delivery and release control.** Draft → clinician or reviewer release → notification →
the person sees it. Release is an event recorded in `result_release_events`, never a field
overwritten. Release policy is configurable per result source, on the adapter and on the report.
Provenance is never rewritten by a release.

**B. Longitudinal results experience.** Our own charts on our own observation model: latest and
previous, absolute and percentage change, date-range filters, reference-range overlays, laboratory
and method context, and plain-English explanation from `biomarker_hub`. Trend arithmetic is derived
at read time and is presented as measurement change, never as a conclusion.

**C. Benchmarking.** Designed for age band and sex at birth first, other approved cohorts later.
**Off by default and structurally unable to be switched on** without both statistical and clinical
governance sign-off and safe minimum cohort sizes — enforced by a check constraint on
`benchmark_cohort_policies`, not by application code. No identifiable or small-cell output, ever.

**D. Clinician commentary.** Auditable, attributed, timestamped, tied to a report or a single
result, with its own release state. Stored in `clinical_review_comments`, separate from the
observation, corrected by superseding rather than editing, and never treated as clinical truth.

**E. Practitioner and clinic console.** `organisations` and `organisation_members` establish the
domain and the role model. They grant no access to personal health data. No production clinician
portal until permissions, consent flow and clinical governance are complete.

**F. Curated test profiles.** An internal configuration layer of biomarker bundles mapped to
`biomarker_hub`. Deliberately holds no price, provider or commission field: clinical rule entities
and commercial catalogue entities stay separate, and affiliate value never orders a clinical list.

**G. Notifications.** Channel and event abstraction with consent recorded per channel per event
type, defaulting to off, plus a delivery audit. Notifications say a result is ready; they never
carry a value or a biomarker name, and health data is never sent to analytics or advertising.

**H. Female health and cycle-aware modelling.** Observations carry cycle day, cycle phase,
menstrual status and hormone medication context. `reference_range_contexts` holds versioned,
evidence-sourced, governance-gated ranges for those contexts. Hormone curve modelling will be our
own, explainable and versioned. **We do not implement Forth's FORM score or any proprietary
composite we cannot explain.**

**I. Connectivity and adapters.** One canonical inbound contract (`InboundReport` /
`InboundObservation`, `src/types/health-intelligence.ts`) for every route: laboratory API, partner
platform, FHIR, document upload and manual entry. `ingestion_adapters` records each route's status
and whether it satisfies the two hard requirements — original document retained, bulk export on
demand and on exit. `ingestion_events` logs inbound webhooks with signature verification and no
payload body. No design work proceeds against an undocumented partner API.

## 6. What is explicitly not being built

- Any reproduction of a third-party proprietary score.
- Any claim of NHS connectivity.
- Any clinician access to personal health data before governance is complete.
- Any live benchmarking before statistical governance exists.
- Any ranking or retest logic that reads fulfilment-partner identity.

## 7. Where we go further than Forth

1. **Cross-provider longitudinal continuity** — one chart across providers, units reconciled, each
   point retaining its laboratory, method and the range that applied at the time.
2. **Patient verification as the trust boundary** — trust cannot be inherited from a vendor, so it
   is granted explicitly by the person, which works for any source.
3. **Provenance to a page and a text anchor** — every value is clickable back to the document it
   came from, with extraction method and confidence.
4. **Explainable, versioned intelligence** — every score, target and retest recommendation cites
   its rule version, components and evidence source.
5. **Recommendation independent of who profits** — fulfilment-partner identity is never an input
   to clinical relevance, retest timing or ranking, and this is enforced by a contract test.
6. **The loop closes back into the marketplace** — a retest recommendation lands on a fresh,
   price-aware, multi-provider comparison of exactly the biomarkers that need repeating. No single
   provider can build this.
7. **The person owns the record, including the exit** — full machine-readable export of
   observations and original documents, on demand.
8. **Contextual ranges that apply across sources** — cycle-aware ranges apply to a hormone result
   from any provider, not only to our own assay.

## 8. Clinical-safety patterns adopted from Forth's Terms of Service

Their contract is more informative than their marketing, and three patterns are now binding on us:

- **Abnormal-result escalation is a standing duty, not a preference.** Forth's terms allow them to
  contact a customer or their GP where a result is abnormal by generally accepted UK medical
  standards, *even where the customer opted out of commentary*. Ours must work the same way: a
  deterministic trigger against a validated observation, a recorded clinical standard, a human in
  the loop, its own lawful basis and its own audit trail. **It must never be a consent toggle and
  must never be triggered by an AI output.** Backlog P0-e.
- **Previous-result context is a safety requirement.** Because reviewer continuity is not
  guaranteed, any reviewer must see the person's history. Our history spans providers, which makes
  this stronger for us than for them. Backlog P1-e.
- **A non-diagnostic position and an emergency exclusion, stated before the result.** Named
  emergency symptoms, and a plain statement that the platform reports and compares rather than
  diagnoses, shown at the point of viewing a value. Backlog P0-h.
