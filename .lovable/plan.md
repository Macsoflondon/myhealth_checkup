## Goal
Make all currently invisible text on the auth pages visible by using the brand turquoise colour, and switch the "Don't have an account? Sign Up" toggle from white back to turquoise so it matches the other links/headings.

## Scope
Audit and update the full auth flow:
- `/auth` (sign-in, sign-up, and forgot-password views)
- `/reset-password`

## Findings so far
The auth pages sit on a dark navy (`#081129`) background. Several text elements are currently navy (`text-[#081129]`) and therefore invisible:
- `/auth` sign-in: "Remember me" label, "Don't have an account? Sign Up" toggle (now white, user wants turquoise), "Already have an account? Sign In" toggle in sign-up mode
- `/auth` forgot-password: "Enter your email address..." helper text, "Back to Sign In" link
- `/reset-password`: likely reuses similar dark-background styling; needs a quick pass

The brand turquoise used for headings and links is `#22c0d4`.

## Plan
1. **Audit** `src/pages/Auth.tsx` and `src/pages/ResetPassword.tsx` for any `text-[#081129]` or `text-primary` classes used on the dark navy background.
2. **Replace** those invisible navy classes with `text-[#22c0d4]` so they match the visible "Sign In" heading and "Forgot password?" link.
3. **Revert** the "Don't have an account? Sign Up" / "Already have an account? Sign In" toggle from `text-white` to `text-[#22c0d4]`.
4. **Verify** contrast and preview the three auth states (sign-in, sign-up, forgot-password) plus the reset-password page.

## No new dependencies or backend changes
This is a pure styling change in existing React components.

## Outcome
All auth-page text becomes readable on the dark navy background, and the sign-up toggle matches the existing turquoise accent colour.