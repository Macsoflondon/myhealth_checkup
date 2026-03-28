

# Add "Vitamin & Nutrition" Tab to GoodBody Gallery

## File: `src/components/sections/GoodbodyTestGallery.tsx`

### Changes

1. **Update TABS array** (line 18) — insert "Vitamin & Nutrition" between "Hormone & Fertility" and "Cancer Screening":
   ```ts
   const TABS = ["General Health", "Hormone & Fertility", "Vitamin & Nutrition", "Cancer Screening"] as const;
   ```

2. **Create new `VITAMIN_NUTRITION_TESTS` array** — placed after `HORMONE_FERTILITY_TESTS` (after line 62). Populate with the vitamin/nutrition-related tests currently in `GENERAL_HEALTH_TESTS` plus relevant additions:
   - Vitamins Blood Test (`/images/tests/vitamins-blood-test.png`)
   - Advanced Vitamins Blood Test (`/images/tests/advanced-vitamins-blood-test.png`)
   - Iron Blood Test (`/images/tests/iron-blood-test.png`)
   - Tiredness and Fatigue Blood Test (`/images/tests/tiredness-fatigue-blood-test.png`)
   - Anaemia Blood Test (`/images/tests/anaemia-blood-test.png`)

3. **Update `getTestsForTab` switch** (line 85-92) — add the new case:
   ```ts
   case "Vitamin & Nutrition": return VITAMIN_NUTRITION_TESTS;
   ```

No other files affected. The tab type is inferred from the `TABS` const assertion.

