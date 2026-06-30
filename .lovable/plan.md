# Plan: CI Security Gate + Verification Re-Scan

## 1. New GitHub Actions workflow — `.github/workflows/security-scan.yml`

Runs on every PR to `main`, on push to `main`, and weekly (Mon 05:00 UTC).

Jobs:

- **supabase-advisor-snapshot** — invokes the existing `security-scan-snapshot` edge function using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` repo secrets via `curl`. Parses the JSON response and fails the job if `error_count > 0` or if `diff.added_count > 0` (regression gate; warnings tolerated but reported). Uploads the response JSON as a build artifact.
- **rls-grants-lint** — small Node script (`scripts/check-rls-grants.mjs`) that scans `supabase/migrations/*.sql` for any `CREATE TABLE public.<x>` not followed by a matching `GRANT` and `ENABLE ROW LEVEL SECURITY` block in the same file. Fails on violation. Catches the most common future regression class (the exact one we keep fixing).
- **dependency-audit** — already exists in `.github/workflows/dependency-audit.yml`; leave untouched, just reference it as part of the security pipeline in docs.
- **secret-scan** — runs the existing `scripts/check-secrets.sh` (already in repo). Add to this workflow so it runs on every PR, not just locally.

## 2. Production build hook — `package.json`

Add `"prebuild": "bash scripts/check-secrets.sh && node scripts/check-rls-grants.mjs"` so `bun run build` (used by Vercel/Lovable prod) refuses to build if either check fails. Keeps local + CI in sync.

## 3. New script — `scripts/check-rls-grants.mjs`

~40 lines. For each `.sql` file under `supabase/migrations/`:
- Find every `CREATE TABLE public.<name>` (regex, case-insensitive).
- For each, assert the same file contains both `GRANT ... ON public.<name>` and `ALTER TABLE public.<name> ENABLE ROW LEVEL SECURITY`.
- Print violations and exit 1 if any.

## 4. Docs — append to `docs/CYBER_ESSENTIALS.md`

One short section listing the new gates, what fails the build, and how to re-run locally (`bun run prebuild`).

## 5. Verification re-scan (runs in this same turn after build mode)

Call `security--run_security_scan` and report status of the previously fixed `internal_id`s:
- `resolve_canonical_anon`
- `ai_operation_logs_public_insert`
- `funnel_events_public_insert`
- `realtime_user_data_tables`
- `recommendation_history_no_insert_restriction`

Output a short table: id → previous severity → current state (cleared / still present). If any reappear, surface immediately rather than re-marking fixed.

## Out of scope
- No changes to RLS policies or edge function logic.
- No new secrets required beyond the existing `SUPABASE_SERVICE_ROLE_KEY` GitHub repo secret (user must confirm it's set; otherwise the snapshot job will be skipped with a warning, not fail).

## Confirm before I build
Is `SUPABASE_SERVICE_ROLE_KEY` already in GitHub Actions repo secrets, or should the supabase-advisor-snapshot job degrade to warn-only until you add it?
