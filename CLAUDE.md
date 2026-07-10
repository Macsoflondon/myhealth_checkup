# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Vite + React + TypeScript health-test/blood-test comparison platform (originally scaffolded by [Lovable](https://lovable.dev/projects/37e227e1-0d67-4515-b064-99c243036534) — pushes to this repo sync back to the Lovable project). It compares prices and clinics across test providers (Medichecks, Randox, Goodbody, London Health, Thriva, etc.), backed by a scraper pipeline, an admin panel for managing scraped data, and AI-assisted test analysis/recommendations. Supabase (project id `clvuioagsgfadynuvodj`) is the backend.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` / `npm run build:dev` — production / development-mode build
- `npm run lint` — ESLint (flat config in `eslint.config.js`; TS + React Hooks + React Refresh rules)
- `npm test` — Vitest, watch mode by default (jsdom, globals on, setup file `src/test/setup.ts`, v8 coverage). Tests live alongside source as `src/**/*.{test,spec}.{ts,tsx}`.
  - Single test file: `npm test -- src/path/to/file.test.tsx` (or `npx vitest run src/path/to/file.test.tsx` for a one-shot run)
- `npm run preview` — preview a production build
- `npm run prerender` — runs `scripts/prerender-routes.mjs` against a running preview server; `npm run build:full` chains build → preview → prerender → kill
- `npx playwright test e2e/` — the one e2e spec (`e2e/homepage-tickers.spec.ts`); no committed `playwright.config.*`, so it runs on Playwright defaults
- Supabase edge function tests (e.g. `supabase/functions/blood-test-analysis/index.test.ts`) are **Deno tests**, not part of `npm test` — they hit a live function URL via `Deno.test(...)` and need `deno test` with network/env access against a running (local or deployed) function.

Requires a `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` (used by `src/integrations/supabase/client.ts`). Path alias `@/*` → `src/*` (see `tsconfig.json`, mirrored in `components.json` for shadcn).

## Architecture

**Data layer (bottom to top):**
`src/integrations/supabase/client.ts` (raw Supabase client + generated `types.ts`) → `src/api/supabase` (API-level wrappers) → `src/services/*` (business logic — `ProviderDataService`, `LiveDataService`, `CompareService`, `CacheService`, `EncryptionService`, `UserPreferencesService`, with `queryBuilders/` and `transformers/` subfolders) → consumed by pages/components through `@tanstack/react-query` (`QueryClient` configured in `src/App.tsx`: 5 min staleTime, 10 min gcTime, no refetch-on-focus).

**Routing:** `src/routes/index.tsx` composes domain-split route modules — `authRoutes`, `contentRoutes`, `featureRoutes`, `testRoutes`, `complianceRoutes` — mounted under `BrowserRouter` in `App.tsx`. `src/pages/` has ~90 page components split roughly into: consumer content (health-topic pages like `ThyroidPage`, `HormonesPage`, `GutHealthPage`), comparison tools (`ProviderComparisonPage`, `CompareTests`, `CompareBySymptomPage`, `CompareByGoalPage`), clinic/test discovery (`FindClinicPage`, `ClinicDetailPage`, `TestDetailPage`, `TestCategoriesPage`), an **admin cluster** (`AdminScraperDashboardPage`, `AdminClinicScraperPage`, `AdminDataRefreshPage`, `AdminTestMapperPage`, etc. — these drive the scraper/data-ingestion pipeline in `supabase/functions/`), and legal/compliance pages.

**Auth & security:** `AuthContext` (`src/context/AuthContext.tsx`) + `SessionSecurityProvider` wrap the whole app in `App.tsx`; `EncryptionService` handles sensitive data. Admin pages have a separate `AdminAuth` flow.

**i18n & SEO:** `src/i18n/config.ts` + 11 locale files under `src/locales/` (en, es, fr, de, it, pt, nl, pl, ar, zh, ja); `GlobalHreflang` component emits matching hreflang tags. This is a content/SEO-heavy site — treat locale and hreflang consistency as a first-class concern when touching routing or page metadata.

**Bot-aware prerendering (see `PRERENDER.md`):** plain CSR returns an empty shell that most non-Googlebot AI crawlers can't render. `functions/_middleware.ts` (a Cloudflare Pages Function, rooted at `functions/`, separate from `supabase/functions/`) inspects the User-Agent: humans always get the SPA shell; recognized bots get a prerendered static snapshot (built by `scripts/prerender-routes.mjs`, ~60 routes) if one exists at `dist/<route>/index.html`, else fall back to the SPA shell. `functions/_known-routes.ts` backs this. Note: `vercel.json` also exists (caching + security headers, CSP), while the prerender docs assume Cloudflare Pages — check which platform is actually live before assuming deployment target.

**Backend (`supabase/functions/`):** organized by responsibility — AI/analysis (`health-ai-analysis`, `blood-test-analysis`, `ai-test-mapper`, `quiz-recommendations`), provider scrapers (`*-scraper` per provider, e.g. `medichecks-scraper`, `randox-scraper`, plus orchestrators `run-all-scrapers`/`scrape-all-clinics`), admin/security (`admin-recovery`, `verify-admin-mfa`, `encrypt-sensitive-data`, `check-leaked-password-protection`), and notifications/marketing (`send-test-notification`, `newsletter-subscribe`, `price-alert-checker`). Several ship their own `index.test.ts` (Deno tests, see Commands above).

**UI:** shadcn-ui components in `src/components/ui` (config: `components.json`, Tailwind base color `slate`, no RSC). Other component folders are domain-organized: `admin`, `auth`, `booking`, `clinic`, `compare`, `providers`, `tests`, `dashboard`, `search`, `security`, `seo`, `reviews`, `ai`.
