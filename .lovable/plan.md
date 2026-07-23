## Remove hero videos, keep images

In `src/components/sections/HeroMasthead.tsx`:

1. Delete the 5 `clip*Asset` imports (`clipJoggingAsset`, `clipClinicAsset`, `clipSeniorAsset`, `clipBenchAsset`, `clipKitAsset`).
2. Remove the `video` field from each entry in the `SLIDES` array.
3. Strip video-related runtime code: `videoRefs`, the `useEffect` that plays/pauses videos on slide change, and the `shouldMountVideo` branch that renders `<video>` elements. Keep only the `<img>` branch for every slide.
4. Keep the `reducedMotion` detection only if still needed for the rotate interval; otherwise simplify to the standard `rotateMs` timer.
5. Delete the 5 unused video `.asset.json` pointer files under `src/assets/hero/video/` and run `lovable-assets delete` on each so the CDN objects are removed too.

No other files or behaviour change — image slides, positions, labels, and the sales card overlay stay exactly as they are.