

# Make All White-Background Sections Pure Clinical White

## What will change

All homepage sections that currently have subtle tinted backgrounds (bluish, greenish, or greyish) will be changed to pure `#ffffff` white for a clean, clinical look.

## Sections affected

1. **JourneySimplified** ("Your Health Journey Simplified") - currently has a 3% navy tint (`bg-[hsl(224,67%,10%,0.03)]`), will become `bg-white`
2. **WhyChooseUs** - currently has a light turquoise tint (`bg-[hsl(187,72%,97%)]`), will become `bg-white`
3. **PartnerShowcaseGrid** ("Our Featured Partners") - currently has a light blue-green tint (`bg-[#f0fafb]`), will become `bg-white`
4. **HowItWorks** - currently `bg-gray-50` (slight grey), will become `bg-white`
5. **AccreditationCards** - currently `bg-background` (which resolves to white via CSS variable, but will be made explicitly `bg-white` for consistency)

## Sections already pure white (no changes needed)

- MissionSection (`bg-white`)
- TrustBadgesSection (`bg-white`)

## Technical details

**Files to edit (5 files, one line each):**

1. `src/components/sections/JourneySimplified.tsx` line 27: change `bg-[hsl(224,67%,10%,0.03)]` to `bg-white`
2. `src/components/sections/WhyChooseUs.tsx` line 14: change `bg-[hsl(187,72%,97%)]` to `bg-white`
3. `src/components/sections/PartnerShowcaseGrid.tsx` line 10: change `bg-[#f0fafb]` to `bg-white`
4. `src/components/sections/HowItWorks.tsx` line 4: change `bg-gray-50` to `bg-white`
5. `src/components/sections/AccreditationCards.tsx` line 32: change `bg-background` to `bg-white`

