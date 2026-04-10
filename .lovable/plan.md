

## Replace NAD+ with Advanced Well Woman in General Health Gallery

**File:** `src/components/sections/GoodbodyTestGallery.tsx` (line 107)

Replace the NAD+ entry in `GENERAL_HEALTH_TESTS` with an Advanced Well Woman entry:

```
- galleryItem({ src: "/images/tests/nad-plus-blood-test.png", alt: "NAD+ Blood Test", code: "NAD+", objectFit: "contain", matchTerms: ["nad plus", "nad blood test"] }),
+ galleryItem({ src: "/images/tests/advanced-well-woman.png", alt: "Advanced Well Woman Blood Test", code: "Advanced Well Woman", objectFit: "contain" }),
```

This removes the NAD+ duplicate from General Health while keeping NAD+ in Vitamin and Mineral Tests (line 150). The existing Advanced Well Woman entry at line 113 will remain — if that creates a duplicate, I can remove one; otherwise both stay as requested.

