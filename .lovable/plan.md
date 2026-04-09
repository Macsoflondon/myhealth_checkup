

## Plan: Single-Line Toolbar + Remove Dark Strip

### Problem
1. The navigation toolbar wraps to two lines at this viewport width because 8 items + "More" don't fit in one row
2. A dark strip (the bottom gradient divider) appears between the toolbar and the hero image

### Fix 1: Force toolbar to one line
**File: `src/components/layout/Header.tsx`** (line 162)

Change the NavigationItems className from `flex-wrap` to `flex-nowrap` so items stay on one line. The individual nav item text sizes already scale down at smaller breakpoints.

**File: `src/components/header/NavigationMenu.tsx`** (line 197)

Change the desktop flex container from `flex-wrap` to `flex-nowrap` to prevent wrapping.

### Fix 2: Remove bottom gradient divider
**File: `src/components/layout/Header.tsx`** (line 166)

Remove the bottom gradient divider line (`<div className="h-[3px] bg-gradient-to-r ...">`) that sits between the toolbar and the hero section. The top gradient divider above the toolbar stays.

### Scope
- 2 files modified: `Header.tsx`, `NavigationMenu.tsx`
- No visual or functional changes to anything else

