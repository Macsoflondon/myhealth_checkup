

## Change Navigation Toolbar Text to Turquoise with Pink Hover

**What**: Update all navigation item text in the toolbar from navy to turquoise (`text-brand-turquoise`), switching to pink (`text-brand-pink`) on hover. Plain text only — no button backgrounds, no shadows, no elevation effects.

**File**: `src/components/header/NavigationMenu.tsx`

### Changes

**1. Dropdown buttons (line 103-111)** — Remove `hover:bg-white/50`, `hover:shadow-*`, `hover:-translate-y-[1px]`, and background effects. Change default color from `text-brand-navy` to `text-brand-turquoise`. Keep `hover:text-brand-pink`. When active dropdown is open, use `text-brand-pink` without background/shadow.

**2. Static links (line 121-126)** — Same treatment: remove hover background/shadow/translate effects. Default `text-brand-turquoise`, hover `text-brand-pink`.

**3. "More" button (line 156-157)** — Same: default `text-brand-turquoise`, hover `text-brand-pink`, active state just `text-brand-pink` without background styling.

All underline pseudo-elements (`after:`) remain unchanged.

