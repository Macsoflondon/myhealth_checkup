## Goal

Two changes to the shared test card (`src/components/cards/UniversalTestCard.tsx`, which every grid, carousel and category page renders through the adapter):

1. Provider logo and brand name become a clear, prominent brand lockup.
2. The turquoise glow currently applied only on hover becomes permanent, with hover lifting it further.

## 1. Provider branding

Current state: a 28x28 logo tile with 12px turquoise brand name in a 28px-high row above the trust line.

Changes:
- Logo tile grows to 40x40, white background with a hairline `#e2e8f0` border and 8px radius so cropped provider marks sit cleanly (matches provider-logo constraints already used elsewhere).
- Brand name goes to 14px Montserrat, weight 700, navy `#081129` — stronger contrast than the current turquoise 12px, and consistent with brand typography.
- Row height increases to accommodate the taller lockup; Popular / Add-on badges stay right-aligned and vertically centred against it.
- Nothing else moves: title, category, description, chips, stats, price and buttons keep their fixed min-heights so card heights stay uniform across a grid.

## 2. Permanent glow

Current state: `boxShadow: "none"` at rest, turquoise glow only applied in the `onMouseEnter` handler.

Changes:
- Resting state gets a soft turquoise glow plus a subtle depth shadow, e.g. `0 0 0 1px rgba(34,192,212,0.18), 0 6px 20px rgba(34,192,212,0.14)`, with the border tinted turquoise rather than grey.
- Hover intensifies the same glow (larger blur, higher opacity) and keeps the existing 2px lift, so hover still reads as interactive.
- Compare-selected cards keep their navy inset stripe and get the navy-weighted variant of the same treatment, so the selected state stays distinguishable from the ambient glow.

## Technical notes

- All edits are confined to `UniversalTestCard.tsx` (the resting `style` object plus the `onMouseEnter` / `onMouseLeave` handlers, and the provider row markup). No adapter, data or query changes.
- Grid gaps are wide enough for a 20px glow spread, so no layout reflow is expected; I will verify visually at mobile and desktop widths on a category page and the homepage popular-tests row.
