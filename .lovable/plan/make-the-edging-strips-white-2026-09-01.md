# Make the edging strips white

## Goal
Change the left/right edging strips on the inset page surface from navy to white.

## Current state
`src/styles.css` applies a crisp vertical border to `.page-surface-inner` on tablet and desktop:

```css
@media (min-width: 768px) {
  .page-surface-inner {
    -webkit-mask-image: none;
    mask-image: none;
    border-inline: 1px solid var(--color-brand-navy);
  }
}
```

Mobile explicitly has no fade/border, which we will preserve.

## Change
Update that single rule so the border colour is white instead of navy.

```css
@media (min-width: 768px) {
  .page-surface-inner {
    -webkit-mask-image: none;
    mask-image: none;
    border-inline: 1px solid #ffffff;
  }
}
```

## Verification
- Open the preview on a desktop viewport and confirm the left/right page-edge lines are white.
- Check a tablet width to ensure the same white strips appear.
- Check a mobile width to confirm no strips remain (current behaviour is preserved).
