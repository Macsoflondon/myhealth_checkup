

## Add Missing Tests to General Health Tab

### Missing Tests
Three tests from your provided data are not in the current `GENERAL_HEALTH_TESTS` array in `src/components/sections/GoodbodyTestGallery.tsx`:

1. **Tiredness and Fatigue** (`/images/tiredness-fatigue-blood-test.png`)
2. **Advanced Vitamins** (`/images/advanced-vitamins-blood-test.png`)
3. **Iron** (`/images/iron-blood-test.png`)

### What Changes

**File: `src/components/sections/GoodbodyTestGallery.tsx`**

Add three entries to the `GENERAL_HEALTH_TESTS` array (lines 23-44), using the same `/images/tests/` path convention already used by the existing entries:

```typescript
{ src: "/images/tests/tiredness-fatigue-blood-test.png", alt: "Goodbody Tiredness and Fatigue Blood Test kit box", code: "Tiredness and Fatigue", objectFit: "contain" },
{ src: "/images/tests/advanced-vitamins-blood-test.png", alt: "Goodbody Advanced Vitamins Blood Test kit box", code: "Advanced Vitamins", objectFit: "contain" },
{ src: "/images/tests/iron-blood-test.png", alt: "Goodbody Iron Blood Test kit box", code: "Iron", objectFit: "contain" },
```

### Image Path Note
Your data uses `/images/` paths (e.g., `/images/iron-blood-test.png`) but the existing code uses `/images/tests/` (e.g., `/images/tests/liver-blood-test.png`). The plan will follow the existing `/images/tests/` convention. If the images are actually stored at `/images/` without the `tests/` subfolder, the paths will need adjusting. The three image files must exist at the correct path for them to render.

### No Other Changes Needed
The gallery component, modal, overlay logic, and tab system all work dynamically from the array data. Adding entries to the array is sufficient.

