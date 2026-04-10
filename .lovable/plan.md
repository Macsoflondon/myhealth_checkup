

## Homepage Audit: Oversized Elements and Excessive Padding

### Issues Found

**1. Header/Logo area is oversized (desktop)**
- Logo images are `h-[5rem] lg:h-[6rem] xl:h-[7rem]` — the logo block alone takes ~180px of vertical space
- Padding `py-8` on the logo container adds more height
- Combined with the sticky BrandTicker (~40px) and nav toolbar (~50px), the header consumes ~270px before any content appears

**2. Hero section has excessive padding and oversized text**
- Hero heading is `text-[4.5rem]` at xl — extremely large
- Hero internal padding: `pt-14 pb-10 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16` — very generous
- The search box container (`p-5 sm:p-7`) and popular searches area add significant height
- The hero badge pill (`py-2.5 sm:py-3 px-6 sm:px-8`) is oversized
- `mb-7 sm:mb-9` gap between CTA buttons and search is large

**3. Sections have excessive vertical padding**
- `PartnerShowcaseGrid`: `py-12 sm:py-16 md:py-20` — up to 80px top+bottom
- `TestimonialCarousel`: `py-12 sm:py-16 md:py-20`
- `HereToHelp`: `py-12 sm:py-16 md:py-20`
- `TrustPlatformSection`: `py-12 sm:py-16 md:py-20`
- `ExpertQuotes`: `py-12 sm:py-16 md:py-20`
- `PartnersGrid`: `py-8 sm:py-12 md:py-16`
- `CallToAction`: `py-16`
- `StartJourneySection`: `py-12 sm:py-16`

**4. Section headings are oversized**
- `SectionHeading` uses `lg:text-4xl` (2.25rem/36px) — large for section titles
- Individual sections repeat this pattern with `lg:text-4xl` or even `lg:text-5xl`

**5. Internal section spacing is generous**
- `mb-10 sm:mb-12` on heading blocks within sections
- `gap-12 lg:gap-16` in PartnerShowcaseGrid
- `mb-8` on CTA descriptions

---

### Plan: Tighten the Homepage

**A. Reduce header logo area** (`Header.tsx`)
- Logo height: `h-[5rem] lg:h-[6rem] xl:h-[7rem]` → `h-[3.5rem] lg:h-[4rem] xl:h-[4.5rem]`
- Tagline height: same reduction
- Container padding: `py-8` → `py-4`

**B. Compact the hero** (`Hero.tsx`)
- Headline: cap at `xl:text-[3.5rem]` instead of `4.5rem`
- Hero padding: `md:pt-24 md:pb-16` → `md:pt-16 md:pb-10`
- Badge pill: `py-2.5 sm:py-3` → `py-2`
- Button row gap: `mb-7 sm:mb-9` → `mb-5 sm:mb-6`
- Search box: `p-5 sm:p-7` → `p-4 sm:p-5`
- Trust signals bar: already compact, keep as-is

**C. Reduce section padding globally** (each section file)
- Standard section padding: `py-12 sm:py-16 md:py-20` → `py-8 sm:py-10 md:py-12`
- Applies to: `PartnerShowcaseGrid`, `TestimonialCarousel`, `HereToHelp`, `TrustPlatformSection`, `ExpertQuotes`, `PartnersGrid`
- `CallToAction`: `py-16` → `py-10`
- `StartJourneySection`: `py-12 sm:py-16` → `py-8 sm:py-10`

**D. Reduce section heading sizes** (`section-heading.tsx`)
- `lg:text-4xl` → `lg:text-3xl` in the shared component
- Reduce internal heading margins: `mb-10 sm:mb-12` → `mb-6 sm:mb-8` in individual sections

**E. Tighten internal section gaps**
- `PartnerShowcaseGrid` grid gap: `gap-12 lg:gap-16` → `gap-8 lg:gap-10`
- CTA description margin: `mb-8` → `mb-5`

### Files to edit
1. `src/components/layout/Header.tsx` — logo sizing and padding
2. `src/components/sections/Hero.tsx` — headline size, padding, spacing
3. `src/components/ui/section-heading.tsx` — heading font size
4. `src/components/sections/PartnerShowcaseGrid.tsx` — section padding and gaps
5. `src/components/sections/TestimonialCarousel.tsx` — section padding
6. `src/components/sections/HereToHelp.tsx` — section padding
7. `src/components/sections/TrustPlatformSection.tsx` — section padding
8. `src/components/sections/ExpertQuotes.tsx` — section padding and heading margin
9. `src/components/sections/PartnersGrid.tsx` — section padding
10. `src/components/sections/CallToAction.tsx` — section padding
11. `src/components/sections/StartJourneySection.tsx` — section padding

### What stays unchanged
- Mobile-specific sizing (already more compact)
- Test cards and their internal layouts
- Footer layout
- BrandTicker and navigation toolbar

