## Goal
Halve the height of the top tri-colour gradient divider on the homepage MissionSection.

## Change
In `src/components/sections/MissionSection.tsx` (line 24), the selected divider currently uses `h-0.5 sm:h-1`. Update to `h-px sm:h-0.5` so it renders at half the current thickness on both mobile and larger screens.

```tsx
<div className="h-px sm:h-0.5 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
```

The matching bottom divider (line 39) is left unchanged unless you'd like both halved — let me know.