

## Create "Accredited Providers We Compare" Section

Recreate the screenshot's design — a dark navy card grid showing provider logos with accreditation badges — positioned between "HereToHelp" and "CallToAction" on the homepage.

### Design

- Dark navy background (`bg-[#081129]`) matching the screenshot
- Heading: "Accredited Providers We Compare" in uppercase tracking-widest, turquoise tinted
- Grid of provider cards (6 on desktop, 3x2 on tablet, 2x3 on mobile)
- Each card: dark glassmorphic card (`bg-white/5 border border-white/10 rounded-xl`), provider logo image (from `PROVIDER_LOGOS`), provider name in white, accreditation badge in turquoise pill
- Uses existing provider data from `src/constants/providers.ts` (logos, names, accreditations)
- Shows 6 core providers: Medichecks, Goodbody, Thriva, Randox, LML, Lola Health

### Files

**1. Create `src/components/sections/AccreditedProvidersBar.tsx`**
- Import `PROVIDER_DETAILS` from `src/constants/providers.ts`
- Define array of 6 featured providers with their first accreditation badge
- Render navy section with heading, 6-column grid of dark cards
- Each card: logo image (h-12), name text, accreditation pill badge

**2. Edit `src/pages/Index.tsx`**
- Import `AccreditedProvidersBar`
- Insert between `<HereToHelp />` (line 126) and `<CallToAction />` (line 127)

