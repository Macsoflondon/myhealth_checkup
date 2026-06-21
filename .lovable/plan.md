## Remove promo carousel + adjust hero typography

### 1. Remove the PromoTicker (and turquoise divider)

**`src/layouts/MainLayout.tsx`** — Drop the `<Header />` from the layout (the Header only renders `PromoTicker`, which contains the turquoise `h-[3px]` divider underneath). Also remove the now-unused `Header` import.

### 2. Add breathing room above the hero box

**`src/pages/Index.tsx`** — The hero container currently sits flush under the breadcrumb. Add a top margin so it isn't crammed against the top of the page but doesn't feel too tall either:

```tsx
<div className="mt-6 sm:mt-8 md:mt-10 mx-4 sm:mx-8 md:mx-14 lg:mx-16 space-y-6">
```

(Roughly 24px on mobile → 40px on desktop.)

### 3. Enlarge the "Compare." heading + add spacing below it

**`src/components/sections/HeroMasthead.tsx` line 112** — Bump the responsive font-size clamp by two standard steps and increase the bottom margin of the block so the faint divider above the "myhealth checkup" slogan row drops three lines lower:

```tsx
<h1 className="font-extrabold text-[clamp(4.5rem,12vw,10rem)] tracking-[-0.05em] leading-[0.9] text-[#081129] m-0 mt-3 mb-[4.5rem] font-[Montserrat]">
  Compare<span className="text-[#22c0d4]">.</span>
</h1>
```

- Clamp goes from `3rem→7rem` up to `4.5rem→10rem` (two steps on the visual scale).
- `mb-[4.5rem]` (~72px) replaces the current `mt-[18px]` gap on the slogan row — three extra lines of breathing room.

Then on the slogan row (line 116), drop the `mt-[18px]` since the heading now owns the spacing:

```tsx
<div className="flex items-baseline justify-between gap-4 border-b border-[#081129]/10 pb-4">
```

### 4. Enlarge the slogan ("Your health. Your choice. One trusted platform.")

**`src/components/sections/HeroMasthead.tsx` line 117** — Two steps up from `text-[10px]` → `text-sm` (14px). Also relax the tight uppercase tracking slightly so it reads cleanly at the larger size:

```tsx
<span className="text-sm font-bold uppercase tracking-[0.14em] font-[Montserrat] text-[#081129]/55">
```

### Not in scope
- No changes to `StatsBand`, nav links, image carousel, ad card, or any section below the hero.
- `PromoTicker.tsx` file is left in place (unused by homepage now, but kept for any other usage).
