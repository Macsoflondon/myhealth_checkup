Change the sign-in prompt alert text in `src/components/ai/RecommendationEngine.tsx` (lines 194–202) to white.

**Change details**
- Add `text-white` to the `<AlertDescription>` element that contains:
  “Sign in to save your recommendations: Create an account to securely store your health queries and access them anytime. Sign in now”
- Ensure the nested `<a>` link remains readable on the tinted alert background (likely by adding `text-white` or `text-white/90` to the link as well).

**Verification**
- Run `npx vite build` to confirm the production build still succeeds.
- Confirm `.env` remains tracked (not gitignored) so publishing continues to work.

**Files affected**
- `src/components/ai/RecommendationEngine.tsx`