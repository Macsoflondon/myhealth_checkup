## Rebuild `HeroSalesTestCard` teaser to match v3-v5

Replace the current teaser body inside `src/components/sections/HeroSalesTestCard.tsx` with the selected direction. Modal stays as-is.

### Card spec (280×150, fixed)
- White bg, `rounded-2xl`, border `border-slate-100`, layered shadow `0 30px 60px -15px rgba(0,0,0,.1), 0 0 0 1px rgba(0,0,0,.02)`.
- Top 3px accent bar in provider `brand.primary` with soft glow `0 2px 10px <primary>/30` (fallback `#22c0d4`).
- Decorative 1×6 rounded pill at `left-4 top-8` using `<primary>/20`.
- Faint radial-dot grid overlay (`opacity .03`, 8px), provider-colour dots.

### Content stack (padding `p-5`)
1. Provider name — Montserrat 8px, uppercase, `tracking-[0.25em]`, `text-slate-400`, bold. Uses `ad.provider` (formatted).
2. Test name — Montserrat 16px, `font-extrabold`, `text-[#0f172a]`, single line / `line-clamp-1`. Uses `ad.testName`.
3. Sub-row — pulsing 1.5px dot in `brand.primary` + 11px bold tag line in `brand.primary` (use `ad.tagline` or short descriptor; fallback to biomarker count / category).
4. Footer (mt-auto):
   - Price — Montserrat 18px, `font-black`, navy `#0f172a`. Uses `ad.price`.
   - CTA — skeuomorphic navy button, `rounded-xl`, `px-4 py-2`, gradient `from-[#1e293b] to-[#0f172a]`, text "View Details" 10px uppercase bold tracked, stacked shadow `0 5px 0 0 #020617, 0 8px 15px rgba(15,23,42,.35)`, hover lifts -1px, active presses +4px. Inner top hairline `border-t border-white/10`.

### Behaviour
- Whole card remains a `<button>` opening the existing details `Dialog` — no modal changes.
- Provider colour resolved via `getBranding(ad.provider).primary` with `#22c0d4` fallback, applied to: top bar bg + glow, decorative pill, sub-row dot + tagline text, dot-grid colour.
- Keep fixed `w-[280px] h-[150px]` so rotation doesn't shimmy.

### Out of scope
- No changes to `HeroMasthead.tsx`, modal contents, rotation logic, or data sources.
- No new fonts to install — Montserrat already loaded project-wide.
