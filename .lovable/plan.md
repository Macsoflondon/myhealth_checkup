# Where the Compare by Goal / Symptom pages live, and how to surface them

## Answer first

Those pages do exist and are real routes:

- `/compare/goals` — Compare by Goal hub (Longevity, Performance, Weight Loss, Preventative Health, etc.)
- `/compare/goals/<goal>` — individual goal page
- `/compare/symptoms` — Compare by Symptom hub
- `/compare/symptoms/<symptom>` — individual symptom page

The reason they feel hidden: the only places that link to them today are the homepage ("Compare by goal" button in the Start Your Journey block and the hero), a couple of guide pages, and the 404 page's "popular destinations" list. They are not in the header menu, not in the More menu, not in the mobile drawer, and the footer has no site links at all — so once you leave the homepage there is no way to reach them.

## The fix

1. **More menu / mobile drawer** — the "Compare" section currently has only "Compare Tests". Add "Compare by Goal" (`/compare/goals`) and "Compare by Symptom" (`/compare/symptoms`) alongside it. This single list feeds both the desktop More dropdown and the mobile drawer, so both get them at once.
2. **Compare hub cross-links** — on `/compare`, add two prominent entry cards near the top: "Compare by goal" and "Compare by symptom", each with one line of explanation, so anyone who lands on the compare hub can branch into either route.
3. **Breadcrumbs** — make sure "Goals" and "Symptoms" render as readable labels in the breadcrumb trail rather than raw slugs.

## Technical detail

- `src/components/header/NavigationItems.tsx`: extend the `Compare` section of `moreNavigationSections` with the two paths above. No structural change; the desktop dropdown and mobile drawer both consume this array.
- `src/pages/CompareTests.tsx`: add a two-card link row (brand turquoise / pink accents, Montserrat headings, existing card styling) linking to `/compare/goals` and `/compare/symptoms`.
- `src/components/common/SiteBreadcrumb.tsx`: add `goals` -> "Goals" and `symptoms` -> "Symptoms" label mappings if missing.
- Presentation and navigation only — no data, routing, or business-logic changes; the routes already exist.

## Verification

From a non-home page, open the More menu on desktop and the drawer on mobile and confirm both new items appear and navigate correctly. Then load `/compare` and confirm the two entry cards route to the goal and symptom hubs.
