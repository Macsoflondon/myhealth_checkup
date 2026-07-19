## Scope

Two files, presentation only.

### 1. `src/components/sections/StatsBand.tsx` (image 2)

Remove both CTA buttons ("Find your test", "Compare tests") and their flex wrapper. Keep:
- The pearl `#F5F5F5` outer shell
- The navy `#081129` inner rounded card with turquoise + pink blob decorations
- The slogan "Your **health** is your greatest **asset.**" (turquoise "health", pink "asset.")

Centre the slogan horizontally and vertically now that it stands alone. Drop the `flex-wrap`/`justify-center sm:justify-end` layout — use a single centred block. Slightly reduce vertical padding since there's no CTA row.

### 2. `src/pages/Index.tsx` — Health Quiz section (lines 208–244)

Wrap the existing "Not sure which test you need?" block in the **same container styling as StatsBand** so both bands read as a matched pair on the page:

```text
<section> pearl F5F5F5 outer + soft shadow
  └── navy #081129 rounded-[22px] inner card
       ├── turquoise blob top-right, pink blob bottom-right (same positions as StatsBand)
       └── centred content:
             • AI-Powered pill (turquoise, unchanged treatment)
             • H2 "Not sure which test you need?"     → white text
             • Paragraph                                → white/70
             • "Take the Health Quiz" CTA              → keep turquoise gradient, navy text
             • Trust line (No account required • …)   → white/60
```

All copy, the `/find-test` link, icons (Brain, Shield, ArrowRight), Montserrat font, and semantic H2 remain unchanged. Only surface colours + wrapper markup change.

### Not changing

- `HeroMasthead`, `BrowseByCategoryBar`, `AccreditedProvidersBar` above it.
- `FinalCTA`, `StartJourneySection`, `Hero.tsx` (different components with unrelated CTAs).
- Routing, analytics, i18n copy.

### Technical notes

- Reuse the exact blob classes from StatsBand for visual continuity: `absolute -right-[50px] -top-[60px] w-[260px] h-[260px] rounded-full bg-[#22c0d4]/[0.12]` and `absolute right-[120px] -bottom-[110px] w-[240px] h-[240px] rounded-full bg-[#e70d69]/10`, with `overflow-hidden` on the inner card.
- Keep `rounded-[22px]` inner + `rounded-[28px]` outer to match StatsBand exactly.
- Trust icon/text colours shift from `text-[#081129]/50` → `text-white/60`; body copy `text-[#081129]/70` → `text-white/70`; heading `text-[#081129]` → `text-white`.
- CTA button gradient unchanged (turquoise → deeper turquoise, navy text) — reads well on navy.
