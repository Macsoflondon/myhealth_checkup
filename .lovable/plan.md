## Two issues, two fixes

**1. LML "not CQC certified" is not a scraping bug** — accreditations are hard-coded in `src/constants/providers.ts`, scrapers never touch that field. LML currently has `['UKAS', 'ISO 15189']` there. It needs `CQC` added. I'll also cross-check all 9 providers against your uploaded evidence pattern (CQC where applicable).

**2. Full re-scrape** — the `run-all-scrapers` edge function already fans out to all 9 provider scrapers. I'll invoke it with no filter so every provider is re-crawled fresh. For providers where the current dataset is stale (LML last scraped 2026-05-31, Medichecks 2026-05-31, Lola 2026-06-10), I'll optionally purge-first via `purge-and-rescrape` so old rows don't stick around if the source restructured.

## Plan

### Step 1 — Fix LML accreditations (code)
Edit `src/constants/providers.ts` → `PROVIDER_DETAILS['london-medical-laboratory'].accreditations` to `['CQC', 'UKAS', 'ISO 15189']`. Certificate number `CRT1-4708702735` will be stored alongside so it can be displayed on the provider profile.

### Step 2 — Audit all 9 provider accreditations
Review each entry in `PROVIDER_DETAILS` and correct any missing CQC/UKAS/ISO badges based on public evidence. Providers to review:
- goodbody-clinic, medichecks, lola-health, thriva, london-medical-laboratory, randox, london-health-company, clinilabs, medical-diagnosis

### Step 3 — Trigger full re-scrape
Invoke `run-all-scrapers` (all 9 providers). Firecrawl-backed scrapers will pull fresh test names, prices, biomarkers, categories, turnaround, sample method, URLs. Runs in background; results land in `provider_tests`.

### Step 4 — Verify
After scrape completes, query `provider_tests` for row counts + `MAX(scraped_at)` per provider and report deltas. Flag any providers whose count dropped significantly (possible parser regression).

### Step 5 — Optional deep-clean
For any provider whose count looks off after Step 4, run `purge-and-rescrape` per provider to wipe stale rows and re-populate from zero.

## Questions before I build

1. Do you want a **certificate number field** displayed on each provider profile (e.g. "CQC certificate: CRT1-4708702735"), or just the badge?
2. For Step 5, should I **auto-purge** the three stale providers (LML, Medichecks, Lola) upfront, or only purge if Step 4 shows a problem?
3. Anything you want me to explicitly *not* re-scrape (e.g. keep manual overrides you've added)?
