# Edge functions outside the repository

Inventory supplied by the site owner on 22/11/2026. Absence from this repository does not mean a function is inactive. Do not replace or retire a live function on that assumption.

## Live, not yet in the repository

| Function | Invocation | Authentication |
| --- | --- | --- |
| `blog-aggregate` | Daily pg_cron job `aggregate-provider-blogs` | Service-role authentication |
| `provider-test-image-sync` | Manual | MHC sync secret |
| `mhc-biomarker-extract` | Manual | Service-role bearer |
| `landing-signup` | Public signup form and confirmation email | Public anonymous; deployed `verify_jwt = false` |

The exact deployed `landing-signup` source was supplied with SHA-256 `245ddb952e1201c7c8d86ceb46895018fe24e4f32e67e5fc02d66d1f46933a43`. The upload matches that checksum. Repository restoration was blocked by the sandbox's absent-Edge-function restriction; the deployed function has not been changed. Its repository configuration now records the existing anonymous setting, but this does not restore or secure the deployed address handling.

The deployed `blog-aggregate` includes an older `_shared/blog/sources.ts` without the `edge-index` source type. The supplied deployed entry point was read on 22/11/2026, but the sandbox blocked adding it to the absent function directory. Shared entity decoding, bounded title/excerpt repair and EDGE article parsing helpers are now in the repository; an updated entry-point handoff is prepared but not deployed. Do not mark this function as restored until its actual entry point is committed. See `docs/SCREENING_PART_5.md`. Its only schedule is the pg_cron job `aggregate-provider-blogs`; the failing duplicate GitHub workflow `blog-aggregate.yml` was deleted on 27/11/2026.

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