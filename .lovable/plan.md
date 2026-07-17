## Goal

Swap the emoji-based trust strip on the homepage (🏥 CQC / 🔬 UKAS / 🔒 Data / ⭐ Trusted) for a version that uses realistic, photo-style accreditation badge images, and lock its position directly beneath the hero video (removing anything currently sitting between the hero and the strip so it reads as one unit).

## What changes

1. **Generate 4 realistic badge images** (premium PNGs, transparent background) into `src/assets/trust-badges/`:
   - `cqc-badge.png` — circular/shield seal styled like a UK regulatory mark, "CQC Registered" engraved
   - `ukas-badge.png` — laboratory accreditation seal, "UKAS Accredited Labs"
   - `data-badge.png` — padlock/shield seal, "Data Never Shared / GDPR"
   - `trusted-badge.png` — laurel/star seal, "Trusted Comparison"
   
   Style brief: metallic navy/turquoise/pink accents on white, embossed clinical seal aesthetic — not flat cartoon. Consistent lighting and size across the four so they read as a set.

2. **Rebuild the trust strip in `src/pages/Index.tsx`**:
   - Keep the navy `#081129` background band and horizontal layout.
   - Replace each `emoji + label` pair with `<img>` of the corresponding badge (h-10 sm:h-12) plus the existing white Montserrat label beside it.
   - Add `alt` text matching the label; `loading="eager"` (it's above the fold), `decoding="async"`.
   - Preserve responsive wrap and spacing.

3. **Position**: keep the strip immediately after `<HeroMasthead />` with zero vertical gap, and move `BrowseByCategoryBar` to render *after* the strip (it already does — no change), so the sequence is: hero video → trust strip → category bar → AI quiz. No other sections move.

## Out of scope

- No changes to `TrustBadgesSection`, `AccreditationCards`, `PersuasionTrustStrip`, or the footer trust marks.
- No copy changes to the four labels.
- No changes to hero video, category bar, or AI quiz block.

## Technical notes

- Images generated via `imagegen--generate_image` at `premium` quality (badges need legible micro-text), transparent PNG, then uploaded via `lovable-assets create` and referenced through `.asset.json` pointers per project asset conventions.
- Badge `<img>` uses fixed height with `w-auto` to preserve aspect ratio; the flex row already handles wrap on narrow viewports.
- No new components, no routing changes, no schema work.

## Verification

- Playwright screenshot at 390px and 1440px confirming: badges render crisply, labels stay on one line per item where space allows, strip sits flush under the hero with no gap.
