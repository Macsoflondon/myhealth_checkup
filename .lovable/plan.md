

# Footer Compliance Badges Fix + TikTok Label Removal

## Overview

Two targeted changes to `src/components/layout/Footer.tsx`:

1. Replace the three separate compliance badges (ICO Registered, Companies House, UK GDPR) with the single uploaded SVG image, placed next to the Cyber Essentials badge.
2. Remove the "TikTok" text label under the TikTok social icon.

## Changes

### 1. Compliance Badges -- Replace Three with One Image

The uploaded SVG (`Untitled_design_1-2.svg`) is a single combined compliance image that replaces ICO Registered, Companies House, and UK GDPR. It will be copied into `src/assets/compliance/` and imported as an ES6 module.

The compliance badges column will then show:
- The new combined compliance image (the uploaded SVG)
- The existing Cyber Essentials badge

The three individual `ComplianceBadge` entries for ICO, Companies House, and UK GDPR will be removed entirely.

### 2. TikTok Label -- Remove Text

Remove the `<span>` element containing "TikTok" below the TikTok icon (line 122). The icon itself stays.

## Technical Details

### File: `src/assets/compliance/compliance-badges.svg` (new)
- Copy the uploaded SVG file here

### File: `src/components/layout/Footer.tsx`

**Imports** -- remove unused imports (`icoLogo`, `companiesHouseLogo`, `gdprLogo`), add new import for the combined compliance SVG.

**Compliance badges section (lines 142-154)** -- replace the four badge entries with:
- The new combined compliance SVG displayed as an image (sized to match the badge area)
- The existing Cyber Essentials badge

**TikTok section (line 122)** -- remove `<span className="text-white/70 text-[10px] font-medium mt-0.5">TikTok</span>` and the `flex flex-col items-center` class from the TikTok link (no longer needed without the label).

