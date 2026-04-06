

## Plan: Move Medichecks Logo Beside Video and Tighten Section

### What Changes

**File: `src/components/sections/PartnerShowcaseGrid.tsx`** (lines 94-127)

1. **Move logo beside video** — Replace the current stacked layout (logo on top, video below) with a side-by-side `flex` row on desktop:
   - Left: Medichecks logo (vertically centered)
   - Right: Video
   - On mobile: stack vertically (logo on top, video below)

2. **Tighten spacing** — Reduce vertical padding/margins around the Medichecks area:
   - Remove `mt-6 mb-4` from the container → use `mt-2 mb-2`
   - Remove `mb-4` from logo wrapper
   - Reduce `pt-1` on video wrapper → remove
   - Reduce `mt-6` on CTA → `mt-3`
   - Reduce grid `gap-12 lg:gap-16` → `gap-6 lg:gap-8` for the overall grid in this container

### Layout (desktop)
```text
┌──────────────────────────────────────────┐
│  [Medichecks Logo]  │  [Promo Video]     │
│                     │                    │
│         [View Medichecks profile]        │
└──────────────────────────────────────────┘
```

### No Other Changes
- GoodBody section, Find a Clinic, CTA, and all other sections remain untouched.

