# Why test cards are empty

The data is still there — 591 active tests across 9 providers in `provider_tests`. The problem is at the Postgres permission layer, not the UI.

Console shows every query failing with:

```
permission denied for table provider_tests (42501)
```

I checked `information_schema.role_table_grants` for the public-facing tables the site reads from and found **zero grants** on:

- `provider_tests`
- `tests_master`
- `provider_test_mapping`
- `categories`
- `category_aliases`

RLS is enabled and the `SELECT` policies for `public` still exist, but Supabase's Data API (PostgREST) requires explicit `GRANT`s to `anon` / `authenticated` on top of RLS. Without them every request 401/403s before RLS is even evaluated — so `MostPopularTestsSection`, `ProviderTestsGrid`, `DbCategoryPage`, the at-home grid, the homepage ticker, etc. all render empty.

A recent migration (likely the categories/taxonomy work) appears to have recreated or replaced these tables without re-issuing the `GRANT` block.

# Fix

One migration that re-grants Data API access matching the existing RLS policies (public read, authenticated write, full service_role).

```sql
-- Read-mostly catalogue tables (public SELECT policy already in place)
GRANT SELECT ON public.provider_tests       TO anon, authenticated;
GRANT SELECT ON public.tests_master         TO anon, authenticated;
GRANT SELECT ON public.provider_test_mapping TO anon, authenticated;
GRANT SELECT ON public.categories           TO anon, authenticated;
GRANT SELECT ON public.category_aliases     TO anon, authenticated;

-- Admin write paths (policies already gate by role)
GRANT INSERT, UPDATE, DELETE ON public.categories       TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.category_aliases TO authenticated;

-- Service role for edge functions / scrapers
GRANT ALL ON public.provider_tests, public.tests_master, public.provider_test_mapping,
             public.categories, public.category_aliases
  TO service_role;
```

I'll also sweep sibling tables touched in the same taxonomy migration (`provider_test_categories`, any new mapping tables) and grant them the same way if they're missing grants, so we don't whack-a-mole the next page.

# Verification

1. Re-run `information_schema.role_table_grants` query — expect rows for anon/authenticated/service_role.
2. Hit `/` and `/at-home-tests` in the preview; confirm cards render and no `42501` in console.
3. Hit a provider page (`/provider/goodbody-clinic`) and a category page to confirm `ProviderTestsGrid` and `DbCategoryPage` repopulate.

No frontend code changes needed — this is purely a DB grant repair.
