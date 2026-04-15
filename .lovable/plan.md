

## Plan: Narrow the Hero Search Container

**What changes**: Reduce the search/popular-searches container in the Hero section from `max-w-[1140px]` to `max-w-[855px]` (75% of current width).

**File**: `src/components/sections/Hero.tsx`

**Change**: On line ~123, update:
```
max-w-[1140px]  →  max-w-[855px]
```

This affects the glass-style search box and the "Popular Searches" section beneath it. The headline, subline, and CTA buttons above remain at `max-w-[1240px]`.

