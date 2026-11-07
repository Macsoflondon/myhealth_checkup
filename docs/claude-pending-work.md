# Claude hand-off: pending work

Prepared 07/11/2026. Start with EDGE activation. This document is a repository hand-off, not confirmation that a Claude session was started. Do not publish or apply unrelated database changes.

## 1. EDGE: ninth provider

- Display name **EDGE**, stable provider ID `sports-blood-tests`. The owner confirmed its CQC-regulated partner clinics on 07/11/2026. Prior onboarding notes record the Forth relationship/shared UKAS ISO 15189 lab; record the actual lab identity and supporting accreditation evidence. Do not label EDGE itself CQC regulated.
- Inspect live columns, constraints, indexes, triggers, dependent views, grants, policies and migration history before applying anything. Do not assume these files are unapplied simply because an earlier read found no EDGE rows.
- Review and apply only outstanding versions, in order:
  1. `supabase/migrations/20261106234500_onboard_sports_blood_tests.sql`
  2. `supabase/migrations/20261107001500_edge_exact_prices_and_name.sql`
  3. `supabase/migrations/20261107001600_edge_provider_articles.sql`
- The exact-price view patch currently assumes `CASE provider_id`; confirm the live definition first. If it already contains the slug with an old label, reconcile to EDGE without changing other branches. Preserve view security-invoker semantics and existing TEC rules.
- Review source-section mappings (runners, cyclists, triathletes, weightlifters, CrossFitters → `sports-performance`; hormones → `hormones`). Confirm filters/subcategories find the corresponding tests. Add only catalogue-backed mappings, no invented panels.
- Review article category assignments before application: the draft places creatine kinase, eGFR and hs-CRP under Mental Health, RBC under Gut Health and ferritin under Thyroid. Use existing category taxonomy and factual topic classification; preserve provider text/publication dates.
- Retain provider-verbatim descriptions and full biomarker lists. Twelve fixed products are expected, including Advanced Testosterone. Source prices and fees are in `docs/edge-activation.md`; refresh from the actual product page, never the provider-wide bespoke offer.
- Check the onboarding draft's collection-route flags against source evidence, especially RED-S and Advanced Testosterone. Do not assume clinic/home-nurse availability or charges from another product.
- Preview code already supplies EDGE's official website logo, name/alias and ninth shared roster entry. Both homepage showcases now accept all selected providers instead of truncating the upper set at eight. Verify directory, partner strip, provider profile, test routes, category filters, comparisons and both homepage showcases after activation.
- Review any remaining provider registries in AI/admin/status/sitemap code. EDGE uses the GitHub refresh path, not a made-up Supabase cron job. `scripts/sql-tests/price-sync.test.sql` and `system-health.test.sql` still cover eight mhc-managed providers: only change those expectations when their actual server status inventory includes EDGE.

## 2. Prices, articles and scheduled refresh

- Enable `.github/workflows/edge-price-sync.yml` with repository `SUPABASE_SERVICE_ROLE_KEY` stored as a secret. Schedule: 00:32, 06:32, 12:32, 18:32 UTC, subject to GitHub delays. Manually dispatch once.
- Confirm `scripts/edge-price-sync.ts` and the shared upsert produce a successful `scrape_runs` row, exact per-product prices, provenance and real kit images. Discovery/parsing failures must retain existing data; removed products deactivate only after confirmed 404/410.
- EDGE's 24 source-linked biomarker articles join the existing daily aggregator. Verify the deployed aggregator includes the new `edge-index` source and parser, not only the repository version. Dates are source publication dates (22/05/2025), not clinical review dates. Reject the generic EDGE icon as an article photograph.
- Capture existing-provider displayed prices before/after; they must be unchanged. Check all twelve EDGE source prices, at least five view rows, data quality, article readback and kit images. Regenerate types if public schema changed, run advisors, RLS/grant checks and migration parity (`SUPABASE_DB_URL` repository secret required).
- Run relevant unit/SEO/browser regressions at 375px, 768px and 1280px. Save evidence; mark activation complete only after real public catalogue/card readback and a scheduled refresh succeed.

## 3. Other open work to reconcile, not blindly repeat

The root roadmap contains historical entries. Check code and deployment evidence before acting; a stale unchecked entry is not proof the work remains missing.

| Pending item | Required next action / gate |
|---|---|
| Hero browser thresholds | Review current `tests/e2e` expectations and rerun with available Chromium; earlier missing-library notes may be stale. |
| Human Context Engine secret-name repair | Confirm draft acceptance/deployed function version and test a real request; never expose credentials. |
| URL verification false-positive fix | Read the latest 05:15 UTC run and SOC alerts; confirm 429 responses remain inconclusive, not broken links. |
| London Health Company 7/16 needs-review tests | Inspect current feed/matcher; establish whether `provider_test_id` handles resolve drift without renaming source products. No blind backfill. |
| Remaining provider page enrichment | Review what already exists, then extend source-backed parsers for uncovered providers only. Preserve verbatim text. |
| Collection-route listings | Reconcile existing route-aware pricing/display against the open route-splitting entry; no TEC rule changes without current owner instruction. |
| Assisted finder / hidden-gap security entry (duplicated) | Reconcile with current approved public rate-limited behaviour; do not force sign-in solely from an old roadmap entry. |
| Phase 0 exit | Owner dashboard evidence for auth, backups/PITR, cron inventory, grants and private storage limits; migration-parity secret. Do not declare Phase 0 closed without evidence. |
| Health Intelligence F.A / F.I / F.B / F.G | Hold release transitions, ingestion adapters, longitudinal charts and notification work until Phase 0 exit and explicit scope approval. No new Phase 1 production schema. |

## Acceptance report

Report each item as verified, already complete, blocked or still pending, with migration/version IDs, job/run evidence and rendered screenshots where applicable. Keep all unrelated security controls intact. No publishing is authorised by this hand-off.