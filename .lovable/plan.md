

## Swap Two Sections on Homepage

Looking at `src/pages/Index.tsx`, the current order has:

- **WhyChooseUs** ("Why myhealth checkup?") at position 8 — directly above PartnerShowcaseGrid
- **TrustPlatformSection** ("Why Trust Us / Health Comparison Platform") at position 17 — near the bottom

The change is straightforward: swap their positions so TrustPlatformSection moves to where WhyChooseUs currently sits (above PartnerShowcaseGrid), and WhyChooseUs moves down to where TrustPlatformSection currently sits (near the bottom, after HereToHelp).

### File: `src/pages/Index.tsx`

**Before:**
```
WhyChooseUs          ← position 8
PartnerShowcaseGrid
...
HereToHelp
TrustPlatformSection ← position 17
```

**After:**
```
TrustPlatformSection ← moved up
PartnerShowcaseGrid
...
HereToHelp
WhyChooseUs          ← moved down
```

Single file change, two lines swapped.

