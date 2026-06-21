## Move stat cards into the hero footer

**`src/components/sections/HeroMasthead.tsx`** — replace the bottom grid

Currently the hero's bottom row (lines 185–189) is `H2 + 2 paragraphs`. Replace the two paragraphs with the four shrunken stat cards (100% / 200+ / No GP / 60 sec). The "One price you can actually trust." headline stays.

- Grid becomes `md:grid-cols-[1.1fr_2fr]`: H2 on the left, a nested 4-column stat strip on the right.
- Stat card styling (shrunk to fit hero strip):
  - White rounded card, border + soft shadow (same tokens as StatsBand)
  - Icon chip 28×28 (down from 38×38), value `text-[18px]`, label `text-[11px]`
  - Padding `p-3`, gap `gap-2.5` between cards
- Add lucide-react imports (`ShieldCheck`, `FlaskConical`, `Stethoscope`, `Zap`) and a local `HERO_STATS` array mirroring the data from `StatsBand.tsx`.

**`src/components/sections/StatsBand.tsx`** — delete the original stat row

- Remove the `STATS` constant (lines 21–26).
- Remove the `<div className="grid grid-cols-2 md:grid-cols-4 ...">` block that renders them (lines 51–61).
- Leave the categories pill row and the dark "Why test privately" CTA panel untouched.
- Drop now-unused icon imports (`ShieldCheck`, `Zap`) from the lucide import — keep `FlaskConical`/`Stethoscope` since they're still used by `CATEGORIES`.

No other components touched. Verify hero still fits one viewport after the swap.
