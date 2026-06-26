# Expand Test Categories & Taxonomy — Implementation Plan

A platform-wide taxonomy overhaul. This is a large, multi-day build touching the database, every navigation surface, search, comparison, SEO and the crawl pipeline. Splitting into phases so each is verifiable before moving on.

## Goal

Replace the current hard-coded category constants with a **dynamic, database-driven taxonomy** that supports unlimited nesting, then layer the new At-Home, Sports & Fitness and Lola Health biomarker structures on top.

---

## Phase 1 — Dynamic Taxonomy Foundation (DB)

New tables (migration):

```text
categories
  id, slug, parent_id, name, short_name, description,
  icon, color, sort_order, level, path (ltree),
  seo_title, seo_description, is_active, created_at, updated_at

category_test_mapping
  category_id, provider_test_id (composite PK)

category_aliases             -- name/slug variants for crawl auto-classification
  category_id, alias, match_type ('exact'|'contains'|'regex')
```

- `provider_tests` gets a denormalised `category_ids uuid[]` for fast filtering.
- Trigger keeps `category_ids` in sync with `category_test_mapping`.
- `category_path_view` materialised view for breadcrumb lookups.
- RLS: read = anon + authenticated; write = service_role + admin.
- Seed migration loads the full new taxonomy tree.

## Phase 2 — Taxonomy Seed Data

Seeded as part of Phase 1 migration:

```text
at-home
  ├── finger-prick      (cholesterol, hba1c, hormones, vitamins, general,
  │                      cardiovascular, diabetes, iron, liver, kidney, thyroid)
  ├── urine             (kidney, uti, hormones, fertility, general, metabolic)
  └── bowel             (FIT, faecal occult blood, gut inflammation, microbiome,
                         digestive, colorectal, bowel cancer)

sports-fitness
  ├── bodybuilding      (TRT, hormone-opt, enhanced-athlete, steroid monitoring,
  │                      body composition, muscle growth, liver, kidney, cardio,
  │                      oestrogen, testosterone-opt)
  ├── athletic-performance
  │     ├── cycling, running, swimming, triathlon, crossfit, hyrox,
  │     ├── functional-fitness, team-sports, combat-sports,
  │     └── endurance-athletes, strength-athletes, male, female
  ├── endurance         (iron, ferritin, b12, electrolytes, fatigue, recovery,
  │                      inflammation, oxygen-carrying-capacity)
  ├── recovery          (cortisol, ck, inflammation, deficiencies, sleep,
  │                      hormones, stress)
  ├── training          (baseline, progress, readiness, injury-prevention, seasonal)
  ├── sports-nutrition  (vit-d, mg, zn, omega-3, b-vits, iron, protein, electrolytes)
  └── performance-optimisation
                        (hormone, recovery, nutrition, cardio, energy, fatigue,
                         performance-tracking)
```

Lola Health individual biomarkers seeded as standalone `provider_tests` rows with category mappings.

## Phase 3 — Crawl & Auto-Classification

- Extend `resolve_canonical_category` to walk `category_aliases` table.
- `provider_tests_autoset_canonical` trigger writes `category_ids` alongside `canonical_category` on insert/update.
- One-off back-fill job: classify every existing `provider_tests` row into the new taxonomy via alias matches + biomarker overlap, log unmatched rows for admin review.
- Lola Health scraper updated to emit one row per individual biomarker.

## Phase 4 — Frontend Taxonomy Layer

Replace static constants with a hook:

```text
src/hooks/useCategoryTree.ts            -- React Query, cached, suspense-friendly
src/lib/categoryTree.ts                 -- tree utils, breadcrumbs, ancestor lookup
src/constants/categories.ts             -- becomes a thin re-export + fallback
```

- `useNavigationData`, mega menu, mobile drawer, `BrowseByCategoryBar`, `MobileDropdownMenu` all read from `useCategoryTree`.
- `CategoryLandingPage` becomes fully dynamic — slug → category + children + tests.
- Breadcrumbs derived from `path` field.
- Filters, sort, comparison engine accept `category_id` array (back-compatible with old slug filters).

## Phase 5 — Search, SEO, Sitemap

- Search index re-indexed per category (parent + descendants).
- `seo_title` / `seo_description` per node, with fallback templating.
- JSON-LD `BreadcrumbList` from category path.
- `scripts/generate-sitemap.ts` queries `categories` table for every active node + every Lola individual biomarker.

## Phase 6 — Admin & QA

- Operations Control Centre gains a **Taxonomy** section: tree editor, alias manager, orphan-test report, recategorisation queue.
- New e2e: `e2e/taxonomy.spec.ts` walks every parent + sample child, asserts tests render, breadcrumbs correct, no 404s.
- Regression: existing category-mapping CI job extended to cover the new slugs.

## Phase 7 — Rollout

1. Ship Phase 1 + 2 migration (data + structure, no UI cutover).
2. Ship Phase 3 back-fill behind a flag, verify counts.
3. Flip frontend (Phase 4) to dynamic source; keep legacy constants as fallback for one release.
4. Ship Phases 5-6.
5. Remove legacy constants once analytics confirm zero traffic to old slugs.

---

## Technical Notes

- ltree extension required (`CREATE EXTENSION IF NOT EXISTS ltree;`) — already common in Supabase.
- Denormalised `category_ids uuid[]` keeps existing list queries fast and avoids N+1.
- All new tables follow the project's GRANT-then-RLS-then-policy order.
- No hard-coded category lists remain anywhere except a fallback seed used only when the network/DB is unreachable.
- Lovable AI Gateway is **not** used here — taxonomy work is deterministic.

## Scope Confirmation Needed

Three quick calls before I start cutting migrations:

1. **Lola Health individual biomarkers** — should they be standalone `provider_tests` rows (recommended, simplest), or a new `provider_biomarker_products` table? Standalone keeps comparison/cards working with zero refactor.
2. **Back-fill failures** — when an existing test can't be auto-classified, do you want it (a) parked in an `uncategorised` admin queue, or (b) left in its existing canonical_category until manually re-mapped?
3. **Rollout speed** — ship phase-by-phase with verification between each (safer, ~5-7 turns), or one mega-migration + UI cutover in a single shot (faster, riskier)?

Once you answer those I'll start with the Phase 1 migration.
