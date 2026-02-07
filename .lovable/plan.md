

# Footer Redesign -- Exact Match to Reference Image

## Overview

Rewrite `src/components/layout/Footer.tsx` to precisely match the reference screenshot. The general structure (navy bg, 4 columns, copyright bar, pink divider, brand bar) is in place but the details are wrong. This plan fixes every visual discrepancy.

## Specific Changes

### 1. Compliance Badges -- Larger, More Detailed

The current badges are tiny generic squares (w-12/w-14). In the reference, they are tall rectangular cards with readable text and styling inside.

Changes:
- Increase badge size to approximately `w-20 h-20 sm:w-24 sm:h-24` (roughly 80-96px)
- Rounded corners with `rounded-xl`
- **ICO Registered**: White background, display the ICO logo image with "REGISTERED" text below it inside the badge
- **Companies House**: White background, display a building/crest emoji or icon with "Companies House" text inside
- **UK GDPR**: White background, display the GDPR logo image with branding text
- **Cyber Essentials Certified**: Turquoise (#22c0d4) background, large white checkmark, "CYBER ESSENTIALS" and "CERTIFIED" text in white, bold

### 2. Social Icons -- Larger with TikTok Label

- Increase social icon SVGs from `width="44"` to `width="52"` or `width="56"`
- Add "TikTok" text label below the TikTok icon (matching the reference where it shows the brand name)

### 3. "Follow Us" Text -- Turquoise, Larger

- Change "Follow Us" text colour from white to turquoise (#22c0d4)
- Increase font size to `text-xl sm:text-2xl`
- Keep bold weight

### 4. Layout Spacing Adjustments

- Add more vertical padding to the main footer section: `pt-10 sm:pt-12 pb-6 sm:pb-8`
- Increase gap between grid columns: `lg:gap-12`
- Add more bottom margin after the social icons row: `mb-6 sm:mb-8`

### 5. Brand Bar -- Exact Match

The brand bar is close but needs refinement:
- The heart logo should be slightly larger: `h-10 w-10 sm:h-12 sm:w-12`
- "myhealth" text larger and bolder
- "checkup" text in turquoise, positioned closer to "myhealth"
- Slogan: "Your **health!** Your **choice!** One **trusted** platform!" with "health!" and "choice!" in pink (#e70d69) and "trusted" in turquoise (#22c0d4), rest in white
- Ensure all elements are on a single horizontal line, centred

### 6. Copyright Line

- Ensure copyright text and "Accessibility" link are both in pink (#e70d69)
- Centred, with adequate padding above and below

### 7. Pink Divider

- Keep as `h-[2px] bg-[#e70d69]` (this matches the reference)

## File to Edit

| File | Change |
|------|--------|
| `src/components/layout/Footer.tsx` | Full rewrite of the ComplianceBadge component to be larger and more detailed; increase social icon sizes; update "Follow Us" to turquoise; adjust spacing throughout; refine brand bar sizing |

## Technical Details

The `ComplianceBadge` component will be rewritten with larger dimensions and more content inside each badge:

```text
ComplianceBadge props:
- image?: string (logo image path)
- label: string (text below the badge)
- text?: string (text inside the badge if no image)
- isCyberEssentials?: boolean
- innerLabel?: string (additional text inside the badge)

Badge container: w-20 h-20 sm:w-24 sm:h-24 rounded-xl
```

Social icons will increase from 44px to 54px SVG width/height.

"Follow Us" will use `text-[#22c0d4] font-heading font-bold text-xl sm:text-2xl`.

No new files, no new dependencies. Only `Footer.tsx` is edited.
