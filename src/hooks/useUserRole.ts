import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'admin' | 'moderator' | 'user' | null;

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setRole(data?.role as UserRole || 'user');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user'); // Default to user role if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, isLoading, isAdmin: role === 'admin', isModerator: role === 'moderator' };
}
