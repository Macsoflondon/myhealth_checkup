

# Reduce Header Tagline Section Height

## What is changing

The header section containing the "Your Health. Your Choice. One Trusted Platform!" tagline will be made more compact by reducing vertical padding and spacing.

## Changes

**File: `src/components/layout/Header.tsx`**

### Desktop (line 87)
- Reduce the main header row vertical padding from `py-3 lg:py-4` to `py-1 lg:py-2` to trim the overall height.

### Mobile (lines 51, 66)
- Reduce the top row padding from `py-1.5 sm:py-2` to `py-1 sm:py-1.5`
- Reduce the bottom tagline row padding from `pb-2 sm:pb-3` to `pb-1 sm:pb-1.5`

These changes will reduce the header section by roughly four lines of vertical space across all viewports while keeping the tagline text, logo, and controls fully intact.

