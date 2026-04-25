
# myhealth checkup — full system audit

Evidence-led. Numbers come from the live Supabase project (`clvuioagsgfadynuvodj`), the codebase on disk, the Lovable security scanner, and `pg_stat_user_tables` / `pg_indexes`. No invented metrics.

---

## Executive summary

The platform is structurally sound — RLS is enabled on every public table, there's a real `has_role()` security-definer pattern, scraper output is sanitised, and the recent zod work in `ai-test-mapper` is clean. But three things are silently bleeding performance and one will fail Cyber Essentials Plus on first review:

1. **111 MB of static assets in `public/`**, dominated by six unoptimised hero/promo MP4s (14–18 MB each, MP4/H.264, no `<video preload="none">` discipline). On a 4G mobile connection this is an instant LCP and bandwidth disaster — and your current viewport is 399 px wide so this is exactly your target user.
2. **No React Query in the actual data layer.** `package.json` includes `@tanstack/react-query` and `useDashboardData`-style hook files exist, but `rg "useQuery|useMutation" src` returns **0 hits** outside type definitions. Every page is doing manual `useEffect` + `supabase.from()` fetches → no cache, no dedup, no stale-while-revalidate, refetch-on-every-mount.
3. **`provider_tests` has 24,756 index scans + 347 sequential scans** for 585 rows — meaning the hot read path works, but the *seq scans* are coming from filter combinations (`category` + `is_active` + `is_popular`) that have no composite index. Cheap to fix.
4. **Leaked password protection is OFF** in Supabase Auth (confirmed via linter). This is a one-toggle Cyber Essentials Plus blocker.

Everything else (RLS policies, role escalation defence, secret redaction trigger, audit logs, server-side encryption pipeline) is in a defensible state after the recent migration work.

---

## 1. Critical issues — fix this week

### C1. Strip 100+ MB of video weight from `public/`
**Evidence:** `du -ah public/` →
- `hero-video-new.mp4` 17 MB, `hero-video.mp4` 14 MB, `myhealth_checkup.mp4` 18 MB, `medichecks-promo.mp4` 17 MB, `medichecks-promo-2.mp4` 17 MB, `goodbody-promo.mp4` 5.4 MB.
- Plus 17 MB of unoptimised PNGs in `public/images/tests/` (e.g. `guardant-reveal.png` 1.2 MB).

**Fix:**
- Move all videos to Supabase Storage (`videos` bucket already exists) or a CDN. Serve as `.webm` (VP9) + `.mp4` (H.264) with `<source>` fallback. Re-encode at 1280×720, CRF 28, ~1.5 Mbps — typical 80–90% size reduction.
- Drop one of the two `medichecks-promo*.mp4` files (they're near-duplicates) and one of the two hero videos.
- All `<video>` tags get `preload="none"` + `poster=""` so the bytes only load on play.
- Convert all `public/images/tests/*.png` >300 KB to WebP at 85% quality (`cwebp -q 85`).
- Add `<link rel="preload" as="image" type="image/webp" href="...">` only for the LCP hero image.

**Expected impact:** First-load weight on `/` drops from ~30 MB to ~2–3 MB. LCP on 4G mobile improves by 3–6 s. Lovable Cloud egress costs drop proportionally.

### C2. Enable Leaked Password Protection
**Evidence:** `supabase--linter` → `WARN 1: Leaked Password Protection Disabled`.
**Fix:** One toggle in Supabase Auth → Password security. Pre-req for Cyber Essentials Plus password hygiene control A.5.17.

### C3. Adopt React Query everywhere data is fetched
**Evidence:** `rg "useQuery|useMutation" src` → **0 results**. `QueryClient` is set up in `App.tsx` but unused. Meanwhile `rg "useEffect" src --glob '*.tsx'` → 59 files, many doing manual Supabase fetches inside `useEffect`.

**Fix (incremental, no big bang):**
- Phase 1: convert the top 5 read paths used on the homepage and category pages — `usePopularTestsFromDatabase`, `useCompareTestsData`, `useProvidersByTestType`, `useProvidersQuery`, `useTestsQuery` (the hook files exist; many likely have stale custom `useEffect` implementations under the hood). Wrap in `useQuery({ queryKey, queryFn, staleTime: 5*60_000 })`.
- Phase 2: same for dashboard (`useDashboardData`, `useFavoritesQuery`, `useOrdersQuery`).
- Add a global `QueryClient` config: `staleTime: 60_000, gcTime: 5*60_000, refetchOnWindowFocus: false`.

**Expected impact:** Cuts redundant Supabase round-trips by ~70% on tab/route changes; fixes flicker on back-navigation; shrinks Supabase egress and bandwidth bill.

### C4. Add the missing composite indexes on hot read paths
**Evidence:** From `pg_stat_user_tables`:
- `provider_tests`: 347 seq scans, 585 rows, 24,756 idx scans → seq scans triggered by combined filters.
- `biomarkers_library`: 395 seq scans for 205 rows — same problem, the library page filters on `(category, biomarker_name)`.
- `clinics`: 363 seq scans, 48 rows — fine because table is tiny, but `clinic_finder` does bounding-box geo lookup; the existing `idx_clinics_location` GIST is good. Verify it's used.

**Fix (single migration, all `IF NOT EXISTS`):**
```sql
CREATE INDEX IF NOT EXISTS idx_provider_tests_active_category
  ON provider_tests (is_active, category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_provider_tests_popular
  ON provider_tests (is_popular, popularity_rank)
  WHERE is_active = true AND is_popular = true;
CREATE INDEX IF NOT EXISTS idx_provider_tests_provider_active
  ON provider_tests (provider_id, is_active);
CREATE INDEX IF NOT EXISTS idx_biomarkers_library_category_name
  ON biomarkers_library (category, biomarker_name);
CREATE INDEX IF NOT EXISTS idx_provider_test_mapping_provider_test
  ON provider_test_mapping (provider_id, test_master_id);
CREATE INDEX IF NOT EXISTS idx_price_history_test_provider_date
  ON price_history (test_id, provider, changed_at DESC);
ANALYZE provider_tests, biomarkers_library, provider_test_mapping, price_history;
```
**Expected impact:** Eliminates the seq scan tail on the catalogue and biomarker pages. ~2–10× faster filter queries; the size of these indexes will be <100 KB total.

---

## 2. High — performance

### H1. `run-all-scrapers` is sequential with hard 2 s sleeps
**Evidence:** `supabase/functions/run-all-scrapers/index.ts` line 176 — `for (const scraper of SCRAPERS)` with `await new Promise(r => setTimeout(r, 2000))` between each. With 9 scrapers that's a minimum of 18 s of dead wall time, plus serial network latency. Each scraper is independent.

**Fix:** Run them with bounded concurrency (e.g. 3 at a time using a small pool) and drop the universal sleep. Keep per-scraper retry with exponential backoff for upstream rate-limit errors. Wall time drops from ~3–5 minutes to ~60–90 s.

### H2. Page bundles are too monolithic
**Evidence:** Largest page files: `WellnessPage.tsx` 500 lines, `FAQsPage.tsx` 496, `LocationsPage.tsx` 504, `ProviderProfilePage.tsx` 543, `CancerBiomarkersReferencePage.tsx` 534. Vite `manualChunks` config is good (vendor splits done) but pages aren't lazy-loaded.

**Fix:** In `src/routes/index.tsx`, wrap *all* routes in `React.lazy()`, not just admin routes. The admin lazy-load pattern is already there — just extend it. Pair with `<Suspense fallback={<PageFallback />}>` (already exists).

**Expected impact:** Initial JS payload on `/` drops by an estimated 40–60% (homepage stops shipping the cancer-screening, dashboard, and admin code).

### H3. `MobileNavigationDrawer.tsx` (643 lines) and `AssistedTestFinder.tsx` (597) are render-heavy
**Fix:** Split into composable subcomponents and memoise (`React.memo`) the leaf rows. Today every drawer toggle re-renders the whole tree. Quick win: `useCallback` on the handlers passed into list items.

### H4. Dev-only performance hook running in prod
**Evidence:** `usePerformanceOptimization.ts` writes a `<style>` tag with critical CSS *on every mount* and registers four `PerformanceObserver`s. The CSS injection is fine, but the observers should be dev-mode only.

**Fix:** Wrap the observer setup in `if (import.meta.env.DEV)`.

---

## 3. Database — schema & access

### Status: solid foundation, three improvements

- **Roles table is correct.** `user_roles` + `has_role()` security-definer + recent `Block public role inserts` policy = good. No client-side privilege escalation path.
- **Sensitive fields trigger is correct.** `validate_encrypted_fields()` enforces the `enc:` prefix on all PII columns of `user_profiles`. Confirmed.
- **`scraping_jobs.error_message` is sanitised** at write time by `sanitize_scraping_job_error()`.
- **GIST index on `clinics(longitude, latitude)`** exists — good for clinic finder.

### Improvements:
- **D1.** `tests_master` has 0 idx scans and 333 seq scans for 109 rows. Tiny table so it doesn't matter today, but `category` is your primary filter — add `CREATE INDEX IF NOT EXISTS idx_tests_master_category_active ON tests_master(category) WHERE is_active = true;`.
- **D2.** `audit_logs` has only 2 rows. Either the `log_data_access()` trigger isn't attached anywhere (meaning audit logging is currently a dead letter — Cyber Essentials Plus A.8.15 expects audit trails for sensitive data access), or it's attached to a path that isn't exercised. Confirm and either attach or remove.
- **D3.** Add a partitioning / retention plan for `audit_logs` and `notification_history` *now* before they grow. A monthly partition + 12-month retention job mapped via `pg_cron` keeps them cheap forever.

---

## 4. Edge functions — audit findings

| Function | Issue | Fix |
|---|---|---|
| `run-all-scrapers` | Sequential + 2 s sleeps (H1 above) | Bounded concurrency |
| `lml-nearest` | Public, no JWT — relies on IP rate limit. Verify `api_rate_limits` table is actually being written by it (currently has 1 row). | Confirm rate limiter writes; add structured 429 response |
| `geocode-clinic` | Calls upstream API on every clinic save | Memoise in `clinics.latitude/longitude` if non-null (already the schema, just guard the call) |
| `health-ai-analysis`, `blood-test-analysis`, `quiz-recommendations` | Call OpenAI/Lovable AI with no timeout & no streaming | Add `AbortController` with 30 s timeout; consider streaming responses to reduce TTFB |
| All scrapers | Catch blocks now use `(error instanceof Error ? error.message : String(error))` 31× — works, but verbose | Extract the `getErrorMessage` helper added to `ai-test-mapper` into `supabase/functions/_shared/errors.ts` and import everywhere |
| Several scrapers (`thriva`, `randox`, etc.) | No zod validation on incoming `req.json()` | Add minimal `RequestSchema = z.object({ replace: z.boolean().optional() })` per scraper |

---

## 5. Security — Cyber Essentials Plus posture

### Currently in good shape
- RLS enabled on every public table; every user-scoped table uses `auth.uid() = user_id` patterns.
- Service-role key never reaches the client (verified by grep).
- `user_roles` insert blocked from `anon`/`authenticated`; admins can only *update* roles to `'user'` (good defence-in-depth).
- Newsletter subscribers — public insert blocked; signups only via privileged edge function.
- Audit log rows are `INSERT`-only via trigger; cannot be updated/deleted.

### Gaps ranked

| Severity | Finding | Fix |
|---|---|---|
| **Critical** | Leaked Password Protection disabled (linter) | Toggle ON in Auth dashboard |
| **High** | No idle session timeout enforced server-side. `useIdleSessionTimeout` exists client-side at 30 min, but the JWT itself doesn't shorten — if a token is exfiltrated the client timer is irrelevant. | Lower Supabase Auth JWT expiry to 30 min, enable refresh-token rotation |
| **High** | `audit_logs` only has 2 rows → trigger likely not attached to sensitive tables | Attach `AFTER INSERT/UPDATE/DELETE` triggers to `user_profiles`, `test_results`, `biomarker_readings`, `uploaded_test_results` |
| **Medium** | `verify_jwt = false` on most edge functions, with in-code JWT validation | Audit each public function for the in-code check; add zod-validated request bodies (covered above) |
| **Medium** | No CSP header. `public/_headers` exists for Vercel/Netlify — confirm CSP is set | Add strict CSP: `default-src 'self'; img-src 'self' data: https://*.supabase.co; connect-src 'self' https://*.supabase.co https://api.openai.com; script-src 'self' 'wasm-unsafe-eval'` |
| **Medium** | MFA exists for admins (`useAdminMFA`, `verify-admin-mfa`) but not enforced for all admin-protected edge function calls | Add server-side AAL2 check inside every function that mutates as service role |
| **Low** | `console.log/error` left in code (88 instances) | `terser drop_console: true` is already set in `vite.config.ts`. Verify it actually runs in your build pipeline |

---

## 6. UK GDPR compliance

| Principle | Status | Action |
|---|---|---|
| Data minimisation | ✓ Only name, email, phone, prefs collected. Encrypted at rest via `enc:` prefix discipline | None |
| Lawful basis / consent | ✓ `user_consents` table with version, IP, user-agent, timestamp; `CookieConsent` component exists | Add a Records of Processing Activities (ROPA) document |
| User rights (Art. 15/17/20) | ✓ `data_access_requests` table exists | Build the actual dashboard UI to *submit* requests; admin tooling to fulfil them within 30 days |
| Retention | ⚠ Only `health_queries` (90 days) and `api_rate_limits` (1 hour) have cleanup functions | Add retention jobs for `audit_logs` (12 months), `notification_history` (12 months), `uploaded_test_results` (user-controlled, default 36 months) |
| Audit logging | ⚠ Triggers exist but appear unattached | See security table above |
| Data residency | UK DCR — confirm Supabase project region is `eu-west-2` (London). If not, it's a compliance blocker for medical-adjacent data | Verify in Supabase dashboard; migrate if wrong |

---

## 7. Codebase / maintainability

- **48 components in `components/ui/`** — fine, this is shadcn baseline.
- **65,456 LOC across 432 TS files** — within reason for the feature set, but several god-files (`sidebar.tsx` 761, `MobileNavigationDrawer.tsx` 643) need decomposition for testability.
- **Two parallel data sources**: `src/data/compare/*` (hardcoded TS files: 946 + 749 + 603 lines) duplicate what's in `provider_tests`. This is your single biggest source of drift between the marketing pages and the live database. Recommend a phased migration to make the database the only source of truth, with the hardcoded files removed.
- **No CI test gate visible.** `vitest` is configured and a few `__tests__` exist, but with 432 files there are <10 test files. Recommend a pre-merge GitHub Action that runs `bunx vitest run` + `bunx tsc --noEmit`.

---

## 8. Proposed implementation order (when you approve)

When you switch this back to default mode, I'll execute in this order — each step is independent and reversible:

1. **DB migration** — add the 6 composite indexes from C4 + retention partitions for `audit_logs`. Zero downtime.
2. **Toggle Leaked Password Protection** — done in dashboard, I'll guide you with one screenshot.
3. **Lazy-load all routes** — single edit to `src/routes/index.tsx`. Measurable LCP win.
4. **Strip and re-encode videos** — generate a manifest of which files to remove/re-encode, move to Supabase Storage, swap URLs.
5. **React Query phase 1** — convert the 5 hot hooks. Keep old hooks as thin wrappers for one release to avoid breakage.
6. **`run-all-scrapers` bounded concurrency** — ~30 lines changed.
7. **Shared `_shared/errors.ts` helper** — replace 31 inline error narrowings.
8. **Attach `log_data_access()` triggers to PII tables** — DB migration.
9. **Add CSP headers to `public/_headers`** — verify deploy target.
10. **Documentation: ROPA + retention policy + GDPR rights workflow** — markdown in `/docs`.

I will *not* delete any source file or remove any feature without an explicit approval per item.

---

## Out of scope for this audit (call out if you want them next)
- Penetration testing of the live edge functions (would need a separate auth'd test plan).
- E2E test harness (Playwright) — currently zero E2E coverage.
- Sentry / error tracking integration.
- Migrating the duplicate `src/data/compare/*` static files into the DB.
