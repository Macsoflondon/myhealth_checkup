

## Reduce spacing between tab buttons and filmstrip gallery

The gap between the tabs and the image containers comes from two sources:

1. **The content wrapper** (`h-[80vh] flex items-center justify-center`) vertically centers the gallery in 80% of the viewport, pushing it away from the tabs.
2. **The header padding** (`pb-2`) adds minor bottom spacing.

### Changes

**`src/pages/GoodbodyClinicPage.tsx`** (line 90):
- Change the content wrapper from `h-[80vh] flex items-center justify-center` to `h-[80vh] flex items-start justify-center pt-4` — this top-aligns the gallery with minimal padding instead of centering it vertically, reducing the perceived gap by roughly 75%.

This single change will pull the filmstrip gallery much closer to the tab navigation while preserving the full-height container for the hover-expand animation.

