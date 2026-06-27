## Plan

### 1. Fix the admin MFA hand-off
- Update the admin MFA verification flow so that after a valid 6-digit authenticator code is accepted, the admin route immediately re-checks the current Supabase session/AAL state and renders the admin portal instead of staying on the verification card.
- Add a small fallback retry after MFA verification, because Supabase can take a moment to expose the upgraded `aal2` session to the edge-function check.
- Keep the admin route secure: no client-side bypasses, no localStorage admin flags, and no weakening of the server-side role/MFA checks.

### 2. Improve the stuck-state UX
- Disable the verify button while the MFA completion check is running.
- If the code is rejected or the session does not upgrade, show a clear toast/error instead of leaving the screen looking frozen.

### 3. Remove the old sticky toolbar from admin/auth pages
- Replace the remaining `Header` usage in `AdminAuth.tsx`, which currently renders the old `StickyCategoryBar`.
- Admin login/recovery/MFA pages should not show the old toolbar; normal non-home public pages should continue using the new `BrowseByCategoryBar` from `MainLayout`.

### 4. Confirm the new toolbar coverage
- Check route/layout usage so the new `BrowseByCategoryBar` remains sticky at the top of every non-home page that uses `MainLayout`.
- Leave the homepage exception intact.
- If any standalone public page is still importing `Header`/`StickyCategoryBar`, swap it to the new layout/bar pattern only where appropriate.

### 5. Verify
- Use Playwright against `/admin/login` and a protected admin route to confirm:
  - the old sticky toolbar is gone from admin login/MFA screens;
  - a protected admin route still requires MFA;
  - after MFA completion, the admin content can render once the server reports `aal2`;
  - the new browse toolbar appears on standard non-home pages and not on the homepage.