## Goal
Add tasteful, varied scroll-triggered animations to the landing page (`src/pages/Index.tsx`) sections. No new libraries — reuse the existing `ScrollFadeIn` component and Tailwind animation utilities (`fade-in`, `scale-in`, `slide-in-right`, `hover-scale`) already defined in the project.

## Approach
Wrap each below-the-fold landing section in `ScrollFadeIn` with **staggered delays** and **varied directions/effects** so the page feels alive without being noisy. The two tickers (PromoTicker, TestCategoryTicker) are already animated and will be left alone.

## Animation map (Index.tsx sections)

| Section | Effect | Delay |
|---|---|---|
| `MissionSection` | Fade + rise | 0ms |
| `JourneySimplified` | Fade + rise | 100ms |
| `PartnersGrid` | Scale-in (subtle pop) | 0ms |
| `StartJourneySection` | Fade + rise | 150ms |
| Gradient divider | Slide-in from left (animated width) | 0ms |
| `PartnerShowcaseGrid` | Fade + rise | 100ms |
| `TestimonialCarousel` | Fade only (no translate — carousel already moves) | 0ms |
| `ClinicAndHelpSection` | Fade + rise | 100ms |
| `AccreditedProvidersBar` | Fade only | 0ms |
| `CallToAction` | Scale-in (emphasis) | 0ms |
| `TrustPlatformSection` | Fade + rise | 100ms |
| `ExpertQuotes` | Fade + rise | 150ms |

## Implementation details

1. **Extend `ScrollFadeIn`** with an optional `variant` prop: `"rise" | "scale" | "fade"` so we can vary effects without creating multiple components. Default stays `"rise"` (current behaviour) — fully backward-compatible.
2. **Edit `src/pages/Index.tsx`** to wrap each lazy section in `<ScrollFadeIn variant="..." delay={...}>`. Keep `Suspense` boundary intact.
3. **Hero & TestCategoryTicker**: untouched — above-the-fold needs to render instantly; ticker already animates.
4. **Gradient divider**: replace the static `<div>` with a small inline animated variant that scales horizontally on enter (`origin-left scale-x-0 → scale-x-100` over 800ms via the existing Tailwind transition utilities).
5. **Performance**: `ScrollFadeIn` already uses `IntersectionObserver` and unobserves after first reveal — no perf impact on scroll.
6. **Accessibility**: Animations are short (≤700ms) and translate distance is small (8px). No flashing. Safe for general use.

## Files to edit
- `src/components/common/ScrollFadeIn.tsx` — add `variant` prop (rise / scale / fade)
- `src/pages/Index.tsx` — wrap sections + animate the gradient divider

## Out of scope
- Hero internal animations (already polished)
- Tickers (already animated)
- Header / Footer
- Any other route

## Verification
- Visual check in preview at desktop (1537×980) and a mobile viewport
- Confirm sections fade in once on scroll and don't re-trigger
- Confirm no layout shift / no console errors