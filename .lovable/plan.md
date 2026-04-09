

## Plan: Condense "Your Health Journey Simplified" Section

### 1. Reduce vertical spacing
**File: `src/components/sections/JourneySimplified.tsx`**

- Reduce heading bottom margin from `mb-8 sm:mb-10 md:mb-12 lg:mb-16` to `mb-4 sm:mb-6 md:mb-8`
- Reduce icon badge bottom margin from `mb-6` to `mb-3`
- Reduce title bottom margin from `mb-3` to `mb-2`
- Reduce grid gap from `gap-8 lg:gap-12` to `gap-6 lg:gap-8`

### 2. Tighten description text to fit within 3 lines

Rewrite descriptions to be shorter and avoid orphan words:

- Step 1: `"Search by symptom, condition, or browse test categories to find the right test."` (removes "comprehensive" and trailing "for you")
- Step 2: `"Compare prices, turnaround times, sample types, and inclusions side by side."` (shorter, no orphan)
- Step 3: `"Book directly with your chosen provider. No middlemen, no markup."` (removes "just confidence" orphan line)

Also reduce `max-w-xs` to `max-w-[260px]` to keep text blocks tighter.

### Scope
- One file only: `src/components/sections/JourneySimplified.tsx`
- No other sections, components, or styles touched

