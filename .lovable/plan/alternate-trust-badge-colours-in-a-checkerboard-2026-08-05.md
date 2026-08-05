# Alternate trust-badge colours in a checkerboard

## What changes

In the "All listed providers meet every one of the following standards" row, the icon colours currently split by column — every left-hand badge is turquoise, every right-hand badge is pink. Instead, colours alternate in both directions, so each badge is the opposite colour to the one beside it and the one above it:

```text
Turquoise   Pink
Pink        Turquoise
Turquoise   Pink
Pink        Turquoise
```

Only the icon circle (background tint and icon colour) changes; labels stay white and layout, spacing and copy are untouched.

## Technical notes

- File: `src/components/sections/AccreditedProvidersBar.tsx`.
- The grid is 2 columns on mobile, 4 on `sm`, and a single flex row on `lg`, so a fixed JS index-to-tone map can't be correct at every breakpoint. Instead of passing a `tone` prop, `BadgePill` renders a tone-neutral circle that reads its colour from a CSS variable.
- Add a `@utility trust-alt` (or equivalent scoped rules) in `src/styles.css` that sets that variable via `:nth-child()` rules per breakpoint:
  - base (2 cols): checkerboard via `nth-child(4n+1)`, `nth-child(4n+4)` turquoise; the rest pink.
  - `sm` (4 cols): `nth-child(8n+1..)` pattern shifting the second row by one so rows stay offset.
  - `lg` (single row): straight `nth-child(odd)` / `even` alternation.
- Colours keep using the existing `--turquoise` / `--pink` brand tokens at the current 0.18 / 0.16 background opacities — no new hex values.
