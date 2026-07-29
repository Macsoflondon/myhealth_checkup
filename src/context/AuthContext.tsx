import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  /** True when the user has a verified TOTP factor and their session is only aal1. */
  mfaStepUpRequired: boolean;
  /** Re-check the current AAL / MFA state after a step-up. */
  refreshMfaState: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaStepUpRequired, setMfaStepUpRequired] = useState(false);

  const evaluateMfa = useCallback(async (activeSession: Session | null) => {
    if (!activeSession?.user) {
      setMfaStepUpRequired(false);
      return;
    }
    try {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const stepUp =
        aal?.currentLevel === "aal1" && aal?.nextLevel === "aal2";
      setMfaStepUpRequired(!!stepUp);
    } catch {
      setMfaStepUpRequired(false);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setIsLoading(false);
        // Defer to avoid recursive calls inside the listener.
        setTimeout(() => { evaluateMfa(s); }, 0);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      evaluateMfa(session);
    });

    return () => subscription.unsubscribe();
  }, [evaluateMfa]);

  const refreshMfaState = useCallback(async () => {
    await evaluateMfa(session);
  }, [evaluateMfa, session]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, mfaStepUpRequired, refreshMfaState, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
