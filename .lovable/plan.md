## Goal
On all category pages using the standardised hero pill: drop the uppercase styling and the two pink dots, make the label white, and make the section below the tricolour divider have a white background.

## Changes

### 1. `src/components/category/CategoryStandardHero.tsx`
- Remove the two pink dot `<span>`s flanking the `<h1>`.
- Remove `uppercase` from the heading classes so the label renders in its passed casing (e.g. "General Wellness").
- Change heading colour from turquoise `#22c0d4` → white `#ffffff`.
- Keep everything else (navy hero background, benefits row, tricolour divider).

### 2. `src/pages/WellnessPage.tsx` — "Browse Tests by Category" section
- Change section `background` from `#081129` → `#ffffff`.
- Restyle filter pills for the new white background so they remain readable:
  - Inactive pill: dark border `rgba(8,17,41,0.2)`, dark text `#081129`, transparent background.
  - Active/hovered pill: keep the existing accent colour border + tinted background + accent text (already legible on white).
- Cards already have a white background and dark text — no change needed.
- Bottom CTA banner already sits on white — no change.

### 3. Pages using `CategoryPageLayout` (Men's, Women's, Fertility, Cancer Screening, Sports Performance, Thyroid, Heart, Hormones, Gut, Diabetes, Vitamin Deficiency, Most Popular Tests, etc.)
- The cards section there is already `bg-white`. No change beyond the shared hero update above.

## Out of scope
- Hero (navy) background stays navy — only the pill text/dots change and the section below the divider goes white.
- No copy changes, no routing changes, no other category-page restructuring.