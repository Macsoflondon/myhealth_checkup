## Goal

Collapse the two separate dashboards into a single Health Dashboard. The "My Dashboard" page (saved tests, saved providers, orders, profile) becomes tabs inside the Health Dashboard, with **Profile** as one of those subsections.

## Changes

### 1. `src/components/dashboard/HealthDataHub.tsx`
Expand the existing `Tabs` from 3 tabs → 7 tabs:

- Overview (existing)
- Test Results (existing)
- Upload (existing)
- **Saved Tests** (new — favorites grid from `Dashboard.tsx`)
- **Saved Providers** (new — saved providers grid from `Dashboard.tsx`)
- **Orders** (new — order history list from `Dashboard.tsx`)
- **Profile** (new — renders `<ProfileSettings />`)

Move the favorites/orders/providers data fetching (`useDashboardData`, `useDraggable`) and the JSX blocks from `Dashboard.tsx` into `HealthDataHub.tsx` verbatim, wrapped in their respective `<TabsContent>`. Read `?tab=` from `useSearchParams` so existing deep-links like `/dashboard?tab=orders` keep working after redirect.

Tab list becomes responsive: 2 rows on mobile (`grid-cols-4` + wrap) or a horizontal scroll — match existing TabsList styling.

### 2. `src/pages/Dashboard.tsx`
Replace entire file with a redirect component:
```tsx
<Navigate to={`/health-dashboard${location.search}`} replace />
```
Preserves the `?tab=orders` query so `useOrders` and OAuth redirects still land in the right tab.

### 3. `src/pages/HealthDashboardPage.tsx`
- Update `<title>` and meta to "My Dashboard | myhealth checkup".
- Add canonical `https://www.myhealthcheckup.co.uk/health-dashboard`.

### 4. `src/components/header/UserMenu.tsx`
Change both `/dashboard` links → `/health-dashboard`. Single "Dashboard" entry (no separate Health Dashboard link if one exists).

### 5. Leave as-is (auto-handled by redirect)
- `src/pages/Auth.tsx` — `navigate("/dashboard")` after login still works via redirect.
- `src/hooks/useOrders.ts` — `/dashboard?tab=orders` works via redirect.
- `GoogleSignInButton.tsx` / `AppleSignInButton.tsx` — OAuth `redirectTo` works via redirect.
- `routes/authRoutes.tsx` — keep `/dashboard` route mapped to the new redirect component.

### 6. `src/pages/SitemapPage.tsx`
Update the "Dashboard" link path from `/dashboard` → `/health-dashboard`.

## Out of scope
- No DB changes.
- No changes to `ProfileSettings` itself — reused as-is.
- No restyling of cards; visual parity with current dashboards.
