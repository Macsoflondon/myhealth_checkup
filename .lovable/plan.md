## Problem

Two issues are blocking your admin login:

1. **`permission denied for function has_role`** — visible in the console at login time. The recent bulk GRANT migration that restored catalogue access did not re-grant `EXECUTE` on the `public.has_role()` function. Every admin gate (AdminRoute, AdminAuth, RLS policies on `user_roles` and other admin tables) calls `has_role()` — without EXECUTE for `authenticated`, every check fails and you get bounced back to `/`.
2. **MFA AAL2 requirement** — `has_role()` for the `admin` role also requires your session to be at AAL2 (MFA-verified). If your authenticator/recovery is lost, even fixing the grant won't get you in.

The auth logs also show you triggered two password-reset emails at 04:47 — those will work for the password, but not for MFA.

## Fix

### Step 1 — Restore function EXECUTE grants (migration)

```sql
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated, service_role;
-- Re-grant EXECUTE on every other SECURITY DEFINER helper that policies call,
-- in case the same migration stripped them:
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;
```

This unblocks the role check. After this, password-based sign-in to `/admin/login` will succeed up to the MFA gate.

### Step 2 — Recover MFA via the existing `/admin/recovery` page

You already have an `admin-recovery` edge function wired to the `ADMIN_RECOVERY_SECRET` Vault secret. It:
- resets your admin password,
- **clears all MFA factors** on your account,
- re-asserts the admin role row.

Flow:
1. Go to `/admin/recovery`.
2. Paste the `ADMIN_RECOVERY_SECRET` value (you control this — I can't read it). If you've lost it, I'll rotate it for you via `secrets--update_secret` and you set a new value.
3. Enter your admin email + a new 12+ char password.
4. Sign in at `/admin/login` with the new password — MFA enrolment screen appears fresh, re-enrol with your authenticator app.

### Step 3 — Verify

- Sign in, confirm console no longer shows `permission denied for function has_role`.
- Confirm `/control/overview` renders.
- Re-run security scan to ensure the broad function grant hasn't reopened a finding (it shouldn't — `has_role` is SECURITY DEFINER and only reads `user_roles`).

## What I need from you

Pick one:
- **A.** You still have `ADMIN_RECOVERY_SECRET` — I'll run Step 1, you do Step 2 yourself.
- **B.** You've lost it — I'll run Step 1 and rotate `ADMIN_RECOVERY_SECRET` (you'll enter a new value in the secure form), then you do Step 2.
