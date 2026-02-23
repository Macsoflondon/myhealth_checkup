

## Fix: Centre Navigation Buttons Between Logo and Right Edge

### Problem
The code structure is correct (three-column layout with `flex-1 | logo | flex-1`), but the logo at h-40 to h-56 (160-224px tall with proportional width) consumes most of the container width. This leaves very little space in the right `flex-1` column, so the buttons appear right-aligned even though they are technically centred in that narrow remaining space.

### Solution
Remove the `container` constraint on the header bar so the layout spans the full viewport width. This gives the right `flex-1` column much more room, making the centring of the buttons visually obvious.

### Changes to `src/components/layout/Header.tsx`

**Line 85**: Remove the `container mx-auto` wrapper so the flex layout uses the full viewport width, keeping only horizontal padding for breathing room.

Current:
```html
<div className="container mx-auto px-4 lg:px-8 xl:px-12">
```

Change to:
```html
<div className="px-4 lg:px-8 xl:px-12">
```

This single change gives the right-side `flex-1` column the full remaining viewport width after the logo, ensuring the two buttons sit visibly centred between the logo's right edge and the browser edge.

### No other files affected
- Mobile header is unaffected (separate code path)
- Navigation toolbar below remains unchanged
