## Already done (build mode, this turn)
- Scraped Goodbody + Medichecks bestseller pages via Firecrawl (Lola/Randox don't expose one publicly).
- Cleaned up noisy/mislabelled `provider_tests` rows: two "Advanced Well Man" rows whose URLs pointed at the Well Woman product, plus suffix junk (` | Book Online today`, ` — N Biomarkers | Lola Health`, ` - A Comprehensive Blood Test`, ` for Fertility & Menstrual Cycle`, ` | Medichecks`).
- Reset `is_popular` for Goodbody, Medichecks, Lola, Randox and reapplied a curated top-5 per partner using the scraped bestseller order (£0 / placeholder rows dropped). 19 popular rows total, no duplicates.

## Remaining
Belt-and-braces UI dedupe in `src/components/sections/DreamHealthShowcase.tsx` so any future label collision still can't render twice. Insert a `Set`-based filter on `${provider_id}::${cleanName(test_name).toLowerCase()}` between the existing Lola-Cardiovascular filter and `interleaveByProvider`. No other behaviour change.
