# Security screening, part 4 — 22/11/2026

## Status

- **Address hardening implemented and deployed** for the existing in-repository functions. Site address changes are preview-only because the site was not published.
- **Landing signup blocked:** the uploaded deployed source matches the supplied SHA-256, but the sandbox refuses adding an absent Edge function. No alternative implementation was created and the production function was not changed. Its existing `verify_jwt = false` setting is recorded in `supabase/config.toml`.
- **Documentation completed:** corrected the contradictory blog-aggregation paragraph in `CLAUDE.md` and added `docs/EDGE_FUNCTIONS_OUTSIDE_REPO.md`.
- **No migrations applied or created, no cron changes, no site publication, no retired functions deleted or reactivated.**

## Address behaviour

The site helper and shared Edge helper validate trimmed IPv4/IPv6 literals, prefer `cf-connecting-ip`, then fall back to `x-real-ip`. Neither reads `X-Forwarded-For`. Each caller retains its previous null or `unknown` fallback.

Covered callers: newsletter subscription, complaint submission, quiz recommendations, public API, FHIR export consent, admin recovery, auth throttle, CSP reporting, protected-call audit logging, Human Context Engine, public MCP, test explainer and assistant. The repository guard also found and fixed `popular-test-website-data` and `test-recommendations`. Existing affiliate and visitor-limit consumers retain their `unknown` fallback after the helper's return type became nullable.

Public MCP is generated from the site helper, so its bundle contains the same validated implementation rather than importing the Edge helper. This preserves automatic regeneration. The separate site and Edge helpers have matching literal-validation tests.

## Deployed versions

Verified from post-deployment OPTIONS invocation records in `function_edge_logs`, not inferred from deployment submission hashes.

| Function | Version |
| --- | ---: |
| `newsletter-subscribe` | 230 |
| `submit-complaint` | 219 |
| `quiz-recommendations` | 254 |
| `public-api` | 155 |
| `fhir-export` | 135 |
| `admin-recovery` | 194 |
| `auth-throttle` | 176 |
| `csp-report` | 175 |
| `ai-human-context` | 235 |
| `mcp-public` | 99 |
| `popular-test-website-data` | 183 |
| `test-recommendations` | 309 |
| `gsc-resubmit-sitemap` | 205 |
| `os-plugins` | 115 |

The last two functions were redeployed to include the shared audit dependency. The retired `medichecks-scraper` was deliberately not redeployed despite stale repository source importing that helper.

## Verification

- Complete unit suite: **1,315 tests passed across 130 files**. Includes both address semantics and the repository-wide guard; FHIR mock loader now injects the real shared address helper.
- Deno targeted suite: **35 passed** (22 IP literal cases, three real-handler mocked rate-limit tests, five auth-throttle tests and five Human Context Engine rate-limit tests). Existing handler imports were run with `--no-check`; the new pure helper suite also passed separately with Deno type checking enabled (**22 passed**).
- Broader Deno run: **29 passed**, with two legacy modules initially failing at import because their dotenv example demanded `VITE_SUPABASE_KEY`. Retried both with a process-local alias of the existing public publishable key: **8 passed**, including the live quiz response checks. No stored secret or configuration changed.
- Public API live suite: **15 passed**, including catalogue data, MCP handshake/tools, malformed input and refused writes.
- Every deployed function passed a write-free OPTIONS check (200 or 204). Fresh function logs showed successful starts.
- Live empty signup/complaint/throttle submissions returned 400; unauthenticated FHIR, test recommendations and admin recovery returned 401. No signup or clinical records were created by these rejection checks.
- Automatic compilation: latest entries report **build OK**. No manual production build was run.
- Changed handwritten-file lint leaves **one pre-existing `no-control-regex` error** in quiz input sanitisation. Confirmed against the original committed source; intentionally not changed in this address-only task. Generated MCP output also retains its pre-existing generator formatting/`no-var` lint findings; its handwritten source passes lint.
- `git diff --check` passed; migration and workflow diffs are empty.

## Remaining action

Restore the exact deployed `landing-signup` source through a repository workflow that permits existing-but-absent Edge source, then replace only its address handling using `_shared/client-ip.ts`, test rate/consent values and deploy it. Do not treat this report or its configuration entry as a production fix for landing signup.

Skill used: `mhc-edge-functions`.