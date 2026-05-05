## Goal
Bring the inner "Popular Searches" card in line with the rest of the Hero panel, where every surface uses: `border-2 border-primary border-solid`, `rounded-sm`, `shadow-md`, and a `backdrop-blur-md` navy background.

## Change — `src/components/sections/Hero.tsx` (line 179)

Current (inconsistent — soft white border, large radius, no shadow, no blur):
```tsx
<div className="mt-3 sm:mt-4 bg-[#081129]/40 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center border border-white/10">
```

Replace with:
```tsx
<div className="mt-3 sm:mt-4 bg-[#081129]/40 backdrop-blur-md p-2 sm:p-3 text-center border-2 border-primary border-solid rounded-sm shadow-md">
```

### Why
- **Border**: `border border-white/10` → `border-2 border-primary border-solid` to match badge, CTA buttons, search wrapper, and chip buttons.
- **Rounding**: `rounded-lg sm:rounded-xl` → `rounded-sm` so all surfaces inside the Hero share the same crisp corner radius.
- **Shadow**: adds `shadow-md` (the standard for elevated panels in the Hero).
- **Blur**: adds `backdrop-blur-md` so the navy tint reads consistently across all rotating background images.

No other changes needed — the chips inside already use the system styling.