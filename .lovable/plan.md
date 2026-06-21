## Add 4 new images to hero carousel, rotate every 15s

### Steps

1. **Upload the 4 uploaded screenshots as Lovable Assets** (clinic reception, senior couple walking, man on bench with phone, blood test kit):
   - `src/assets/hero/hero-clinic-reception.png.asset.json`
   - `src/assets/hero/hero-senior-couple.png.asset.json`
   - `src/assets/hero/hero-bench-phone.png.asset.json`
   - `src/assets/hero/hero-blood-test-kit.png.asset.json`

2. **`src/components/sections/HeroMasthead.tsx`**:
   - Keep the existing `joggingWoman` import and slide.
   - Replace the other 4 slides with the new uploads (import each `.asset.json` and use `.url`).
   - New `SLIDES` array (5 total): jogging woman, clinic reception, senior couple, bench phone, blood test kit — each with a short caption.
   - Change default `rotateMs` from `3800` to `15000` so it auto-rotates every ~15s. Update the call site in `Index.tsx`? Not needed — `Index.tsx` uses `<HeroMasthead />` with no prop, so the new default applies.

### Not in scope
- No layout/style changes to the carousel container or the ad card.
- Old imports (`benchMan`, `activeCouple`, `homeKit`, `clinicNew`) removed since they're replaced.
