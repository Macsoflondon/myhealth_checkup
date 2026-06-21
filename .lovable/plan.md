## Hero card v3: teaser → modal, fixed size, provider colours

### 1. `src/components/sections/HeroSalesTestCard.tsx` — refactor
- **Fixed size:** `w-[280px] h-[150px]` (≈1.75× current ~160px). Hard pixel dims so it doesn't shimmy between rotations. Becomes a `<button>` opening a modal.
- **Provider colour** resolved via `getBranding(ad.provider)` from `src/data/providerBranding.ts` → `brand.primary`. Fallback `#22c0d4`.
- **Layout:**
  - Top strip: 4px bar, `background: brand.primary`
  - Provider name: 13px, bold, uppercase, `color: brand.primary`
  - Test name: 13px, navy, 2-line clamp
  - Price: 22px, black, navy `#081129`
  - CTA pill: full width, navy bg, white text, "View details"
- Clicking anywhere on the card opens the modal (the inner CTA is visual; whole card is the trigger).

### 2. Modal (inline in same file, shadcn `Dialog`)
- Reuses the previous full content: header (navy, pink top accent), price, 3-metric strip, collection options, accreditation badges, disclaimer.
- Footer: `+ Compare` (→ `/compare`) and `View test` (→ `ad.url`, new tab, navy bg).
- Controlled with local `useState`.

### 3. No changes to `HeroMasthead.tsx`
Same import, same slot.

### Notes
- "Same colour as provider" applies to top strip + provider name only. Price and CTA stay navy as you specified.
- Card hidden under `md` as before.
