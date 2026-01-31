

# Resize Tagline Slogans to Fit Evenly Across Header

## Overview

Adjust the three tagline slogans ("Your Health.", "Your Choice.", "One Trusted Platform!") to fit evenly on one line across the header bar on both desktop and mobile views.

---

## Current Issue

The tagline is absolutely positioned in the center of the header. With the larger logo sizes (h-32 to h-48), the available space is constrained. The current fixed text sizes may cause the tagline to overlap or not display properly on all screen sizes.

---

## Proposed Solution

### Desktop (Lines 100-107)

| Change | Current | Updated |
|--------|---------|---------|
| Text sizing | `text-lg lg:text-xl xl:text-2xl` | `text-base lg:text-lg xl:text-xl` |
| Letter spacing | `tracking-wide` | `tracking-normal lg:tracking-wide` |

This reduces the text size slightly to ensure it fits between the logo and controls without overlapping.

### Mobile (Lines 69-75)

| Change | Current | Updated |
|--------|---------|---------|
| Text sizing | `text-sm xs:text-base` | `text-xs xs:text-sm sm:text-base` |
| Whitespace | No constraint | `whitespace-nowrap` |

Smaller base size ensures it stays on one line on very small screens.

---

## File to Modify

**`src/components/layout/Header.tsx`**

### Desktop Tagline (Line 102):
```tsx
// Before
<p className="text-lg lg:text-xl xl:text-2xl font-bold tracking-wide text-center whitespace-nowrap">

// After
<p className="text-base lg:text-lg xl:text-xl font-bold tracking-normal lg:tracking-wide text-center whitespace-nowrap">
```

### Mobile Tagline (Line 70):
```tsx
// Before
<p className="text-sm xs:text-base font-bold tracking-wide text-center">

// After
<p className="text-xs xs:text-sm sm:text-base font-bold tracking-wide text-center whitespace-nowrap">
```

---

## Visual Summary

```text
Before (may overflow):
┌─────────────────────────────────────────────────────────┐
│ [LARGE LOGO]  Your Health. Your Choice. One...  [Ctrl] │
│   128-192px     (text may overlap or wrap)              │
└─────────────────────────────────────────────────────────┘

After (fits evenly):
┌─────────────────────────────────────────────────────────┐
│ [LARGE LOGO]  Your Health. Your Choice. One...  [Ctrl] │
│   128-192px     (properly sized, single line)           │
└─────────────────────────────────────────────────────────┘
```

---

## Changes Summary

| Location | Change |
|----------|--------|
| Desktop tagline (line 102) | Reduce text size from `text-lg/xl/2xl` to `text-base/lg/xl` |
| Desktop tagline (line 102) | Adjust tracking from `tracking-wide` to `tracking-normal lg:tracking-wide` |
| Mobile tagline (line 70) | Reduce text size from `text-sm/base` to `text-xs/sm/base` |
| Mobile tagline (line 70) | Add `whitespace-nowrap` to prevent wrapping |

