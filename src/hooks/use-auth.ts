import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type RoleState = { session: Session | null; user: User | null; isAdmin: boolean; loading: boolean };

export function useAuth(): RoleState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => {
          supabase.from("user_roles").select("role").eq("user_id", s.user.id).then(({ data }) => {
            setIsAdmin(!!data?.some((r) => r.role === "admin"));
          });
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).then(({ data: roles }) => {
          setIsAdmin(!!roles?.some((r) => r.role === "admin"));
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, isAdmin, loading };
}
