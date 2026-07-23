Plan:

1. **Fix the toolbar size where it actually renders**
   - Update the `compact` branch used by the homepage hero toolbar, not just the larger non-compact variant.
   - Make each dropdown pill roughly **2x the current visible size** by increasing:
     - vertical padding
     - horizontal padding
     - icon circle size
     - icon size
     - label font size
     - dropdown chevron size
   - Apply the same sizing to the **More** pill so the row looks consistent.
   - Keep the toolbar on one clean row on desktop where possible, with wrapping only if the viewport genuinely cannot fit it.

2. **Keep the toolbar premium and brand-aligned**
   - Preserve the white pill style, navy text, turquoise/pink accents, Montserrat typography, and rounded capsule shape.
   - Avoid changing the mobile drawer unless the enlarged desktop toolbar creates a direct consistency issue.

3. **Replace the trust carousel with a static trust row**
   - Remove the duplicated item loop and animation logic from `AccreditedProvidersBar`.
   - Render the eight trust standards once only:
     - UKAS-Accredited Labs
     - CQC-Regulated Clinics
     - ISO 15189 Certification
     - GDPR Compliant
     - Transparent Pricing
     - No GP Referral Needed
     - Data Never Shared
     - Trusted Comparison
   - Display them across the navy area below the toolbar as a normal static row, not a moving carousel.

4. **Responsive behaviour**
   - Desktop/wide screens: show all trust icons across in one line.
   - Tablet/smaller widths: allow clean wrapping into two rows rather than clipping or scrolling.
   - Keep spacing tight enough that the section does not become too tall.

5. **Verify visually**
   - Check the homepage at the current desktop viewport.
   - Confirm the toolbar pills are visibly double the current size.
   - Confirm the trust icons are static and all visible at once in the blue/navy band.