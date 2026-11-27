# Sync-secret transition: step 3

Verified and deployed 27/11/2026. No site publication, production migrations, cron changes or Apify edits.

## Changes and existing state

The incoming `de4027b82` commit already removed the URL fallback and `via`, updated the seven Auth comments, both config comments, CLAUDE.md, the two scraper test request headers and SQL command assertions. The actual web test lives at `src/lib/__tests__/mhc-auth.test.ts`, not `src/lib/tests/mhc-auth.test.ts`.

This follow-up returns `{ ok: false, reason: "mismatch" }` for URL-secret requests, including a query-only request. Requests carrying a query secret remain refused even with a correct header. Caller-only warnings remain; no secret is logged. Successful authentication returns exactly `{ ok: true, source: "vault" }`. Both Deno and web regressions assert the rejection result. Removed an unchecked assertion from the modified Deno test helper.

## Verification

- 1,368 platform unit tests passed.
- Nine shared auth Deno tests and seven scraper Deno tests passed.
- Full Deno suite: 212 passed, five failed in unrelated deployed-endpoint tests. Two quiz-recommendations tests expect anonymous acceptance but receive 401; three security-alert-notify tests use the public key and expect 200/400 but receive 401. No access controls were weakened to satisfy those tests.
- All 45 manual price-sync SQL scenarios passed on the isolated `/tmp/pgt` PostgreSQL server. No production SQL was changed or executed by this test.
- Changed-code ESLint passed; automatic preview compilation reports build OK.
- All seven deployed functions returned 401 for missing, wrong and query-only credentials, and 200 with the Vault header (28 live requests). Six catalogue checks used dry/read-only options; randox-kit-images performed its normal refresh and reported all 44 active tests mapped successfully.
- A real direct manual Clinilabs refresh returned 200: 140 seen, 139 updated, zero inserted/deactivated; persisted scrape_runs status is success. The public provider page renders 139 tests with no page errors. This verifies direct header invocation, not the admin queue.
- Advisor baseline and post-deploy result both contain 32 findings; no new finding type/count. Existing unrelated database findings were not changed.

## Deployment

The seven functions were submitted together successfully. Numeric deployment versions were not returned; source SHA-256 values:

| Function | Source SHA-256 |
|---|---|
| mhc-lml-scrape | c21a56bf054bcbe870e10ee8fa8e4879d12b1529f603d1daf9e79ad8d6911ba1 |
| mhc-medichecks-sync | afaa06726a03638b1f516fb7a448dd98ed2966f2b2c3a39b06168e11fa9fccfa |
| mhc-page-scrape | 5faf449607bc866e1103a3e0a3893b6974c45a54717e3b79a04eafbbf98d4713 |
| mhc-randox-scrape | 7a7943cfc528aa1253b291fb910a3e01d76482a614cea82ea779f86ec23ecead |
| mhc-shopify-rich-sync | f2d987f33d6499ef864ea9e9bdb40b7f5b8ab22b1f84de12ffd0998e1c5c87f5 |
| mhc-shopify-sync | b8686d1e12b885af21ff1e5728c36b7f938ea6aa1e56d9252fdf6210b67d2a11 |
| randox-kit-images | 2e2775343cc5d95e45ee49cfba2d8701685c84a9eb82ff9a69285bd2e9508891 |

Function logs confirm value-free query-rejection warnings.

## Remaining acceptance checks

The next scheduled cycle starts 28/11/2026 at 00:00 UTC and ends with kit images at 00:34 UTC. These future executions cannot be verified at 21:38 UTC on 27/11/2026. All 14 catalogue jobs and the kit-image job already have the header and no URL secret; commands and schedules were left unchanged.

The real admin queue path requires an admin MFA session. Lovable refuses session minting for this user-managed Supabase backend, so it was not bypassed. Direct manual sync succeeded and the isolated queue tests passed, but an authenticated Crux Control manual request remains unverified.

Domain skill: mhc-edge-functions.