## Plan

### 1. Replace segmented divider with true tricolour gradient

`src/pages/Index.tsx` (lines 219–225) — inside the navy "Your health is your greatest asset" card.

Current: three equal solid blocks (pearl / turquoise / pink), centred at `w-3/4`.
Target (per screenshot): a single thin horizontal line running turquoise → pink → turquoise, sitting on the navy background.

Replace the three-div stripe with:

```tsx
<div className="w-3/4 mx-auto mb-8">
  <div
    className="h-[2px] w-full rounded-full bg-gradient-to-r from-[#22c0d4] via-[#e70d69] to-[#22c0d4]"
    aria-hidden="true"
  />
</div>
```

Matches the existing tricolour treatment used in `MissionSection.tsx` (`from-brand-turquoise via-brand-pink to-brand-turquoise`).

### 2. Enlarge desktop category toolbar buttons ~50%

`src/components/layout/CategoryPillDropdown.tsx` — non-compact branch (compact stays untouched, used only inside the hero stack).

- Pill padding: `pl-2.5 pr-3 sm:pl-3 sm:pr-3.5 py-2.5 sm:py-3` → `pl-4 pr-5 sm:pl-5 sm:pr-6 py-4 sm:py-[18px]`
- Icon bubble: `w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]` → `w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]`
- Icon glyph: `w-[11px] h-[11px] sm:w-[12px] sm:h-[12px]` → `w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]`
- Label: `text-[11px] sm:text-[11.5px]` → `text-[15px] sm:text-[17px]`
- Chevron: `w-2.5 h-2.5` → `w-4 h-4`
- Gap: `gap-1.5` → `gap-2`
- Max-width caps: `md:max-w-[104px] lg:max-w-[112px] xl:max-w-[118px]` → `md:max-w-[150px] lg:max-w-[170px] xl:max-w-[190px]` so labels aren't over-truncated at the larger font size.

`src/components/layout/BrowseByCategoryBar.tsx` — match on the "More" pill and the bar chrome (non-compact branch only):

- More button padding: `pl-1.5 pr-2 sm:pl-2 sm:pr-2.5 py-1 sm:py-1.5` → `pl-4 pr-5 sm:pl-5 sm:pr-6 py-4 sm:py-[18px]`
- More icon bubble/glyph and label bumped to the same sizes as the category pills.
- Outer card padding: `px-2 sm:px-3 py-2.5 sm:py-3` → `px-3 sm:px-4 py-4 sm:py-5` so the taller pills breathe.
- Language/User controls: leave default scale.

### 3. Verify

Playwright screenshot at 1280 and 1440 px to confirm:
- Bar still fits on a single row (labels may wrap onto a second row on smaller laptops — acceptable, existing flex-wrap handles it).
- Divider renders as one continuous turquoise→pink→turquoise line.

No routing, data, or backend changes.
