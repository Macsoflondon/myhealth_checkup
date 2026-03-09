

## Plan: Replace WellnessPage Category Section

### What changes

**File: `src/pages/WellnessPage.tsx`**

1. **Add tricolor gradient divider** after the "Why Choose Wellness Testing" section (after line 107), using the project's standard pattern:
   ```html
   <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
   ```

2. **Replace the "Browse Tests by Category" section** (lines 109-157) with the user's provided code. This is a white-background section with:
   - Filter pills for category tags (PREVENTIVE, ESSENTIAL, CRITICAL, etc.)
   - Dark navy cards (`#0a1120`) with hover effects
   - Inline styles matching the `/test-categories` page aesthetic
   - The provided code is cut off at the end of the CTA button `style` prop -- I will complete the truncated `display: "inline-block"` closing and the remaining JSX (closing tags for the button, card div, grid, and outer container)

3. **Keep footer and existing layout intact** -- only the category grid section is replaced.

### Technical notes
- The provided code uses `useState` with hover/filter state -- these will be added to the component
- The existing `wellnessCategories` import and Card/Button imports for that section become unused and will be cleaned up
- Cards will link to `/tests/{category-id}` using `Link` wrappers (matching the `/test-categories` page pattern) rather than plain `div`s with `onClick`

