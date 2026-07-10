## Category header benefits — mobile redesign (v2 in brand)

Adopt the selected "compact badge row" direction on mobile for the three-benefit row in `CategoryStandardHero`, but pull it fully onto our brand tokens/typography instead of the prototype's mono-pink + Montserrat-only look.

### Scope
- File: `src/components/category/CategoryStandardHero.tsx` (benefits row only, lines ~94–140).
- Applies globally to every category page (Cancer Screening, Women's Health, Hormones, etc.) via `CategoryPageLayout`.
- No changes to page title, pill label, description text, filters, or test cards.
- Desktop (`sm:` and up) layout stays as-is — this is a mobile-only refinement.

### Design
Mobile (`<sm`): three-column compact row (replaces current stacked 1-col list).

Per benefit:
- Circular icon chip, 56px, `bg-gradient-to-b from-white/10 to-transparent`, hairline border `border-white/10`, backdrop-blur.
- Icon: brand turquoise `#22c0d4` stroke, 24px, `stroke-width` 1.25 (thin/premium).
- Two-line label using brand typography:
  - Line 1 (Montserrat 800, tight tracking, uppercase, 10px, pearl `#F5F5F5`).
  - Line 2 (Montserrat 600, uppercase, 10px, `text-white/55`) — e.g. `Early / Detection`.
- Description copy hidden on mobile (`hidden sm:block`) — cleaner, more premium.
- Ambient glow: soft pink `#e70d69`/10 top-left, turquoise `#22c0d4`/8 bottom-right blurs on the hero container (behind row).
- Bottom accent: 1px turquoise-to-transparent hairline under the row.

Desktop keeps the existing icon + title + description layout untouched.

### Two-line label derivation
Split `title` on the last space to get `[primary, secondary]`. Single-word titles (e.g. `PCOS`) render on one line with same styling.

### Verification
- `bun x tsgo --noEmit` + `bun run build`.
- Playwright screenshots at 390×844 (mobile) and 1280×800 (desktop) on `/tests/cancer`, `/womens-health`, and one more category — confirm mobile shows compact 3-up row in brand colours, desktop unchanged.

### Out of scope
- No changes to `CategoryPageLayout` structure, benefits data model, or per-page `benefits` props.
- No changes to typography stack or Tailwind config.