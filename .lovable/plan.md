# Mobile hero: hamburger position + full-width caption band

Two mobile-only fixes on the homepage header/hero.

## 1. Move the floating menu button down

Today the three-line menu button is pinned to the very top-right corner, where it sits over the scrolling category ticker (as circled in the screenshot).

Change: pin it lower so it sits level with the "myhealthcheckup" wordmark row, clear of the ticker. It stays fixed while scrolling, keeps the same white circular styling, size and tap target, and remains the drawer trigger on every page.

## 2. Widen the navy caption band

The navy band holding "Your trusted platform for comparing private health and screening tests." currently stops short of the screen edges. Change: make it span the full viewport width edge to edge, with its pink top and bottom rules running the full width too, matching the hero image above it.

## Technical notes

- `src/components/layout/BrowseByCategoryBar.tsx`: change the floating trigger wrapper from `fixed top-4 right-4` to a lower offset (approx `top-16`) aligned with the mobile brand bar's wordmark line; keep `z-50` and `md:hidden`.
- `src/components/sections/HeroMasthead.tsx`: the mobile caption card (`absolute bottom-0 inset-x-0 ... border-y-2 border-[#e70d69]`) breaks out to viewport width via `w-screen left-1/2 -translate-x-1/2` so parent padding/border no longer insets it.
- Verify at 390x710 with a Playwright screenshot: button clears the ticker, band width equals viewport width.
