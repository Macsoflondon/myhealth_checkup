
# Redesign: Merge Bottom Homepage Sections into a 4-Panel Grid Layout

## What Changes

The screenshot shows a visually striking **2x2 grid layout** that combines provider feature cards, the CTA card, the Find a Clinic section, and provider spotlight content into a single cohesive section. This replaces three separate sections currently on the homepage.

## Sections Being Replaced

The following existing sections will be **merged into one new component**:

1. **BrandVideoSection** (featured partners videos -- currently section 9)
2. **FindClinicSection** (find a clinic + CTA card -- currently section 15)

These two sections will be removed from the homepage and replaced with a single new `PartnerShowcaseGrid` component.

## New Layout: 4-Panel Grid

The new section uses a **2-column, 2-row grid** on desktop (stacking to single column on mobile):

### Top Row
- **Top-Left: Goodbody Clinics Feature Card** -- Light grey/white card with "Know more. Live Better." heading, descriptive text about Goodbody's services (200+ locations, CQC regulated, UKAS accredited labs, 60+ tests, GP review included), and the Goodbody looping video on the right side of the card
- **Top-Right: "Take Control" CTA Card** -- Navy background card (kept from current FindClinicSection) with "Start Your Journey Today" badge, headline, subtitle, two branded CTAs (Compare tests / Take the health quiz), and trust points

### Bottom Row
- **Bottom-Left: Find a Clinic Card** -- Light grey/white card with "Find a Clinic Near You" heading (turquoise accent), descriptive paragraph, stats row (200+ Clinic Locations, 7 Partner Networks, UK-wide Coverage), and two branded CTAs
- **Bottom-Right: Medichecks Feature Card** -- White card with "Know More, Live Better" heading, descriptive text about Medichecks' services (home kits, nationwide clinics, UKAS accredited, GP reviewed results), and the Medichecks looping video on the right side with the Medichecks logo

## Design Specifications

- **Grid gap**: Consistent spacing between all 4 panels (gap-6 on mobile, gap-8 on desktop)
- **Card styling**: Rounded corners (rounded-2xl), subtle shadows, consistent padding
- **Provider cards**: Feature text on the left (~55%) and video/media on the right (~45%)
- **Button pairs**: Turquoise + Pink with colour-swap hover, no icons, matching existing button standards
- **Mobile behaviour**: Cards stack vertically in a single column, full-width
- **Background**: Light section background to contrast with the navy CTA card
- **Typography**: Montserrat headings, sans-serif body text, brand colours only

## Content for Provider Cards

**Goodbody card text** (based on screenshot, refined for brand voice):
- Heading: "Know more. Live Better."
- Body: Goodbody Clinics provide comprehensive private health checks at affordable prices. Visit one of over 200 nationwide locations, or opt for their convenient home testing service. CQC regulated, with exclusively UKAS-accredited laboratories. Featuring over 60 different blood and wellness tests with a comprehensive GP review of your results.

**Medichecks card text** (based on screenshot, refined for brand voice):
- Heading: "Know More, Live Better"
- Body: Medichecks provide private blood tests and health checks designed for clarity, speed, and clinical accuracy. Choose from convenient at-home testing kits or attend a nationwide network of partner clinics. All samples are analysed by UKAS accredited laboratories, with services delivered through CQC regulated clinical partners. Results include a clear GP reviewed report, helping you understand your biomarkers and take informed next steps.

## Technical Details

### Files to Create
- `src/components/sections/PartnerShowcaseGrid.tsx` -- new 4-panel grid component

### Files to Modify
- `src/pages/Index.tsx` -- replace BrandVideoSection and FindClinicSection imports with new PartnerShowcaseGrid, placed where BrandVideoSection currently sits (section 9 position)

### Files No Longer Needed on Homepage
- `BrandVideoSection` and `FindClinicSection` will no longer be rendered on the homepage (the component files are kept since they may be used elsewhere, but removed from Index.tsx)

### Assets Reused
- `src/assets/goodbody-animation.mp4` -- Goodbody looping video
- `src/assets/medichecks-animation.mp4` -- Medichecks looping video
- Provider logos from `PROVIDER_LOGOS` constants

### Responsive Breakpoints
- Mobile (< 768px): Single column stack, all 4 cards full-width
- Tablet (768px+): 2x2 grid begins
- Desktop (1024px+): Full 2x2 grid with optimal spacing

### Button Links
- "Compare tests" links to `/compare`
- "Take the health quiz" links to `/assisted-test-finder`
- "Find your nearest clinic" links to `/find-clinic`
- "Browse all clinic locations" links to `/find-clinic`
- Provider cards link to `/provider/goodbody-clinic` and `/provider/medichecks` respectively
