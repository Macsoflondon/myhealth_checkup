## Goal
Make the "Our Partners Most Popular Tests" h2 in `DreamHealthShowcase.tsx` visually match the surrounding "Our Featured Partner of the Month" h2 in `PartnerShowcaseGrid.tsx`.

## Current
```tsx
<h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight leading-[1.05] text-[#08122b] lg:text-6xl">
```

## Target (matches sibling)
```tsx
<h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#08122b] md:text-5xl">
```

## Changes
- Drop `lg:text-6xl` (sibling caps at `md:text-5xl`)
- Drop `tracking-tight` and `leading-[1.05]` (sibling uses default tracking/leading)
- Keep dark text colour since this section sits on white, not navy

Single-line edit in `src/components/sections/DreamHealthShowcase.tsx` (line 176).
