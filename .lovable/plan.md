

## Reposition and Enlarge Provider Logos in BloodTestingExplainer

Move each provider logo out of the text column and position it at the heading level on the far right of its row. Enlarge logos to 3x their current size.

### What changes

**Row 1 (GoodBody):**
- Remove the logo from inside the text `<div>`
- Add a wrapper around the heading area that uses `flex justify-between items-start` so the heading sits left and the logo sits far right
- Enlarge the logo from `h-12` to `h-36` (3x)

**Row 2 (Medichecks):**
- Same treatment -- logo removed from text flow, placed at heading level on the far right
- Enlarge from `h-12` to `h-36` (3x)

On mobile (single column), the logo will appear centred above the heading since the flex container will stack or the logo will use `mx-auto` on small screens.

### Technical details

**File: `src/components/sections/BloodTestingExplainer.tsx`**

For each row, the current structure:
```
<div class="space-y-5 ...">
  <img logo h-12 />
  <p>Trusted UK Provider</p>
  <h2>Heading</h2>
  ...
</div>
```

Becomes:
```
<div class="space-y-5 ...">
  <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
    <div>
      <p>Trusted UK Provider</p>
      <h2>Heading</h2>
    </div>
    <img logo h-36 flex-shrink-0 />
  </div>
  ...paragraphs and CTA unchanged...
</div>
```

- Logo class changes from `h-12 w-auto mx-auto md:mx-0` to `h-36 w-auto mx-auto md:mx-0 flex-shrink-0`
- On mobile the logo appears centred above the header text (via column flex direction)
- On desktop the logo sits far right at the same vertical level as the heading

