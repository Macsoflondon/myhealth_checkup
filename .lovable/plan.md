## Goal
Improve contrast and typographic hierarchy of the Hero CTA elements (badge, headline, subline, three action buttons, search field, popular searches) so they remain readable across all five rotating background images.

## Changes — `src/components/sections/Hero.tsx`

### 1. Stronger background scrim (line 110)
Replace flat 40% navy overlay with a vertical gradient that darkens top and bottom:
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-[#081129]/70 via-[#081129]/45 to-[#081129]/75 z-[1]" />
```

### 2. Badge "UK's Leading…" (line 117)
- Solid navy chip instead of translucent white (better contrast on light slides)
- Add `uppercase` for hierarchy

### 3. Headline (line 125)
- `font-semibold` → `font-bold`
- Tighten leading `1.08` → `1.05`
- Add `drop-shadow-[0_2px_12px_rgba(8,17,41,0.85)]`

### 4. Subline (line 131)
- `text-white/85` → `text-white`
- `font-bold` → `font-medium` (creates clear weight contrast vs bold headline; size already differs)
- Bump base size `text-sm` → `text-base`
- Add `drop-shadow-[0_2px_8px_rgba(8,17,41,0.85)]`

### 5. Three CTA buttons (lines 142–159)
- Background: `bg-white/15` → `bg-[#081129]/65` (solid-feel navy that reads on any slide)
- Border: `border` → `border-2` for stronger definition
- Shadow: `shadow-sm` → `shadow-md`

### 6. Search input + wrapper (lines 163–173)
- Wrapper: `bg-white/8` → `bg-[#081129]/55`, `border` → `border-2`
- Input: `bg-white/10` → `bg-[#081129]/60`, `placeholder:text-white` → `placeholder:text-white/70`, `border` → `border-2`

### 7. "Popular Searches" label (line 180)
Clean up the broken class string and use a high-contrast token:
```tsx
className="text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 uppercase tracking-[0.2em] text-white"
```

### 8. Popular search chips (lines 189, 200)
- Background: `bg-white/10` → `bg-[#081129]/60`
- Text: `text-white/90` → `text-white`
- Border: `border` → `border-2`

## Notes
- Colours kept on-brand: navy (#081129) backgrounds, primary turquoise borders, white text. No new tokens introduced.
- Hierarchy after changes: **Badge (small caps, solid chip)** → **Headline (bold, very large, shadowed)** → **Subline (medium weight, larger base size)** → **Action buttons (semibold, solid navy)** → **Search field (largest interactive surface)** → **Popular Searches label (small caps) + chips**.