

## Plan: Increase Navigation Toolbar Text Size and Make Bold Dark Turquoise

### What changes
In `src/components/header/NavigationMenu.tsx`, update font sizes and colors across three locations:

1. **Dropdown nav items (line 103)** - button className
2. **Link nav items (line 122)** - Link className  
3. **More button (line 156)** - button className

### Font size change (two sizes up)
- `text-sm` → `text-lg`
- `md:text-base` → `md:text-xl`
- `lg:text-base` → `lg:text-xl`
- `xl:text-lg` → `xl:text-2xl`

### Font weight
- `font-semibold` → `font-bold`

### Color change (dark turquoise)
- `text-brand-turquoise` → `text-[#1a9baa]` (a darker shade of the brand turquoise #22c0d4)
- Keep `hover:text-brand-pink` as-is

### Files modified
- `src/components/header/NavigationMenu.tsx` — 3 className strings updated

