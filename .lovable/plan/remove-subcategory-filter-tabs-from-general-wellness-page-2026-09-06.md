# Remove subcategory filter tabs from General Wellness page

## Goal
Remove the horizontal tag-filter pill row (ALL / PREVENTIVE / ESSENTIAL / CRITICAL / WELLNESS / IMMUNE / SPECIALIST / ORGAN / ROUTINE) that sits below the main category toolbar on `/wellness`. Users can scroll directly to the category cards instead.

## Scope
- Only `src/pages/WellnessPage.tsx` is affected.
- No schema, route, or other page changes.

## Implementation
1. Delete the filter-related state and memoised values:
   - `const [filter, setFilter] = useState("ALL");`
   - `const [hoveredTag, setHoveredTag] = useState<string | null>(null);`
   - `const tags = useMemo(...)`
   - `const filtered = useMemo(...)`
2. Remove the entire "Filter pills" JSX block (the flex-wrapped button row rendered just above the cards grid).
3. Render the cards grid directly from `wellnessCategoryCards` instead of `filtered`, keeping all existing card styling, hover behaviour, live counts, and routing.
4. Keep `tagColors` because each card still displays its own tag badge using those colours.

## Verification
- Run `bunx tsgo --noEmit`.
- Open `/wellness` in the preview and confirm:
  - The pill row is gone.
  - All category cards still appear.
  - Cards remain clickable and styled as before.
