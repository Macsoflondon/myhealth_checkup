

## Centre-Align the Bottom Homepage Sections on Mobile

The bottom sections of the homepage (Find a Clinic, Stats, Start Your Journey, and Here to Help) currently use left-aligned text and layouts on mobile, creating an inconsistent feel. This plan centres everything on mobile to match the rest of the page.

### Changes

**1. FindClinicSection.tsx -- Centre the left column on mobile**

- **Heading**: Remove `text-left [&>h2]:text-left` from the SectionHeading so it defaults to centred on mobile. Add `lg:text-left lg:[&>h2]:text-left` to keep it left-aligned on desktop only.
- **Description paragraph**: Add `text-center lg:text-left` so it centres on mobile.
- **Stats row**: Add `justify-center lg:justify-start` to centre the three stats (200+, 7, UK-wide) on mobile.
- **CTA buttons**: Add `items-center lg:items-start` and `justify-center` so buttons centre on mobile. Also add `text-center` to ensure button text is centred within each button.

**2. HereToHelp.tsx -- Centre the left column on mobile**

- **Badge ("Here to Help")**: Change `flex` to `flex justify-center lg:justify-start` so the badge centres on mobile.
- **Heading**: Remove `text-left [&>h2]:text-left` from SectionHeading, add `lg:text-left lg:[&>h2]:text-left` for desktop only.
- **Description paragraph**: Add `text-center lg:text-left` to centre on mobile.

**3. Button text centring (both sections)**

- Add `text-center justify-center items-center` to all Button className strings to ensure wording is always centred within the buttons. This applies to both FindClinicSection and the Start Your Journey card buttons.

### Technical Detail

All changes are Tailwind class adjustments only -- no structural or logic changes. The `lg:` breakpoint prefix ensures desktop keeps its current two-column left/right layout while mobile stacks everything centred.

