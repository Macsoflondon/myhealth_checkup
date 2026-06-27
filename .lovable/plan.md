## Plan

The screenshot shows `/admin/recovery` is rendering the site’s generic **Access Denied** state instead of the recovery form. The route itself is intended to be public, so the most likely issue is a global guard/layout component treating `/admin/*` as protected.

### What I’ll change

1. **Find the guard producing the Access Denied screen**
   - Trace the exact component or wrapper that renders this message.
   - Confirm whether it is triggered by `/admin/recovery` because of a broad `/admin` path check.

2. **Explicitly allow public admin recovery routes**
   - Ensure `/admin/login` and `/admin/recovery` bypass any admin-only route blocking.
   - Keep `/admin/test-dashboard`, `/admin/test-upload`, `/control`, and all other admin operations protected by admin role + MFA.

3. **Improve recovery form error handling**
   - If the recovery Edge Function returns `401`, show a clear message such as: “Recovery secret is incorrect.”
   - Keep successful recovery behaviour unchanged: reset password, clear MFA factors, ensure admin role, then send you to `/admin/login`.

4. **Verify the flow**
   - Check `/admin/recovery` renders the recovery form when signed out.
   - Check protected admin pages still deny access unless signed in as admin.
   - Check `/admin/login` remains reachable.

### Technical notes

- No database schema change is needed.
- No security weakening: the recovery page can be public because the Edge Function still requires the server-side `ADMIN_RECOVERY_SECRET` before performing any action.