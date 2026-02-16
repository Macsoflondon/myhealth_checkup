
## Restyle "Our Featured Partners of the Month" Section

The goal is to make the `PartnerShowcaseGrid` header area match the `TrustPlatformSection` visual style from the screenshot. This means adopting:

1. **The "WHY TRUST US"-style label** -- a small uppercase turquoise label flanked by horizontal lines
2. **The sharp two-part heading** -- white leading text + gradient accent text on one line
3. **Subtitle text** -- a muted white description line beneath the heading
4. **Decorative half-circle background elements** -- large, semi-transparent turquoise/pink circles clipped at the edges

### Changes (single file: `src/components/sections/PartnerShowcaseGrid.tsx`)

**Header redesign:**
- Replace the current `SectionHeading` with a custom header block matching `TrustPlatformSection`:
  - Add a turquoise uppercase label with flanking lines (e.g. "FEATURED PARTNERS")
  - Two-part heading: "Our Featured Partners of" in white + "the Month" in gradient
  - Add a subtitle line in white/60 opacity
- Add spacing/margin below the header to match the Trust section's rhythm

**Background decorations:**
- Add `relative overflow-hidden` to the section wrapper (already has navy bg)
- Insert two absolutely-positioned decorative half-circles:
  - A large turquoise/5 circle on the left, translated 50% off-screen
  - A smaller pink/5 circle on the upper-right, translated partially off-screen
- Add the bottom gradient line (turquoise-via-pink-to-turquoise) matching the Trust section

### Technical Details

- Remove the `SectionHeading` import since we will use a bespoke header matching the Trust section pattern
- Copy the exact decorative element markup from `TrustPlatformSection` (the `absolute` divs with `bg-brand-turquoise/5` and `bg-brand-pink/5`)
- Copy the bottom gradient line (`h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise`)
- Wrap the container content in `relative` so it layers above the decorative circles
- Keep all card content and grid layout unchanged
