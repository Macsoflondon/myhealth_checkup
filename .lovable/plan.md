## Goal

In the "Our Featured Partner of the Month" (Goodbody) bento, show the test name under each kit image and make every kit tile clickable, linking to the matching existing test/category page on the site.

## Changes (single file: `src/components/sections/GoodbodyBentoShowcase.tsx`)

1. Update `KitTile` to accept an `href` and a visible `label`:
   - Wrap the tile in a React Router `<Link to={href}>`.
   - Shrink image area slightly and add a centred caption underneath in navy `text-[#081129]`, `font-semibold`, `text-xs sm:text-sm`, truncated on small screens.
   - Add hover affordance: subtle shadow lift + ring in brand turquoise, keyboard focus ring for accessibility.

2. Map each of the 6 kits to an existing on-site route (no new pages, no external links):

   | Tile | Label | Route |
   |---|---|---|
   | Advanced Well Man | "Advanced Well Man" | `/tests/mens-health` |
   | Premium Complete | "Premium Complete" | `/test/general-health` |
   | Early Cancer Screening | "Early Cancer Screening" | `/tests/cancer` |
   | Female Hormone & Fertility | "Female Hormone & Fertility" | `/test/female-hormones` |
   | Thyroid | "Thyroid Blood Test" | `/thyroid` |
   | Cholesterol | "Cholesterol Blood Test" | `/test/lipid-profile` |

3. Keep the centre Goodbody logo tile and the two callout columns unchanged.

## Notes

- All routes already exist in `src/routes/testRoutes.tsx` — verified.
- Stays within the bento grid; no layout breakage since label sits inside the existing tile padding.
- British English labels, no medical claims.
