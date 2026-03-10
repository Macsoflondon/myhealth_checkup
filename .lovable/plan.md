

## Plan: Interactive Gallery Modal with Test Detail Cards and About Popup

### What We're Building

Three interactive features for the GoodBody test gallery on the homepage:

1. **Enlarged Gallery Modal** -- Clicking a test image opens a full-screen dialog with the same hover-expand filmstrip behavior, but ~3x larger. Users can hover/scroll across tests at this enlarged size.

2. **Test Detail Card Popup** -- Clicking a specific test within the enlarged gallery opens a second dialog showing test details (name, description, price, biomarkers, booking link) fetched from Supabase via `findTestByIdOrSlug`. A "Book Now" button links out to the provider's website URL for that test.

3. **About Button & Popup** -- An "About" button added alongside the category tabs. Clicking it opens a dialog showing the GoodBody Clinic about content (reused from `GoodbodyClinicPage.tsx`'s `AboutSection`) in a scrollable modal.

All modals close when clicking outside (default Radix Dialog behavior).

### Technical Approach

#### Files to Modify

**`src/components/sections/GoodbodyTestGallery.tsx`** (primary changes):
- Add state for three dialogs: `galleryOpen`, `testDetailOpen`, `aboutOpen`
- Add state for `selectedTab` data to pass into the enlarged gallery modal
- Add an "About" button next to the tab navigation
- **Gallery Modal**: Uses `<Dialog>` with a wide `max-w-[90vw]` content area. Renders `<HoverExpand_001>` inside but with larger dimensions (desktop height ~84vh, expanded width ~81rem)
- **Test Detail Modal**: Triggered when a test is clicked inside the gallery modal. Fetches test data from Supabase using `findTestByIdOrSlug('goodbody-clinic', slug)`. Displays test name, description, price, biomarkers, and a "Book Now" button linking to the test's `url` field
- **About Modal**: Renders the about content (mission, services, contact) in a scrollable dialog

**`src/components/ui/expand-on-hover.tsx`**:
- Add an optional `onTestClick` callback prop so clicking a test can trigger the detail card popup
- The click handler on each panel calls `onTestClick(image)` instead of just setting active state, when the panel is already active (i.e., second click = select)

#### Data Flow

```text
Gallery (inline) 
  → click image → Gallery Modal (3x enlarged, same hover-expand) 
    → click active test → fetch from Supabase → Test Detail Card Modal
      → "Book Now" → external link (test.url from DB)
  
"About" button → About Modal (scrollable content)
```

#### Test-to-Database Mapping

Each gallery image has a `code` field (e.g., "Advanced Well Man"). We'll generate a slug from this (`advanced-well-man`) and use `findTestByIdOrSlug('goodbody-clinic', slug)` to fetch the test data including its booking `url`.

#### UI Details

- Gallery modal: dark overlay, rounded corners, close on outside click, close button
- Test detail card: centered modal (~max-w-lg), shows image, test name, description, price, biomarker count, "Book Now" button (links to `test.url` externally)
- About modal: ~max-w-3xl, scrollable, contains the existing about sections from GoodbodyClinicPage
- All use the existing `<Dialog>` component from Radix UI

