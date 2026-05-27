# Accredited Providers — Responsive QA Checklist

Quick manual check that the **UKAS / CQC / ISO 15189** accreditor row
always fits on a single line at mobile widths. Run after any change to
`AccreditedProvidersBar.tsx` or its Tailwind gap classes.

## Why it matters

The row uses `flex flex-wrap` with a graduated gap ladder:

| Class                | Breakpoint | Gap-x |
| -------------------- | ---------- | ----- |
| `gap-x-3` (base)     | < 640 px   | 12 px |
| `sm:gap-x-8`         | ≥ 640 px   | 32 px |
| `md:gap-x-10`        | ≥ 768 px   | 40 px |

If the base gap creeps back up (e.g. someone re-adds `gap-x-8`), ISO 15189
will wrap onto a second row at 375 px and the bar's vertical rhythm
breaks.

## Checklist

Open `/` in the preview. Resize the device frame using the toolbar above
the preview, or use DevTools responsive mode.

| Width | Device           | UKAS · CQC · ISO 15189 on one row? | Notes                                  |
| ----- | ---------------- | ---------------------------------- | -------------------------------------- |
| 320   | iPhone SE (1st)  | ☐                                  | Tightest realistic width. Must pass.   |
| 360   | Android baseline | ☐                                  |                                        |
| 375   | iPhone X / 12/13 | ☐                                  | Most common iPhone width.              |
| 390   | iPhone 14/15     | ☐                                  |                                        |
| 414   | iPhone Plus/Max  | ☐                                  |                                        |
| 640   | `sm:` breakpoint | ☐                                  | Gap should expand to 32 px here.       |
| 768   | iPad portrait    | ☐                                  | Gap should expand to 40 px here.       |

## Pass criteria

For every row above:

1. UKAS, CQC, and ISO 15189 share the **same y-coordinate** (one visual row).
2. Vertical dividers between accreditors are hidden below `sm` and visible
   from `sm` upward (`hidden sm:block` on the divider div).
3. No horizontal scroll appears on the section.
4. The white panel's left and right edges still match the neighbouring
   sections' content edges (gutter alignment — separate from this row check).

## Quick automated probe (optional)

From the browser DevTools console on `/`:

```js
const labels = [...document.querySelectorAll('section[aria-label="Accreditation and partners"] .font-bold')]
  .filter(el => /UKAS|CQC|ISO 15189/.test(el.textContent || ''));
const ys = labels.map(el => el.getBoundingClientRect().top);
console.assert(new Set(ys).size === 1, 'Accreditor labels are NOT on one row', ys);
console.log('y-coords:', ys);
```

Run it after each viewport change. `Set(ys).size === 1` ⇒ pass.
