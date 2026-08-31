# Technical details

All changes are in `src/styles.css`:

1. **Tokens** — at `@media (min-width: 1024px)`, set `--page-inset: 2.5cm` (CSS physical unit, ~94.5px) and `--edge-fade: 0`. The `1536px` override (currently `3.5rem`) is removed so the inset stays a fixed 2.5cm at every desktop width. `--page-width` (`100vw − 2 × inset`) updates automatically, so `.full-bleed`, `.full-bleed-mobile`, `.page-surface` and `page-inset-x` all follow with no further edits.

2. **Border** — replace the gradient mask on `.page-surface-inner` with hard 1px navy lines at desktop widths: `border-inline: 1px solid #081129` (uses the existing `--color-brand-navy` token) applied under the `1024px` media query; the mask is disabled there. Below 1024px the current feathered mask (tablet) and full-width (mobile) behaviour is untouched.

3. **Structure check** — the surface wrapper in `src/layouts/MainLayout.tsx` already spans full height, so the lines run continuously down the page; the border goes on the inner surface so fixed overlays (cookie banner, comparison bar) are unaffected.

4. **Verification** — Playwright pass at 1440/820/390 widths: confirm the frame lines render on desktop, no horizontal scrollbar (`scrollWidth === clientWidth`), tablet/mobile unchanged.
