
# Add Gradient Section Divider Above the Brand Ticker

## What is changing

A gradient border/divider line will be added directly above the Brand Ticker carousel, using the same turquoise-pink-turquoise gradient pattern already used in the `FeaturedPublications` section.

## Carousel status

The Brand Ticker carousel is working correctly -- the text items ("Blood Tests", "Cancer Screening", etc.) are scrolling continuously as expected with the 35-second animation loop.

## Change

**File: `src/components/sections/BrandTicker.tsx`**

Add a 3px gradient divider line at the top of the section, before the scrolling text. The gradient uses the brand colours in the sequence: turquoise (#22c0d4) to pink (#e70d69) to turquoise (#22c0d4).

```tsx
<section className="bg-[hsl(224,67%,10%)] overflow-hidden select-none">
  {/* Gradient divider: teal > pink > teal */}
  <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
  <div className="py-3 sm:py-4">
    {/* existing ticker content unchanged */}
  </div>
</section>
```

This matches the exact same divider style used in `FeaturedPublications` for visual consistency across the platform.
