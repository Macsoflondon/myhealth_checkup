

## Change Popular Tests Page Background to Pearl White

The page currently has `bg-[#081129]` (navy) on the hero section (line 21), the main content area (MostPopularTestsPage line 31), and the tests grid section (line 87). These need to switch to the site's standard pearl white background.

### Changes

**1. `src/pages/MostPopularTestsPage.tsx`**
- Line 31: Change `bg-[#081129]` to `bg-background` on the `<main>` element

**2. `src/components/tests/MostPopularTests.tsx`**
- Line 21 (Hero section): Change `bg-[#081129]` to `bg-background`
- Lines 24-31: Update text colors from `text-white` to `text-foreground` / `text-muted-foreground` so they're readable on a light background
- Line 87 (Tests section): Change `bg-[#081129]` to `bg-background`
- Line 91: Update the sort dropdown styling from navy/white to light theme colors
- Lines 102-103: Update loading spinner text from `text-white` to `text-foreground`
- Lines 106-109: Update error state text from `text-white` to `text-foreground`
- Line 146: Keep the CTA button as-is (pink)

**Will NOT touch:** The `UnifiedTestCard` components or their grid layout.

