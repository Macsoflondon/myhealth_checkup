# Encryption Status Admin Page

## What you'll get

A new one-click admin page at **`/admin/encryption-status`** that, on load, tells you exactly:

1. **What encrypted PII exists** in the database right now (per column, per table).
2. **Which encryption secret** the edge function is currently using (`ENCRYPTION_KEY` vs legacy `VITE_ENCRYPTION_KEY`).
3. **Whether a key rotation is safe** — i.e. whether you'd lose data by changing keys.
4. A **live decryption test** — pick a sample encrypted row and confirm the current key still decrypts it.

Gated behind `AdminRoute` (server-verified `has_role('admin')`), same pattern as your other admin pages.

---

## Pre-confirmed findings (from my investigation)

I already ran the audit queries against your live database while planning. Current state:

| Table.Column | Total rows | Encrypted (`enc:`) | Plaintext | Empty/null |
|---|---|---|---|---|
| `user_profiles` total | **2** | — | — | — |
| `user_profiles.phone_number` | 2 | **0** | 0 | 2 |
| `user_profiles.address_line1` | 2 | **0** | 0 | 2 |
| `user_profiles.address_line2` | 2 | **0** | 0 | 2 |
| `user_profiles.postal_code` | 2 | **0** | 0 | 2 |
| `user_profiles.emergency_contact_name` | 2 | **0** | 0 | 2 |
| `user_profiles.emergency_contact_phone` | 2 | **0** | 0 | 2 |
| `user_profiles.date_of_birth` | 2 | n/a (date column, can't store `enc:`) | — | 2 |

**Bottom line: there is zero encrypted PII in your database today.** You can safely rotate the encryption key to a freshly generated random value with no data loss. The page will display this verdict prominently.

Secrets currently configured (from `fetch_secrets`):
- ✅ `VITE_ENCRYPTION_KEY` — legacy, leaks to client bundle if ever read by Vite
- ❌ `ENCRYPTION_KEY` — **not yet set** (this is the one the edge function now reads after the recent refactor)

⚠️ **Important consequence**: until you add `ENCRYPTION_KEY`, the `encrypt-sensitive-data` edge function will throw on every call because it no longer falls back to the `VITE_` variant. The status page will surface this as a hard error.

---

## Implementation

### 1. New edge function: `supabase/functions/encryption-status/index.ts`

Read-only diagnostic endpoint. Uses service role internally; verifies caller is admin via `has_role` RPC before returning anything.

Returns JSON:
```ts
{
  secrets: {
    encryption_key_present: boolean,      // ENCRYPTION_KEY
    legacy_vite_key_present: boolean,     // VITE_ENCRYPTION_KEY
    keys_match: boolean | null,           // SHA-256 fingerprint comparison (never returns the key itself)
    active_key_fingerprint: string | null // first 8 hex chars of SHA-256, for visual diff only
  },
  pii_audit: Array<{
    table: string,
    column: string,
    total_rows: number,
    encrypted_rows: number,
    plaintext_rows: number,
    null_rows: number
  }>,
  decryption_probe: {
    attempted: boolean,
    sample_table: string | null,
    sample_column: string | null,
    success: boolean,
    error: string | null   // generic — never echoes ciphertext
  },
  rotation_safety: 'safe' | 'data_at_risk' | 'edge_function_broken',
  generated_at: string
}
```

Audited columns (matches the function's `SENSITIVE_USER_PROFILE_FIELDS`):
- `user_profiles`: `phone_number`, `address_line1`, `address_line2`, `postal_code`, `emergency_contact_name`, `emergency_contact_phone`

(`nhs_number`, `health_conditions`, `allergies`, `medications` are listed in the encryption function's sensitive-fields array but **don't exist as columns** — the page will note this as informational, not an error.)

The decryption probe picks the first row where any sensitive column starts with `enc:`, attempts decryption, and reports success/failure. Skipped (with clear messaging) if no encrypted rows exist.

**Safety**: function never returns plaintext PII, never returns ciphertext, never returns the key. Only counts and a SHA-256 fingerprint prefix.

### 2. New admin page: `src/pages/AdminEncryptionStatusPage.tsx`

- Uses existing layout / glassmorphism (navy + pearl) per visual identity standard.
- Sections:
  - **Secret status card** — green/amber/red badges for `ENCRYPTION_KEY`, `VITE_ENCRYPTION_KEY` (legacy warning), key fingerprint, match indicator.
  - **PII audit table** — one row per audited column with encrypted/plaintext/null counts.
  - **Decryption probe result** — pass/fail with explanation.
  - **Rotation verdict banner** — `Safe to rotate` / `Data at risk` / `Edge function broken` with a one-paragraph explanation of why.
  - **Refresh** button (re-invokes the edge function).
- All numbers and verdicts come from the edge function, not from client-side queries.

### 3. Route registration: `src/routes/index.tsx`

Add lazy import + `wrapAdmin(AdminEncryptionStatusPage)` route at `/admin/encryption-status`.

### 4. Admin nav entry (optional)

If you have an admin index/menu, add a link. If not, you'll just visit the URL directly (matches how your other `/admin/*` pages work).

---

## Out of scope (deliberate)

- No key rotation logic — this page only **diagnoses**. Rotation remains a manual secret swap so you stay in control.
- No bulk re-encryption tool — pointless until there's actual encrypted data.
- No edits to `user_profiles` schema or RLS.
- No changes to the existing `encrypt-sensitive-data` function.

## Files touched

- `supabase/functions/encryption-status/index.ts` *(new)*
- `src/pages/AdminEncryptionStatusPage.tsx` *(new)*
- `src/routes/index.tsx` *(add lazy route, ~3 lines)*

Approve and I'll build it.