## Technical detail

All changes sit in `src/components/sections/FeaturedPartnerWheel.tsx`, which uses inline style objects.

- Section wrapper (~line 679): `backgroundColor: "#081129"` → `#ffffff`
- `EyebrowBadge` (~line 682): `tone="onDark"` → `tone="onLight"`
- Partner `<h2>` (~line 691): `color: "#f7f7f8"` → `#081129`
- Italic strapline (~line 928): `#f7f7f8` → `#081129`
- Supporting paragraph (~line 938): `#d1d5db` → `rgba(8,17,41,0.72)`
- "Visit Goodbody" button (~line 983): `background: "#fff"` → transparent/white with `border: "1px solid #081129"`, text stays `#081129`
- Sweep the remaining `#f7f7f8` / `#d1d5db` / light-on-dark values inside this section for anything that now sits on white, including kit caption labels under the wheel
- Kit cards, arrows and the portalled modal already render on light surfaces and stay unchanged

Verification: Playwright screenshots at 1440px and 390px, plus a contrast check that no light-grey text remains on the white surface.

Also add a roadmap entry for this change (roadmap edits are held until the plan is approved).
