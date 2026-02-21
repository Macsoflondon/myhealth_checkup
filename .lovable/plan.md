

## Add Badge and Increase Hero Headline Size

### Gradient heading verification
All turquoise-to-pink gradient headings have been successfully removed from every section. No remaining instances found anywhere in the codebase.

### Changes to Hero.tsx

**1. Add "UK's #1 Health Test Comparison Platform" badge**
- Place above the H1 headline
- Styled as a pill/capsule badge: white background, pink (#e70d69) border, pink text, rounded-full
- Include a sparkle icon (Sparkles from lucide-react) in turquoise to the left of the text
- Centred above the headline with a small bottom margin

**2. Increase headline font size**
- Current sizes: `text-[0.85rem] xs:text-[1.05rem] sm:text-xl md:text-[1.7rem] lg:text-[2.5rem] xl:text-[2.75rem]`
- New sizes (roughly 40-50% larger to match the reference image): `text-[1.1rem] xs:text-[1.35rem] sm:text-2xl md:text-[2.2rem] lg:text-[3.25rem] xl:text-[3.75rem]`
- This brings the headline much closer to the large, bold style shown in the reference screenshot

### Technical details

**File**: `src/components/sections/Hero.tsx`

Badge markup (inserted before the H1):
```tsx
<div className="flex justify-center mb-3 sm:mb-4">
  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#e70d69] rounded-full text-[#e70d69] font-semibold text-sm sm:text-base shadow-sm">
    <Sparkles className="w-4 h-4 text-[#22c0d4]" />
    UK's #1 Health Test Comparison Platform
  </span>
</div>
```

H1 class update:
- Replace existing font size classes with the larger responsive sizes listed above

Import change:
- Add `Sparkles` to the lucide-react import

