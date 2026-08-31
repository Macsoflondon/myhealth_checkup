# Unify "Popular tests this week" section header styling

## Goal
Make the H2 header in `src/components/sections/HeroPopularTests.tsx` match the established section-divider pattern used by "Simple Process" (`JourneySimplified.tsx`) and "Live Comparison" (`LiveComparisonCard.tsx`).

## Current state
`HeroPopularTests.tsx` renders a plain centred H2:

```tsx
<h2 className="font-[Montserrat] font-bold text-2xl sm:text-3xl text-[#081129] tracking-tight">
  Popular tests this week
</h2>
<p className="mt-2 text-sm sm:text-base text-brand-navy max-w-2xl mx-auto">
  Trending private blood tests and health screens chosen by our visitors.
</p>
```

## Target pattern
Every other major section uses:
1. Eyebrow label in uppercase turquoise, flanked by pink horizontal rules.
2. `SectionHeading` with a navy title + turquoise-to-pink gradient continuation.
3. Subtitle paragraph below.

Example from `JourneySimplified.tsx`:

```text
—— SIMPLE PROCESS ——
From search to results in four steps.
No account required...
```

## Proposed change
Update `HeroPopularTests.tsx` to:
- Add eyebrow text "POPULAR THIS WEEK" (or similar short uppercase label) with pink rule lines.
- Replace the plain `<h2>` with `<SectionHeading title="Popular tests" gradientText="this week" />`.
- Keep the existing subtitle copy, adjusting top margin to match the tighter subtitle spacing used elsewhere.
- Preserve the white background, container, and card grid unchanged.

## Files to edit
- `src/components/sections/HeroPopularTests.tsx`

## Verification
- Visual regression check: the new header should look identical in structure to "Simple Process" and "Live Comparison" headers.
- Confirm no layout shift in the card grid below.
