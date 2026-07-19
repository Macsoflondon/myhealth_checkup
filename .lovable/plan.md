## Plan

Fix the AI Health Quiz header row so it matches the requested three equal spacing zones on desktop and stays clean on mobile.

### Changes

1. **Make the desktop row use a real 3-part grid**
   - Replace the current `justify-between max-w-4xl` flex row with a full-width grid structure:

```text
[ equal empty space ] [ H2 ] [ equal space ] [ CTA ] [ equal empty space ]
```

   - Use equal `1fr` spacer columns so the left edge gutter, centre gap, and right edge gutter are mathematically identical.

2. **Keep H2 and CTA visually aligned**
   - Align both items to the same row centreline on desktop.
   - Keep the H2 on one line at desktop widths.
   - Keep the helper text directly beneath the CTA, centred to the button.

3. **Mobile behaviour**
   - Switch back to a clean stacked layout on small screens:

```text
Not sure which test you need?
Take the Health Quiz
helper text
```

   - Remove awkward side spacing on mobile while keeping text/button sizes consistent.

4. **No scope creep**
   - Only touch the AI Health Quiz section in `src/pages/Index.tsx`.
   - No data, routing, SEO, or backend changes.