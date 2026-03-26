

# Replace "Our Featured Partners of the Month" Section with Hormone & Fertility Gallery

## What changes

The "Our Featured Partners of the Month" heading in `PartnerShowcaseGrid.tsx` will be replaced, and the `HORMONE_FERTILITY_TESTS` array in `GoodbodyTestGallery.tsx` will be updated with the new image data provided.

### 1. Update section header in `PartnerShowcaseGrid.tsx`
- Change the label from "Featured Partners" to "Hormone & Fertility"
- Change the h2 from "Our Featured Partners of the Month" to "Hormone & Fertility"
- Update the subtitle to match: "Goodbody blood test kits for targeted health insights"

### 2. Update `HORMONE_FERTILITY_TESTS` in `GoodbodyTestGallery.tsx`
Replace the existing 12-item array with the 12 images from the provided data, using the new `/images/` paths (not `/images/tests/`):

| # | Image | Code |
|---|-------|------|
| 1 | `/images/female-hormone-fertility.png` | Female Hormone & Fertility |
| 2 | `/images/prenatalsafe-5-nipt.png` | PrenatalSAFE 5 NIPT |
| 3 | `/images/testosterone-blood-test.png` | Testosterone |
| 4 | `/images/thyroid-function-blood-test.png` | Thyroid Function |
| 5 | `/images/pregnancy-blood-test.png` | Pregnancy |
| 6 | `/images/anti-mullerian-hormone.png` | Anti-Mullerian Hormone |
| 7 | `/images/prenatalsafe-complete-plus-nipt.png` | PrenatalSAFE Complete Plus NIPT |
| 8 | `/images/male-hormone-fertility.png` | Male Hormone & Fertility |
| 9 | `/images/prenatalsafe-3-nipt.png` | PrenatalSAFE 3 NIPT |
| 10 | `/images/cortisol-stress-blood-test.png` | Cortisol Stress |
| 11 | `/images/prenatalsafe-karyo-plus-nipt.png` | PrenatalSAFE Karyo Plus NIPT |
| 12 | `/images/thyroid-blood-test.png` | Thyroid |

All items use `aspectRatio: 0.8` and `objectFit: "contain"`. The alt text and code labels are taken directly from the provided data.

### 3. Set default active tab to "Hormone & Fertility"
In `GoodbodyTestGallery.tsx`, change the initial `useState` for `activeTab` from `"General Health"` to `"Hormone & Fertility"` so the section opens on the new gallery by default.

## Files affected
- `src/components/sections/PartnerShowcaseGrid.tsx` — update header text
- `src/components/sections/GoodbodyTestGallery.tsx` — replace `HORMONE_FERTILITY_TESTS` array, update default tab

