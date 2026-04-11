

## Update AccreditedProvidersBar: Larger Logos and Consistent Heading

**File**: `src/components/sections/AccreditedProvidersBar.tsx`

### Changes

1. **Logo size** — Change `h-12` to `max-h-[90px] sm:max-h-[120px]` to match the PartnersGrid carousel logos. Also increase card padding to accommodate the larger logos.

2. **Section heading** — Replace the small uppercase `h2` with the `SectionHeading` component (used across other sections), e.g. `<SectionHeading title="Accredited Providers" gradientText="We Compare" titleClassName="text-white" />`. This matches the heading style of "Our Trusted Partners" and other sections.

3. **Section padding** — Adjust from `py-16 md:py-20` to `py-8 md:py-12` to match the compact landing page standard.

