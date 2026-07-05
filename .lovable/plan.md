## Change

Increase the hero wordmark ("myhealthcheckup") on desktop by two Tailwind size steps, leaving mobile/tablet untouched.

**File:** `src/components/sections/HeroMasthead.tsx` (line 99)

Current: `text-[clamp(1.75rem,7vw,4rem)]` (max 4rem / 64px on desktop, ~text-6xl).

New: keep the fluid clamp for mobile, but bump the desktop cap two steps to **text-8xl (6rem / 96px)** via a responsive override:

```tsx
className="font-bold tracking-[-0.02em] font-[Montserrat] whitespace-nowrap text-[clamp(1.75rem,7vw,4rem)] lg:text-8xl"
```

This preserves the existing mobile fluid scaling and only enlarges the wordmark at `lg` (≥1024px) and up — two Tailwind steps above the current 6xl-equivalent cap.

No other components, colours, or layout tokens change.