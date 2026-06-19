## Update navigation menu colors

**File:** `src/components/header/NavigationMenu.tsx`

**Changes (lines 99-103 and 118-120):**

1. **Regular nav items** (General Wellness, Women's Health, Men's Health, etc., plus Resources): change base text from turquoise `text-[#1a9baa]` → `text-white`. Keep hover state `hover:text-brand-pink` and the pink underline animation.

2. **"Most Popular Tests"** (the `hasAccent` highlighted item): currently pink (`text-brand-pink`). Change to turquoise `text-brand-turquoise` with `hover:text-brand-pink` so it flips to pink on hover. Keep `font-bold`.

No other files affected. Underline accent and layout remain unchanged.