# Branded test tiles on toolbar category pages

## What you asked for
- Tests listed on category pages reached via the toolbar dropdown should display as the branded tile in your screenshot: navy-to-turquoise gradient background, provider logo on a white chip, test name in white, "View details" pill top-right, and a white caption bar with test name, provider and pink price.
- Tapping a tile still opens the existing test information card (detail modal) exactly as it does today.
- Homepage sections ("Most popular tests", "Test of the week", provider showcases) keep showing real test-kit product images — unchanged.

## Current state (verified)
- All toolbar category destinations — /wellness, /womens-health, /mens-health, /sports-performance, /fertility-tests, /tests/cancer, /at-home-tests — render their test listings through `CategoryPageLayout` → `UnifiedTestCard` → `UniversalTestCard`.
- `UniversalTestCard` already contains exactly the branded tile from your screenshot, but only as a *fallback* when a test has no `image_url`. The default face today is the kit product photo.
- Homepage sections (`HeroPopularTests`, `MostPopularTestsSection`, `DreamHealthShowcase`, `ClinicTestsSection`) render `UniversalTestCard` directly with kit images.

## Changes

### 1. `src/components/cards/UniversalTestCard.tsx`
- Add an optional prop `defaultFace?: "image" | "brand"` (default `"image"`).
- `"image"` = current behaviour (kit photo at rest, info card on hover).
- `"brand"` = at-rest layer always renders the branded gradient tile (existing fallback markup: navy `#081129` → turquoise gradient, white logo chip, white test name), keeping the caption strip (name / provider / £ price) and the "View details" pill.
- Hover/focus crossfade to the detail card and tap-to-open modal logic are untouched — identical interaction on both faces.

### 2. `src/components/cards/UnifiedTestCard.tsx`
- Accept and pass through `defaultFace`.

### 3. `src/components/category/CategoryPageLayout.tsx`
- Pass `defaultFace="brand"` to `UnifiedTestCard` so every toolbar-reached category listing uses the branded tile.

### No changes to
- Homepage sections and any other `UniversalTestCard` callers — they default to `"image"` (kit photos).
- The detail modal, comparison drawer, pricing, or any data hooks.

## Verification
- Typecheck + lint.
- Playwright check on `/wellness?subcategory=thyroid` and `/tests/cancer`: tiles show logo tile; tap opens the info modal; homepage sections still show kit images.
