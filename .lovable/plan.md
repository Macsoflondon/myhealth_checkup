

## Make Mission Text Bold and Update Accreditation Card Colours

### Summary
This plan updates the MissionSection to make the first paragraph bold for emphasis and changes the accreditation card icons and text from turquoise to pink while keeping the turquoise container backgrounds.

### Changes

**1. Bold the first paragraph**
- Add `font-bold` class to the first paragraph text
- Keep the "checkup" highlight in turquoise as it currently is

**2. Update accreditation card colours**
- Change icon colour from turquoise (`text-[#22c0d4]`) to pink (`text-brand-pink` / `#e70d69`)
- Change text colour from turquoise (`text-[#22c0d4]`) to pink (`text-brand-pink` / `#e70d69`)
- Keep the container background as light turquoise (`#e8f7f8`)

### Visual Result
- The mission statement will stand out more with bold text
- The three accreditation cards will have pink icons and pink text on a light turquoise background, creating a nice colour contrast

### File to Update
- `src/components/sections/MissionSection.tsx`

