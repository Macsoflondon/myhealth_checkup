# Remove the visible breadcrumb strip

## What changes

The white strip showing "Home / Compare Tests / Goals" above the page heading is the site breadcrumb, rendered automatically at the top of every non-home page. It sits awkwardly between the navy trust bar and the navy hero, creating the white band in the screenshot.

The visible strip is removed from all pages. The hidden BreadcrumbList structured data it emits is kept, so search engines still see the page hierarchy in results — removing that would lose breadcrumb rich snippets in Google.

No other navigation changes: the category toolbar, menu, and floating dock stay as they are.

## Technical notes

- `src/components/common/SiteBreadcrumb.tsx`: keep the JSON-LD `<Helmet>` block, drop the rendered `<nav aria-label="Breadcrumb">` markup and the now-unused breadcrumb UI imports.
- `src/layouts/MainLayout.tsx`: keep the component mounted (it supplies the JSON-LD) — no change needed there.
- Any page-level tests or checks asserting `data-testid="site-breadcrumb"` are updated to assert the structured data instead.
