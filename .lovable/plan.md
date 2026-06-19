## Re-categorise standalone hormone biomarkers

Data-only migration on `provider_tests`. No code or schema changes.

### Moves

| Test | Provider | From → To |
|---|---|---|
| Estradiol (Oestradiol) | lola-health | Hormones → **Women's Health** |
| Progesterone | lola-health | Hormones → **Women's Health** |
| Progesterone | london-medical-laboratory | Hormones → **Women's Health** |
| Testosterone | lola-health | Hormones → **Men's Health** |
| Testosterone Check | london-medical-laboratory | Hormones → **Men's Health** |
| Testosterone Plus Profile | london-medical-laboratory | Hormones → **Men's Health** |
| Testosterone Test Kit… | medichecks | Hormones → **Men's Health** |

Oestradiol Blood Test for Female Reproductive Function (medichecks) is already in Women's Health — no action. TRT/Testosterone panels already in Men's Health — no action.

### DHT — applies to both sexes

`provider_tests.category` is a single text column, so a row can only live in one bucket. Two options:

- **A. Keep DHT in Hormones, surface it on both pages via a page-level allow-list** (Men's Health and Women's Health pages additionally include any test whose name matches `dihydrotestosterone`). One row, no duplication — but needs a small code tweak on the two category pages.
- **B. Duplicate the DHT row** so one copy sits in Men's Health and another in Women's Health (original stays in Hormones). Pure data, no code — but creates a duplicate that future scrapes/normalisers may collapse.

Which do you want? My recommendation is **A** — cleaner data, and the existing pages already accept ad-hoc inclusion lists.

### Out of scope
- No changes to the categoriser in `normalize-test-categories` (it would re-bucket these into Hormones on next run). Flag if you want me to teach it about standalone sex-hormone markers as a follow-up.