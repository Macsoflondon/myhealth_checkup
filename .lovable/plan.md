

## Move BloodTestingExplainer Rows into PartnerShowcaseGrid and Remove Old Section

### Summary

Remove the standalone BloodTestingExplainer section from the homepage entirely. Replace the top row of PartnerShowcaseGrid (the white GoodBody card + partner video) with the two provider rows (GoodBody and Medichecks), adapted for the navy background. Keep the bottom two cards (Find a Clinic and Take Control) as they are.

### Changes

**1. PartnerShowcaseGrid.tsx -- replace top row with both provider rows**

Remove the current "Top Row" block (lines 33-81: the white GoodBody card and partner-video) and insert two new rows in its place:

- **Row 1 (GoodBody):** Text left, video right. Two-column grid, same as BloodTestingExplainer but restyled for navy background.
- **Row 2 (Medichecks):** Video left, text right. Same alternating layout.

Styling adaptations for navy background:
- All paragraph text changes from `text-muted-foreground` to `text-white/70`
- Headings change from `text-[hsl(var(--brand-navy))]` to `text-white`
- CTA buttons change from navy-outlined to turquoise filled (`bg-[#22c0d4] hover:bg-[#e70d69] text-white`), with text updated to "View GoodBody profile" and "View Medichecks profile"
- GoodBody logo enlarged from `h-36` to `h-72` (doubled again)
- Medichecks logo stays at `h-36` (no size change requested for Medichecks)
- Videos change from `object-cover aspect-[4/3]` to `object-contain` with a taller aspect ratio (`aspect-video` or `aspect-[16/9]`) so they are not cropped

**2. Remove BloodTestingExplainer from homepage**

- Delete the `<BloodTestingExplainer />` usage from `Index.tsx`
- Remove its import

**3. Optionally delete BloodTestingExplainer.tsx**

The component file can be deleted since it will no longer be used anywhere.

### Technical details

**File: `src/components/sections/PartnerShowcaseGrid.tsx`**

- Remove the `goodbodyLogo` import (no longer needed)
- Remove lines 33-81 (the old top row with white card and partner video)
- Insert two new grid rows before the bottom row:

Row 1 structure:
```
<div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center mb-8">
  <div class="space-y-5 text-center md:text-left">
    <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div>
        <p class="text-brand-turquoise ...">Trusted UK Provider</p>
        <h2 class="... text-white">Know more. Live Better.</h2>
      </div>
      <img goodbody logo h-72 />
    </div>
    <p class="text-white/70 ...">...</p>
    <Link to="/providers/goodbody-clinic">View GoodBody profile</Link>
  </div>
  <video src="/videos/goodbody-promo.mp4" class="rounded-xl w-full object-contain aspect-video" />
</div>
```

Row 2 structure (video left, text right):
```
<div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center">
  <video src="/videos/medichecks-promo.mp4" class="rounded-xl w-full object-contain aspect-video md:order-1" />
  <div class="space-y-5 md:order-2 text-center md:text-left">
    ...same pattern, text-white, h-36 logo...
    <Link to="/providers/medichecks">View Medichecks profile</Link>
  </div>
</div>
```

**File: `src/pages/Index.tsx`**

- Remove `import BloodTestingExplainer` (line 17)
- Remove `<BloodTestingExplainer />` usage

**File: `src/components/sections/BloodTestingExplainer.tsx`**

- Delete this file
