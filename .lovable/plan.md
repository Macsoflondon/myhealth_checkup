## Rebuild the hero featured-test card ("Premium feature" direction)

Replace the tiny 210×120 hero-corner card with a full editorial featured-test card at ~630×480, floating bottom-right over the hero image.

### Scope (frontend/presentation only)

Single file: `src/components/sections/HeroSalesTestCard.tsx`

- Redesign the visible button/card to match the selected `v3` prototype:
  - Pearl `#F5F5F5` surface, 40px radius, deep soft shadow, white 1px border.
  - Top 2px turquoise → pink → turquoise gradient accent.
  - Header row: provider logo tile (56px, white rounded 2xl, using `ad.providerLogo`), provider name (Montserrat uppercase), rating (from `providerBranding`/registry), UKAS/CQC chip. Right side: "Featured Test" pink pill.
  - Category eyebrow (turquoise, tracked), test name as `h3` (Montserrat, 4xl, extrabold, navy), short description line.
  - Biomarker chip row: up to 4 marker chips + a `+N biomarkers` turquoise chip (fed from `ad.markers` / biomarker count when available; graceful fallback when missing).
  - Meta row: 3 icon+label pairs (Analysis, Results, Collection) using turquoise circle icons.
  - Footer: price block (`from £X.XX` label + big pink `£X.XX`), Compare (outline navy) + View Test (solid navy) buttons.
- Keep it a `<button>` that opens the existing `Dialog`. Preserve current modal contents and behavior unchanged.
- Position: `absolute right-4 bottom-4 sm:right-6 sm:bottom-6`, `w-[min(92vw,630px)]`, hidden on `md:` breakpoint stays desktop-only (`hidden md:flex`), same as today.
- Use existing brand tokens/colors already in file (NAVY, TURQUOISE, PINK). Keep `providerColor` from `getBranding` for the eyebrow tint.
- No changes to `HeroMasthead.tsx`, no changes to data shape (`HeroSalesAd` unchanged; extend with optional `markers?: string[]` / `biomarkerCount?: number` / `rating?: number` only if trivial — otherwise render sensible defaults).
- Strip prototype's mock strikethrough price and "Provider Direct Price" copy; use "from" label per brand convention (compliance: no fake discounts).
- Accessibility: keep `aria-label`, `h3` for test name, decorative SVGs `aria-hidden`.

### Verify

- `bun run build` + `tsgo --noEmit`.
- Playwright screenshot of `/` at desktop viewport to confirm placement over hero, then open modal to confirm dialog still renders.

No backend, routing, or data-layer changes.
