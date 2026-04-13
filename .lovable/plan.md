

## Platform-Wide Audit and Provider Data Refresh

This is a two-part project: (1) scrape all providers for accurate, up-to-date test data, and (2) review all user-facing pages for grammatical errors.

---

### Part 1: Provider Data Scraping and Verification

We have Firecrawl connected and existing scraper edge functions for most providers. The plan is to build a unified multi-provider scraper that uses Firecrawl to pull live data from each provider's website, then update the Supabase `provider_tests` table and static data files.

**Providers to scrape (9 total):**

| Provider | Existing scraper | Approach |
|----------|-----------------|----------|
| Medichecks | `medichecks-firecrawl` (robust) | Run existing scraper, verify output |
| GoodBody Clinic | `goodbody-scraper` (HTML-based) | Upgrade to Firecrawl for reliability |
| Thriva | `thriva-scraper` | Upgrade to Firecrawl |
| Randox Health | `randox-scraper` | Upgrade to Firecrawl |
| London Medical Laboratory | `scrape-london-lab` | Upgrade to Firecrawl |
| Lola Health | `lola-health-scraper` | Upgrade to Firecrawl |
| London Health Company | None | Create new Firecrawl scraper |
| Medical Diagnosis | None | Create new Firecrawl scraper |
| Clinilabs | None | Create new Firecrawl scraper |

**For each provider, the scraper will extract:**
- Test name
- Price (GBP)
- Biomarker count and list
- Sample type (Finger prick / Venous draw / Saliva / Urine)
- Turnaround time
- Category mapping to canonical taxonomy
- Test URL (verified)
- Description

**Data will be stored in:**
1. Supabase `provider_tests` table (primary source of truth)
2. Static data files updated from DB results (`realProviderData.ts`, `goodbodyTests.ts`, `medichecksTests.ts`, `londonLaboratoryTests.ts`)

**Verification steps after scraping:**
- Cross-check prices against live provider sites (spot-check 5 per provider)
- Validate all test URLs return 200
- Confirm biomarker counts match provider claims
- Ensure turnaround times match provider pages
- Verify clinic location data in `clinics_master.json` against provider websites

---

### Part 2: Grammar and Content Review

Systematic review of all user-facing text across the platform.

**Pages to review (grouped by priority):**

1. **Core pages**: Index, About Us, How It Works, FAQs, Contact, Partners
2. **Test pages**: All category landing pages (Thyroid, Hormones, Fertility, etc.), test detail pages, comparison pages
3. **Provider pages**: Provider profiles, test catalogs
4. **Legal/Compliance**: Privacy Policy, Terms, Cookie Policy, Accessibility, GDPR, Fair Trading
5. **Feature pages**: Find a Clinic, Biomarker Library, Dashboard
6. **Section components**: Hero, CTAs, Testimonials, Trust signals, Footer

**What I will check:**
- Spelling errors
- Grammar mistakes
- Inconsistent capitalisation (British English standard)
- Missing punctuation
- Inconsistent terminology (e.g., "blood test" vs "Blood Test")
- Incorrect provider names or data references
- Claims that conflict with compliance rules (no outcome guarantees, no fear-based language)

---

### Technical details

**Edge function changes:**
- Create a new `scrape-all-providers` edge function that orchestrates Firecrawl scraping across all 9 providers
- Each provider gets a Firecrawl `map` call to discover product URLs, then individual `scrape` calls for each product
- Results upserted to `provider_tests` with `onConflict: 'provider_id,test_name'`
- Rate limiting: 500ms between Firecrawl calls to avoid quota issues

**Static data file updates:**
- After scraping, regenerate `realProviderData.ts` with verified data from all providers
- Update `goodbodyTests.ts`, `medichecksTests.ts`, `londonLaboratoryTests.ts` to match DB
- Update `providerRatings.ts` if review counts have changed

**Grammar fixes:**
- Direct edits to page components (`.tsx` files)
- Updates to data files containing test descriptions
- Locale file (`en.json`) corrections if applicable

---

### Execution order

1. Deploy and run Firecrawl scrapers for all 9 providers
2. Verify scraped data accuracy (spot-checks)
3. Update static data files from verified DB data
4. Grammar review all user-facing pages (systematic, file by file)
5. Final verification pass

This is a large undertaking that will require multiple implementation rounds. I will prioritise providers with the most traffic first (Medichecks, GoodBody, Randox) and core pages for grammar review.

