## Plan: Reduce hero test card size by half on mobile

### Scope
Only the featured test card rendered inside `HeroMasthead` (`HeroSalesTestCard.tsx`). Desktop and tablet sizing stay unchanged.

### Changes
1. **Card shell (mobile)**
   - Reduce width from `min(94vw,280px)` to `min(94vw,140px)`.
   - Reduce border-radius from `rounded-2xl` to `rounded-xl`.
   - Reduce absolute inset from `right-2 bottom-2` to `right-2 bottom-2` (kept) but shrink padding from `p-3` to `p-2`.
   - Keep `sm:` and `lg:` breakpoints at current values.

2. **Header (mobile)**
   - Shrink provider logo container from `w-10 h-10` to `w-7 h-7`.
   - Hide rating / UKAS accreditation row on mobile (currently visible).
   - Shrink "Featured" badge from `px-2.5 py-1 text-[9px]` to `px-1.5 py-0.5 text-[7px]`.

3. **Title block (mobile)**
   - Reduce category label from `text-[10px]` to `text-[8px]`.
   - Reduce test name from `text-base` to `text-[11px]`.
   - Clamp to 2 lines remains.

4. **Footer / price (mobile)**
   - Reduce price from `text-xl` to `text-sm`.
   - Reduce "View test" button from `px-3 py-1.5` to `px-2 py-1 text-[9px]`.
   - Keep "Compare" button hidden on mobile (already `hidden sm:inline-flex`).

5. **Dialog** — no change; it opens full-screen and is already mobile-friendly.

### Verification
- Run `bunx tsgo --noEmit`.
- Check mobile preview at 375–414 px widths to confirm the card is roughly half the previous footprint and remains readable.
- Confirm desktop/tablet layouts are unchanged.

### Files to touch
- `src/components/sections/HeroSalesTestCard.tsx`