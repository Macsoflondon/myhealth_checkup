## Goal
The two Live Comparison cards on the homepage currently share overlapping tests (both rotations include Thyroid, Cholesterol, Vitamin D, Vitamin B12, Hormone), so they often display the same panel side-by-side. Split them into two non-overlapping themed rotations.

## Split (no overlap)

**Left card — "Hormones & Vitality"** (uses `DEFAULT_LIVE_COMPARISON_PANELS` in `LiveComparisonCard.tsx`)
- Male Hormone Panel
- Female Hormone Panel
- Thyroid Health Panel
- Vitamin D Test

**Right card — "Heart, Blood & Nutrition"** (uses local `TESTS` in `StartJourneySection.tsx`)
- Full Blood Count Panel
- Cholesterol Panel
- Vitamin B12 Test
- (keep just these three; remove Thyroid, Hormone, Vitamin D from this array)

This guarantees the two cards never share a panel name, regardless of rotation timing.

## Changes

1. **`src/components/sections/LiveComparisonCard.tsx`**
   - Trim `DEFAULT_LIVE_COMPARISON_PANELS` to: Male Hormone Panel, Female Hormone Panel, Thyroid Health Panel, Vitamin D Test (remove Cholesterol, Vitamin B12).

2. **`src/components/sections/StartJourneySection.tsx`**
   - Trim local `TESTS` to: Full Blood Count Panel, Cholesterol Panel, Vitamin B12 Test (remove Thyroid, Hormone, Vitamin D).

No component/layout changes; only the data arrays.
