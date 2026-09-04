# Change side edging strips from white to navy

## Goal

Change the left/right vertical border strips on the inset page surface from white to the brand navy colour.

## Current state

`src/styles.css` applies a 1px white border to `.page-surface-inner` on tablet and desktop:

```css
@media (min-width: 768px) {
  .page-surface-inner {
    -webkit-mask-image: none;
    mask-image: none;
    border-inline: 1px solid #ffffff;
  }
}
```

Mobile (`<768px`) keeps no border, which we will preserve.

## Change

Update that single rule so the border colour is navy instead of white, using the existing brand token:

```css
@media (min-width: 768px) {
  .page-surface-inner {
    -webkit-mask-image: none;
    mask-image: none;
    border-inline: 1px solid var(--color-brand-navy);
  }
}
```

Also update the preceding comment from "crisp 1px white frame line" to "crisp 1px navy frame line".

## Verification

- Open the preview on a desktop viewport and confirm the left/right page-edge lines are navy.
- Check a tablet width to ensure the same navy strips appear.
- Check a mobile width to confirm no strips remain (current behaviour is preserved).
