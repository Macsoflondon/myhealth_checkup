# Whiten the accredited-provider standards bar and trim the badge list

## What changes

1. Remove the last two trust badges from the standards row:
   - "Data Never Shared" (EyeOff icon)
   - "Trusted Comparison" (Star icon)
   The remaining six badges stay: UKAS-Accredited Labs, CQC-Regulated Clinics, ISO 15189 Certification, GDPR Compliant, Transparent Pricing, No GP Referral Needed.

2. Convert the section background from navy (#081129) to pearl white, matching the bright white used for the wordmark elsewhere.

3. Flip all text in the section to navy/charcoal so it remains readable on white:
   - The moved hero caption "Your trusted platform for comparing private health and screening tests."
   - The subheading "All listed providers meet every one of the following standards"
   - The badge labels

4. Keep the existing turquoise/pink checkerboard icon tints; they already sit on coloured medallions and work against a white background.

## Files to edit

- `src/components/sections/AccreditedProvidersBar.tsx`
  - Drop `EyeOff` and `Star` imports and the two corresponding `trustItems` entries.
  - Change `className="bg-[#081129] border-b border-white/10"` to a white background with a subtle navy bottom border.
  - Change caption/subheading/badge-label text colours from white to navy (`text-[#081129]` or `text-brand-navy`).

## Verification

- Build the project.
- Confirm the section below the hero is white with navy text and only six badges.
- Run `bunx playwright test tests/e2e/accredited-providers-bar.spec.ts` and `e2e/accredited-providers-bar.spec.ts` to ensure the existing label checks still pass.
