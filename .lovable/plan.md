

## New "What Can Blood Testing Do For Me?" Editorial Section

Create a new section positioned between **Why myhealth checkup?** and **Our Featured Partners of the Month**, matching the style from the reference screenshot.

### Layout

The section uses a light background (off-white/cream) with two stacked rows, each containing a text block and an image block in an alternating pattern:

**Row 1 (text left, image right):**
- Turquoise label: "Your shortcut to smarter health"
- Bold heading: "What can blood testing do for me?"
- Body text explaining the value of blood testing in plain language
- Outlined CTA button: "Find your test"
- Right side: a high-quality image (blood test kit / sample collection visual)

**Row 2 (image left, text right):**
- Left side: a health-related image with an overlaid results card (showing a sample biomarker like Testosterone with a range bar)
- Turquoise label: "Quick, simple, secure"
- Bold heading: "How does it work?"
- Body text explaining the process (choose a test, take it at home or clinic, get results online)
- Outlined CTA button: "Learn more"

### Design details

- Background: `bg-[#f5f3ef]` (warm off-white matching the reference)
- Standard section padding: `py-12 sm:py-16 md:py-20`
- Two-column grid per row, stacking to single column on mobile
- Text uses brand navy (`#081129`) for headings, muted grey for body
- Labels in brand turquoise (`#22c0d4`), uppercase, small tracking
- CTA buttons: outlined style with navy border, navy text, hover to turquoise fill
- Images use `rounded-xl` with slight shadow
- The results card overlay in row 2 is a white card with a coloured range bar (turquoise-to-pink gradient) positioned over the image

### Technical details

**New file:** `src/components/sections/BloodTestingExplainer.tsx`
- Self-contained section component
- Two rows using CSS grid (`grid-cols-1 md:grid-cols-2`)
- Row 2 reverses order on desktop using `md:order-` classes
- Images sourced from placeholder paths initially (can be swapped later)
- "Find your test" links to `/assisted-test-finder`
- "Learn more" links to `/how-it-works`

**Modified file:** `src/pages/Index.tsx`
- Import and place `BloodTestingExplainer` between `WhyChooseUs` and `PartnerShowcaseGrid`

