## Goal

Make `Our Partners' Most Popular Tests` (homepage carousel + grid + the `/most-popular-tests` page) reflect **only** what each provider themselves advertises as popular/best-selling, with **only real provider product images**. No generic kit fallbacks, no AI-generated images.

## What's wrong today

1. The `is_popular` flag in `provider_tests` was last set by a generic crawl of broad catalogue URLs (e.g. Lola Health's `/all-blood-tests`, Goodbody's full catalogue), not curated "best-seller" lists. That's why obscure tests (Lola CRP/Iron/Glucose, Goodbody Alzheimer's) ended up flagged.
2. Many flagged tests have `image_url = NULL` or a stale placeholder (`/kits/kit-*.jpg`, `lovableproject.com/lovable-uploads`). The frontend falls back to a generic kit topic match — that's where the wrong-looking Medichecks Ultimate Performance, Lola CRP/Iron/Glucose images come from.

## Plan

### 1. Rewrite `scrape-popular-tests` edge function

Per-provider, use the URLs the providers themselves use to surface their best-sellers/popular tests:

| Provider | Source URL (curated popular) |
|---|---|
| Medichecks | `https://www.medichecks.com/collections/best-sellers` |
| Goodbody Clinic | `https://goodbodyclinic.com/collections/best-selling-blood-tests` (Shopify best-sellers collection) |
| Thriva | `https://thriva.co/blood-tests` (sorted by popularity) |
| Lola Health | `https://www.lolahealth.com/popular-blood-tests` (their popular collection) |
| Randox | `https://www.randoxhealth.com/popular` |
| London Medical Laboratory | `https://www.londonmedicallaboratory.com/blood-tests` (filter by `bestseller`) |

For each provider:
- Firecrawl `scrape` with `formats: ['markdown','links',{type:'json',schema:…}]`
- JSON schema: `tests: [{ name, price, product_url, image_url }]`
- Take top 5 per provider in the order they appear on the page (that *is* the provider's ranking).

### 2. For each matched test, persist the real image

- For each scraped item, follow `product_url` and scrape `formats: ['json']` extracting `og:image` (and/or first product gallery image).
- Update `provider_tests` for the matched DB row:
  - `is_popular = true`
  - `popularity_rank = <position on provider's own page, 1-N>`
  - `image_url = <scraped product image URL>` (only if non-empty and looks like an image)
- Tests **not** on the provider's popular page → `is_popular = false`, `popularity_rank = null` (image_url left alone).

### 3. Hide tests without a real provider image (frontend)

In `DreamHealthShowcase.tsx` and `MostPopularTests` page:
- Remove the entire `pickTopicImage` topic-fallback path and the `providerOverrides` block.
- `resolveImage` becomes: return `t.image_url` if it's a real, non-placeholder URL, otherwise return `null`.
- Cards/tiles whose `resolveImage` returns null are **filtered out** of the list before render. No placeholder, no generated image, no in-house kit asset.

### 4. Run once, verify

- Invoke `scrape-popular-tests` and report back which tests each provider listed + which images were captured.
- Show the user the resulting popular list per provider so they can confirm before we call it done.

## Files touched

- `supabase/functions/scrape-popular-tests/index.ts` — rewrite scrape logic, add per-product image scrape, write `image_url`.
- `src/components/sections/DreamHealthShowcase.tsx` — strip topic/override fallbacks, filter tests without real image.
- `src/pages/MostPopularTests.tsx` (or equivalent) — same filter rule.

## Things I will NOT do

- No image generation. No in-house kit asset fallback. No topic-based image guessing.
- No manual edits to the popular list — it must come from the provider's page.
- No changes to other sections of the site.

## Open question

Some providers (Thriva, Randox, London Medical Lab, Clinilabs) don't have a clean "best sellers" page. For these, the function will return 0 popular tests and they simply won't appear in the section until they publish one or you tell me a specific URL to use. Confirm that's the desired behaviour, or give me the URL you want used for each.
