

# Hero Section Redesign -- Match Reference Image

## Overview

The section directly under the header video needs to be restructured to match the reference image exactly. The key change is merging the mission statement content (currently in `MissionSection`) into the Hero section, and reorganising the layout order.

## What Changes

### Current layout (top to bottom):
1. Video
2. Headline + pink subtitle
3. Short subheading ("Prices, biomarkers, and turnaround times...")
4. Two CTA buttons
5. Search bar in white card
6. Popular searches
7. Trust signals (inline, small text)
8. **Then** MissionSection appears as a separate section below

### New layout to match the reference (top to bottom):
1. Video (unchanged)
2. Headline "Compare the UK's leading private health test providers" + pink "All in one place!" (unchanged)
3. **Mission text block with turquoise left border** -- three paragraphs:
   - Bold: "At myhealth **checkup**, we believe everyone deserves access to transparent, trustworthy health information."
   - Regular: "Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers."
   - Regular: "We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC regulation."
4. Centred bold text: **"Prices | Biomarkers | Turnaround Times"**
5. Two CTA buttons (turquoise + pink, same as now)
6. Search bar (same white card as now)
7. Popular searches (same as now)
8. **Trust signals bar** -- separate band with a light/subtle background, 5 items arranged in two rows:
   - Row 1: "UKAS accredited laboratories only" | "CQC regulated providers" | "No payments taken on this site"
   - Row 2: "No GP Referral Needed" | "Independent comparison"

### What happens to MissionSection

The mission text content moves into Hero.tsx. The `MissionSection` component will be simplified to only keep the navy banner heading ("Your health is your greatest asset!") and the accreditation cards, since the text paragraphs are now inside the hero.

## Files to Edit

| File | Change |
|------|--------|
| `src/components/sections/Hero.tsx` | Add mission text block with turquoise left border after headline; replace subheading with "Prices / Biomarkers / Turnaround Times" line; add "No GP Referral Needed" to trust signals; restyle trust signals as a contained bar with light background |
| `src/components/sections/MissionSection.tsx` | Remove the three mission text paragraphs and turquoise accent bar (they now live in Hero); keep only the navy banner and accreditation cards |

## Detailed Changes

### Hero.tsx

1. **After the h1 headline block**, insert a new left-bordered text block:
   - Container: `max-w-3xl mx-auto text-left` with a `border-l-4 border-[#22c0d4] pl-4 sm:pl-6` accent bar
   - Three paragraphs with the exact mission text (same content as currently in MissionSection)
   - Text alignment: left-aligned (not centred like the rest of the hero)

2. **Replace the current subheading** (lines 106-110) with a centred bold line:
   - "Prices | Biomarkers | Turnaround Times"
   - Styled as `font-heading font-bold text-lg sm:text-xl md:text-2xl text-brand-navy`

3. **Update trust signals array** (lines 54-59) to add a fifth item:
   - Add `{ icon: Search, text: "No GP Referral Needed" }` (using Search icon or a suitable alternative)

4. **Restyle trust signals container** (lines 190-200):
   - Wrap in a full-width bar with a light background (`bg-[#f0fafb]` or similar light turquoise tint)
   - Two rows on desktop: 3 items on top, 2 centred below
   - Larger text and icons than currently
   - Rounded corners on the container
   - Bold text for the signal labels

### MissionSection.tsx

1. Remove the left column (lines 46-63) containing the text paragraphs and turquoise accent bar
2. Keep the navy banner ("Your health is your greatest asset!") and the accreditation cards
3. Adjust the grid layout since there is no longer a two-column split -- centre the accreditation cards

