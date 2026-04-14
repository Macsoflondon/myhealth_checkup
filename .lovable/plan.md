

## Plan: Fix Trust Signals to Single Line

The trust signal items are wrapping because the text inside each item can break across two lines ("200+ tests available", "200+ clinics nationwide", etc.). 

### Changes to `src/components/sections/Hero.tsx`

**Line 198**: Add `whitespace-nowrap` to each trust signal item and reduce font size by one step:
- From: `text-lg sm:text-xl md:text-2xl`
- To: `text-base sm:text-lg md:text-xl`

**Line 200**: Add `whitespace-nowrap` to the span text.

This ensures each label stays on one line while fitting all 5 items across the row.

