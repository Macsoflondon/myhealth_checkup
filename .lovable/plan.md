## Goal

1. Make the Hero background images visibly taller so the turquoise→pink→turquoise tricolour border (which sits at the bottom of the `TestCategoryTicker` directly below the Hero) reads as flush against the bottom of the viewport on a typical desktop page load.
2. Diagnose and fix the bottom **Testimonials carousel** ("What Our Users Say"), which is currently not animating reliably.

Scope is limited to two files. No other sections, copy, colours, or behaviours change.

---

## 1. Hero — increase vertical height

**File:** `src/components/sections/Hero.tsx` (lines 112 and 122)

The hero's height is driven by its inner padding plus the headline block's `min-h`. Today:

- Outer padding: `pt-10 pb-16 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28`
- Headline min-height: `min-h-[90px] sm:min-h-[120px] md:min-h-[140px]`

Add roughly 3–4 text-lines of vertical room (≈ 120–160px on desktop) by bumping both:

- Padding → `pt-16 pb-28 sm:pt-24 sm:pb-36 md:pt-32 md:pb-44 lg:pt-36 lg:pb-52`
- Headline min-height → `min-h-[140px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[260px]`

This stretches the absolutely-positioned background images (which are `inset-0 w-full h-full object-cover`) along with the section, so the imagery fills the screen down to where the tricolour line of the ticker beneath it sits — appearing flush with the fold on a standard 1080p / 1161-px viewport. Mobile values are kept modest to avoid pushing the search bar off-screen on small devices.

No changes to image sources, `objectPosition`, slide rotation logic, search bar, CTAs, or trust-signals strip.

## Files to be modified

- `src/components/sections/Hero.tsx` — padding + headline min-height tweaks only.

## Risks

- Taller hero pushes the trust-signals strip slightly further down; acceptable, that strip stays directly under the ticker. If on smaller laptops (≈ 800px tall) the search bar feels cramped, we can dial the `lg:` padding back — easy to iterate.