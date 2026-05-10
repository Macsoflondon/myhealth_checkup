## Goal

When users click the **"View kit"** button on any card in the *"Our Providers Most Popular Tests"* grid (homepage `DreamHealthShowcase` section), open a test-information modal styled exactly like the uploaded reference (Goodbody Clinic · Complete Allergy).

## Approach

The project already has a fully built modal that matches the reference image: `src/components/providers/ProviderTestDetailModal.tsx`. It renders:

- Branded coloured header with provider name · category, test title, price / biomarker count / turnaround pills, and a close button
- Description, Collection Method badges, Biomarkers Included chips
- Provider info card with brand-coloured avatar, tagline, accreditation chips
- "Book with {provider} →" primary CTA + "+ Compare" secondary button
- Footnote about being redirected to the provider's site

So no new modal needs to be built — we only need to wire it into the popular-tests grid.

## Changes (single file)

**`src/components/sections/DreamHealthShowcase.tsx`**

1. Import `useState` and `ProviderTestDetailModal`, plus the `ProviderTestCardData` type.
2. Add local state: `const [selectedTest, setSelectedTest] = useState<PopularTest | null>(null);`
3. Change the "View kit" button's `onClick` from `navigate("/popular-tests")` to `setSelectedTest(t)`.
4. Map the selected `PopularTest` into the shape the modal expects:
   ```ts
   {
     id, provider_id, test_name,
     description, price, category,
     sample_type, biomarker_count,
     url,
     biomarkers_list: t.markers, // PopularTest exposes `markers`
   }
   ```
5. Render `<ProviderTestDetailModal>` once at the bottom of the section, controlled by `open={!!selectedTest}` and `onOpenChange={(o) => !o && setSelectedTest(null)}`, passing `providerName={selectedTest.provider_name}`.

## Out of scope

- No changes to the modal's design, content sections, or other pages that already use it.
- No changes to data fetching — we reuse `usePopularTestsFromDatabase` data already loaded for the grid.
- The filmstrip tiles above the grid are not affected (no "View kit" button there).
