

# Move "Most Popular Tests" off Homepage & Make Nav Link a Direct Redirect

## What changes

1. **Remove `MostPopularTestsSection` from the homepage** (`src/pages/Index.tsx`)
   - Delete the import and the `<MostPopularTestsSection />` render on line 130.

2. **Change "Most Popular Tests" nav item from dropdown to direct link** (`src/components/header/NavigationItems.tsx`)
   - Set `hasDropdown: false` and `megaMenu: false` on the "Most Popular Tests" entry so clicking it navigates straight to `/popular-tests` instead of opening a mega menu.

3. **Remove the "Most popular tests" entry from mega menu data** (`src/components/header/MegaMenu.tsx` and `src/components/header/MobileMegaMenu.tsx`)
   - Delete the static "Most popular tests" item from the mega menu categories array in both files, since it no longer needs a dropdown panel.

4. **Mobile navigation** — ensure the mobile drawer also treats "Most Popular Tests" as a direct link rather than an expandable accordion section.

## Files affected
- `src/pages/Index.tsx` — remove section
- `src/components/header/NavigationItems.tsx` — change flags
- `src/components/header/MegaMenu.tsx` — remove entry
- `src/components/header/MobileMegaMenu.tsx` — remove entry

The existing `/popular-tests` route and `MostPopularTestsPage` already exist and will continue to serve the full page with the test cards grid.

