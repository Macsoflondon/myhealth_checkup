

# Adjust Goodbody Slogan Spacing and Line Break

## What will change

1. The gap between the Goodbody logo and its slogan will be reduced further (currently `mb-1`, will become `mb-0`)
2. The slogan will be reformatted so "Know more." appears on the first line and "Live Better." appears on the second line

## Technical details

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

1. **Reduce logo margin further** (line 21): Change `mb-1` to `mb-0` on the logo image to close the remaining gap
2. **Add line break in heading** (line 24): Change the `<h3>` content from `Know more. Live Better.` to `Know more.<br />Live Better.` so "Live Better." starts on a new line

