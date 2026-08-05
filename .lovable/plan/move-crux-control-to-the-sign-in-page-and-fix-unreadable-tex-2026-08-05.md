# Move Crux Control to the sign-in page and fix unreadable text

## What changes

1. **Remove Crux Control from the public "More" menu**
   - Drop the "Crux Control (Admin)" entry from the More dropdown so it is no longer discoverable by ordinary visitors.

2. **Add Crux Control to the sign-in page footer**
   - Next to the existing faint "Admin" link at the bottom of the sign-in form, add a "Crux Control" link to `/control`, separated by a divider dot.
   - Both links sit in the same small admin row — present but understated, exactly where the image is circled.

3. **Make the three highlighted items readable**
   - "Remember me" label: currently navy (#081129) on the navy panel, so it reads as an empty circle with no text. Change to bright white.
   - "OR CONTINUE WITH": muted grey on navy. Change to white with normal opacity so it is clearly legible.
   - "Admin" (and the new "Crux Control") links: bump from 10px near-invisible grey to a readable small white/light label with a hover state.

## Notes

- Nothing about who can actually use `/control` changes — the route already shows a proper access notice and requires an admin session. This only changes where the entry point is surfaced.
- The links are visible on the sign-in page to anyone who reaches it, but they are no longer in site-wide navigation.

## Technical detail

- `src/components/header/NavigationItems.tsx`: remove the `{ name: "Crux Control (Admin)", path: "/control" }` item from `moreNavigationSections`.
- `src/components/layout/BrowseByCategoryBar.tsx`: remove the matching `"Crux Control (Admin)"` icon/colour map entry.
- `src/pages/Auth.tsx`:
  - Remember-me `Label`: `text-[#081129]` → white token-based class.
  - "Or continue with" `span`: `text-muted-foreground` → white/high-contrast class.
  - Admin footer block: replace the single 10px grey button with a row containing "Admin" (`/admin/login`) and "Crux Control" (`/control`) at `text-xs`, light colour, hover underline.
