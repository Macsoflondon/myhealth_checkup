# Prerendering & bot-aware serving

## Why

Pure CSR/SPA returns a 3.9KB shell with `<div id="root"></div>` for every URL.
Four of six major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot)
do not execute JavaScript, so they never see content. Googlebot does render JS
but with an indexing delay that hurts a new domain.

This setup ships **bot-aware serving** without changing what humans see:

- **Humans** → SPA shell, hydrates as normal. Zero UX change.
- **Bots** → prerendered HTML snapshot of the route, served from CF Pages.

## Architecture

```
Request
  │
  ▼
functions/_middleware.ts (Cloudflare Pages Function)
  │
  ├─ User-Agent matches bot list?
  │   ├─ No  → next() → SPA shell (current behaviour)
  │   └─ Yes →
  │       │
  │       ├─ Snapshot exists at dist/<route>/index.html?
  │       │   ├─ Yes → serve snapshot with Vary: User-Agent
  │       │   └─ No  → next() → SPA shell (acceptable phase-1 fallback)
```

## Phase 1 coverage

`scripts/prerender-routes.mjs` lists **~60 static routes** that are prerendered:
- Homepage, sitemap, test categories
- All discovery / comparison hubs
- All provider hubs (9 providers)
- All E-E-A-T / content pages (about, how-we-rank, medical-review, etc.)
- All legal / compliance pages
- All static category landings (`/tests/cancer`, `/tests/heart`, etc.)

**Not in phase 1** (will fall through to SPA shell for bots):
- `/provider/:providerId/tests/:testId` (~1,200 provider test detail pages)
- `/locations/:clinicId` (48 clinic detail pages)
- `/compare/symptoms/:symptomSlug`, `/compare/goals/:goalSlug`
- `/blog/:slug` (when added)
- Per-biomarker pages (when added)

These will be added in phase 2 by querying Supabase at prerender time and
injecting the URL list into `prerender-routes.mjs`.

## Running the prerender

This step requires headless Chromium and is **not** run inside CF Pages build
(timeouts + no Chrome in the build sandbox). Run it locally before deploy or
in CI (GitHub Actions, etc.).

### Local

```bash
bun run build               # build SPA into dist/
bun run preview &           # serve dist/ on http://localhost:4173
sleep 3
bun run prerender           # snapshot ~60 routes into dist/<route>/index.html
kill %1
# now `dist/` contains the SPA + per-route prerendered HTML
# upload dist/ to Cloudflare Pages (or git push if Pages is wired to your repo)
```

### Against a live preview URL

```bash
PRERENDER_BASE_URL=https://preview.myhealthcheckup.co.uk bun run prerender
```

### CI (GitHub Actions sketch)

```yaml
- run: bun install
- run: bunx playwright install chromium --with-deps
- run: bun run build
- run: bun run preview & sleep 5
- run: bun run prerender
- uses: cloudflare/wrangler-action@v3
  with:
    command: pages deploy dist --project-name=myhealthcheckup
```

## Deploying to Cloudflare Pages

1. Connect your GitHub repo in CF Dashboard → Pages → Create project.
2. Build command: `bun run build` (the prerender step runs separately, see above)
3. Build output directory: `dist`
4. The `functions/` folder is auto-detected and `_middleware.ts` is deployed
   as a Pages Function on every route.
5. Point `www.myhealthcheckup.co.uk` at the Pages project (you're already on
   Cloudflare DNS, so this is a 2-min change).

## Verifying it works

```bash
# Bot UA → prerendered HTML, look for actual content (not <div id="root"></div>)
curl -A "GPTBot/1.0" https://www.myhealthcheckup.co.uk/how-we-rank | head -100
curl -A "ClaudeBot/1.0" https://www.myhealthcheckup.co.uk/ | grep "X-Prerendered"

# Human UA → SPA shell unchanged
curl -A "Mozilla/5.0 (Macintosh)" https://www.myhealthcheckup.co.uk/ | wc -c
# should be ~4KB
```

## When to re-run prerender

- After any change to a static page's content
- After adding a new static route (also add it to `prerender-routes.mjs`)
- Nightly (recommended) to capture content drift
- After every deploy if pages aren't time-sensitive
