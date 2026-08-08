# Fix Health Resource Hub images and summaries

Two confirmed data problems, verified against `provider_blog_posts` (455 rows):

- **Images**: only 55 rows have an `image_url`; 400 are null (all 277 Medichecks, all Clinilabs, Lola Health, London Health Company, Medical Diagnosis and 14 Goodbody rows). The page falls back to a single Unsplash stethoscope photo, so nearly every card looks identical.
- **Summaries**: 230 rows have a broken or near-empty excerpt. Medichecks rows literally read `More ]]>` — the Atom summary is wrapped in CDATA that the parser doesn't unwrap, so everything except the trailing "Read More" link text is stripped.

## What will change

### 1. Parse Atom entries properly
In `src/lib/blog/aggregator.server.ts`:
- Unwrap `<![CDATA[ ... ]]>` in Atom `title`, `summary` and `content` (RSS already does this; Atom does not).
- Prefer `<content>` over `<summary>` when building the excerpt, and pull the image from whichever of the two contains one.
- Strip trailing boilerplate ("Read More", "Continue reading", "The post … appeared first on …") before truncating.

### 2. Enrich every post from its own article page
Add an enrichment pass that runs after feed parsing, for any post missing an image or with an excerpt under ~60 characters:
- Fetch the article URL (batched, ~6 at a time, with the existing timeout/abort handling).
- Read `og:image` / `twitter:image` for the image and `og:description` / `meta description` for the excerpt.
- Resolve protocol-relative and root-relative image URLs against the article origin.

This gives each article its own provider hero image and its own real summary. Feed data still wins when it is already good, so the pass is cheap on subsequent runs.

### 3. Backfill the existing rows
Re-run the aggregation once against the live feeds so the 455 stored rows are upserted with correct `image_url` and `excerpt` values. Then verify by query that null images and `More ]]>` excerpts are gone.

### 4. Varied fallback, not one photo
In `src/pages/HealthBlogPage.tsx`, replace the single `FALLBACK_IMAGE` with a small set of category-keyed images (Heart Health, Hormones, Nutrition, Cancer Screening, Thyroid, Wellness, etc.), picked deterministically per article so repeats are spread out. Any article that still resolves to no image, or whose image 404s, gets its category image rather than the stethoscope.

## Notes

- Randox and London Medical Laboratory remain excluded: no feed, client-rendered blog index.
- Hotlinking provider hero images matches the existing aggregator pattern (title + summary + image + canonical link back to the source), no article text is copied.
- Providers that block direct page fetches will simply keep the category fallback; the run will report how many were enriched.
