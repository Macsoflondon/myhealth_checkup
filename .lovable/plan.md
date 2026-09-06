# Remove navy side buffers and make platform full-width

The current layout has navy blue vertical strips on the left and right of the content area, with a white inner content panel inset from the viewport edges. The user wants those navy buffers removed and the platform content to extend to the full viewport width.

## What changes

- Update `src/layouts/MainLayout.tsx` so the outer page surface no longer adds navy side margins.
- Remove or neutralise the inner max-width/container constraints that create the white inset panel, allowing content to reach the viewport edges.
- Preserve the existing header, footer, floating nav, and page chrome; only the side margins and content width are affected.

## Verification

- Check the homepage and `/at-home-tests` at desktop width to confirm no navy vertical strips remain and content touches the viewport edges.
- Check mobile width to ensure horizontal scrolling or edge clipping does not appear.
