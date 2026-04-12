

## GoodBody Provider Profile Page Edits

### Changes needed in two files:

**1. `src/data/compare/detailedProviders.ts` — GoodBody entry**

- Change `accreditation` from `"CQC-registered, UKAS ISO 15189 accredited laboratories"` to `"CQC regulated"`
- Change `sampleCollection` from `"Professional venous blood draw at pharmacy clinic locations (no finger-prick)"` to `"Professional venous blood draw at over 200+ clinics nationwide - home collection options - finger prick test"`
- Change `keyDifferentiators` — replace `"pharmacy-based clinic network"` with `"200+ clinics nationwide"` and replace `"walk-in and pre-booked appointments"` with `"pre-booked appointments"`

**2. `src/pages/ProviderProfilePage.tsx` — "Why Choose" card and accreditation display**

- **Accreditation card (line 366-368)**: For GoodBody specifically, display only `"CQC regulated"` (handled by data change above; also remove the `labAccreditation` field from GoodBody's data entry so the "Laboratory Accreditation: UKAS ISO 15189" row disappears)
- **"Why Choose" card (lines 439-494)**: Make all 6 feature boxes use the same green background (`#f0fdf4`) and green icon color (`#16a34a`) instead of alternating between green and the brand accent/other colors. This applies to: Fully Accredited Labs, Multiple Locations, Phone Support, Email Support, Doctor Reviewed Results, Fast Turnaround.

### Summary of visual changes
- Accreditation section shows only "CQC regulated", no UKAS line
- Sample collection updated to mention 200+ clinics, home collection, finger prick
- All 6 "Why Choose" boxes are uniform green
- "What sets them apart" text updated: 200+ clinics, pre-booked only

