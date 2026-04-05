

## Plan: Edit Hero Carousel Images

### Summary
Four of the five hero slides need modifications. One is a CSS-only fix (repositioning), and three require AI image editing to add myhealth checkup branding onto screens and signage within the photographs.

### Slide-by-Slide Changes

**Slide 1 — No changes** (active lifestyle couple in park)

**Slide 2 — `hero-clinic-ease.jpg` (clinic reception)**
- AI image edit: Replace the "UK Private Health Clinic / Health Clinic" wall text and left-side signage with the myhealth checkup logo and branding, using the brand turquoise (#22c0d4) and navy (#081129) colours already present in the scene.

**Slide 3 — `hero-home-kit.jpg` (lady opening test kit)**
- CSS fix only: Adjust `object-position` on this slide's `<img>` to shift the visible area up and left, so the kit on the bench and her hands opening it are more visible in the hero crop.

**Slide 4 — `hero-empowered-results.jpg` (lady on phone in kitchen)**
- CSS fix: Adjust `object-position` upward so more of her and the phone screen are visible.
- AI image edit: Replace the generic "Health Test" content on the phone screen with a myhealth checkup–branded interface (logo, brand colours, comparison-style layout).

**Slide 5 — `hero-compare-decide.jpg` (lady at laptop)**
- AI image edit: Replace the generic "Health Comparison" website on the laptop screen with a myhealth checkup–branded comparison table (logo in header area, brand turquoise/navy colour scheme, similar table layout).

### Technical Approach

1. **AI image editing** — Use the `lovable_ai.py` script with `--edit-image` for the three photos that need branding overlaid. Each edit will use a precise prompt describing what to change on the screen/signage while preserving the rest of the photo. Output to `src/assets/hero/` replacing the originals.

2. **CSS object-position** — In `Hero.tsx`, add per-slide `objectPosition` data to the `heroSlides` array and apply it to the `<img>` tags. This avoids modifying image files when only cropping/framing is needed.

3. **QA** — View each edited image to verify quality before replacing the originals. Verify the hero renders correctly at the current viewport.

### Files Modified
- `src/assets/hero/hero-clinic-ease.jpg` (replaced with edited version)
- `src/assets/hero/hero-empowered-results.jpg` (replaced with edited version)
- `src/assets/hero/hero-compare-decide.jpg` (replaced with edited version)
- `src/components/sections/Hero.tsx` (add object-position per slide)

