## Merge slogan into Health Quiz card, restructure layout

Combine the standalone "Your health is your greatest asset" band into the navy Health Quiz card and reflow its contents into a two-column layout on desktop.

### 1. `src/pages/Index.tsx` — Health Quiz section

New structure inside the existing navy `#081129` rounded card (same pearl shell, same blob decorations, same padding tokens):

```text
[ Slogan — "Your health is your greatest asset." ]         ← full width, centred, top
                    (thin divider / spacing)
              [ AI-POWERED pill ]                           ← centred
                                                           
[ LEFT COLUMN            ]     [ RIGHT COLUMN            ]
  H2 "Not sure which             CTA "Take the Health Quiz"
      test you need?"            Trust line: No account · 2 min · free
  Description paragraph
```

- Slogan: reuse StatsBand's exact heading markup — `font-extrabold clamp(1.9rem,7.5vw,3rem) tracking-[-0.02em] leading-[1.15] font-[Montserrat]`, white text, turquoise "health", pink "asset.", centred, max-w-4xl.
- AI-POWERED pill: unchanged treatment, centred below slogan with `mb-8`.
- Two-column row: `grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center` inside `max-w-5xl mx-auto`.
  - Left: H2 (`text-left lg:text-left`, keep existing size/font) + paragraph (`text-white/70`, left-aligned on lg, centred on mobile).
  - Right: CTA button + trust line stacked, `flex flex-col items-center lg:items-end gap-6`.
- Mobile (< lg): everything stacks and centres — slogan, pill, heading, paragraph, CTA, trust line — preserving current mobile feel.
- Bump inner card vertical padding slightly to accommodate the added slogan row (`py-14 sm:py-[72px]`).

### 2. `src/components/sections/StatsBand.tsx` and `Index.tsx` StatsBand usage

Remove the standalone StatsBand render from `Index.tsx` (the slogan now lives inside the quiz card). Delete `StatsBand.tsx` and its import.

### Not changing

- Hero, category toolbar, trust carousel above.
- Any copy, links (`/find-test`), icons (Brain, Shield, ArrowRight), analytics.
- Card surface colours, blob positions, rounded radii, shadows.

### Technical notes

- Keep the H2 as an `<h2>` for semantic order (slogan renders as a visual `<p>` styled like a heading, or promote it and demote current H2 — recommend keeping slogan as a decorative `<p className="...heading-styles...">` since the section's semantic heading is the actionable "Not sure which test you need?").
- Preserve `text-white`, `text-white/70`, `text-white/60` token usage; no new colours introduced.
- Trust line: keep the `•` separators and Shield icon inline; on lg right-align via `justify-end`.
