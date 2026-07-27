Update `src/components/sections/HeroMasthead.tsx` to match the uploaded screenshot's header treatment while keeping the language switcher and user menu in their current position.

Changes (desktop/tablet only — mobile header unchanged):

1. Wordmark row
   - Change the wordmark container from centered to left-aligned (`items-start`, remove centering wrapper).
   - Keep current responsive font sizing.

2. Divider
   - Add a thin white/10 horizontal rule directly under the wordmark, spanning the full masthead width (matching the faint line in the screenshot between "myhealthcheckup" and the slogan).

3. Slogan row
   - Left-align the slogan under the wordmark (remove centered alignment on `sm:` and up).
   - Keep existing copy and brand accent colours: white base, turquoise on "HEALTH.", pink on "CHOICE.", Montserrat bold uppercase.
   - Keep current responsive font sizing.

4. Language switcher + user menu
   - Leave the existing right-aligned controls row untouched (still sits below the slogan row, right-aligned, unchanged behaviour and styling).

5. Mobile (`< sm`)
   - No changes. The mobile slogan block in `src/pages/Index.tsx` stays as-is.

Verification
- Visual check at desktop/tablet: wordmark left-aligned, hairline divider beneath it, slogan left-aligned directly under the divider, language/user controls still present in their current spot.
- Mobile view unchanged.
- `npm run build` passes.
