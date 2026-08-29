# Fix hamburger menu showing alongside desktop toolbar

## Problem

In `src/components/layout/BrowseByCategoryBar.tsx` the three-line hamburger trigger is rendered at **every** breakpoint with no responsive hide class, while the desktop pill toolbar is gated with `hidden md:block`. On tablet (≈768–1024 px) and desktop (≥1024 px) the hamburger sits beside the full toolbar, so both navigation patterns are visible together.

## Goal

- **Desktop (≥1024 px):** show only the horizontal pill toolbar. The hamburger icon is hidden.
- **Tablet + mobile (<1024 px):** show the hamburger as the menu trigger. The desktop pill toolbar is hidden.
- Keep the existing floating sticky hamburger behaviour on scroll, but only for viewports that use the hamburger.

## Changes

1. **Gate the in-bar hamburger to tablet/mobile**
   - In `src/components/layout/BrowseByCategoryBar.tsx`, add `lg:hidden` to the container that holds the `SheetTrigger` hamburger inside `mobileBarRef` (around line 253).
   - This removes the hamburger from desktop while leaving it active on phone and tablet.

2. **Gate the desktop toolbar to desktop only**
   - Change the desktop toolbar wrapper class from `hidden md:block` to `hidden lg:block` (around line 358).
   - This hides the pill toolbar on tablet and below, so only the hamburger remains.

3. **Match the floating scroll trigger breakpoint**
   - The portalled floating hamburger currently uses `md:hidden` (around line 330). Update it to `lg:hidden` so it does not appear on desktop.

4. **No changes to menu contents**
   - The `SheetContent` drawer and its Account/Language/Test Categories/About sections stay exactly as they are.

## Verification

- Desktop viewport (≥1024 px): only the pill toolbar is visible; no three-line icon.
- Tablet viewport (768–1023 px): only the three-line hamburger is visible; tapping it opens the drawer.
- Mobile viewport (<768 px): same as tablet — hamburger only.
- Scroll on tablet/mobile: the floating hamburger appears once the brand bar scrolls out of view.
