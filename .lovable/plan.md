

# Replace Goodbody Logo with New Logo (5x Bigger)

## What will change

The Goodbody Clinic logo in the top-left partner card will be replaced with the new uploaded logo image. The logo size will increase from `h-10` (40px) to `h-[200px]` (200px) -- 5 times the current height.

## Technical details

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

1. **Copy the uploaded image** to `src/assets/goodbody-logo-new.png`
2. **Add an import** for the new logo: `import goodbodyLogo from "@/assets/goodbody-logo-new.png"`
3. **Replace the logo src** on line 18: change `PROVIDER_LOGOS["goodbody-clinic"]` to `goodbodyLogo`
4. **Increase the size** on line 20: change `h-10` to `h-[200px]`

