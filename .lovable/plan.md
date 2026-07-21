# Scraper Completeness + Historical Record Plan

## Objectives

1. Every active test row across the 9 providers carries a complete, provider-verified field set (or explicit `"not stated"` — never inferred).
2. Every scrape run appends an immutable dated snapshot so we build a longitudinal UK private diagnostics dataset (price / biomarkers / turnaround / accreditation over time).

Executes AFTER the in-flight scraper pass merges. No simultaneous edits.

---

## Part A — DB schema changes (single migration, runs first)

### A1. Extend `provider_tests` (nullable, additive only)

New columns:

- `sku` text, `handle` text
- `was_price` numeric, `collection_fee` numeric, `gp_review_fee` numeric, `home_visit_fee` numeric, `total_expected_cost` numeric (generated: `price + coalesce(collection_fee,0) + coalesce(gp_review_fee,0)`)
- `sample_type` text, `collection_method` text, `home_kit_available` boolean, `clinic_visit_available` boolean, `location_options` jsonb
- `turnaround_raw` text, `turnaround_hours` integer, `turnaround_days` integer, `turnaround_unit` text check (`hours|days|not_stated`)
- `description` text, `who_should_test` text, `gender_specific` text check (`male|female|any|not_stated`)
- `lab_ukas_accredited` boolean, `lab_cqc_regulated` boolean, `lab_iso15189` boolean
- `trustpilot_rating` numeric, `trustpilot_review_count` integer, `trustpilot_last_checked` timestamptz
- `in_stock` boolean default true
- `last_validated_at` timestamptz, `scrape_source_url` text
- `field_completeness_score` numeric (generated or maintained by reconciliation agent — % of required fields non-null)
- `data_status` text check (`complete|partial|not_stated|stale`) default `partial`

Existing `biomarkers_list jsonb` + `biomarker_count int` kept as-is.

Explicit `"not stated"` convention: text columns literal `'not stated'`; numeric/boolean columns NULL with a matching `<field>_not_stated boolean` flag ONLY where the distinction between "missing scrape" vs "provider says nothing" matters (price, biomarkers, turnaround). Do NOT proliferate flag columns elsewhere.

### A2. New table `provider_test_history` (append-only snapshot)

```text
id uuid pk
provider_test_id uuid fk provider_tests(id)
provider_id text
test_name text
snapshot_at timestamptz default now()
scrape_run_id uuid
price numeric
was_price numeric
collection_fee numeric
gp_review_fee numeric
home_visit_fee numeric
total_expected_cost numeric
biomarker_count int
biomarkers_list jsonb
turnaround_raw text
turnaround_hours int
turnaround_days int
sample_type text
in_stock boolean
trustpilot_rating numeric
trustpilot_review_count int
scrape_source_url text
raw_payload jsonb                -- full normalised extract for forensic replay
```

Indexes: `(provider_test_id, snapshot_at desc)`, `(provider_id, snapshot_at desc)`, `(snapshot_at)`. GRANTs: `service_role ALL`, `authenticated SELECT` (admin dashboards). RLS: admin-only read via `has_role`.

Existing `price_history` retained — keep writing to it for backward compat; `provider_test_history` is the superset.

### A3. Extend `scrape_change_events`

Add columns: `field_name text`, `old_value jsonb`, `new_value jsonb`, `scrape_run_id uuid`. Emit one row per changed field per test per run.

### A4. New table `scrape_runs`

```text
id uuid pk, provider_id text, started_at, finished_at,
tests_seen int, tests_new int, tests_updated int, tests_deactivated int,
fields_populated int, fields_not_stated int, errors jsonb
```

Powers admin observability and drives the reconciliation agent's acceptance report.

---

## Part B — Shared scraper library (`supabase/functions/_shared/scrape/`)

One-time build, imported by every provider scraper:

- `parseTurnaround(text)` → `{ raw, hours, days, unit }`. Handles "next working day", "24–48 hours", "2–5 days", "results in 3 hours", "same day", "up to 10 working days". Returns `unit='not_stated'` when unparseable. **Fixes the 100% NULL turnaround gap — highest priority.**
- `parsePrice(text)` → `{ price, was_price, currency }` — strips £, commas, "from", "was".
- `normaliseBiomarkers(list)` → dedupes, trims, preserves provider spelling, GB English.
- `writeHistorySnapshot(row, runId)` → inserts `provider_test_history` + diffs against latest `provider_tests` row, emitting `scrape_change_events`.
- `upsertWithProvenance(row, runId)` → per-row upsert on `(provider_id, provider_test_id)`, sets `last_validated_at`, `scrape_source_url`, recomputes `data_status`.
- `fetchTrustpilot(providerDomain)` → shared, cached ≤24h, hits Trustpilot business page.
- Robots.txt check + per-provider rate limiter (token bucket, config per provider).

Rule enforced in `upsertWithProvenance`: reject writes where price>0 became price=0 without explicit "out of stock" evidence — flags as anomaly, keeps prior price, sets `in_stock=false` only if page markup confirms.

---

## Part C — Parallel sub-agent execution plan

Six sub-agents, launched in parallel after Parts A+B ship. Each writes ONLY its assigned scraper files + calls shared lib. All log to `scrape_runs`.

### Sub-agent 1 — Medichecks (192 tests)
Files: `supabase/functions/medichecks-firecrawl/index.ts` (primary), `medichecks-scraper/`, `scrape-medichecks/`.
Focus: full biomarker extraction from product pages (Firecrawl markdown → biomarker list parser), turnaround block, sample method, GP review fee (separately priced add-on), discover new SKUs from `/blood-tests` sitemap.

### Sub-agent 2 — Medical Diagnosis (143 tests)
Files: `supabase/functions/medical-diagnosis-scraper/index.ts`.
Focus: **separate base price from "Premium Report" upsell** — capture base as `price`, upsell delta as metadata, never blend. Biomarker list from product accordion. Turnaround usually in days.

### Sub-agent 3 — Lola Health (108 tests)
Files: `supabase/functions/lola-health-scraper/index.ts`.
Focus: **Shopify handle drift** — do NOT trust `products.json` handle→title mapping alone; fetch rendered product page and match on `<title>` / JSON-LD `Product.name`. Fill the 5 null biomarker_count rows. Preserves the per-row upsert loop from the recent fix.

### Sub-agent 4 — Mid/small cluster (6 providers)
Files: `london-medical-laboratory` (scrape-london-lab), `london-health-company`, `goodbody-scraper`, `clinilabs-scraper`, `randox-scraper`, `thriva-scraper`.
Focus:
- **london-health-company**: fix the 12 £0 active tests — scrape real price; if page shows no price, deactivate (set `is_active=false`, log reason). Fill 4 null biomarker_count.
- **Randox / Goodbody / LML**: clinic venous — capture turnaround in HOURS (`turnaround_unit='hours'`), `clinic_visit_available=true`, `home_kit_available=false`. Location list into `location_options`.
- **Thriva / Clinilabs**: home kits — `home_kit_available=true`, days-based turnaround.

### Sub-agent 5 — Cross-cutting (turnaround + Trustpilot + history)
Files: `supabase/functions/_shared/scrape/*`, `refresh-live-comparison-panels`, new `refresh-trustpilot-ratings` function.
Focus: ship the shared lib (Part B) FIRST so agents 1–4 can import it, then a one-shot backfill edge function that re-parses `turnaround_raw` for the 597 existing rows once scrapers repopulate it. Owns `provider_test_history` writes + `scrape_change_events` diffing. Refreshes `PROVIDER_RATINGS` in `src/constants/providerRatings.ts` from scraped Trustpilot data (weekly cron).

### Sub-agent 6 — Reconciliation & acceptance
Runs LAST, after all scrapers complete one full cycle.
Files: new `supabase/functions/audit-scrape-completeness/index.ts` + admin page `AdminScrapeCompletenessPage.tsx`.
Duties:
- Compute `field_completeness_score` and `data_status` per row.
- Produce per-provider report: `% complete`, `% partial`, `% not_stated`, count of £0 active, count of null turnaround, count of null biomarkers.
- Fail loudly (alert row in `scraper_alerts`) if acceptance criteria not met.
- Backfill any `provider_test_history` rows missed during transition so the historical series starts cleanly.

---

## Part D — Cron / orchestration changes

- `run-all-scrapers` unchanged in surface, but now every scraper writes a `scrape_runs` row and appends `provider_test_history` snapshots on every invocation — history grows monotonically regardless of whether values changed.
- Add weekly cron: `refresh-trustpilot-ratings` (Sundays 03:00 UTC).
- Add daily cron: `audit-scrape-completeness` at 04:00 UTC, posts summary to `scraper_alerts`.

---

## Part E — Acceptance criteria (Sub-agent 6 must pass all)

1. Every active `provider_tests` row has non-null: `price`, `biomarker_count`, `biomarkers_list` (array, len ≥ 1) OR `data_status='not_stated'` with explicit not-stated flag.
2. Every active row has `turnaround_raw` populated AND either (`turnaround_hours` OR `turnaround_days`) non-null OR `turnaround_unit='not_stated'`. **Zero silent NULLs.**
3. Zero active rows with `price = 0` (either real price scraped or `is_active=false`).
4. Every active row has `last_validated_at` within the last 7 days and `scrape_source_url` set.
5. `provider_test_history` has ≥1 row per active test per completed scrape run (verified by count join on `scrape_runs`).
6. `scrape_change_events` populated for any field-level diff in the last run.
7. `provider_id='lola-health'`: all rows resolve to the correct rendered product title (spot-check 20 random rows).
8. `provider_id='medical-diagnosis'`: base price never inflated by Premium Report cost (spot-check 10).
9. Trustpilot rating + review count present for all 9 providers, `trustpilot_last_checked` within 7 days.
10. No fabricated values — reconciliation agent samples 30 random rows across providers and verifies each field against the live provider page.

---

## Execution order

1. Migration (Part A) — single approval.
2. Shared lib (Part B) via Sub-agent 5 — merges before scraper agents start.
3. Sub-agents 1–4 in parallel.
4. Full `run-all-scrapers` cycle.
5. Sub-agent 6 reconciliation + report.
6. If any acceptance criterion fails, targeted re-run of the offending provider scraper only.

Total estimated wall time from approval: ~6–8 hours engineering + 1–2 scrape cycles.
