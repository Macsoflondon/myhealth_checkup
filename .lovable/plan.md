

## Plan: Move Trust Signals Bar Inside Hero Section

**What changes**: Move the trust signals bar (UKAS-accredited labs, 200+ tests, etc.) from its current position as a separate `<section>` below the hero, to inside the hero — between the popular searches container and the bottom of the hero section.

**File**: `src/components/sections/Hero.tsx`

### Changes

1. **Remove** the standalone `<section className="bg-white py-3 sm:py-4">` trust signals block (lines 194–206).

2. **Insert** the trust signals inside the hero, after the search container (after line 188), styled for the dark hero background:
   - White text and white/70 icons instead of navy text and primary icons
   - Horizontal scrollable row on mobile, centered on desktop
   - Compact spacing with `mt-4 sm:mt-6` gap from the search box

The trust signals will sit just above the closing `</section>` of the hero, keeping them inside the overlay before the gradient border divider.

