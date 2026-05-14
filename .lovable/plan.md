## Shrink test kit images and enlarge GOODBODY logo in Featured Partner section

### Problem
The test kit tile images in `GoodbodyBentoShowcase.tsx` currently fill their containers (`w-full h-full`), making them visually dominant. The GOODBODY logo in the center tile is undersized relative to the space available.

### Changes

1. **Shrink test kit images**
   - In `KitTile`, change the `<img>` from `w-full h-full` to `w-[85%] h-[85%]` so each kit image is ~15% smaller, creating breathing room inside each tile and reducing overall visual weight.

2. **Enlarge GOODBODY logo 4x**
   - Current: `h-12 sm:h-16 md:h-20`
   - New: `h-48 sm:h-64 md:h-80`
   - This fills the center `row-span-2` tile properly and gives the brand logo the visual prominence the user wants.

### Files touched
- `src/components/sections/GoodbodyBentoShowcase.tsx` only

### Visual result
- Test kit tiles have smaller, inset images.
- Center GOODBODY logo tile becomes the dominant visual anchor of the grid.
