
The user wants two mobile-specific fixes in the Hero section:

1. **Popular Searches container (mobile)**: 
   - Show only 4 chips on mobile instead of 6 (still show all 6 on desktop)
   - Add top spacing so chips don't sit flush against the container edge

2. **CTA buttons "Find your test / Compare by symptom / Compare by goal"**:
   - Must always render as 3 buttons in a single row (currently `flex-wrap` lets them wrap or stack awkwardly on mobile)
   - Remove `flex-wrap` and tighten sizing so they fit on a single mobile row

## Approach

**File to edit**: `src/components/sections/Hero.tsx`

### Fix 1 — CTA row (always 3-in-a-line)
Current:
```
flex flex-row gap-2 sm:gap-3 justify-center items-center mb-4 sm:mb-6 flex-wrap
```
- Remove `flex-wrap`
- Reduce mobile padding (`px-2.5 py-1.5`) and font (`text-[11px]`) so all 3 fit on a 360px viewport
- Keep desktop sizing intact via `sm:` prefixes

### Fix 2 — Popular Searches (4 on mobile, 6 on desktop)
- Add a `sm:hidden` class to the last 2 chips (indexes 4, 5 → Advanced Well Woman / Advanced Well Man) so only the first 4 show on mobile
- Add `pt-1` (small top padding) to the chips wrapper so they breathe inside the container
- Keep the wrapper border styling already in place

### Implementation details
- Render chips with conditional class: `index >= 4 ? "hidden sm:inline-flex" : ""` appended
- CTA buttons: change wrapper to `flex flex-nowrap gap-1.5 sm:gap-3 justify-center items-center mb-4 sm:mb-6` and reduce mobile button padding from `px-3 py-2 text-xs` to `px-2.5 py-1.5 text-[11px]`

No other files affected. No data/logic changes — purely Tailwind class adjustments.
