

## Plan: Create Standalone Test Categories Page

Create a new page component `src/pages/TestCategoriesPage.tsx` that renders the test categories grid as a full standalone page (not just a homepage section). This page will reuse the existing category data and card design from `TestCategories.tsx`, wrapped in the standard page layout with a hero header, breadcrumbs, and proper routing.

### Changes

**1. Create `src/pages/TestCategoriesPage.tsx`**
- Full-page version with a hero/header section (navy background, heading, subtitle)
- Breadcrumb navigation (Home > Test Categories)
- The same 9-category card grid from the existing section component
- SEO meta tags via `react-helmet-async`
- Uses the same `CategoryCard` component pattern and category data

**2. Add route in `src/App.tsx`**
- Add route: `/test-categories` → `TestCategoriesPage`

### Notes
- File will be `.tsx` (not `.jsx`) to match the project's TypeScript convention
- Reuses the existing card design and category data inline (same as the section component)
- Page-level layout includes breadcrumbs and proper spacing, unlike the section version which is embedded in the homepage

