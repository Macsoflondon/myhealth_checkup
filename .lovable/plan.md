Convert the selected hero masthead section to a navy background and flip all navy-coloured text to white so it remains readable and on-brand.

## Changes

### 1. HeroMasthead.tsx
- Change the outer `<section>` background from `bg-[#F5F5F5]` to `bg-[#081129]`.
- Change the `TestCategoryTicker` inline strip background override from `bg-[#F5F5F5]` to `bg-[#081129]` and its bottom border to white opacity.
- Flip the wordmark "myhealth" span from `text-brand-navy` to `text-white`.
- Flip the tagline base colour from `text-brand-navy` to `text-white`, keeping the turquoise/pink accent words.
- Flip the top divider borders from `border-[#081129]/10` to `border-white/10`.

### 2. TestCategoryTicker.tsx
- The `variant="inline"` style is only consumed by `HeroMasthead`. Update its text class from `text-brand-navy` to `text-white` so it remains visible on the navy hero.
- Keep the `variant="section"` style unchanged (already navy background + white text).

### 3. Verification
- Run `npm run build` and `npm run lint`.
- Capture screenshots at 390px, 768px, 1024px and 1440px to confirm the wordmark, tagline, ticker text and dividers are visible against navy.
- Check that no navy text remains on the navy background.

## Notes
- The hero image/video area already has a navy background, so no change needed there.
- The rotating label bubble and sales card already use white text and stay as-is.