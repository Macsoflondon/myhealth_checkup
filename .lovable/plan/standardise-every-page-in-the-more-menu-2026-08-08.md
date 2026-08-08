# Standardise every page in the More menu

Right now the ten pages behind the More menu use four different header treatments and three different page shells. Health Resource Hub and the Complete Biomarker Reference Library have the current navy hero; the Compare pages use the minimal `CategoryStandardHero`; About, FAQs and Contact use the old `PageBanner`; Assisted Test Finder and Our Providers have no header at all. Calls to action are equally inconsistent — some pages end with the quiz banner, some with nothing.

## Target pattern

Every More page gets the same three-part shape:

```text
[ Navy hero — #081129, dot grid, glow orbs ]
   pink hairline — PAGE TITLE (Montserrat) — pink hairline
   optional one-line strapline
   optional tick stat row (turquoise ticks)
   tricolour divider (turquoise → pink → turquoise)
[ White body — page content, unchanged ]
[ Quiz CTA banner ]
[ Footer ]
```

## One shared hero component

Extract the hero currently hand-rolled in the Health Resource Hub into `StandardPageHero`, with props for title, optional strapline, and an optional list of stat strings. Every More page then renders that one component — no page keeps its own copy of the markup.

`CategoryStandardHero` (used by category and compare pages) stays as-is; the new component is the same visual language with the optional strapline/stats slots those pages don't need.

## Per-page changes

| Page | Change |
|---|---|
| About Us | Replace `PageBanner` with the standard hero, title "About Us" |
| FAQs | Replace `PageBanner` with the standard hero, title "Frequently Asked Questions"; keep the search field in the white body |
| Our Providers | Add the standard hero, title "Our Providers", stat row of provider count |
| Assisted Test Finder | Add the standard hero, title "Assisted Test Finder"; the existing centred `h1`/strapline inside the white body is removed so there's only one page heading |
| Compare Tests / by Goal / by Symptom | Keep `CategoryStandardHero`; the Goal and Symptom pages currently continue on a navy body below the hero — switch those bodies to white so they match every other page |
| Health Resource Hub | Swap its inline hero for the shared component (identical output) |
| Complete Biomarker Reference Library | Swap its inline hero for the shared component |
| Contact Us | Replace `PageBanner` with the standard hero, title "Contact Us" |

## Brand consistency pass

- Titles: Montserrat bold, `0.04em` tracking, same responsive sizes across all ten.
- Body copy: existing body font, navy `#081129` at 85% on white.
- Accents: pink `#e70d69` hairlines, turquoise `#22c0d4` ticks, tricolour divider. No other accent colours introduced.
- Section headings inside page bodies use the same Montserrat scale and the short gradient underline already used on About Us.
- CTA: every page ends with `QuizCTABanner` before the footer — currently missing on Assisted Test Finder, Contact and the two Compare hub pages (they use `CategoryPageBottom`, which stays).

## Technical notes

- New `src/components/layout/StandardPageHero.tsx`; delete usages of `src/components/sections/PageBanner.tsx` from these three pages (the component itself stays for any other page still using it).
- Pages keep their current shells (`Header`/`Footer` vs `MainLayout`) — no routing or data changes, presentation only.
- Head metadata and JSON-LD on each route are untouched.
