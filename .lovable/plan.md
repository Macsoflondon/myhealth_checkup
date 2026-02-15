

# Update Partners Carousel Card Styling

## What will change

The "Our Trusted" heading text will be white, and each logo card will get a turquoise border.

## Details

**File: `src/components/sections/PartnersGrid.tsx`**

### 1. Heading text
- `titleClassName="text-white"` is already applied -- no change needed here.

### 2. Card borders (line ~34)
- Change `border border-white/20` to `border-2 border-[#22c0d4]` so each card has a solid turquoise border at all times
- Keep the existing hover effects (glow, scale, lift)

One small, targeted change that gives the cards a sharp turquoise outline consistent with the brand palette.

