

## Complete Platform Optimisation

### 1. Hero Headline Font Size Refinement
**File**: `src/components/sections/Hero.tsx`
- Reduce desktop sizes: `lg:text-[2.5rem] xl:text-[2.75rem]` (from current `lg:text-[2.75rem] xl:text-[3.25rem]`)
- Reduce mobile base size: `text-[1.05rem]` (from `text-[1.1rem]`)
- Add `max-w-[320px] sm:max-w-none` to the H1 for controlled mobile wrapping

### 2. CLS (Layout Shift) Fix
**File**: `src/components/sections/Hero.tsx`
- Add `width={1920} height={1080} fetchpriority="high"` to the hero background image

### 3. Wasted Preloads Cleanup
**File**: `index.html`
- Remove the two unused `hero-bg-pink-tubes` preload links (lines 45-46)

**File**: `src/hooks/usePerformanceOptimization.ts`
- Remove unused Inter font preload
- Remove two unused image preloads

### 4. Deprecated Meta Tag
**File**: `index.html` - Change `apple-mobile-web-app-capable` to `mobile-web-app-capable`
**File**: `src/pages/Index.tsx` - Same fix in Helmet

### 5. Mobile Navigation Drawer Fix
**File**: `src/components/header/MobileNavigationDrawer.tsx`
- Increase `max-h-[500px]` to `max-h-[800px]` on primary nav dropdowns
- Increase `max-h-[400px]` to `max-h-[800px]` on "More" section dropdowns

---

### Files Changed

| File | Changes |
|---|---|
| `src/components/sections/Hero.tsx` | Reduce lg/xl font sizes, add mobile max-w, add image dimensions |
| `index.html` | Remove 2 unused preloads, fix deprecated meta tag |
| `src/hooks/usePerformanceOptimization.ts` | Remove unused font and image preloads |
| `src/pages/Index.tsx` | Fix deprecated meta tag |
| `src/components/header/MobileNavigationDrawer.tsx` | Increase max-h on expandable dropdowns |

