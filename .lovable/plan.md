## Cyber Essentials / CE+ audit and hardening

Scope: a code+config audit against the five CE controls (firewalls, secure configuration, security update management, user access control, malware protection) — with hardening edits where the codebase is the right place to fix, and a written `CYBER_ESSENTIALS.md` covering the operational/policy controls that live outside the code (insurance, asset register, BYOD, leavers process, etc. — required for the certification questionnaire).

### 1. Audit deliverable (new file)

`docs/CYBER_ESSENTIALS.md` — one row per CE+ control, with: status (Met / Met+ / Gap / Operational), where it lives in the repo, and what the user must fill in for the IASME questionnaire. Sections:

- Firewalls & boundary (Cloudflare / hosting, edge function CORS, Supabase network restrictions)
- Secure configuration (HTTP headers, CSP, Supabase auth settings, default-deny RLS)
- Security update management (Dependabot, weekly `bun audit`, edge runtime pinning)
- User access control (admin role table, AAL2/MFA enforcement, leaver process, least privilege)
- Malware protection (SaaS posture — N/A on server, EDR required on admin endpoints)
- Data protection extras that exceed CE+ (field-level encryption, audit log, leaked-password check, CSP reporting, idle timeout)

### 2. Code/config hardening (the gaps worth fixing now)

1. **CSP tightening** — current policy still allows `'unsafe-inline'` on `script-src`. Move to a hashed/nonce CSP via a Vite plugin that emits per-build script hashes, drop `'unsafe-inline'` from `script-src`. Keep `'unsafe-inline'` on `style-src` only (Tailwind/runtime styles). Add `require-trusted-types-for 'script'` in report-only.
2. **HSTS preload** — already 2y + preload; add note in audit doc to actually submit `myhealthcheckup.co.uk` to hstspreload.org.
3. **CSP reporting endpoint** — `/csp-report` is referenced but unverified. Add a lightweight edge function `csp-report` that ingests reports into `security_scan_snapshots` (or a new `csp_reports` table) with rate-limit + size cap, and wire `public/_headers` to route to it.
4. **Password policy** — bump `validatePassword` minimum to 12 chars (NCSC/CE recommendation), keep complexity, and surface leaked-password check on signup via the existing `check-leaked-password-protection` flow.
5. **MFA for all users (not just admins)** — add an opt-in TOTP enrollment screen in the user dashboard. Keep AAL2 mandatory for admin (already enforced in `has_role`).
6. **Account lockout / brute-force** — add a server-side counter (extend `api_rate_limits` with `endpoint='auth:signin'` + per-IP+email key) hit from a new `auth-throttle` edge function called before `signInWithPassword`. Lock for 15 min after 10 failed attempts.
7. **Session controls** — idle timeout exists (30 min). Add absolute session cap (12h) by forcing re-auth in `useIdleSessionTimeout` after a hard deadline stored in localStorage.
8. **Edge function review** — audit `verify_jwt = false` functions; for any that don't legitimately need anon access (e.g. `send-test-notification` is already true; double-check `health-ai-analysis`, `sports-test-recommendations`, scrapers should be cron-only). Add per-function rate limits using the same `api_rate_limits` pattern the translate fix used.
9. **Supabase linter sweep** — run `supabase--linter` and fix any new findings (security definer views, missing RLS, exposed columns).
10. **Dependency posture** — add `.github/dependabot.yml` (weekly npm + GitHub Actions), and a `scripts/audit.sh` that runs `bun audit --prod` and exits non-zero on high/critical so it can gate CI later.
11. **Secret hygiene** — add a `scripts/check-secrets.sh` using a regex set (Supabase service-role JWT pattern, OpenAI `sk-`, generic `eyJ…`) that scans `src/`, `public/`, and committed JSON for accidental leakage.
12. **Trust page link** — add a link to `/trust` from the footer so the audit/CE statement is discoverable (CE+ assessors look for a public security contact).
13. **security.txt** — already present at `/.well-known/security.txt`; audit doc should reference it.

### 3. What stays operational (called out in the doc, not coded)

These are required to pass the assessor questionnaire and cannot be solved in the repo:

- Asset register (laptops, phones, admin accounts)
- BYOD policy + auto-update enforcement on admin endpoints
- AV / EDR on every device that logs into the admin dashboard
- Joiner/Mover/Leaver process with revocation SLA
- Patch SLA (14 days for critical OS/browser updates)
- Backup + restore test schedule for the Supabase project
- Incident response runbook + named contact
- Annual penetration test (required for CE+ at higher tiers, optional otherwise)
- Cyber liability insurance (bundled with IASME certification)

### Technical notes

- CSP nonces in a SPA need either SSR or a build-time script-hash injector. Cheapest path: `vite-plugin-csp-guard` (or a 30-line custom plugin) that hashes every emitted `<script>` and writes the list into `public/_headers` at build time. Cloudflare Pages serves `_headers` per request.
- Brute-force counter must key on `lower(email) + ip` to avoid letting attackers lock out victims by guessing email only; respond with the same generic error regardless of lock state.
- TOTP MFA uses Supabase's native `auth.mfa.enroll()` / `challenge()` / `verify()` — no schema changes needed, just UI + a guard hook.
- `csp-report` endpoint must accept both `application/csp-report` and `application/reports+json` content types and never reflect input back.

### Out of scope unless asked

- WAF rules (Cloudflare dashboard, not code)
- Backup automation (Supabase managed)
- DAST / pentest tooling
- SSO/SAML for admins
