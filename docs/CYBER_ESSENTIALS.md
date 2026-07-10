# Cyber Essentials & Cyber Essentials Plus — Audit

**Scope:** myhealth checkup web application (this repository) and its Lovable
Cloud / Supabase backend, accessed by admins and end-users over HTTPS.

**Boundary owner:** MYHEALTHCHECKUP LTD.

**Hosting:** Lovable Cloud (Cloudflare Pages frontend, Supabase EU PostgreSQL +
Edge Functions backend, Resend for transactional email, Lovable AI Gateway for
model calls).

**Status legend:** Met = baseline CE control satisfied · Met+ = exceeds CE+
requirements · Op = operational control, outside the repo · Gap = open work.

---

## 1. Firewalls and internet gateways

| Control | Status | Where / how |
|---|---|---|
| Boundary firewall on all internet-facing servers | Met | Cloudflare in front of Pages; Supabase managed perimeter. |
| Default-deny inbound, explicit allow-list | Met | Edge functions enforce per-function CORS; database access only via PostgREST/edge with JWT. |
| Admin access not exposed to the open internet without MFA | Met+ | `/admin/*` is noindex (`public/robots.txt`) and `has_role()` requires AAL2 (MFA-verified session) — see `supabase/migrations` and `src/components/auth/AdminRoute.tsx`. |
| Personal firewall on every user device with internet access | Op | macOS/Windows built-in firewall on all admin endpoints (laptops, phones). Confirm enabled in MDM or device policy. |
| Unused services disabled | Met | Project ships only the edge functions in `supabase/functions/`. No SSH, no open DB ports — Supabase manages this. |
| Inbound rules reviewed | Op | Quarterly review of Cloudflare WAF rules and Supabase IP allow-lists. |

---

## 2. Secure configuration

| Control | Status | Where / how |
|---|---|---|
| Remove or change default credentials | Met | No vendor defaults shipped. Supabase service-role key is rotated via Lovable secrets. |
| Disable unnecessary user accounts | Op | Quarterly review of `user_roles` table; remove orphaned admin grants. |
| HTTP security headers | Met+ | `public/_headers`: HSTS 2y + preload, X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locked down (no geo/camera/mic/payment), COOP/CORP set. |
| Content Security Policy | Met+ | `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`, CSP reporting wired to `/csp-report` (see `supabase/functions/csp-report`). Known residual: `'unsafe-inline'` on `script-src` (Lovable preview shim + inline GA loader) — tracked for hashed-script migration. |
| TLS everywhere | Met+ | HTTPS only, HSTS with `includeSubDomains; preload`. Submit apex to https://hstspreload.org after launch. |
| Auto-lock / idle timeout | Met+ | 30-min idle timeout (`src/hooks/useIdleSessionTimeout.ts`) plus a 12-hour absolute session cap. |
| Password policy (length + complexity + breach check) | Met+ | 12-char minimum + complexity (`src/lib/passwordValidation.ts`); HaveIBeenPwned check on sign-up via the Supabase leaked-password protection. |
| MFA for privileged users | Met+ | `has_role()` denies admin unless `auth.jwt() ->> 'aal' = 'aal2'`. Admin recovery flow re-enrols MFA. |
| MFA available for all users | Met+ | Supabase TOTP `auth.mfa.enroll()` available in the user dashboard. |
| Account lockout / brute-force protection | Met+ | `supabase/functions/auth-throttle` rate-limits sign-in by `lower(email)+ip` (10 attempts / 15 min). |
| Default-deny database access | Met+ | RLS enabled on every public table; `public.has_role()` is the only path to admin-only rows. Row-level audit logging on sensitive tables (`audit_logs`). |
| Field-level encryption for PII | Met+ | `validate_encrypted_fields()` trigger rejects plaintext `phone_number`, `emergency_contact_*`, `address_*`, `postal_code`, `date_of_birth`. |
| Removable-media controls | Op | Disable USB mass storage on admin laptops via MDM. |

---

## 3. Security update management

| Control | Status | Where / how |
|---|---|---|
| Licensed and supported software | Met | All dependencies in `package.json` are current LTS / latest minor. Supabase + Lovable managed runtimes are always current. |
| Automatic updates enabled | Met+ | `.github/dependabot.yml` raises weekly PRs for npm, GitHub Actions, and Supabase Edge Function deps. |
| Critical patches applied within 14 days | Op | Team SLA. Track via the Dependabot dashboard; merge security PRs first. |
| Dependency vulnerability scanning | Met+ | `scripts/audit.sh` runs `bun audit --prod` and exits non-zero on high/critical. Hook into CI for hard gating. |
| Patch the OS / browsers on admin devices | Op | Auto-update on every device that logs into `/admin`. MDM policy required for CE+ assessor. |

---

## 4. User access control

| Control | Status | Where / how |
|---|---|---|
| Unique account per user | Met | Supabase auth: one identity per email. |
| Role-based access | Met+ | `public.user_roles` + `app_role` enum (`admin`, `moderator`, `user`). Never on `user_profiles`. |
| Admin accounts only used for admin tasks | Op | Admins should hold a separate account from any general/test account. Document in starter pack. |
| Least privilege | Met+ | Every public table has explicit `GRANT` per role; `anon` is dropped wherever policies require `auth.uid()`. |
| MFA on admin accounts | Met+ | Enforced server-side in `has_role()` (AAL2). |
| Revoke access on leave | Op | Joiner/Mover/Leaver runbook: remove from `user_roles`, rotate any shared secrets, revoke OAuth tokens within 1 working day. |
| Audit trail of privileged actions | Met+ | `role_audit_log` (role grants/revokes), `protected_call_log` (sensitive edge calls), `audit_logs` (data access). |
| Password storage | Met | Managed by Supabase Auth (bcrypt). No password reaches our code. |
| Session controls | Met+ | Idle (30 min) + absolute (12 h) timeouts; Supabase refresh-token rotation enabled. |

---

## 5. Malware protection

| Control | Status | Where / how |
|---|---|---|
| Anti-malware on every device | Op | EDR (e.g. Defender for Business, CrowdStrike, SentinelOne) on all admin laptops. Required for CE+ assessor visit. |
| Application allow-listing or sandboxing | Op | macOS Gatekeeper / Windows SmartScreen enforced on admin endpoints. |
| Block known-bad downloads | Op | Browser-level protections + corporate DNS filtering recommended. |
| Server malware posture | N/A | Managed Cloudflare Pages + Supabase runtimes; no user uploads executed server-side. User-uploaded files go to a private Storage bucket (`test-results`) with RLS and are never executed. |

---

## Extras that exceed CE+

- CSP reporting endpoint with rate limiting (`supabase/functions/csp-report`).
- Field-level encryption trigger that hard-fails plaintext PII writes.
- Per-IP rate limiting on all anonymous AI endpoints (`api_rate_limits`).
- Audit log retention: 90 days for protected calls, 365 days for role changes.
- Trust Centre at `/trust` and a published `/.well-known/security.txt`.
- Automatic burst-denial alerts via `detect_protected_call_abuse()` trigger.
- Sanitisation triggers that scrub bearer tokens / API keys from any error
  message before storage (`sanitize_scraping_job_error`,
  `sanitize_protected_call_log`).

---

## Operational checklist (the CE+ questionnaire will ask)

1. Asset register — every device that accesses admin or production.
2. BYOD policy with the same controls as company devices.
3. Joiner / Mover / Leaver SOP with 1-working-day SLA.
4. Patch SLA: 14 days for critical, 30 days for high.
5. Backup + quarterly restore test for the Supabase project.
6. Incident response runbook with a named on-call contact.
7. Annual penetration test (recommended for CE+ Trustmark renewal).
8. Cyber liability insurance (bundled by IASME at certification).
9. Submit apex domain to https://hstspreload.org.
10. Confirm Cloudflare WAF managed rules are active and OWASP Core Rule Set is on.

---

## Where to look in the repo

- Headers / CSP: `public/_headers`
- Auth context + session: `src/context/AuthContext.tsx`, `src/hooks/useIdleSessionTimeout.ts`
- Admin guard: `src/components/auth/AdminRoute.tsx`
- Password policy: `src/lib/passwordValidation.ts`
- MFA enrolment UI: `src/components/auth/MfaEnrollment.tsx`
- Brute-force throttle: `supabase/functions/auth-throttle/index.ts`
- CSP report sink: `supabase/functions/csp-report/index.ts`
- Role + audit: `public.user_roles`, `public.role_audit_log`, `public.audit_logs`
- Dependency hygiene: `.github/dependabot.yml`, `scripts/audit.sh`, `scripts/check-secrets.sh`
- Public trust page: `src/pages/TrustCentrePage.tsx` (`/trust`)
- Security contact: `public/.well-known/security.txt`
