

## Change Popular Search Button Text Color

The selected element is a "Full Blood Count" button in the Hero's Popular Searches section. The buttons currently use `text-white`. Change to dark navy text.

**File:** `src/components/sections/Hero.tsx` (line ~178)

Change the button className from:
```
text-white bg-[hsl(var(--primary))] ...
```
to:
```
text-[#081129] bg-[hsl(var(--primary))] ...
```

This applies to all popular search buttons since they share the same className in the `.map()`.

