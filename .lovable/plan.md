

## Enlarge the category pill (4× current size)

The "Fertility & Prenatal" capsule (and the equivalent on every category page — "Wellness", "Heart Health", etc.) is rendered by `CategoryStandardHero.tsx`. One change there cascades to every category page automatically.

### Current dimensions
- Padding: `6px 18px`
- Text: `11px / weight 700 / 0.12em tracking`
- Status dot: `6 × 6px` with `8px` glow
- Gap: `8px`

### New dimensions (≈ 4× visual scale)

| Property | Now | New |
|---|---|---|
| Padding | 6px 18px | **24px 72px** |
| Border radius | 100 | **100** (keep capsule) |
| Border width | 1px | **2px** |
| Font size | 11px | **44px** |
| Letter spacing | 0.12em | **0.14em** |
| Status dot | 6×6 | **24×24** with 32px glow |
| Gap | 8px | **24px** |
| Section `marginBottom` | 40px | **56px** (extra breathing room) |

### Mobile responsiveness
Because the pill now contains text up to ~44px, on narrow viewports (<640px) it would overflow. I'll use Tailwind classes (`text-2xl sm:text-3xl md:text-[44px]`, `px-6 sm:px-12 md:px-[72px]`, `py-3 sm:py-5 md:py-6`) so the capsule scales fluidly:
- 320–640px: ~24px text, padding 12px 24px
- 640–1024px: ~30px text, padding 20px 48px
- 1024px+: full 44px text, padding 24px 72px

This keeps the 4× target on desktop while staying readable on mobile per the platform's mobile-first standard.

### Files to edit
- `src/components/category/CategoryStandardHero.tsx` — convert the pill's inline styles to Tailwind classes for the responsive sizing, bump the dot, padding, font, and gap as above.

No other files affected. Pages that consume this component (Fertility, Wellness, Heart Health, Hormones, Thyroid, Diabetes, Sports-Fitness, Cancer, Men's/Women's Health, etc.) update automatically.

### Tip
For instant visual tweaks like resizing, recolouring, or rewording static elements, use **Visual Edits** (pencil icon, bottom-left of chat). It's free for direct edits and faster than a prompt round-trip.

Approve to apply.

