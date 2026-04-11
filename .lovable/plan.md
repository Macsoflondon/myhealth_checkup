

## Issues identified

1. **White square around magnifying glass** -- Line 42: `bg-primary-foreground` on the `Search` icon creates a visible background box around it. Need to remove that background class.
2. **Search input text not white** -- Line 47: `text-secondary-foreground` resolves to a dark color. Should be `text-white` or `text-primary-foreground`.
3. **Placeholder text** -- Also needs to show as white (with reduced opacity). Add `placeholder:text-white/60`.
4. **Search icon color** -- Line 42: `text-primary` makes the icon dark. Change to `text-white`.

## Changes (single file)

**`src/components/category/CategoryHero.tsx`**

- Line 42: Change Search icon classes from `bg-primary-foreground text-primary` to just `text-white` (removes background, makes icon white)
- Line 47: Change input classes from `text-secondary-foreground` to `text-white placeholder:text-white/60` (white text + translucent white placeholder)

