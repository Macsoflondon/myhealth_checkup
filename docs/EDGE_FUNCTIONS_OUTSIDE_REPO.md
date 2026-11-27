# Edge functions outside the repository

Inventory supplied by the site owner on 22/11/2026. Absence from this repository does not mean a function is inactive. Do not replace or retire a live function on that assumption.

## Live, not yet in the repository

Checked against Supabase on 28/11/2026. These four functions are deployed straight from the Supabase dashboard or CLI, not from this repository, so a push to `main` does not redeploy them. Their source is kept as reference copies under `docs/edge-functions-outside-repo/`, byte for byte as deployed. ESLint ignores that folder so the copies stay identical to what runs.

| Function | Purpose | Invocation | Authentication | Deployed version | Last deployed |
| --- | --- | --- | --- | --- | --- |
| `blog-aggregate` | Reads provider blog feeds and upserts `provider_blog_posts` | Daily pg_cron job `aggregate-provider-blogs` | Service-role credential, checked in code | 12 | 27/11/2026 03:03 UTC |
| `provider-test-image-sync` | Copies provider product images into the `provider-test-images` bucket and links them on `provider_tests` (modes `pair`, `rehost`, `og`) | Manual | `x-mhc-sync-secret` header against Vault `mhc_sync_secret`, through `_shared/mhc-auth.ts` | 8 | 27/11/2026 21:01 UTC |
| `landing-signup` | Public signup form and confirmation email; writes `landing_signups` | Public form | Anonymous; `verify_jwt = false`; per-address rate limit | 4 | 27/11/2026 03:01 UTC |
| `mhc-biomarker-extract` | Biomarker extraction helper | Manual | Service-role bearer | 16 | 15/08/2026 |

Reference copies (MD5 of `index.ts`):

- `blog-aggregate/index.ts` `5928d11a0ff8364567e517567d154231` (entry point only; the deployed bundle also carries its own `_shared/blog/sources.ts`)
- `provider-test-image-sync/index.ts` `4713b40c9b2533b5e315891621e58278`
- `landing-signup/index.ts` `244fb91eeee9c441163506c3338f34a9`

There is no copy of `mhc-biomarker-extract`.

### Changes on 27/11/2026 (platform screening)

- `blog-aggregate`: one entity decoder shared with the site, EDGE (`sports-blood-tests`) edge-index articles, a repair pass for stored titles and excerpts that still hold entities, and article pages fetched only for posts not yet stored with an image and summary. The backfill pass covers recent posts only, so a run no longer meets Shopify rate limits.
- `provider-test-image-sync`: the sync secret moved from `?secret=` to the `x-mhc-sync-secret` header, checked by the shared `mhc-auth.ts`. A URL that carries `secret` is refused with 401.
- `landing-signup`: the rate-limit address now comes from `_shared/client-ip.ts`, which trusts only the validated edge header, not a caller-supplied forwarding list.

### Repository functions changed the same day

Deployed automatically when the Part 14 commit reached `main` (27/11/2026 21:16 UTC). Versions at that deploy: `mhc-medichecks-sync` 165, `mhc-shopify-sync` 175, `mhc-shopify-rich-sync` 172, `mhc-randox-scrape` 172, `mhc-page-scrape` 177, `mhc-lml-scrape` 166, `randox-kit-images` 90, `apify-ingest` 123, `apify-scrape-provider` 122, `ai-human-context` 254, `blood-test-analysis` 284, `hidden-gap-detector` 132.

- The `mhc-*` functions and `randox-kit-images` accept the sync secret only in the `x-mhc-sync-secret` header. A request whose URL carries `secret` gets 401, even with a correct header. Checked live on 28/11/2026: a wrong header and `?secret=` both return 401 on all seven, and the correct header returns 200.
- `apify-ingest` checks only the `x-apify-ingest-secret` header against Vault `apify_ingest_secret` (503 when Vault is empty, 401 on a mismatch). `apify-scrape-provider` sends that secret to Apify in `headersTemplate` and never sends the service-role key.
- `ai-human-context`, `blood-test-analysis` and `hidden-gap-detector` write nothing to `health_queries` and read no `biomarker_readings` history while `PERSONAL_HEALTH_RECORDS_ENABLED` is false. `ai-human-context` caps paid AI calls across all visitors at 1,000 in a rolling 24 hours and serves keyword scoring past the cap.

## Retired HTTP 410 stubs

The owner lists these for deletion from the Supabase dashboard's **Edge Functions** area. This change does not delete them or alter cron jobs.

- `debug-env`
- `debug-db`
- `debug-rpc`
- `debug-crux`
- `debug-models`
- `debug-openai`
- `debug-apify-token`
- `test-user-key`
- `test-embeddings`
- `test-embeddings-v2`
- `test-gemini-emb`
- `tmp-migration-export`
- `mhc-audit`
- `mhc-image-sync`
- `mhc-stock-fallback`
- `health-ai-analysis`
- `thriva-scraper`
- `mhc-thriva-scrape`
- `generate-test-descriptions`