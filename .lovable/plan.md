

## Plan: Add Medichecks "About" Card in Featured Partners Section

### Current State
- GoodBody has a logo + "About" button that opens a modal with mission/services/contact info
- Medichecks section currently shows the logo, then "Unlock the Ultimate You" heading and descriptive paragraphs spread across a two-column layout with video
- No "About" card or button exists for Medichecks

### What Will Change

**File: `src/components/sections/PartnerShowcaseGrid.tsx`**

Restructure the Medichecks area (lines 93-155) to match the GoodBody pattern:

1. **Logo + About button row** — Show the Medichecks logo (same size as now) with an "About" button next to it, styled identically to GoodBody's About button (white text, turquoise border-bottom, Info icon)

2. **About dialog/modal** — Create a Dialog (same pattern as GoodBody's About modal in GoodbodyTestGallery.tsx) containing:
   - Medichecks logo + title in the header
   - "Unlock the Ultimate You" as a section heading
   - All four descriptive paragraphs currently in the two-column layout moved into the modal
   - "View Medichecks profile" button at the bottom
   - Video embed inside the modal

3. **Keep the video and "View Medichecks profile" button** in the main section as well, but consolidate the text content into the About card

4. **No changes** to any other section, page, or component

### Technical Details
- Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from `@/components/ui/dialog`
- Import `Info` icon from `lucide-react`
- Add `aboutOpen` state with `useState(false)`
- The About button sits in a nav row below the logo, mirroring GoodBody's tab bar layout
- Modal styled with the same warm background (`bg-[#f8f6f3]`) and typography as GoodBody's About modal

