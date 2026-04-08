

## Plan: Increase Hero Section Height

The hero images fill the `<section>` container, which gets its height from the inner content padding. To make the hero taller by ~3-4 lines (~48-64px), increase the vertical padding on the content wrapper.

### Change

**File: `src/components/sections/Hero.tsx`** (line 103)

Current padding:
```
pt-10 pb-6 sm:pt-14 sm:pb-8 md:pt-16 md:pb-10
```

New padding (increased by ~4rem total):
```
pt-14 pb-10 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16
```

This adds roughly 3-4 extra lines of vertical space, making the hero images visibly taller across all breakpoints. No other changes needed — the images already use `absolute inset-0 w-full h-full object-cover` so they automatically fill the larger area.

