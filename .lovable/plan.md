## Problem

Logged-in users have no way to change their password from the dashboard. The only password reset flow is via the public "Forgot password" email link on `/auth`, which is unusable for someone already signed in who simply wants to update their credentials.

## Solution

Add a **Change Password** section inside the existing Profile tab on the Dashboard (`src/components/dashboard/ProfileSettings.tsx`), plus a "Send password reset email" fallback for users who can't remember their current password.

### What to build

A new `ChangePasswordCard` component rendered at the bottom of `ProfileSettings.tsx`, containing:

1. **Inline password change form** (primary path)
   - Current password field
   - New password field (with existing `PasswordStrengthIndicator`)
   - Confirm new password field
   - Submit button → re-authenticates by calling `supabase.auth.signInWithPassword({ email: user.email, password: currentPassword })` to verify the current password, then `supabase.auth.updateUser({ password: newPassword })`
   - Validates with existing `validatePassword()` from `src/lib/passwordValidation.ts`
   - Shows success/error via existing `toast` (sonner)

2. **"Forgot current password?" fallback**
   - Small link/button below the form
   - Calls `supabase.auth.resetPasswordForEmail(user.email, { redirectTo: ${origin}/reset-password })`
   - Reuses the existing `/reset-password` page already in `src/pages/ResetPassword.tsx`
   - Toast confirms the reset email was sent

### Technical notes

- File touched: `src/components/dashboard/ProfileSettings.tsx` (add new section) — or new `src/components/dashboard/ChangePasswordCard.tsx` imported into it. Prefer the latter for cleanliness.
- Reuses: `Input`, `Label`, `Button`, `Card`, `PasswordStrengthIndicator`, `validatePassword`, `useAuth`, `supabase` client, `toast`.
- No DB / RLS / edge function changes required — Supabase Auth handles password updates server-side.
- Styling matches existing Profile tab cards (glassmorphism / brand colours per project standards).
- British English copy ("Change password", "Current password", "New password", "Confirm new password", "Password updated successfully.").

### Out of scope

- No changes to `/auth` or `/reset-password` pages.
- No new routes.
- No email template changes (existing reset email flow already works).
