

## Add Top Padding to Medichecks Section

**File:** `src/components/sections/PartnerShowcaseGrid.tsx` (line 49)

Change `mt-2 mb-2` to `mt-8 mb-2 pt-4` on the Medichecks container div to add vertical breathing room above the logo/video row.

```
- <div className="md:col-span-2 mt-2 mb-2">
+ <div className="md:col-span-2 mt-8 mb-2 pt-4">
```

This adds ~2rem top margin and ~1rem top padding, creating a visible buffer so the video doesn't sit flush against the section boundary.

