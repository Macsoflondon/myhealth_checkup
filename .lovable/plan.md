

# Fix HealthAssetBanner Styling to Match Reference

## Problem Identified

After thorough investigation, I found that the HealthAssetBanner IS rendering but its styling does not match what you expected. Looking at your latest reference screenshot, it shows:

1. **MissionSection** - Already implemented correctly with:
   - "Your health is your greatest asset" (navy + gradient text)
   - Turquoise vertical accent bar
   - Mission paragraphs
   - 3 accreditation cards on the right

2. **HealthAssetBanner** (the full-width banner between Partners and Journey) currently has:
   - Dark navy background (#081129)
   - Pink top/bottom borders (#e70d69)
   - "Your health is your greatest asset!" with turquoise "health" and pink "asset"

Based on your feedback that the current implementation doesn't match the picture, I believe you want the HealthAssetBanner to be removed entirely OR restyled differently.

---

## Clarification Needed

Looking at your reference screenshot, it only shows the MissionSection (which already looks correct). There is no separate full-width pink/navy banner visible in that image.

**Two possible solutions:**

### Option A: Remove the HealthAssetBanner Entirely

If the MissionSection already provides the "Your health is your greatest asset" message, we can remove the duplicate HealthAssetBanner component.

**Changes:**
- Remove HealthAssetBanner from Index.tsx
- Delete HealthAssetBanner.tsx file

### Option B: Restyle the Banner to a Different Design

If you want to keep a banner between Partners and Journey but with different styling, please clarify:
- What background colour should it have?
- What text colours should "health" and "asset" use?
- Should there be borders? What colour?

---

## Files to Modify

| File | Option A (Remove) | Option B (Restyle) |
|------|-------------------|-------------------|
| `src/pages/Index.tsx` | Remove `<HealthAssetBanner />` | No change |
| `src/components/sections/HealthAssetBanner.tsx` | Delete file | Update styling |

---

## Recommendation

Based on the reference screenshot you provided, I recommend **Option A** - removing the HealthAssetBanner entirely since the MissionSection already contains the "Your health is your greatest asset" message with proper styling.

The current page flow would become:
1. Hero
2. MissionSection (with "Your health is your greatest asset" message)
3. PartnersGrid ("Our Trusted Partners")
4. JourneySimplified ("Your Health Journey Simplified")
5. FeaturedPublications

Please confirm which option you prefer, or provide additional details about how the banner should look.

