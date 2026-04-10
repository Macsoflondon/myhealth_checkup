

## Biomarker Database Page — Platform Style Alignment

### What needs to change

The current page uses a custom hero section and generic styling. It should use the shared `PageBanner` component, the standard three-tone gradient divider, platform-standard category filter buttons (turquoise idle / pink active with navy borders), and the pearl-white background with navy-bordered white cards.

### Plan

**1. Replace the custom hero with the `PageBanner` component**
- Import `PageBanner` from `@/components/sections/PageBanner`
- Use title="Biomarker Database" and subtitle text in turquoise
- Add `Header` and `Footer` from layout components

**2. Add the standard gradient divider**
- Insert `<div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />` between the banner/filters and content area

**3. Restyle category filter buttons to match the blog page pattern**
- Active state: `bg-[#e70d69]` pink with white text and navy border
- Idle state: `bg-[#22c0d4]` turquoise with white text and navy border, hover to pink
- Use `Button` component with `variant` toggling, or styled buttons matching the exact blog pattern

**4. Update page background and card styling**
- Page background: pearl white `bg-[hsl(220_5%_97%)]`
- Cards: white `bg-white` with `border-2 border-[#081129]` (navy border standard)
- Range boxes inside cards: subtle navy-alpha backgrounds instead of generic muted

**5. Category group headings**
- Use `font-heading` (Montserrat) in brand navy `text-[#081129]`
- Count badge in turquoise

**6. Wrap in Header/Footer layout**
- Add `<Header />` and `<Footer />` to match all other pages

### Technical details

Single file edit: `src/pages/BiomarkerDatabasePage.tsx`
- Add imports: `Header`, `Footer`, `PageBanner`, `Button`
- Remove the custom hero `<section>` block
- Replace with `<PageBanner>` + gradient divider
- Move search/filter section out of the negative-margin overlay pattern into a standard section below the divider
- Update all class names for cards, buttons, and backgrounds per the standards above

