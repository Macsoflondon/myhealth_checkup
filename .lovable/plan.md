## Audit findings

### Tests mis-categorised as Men's Health
| Test | Provider | Current | Should be |
|---|---|---|---|
| Female Hair Loss Advanced | london-medical-laboratory | `Mens Health` | **Women's Health** |
| Female Sexual Health - Advanced Screen | london-medical-laboratory | `Mens Health` | **Women's Health** |
| Everyman/ Everywoman | randox | `Men's Health` | **General Health** (unisex panel) |
| Weight-loss management | london-medical-laboratory | `Mens Health` | **General Health** (not gender-specific) |
| Ultimate Athlete Performance (with PSA) | london-medical-laboratory | `Mens Health` | **Sports & Fitness** (PSA included but it's a performance panel) |

### Casing duplicates polluting filters
- `Mens Health` (8 rows) vs `Men's Health` (27 rows) — Men's Health page filters on the apostrophe form, so the 8 plain rows never surface anywhere
- Same issue elsewhere: `Liver Health` vs `Liver Function`, `Sports Performance` vs `Sports & Fitness`, `Hormone` vs `Hormones`, `Vitamins` / `Vitamin and Mineral Tests` vs `Vitamins & Minerals`, `Fatigue` vs `Fatigue & Energy`, `Allergy & Sensitivity` vs `Allergy`

Women's Health category was audited too — no foreign tests, no action needed.

## Changes

**Single data-only Supabase migration** — no schema, no code:

1. **Re-categorise the 5 mis-placed tests** above to their correct category.
2. **Normalise category casing** across `provider_tests`:
   - `Mens Health` → `Men's Health`
   - `Liver Function` → `Liver Health`
   - `Sports Performance` → `Sports & Fitness`
   - `Hormone` → `Hormones`
   - `Vitamins`, `Vitamin and Mineral Tests` → `Vitamins & Minerals`
   - `Fatigue` → `Fatigue & Energy`
   - `Allergy & Sensitivity` → `Allergy`
3. After the moves, re-run a verification SELECT against Men's Health to confirm only male-relevant tests remain.

No code changes — the category pages already filter on the canonical labels above; the migration just brings stragglers into them.

## Out of scope
- Provider source data isn't touched; if a provider re-syncs and re-introduces a bad category we'd need a separate normalisation trigger. Flag if you want that as a follow-up.
- Sample-type / collection-method audit (separate concern from category).
