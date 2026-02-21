

## Remove Gradient Text from Headings and Enlarge Header Logo

### What's changing

1. **Remove turquoise-to-pink gradient from all H1 and H2 headings** -- the gradient words will match the rest of the title (white on dark backgrounds, navy on light backgrounds)
2. **Slogans stay untouched** -- the "Your Health. Your Choice. One Trusted Platform!" tagline in the header keeps its turquoise/pink/white colouring
3. **Header logo increased by 50%** on both mobile and desktop

---

### 1. Core heading components (2 files)

**`src/components/ui/page-heading.tsx`** (H1)
- Remove the gradient styling from the `accent` span
- Render the accent text in the same colour as the title (`text-[#081129]`)
- On dark backgrounds, pages already override with `[&_span]:text-white` (e.g. HeroSection), so it will inherit correctly

**`src/components/ui/section-heading.tsx`** (H2)
- Remove the gradient styling from the `gradientText` span
- Render it in the same colour as the `title` text
- Since SectionHeading is used on both light backgrounds (navy text) and dark backgrounds (white text), add an optional `dark` prop or simply inherit colour from the parent -- simplest approach is to remove the gradient classes and let the text inherit the same styling as the title

---

### 2. Inline gradient headings (2 files)

**`src/components/sections/MostPopularTestsSection.tsx`** (line 93-98)
- Remove gradient classes from "Providers" span
- Apply `text-[#081129]` to match the rest of the heading

**`src/components/sections/TopConcernsSection.tsx`** (line 123-128)
- Remove gradient classes from "Top Concerns" span
- Apply `text-[#081129]` to match the rest of the heading

---

### 3. Header logo 50% larger (1 file)

**`src/components/layout/Header.tsx`**

Current desktop logo sizes: `h-24 lg:h-32 xl:h-36`
After 50% increase: `h-36 lg:h-48 xl:h-[54px]` -- converting: h-24 = 96px to 144px (h-36), h-32 = 128px to 192px (h-48), h-36 = 144px to 216px (h-[216px])

Current mobile logo sizes: `h-12 xs:h-14 sm:h-16`
After 50% increase: `h-[72px] xs:h-[84px] sm:h-24` -- converting: h-12 = 48px to 72px, h-14 = 56px to 84px, h-16 = 64px to 96px (h-24)

---

### Not touched (slogans)

These gradient/coloured slogans remain exactly as they are:
- Header tagline: "Your Health." (turquoise) / "Your Choice." (pink) / "One Trusted Platform!" (white)
- MissionSection banner: "Your health is your greatest asset!"
- Any other decorative slogan text

---

### Files modified

| File | Change |
|---|---|
| `src/components/ui/page-heading.tsx` | Remove gradient from accent text |
| `src/components/ui/section-heading.tsx` | Remove gradient from gradientText |
| `src/components/sections/MostPopularTestsSection.tsx` | Remove inline gradient from "Providers" |
| `src/components/sections/TopConcernsSection.tsx` | Remove inline gradient from "Top Concerns" |
| `src/components/layout/Header.tsx` | Increase logo height classes by 50% |

