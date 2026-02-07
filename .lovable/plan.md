

# Redesign Bottom Half of Homepage to Match Reference Image

## Overview

This plan restructures four sections and the footer to match the reference design screenshot. The key changes are layout restructuring (side-by-side sections), content additions (clinic stats, TikTok social icon, brand bar), and a complete footer redesign.

## Section-by-Section Changes

### 1. FindClinicSection + FinalCTA -- Combined Side-by-Side Layout

**Current**: Two separate full-width stacked sections.
**New**: One section with a two-column grid layout on desktop, stacking vertically on mobile.

- **Left column (FindClinicSection)**:
  - Left-aligned heading "Find a Clinic **Near You**" (gradient text)
  - Left-aligned paragraph: "With over 200 partner clinic locations across the UK, getting a blood test has never been more convenient. Whether you prefer a home kit or in-clinic appointment, we've got you covered."
  - Three stat items in a row: "200+" / Clinic Locations, "7" / Partner Networks, "UK-wide" / Coverage
  - Two CTA buttons below: "Find your nearest clinic" (turquoise, hover pink) and "Browse all clinic locations" (pink, hover turquoise)

- **Right column (FinalCTA)**:
  - Light grey background card (`bg-gray-50 rounded-2xl`)
  - "Start Your Journey Today" badge at top
  - Centred heading "Take Control of Your **Health Today**"
  - Description text
  - Two buttons: "Compare tests" (turquoise) and "Take the health quiz" (pink)
  - Trust line: "Free to use . No registration required . Fully independent"

**Implementation**: Merge these into one combined section component or wrap both in a parent grid. The simplest approach is to edit `FindClinicSection.tsx` to include the FinalCTA content as a second column and remove the standalone `FinalCTA` from the page.

### 2. TrustPlatformSection -- Wider Cards

**Current**: Very compact, small cards with `max-w-xl`.
**New**: Wider layout matching the reference -- full-width container with larger cards, bigger icons, and more padding. Remove the `max-w-xl` constraint.

### 3. HereToHelp -- Two-Column Layout

**Current**: Centred heading with three resource cards in a 3-column grid below.
**New**: Two-column layout on desktop:
- **Left column**: Left-aligned heading "You're Never Alone on Your **Health Journey**", followed by a descriptive paragraph below
- **Right column**: Three resource cards stacked vertically (Health Hub, FAQs, Contact Us) -- each as a horizontal row with icon, title, and description

Resource card titles updated:
- "Health Guides" becomes "Health Hub"
- Description updated: "In-depth articles on tests, conditions and what your results mean."
- FAQs description: "Answers to common questions about testing and our platform."
- Contact Us description: "Get in touch with our team for personalised support."

### 4. Footer -- Complete Redesign

**Current**: Navy background, 6-column grid with 3 link columns, company description, social, compliance badges. Separate compliance statements box.
**New layout** (matching reference):

- **Top area**: White/light background section with:
  - Two link columns side by side (left-aligned):
    - Column 1: Men's Health, Women's Health, Heart Health, Diabetes, Thyroid, Fertility, Cookie Policy
    - Column 2: About Us, How It Works, Our Providers, Clinic Locations, FAQs, Blog, Contact
  - "Follow Us" with three social icons (Instagram, Facebook, TikTok) -- larger, circular
  - Important disclaimer text in pink/turquoise: "Important: MyHealth Checkup is a comparison platform. We do not provide medical services. All testing is conducted by our trusted partner providers."
  - Company info: "MYHEALTHCHECKUP LTD is the UK's leading health service comparison website." + Company No.
  - Right side: Compliance badges stacked vertically (ICO Registered, Companies House, UK GDPR, Cyber Essentials Certified)

- **Bottom copyright bar**: Navy background with copyright text and Accessibility link
- **Brand bar at very bottom**: Pink-to-turquoise gradient bar with the myhealth checkup logo and slogan "Your health! Your choice! One trusted platform!"

### 5. Update Index.tsx Section Order

Remove `FinalCTA` as a standalone import since it merges into the FindClinicSection combined layout:
- Remove `<FinalCTA />` from the page
- The combined FindClinic+FinalCTA section handles both

## Files to Edit

| File | Change |
|------|--------|
| `src/components/sections/FindClinicSection.tsx` | Major rewrite: two-column grid with clinic stats on left and FinalCTA content on right |
| `src/components/sections/HereToHelp.tsx` | Restructure to two-column layout with left-aligned heading and stacked resource cards on right |
| `src/components/sections/TrustPlatformSection.tsx` | Widen cards, increase padding and icon sizes to match reference |
| `src/components/layout/Footer.tsx` | Complete redesign: white top section with new layout, compliance badges, social icons (add TikTok), disclaimer block, brand bar at bottom |
| `src/pages/Index.tsx` | Remove `FinalCTA` import and usage |

## Technical Notes

- All buttons continue to follow the turquoise/pink two-tone hover-swap system
- The brand colour palette (#22c0d4, #e70d69, #081129, #ffffff) is used exclusively
- Mobile-first approach: the two-column layouts stack to single column on small screens
- The TikTok social icon will be added as an inline SVG consistent with the existing Facebook and Instagram icons
- "Companies House" and "Cyber Essentials" badges will use placeholder styled divs with text labels (same pattern as existing compliance badges) unless actual logo files are available
- The brand bar at the footer bottom uses a gradient from pink to turquoise with the logo centred
