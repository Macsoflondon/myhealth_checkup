
# Sharpen the Top Concerns Category Cards

## What will change

The category cards in the "Top Concerns" section will get a sharp, polished look with dark blue borders, a subtle glow effect, and dark blue text instead of grey.

## Details

**File: `src/components/sections/TopConcernsSection.tsx`**

### 1. Card container (line 143)
- Change `border border-border` to `border-2 border-[#081129]`
- Add a subtle navy glow on hover: `hover:shadow-[0_0_20px_rgba(8,17,41,0.15)]`
- Keep existing hover and transition effects

### 2. Card title (line 148)
- Change `text-foreground` to `text-[#081129]` for explicit dark blue

### 3. Card description (line 151)
- Change `text-muted-foreground` to `text-[#081129]` so the grey body text becomes dark blue

These changes apply to all 12 category cards consistently.
