# Swap heart icon for brand watermark logo

Replace the pink heart in front of "myhealthcheckup" with the uploaded gradient heart watermark.

## Steps
1. Upload `user-uploads://heart-mark-2.png` to CDN via `lovable-assets`, write pointer to `src/assets/brand/heart-mark.png.asset.json` (overwrites the existing pointer — same import path, no other edits needed).
2. Delete the old CDN asset (`assets--delete_asset` on the previous pointer) — done as part of overwrite.
3. No code changes in `HeroMasthead.tsx` required; it already imports `heart-mark.png.asset.json`. Bump container to `h-10` so the more detailed watermark reads cleanly at small size.

That's it — one asset swap + one className tweak.
