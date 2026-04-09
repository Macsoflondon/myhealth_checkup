

# Plan: Biomarker Database Directory

## What we're building

A new `/biomarker-database` page with:
- Search bar for biomarker name/code lookup
- Category filter buttons (Cardiovascular, Vitamins & Minerals, Fertility, etc.)
- Alphabetical directory of biomarkers grouped by category
- Expandable cards showing description, clinical significance, normal ranges, related conditions
- Navigation link under More > Resources

The existing `biomarkers_library` Supabase table and `useBiomarkersLibrary` hook already provide the data layer — no database changes needed. You will upload biomarkers in batches of 20 which will be inserted into Supabase.

## Changes

### 1. New page: `src/pages/BiomarkerDatabasePage.tsx`

- Helmet with SEO meta tags and canonical URL
- Search input at top (filters by name, code, description)
- Category filter chips derived from the data (auto-populated from `useBiomarkersLibrary().categories`)
- Results grouped by category with collapsible sections
- Each biomarker card shows: name, code, category badge, description, unit, normal ranges (male/female), clinical significance, related conditions, lifestyle factors
- Loading skeleton and empty state
- Platform-standard styling: navy headings, turquoise accents, white cards

### 2. Add route: `src/routes/contentRoutes.tsx`

- Import `BiomarkerDatabasePage`
- Add `<Route path="/biomarker-database" element={<BiomarkerDatabasePage />} />`

### 3. Add navigation link: `src/components/header/NavigationItems.tsx`

- Add `{ name: "Biomarker Database", path: "/biomarker-database" }` to the Resources section in `moreNavigationSections`

### 4. Add OG meta entry: `plugins/ogMetaPlugin.ts`

- Add `/biomarker-database` route with title "Biomarker Database | myhealth checkup" and appropriate description

### 5. Biomarker data insertion

When you upload 20-biomarker blocks, they will be inserted into the existing `biomarkers_library` table via Supabase SQL migration. Each biomarker needs: `biomarker_name`, `biomarker_code`, `description`, `category`, and optional fields (unit, ranges, clinical significance, related conditions, lifestyle factors).

## Technical details

- Reuses existing `useBiomarkersLibrary` hook — no new data fetching code needed
- Client-side search and filtering (already implemented in the hook)
- No new dependencies
- 1 new file, 3 modified files

