# Health Resource Hub — standard header + all-provider blog feed

## Part 1: Header (quick)

The hub currently has a bespoke left-aligned white header ("Health Resources" eyebrow / "Expert Health Insights" / strapline). It gets replaced with the same navy header the Complete Biomarker Reference Library and every category page now use:

- Navy `#081129` panel, dot grid, ambient glow orbs.
- Centred **Health Resource Hub** title in Montserrat, flanked by pink hairlines.
- One centred strapline: "Evidence-led articles from the UK's most trusted diagnostics providers."
- Compact turquoise-tick stat row: article count, provider count, categories.
- Tricolour divider closing the section.

The category pills, provider filters, search and card grid stay exactly as they are, just moved below the new header on white.

## Part 2: Provider blogs — current state

**We are not scraping blogs.** The nine test scrapers only scrape test/product data. The hub reads a static, hand-committed file (`src/data/blogArticles.ts`) with ~60 articles from three Shopify-based providers (Medichecks, Lola Health, Goodbody). Nothing refreshes it, so it will drift stale.

To have all providers' articles pull through live, this needs building. Proposed:

**Storage** — new `provider_blog_posts` table (provider, title, excerpt, url, image, category, published_at, source, last_seen_at), unique on url, public `SELECT` for anon (it's public editorial metadata), writes restricted to `service_role`. Full grants block per our migration rules.

**Ingestion** — new `blog-aggregator` edge function, run on a schedule:
- Shopify providers (Medichecks, Lola Health, Goodbody, and any other Shopify store) — read their public `/blogs/<handle>.atom` feeds. Cheap, structured, no scraping fragility.
- Non-Shopify providers (Thriva, Randox Health, London Medical Laboratory, London Health Company, Medical Diagnosis, Clinilabs) — try RSS/Atom or sitemap first; fall back to Firecrawl scrape of the blog index for the ones with no feed.
- Aggregator pattern only: title, excerpt/meta description, OG image, canonical link back to the provider. No full-text copying.
- Category assigned by keyword mapping onto our existing category list; unmatched go to Wellness.

**Reality check on coverage:** of the nine providers, not all publish a blog. Step one of the build is a discovery pass over all nine domains recording feed URL / index URL / "no blog" for each, so we surface accurate provider filters rather than empty tabs. Providers with no blog simply won't appear in the filter row.

**Frontend** — the page switches to a TanStack Query read of `provider_blog_posts` via the service layer, with the existing static list as SSR/empty-state fallback so the page never renders blank. Provider filter chips derive from the data rather than the hardcoded three-item array. A "last updated" timestamp is shown, per our data-transparency rule.

## Technical notes

- `src/pages/HealthBlogPage.tsx` — swap header block (lines ~131–150) for the standard navy hero; derive `ALL_PROVIDERS` from data instead of the hardcoded const.
- New migration: `provider_blog_posts` + grants + RLS + anon SELECT policy; pg_cron entry to hit the aggregator daily.
- New `supabase/functions/blog-aggregator/` with a per-provider source registry (feed URL, parser type), reusing `_shared` helpers and the existing Firecrawl wiring only where no feed exists.
- New `src/services/BlogService.ts` + `src/hooks/queries/useBlogArticles.ts`; components keep using `BlogArticle` type.
- One-off backfill run after deploy, then verify counts per provider before removing the static file (it stays as fallback).

## Scope check

Part 1 is a quick visual change. Part 2 is a real feature — new table, new edge function, discovery pass across nine domains, plus frontend rewiring. Both can go in this pass; if you want the header shipped immediately and the aggregator done separately, say so and I'll split it.
