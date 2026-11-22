# Shopify link verification, screening part 9

## Deployment and scope

- Deployed **scrape-and-verify v198**; live deployment ID `clvuioagsgfadynuvodj_7cdcc50f-040c-4d48-a2d4-2738d222cacf_198`.
- Submitted source SHA-256: `d043a9971d596e108c63bb3721592599653367dddb8d520e46ed7022da042d45`.
- No site publication, migrations, schema changes or cron changes.
- Changed the verifier, its budget/status helper, dedicated Shopify catalogue helper/tests, architecture notes and roadmap.

## Behaviour

- Allowlisted store domains derive from existing price-sync configurations: Medichecks, Clinilabs, Lola, Goodbody and London Health Company.
- Only each store's own `/products/<handle>` URLs use catalogue verification. Other URLs retain individual HTTP checks, including redirect classification.
- One run-local catalogue read per store paginates `/products.json?limit=250&page=N` until a page contains fewer than 250 products. Requests retain the existing provider-specific stagger, capped adaptive stagger and one retry after HTTP 429. There is no cached feed fallback.
- A complete catalogue proves present handles OK and absent handles broken. Any incomplete read, malformed response, network/HTTP failure or time-budget exit is inconclusive, even when the handle appeared on an earlier page. Inconclusive checks produce no alerts and change neither verification field.
- Repeated 429 failures retain `rate_limited` counts; other incomplete-feed outcomes are separately reported as `inconclusive` rather than mislabelled as rate limiting. Both make the run partial.
- Provider summaries record `http`, `shopify_catalogue` or `mixed`, catalogue completeness where relevant, and not-reached counts.
- Preserve 202/background execution, oldest-first discovery, existing provider pools (including Lola's concurrency 1 / 1500ms stagger), the 330-second start-work budget and final log fields.
- Both catalogue and stored handles pass through `shopifyProductHandle`, so literal Unicode and URL-encoded names compare consistently.

## Verification

- **16 Deno tests passed**, covering method selection, presence/absence/incomplete outcomes, pagination, stagger, cutoff, malformed responses, Unicode handles, field preservation and all part 8 / redirect / 429 regressions.
- **1,355 platform unit tests passed**; changed-file ESLint and automatic compilation passed.
- Invalid bearer remains **401**. Authentication was not changed.
- Final full run invoked through the unchanged `call_edge_with_service_role` helper, request **77201**: **202**, no request timeout; live edge duration **788ms**.
- Run **f27ac3f4-876c-4eba-beb6-59fd089b4824** started **22/11/2026 07:29:10.244 UTC** and completed **07:31:46.350 UTC**, approximately **156.1 seconds**.

| Provider | Method | Checked | OK | Broken | Rate-limited | Other inconclusive | Not reached |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Medichecks | Shopify catalogue | 192 | 192 | 0 | 0 | 0 | 0 |
| Clinilabs | Shopify catalogue | 139 | 139 | 0 | 0 | 0 | 0 |
| Lola | Shopify catalogue | 104 | 104 | 0 | 0 | 0 | 0 |
| Goodbody | Shopify catalogue | 58 | 58 | 0 | 0 | 0 | 0 |
| London Health Company | Shopify catalogue | 14 | 14 | 0 | 0 | 0 | 0 |
| Randox | HTTP page | 44 | 44 | 0 | 0 | 0 | 0 |
| Medical Diagnosis | HTTP page | 151 | 151 | 0 | 0 | 0 | 0 |
| London Medical Laboratory | HTTP page | 34 | 34 | 0 | 0 | 0 | 0 |
| EDGE | HTTP page | 12 | 12 | 0 | 0 | 0 | 0 |
| **Total** | | **748** | **748** | **0** | **0** | **0** | **0** |

All five Shopify catalogues were complete. The final log status is **completed**, with no persistence/discovery errors. The total reflects the active catalogue at the time of this run, not the earlier 751-row snapshot.

## Verification correction

The first deployment (v197) checked all rows but falsely flagged Goodbody's `guardant360®-liquid-by-infinity` because a literal catalogue trademark compared against an encoded URL path. Direct provider catalogue evidence confirmed the product remained listed. Added a regression and shared-handle normalisation, deployed v198 and repeated the full check. The successful run restored its verification state. Acknowledged only false-positive alert `22bcfcaf-c6ae-406d-984e-fc49058c6bc2` created by the initial test; preserved the alert record and did not edit any other alerts or catalogue prices.

Read-only advisors returned the same existing informational/security/performance notes as part 8; no policies or schema were changed. Future feed outages intentionally remain inconclusive, not broken.

Domain workflow: mhc-edge-functions.