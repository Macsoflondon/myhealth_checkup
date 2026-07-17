Implement a tight homepage-only fix:

1. **Remove the hero CTA/navigation links shown in the screenshot**
   - In `HeroMasthead`, remove the desktop link group: `Compare`, `Categories`, and `Take the health quiz`.
   - Keep the hero wordmark and existing hero structure intact, with spacing adjusted so the header does not look unbalanced.

2. **Fix the standards carousel under the hero**
   - The carousel currently uses `animation: "marquee 45s linear infinite"` inline, but `@keyframes marquee` is only defined in Tailwind config, not guaranteed as global CSS for inline animation.
   - Add a real global keyframe/class for the standards carousel in `src/index.css`.
   - Replace the inline animation with that class in `AccreditedProvidersBar`.
   - Ensure the duplicated badge track scrolls continuously and loops seamlessly.
   - Keep the navy background, white copy, turquoise/pink icon accents, and edge fades.

3. **Make sure it still works with the current preview settings**
   - The global reduced-motion safety net can currently stop animations with `!important`; add a carousel-specific override so this trust carousel animates as requested.
   - Retain hover pause on desktop.

4. **Verify visually**
   - Check desktop and mobile preview after implementation.
   - Confirm the top hero CTA links are gone.
   - Confirm the standards/trust badges visibly scroll under the hero without clipping or layout overflow.