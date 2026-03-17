

## Comprehensive Security Review

### Overall Assessment
The project demonstrates a strong security posture with defense-in-depth practices already in place: RLS on all tables, admin role verification via server-side `has_role()`, MFA enforcement for admins, security headers (CSP, HSTS, X-Frame-Options), encrypted PII fields, and audit logging. Below are the remaining issues ranked by severity.

---

### CRITICAL Issues

**1. Account lockout is client-side only (bypassable)**
`src/hooks/useAccountLockout.ts` stores login attempt counts in `localStorage`. An attacker can simply clear localStorage or use a different browser to bypass this entirely. The Auth page also clears this on mount (per memory). This provides zero protection against brute-force attacks.

**Fix:** Implement server-side rate limiting on the Supabase auth endpoint, or add a database-backed failed-attempt tracker in an edge function that wraps sign-in.

---

### HIGH Issues

**2. Unauthenticated edge functions with no rate limiting**
Several edge functions have `verify_jwt = false` in `config.toml` AND perform no auth check in code:
- `quiz-recommendations` — calls OpenAI/Lovable AI with user-supplied input, uses service role key to query DB. No auth, no rate limit. An attacker could abuse this to exhaust AI API quota.
- `test-recommendations` — same pattern, calls AI gateway with user-supplied test data.
- `scrape-popular-tests`, `medichecks-firecrawl` — no auth, could be invoked externally to trigger scraping.
- `price-updates`, `update-provider-tests` — no auth, write to DB via service role.
- All scraper functions (`goodbody-scraper`, `medichecks-scraper`, `lola-health-scraper`, `randox-scraper`, `scrape-london-lab`, `provider-scraper`, `run-all-scrapers`) — no auth, use service role keys.

**Fix:** Add authentication checks or at minimum a shared secret header validation for internal/admin-only functions. Add rate limiting to public-facing AI functions.

**3. `ai-test-mapper` accepts service role key as auth bypass via header**
Line 320: `if (serviceKeyHeader && serviceKeyHeader === SUPABASE_SERVICE_ROLE_KEY)` — this compares a client-sent header directly against the service role key. If the service role key leaks, this grants full admin bypass. The comparison itself could also be vulnerable to timing attacks.

**Fix:** Use a separate, dedicated API key for service-to-service auth rather than the service role key.

---

### MEDIUM Issues

**4. Missing `noopener,noreferrer` on several `window.open()` calls**
- `src/pages/Dashboard.tsx:329` — `window.open(order.result_url || '#')` — no security params
- `src/pages/SportsPerformancePage.tsx:284,362` — `window.open(test.url, '_blank')` — missing `noopener,noreferrer`
- `src/components/enhanced/EnhancedTestCard.tsx:244` — same issue

**Fix:** Add `'noopener,noreferrer'` as the third argument to all `window.open()` calls.

**5. `dangerouslySetInnerHTML` in chart component**
`src/components/ui/chart.tsx:120` uses `dangerouslySetInnerHTML` for injecting CSS theme styles. While there IS a `sanitizeCSSColor` function, the approach is inherently risky. The sanitizer only validates color values — if theme keys or structure ever change, injection could occur.

**Fix:** Low risk currently given the sanitizer, but consider using CSS custom properties via `style` prop instead of innerHTML.

**6. Excessive `console.log` in production (1700+ matches)**
Edge functions and client code contain extensive console logging including user IDs, operation details, and error messages. In edge functions this is acceptable (server-side logs), but client-side logs could leak information.

**Fix:** Audit client-side `console.log` calls and ensure the existing `logger` utility is used consistently with appropriate log levels.

---

### LOW Issues

**7. CORS set to `Access-Control-Allow-Origin: '*'` on all edge functions**
All edge functions use wildcard CORS. For authenticated endpoints, this should be restricted to the application's domain.

**8. CSP includes `'unsafe-inline'` and `'unsafe-eval'`**
The Content-Security-Policy in `vercel.json` and `_headers` allows `unsafe-inline` for scripts and `unsafe-eval`. While necessary for some frameworks, `unsafe-eval` significantly weakens XSS protection.

**9. `remember_email` stored in localStorage**
`src/pages/Auth.tsx:213` stores the user's email in localStorage when "Remember Me" is checked. This is minor but could be considered PII exposure on shared computers.

---

### What's Already Good
- RLS enabled on all tables with appropriate policies
- Admin roles stored in separate `user_roles` table (not on profiles)
- Server-side admin verification via `has_role()` RPC
- MFA enforcement for admin operations
- PII encryption with `validate_encrypted_fields` trigger
- Audit logging with tamper-proof policies (no delete/update)
- Security headers (HSTS, X-Frame-Options DENY, X-Content-Type-Options)
- Input validation in `test-recommendations` with sanitization
- Session timeout via `useIdleSessionTimeout`

---

### Recommended Priority Actions

1. **Add rate limiting to `quiz-recommendations` and `test-recommendations`** — these are public, unauthenticated, and call paid AI APIs
2. **Add auth/secret checks to scraper and data-write edge functions** — prevent external invocation
3. **Replace client-side lockout with server-side implementation**
4. **Fix `window.open()` calls missing security params** (4 files)
5. **Replace service role key comparison in `ai-test-mapper`** with a dedicated secret

