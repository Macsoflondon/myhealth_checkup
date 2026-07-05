## Change

Make the compare page full-bleed so the table spans the whole viewport instead of being capped by the default `container` (~1280px at `lg`+).

**File:** `src/pages/TestFinderComparePage.tsx` (line 41)

Swap the `<main>` wrapper from a centred container to a full-width one, keeping consistent horizontal padding:

```tsx
<main className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 sm:py-12">
```

That's the only change. The inner `grid-cols-[280px_1fr]` (filters sidebar + comparison area) and the `ComparisonTable`'s `1fr` columns will naturally expand to fill the new width, so the table extends across the full page.

Header, filters panel, colours, and card styles stay exactly as they are.