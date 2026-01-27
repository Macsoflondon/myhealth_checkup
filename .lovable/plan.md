
# Update MissionSection to Match Screenshot Design

## Overview

Redesign the MissionSection component to match the uploaded screenshot reference, updating the layout, typography, text content, and accreditation card styling.

---

## Changes Required

### 1. Update Heading Style

**Current:**
```tsx
Your health is your <span className="text-[#22c0d4]">greatest asset</span>
```

**New:**
```tsx
Your health is your <span className="bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent">greatest asset</span>
```

Apply the standard turquoise-to-pink gradient to "greatest asset" for consistency with other H2 headings.

---

### 2. Update Body Text Content

Restructure paragraphs to match the screenshot with "checkup" highlighted:

```text
Paragraph 1:
"At myhealth **checkup**, we believe everyone deserves access to transparent, trustworthy health information."

Paragraph 2:
"Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers."

Paragraph 3:
"We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC regulation."
```

Remove the current third paragraph about "clinical evidence and registered healthcare professionals".

---

### 3. Update Accreditation Cards

**Current format:**
- Title: "UKAS Accredited" 
- Subtitle: "Labs"

**New format (single line):**
- "UKAS Accredited Labs"
- "CQC Regulated Providers"  
- "ISO 15189 Certified"

**Card styling changes:**
- Title text in turquoise (#22c0d4) instead of navy
- Remove separate subtitle - combine into single title
- Keep light turquoise background (#e8f7f8)
- Outline-style icons

---

### 4. Data Structure Update

```tsx
const accreditations = [
  {
    icon: Shield,
    title: "UKAS Accredited Labs",
  },
  {
    icon: FileCheck,
    title: "CQC Regulated Providers",
  },
  {
    icon: Award,
    title: "ISO 15189 Certified",
  }
];
```

---

## File to Modify

| File | Changes |
|------|---------|
| `src/components/sections/MissionSection.tsx` | Update heading gradient, restructure body text, redesign accreditation cards |

---

## Technical Implementation

### Updated Card Markup

```tsx
<div className="flex-1 lg:flex-none bg-[#e8f7f8] rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-transparent flex items-center justify-center flex-shrink-0">
    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#22c0d4]" strokeWidth={1.5} />
  </div>
  <h3 className="font-heading font-semibold text-[#22c0d4] text-sm sm:text-base">
    {item.title}
  </h3>
</div>
```

### Updated Body Text

```tsx
<div className="space-y-4 text-gray-600 font-sans text-sm sm:text-base md:text-lg leading-relaxed">
  <p>
    At myhealth <span className="text-[#22c0d4] font-medium">checkup</span>, we believe everyone deserves access to transparent, trustworthy health information.
  </p>
  <p>
    Our mission is to empower you to take control of your health by making it simple to compare private health tests from accredited UK providers.
  </p>
  <p>
    We only feature providers that meet rigorous quality standards, including UKAS accreditation and CQC regulation.
  </p>
</div>
```

---

## Visual Result

### Before
- "greatest asset" in solid turquoise
- Three paragraphs with different content  
- Accreditation cards with title + subtitle in navy

### After
- "greatest asset" with turquoise-to-pink gradient
- Three paragraphs matching screenshot with "checkup" highlighted
- Accreditation cards with single-line turquoise titles matching the reference design
