## Plan: Condense hero stat cards with icon-left layout

### What will change
In `src/components/sections/HeroMasthead.tsx`, the four stat cards at the bottom of the hero section will switch from a vertical stack (icon → value → label) to a compact horizontal row (icon left, value+label right). The cards themselves will be shrunk to roughly half their current footprint.

### Layout change (each card)
```
Current:  vertical stack inside a card
[  icon  ]
 100%
UKAS-accredited labs

Proposed: horizontal row, icon + text side-by-side
[icon]  100%
        UKAS-accredited labs
```

### Sizing adjustments per card
| Property | Current | Proposed |
|---|---|---|
| Card padding | `p-3` | `p-2` |
| Icon wrapper | `w-[28px] h-[28px]` | `w-[22px] h-[22px]` |
| Icon SVG | `w-[15px] h-[15px]` | `w-[12px] h-[12px]` |
| Value text | `text-[18px]` | `text-[14px]` |
| Label text | `text-[11px]` | `text-[9px]` |
| Grid gap | `gap-2.5` | `gap-2` |

### Implementation details
- Each card becomes `flex flex-row items-center gap-2` instead of the current block layout.
- The icon wrapper stays a rounded coloured box but is smaller.
- The value and label sit inside a nested `flex flex-col` to the right of the icon.
- No changes to data/content — same four stats, same colours.
- No other components touched.

### Verification
Screenshot the hero section to confirm all four cards sit compactly in one row and the overall hero fits within a single viewport.