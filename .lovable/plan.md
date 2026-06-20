## Goal

Make the hero section images on the homepage crystal clear by replacing the current FHD/low-res assets with 4K-resolution regenerations matched to each existing scene, then host them via Lovable Assets (CDN) so the repo stays lean.

## Current State

`src/components/sections/Hero.tsx` uses 5 images across 3 rotating slides:

| Slide | Desktop (current size) | Mobile (current size) |
|---|---|---|
| Home test kit | `hero-home-kit.webp` 1920x1072 | `mobile/hero-mobile-kit-open.webp` 800x601 |
| Active lifestyle | `hero-active-lifestyle.webp` 1920x1080 | `mobile/hero-mobile-active.jpeg` 493x482 |
| Results on phone | `hero-mobile-results-zoomed.webp` 800x447 | (reused) |

Mobile assets in particular are well below retina quality.

## Plan

1. Regenerate each of the 5 images with the premium image model at 4K-class dimensions:
   - Desktop scenes: 1920x1080 generated at premium (true 4K source upscaled by model), keeping the same scene/composition (clinical home blood-test kit on kitchen surface; healthy active 35–50 yr-old UK adult outdoors; hand holding phone showing biomarker results dashboard).
   - Mobile scenes: square/3:4 crops of the same scenes at maximum supported resolution.
   - On-brand: clean, clinical, modern, vibrant; navy/turquoise/pink accents allowed only where natural (e.g. UI on phone). No medical-claim imagery, no diagnosis cues.
2. Save originals to `/tmp/`, then upload each via `lovable-assets create` and write `.asset.json` pointers under `src/assets/hero/` and `src/assets/hero/mobile/` replacing the existing files.
3. Update the 5 imports in `src/components/sections/Hero.tsx` to import the new `.asset.json` files and use `.url`.
4. Delete the now-unused local binary hero files that are only referenced by `Hero.tsx` (keep the other hero-*.png/webp files that other components may use — verify with ripgrep before deleting).
5. Verify in the live preview that the hero slides render sharply on desktop and mobile viewports.

## Technical Notes

- Use `imagegen--generate_image` with `model: "premium"` for photorealistic clarity; transparent_background=false; jpg target for photos.
- Use `lovable-assets create --file ... --filename <name>.jpg > src/assets/hero/<name>.jpg.asset.json` then `rm` the temp and any replaced binaries.
- Keep filenames stable where possible (`hero-home-kit.jpg`, `hero-active-lifestyle.jpg`, `hero-results-phone.jpg`, `mobile/hero-mobile-kit-open.jpg`, `mobile/hero-mobile-active.jpg`) so future diffs are minimal.
- No business-logic changes; Hero.tsx edits limited to import statements and the `.url` access pattern.
