# Unify the hero design across every device

The mobile hero in the screenshot becomes the single design for phone, tablet and desktop. Desktop keeps the category toolbar; everything else moves behind the hamburger drawer.

## Target structure (all breakpoints)

```text
1. Category ticker strip (white, scrolling)
2. White brand bar: "myhealthcheckup" (navy + turquoise)
   + "YOUR HEALTH. YOUR CHOICE." + accent-line hamburger
3. Category toolbar (desktop/tablet only, hidden on mobile)
4. Hero image, square corners, edge to edge
5. Navy caption band with pink hairlines:
   "Your trusted platform for comparing private health and cancer screening tests."
6. Our clinical standards section (unchanged)
```

## Changes

**src/components/sections/HeroMasthead.tsx**
- Remove the navy masthead block: the large white/pink `myhealthcheckup` wordmark, the desktop `<h1>`, and the inline language switcher / user menu cluster.
- Let the white brand bar render at every width instead of `md:hidden`.
- Show the navy caption band at every width (currently `md:hidden`), full-bleed with the pink top and bottom hairlines exactly as on mobile.
- Hero section background/padding adjusted so the image sits flush under the toolbar with no navy dead space at any width.

**src/components/layout/BrowseByCategoryBar.tsx**
- Brand bar (wordmark + tagline + scroll colour swap) becomes breakpoint-agnostic; wordmark and tagline scale up slightly at `md`/`lg` while keeping the same proportions as the screenshot.
- Accent-line hamburger trigger shows on all widths, positioned top-right inside the brand bar rather than as a floating fixed button.
- Desktop pill toolbar stays exactly as it is today, below the brand bar in the hero and sticky on non-home pages.
- Language switcher and user menu move into the hamburger drawer only (they already live there), so they no longer appear inline on desktop.

**SEO**
- The tagline stays a styled non-heading. A visually hidden `<h1>` keeps "Compare private blood tests & health checks" on the homepage so the current heading signal is not lost.

## Verification

- Screenshot the homepage at 390px, 834px and 1440px and compare the section order and spacing against the uploaded reference.
- Confirm the toolbar is absent at 390px and present at 1440px, and that the hamburger opens the drawer at all three widths.
- Re-run the existing `tests/e2e/category-toolbar.spec.ts` expectations for sticky behaviour on non-home pages.
