## Goal
Refine the "Popular Searches" label inside the Hero search panel for cleaner spacing, a more legible size, and consistent centring across breakpoints.

## Change — `src/components/sections/Hero.tsx` (lines 180–183)

Current:
```tsx
<p className="text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 uppercase tracking-[0.2em] text-white">
  Popular Searches
</p>
<div className="flex flex-col items-center gap-2 pt-1">
```

Replace with:
```tsx
<p className="text-[11px] sm:text-xs md:text-[13px] font-bold uppercase tracking-[0.22em] sm:tracking-[0.25em] text-white text-center leading-none mb-2 sm:mb-3">
  Popular Searches
</p>
<div className="flex flex-col items-center gap-2 sm:gap-2.5">
```

### Why
- **Size**: `10px → 11px` mobile, adds `md:text-[13px]` so the label scales up on desktop instead of staying tiny.
- **Spacing**: Bottom margin grows `mb-1.5/2 → mb-2/3` and chip-row gap `gap-2 → sm:gap-2.5`. Removed redundant `pt-1` (replaced by the label's bottom margin) so vertical rhythm comes from one place.
- **Alignment**: Adds explicit `text-center` and `leading-none` to keep the label optically centred in the panel and remove inherited line-height padding that pushed it off-axis.
- **Tracking**: Slightly tighter on mobile (`0.22em`) and looser on desktop (`0.25em`) so the wider desktop size doesn't feel cramped.