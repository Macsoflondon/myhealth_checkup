

## Mission Banner Text Update

**What to change:**
- Update `src/components/sections/MissionSection.tsx`
- Change the mission banner text from multi-colored to uniform navy #081129
- Apply semi-bold (font-semibold) weight
- Change banner background from navy to white to ensure text visibility

**Current code:**
```tsx
<div className="bg-brand-navy py-6 sm:py-8 md:py-10 lg:py-12">
  <h2 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-heading font-bold whitespace-nowrap">
    <span className="text-white">Your </span>
    <span className="text-brand-turquoise">health</span>
    <span className="text-white"> is your greatest </span>
    <span className="text-brand-pink">asset</span>
    <span className="text-white">!</span>
  </h2>
</div>
```

**New styling:**
- Background: Change `bg-brand-navy` to `bg-white`
- Text: All spans use `text-[#081129]`
- Weight: Change `font-bold` to `font-semibold`
- Keep gradient dividers above and below for visual consistency

**Technical notes:**
- Uses existing brand color #081129 from the defined palette
- Maintains responsive font sizing
- Preserves the gradient dividers as visual separators
- Single line layout maintained with `whitespace-nowrap`

