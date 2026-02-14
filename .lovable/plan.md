

## Fix CTA Card: More Space Before Buttons, Smaller Container

### 1. Increase gap between description text and buttons to 3 lines
The paragraph currently has `mb-2` which is too tight. Change to `mb-6` to give proper breathing room between the text and the buttons.

### 2. Shrink the navy container by 2cm top and bottom
The container currently has `py-3 lg:py-5`. Reduce to `py-1 lg:py-3` to cut approximately 2cm from both the top and bottom.

### Technical Changes

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

- Line 50: Change `py-3 px-6 lg:py-5 lg:px-8` to `py-1 px-6 lg:py-3 lg:px-8`
- Line 57: Change `mb-2` to `mb-6`

