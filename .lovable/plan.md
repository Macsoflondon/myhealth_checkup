

# Add Blood Test Tube Background Image to Hero Content Section

## What this does
Places the uploaded blood test tube image as a subtle, fixed background behind the hero content area (the section containing the headline, CTAs, search bar, and trust signals). The image will sit behind all the text and UI elements with a semi-transparent overlay to maintain readability.

## Visual approach
- The image covers the full width and height of the hero content section
- A light overlay (white at ~85-90% opacity) sits on top of the image so that all text, buttons, and the search card remain fully readable
- The image is positioned with `object-cover` and centred so the blood tubes are visible but not dominant
- On mobile, the overlay may need to be slightly stronger to maintain contrast on smaller screens

## Steps

1. **Copy the uploaded image** into `src/assets/hero-bg-blood-tubes.jpg` for proper bundling and optimisation

2. **Update `Hero.tsx`** -- modify the main hero content `<section>` (currently line 85):
   - Change from a flat `bg-background` to a `relative` container
   - Add the image as an absolutely positioned background element behind the content
   - Layer a white/light overlay div (`bg-white/85` or `bg-background/90`) between the image and the content to preserve text readability
   - Content sits on top via `relative z-10`

3. **Ensure contrast and accessibility**:
   - All text (navy heading, pink accent, muted-foreground subheading) will remain readable over the light overlay
   - The search card already has its own `bg-background shadow-xl` so it will stand out cleanly
   - Trust signals at the bottom remain legible

## Technical detail

The modified section structure will look like:

```text
<section class="relative overflow-hidden">
  |-- <img> (absolute, inset-0, object-cover, z-0)  -- the blood tube photo
  |-- <div> (absolute, inset-0, bg-white/87, z-[1]) -- readability overlay
  |-- <div> (relative, z-10, container)              -- all existing content
```

- Image imported via ES6 module from `src/assets/` for Vite bundling
- `loading="eager"` since it is above the fold
- No changes to the video section above -- only the content section below gets the background

## Files changed
- **Copy**: `user-uploads://IMG_9062.JPG` to `src/assets/hero-bg-blood-tubes.jpg`
- **Edit**: `src/components/sections/Hero.tsx` -- add background image layer to the content section

