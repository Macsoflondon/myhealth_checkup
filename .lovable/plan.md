
The user wants the man in the "Your Results. Your Control." hero slide (heroEmpowered image) repositioned lower so he sits more centred on desktop. Currently he appears too high — head is cut at the top.

Looking at Hero.tsx, the slide has:
```
objectPosition: "center 68%"
```

With `object-cover`, a higher percentage on the Y axis pulls the image UP (showing more of the bottom). To move the subject DOWN in the frame (showing more of his body, less head crop), we need a LOWER percentage — pull the image DOWN to reveal the top of his head.

Wait — re-checking: `object-position: center 68%` means the point at 68% down the image is anchored to the center of the container. Higher % = more of the top is visible. Lower % = more of the bottom is visible.

The user says he's positioned "too high" — meaning his head is near the top of the visible frame. To move him toward the centre, we need to push him DOWN visually, which means showing MORE of the top of the source image — increase the Y % further, OR if his head is being cut off at top, decrease Y % to reveal more above.

From the screenshot: his head is cut at the very top. We need to reveal more of his head (top of source image) → use a LOWER Y percentage like `center 40%` or `center 35%`.

## Plan

**File:** `src/components/sections/Hero.tsx`

**Change:** Update the first slide (heroEmpowered) `objectPosition` from `"center 68%"` to `"center 35%"` to shift the subject down into the centre of the frame on desktop.

**Mobile:** Add a `mobileObjectPosition` if needed, but the user specified desktop only — leave mobile behaviour to fall back to the same value (or add explicit mobile override `"center 30%"` if mobile composition differs). Will add `mobileObjectPosition: "center 30%"` to keep mobile sensible.
