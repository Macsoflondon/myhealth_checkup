import { supabase } from "@/integrations/supabase/client";

/**
 * MFA helpers for the consumer app.
 *
 * We use Supabase's built-in TOTP MFA plus our own single-use backup codes
 * (stored hashed in `mfa_backup_codes`). Backup codes are a recovery path
 * only — they are verified server-side via the `mfa-recovery` edge function,
 * which unenrols the user's TOTP factor so they can sign in again and
 * re-enrol from a new device.
 */

export type AalStatus = {
  currentLevel: "aal1" | "aal2" | null;
  nextLevel: "aal1" | "aal2" | null;
  /** true when the user has a verified TOTP factor but the session is only aal1 */
  stepUpRequired: boolean;
  /** id of the verified TOTP factor, if any */
  verifiedFactorId: string | null;
};

export async function getAalStatus(): Promise<AalStatus> {
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  const verified = factorsData?.totp?.find((f) => f.status === "verified") ?? null;
  return {
    currentLevel: (aal?.currentLevel as AalStatus["currentLevel"]) ?? null,
    nextLevel: (aal?.nextLevel as AalStatus["nextLevel"]) ?? null,
    stepUpRequired:
      !!verified && aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2",
    verifiedFactorId: verified?.id ?? null,
  };
}

/**
 * Verify a 6-digit TOTP code against the user's verified factor.
 * Returns null on success, a user-friendly error message on failure.
 */
export async function verifyTotp(factorId: string, code: string): Promise<string | null> {
  const trimmed = code.replace(/\D/g, "").slice(0, 6);
  if (trimmed.length !== 6) return "Enter the 6-digit code from your authenticator app.";

  const challenge = await supabase.auth.mfa.challenge({ factorId });
  if (challenge.error || !challenge.data) {
    return "We couldn't reach the authentication service. Please try again in a moment.";
  }
  const verify = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.data.id,
    code: trimmed,
  });
  if (verify.error) {
    return "That code didn't match. Please open your authenticator app and try the newest code.";
  }
  if (verify.data?.access_token && verify.data?.refresh_token) {
    await supabase.auth.setSession({
      access_token: verify.data.access_token,
      refresh_token: verify.data.refresh_token,
    });
  }
  return null;
}

/** Generate a new set of plaintext backup codes (10 × 10-char groups). */
export function generateBackupCodes(count = 10): string[] {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  const buf = new Uint8Array(count * 10);
  crypto.getRandomValues(buf);
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    let s = "";
    for (let j = 0; j < 10; j++) s += alphabet[buf[i * 10 + j] % alphabet.length];
    codes.push(`${s.slice(0, 5)}-${s.slice(5)}`);
  }
  return codes;
}

/** SHA-256 hash of a normalised backup code. */
export async function hashBackupCode(code: string): Promise<string> {
  const normalised = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  const bytes = new TextEncoder().encode(normalised);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Replace the user's backup codes with a freshly generated set. */
export async function replaceBackupCodes(userId: string): Promise<string[]> {
  const plaintext = generateBackupCodes(10);
  const hashes = await Promise.all(plaintext.map(hashBackupCode));

  const { error: delErr } = await supabase
    .from("mfa_backup_codes")
    .delete()
    .eq("user_id", userId);
  if (delErr) throw new Error(delErr.message);

  const rows = hashes.map((code_hash) => ({ user_id: userId, code_hash }));
  const { error: insErr } = await supabase.from("mfa_backup_codes").insert(rows);
  if (insErr) throw new Error(insErr.message);

  return plaintext;
}

/**
 * Attempt to redeem a backup code. Calls the `mfa-recovery` edge function,
 * which verifies the hashed code, marks it used, and unenrols the TOTP
 * factor server-side. On success the caller should refresh their session.
 */
export async function redeemBackupCode(
  code: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, message: "Enter one of your backup codes." };

  const { data, error } = await supabase.functions.invoke("mfa-recovery", {
    body: { code: trimmed },
  });
  if (error) {
    return {
      ok: false,
      message:
        "That backup code was not accepted. Check it was entered exactly as saved, or try another.",
    };
  }
  if (!data?.ok) {
    return { ok: false, message: data?.message ?? "That backup code could not be used." };
  }
  // Force a fresh session so the client picks up the lowered AAL requirement.
  await supabase.auth.refreshSession();
  return { ok: true };
}
