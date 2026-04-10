

## Change Text Colors to White on Dark Background (Provider Catalog Pages)

The catalog pages now use a dark background (`bg-tertiary`), but text in the header, sort bar, and empty state is still black/gray. This plan updates all non-card text to white.

### Files to edit

**1. `src/components/providers/ProviderCatalogHeader.tsx`**
- Line 66: `text-foreground` → `text-white` (provider name h1)
- Line 69: `text-muted-foreground` → `text-white/70` (tagline)
- Line 97, 103, 107: `font-semibold` spans → add `text-white`
- Line 114: `text-muted-foreground` → `text-white/70` (feature labels)
- Line 124: `text-muted-foreground` → `text-white/70` (filter icon)
- Line 125: `font-medium` → add `text-white` ("Filter by Category" label)
- Buttons (lines 75, 80): outline buttons → add white text/border styling

**2. `src/components/providers/CatalogSortBar.tsx`**
- Line 50: `text-gray-500` → `text-white/70` (result count text)
- Line 57: `text-gray-400` → `text-white/60` (sort icon)

**3. `src/pages/ProviderTestsCatalogPage.tsx`**
- Lines 143-145: Empty state text `text-gray-400`, default text, `text-gray-500` → `text-white/50`, `text-white`, `text-white/70`

### What stays unchanged
- Test cards (ProviderTestCard) — these have white backgrounds and keep their existing text colors
- Any text inside the test detail modal

