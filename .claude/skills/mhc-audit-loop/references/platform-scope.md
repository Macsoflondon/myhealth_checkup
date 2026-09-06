# Platform audit scope

For `[AUDIT-LOOP] platform`. Same loop, same evidence rules, wider surface. Work the
domains in this order — a security or compliance finding outranks a product one.

Do not attempt all of it in one pass on a repo this size. Split by domain, run the loop
per domain, and keep one ledger per domain under `docs/qa/`.

## 1. Security

- `npm run security:check` (secrets scan + RLS grants) — real output in the ledger.
- Supabase RLS: every table with user or provider data has policies; `mcp__Supabase__get_advisors`
  for the security lens; anon-key reachable tables reviewed deliberately.
- Edge functions (`supabase/functions/`): auth checks on admin functions, no secrets in
  source, cron calls going through the vault-backed SQL helpers rather than embedded keys.
- Admin cluster (`/admin/*`) and Crux Control (`/control`) — route guards actually enforce,
  client-side checks are not the only barrier.
- The `security-review` skill covers pending-diff review; this is the standing audit.

## 2. Compliance

- Medical disclaimers visible and non-alarmist on test, category and comparison pages.
- Nothing presenting the platform as a medical provider.
- Provider inclusion claims (UKAS, CQC, ISO 15189) backed by a real field, not hardcoded.
- Affiliate relationships disclosed; no pay-to-rank behaviour in ranking or sort code.
- Data collection limited to name, email, phone, saved tests. No raw medical results,
  no identifiable diagnostic data. Check forms, local storage, and analytics payloads.
- No silent tracking; consent mechanisms legible.
- No NHS-integration language implying something that does not exist yet.

## 3. Correctness

- Type safety: `any` escapes, especially in adapters where fields get dropped silently.
- Dead code: components no longer wired to a route (`src/pages/TestDetailPage.tsx` was
  one — confirm current state rather than trusting this note).
- Duplicate routes rendering divergent content for the same URL shape.
- Error and loading states on every data-fetching surface.
- React Query keys unique per parameter set.

## 4. SEO and i18n

- `npm run seo:check`, `npm run seo:structured-data`, `npm run sitemap`.
- Canonical tags, hreflang across all 11 locales, structured data validity.
- The bot-prerender path (`functions/_middleware.ts`, `functions/_known-routes.ts`,
  `scripts/prerender-routes.mjs`) still covers the routes that matter after any route change.

## 5. Performance and accessibility

- Bundle size on the heaviest routes; `scripts/audit-contrast.mjs` for contrast.
- Keyboard reachability and focus order on cards, filters and comparison controls.
- Touch targets at mobile width.
- Images sized and lazy where below the fold.

## 6. Deployment reality

Cloudflare Pages is the deploy target (`.github/workflows/deploy.yml`); `vercel.json` is
vestigial and its headers are probably not served — verify before citing them as
protection. Production has been observed serving 404s while CI was green, so never
report a fix as live without checking what the domain actually returns.
