# Revert mobile menu trigger to plain three-line icon

## Goal
Remove the circular "dish" button styling around the mobile hamburger trigger and return to the original plain three coloured accent lines as the menu control.

## What will change

1. **Remove the round button container**
   - Strip `rounded-full`, `bg-white/95`, `backdrop-blur-sm`, `shadow-[...]`, and `border` classes from the floating trigger button in `src/components/layout/BrowseByCategoryBar.tsx`.
   - Keep the three horizontal bars (navy, pink, turquoise) with their current widths/heights and right-aligned sizing.
   - Ensure the hit area remains at least 44 × 44 px for touch accessibility without the visual dish.

2. **Preserve existing behaviour**
   - The trigger stays fixed in the top-right corner at the current `top-16 right-4` position.
   - It continues to open the same `Sheet` drawer containing Language, Test Categories, and More sections.
   - No changes to desktop layout, language placement, or menu content.

## Files to touch

- `src/components/layout/BrowseByCategoryBar.tsx` — restyle the `SheetTrigger` button to remove circular button chrome.

## Verification

- Mobile viewport (390px): the trigger renders as three plain horizontal coloured lines, not inside a white circle.
- Tapping the lines opens the mobile menu drawer.
- The trigger remains visible and reachable while scrolling.
- No visual overlap with the wordmark or category ticker.
