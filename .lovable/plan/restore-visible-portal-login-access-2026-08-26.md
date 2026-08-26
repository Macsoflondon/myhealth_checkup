# Restore visible portal login access

## Where the login currently lives (audit findings)

- **Customer sign-in** (`/auth`) works, but the only entry point is an **icon-only** pink User button rendered by `UserMenu` — and it is **only mounted in the desktop toolbar when `placement !== "hero"`** (`BrowseByCategoryBar.tsx` line 331–333). On the homepage hero placement it is hidden entirely, and on **mobile there is no sign-in affordance at all** (the hamburger drawer has Language, Test Categories and More sections only).
- **Admin login** (`/admin/login`, AdminAuth + MFA) exists and works, but is reachable only via two tiny text links ("Admin" · "Crux Control") at the bottom of the `/auth` sign-in form — and only in sign-in mode, not sign-up mode.
- The **footer has no login or portal links** at all.

So the portal login technically exists but is effectively invisible on mobile and on the homepage — this plan re-establishes it as a clearly labelled button.

## Changes

### 1. Labelled "Sign in" button in the toolbar — all placements, all devices
`src/components/layout/BrowseByCategoryBar.tsx` + `src/components/header/UserMenu.tsx`
- Remove the `placement !== "hero"` condition so the account control renders on the homepage hero toolbar too.
- Extend `UserMenu` with a `labelled` mode: signed-out shows a clear **"Sign in"** text button (pink border, navy text, matching existing pill styling) instead of the bare icon; signed-in keeps the dropdown (Dashboard, Sign out) with the user icon.
- Mobile: add a **"Sign in" / "My account"** entry at the top of the hamburger drawer (above the Language section), session-aware — signed-out links to `/auth`, signed-in shows Dashboard + Sign out.

### 2. Portal links in the footer
`src/components/layout/Footer.tsx`
- Add a discreet "Portals" line in the bottom legal row: **Sign in** (`/auth`) · **Admin login** (`/admin/login`) · **Crux Control** (`/control`), styled like the existing Legal Hub / Trust & Security links (small, white/78, pink hover) so it stays subtle but findable.

### 3. Keep admin links subtle
- The existing "Admin · Crux Control" links on `/auth` stay as-is; no prominent admin buttons anywhere public-facing (security posture unchanged — admin pages remain behind `AdminRoute` + MFA).

## Technical notes
- `UserMenu` already handles session state via `useAuth()`; this is presentation-only, no auth logic changes.
- All routes (`/auth`, `/admin/login`, `/control`, `/health-dashboard`) already exist — no new routes.
- Verify in preview: homepage hero toolbar, scrolled toolbar, mobile drawer, and footer all show the correct signed-out/signed-in states.
