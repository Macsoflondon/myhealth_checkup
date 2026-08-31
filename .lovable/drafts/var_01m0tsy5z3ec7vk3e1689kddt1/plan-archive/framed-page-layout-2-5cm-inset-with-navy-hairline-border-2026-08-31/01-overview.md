# Framed page layout — 2.5cm inset with navy hairline border

Shrink the page surface so the content sits 2.5cm (~95px) in from each browser edge on desktop, and replace the current soft feathered fade with a crisp 1px navy (#081129) vertical line on each side — a deliberate, framed look.

## What changes

- **Desktop (≥1024px):** page inset becomes 2.5cm per side. A 1px navy hairline runs down the left and right edges of the page surface, top to bottom. All existing content (header, hero, sections, footer) shrinks to fit inside the frame — nothing is re-laid-out, the existing `--page-width` math makes every full-bleed band and the sticky toolbar follow automatically.
- **Wide screens (≥1536px):** same 2.5cm inset (fixed measurement, not proportional growth).
- **Tablet (768–1023px):** keeps the current smaller 24px inset with the soft fade — no border.
- **Mobile (<768px):** unchanged, full-width — the frame would only cramp small screens.

## What does not change

- No changes to any component, spacing, or typography — only the layout tokens and the surface treatment in `src/styles.css`.
- Sticky toolbar, ticker, hero, and footer continue to span the full framed width; they align to the frame because they already derive from the same tokens.
- No horizontal overflow; verified across breakpoints.
