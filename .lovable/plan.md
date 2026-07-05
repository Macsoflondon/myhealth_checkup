## Scope — Compare Tests page cleanup + global toolbar centering

### 1. Hide breadcrumb + accreditor bar on `/compare`
`src/layouts/MainLayout.tsx` currently always renders `AccreditedProvidersBar` (non-home) and `SiteBreadcrumb`. Add a route check for `/compare` so both are suppressed there.

- Compute `isCompare = pathname === "/compare"`.
- Wrap `<AccreditedProvidersBar />` render in `!isCompare`.
- Wrap `<SiteBreadcrumb />` render in `!isCompare`.
- Keep `BrowseByCategoryBar` visible.

Result on `/compare`: navy header → category toolbar → dark hero. No grey accreditation strip, no "Home / Compare Tests" line.

### 2. Center the category tabs globally in `BrowseByCategoryBar`
`src/components/layout/BrowseByCategoryBar.tsx` (desktop block, ~line 274 onward) currently stretches the pill strip with `flex-1`, which pushes the More button and Language/Account to the far right and leaves the pills left-aligned with a large empty gap.

Change the desktop layout so:
- Outer flex row uses `justify-center` (drop the compact-only conditional; make it the default).
- Pill strip drops `flex-1`, uses natural width with centered content (`gap-1.5 justify-center`), keeps overflow scroll for narrow widths.
- Left-side mask gradient becomes a two-sided fade so both edges fade when scrolling.
- Right cluster (Language + User) stays inline, still separated by the `border-l` divider, so the whole group (pills + More + language/account) is a single centered row.

No behavioural changes to mobile bar, sticky logic, or the "More" dropdown.

### Files touched
- `src/layouts/MainLayout.tsx`
- `src/components/layout/BrowseByCategoryBar.tsx`

### Not in scope
No changes to `AccreditedProvidersBar`, `SiteBreadcrumb`, hero, or card grid. No data/business-logic changes.
