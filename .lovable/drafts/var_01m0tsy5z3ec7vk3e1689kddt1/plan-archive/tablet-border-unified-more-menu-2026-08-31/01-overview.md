# Tablet border + unified "More" menu

Two refinements plus finishing the in-progress toolbar fix:

1. **Tablet gets the desktop treatment** — replace the soft feathered edge fade on tablet with the same hard navy hairline border as desktop, but keep the narrower inset (tablet doesn't get the full 2.5cm margin).
2. **"More" menu matches the hamburger menu** — the desktop toolbar's "More" dropdown is redesigned to be visually identical to the mobile hamburger drawer: same off-white background, uppercase section labels, and rounded white pill cards with coloured icon chips.
3. **Finish verifying the toolbar overflow fix** — category pills that no longer fit inside the 2.5cm-framed width already collapse into the "More" menu; this needs a final verification pass once the menu redesign lands.

## What changes visually

| Viewport | Now | After |
|---|---|---|
| Mobile (<768px) | Full-width, no border | Unchanged |
| Tablet (768–1023px) | 24px inset, soft feathered edges | 24px inset, **hard 1px navy side lines** (same as desktop) |
| Desktop (≥1024px) | 2.5cm inset, hard navy lines | Unchanged |

The "More" dropdown becomes a desktop rendering of the existing mobile drawer: identical card styling, identical sections (overflow categories at the top, then About / Services / Compare / Resources / Contact), identical icon chips and colours. The only difference is placement — an anchored panel under the "More" button rather than a full-height side drawer — and it keeps the language selector and sign-in pill row at the top.
