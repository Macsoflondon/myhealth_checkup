# Expand Test Categories & Taxonomy

A large, cross-cutting change. Delivered in 5 sequenced phases so each is verifiable before the next. The taxonomy is data-driven (categories + aliases + redirects already exist) — we extend that scaffolding rather than hardcoding new branches.

## Phase 1 — Taxonomy (DB)

Single migration that inserts the new tree under existing parents. Uses the existing `categories` (ltree), `category_aliases` (auto-classifier), and `category_slug_redirects` (legacy slug stability) tables. No schema changes — architecture is already dynamic.

New nodes:

```text
at-home-tests/
  finger-prick-tests
  urine-tests
  bowel-tests           (replaces saliva)

sports-performance-tests/
  bodybuilding
  athletic-performance/
    cycling, running, swimming, triathlon, crossfit, hyrox,
    functional-fitness, team-sports, combat-sports,
    endurance-athletes, strength-athletes,
    male-performance, female-performance
  endurance
  recovery
  training-tests
  sports-nutrition
  performance-optimisation
```

Each node ships with:
- `category_aliases` rows (word-boundary regex for short tokens, `contains` for safe long phrases) so the existing `provider_tests_autoclassify` trigger maps tests automatically.
- `category_slug_redirects` rows for any legacy slugs (e.g. `saliva-tests` → `bowel-tests`).

## Phase 2 — Backfill & provider audit

After the migration:
1. Re-run `provider_tests_autoclassify` over all active `provider_tests` so existing rows pick up the new categories (no orphans — fallback to `general-health` stays).
2. Run `scripts/audit-nav-slugs.mjs` extended with the new slugs; fail CI on broken/ambiguous.
3. Print per-category counts so we can sanity-check distribution (e.g. confirm bowel tests landed in `bowel-tests`, not `gut-health`).

## Phase 3 — Lola individual biomarkers

`lola_health_products` already exists. Surface each row as a first-class product:
- Add a thin adapter so Lola biomarkers appear in the same listing/search/compare pipeline as `provider_tests` (single union view `v_catalog_items`).
- Generate `/biomarker/<slug>` product pages from this view.
- Include in sitemap generator.
- Tag each with the appropriate new categories via `category_test_mapping`.

## Phase 4 — Frontend wiring

Driven by data, so changes are minimal:
- `NavigationItems*` mega-menu reads category tree from DB (already structured; we add the new top-level branches and let children render recursively).
- Breadcrumbs already walk `categories.path` (ltree) — no code change.
- `/compare?category=<slug>` and `/tests/<slug>` already resolve through `categories` + `category_slug_redirects` — no code change.
- Filters on provider pages: extend the facet list to include the new top-level branches.

## Phase 5 — Verification

- Extend `scripts/audit-nav-slugs.mjs` to assert every new slug resolves and appears in the sitemap.
- Extend `scripts/audit-sticky-bar.py` route list with the new category pages.
- Add a SQL verification block printed at the end of the migration: counts of tests per new category, orphan count (must be 0 active tests outside `general-health` fallback unmapped).
- Add a Playwright smoke spec hitting one page per new top-level branch and asserting the StickyCategoryBar + breadcrumb render.

## Out of scope (call out explicitly)

- No schema changes to `categories` / `provider_tests` — current tables already support unlimited nesting via ltree.
- No new admin UI; the existing `/control` dashboard already lists categories and audit runs.
- No "recommendation engine" rewrite — related-tests already keys off `category_test_mapping`, which the backfill populates.

## Risks

- **Over-greedy aliases** (same class of issue as the earlier `alt`/`ast` incident). Mitigation: every short token uses `\m…\M` word-boundary regex; long phrases use `contains`. Verify with per-category counts before declaring done.
- **Lola biomarker volume** could inflate sitemap significantly. Mitigation: chunk sitemap into `/sitemap-biomarkers.xml` if count > 5k.
- **Bowel vs gut-health overlap**: explicit alias rules so FIT/faecal/colorectal land in `bowel-tests`, microbiome/IBS land in `gut-health`. Both get cross-listed where genuinely both apply.

## Confirmation needed before I start

1. **Saliva category**: confirm we delete `saliva-tests` entirely (and redirect to `bowel-tests`), or keep it hidden as a dormant node for any historical links.
2. **Lola biomarker pages**: one page per biomarker globally (`/biomarker/vitamin-d`) or scoped per provider (`/lola/biomarker/vitamin-d`)? The former is better for SEO and matches the "first-class entries" wording — confirming.
3. **Scope of Phase 3**: ship Lola biomarker pages in this same delivery, or split into a follow-up after Phases 1–2 are verified live? Recommend split — it isolates risk and gets the taxonomy in front of users sooner.
