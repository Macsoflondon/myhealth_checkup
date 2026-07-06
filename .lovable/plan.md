## What happened

The dropdown entries still exist in `src/components/header/NavigationItems.tsx`, but at some point their `path`s were rerouted to `/compare?category=…` (a generic comparison page). The original scaffolding — sub-category items pointing at their **parent category page** (e.g. `/womens-health?subcategory=menopause`) and being filtered in-place — was never wired into `DbCategoryPage` / `useCategoryTests`. So even before the paths changed, there was no code on `/womens-health`, `/wellness`, `/mens-health`, `/sports-performance`, `/fertility-tests`, `/at-home-tests`, `/tests/cancer` that read a subcategory param and narrowed the results.

Result: clicking Menopause / Fertility / Thyroid / etc. either dumps users onto `/compare` or loads the parent page unfiltered.

## Plan — reinstate the sub-category mapping + filtering

### 1. Canonical subcategory map (new file)
`src/config/subcategoryMap.ts` — single source of truth. For every parent canonical category, list its subcategory slugs plus the name-pattern aliases used to match `test_name` / `source_section_label` / `biomarkers_list`.

```ts
export type SubcategoryDef = {
  slug: string;          // URL slug, e.g. "menopause"
  label: string;         // Human label for pill + heading
  matchAny: RegExp[];    // ilike-style patterns against test_name / biomarkers
  siblingCategories?: string[]; // optional: pull from other canonical categories (e.g. Women's → thyroid)
};

export const SUBCATEGORY_MAP: Record<string, SubcategoryDef[]> = {
  "womens-health": [
    { slug: "hormones",  label: "Female Hormone Tests",  matchAny: [/hormone/i, /oestrogen/i, /progesterone/i, /fsh/i, /lh/i] },
    { slug: "fertility", label: "Female Fertility Tests", matchAny: [/fertility/i, /amh/i, /ovarian reserve/i] },
    { slug: "menopause", label: "Menopause Tests",        matchAny: [/menopaus/i, /perimenopaus/i] },
    { slug: "pcos",      label: "PCOS Tests",             matchAny: [/pcos/i, /polycystic/i] },
    { slug: "thyroid",   label: "Thyroid Tests",          matchAny: [/thyroid/i, /tsh/i, /t3/i, /t4/i], siblingCategories: ["thyroid"] },
  ],
  "mens-health": [ /* male-hormones, male-fertility, testosterone, prostate */ ],
  "wellness":    [ /* heart-health, cholesterol, diabetes, iron-anaemia, liver, kidney, vitamins, allergy, thyroid */ ],
  "sports-performance": [ /* hormones, testosterone, energy */ ],
  "fertility":   [ /* female-fertility, male-fertility, amh, prenatal, pregnancy */ ],
  "at-home":     [ /* womens, mens, general, allergy */ ],
  "cancer-screening": [ /* bowel, prostate, cervical, lung */ ],
};
```

### 2. Point dropdown links at the parent page with `?subcategory=`
`src/components/header/NavigationItems.tsx` — rewrite every sub-item path from `/compare?category=xxx` to the parent page with `?subcategory=<slug>`, using the slugs in `SUBCATEGORY_MAP`. Example:

```
{ name: "Menopause Tests", path: "/womens-health?subcategory=menopause" }
```

### 3. Filter results in `useCategoryTests`
`src/hooks/queries/useCategoryTests.ts` — accept an optional `subcategory` argument. When present:
- Look up `SUBCATEGORY_MAP[canonicalCategory].find(s => s.slug === subcategory)`.
- Extend the Supabase query to also OR-in `siblingCategories` (e.g. Women's → `hormones`, `thyroid`).
- After fetch, filter rows client-side where `matchAny.some(rx => rx.test(test_name) || biomarkers.some(rx.test))`.
- Include the subcategory slug in the react-query key so results cache per-subcategory.

### 4. Wire the param through `DbCategoryPage`
`src/components/category/DbCategoryPage.tsx`:
- Read `useSearchParams()` → `subcategory`.
- Pass to `useCategoryTests(canonicalCategory, subcategory)`.
- Forward `subcategoryLabel` (from the map) into `CategoryPageLayout` so the hero pill/heading and breadcrumb reflect the active subcategory (e.g. "Women's Health › Menopause Tests").

### 5. Layout affordances
`src/components/category/CategoryPageLayout.tsx` (light touch, presentation only):
- If a `subcategoryLabel` is passed, prepend it to the pill or breadcrumb and highlight the matching filter pill by default.
- Add a "Clear filter" chip that links back to the base category route.

### 6. At-Home & Cancer pages
- `AtHomeTestsPage.tsx` + `CancerScreeningPage.tsx`: same treatment — read `?subcategory=`, resolve via `SUBCATEGORY_MAP["at-home"]` / `["cancer-screening"]`, filter the mapped `CategoryTestItem[]` list in-place (they don't use `useCategoryTests` directly).

### 7. Verify
Playwright pass on desktop + mobile:
- Hover **Women's Health → Menopause Tests** → URL becomes `/womens-health?subcategory=menopause`, hero shows "Menopause Tests", grid narrows to menopause matches only.
- Repeat one item per parent dropdown (Wellness → Thyroid, Men's → Prostate, Sports → Testosterone, Fertility → AMH, At Home → Women's, Cancer → Prostate PSA).
- Confirm "View All …" entries still land on the unfiltered parent page.

### Out of scope
- No DB migration; matching is regex over existing fields.
- No changes to `/compare` behaviour.
- Card design + hero spacing (already handled last turn) untouched.
