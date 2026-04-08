

## Plan: Dark Blue Button Borders + Goodbody Logo Crop in Partners Carousel

### 1. Add dark navy border to all turquoise/pink buttons

**File: `src/components/ui/button.tsx`**

Add `border-2 border-[#081129]` to the base CVA string (line 8). This applies a dark navy border to every button variant across the platform. The base string already has shared styles, so adding the border there ensures universal coverage without changing individual variants.

### 2. Crop Goodbody logo whitespace in Partners carousel

**File: `src/components/sections/PartnersGrid.tsx`**

The Goodbody logo currently has `max-h-[130px] sm:max-h-[160px]` — larger than others to compensate for whitespace in the image. Since the image itself has excessive white padding that causes it to overflow the `h-32 sm:h-40` card, we will:

- Add `overflow-hidden` to the card container (already present via parent, but reinforce on the img)
- Use `object-cover` instead of `object-contain` for Goodbody only, combined with a constrained height matching other logos (`max-h-[90px] sm:max-h-[120px]`) — this will crop the whitespace while keeping the logo itself the same visual size

Alternatively, a cleaner approach: keep `object-contain` but reduce the Goodbody max-height to match others (`max-h-[90px] sm:max-h-[120px]`) so it fits within the card bounds without overflow. The logo will appear slightly smaller but properly contained.

The best approach is to keep the same container size but clip the image whitespace. We'll set the Goodbody image to the same max-height as others and ensure the card has `overflow-hidden` so nothing bleeds out.

**Changes:**
- Line 109: Add `overflow-hidden` to the card Link className
- Line 120-121: Change Goodbody sizing from `max-h-[130px] sm:max-h-[160px]` to `max-h-[90px] sm:max-h-[120px]` to match other providers

