# Fix the "Start Your Quiz" CTA 404

## What's wrong

The bottom-of-page CTA ("Not sure where to start? / Find the Right Health Test for You / Start Your Quiz") is rendered by one shared component. Its link defaults to `/quiz`, and no page overrides that default — but there is no `/quiz` route in the app, so every one of these buttons lands on the 404 page.

The Assisted Test Finder actually lives at `/find-test` (with `/assisted-test-finder` as a second working path).

Affected surfaces: every category page, the At-Home Tests page, the Most Popular Tests page, and the category empty/error states.

## The fix

1. Point the shared CTA at the real test finder route (`/find-test`) instead of the non-existent `/quiz`.
2. Add a `/quiz` route that redirects to `/find-test`, so any existing link, bookmark, or indexed URL using `/quiz` still works instead of 404ing.
3. Sweep the remaining quiz CTAs so they all resolve: confirm the ones already pointing at `/find-test` and `/assisted-test-finder` are consistent (Wellness, Provider Profile, Compare by goal/symptom, Conditions, homepage).

## Technical detail

- `src/components/sections/CategoryPageBottom.tsx`: change the `quizLink` default from `"/quiz"` to `"/find-test"`.
- New `src/routes/quiz.tsx`: `createFileRoute("/quiz")` with a `beforeLoad` that throws `redirect({ to: "/find-test" })` (permanent-style redirect, no page component needed).
- No changes to data, business logic, or the test finder itself.

## Verification

Load a category page, the At-Home Tests page, and the Most Popular Tests page in the preview, click "Start Your Quiz" on each, and confirm it lands on the test finder. Also hit `/quiz` directly and confirm it redirects rather than 404s.
