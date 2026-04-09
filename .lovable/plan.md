

# Plan: Insert Batch 3 — 20 Biomarkers (Thyroid, Hormones, Minerals)

## Category mapping

| Biomarkers | Category |
|---|---|
| FT4, FT3, Total T4, Total T3, TPOAb, TgAb, Thyroglobulin | Thyroid |
| Oestradiol, Progesterone, Total Testosterone, Free Testosterone, SHBG, LH, FSH, Prolactin, DHEA-S, Cortisol | Hormones |
| Zinc, Magnesium, Selenium | Minerals |

## Change

**New migration: `supabase/migrations/20260409_insert_biomarkers_batch3.sql`**

Single `INSERT INTO biomarkers_library` with 20 rows. Each row includes `biomarker_name`, `biomarker_code`, `category`, `description`, `unit_of_measurement`, `normal_range_male`, `normal_range_female`, `clinical_significance`, `related_conditions`, `lifestyle_factors`, and `interpretation_guide` (JSON with low/high/urgent/improvement keys).

Codes: FT4, FT3, TT4, TT3, TPOAB, TGAB, TG, E2, PROG, TT, FT, SHBG, LH, FSH, PRL, DHEAS, CORT, ZN, MG, SE.

## Scope

- 1 migration file only
- No component or page changes
- Data appears automatically via existing `useBiomarkersLibrary` hook

