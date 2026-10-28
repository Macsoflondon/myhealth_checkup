import { supabase } from "@/integrations/supabase/client";

export const isVerifiedDiagnosticsAdmin = (
  value: unknown,
  userId: string,
): boolean => {
  if (!value || typeof value !== "object") return false;
  return (
    "userId" in value &&
    value.userId === userId &&
    "isAdmin" in value &&
    value.isAdmin === true &&
    "hasMFA" in value &&
    value.hasMFA === true &&
    "mfaVerified" in value &&
    value.mfaVerified === true
  );
};

/** Fail closed: use the existing server-verified admin + MFA endpoint, never local role claims. */
export const verifyErrorDiagnosticsAccess = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return false;
    const { data, error } =
      await supabase.functions.invoke<unknown>("verify-admin-mfa");
    return !error && isVerifiedDiagnosticsAdmin(data, user.id);
  } catch {
    return false;
  }
};

export const subscribeToDiagnosticsAuthChanges = (onChange: () => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(onChange);
  return () => subscription.unsubscribe();
};
