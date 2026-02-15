

# Trim Goodbody Card and Reposition Video

## What is changing

The Goodbody white card has excess empty space below the CTA button. That space will be removed. The partner video next to it will be made slightly smaller and vertically centred to align with the Goodbody card's midline.

## Changes

**In `src/components/sections/PartnerShowcaseGrid.tsx`:**

**1. Goodbody card — remove bottom whitespace**
- The card currently uses `flex flex-col` which stretches it to match the grid row height. Add `h-fit` so it only takes the height of its content, eliminating the empty space below the button.
- Reduce the bottom margin on the last paragraph from `mb-4` to `mb-3` for a tighter feel.

**2. Video card — shrink and vertically centre**
- Change the video container from `hidden md:flex` to `hidden md:flex items-center justify-center` (items-center is already there, but we need to ensure the video itself is constrained).
- Add `max-h-[85%]` and `w-auto` to the video element so it shrinks slightly while remaining centred.
- Change `object-cover` to `object-contain` on the video so it does not stretch to fill.
- The parent grid row will naturally size to the Goodbody card (since it now uses `h-fit`), and the video will sit centred within that height.

**3. Grid row alignment**
- Add `items-start` on the grid container so both columns align to the top, with the video container matching the Goodbody card height via the grid, and the video centred within it using flexbox.
- Actually, to keep the video centred midline: keep the grid default `items-stretch` so the video column stretches to match the Goodbody card height, then the `items-center` on the video flex container centres the video vertically within that matched height.
- Remove `h-fit` from Goodbody card — instead, let it naturally size. The issue is the card's `flex-col` stretching. The fix is to keep the card as-is but ensure there is no extra padding. The red space is actually the card stretching to match the video column height. So the solution is: constrain the video column height, not the card.

**Refined approach:**
- On the grid: add `items-center` so both columns vertically centre, rather than stretch to equal height. This removes the empty space from the Goodbody card and centres the video.
- On the video element: add `max-h-[400px]` and change `object-cover` to `object-contain`, and add `rounded-2xl` to keep rounded corners. This shrinks the video slightly.

