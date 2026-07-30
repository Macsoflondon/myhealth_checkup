import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Verify a user's current password WITHOUT touching the active session.
 *
 * Calling `signInWithPassword` on the shared client replaces the session —
 * for accounts with TOTP enabled that downgrades an aal2 session to aal1,
 * which trips the global MFA step-up guard and unmounts the page mid-flow.
 *
 * Instead we sign in on a throwaway client with no storage/persistence, so
 * the resulting session is discarded and the user's real session (and its
 * assurance level) is left intact.
 */
export async function verifyCurrentPassword(email: string, password: string): Promise<boolean> {
  const { supabaseUrl, supabaseKey } = supabase as unknown as {
    supabaseUrl: string;
    supabaseKey: string;
  };

  const verifier = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await verifier.auth.signInWithPassword({ email, password });
  if (error || !data.session) return false;

  // Best-effort clean-up of the throwaway session only ("local" scope never
  // revokes the user's other sessions).
  try {
    await verifier.auth.signOut({ scope: "local" });
  } catch {
    // Ignore — the transient session simply expires.
  }
  return true;
}
