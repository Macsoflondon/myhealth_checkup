# Biomarker library: Ornament-style upgrade

## Benchmark findings (Ornament Wiki / Health app)

Ornament's biomarker model — confirmed via their public API docs (`ornament.readme.io`) and Wiki taxonomy:

- **5,000+ biomarkers** organised by body system (Cardiovascular, Liver, Kidney, Thyroid, Anemia, Hormones, Vitamins & minerals, Bones & muscles, GI, Nervous system, etc.)
- Each biomarker carries: **synonyms / aliases**, **biomaterial** (serum / whole blood / urine / saliva / stool), **supported units with conversion factors**, status thresholds (Low / Normal / Optimal / High / Critical), **age + sex banded reference ranges**, and **linked educational articles**.
- Wiki entries follow a fixed shape: *What it is → Why it matters → What affects levels → Normal vs Optimal → Related conditions → When to retest*.
- Distinction between **"normal" (lab reference)** and **"optimal" (preventative)** ranges is a signature Ornament feature.

## Our current state

`biomarkers_library` (205 rows, 27 categories) has: code, name, category, description, clinical_significance, normal_range_male/female (free text), unit_of_measurement, interpretation_guide (jsonb), related_conditions[], lifestyle_factors[].

Gaps: no synonyms, no biomaterial, single free-text range only, no optimal band, no numeric thresholds, no alt units, no body-system taxonomy, no article links, ~25× smaller than Ornament.

## Proposed changes

### 1. Schema (migration)
Add to `biomarkers_library`:
- `synonyms text[]` — aliases used by labs (e.g. "Hb", "Haemoglobin", "HGB")
- `biomaterial text` — serum | plasma | whole_blood | urine | saliva | stool | other
- `body_system text` — cardiovascular | hepatic | renal | endocrine | haematology | metabolic | nutritional | immunological | reproductive | musculoskeletal | gastrointestinal | neurological
- `reference_ranges jsonb` — structured: `[{ sex, age_min, age_max, unit, normal_min, normal_max, optimal_min, optimal_max, critical_low, critical_high }]`
- `alternate_units jsonb` — `[{ unit, conversion_factor }]` for mg/dL ↔ mmol/L style conversions
- `what_it_measures text`, `why_it_matters text`, `what_affects_it text`, `when_to_retest text` — Ornament-style structured copy
- `related_articles jsonb` — `[{ title, slug, url }]` linking to Health Resource Hub
- `last_reviewed_at date`, `reviewed_by text` — clinical-review trail

Keep existing free-text `normal_range_male/female` for back-compat; deprecate in UI once `reference_ranges` is populated.

### 2. Data seeding
- Backfill the 205 existing biomarkers with `body_system`, `biomaterial`, `synonyms` (deterministic, no AI).
- Expand the core set to ~400 biomarkers covering the gaps Ornament emphasises: full lipid sub-fractions (ApoA1/B, Lp(a)), advanced thyroid (rT3, TgAb, TPOAb), reproductive hormones (AMH, SHBG, DHEA-S), inflammation (hs-CRP, ESR, fibrinogen), micronutrients (B1/B2/B6/B9 active, zinc, selenium, copper, iodine), tumour markers (CA-125, CA 19-9, CA 15-3, PSA free/total, CEA, AFP), HbA1c + fasting insulin + HOMA-IR, urinary markers (ACR, microalbumin), stool (calprotectin, occult blood).
- Use a one-shot seeding edge function pulling from a curated JSON (committed to repo), not from a third-party API — keeps us licence-clean.

### 3. UI (BiomarkerDatabasePage)
- Filter by **body system** + **biomaterial** alongside category.
- Show each biomarker card with the Ornament Wiki structure: What it measures / Why it matters / What affects it / Normal vs Optimal / Related conditions / When to retest.
- Render reference ranges as a table (sex × age band) with numeric Normal and Optimal bands side-by-side.
- Add inline unit converter for biomarkers with `alternate_units`.
- Cross-link related Health Resource Hub articles at the bottom of each card.

### 4. Search
- Index `synonyms` so users searching "HGB" land on Haemoglobin.

## Out of scope (separate work)
- User result digitisation (Ornament's lab-result OCR) — large project, raise separately.
- Personalised "your reading vs optimal" widget — depends on user-uploaded results pipeline.

## Confirm before I start
Two decisions I need from you:

1. **Scope:** schema + UI now, then a follow-up loop for the curated 400-biomarker seed JSON? Or do everything in one go (longer turnaround, larger diff)?
2. **Optimal ranges:** comfortable publishing "optimal" bands distinct from lab "normal"? It is Ornament's strongest feature but edges toward clinical guidance — wants a disclaimer ("educational, not medical advice; based on published preventative-health literature").
