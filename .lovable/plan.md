## Goal
Surface the real error inside the "Something went wrong" fallback so the underlying cause becomes visible. The current ErrorBoundary hides everything behind a generic message, which is why I can't reproduce or diagnose the crash from the screenshot — every category route I tested (`/at-home-tests`, `/tests/cancer`, `/tests/thyroid`, `/tests/hormones`, `/tests/general-health`, `/tests/sexual-health`, `/womens-health`, `/mens-health`, `/sports-performance`, `/fertility-tests`, `/wellness`, `/compare`, `/providers`, `/biomarker-database`, `/health-blog`) currently loads cleanly on mobile + desktop with zero page errors.

Likely cause given my repro failure: the user is on a stale cached bundle from before the recent universal-card refactor. The diagnostic patch will confirm it next time.

## Changes

**`src/components/common/ErrorBoundary.tsx`** — extend without changing the friendly UX:

1. Add a collapsible **"Technical details"** `<details>` block below the existing copy, showing:
   - `error.name: error.message`
   - `error.stack` (monospace, scrollable, max-height ~240px)
   - The component stack from `componentDidCatch` (stored on state)
2. Add a **"Reload page"** button next to "Try Again" — hard reload bypasses the soft state reset and clears module-level caches.
3. Add a **"Copy details"** button that copies error + stack to clipboard so the user can paste it back to me.
4. `componentDidCatch` already logs via `logger.error` — also `console.error` the raw `Error` (preserves stack in Server Logs / browser devtools).
5. Keep the CQC logo, layout, and primary copy unchanged.

State shape gains `errorInfo?: ErrorInfo` so the component stack is renderable.

## Out of scope
- No changes to routes, pages, the universal card, or the at-home filter.
- No new dependencies.
- No design-token changes.

## Follow-up
Once the patch lands, ask the user to hard-refresh (Cmd+Shift+R) the broken page. If it still crashes, the new fallback will show the actual error and stack — paste it back and the real fix becomes a 2-minute job.
