# Remove General Wellness filter tabs + fix London Medical Laboratory Tiredness/Fatigue data

## Task 1: Remove subcategory filter tabs from General Wellness page

### Goal
Remove the horizontal tag-filter pill row (ALL / PREVENTIVE / ESSENTIAL / CRITICAL / WELLNESS / IMMUNE / SPECIALIST / ORGAN / ROUTINE) that sits below the main category toolbar on `/wellness`. Users can scroll directly to the category cards instead.

### Scope
- Only `src/pages/WellnessPage.tsx` is affected.

### Implementation
1. Delete the filter-related state and memoised values:
   - `const [filter, setFilter] = useState("ALL");`
   - `const [hoveredTag, setHoveredTag] = useState<string | null>(null);`
   - `const tags = useMemo(...)`
   - `const filtered = useMemo(...)`
2. Remove the entire "Filter pills" JSX block rendered above the cards grid.
3. Render the cards grid directly from `wellnessCategoryCards` instead of `filtered`, preserving existing card styling, hover behaviour, live counts, and routing.
4. Keep `tagColors` because each card still displays its own tag badge.

## Task 2: Fix London Medical Laboratory "Tiredness/Fatigue Profile" data

### Goal
Correct the LML Tiredness/Fatigue panel so the comparison table/card shows accurate biomarkers, pricing, and clinical-report inclusion.

### Scope
- Database row(s) for London Medical Laboratory's Tiredness/Fatigue test.
- Comparison/card display fields derived from `provider_tests`.

### Data corrections
- Biomarker count: 18 (currently 8).
- Base test-kit price: £99.
- In-clinic phlebotomy surcharge: +£35 (total £134).
- At-home phlebotomy surcharge: +£85 (total £184).
- Doctor's/clinical report: included (surface this in the comparison table).

### Implementation
1. Identify the active `provider_tests` row for LML Tiredness/Fatigue.
2. Update the row with the corrected biomarker list/count, base price, and collection surcharges via a Supabase migration.
3. Ensure the comparison table/card surfaces the "doctor's report included" flag.
4. Verify the route-specific pricing displays correctly on the card and detail page.

## Verification
- Run `bunx tsgo --noEmit` after code changes.
- Open `/wellness` and confirm the filter pills are gone and cards still render.
- Open the LML Tiredness/Fatigue test page/card and confirm 18 biomarkers, £99/£134/£184 pricing, and clinical-report inclusion.
