

## Why It Still Looks Wrong

I found the root cause. There are **two problems**:

1. **Desktop toolbar**: The current `bg-white/85` (85% opacity) still has visible transparency. For "mostly solid white" you need ~95% opacity so it reads as white with just a hint of depth.

2. **Mobile**: The mobile header has **no toolbar at all** -- it returns early with just the navy (`#081129`) header bar. There is no navigation toolbar rendered on mobile, so there's nothing to make "pearl white."

## Plan

### 1. Desktop toolbar -- increase opacity to near-solid white
In `src/components/layout/Header.tsx` line 85, change the toolbar classes:
- `bg-white/85` → `bg-white/95` (near-solid white, subtle depth)
- Keep `backdrop-blur-2xl` for the slight glass effect behind the 5% transparency
- Add `-webkit-backdrop-filter: blur(40px)` via inline style for Safari compatibility

### 2. Mobile header -- no changes needed (or clarify)
The mobile view currently shows a navy header with the logo and menu button. There is no separate navigation toolbar on mobile (navigation is in the drawer). If you want the mobile header background changed from navy to white as well, that would be a separate change -- but that would be a significant design departure from the current brand look.

### 3. Update knowledge memory
Update `navigation-toolbar` memory to reflect `bg-white/95` instead of `bg-white/70`.

**Files to edit:**
- `src/components/layout/Header.tsx` (line 85: change opacity class)

