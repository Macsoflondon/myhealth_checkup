## Shrink hero sales card to a compact teaser

Replace the current full overlay card on the hero with a small teaser (~110–130px wide, roughly a quarter of current footprint) showing only the essentials.

### Changes

**`src/components/sections/HeroSalesTestCard.tsx`** — rewrite as compact teaser:
- Width: `w-[clamp(150px,11vw,180px)]` (~quarter of current ~460px max)
- Vertical stack, rounded-xl, white bg, navy top accent bar
- Content (top to bottom):
  - Provider name (tiny uppercase turquoise, 8px)
  - Test name (11px bold navy, 2-line clamp)
  - Price (£XX.XX, 16px black pink)
  - Single full-width "View test" pink pill button (10px) → links to `ad.url`
- Drop: collection options, accreditation badges, disclaimer, Compare button, 3-metric strip, provider logo image
- Keep positioning: `absolute right-4 bottom-4 sm:right-6 sm:bottom-6`, `hidden md:flex`

**No changes to `HeroMasthead.tsx`** — same component slot, same props.

### Rationale
At ¼ size the full card content would be illegible. Teaser preserves the sales hook (test, price, CTA) without competing with the hero imagery or slide label bubble.
