

## Restore Popular Search Buttons to Standard Style

**File:** `src/components/sections/Hero.tsx` (line ~178)

Change the button className from:
```
text-[#081129] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] rounded-full transition-colors duration-300 font-medium
```
to:
```
text-white bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] rounded-full transition-colors duration-300 font-medium
```

This restores bright turquoise buttons with white text, matching the standard button interaction pattern.

