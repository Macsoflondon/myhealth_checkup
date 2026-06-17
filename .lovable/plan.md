## Fix Goodbody Bento Layout Imbalance

The desktop bento grid in `src/components/sections/GoodbodyBentoShowcase.tsx` is misaligned because the central callout panel (col-span-2, row-span-2) is taller than two natural square rows. This stretches rows 2–3, leaves the logo card in row 1 looking empty, and inflates the kit tiles around it.

Tighten the callout so it fits within two square-row heights, letting all rows align:

- Reduce callout padding: `p-6 sm:p-8` → `p-5 sm:p-6`
- Reduce text size: `text-sm sm:text-base` → `text-xs sm:text-sm`
- Tighter leading + spacing: `leading-relaxed` → `leading-snug`, `mb-3` → `mb-2`, `mt-5` → `mt-3`
- Trim the third paragraph slightly so it doesn't push the box taller:
  - From: "Choose from over **60 blood and wellness tests**, each processed in **UKAS-accredited laboratories** and reviewed by a GP. Proactive health, made simple, reliable, and within reach."
  - To: "Over **60 blood and wellness tests**, processed in **UKAS-accredited laboratories** and reviewed by a GP."
- Make the button compact: add `size="sm"` to the `Button`.

Mobile layout (the `sm:hidden` block) is unchanged — it already stacks correctly.

No other files touched.