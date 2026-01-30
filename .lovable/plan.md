

# Double the Header Logo Size

## Overview

Increase the logo size in the header by 2x on both mobile and desktop views.

---

## Current vs Updated Sizes

### Desktop (Line 95)

| Breakpoint | Current | Updated (2x) |
|------------|---------|--------------|
| Base | `h-16` (64px) | `h-32` (128px) |
| Large (lg) | `h-20` (80px) | `h-40` (160px) |
| XL | `h-24` (96px) | `h-48` (192px) |

### Mobile (Line 55)

| Breakpoint | Current | Updated (2x) |
|------------|---------|--------------|
| Base | `h-16` (64px) | `h-32` (128px) |
| XS+ | `h-20` (80px) | `h-40` (160px) |

---

## File to Modify

**`src/components/layout/Header.tsx`**

### Line 55 (Mobile logo):
```tsx
// Before
className="h-16 xs:h-20 w-auto object-contain drop-shadow-lg"

// After
className="h-32 xs:h-40 w-auto object-contain drop-shadow-lg"
```

### Line 95 (Desktop logo):
```tsx
// Before
className="h-16 lg:h-20 xl:h-24 w-auto object-contain"

// After
className="h-32 lg:h-40 xl:h-48 w-auto object-contain"
```

---

## Visual Summary

```text
Before:
┌──────────────────────────────────────────────┐
│ [Small Logo]   Tagline   [Controls]          │
│    64-96px                                   │
└──────────────────────────────────────────────┘

After:
┌──────────────────────────────────────────────┐
│ [LARGE LOGO]   Tagline   [Controls]          │
│   128-192px                                  │
└──────────────────────────────────────────────┘
```

