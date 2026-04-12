

## Reshape FloatingNavDock: Square Buttons, Vertical Stack

**Problem**: The floating nav buttons (Home, Back, Top) are round (`rounded-full`) and laid out horizontally in a pill. The user wants them to match the header's language/login button shape (`rounded-lg`, 36x36 square) and be stacked vertically. The Top button should appear above Home when scrolled, then disappear at the top.

**File**: `src/components/common/FloatingNavDock.tsx`

### Changes

**Button shape**: Change `rounded-full` to `rounded-lg` on all buttons, and change `w-12 h-12` to `!h-9 !w-9` to match the header buttons (36x36px with `rounded-lg`). Add `border-2 border-[#e70d69]` and use the same color scheme as header buttons: `text-[#e70d69] hover:text-white hover:bg-[#e70d69]` with a transparent/navy background.

**Layout**: Change the container from horizontal (`flex items-center gap-0 rounded-full`) to vertical (`flex flex-col items-center gap-2 rounded-xl`). Stack order from bottom: Back, Home. When scrolled, Top appears on top of the stack.

**Homepage**: Same square shape for the standalone Top button.

**Tooltip labels**: Reposition from `-top-9` to side (`-left-12` or similar) since buttons are now vertical.

### Resulting stack (non-home, scrolled)
```text
 [Top]
 [Home]
 [Back]
```

When not scrolled:
```text
 [Home]
 [Back]
```

