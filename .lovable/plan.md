
## Problem

Cards rendered in the AI-assisted recommendation section (`RecommendationEngine.tsx`) are a bespoke layout with hardcoded metadata:

- "2-5 working days" and "At-home collection" are hardcoded strings — that's why TruCheck™ shows "At-home collection" when it's actually in-clinic.
- Clicking "View test details" / "Read about this test" does nothing (no handler wired).
- The visual layout doesn't match the platform's standard test card.

Everywhere else on the platform (category pages, at-home, provider catalogues, compare pages) uses `UnifiedTestCard` → `UniversalTestCard`, which owns the standard on-click details modal and pulls collection/turnaround/biomarkers from the real test record.

## Goal

Make cards in the AI recommendations section render with the same `UnifiedTestCard` component used everywhere else, backed by the real test data from Supabase — so click behaviour, modal, and displayed fields (collection method, turnaround, biomarker count, price, provider, URL) are identical to every other card on the platform.

## Approach

1. **Look up the canonical test record** for each AI recommendation.
   - AI edge function returns `testName`, `provider`, `providerId`, `price`, `category`, `reason`, `urgency`, `confidence`.
   - Resolve to a real `ProviderTestCardData` via `provider_tests` (using `providerId` + fuzzy `test_name` LIKE match, since AI names may not match exactly and curly apostrophes need LIKE per project rules).
   - Reuse the same lookup path as `findTestByIdOrSlug` (`src/utils/testSlugLookup.ts`) so canonical categories, `sample_type`, `collection_options`, `turnaround_days_text`, `biomarker_count`, `url` all come from the database — not hardcoded strings.
   - Fetch all recommendations in one batched query (single `provider_tests` select filtered by `provider_id in (...)` + name matching) via TanStack Query, keyed by the recommendation set.

2. **Replace the bespoke card markup** in `RecommendationResults` (`src/components/ai/RecommendationEngine.tsx` lines ~131–186) with `<UnifiedTestCard>`, passing `testDetails` sourced from the resolved record. This automatically gives us:
   - Correct collection method (in-clinic vs at-home vs both) from `sample_type` / `collection_options`.
   - Correct turnaround from `turnaround_days_text`.
   - Real biomarker count.
   - The standard details modal opens on click — same modal as cancer screening / every category page.

3. **Preserve the AI-specific chrome** (urgency badge, "% match", the AI-generated `reason` sentence, the wellness disclaimer) as a thin wrapper *around* the standard card so the AI context isn't lost, but the card itself is the platform-standard component.

4. **Fallback behaviour** when a recommendation can't be resolved to a real test row (rare, but possible if the AI hallucinates a name): render the standard card with the AI-provided fields and a subtle "details pending verification" note — never show made-up fields like "At-home collection" for a clinic-only test.

## Files touched

- `src/components/ai/RecommendationEngine.tsx` — rewrite `RecommendationResults` card block to use `UnifiedTestCard`; drop hardcoded `2-5 working days` / `At-home collection` strings; keep urgency badge + reason + %match as wrapper metadata.
- New: `src/hooks/queries/useResolvedRecommendations.ts` — TanStack Query hook that takes `RecommendationProps[]` and returns them enriched with `ProviderTestCardData` from Supabase (single batched query).
- Possibly small helper in `src/utils/testSlugLookup.ts` — export a batched multi-lookup function if the single-lookup one isn't suitable.

## Out of scope

- Changing the AI edge function (`ai-human-context`) response shape.
- Redesigning the AI recommendation section layout beyond swapping card component.
- Touching the standard details modal itself.

## Verification

- Run quiz, get TruCheck™ recommendation → card shows **In-clinic collection** (not at-home), correct turnaround from DB, real biomarker count.
- Click card → same modal as clicking TruCheck™ on the Cancer Screening category page.
- Card visual matches the standard `UnifiedTestCard` used on `/cancer-screening`.
- Fallback path renders when a fabricated test name is returned (mocked test).
