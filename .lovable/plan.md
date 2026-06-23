The current wheel renders flat-colour bands on each card face. The reference screenshot shows the bands filled with a grid of diverse portrait photos, screen-blended over each kit's accent colour. The `KitFace` component already supports a `texture` prop and `FeaturedPartnerWheel` already forwards `faceTexture` — there's just no texture asset wired up.

## Steps

1. Generate a portrait grid texture (`src/assets/goodbody-face-grid.jpg`)
   - Premium model, ~1024x1024
   - Prompt: tight 6x8 grid of diverse adult headshots on white, evenly lit, all roughly the same crop/scale, looking at camera, neutral expressions — designed to read well as a monochrome screen-blend.
2. Externalise via `lovable-assets create` → `src/assets/goodbody-face-grid.jpg.asset.json`, then `rm` the original binary.
3. In `src/components/sections/PartnerShowcaseGrid.tsx`:
   - Import the asset JSON.
   - Pass `<FeaturedPartnerWheel faceTexture={faceGrid.url} />`.
4. Visual verify with Playwright screenshot at `/`.

## Technical details

- The texture renders inside `KitFace` via the existing `<img mixBlendMode: screen, filter: grayscale(1) contrast(1.05)>` overlay, which produces the recoloured-by-accent portrait look in the screenshot.
- No changes to wheel geometry, animation, modal, or data — purely a visual coating.
- No new dependencies. Asset served from Lovable CDN.

## Out of scope

- Card layout/typography changes
- Replacing the Goodbody default kit data
- Changing the mobile bento layout
