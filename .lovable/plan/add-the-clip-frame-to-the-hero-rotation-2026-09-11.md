# Add the clip frame to the hero rotation

## What you get

The clearest frame from your screen recording becomes a fifth image in the homepage hero slideshow, enhanced for sharpness and colour, rotating in after the existing four slides.

## Important caveat

The recording is only **186 × 326 pixels** — extremely small. The hero displays at up to 1920px wide. I'll AI-enhance and upscale it, which will make it presentable, but it will never be as crisp as the existing professional hero photos. If you have the original photo/video on your phone, sending that instead would give a dramatically better result — the plan works either way.

## Steps

1. **Extract the sharpest frame** — pull several frames from the `.mov`, pick the one with the least motion blur, and upscale it with high-quality scaling.
2. **AI enhancement** — run it through the image editor to remove noise, sharpen detail, and correct the colour/exposure so it sits well against the navy hero.
3. **Generate responsive sizes** — create AVIF and WebP variants at 480 / 768 / 1200px (matching how the existing four slides are served, so mobile doesn't download a huge file).
4. **Add to the rotation** — append a fifth entry to `SLIDES` in `src/components/sections/hero-slides.ts` with a caption in the brand voice (e.g. health/fitness themed) and sensible crop focus positions for mobile/tablet/desktop.
5. **Verify** — typecheck, then load the homepage in the browser and confirm the new slide appears in the rotation and the existing slides still crossfade correctly.

## Technical details

- New images land in `src/assets/hero/generated/` alongside the existing variants.
- First slide, preload hints, and the LQIP placeholder are untouched — no LCP regression.
- No other pages or components change.
