

## Unify Top/Home/Back navigation across the platform

The FloatingNavDock in `App.tsx` already renders globally on every page with the correct behavior (Top-only on homepage, Top+Home+Back on internal pages). The issue is that some pages have their own duplicate navigation buttons that conflict or overlap.

### Pages with duplicate navigation to remove

1. **FAQsPage.tsx** — Has its own fixed "Back to Top" button (line 515) and scroll state management (`showBackToTop`, `scrollToTop` function). Remove the button and clean up the unused state/effects/imports (`ArrowUp`, `showBackToTop`, `scrollToTop`). Also remove the inline "Back to Top" button in the search results area (line 406).

2. **WellnessPage.tsx** — Has inline Home and Back buttons (lines 155-169) positioned absolutely in the hero area. Remove these buttons and clean up unused imports (`Home`, `ArrowLeft`, `navigate`).

3. **BackButton.tsx** (`src/components/ui/BackButton.tsx`) — Standalone BackButton component. Not currently imported anywhere, but should be deleted to prevent future use and enforce the FloatingNavDock as the single pattern.

### What stays unchanged

- **FloatingNavDock.tsx** — Already correct. Homepage: Top-only on scroll. Internal pages: Top + Home + Back stack.
- **ScrollToTop.tsx** — This auto-scrolls on route change (different purpose), stays.
- **AdminTestDashboardPage.tsx** — Uses ArrowUp for sort indicators, not navigation. Stays.

### Summary of changes

| File | Action |
|------|--------|
| `src/pages/FAQsPage.tsx` | Remove fixed back-to-top button, scroll state, and inline "Back to Top" button |
| `src/pages/WellnessPage.tsx` | Remove inline Home/Back buttons from hero area |
| `src/components/ui/BackButton.tsx` | Delete file |

