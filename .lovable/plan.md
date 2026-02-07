

# Standardise All Button Pairs to Two-Tone Turquoise/Pink System

## What this does

Applies a consistent two-tone button rule across the entire platform: wherever two buttons appear side by side, one is turquoise (#22c0d4) and the other is pink (#e70d69), both with white text. On hover/click, they swap to the opposite brand colour. Additionally, the popular search pills and the search placeholder text in the hero section will be updated to turquoise.

## The rule

- **Button A (Primary)**: Turquoise background, white text. On hover: pink background, white text.
- **Button B (Secondary)**: Pink background, white text. On hover: turquoise background, white text.
- No icons next to button text (per existing button standards).
- All text remains white at all times (default and hover states).
- Rounded-xl corners, font-semibold, consistent sizing.

## Hero section search container changes

- **Popular search pills**: Change from grey (`bg-muted`) to turquoise background with white text. On hover, they flip to pink.
- **Search placeholder text** ("Search from over 200 tests"): Change the placeholder colour to turquoise (#22c0d4).

## All button pairs to update

### 1. Hero.tsx -- Main CTAs (lines 114-128)
**Current**: "Compare blood tests" is turquoise, "Find the right test for you" is navy outline.
**New**: "Compare blood tests" = turquoise bg, white text, hover to pink. "Find the right test for you" = pink bg, white text, hover to turquoise.

### 2. Hero.tsx -- Popular search pills (lines 176-183)
**Current**: Grey bg-muted with border, hover to turquoise.
**New**: Turquoise bg, white text, hover to pink bg with white text.

### 3. Hero.tsx -- Search input placeholder (line 138)
**Current**: Default grey placeholder colour.
**New**: Turquoise placeholder text via `placeholder:text-[#22c0d4]`.

### 4. Hero.tsx -- AI results "View available tests" button (line 163-167)
**Current**: Turquoise bg with turquoise/80 hover.
**New**: Turquoise bg, white text, hover to pink.

### 5. CallToAction.tsx -- CTA pair (lines 27-42)
**Current**: "Find Your Perfect Test" is pink with Search icon, "Browse All 300+ Tests" is white outline.
**New**: "Find Your Perfect Test" = turquoise bg, white text, hover to pink. Remove Search icon. "Browse All 300+ Tests" = pink bg, white text, hover to turquoise.

### 6. FindClinicSection.tsx -- CTA pair (lines 23-43)
**Current**: "Find nearest clinic" is turquoise with Navigation icon, "Browse all locations" is outline with List icon.
**New**: "Find nearest clinic" = turquoise bg, white text, hover to pink. Remove Navigation icon. "Browse all locations" = pink bg, white text, hover to turquoise. Remove List icon.

### 7. FinalCTA.tsx -- CTA pair (lines 29-47)
**Current**: "Compare tests" is turquoise with navy border, "Take the health quiz" is navy outline.
**New**: "Compare tests" = turquoise bg, white text, hover to pink. "Take the health quiz" = pink bg, white text, hover to turquoise.

### 8. TestCategories.tsx -- "View All Tests" button (line 171)
**Current**: Pink gradient.
**New**: Turquoise bg, white text, hover to pink. (Single button -- uses turquoise as default.)

### 9. MostPopularTestsSection.tsx -- "View all popular tests" (lines 224-233)
**Current**: Turquoise bg with turquoise border, hover to white.
**New**: Turquoise bg, white text, hover to pink, white text.

### 10. MostPopularTestsSection.tsx -- Individual "View test" buttons (lines 196-211)
**Current**: Turquoise bg, hover to white/turquoise.
**New**: Turquoise bg, white text, hover to pink, white text.

### 11. TopConcernsSection.tsx -- "View all categories" (lines 159-168)
**Current**: Primary outline.
**New**: Turquoise bg, white text, hover to pink.

## Summary of files to edit

| File | Changes |
|------|---------|
| `Hero.tsx` | Main CTAs to turquoise/pink pair; popular pills to turquoise; placeholder to turquoise; AI button hover to pink |
| `CallToAction.tsx` | Both buttons to turquoise/pink pair; remove icons |
| `FindClinicSection.tsx` | Both buttons to turquoise/pink pair; remove icons |
| `FinalCTA.tsx` | Both buttons to turquoise/pink pair |
| `TestCategories.tsx` | CTA button to turquoise with pink hover |
| `MostPopularTestsSection.tsx` | All buttons to turquoise with pink hover |
| `TopConcernsSection.tsx` | CTA button to turquoise with pink hover |

## Standard CSS classes for reuse

**Turquoise button (primary position)**:
`bg-[#22c0d4] text-white hover:bg-[#e70d69] transition-colors duration-300`

**Pink button (secondary position)**:
`bg-[#e70d69] text-white hover:bg-[#22c0d4] transition-colors duration-300`

**Turquoise pill (popular searches)**:
`bg-[#22c0d4] text-white hover:bg-[#e70d69] rounded-full transition-colors duration-300`

