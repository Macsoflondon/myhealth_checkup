

## Reduce spacing in "Find a Clinic Near You" card

Decrease the gap between the description text and the buttons in the "Find a Clinic Near You" card by two lines. No other card will be touched.

### What will change

In `src/components/sections/PartnerShowcaseGrid.tsx`, change the bottom margin of the description paragraph in the "Find a Clinic Near You" card from `mb-8` to `mb-2`.

### Technical detail

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

Current (line ~113):
```tsx
<p className="text-base lg:text-lg text-white/70 leading-relaxed mb-8 max-w-md">
```

Updated:
```tsx
<p className="text-base lg:text-lg text-white/70 leading-relaxed mb-2 max-w-md">
```

Only this one class change. Nothing else is modified.

