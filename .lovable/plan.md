## Split slogan onto two lines on mobile

In `src/pages/Index.tsx`, update the slogan `<h1>` so on mobile it renders:
- Line 1 (centred): `YOUR HEALTH. YOUR CHOICE.`
- Line 2 (centred): `ONE TRUSTED PLATFORM.`

Implementation:
- Wrap `YOUR HEALTH. YOUR CHOICE.` and `ONE TRUSTED PLATFORM.` in two `<span class="block sm:inline">` groups (with a space before the second on `sm+`) so the break only happens on mobile — desktop/tablet keep the current single-line layout.
- Keep existing colour spans (`text-brand-turquoise` on HEALTH, `text-brand-pink` on CHOICE), font, tracking, size, and centring untouched.
- No other files or copy changes.
