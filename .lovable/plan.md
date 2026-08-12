# Plain three-line mobile menu trigger

## Goal
Remove all button-shaped chrome from the mobile hamburger trigger so only the three coloured accent lines remain, sitting idle at the top-right of the page.

## What will change

1. **Strip button styling from the trigger**
   - In `src/components/layout/BrowseByCategoryBar.tsx`, remove `rounded-full`, `bg-white/95`, `backdrop-blur-sm`, `shadow-[...]`, `border`, and any visual padding that creates the circular dish.
   - Keep the three horizontal bars (navy, pink, turquoise) with their current widths, heights, and colours.
   - The lines themselves become the only visible trigger element.

2. **Maintain touch target and position**
   - Keep the trigger fixed at the current top-right coordinate.
   - Preserve a minimum 44 × 44 px invisible hit area around the lines so the control remains easy to tap.
   - Keep the existing `Sheet` behaviour and drawer contents unchanged.

3. **No other changes**
   - Desktop layout, language switcher placement, and menu content all stay as they are.

## Files to touch

- `src/components/layout/BrowseByCategoryBar.tsx`

## Verification

- Mobile viewport: only the three coloured lines are visible in the top-right corner, with no circular or rectangular button background.
- Tapping the lines opens the mobile menu.
- Trigger remains reachable while scrolling and does not overlap the wordmark.
