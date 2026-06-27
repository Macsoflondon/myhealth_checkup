## What's wrong today

The Control Centre at `/control` is mostly a glorified set of links and read-only tables. Specifically:

- **Crawls** section shows historic runs but has **no buttons to actually trigger** the orchestrator or per-provider scrapers.
- **Audits** is a list of links to old sub-pages, no actionable triggers, no inline results.
- **Automations**, **Logs**, **Notifications**, **Providers** are read-only snapshots — no acknowledge, retry, or drill-down actions.
- **Analytics / Search / Export** are stubs (11–62 lines, marked `stub`).
- **Overview** is static; no real KPIs from the catalogue or revenue surfaces.
- `/admin/test-dashboard`'s "Run audit" hits `audit-biomarkers` and surfaces the raw "Edge Function returned a non-2xx status code" toast with no diagnostics.

Net effect: it looks like a dashboard but you can't *operate* anything from it.

## Plan — turn `/control` into a real operations cockpit

### 1. Crawls become actionable
- Add a **"Run all scrapers"** primary button → calls `run-all-scrapers` with the user's session JWT, streams the returned `runId`, then polls `scrape_run_log` for that row until completion (live status pill).
- Add a **per-provider grid** (9 providers from `SCRAPERS`) with individual **Run**, **Last run**, **Last status**, **Last duration**, **Items scraped** cells. Each Run button posts `{ providerId }` to `run-all-scrapers`.
- Add **Re-promote** and **Verify URLs** buttons wired to `promote-provider-tests` and `scrape-and-verify`.
- Realtime subscription on `scrape_run_log` so new runs appear without refresh.

### 2. Audits become actionable
Replace the link list with inline action cards, each showing **last run time, last result, Run now button, View details**:
- Biomarker audit → `audit-biomarkers` (with proper error parsing so failures show the real reason, not "non-2xx").
- Category normaliser → `normalize-test-categories`.
- Section mapping audit → existing `SectionMappingAuditPanel` inlined.
- Security scan snapshot → `security-scan-snapshot` + diff vs previous.
- Provider image verifier → `verify-provider-images`.
- Sitemap / IndexNow resubmit → `gsc-resubmit-sitemap`, `indexnow-submit`.
- Leaked-password protection status (existing component) inlined.

### 3. Automations gets controls
- List pg_cron jobs from `cron.job` with **last run, next run, status, Run now**.
- Toggle enable/disable per cron via a thin RPC.
- Show last 10 invocations per job (joined from run logs).

### 4. Providers section gets depth
- Per provider: test count, avg price, last scrape, broken-URL count, alert count, **Open profile / Re-scrape / View tests** buttons.
- Click a provider → drawer with its catalogue diff vs last run (added / removed / price-changed rows from `provider_tests`).

### 5. Logs, Notifications, Overview
- **Logs**: searchable view across `scrape_run_log`, `scraper_alerts`, `security_audit_log`, `auth_audit_log` with filters (severity, source, date range, free text).
- **Notifications**: pull from `scraper_alerts` + `security_alerts`, with **Acknowledge / Resolve** actions writing back to the row.
- **Overview**: real KPIs — total tests, providers active, last full scrape, open critical alerts, security findings open, today's runs, today's errors. Health dots driven by live queries, not placeholders.

### 6. Analytics / Search / Export — promote from stub to v1
- **Analytics**: 30-day charts (runs/day, errors/day, tests added/day, price changes/day) from existing tables, using recharts.
- **Search**: single input that queries providers, tests_master, scrape_run_log, scraper_alerts and groups results.
- **Export**: CSV download endpoints for tests catalogue, run history, alerts, biomarker coverage.

### 7. Fix the "Edge Function returned a non-2xx status code" toast
- Wrap every edge-function invocation in a helper that:
  - Reads the response body on non-2xx and shows the real error string from the JSON `error` field.
  - Logs `function_id` + `status` to console for debugging.
- Apply to the audit triggers on `/admin/test-dashboard` and inside the new Audit cards.
- Investigate the actual `audit-biomarkers` failure (likely auth header or schema mismatch) and fix at the function level.

### 8. UX polish
- Sticky top bar in `/control` with "Last refreshed Xs ago" + global **Refresh all** button.
- Each section header gets a primary action button (Run / Audit / Export) instead of being purely informational.
- Toasts on every action with success/failure detail.
- Keyboard shortcut `g c` → Crawls, `g a` → Audits, etc. (small win).

## Technical notes

- All triggers call existing edge functions with `supabase.functions.invoke(name, { body })` — current admin session already authenticated; `run-all-scrapers` accepts admin JWTs.
- Realtime: enable `scrape_run_log` and `scraper_alerts` on the realtime publication if not already.
- New thin RPC `admin_cron_jobs()` (SECURITY DEFINER, admin-only) to expose `cron.job` and `cron.job_run_details` safely.
- Error helper lives at `src/lib/edgeInvoke.ts` and reads `error.context.body` from `FunctionsHttpError` to surface real messages.
- No schema changes for sections 1–6 beyond enabling realtime and the one cron RPC. Section 8 needs no migrations.

## Out of scope (call out, don't build silently)

- Rewriting the legacy `/admin/test-dashboard` — keep it but link from the new Audits section. Long term it should be retired.
- Building a brand-new BI warehouse — Analytics v1 uses existing Postgres tables only.
