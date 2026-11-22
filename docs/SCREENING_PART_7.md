# Medical Diagnosis price screening, part 7

## Change and deployment

- Updated only `mhc-page-scrape` and its tests/fixture, plus the architecture rule and task roadmap.
- Deployed **v167**, confirmed by live invocation deployment ID `clvuioagsgfadynuvodj_1705e69a-f2d6-442e-a000-cecdcdddcb8e_167`.
- Submitted deployment source SHA-256: `22f106cb3219e5cc73f546527ca53d7bb591ebbc2d463d6033b9d5eec6611773`.
- No site publication, migrations, cron changes or hand-edited catalogue rows.

## Implemented rules

1. Read the WooCommerce amount following `Price:` using the shared HTML-to-text entity decoder. Literal pound, named pound, decimal and hexadecimal references all produce **156** from the live Women's Hormones fragment. Plain text, zero prices and unrelated amounts after subsequent product fields are rejected.
2. Require a Medical Diagnosis product URL, a `single-product` body and a positive readable price before changing any row field. Failed price/product validation reports the URL with `price not readable`; successful writes refresh the scraped and validated timestamps. HTTP failures also leave all row fields intact.
3. Combine matched sitemap URLs, active stored paths and eligible hidden stored paths, deduplicate normalised paths and use the unchanged five dynamic batches. Sitemap URLs take precedence over alternate stored spellings; active rows take precedence over inactive duplicate identities.
4. Include inactive rows with automatic delist history in the last 14 days, excluding any manual delist history. Recheck manual exclusions before writing and condition the update on the expected active state. A successful restoration writes `relisted_auto` with the newly read price. Re-list audit errors are surfaced in the run rather than silently ignored.

## Verification

- **10 Deno tests passed**, including all four requested rules and exact-once coverage for 150, 151 and 180 paths.
- **1,355 platform unit tests passed**; changed-file ESLint passed; automatic compilation reports `build OK`.
- Wrong/missing internal secret: **401**; authenticated invalid batch: **400**; URL-only and all five authenticated dry runs: **200**.
- Live discovery: **154 distinct paths**, **151 active rows**, slice size **31**, batch sizes **31/31/31/31/30**. All 154 were attempted; catalogue writes and re-listings were **0**, as required for dry verification.
- Deployed samples read Women's Hormones **£156**, Men's Essentials Plus **£188** and Thyroid Profile I **£72**. Direct provider read confirmed ALEX3 is a live product with **£331**; Sputum remains a live unpriced product and is not eligible for restoration.
- Five corresponding `scrape_runs` rows read back with `dry: true`, accurate batch metadata and zero updates. One success and four partial runs: Sputum and Lupus Anticoagulant had no readable price/product evidence; four other requests returned provider HTTP 429. Last-good row fields were untouched.
- Read-only database advisors returned existing informational/access/performance findings; no schema or access rules were modified.

## Pending scheduled outcome

The scheduled 12:16–12:28 UTC runs have not happened yet. This deployment enables price correction and ALEX3 restoration; their actual persistence is not claimed. Provider HTTP 429 or unavailable prices can still defer individual updates and are explicitly recorded. Clinical data, commercial collection-fee calculation, provider descriptions and manual exclusions remain unchanged.

Domain workflow: blood-test-scraping.