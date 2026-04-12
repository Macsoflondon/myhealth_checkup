

## Fix Goodbody Gallery Tab Text Colors

**Problem**: The tab navigation buttons (line 270-273) use `opacity-70` for inactive tabs, making them appear dull gray instead of bright white. There is no pink hover effect.

**File**: `src/components/sections/GoodbodyTestGallery.tsx`

### Changes

**Lines 269-273** - Update the tab button classes:
- Remove the opacity-based active/inactive logic
- Set all tabs to bright `text-white` by default
- Add `hover:text-brand-pink` for hover state
- Keep the active tab indicator (border) but use pink for the active state

**Line 260** - Update the "About" button similarly:
- Ensure `text-white` with `hover:text-brand-pink`

### Resulting styles
- **Default**: `text-white` (bright, no opacity reduction)
- **Hover**: `text-brand-pink`
- **Active tab**: stays white with underline indicator (or pink active state)

