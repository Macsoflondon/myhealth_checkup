Tweaks to `src/components/sections/HeroSalesTestCard.tsx` only — compact card, not the modal.

**Height**
- `h-[150px]` → `h-[120px]`
- Reduce padding `p-5` → `p-4` so content fits

**Price block**
- Add a small "from" label above the price, set to `providerColor`
- Layout: small `text-[9px]` uppercase tracking-wider "from" line, then existing £price beneath
- Keep price `font-black`, drop to `text-[16px]` to fit slimmer card

**CTA button ("View Details")**
- Increase size ~50%: `px-4 py-2` → `px-5 py-3`, text `text-[10px]` → `text-[15px]`
- Change label colour from white to `providerColor` (keep navy gradient background)
- Adjust stacked shadow to remain proportional

**Provider name strip**
- Keep small label at top in `providerColor` (already set)
- May reduce `mb-1.5` → `mb-1` to recover vertical space

No changes to modal, rotation, data, or `HeroMasthead`.