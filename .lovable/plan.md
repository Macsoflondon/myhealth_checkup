Remove the "Accredited Providers We Compare" section that sits just above the footer on the homepage (/).

Changes to `src/pages/Index.tsx`:
- Delete the `<Suspense>` block (lines ~243-247) that renders `<AccreditedProvidersBar />` wrapped in `<ScrollFadeIn>`.
- Remove the now-unused `lazy(() => import(...AccreditedProvidersBar))` import at the top (line 27).

Scope:
- Homepage only. The `AccreditedProvidersBar` component file stays in place since other pages may still use it (will not delete the component).
