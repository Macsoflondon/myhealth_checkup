# Sign-in page fixes and confirming the More menu

## What I checked first

The current code already does most of what was asked:

- `/auth` is still the full user sign-in / sign-up page (email, password, Remember me, Google, Sign Up toggle) with an "Admin · Crux Control" row at the foot — exactly as in your latest screenshot.
- "Crux Control (Admin)" is no longer in `moreNavigationSections`, so it should not appear in the More dropdown any more.

Your earlier screenshot showing Crux Control in More was dated 31 July, before that change, and the published site has not been republished since — that is almost certainly why you still see it live.

## What still needs fixing

1. **"Don't have an account? Sign Up" is unreadable.**
   In the screenshot it renders as a barely visible dark line just above the Admin row. It needs the same readable white treatment as "Remember me" and "Or continue with".

2. **Confirm the More dropdown in the running app.**
   I will load the preview and inspect the desktop More dropdown and the mobile drawer to prove Crux Control is gone from both. If any other menu still renders it, remove it there too.

3. **Republish.**
   The public site needs a republish for the menu change and the sign-in page changes to reach myhealthcheckup.co.uk.

## Not covered yet

You mentioned a picture that went missing but the image did not come through. Send it (or tell me which page/section it was on) and I will add it as a separate fix.

## Technical detail

- `src/pages/Auth.tsx`: the sign-up toggle button — force a high-contrast white class that cannot be overridden by the `text-primary` inherited from the `main` wrapper, matching the Remember me / divider treatment.
- Verification: run the preview, open the More dropdown on desktop and the mobile drawer, and assert no "Crux Control" entry; screenshot `/auth` to confirm every label is legible.
