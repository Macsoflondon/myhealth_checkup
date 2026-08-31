## Step 0 — clear two existing type errors first

The build is currently failing on two files unrelated to layout, both from nullable database columns in `biomarkers_library`:

- `src/components/templates/ProviderTestDetailTemplate.tsx` — `biomarker_name` can be null but the local `BiomarkerInfo` type requires a string. Filter out null names before indexing the lookup map.
- `src/hooks/useBiomarkersLibrary.ts` — the generated row type has nullable `id`, `biomarker_name`, `biomarker_code`, `description`, `category`. Map rows into `BiomarkerDefinition` with null-safe defaults (skip rows missing an id/name) instead of assigning raw rows.

## Step 1 — inset tokens

In the global stylesheet, next to the existing `--gutter` / `--content-max` tokens:

- `--page-inset`: `0` on mobile, `1rem` from 768px, `1.75rem` from 1024px, capped so it never grows past ~2rem on ultrawide.
- `--edge-fade`: the feather distance, `0` on mobile, ~48px tablet, ~64px desktop.

## Step 2 — the shell

`src/layouts/MainLayout.tsx` is the single wrapper for every page. Its outer element gets:

- `padding-inline: var(--page-inset)` on a transparent outer frame, with the existing content column moved into an inner element that carries the page surface.
- `mask-image: linear-gradient(to right, transparent 0, black var(--edge-fade), black calc(100% - var(--edge-fade)), transparent 100%)` on that inner element (plus `-webkit-mask-image`). This is what feathers the sides — no border, no shadow, no radius.
- The ambient navy background layer stays behind it, so the fade resolves into the existing brand background rather than white.

Masking is skipped when `--edge-fade` is `0`, so mobile is untouched.

## Step 3 — bands stay inside the inset

`full-bleed`, `full-bleed-mobile` and `bleed-inner` currently measure `100vw`. They change to `100%` of the inset shell (`width: 100%; margin-inline: calc(50% - 50%)` collapses to no negative margin when nested directly, otherwise `calc(50% - 50cqw)` against a container-query context on the shell). Result: hero, navy sections and footer still span the page edge to edge, but "edge" now means the inset page, and they inherit the same fade.

The six components hardcoding `100vw` get audited and switched to the utility so nothing pokes out.

## Step 4 — verification

- No horizontal scrollbar at 320 / 768 / 1024 / 1440 / 2560px.
- Sticky category toolbar still pins correctly and aligns with the inset.
- Comparison tables keep their own horizontal scroll where they need it; the mask does not clip a scrolling table's contents.
- Screenshot check of homepage, a category page, a comparison page and a test detail page.
- Type check, unit tests and lint clean.

Nothing about routing, metadata, structured data or data fetching is touched, so SEO and comparison behaviour are unaffected. The mask is a compositor-level effect with no layout cost.
