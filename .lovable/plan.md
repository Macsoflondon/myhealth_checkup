## Plan

Fix the top sticky PromoTracker so it is unmistakably visible and reliably animating on the homepage.

### What I’ll change
1. **Tighten the PromoTracker layout and visibility**
   - Reduce the oversized top spacing added in the last edit so the promo text sits properly inside the strip.
   - Add a more explicit visible track treatment so it does not visually blend into the navy header/hero stack.
   - Keep the renamed `PromoTracker` label everywhere, including the debug overlay.

2. **Harden the animation behaviour**
   - Align the PromoTracker animation loop with the more stable ticker pattern already used elsewhere.
   - Ensure the track always has a measurable width before animating.
   - Add touch pause/resume handling in addition to mouse hover so behaviour is consistent on touch devices.
   - Make the reset/wrap logic more defensive so the marquee cannot appear frozen after resize/font/layout changes.

3. **Check the sticky header stack**
   - Verify the PromoTracker remains the first sticky element at the top of the viewport.
   - Adjust the header/toolbar offset logic if the enlarged ticker height is pushing surrounding elements into a visually confusing state.

### Files to update
- `src/components/sections/PromoTracker.tsx`
- `src/components/layout/Header.tsx`

## Technical details

### Current findings
- `PromoTracker` is already mounted in `Header` on both desktop and mobile.
- The old `BrandTicker` name is gone from runtime code except for an internal plan file.
- Session replay data shows horizontal `translateX(...)` changes, which means the marquee loop is running.
- That points to a **visibility/layout issue more than a missing component**.

### Likely root cause
The recent styling change increased the top padding significantly, and the promo strip shares the same navy family as the surrounding header/hero. So even though the animation is running, it can read as “not working” because it is blending into the header stack or the text is sitting awkwardly inside a taller strip.

### Implementation approach
- Rebalance the strip spacing and text sizing so the content is immediately visible.
- Add small visual separation from the header stack without changing the overall brand styling.
- Keep the animation on `transform: translate3d(...)`, but make measurement/reflow handling more resilient.
- Preserve reduced-motion behaviour.

If you approve, I’ll apply the fixes directly and then re-check the component in the preview.