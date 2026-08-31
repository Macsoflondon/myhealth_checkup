# Fix: Goodbody "Featured Partner of the Month" hover preview card unreadable on mobile

## Root cause

In `src/components/sections/FeaturedPartnerWheel.tsx`, the hover preview card (lines 366–384) is a fixed three-column flex row: mini kit face (88px) + centre text + right-hand price column (`flex: none`). On phones the card is capped at 92% of a ~390px viewport, so after the kit face and the non-wrapping price column take their share, the centre text column (`minWidth: 0`) collapses to ~40px — the "about" paragraph renders one word per line and overlays the wheel behind it, exactly as in the screenshot.

On touch devices there's a second issue: tapping a card fires `onMouseEnter`, so this broken preview pops up at all (it was designed as a desktop hover affordance).

## Changes (single file: `src/components/sections/FeaturedPartnerWheel.tsx`)

1. **Make the preview card responsive.** Replace the pure inline-style layout with a small injected `<style>` block (classes `.gbp-preview`, `.gbp-face`, `.gbp-text`, `.gbp-side`) plus a `@media (max-width: 640px)` rule that:
   - switches the card to a stacked layout (`flex-direction: column`),
   - hides the 88px mini kit face (the tapped card is already visible behind it),
   - moves the price/biomarkers/"Click to view" into a full-width row with the left border removed and a top hairline instead,
   - lets the "about" paragraph use the full card width with normal wrapping.
2. **Suppress the hover preview on touch devices.** Gate `setHovered` on `window.matchMedia('(hover: hover)').matches` so a tap goes straight to the info modal (which already stacks correctly) instead of flashing the preview.
3. Keep desktop behaviour pixel-identical — the media query and hover gate only affect ≤640px / touch.

## Verification

- Playwright at 390×844 (iPhone) and 1280 desktop: tap/hover the centred Goodbody card, confirm the preview is readable (stacked, full-width text) on mobile and unchanged on desktop; confirm tap opens the info modal on mobile.
- Screenshots reviewed for both breakpoints.
