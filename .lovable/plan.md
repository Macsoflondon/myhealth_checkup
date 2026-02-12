

## Fix the "More" Dropdown Closing Prematurely on Mobile

### The Problem

When you tap "More" in the navigation toolbar and the dropdown appears, trying to tap on any item inside it causes the entire dropdown to close before you can make a selection. This forces you to reopen it repeatedly.

### Root Cause

The dropdown is closing because touch/click events inside the More dropdown are bubbling up to a document-level click listener in the navigation component. On mobile, this race condition means the dropdown closes before the item click registers. Additionally, there is a mobile backdrop overlay behind the dropdown that can intercept taps.

### The Fix

**1. Stop click events from escaping the More dropdown (`MoreDropdownMenu.tsx`)**

Add `onClick` and `onTouchStart` event handlers on the dropdown container that call `stopPropagation()`. This prevents any interaction inside the dropdown from reaching the document-level close handler, so the dropdown stays open while you browse.

**2. Prevent the mobile backdrop from intercepting dropdown taps (`NavigationMenu.tsx`)**

Add `pointer-events-none` to the backdrop when a dropdown is active, then use `pointer-events-auto` only on click areas outside the dropdown. Alternatively, raise the dropdown's parent wrapper z-index above the backdrop so taps hit the dropdown first, not the backdrop behind it.

### Technical Detail

- **`src/components/header/MoreDropdownMenu.tsx`**: Add `onClick={(e) => e.stopPropagation()}` and `onTouchStart={(e) => e.stopPropagation()}` to the root container `div` so no events leak to the parent document click handler.
- **`src/components/header/NavigationMenu.tsx`**: Ensure the `.nav-item-wrapper` for the More button has a z-index higher than the backdrop (`z-[99]` or `z-[100]`) so the dropdown receives taps directly on mobile. Also update the `handleClickOutside` to add a small delay or check for touch events to avoid the race condition.

### Result

The More dropdown will stay open while you browse sections and items. It will only close when you either tap the X button, tap outside the dropdown, or tap a final page link to navigate.

