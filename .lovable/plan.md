

## Plan: Update "View all tests" Button to Platform Standard

**File: `src/components/tests/MostPopularTests.tsx`** (line 93)

Change the button from pink-idle/turquoise-hover to turquoise-idle/pink-hover with navy border, matching the platform button standard.

**From:**
```
bg-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-turquoise))] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-medium rounded-full w-full sm:w-auto
```

**To:**
```
bg-[#22c0d4] hover:bg-[#e70d69] text-white border-2 border-[#081129] px-6 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg font-semibold rounded-xl min-h-[52px] shadow-lg transition-colors duration-300 w-full sm:w-auto
```

This aligns with the standard: turquoise idle, pink hover, navy border, rounded-xl, min-h-[52px] touch target, font-semibold.

