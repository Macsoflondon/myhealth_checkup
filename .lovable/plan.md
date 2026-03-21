

## Plan: Fix Sports Performance Category Page

The user has 4 requests for the `/sports-performance` page (and the shared `CategoryPageLayout` used by all category pages):

### 1. White backgrounds for test category sections
- The cards grid section in `CategoryPageLayout.tsx` (line 185) uses `bg-muted/30` — change to `bg-white`
- The `CategoryHero` uses `bg-background` which is fine (already light)

### 2. Buttons: turquoise idle → pink on hover, white text
- The CTA button inside `UnifiedTestCard.tsx` (line 247-264) currently uses `categoryColor` with opacity change on hover — change hover to pink `#e70d69`
- The Search button in `CategoryHero.tsx` (line 57-62) uses turquoise but has navy text — change text to white and add pink hover
- The "Start Your Quiz" button in `CategoryPageBottom.tsx` already uses pink gradient — keep as-is

### 3. Text colors: white or dark blue
- Review text in the sections and ensure all visible text on light backgrounds is dark blue `#081129`, and text on dark backgrounds is white. The current implementation mostly follows this already.

### 4. Make test cards clickable — open a detail modal
This is the biggest change. Currently `UnifiedTestCard` has no click handler for the whole card. The category pages use static test data (not from DB), so we can't use the existing `ProviderTestDetailModal` directly (it expects `ProviderTestCardData` with DB fields).

**Approach:** Add an `onClick` prop to `UnifiedTestCard` and wire it up in `CategoryPageLayout` to open a simple detail modal showing the test's biomarkers, description, provider, price, and a CTA link.

### Files to modify:
1. **`src/components/cards/UnifiedTestCard.tsx`** — Add whole-card click handler, change button hover to pink
2. **`src/components/category/CategoryPageLayout.tsx`** — Change section background to white, add state for selected test + detail modal
3. **`src/components/category/CategoryHero.tsx`** — Button text color to white, hover to pink
4. **New: `src/components/category/CategoryTestDetailModal.tsx`** — Simple modal showing test details (name, description, biomarkers list, provider, price, collection method, turnaround, and CTA)

### Technical details:
- The detail modal will use the existing `Dialog` component from shadcn
- Card click opens modal; CTA button inside card still works independently (compare/external link)
- Modal will show all biomarker names, full description, and a "Book Now" or "View Test" button linking to the provider URL if available

