

## Plan: Move Hero Content Up and Enlarge H1

**File**: `src/components/sections/Hero.tsx`

### Changes

1. **Reduce top padding** on line 105 to pull all content closer to the toolbar:
   - From: `pt-28 pb-22 sm:pt-36 sm:pb-28 md:pt-44 md:pb-32`
   - To: `pt-16 pb-22 sm:pt-20 sm:pb-28 md:pt-24 md:pb-32`

2. **Enlarge the H1 font sizes** on line 117 by two steps at each breakpoint:
   - From: `text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.3rem] xl:text-[3.5rem]`
   - To: `text-[2.4rem] sm:text-[3rem] md:text-[3.6rem] lg:text-[4rem] xl:text-[4.2rem]`

