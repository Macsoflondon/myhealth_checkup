## Scope
Only the `Wordmark` in `src/components/sections/HeroMasthead.tsx` (lines 97–104). No other layout/spacing changes.

## Current
```
text-[clamp(1.75rem,7vw,4rem)] lg:text-[10rem]
```
- Mobile clamp max ≈ `4rem` (≈ `text-6xl`)
- Desktop `10rem` (bigger than `text-9xl` = 8rem)

## Change (−4 Tailwind steps on the scale …2xl, 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl)
- Mobile: `6xl → 2xl` → clamp becomes `clamp(1rem, 3.5vw, 1.5rem)`
- Desktop: `~9xl+ → 5xl` → `lg:text-[3rem]` (= `text-5xl`)

Result:
```
text-[clamp(1rem,3.5vw,1.5rem)] lg:text-[3rem]
```

## Files
- `src/components/sections/HeroMasthead.tsx` — line 99 only.
