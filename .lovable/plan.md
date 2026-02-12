

## Replace Breadcrumbs with Home and Back Icon Buttons

### What changes

Every page currently shows a breadcrumb trail (e.g. "Home > Compare Tests > Hormone Tests") and a text-based "Back to Home" link. All of that will be removed and replaced with **two small square icon buttons side by side, aligned to the right**, positioned in the same spot (below the hero section). The floating circular buttons on the right edge of the screen will also be removed.

The buttons will be:
- **Home** (house icon) -- navigates to `/`
- **Back** (left arrow icon) -- navigates to the previous page

Styling: turquoise (`#22c0d4`) background, turning pink (`#e70d69`) on hover, white icons, rounded-lg (square with rounded corners, not circles).

---

### 1. Rewrite `PageBreadcrumb` component

The file `src/components/common/PageBreadcrumb.tsx` will be rewritten to render two square icon buttons (Home + Back) aligned to the right instead of the breadcrumb trail and text back link. Since PageBreadcrumb is already used in ~30 pages in the correct position (below the hero), all those pages will automatically get the new buttons without any per-page edits.

The component will keep its existing props interface so nothing breaks, but the rendered output will change to just the two icon buttons in a right-aligned row.

### 2. Remove floating `PageNavButtons` from `App.tsx`

The global floating `PageNavButtons` component (the circular buttons fixed to the right side of the screen) will be removed from `App.tsx` since the inline buttons in `PageBreadcrumb` now serve the same purpose in the correct position.

### 3. No changes to `BackToTop`

The scroll-to-top button at the bottom-right remains as-is with its turquoise-to-pink colour scheme.

---

### Technical Detail

- **Edit `src/components/common/PageBreadcrumb.tsx`**: Replace the breadcrumb trail and text back button with a `flex justify-end` container holding two `40x40` square buttons (`rounded-lg`, `bg-[#22c0d4]`, `hover:bg-[#e70d69]`, white icons). Home uses a `Link` to `/`, Back uses `useNavigate(-1)`.
- **Edit `src/App.tsx`**: Remove the `PageNavButtons` import and its `<PageNavButtons />` usage from the router tree.
- **No page-level files need editing** -- all ~30 pages already render `PageBreadcrumb` in the right spot.

