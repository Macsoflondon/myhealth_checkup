## Plan

Swap the two bars directly below the hero in `src/pages/Index.tsx`:

- Move `BrowseByCategoryBar` (Most Popular Tests toolbar) to sit directly under `<HeroMasthead />`.
- Move `AccreditedProvidersBar` (trust standards carousel) to sit below the category toolbar.

### Change (Index.tsx, lines ~199–205)
```tsx
<BrowseByCategoryBar compact placement="hero" />

<Suspense fallback={<SectionFallback />}>
  <AccreditedProvidersBar />
</Suspense>
```

No styling changes; both components keep their current appearance. Verify visually at mobile and desktop.