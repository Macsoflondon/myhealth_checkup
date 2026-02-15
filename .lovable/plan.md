

# Move Goodbody Card and Video Closer to the Section Heading

## What is changing

The gap between the "Our Featured Partners" heading and the top row (Goodbody card + video) will be reduced by tightening the heading's bottom margin.

## Changes

**In `src/components/sections/PartnerShowcaseGrid.tsx`:**

- Reduce the `SectionHeading` component's `className` margin from `mb-8 sm:mb-10` to `mb-3 sm:mb-4`. This pulls the Goodbody card and video up closer to the heading by roughly five lines.

No other elements are touched.

