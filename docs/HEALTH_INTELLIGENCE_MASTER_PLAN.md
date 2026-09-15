# Health Intelligence Master Plan

**Status:** Superseded by the unified programme blueprint dated 15 September 2026.

The authoritative architecture and roadmap is now:

- `docs/HEALTH_INTELLIGENCE_UNIFIED_BLUEPRINT.md`
- `docs/UNIFIED_BUILD_TRACKER.md`
- `docs/unified-build-tracker.json`

These documents unify the original Health Intelligence architecture with the previously approved Forth Connect competitive additions and the Health Data Avatar additions.

## Governing product loop

**Discover → Compare → Test → Receive → Verify → Store → Track → Understand → Retest → Compare again.**

## Governing safety model

**Source evidence → AI extraction → deterministic validation → patient verification → trusted record → longitudinal intelligence.**

AI never creates a trusted clinical observation. Commercial commission never determines clinical relevance, ranking or retesting logic.

## Existing architecture retained

- Supabase/PostgreSQL system of record.
- Existing marketplace, provider catalogue, referral and SEO functionality preserved.
- Canonical biomarker and observation model.
- Provenance and verification.
- Longitudinal biomarker engine.
- Retest Intelligence Engine.
- Clinician reports and secure sharing.
- FHIR/LOINC interoperability.
- Health Intelligence AI.

## New additions now incorporated

- Patient-owned Health Memory.
- Unified Health Timeline.
- Patient context and free-form journal.
- Medication timeline.
- Data-gap detection.
- Conflict detection.
- Editable health tree.
- Source-grounded smart search.
- Appointment preparation.
- Multilingual derived summaries.
- PII detection and selective redaction.
- Controlled result release.
- Clinician commentary.
- Explainable targets and future health scores.
- Wearable and questionnaire adapter boundaries.
- External AI agent/MCP-style architecture.
- Stronger data portability and exit model.

## Current execution position

Phase 0 remains blocked only by the known Supabase dashboard verification items and the missing `SUPABASE_DB_URL` repository secret for remote migration parity. Phase 1 schema groundwork exists, but Phase 1 is not complete because ingestion, verification, Health Memory context and user-facing functionality still require implementation and the five-part completion gate.

No previous architecture has been discarded. The unified blueprint adds the new capabilities on top of the existing structure and explicitly records what is adopted, deferred, governed or prohibited.
