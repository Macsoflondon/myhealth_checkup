## Plan: Restore Active Lifestyle Hero Slide & Remove Man-on-Phone Slide

The current hero has three slides:
1. Man on phone in park (to be removed)
2. Elderly couple walking in park (keep)
3. Results on phone (keep)

The user wants slide 1 replaced with the "woman jogging at sunrise" active-lifestyle image that was previously deleted.

### Steps

1. **Regenerate desktop active-lifestyle image**
   - Generate a 1920×1088 premium photorealistic image: woman jogging at sunrise, active lifestyle, health and wellness theme
   - Upload via `lovable-assets create` → `src/assets/hero/hero-active-lifestyle.jpg.asset.json`

2. **Regenerate mobile active-lifestyle image**
   - Generate a 1280×1600 premium photorealistic image: same woman jogging theme, portrait crop
   - Upload via `lovable-assets create` → `src/assets/hero/mobile/hero-mobile-active.jpg.asset.json`

3. **Update `src/components/sections/Hero.tsx`**
   - Replace the `hero-man-phone-park` and `hero-mobile-man-phone` imports with the new active-lifestyle asset imports
   - Update `heroSlides[0]` to use the active-lifestyle images, headline, alt text, and object-position values from the original active-lifestyle slide
   - Keep slides 2 (elderly couple) and 3 (results) unchanged

4. **Update `src/pages/Index.tsx`**
   - Replace `heroSlide1Desktop` and `heroSlide1Mobile` imports/preloads to point to the new active-lifestyle assets

5. **Clean up**
   - Delete the unused asset pointers: `hero-man-phone-park.jpg.asset.json` and `hero-mobile-man-phone.jpg.asset.json`
