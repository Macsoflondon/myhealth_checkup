## Remove "Browse Available Tests" CTA on all provider pages

Yes — the SS1/SS2/SS3 reorder already applies to every provider. All 9 providers render through the single shared `src/pages/ProviderProfilePage.tsx` component (Goodbody, Medichecks, Randox, Thriva, Lola, LML, LHC, Clinilabs, Medical Diagnosis), so the previous reorder covers all of them. The individual `*Page.tsx` files (e.g. `GoodbodyClinicPage.tsx`, `ClinilabsPage.tsx`) just `Navigate` to `/provider/:id`.

The "Browse Available Tests" CTA is likewise defined once, in `ProviderProfilePage.tsx` (lines 287–299), so removing it there removes it from every provider page in one edit.

### Change

- `src/pages/ProviderProfilePage.tsx`: delete the `<div className="flex flex-col sm:flex-row gap-3">…</div>` block (lines 287–299) that contains the `Browse Available Tests` button. Also remove the now-unused `TestTube` and `PROVIDER_CATALOG_ROUTES` imports if nothing else in the file references them (verify with a quick grep before deleting).

No other files, routes, or providers need edits — the tests grid lower on the page (SS3) already replaces the CTA's function.