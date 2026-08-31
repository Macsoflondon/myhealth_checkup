# Technical details

## 1. Tablet hard border — `src/styles.css`

- In the `min-width: 768px` media block: set `--edge-fade: 0px` (keep `--page-inset: 1.5rem`).
- Move the `border-inline: 1px solid var(--color-brand-navy)` rule on `.page-surface-inner` from the ≥1024px block into the ≥768px block so tablet gets the same hard lines at its narrower inset.
- Mobile (<768px) stays untouched: full-width, no border, no fade.

## 2. "More" menu redesign — `src/components/header/MoreDropdownMenu.tsx`

Restyle to mirror the mobile drawer in `BrowseByCategoryBar.tsx` (lines ~315–360):

- Panel background `#f7f7f8` (same as drawer), keep existing fixed anchoring under the More button, rounded-lg, navy border.
- Section headings: `text-[10px] font-bold uppercase tracking-[0.2em] text-[#081129]/40` — identical to drawer.
- Items: pill cards — `rounded-xl bg-white border-[1.5px] border-[#081129]/10`, 8px icon chip circle tinted `${color}1a`, icon in section colour, `text-sm font-semibold font-[Montserrat]` label.
- Use the existing `MORE_SECTION_ICONS` map (exported from the bar or moved to a shared module) so icon/colour parity is automatic.
- Keep the language selector + Sign-in pill row at the top (already close to the drawer's Account/Language sections), restyled to the card look.
- Keep overflow categories (from the responsive toolbar collapse) as the first "Categories" section — now rendered as pill cards like the drawer's Test Categories section.
- Category items that have sub-menus get the same chevron expand behaviour as the drawer.
- Accessibility: retain `useDropdownAccessibility` focus trap, Escape to close, and click-outside handling.

## 3. Verification

- Playwright at 1440 / 1280 / 1024 / 834 (tablet) / 390 (mobile):
  - Toolbar pills fit without sliding under "More"; hidden pills appear in the Categories section of the More panel.
  - Tablet shows hard side lines, no feathering; no horizontal overflow anywhere.
  - More panel visually matches the hamburger drawer (screenshot side-by-side).
