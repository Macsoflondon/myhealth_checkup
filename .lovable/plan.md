

## Investigation: Back to Top Button

The `BackToTop` component **is already rendered globally** in `App.tsx` (line 42), so it should appear on every page. The component works by showing a floating button after scrolling 500px.

**Why you may not see it:** The cookie consent banner sits at `fixed bottom-0 z-50` and spans the full width of the screen bottom, which covers the back-to-top button (also `z-50 bottom-8 right-8`). Once you accept/dismiss cookies, the button should appear when you scroll.

### Fix

1. **Raise z-index** of the BackToTop button from `z-50` to `z-[60]` so it always floats above the cookie banner.
2. **Adjust bottom offset** when cookie banner is visible — or simply rely on the higher z-index since the button is `bottom-8 right-8` (32px from edge) and won't be fully hidden, just overlapped.

**File:** `src/components/common/BackToTop.tsx` — change `z-50` to `z-[60]` on the Button className.

One line change, one file.

