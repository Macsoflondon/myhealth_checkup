

## Add Divider Lines in GoodbodyTestGallery

**File**: `src/components/sections/GoodbodyTestGallery.tsx`

### Changes

1. **Add a divider between the logo card and the test gallery** (after line 280, before line 283)
   - Insert a horizontal gradient line: `<div className="w-2/3 mx-auto h-px bg-gradient-to-r from-transparent via-brand-turquoise/30 to-transparent my-4" />`

2. **Add a divider between the test gallery and the "View Goodbody Profile" button** (after line 289, before line 292)
   - Insert the same style gradient line between the gallery and the CTA button

Both lines match the existing divider style already used in `PartnerShowcaseGrid`.

