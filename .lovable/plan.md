

## Make Faint Turquoise Divider Lines More Visible

**Problem**: Several decorative turquoise lines throughout the Partner Showcase area are too faint due to low opacity values (`/30` and `/40`).

**Files and changes**:

### 1. `src/components/sections/GoodbodyTestGallery.tsx`
- **Line 278**: Change `via-brand-turquoise/30` to `via-brand-turquoise/70` (divider between logo and gallery)
- **Line 290**: Change `via-brand-turquoise/30` to `via-brand-turquoise/70` (divider between gallery and CTA)

### 2. `src/components/sections/PartnerShowcaseGrid.tsx`
- **Line 15**: Change `bg-brand-turquoise/40` to `bg-brand-turquoise` (line beside "Featured Partners")
- **Line 19**: Change `bg-brand-turquoise/40` to `bg-brand-turquoise` (line beside "Featured Partners")
- **Line 36**: Change `via-brand-turquoise/30` to `via-brand-turquoise/70` (divider below Goodbody section)
- **Line 88**: Change `bg-brand-turquoise/40` to `bg-brand-turquoise` (line beside "Find Your Clinic")
- **Line 92**: Change `bg-brand-turquoise/40` to `bg-brand-turquoise` (line beside "Find Your Clinic")

### 3. `src/components/sections/FeaturedPublications.tsx`
- **Line 63**: Change `bg-brand-turquoise/40` to `bg-brand-turquoise` (line beside "As Seen In")
- **Line 67**: Change `bg-brand-turquoise/40` to `bg-brand-turquoise` (line beside "As Seen In")

All faint `/30` gradient midpoints become `/70`, and all `/40` solid lines become full opacity `bg-brand-turquoise`.

