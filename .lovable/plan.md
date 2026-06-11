## Goal
When the user advances to the next set of questions in the AI-assisted test finder, the new step should appear scrolled to the top instead of leaving the user mid-page.

## Change
In `src/components/tests/AssistedTestFinder.tsx`, add a scroll-to-top side-effect that runs whenever `currentStep` changes.

- Add a `useEffect` watching `currentStep` that calls `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- This covers every transition: auto-advance single-select steps (`handleSingleSelect`), the "Next" button on multi-select steps (`handleNext`), Back navigation, loading, and results.

No other behaviour, styling, or business logic is changed.