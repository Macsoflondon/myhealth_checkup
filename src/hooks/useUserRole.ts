import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { logger } from "@/lib/logger";

export type UserRole = 'admin' | 'moderator' | 'user';

/**
 * SECURITY WARNING: Client-side role checking for UI display only
 * 
 * This hook fetches user roles from the database for UI rendering purposes.
 * NEVER use this hook alone for authorization of sensitive operations.
 * 
 * For server-side operations (edge functions, RLS policies):
 * - Always validate roles using the has_role() database function
 * - Never trust client-side role checks for authorization
 * - Implement proper server-side validation in edge functions
 * 
 * Example: In an edge function for admin operations:
 * ```
 * const { data: isAdmin } = await supabase.rpc('has_role', {
 *   _user_id: user.id,
 *   _role: 'admin'
 * });
 * if (!isAdmin) throw new Error('Unauthorized');
 * ```
 */

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setIsLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;
        
        setRoles(data?.map(r => r.role as UserRole) || ['user']);
      } catch (error) {
        logger.error('Error fetching user roles:', error);
        setRoles(['user']); // Default to user role
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator');

  return {
    roles,
    hasRole,
    isAdmin,
    isModerator,
    isLoading
  };
}
