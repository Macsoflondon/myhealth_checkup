Homepage toolbar/divider polish

Goal
Tighten the visual relationship between the white category-toolbar band and the hero image, make the toolbar buttons pop more, and ensure the pink boundary lines are visible.

Changes
1. Single, consistent divider
   - Remove the separate `border-t` divider currently rendered above the toolbar in `HeroMasthead.tsx`.
   - Rely on the white toolbar band's bottom pink border as the sole element separating the toolbar from the hero image.
   - Audit and align any margins so the white band sits flush against the hero with no double spacing or mismatched border colour.

2. Darker toolbar-button shadow
   - In `BrowseByCategoryBar.tsx`, increase the alpha/density of the dock shadow for `placement === "hero"` so the white buttons lift visibly off the white band ("pops more / brighter").

3. Thicker pink boundary lines
   - Increase the white toolbar band's top and bottom pink borders by one Tailwind step (e.g. `border-b` → `border-b-2`, and the equivalent top border).
   - Keep the brand pink colour `#e70d69` unchanged.

Files to edit
- `src/components/sections/HeroMasthead.tsx`
- `src/components/layout/BrowseByCategoryBar.tsx`

Verification
- Build the project and check the homepage at desktop and mobile breakpoints.
- Confirm one clean pink line separates the white toolbar band from the hero image, the toolbar buttons cast a visible shadow, and both pink borders are clearly perceptible.
