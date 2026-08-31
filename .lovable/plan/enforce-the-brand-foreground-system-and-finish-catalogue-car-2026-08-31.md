# Enforce the brand foreground system and finish catalogue/card fixes

## Brand foreground rule

- Make navy the default foreground on every white or light surface, including body copy, secondary labels, metadata, button/link text, input text and neutral borders.
- Make white the default foreground on every navy or dark surface, with white at controlled opacity only for secondary hierarchy.
- Preserve explicitly assigned semantic colours such as brand pink, turquoise, clinical green, warnings and errors.
- Update the global semantic tokens so `foreground`, `muted-foreground`, `border` and `input` resolve to brand navy roles on light surfaces; retain separate `on-dark` tokens for dark surfaces.
- Replace remaining hardcoded grey foregrounds and neutral grey borders throughout public-facing components, beginning with the selected “Visit Site” control and all provider/test cards.

## Test-card behaviour

- Replace the current immediate 240ms hover switch with hover-intent state: a short entry delay prevents accidental activation, followed by an approximately 1.5-second crossfade.
- Keep keyboard focus immediate and accessible, keep touch devices on the resting face with the explicit “View details” control, and preserve reduced-motion handling.

## Catalogue clean-up and prevention

- Correctly delete the confirmed non-test rows and dependent records, accounting for UUID and text foreign-key types:
  - Medichecks urine in-store collection method
  - Medichecks urine nurse-visit collection method
  - Medichecks partner clinic visit collection method
  - Clinilabs phlebotomy-only clinic appointment
  - Standalone Lola Health biological kit
  - Randox vaccination products
- Extend both shared scraper and frontend junk-name guards so visits, collection methods, vouchers/gift cards, standalone collection kits and vaccination products cannot reappear.
- Use the shared frontend guard in at-home and provider grids rather than duplicate filters.
- Sort Lola Health full tests before add-ons while retaining popularity/name ordering within each group; retain the highlighted add-on badges.

## Verification

- Re-query the database and require zero matches for the removed non-test entries.
- Add focused junk-name unit coverage and run affected tests/lint.
- Run the repository contrast audit, then manually verify representative provider, test-card, category and dark-section screens at desktop and mobile sizes.
- Confirm navy-on-light and white-on-dark copy, navy neutral borders, smooth intentional card reveals, working keyboard/touch access, and Lola Health add-on ordering.
