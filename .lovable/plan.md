# Platform-Wide Audit & Provider Data Refresh

A two-part programme: (1) refresh test data for all 9 providers using Firecrawl, then (2) systematic grammar/copy review across all user-facing pages.

Before I start, a few clarifications below — please confirm so Phase 1 runs cleanly.

---

## Clarifications needed

1. **Scraper status mismatch.** Your brief lists scrapers like `goodbody-firecrawl`, `thriva-firecrawl`, `lola-health-firecrawl`, `scrape-firecrawl`, `london-health-firecrawl`, `medical-diagnosis-firecrawl`, `clinilabs-firecrawl` as "robust". The repo only has the non-firecrawl variants (`goodbody-scraper`, `thriva-scraper`, `lola-health-scraper`, `scrape-london-lab`, `london-health-scraper`, `medical-diagnosis-scraper`, `clinilabs-scraper`) plus `medichecks-firecrawl`. Should I:
   - **(A)** Treat the existing non-firecrawl scrapers as the "robust" ones and just run them, or
   - **(B)** Upgrade all 9 to Firecrawl-based versions (significant rewrite)?
2. **Firecrawl quota.** A full crawl across 9 providers with `map` + per-product `scrape` could be 1000+ credits. Is the connected Firecrawl plan sized for that, or should I cap each provider to top N popular tests?
3. **Static data files.** `realProviderData.ts`, `goodbodyTests.ts`, `medichecksTests.ts`, `londonLaboratoryTests.ts` — do you want them auto-regenerated from DB (I'll write a one-shot script), or kept hand-curated and only DB updated?
4. **Grammar review depth.** Should I (a) edit copy in place where I'm confident, or (b) produce a diff report first for your approval before changing on-page copy?

---

## Phase 1 — Provider Data Refresh

### 1.1 Orchestrator function
Create `supabase/functions/scrape-all-providers/index.ts`:
- Service-role bearer auth guard (matches existing pattern)
- Sequential execution per provider with 500 ms delay between Firecrawl calls
- Per-provider try/catch → writes status to `scraping_jobs`
- Returns summary `{ provider, scraped, upserted, failed }[]`

### 1.2 Per-provider extraction (depends on Q1)
For each provider, the flow is:
```
firecrawl.map(provider_root, { search: "test|panel|profile" })
  → list of product URLs
  → for each URL: firecrawl.scrape(url, { formats: [{type:'json', schema}] })
  → upsert provider_tests on (provider_id, test_name)
```
Extraction schema:
```ts
{ test_name, price, biomarker_count, biomarkers_list[],
  sample_type, turnaround_days_text, category, url, description }
```
Category values normalised to canonical taxonomy already in `categoryContent.ts`.

### 1.3 Verification
- URL liveness check (HEAD → 200) post-upsert; mark `url_verified`
- Spot-check script: random 5 tests/provider → fetch live page, diff price → log to `/mnt/documents/scrape-audit-{date}.csv`
- Cross-check `clinics_master.json` postcodes against provider clinic finders for the 3 providers with clinic networks (Randox, Goodbody, Medichecks)

### 1.4 Static file sync
Node script `scripts/sync-static-from-db.mjs`:
- Reads `provider_tests` per provider
- Regenerates the 4 TS files preserving current shape & comment headers
- Run once after scrape; commit output

### 1.5 Provider rating refresh
Re-pull review counts for the 9 providers from Trustpilot/Google via Firecrawl `scrape` → update `providerRatings.ts`.

---

## Phase 2 — Grammar & Content Review

Systematic, file-by-file pass, British English, project compliance rules (no outcome guarantees, no fear-based language, "CQC Regulated", "Health Resource Hub", non-guaranteed turnaround language).

### Order of review
1. **Core**: `Index.tsx`, `AboutUsPage`, `HowItWorksPage`, `FAQsPage`, `ContactPage`, `PartnersPage`
2. **Sections**: `components/sections/*` (Hero, CTAs, Testimonials, Trust, Footer)
3. **Category landings**: Thyroid, Hormones, Fertility, MensHealth, WomensHealth, HeartHealth, DiabetesTesting, CancerScreening, GutHealth, etc.
4. **Test pages**: `TestDetailPage`, `CompareTests`, `CompareBySymptomPage`, `CompareByGoalPage`, `BiomarkerDatabasePage`
5. **Provider pages**: `ProviderProfilePage`, `ProviderTestCatalogPage`, `GoodbodyClinicPage`, `MedichecksMensHealthPage`
6. **Legal/Compliance**: Privacy, Terms, Cookie, Accessibility, ModernSlavery, FairTrading, AffiliateDisclosure
7. **Feature**: `FindClinicPage`, `Dashboard`, `HealthDashboardPage`, `BloodTestAnalysisPage`, `AssistedTestFinderPage`
8. **Locale**: `src/locales/en.json` (and propagate fixes through translated files only if user-facing copy)
9. **Data with user-visible text**: `categoryContent.ts`, `blogArticles.ts`, `goalPages.ts`, `symptomPages.ts`, `categoryTaglines.ts`

### Checks per file
Spelling · grammar · British spellings (-ise, -our, "whilst") · capitalisation consistency (sentence case for headings unless brand) · terminology ("blood test" lowercase except titles) · provider name formatting (GOODBODY all caps per memory) · compliance phrasing · CTA wording consistency.

Output: in-place edits + a final summary changelog at `/mnt/documents/copy-audit-{date}.md`.

---

## Execution order
1. Confirm clarifications above
2. Phase 1.1–1.2 build & deploy `scrape-all-providers`
3. Run scrape, generate audit CSV
4. Phase 1.4 static file sync
5. Phase 1.5 ratings refresh
6. Phase 2 grammar pass (priority order above)
7. Final verification: build clean, spot-check 3 random pages per category in preview

---

## Technical notes
- All Firecrawl calls server-side only via existing `FIRECRAWL_API_KEY`
- Rate limit: 500 ms between calls; 3 retries with exponential backoff on 429
- `scraping_jobs` row updated per provider (status, last_test_count, error_message — sanitised by existing trigger)
- Edge function uses `npm:@supabase/supabase-js@2/cors`, Zod-validated body, generic error responses (no leakage)
- No DB schema changes required — `provider_tests` already has all needed columns