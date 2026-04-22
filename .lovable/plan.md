
## Shift hero clinic image down to reveal "myhealth checkup" wall logo

The "250+ Clinic Locations Nationwide" slide currently uses `objectPosition: "center 38%"`, which crops the image such that the wall-mounted "myhealth checkup" logo sits behind the headline text and is obscured.

Shifting the image's vertical focal point downward moves more of the upper portion of the photograph (where the wall logo lives) into view above the headline.

### Change

**File:** `src/components/sections/Hero.tsx` (line 24)

Update the `heroClinic` slide's `objectPosition`:

```ts
// Before
objectPosition: "center 38%",

// After
objectPosition: "center 58%",
```

A ~20% downward shift on the focal point is roughly equivalent to "2 lines" of vertical movement at the current hero height, bringing the wall logo into clear view above the headline while keeping the people/clinic scene framed naturally.

### Notes

- Only the second slide (`heroClinic`) is affected. The other four slides retain their existing focal points.
- No mobile override is needed — at narrower widths the same percentage produces an equivalent shift, and the image still fills the hero area.
- This is a static text/style attribute, so future tweaks like this can be done instantly via **Visual Edits** without spending credits.
