# Hero Sales Test Card — Replacement

## Goal
Restore a sales test card in the hero image area (`HeroMasthead.tsx`), positioned at the **bottom-right corner**, using the new layout from the HTML reference you provided. Size it **~1.5× the original compact hero test card** so it has more presence without dominating the image.

## What to build

New component: `src/components/sections/HeroSalesTestCard.tsx`

A faithful React/Tailwind port of your reference HTML, adapted to:
- Use real brand tokens (`#081129` navy, `#22c0d4` turquoise, `#e70d69` pink) instead of the demo `brandNavy/brandTurquoise/brandPink` config.
- Pull live data from the existing rotating `ADVERTS` array in `HeroMasthead.tsx` (provider, test name, price, URL, category colour) — so the card cycles with the carousel.
- Replace the placeholder "Allergy Complete Test / £299 / 295 markers" with the rotating ad's real test name, real `£price`, and the standard hero metrics (`Typical 2–5 days`, biomarker count if available else "Full panel", "Flexible collection").
- Keep all three sections from the reference: dark navy header w/ price + 3 metric strip, white body (Additional Collection Options, About This Test, Standards & Accreditation, legal notice), and footer with `+ Compare` (secondary) and `Book Test` (primary pink → links to ad's URL).
- Remove the `✕` close button (not a modal here — it's an overlay card).

## Placement & sizing

In `HeroMasthead.tsx`, inside the hero image container (lines 141–179), add the card as an absolute overlay in the **bottom-right**:

```text
absolute right-4 bottom-4 sm:right-6 sm:bottom-6
hidden md:flex            ← desktop/tablet only; mobile keeps image clean
w-[clamp(360px,30vw,460px)]  ← ~1.5× the prior compact card width
```

- Original hero card was roughly `~240–300px` wide; new card targets `~380–460px` → ~1.5× larger.
- Body uses `max-h-[55vh] overflow-y-auto` so it never exceeds the hero image height.
- Hidden on mobile (`<md`) to preserve the slide label bubble and avoid covering the photo.

## Copy & compliance adjustments (British English / brand rules)

- "UKAS accredited lab" → "UKAS-accredited laboratory"
- "CQC regulated" → "CQC-regulated"
- Replace "2-5 Days" with "Typical 2–5 days" (non-guaranteed phrasing per compliance memory)
- "Book Test" button → "View test" (we are a comparison platform, not a booking provider) — links to `ad.url` (external `target="_blank" rel="noopener"`)
- `+ Compare` button → wires into existing comparison persistence store (`useCompareStore` or equivalent — confirm exact hook during build)
- Legal alert text kept, tightened to: "myhealth checkup is an independent comparison platform. Verify scheduling and clinical details directly with the chosen provider."

## Files

- **New**: `src/components/sections/HeroSalesTestCard.tsx` — accepts `{ ad: Advert }` prop.
- **Edit**: `src/components/sections/HeroMasthead.tsx` — import the new component, render `{ad && <HeroSalesTestCard ad={ad} />}` inside the hero image div (after line 177), positioned bottom-right.

## Out of scope
- No changes to the carousel rotation logic, slide images, or stats grid below the hero.
- No changes to mobile layout beyond hiding the card `<md`.

## Verification
- Visual check on `/` at desktop, tablet, mobile breakpoints.
- Confirm card cycles in sync with the slide carousel and shows real provider/test/price data.
- Confirm "View test" opens the provider URL; "+ Compare" adds to the comparison store.
