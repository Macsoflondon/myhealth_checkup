# Plan: Reposition and restyle the homepage slogan

## Goal
Move the hero slogan so it sits directly beneath the "myhealth checkup" wordmark and above the white divider line on desktop, reduce its font size by one step, and switch the casing to sentence case while preserving the existing colour treatment.

## Current state
In `src/components/sections/HeroMasthead.tsx`:
- The desktop wordmark and divider live in a hidden-on-mobile wrapper.
- The `<h1>` slogan currently renders in a separate flex row below that wrapper.
- The slogan is uppercase: `YOUR HEALTH. YOUR CHOICE. ONE TRUSTED PLATFORM.`
- The slogan uses `text-[clamp(1.05rem,4.6vw,1.75rem)] sm:text-[clamp(1.25rem,3.2vw,2.5rem)]`.

## Changes
1. Move the `<h1>` slogan into the desktop wordmark wrapper so it appears between the wordmark and the divider.
2. Reduce the slogan font size by one step on both mobile and desktop breakpoints.
3. Change the text to sentence case: `Your health. Your choice. One trusted platform.`
4. Preserve the colour tone:
   - `Your` → white
   - `health.` → turquoise (#22c0d4)
   - `Your` → white
   - `choice.` → pink (#e70d69)
   - `One trusted platform.` → white
5. Keep the element as the page's single `<h1>` and maintain its left alignment.

## Verification
- Run a local build/typecheck.
- Visually confirm on desktop that the slogan sits directly above the divider and below the wordmark.
- Visually confirm on mobile that the slogan still renders correctly below the white category bar.
