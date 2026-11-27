# Platform screening, part 17

## Repository handoff

Part 16 is committed as `7a4dc74ed`. The owner deployed `mhc-edge-sync` version 1 with `verify_jwt = false`, applied migration `20261127213546`, and reports HTTP 200 at 21:36 UTC on 27/11/2026 with a successful `scrape_runs` row: 12 updated, zero errors. These are owner-supplied deployment facts, not a new deployment or live write verification in this task.

The old GitHub EDGE runner is removed. The deployed entry point remains outside `supabase/functions`, with a reference copy under docs. The app parser is unchanged; its Deno copy differs only in the HTML import. Shared auth remains header-only against Vault with no URL or environment fallback.

## Byte-exact copies

All supplied hashes match the files committed to the repository:

| File | MD5 |
| --- | --- |
| `supabase/migrations/20261127213546_mhc_edge_price_sync_schedule.sql` | `b71324f554199b745ddbc78241784026` |
| `supabase/functions/_shared/scrape/edge-source.ts` | `30d01aa5efab401e8b697edc02bb9993` |
| `docs/edge-functions-outside-repo/mhc-edge-sync/index.ts` | `470ad942d0d9c8a0172ae9a2a74c5da3` |

The existing landing-signup, blog-aggregate and provider-test-image-sync reference hashes also match their inventory. Their documented deployed versions are 4, 12 and 8 respectively; EDGE is version 1. Documentation distinguishes reference copies from automatic deployment source.

## Verification

- Unit suite: 140 files, 1,376 tests passed, including five new EDGE source/behaviour parity tests.
- Targeted Deno tests: 27 passed for HTML decoding, provider upsert and shared sync authentication; no failures.
- `deno check supabase/functions/_shared/scrape/edge-source.ts`: passed.
- Changed-code ESLint: passed. Prettier enforcement is disabled only for the byte-exact supplied Deno parser so lint cannot demand changing the attachment's formatting; all other ESLint checks remain active. The new parity test passes normal ESLint including formatting.
- `git diff --check`: passed.
- Automatic compilation: latest observed entry reports `build OK`.
- Full Deno suite with the existing public Supabase URL/key supplied to legacy test configuration: 212 passed, five failed. Two quiz-recommendations tests expect anonymous acceptance and three security-alert-notify tests expect public-key acceptance/validation; deployed endpoints return 401. These are the same unrelated failures recorded in sync-secret step 3. No tests or access controls were changed to bypass them. An initial run without the legacy `VITE_SUPABASE_KEY` alias failed configuration in five modules; supplying the existing public key resolved that configuration issue.
- A separate production build was not run: the sandbox prohibits manually invoking project builds. Automatic compilation is verified, not a separately inspected production artefact.

Full Deno-green and separate production-build acceptance remain unverified for those reasons. No rendering, pricing logic, consent logic or public route behaviour was changed by this handoff.

## Files changed

Added:
- `supabase/migrations/20261127213546_mhc_edge_price_sync_schedule.sql` (already-applied SQL, copied only)
- `supabase/functions/_shared/scrape/edge-source.ts`
- `src/lib/edge-source-parity.test.ts`
- `docs/edge-functions-outside-repo/mhc-edge-sync/index.ts`
- `docs/SCREENING_PART_17.md`

Updated:
- `docs/EDGE_FUNCTIONS_OUTSIDE_REPO.md`
- `CLAUDE.md`
- `AGENTS.md`
- `roadmap.md`
- `docs/edge-activation.md`
- `docs/claude-pending-work.md` (removed obsolete instructions to activate the deleted runner)

Deleted as authorised:
- `.github/workflows/edge-price-sync.yml`
- `scripts/edge-price-sync.ts`

No function redeployment, publishing, migration execution, database changes or cron changes were performed.