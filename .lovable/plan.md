## What's actually broken

I checked the database, the auth logs, and every role-check site in the codebase. Three real bugs, ranked by impact:

### Bug 1 — `/admin/login` silently signs out any non-admin who visits the page (highest impact)

`src/pages/AdminAuth.tsx` runs `verifyAndRedirect` inside a `useEffect` that fires whenever a `user` session exists — not only after a fresh admin sign-in attempt. If you (or any normal user) are already logged in and navigate to `/admin/login`, the effect:

1. Calls `has_role(user.id, 'admin')`.
2. Sees `false`.
3. Calls `supabase.auth.signOut()` and shows "Access denied".

The auth logs confirm this happened to `n_boy84@yahoo.com.au` (a `user`-role account): a `/logout` immediately after their `/token` login, followed by failed re-login attempts. That is the loop / "signs me out" symptom.

### Bug 2 — Admins are redirected to the wrong page after login

On successful admin verification, `AdminAuth` navigates to `/dashboard`, which is the regular user dashboard (`pages/Dashboard.tsx`), not an admin surface. There is no admin landing page wired up — admins have to know the `/admin/*` URLs by hand.

### Bug 3 — `useAdminMFA` swallows the 403 response from `verify-admin-mfa`

`supabase.functions.invoke` treats non-2xx (e.g. the 403 the edge function returns when an admin has no MFA or hasn't stepped up) as `fnError` and discards the JSON body. `useAdminMFA` then sets `error` and never populates `mfaStatus`, so `needsMFASetup` / `needsMFAVerification` stay `false` — meaning any UI that relies on those flags can hang or loop.

### Also worth knowing (not bugs, but confirmed)

- DB roles look correct: `support@myhealthcheckup.co.uk` has both `admin` and `user`; `n_boy84@yahoo.com.au` has `user`. The `handle_new_user_profile` trigger correctly grants `user` on signup.
- `has_role` SECURITY DEFINER function is correct and is what every server-side check uses (`AdminRoute`, `verify-admin-mfa`, `bulk-add-clinics`, `encryption-status`, `scrape-all-clinics`, `ai-test-mapper`, `indexnow-submit`). No table-driven role checks leak into RLS recursion.
- `useUserRole` is UI-only and is not used for authorisation — fine.

---

## Fix plan

### 1. `src/pages/AdminAuth.tsx`
- Split the "already signed-in" path from the "just submitted credentials" path.
  - On mount, if a session exists, call `has_role`. If admin → redirect to admin landing. If not admin → **just `navigate('/')`**, do **not** sign them out and do **not** show "Access denied".
  - Only call `signOut()` inside `handleAdminLogin` when the user-supplied admin credentials authenticate but the resulting account isn't an admin.
- Change the post-login redirect target from `/dashboard` to an admin landing route (proposal: `/admin/test-dashboard`, since that already exists and is the most general admin surface; open to a different choice — see Question below).

### 2. `src/hooks/useAdminMFA.ts`
- Stop relying on `fnError` to mean "fatal". When `fnError` is present, also try to read `data` (Supabase puts the parsed body there on 4xx for `functions.invoke`); if `data` has the `MFAVerificationResult` shape, treat it as the status, not as an error.
- If `data` is genuinely missing, set a clear `error` so dependent UI can render a retry instead of looping.

### 3. `src/components/auth/AdminRoute.tsx` (small hardening)
- Keep current behaviour but explicitly handle the "session expired mid-verify" case: if `user` becomes `null` while `isVerifying`, abort instead of falling through.

### 4. Quick edge-function audit (read-only verification, no code changes expected)
- Confirm all seven server-side `has_role`/`user_roles` call sites use the requesting user's JWT (not the service role's `auth.uid()`, which would always be `null`). I've already grepped them; will spot-check `run-all-scrapers` and `check-leaked-password-protection` since they query `user_roles` directly rather than via the RPC.

### 5. Optional clean-up (only if you want)
- De-duplicate `support@myhealthcheckup.co.uk`'s `user` row in `user_roles` so admins have exactly one role row. Harmless either way.

---

## One decision needed from you

**Where should a verified admin land after `/admin/login`?** Options:
1. `/admin/test-dashboard` (recommended — already exists, most general)
2. `/admin/scrapers`
3. A new `/admin` index page that lists every admin tool
4. Keep `/dashboard` (not recommended — it's the user dashboard)

Tell me which and I'll implement the three fixes above in one pass.